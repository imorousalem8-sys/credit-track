"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Calculator,
  PiggyBank
} from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Clients', href: '/clients', icon: Users },
    { name: 'Ventes', href: '/ventes', icon: ShoppingCart },
    { name: 'Compta', href: '/comptabilite', icon: Calculator },
    { name: 'Trésorerie', href: '/tresorerie', icon: PiggyBank },
  ];

  return (
    <nav className="mobile-bottom-nav">
      <div className="bottom-nav-container">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            >
              <div className="bottom-nav-icon-wrapper">
                <Icon size={20} className={isActive ? 'text-primary' : 'text-slate-500'} />
              </div>
              <span className="bottom-nav-label">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
