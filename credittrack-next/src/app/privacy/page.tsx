import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Lock, FileText, UserCheck } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', padding: '40px 24px', color: '#0F172A', lineHeight: '1.7' }}>
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#2563EB', fontWeight: 700, textDecoration: 'none', marginBottom: '24px' }}>
        <ArrowLeft size={18} /> Retour à l'application
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div style={{ width: '44px', height: '44px', background: '#EFF6FF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}>
          <ShieldCheck size={26} />
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>Politique de Confidentialité & Protection des Données</h1>
      </div>
      <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '32px' }}>Dernière mise à jour : 19 Août 2026 — Conforme aux exigences Google Play & Apple App Store</p>

      <section style={{ marginBottom: '28px', background: '#FFFFFF', padding: '24px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '12px', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Lock size={18} className="text-blue-600" /> 1. Données collectées
        </h2>
        <p style={{ fontSize: '0.95rem', color: '#334155' }}>
          CréditTrack PRO collecte uniquement les informations nécessaires au suivi des créances commerciales, de la facturation et de la tenue comptable de votre entreprise :
        </p>
        <ul style={{ paddingLeft: '20px', marginTop: '10px', fontSize: '0.92rem', color: '#475569' }}>
          <li>Données d'identification de l'entreprise (Nom commercial, Registre du Commerce, Téléphone, Email).</li>
          <li>Données des créances et règlements clients (Nom du client débiteur, Montant dû, Échéances, Reçus électroniques signés).</li>
          <li>Paramètres régionaux et fiscaux (Zone OHADA / UEMOA / CEMAC, taux de TVA applicable).</li>
        </ul>
      </section>

      <section style={{ marginBottom: '28px', background: '#FFFFFF', padding: '24px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '12px', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={18} className="text-blue-600" /> 2. Utilisation et Partage des Données
        </h2>
        <p style={{ fontSize: '0.95rem', color: '#334155' }}>
          Vos données financières sont strictement confidentielles. CréditTrack PRO :
        </p>
        <ul style={{ paddingLeft: '20px', marginTop: '10px', fontSize: '0.92rem', color: '#475569' }}>
          <li><strong>Ne vend jamais</strong> vos données financières ou clients à des tiers.</li>
          <li>Utilise un chiffrement de bout en bout (TLS 1.3 et AES-256) lors des transferts et du stockage.</li>
          <li>Permet le fonctionnement en mode hors-ligne sans fuite de données vers des serveurs publicitaires.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '28px', background: '#FFFFFF', padding: '24px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '12px', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserCheck size={18} className="text-blue-600" /> 3. Vos Droits & Suppression de Compte
        </h2>
        <p style={{ fontSize: '0.95rem', color: '#334155' }}>
          Conformément aux directives de confidentialité d'Apple (Guideline 5.1.1) et du RGPD, vous disposez d'un droit permanent d'accès, d'exportation et de suppression définitive de l'intégralité de vos données.
        </p>
        <p style={{ marginTop: '10px' }}>
          Pour demander la suppression instantanée de votre compte et de toutes vos données associées :
        </p>
        <div style={{ marginTop: '12px' }}>
          <Link href="/account/delete" style={{ display: 'inline-block', background: '#FEF2F2', color: '#EF4444', border: '1px solid #FEE2E2', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, textDecoration: 'none', fontSize: '0.88rem' }}>
            Accéder au formulaire de suppression de compte
          </Link>
        </div>
      </section>

      <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem', marginTop: '40px' }}>
        CréditTrack PRO © 2026 — Tous droits réservés.
      </div>
    </div>
  );
}
