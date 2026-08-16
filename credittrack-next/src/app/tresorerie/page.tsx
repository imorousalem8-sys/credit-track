"use client";

import React from 'react';
import { useApp } from '@/context/AppContext';
import { PiggyBank, Smartphone, Landmark, Wallet, ArrowUpRight } from 'lucide-react';

export default function TresoreriePage() {
  const { payments, formatAmount, country } = useApp();
  const totalMoMo = payments.reduce((acc, p) => acc + p.amount, 0);

  const accounts = [
    { name: "Wave Business Mobile", type: "Mobile Money", icon: Smartphone, color: "#00A3FF", balance: Math.round(totalMoMo * 0.65) },
    { name: "Orange / MTN MoMo Caisse", type: "Compte Marchand", icon: Wallet, color: "#F59E0B", balance: Math.round(totalMoMo * 0.35) },
    { name: "Compte Bancaire Principal", type: "Banque Locale", icon: Landmark, color: "#2563EB", balance: 500000 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <PiggyBank size={24} className="text-blue-600" />
          Trésorerie & Comptes Mobile Money ({country.nameFr})
        </h1>
        <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '4px 0 0 0' }}>
          Suivi des soldes de caisse physique, portefeuilles Wave / MoMo et comptes bancaires
        </p>
      </div>

      {/* Account Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {accounts.map((acc, i) => {
          const Icon = acc.icon;
          return (
            <div key={i} className="card" style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', background: '#F8FAFC', padding: '3px 8px', borderRadius: '6px', color: '#64748B', fontWeight: 700 }}>
                    {acc.type}
                  </span>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', marginTop: '8px' }}>{acc.name}</h3>
                </div>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#EFF6FF', color: acc.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={22} />
                </div>
              </div>

              <div style={{ marginTop: '20px' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Solde Disponible :</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
                  {formatAmount(acc.balance)}
                </div>
              </div>

              <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#10B981', fontWeight: 700 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ArrowUpRight size={14} /> Synchronisé en direct
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Cash Flow Operations */}
      <div className="card" style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            Historique des Règlements & Flux de Trésorerie
          </h3>
        </div>

        <div className="table-responsive">
          <table className="custom-table" style={{ width: '100%', margin: 0 }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                <th style={{ padding: '14px 20px' }}>Réf & Date</th>
                <th style={{ padding: '14px 20px' }}>Canal de Paiement</th>
                <th style={{ padding: '14px 20px' }}>Client / Émetteur</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Montant Encaissé</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ fontWeight: 800, color: '#0F172A' }}>{p.ref}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{p.date}</div>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ background: '#ECFDF5', color: '#059669', fontWeight: 800, padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem' }}>
                      {p.method}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', fontWeight: 700 }}>
                    {p.clientName}
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right', fontWeight: 800, color: '#10B981', fontSize: '0.92rem' }}>
                    +{formatAmount(p.amount)}
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
