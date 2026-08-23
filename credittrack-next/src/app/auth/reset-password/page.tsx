"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ShieldCheck, Lock, Check, Eye, EyeOff, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [hasSession, setHasSession] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    // Vérifier si une session de récupération existe (via hash token ou session active)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setHasSession(true);
      }
      setCheckingSession(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || (session && event === 'SIGNED_IN')) {
        setHasSession(true);
        setCheckingSession(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (newPassword.length < 8) {
      setErrorMsg("Le mot de passe doit comporter au moins 8 caractères.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw error;
      }

      setSuccess(true);
    } catch (err: any) {
      console.error("Erreur mise à jour mot de passe:", err);
      setErrorMsg(err.message || "Impossible de mettre à jour le mot de passe. Le lien a peut-être expiré.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '460px',
        width: '100%',
        background: '#FFFFFF',
        borderRadius: '24px',
        padding: '36px 32px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            boxShadow: '0 8px 20px rgba(37,99,235,0.35)'
          }}>
            <ShieldCheck size={28} />
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0F172A', margin: '0 0 6px' }}>
            Nouveau Mot de Passe
          </h2>
          <p style={{ fontSize: '0.86rem', color: '#64748B', margin: 0 }}>
            Sécurisez l&apos;accès à votre espace CréditTrack Pro
          </p>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: '#ECFDF5',
              color: '#10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <Check size={32} strokeWidth={3} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#065F46', margin: '0 0 8px' }}>
              Mot de passe mis à jour !
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5, marginBottom: '24px' }}>
              Votre nouveau mot de passe est actif. Vous pouvez maintenant vous connecter à votre compte.
            </p>
            <Link
              href="/dashboard"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                color: '#FFFFFF',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '0.95rem',
                textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(37,99,235,0.35)'
              }}
            >
              <span>Accéder à mon Espace</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {errorMsg && (
              <div style={{
                background: '#FEF2F2',
                border: '1.5px solid #FECACA',
                color: '#DC2626',
                padding: '10px 14px',
                borderRadius: '12px',
                fontSize: '0.82rem',
                fontWeight: 700
              }}>
                {errorMsg}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: '6px' }}>
                Nouveau mot de passe *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    height: '46px',
                    padding: '0 44px 0 14px',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '4px', display: 'block' }}>
                Minimum 8 caractères.
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: '6px' }}>
                Confirmer le mot de passe *
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  height: '46px',
                  padding: '0 14px',
                  borderRadius: '12px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '8px',
                width: '100%',
                padding: '14px',
                background: loading ? '#94A3B8' : 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 900,
                fontSize: '0.95rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(37,99,235,0.35)',
                transition: 'all 0.2s ease'
              }}
            >
              <Check size={18} />
              <span>{loading ? 'Mise à jour en cours...' : 'Enregistrer mon Nouveau Mot de Passe'}</span>
            </button>

            <div style={{ textAlign: 'center', marginTop: '8px' }}>
              <Link href="/" style={{ fontSize: '0.8rem', color: '#64748B', textDecoration: 'none', fontWeight: 700 }}>
                ← Revenir à l&apos;accueil
              </Link>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
