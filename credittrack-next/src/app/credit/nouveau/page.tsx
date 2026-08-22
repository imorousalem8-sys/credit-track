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

interface ProductItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export default function NewCreditSalePage() {
  const { clients, addClient, showToast, currency } = useApp();
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
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Vente à Crédit</h1>
          <p className="text-xs text-slate-500 mt-0.5">Enregistrez une nouvelle vente à crédit avec calcul automatique</p>
        </div>

        <Link 
          href="/credit" 
          className="btn btn-outline bg-white border-slate-300 text-slate-700 hover:text-slate-900 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shadow-sm"
        >
          <span>&lt;</span> Retour au cahier des crédits
        </Link>
      </div>

      {/* GRAND BLOC UNIFIÉ DE FACTURE */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-7 shadow-sm space-y-6">

        {/* 1. Bandeau de Synthèse 4 KPIs (1 Ligne Continue) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3.5">
          {/* KPI 1 : Montant Total */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100/80 text-purple-700 flex items-center justify-center shrink-0">
              <BadgeDollarSign size={20} />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase">Montant Total</div>
              <div className="text-base font-black text-slate-900">
                {formatAfricanCurrency(totalGrossAmount, currency)}
              </div>
            </div>
          </div>

          {/* KPI 2 : Articles */}
          <div className="flex items-center gap-3 lg:border-l lg:border-slate-200 lg:pl-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0">
              <Package size={20} />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase">Articles</div>
              <div className="text-base font-black text-slate-900">
                {totalArticlesCount}
              </div>
            </div>
          </div>

          {/* KPI 3 : Date Limite */}
          <div className="flex items-center gap-3 lg:border-l lg:border-slate-200 lg:pl-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100/80 text-amber-700 flex items-center justify-center shrink-0">
              <Calendar size={20} />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase">Date Limite</div>
              <div className="text-base font-black text-slate-900">
                {formattedDueDate}
              </div>
            </div>
          </div>

          {/* KPI 4 : Mode de Paiement */}
          <div className="flex items-center gap-3 lg:border-l lg:border-slate-200 lg:pl-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100/80 text-blue-700 flex items-center justify-center shrink-0">
              <CreditCard size={20} />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase">Mode de Paiement</div>
              <div className="text-base font-black text-slate-900">
                {formattedPaymentMethod}
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 2. Client Selection */}
          <div>
            <div className="text-sm font-extrabold text-slate-900 flex items-center gap-2 mb-2">
              <User size={18} className="text-blue-600" /> Client
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <select 
                value={selectedClientId}
                onChange={(e) => {
                  setSelectedClientId(e.target.value);
                  if (e.target.value === 'NEW') setIsNewClientInline(true);
                  else setIsNewClientInline(false);
                }}
                className="form-control flex-1 h-11 rounded-xl text-sm font-medium border-slate-300"
              >
                <option value="">-- Sélectionner un client existant --</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                ))}
              </select>

              <span className="text-xs font-bold text-slate-400 self-center">ou</span>

              <button 
                type="button"
                onClick={() => setIsNewClientInline(!isNewClientInline)}
                className="btn btn-outline text-blue-600 border-blue-200 bg-blue-50/60 hover:bg-blue-100 font-bold text-xs h-11 px-5 rounded-xl flex items-center justify-center gap-1.5 transition shrink-0"
              >
                <Plus size={16} /> Nouveau client
              </button>
            </div>

            {/* Inline New Client Form */}
            {isNewClientInline && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nom & Prénoms *</label>
                  <input 
                    type="text" 
                    value={newClientData.name}
                    onChange={(e) => setNewClientData({ ...newClientData, name: e.target.value })}
                    placeholder="Nom complet du client"
                    className="form-control h-10 text-sm bg-white rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Numéro WhatsApp / Téléphone *</label>
                  <input 
                    type="tel" 
                    value={newClientData.phone}
                    onChange={(e) => setNewClientData({ ...newClientData, phone: e.target.value })}
                    placeholder="Numéro WhatsApp"
                    className="form-control h-10 text-sm bg-white rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">N° CNI / RCCM (Optionnel)</label>
                  <input 
                    type="text" 
                    value={newClientData.cni}
                    onChange={(e) => setNewClientData({ ...newClientData, cni: e.target.value })}
                    placeholder="N° Pièce d'identité"
                    className="form-control h-10 text-sm bg-white rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>

          <hr className="border-slate-100" />

          {/* 3. Articles Table */}
          <div>
            <div className="text-sm font-extrabold text-slate-900 flex items-center gap-2 mb-3">
              <ShoppingCart size={18} className="text-blue-600" /> Articles de la vente à crédit
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200 text-xs font-bold text-slate-600">
                    <th className="py-2.5 px-3 w-[40%]">Article</th>
                    <th className="py-2.5 px-3 text-center w-[15%]">Quantité</th>
                    <th className="py-2.5 px-3 text-right w-[20%]">Prix Unitaire (FCFA)</th>
                    <th className="py-2.5 px-3 text-right w-[20%]">Sous-total (FCFA)</th>
                    <th className="py-2.5 px-3 text-center w-[5%]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item, idx) => {
                    const subtotal = item.quantity * item.unitPrice;
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-2 px-3">
                          <input 
                            type="text"
                            value={item.name}
                            onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                            placeholder="Désignation de l'article"
                            className="form-control h-9 text-sm rounded-lg border-slate-200"
                          />
                        </td>
                        <td className="py-2 px-3 text-center">
                          <input 
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                            className="form-control h-9 text-sm text-center rounded-lg border-slate-200 max-w-[80px] mx-auto"
                          />
                        </td>
                        <td className="py-2 px-3 text-right">
                          <input 
                            type="number"
                            min="0"
                            value={item.unitPrice || ''}
                            onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                            placeholder="0"
                            className="form-control h-9 text-sm text-right rounded-lg border-slate-200 max-w-[130px] ml-auto"
                          />
                        </td>
                        <td className="py-2 px-3 text-right font-extrabold text-blue-600 text-sm">
                          {formatAfricanCurrency(subtotal, currency)}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <button 
                            type="button"
                            onClick={() => removeRow(idx)}
                            className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition"
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

            {/* Dashed Add Article Button */}
            <button 
              type="button"
              onClick={addRow}
              className="w-full mt-3 py-2.5 border-2 border-dashed border-blue-200 bg-blue-50/30 hover:bg-blue-50/70 text-blue-600 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <Plus size={16} /> Ajouter un article
            </button>

            {/* Table Footer Grand Total */}
            <div className="flex justify-end items-center gap-4 pt-4">
              <span className="text-xs font-black tracking-wider text-slate-500 uppercase">TOTAL GÉNÉRAL</span>
              <div className="bg-blue-50 text-blue-600 text-lg font-black px-6 py-2 rounded-xl border border-blue-200">
                {formatAfricanCurrency(totalGrossAmount, currency)}
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* 4. Payment Details & Warranty (2 Equal Columns 50% / 50%) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Left: Détails de paiement */}
            <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 space-y-3.5">
              <div className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <CreditCard size={17} className="text-blue-600" /> Détails de paiement
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Comment le client prévoit de payer ?</label>
                <select 
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="form-control h-10 text-sm rounded-lg border-slate-200 bg-white"
                >
                  <option value="Espèces (Paiement physique en boutique)">Espèces (Paiement physique en boutique)</option>
                  <option value="Wave Money">Wave Money</option>
                  <option value="Orange Money">Orange Money</option>
                  <option value="MTN MoMo">MTN MoMo</option>
                  <option value="Moov Money">Moov Money</option>
                  <option value="Virement Bancaire">Virement Bancaire</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Numéro / Compte de paiement client (optionnel)</label>
                <input 
                  type="text"
                  value={paymentAccount}
                  onChange={(e) => setPaymentAccount(e.target.value)}
                  placeholder="Numéro Wave / MoMo ou RIB"
                  className="form-control h-10 text-sm rounded-lg border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date limite de remboursement *</label>
                <input 
                  required
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="form-control h-10 text-sm rounded-lg border-slate-200 font-bold text-blue-600 bg-white"
                />
              </div>
            </div>

            {/* Right: Garantie (optionnel) */}
            <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 space-y-3.5">
              <div className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <ShieldCheck size={17} className="text-blue-600" /> Garantie <span className="text-xs text-slate-400 font-medium">(optionnel)</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nom du garant</label>
                <input 
                  type="text"
                  value={guarantorName}
                  onChange={(e) => setGuarantorName(e.target.value)}
                  placeholder="Ex: KONE Drissa"
                  className="form-control h-10 text-sm rounded-lg border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Téléphone du garant</label>
                <input 
                  type="tel"
                  value={guarantorPhone}
                  onChange={(e) => setGuarantorPhone(e.target.value)}
                  placeholder="+225 01 02 03 04 05"
                  className="form-control h-10 text-sm rounded-lg border-slate-200 bg-white"
                />
              </div>
            </div>

          </div>

          {/* 5. Notes Card */}
          <div>
            <div className="text-sm font-extrabold text-slate-900 flex items-center gap-2 mb-1.5">
              <FileText size={17} className="text-blue-600" /> Notes ou informations complémentaires <span className="text-xs text-slate-400 font-medium">(optionnel)</span>
            </div>
            <input 
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Toute information utile concernant cette vente à crédit..."
              className="form-control h-10 text-sm rounded-lg border-slate-200"
            />
          </div>

          {/* 6. Bottom Actions */}
          <div className="flex justify-end items-center gap-3 pt-3 border-t border-slate-100">
            <Link 
              href="/credit"
              className="btn btn-outline bg-white border-slate-300 text-slate-600 hover:text-slate-900 px-6 py-2 rounded-xl text-sm font-bold shadow-sm"
            >
              Annuler
            </Link>
            <button 
              type="submit"
              disabled={loading}
              className="btn bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl text-sm font-extrabold flex items-center gap-2 shadow-md shadow-blue-600/20 transition disabled:opacity-50"
            >
              <Check size={18} /> {loading ? 'Enregistrement...' : 'Enregistrer la vente à crédit'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
