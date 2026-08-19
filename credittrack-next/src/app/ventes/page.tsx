"use client";

import React from 'react';
import { useApp } from '@/context/AppContext';
import { ShoppingCart, PlusCircle } from 'lucide-react';

export default function VentesPage() {
  const { accountingEntries, formatAmount, setIsNewCreditModalOpen } = useApp();
  const sales = accountingEntries.filter(e => e.type === 'revenue');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingCart size={24} className="text-blue-600" />
            Facturation & Ventes
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '4px 0 0 0' }}>
            Suivi des factures émises, encaissements et ventes à crédit
          </p>
        </div>
        <button 
          type="button" 
          className="btn btn-primary"
          onClick={() => setIsNewCreditModalOpen(true)}
          style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', padding: '10px 18px', borderRadius: '10px', fontWeight: 800, minHeight: '44px' }}
        >
          <PlusCircle size={18} /> Nouvelle Facture / Vente
        </button>
      </div>

      <div className="card" style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: sales.length === 0 ? '16px' : 0, overflow: 'hidden' }}>
        {sales.length === 0 ? (
          <div className="empty-state-box">
            <div className="empty-state-icon-box">
              <ShoppingCart size={26} />
            </div>
            <div className="empty-state-title">Aucune facture ou vente enregistrée</div>
            <div className="empty-state-desc">
              Émettez votre première facture ou enregistrez une vente à crédit pour suivre les encaissements et la TVA.
            </div>
            <button 
              type="button" 
              className="empty-state-cta"
              onClick={() => setIsNewCreditModalOpen(true)}
            >
              <PlusCircle size={16} /> Enregistrer une première vente
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table" style={{ width: '100%', margin: 0 }}>
              <thead>
                <tr style={{ background: '#F8FAFC' }}>
                  <th style={{ padding: '16px 20px' }}>Réf & Date</th>
                  <th style={{ padding: '16px 20px' }}>Libellé Facture</th>
                  <th style={{ padding: '16px 20px', textAlign: 'right' }}>Montant HT</th>
                  <th style={{ padding: '16px 20px', textAlign: 'right' }}>TVA</th>
                  <th style={{ padding: '16px 20px', textAlign: 'right' }}>Statut</th>
                </tr>
              </thead>
              <tbody>
                {sales.map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: 800, color: '#0F172A' }}>{s.ref}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{s.date}</div>
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: 700 }}>{s.label}</td>
                    <td style={{ padding: '16px 20px', textAlign: 'right', fontWeight: 800, color: '#10B981' }}>
                      +{formatAmount(s.amountHT)}
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right', color: '#64748B' }}>
                      {formatAmount(s.vatAmount)}
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <span className="badge-status paid">Payé / Validé</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
