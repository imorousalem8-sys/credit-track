"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ShieldCheck, Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Vérification de votre lien sécurisé...");

  useEffect(() => {
    // Écoute de l'événement d'authentification Supabase
    const handleAuth = async () => {
      try {
        const hash = window.location.hash;
        const queryParams = new URLSearchParams(window.location.search);
        const type = queryParams.get('type');

        if (hash.includes('type=recovery') || type === 'recovery') {
          setStatus("Redirection vers la création de votre mot de passe...");
          router.replace('/auth/reset-password' + hash);
          return;
        }

        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (session) {
          router.replace('/dashboard');
        } else {
          // Attendre l'événement auth
          const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
              router.replace('/auth/reset-password');
            } else if (session) {
              router.replace('/dashboard');
            }
          });
          return () => listener.subscription.unsubscribe();
        }
      } catch (e: any) {
        console.error("Auth callback error:", e);
        setStatus("Redirection en cours...");
        router.replace('/auth/reset-password');
      }
    };

    handleAuth();
  }, [router]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      color: '#FFFFFF',
      textAlign: 'center'
    }}>
      <div style={{
        maxWidth: '400px',
        padding: '32px',
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(16px)',
        borderRadius: '24px',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: '#2563EB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px'
        }}>
          <ShieldCheck size={30} />
        </div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>
          CréditTrack PRO
        </h3>
        <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: '20px' }}>
          {status}
        </p>
        <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto', color: '#38BDF8' }} />
      </div>
    </div>
  );
}
