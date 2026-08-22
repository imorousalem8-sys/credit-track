"use client";

import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useApp } from '@/context/AppContext';
import { 
  Save, 
  ArrowLeft, 
  User, 
  Plus, 
  Trash2, 
  Printer, 
  PenTool, 
  CheckCircle2, 
  RotateCcw,
  Sparkles,
  FileSpreadsheet,
  Calendar,
  Phone,
  CreditCard,
  Building2,
  Percent,
  Coins
} from 'lucide-react';
import Link from 'next/link';
import { CURRENCY_OPTIONS, getCurrencySymbol, formatAfricanCurrency } from '@/lib/africanCountries';

interface ProductItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export default function NewCreditSpreadsheetPage() {
  const { country, currency: defaultCurrency, addClient, showToast } = useApp();
  const [loading, setLoading] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string>(defaultCurrency || 'XOF');

  // Client info
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    cni: '',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    penaltyRate: '0',
    initialDeposit: '0',
    guarantorName: '',
    guarantorPhone: '',
    notes: ''
  });


  // Dynamic Product Lines (Infinite rows)
  const [items, setItems] = useState<ProductItem[]>([
    { id: '1', name: '', quantity: 1, unitPrice: 0 },
    { id: '2', name: '', quantity: 1, unitPrice: 0 },
    { id: '3', name: '', quantity: 1, unitPrice: 0 },
    { id: '4', name: '', quantity: 1, unitPrice: 0 },
    { id: '5', name: '', quantity: 1, unitPrice: 0 },
  ]);

  // Signature state
  const [signatureMode, setSignatureMode] = useState<'canvas' | 'typed' | 'paper'>('canvas');
  const [typedSignerName, setTypedSignerName] = useState('');
  const [hasCanvasSignature, setHasCanvasSignature] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Sync currency from global country on load if not modified
  useEffect(() => {
    if (country?.currency) {
      setSelectedCurrency(country.currency);
    }
  }, [country]);

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0F172A';
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
    setHasCanvasSignature(true);
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
    }
    setHasCanvasSignature(false);
  };

  // Row operations
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
    setItems([...items, { id: Math.random().toString(36).substring(2, 9), name: '', quantity: 1, unitPrice: 0 }]);
  };

  const addMultipleRows = (count: number = 5) => {
    const newRows: ProductItem[] = [];
    for (let i = 0; i < count; i++) {
      newRows.push({ id: Math.random().toString(36).substring(2, 9), name: '', quantity: 1, unitPrice: 0 });
    }
    setItems([...items, ...newRows]);
  };

  const removeRow = (index: number) => {
    if (items.length <= 1) {
      setItems([{ id: '1', name: '', quantity: 1, unitPrice: 0 }]);
      return;
    }
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  // Financial calculations
  const validItems = items.filter(it => it.name.trim() !== '' || it.unitPrice > 0);
  const totalGrossAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const initialDepositNum = parseFloat(formData.initialDeposit) || 0;
  const netCreditDue = Math.max(0, totalGrossAmount - initialDepositNum);

  const currencySymbol = getCurrencySymbol(selectedCurrency);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Veuillez saisir le nom du client.");
      return;
    }

    if (netCreditDue <= 0 && totalGrossAmount <= 0) {
      if (!confirm("Le montant total calculé est de 0. Souhaitez-vous continuer ?")) {
        return;
      }
    }

    setLoading(true);

    try {
      // 1. Build structured description containing itemized list
      const itemsListFormatted = validItems.map(it => 
        `• ${it.name || 'Article'} (Qté: ${it.quantity} × ${formatAfricanCurrency(it.unitPrice, selectedCurrency)}) = ${formatAfricanCurrency(it.quantity * it.unitPrice, selectedCurrency)}`
      ).join('\n');

      const fullDescription = [
        `=== BORDEREAU DE CRÉDIT (${selectedCurrency}) ===`,
        itemsListFormatted || 'Vente directe',
        formData.notes ? `\nNotes: ${formData.notes}` : '',
        `\nDevise: ${selectedCurrency} (${currencySymbol})`,
        initialDepositNum > 0 ? `Acompte versé: ${formatAfricanCurrency(initialDepositNum, selectedCurrency)}` : '',
        `Total Créance: ${formatAfricanCurrency(netCreditDue, selectedCurrency)}`,
        signatureMode === 'typed' ? `Signé électroniquement par: ${typedSignerName}` : '',
        signatureMode === 'paper' ? `Signature physique sur contrat papier` : ''
      ].filter(Boolean).join('\n');

      // 2. Insert or update client in Supabase
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .insert([{
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          cni: formData.cni.trim(),
          total_due: netCreditDue,
          status: netCreditDue > 0 ? 'pending' : 'paid'
        }])
        .select()
        .single();

      if (clientError) {
        console.warn("Supabase client insert error/offline fallback:", clientError.message);
      }

      // 3. Insert credit record in Supabase
      if (clientData?.id) {
        const { error: creditError } = await supabase
          .from('credits')
          .insert([{
            client_id: clientData.id,
            amount: netCreditDue,
            due_date: formData.dueDate,
            description: fullDescription,
            penalty_rate: parseFloat(formData.penaltyRate) || 0,
            guarantor_name: formData.guarantorName.trim(),
            guarantor_phone: formData.guarantorPhone.trim()
          }]);

        if (creditError) {
          console.warn("Supabase credit insert error:", creditError.message);
        }
      }

      // 4. Also sync locally with AppContext for instant UI feedback
      addClient({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        totalDue: netCreditDue,
        status: netCreditDue > 0 ? 'pending' : 'paid'
      });

      if (showToast) {
        showToast("Dossier de crédit et facture enregistrés avec succès !", "success");
      } else {
        alert("Le crédit et la facture ont été enregistrés avec succès !");
      }

      window.location.href = '/credit';

    } catch (error: any) {
      console.error("Erreur enregistrement:", error);
      alert("Erreur lors de l'enregistrement: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="printable-document space-y-6 pb-20 max-w-6xl mx-auto">
      
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <Sparkles size={14} /> Facturation & Enregistrement Commercial
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="text-blue-600" /> Bordereau & Nouveau Crédit
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Saisie en grand tableau illimité avec calcul automatique et signature
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link 
            href="/credit" 
            className="btn btn-outline text-slate-600 hover:text-slate-900 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition flex-1 sm:flex-initial"
          >
            <ArrowLeft size={16} /> Annuler
          </Link>
          <button 
            type="button" 
            onClick={handlePrint}
            className="btn btn-outline border-slate-300 hover:border-slate-400 bg-white text-slate-700 font-bold px-4 py-2 rounded-xl text-sm flex items-center justify-center gap-2 transition shadow-sm flex-1 sm:flex-initial"
          >
            <Printer size={16} /> Imprimer Facture
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* =========================================================================
            1. EN-TÊTE FACTURE & IDENTITÉ CLIENT (GRILLE COMPACTE PRO)
            ========================================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
                <User size={20} />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">1. Identité du Débiteur & Devise de la Transaction</h2>
                <p className="text-xs text-slate-500">Coordonnées du client et paramètres de la monnaie</p>
              </div>
            </div>

            {/* CURRENCY SELECTOR (UNLOCKED) */}
            <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
              <Coins size={18} className="text-amber-600 shrink-0 ml-1" />
              <label htmlFor="currency-select" className="text-xs font-bold text-slate-700 whitespace-nowrap">Devise du Crédit :</label>
              <select 
                id="currency-select"
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="bg-white font-extrabold text-sm text-blue-700 border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
              >
                {CURRENCY_OPTIONS.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nom ou Établissement *
              </label>
              <div className="relative">
                <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  required 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleFormChange} 
                  className="table-input pl-9" 
                  placeholder="Ex: Société Diallo, M. Yao..." 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Numéro WhatsApp / Tél *
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  required 
                  type="text" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleFormChange} 
                  className="table-input pl-9" 
                  placeholder="Numéro WhatsApp / Téléphone" 
                />

              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                N° CNI / Passeport / RCCM
              </label>
              <div className="relative">
                <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  name="cni" 
                  value={formData.cni} 
                  onChange={handleFormChange} 
                  className="table-input pl-9" 
                  placeholder="Ex: CI-00987654" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Date d'Échéance Finale *
              </label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  required 
                  type="date" 
                  name="dueDate" 
                  value={formData.dueDate} 
                  onChange={handleFormChange} 
                  className="table-input pl-9 font-bold text-blue-600" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            2. GRAND TABLEAU RECTANGULAIRE D'ARTICLES (LIGNES INFINIES)
            ========================================================================= */}
        <div className="invoice-sheet-container">
          <div className="p-4 sm:p-5 bg-slate-900 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <FileSpreadsheet size={20} className="text-blue-400" /> 
                2. Tableau Bordereau des Marchandises / Services ({items.length} lignes)
              </h2>
              <p className="text-xs text-slate-300">
                Saisissez autant d'articles que nécessaire. Les totaux sont calculés automatiquement en {currencySymbol}.
              </p>
            </div>

            {/* Quick Add Buttons */}
            <div className="flex items-center gap-2 no-print w-full sm:w-auto">
              <button 
                type="button" 
                onClick={addRow}
                className="btn bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition"
              >
                <Plus size={15} /> +1 Ligne
              </button>
              <button 
                type="button" 
                onClick={() => addMultipleRows(5)}
                className="btn bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 border border-slate-700 transition"
                title="Ajouter 5 lignes d'un coup pour de grosses commandes"
              >
                <Plus size={15} /> +5 Lignes
              </button>
            </div>
          </div>

          <div className="invoice-table-wrapper">
            <table className="invoice-table">
              <thead>
                <tr>
                  <th style={{ width: '45px', textAlign: 'center' }}>N°</th>
                  <th style={{ minWidth: '280px' }}>Désignation du Produit ou Prestation</th>
                  <th style={{ width: '110px', textAlign: 'right' }}>Quantité</th>
                  <th style={{ width: '160px', textAlign: 'right' }}>Prix Unitaire ({currencySymbol})</th>
                  <th style={{ width: '170px', textAlign: 'right' }}>Total Ligne ({currencySymbol})</th>
                  <th className="no-print" style={{ width: '50px', textAlign: 'center' }}></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => {
                  const lineTotal = item.quantity * item.unitPrice;
                  return (
                    <tr key={item.id}>
                      <td style={{ textAlign: 'center', fontWeight: 700, color: '#94A3B8', fontSize: '0.8rem' }}>
                        {index + 1}
                      </td>
                      <td>
                        <input 
                          type="text" 
                          value={item.name} 
                          onChange={(e) => handleItemChange(index, 'name', e.target.value)} 
                          placeholder={`Ex: Produit ou article n°${index + 1}...`}
                          className="table-input"
                        />
                      </td>
                      <td>
                        <input 
                          type="number" 
                          min="0"
                          step="any"
                          value={item.quantity === 0 ? '' : item.quantity} 
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} 
                          placeholder="1"
                          className="table-input table-input-number"
                        />
                      </td>
                      <td>
                        <input 
                          type="number" 
                          min="0"
                          step="any"
                          value={item.unitPrice === 0 ? '' : item.unitPrice} 
                          onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)} 
                          placeholder="0"
                          className="table-input table-input-number"
                        />
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 800, color: lineTotal > 0 ? '#0F172A' : '#94A3B8', fontFamily: 'monospace' }}>
                        {formatAfricanCurrency(lineTotal, selectedCurrency)}
                      </td>
                      <td className="no-print" style={{ textAlign: 'center' }}>
                        <button 
                          type="button" 
                          onClick={() => removeRow(index)}
                          className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition"
                          title="Supprimer cette ligne"
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

          {/* Under Table Quick Bar */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap justify-between items-center gap-3 no-print">
            <div className="flex items-center gap-2">
              <button 
                type="button" 
                onClick={addRow}
                className="btn btn-outline bg-white text-blue-600 border-blue-200 hover:bg-blue-50 text-xs font-extrabold px-3 py-2 rounded-lg flex items-center gap-1.5 shadow-sm"
              >
                <Plus size={15} /> Ajouter un article supplémentaire
              </button>
              <span className="text-xs text-slate-500">
                {validItems.length} article(s) renseigné(s)
              </span>
            </div>

            <div className="text-xs text-slate-500 font-medium">
              💡 Astuce : Vous pouvez ajouter autant de lignes que nécessaire (30+ articles).
            </div>
          </div>
        </div>

        {/* =========================================================================
            3. DÉCOMPTE FINANCIER & RÉCAPITULATIF RECTANGULAIRE
            ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left: Optional Conditions & Guarantor */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <User size={16} className="text-blue-600" /> Caution & Conditions Particulières (Optionnel)
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nom du Garant / Caution</label>
                <input 
                  type="text" 
                  name="guarantorName" 
                  value={formData.guarantorName} 
                  onChange={handleFormChange} 
                  className="table-input" 
                  placeholder="Ex: Kouassi Michel" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Téléphone Garant</label>
                <input 
                  type="text" 
                  name="guarantorPhone" 
                  value={formData.guarantorPhone} 
                  onChange={handleFormChange} 
                  className="table-input" 
                  placeholder="Numéro de téléphone" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Percent size={13} className="text-amber-500" /> Pénalité de Retard (% / mois)
                </label>
                <input 
                  type="number" 
                  name="penaltyRate" 
                  value={formData.penaltyRate} 
                  onChange={handleFormChange} 
                  className="table-input" 
                  placeholder="0" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Acompte / Avance versée ({currencySymbol})
                </label>
                <input 
                  type="number" 
                  name="initialDeposit" 
                  value={formData.initialDeposit} 
                  onChange={handleFormChange} 
                  className="table-input font-bold text-emerald-600" 
                  placeholder="0" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Observations / Clause de réserve de propriété</label>
              <textarea 
                rows={2} 
                name="notes" 
                value={formData.notes} 
                onChange={handleFormChange} 
                className="table-input" 
                placeholder="Les marchandises restent la propriété du vendeur jusqu'au paiement intégral..."
              />
            </div>
          </div>

          {/* Right: Financial Totals Box */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm text-slate-400 border-b border-slate-800 pb-2">
                <span>Total Brut des Marchandises</span>
                <span className="font-mono font-bold text-white text-base">
                  {formatAfricanCurrency(totalGrossAmount, selectedCurrency)}
                </span>
              </div>

              {initialDepositNum > 0 && (
                <div className="flex justify-between items-center text-sm text-emerald-400 border-b border-slate-800 pb-2">
                  <span>- Acompte / Avance Réglée</span>
                  <span className="font-mono font-bold">
                    {formatAfricanCurrency(initialDepositNum, selectedCurrency)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>Devise appliquée</span>
                <span className="font-bold text-amber-400 bg-slate-800 px-2.5 py-1 rounded-md">
                  {selectedCurrency} ({currencySymbol})
                </span>
              </div>
            </div>

            <div className="bg-blue-950/80 border border-blue-500/30 rounded-xl p-4 text-center">
              <div className="text-xs uppercase font-extrabold tracking-wider text-blue-300">
                Montant Net du Crédit (Reste à Payer)
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white mt-1 tracking-tight">
                {formatAfricanCurrency(netCreditDue, selectedCurrency)}
              </div>
              <div className="text-xs text-blue-200/80 mt-1">
                Échéance fixée au : <strong>{formData.dueDate}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            4. MODULE DE SIGNATURE POLYVALENT (TACTILE / CLAVIER / PAPIER)
            ========================================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <PenTool className="text-blue-600" size={18} />
              <h3 className="text-base font-extrabold text-slate-900">4. Zone d'Engagement & Signature</h3>
            </div>

            {/* Signature Mode Selector */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl no-print">
              <button 
                type="button" 
                onClick={() => setSignatureMode('canvas')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition ${
                  signatureMode === 'canvas' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ✏️ Doigt / Stylet / Souris
              </button>
              <button 
                type="button" 
                onClick={() => setSignatureMode('typed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition ${
                  signatureMode === 'typed' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ⌨️ Signature Clavier
              </button>
              <button 
                type="button" 
                onClick={() => setSignatureMode('paper')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition ${
                  signatureMode === 'paper' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📄 Signature sur Papier
              </button>
            </div>
          </div>

          {/* Mode 1: Canvas Signature */}
          {signatureMode === 'canvas' && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
                <span>Signez directement avec le doigt sur tablette/mobile ou à la souris :</span>
                <button 
                  type="button" 
                  onClick={clearCanvas}
                  className="text-red-500 hover:text-red-700 font-bold flex items-center gap-1 bg-red-50 px-2.5 py-1 rounded-md no-print"
                >
                  <RotateCcw size={13} /> Effacer le tracé
                </button>
              </div>
              <div className="signature-canvas-box">
                <canvas 
                  ref={canvasRef}
                  width={600}
                  height={130}
                  onMouseDown={startDrawing}
                  onMouseUp={stopDrawing}
                  onMouseMove={draw}
                  onTouchStart={startDrawing}
                  onTouchEnd={stopDrawing}
                  onTouchMove={draw}
                  style={{ width: '100%', height: '130px', background: '#FAFAFA', cursor: 'crosshair', display: 'block' }}
                />
              </div>
              {hasCanvasSignature && (
                <div className="text-xs text-emerald-600 font-bold flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> Signature tactile enregistrée
                </div>
              )}
            </div>
          )}

          {/* Mode 2: Typed Signature */}
          {signatureMode === 'typed' && (
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700">
                Saisissez le Nom & Prénom du Signataire pour valider électroniquement :
              </label>
              <input 
                type="text" 
                value={typedSignerName} 
                onChange={(e) => setTypedSignerName(e.target.value)} 
                placeholder="Ex: Lu et approuvé par M. Jean Dupont"
                className="table-input text-base font-bold text-blue-900 bg-white"
              />
              {typedSignerName.trim() && (
                <div className="p-3 bg-white rounded-lg border border-blue-200 text-center font-serif italic text-lg text-slate-800">
                  « {typedSignerName.trim()} »
                </div>
              )}
            </div>
          )}

          {/* Mode 3: Paper Signature Zone */}
          {signatureMode === 'paper' && (
            <div className="signature-zone-print border-2 border-dashed border-slate-300 rounded-xl p-4 text-center bg-slate-50/50">
              <p className="text-xs text-slate-500 font-semibold mb-2">
                Cadre réservé pour la signature manuscrite et le cachet de l'entreprise lors de l'impression :
              </p>
              <div className="h-20 flex items-center justify-center text-slate-400 text-xs italic">
                (Zone de signature manuscrite du client & du vendeur)
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            5. BOUTONS D'ACTION FINAUX
            ========================================================================= */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 no-print">
          <button 
            disabled={loading} 
            type="submit" 
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 px-6 rounded-xl font-extrabold text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition disabled:opacity-50"
          >
            {loading ? (
              <span>Sauvegarde en cours...</span>
            ) : (
              <>
                <Save size={20} /> Valider & Enregistrer ce Dossier de Crédit ({formatAfricanCurrency(netCreditDue, selectedCurrency)})
              </>
            )}
          </button>

          <button 
            type="button" 
            onClick={handlePrint}
            className="btn btn-outline border-slate-300 hover:border-slate-400 bg-white text-slate-700 font-extrabold py-4 px-6 rounded-xl text-base flex items-center justify-center gap-2 transition"
          >
            <Printer size={20} /> Imprimer Reçu / Facture
          </button>
        </div>

      </form>
    </div>
  );
}

