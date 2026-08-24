import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { validatePasswordStrength, isValidEmailStrict, filterAllowedFields, escapeXSS, sanitizePhone } from '@/lib/security/validation';
import { checkRateLimit, RateLimitProfiles, getClientIp } from '@/lib/security/rateLimit';
import { logSecurityEvent } from '@/lib/security/logger';

interface RegisterPayload {
  email: string;
  password: string;
  passwordConfirm: string;
  businessName?: string;
  phone?: string;
}

export async function POST(request: Request) {
  const ip = getClientIp(request);

  // 1. Rate Limiting Côté Serveur (3 inscriptions par tranche de 10 minutes par IP)
  const rateCheck = checkRateLimit(ip, RateLimitProfiles.REGISTER);
  if (!rateCheck.success) {
    logSecurityEvent({
      eventType: 'RATE_LIMIT_BLOCKED',
      ip,
      route: '/api/auth/register',
      details: { retryAfter: rateCheck.retryAfterSeconds }
    });
    return NextResponse.json(
      { error: `Trop de tentatives d'inscription. Veuillez patienter ${rateCheck.retryAfterSeconds} secondes.` },
      { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) } }
    );
  }

  try {
    const rawBody = await request.json();

    // 2. Protection Mass Assignment : Whitelist stricte des champs autorisés
    const body = filterAllowedFields<RegisterPayload>(rawBody, ['email', 'password', 'passwordConfirm', 'businessName', 'phone']);
    const { email, password, passwordConfirm, businessName, phone } = body;

    // 3. Validation de champ vide pour l'e-mail
    if (!email || typeof email !== 'string' || !email.trim()) {
      return NextResponse.json({ error: 'Veuillez entrer votre adresse e-mail.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 4. Validation réelle et stricte du format e-mail (RFC 5322)
    if (!isValidEmailStrict(cleanEmail)) {
      return NextResponse.json({ error: 'Veuillez entrer une adresse e-mail valide.' }, { status: 400 });
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Le mot de passe est obligatoire.' }, { status: 400 });
    }

    // 5. Politique de mot de passe robuste (Minimum 12 car., Maj, Min, Chiffre, Caractère Spécial)
    const passValidation = validatePasswordStrength(password);
    if (!passValidation.valid) {
      return NextResponse.json({ error: passValidation.error }, { status: 400 });
    }

    if (password !== passwordConfirm) {
      return NextResponse.json({ error: 'Les mots de passe ne correspondent pas.' }, { status: 400 });
    }

    // 6. Assainissement des données textuelles (XSS / Téléphone)
    const safeBusinessName = escapeXSS((businessName || 'Mon Commerce').trim().substring(0, 100));
    const safePhone = sanitizePhone(phone || '').substring(0, 20);

    // 7. Appel sécurisé au service d'authentification Supabase
    const hostHeader = request.headers.get('x-forwarded-host') || request.headers.get('host');
    const protoHeader = request.headers.get('x-forwarded-proto') || 'https';
    const computedOrigin = hostHeader ? `${protoHeader}://${hostHeader}` : null;
    const siteUrl = computedOrigin || process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://credit-track00.vercel.app';
    const redirectUrl = `${siteUrl}/auth/callback?type=signup`;

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          business_name: safeBusinessName,
          phone: safePhone,
          plan_tier: 'trial_3_months'
        }
      }
    });

    if (error) {
      logSecurityEvent({
        eventType: 'AUTH_FAILED',
        ip,
        email: cleanEmail,
        route: '/api/auth/register',
        details: { message: error.message }
      });

      if (error.code === 'over_email_send_rate_limit') {
        return NextResponse.json({
          success: true,
          emailVerificationRequired: true,
          message: 'Un code de sécurité vous a déjà été envoyé récemment. Veuillez saisir le code reçu.'
        });
      }

      if (error.code === 'email_address_invalid' || (error.message && error.message.includes('invalid'))) {
        return NextResponse.json({ error: 'Cette adresse e-mail est invalide ou introuvable.' }, { status: 400 });
      }

      if (error.message && (error.message.includes('already registered') || error.message.includes('already exists') || error.status === 422)) {
        return NextResponse.json({
          success: true,
          emailVerificationRequired: true,
          message: 'Inscription en attente. Veuillez saisir votre code de confirmation reçu par e-mail.'
        });
      }
      return NextResponse.json({ error: error.message || 'Impossible de créer le compte pour le moment.' }, { status: 400 });
    }

    logSecurityEvent({
      eventType: 'REGISTRATION',
      ip,
      email: cleanEmail,
      userId: data.user?.id,
      route: '/api/auth/register'
    });

    // 8. Réponse sécurisée sans exposer de secrets ou de tokens
    return NextResponse.json({
      success: true,
      emailVerificationRequired: true,
      message: 'Un code de sécurité à 6 chiffres a été envoyé à votre adresse e-mail.'
    });

  } catch (err: any) {
    logSecurityEvent({
      eventType: 'SECURITY_WARNING',
      ip,
      route: '/api/auth/register',
      details: { error: 'Payload invalide ou erreur interne' }
    });
    return NextResponse.json({ error: 'Une erreur interne est survenue.' }, { status: 500 });
  }
}
