import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bnkwplwlfnhukevwdcen.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_hjz2yi3KHdNtSBlsgrCQnw_IssHIkvK';

export async function POST(request: Request) {
  try {
    const { email, origin } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Adresse e-mail invalide.' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const siteUrl = origin || 'https://credit-track.vercel.app';
    const redirectUrl = `${siteUrl}/auth/callback?type=recovery`;

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: redirectUrl
    });

    if (error) {
      console.error('Supabase resetPasswordForEmail error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Lien de réinitialisation sécurisé envoyé avec succès.'
    });
  } catch (err: any) {
    console.error('API forgot-password error:', err);
    return NextResponse.json({ error: err.message || 'Erreur serveur.' }, { status: 500 });
  }
}
