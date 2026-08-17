import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Adresse e-mail invalide' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

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

    return NextResponse.json({
      success: true,
      message: 'Un nouveau code de sécurité a été envoyé par e-mail'
    });

  } catch (err: any) {
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
