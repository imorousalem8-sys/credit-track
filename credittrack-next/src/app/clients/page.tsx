"use client";

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Users, Search, PlusCircle, Eye, MessageSquare, Shield, CheckCircle, AlertTriangle } from 'lucide-react';

export default function ClientsPage() {
  const { clients, formatAmount, setSelectedClient, setIsNewCreditModalOpen } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const sendWhatsApp = (clientName: string, phone: string, amount: number) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const msg = `Bonjour ${clientName},\nVotre solde restant chez CréditTrack s'élève à ${formatAmount(amount)}.\nMerci de régulariser par Wave ou Mobile Money.`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={24} className="text-blue-600" />
            Répertoire des Clients & Scoring Solvabilité
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '4px 0 0 0' }}>
            Gestion centralisée des créances, historique de paiement et relances automatiques
          </p>
        </div>

        <button 
          type="button" 
          className="btn btn-primary"
          onClick={() => setIsNewCreditModalOpen(true)}
          style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', padding: '10px 20px', borderRadius: '10px', fontWeight: 800 }}
        >
          <PlusCircle size={18} /> Nouveau Client
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="card" style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          
          {/* Search Box */}
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input 
              type="text" 
              className="form-control" 
              placeholder="Rechercher par nom, téléphone ou entreprise..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '38px', height: '42px', borderRadius: '10px' }}
            />
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              type="button"
              className={`btn ${filterStatus === 'all' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '8px 14px', fontSize: '0.82rem' }}
              onClick={() => setFilterStatus('all')}
            >
              Tous ({clients.length})
            </button>
            <button 
              type="button"
              className={`btn ${filterStatus === 'pending' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '8px 14px', fontSize: '0.82rem' }}
              onClick={() => setFilterStatus('pending')}
            >
              En cours
            </button>
            <button 
              type="button"
              className={`btn ${filterStatus === 'overdue' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '8px 14px', fontSize: '0.82rem', borderColor: filterStatus === 'overdue' ? '' : '#FCA5A5', color: filterStatus === 'overdue' ? '#fff' : '#DC2626' }}
              onClick={() => setFilterStatus('overdue')}
            >
              Impayés
            </button>
            <button 
              type="button"
              className={`btn ${filterStatus === 'paid' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '8px 14px', fontSize: '0.82rem' }}
              onClick={() => setFilterStatus('paid')}
            >
              À jour
            </button>
          </div>

        </div>
      </div>

      {/* Clients Table Card */}
      <div className="card" style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="custom-table" style={{ width: '100%', margin: 0 }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                <th style={{ padding: '16px 20px' }}>Nom / Entreprise</th>
                <th style={{ padding: '16px 20px' }}>Score de Solvabilité</th>
                <th style={{ padding: '16px 20px' }}>Créance Restante</th>
                <th style={{ padding: '16px 20px' }}>Statut</th>
                <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>
                    Aucun client ne correspond à votre recherche.
                  </td>
                </tr>
              ) : (
                filteredClients.map(client => {
                  const scoreColor = client.reliabilityScore >= 80 ? '#10B981' : (client.reliabilityScore >= 50 ? '#F59E0B' : '#EF4444');
                  const scoreText = client.reliabilityScore >= 80 ? 'Très Fiable' : (client.reliabilityScore >= 50 ? 'Moyen' : 'Risqué');

                  return (
                    <tr key={client.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.92rem' }}>{client.name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{client.phone}</div>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 800, color: scoreColor, fontSize: '0.88rem' }}>
                            {client.reliabilityScore}/100
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#64748B' }}>({scoreText})</span>
                        </div>
                        <div style={{ width: '120px', height: '6px', background: '#E2E8F0', borderRadius: '3px', marginTop: '6px' }}>
                          <div style={{ width: `${client.reliabilityScore}%`, height: '100%', background: scoreColor, borderRadius: '3px' }}></div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px', fontWeight: 800, fontSize: '0.95rem', color: client.totalDue > 0 ? '#2563EB' : '#10B981' }}>
                        {formatAmount(client.totalDue)}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span className={`badge-status ${client.status}`}>
                          {client.status === 'paid' ? '🟢 À Jour' : client.status === 'overdue' ? '🔴 Impayé' : '🟠 En cours'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button 
                            type="button" 
                            className="btn btn-outline"
                            style={{ padding: '6px 12px', fontSize: '0.78rem', borderColor: '#2563EB', color: '#2563EB' }}
                            onClick={() => setSelectedClient(client)}
                          >
                            <Eye size={14} /> Fiche
                          </button>
                          {client.totalDue > 0 && (
                            <button 
                              type="button" 
                              className="btn"
                              style={{ background: '#25D366', color: '#fff', padding: '6px 12px', fontSize: '0.78rem', fontWeight: 700 }}
                              onClick={() => sendWhatsApp(client.name, client.phone, client.totalDue)}
                            >
                              <MessageSquare size={14} /> Relancer
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
