"use client";

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Receipt, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function AchatsPage() {
  const { accountingEntries, formatAmount } = useApp();
  const expenses = accountingEntries.filter(e => e.type === 'expense');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Receipt size={24} className="text-blue-600" />
            Achats & Charges Fournisseurs
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '4px 0 0 0' }}>
            Gestion des approvisionnements, factures d'achats et TVA déductible
          </p>
        </div>
        <Link 
          href="/comptabilite" 
          className="btn btn-primary"
          style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', padding: '10px 20px', borderRadius: '10px', fontWeight: 800 }}
        >
          <PlusCircle size={18} /> Saisir une Charge
        </Link>
      </div>

      <div className="card" style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="custom-table" style={{ width: '100%', margin: 0 }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                <th style={{ padding: '16px 20px' }}>Réf & Date</th>
                <th style={{ padding: '16px 20px' }}>Libellé Achat</th>
                <th style={{ padding: '16px 20px', textAlign: 'right' }}>Montant HT</th>
                <th style={{ padding: '16px 20px', textAlign: 'right' }}>TVA Déductible</th>
                <th style={{ padding: '16px 20px', textAlign: 'right' }}>Statut</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(e => (
                <tr key={e.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontWeight: 800, color: '#0F172A' }}>{e.ref}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{e.date}</div>
                  </td>
                  <td style={{ padding: '16px 20px', fontWeight: 700 }}>{e.label}</td>
                  <td style={{ padding: '16px 20px', textAlign: 'right', fontWeight: 800, color: '#EF4444' }}>
                    -{formatAmount(e.amountHT)}
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right', color: '#64748B' }}>
                    {formatAmount(e.vatAmount)}
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <span className="badge-status paid">Comptabilisé</span>
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
