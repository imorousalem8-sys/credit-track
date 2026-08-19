"use client"
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Calculator, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import Link from 'next/link';

export default function AccountingDashboard() {
  const [balances, setBalances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [totalAsset, setTotalAsset] = useState(0);
  const [totalLiability, setTotalLiability] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    fetchBalances();
  }, []);

  async function fetchBalances() {
    try {
      const { data, error } = await supabase.from('account_balances').select('*');
      if (error) throw error;
      
      setBalances(data || []);
      
      let asset = 0, liability = 0, revenue = 0, expense = 0;
      (data || []).forEach(account => {
        if (account.type === 'ASSET') asset += Number(account.balance);
        if (account.type === 'LIABILITY') liability += Number(account.balance);
        if (account.type === 'REVENUE') revenue += Number(account.balance);
        if (account.type === 'EXPENSE') expense += Number(account.balance);
      });
      
      setTotalAsset(asset);
      setTotalLiability(liability);
      setTotalRevenue(revenue);
      setTotalExpense(expense);
      
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard-container">
      {/* Header action replaced the double Title header */}
      <div className="flex-between mb-4">
        <div></div>
        <Link href="/accounting/nouvelle-ecriture" className="btn-primary">
          <Activity size={18} /> Saisir une Écriture
        </Link>
      </div>

      {loading ? (
        <div className="empty-state">Calcul des balances en cours...</div>
      ) : (
        <>
          {/* KPIs */}
          <div className="grid-kpis">
            <div className="card">
              <div className="card-header-kpi">
                Total Actif <ArrowUpRight className="text-success" size={16}/>
              </div>
              <div className="card-value-kpi">{totalAsset.toLocaleString('fr-FR')} FCFA</div>
              <div className="card-sub-kpi text-success">Caisse, Banque, Créances</div>
            </div>
            
            <div className="card">
              <div className="card-header-kpi">
                Total Passif <ArrowDownRight className="text-danger" size={16}/>
              </div>
              <div className="card-value-kpi">{totalLiability.toLocaleString('fr-FR')} FCFA</div>
              <div className="card-sub-kpi text-danger">Dettes & Engagements</div>
            </div>

            <div className="card">
              <div className="card-header-kpi">
                Chiffre d'Affaires <ArrowUpRight className="text-success" size={16}/>
              </div>
              <div className="card-value-kpi primary">{totalRevenue.toLocaleString('fr-FR')} FCFA</div>
            </div>
            
            <div className="card">
              <div className="card-header-kpi">
                Total Dépenses <ArrowDownRight className="text-warning" size={16}/>
              </div>
              <div className="card-value-kpi">{totalExpense.toLocaleString('fr-FR')} FCFA</div>
            </div>
          </div>

          {/* Balance Générale */}
          <div className="data-table-container">
            <div className="data-table-header">
              <span className="data-table-title">Balance Générale des Comptes</span>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Compte</th>
                  <th>Type</th>
                  <th className="text-right">Total Débits</th>
                  <th className="text-right">Total Crédits</th>
                  <th className="text-right">Solde Actuel</th>
                </tr>
              </thead>
              <tbody>
                {balances.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="empty-state">Aucune donnée comptable.</td>
                  </tr>
                ) : (
                  balances.map(account => (
                    <tr key={account.id}>
                      <td className="font-bold">{account.code}</td>
                      <td className="font-extrabold">{account.name}</td>
                      <td>
                        <span className="badge badge-gray">{account.type}</span>
                      </td>
                      <td className="text-right font-mono">{Number(account.total_debit).toLocaleString('fr-FR')}</td>
                      <td className="text-right font-mono">{Number(account.total_credit).toLocaleString('fr-FR')}</td>
                      <td className={`text-right font-extrabold font-mono ${Number(account.balance) < 0 ? 'text-danger' : 'text-success'}`}>
                        {Number(account.balance).toLocaleString('fr-FR')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
