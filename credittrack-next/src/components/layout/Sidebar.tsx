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
  Crown,
  Store,
  Lock,
  LogOut,
  X
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { 
    country, 
    isMobileMenuOpen, 
    setIsMobileMenuOpen, 
    setIsSubscriptionModalOpen,
    currentRole,
    activeCashier,
    logoutToOwner
  } = useApp();

  const navigation = [
    { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Clients & Solvabilité', href: '/clients', icon: Users },
    { name: 'Factures & Ventes', href: '/ventes', icon: ShoppingCart },
    { name: 'Achats & Charges', href: '/achats', icon: Receipt },
    { name: 'Comptabilité Générale', href: '/comptabilite', icon: Calculator },
    { name: 'Trésorerie & MoMo', href: '/tresorerie', icon: PiggyBank },
    { name: 'Caissiers & Boutiques', href: '/caissiers', icon: Store },
    { name: 'Abonnement & Tarifs', href: '/abonnement', icon: Crown },
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

        {/* Role Banner if in Cashier Mode */}
        {currentRole === 'cashier' && activeCashier && (
          <div style={{ margin: '12px 14px 4px 14px', background: '#FEF3C7', border: '1.5px solid #F59E0B', borderRadius: '12px', padding: '10px 12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#B45309', textTransform: 'uppercase' }}>
                  ● Session Caissier
                </span>
                <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#0F172A' }}>{activeCashier.name}</div>
                <div style={{ fontSize: '0.7rem', color: '#78350F' }}>{activeCashier.storeName}</div>
              </div>
              <button
                type="button"
                onClick={logoutToOwner}
                title="Quitter le mode caissier"
                style={{ background: '#F59E0B', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer' }}
              >
                <LogOut size={15} />
              </button>
            </div>
          </div>
        )}

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

        {/* Quick Upgrade / Interactive Subscription Card */}
        <div 
          className="sidebar-pro-card"
          onClick={() => setIsSubscriptionModalOpen(true)}
          style={{ cursor: 'pointer', transition: 'transform 0.15s ease' }}
          title="Cliquez pour gérer votre abonnement et forfaits"
        >
          <div className="pro-card-title">
            <Sparkles size={16} className="text-amber-300" />
            <span>Licence Pro Illimitée</span>
          </div>
          <div className="pro-card-desc">
            Régime fiscal : <strong>{country.system}</strong> (TVA {country.vatRate}%).
          </div>
          <div style={{ marginTop: '8px', fontSize: '0.72rem', color: '#FCD34D', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>Voir les forfaits & paiements</span> →
          </div>
        </div>

        {/* User Footer Profile & Compliance */}
        <div className="sidebar-user-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', marginBottom: '8px' }}>
            <div className="user-avatar-circle">
              {currentRole === 'cashier' ? 'CS' : 'CP'}
            </div>
            <div className="user-info-text" style={{ flex: 1 }}>
              <div className="user-name-title">
                {currentRole === 'cashier' ? activeCashier?.name : 'Compte Commerçant'}
              </div>
              <div className="user-role-sub">
                {currentRole === 'cashier' ? 'Poste Caissier' : 'Gérant Principal'}
              </div>
            </div>
          </div>

          
          {/* Compliance & Site links */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px', fontSize: '0.68rem', color: 'rgba(255,255,255,0.6)' }}>
            <Link href="/" onClick={handleLinkClick} style={{ color: '#38BDF8', textDecoration: 'none', fontWeight: 700 }}>
              ← Site Web
            </Link>
            <span>•</span>
            <Link href="/privacy" onClick={handleLinkClick} style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
              Confidentialité
            </Link>
            <span>•</span>
            <span style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#93C5FD', padding: '1px 6px', borderRadius: '4px', fontWeight: 800, fontSize: '0.62rem' }}>
              v2.4.1
            </span>
          </div>
        </div>


      </aside>
    </>
  );
}

