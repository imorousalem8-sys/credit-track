"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AfricanCountry, AFRICAN_COUNTRIES, getCountryConfig, formatAfricanCurrency, AccountingAccount } from '@/lib/africanCountries';
import { supabase } from '@/lib/supabase';
import { NativeBridge } from '@/lib/nativeBridge';

export interface ClientTransaction {
  id: number | string;
  date: string;
  desc: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
}

export interface Client {
  id: number | string;
  name: string;
  phone: string;
  totalDue: number;
  status: 'paid' | 'pending' | 'overdue';
  reliabilityScore: number;
  addedDate: string;
  transactions?: ClientTransaction[];
}

export interface PaymentReceipt {
  id: number | string;
  ref: string;
  clientName: string;
  clientPhone: string;
  itemsDesc: string;
  amount: number;
  date: string;
  method: string;
  signatureImg?: string;
}

export interface AccountingEntry {
  id: number | string;
  date: string;
  ref: string;
  code: string;
  label: string;
  type: 'revenue' | 'expense' | 'asset' | 'liability';
  amountHT: number;
  vatAmount: number;
  status: string;
}

interface AppContextType {
  country: AfricanCountry & { chart: AccountingAccount[] };
  setCountryCode: (code: string) => void;
  currency: string;
  formatAmount: (amount: number) => string;
  
  isOnline: boolean;
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'reliabilityScore' | 'addedDate'>) => void;
  updateClientPayment: (clientId: number | string, amountPaid: number, receiptData: Partial<PaymentReceipt>) => void;
  
  payments: PaymentReceipt[];
  accountingEntries: AccountingEntry[];
  addAccountingEntry: (entry: Omit<AccountingEntry, 'id' | 'ref' | 'status'>) => void;
  
  activeReceipt: PaymentReceipt | null;
  setActiveReceipt: (receipt: PaymentReceipt | null) => void;
  shareReceiptNative: (receipt: PaymentReceipt) => Promise<boolean>;
  
  selectedClient: Client | null;
  setSelectedClient: (client: Client | null) => void;
  
  isNewCreditModalOpen: boolean;
  setIsNewCreditModalOpen: (open: boolean) => void;

  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;

  showToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_CLIENTS: Client[] = [];
