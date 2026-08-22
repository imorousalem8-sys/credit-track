"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { X, PlusCircle, User, Phone, Plus, Trash2, Maximize2, Coins, FileSpreadsheet } from 'lucide-react';
import Link from 'next/link';
import { CURRENCY_OPTIONS, getCurrencySymbol, formatAfricanCurrency } from '@/lib/africanCountries';

interface QuickProductItem {
  name: string;
  quantity: number;
  unitPrice: number;
}

export default function ModalNewCredit() {
  const { isNewCreditModalOpen, setIsNewCreditModalOpen, addClient, currency: globalCurrency, showToast } = useApp();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('XOF');

  const [items, setItems] = useState<QuickProductItem[]>([
    { name: '', quantity: 1, unitPrice: 0 },
    { name: '', quantity: 1, unitPrice: 0 },
    { name: '', quantity: 1, unitPrice: 0 }
  ]);

  useEffect(() => {
    if (globalCurrency) {
      setSelectedCurrency(globalCurrency);
    }
  }, [globalCurrency]);

  if (!isNewCreditModalOpen) return null;

  const handleItemChange = (index: number, field: keyof QuickProductItem, val: any) => {
    const next = [...items];
    if (field === 'quantity' || field === 'unitPrice') {
      next[index] = { ...next[index], [field]: parseFloat(val) || 0 };
    } else {
      next[index] = { ...next[index], [field]: val };
    }
    setItems(next);
  };

  const addRow = () => {
    setItems([...items, { name: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeRow = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const totalCalculated = items.reduce((acc, it) => acc + (it.quantity * it.unitPrice), 0);
  const currencySymbol = getCurrencySymbol(selectedCurrency);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addClient({
      name: name.trim(),
      phone: phone.trim(),
      totalDue: totalCalculated,
      status: totalCalculated > 0 ? 'pending' : 'paid'
    });

    if (showToast) {
      showToast(`Client et crédit de ${formatAfricanCurrency(totalCalculated, selectedCurrency)} enregistrés !`, 'success');
    }

    setName('');
    setPhone('');
    setItems([

      { name: '', quantity: 1, unitPrice: 0 },
      { name: '', quantity: 1, unitPrice: 0 }
    ]);
    setIsNewCreditModalOpen(false);
  };

  return (
    <div className="modal-overlay active" style={{ display: 'flex' }}>
      <div className="modal-card" style={{ maxWidth: '680px', padding: '24px', maxHeight: '92vh', overflowY: 'auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PlusCircle size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Nouveau Client & Crédit</h3>
              <p style={{ fontSize: '0.78rem', color: '#64748B', margin: 0 }}>Saisie directe avec tableau de produits multi-devises</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link 
              href="/credit/nouveau" 
              onClick={() => setIsNewCreditModalOpen(false)}
              className="text-blue-600 hover:text-blue-800 text-xs font-bold flex items-center gap-1 bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-200"
              title="Ouvrir en grand écran avec signature et impression"
            >
              <Maximize2 size={13} /> Grand Tableau & Signature
            </Link>
            <button 
              type="button" 
              onClick={() => setIsNewCreditModalOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '4px' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Client Identity Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700 }}>
                <User size={13} className="text-blue-600" /> Nom du Client / Établissement *
              </label>
              <input 
                type="text" 
                className="table-input" 
                placeholder="Ex: Boutique Kouamé..." 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700 }}>
                <Phone size={13} className="text-blue-600" /> WhatsApp / Téléphone *
              </label>
              <input 
                type="text" 
                className="table-input" 
                placeholder="Numéro WhatsApp / Téléphone" 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
                required 
              />

            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700 }}>
                <Coins size={13} className="text-amber-600" /> Devise du Crédit
              </label>
              <select 
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="table-input font-bold text-blue-700"
              >
                {CURRENCY_OPTIONS.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dynamic Products Table */}
          <div style={{ border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ background: '#F8FAFC', padding: '10px 14px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileSpreadsheet size={15} className="text-blue-600" /> Articles & Marchandises ({items.length} lignes)
              </span>
              <button 
                type="button" 
                onClick={addRow}
                className="btn bg-white border border-slate-300 text-blue-600 hover:bg-blue-50 text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm"
              >
                <Plus size={13} /> + Ligne
              </button>
            </div>

            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              <table className="invoice-table" style={{ margin: 0 }}>
                <thead>
                  <tr>
                    <th style={{ padding: '8px 10px' }}>Article / Service</th>
                    <th style={{ width: '80px', textAlign: 'right', padding: '8px 10px' }}>Qté</th>
                    <th style={{ width: '120px', textAlign: 'right', padding: '8px 10px' }}>P.U ({currencySymbol})</th>
                    <th style={{ width: '130px', textAlign: 'right', padding: '8px 10px' }}>Total ({currencySymbol})</th>
                    <th style={{ width: '40px', textAlign: 'center', padding: '8px 6px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, idx) => (
                    <tr key={idx}>
                      <td style={{ padding: '6px 8px' }}>
                        <input 
                          type="text" 
                          placeholder="Ex: Ciment, Sac de riz..."
                          value={it.name}
                          onChange={e => handleItemChange(idx, 'name', e.target.value)}
                          className="table-input"
                          style={{ padding: '6px 8px', fontSize: '0.82rem' }}
                        />
                      </td>
                      <td style={{ padding: '6px 8px' }}>
                        <input 
                          type="number" 
                          min="1"
                          placeholder="1"
                          value={it.quantity === 0 ? '' : it.quantity}
                          onChange={e => handleItemChange(idx, 'quantity', e.target.value)}
                          className="table-input table-input-number"
                          style={{ padding: '6px 8px', fontSize: '0.82rem' }}
                        />
                      </td>
                      <td style={{ padding: '6px 8px' }}>
                        <input 
                          type="number" 
                          min="0"
                          placeholder="0"
                          value={it.unitPrice === 0 ? '' : it.unitPrice}
                          onChange={e => handleItemChange(idx, 'unitPrice', e.target.value)}
                          className="table-input table-input-number"
                          style={{ padding: '6px 8px', fontSize: '0.82rem' }}
                        />
                      </td>
                      <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 700, fontSize: '0.82rem', fontFamily: 'monospace' }}>
                        {formatAfricanCurrency(it.quantity * it.unitPrice, selectedCurrency)}
                      </td>
                      <td style={{ padding: '6px 4px', textAlign: 'center' }}>
                        {items.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => removeRow(idx)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total Bar */}
          <div style={{ background: '#0F172A', color: '#FFFFFF', padding: '14px 18px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94A3B8' }}>Total de la Créance :</span>
            <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#60A5FA' }}>
              {formatAfricanCurrency(totalCalculated, selectedCurrency)}
            </span>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
            <button 
              type="button" 
              className="btn btn-outline" 
              style={{ flex: 1 }} 
              onClick={() => setIsNewCreditModalOpen(false)}
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ flex: 1.5, background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', padding: '12px' }}
            >
              Enregistrer le Client & Crédit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

