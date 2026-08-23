"use client";

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, Lock, ShieldCheck, KeyRound, ArrowRight } from 'lucide-react';

export default function ModalOwnerUnlock() {
  const { 
    isOwnerUnlockModalOpen, 
    setIsOwnerUnlockModalOpen, 
    unlockOwnerMode 
  } = useApp();

  const [pin, setPin] = useState('');

  if (!isOwnerUnlockModalOpen) return null;

  const handleDigit = (digit: string) => {
    if (pin.length < 6) {
      const next = pin + digit;
      setPin(next);
      if (next.length === 4) {
        setTimeout(() => {
          const ok = unlockOwnerMode(next);
          if (!ok) setPin('');
        }, 150);
      }
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const handleClear = () => {
    setPin('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) return;
    const ok = unlockOwnerMode(pin);
    if (!ok) setPin('');
  };

  return (
    <div className="modal-overlay active" style={{ display: 'flex', zIndex: 100000 }}>
      <div className="modal-card" style={{ maxWidth: '420px', padding: '24px', borderRadius: '20px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#FEF3C7', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Sécurité Patron / Administrateur</h3>
              <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>Entrez le Code PIN Patron pour déverrouiller</p>
            </div>
          </div>
          
          <button 
            type="button" 
            onClick={() => setIsOwnerUnlockModalOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* PIN Display */}
          <div style={{ textAlign: 'center', marginBottom: '18px' }}>
            <div style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '8px' }}>
              Cette zone est protégée pour empêcher les employés d&apos;accéder aux finances :
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '12px',
              margin: '12px 0'
            }}>
              {[0, 1, 2, 3].map((idx) => {
                const filled = pin.length > idx;
                return (
                  <div
                    key={idx}
                    style={{
                      width: '44px',
                      height: '52px',
                      borderRadius: '12px',
                      background: filled ? '#0F172A' : '#F8FAFC',
                      border: filled ? '2px solid #2563EB' : '1.5px solid #CBD5E1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      fontWeight: 900,
                      color: '#FFFFFF',
                      boxShadow: filled ? '0 4px 12px rgba(37,99,235,0.25)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {filled ? '●' : ''}
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
              Code PIN Patron par défaut : <strong style={{ color: '#0F172A' }}>0000</strong>
            </div>
          </div>

          {/* NumPad */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            marginBottom: '16px'
          }}>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleDigit(num)}
                style={{
                  height: '50px',
                  background: '#FFFFFF',
                  border: '1.5px solid #E2E8F0',
                  borderRadius: '12px',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: '#0F172A',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  transition: 'all 0.1s ease'
                }}
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClear}
              style={{
                height: '50px',
                background: '#F1F5F9',
                border: '1.5px solid #E2E8F0',
                borderRadius: '12px',
                fontSize: '0.78rem',
                fontWeight: 800,
                color: '#64748B',
                cursor: 'pointer'
              }}
            >
              Effacer
            </button>
            <button
              type="button"
              onClick={() => handleDigit('0')}
              style={{
                height: '50px',
                background: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                borderRadius: '12px',
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#0F172A',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              style={{
                height: '50px',
                background: '#F1F5F9',
                border: '1.5px solid #E2E8F0',
                borderRadius: '12px',
                fontSize: '0.78rem',
                fontWeight: 800,
                color: '#64748B',
                cursor: 'pointer'
              }}
            >
              ⌫
            </button>
          </div>

          <button
            type="submit"
            disabled={pin.length < 4}
            style={{
              width: '100%',
              padding: '12px',
              background: pin.length >= 4 ? '#2563EB' : '#94A3B8',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: pin.length >= 4 ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: pin.length >= 4 ? '0 4px 12px rgba(37,99,235,0.35)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <ShieldCheck size={18} />
            <span>Déverrouiller le Mode Patron</span>
          </button>
        </form>

      </div>
    </div>
  );
}
