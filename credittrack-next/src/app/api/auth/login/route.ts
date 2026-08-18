import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isValidEmailStrict, filterAllowedFields } from '@/lib/security/validation';
import { checkRateLimit, RateLimitProfiles, getClientIp } from '@/lib/security/rateLimit';
import { logSecurityEvent } from '@/lib/security/logger';

interface LoginPayload {
  email: string;
  password: string;
}

export async function POST(request: Request) {
  const ip = getClientIp(request);

  // 1. Rate Limiting Côté Serveur Anti-Brute Force (5 tentatives par minute par IP)
  const rateCheck = checkRateLimit(ip, RateLimitProfiles.LOGIN);
  if (!rateCheck.success) {
    logSecurityEvent({
      eventType: 'RATE_LIMIT_BLOCKED',
      ip,
      route: '/api/auth/login',
      details: { retryAfter: rateCheck.retryAfterSeconds }
    });
    return NextResponse.json(
      { error: `Trop de tentatives de connexion échouées. Veuillez patienter ${rateCheck.retryAfterSeconds} secondes.` },
      { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) } }
    );
  }

  try {
    const rawBody = await request.json();
    const body = filterAllowedFields<LoginPayload>(rawBody, ['email', 'password']);
    const { email, password } = body;

    // 2. Validation champ vide
    if (!email || typeof email !== 'string' || !email.trim()) {
      return NextResponse.json({ error: 'Veuillez entrer votre adresse e-mail.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 3. Validation format e-mail
    if (!isValidEmailStrict(cleanEmail)) {
      return NextResponse.json({ error: 'Veuillez entrer une adresse e-mail valide.' }, { status: 400 });
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Veuillez entrer votre mot de passe.' }, { status: 400 });
    }

    // 4. Authentification serveur avec Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password
    });

    if (error) {
      logSecurityEvent({
        eventType: 'AUTH_FAILED',
        ip,
        email: cleanEmail,
        route: '/api/auth/login',
        details: { reason: error.message }
      });

      // Gestion spécifique email non vérifié
      if (error.message && (error.message.includes('Email not confirmed') || error.message.includes('not confirmed'))) {
        return NextResponse.json({
          error: 'Votre adresse e-mail n\'a pas encore été vérifiée. Un code de confirmation est requis.',
          code: 'EMAIL_NOT_CONFIRMED'
        }, { status: 403 });
      }

      // Message générique anti-énumération (ne révèle pas si l'email existe ou non)
      return NextResponse.json({ error: 'Adresse e-mail ou mot de passe incorrect.' }, { status: 401 });
    }

    logSecurityEvent({
      eventType: 'AUTH_SUCCESS',
      ip,
      email: cleanEmail,
      userId: data.user?.id,
      route: '/api/auth/login'
    });

    return NextResponse.json({
      success: true,
      message: 'Connexion réussie',
      user: {
        id: data.user?.id,
        email: data.user?.email,
        businessName: data.user?.user_metadata?.business_name || 'Mon Commerce'
      }
    });

  } catch (err: any) {
    logSecurityEvent({
      eventType: 'SECURITY_WARNING',
      ip,
      route: '/api/auth/login',
      details: { error: 'Erreur interne de traitement' }
    });
    return NextResponse.json({ error: 'Une erreur interne est survenue.' }, { status: 500 });
  }
}
