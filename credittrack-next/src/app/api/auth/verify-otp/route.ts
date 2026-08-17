import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, token } = body;

    if (!email || !token) {
      return NextResponse.json({ error: 'Email et code OTP requis' }, { status: 400 });
    }

    const cleanToken = token.toString().replace(/[^0-9]/g, '');
    if (cleanToken.length < 6) {
      return NextResponse.json({ error: 'Le code OTP doit comporter 6 chiffres' }, { status: 400 });
    }

    // Vérification côté serveur par Supabase
    let verifyRes = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: cleanToken,
      type: 'signup'
    });

    if (verifyRes.error) {
      verifyRes = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: cleanToken,
        type: 'email'
      });
    }

    if (verifyRes.error) {
      return NextResponse.json({ error: 'Code incorrect ou expiré. Veuillez vérifier votre boîte mail.' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Adresse e-mail vérifiée avec succès !',
      user: {
        id: verifyRes.data.user?.id,
        email: verifyRes.data.user?.email
      }
    });

  } catch (err: any) {
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
