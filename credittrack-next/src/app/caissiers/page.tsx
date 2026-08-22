"use client";

import React, { useState } from 'react';
import { useApp, CashierAccount } from '@/context/AppContext';
import { 
  Users, 
  Store, 
  Plus, 
  Key, 
  Trash2, 
  Smartphone, 
  DollarSign, 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  LogIn, 
  Eye, 
  EyeOff,
  Building,
  Activity
} from 'lucide-react';
import { formatAfricanCurrency } from '@/lib/africanCountries';

export default function CashiersManagementPage() {
  const { 
    cashiers, 
    addCashier, 
    deleteCashier, 
    currency, 
    currentRole, 
    activeCashier, 
    logoutToOwner, 
    setIsCashierPinModalOpen,
    showToast 
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showPins, setShowPins] = useState<Record<string, boolean>>({});

  // Form State for new cashier
  const [newCashier, setNewCashier] = useState({
    name: '',
    storeName: '',
    phone: '',
    pin: '1234',
    status: 'active' as const
  });


  const toggleShowPin = (id: string) => {
    setShowPins(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleGeneratePin = () => {
    const randomPin = Math.floor(1000 + Math.random() * 9000).toString();
    setNewCashier(prev => ({ ...prev, pin: randomPin }));
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCashier.name.trim() || !newCashier.storeName.trim() || !newCashier.pin.trim()) {
      alert("Veuillez renseigner le nom, la boutique et le code PIN.");
      return;
    }

    addCashier({
      name: newCashier.name.trim(),
      storeName: newCashier.storeName.trim(),
      phone: newCashier.phone.trim(),
      pin: newCashier.pin.trim(),
      status: newCashier.status
    });

    setNewCashier({
      name: '',
      storeName: '',
      phone: '',
      pin: '1234',
      status: 'active'
    });

    setIsAddModalOpen(false);
  };

  // KPIs
  const totalDailySales = cashiers.reduce((acc, c) => acc + c.dailySalesTotal, 0);
  const totalMonthlySales = cashiers.reduce((acc, c) => acc + c.monthlySalesTotal, 0);
  const activeCount = cashiers.filter(c => c.status === 'active').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <Sparkles size={14} /> Multi-Magasins & Sous-Comptes Vendeurs
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="text-blue-600" /> Gestion des Caissiers & Boutiques
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Créez des accès sécurisés par code PIN pour vos travailleurs sans jamais divulguer votre mot de passe patron
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {currentRole === 'cashier' ? (
            <button
              type="button"
              onClick={logoutToOwner}
              className="btn bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-2 shadow-sm transition"
            >
              <LogIn size={16} /> Quitter Mode Caissier (Connecté: {activeCashier?.name})
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsCashierPinModalOpen(true)}
              className="btn btn-outline border-slate-300 hover:border-slate-400 bg-white text-slate-700 font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition shadow-sm"
            >
              <Lock size={16} /> Tester le Mode Caissier (PIN)
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="btn bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-4 py-2 rounded-xl text-sm flex items-center gap-2 shadow-md shadow-blue-500/20 transition"
          >
            <Plus size={16} /> Ajouter un Caissier
          </button>
        </div>
      </div>

      {/* Row 1: KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Users size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">Caissiers Actifs</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{activeCount} / {cashiers.length}</div>
            <div className="text-xs text-emerald-600 font-semibold mt-0.5">Équipe opérationnelle H24</div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <DollarSign size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">Ventes Caisses Aujourd'hui</div>
            <div className="text-xl font-black text-emerald-600 mt-0.5">
              {formatAfricanCurrency(totalDailySales, currency)}
            </div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">Remontée en temps réel</div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Activity size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">Volume Mensuel Consolidé</div>
            <div className="text-xl font-black text-indigo-600 mt-0.5">
              {formatAfricanCurrency(totalMonthlySales, currency)}
            </div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">Toutes succursales réunies</div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Store size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">Boutiques Déclarées</div>
            <div className="text-2xl font-black text-amber-600 mt-0.5">{cashiers.length}</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Points de vente physiques</div>
          </div>
        </div>

      </div>

      {/* Row 2: Cashiers Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Store size={18} className="text-blue-600" />
              Répertoire des Vendeurs & Points d'Encaissement
            </h2>
            <p className="text-xs text-slate-500">
              Chaque caissier utilise son code PIN pour enregistrer les factures et les paiements de son poste.
            </p>
          </div>
          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
            Synchronisation Cloud Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Vendeur / Caissier</th>
                <th>Boutique / Emplacement</th>
                <th>Code PIN d'Accès</th>
                <th>WhatsApp</th>
                <th style={{ textAlign: 'right' }}>Ventes du Jour</th>
                <th style={{ textAlign: 'right' }}>Total Mois</th>
                <th>Statut</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cashiers.map((csh) => {
                const isPinVisible = showPins[csh.id];
                return (
                  <tr key={csh.id} className="hover:bg-slate-50 transition">
                    <td>
                      <div className="font-extrabold text-slate-900 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                          {csh.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                        <div>
                          <div>{csh.name}</div>
                          <div className="text-xs text-slate-400 font-normal">Dernière activité: {csh.lastActive}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="font-bold text-slate-800 flex items-center gap-1.5 text-sm">
                        <Building size={14} className="text-slate-400" />
                        {csh.storeName}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-300">
                          {isPinVisible ? csh.pin : '••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleShowPin(csh.id)}
                          className="text-slate-400 hover:text-slate-700 p-1"
                          title={isPinVisible ? "Masquer le PIN" : "Afficher le PIN"}
                        >
                          {isPinVisible ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </td>
                    <td>
                      <span className="text-xs font-semibold text-slate-600">{csh.phone}</span>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 800, color: '#10B981', fontFamily: 'monospace' }}>
                      {formatAfricanCurrency(csh.dailySalesTotal, currency)}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 800, color: '#1E293B', fontFamily: 'monospace' }}>
                      {formatAfricanCurrency(csh.monthlySalesTotal, currency)}
                    </td>
                    <td>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        csh.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {csh.status === 'active' ? '● En Ligne' : 'Inactif'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Voulez-vous vraiment supprimer le caissier ${csh.name} ?`)) {
                            deleteCashier(csh.id);
                          }
                        }}
                        className="text-slate-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition"
                        title="Supprimer ce caissier"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 3: Security & Advice for the Owner */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-2xl p-6 shadow-md border border-slate-800">
        <div className="flex items-center gap-3 mb-3">
          <ShieldCheck size={24} className="text-emerald-400" />
          <h3 className="text-base font-extrabold text-white">Sécurité Maximale & Cloisonnement des Données</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/50">
            <strong className="text-white block mb-1">🔐 Aucun Mot de Passe Transmis</strong>
            Les caissiers n'ont jamais besoin de votre mot de passe ni de votre adresse email. Seul le code PIN à 4 chiffres suffit.
          </div>
          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/50">
            <strong className="text-white block mb-1">📊 Bénéfices & Marges Masqués</strong>
            Le caissier ne peut pas voir vos marges bénéficiaires ni les ventes des autres magasins. Il voit uniquement son tiroir-caisse.
          </div>
          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/50">
            <strong className="text-white block mb-1">⚡ Contrôle Centralisé en Direct</strong>
            Toutes les ventes réalisées par vos travailleurs s'actualisent instantanément sur votre tableau de bord central.
          </div>
        </div>
      </div>

      {/* MODAL: ADD NEW CASHIER */}
      {isAddModalOpen && (
        <div className="modal-overlay active" style={{ display: 'flex' }}>
          <div className="modal-card" style={{ maxWidth: '520px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Nouveau Caissier / Boutique</h3>
                  <p style={{ fontSize: '0.78rem', color: '#64748B', margin: 0 }}>Création d'un sous-compte sécurisé</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setIsAddModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '4px' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nom Complet du Caissier *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Ibrahim Soro, Aïcha Barry..."
                  value={newCashier.name}
                  onChange={(e) => setNewCashier({ ...newCashier, name: e.target.value })}
                  className="table-input"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nom de la Boutique ou Magasin *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Boutique Treichville, Dépôt 2..."
                  value={newCashier.storeName}
                  onChange={(e) => setNewCashier({ ...newCashier, storeName: e.target.value })}
                  className="table-input"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Numéro WhatsApp du Caissier</label>
                <input
                  type="text"
                  placeholder="Ex: Numéro WhatsApp du vendeur"
                  value={newCashier.phone}
                  onChange={(e) => setNewCashier({ ...newCashier, phone: e.target.value })}
                  className="table-input"
                />

              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-700">Code PIN Secret (4 chiffres) *</label>
                  <button
                    type="button"
                    onClick={handleGeneratePin}
                    className="text-xs text-blue-600 hover:text-blue-800 font-bold"
                  >
                    🎲 Générer aléatoire
                  </button>
                </div>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={newCashier.pin}
                  onChange={(e) => setNewCashier({ ...newCashier, pin: e.target.value })}
                  className="table-input font-mono font-bold text-lg text-blue-900 tracking-widest text-center"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Ce code sera saisi par le travailleur pour ouvrir sa session au magasin.
                </p>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  className="btn btn-outline flex-1"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-1 bg-blue-600 hover:bg-blue-700 font-extrabold text-white"
                >
                  Enregistrer le Caissier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
