"use client";

import React, { useEffect } from 'react';
import { AppProvider } from '@/context/AppContext';
import Sidebar from './Sidebar';
import Header from './Header';
import ModalNewCredit from '@/components/modals/ModalNewCredit';
import ModalReceipt from '@/components/modals/ModalReceipt';
import ModalClientDetails from '@/components/modals/ModalClientDetails';

function LayoutInner({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.body.classList.add('is-app-mode');
    document.body.classList.remove('is-landing-mode');
  }, []);

  return (
    <div id="app-workspace-layout" style={{ display: 'flex', minHeight: '100vh', width: '100vw' }}>
      <Sidebar />
      <main className="main-workspace">
        <Header />
        <div className="workspace-content" style={{ padding: '28px 32px', flex: 1, minHeight: 'calc(100vh - 70px)' }}>
          {children}
        </div>
      </main>

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
