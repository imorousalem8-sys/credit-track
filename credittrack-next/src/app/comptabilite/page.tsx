"use client";

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Calculator, PlusCircle, ArrowUpRight, ArrowDownRight, FileText, CheckCircle2, DollarSign } from 'lucide-react';

export default function ComptabilitePage() {
  const { country, formatAmount, accountingEntries, addAccountingEntry } = useApp();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [code, setCode] = useState(country.chart[0]?.code || '701');
  const [label, setLabel] = useState('');
  const [type, setType] = useState<'revenue' | 'expense'>('revenue');
  const [amountHT, setAmountHT] = useState('');

  // Computations
  const totalRevenue = accountingEntries.filter(e => e.type === 'revenue').reduce((acc, e) => acc + e.amountHT, 0);
  const totalExpense = accountingEntries.filter(e => e.type === 'expense').reduce((acc, e) => acc + e.amountHT, 0);
  const netResult = totalRevenue - totalExpense;
  const totalVat = accountingEntries.reduce((acc, e) => acc + e.vatAmount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amountHT);
    if (!numAmount || !label.trim()) return;

    const vatAmount = Math.round(numAmount * (country.vatRate / 100));
    addAccountingEntry({
      date: new Date().toISOString().split('T')[0],
      code,
      label: label.trim(),
      type,
      amountHT: numAmount,
      vatAmount
    });

    setLabel('');
    setAmountHT('');
    setShowAddForm(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calculator size={24} className="text-blue-600" />
            Comptabilité Générale — {country.system}
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '4px 0 0 0' }}>
            {country.nameFr} ({country.flag}) • TVA Standard : {country.vatRate}% • Devise : {country.currency}
          </p>
        </div>

        <button 
          type="button" 
          className="btn btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
          style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', padding: '10px 20px', borderRadius: '10px', fontWeight: 800 }}
        >
          <PlusCircle size={18} /> {showAddForm ? 'Fermer le formulaire' : 'Saisir une Écriture'}
        </button>
      </div>

      {/* Quick Add Form */}
      {showAddForm && (
        <div className="card" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '14px', padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1E40AF', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlusCircle size={18} /> Nouvelle Écriture au Journal {country.system}
          </h3>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr) auto', gap: '12px', alignItems: 'flex-end' }}>
            <div>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>Compte Comptable</label>
              <select className="form-control" value={code} onChange={e => setCode(e.target.value)}>
                {country.chart.map(acc => (
                  <option key={acc.code} value={acc.code}>
                    {acc.code} - {acc.labelFr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>Libellé de l'opération</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Ex: Vente Produits, Loyer..." 
                value={label} 
                onChange={e => setLabel(e.target.value)} 
                required 
              />
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>Type de Flux</label>
              <select className="form-control" value={type} onChange={e => setType(e.target.value as any)}>
                <option value="revenue">Produit / Vente (Crédit)</option>
                <option value="expense">Charge / Achat (Débit)</option>
              </select>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>Montant HT ({country.currency})</label>
              <input 
                type="number" 
                className="form-control" 
                placeholder="0" 
                value={amountHT} 
                onChange={e => setAmountHT(e.target.value)} 
                required 
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ height: '42px', padding: '0 20px', fontWeight: 800 }}>
              Enregistrer
            </button>
          </form>
        </div>
      )}

      {/* 4 Financial KPIs */}
      <div className="metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <div className="metric-card">
          <div className="metric-info">
            <div className="metric-label">Total Produits (Chiffre d'Affaires)</div>
            <div className="metric-value" style={{ color: '#10B981' }}>{formatAmount(totalRevenue)}</div>
            <div className="metric-trend" style={{ color: '#10B981' }}><ArrowUpRight size={14} /> Ventes & Prestations</div>
          </div>
          <div className="metric-icon-box green"><CheckCircle2 size={22} /></div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <div className="metric-label">Total Charges d'Exploitation</div>
            <div className="metric-value" style={{ color: '#EF4444' }}>{formatAmount(totalExpense)}</div>
            <div className="metric-trend" style={{ color: '#EF4444' }}><ArrowDownRight size={14} /> Achats, salaires & frais</div>
          </div>
          <div className="metric-icon-box red"><ArrowDownRight size={22} /></div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <div className="metric-label">Résultat Net d'Exploitation</div>
            <div className="metric-value" style={{ color: netResult >= 0 ? '#2563EB' : '#EF4444' }}>
              {formatAmount(netResult)}
            </div>
            <div className="metric-trend" style={{ color: netResult >= 0 ? '#2563EB' : '#EF4444' }}>
              {netResult >= 0 ? 'Bénéficiaire' : 'Déficitaire'}
            </div>
          </div>
          <div className="metric-icon-box blue"><DollarSign size={22} /></div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <div className="metric-label">TVA Collectée ({country.vatRate}%)</div>
            <div className="metric-value">{formatAmount(totalVat)}</div>
            <div className="metric-trend" style={{ color: '#64748B' }}>Régime {country.system}</div>
          </div>
          <div className="metric-icon-box orange"><FileText size={22} /></div>
        </div>
      </div>

      {/* Journal Table Card */}
      <div className="card" style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Grand Livre & Journal Général des Écritures
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '2px 0 0 0' }}>
              Conforme aux exigences comptables de l'espace OHADA / CEMAC / IFRS
            </p>
          </div>
          <span style={{ fontSize: '0.78rem', background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '6px 12px', borderRadius: '8px', fontWeight: 700 }}>
            {accountingEntries.length} Écriture(s) validée(s)
          </span>
        </div>

        <div className="table-responsive">
          <table className="custom-table" style={{ width: '100%', margin: 0 }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                <th style={{ padding: '14px 20px' }}>Date & Réf</th>
                <th style={{ padding: '14px 20px' }}>Code Compte</th>
                <th style={{ padding: '14px 20px' }}>Libellé Opération</th>
                <th style={{ padding: '14px 20px' }}>Type</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Montant HT</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>TVA ({country.vatRate}%)</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Statut</th>
              </tr>
            </thead>
            <tbody>
              {accountingEntries.map(entry => (
                <tr key={entry.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.85rem' }}>{entry.ref}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{entry.date}</div>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ fontWeight: 800, background: '#EFF6FF', color: '#2563EB', padding: '3px 8px', borderRadius: '6px', fontSize: '0.82rem' }}>
                      {entry.code}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', fontWeight: 700, color: '#0F172A' }}>
                    {entry.label}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span className={`badge ${entry.type === 'revenue' ? 'badge-green' : 'badge-orange'}`}>
                      {entry.type === 'revenue' ? 'Produit (Vente)' : 'Charge (Achat)'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right', fontWeight: 800, color: entry.type === 'revenue' ? '#10B981' : '#EF4444' }}>
                    {entry.type === 'revenue' ? '+' : '-'}{formatAmount(entry.amountHT)}
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right', color: '#64748B', fontWeight: 600 }}>
                    {formatAmount(entry.vatAmount)}
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <span className="badge-status paid">Validé</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
