"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { RefreshCw, Sparkles, X, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export interface AppVersionInfo {
  version: string;
  build: string;
  commit?: string;
  builtAt?: string;
  timestamp?: string;
}

export function useVersionUpdate() {
  const [currentBuild, setCurrentBuild] = useState<string | null>(null);
  const [latestBuildInfo, setLatestBuildInfo] = useState<AppVersionInfo | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null);
  const [swStatus, setSwStatus] = useState<string>('initialisation');
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState<boolean>(false);
  const refreshingRef = useRef<boolean>(false);

  // Fonction de vérification de version auprès du serveur
  const checkForUpdates = useCallback(async (isManual = false): Promise<boolean> => {
    if (typeof window === 'undefined') return false;
    setIsChecking(true);

    try {
      // 1. Déclencher proactivement la recherche de mise à jour du Service Worker
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then((reg) => {
          if (reg) {
            reg.update().catch((e) => console.log('[SW] Check update err:', e));
          }
        });
      }

      // 2. Récupérer le fichier version.json avec cache-busting strict
      const cacheBuster = `t=${Date.now()}&r=${Math.random().toString(36).substring(7)}`;
      const res = await fetch(`/version.json?${cacheBuster}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data: AppVersionInfo = await res.json();
      setLastCheckTime(new Date());

      const localBuild = localStorage.getItem('ct_app_build');

      if (!localBuild) {
        // Premier chargement : initialiser la version locale
        localStorage.setItem('ct_app_build', data.build);
        localStorage.setItem('ct_app_version', data.version);
        setCurrentBuild(data.build);
        setLatestBuildInfo(data);
        return false;
      }

      setCurrentBuild(localBuild);
      setLatestBuildInfo(data);

      if (data.build && data.build !== localBuild) {
        console.log(`[VersionManager] Nouvelle version détectée : Local=${localBuild} | Distant=${data.build}`);
        setUpdateAvailable(true);
        return true;
      } else {
        setUpdateAvailable(false);
        return false;
      }
    } catch (err) {
      console.warn('[VersionManager] Erreur lors de la vérification de version:', err);
      return false;
    } finally {
      setIsChecking(false);
    }
  }, []);

  // Fonction pour appliquer la mise à jour
  const applyUpdate = useCallback(async () => {
    if (typeof window === 'undefined') return;

    try {
      // Mémoriser la nouvelle version
      if (latestBuildInfo?.build) {
        localStorage.setItem('ct_app_build', latestBuildInfo.build);
        localStorage.setItem('ct_app_version', latestBuildInfo.version);
      }

      // Envoyer un message au SW en attente pour forcer son activation
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg?.waiting) {
          reg.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      }

      // Nettoyer les caches obsolètes
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(
          keys.filter(k => !k.includes('v4.2.0')).map(k => caches.delete(k))
        );
      }
    } catch (e) {
      console.warn('[VersionManager] Erreur pré-reload:', e);
    }

    // Recharger la page proprement
    window.location.reload();
  }, [latestBuildInfo]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Enregistrement du Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', { updateViaCache: 'none' })
        .then((registration) => {
          setSwStatus('actif');

          // Détection d'un nouveau SW en cours d'installation
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              setSwStatus('téléchargement...');
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setSwStatus('nouvelle version prête');
                  setUpdateAvailable(true);
                }
              });
            }
          });
        })
        .catch((err) => {
          console.warn('[SW] Échec enregistrement:', err);
          setSwStatus('non supporté ou erreur');
        });

      // Écoute de la prise de contrôle par un nouveau SW
      let reloading = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!reloading) {
          reloading = true;
          console.log('[SW] Nouveau contrôleur actif -> rechargement fluide');
          window.location.reload();
        }
      });
    }

    // 2. Première vérification immédiate
    checkForUpdates();

    // 3. Vérification lors du retour sur l'application (visibilité / déverrouillage / focus)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkForUpdates();
      }
    };
    const handleFocus = () => checkForUpdates();
    const handleOnline = () => checkForUpdates();

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('online', handleOnline);

    // 4. Polling périodique toutes les 10 minutes
    const intervalId = setInterval(() => {
      checkForUpdates();
    }, 10 * 60 * 1000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('online', handleOnline);
      clearInterval(intervalId);
    };
  }, [checkForUpdates]);

  return {
    currentBuild,
    latestBuildInfo,
    updateAvailable,
    isChecking,
    lastCheckTime,
    swStatus,
    isDiagnosticOpen,
    setIsDiagnosticOpen,
    checkForUpdates,
    applyUpdate
  };
}

export default function VersionUpdateManager() {
  const {
    currentBuild,
    latestBuildInfo,
    updateAvailable,
    isChecking,
    lastCheckTime,
    swStatus,
    isDiagnosticOpen,
    setIsDiagnosticOpen,
    checkForUpdates,
    applyUpdate
  } = useVersionUpdate();

  const [dismissed, setDismissed] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Exposer les méthodes de diagnostic sur l'objet window pour tests / console admin
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__CREDITTRACK_DIAGNOSTIC__ = {
        currentBuild,
        latestBuildInfo,
        updateAvailable,
        swStatus,
        lastCheckTime,
        checkForUpdates,
        applyUpdate,
        openDiagnostic: () => setIsDiagnosticOpen(true)
      };
    }
  }, [currentBuild, latestBuildInfo, updateAvailable, swStatus, lastCheckTime, checkForUpdates, applyUpdate, setIsDiagnosticOpen]);

  const handleApply = async () => {
    setIsUpdating(true);
    await applyUpdate();
  };

  return (
    <>
      {/* BANNIÈRE DE MISE À JOUR DISCRÈTE ET FLUIDE */}
      {updateAvailable && !dismissed && (
        <aside
          role="region"
          aria-label="Notification de mise à jour"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 99999,
            maxWidth: '420px',
            width: 'calc(100% - 48px)',
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            border: '1px solid rgba(59, 130, 246, 0.4)',
            borderRadius: '16px',
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.6), 0 0 20px rgba(37, 99, 235, 0.2)',
            padding: '16px 20px',
            color: '#FFFFFF',
            animation: 'slideUpBounce 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)'
              }}
            >
              <Sparkles size={20} color="#FFFFFF" />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#F8FAFC', letterSpacing: '-0.01em' }}>
                  Nouvelle version disponible !
                </h3>
                <button
                  onClick={() => setDismissed(true)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '6px'
                  }}
                  title="Plus tard"
                >
                  <X size={16} />
                </button>
              </div>

              <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#94A3B8', lineHeight: 1.4 }}>
                Une mise à jour ({latestBuildInfo?.version || '4.2.0'}) avec de nouvelles fonctionnalités et optimisations est prête.
              </p>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleApply}
                  disabled={isUpdating}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '9px 16px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: isUpdating ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <RefreshCw size={14} className={isUpdating ? 'spin' : ''} />
                  {isUpdating ? 'Mise à jour...' : 'Mettre à jour maintenant'}
                </button>

                <button
                  onClick={() => setDismissed(true)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#CBD5E1',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '9px 14px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  Plus tard
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* MODAL DE DIAGNOSTIC SYSTÈME ET CONTRÔLE DE VERSION */}
      {isDiagnosticOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Diagnostic Système et Mises à Jour"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100000,
            background: 'rgba(6, 10, 20, 0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setIsDiagnosticOpen(false)}
        >
          <div
            style={{
              background: '#0F172A',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '20px',
              maxWidth: '520px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
              color: '#F8FAFC'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'rgba(37, 99, 235, 0.15)',
                    border: '1px solid rgba(37, 99, 235, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#60A5FA'
                  }}
                >
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700 }}>Diagnostic Système & Version</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#94A3B8' }}>État du cache PWA et synchronisation Vercel</p>
                </div>
              </div>
              <button
                onClick={() => setIsDiagnosticOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: 'none',
                  color: '#94A3B8',
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <div style={{ background: '#1E293B', padding: '12px 16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#94A3B8' }}>Version Active (Locale)</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#38BDF8', fontFamily: 'monospace' }}>
                  v{latestBuildInfo?.version || '4.2.0'} ({currentBuild || 'Initialisation'})
                </span>
              </div>

              <div style={{ background: '#1E293B', padding: '12px 16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#94A3B8' }}>Dernière Version Serveur</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#4ADE80', fontFamily: 'monospace' }}>
                  {latestBuildInfo ? `${latestBuildInfo.build} (${latestBuildInfo.commit || 'main'})` : 'Vérification...'}
                </span>
              </div>

              <div style={{ background: '#1E293B', padding: '12px 16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#94A3B8' }}>Statut Service Worker</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: swStatus.includes('actif') ? '#4ADE80' : '#FBBF24' }}>
                  ● {swStatus}
                </span>
              </div>

              <div style={{ background: '#1E293B', padding: '12px 16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#94A3B8' }}>Dernière vérification réseau</span>
                <span style={{ fontSize: '12px', color: '#CBD5E1' }}>
                  {lastCheckTime ? lastCheckTime.toLocaleTimeString('fr-FR') : 'En attente'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => checkForUpdates(true)}
                disabled={isChecking}
                style={{
                  flex: 1,
                  background: 'rgba(59, 130, 246, 0.15)',
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  color: '#60A5FA',
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: isChecking ? 'wait' : 'pointer'
                }}
              >
                <RefreshCw size={15} className={isChecking ? 'spin' : ''} />
                {isChecking ? 'Vérification...' : 'Vérifier maintenant'}
              </button>

              <button
                onClick={handleApply}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                  border: 'none',
                  color: '#FFFFFF',
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Forcer l'actualisation
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideUpBounce {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .spin {
          animation: spinAnimation 1s linear infinite;
        }
        @keyframes spinAnimation {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
