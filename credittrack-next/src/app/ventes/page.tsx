"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  BookOpen,
  Calendar, 
  Clock, 
  Printer, 
  FileSpreadsheet, 
  Send, 
  Search, 
  Mic, 
  MicOff,
  Check, 
  Edit3, 
  Trash2, 
  ShoppingCart, 
  Banknote, 
  Smartphone, 
  DollarSign, 
  ShieldCheck, 
  Settings, 
  X, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  User,
  Plus,
  RefreshCw
} from 'lucide-react';
import { formatAfricanCurrency } from '@/lib/africanCountries';

interface DailySaleItem {
  id: string;
  time: string;
  item: string;
  qty: number;
  unitPrice: number;
  total: number;
  method: 'Espèces' | 'Wave' | 'Mobile Money' | 'Carte' | 'Crédit';
  client: string;
  cashier?: string;
  branch?: string;
}

export default function VentesPage() {
  const { currency, showToast, activeCashier, currentRole } = useApp();

  // Reference for the article input to auto-refocus
  const itemInputRef = useRef<HTMLInputElement | null>(null);
  const qtyInputRef = useRef<HTMLInputElement | null>(null);
  const priceInputRef = useRef<HTMLInputElement | null>(null);

  // Live real-time clock and dynamic real date
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${h}:${m}:${s}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Pure Real Data Sales state (Uniquement les ventes réelles enregistrées)
  const [sales, setSales] = useState<DailySaleItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('ct_daily_sales_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(s => s && s.id && !String(s.id).startsWith('sale_1') && !String(s.id).startsWith('sale_2') && !String(s.id).startsWith('sale_3') && !String(s.id).startsWith('sale_4') && !String(s.id).startsWith('sale_5') && !String(s.id).startsWith('sale_6') && !String(s.id).startsWith('sale_7') && !String(s.id).startsWith('sale_8') && !String(s.id).startsWith('sale_9') && !String(s.id).startsWith('sale_10'));
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  const saveSales = (newSales: DailySaleItem[]) => {
    setSales(newSales);
    try {
      localStorage.setItem('ct_daily_sales_v2', JSON.stringify(newSales));
    } catch (e) {
      console.error("Failed to save sales to storage", e);
    }
  };

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  // Active Line State (Nouvelle vente)
  const [itemName, setItemName] = useState('');
  const [qty, setQty] = useState<number>(1);
  const [unitPrice, setUnitPrice] = useState<number | string>('');
  const [method, setMethod] = useState<'Espèces' | 'Wave' | 'Mobile Money' | 'Carte' | 'Crédit'>('Espèces');
  const [client, setClient] = useState('');
  const [isListening, setIsListening] = useState(false);

  // Edit Modal State
  const [editingSale, setEditingSale] = useState<DailySaleItem | null>(null);
  // Closing Modal State
  const [isClosingModalOpen, setIsClosingModalOpen] = useState(false);
  // Settings Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Calculations
  const parsedPrice = typeof unitPrice === 'number' ? unitPrice : (parseFloat(unitPrice) || 0);
  const currentLineTotal = Math.max(1, qty) * parsedPrice;

  // KPI Calculations
  const totalSalesAmount = sales.reduce((sum, s) => sum + s.total, 0);
  const totalCashAmount = sales.filter(s => s.method === 'Espèces').reduce((sum, s) => sum + s.total, 0);
  const totalMobileAmount = sales.filter(s => s.method === 'Wave' || s.method === 'Mobile Money').reduce((sum, s) => sum + s.total, 0);
  const totalItemsCount = sales.reduce((sum, s) => sum + s.qty, 0);
  const totalSalesCount = sales.length;

  const cashPercent = totalSalesAmount > 0 ? ((totalCashAmount / totalSalesAmount) * 100).toFixed(1) : '0.0';
  const mobilePercent = totalSalesAmount > 0 ? ((totalMobileAmount / totalSalesAmount) * 100).toFixed(1) : '0.0';

  // Voice dictation handler
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      showToast("La reconnaissance vocale n'est pas prise en charge par ce navigateur.", "info");
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'fr-FR';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        showToast("🎙️ Parlez maintenant (ex: 2 sacs de riz 50kg à 25000)", "info");
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setItemName(transcript);
          showToast(`Dicté : "${transcript}"`, "success");
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.warn("Speech recognition error:", err);
      setIsListening(false);
    }
  };

  // Add Sale Handler — Fast Inline
  const handleAddSale = () => {
    if (!itemName.trim()) {
      showToast("Veuillez saisir la désignation de l'article.", "error");
      itemInputRef.current?.focus();
      return;
    }

    if (parsedPrice <= 0) {
      showToast("Veuillez indiquer un prix unitaire supérieur à 0.", "error");
      priceInputRef.current?.focus();
      return;
    }

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const newSale: DailySaleItem = {
      id: `sale_${Date.now()}`,
      time: timeStr,
      item: itemName.trim(),
      qty: Math.max(1, Number(qty) || 1),
      unitPrice: parsedPrice,
      total: currentLineTotal,
      method: method,
      client: client.trim() || 'Client comptoir',
      cashier: activeCashier?.name || (currentRole === 'cashier' ? 'Caissier' : 'Gérant'),
      branch: 'Boutique Principale'
    };

    const updated = [newSale, ...sales];
    saveSales(updated);

    // Reset inputs
    setItemName('');
    setQty(1);
    setUnitPrice('');
    setClient('');
    
    showToast(`✓ Vente ajoutée : ${newSale.item} (${formatAfricanCurrency(newSale.total, currency)})`, 'success');

    // Refocus immediately on Item Name input for uninterrupted typing
    setTimeout(() => {
      itemInputRef.current?.focus();
    }, 30);
  };

  // Keyboard shortcut listener
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSale();
    }
  };

  // Delete sale
  const handleDeleteSale = (id: string) => {
    if (!confirm("Voulez-vous supprimer cette ligne de vente ?")) return;
    const updated = sales.filter(s => s.id !== id);
    saveSales(updated);
    showToast("Vente retirée du cahier.", "info");
  };

  // Save edited sale
  const handleUpdateSale = () => {
    if (!editingSale) return;
    const updated = sales.map(s => s.id === editingSale.id ? {
      ...editingSale,
      total: editingSale.qty * editingSale.unitPrice
    } : s);
    saveSales(updated);
    setEditingSale(null);
    showToast("Vente mise à jour avec succès.", "success");
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (sales.length === 0) {
      showToast("Aucune vente à exporter.", "info");
      return;
    }

    const headers = ["Heure", "Article / Designation", "Quantite", "Prix Unitaire", "Montant Total", "Mode de Paiement", "Client"];
    const rows = sales.map(s => [
      `"${s.time}"`,
      `"${s.item.replace(/"/g, '""')}"`,
      s.qty,
      s.unitPrice,
      s.total,
      `"${s.method}"`,
      `"${(s.client || 'Client comptoir').replace(/"/g, '""')}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Cahier_Ventes_${currentDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Fichier Excel (CSV) téléchargé !", "success");
  };

  // Print journal
  const handlePrint = () => {
    window.print();
  };

  // Filtered sales
  const filteredSales = sales.filter(s => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return s.item.toLowerCase().includes(query) || 
           s.client.toLowerCase().includes(query) || 
           s.method.toLowerCase().includes(query) ||
           s.time.includes(query);
  });

  const displayedSales = isExpanded ? filteredSales : filteredSales.slice(0, 10);
  const remainingCount = Math.max(0, filteredSales.length - 10);

  return (
    <div className="w-full max-w-[1400px] mx-auto px-2 sm:px-4 py-4 space-y-5">
      
      {/* 1. TOP BAR : HEADER TITLE & CONTROLS */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm no-print">
        
        {/* Title + Status + Date Controls */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl sm:text-3xl text-blue-600 font-extrabold flex items-center">
                <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 mr-1.5 inline-block text-blue-600 stroke-[2.2]" />
              </span>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
                Cahier des Ventes du Jour
              </h1>
            </div>
            
            {/* 24h Actif Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              24h Actif
            </span>
          </div>

          {/* Date Selector + Quick Reset + Live Digital Clock */}
          <div className="flex items-center gap-2.5 sm:gap-4 flex-wrap text-xs sm:text-sm text-slate-600 pt-0.5">
            
            {/* Date Picker */}
            <div className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl px-3 py-1.5 transition">
              <Calendar className="w-4 h-4 text-slate-500" />
              <input 
                type="date"
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
                className="bg-transparent text-slate-800 font-bold text-xs sm:text-sm outline-none cursor-pointer"
              />
            </div>

            {/* Aujourd'hui Button */}
            <button 
              type="button"
              onClick={() => {
                const today = new Date().toISOString().split('T')[0];
                setCurrentDate(today);
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition border border-slate-200 shadow-sm"
            >
              Aujourd&apos;hui
            </button>

            {/* Real-time Clock */}
            <div className="flex items-center gap-1.5 text-slate-500 text-xs sm:text-sm font-medium pl-1">
              <span>Heure actuelle :</span>
              <span className="font-mono font-extrabold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                {currentTime || '12:35:23'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 w-full lg:w-auto flex-wrap justify-start lg:justify-end">
          
          {/* Print Button */}
          <button 
            type="button"
            onClick={handlePrint}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold rounded-xl text-xs sm:text-sm shadow-sm transition active:scale-95"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Imprimer</span>
          </button>

          {/* Excel CSV Button */}
          <button 
            type="button"
            onClick={handleExportCSV}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-300 hover:border-emerald-300 font-bold rounded-xl text-xs sm:text-sm shadow-sm transition active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Excel (CSV)</span>
          </button>

          {/* Close Register Button */}
          <button 
            type="button"
            onClick={() => setIsClosingModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>Clôturer le Cahier</span>
          </button>

        </div>
      </div>

      {/* 2. KPI CARDS (4 LARGE CLEAN CARDS ON 1 ROW) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 no-print">
        
        {/* KPI 1 : RECETTES DU JOUR */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 transition hover:shadow-md">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <ShoppingCart className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Recettes du jour
            </div>
            <div className="text-xl sm:text-2xl font-black text-blue-600 tracking-tight truncate mt-0.5">
              {formatAfricanCurrency(totalSalesAmount, currency)}
            </div>
            <div className="text-xs font-semibold text-slate-400 mt-0.5">
              {totalSalesCount} vente{totalSalesCount > 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* KPI 2 : ESPÈCES CAISSE */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 transition hover:shadow-md">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Banknote className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Espèces Caisse
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-600 tracking-tight truncate mt-0.5">
              {formatAfricanCurrency(totalCashAmount, currency)}
            </div>
            <div className="text-xs font-semibold text-slate-400 mt-0.5">
              {cashPercent}% du total
            </div>
          </div>
        </div>

        {/* KPI 3 : MOBILE MONEY */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 transition hover:shadow-md">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Smartphone className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Mobile Money
            </div>
            <div className="text-xl sm:text-2xl font-black text-purple-600 tracking-tight truncate mt-0.5">
              {formatAfricanCurrency(totalMobileAmount, currency)}
            </div>
            <div className="text-xs font-semibold text-slate-400 mt-0.5">
              {mobilePercent}% du total
            </div>
          </div>
        </div>

        {/* KPI 4 : VENTES ENREGISTRÉES */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 transition hover:shadow-md">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Ventes enregistrées
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-600 tracking-tight truncate mt-0.5">
              {totalSalesCount}
            </div>
            <div className="text-xs font-semibold text-slate-400 mt-0.5">
              Articles vendus : {totalItemsCount}
            </div>
          </div>
        </div>

      </div>

      {/* 3. MAIN WORKSPACE CARD : LE JOURNAL DES VENTES (TABLEAU GRAND FORMAT) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden flex flex-col">
        
        {/* Card Header with Title & Search Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3.5 bg-slate-50/50 no-print">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-blue-600 stroke-[2.2]" />
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              Journal des Ventes <span className="text-xs sm:text-sm font-semibold text-slate-500">(Saisie directe sur la ligne bleue)</span>
            </h2>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Rechercher un article, client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-white border border-slate-300 focus:border-blue-500 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none transition shadow-sm"
            />
            {searchQuery && (
              <button 
                type="button" 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Table Container */}
        <div className="overflow-x-auto max-h-[550px] overflow-y-auto">
          <table className="w-full text-left border-collapse min-w-[950px]">
            
            {/* Dark Sticky Table Header */}
            <thead className="sticky top-0 z-10 bg-[#0F172A] text-white shadow-sm">
              <tr className="text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                <th className="py-3 px-3.5 w-24 text-center">Heure</th>
                <th className="py-3 px-4 min-w-[320px] sm:min-w-[400px]">Article / Désignation Vendue</th>
                <th className="py-3 px-2 w-16 text-center">Qté</th>
                <th className="py-3 px-3 w-32 text-right">Prix Unit. ({currency})</th>
                <th className="py-3 px-3 w-36 text-right">Montant Total</th>
                <th className="py-3 px-3 w-36 text-center">Paiement</th>
                <th className="py-3 px-3 w-40">Client (Optionnel)</th>
                <th className="py-3 px-3 w-24 text-center no-print">Actions</th>
              </tr>
            </thead>

            {/* Table Rows */}
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm font-medium text-slate-800">
              {displayedSales.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="max-w-sm mx-auto space-y-2">
                      <BookOpen className="w-10 h-10 mx-auto text-slate-300 stroke-[1.5]" />
                      <div className="font-extrabold text-slate-700 text-sm">
                        {searchQuery ? "Aucune vente ne correspond à votre recherche" : "Le cahier des ventes est vide pour le moment"}
                      </div>
                      <p className="text-xs text-slate-400">
                        {searchQuery ? "Essayez un autre mot-clé ou effacez la recherche." : "Utilisez la ligne bleue de saisie ci-dessous pour enregistrer votre première vente."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                displayedSales.map((sale, index) => {
                  const isCash = sale.method === 'Espèces';
                  const isWave = sale.method === 'Wave';
                  const isMobile = sale.method === 'Mobile Money';

                  return (
                    <tr 
                      key={sale.id}
                      className={`hover:bg-blue-50/50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                      }`}
                    >
                      {/* Heure */}
                      <td className="py-3 px-3.5 text-center font-mono text-xs font-semibold text-slate-500">
                        {sale.time}
                      </td>

                      {/* Article / Désignation Vendue (WIDE & MULTILINE FRIENDLY) */}
                      <td className="py-3 px-4">
                        <div className="font-extrabold text-slate-900 leading-snug whitespace-normal break-words max-w-xl">
                          {sale.item}
                        </div>
                      </td>

                      {/* Qté */}
                      <td className="py-3 px-2 text-center font-bold text-slate-800">
                        {sale.qty}
                      </td>

                      {/* Prix Unitaire */}
                      <td className="py-3 px-3 text-right font-medium text-slate-600 font-mono">
                        {sale.unitPrice.toLocaleString('fr-FR')}
                      </td>

                      {/* Montant Total */}
                      <td className="py-3 px-3 text-right font-black text-slate-900 font-mono">
                        {sale.total.toLocaleString('fr-FR')}
                      </td>

                      {/* Paiement Badge */}
                      <td className="py-3 px-3 text-center">
                        {isCash && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            💵 Espèces
                          </span>
                        )}
                        {isWave && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                            📱 Wave
                          </span>
                        )}
                        {isMobile && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            📱 Mobile Money
                          </span>
                        )}
                        {!isCash && !isWave && !isMobile && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            {sale.method}
                          </span>
                        )}
                      </td>

                      {/* Client */}
                      <td className="py-3 px-3 text-slate-600">
                        <span className="truncate block max-w-[180px]" title={sale.client}>
                          {sale.client || 'Client comptoir'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-center no-print">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => setEditingSale(sale)}
                            className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                            title="Modifier cette vente"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSale(sale.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                            title="Supprimer cette vente"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* View More / Expand Toggle */}
        {remainingCount > 0 && !isExpanded && (
          <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center no-print">
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition py-1 px-3 rounded-lg hover:bg-blue-50"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Voir plus ({remainingCount} lignes)</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {isExpanded && filteredSales.length > 10 && (
          <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center no-print">
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-800 transition py-1 px-3 rounded-lg hover:bg-slate-200"
            >
              <span>Réduire l&apos;affichage</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 4. THE LIVE FAST INLINE ENTRY ROW (XXL ULTRA-SPACIOUS VERTICAL TEXTAREA & TAC QUICK CHIPS) */}
        <div className="p-4 sm:p-5 bg-blue-50/50 border-t-2 border-blue-600 no-print rounded-b-2xl">
          
          {/* Header Banner */}
          <div className="flex items-center justify-between gap-2 text-blue-700 text-xs font-extrabold uppercase tracking-wide mb-3">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>NOUVELLE VENTE — Saisissez ou choisissez l&apos;article dans la liste</span>
            </div>
            <span className="hidden sm:inline-block text-[11px] font-bold text-blue-600 bg-white px-2.5 py-1 rounded-md border border-blue-200 shadow-sm">
              Validation directe : <strong className="text-blue-700 font-black">Entrée ↵</strong>
            </span>
          </div>

          {/* Étage 1 : CHAMP ARTICLE GÉANT RECTANGULAIRE VERTICAL (TEXTAREA HAUT ET CONFORTABLE) */}
          <div className="flex items-start gap-3 mb-3">
            
            {/* Timestamp Badge */}
            <div className="hidden sm:flex items-center justify-center px-3.5 py-3 bg-white border-2 border-slate-300 rounded-xl font-mono text-xs font-black text-slate-800 shrink-0 shadow-sm">
              {currentTime || '13:14:24'}
            </div>

            {/* GIGANTIC VERTICAL ARTICLE TEXTAREA WITH BALANCED WIDTH */}
            <div className="relative flex-1 max-w-[680px] w-full">
              <textarea 
                ref={itemInputRef as any}
                rows={3}
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddSale();
                  }
                }}
                placeholder="Écrivez ici l'article ou la marchandise vendue en détail...&#10;(ex: Sac de riz 50 kg / Bidon d'huile 5L / Savon en poudre OMO 1kg...)"
                className="w-full pl-4 pr-12 py-3 bg-white border-2 border-blue-600 focus:ring-4 focus:ring-blue-100 rounded-xl text-sm font-black text-slate-900 placeholder-slate-400 shadow-md shadow-blue-500/10 outline-none resize-none h-[105px] min-h-[105px] leading-relaxed transition"
              />
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`absolute right-3 top-3 p-2 rounded-lg transition ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                }`}
                title="Dicter l'article à la voix"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>

          </div>

          {/* Étage 2 : BARRE DE SÉLECTION RAPIDE "TAC !" (ARTICLES FRÉQUENTS) */}
          <div className="mb-3.5 p-2.5 bg-white/90 border border-blue-200 rounded-xl">
            <div className="text-[11px] font-black text-blue-800 uppercase tracking-wider mb-2">
              ⚡ Ajout rapide &quot;TAC&quot; — Cliquez sur un article fréquent :
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {[
                { name: 'Sac de Riz 50kg — Parfumé Supérieur', price: '24500', icon: '🌾' },
                { name: 'Huile Végétale Dinor 5L', price: '6500', icon: '🛢️' },
                { name: 'Carton Spaghetti Maman 500g', price: '7000', icon: '🍝' },
                { name: 'Sucre Blanc 1kg St Louis', price: '900', icon: '🍬' },
                { name: 'Savon OMO 1kg Poudre', price: '1200', icon: '🧼' },
                { name: 'Lait Bonnet Rouge 410g', price: '600', icon: '🥛' },
                { name: 'Pack Eau Minérale 1.5L', price: '2200', icon: '💧' },
              ].map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setItemName(p.name);
                    setUnitPrice(p.price);
                    setQty(1);
                    priceInputRef.current?.focus();
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-blue-50 border border-blue-200 hover:border-blue-400 text-slate-800 text-xs font-bold rounded-lg shadow-xs transition active:scale-95 cursor-pointer"
                >
                  <span>{p.icon} {p.name.split('—')[0]}</span>
                  <span className="text-blue-600 font-extrabold">({parseInt(p.price).toLocaleString('fr-FR')} F)</span>
                </button>
              ))}
            </div>
          </div>

          {/* Étage 3 : DÉTAILS DU PRIX, QUANTITÉ, MODE & VALIDATION */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            
            {/* QTY INPUT */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 shadow-sm">
              <span className="text-[11px] font-black text-slate-500 uppercase">Qté</span>
              <input 
                ref={qtyInputRef}
                type="number"
                min="1"
                value={qty}
                onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                onKeyDown={handleKeyDown}
                className="w-12 py-1 text-center font-black text-sm text-slate-900 bg-transparent outline-none"
              />
            </div>

            {/* UNIT PRICE INPUT */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-xl px-3 py-1.5 flex-1 min-w-[130px] max-w-[200px] shadow-sm">
              <span className="text-[11px] font-black text-slate-500 uppercase">P.U.</span>
              <input 
                ref={priceInputRef}
                type="number"
                min="0"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="0"
                className="w-full py-1 text-right font-black text-sm text-slate-900 bg-transparent outline-none"
              />
            </div>

            {/* TOTAL PREVIEW */}
            <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 bg-blue-100 border border-blue-200 rounded-xl min-w-[140px] shadow-sm">
              <span className="text-[11px] font-black text-blue-800 uppercase">Total :</span>
              <span className="font-mono text-sm font-black text-blue-900">
                {currentLineTotal > 0 ? `${currentLineTotal.toLocaleString('fr-FR')} ${currency}` : `0 ${currency}`}
              </span>
            </div>

            {/* PAYMENT METHOD DROPDOWN */}
            <div className="min-w-[140px] flex-1 max-w-[180px]">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as any)}
                onKeyDown={handleKeyDown}
                className="w-full py-2.5 px-3 bg-white border border-slate-300 focus:border-blue-600 rounded-xl text-xs sm:text-sm font-bold text-slate-800 shadow-sm outline-none transition cursor-pointer"
              >
                <option value="Espèces">💵 Espèces</option>
                <option value="Wave">📱 Wave</option>
                <option value="Mobile Money">📱 Mobile Money</option>
                <option value="Carte">💳 Carte</option>
                <option value="Crédit">🤝 Crédit</option>
              </select>
            </div>

            {/* OPTIONAL CLIENT INPUT */}
            <div className="relative min-w-[160px] flex-1 max-w-[220px]">
              <input 
                type="text"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Client (optionnel)"
                className="w-full pl-3 pr-8 py-2.5 bg-white border border-slate-300 focus:border-blue-600 rounded-xl text-xs sm:text-sm font-bold text-slate-800 placeholder-slate-400 shadow-sm outline-none transition"
              />
              <User className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* BLUE SUBMIT BUTTON (CHECKMARK + TEXT) */}
            <button
              type="button"
              onClick={handleAddSale}
              className="h-10 px-5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shrink-0 shadow-md shadow-blue-600/30 transition cursor-pointer"
              title="Valider et enregistrer (Touche Entrée)"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Valider (Entrée)</span>
            </button>

          </div>
        </div>

      </div>

      {/* 5. BOTTOM BAR : SYNCHRO & KEYBOARD SHORTCUTS */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 px-2 text-xs text-slate-500 no-print">
        
        {/* Sync status */}
        <div className="flex items-center gap-2 text-slate-600 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Toutes les ventes sont sauvegardées et synchronisées en direct.</span>
        </div>

        {/* Shortcuts & Settings */}
        <div className="flex items-center gap-3 flex-wrap justify-end">
          <div>
            Raccourcis : <span className="font-bold text-blue-600">Entrée</span> = Valider • <span className="font-bold text-blue-600">Shift + Entrée</span> = Nouvelle ligne
          </div>
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition"
            title="Options du cahier"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* MODAL : EDIT SALE */}
      {editingSale && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-600" /> Modifier la ligne de vente
              </h3>
              <button 
                type="button" 
                onClick={() => setEditingSale(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Article / Désignation</label>
                <textarea 
                  value={editingSale.item}
                  onChange={(e) => setEditingSale({ ...editingSale, item: e.target.value })}
                  rows={2}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Quantité</label>
                  <input 
                    type="number"
                    min="1"
                    value={editingSale.qty}
                    onChange={(e) => setEditingSale({ ...editingSale, qty: Math.max(1, parseInt(e.target.value) || 1) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-black text-slate-900 outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Prix Unitaire ({currency})</label>
                  <input 
                    type="number"
                    min="0"
                    value={editingSale.unitPrice}
                    onChange={(e) => setEditingSale({ ...editingSale, unitPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-black text-slate-900 outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Mode de Paiement</label>
                  <select
                    value={editingSale.method}
                    onChange={(e) => setEditingSale({ ...editingSale, method: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-blue-600"
                  >
                    <option value="Espèces">💵 Espèces</option>
                    <option value="Wave">📱 Wave</option>
                    <option value="Mobile Money">📱 Mobile Money</option>
                    <option value="Carte">💳 Carte</option>
                    <option value="Crédit">🤝 Crédit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Client</label>
                  <input 
                    type="text"
                    value={editingSale.client}
                    onChange={(e) => setEditingSale({ ...editingSale, client: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-xl flex justify-between items-center">
                <span className="text-xs font-bold text-blue-800">Montant recalculé :</span>
                <span className="text-base font-black text-blue-900 font-mono">
                  {formatAfricanCurrency(editingSale.qty * editingSale.unitPrice, currency)}
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button 
                type="button" 
                onClick={() => setEditingSale(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition"
              >
                Annuler
              </button>
              <button 
                type="button" 
                onClick={handleUpdateSale}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-sm transition shadow-md shadow-blue-600/20"
              >
                Enregistrer les modifications
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL : CLÔTURE DU CAHIER */}
      {isClosingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  ✓
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  Rapport de Clôture du Cahier
                </h3>
              </div>
              <button 
                type="button" 
                onClick={() => setIsClosingModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between text-slate-600 text-xs font-semibold">
                  <span>Date du journal :</span>
                  <span className="font-bold text-slate-800">{currentDate}</span>
                </div>
                <div className="flex justify-between text-slate-600 text-xs font-semibold">
                  <span>Nombre de ventes :</span>
                  <span className="font-bold text-slate-800">{totalSalesCount} ventes ({totalItemsCount} articles)</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between font-black text-base text-slate-900">
                  <span>Total Recettes :</span>
                  <span className="text-blue-600">{formatAfricanCurrency(totalSalesAmount, currency)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="text-[11px] font-bold text-amber-800 uppercase">Espèces en Caisse</div>
                  <div className="text-base font-black text-amber-900 mt-1">
                    {formatAfricanCurrency(totalCashAmount, currency)}
                  </div>
                  <div className="text-[10px] text-amber-700 mt-0.5">{cashPercent}% du total</div>
                </div>

                <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="text-[11px] font-bold text-purple-800 uppercase">Mobile Money / Wave</div>
                  <div className="text-base font-black text-purple-900 mt-1">
                    {formatAfricanCurrency(totalMobileAmount, currency)}
                  </div>
                  <div className="text-[10px] text-purple-700 mt-0.5">{mobilePercent}% du total</div>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button 
                type="button" 
                onClick={() => {
                  window.print();
                  setIsClosingModalOpen(false);
                }}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer le Bilan & Clôturer</span>
              </button>

              <button 
                type="button" 
                onClick={() => setIsClosingModalOpen(false)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL : SETTINGS & DATA RESET */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-slate-700" /> Options du Cahier
              </h3>
              <button 
                type="button" 
                onClick={() => setIsSettingsOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <button
                type="button"
                onClick={() => {
                  if (confirm("Attention : Voulez-vous vider toutes les ventes du cahier d'aujourd'hui ?")) {
                    saveSales([]);
                    setIsSettingsOpen(false);
                    showToast("Le cahier des ventes a été réinitialisé à zéro.", "info");
                  }
                }}
                className="w-full p-3 text-left border border-red-200 hover:bg-red-50 rounded-xl transition flex items-center justify-between text-red-600"
              >
                <div>
                  <div className="font-bold">Vider le cahier d&apos;aujourd&apos;hui</div>
                  <div className="text-xs text-red-400">Efface toutes les lignes enregistrées</div>
                </div>
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <button 
              type="button" 
              onClick={() => setIsSettingsOpen(false)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition mt-2"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
