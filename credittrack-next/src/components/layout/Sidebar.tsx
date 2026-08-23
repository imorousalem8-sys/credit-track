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

  const ownerNavigation = [
    { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Clients & Solvabilité', href: '/clients', icon: Users },
    { name: 'Factures & Ventes', href: '/ventes', icon: ShoppingCart },
    { name: 'Achats & Charges', href: '/achats', icon: Receipt },
    { name: 'Comptabilité Générale', href: '/comptabilite', icon: Calculator },
    { name: 'Trésorerie & MoMo', href: '/tresorerie', icon: PiggyBank },
    { name: 'Caissiers & Boutiques', href: '/caissiers', icon: Store },
    { name: 'Abonnement & Tarifs', href: '/abonnement', icon: Crown },
  ];

  const cashierNavigation = [
    { name: 'Cahier des Ventes', href: '/ventes', icon: ShoppingCart },
    { name: 'Clients & Solvabilité', href: '/clients', icon: Users },
  ];

  const navigation = currentRole === 'cashier' ? cashierNavigation : ownerNavigation;

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

        {/* Role Banner */}
        {currentRole === 'cashier' ? (
          <div style={{ margin: '12px 14px 8px 14px', background: '#FEF3C7', border: '1.5px solid #F59E0B', borderRadius: '12px', padding: '10px 12px' }}>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ fontSize: '0.68rem', fontWeight: 900, color: '#B45309', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                🔒 Session Caissier
              </span>
              <div style={{ fontWeight: 800, fontSize: '0.84rem', color: '#0F172A' }}>{activeCashier?.name || 'Vendeur de Comptoir'}</div>
              <div style={{ fontSize: '0.72rem', color: '#78350F' }}>{activeCashier?.storeName || 'Magasin'}</div>
            </div>
            <button
              type="button"
              onClick={logoutToOwner}
              title="Déverrouiller le mode patron avec le code PIN"
              style={{ width: '100%', background: '#B45309', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '6px 8px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Lock size={13} />
              <span>Déverrouiller Mode Patron</span>
            </button>
          </div>
        ) : (
          <div style={{ margin: '12px 14px 4px 14px', background: '#EFF6FF', border: '1.5px solid #BFDBFE', borderRadius: '12px', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.68rem', fontWeight: 900, color: '#1E40AF', textTransform: 'uppercase' }}>
                👑 Mode Patron
              </span>
              <div style={{ fontWeight: 800, fontSize: '0.8rem', color: '#0F172A' }}>Gérant Principal</div>
            </div>
            <Link
              href="/caissiers"
              style={{ fontSize: '0.7rem', fontWeight: 800, color: '#2563EB', textDecoration: 'none', background: '#FFFFFF', padding: '4px 8px', borderRadius: '6px', border: '1px solid #93C5FD' }}
            >
              Gérer Caisses
            </Link>
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

        {/* Quick Upgrade / Interactive Subscription Card (Owner only) */}
        {currentRole === 'owner' && (
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
              <span>Gérer les forfaits</span>
              <Crown size={13} />
            </div>
          </div>
        )}

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
            <button 
              onClick={() => {
                if (typeof window !== 'undefined' && (window as any).__CREDITTRACK_DIAGNOSTIC__?.openDiagnostic) {
                  (window as any).__CREDITTRACK_DIAGNOSTIC__.openDiagnostic();
                }
              }}
              style={{
                background: 'rgba(59, 130, 246, 0.2)',
                color: '#93C5FD',
                padding: '2px 6px',
                borderRadius: '4px',
                fontWeight: 800,
                fontSize: '0.62rem',
                border: '1px solid rgba(59, 130, 246, 0.4)',
                cursor: 'pointer'
              }}
              title="Cliquez pour ouvrir le diagnostic système et vérifier les mises à jour"
            >
              v4.2.0 • PRO
            </button>
          </div>
        </div>


      </aside>
    </>
  );
}

