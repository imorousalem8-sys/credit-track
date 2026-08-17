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
  if (!local || !domain || local.startsWith('.') || local.endsWith('.')) return false;
  
  const domainParts = domain.split('.');
  if (domainParts.length < 2) return false;
  const tld = domainParts[domainParts.length - 1];
  if (!tld || tld.length < 2 || !/^[a-zA-Z]+$/.test(tld)) return false;
  
  return true;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, passwordConfirm, businessName, phone } = body;

    // 1. Validation de champ vide
    if (!email || !email.trim()) {
      return NextResponse.json({ error: 'Veuillez entrer votre adresse e-mail.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 2. Validation stricte du format (ex: ioviegiu.com, abc, test@, test@gmail -> rejetés)
    if (!isValidEmailStrict(cleanEmail)) {
      return NextResponse.json({ error: 'Veuillez entrer une adresse e-mail valide.' }, { status: 400 });
    }

    // 3. Validation mot de passe
    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'Le mot de passe doit comporter au moins 6 caractères.' }, { status: 400 });
    }

    if (password !== passwordConfirm) {
      return NextResponse.json({ error: 'Les mots de passe ne correspondent pas.' }, { status: 400 });
    }

    // 4. Appel serveur Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          business_name: businessName || 'Mon Commerce',
          phone: phone || '',
          plan_tier: 'trial_3_months'
        }
      }
    });

    if (error) {
      if (error.message && (error.message.includes('already registered') || error.message.includes('already exists'))) {
        return NextResponse.json({ error: 'Un compte existe déjà avec cette adresse e-mail.', code: 'USER_EXISTS' }, { status: 409 });
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // 5. Réponse sécurisée sans OTP
    return NextResponse.json({
      success: true,
      message: 'Un code de sécurité à 6 chiffres a été envoyé à votre adresse e-mail.'
    });

  } catch (err: any) {
    return NextResponse.json({ error: 'Erreur interne du serveur.' }, { status: 500 });
  }
}
