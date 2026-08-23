"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useApp } from '@/context/AppContext';
import { 
  User, 
  Package, 
  Calendar, 
  BadgeDollarSign, 
  ShoppingCart, 
  CreditCard, 
  ShieldCheck, 
  FileText, 
  Trash2, 
  Check, 
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { formatAfricanCurrency } from '@/lib/africanCountries';
import { getCountryPaymentMethods } from '@/lib/countryPaymentMethods';

interface ProductItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export default function NewCreditSalePage() {
  const { clients, addClient, showToast, currency, country } = useApp();
  const availablePaymentMethods = getCountryPaymentMethods(country);
  const [loading, setLoading] = useState(false);

  // Client Selection / Form State
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [isNewClientInline, setIsNewClientInline] = useState<boolean>(false);
  const [newClientData, setNewClientData] = useState({
    name: '',
    phone: '',
    cni: ''
  });

  // Financial & Due Date State
  const [paymentMethod, setPaymentMethod] = useState('Espèces (Paiement physique en boutique)');
  const [paymentAccount, setPaymentAccount] = useState('');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [guarantorName, setGuarantorName] = useState('');
  const [guarantorPhone, setGuarantorPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Dynamic Product Items (Initialized with ONE blank line - ZERO demo data)
  const [items, setItems] = useState<ProductItem[]>([
    { id: '1', name: '', quantity: 1, unitPrice: 0 }
  ]);

  // Handle Item row updates
  const handleItemChange = (index: number, field: keyof ProductItem, value: any) => {
    const updated = [...items];
    if (field === 'quantity' || field === 'unitPrice') {
      const num = parseFloat(value) || 0;
      updated[index] = { ...updated[index], [field]: num };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setItems(updated);
  };

  const addRow = () => {
    setItems([
      ...items,
      { id: Math.random().toString(36).substring(2, 9), name: '', quantity: 1, unitPrice: 0 }
    ]);
  };

  const removeRow = (index: number) => {
    if (items.length <= 1) {
      setItems([{ id: '1', name: '', quantity: 1, unitPrice: 0 }]);
      return;
    }
    setItems(items.filter((_, i) => i !== index));
  };

  // Financial calculations
  const totalGrossAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const totalArticlesCount = items.reduce((sum, item) => sum + (item.name.trim() ? item.quantity : 0), 0);

  // Format Due Date for KPI
  const formattedDueDate = dueDate ? dueDate.split('-').reverse().join('/') : '--/--/----';

  // Format Payment method short
  const formattedPaymentMethod = paymentMethod.includes('Espèces') 
    ? 'Espèces' 
    : paymentMethod.includes('Wave') 
    ? 'Wave Money' 
    : paymentMethod.includes('Orange') 
    ? 'Orange Money' 
    : paymentMethod.includes('MTN') 
    ? 'MTN MoMo' 
    : paymentMethod;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let clientName = '';
    let clientPhone = '';

    if (isNewClientInline || selectedClientId === 'NEW') {
      if (!newClientData.name.trim()) {
        alert("Veuillez saisir le nom du client.");
        return;
      }
      clientName = newClientData.name.trim();
      clientPhone = newClientData.phone.trim();
    } else if (selectedClientId) {
      const existing = clients.find(c => String(c.id) === selectedClientId);
      if (existing) {
        clientName = existing.name;
        clientPhone = existing.phone;
      }
    } else {
      alert("Veuillez sélectionner un client existant ou créer un nouveau client.");
      return;
    }

    setLoading(true);

    try {
      const itemsListFormatted = items
        .filter(it => it.name.trim())
        .map(it => `• ${it.name} (Qté: ${it.quantity} × ${formatAfricanCurrency(it.unitPrice, currency)}) = ${formatAfricanCurrency(it.quantity * it.unitPrice, currency)}`)
        .join('\n');

      const fullDescription = [
        `=== VENTE À CRÉDIT ===`,
        itemsListFormatted || 'Articles divers',
        notes ? `\nNotes: ${notes}` : '',
        paymentAccount ? `Compte Paiement: ${paymentAccount}` : '',
        guarantorName ? `Garant: ${guarantorName} (${guarantorPhone})` : ''
      ].filter(Boolean).join('\n');

      let clientId = selectedClientId;
      if (isNewClientInline || selectedClientId === 'NEW') {
        const { data: clientData } = await supabase
          .from('clients')
          .insert([{
            name: clientName,
            phone: clientPhone,
            cni: newClientData.cni.trim(),
            total_due: totalGrossAmount,
            status: totalGrossAmount > 0 ? 'pending' : 'paid'
          }])
          .select()
          .single();

        if (clientData?.id) clientId = clientData.id;
      }

      if (clientId && clientId !== 'NEW') {
        await supabase
          .from('credits')
          .insert([{
            client_id: clientId,
            amount: totalGrossAmount,
            due_date: dueDate,
            description: fullDescription,
            guarantor_name: guarantorName.trim(),
            guarantor_phone: guarantorPhone.trim()
          }]);
      }

      addClient({
        name: clientName,
        phone: clientPhone,
        totalDue: totalGrossAmount,
        status: totalGrossAmount > 0 ? 'pending' : 'paid'
      });

      if (showToast) {
        showToast("Vente à crédit enregistrée avec succès !", "success");
      }

      window.location.href = '/credit';
    } catch (err: any) {
      console.error("Erreur enregistrement crédit:", err);
      alert("Erreur lors de l'enregistrement: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 pb-20">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <ShoppingCart className="text-blue-600 w-7 h-7" />
            <span>Facture de Vente à Crédit</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Enregistrement direct en 1 seul tableau unifié (Client + Articles + Échéance + Garant)</p>
        </div>

        <Link 
          href="/credit" 
          className="btn btn-outline bg-white border-slate-300 text-slate-700 hover:text-slate-900 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shadow-sm"
        >
          <span>←</span> Retour au cahier des crédits
        </Link>
      </div>

      {/* LE GRAND TABLEAU UNIFIÉ TOUT-EN-UN */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border-2 border-slate-300 shadow-md overflow-hidden">
        
        {/* ÉTAGE 1 : EN-TÊTE INTÉGRÉ DU TABLEAU (CLIENT & ÉCHÉANCE SUR LA MÊME LIGNE) */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 border-b border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Colonne Client (7 cols) */}
            <div className="md:col-span-7">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-2">
                <User size={15} className="text-blue-400" />
                <span>1. Client Bénéficiaire du Crédit *</span>
              </label>
              
              <div className="flex items-center gap-2">
                <select 
                  value={selectedClientId}
                  onChange={(e) => {
                    setSelectedClientId(e.target.value);
                    if (e.target.value === 'NEW') setIsNewClientInline(true);
                    else setIsNewClientInline(false);
                  }}
                  className="flex-1 h-10 px-3 rounded-xl text-sm font-bold text-slate-900 bg-white border-2 border-slate-300 outline-none cursor-pointer"
                >
                  <option value="">-- Choisir un client existant --</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.phone || 'Pas de tél'})</option>
                  ))}
                </select>

                <button 
                  type="button"
                  onClick={() => setIsNewClientInline(!isNewClientInline)}
                  className={`h-10 px-3.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition shrink-0 ${
                    isNewClientInline 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700'
                  }`}
                >
                  <Plus size={15} />
                  <span>{isNewClientInline ? 'Fermer' : '+ Nouveau'}</span>
                </button>
              </div>

              {/* Formulaire Nouveau Client rétractable */}
              {isNewClientInline && (
                <div className="mt-3 p-3 bg-slate-800/90 border border-slate-700 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-2.5 animate-in fade-in">
                  <div>
                    <input 
                      type="text" 
                      value={newClientData.name}
                      onChange={(e) => setNewClientData({ ...newClientData, name: e.target.value })}
                      placeholder="Nom & Prénom *"
                      className="w-full h-9 px-2.5 bg-slate-900 text-white text-xs rounded-lg border border-slate-600 outline-none"
                    />
                  </div>
                  <div>
                    <input 
                      type="tel" 
                      value={newClientData.phone}
                      onChange={(e) => setNewClientData({ ...newClientData, phone: e.target.value })}
                      placeholder="WhatsApp / Tél *"
                      className="w-full h-9 px-2.5 bg-slate-900 text-white text-xs rounded-lg border border-slate-600 outline-none"
                    />
                  </div>
                  <div>
                    <input 
                      type="text" 
                      value={newClientData.cni}
                      onChange={(e) => setNewClientData({ ...newClientData, cni: e.target.value })}
                      placeholder="N° CNI (Optionnel)"
                      className="w-full h-9 px-2.5 bg-slate-900 text-white text-xs rounded-lg border border-slate-600 outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Colonne Date & Échéance (5 cols) */}
            <div className="md:col-span-5 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1 flex items-center gap-1.5">
                  <Calendar size={13} className="text-amber-400" />
                  <span>Date d&apos;Émission</span>
                </label>
                <div className="h-10 px-3 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 flex items-center">
                  {new Date().toLocaleDateString('fr-FR')}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1 flex items-center gap-1.5">
                  <Calendar size={13} className="text-amber-400" />
                  <span>Échéance Limite *</span>
                </label>
                <input 
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full h-10 px-3 bg-white text-slate-900 text-xs font-black rounded-xl border-2 border-amber-400 outline-none"
                />
              </div>
            </div>

          </div>
        </div>

        {/* ÉTAGE 2 : CORPS DU TABLEAU DES ARTICLES (LE CŒUR DU REGISTRE) */}
        <div className="p-4 sm:p-6 space-y-3">
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Package size={16} className="text-blue-600" />
              <span>2. Liste des Articles & Marchandises Vendues à Crédit</span>
            </span>
            <span className="text-xs font-bold text-slate-500">
              {totalArticlesCount} article{totalArticlesCount > 1 ? 's' : ''} au total
            </span>
          </div>

          <div className="overflow-x-auto border-2 border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead className="bg-slate-100 border-b-2 border-slate-200">
                <tr className="text-xs font-black text-slate-700 uppercase">
                  <th className="py-3 px-3 w-10 text-center">#</th>
                  <th className="py-3 px-3 w-[45%]">Désignation / Article</th>
                  <th className="py-3 px-3 w-[15%] text-center">Quantité</th>
                  <th className="py-3 px-3 w-[20%] text-right">Prix (FCFA)</th>
                  <th className="py-3 px-3 w-[20%] text-right">Total Ligne</th>
                  <th className="py-3 px-2 w-12 text-center">✕</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item, idx) => {
                  const subtotal = item.quantity * item.unitPrice;
                  return (
                    <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="py-2.5 px-3 text-center text-xs font-bold text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-3">
                        <input 
                          type="text"
                          value={item.name}
                          onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                          placeholder="Ex: Sac de Riz 50kg / Huile 5L..."
                          className="w-full h-10 px-3 text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded-lg outline-none focus:border-blue-600"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <input 
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                          className="w-20 h-10 px-2 text-center text-sm font-black text-slate-900 bg-white border border-slate-300 rounded-lg outline-none focus:border-blue-600 mx-auto"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <input 
                          type="number"
                          min="0"
                          value={item.unitPrice || ''}
                          onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                          placeholder="0"
                          className="w-32 h-10 px-3 text-right text-sm font-black text-slate-900 bg-white border border-slate-300 rounded-lg outline-none focus:border-blue-600 ml-auto"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-right font-black text-slate-900 font-mono text-sm">
                        {formatAfricanCurrency(subtotal, currency)}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <button 
                          type="button"
                          onClick={() => removeRow(idx)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Supprimer la ligne"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <button 
            type="button"
            onClick={addRow}
            className="w-full py-2.5 border-2 border-dashed border-blue-300 bg-blue-50/50 hover:bg-blue-100/70 text-blue-700 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Plus size={16} />
            <span>+ Ajouter un autre article dans ce crédit</span>
          </button>

        </div>

        {/* ÉTAGE 3 : BAS DU TABLEAU UNIFIÉ (PAIEMENT, GARANT, OBSERVATIONS & GRAND TOTAL) */}
        <div className="bg-slate-50 border-t-2 border-slate-200 p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
            
            {/* Colonne Paiement & Garant (7 cols) */}
            <div className="md:col-span-7 space-y-3">
              <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                3. Modalités de Remboursement & Garantie
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Mode de paiement prévu</label>
                  <select 
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full h-9 px-2.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 outline-none"
                  >
                    {availablePaymentMethods.map((m) => (
                      <option key={m.id} value={m.label}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Compte / N° Paiement (optionnel)</label>
                  <input 
                    type="text"
                    value={paymentAccount}
                    onChange={(e) => setPaymentAccount(e.target.value)}
                    placeholder={`Numéro ${availablePaymentMethods[0]?.label.split(' ')[0] || 'Wave'} / MoMo...`}
                    className="w-full h-9 px-2.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Nom du garant (optionnel)</label>
                  <input 
                    type="text"
                    value={guarantorName}
                    onChange={(e) => setGuarantorName(e.target.value)}
                    placeholder="Ex: KONE Drissa"
                    className="w-full h-9 px-2.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Tél du garant (optionnel)</label>
                  <input 
                    type="tel"
                    value={guarantorPhone}
                    onChange={(e) => setGuarantorPhone(e.target.value)}
                    placeholder="+225 01 02 03 04 05"
                    className="w-full h-9 px-2.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <input 
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notes complémentaires (ex: accord verbal de paiement en 2 tranches...)"
                  className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-700 outline-none"
                />
              </div>
            </div>

            {/* Colonne Grand Total & Validation (5 cols) */}
            <div className="md:col-span-5 flex flex-col justify-end space-y-3 bg-white p-4 rounded-xl border-2 border-blue-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-500 uppercase">TOTAL GÉNÉRAL :</span>
                <span className="text-2xl font-black text-blue-600 font-mono">
                  {formatAfricanCurrency(totalGrossAmount, currency)}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <Link 
                  href="/credit"
                  className="w-1/3 h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center transition"
                >
                  Annuler
                </Link>
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-2/3 h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition cursor-pointer disabled:opacity-50"
                >
                  <Check size={18} className="stroke-[3]" />
                  <span>{loading ? 'Enregistrement...' : 'Valider ce Crédit'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </form>
    </div>
  );
}
