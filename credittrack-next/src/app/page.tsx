"use client";

import React from 'react';
import { useApp } from '@/context/AppContext';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Users, 
  Wallet, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  TrendingUp, 
  MessageSquare,
  Eye,
  Plus
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { 
    clients, 
    payments, 
    accountingEntries, 
    formatAmount, 
    setSelectedClient, 
    setIsNewCreditModalOpen,
    country
  } = useApp();

  // Compute live KPIs
  const totalDue = clients.reduce((acc, c) => acc + c.totalDue, 0);
  const totalPaid = payments.reduce((acc, p) => acc + p.amount, 0);
  const overdueClients = clients.filter(c => c.status === 'overdue');
  const revenueTotal = accountingEntries.filter(e => e.type === 'revenue').reduce((acc, e) => acc + e.amountHT, 0) || (totalPaid + totalDue);
  const expenseTotal = accountingEntries.filter(e => e.type === 'expense').reduce((acc, e) => acc + e.amountHT, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* ROW 1 : 4 KPI CARDS (STYLE A) */}
      <div className="metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        
        {/* KPI 1: Chiffre d'Affaires */}
        <div className="metric-card">
          <div className="metric-info">
            <div className="metric-label">Chiffre d'Affaires Global</div>
            <div className="metric-value">{formatAmount(revenueTotal)}</div>
            <div className="metric-trend" style={{ color: '#10B981' }}>
              <ArrowUpRight size={14} /> +18.4% ce mois
            </div>
          </div>
          <div className="metric-icon-box blue">
            <TrendingUp size={22} />
          </div>
        </div>

        {/* KPI 2: Créances Clients en attente */}
        <div className="metric-card">
          <div className="metric-info">
            <div className="metric-label">Créances Restantes Dues</div>
            <div className="metric-value" style={{ color: '#EF4444' }}>{formatAmount(totalDue)}</div>
            <div className="metric-trend" style={{ color: overdueClients.length > 0 ? '#EF4444' : '#64748B' }}>
              <Clock size={14} /> {overdueClients.length} impayé(s) à relancer
            </div>
          </div>
          <div className="metric-icon-box red">
            <Users size={22} />
          </div>
        </div>

        {/* KPI 3: Encaissements Réceptionnés */}
        <div className="metric-card">
          <div className="metric-info">
            <div className="metric-label">Total Règlements Reçus</div>
            <div className="metric-value" style={{ color: '#10B981' }}>{formatAmount(totalPaid)}</div>
            <div className="metric-trend" style={{ color: '#10B981' }}>
              <CheckCircle2 size={14} /> {payments.length} reçus enregistrés
            </div>
          </div>
          <div className="metric-icon-box green">
            <Wallet size={22} />
          </div>
        </div>

        {/* KPI 4: Charges & Dépenses */}
        <div className="metric-card">
          <div className="metric-info">
            <div className="metric-label">Dépenses & Achats Stock</div>
            <div className="metric-value">{formatAmount(expenseTotal)}</div>
            <div className="metric-trend" style={{ color: '#F59E0B' }}>
              <ArrowDownRight size={14} /> TVA récupérable incluse
            </div>
          </div>
          <div className="metric-icon-box orange">
            <AlertCircle size={22} />
          </div>
        </div>

      </div>

      {/* ROW 2 : GRAPHIQUE ÉVOLUTION (65%) | ACTIONS PRIORITAIRES (35%) */}
      <div className="dashboard-main-grid" style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '20px' }}>
        
        {/* Visual Cashflow Graph Card */}
        <div className="card" style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Évolution Trésorerie & Encaissements ({country.currency})
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '4px 0 0 0' }}>
                Suivi en temps réel des rentrées Wave / MoMo et ventes à crédit
              </p>
            </div>
            <span style={{ fontSize: '0.75rem', background: '#F1F5F9', padding: '4px 10px', borderRadius: '8px', fontWeight: 700, color: '#475569' }}>
              30 Derniers Jours
            </span>
          </div>

          {/* SVG Animated Interactive Curve */}
          <div style={{ height: '220px', width: '100%', position: 'relative' }}>
            <svg viewBox="0 0 500 180" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="0" y1="130" x2="500" y2="130" stroke="#F1F5F9" strokeWidth="1" />
              
              {/* Area */}
              <path 
                d="M 0 140 Q 80 120, 150 90 T 300 60 T 420 30 L 500 20 L 500 170 L 0 170 Z" 
                fill="url(#chartGrad)" 
              />
              {/* Line */}
              <path 
                d="M 0 140 Q 80 120, 150 90 T 300 60 T 420 30 L 500 20" 
                fill="none" 
                stroke="#2563EB" 
                strokeWidth="3.5" 
                strokeLinecap="round" 
              />

              {/* Data points */}
              <circle cx="150" cy="90" r="5" fill="#2563EB" stroke="#fff" strokeWidth="2" />
              <circle cx="300" cy="60" r="5" fill="#2563EB" stroke="#fff" strokeWidth="2" />
              <circle cx="420" cy="30" r="5" fill="#2563EB" stroke="#fff" strokeWidth="2" />
              <circle cx="500" cy="20" r="5" fill="#10B981" stroke="#fff" strokeWidth="2" />
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94A3B8', marginTop: '8px' }}>
              <span>Semaine 1</span>
              <span>Semaine 2</span>
              <span>Semaine 3</span>
              <span>Aujourd'hui (Pic Recouvrement)</span>
            </div>
          </div>
        </div>

        {/* Priority Actions Card */}
        <div className="card" style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={18} className="text-amber-500" />
              À Traiter en Priorité
            </h3>
            <span style={{ fontSize: '0.72rem', background: '#FEF2F2', color: '#EF4444', fontWeight: 800, padding: '2px 8px', borderRadius: '6px' }}>
              Action requise
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            {overdueClients.length > 0 ? (
              overdueClients.map(c => (
                <div key={c.id} style={{
                  background: '#FEF2F2',
                  border: '1px solid #FEE2E2',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#991B1B' }}>{c.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#B91C1C' }}>Dette : {formatAmount(c.totalDue)} (Retard)</div>
                  </div>
                  <button 
                    type="button"
                    className="btn"
                    style={{ background: '#25D366', color: '#fff', padding: '6px 10px', fontSize: '0.75rem', fontWeight: 700 }}
                    onClick={() => {
                      const cleanPhone = c.phone.replace(/[^0-9]/g, '');
                      const msg = `Bonjour ${c.name},\nVotre paiement de ${formatAmount(c.totalDue)} chez CréditTrack est arrivé à échéance. Merci de procéder au règlement via Wave ou Mobile Money.`;
                      window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
                    }}
                  >
                    <MessageSquare size={13} /> Relancer
                  </button>
                </div>
              ))
            ) : (
              <div style={{
                background: '#ECFDF5',
                border: '1px solid #D1FAE5',
                borderRadius: '10px',
                padding: '14px',
                textAlign: 'center',
                color: '#065F46',
                fontSize: '0.85rem',
                fontWeight: 700
              }}>
                Aucun impayé critique aujourd'hui. Tous les comptes sont suivis.
              </div>
            )}

            <div style={{
              background: '#EFF6FF',
              border: '1px solid #DBEAFE',
              borderRadius: '10px',
              padding: '12px 14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#1E40AF' }}>Régime Fiscal {country.system}</div>
                <div style={{ fontSize: '0.75rem', color: '#3B82F6' }}>TVA appliquée : {country.vatRate}% sur toutes les factures</div>
              </div>
              <Link href="/comptabilite" style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563EB', textDecoration: 'none' }}>
                Voir Journal →
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* ROW 3 : CLIENTS EN COURS (65%) | DERNIERS PAIEMENTS (35%) */}
      <div className="dashboard-main-grid" style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '20px' }}>
        
        {/* Table Clients & Créances */}
        <div className="card" style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Répertoire Clients & Scoring Solvabilité
            </h3>
            <Link href="/clients" style={{ fontSize: '0.82rem', fontWeight: 800, color: '#2563EB', textDecoration: 'none' }}>
              Tous les clients ({clients.length}) →
            </Link>
          </div>

          <div className="table-responsive">
            <table className="custom-table" style={{ width: '100%', fontSize: '0.85rem' }}>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Solvabilité</th>
                  <th>Créance Restante</th>
                  <th>Statut</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {clients.slice(0, 4).map(c => {
                  const scoreColor = c.reliabilityScore >= 80 ? '#10B981' : (c.reliabilityScore >= 50 ? '#F59E0B' : '#EF4444');
                  return (
                    <tr key={c.id}>
                      <td>
                        <div style={{ fontWeight: 800, color: '#0F172A' }}>{c.name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{c.phone}</div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 800, color: scoreColor }}>{c.reliabilityScore}/100</span>
                      </td>
                      <td style={{ fontWeight: 800, color: c.totalDue > 0 ? '#2563EB' : '#10B981' }}>
                        {formatAmount(c.totalDue)}
                      </td>
                      <td>
                        <span className={`badge-status ${c.status}`}>
                          {c.status === 'paid' ? 'À Jour' : c.status === 'overdue' ? 'Impayé' : 'En cours'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                          <button 
                            type="button"
                            className="btn btn-outline" 
                            style={{ padding: '5px 8px', fontSize: '0.74rem', borderColor: '#2563EB', color: '#2563EB' }}
                            onClick={() => setSelectedClient(c)}
                            title="Voir la Fiche"
                          >
                            <Eye size={13} />
                          </button>
                          <button 
                            type="button"
                            className="btn" 
                            style={{ background: '#25D366', color: '#fff', padding: '5px 9px', fontSize: '0.74rem', fontWeight: 700, border: 'none', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            onClick={() => {
                              const cleanPhone = c.phone.replace(/[^0-9]/g, '');
                              const msg = `Bonjour ${c.name}, nous vous rappelons amicalement que votre solde de ${formatAmount(c.totalDue)} est à régler. Merci pour votre confiance !`;
                              window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
                            }}
                            title="Relancer par WhatsApp"
                          >
                            <MessageSquare size={13} /> WhatsApp
                          </button>
                          <button 
                            type="button"
                            className="btn" 
                            style={{ background: '#2563EB', color: '#fff', padding: '5px 9px', fontSize: '0.74rem', fontWeight: 700, border: 'none', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            onClick={() => {
                              const cleanPhone = c.phone.replace(/[^0-9]/g, '');
                              const msg = `Bonjour ${c.name}, rappel de votre solde de ${formatAmount(c.totalDue)}. Merci de régler dès que possible.`;
                              window.location.href = `sms:${cleanPhone}?body=${encodeURIComponent(msg)}`;
                            }}
                            title="Relancer par SMS"
                          >
                            SMS
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Derniers Règlements Reçus */}
        <div className="card" style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Derniers Règlements Reçus
            </h3>
            <button 
              type="button"
              onClick={() => setIsNewCreditModalOpen(true)}
              style={{ background: '#EFF6FF', border: 'none', color: '#2563EB', fontWeight: 800, fontSize: '0.78rem', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer' }}
            >
              + Nouveau
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {payments.map(p => (
              <div key={p.id} className="activity-item" style={{ padding: '10px 0' }}>
                <div className="activity-left">
                  <div className="activity-icon green">
                    <Wallet size={16} />
                  </div>
                  <div>
                    <div className="activity-text">{p.clientName}</div>
                    <div className="activity-time">{p.method} • {p.date}</div>
                  </div>
                </div>
                <div className="activity-amount" style={{ color: '#10B981', fontWeight: 800 }}>
                  +{formatAmount(p.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
