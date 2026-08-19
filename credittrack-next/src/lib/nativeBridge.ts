"use client";

import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Network } from '@capacitor/network';
import { Share } from '@capacitor/share';
import { App } from '@capacitor/app';

export class NativeBridge {
  static isNative(): boolean {
    return Capacitor.isNativePlatform();
  }

  static getPlatform(): 'ios' | 'android' | 'web' {
    return Capacitor.getPlatform() as 'ios' | 'android' | 'web';
  }

  static async initApp(): Promise<void> {
    if (!this.isNative()) return;

    try {
      // 1. Configurer la StatusBar
      await StatusBar.setStyle({ style: Style.Dark });
      if (Capacitor.getPlatform() === 'android') {
        await StatusBar.setBackgroundColor({ color: '#0F172A' });
      }

      // 2. Masquer le Splashscreen en douceur
      await SplashScreen.hide();

      // 3. Gestionnaire du bouton Retour sur Android
      App.addListener('backButton', ({ canGoBack }) => {
        if (!canGoBack) {
          App.exitApp();
        } else {
          window.history.back();
        }
      });
    } catch (e) {
      console.warn('NativeBridge initialization error:', e);
    }
  }

  static async shareReceipt(title: string, text: string, url?: string): Promise<boolean> {
    if (this.isNative()) {
      try {
        await Share.share({
          title,
          text,
          url: url || window.location.href,
          dialogTitle: 'Partager le reçu client'
        });
        return true;
      } catch (e) {
        console.warn('Share canceled or error:', e);
        return false;
      }
    } else if (navigator.share) {
      try {
        await navigator.share({ title, text, url: url || window.location.href });
        return true;
      } catch (e) {
        console.warn('Web Share canceled or error:', e);
        return false;
      }
    } else {
      // Fallback copie dans le presse-papier
      try {
        await navigator.clipboard.writeText(`${title}\n${text}\n${url || ''}`);
        return true;
      } catch {
        return false;
      }
    }
  }

  static async getNetworkStatus(): Promise<{ connected: boolean; connectionType: string }> {
    try {
      const status = await Network.getStatus();
      return { connected: status.connected, connectionType: status.connectionType };
    } catch {
      return { connected: navigator.onLine, connectionType: 'unknown' };
    }
  }

  static onNetworkChange(callback: (status: { connected: boolean }) => void): () => void {
    if (this.isNative()) {
      let handle: any = null;
      Network.addListener('networkStatusChange', status => callback({ connected: status.connected }))
        .then(h => { handle = h; });
      return () => {
        if (handle && typeof handle.remove === 'function') {
          handle.remove();
        }
      };
    } else {
      const onlineHandler = () => callback({ connected: true });
      const offlineHandler = () => callback({ connected: false });
      window.addEventListener('online', onlineHandler);
      window.addEventListener('offline', offlineHandler);
      return () => {
        window.removeEventListener('online', onlineHandler);
        window.removeEventListener('offline', offlineHandler);
      };
    }
  }
}
