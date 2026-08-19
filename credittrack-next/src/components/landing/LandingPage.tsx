"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Users,
  MessageSquare,
  Wallet,
  FileText,
  BarChart3,
  ArrowRight,
  Check,
  X as XIcon,
  Sparkles,
  Lock,
  Smartphone,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="landing-page-root" style={{ background: '#0B1120', color: '#F8FAFC', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
      
      {/* ── TOP PUBLIC HEADER ── */}
      <header className="public-top-nav" style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(11, 17, 32, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '0 32px',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)'
          }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.3px', lineHeight: 1.1 }}>
              CréditTrack <span style={{ color: '#38BDF8', fontSize: '0.85rem' }}>PRO</span>
            </div>
            <div style={{ fontSize: '0.62rem', color: '#94A3B8', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
              GESTION CRÉANCES & RECOUVREMENT
            </div>
          </div>
        </div>

        {/* Nav Links (Desktop) */}
        <nav className="landing-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <a href="#features" style={{ color: '#CBD5E1', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600, transition: 'color 0.2s' }}>Fonctionnalités</a>
          <a href="#comparison" style={{ color: '#CBD5E1', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600, transition: 'color 0.2s' }}>Comparatif</a>
          <a href="#pricing" style={{ color: '#CBD5E1', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600, transition: 'color 0.2s' }}>Tarifs</a>
          <Link
            href="/dashboard"
            className="btn-commencer-glow"
            style={{
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              color: '#fff',
              padding: '10px 22px',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '0.88rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(37, 99, 235, 0.4)'
            }}
          >
            <span>Accéder au Dashboard</span>
            <ArrowRight size={16} />
          </Link>
        </nav>
      </header>

      {/* ── HERO SECTION ── */}
      <section className="lp-hero-live-section" id="hero" style={{ padding: '60px 24px 40px', maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
        
        {/* B2B Status Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          background: 'rgba(37, 99, 235, 0.12)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: 800,
          color: '#38BDF8',
          marginBottom: '24px',
          letterSpacing: '0.5px',
          textTransform: 'uppercase'
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38BDF8', display: 'inline-block', boxShadow: '0 0 8px #38BDF8' }}></span>
          <span>GESTION DES CRÉANCES CLIENTS & RECOUVREMENT B2B</span>
        </div>

        {/* Hero Title */}
        <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 800, lineHeight: 1.15, margin: '0 auto 20px', maxWidth: '960px', letterSpacing: '-1px' }}>
          <span style={{ color: '#FFFFFF' }}>Zéro Créance Oubliée.</span><br />
          <span style={{ background: 'linear-gradient(135deg, #38BDF8 0%, #2563EB 50%, #60A5FA 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Recouvrez Vos Factures 3x Plus Vite.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: '#94A3B8', maxWidth: '720px', margin: '0 auto 32px', lineHeight: 1.6 }}>
          Remplacez les carnets manuels et sécurisez votre trésorerie d'entreprise. Suivez vos clients en temps réel, encaissez par <strong>Wave et Mobile Money</strong> et délivrez des reçus officiels certifiés.
        </p>

        {/* Hero Actions */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '40px' }}>
          <Link
            href="/dashboard"
            style={{
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              color: '#fff',
              padding: '14px 32px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '1rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 6px 24px rgba(37, 99, 235, 0.45)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
          >
            <span>Ouvrir l'Espace Pro Démo</span>
            <ArrowRight size={18} />
          </Link>
          <a
            href="#features"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#CBD5E1',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              padding: '14px 28px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '1rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>Voir les Fonctionnalités</span>
          </a>
        </div>

        {/* Payment badges */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', flexWrap: 'wrap', color: '#64748B', fontSize: '0.8rem', fontWeight: 700, marginBottom: '48px' }}>
          <span>Règlements supportés :</span>
          <span style={{ background: 'rgba(255,255,255,0.06)', padding: '4px 10px', borderRadius: '6px', color: '#38BDF8', border: '1px solid rgba(255,255,255,0.1)' }}>Wave Mobile</span>
          <span style={{ background: 'rgba(255,255,255,0.06)', padding: '4px 10px', borderRadius: '6px', color: '#FBBF24', border: '1px solid rgba(255,255,255,0.1)' }}>MTN MoMo</span>
          <span style={{ background: 'rgba(255,255,255,0.06)', padding: '4px 10px', borderRadius: '6px', color: '#FB923C', border: '1px solid rgba(255,255,255,0.1)' }}>Orange Money</span>
          <span style={{ background: 'rgba(255,255,255,0.06)', padding: '4px 10px', borderRadius: '6px', color: '#34D399', border: '1px solid rgba(255,255,255,0.1)' }}>Moov Money</span>
          <span style={{ background: 'rgba(255,255,255,0.06)', padding: '4px 10px', borderRadius: '6px', color: '#E2E8F0', border: '1px solid rgba(255,255,255,0.1)' }}>Espèces & Banque</span>
        </div>

        {/* ── 3D DASHBOARD SHOWCASE IMAGE (REFINED NO AI FACES) ── */}
        <div style={{ position: 'relative', maxWidth: '1080px', margin: '0 auto' }}>
          <Link
            href="/dashboard"
            style={{
              display: 'block',
              position: 'relative',
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 50px rgba(37, 99, 235, 0.25)',
              transition: 'transform 0.3s ease, border-color 0.3s ease'
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero_dashboard_pro.jpg?v=20260820_v2"
              alt="CréditTrack PRO 3D Dashboard Showcase"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                borderRadius: '20px'
              }}
            />
            {/* Overlay Badge */}
            <div style={{
              position: 'absolute',
              bottom: '24px',
              right: '24px',
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              color: '#fff',
              padding: '10px 18px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block', boxShadow: '0 0 6px #10B981' }}></span>
              <span>CréditTrack PRO • Cliquez pour ouvrir la Démo Live →</span>
            </div>
          </Link>
        </div>

      </section>

      {/* ── CHIFFRES CLÉS / STATS STRIP ── */}
      <section style={{ background: '#0F172A', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '36px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38BDF8' }}>+50 000 000 <span style={{ fontSize: '0.9rem', color: '#94A3B8' }}>FCFA</span></div>
            <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700, marginTop: '4px' }}>Recouvrés par nos commerçants</div>
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF' }}>1 250+</div>
            <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700, marginTop: '4px' }}>Comptes d'entreprises actifs</div>
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10B981' }}>98.6 %</div>
            <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700, marginTop: '4px' }}>Taux de règlement à échéance</div>
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#F59E0B' }}>15+</div>
            <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700, marginTop: '4px' }}>Pays et devises couverts</div>
          </div>
        </div>
      </section>

      {/* ── COMPARATIF B2B : CAHIER PAPIER VS CREDITTRACK PRO ── */}
      <section id="comparison" style={{ padding: '80px 24px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', margin: '0 0 10px' }}>
            Gestion Manuelle vs Solution CréditTrack PRO
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem' }}>
            Comparatif des risques de gestion et des gains de productivité pour votre commerce.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          
          {/* Cahier Papier */}
          <div style={{ background: '#131D31', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '16px', padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                <XIcon size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0 }}>Gestion Traditionnelle (Cahier papier)</h3>
                <div style={{ fontSize: '0.75rem', color: '#EF4444', fontWeight: 700 }}>Risques d'erreurs et de pertes sèches</div>
              </div>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.88rem', color: '#94A3B8' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ color: '#EF4444' }}>✕</span>
                <span><strong>Perte ou détérioration des registres :</strong> Impossibilité de justifier les montants dus.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ color: '#EF4444' }}>✕</span>
                <span><strong>Litiges fréquents avec les clients :</strong> Absence d'historique certifié des acomptes.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ color: '#EF4444' }}>✕</span>
                <span><strong>Relances oubliées :</strong> Les retards s'accumulent sans alertes automatiques.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ color: '#EF4444' }}>✕</span>
                <span><strong>Absence de bilan comptable :</strong> Calcul de TVA et livre de caisse complexes.</span>
              </li>
            </ul>
          </div>

          {/* CréditTrack PRO */}
          <div style={{ background: '#0F1E36', border: '2px solid #2563EB', borderRadius: '16px', padding: '32px', boxShadow: '0 10px 30px rgba(37,99,235,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(37, 99, 235, 0.25)', color: '#38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                <Check size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0 }}>CréditTrack PRO</h3>
                <div style={{ fontSize: '0.75rem', color: '#38BDF8', fontWeight: 700 }}>Plateforme Sécurisée & Traçabilité Complète</div>
              </div>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.88rem', color: '#CBD5E1' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ color: '#10B981' }}>✓</span>
                <span><strong>Base de données chiffrée :</strong> Données accessibles en permanence même hors-ligne.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ color: '#10B981' }}>✓</span>
                <span><strong>Relances WhatsApp en 1 clic :</strong> Messages pré-rédigés avec détail exact du solde.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ color: '#10B981' }}>✓</span>
                <span><strong>Reçus numériques signés :</strong> Émargement digital au doigt et export PDF.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ color: '#10B981' }}>✓</span>
                <span><strong>Comptabilité SYSCOHADA :</strong> Calcul automatique de TVA et grand livre des comptes.</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* ── BENTO GRID FONCTIONNALITÉS ── */}
      <section id="features" style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', margin: '0 0 10px' }}>
            Fonctionnalités Métier Intégrées
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem' }}>
            Tous les outils professionnels conçus pour la gestion commerciale et financière quotidienne.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          
          <div style={{ background: '#111C30', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '24px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(37, 99, 235, 0.15)', color: '#38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Users size={22} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: '0 0 8px' }}>Répertoire & Scoring Client</h3>
            <p style={{ fontSize: '0.84rem', color: '#94A3B8', lineHeight: 1.5, margin: 0 }}>
              Centralisez vos fiches clients et évaluez leur solvabilité selon la ponctualité de leurs règlements passés.
            </p>
          </div>

          <div style={{ background: '#111C30', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '24px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <MessageSquare size={22} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: '0 0 8px' }}>Rappels WhatsApp & SMS</h3>
            <p style={{ fontSize: '0.84rem', color: '#94A3B8', lineHeight: 1.5, margin: 0 }}>
              Délivrez des avis d'échéance précis avec la ventilation détaillée des articles facturés en un simple clic.
            </p>
          </div>

          <div style={{ background: '#111C30', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '24px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Wallet size={22} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: '0 0 8px' }}>Multi-Moyens d'Encaissement</h3>
            <p style={{ fontSize: '0.84rem', color: '#94A3B8', lineHeight: 1.5, margin: 0 }}>
              Prise en charge de Wave, Orange Money, MTN MoMo, Moov Money et flux d'espèces en caisse physique.
            </p>
          </div>

          <div style={{ background: '#111C30', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '24px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(147, 51, 234, 0.15)', color: '#A855F7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <FileText size={22} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: '0 0 8px' }}>Signature Tactile & Reçus</h3>
            <p style={{ fontSize: '0.84rem', color: '#94A3B8', lineHeight: 1.5, margin: 0 }}>
              Émargement numérique direct sur smartphone et délivrance de reçus certifiés avec QR code de vérification.
            </p>
          </div>

          <div style={{ background: '#111C30', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '24px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <BarChart3 size={22} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: '0 0 8px' }}>Comptabilité SYSCOHADA</h3>
            <p style={{ fontSize: '0.84rem', color: '#94A3B8', lineHeight: 1.5, margin: 0 }}>
              Suivi des recettes, charges et calcul automatique de TVA selon la réglementation fiscale de votre pays.
            </p>
          </div>

        </div>
      </section>

      {/* ── SECTION TARIFS ── */}
      <section id="pricing" style={{ padding: '80px 24px', maxWidth: '960px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', margin: '0 0 10px' }}>
            Tarifs Transparents & Sans Surprise
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem' }}>
            Accédez à toutes les fonctionnalités avancées pour booster votre trésorerie.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          
          {/* Forfait Mensuel */}
          <div style={{ background: '#111C30', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Forfait Mensuel</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', margin: '6px 0 16px' }}>PRO Mensuel</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '20px' }}>
                <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff' }}>5 000</span>
                <span style={{ color: '#94A3B8', fontSize: '0.9rem', fontWeight: 700 }}>FCFA / mois</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem', color: '#CBD5E1' }}>
                <li>✓ Clients & Créances illimités</li>
                <li>✓ Relances WhatsApp en 1 clic</li>
                <li>✓ Reçus certifiés avec QR Code</li>
                <li>✓ Journal comptable SYSCOHADA</li>
              </ul>
            </div>
            <Link
              href="/dashboard"
              style={{
                background: 'rgba(255,255,255,0.08)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.15)',
                padding: '12px',
                borderRadius: '10px',
                fontWeight: 800,
                textAlign: 'center',
                textDecoration: 'none',
                marginTop: '28px',
                display: 'block'
              }}
            >
              Choisir PRO Mensuel
            </Link>
          </div>

          {/* Forfait Annuel */}
          <div style={{ background: 'linear-gradient(145deg, #0F1E36 0%, #172554 100%)', border: '2px solid #2563EB', borderRadius: '16px', padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', boxShadow: '0 12px 35px rgba(37,99,235,0.25)' }}>
            <div style={{ position: 'absolute', top: '-12px', right: '20px', background: '#38BDF8', color: '#0F172A', fontWeight: 800, fontSize: '0.7rem', padding: '3px 10px', borderRadius: '20px', textTransform: 'uppercase' }}>
              3 Mois Offerts
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Forfait Recommandé</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', margin: '6px 0 16px' }}>PRO Annuel</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '20px' }}>
                <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff' }}>45 000</span>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontWeight: 700 }}>FCFA / an</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem', color: '#E2E8F0' }}>
                <li>✓ Tous les avantages PRO pendant 1 an</li>
                <li>✓ 3 Mois de service offerts</li>
                <li>✓ Support prioritaire 24/7</li>
                <li>✓ Sauvegarde cloud automatique</li>
              </ul>
            </div>
            <Link
              href="/dashboard"
              style={{
                background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                color: '#fff',
                padding: '12px',
                borderRadius: '10px',
                fontWeight: 800,
                textAlign: 'center',
                textDecoration: 'none',
                marginTop: '28px',
                display: 'block',
                boxShadow: '0 4px 14px rgba(37,99,235,0.4)'
              }}
            >
              Choisir PRO Annuel
            </Link>
          </div>

        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '40px 24px 30px', textAlign: 'center', color: '#64748B', fontSize: '0.82rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '16px' }}>
          <Link href="/privacy" style={{ color: '#94A3B8', textDecoration: 'none' }}>Politique de Confidentialité</Link>
          <span>•</span>
          <Link href="/account/delete" style={{ color: '#94A3B8', textDecoration: 'none' }}>Gestion & Suppression de Compte</Link>
          <span>•</span>
          <Link href="/dashboard" style={{ color: '#38BDF8', textDecoration: 'none', fontWeight: 700 }}>Accès Espace SaaS</Link>
        </div>
        <div>
          CréditTrack PRO © 2026 — Plateforme Panafricaine de Recouvrement & Gestion de Créances.
        </div>
      </footer>

    </div>
  );
}
