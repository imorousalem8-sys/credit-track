"use client";

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AppProvider, useApp } from '@/context/AppContext';
import Sidebar from './Sidebar';
import Header from './Header';
import BottomNav from './BottomNav';
import ModalNewCredit from '@/components/modals/ModalNewCredit';
import ModalReceipt from '@/components/modals/ModalReceipt';
import ModalClientDetails from '@/components/modals/ModalClientDetails';
import ModalSubscription from '@/components/modals/ModalSubscription';
import ModalCashierPin from '@/components/modals/ModalCashierPin';
import ModalOwnerUnlock from '@/components/modals/ModalOwnerUnlock';
import VersionUpdateManager from '@/components/common/VersionUpdateManager';

function LayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentRole, showToast } = useApp();
  const isLandingPage = pathname === '/';

  useEffect(() => {
    // Redirection automatique si un utilisateur a ouvert un ancien lien de preview snapshot Vercel
    if (typeof window !== 'undefined') {
      const host = window.location.hostname;
      if (host.includes('vercel.app') && host !== 'credit-track00.vercel.app' && host.includes('projects.vercel.app')) {
        window.location.replace('https://credit-track00.vercel.app' + window.location.pathname + window.location.search + window.location.hash);
        return;
      }
    }

    if (isLandingPage) {
      document.body.classList.remove('is-app-mode');
      document.body.classList.add('is-landing-mode');
    } else {
      document.body.classList.add('is-app-mode');
      document.body.classList.remove('is-landing-mode');
    }
  }, [isLandingPage]);

  // STRICT CASHIER ACCESS GUARD (Interdiction absolue du Dashboard, Comptabilité, Achats, etc.)
  useEffect(() => {
    if (currentRole === 'cashier') {
      const forbiddenForCashier = ['/dashboard', '/achats', '/comptabilite', '/tresorerie', '/caissiers', '/abonnement'];
      if (forbiddenForCashier.some(route => pathname.startsWith(route))) {
        showToast("🔒 Accès interdit : Vous êtes en Mode Caissier. Déverrouillez le Mode Patron avec le code PIN.", "warning");
        router.replace('/ventes');
      }
    }
  }, [pathname, currentRole, router, showToast]);

  if (isLandingPage) {
    return <>{children}</>;
  }

  return (
    <div id="app-workspace-layout" className="app-workspace-root">
      <Sidebar />
      <div className="workspace-main-wrapper">
        <Header />
        <main className="workspace-content-body">
          {children}
        </main>
        <BottomNav />
      </div>

      {/* Global Business Modals */}
      <ModalNewCredit />
      <ModalReceipt />
      <ModalClientDetails />
      <ModalSubscription />
      <ModalCashierPin />
      <ModalOwnerUnlock />
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <LayoutInner>
        {children}
      </LayoutInner>
      <VersionUpdateManager />
    </AppProvider>
  );
}
