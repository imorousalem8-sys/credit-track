"use client";

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Crown, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  Smartphone, 
  CreditCard, 
  Key, 
  ArrowRight,
  Zap,
  HelpCircle
} from 'lucide-react';
import { formatAfricanCurrency } from '@/lib/africanCountries';

export default function SubscriptionPage() {
  const { currency, upgradeToPro } = useApp();

  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | 'enterprise'>('yearly');
  const [paymentMethod, setPaymentMethod] = useState<'wave' | 'orange' | 'mtn' | 'moov' | 'card' | 'vip'>('wave');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [vipCode, setVipCode] = useState('');

  const [processing, setProcessing] = useState(false);

  const plans = {
    monthly: {
      id: 'monthly',
      name: 'PRO Mensuel',
      price: 5000,
      period: '/ mois',
      badge: 'Sans engagement',
      badgeColor: '#2563EB',
      features: [
        'Clients & Dettes illimités',
        'Grand tableau de facturation multi-produits',
        'Rappels WhatsApp & SMS en 1 clic',
        'Reçus & Factures avec signature électronique',
        'Livre de caisse SYSCOHADA'
      ]
    },
    yearly: {
      id: 'yearly',
      name: 'PRO Annuel',
      price: 45000,
      period: '/ an',
      badge: '3 Mois Offerts (Recommandé)',
      badgeColor: '#F59E0B',
      isPopular: true,
      features: [
        'Tous les avantages PRO Mensuel',
        '3 Mois d\'abonnement offerts (Économisez 25%)',
        'Bilan comptable SYSCOHADA / IFRS certifié',
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
        'Export comptable complet'
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
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 font-extrabold text-xs px-3 py-1.5 rounded-full border border-amber-200">
          <Crown size={15} /> Débloquez la Puissance de CréditTrack PRO
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Tarifs Transparents & Sans Surprise
        </h1>
        <p className="text-base text-slate-600">
          Choisissez la formule adaptée à votre commerce. Payez facilement par Mobile Money panafricain ou Carte Bancaire.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.values(plans).map((plan) => {
          const isSelected = selectedPlan === plan.id;
          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id as any)}
              className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between cursor-pointer transition relative border-2 ${
                isSelected 
                  ? 'bg-slate-900 text-white border-blue-500 shadow-xl shadow-blue-900/20' 
                  : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              {plan.badge && (
                <span 
                  className="absolute -top-3 right-6 text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm"
                  style={{ background: plan.badgeColor }}
                >
                  {plan.badge}
                </span>
              )}

              <div>
                <h3 className={`text-lg font-black mb-2 ${isSelected ? 'text-blue-300' : 'text-slate-900'}`}>
                  {plan.name}
                </h3>

                <div className="flex items-baseline gap-2 my-4">
                  <span className={`text-3xl sm:text-4xl font-black ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                    {formatAfricanCurrency(plan.price, currency)}
                  </span>
                  <span className={`text-xs font-semibold ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                    {plan.period}
                  </span>
                </div>

                <ul className={`space-y-3 text-xs leading-relaxed my-6 ${isSelected ? 'text-slate-300' : 'text-slate-600'}`}>
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2.5">
                      <Check size={16} className={`shrink-0 ${isSelected ? 'text-blue-400' : 'text-blue-600'}`} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`pt-4 border-t text-center font-extrabold text-sm ${
                isSelected ? 'border-slate-800 text-blue-400' : 'border-slate-100 text-blue-600'
              }`}>
                {isSelected ? '● Forfait Sélectionné' : 'Cliquer pour Choisir'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Box */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <form onSubmit={handlePay} className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Zap className="text-amber-500" size={20} />
                Paiement pour : {currentPlanObj.name}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Montant total : <strong>{formatAfricanCurrency(currentPlanObj.price, currency)}</strong>
              </p>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
              Paiement Sécurisé
            </span>
          </div>

          {/* Payment Methods */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { id: 'wave', label: '🌊 Wave (0% frais)' },
              { id: 'orange', label: '🟠 Orange Money' },
              { id: 'mtn', label: '🟡 MTN MoMo' },
              { id: 'moov', label: '🟢 Moov Money' },
              { id: 'card', label: '💳 Carte Bancaire' },
              { id: 'vip', label: '🔑 Clé VIP Promo' },
            ].map(method => (
              <button
                key={method.id}
                type="button"
                onClick={() => setPaymentMethod(method.id as any)}
                className={`p-3 rounded-xl font-bold text-xs border text-center transition ${
                  paymentMethod === method.id 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20' 
                    : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {method.label}
              </button>
            ))}
          </div>

          {paymentMethod !== 'vip' && paymentMethod !== 'card' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Numéro Mobile Money ({paymentMethod.toUpperCase()}) :
              </label>
              <div className="relative">
                <Smartphone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="table-input pl-10"
                  placeholder="Numéro de compte Mobile Money"

                />
              </div>
            </div>
          )}

          {paymentMethod === 'card' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Numéro de Carte Visa / Mastercard :
              </label>
              <div className="relative">
                <CreditCard size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  className="table-input pl-10"
                  placeholder="4000 1234 5678 9010"
                />
              </div>
            </div>
          )}

          {paymentMethod === 'vip' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Code Clé VIP / Code Partenaire :
              </label>
              <div className="relative">
                <Key size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={vipCode}
                  onChange={(e) => setVipCode(e.target.value)}
                  className="table-input pl-10 uppercase font-bold"
                  placeholder="VIP-CREDITTRACK-2026"
                />
              </div>
            </div>
          )}

          <button
            disabled={processing}
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-2xl font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition disabled:opacity-50"
          >
            {processing ? (
              <span>Traitement sécurisé en cours...</span>
            ) : (
              <>
                <ShieldCheck size={20} />
                Payer {formatAfricanCurrency(currentPlanObj.price, currency)} & Activer {currentPlanObj.name}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>

    </div>
  );
}
