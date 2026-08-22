"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { AFRICAN_COUNTRIES } from '@/lib/africanCountries';
import { Bell, Plus, Globe, Wifi, WifiOff, Menu } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const { country, setCountryCode, setIsNewCreditModalOpen, isOnline, setIsMobileMenuOpen } = useApp();

  const getTitle = () => {
    if (pathname === '/' || pathname.startsWith('/dashboard')) return 'Tableau de Bord';
    if (pathname.startsWith('/clients') || pathname.startsWith('/credit')) return 'Clients & Solvabilité';
    if (pathname.startsWith('/comptabilite') || pathname.startsWith('/accounting')) return 'Comptabilité Générale';
    if (pathname.startsWith('/ventes')) return 'Facturation & Ventes';
    if (pathname.startsWith('/achats')) return 'Achats & Charges';
    if (pathname.startsWith('/tresorerie')) return 'Trésorerie & Mobile Money';
    if (pathname.startsWith('/privacy')) return 'Confidentialité';
    if (pathname.startsWith('/account/delete')) return 'Gestion Compte';
    const path = pathname.split('/')[1];
    if (path) return path.charAt(0).toUpperCase() + path.slice(1);
    return 'CréditTrack';
  };

  return (
    <header className="top-workspace-header">
      
      {/* Left: Mobile Hamburger + Title + System Badge */}
      <div className="header-left-title">
        
        {/* Hamburger Toggle (Mobile Only) */}
        <button
          type="button"
          className="mobile-drawer-toggle"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Ouvrir le menu"
        >
          <Menu size={22} />
        </button>

        <div className="header-title-wrap">
          <h1 className="header-page-heading">{getTitle()}</h1>
          
          <div className="header-badges-row">
            <span className="badge-system">
              {country.system}
            </span>

            {/* Live Network Status Indicator */}
            <span 
              title={isOnline ? "Connecté au cloud (Synchronisation temps réel)" : "Mode hors-ligne actif (Données sauvegardées localement)"}
              className={`badge-network ${isOnline ? 'online' : 'offline'}`}
            >
              {isOnline ? <Wifi size={11} /> : <WifiOff size={11} />}
              <span>{isOnline ? 'En ligne' : 'Hors-ligne'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="header-right-actions">
        
        {/* Country Selector */}
        <div className="country-selector-box" title={`Pays actif: ${country.nameFr} (${country.currency})`}>
          <Globe size={15} className="text-slate-400 shrink-0" />
          <select 
            value={country.code} 
            onChange={(e) => setCountryCode(e.target.value)}
            className="country-select-input"
            aria-label="Sélectionner le pays"
          >
            {AFRICAN_COUNTRIES.map(c => (
              <option key={c.code} value={c.code}>
                {c.code} - {c.nameFr} ({c.currency})
              </option>
            ))}
          </select>
        </div>

        {/* Notifications Icon Button */}
        <button 
          type="button"
          className="header-icon-btn hidden sm:flex"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="notif-dot"></span>
        </button>

        {/* Primary CTA Button */}
        <button 
          type="button" 
          className="btn-header-primary"
          onClick={() => setIsNewCreditModalOpen(true)}
          title="Créer un nouveau crédit ou client"
        >
          <Plus size={18} className="shrink-0" />
          <span className="btn-header-text">Nouveau Crédit</span>
        </button>

      </div>
    </header>
  );
}

