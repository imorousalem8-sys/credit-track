import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

function isValidEmailStrict(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (trimmed.length < 5 || trimmed.length > 254) return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(trimmed)) return false;
  const parts = trimmed.split('@');
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  if (!local || !domain) return false;
  const domainParts = domain.split('.');
  if (domainParts.length < 2) return false;
  const tld = domainParts[domainParts.length - 1];
  return Boolean(tld && tld.length >= 2 && /^[a-zA-Z]+$/.test(tld));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 1. Validation champ vide
    if (!email || !email.trim()) {
      return NextResponse.json({ error: 'Veuillez entrer votre adresse e-mail.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 2. Validation format e-mail
    if (!isValidEmailStrict(cleanEmail)) {
      return NextResponse.json({ error: 'Veuillez entrer une adresse e-mail valide.' }, { status: 400 });
    }

    if (!password) {
      return NextResponse.json({ error: 'Veuillez entrer votre mot de passe.' }, { status: 400 });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password
    });

    if (error) {
      if (error.message && (error.message.includes('Email not confirmed') || error.message.includes('not confirmed'))) {
        return NextResponse.json({
          error: 'Votre adresse e-mail n\'a pas encore été vérifiée.',
          code: 'EMAIL_NOT_CONFIRMED'
        }, { status: 403 });
      }
      // Réponse sécurisée générique contre l'énumération de comptes
      return NextResponse.json({ error: 'Adresse e-mail ou mot de passe incorrect.' }, { status: 401 });
    }

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
    return NextResponse.json({ error: 'Erreur interne du serveur.' }, { status: 500 });
  }
}
