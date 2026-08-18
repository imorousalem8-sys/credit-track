"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AfricanCountry, AFRICAN_COUNTRIES, getCountryConfig, formatAfricanCurrency, AccountingAccount } from '@/lib/africanCountries';
import { supabase } from '@/lib/supabase';

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
  
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'reliabilityScore' | 'addedDate'>) => void;
  updateClientPayment: (clientId: number | string, amountPaid: number, receiptData: Partial<PaymentReceipt>) => void;
  
  payments: PaymentReceipt[];
  accountingEntries: AccountingEntry[];
  addAccountingEntry: (entry: Omit<AccountingEntry, 'id' | 'ref' | 'status'>) => void;
  
  activeReceipt: PaymentReceipt | null;
  setActiveReceipt: (receipt: PaymentReceipt | null) => void;
  
  selectedClient: Client | null;
  setSelectedClient: (client: Client | null) => void;
  
  isNewCreditModalOpen: boolean;
  setIsNewCreditModalOpen: (open: boolean) => void;

  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_CLIENTS: Client[] = [
  {
    id: 1,
    name: 'Société ABC & Fils',
    phone: '+229 97010203',
    totalDue: 150000,
    status: 'pending',
    reliabilityScore: 92,
    addedDate: '2026-05-10',
    transactions: [
      { id: 101, date: '2026-08-01', desc: '3 Sacs de Riz 50kg', amount: 150000, status: 'pending', dueDate: '2026-08-25' }
    ]
  },
  {
    id: 2,
    name: 'Entreprise BTP XYZ',
    phone: '+225 05040302',
    totalDue: 75000,
    status: 'overdue',
    reliabilityScore: 42,
    addedDate: '2026-06-12',
    transactions: [
      { id: 102, date: '2026-07-15', desc: 'Matériaux & Ciment', amount: 75000, status: 'overdue', dueDate: '2026-08-05' }
    ]
  },
  {
    id: 3,
    name: 'KOFFI Yao Jean',
    phone: '+225 01020304',
    totalDue: 0,
    status: 'paid',
    reliabilityScore: 98,
    addedDate: '2026-04-01',
    transactions: [
      { id: 103, date: '2026-08-01', desc: 'Versement Intégral', amount: 90000, status: 'paid', dueDate: '2026-08-01' }
    ]
  }
];

const INITIAL_PAYMENTS: PaymentReceipt[] = [
  { id: 201, ref: 'REC-2026-881', clientName: 'Société ABC & Fils', clientPhone: '+229 97010203', itemsDesc: 'Acompte Riz 50kg', amount: 150000, date: 'Aujourd\'hui, 09:45', method: 'Wave Mobile Money' },
  { id: 202, ref: 'REC-2026-880', clientName: 'KOFFI Yao Jean', clientPhone: '+225 01020304', itemsDesc: 'Solde Facture', amount: 90000, date: '01 Août 2026', method: 'Orange Money' }
];

const INITIAL_ENTRIES: AccountingEntry[] = [
  { id: 1, date: '2026-08-10', ref: 'FAC-2026-001', code: '701', label: 'Vente Marchandises (Société ABC)', type: 'revenue', amountHT: 150000, vatAmount: 27000, status: 'Validé' },
  { id: 2, date: '2026-08-08', ref: 'ACH-2026-044', code: '601', label: 'Achat Stock Grossiste', type: 'expense', amountHT: 320000, vatAmount: 57600, status: 'Validé' },
  { id: 3, date: '2026-08-05', ref: 'CHG-2026-012', code: '622', label: 'Frais de transport & livraison', type: 'expense', amountHT: 45000, vatAmount: 8100, status: 'Validé' }
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [countryCode, setCountryCodeState] = useState<string>('BJ');
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [payments, setPayments] = useState<PaymentReceipt[]>(INITIAL_PAYMENTS);
  const [accountingEntries, setAccountingEntries] = useState<AccountingEntry[]>(INITIAL_ENTRIES);
  
  const [activeReceipt, setActiveReceipt] = useState<PaymentReceipt | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isNewCreditModalOpen, setIsNewCreditModalOpen] = useState<boolean>(false);

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

  const country = getCountryConfig(countryCode);
  const currency = country.currency;

  const formatAmount = (amount: number) => {
    return formatAfricanCurrency(amount, currency);
  };

  const showToast = (msg: string) => {
    const toast = document.createElement('div');
    toast.style.cssText = "position:fixed;bottom:24px;right:24px;z-index:99999;background:#0F172A;color:#fff;padding:14px 22px;border-radius:12px;font-weight:700;font-size:0.9rem;box-shadow:0 10px 25px rgba(0,0,0,0.3);border-left:4px solid #2563EB;animation:fadeIn 0.3s ease;";
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
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
    localStorage.setItem('ct_clients', JSON.stringify(updated));
    showToast(`Client "${newClient.name}" enregistré avec succès !`);
  };

  const updateClientPayment = (clientId: number | string, amountPaid: number, receiptData: Partial<PaymentReceipt>) => {
    const validAmount = Math.max(0, Number(amountPaid) || 0);
    if (validAmount <= 0) {
      showToast("Veuillez saisir un montant d'encaissement valide.");
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
    localStorage.setItem('ct_clients', JSON.stringify(updatedClients));

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
    localStorage.setItem('ct_payments', JSON.stringify(updatedPayments));

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
    localStorage.setItem('ct_entries', JSON.stringify(updatedEntries));

    setActiveReceipt(newReceipt);
    showToast(`Paiement de ${formatAfricanCurrency(validAmount, currency)} enregistré et reçu généré !`);
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
    localStorage.setItem('ct_entries', JSON.stringify(updated));
    showToast("Écriture comptable ajoutée au journal !");
  };

  return (
    <AppContext.Provider value={{
      country,
      setCountryCode,
      currency,
      formatAmount,
      clients,
      addClient,
      updateClientPayment,
      payments,
      accountingEntries,
      addAccountingEntry,
      activeReceipt,
      setActiveReceipt,
      selectedClient,
      setSelectedClient,
      isNewCreditModalOpen,
      setIsNewCreditModalOpen,
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
