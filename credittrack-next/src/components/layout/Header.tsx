"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { AFRICAN_COUNTRIES } from '@/lib/africanCountries';
import { Bell, Plus, Globe, Sparkles } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const { country, setCountryCode, setIsNewCreditModalOpen } = useApp();

  const getTitle = () => {
    if (pathname === '/') return 'Tableau de Bord Exécutif';
    if (pathname.startsWith('/clients') || pathname.startsWith('/credit')) return 'Répertoire & Solvabilité Clients';
    if (pathname.startsWith('/comptabilite') || pathname.startsWith('/accounting')) return 'Comptabilité Générale (SYSCOHADA / IFRS)';
    if (pathname.startsWith('/ventes')) return 'Facturation & Ventes';
    if (pathname.startsWith('/achats')) return 'Achats & Fournisseurs';
    if (pathname.startsWith('/tresorerie')) return 'Trésorerie & Mobile Money';
    if (pathname.startsWith('/tva')) return 'Déclarations TVA & Taxes';
    const path = pathname.split('/')[1];
    if (path) return path.charAt(0).toUpperCase() + path.slice(1);
    return 'Application';
  };

  return (
    <header className="top-workspace-header">
      <div className="header-left-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>{getTitle()}</span>
        <span style={{
          fontSize: '0.72rem',
          background: '#EFF6FF',
          color: '#2563EB',
          border: '1px solid #BFDBFE',
          padding: '2px 8px',
          borderRadius: '9999px',
          fontWeight: 700
        }}>
          {country.system}
        </span>
      </div>

      <div className="header-right-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        
        {/* Country Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '6px 12px', borderRadius: '10px' }}>
          <Globe size={16} className="text-slate-400" />
          <select 
            value={country.code} 
            onChange={(e) => setCountryCode(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#0F172A',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {AFRICAN_COUNTRIES.map(c => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.nameFr} ({c.currency})
              </option>
            ))}
          </select>
        </div>

        {/* Notifications */}
        <button 
          type="button"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748B',
            cursor: 'pointer',
            position: 'relative'
          }}
        >
          <Bell size={18} />
          <span style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', background: '#EF4444', borderRadius: '50%' }}></span>
        </button>

        {/* Primary Action Button */}
        <button 
          type="button" 
          className="btn-header-primary"
          onClick={() => setIsNewCreditModalOpen(true)}
          style={{
            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
            color: '#fff',
            fontWeight: 800,
            fontSize: '0.88rem',
            padding: '10px 18px',
            borderRadius: '10px',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(37,99,235,0.3)'
          }}
        >
          <Plus size={18} />
          <span>Nouveau Crédit</span>
        </button>

      </div>
    </header>
  );
}
