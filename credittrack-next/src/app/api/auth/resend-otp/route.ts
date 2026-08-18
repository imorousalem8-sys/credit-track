import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isValidEmailStrict, filterAllowedFields } from '@/lib/security/validation';
import { checkRateLimit, RateLimitProfiles, getClientIp } from '@/lib/security/rateLimit';
import { logSecurityEvent } from '@/lib/security/logger';

interface ResendPayload {
  email: string;
}

export async function POST(request: Request) {
  const ip = getClientIp(request);

  // 1. Rate Limiting Strict sur le renvoi (1 renvoi toutes les 60 secondes)
  const rateCheck = checkRateLimit(ip, RateLimitProfiles.OTP_RESEND);
  if (!rateCheck.success) {
    logSecurityEvent({
      eventType: 'RATE_LIMIT_BLOCKED',
      ip,
      route: '/api/auth/resend-otp',
      details: { retryAfter: rateCheck.retryAfterSeconds }
    });
    return NextResponse.json(
      { error: `Veuillez patienter ${rateCheck.retryAfterSeconds} secondes avant de demander un nouveau code.` },
      { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) } }
    );
  }

  try {
    const rawBody = await request.json();
    const body = filterAllowedFields<ResendPayload>(rawBody, ['email']);
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Adresse e-mail requise.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!isValidEmailStrict(cleanEmail)) {
      return NextResponse.json({ error: 'Adresse e-mail invalide.' }, { status: 400 });
    }

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: cleanEmail
    });

    if (error) {
      await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: { shouldCreateUser: false }
      });
    }

    logSecurityEvent({
      eventType: 'AUTH_SUCCESS',
      ip,
      email: cleanEmail,
      route: '/api/auth/resend-otp',
      details: { action: 'Renvoi de code OTP effectué' }
    });

    return NextResponse.json({
      success: true,
      message: 'Un nouveau code de sécurité a été envoyé par e-mail.'
    });

  } catch (err: any) {
    logSecurityEvent({
      eventType: 'SECURITY_WARNING',
      ip,
      route: '/api/auth/resend-otp',
      details: { error: 'Erreur interne lors du renvoi OTP' }
    });
    return NextResponse.json({ error: 'Une erreur interne est survenue.' }, { status: 500 });
  }
}
