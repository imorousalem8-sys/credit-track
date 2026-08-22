"use client";

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, Lock, KeyRound, Store, UserCheck, Delete } from 'lucide-react';

export default function ModalCashierPin() {
  const { 
    isCashierPinModalOpen, 
    setIsCashierPinModalOpen, 
    cashiers, 
    loginCashierByPin 
  } = useApp();

  const [pin, setPin] = useState('');
  const [selectedCashierId, setSelectedCashierId] = useState('');

  if (!isCashierPinModalOpen) return null;

  const handleDigit = (digit: string) => {
    if (pin.length < 6) {
      const next = pin + digit;
      setPin(next);
      if (next.length === 4) {
        // Auto attempt login on 4 digits
        setTimeout(() => {
          loginCashierByPin(next);
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
    const ok = loginCashierByPin(pin);
    if (!ok) {
      setPin('');
    }
  };

  return (
    <div className="modal-overlay active" style={{ display: 'flex' }}>
      <div className="modal-card" style={{ maxWidth: '440px', padding: '24px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Accès Mode Caissier</h3>
              <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>Entrez votre code PIN secret</p>
            </div>
          </div>
          
          <button 
            type="button" 
            onClick={() => setIsCashierPinModalOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick select cashier card */}
        {cashiers.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginBottom: '6px' }}>
              Sélectionnez votre profil caisse :
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {cashiers.map(c => (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelectedCashierId(c.id);
                    setPin('');
                  }}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    background: selectedCashierId === c.id ? '#EFF6FF' : '#F8FAFC',
                    border: selectedCashierId === c.id ? '1.5px solid #3B82F6' : '1px solid #E2E8F0',
                    cursor: 'pointer'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.84rem', color: '#0F172A' }}>{c.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{c.storeName}</div>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#2563EB', fontWeight: 700 }}>
                    {selectedCashierId === c.id ? '✓ Sélectionné' : 'Choisir'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* PIN Display */}
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
              Code PIN à 4 chiffres :
            </label>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '12px',
              margin: '8px 0'
            }}>
              {[0, 1, 2, 3].map((idx) => {
                const filled = pin.length > idx;
                return (
                  <div
                    key={idx}
                    style={{
                      width: '42px',
                      height: '48px',
                      borderRadius: '10px',
                      background: filled ? '#0F172A' : '#F1F5F9',
                      border: filled ? '2px solid #2563EB' : '1px solid #CBD5E1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.4rem',
                      fontWeight: 800,
                      color: '#FFFFFF'
                    }}
                  >
                    {filled ? '●' : ''}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Numeric Keypad */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            maxWidth: '260px',
            margin: '0 auto 16px auto'
          }}>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((k) => {
              const isClear = k === 'C';
              const isBack = k === '⌫';
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => {
                    if (isClear) handleClear();
                    else if (isBack) handleBackspace();
                    else handleDigit(k);
                  }}
                  style={{
                    height: '48px',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    background: isClear || isBack ? '#F1F5F9' : '#FFFFFF',
                    color: isClear ? '#EF4444' : isBack ? '#475569' : '#0F172A',
                    fontSize: isClear || isBack ? '0.9rem' : '1.25rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
                  }}
                >
                  {k}
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-outline"
              style={{ flex: 1 }}
              onClick={() => setIsCashierPinModalOpen(false)}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={pin.length < 4}
              className="btn btn-primary"
              style={{ flex: 1.4, background: '#2563EB', fontWeight: 800 }}
            >
              Valider PIN
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
