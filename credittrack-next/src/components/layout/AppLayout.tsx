"use client";

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AppProvider } from '@/context/AppContext';
import Sidebar from './Sidebar';
import Header from './Header';
import BottomNav from './BottomNav';
import ModalNewCredit from '@/components/modals/ModalNewCredit';
import ModalReceipt from '@/components/modals/ModalReceipt';
import ModalClientDetails from '@/components/modals/ModalClientDetails';

function LayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  useEffect(() => {
    if (isLandingPage) {
      document.body.classList.remove('is-app-mode');
      document.body.classList.add('is-landing-mode');
    } else {
      document.body.classList.add('is-app-mode');
      document.body.classList.remove('is-landing-mode');
    }
  }, [isLandingPage]);

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
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <LayoutInner>
        {children}
      </LayoutInner>
    </AppProvider>
  );
}
