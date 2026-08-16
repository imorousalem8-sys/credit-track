"use client"
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, Search, PlusCircle, Eye } from 'lucide-react';
import Link from 'next/link';

export default function CreditDashboard() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error("Erreur de chargement des clients:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
          <Users className="text-blue-600" /> Répertoire Clients
        </h1>
        <Link href="/credit/nouveau" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition">
          <PlusCircle size={18} /> Nouveau Crédit
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 flex gap-4 bg-slate-50">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher un client..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500 font-bold">Chargement des données...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm">
                <th className="p-4 font-bold border-b border-slate-200">Client</th>
                <th className="p-4 font-bold border-b border-slate-200">Solvabilité</th>
                <th className="p-4 font-bold border-b border-slate-200">Dette Actuelle</th>
                <th className="p-4 font-bold border-b border-slate-200">Statut</th>
                <th className="p-4 font-bold border-b border-slate-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">Aucun client enregistré pour le moment.</td>
                </tr>
              ) : (
                clients.map(client => (
                  <tr key={client.id} className="hover:bg-slate-50 border-b border-slate-100 transition">
                    <td className="p-4">
                      <div className="font-extrabold text-slate-800">{client.name}</div>
                      <div className="text-xs text-slate-500">{client.phone}</div>
                    </td>
                    <td className="p-4">
                      <div className={`font-bold ${client.reliability_score >= 80 ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {client.reliability_score} / 100
                      </div>
                    </td>
                    <td className="p-4 font-extrabold text-blue-600">
                      {client.total_due.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        client.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 
                        client.status === 'overdue' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {client.status === 'paid' ? '🟢 À Jour' : client.status === 'overdue' ? '🔴 Impayé' : '🟠 En Cours'}
                      </span>
                    </td>
                    <td className="p-4">
                      <button className="text-blue-600 hover:text-blue-800 font-bold text-sm flex items-center gap-1 border border-blue-200 px-3 py-1 rounded-lg">
                        <Eye size={14} /> Fiche
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
