import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, passwordConfirm, businessName, phone } = body;

    // 1. Validation de format
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Adresse e-mail invalide' }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'Le mot de passe doit comporter au moins 6 caractères' }, { status: 400 });
    }

    if (password !== passwordConfirm) {
      return NextResponse.json({ error: 'Les mots de passe ne correspondent pas' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 2. Appel serveur Supabase Auth pour créer l'utilisateur et déclencher l'envoi d'e-mail avec code OTP
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
        return NextResponse.json({ error: 'Un compte existe déjà avec cette adresse e-mail', code: 'USER_EXISTS' }, { status: 409 });
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // 3. Réponse sécurisée : NE JAMAIS INCLURE LE CODE OTP
    return NextResponse.json({
      success: true,
      message: 'Un code de sécurité à 6 chiffres a été envoyé à votre adresse e-mail',
      email: cleanEmail
    });

  } catch (err: any) {
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
