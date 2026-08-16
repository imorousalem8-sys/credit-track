"use client"
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Save, ArrowLeft, User, DollarSign, Shield } from 'lucide-react';
import Link from 'next/link';

export default function NewCreditWizard() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    cni: '',
    amount: '',
    dueDate: '',
    description: '',
    penaltyRate: '0',
    guarantorName: '',
    guarantorPhone: ''
  });

  const handleChange = (e: any) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 1. Créer le client
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .insert([{
          name: formData.name,
          phone: formData.phone,
          cni: formData.cni,
          total_due: parseFloat(formData.amount),
          status: 'active'
        }])
        .select()
        .single();
        
      if (clientError) throw clientError;

      // 2. Lier le crédit
      const { error: creditError } = await supabase
        .from('credits')
        .insert([{
          client_id: clientData.id,
          amount: parseFloat(formData.amount),
          due_date: formData.dueDate,
          description: formData.description,
          penalty_rate: parseFloat(formData.penaltyRate),
          guarantor_name: formData.guarantorName,
          guarantor_phone: formData.guarantorPhone
        }]);

      if (creditError) throw creditError;

      alert("Le crédit a été enregistré avec succès !");
      window.location.href = '/credit'; // redirect

    } catch (error: any) {
      console.error(error);
      alert("Erreur lors de l'enregistrement: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
          Saisir un Nouveau Crédit
        </h1>
        <Link href="/credit" className="text-slate-500 hover:text-slate-700 font-bold flex items-center gap-2 transition">
          <ArrowLeft size={18} /> Retour
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Step 1 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
            <User className="text-blue-600"/> 1. Identité du Client
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Nom Complet *</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500" placeholder="Ex: Jean Dupont" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Téléphone *</label>
              <input required type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500" placeholder="+225 00000000" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">N° Pièce (CNI/Passeport)</label>
              <input type="text" name="cni" value={formData.cni} onChange={handleChange} className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500" placeholder="Ex: C009876543" />
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
            <DollarSign className="text-blue-600"/> 2. Détails Financiers de la Créance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Montant du Crédit (FCFA) *</label>
              <input required type="number" name="amount" value={formData.amount} onChange={handleChange} className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 text-blue-600 font-bold" placeholder="Ex: 150000" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Date d'échéance prévue *</label>
              <input required type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Taux de Pénalité Retard (%)</label>
              <input type="number" name="penaltyRate" value={formData.penaltyRate} onChange={handleChange} className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500" placeholder="0" />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-bold text-slate-700 mb-2">Description des marchandises / motif *</label>
              <input required type="text" name="description" value={formData.description} onChange={handleChange} className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500" placeholder="Ex: 3 sacs de ciment + 1 tonne de fer" />
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Shield className="text-blue-600"/> 3. Garanties (Optionnel)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Nom du Garant / Caution</label>
              <input type="text" name="guarantorName" value={formData.guarantorName} onChange={handleChange} className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500" placeholder="Ex: Marie Dupont" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Téléphone du Garant</label>
              <input type="text" name="guarantorPhone" value={formData.guarantorPhone} onChange={handleChange} className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500" placeholder="+225 00000000" />
            </div>
          </div>
        </div>

        <button disabled={loading} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl font-extrabold text-lg flex items-center justify-center gap-2 transition disabled:opacity-50">
          {loading ? 'Sauvegarde en cours...' : <><Save /> Enregistrer ce Dossier de Crédit</>}
        </button>

      </form>
    </div>
  );
}
