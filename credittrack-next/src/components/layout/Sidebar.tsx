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
  FileSpreadsheet,
  Settings,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { country } = useApp();

  const navigation = [
    { name: 'Tableau de bord', href: '/', icon: LayoutDashboard },
    { name: 'Clients & Solvabilité', href: '/clients', icon: Users },
    { name: 'Factures & Ventes', href: '/ventes', icon: ShoppingCart },
    { name: 'Achats & Charges', href: '/achats', icon: Receipt },
    { name: 'Comptabilité Générale', href: '/comptabilite', icon: Calculator },
    { name: 'Trésorerie & MoMo', href: '/tresorerie', icon: PiggyBank },
  ];

  return (
    <aside className="sidebar-fixed">
      
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
        <div className="badge-country-mini" title={`Pays actif : ${country.nameFr}`}>
          {country.flag} {country.code}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href} className={`nav-link ${isActive ? 'active' : ''}`}>
              <div className="nav-link-left">
                <Icon size={18} />
                <span>{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Quick Upgrade / Plan Card */}
      <div className="sidebar-pro-card">
        <div className="pro-card-title">
          <Sparkles size={16} className="text-amber-300" />
          <span>Licence Pro Illimitée</span>
        </div>
        <div className="pro-card-desc">
          Régime fiscal actif : <strong>{country.system}</strong> avec TVA standard à {country.vatRate}%.
        </div>
      </div>

      {/* User Footer Profile */}
      <div className="sidebar-user-footer">
        <div className="user-avatar-circle">AK</div>
        <div className="user-info-text">
          <div className="user-name-title">Admin KOUASSI</div>
          <div className="user-role-sub">Gérant Principal</div>
        </div>
      </div>

    </aside>
  );
}
