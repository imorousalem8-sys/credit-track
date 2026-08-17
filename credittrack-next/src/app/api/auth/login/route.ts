import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'E-mail et mot de passe requis' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password
    });

    if (error) {
      if (error.message && (error.message.includes('Email not confirmed') || error.message.includes('not confirmed'))) {
        return NextResponse.json({
          error: 'Votre adresse e-mail n\'a pas encore été vérifiée',
          code: 'EMAIL_NOT_CONFIRMED'
        }, { status: 403 });
      }
      return NextResponse.json({ error: 'Adresse e-mail ou mot de passe incorrect' }, { status: 401 });
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
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
