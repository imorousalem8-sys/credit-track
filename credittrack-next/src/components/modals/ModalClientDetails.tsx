"use client";

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, MessageSquare, DollarSign, History, Shield, Calendar } from 'lucide-react';

export default function ModalClientDetails() {
  const { selectedClient, setSelectedClient, updateClientPayment, formatAmount, currency } = useApp();
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('Wave Mobile Money');

  if (!selectedClient) return null;

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(payAmount);
    if (!amount || amount <= 0) return;

    updateClientPayment(selectedClient.id, amount, {
      clientName: selectedClient.name,
      clientPhone: selectedClient.phone,
      itemsDesc: `Règlement Créance (${payMethod})`,
      method: payMethod
    });

    setPayAmount('');
    setSelectedClient(null);
  };

  const sendWhatsApp = () => {
    const cleanPhone = selectedClient.phone.replace(/[^0-9]/g, '');
    const msg = `Bonjour ${selectedClient.name},\nNous vous rappelons que votre solde chez CréditTrack s'élève à ${formatAmount(selectedClient.totalDue)}.\nMerci de régulariser par Wave ou Mobile Money.\nCordialement.`;
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const scoreColor = selectedClient.reliabilityScore >= 80 ? '#10B981' : (selectedClient.reliabilityScore >= 50 ? '#F59E0B' : '#EF4444');
  const scoreText = selectedClient.reliabilityScore >= 80 ? 'Excellente Solvabilité' : (selectedClient.reliabilityScore >= 50 ? 'Solvabilité Moyenne' : 'Risque Élevé');

  return (
    <div className="modal-overlay active" style={{ display: 'flex' }}>
      <div className="modal-card" style={{ maxWidth: '680px', padding: 0, overflow: 'hidden' }}>
        
        {/* Banner Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
          padding: '24px',
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: '#334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              fontWeight: 800,
              border: '2px solid #475569',
              color: '#38BDF8'
            }}>
              {selectedClient.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800 }}>{selectedClient.name}</h2>
              <p style={{ margin: '4px 0 0 0', color: '#94A3B8', fontSize: '0.88rem' }}>{selectedClient.phone}</p>
              <div style={{
                marginTop: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                background: 'rgba(255,255,255,0.08)',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: scoreColor
              }}>
                <Shield size={12} /> {selectedClient.reliabilityScore}/100 — {scoreText}
              </div>
            </div>
          </div>
          <button 
            type="button" 
            onClick={() => setSelectedClient(null)}
            style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
          >
            <X size={22} />
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          
          {/* Due Banner & WhatsApp Action */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700 }}>Dette Totale Restante</div>
              <div style={{ fontSize: '1.7rem', fontWeight: 800, color: selectedClient.totalDue > 0 ? '#2563EB' : '#10B981', marginTop: '4px' }}>
                {formatAmount(selectedClient.totalDue)}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px' }}>
                Statut : {selectedClient.totalDue === 0 ? 'À Jour' : 'Paiement en attente'}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center' }}>
              <button 
                type="button"
                className="btn"
                style={{ background: '#25D366', color: '#fff', fontWeight: 700, width: '100%' }}
                onClick={sendWhatsApp}
              >
                <MessageSquare size={16} /> Relancer sur WhatsApp
              </button>
            </div>
          </div>

          {/* Quick Payment Form */}
          {selectedClient.totalDue > 0 && (
            <form onSubmit={handlePaySubmit} style={{
              background: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '20px'
            }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1E40AF', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <DollarSign size={16} /> Enregistrer un Règlement / Versement
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr auto', gap: '10px', alignItems: 'flex-end' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Montant Versé ({currency})</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder={`Max: ${selectedClient.totalDue}`}
                    value={payAmount}
                    onChange={e => setPayAmount(e.target.value)}
                    max={selectedClient.totalDue}
                    required
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Moyen de paiement</label>
                  <select className="form-control" value={payMethod} onChange={e => setPayMethod(e.target.value)}>
                    <option value="Wave Mobile Money">Wave Mobile</option>
                    <option value="Orange Money">Orange Money</option>
                    <option value="MTN MoMo">MTN MoMo</option>
                    <option value="Espèces / Caisse">Espèces</option>
                    <option value="Virement Bancaire">Virement Bancaire</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary" style={{ height: '42px', padding: '0 16px' }}>
                  Valider
                </button>
              </div>
            </form>
          )}

          {/* Transaction History */}
          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <History size={16} className="text-slate-400" /> Historique des Opérations
            </h4>
            <div style={{ maxHeight: '160px', overflowY: 'auto', border: '1px solid #E2E8F0', borderRadius: '10px' }}>
              <table className="data-table" style={{ margin: 0, fontSize: '0.82rem' }}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th className="text-right">Montant</th>
                    <th className="text-right">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {(!selectedClient.transactions || selectedClient.transactions.length === 0) ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', color: '#94A3B8', padding: '16px' }}>
                        Aucun historique disponible.
                      </td>
                    </tr>
                  ) : (
                    selectedClient.transactions.map((t, idx) => (
                      <tr key={idx}>
                        <td style={{ color: '#64748B' }}>{t.date}</td>
                        <td style={{ fontWeight: 700 }}>{t.desc}</td>
                        <td className="text-right font-bold" style={{ color: '#2563EB' }}>{formatAmount(t.amount)}</td>
                        <td className="text-right">
                          <span className={`badge ${t.status === 'paid' ? 'badge-green' : 'badge-orange'}`}>
                            {t.status === 'paid' ? 'Réglé' : 'En attente'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
