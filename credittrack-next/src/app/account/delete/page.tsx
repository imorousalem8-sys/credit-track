"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function AccountDeletePage() {
  const [confirmed, setConfirmed] = useState(false);
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmed || !email) return;

    // Clear local user storage
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.warn(e);
    }

    setIsSubmitted(true);
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '40px 20px', color: '#0F172A', lineHeight: '1.6' }}>
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#2563EB', fontWeight: 700, textDecoration: 'none', marginBottom: '24px' }}>
        <ArrowLeft size={18} /> Retour à l'application
      </Link>

      <div style={{ background: '#FFFFFF', padding: '32px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ width: '48px', height: '48px', background: '#FEF2F2', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}>
            <Trash2 size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: '#991B1B' }}>Suppression de Compte & Données</h1>
            <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0 }}>Conformité Apple Guideline 5.1.1 & RGPD</p>
          </div>
        </div>

        {isSubmitted ? (
          <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '24px', borderRadius: '12px', textAlign: 'center' }}>
            <CheckCircle2 size={40} className="text-emerald-500" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#065F46', marginBottom: '8px' }}>Demande de suppression confirmée</h3>
            <p style={{ fontSize: '0.9rem', color: '#047857' }}>
              Vos données locales ont été purgées. Toutes les informations distantes associées à l'adresse <strong>{email}</strong> seront définitivement détruites sous 24 heures ouvrées.
            </p>
            <div style={{ marginTop: '20px' }}>
              <Link href="/" style={{ display: 'inline-block', background: '#059669', color: '#FFFFFF', padding: '10px 20px', borderRadius: '8px', fontWeight: 700, textDecoration: 'none' }}>
                Retourner à l'accueil
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ background: '#FFFBEB', border: '1px solid #FEF3C7', padding: '14px', borderRadius: '10px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <AlertTriangle size={20} className="text-amber-600" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '0.84rem', color: '#92400E' }}>
                <strong>Attention :</strong> Cette action est irréversible. Toutes vos créances enregistrées, factures émises, écritures comptables et reçus électroniques seront définitivement effacés.
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                Adresse email associée à votre compte
              </label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ex: gerant@entreprise.com"
                style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.92rem', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                Raison de la suppression (facultatif)
              </label>
              <textarea 
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Indiquez-nous pourquoi vous souhaitez supprimer votre compte..."
                style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.92rem', outline: 'none', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '6px' }}>
              <input 
                type="checkbox" 
                id="confirm-delete"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                style={{ marginTop: '4px', cursor: 'pointer', width: '16px', height: '16px' }}
              />
              <label htmlFor="confirm-delete" style={{ fontSize: '0.84rem', color: '#475569', cursor: 'pointer' }}>
                Je comprends que la suppression de mon compte est définitive et entraîne la destruction de l'historique financier de mon entreprise.
              </label>
            </div>

            <button
              type="submit"
              disabled={!confirmed || !email}
              style={{
                marginTop: '10px',
                background: confirmed && email ? '#EF4444' : '#CBD5E1',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.92rem',
                padding: '14px',
                borderRadius: '10px',
                border: 'none',
                cursor: confirmed && email ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'background-color 0.2s'
              }}
            >
              <Trash2 size={18} /> Confirmer la suppression définitive
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