const INITIAL_PAYMENTS: PaymentReceipt[] = [];
const INITIAL_ENTRIES: AccountingEntry[] = [];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [countryCode, setCountryCodeState] = useState<string>('BJ');
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [payments, setPayments] = useState<PaymentReceipt[]>(INITIAL_PAYMENTS);
  const [accountingEntries, setAccountingEntries] = useState<AccountingEntry[]>(INITIAL_ENTRIES);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  
  const [activeReceipt, setActiveReceipt] = useState<PaymentReceipt | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isNewCreditModalOpen, setIsNewCreditModalOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const country = getCountryConfig(countryCode);
  const currency = country.currency;

  const showToast = useCallback((msg: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    if (typeof window === 'undefined') return;
    const toast = document.createElement('div');
    const borderColors = {
      info: '#2563EB',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444'
    };

    toast.style.cssText = `position:fixed;bottom:24px;right:24px;z-index:99999;background:#0F172A;color:#fff;padding:14px 22px;border-radius:12px;font-weight:700;font-size:0.875rem;box-shadow:0 10px 25px rgba(0,0,0,0.35);border-left:5px solid ${borderColors[type]};animation:fadeIn 0.3s ease;display:flex;align-items:center;gap:10px;max-width:90vw;`;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }, []);

  const formatAmount = useCallback((amount: number) => {
    return formatAfricanCurrency(amount, currency);
  }, [currency]);

  // Initialize Native features and offline listener
  useEffect(() => {
    NativeBridge.initApp();

    NativeBridge.getNetworkStatus().then(st => setIsOnline(st.connected));
    const unsubscribe = NativeBridge.onNetworkChange(st => {
      setIsOnline(st.connected);
      if (st.connected) {
        showToast("Connexion rétablie. Données synchronisées.", "success");
      } else {
        showToast("Mode hors-ligne actif. Vos actions sont enregistrées localement.", "warning");
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [showToast]);

  // Restore LocalStorage
  useEffect(() => {
    try {
      const savedCountry = localStorage.getItem('ct_country');
      if (savedCountry) setCountryCodeState(savedCountry);

      const savedClients = localStorage.getItem('ct_clients');
      if (savedClients) setClients(JSON.parse(savedClients));

      const savedPayments = localStorage.getItem('ct_payments');
      if (savedPayments) setPayments(JSON.parse(savedPayments));

      const savedEntries = localStorage.getItem('ct_entries');
      if (savedEntries) setAccountingEntries(JSON.parse(savedEntries));
    } catch (e) {
      console.warn("Storage restore error:", e);
    }
  }, []);

  const setCountryCode = (code: string) => {
    setCountryCodeState(code);
    localStorage.setItem('ct_country', code);
  };

  const shareReceiptNative = async (receipt: PaymentReceipt): Promise<boolean> => {
    const summary = `REÇU DE PAIEMENT - CRÉDITTRACK PRO\nRéférence: ${receipt.ref}\nClient: ${receipt.clientName}\nMontant: ${formatAfricanCurrency(receipt.amount, currency)}\nDate: ${receipt.date}\nMode: ${receipt.method}\n\nReçu certifié et sécurisé via CréditTrack PRO.`;
    return await NativeBridge.shareReceipt(`Reçu ${receipt.ref} - ${receipt.clientName}`, summary);
  };

  const addClient = (clientData: Omit<Client, 'id' | 'reliabilityScore' | 'addedDate'>) => {
    const safeName = (clientData.name || '').trim().substring(0, 100);
    const safePhone = (clientData.phone || '').trim().substring(0, 30);
    const validDue = Math.max(0, Number(clientData.totalDue) || 0);

    const newClient: Client = {
      ...clientData,
      name: safeName || 'Nouveau Client',
      phone: safePhone,
      totalDue: validDue,
      id: Date.now(),
      reliabilityScore: 85,
      addedDate: new Date().toISOString().split('T')[0],
      transactions: validDue > 0 ? [
        {
          id: Date.now() + 1,
          date: new Date().toISOString().split('T')[0],
          desc: 'Créance Initiale',
          amount: validDue,
          status: 'pending',
          dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]
        }
      ] : []
    };

    const updated = [newClient, ...clients];
    setClients(updated);
    try {
      localStorage.setItem('ct_clients', JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage write error", e);
    }
    showToast(`Client "${newClient.name}" enregistré avec succès !`, "success");
  };

  const updateClientPayment = (clientId: number | string, amountPaid: number, receiptData: Partial<PaymentReceipt>) => {
    const validAmount = Math.max(0, Number(amountPaid) || 0);
    if (validAmount <= 0) {
      showToast("Veuillez saisir un montant d'encaissement valide.", "warning");
      return;
    }

    const updatedClients = clients.map(c => {
      if (c.id === clientId) {
        const newDue = Math.max(0, c.totalDue - validAmount);
        return {
          ...c,
          totalDue: newDue,
          status: (newDue === 0 ? 'paid' : 'pending') as 'paid' | 'pending' | 'overdue',
          reliabilityScore: Math.min(100, c.reliabilityScore + 5)
        };
      }
      return c;
    });

    setClients(updatedClients);
    try {
      localStorage.setItem('ct_clients', JSON.stringify(updatedClients));
    } catch (e) {
      console.warn("Storage write error", e);
    }

    const newReceipt: PaymentReceipt = {
      id: Date.now(),
      ref: `REC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      clientName: (receiptData.clientName || 'Client').trim().substring(0, 100),
      clientPhone: (receiptData.clientPhone || '').trim().substring(0, 30),
      itemsDesc: (receiptData.itemsDesc || 'Règlement Créance').trim().substring(0, 255),
      amount: validAmount,
      date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      method: receiptData.method || 'Espèces',
      signatureImg: receiptData.signatureImg
    };

    const updatedPayments = [newReceipt, ...payments];
    setPayments(updatedPayments);
    try {
      localStorage.setItem('ct_payments', JSON.stringify(updatedPayments));
    } catch (e) {
      console.warn("Storage write error", e);
    }

    // Also add to accounting entries
    const newEntry: AccountingEntry = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      ref: `ENC-${Math.floor(1000 + Math.random() * 9000)}`,
      code: '521',
      label: `Encaissement ${newReceipt.clientName} (${newReceipt.method})`,
      type: 'revenue',
      amountHT: validAmount,
      vatAmount: Math.round(validAmount * (country.vatRate / 100)),
      status: 'Validé'
    };

    const updatedEntries = [newEntry, ...accountingEntries];
    setAccountingEntries(updatedEntries);
    try {
      localStorage.setItem('ct_entries', JSON.stringify(updatedEntries));
    } catch (e) {
      console.warn("Storage write error", e);
    }

    setActiveReceipt(newReceipt);
    showToast(`Paiement de ${formatAfricanCurrency(validAmount, currency)} enregistré et reçu généré !`, "success");
  };

  const addAccountingEntry = (entryData: Omit<AccountingEntry, 'id' | 'ref' | 'status'>) => {
    const validHT = Math.max(0, Number(entryData.amountHT) || 0);
    const validVat = Math.max(0, Number(entryData.vatAmount) || 0);

    const newEntry: AccountingEntry = {
      ...entryData,
      amountHT: validHT,
      vatAmount: validVat,
      label: (entryData.label || '').trim().substring(0, 150),
      id: Date.now(),
      ref: `ECR-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      status: 'Validé'
    };

    const updated = [newEntry, ...accountingEntries];
    setAccountingEntries(updated);
    try {
      localStorage.setItem('ct_entries', JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage write error", e);
    }
    showToast("Écriture comptable ajoutée au journal !", "success");
  };

  return (
    <AppContext.Provider value={{
      country,
      setCountryCode,
      currency,
      formatAmount,
      isOnline,
      clients,
      addClient,
      updateClientPayment,
      payments,
      accountingEntries,
      addAccountingEntry,
      activeReceipt,
      setActiveReceipt,
      shareReceiptNative,
      selectedClient,
      setSelectedClient,
      isNewCreditModalOpen,
      setIsNewCreditModalOpen,
      isMobileMenuOpen,
      setIsMobileMenuOpen,
      showToast
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
}
