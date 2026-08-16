"use client";

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, PlusCircle, User, Phone, DollarSign, FileText } from 'lucide-react';

export default function ModalNewCredit() {
  const { isNewCreditModalOpen, setIsNewCreditModalOpen, addClient, currency } = useApp();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+225 ');
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');

  if (!isNewCreditModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const numAmount = parseFloat(amount) || 0;
    addClient({
      name: name.trim(),
      phone: phone.trim(),
      totalDue: numAmount,
      status: numAmount > 0 ? 'pending' : 'paid'
    });

    setName('');
    setPhone('+225 ');
    setAmount('');
    setDesc('');
    setIsNewCreditModalOpen(false);
  };

  return (
    <div className="modal-overlay active" style={{ display: 'flex' }}>
      <div className="modal-card" style={{ maxWidth: '520px', padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PlusCircle size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Nouveau Client & Crédit</h3>
              <p style={{ fontSize: '0.78rem', color: '#64748B', margin: 0 }}>Enregistrement direct dans le répertoire</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={() => setIsNewCreditModalOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={14} className="text-blue-600" /> Nom ou Entreprise du Client
            </label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Ex: Boutique Kouamé, Société ABC..." 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={14} className="text-blue-600" /> Numéro WhatsApp (avec indicatif)
            </label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Ex: +225 0701020304" 
              value={phone} 
              onChange={e => setPhone(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <DollarSign size={14} className="text-blue-600" /> Montant de la créance initiale ({currency})
            </label>
            <input 
              type="number" 
              className="form-control" 
              placeholder="0 si aucun crédit initial" 
              value={amount} 
              onChange={e => setAmount(e.target.value)} 
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={14} className="text-blue-600" /> Description des marchandises / service
            </label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Ex: 5 Sacs de Riz 50kg, Facture n°102..." 
              value={desc} 
              onChange={e => setDesc(e.target.value)} 
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
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
              style={{ flex: 1.5, background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' }}
            >
              Enregistrer le Client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
