"use client";

import React, { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  ShoppingCart, 
  Plus, 
  PlusCircle, 
  Trash2, 
  Printer, 
  Send, 
  Sparkles, 
  Package, 
  Banknote, 
  Smartphone, 
  CheckCircle2, 
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
  method: string;
  branch: string;
  client: string;
  cashier: string;
}

export default function VentesPage() {
  const { 
    currency, 
    formatAmount, 
    setIsNewCreditModalOpen, 
    currentRole, 
    activeCashier, 
    showToast 
  } = useApp();

  const itemInputRef = useRef<HTMLInputElement | null>(null);

  const [sales, setSales] = useState<DailySaleItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('ct_daily_sales');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Quick inline sale state
  const [itemName, setItemName] = useState('');
  const [qty, setQty] = useState<number>(1);
  const [unitPrice, setUnitPrice] = useState<number | string>('');
  const [method, setMethod] = useState('Espèces');
  const [branch, setBranch] = useState('Boutique Principale (Siège)');
  const [client, setClient] = useState('');

  const numUnitPrice = typeof unitPrice === 'number' ? unitPrice : parseFloat(unitPrice) || 0;
  const lineTotal = (qty || 1) * numUnitPrice;

  // KPIs
  const totalSales = sales.reduce((acc, s) => acc + s.total, 0);
  const totalItemsCount = sales.reduce((acc, s) => acc + s.qty, 0);
  const totalCash = sales.filter(s => s.method === 'Espèces').reduce((acc, s) => acc + s.total, 0);
  const totalDigital = totalSales - totalCash;

  const handleAddSale = () => {
    if (!itemName.trim() || numUnitPrice <= 0 || qty <= 0) {
      showToast("Veuillez renseigner un article et un prix unitaire valide.", "error");
      itemInputRef.current?.focus();
      return;
    }

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newSale: DailySaleItem = {
      id: `sale_${Date.now()}`,
      time: timeStr,
      item: itemName.trim(),
      qty: Number(qty),
      unitPrice: numUnitPrice,
      total: lineTotal,
      method: method,
      branch: branch,
      client: client.trim() || 'Client Comptoir',
      cashier: currentRole === 'cashier' ? (activeCashier?.name || 'Caissier') : 'Gérant (Patron)'
    };

    const updated = [newSale, ...sales];
    setSales(updated);
    try {
      localStorage.setItem('ct_daily_sales', JSON.stringify(updated));
    } catch (err) {
      console.warn("Storage write error", err);
    }

    // Reset line
    setItemName('');
    setQty(1);
    setUnitPrice('');
    setClient('');
    showToast(`Vente enregistrée : ${newSale.item} (${formatAfricanCurrency(newSale.total, currency)}) !`, 'success');

    // Auto focus back to Item input
    setTimeout(() => {
      itemInputRef.current?.focus();
    }, 40);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSale();
    }
  };

  const handleDeleteSale = (id: string) => {
    if (!confirm("Voulez-vous annuler et supprimer cette vente du cahier ?")) return;
    const updated = sales.filter(s => s.id !== id);
    setSales(updated);
    try {
      localStorage.setItem('ct_daily_sales', JSON.stringify(updated));
    } catch (err) {
      console.warn("Storage write error", err);
    }
    showToast("Vente supprimée du journal.", "info");
  };

  const handleClosing = () => {
    alert(`Bilan de clôture 24h :\nTotal Ventes : ${formatAfricanCurrency(totalSales, currency)}\nEspèces en caisse : ${formatAfricanCurrency(totalCash, currency)}\nPaiements mobiles (Wave/MoMo) : ${formatAfricanCurrency(totalDigital, currency)}\n\nLe rapport est prêt à être transmis au patron.`);
  };

  return (
    <div className="space-y-5 pb-20 max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <Sparkles size={14} /> CAHIER DE CAISSE & RECETTES 24H
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ShoppingCart className="text-blue-600" /> Cahier des Ventes du Jour
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Saisissez directement vos ventes dans le tableau ci-dessous. Validez avec <kbd className="bg-slate-200 px-1.5 py-0.5 rounded font-bold text-slate-800">Entrée</kbd> pour enchaîner sans quitter le clavier.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap">
          <button 
            type="button" 
            onClick={() => window.print()}
            className="btn btn-outline border-slate-300 hover:border-slate-400 bg-white text-slate-700 font-bold px-3.5 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition shadow-sm"
          >
            <Printer size={16} /> Imprimer Journal
          </button>
          <button 
            type="button" 
            onClick={handleClosing}
            className="btn bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-emerald-500/20 transition"
          >
            <Send size={16} /> Clôturer & Transmettre
          </button>
        </div>
      </div>

      {/* Row 1: 4 Compact KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 no-print">
        
        {/* KPI 1 : Total Ventes */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-black">
            <ShoppingCart size={20} />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Ventes du Jour</div>
            <div className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
              {formatAfricanCurrency(totalSales, currency)}
            </div>
          </div>
        </div>

        {/* KPI 2 : Articles Vendus */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
            <Package size={20} />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Articles Vendus</div>
            <div className="text-lg sm:text-xl font-black text-emerald-600 mt-0.5">
              {totalItemsCount} article{totalItemsCount > 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* KPI 3 : Espèces Cash */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-black">
            <Banknote size={20} />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Espèces en Caisse</div>
            <div className="text-lg sm:text-xl font-black text-amber-600 mt-0.5">
              {formatAfricanCurrency(totalCash, currency)}
            </div>
          </div>
        </div>

        {/* KPI 4 : Mobile Money & Wave */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
            <Smartphone size={20} />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Mobile Money & Wave</div>
            <div className="text-lg sm:text-xl font-black text-indigo-600 mt-0.5">
              {formatAfricanCurrency(totalDigital, currency)}
            </div>
          </div>
        </div>

      </div>

      {/* Row 2: GRAND TABLEAU DU JOURNAL DE VENTE 24H (TABLEUR AVEC LIGNE ACTIVE INTÉGRÉE) */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-sm">
        
        <div className="max-h-[600px] overflow-y-auto relative">
          <table className="w-full border-collapse text-left text-sm">
            
            {/* Sticky Header with Inline Fast Input Row */}
            <thead className="sticky top-0 z-20 bg-slate-900 text-white shadow-md">
              <tr className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider">
                <th className="py-2.5 px-3 w-20 text-center">Heure</th>
                <th className="py-2.5 px-3 min-w-[220px]">Article / Marchandise <span className="text-blue-400">*</span></th>
                <th className="py-2.5 px-2 w-20 text-center">Qté <span className="text-blue-400">*</span></th>
                <th className="py-2.5 px-3 w-32 text-right">P.U <span className="text-blue-400">*</span></th>
                <th className="py-2.5 px-3 w-36 text-right">Total (Auto)</th>
                <th className="py-2.5 px-3 w-36">Paiement <span className="text-blue-400">*</span></th>
                <th className="py-2.5 px-3 w-40">Boutique</th>
                <th className="py-2.5 px-3 w-36">Client</th>
                <th className="py-2.5 px-3 w-28 text-center no-print">Action</th>
              </tr>

              {/* LIGNE PERMANENTE DE SAISIE RAPIDE DIRECTE (SPREADSHEET ROW) */}
              <tr className="bg-slate-100 text-slate-900 border-b-2 border-blue-600">
                <td className="p-2 text-center">
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-[10px] font-black">
                    Direct ⚡
                  </span>
                </td>
                <td className="p-2">
                  <input
                    ref={itemInputRef}
                    type="text"
                    placeholder="Article vendu (ex: Riz, Huile...)"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full h-9 px-3 bg-white border border-slate-400 focus:border-blue-600 rounded-lg text-xs font-bold shadow-sm outline-none transition"
                  />
                </td>
                <td className="p-2 text-center">
                  <input
                    type="number"
                    min="1"
                    value={qty}
                    onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                    onKeyDown={handleKeyDown}
                    className="w-full h-9 px-2 bg-white border border-slate-400 focus:border-blue-600 rounded-lg text-xs font-black text-center shadow-sm outline-none transition"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full h-9 px-3 bg-white border border-slate-400 focus:border-blue-600 rounded-lg text-xs font-black text-right shadow-sm outline-none transition"
                  />
                </td>
                <td className="p-2 text-right font-black text-blue-600 text-sm">
                  {formatAfricanCurrency(lineTotal, currency)}
                </td>
                <td className="p-2">
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full h-9 px-2 bg-white border border-slate-400 focus:border-blue-600 rounded-lg text-xs font-bold shadow-sm outline-none transition"
                  >
                    <option value="Espèces">💵 Espèces</option>
                    <option value="Wave Direct">🌊 Wave</option>
                    <option value="Orange Money">🟠 Orange</option>
                    <option value="MTN MoMo">🟡 MTN</option>
                    <option value="Moov Money">🔵 Moov</option>
                  </select>
                </td>
                <td className="p-2">
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full h-9 px-2 bg-white border border-slate-400 focus:border-blue-600 rounded-lg text-xs shadow-sm outline-none transition"
                  >
                    <option value="Boutique Principale (Siège)">📍 Siège</option>
                    <option value="Succursale 2">📍 Succursale 2</option>
                    <option value="Point de Vente Marché">📍 Marché</option>
                  </select>
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    placeholder="Client Comptoir"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full h-9 px-3 bg-white border border-slate-400 focus:border-blue-600 rounded-lg text-xs shadow-sm outline-none transition"
                  />
                </td>
                <td className="p-2 text-center no-print">
                  <button
                    type="button"
                    onClick={handleAddSale}
                    className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-lg text-xs flex items-center justify-center gap-1 shadow-md shadow-blue-500/20 transition"
                    title="Enregistrer cette ligne (Touche Entrée)"
                  >
                    <Plus size={14} /> Entrée
                  </button>
                </td>
              </tr>

            </thead>

            {/* Historical Entries Body */}
            <tbody>
              {sales.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-slate-400">
                    <Package size={36} className="mx-auto mb-2 text-slate-300" />
                    <strong className="text-slate-800">Aucune vente enregistrée aujourd'hui</strong>
                    <p className="text-xs text-slate-500 mt-1">Utilisez la première ligne du tableau ci-dessus pour noter votre premier article vendu.</p>
                  </td>
                </tr>
              ) : (
                sales.map((s, idx) => {
                  const isCash = s.method === 'Espèces';
                  const isWave = s.method.includes('Wave');

                  return (
                    <tr 
                      key={s.id}
                      className={`border-b border-slate-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-blue-50/40 transition`}
                    >
                      <td className="py-2.5 px-3 font-mono text-xs text-slate-500 font-bold text-center">{s.time}</td>
                      <td className="py-2.5 px-3">
                        <div className="font-extrabold text-slate-900">{s.item}</div>
                        {s.client && s.client !== 'Client Comptoir' && (
                          <div className="text-xs text-blue-600 font-semibold">Client: {s.client}</div>
                        )}
                      </td>
                      <td className="py-2.5 px-2 text-center font-extrabold text-slate-800">{s.qty}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-600">
                        {formatAfricanCurrency(s.unitPrice, currency)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-black text-blue-600 text-sm">
                        {formatAfricanCurrency(s.total, currency)}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-black ${
                          isCash 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : isWave 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {s.method}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-xs text-slate-700">
                        <div className="font-bold">{s.branch}</div>
                        <div className="text-[10px] text-slate-400">Par: {s.cashier}</div>
                      </td>
                      <td className="py-2.5 px-3 text-xs text-slate-600">
                        {s.client || 'Client Comptoir'}
                      </td>
                      <td className="py-2.5 px-3 text-center no-print">
                        <button
                          type="button"
                          onClick={() => handleDeleteSale(s.id)}
                          className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition"
                          title="Supprimer cette ligne"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}

              {/* Bottom Consolidated Total Row */}
              {sales.length > 0 && (
                <tr className="bg-slate-100 border-t-2 border-slate-300 font-black">
                  <td colSpan={2} className="py-3 px-3.5 text-slate-900 text-xs sm:text-sm">
                    TOTAL GÉNÉRAL DU JOUR ({sales.length} ventes)
                  </td>
                  <td className="py-3 px-2 text-center text-slate-900 text-sm">{totalItemsCount}</td>
                  <td></td>
                  <td className="py-3 px-3 text-right text-blue-600 text-base">
                    {formatAfricanCurrency(totalSales, currency)}
                  </td>
                  <td colSpan={4} className="py-3 px-3 text-xs text-slate-600">
                    Espèces : <strong className="text-slate-900">{formatAfricanCurrency(totalCash, currency)}</strong> • Électronique : <strong className="text-slate-900">{formatAfricanCurrency(totalDigital, currency)}</strong>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}



