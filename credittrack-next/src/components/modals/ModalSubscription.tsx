"use client";

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  X, 
  Crown, 
  Check, 
  Sparkles, 
  Smartphone, 
  CreditCard, 
  Key, 
  ShieldCheck, 
  Store, 
  Users, 
  ArrowRight,
  Zap
} from 'lucide-react';
import { formatAfricanCurrency } from '@/lib/africanCountries';

export default function ModalSubscription() {
  const { 
    isSubscriptionModalOpen, 
    setIsSubscriptionModalOpen, 
    currency, 
    upgradeToPro 
  } = useApp();

  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | 'enterprise'>('yearly');
  const [paymentMethod, setPaymentMethod] = useState<'wave' | 'orange' | 'mtn' | 'moov' | 'card' | 'vip'>('wave');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [vipCode, setVipCode] = useState('');

  const [processing, setProcessing] = useState(false);

  if (!isSubscriptionModalOpen) return null;

  // Plan pricing base (in XOF FCFA, converted to selected currency)
  const plans = {
    monthly: {
      id: 'monthly',
      name: 'PRO Mensuel',
      price: 5000,
      period: '/ mois',
      badge: 'Flexible',
      badgeColor: '#2563EB',
      features: [
        'Clients & Dettes illimités',
        'Grand tableau de facturation multi-produits',
        'Rappels WhatsApp & SMS en 1 clic',
        'Reçus & Factures avec signature',
        '1 Boutique / 1 Caisse'
      ]
    },
    yearly: {
      id: 'yearly',
      name: 'PRO Annuel',
      price: 45000,
      period: '/ an',
      badge: '3 Mois Gratuits (Recommandé)',
      badgeColor: '#F59E0B',
      isPopular: true,
      features: [
        'Tous les avantages PRO Mensuel',
        '3 Mois d\'abonnement offerts',
        'Livre de caisse & Bilan comptable SYSCOHADA',
        'Mode Hors-ligne synchronisé',
        'Support VIP prioritaire 24/7'
      ]
    },
    enterprise: {
      id: 'enterprise',
      name: 'Pack Multi-Boutiques & Caissiers',
      price: 75000,
      period: '/ an',
      badge: 'Multi-Magasins',
      badgeColor: '#10B981',
      features: [
        'Boutiques & Succursales illimitées',
        'Sous-comptes Caissiers illimités (avec code PIN)',
        'Suivi des encaissements en direct pour le Patron',
        'Rapports d\'activité par vendeur',
        'Export Excel & PDF pour expert-comptable'
      ]
    }
  };

  const currentPlanObj = plans[selectedPlan];

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);
      upgradeToPro(currentPlanObj.name);
    }, 1200);
  };

  return (
    <div className="modal-overlay active" style={{ display: 'flex' }}>
      <div className="modal-card" style={{ maxWidth: '820px', padding: '26px', maxHeight: '94vh', overflowY: 'auto' }}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Crown size={26} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                  Abonnement CréditTrack PRO
                </h2>
                <span style={{ fontSize: '0.7rem', background: '#EFF6FF', color: '#2563EB', fontWeight: 800, padding: '2px 8px', borderRadius: '6px' }}>
                  SÉCURISÉ
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '2px 0 0 0' }}>
                Activez vos fonctionnalités avancées, multi-caissiers et comptabilité en direct
              </p>
            </div>
          </div>

          <button 
            type="button" 
            onClick={() => setIsSubscriptionModalOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '4px' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* 1. Plans Grid (3 Cards) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '22px' }}>
          {Object.values(plans).map((plan) => {
            const isSelected = selectedPlan === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id as any)}
                style={{
                  background: isSelected ? '#0F172A' : '#F8FAFC',
                  color: isSelected ? '#FFFFFF' : '#0F172A',
                  border: isSelected ? '2px solid #3B82F6' : '1.5px solid #E2E8F0',
                  borderRadius: '16px',
                  padding: '18px 16px',
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 10px 25px -5px rgba(15, 23, 42, 0.25)' : 'none'
                }}
              >
                {plan.badge && (
                  <span style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '12px',
                    background: plan.badgeColor,
                    color: '#FFFFFF',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '20px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.3px'
                  }}>
                    {plan.badge}
                  </span>
                )}

                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 6px 0', color: isSelected ? '#93C5FD' : '#1E293B' }}>
                    {plan.name}
                  </h3>
                  
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '8px 0 12px 0' }}>
                    <span style={{ fontSize: '1.45rem', fontWeight: 900, color: isSelected ? '#FFFFFF' : '#0F172A' }}>
                      {formatAfricanCurrency(plan.price, currency)}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: isSelected ? '#94A3B8' : '#64748B', fontWeight: 600 }}>
                      {plan.period}
                    </span>
                  </div>

                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.75rem', lineHeight: '1.7', color: isSelected ? '#CBD5E1' : '#475569' }}>
                    {plan.features.map((feat, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Check size={13} style={{ color: isSelected ? '#60A5FA' : '#2563EB', flexShrink: 0 }} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: isSelected ? '1px solid #334155' : '1px solid #E2E8F0', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: isSelected ? '#60A5FA' : '#2563EB' }}>
                    {isSelected ? '● Sélectionné' : 'Choisir ce forfait'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 2. Payment Methods Selection */}
        <form onSubmit={handlePay} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Zap size={18} className="text-amber-500" />
            <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Moyen de Paiement pour {formatAfricanCurrency(currentPlanObj.price, currency)}
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px', marginBottom: '16px' }}>
            {/* Wave */}
            <button
              type="button"
              onClick={() => setPaymentMethod('wave')}
              style={{
                background: paymentMethod === 'wave' ? '#1E3A8A' : '#FFFFFF',
                color: paymentMethod === 'wave' ? '#FFFFFF' : '#0F172A',
                border: paymentMethod === 'wave' ? '2px solid #1E3A8A' : '1px solid #CBD5E1',
                padding: '10px 8px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              🌊 Wave (0%)
            </button>

            {/* Orange */}
            <button
              type="button"
              onClick={() => setPaymentMethod('orange')}
              style={{
                background: paymentMethod === 'orange' ? '#EA580C' : '#FFFFFF',
                color: paymentMethod === 'orange' ? '#FFFFFF' : '#0F172A',
                border: paymentMethod === 'orange' ? '2px solid #EA580C' : '1px solid #CBD5E1',
                padding: '10px 8px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              🟠 Orange Money
            </button>

            {/* MTN */}
            <button
              type="button"
              onClick={() => setPaymentMethod('mtn')}
              style={{
                background: paymentMethod === 'mtn' ? '#CA8A04' : '#FFFFFF',
                color: paymentMethod === 'mtn' ? '#FFFFFF' : '#0F172A',
                border: paymentMethod === 'mtn' ? '2px solid #CA8A04' : '1px solid #CBD5E1',
                padding: '10px 8px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              🟡 MTN MoMo
            </button>

            {/* Moov */}
            <button
              type="button"
              onClick={() => setPaymentMethod('moov')}
              style={{
                background: paymentMethod === 'moov' ? '#059669' : '#FFFFFF',
                color: paymentMethod === 'moov' ? '#FFFFFF' : '#0F172A',
                border: paymentMethod === 'moov' ? '2px solid #059669' : '1px solid #CBD5E1',
                padding: '10px 8px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              🟢 Moov Money
            </button>

            {/* Carte */}
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              style={{
                background: paymentMethod === 'card' ? '#2563EB' : '#FFFFFF',
                color: paymentMethod === 'card' ? '#FFFFFF' : '#0F172A',
                border: paymentMethod === 'card' ? '2px solid #2563EB' : '1px solid #CBD5E1',
                padding: '10px 8px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              💳 Carte Bancaire
            </button>

            {/* VIP Key */}
            <button
              type="button"
              onClick={() => setPaymentMethod('vip')}
              style={{
                background: paymentMethod === 'vip' ? '#7C3AED' : '#FFFFFF',
                color: paymentMethod === 'vip' ? '#FFFFFF' : '#0F172A',
                border: paymentMethod === 'vip' ? '2px solid #7C3AED' : '1px solid #CBD5E1',
                padding: '10px 8px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              🔑 Clé VIP Promo
            </button>
          </div>

          {/* Payment Input depending on choice */}
          {paymentMethod !== 'vip' && paymentMethod !== 'card' && (
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Numéro de Téléphone Mobile Money ({paymentMethod.toUpperCase()}) :
              </label>
              <div style={{ position: 'relative' }}>
                <Smartphone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  type="text"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Numéro de compte Mobile Money"
                  className="table-input"
                  style={{ paddingLeft: '36px' }}

                />
              </div>
            </div>
          )}

          {paymentMethod === 'card' && (
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Numéro de Carte Visa / Mastercard :
              </label>
              <div style={{ position: 'relative' }}>
                <CreditCard size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  type="text"
                  required
                  placeholder="4000 1234 5678 9010"
                  className="table-input"
                  style={{ paddingLeft: '36px' }}
                />
              </div>
            </div>
          )}

          {paymentMethod === 'vip' && (
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Code Clé VIP / Code Partenaire d'Activation :
              </label>
              <div style={{ position: 'relative' }}>
                <Key size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  type="text"
                  required
                  value={vipCode}
                  onChange={(e) => setVipCode(e.target.value)}
                  placeholder="VIP-CREDITTRACK-2026"
                  className="table-input"
                  style={{ paddingLeft: '36px', textTransform: 'uppercase', fontWeight: 800 }}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            disabled={processing}
            type="submit"
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '0.95rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              borderRadius: '12px',
              boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)'
            }}
          >
            {processing ? (
              <span>Traitement sécurisé en cours...</span>
            ) : (
              <>
                <ShieldCheck size={18} />
                Payer {formatAfricanCurrency(currentPlanObj.price, currency)} & Activer {currentPlanObj.name}
                <ArrowRight size={16} />
              </>
            )}
          </button>

          <p style={{ fontSize: '0.7rem', color: '#64748B', textAlign: 'center', margin: '10px 0 0 0' }}>
            🔒 Paiement 100% crypté et certifié. Facture avec TVA délivrée instantanément.
          </p>
        </form>

      </div>
    </div>
  );
}
