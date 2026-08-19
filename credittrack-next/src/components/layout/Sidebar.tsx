"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Receipt,
  Calculator,
  PiggyBank,
  Sparkles,
  ShieldCheck,
  X
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { country, isMobileMenuOpen, setIsMobileMenuOpen } = useApp();

  const navigation = [
    { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Clients & Solvabilité', href: '/clients', icon: Users },
    { name: 'Factures & Ventes', href: '/ventes', icon: ShoppingCart },
    { name: 'Achats & Charges', href: '/achats', icon: Receipt },
    { name: 'Comptabilité Générale', href: '/comptabilite', icon: Calculator },
    { name: 'Trésorerie & MoMo', href: '/tresorerie', icon: PiggyBank },
  ];

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div
          className="sidebar-mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar-fixed ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        
        {/* Brand Header */}
        <div className="sidebar-brand">
          <div className="brand-left">
            <div className="brand-icon">
              <ShieldCheck size={22} />
            </div>
            <div>
              <div className="brand-title">CréditTrack</div>
              <div className="brand-sub">PRO PANAFRICAIN</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="badge-country-mini" title={`Pays actif : ${country.nameFr}`}>
              {country.code}
            </div>
            {/* Close Button on Mobile Drawer */}
            <button
              type="button"
              className="sidebar-mobile-close-btn"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Fermer le menu"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleLinkClick}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                <div className="nav-link-left">
                  <Icon size={18} />
                  <span>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Quick Upgrade / Fiscal Info Card */}
        <div className="sidebar-pro-card">
          <div className="pro-card-title">
            <Sparkles size={16} className="text-amber-300" />
            <span>Licence Pro Illimitée</span>
          </div>
          <div className="pro-card-desc">
            Régime fiscal actif : <strong>{country.system}</strong> avec TVA standard à {country.vatRate}%.
          </div>
        </div>

        {/* User Footer Profile & Compliance */}
        <div className="sidebar-user-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', marginBottom: '8px' }}>
            <div className="user-avatar-circle">AK</div>
            <div className="user-info-text" style={{ flex: 1 }}>
              <div className="user-name-title">Admin KOUASSI</div>
              <div className="user-role-sub">Gérant Principal</div>
            </div>
          </div>
          
          {/* Compliance & Site links */}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px', fontSize: '0.68rem', color: 'rgba(255,255,255,0.6)' }}>
            <Link href="/" onClick={handleLinkClick} style={{ color: '#38BDF8', textDecoration: 'none', fontWeight: 700 }}>
              ← Site Web
            </Link>
            <span>•</span>
            <Link href="/privacy" onClick={handleLinkClick} style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
              Confidentialité
            </Link>
            <span>•</span>
            <Link href="/account/delete" onClick={handleLinkClick} style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
              Compte
            </Link>
          </div>
        </div>

      </aside>
    </>
  );
}
