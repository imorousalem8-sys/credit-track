/**
 * Module de Rate Limiting en mémoire (Sliding Window Algorithm)
 * Protège les routes d'authentification et de paiement contre les attaques par force brute et DoS.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Nettoyage régulier des anciens enregistrements pour éviter les fuites mémoire
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      record.timestamps = record.timestamps.filter(t => now - t < 3600000); // Garder max 1 heure
      if (record.timestamps.length === 0) {
        rateLimitStore.delete(key);
      }
    }
  }, 300000); // Toutes les 5 minutes
}

export interface RateLimitConfig {
  maxRequests: number;  // Nombre maximal de requêtes autorisées
  windowMs: number;     // Fenêtre temporelle en millisecondes
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
  retryAfterSeconds?: number;
}

/**
 * Vérifie si un identifiant (IP ou userId) dépasse le quota autorisé
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = { maxRequests: 5, windowMs: 60000 }
): RateLimitResult {
  const now = Date.now();
  const key = identifier || 'unknown_client';

  let record = rateLimitStore.get(key);
  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(key, record);
  }

  // Filtrer les timestamps hors de la fenêtre
  record.timestamps = record.timestamps.filter(t => now - t < config.windowMs);

  if (record.timestamps.length >= config.maxRequests) {
    const oldestTimestamp = record.timestamps[0];
    const resetTime = oldestTimestamp + config.windowMs;
    const retryAfterSeconds = Math.ceil((resetTime - now) / 1000);

    return {
      success: false,
      remaining: 0,
      resetTime,
      retryAfterSeconds: Math.max(1, retryAfterSeconds)
    };
  }

  // Enregistrer cette requête
  record.timestamps.push(now);

  return {
    success: true,
    remaining: config.maxRequests - record.timestamps.length,
    resetTime: now + config.windowMs
  };
}

// Profils prédéfinis de sécurité selon la sensibilité
export const RateLimitProfiles = {
  // Login : 5 tentatives par minute
  LOGIN: { maxRequests: 5, windowMs: 60 * 1000 },
  // Inscription : 3 inscriptions par tranche de 10 minutes
  REGISTER: { maxRequests: 3, windowMs: 10 * 60 * 1000 },
  // OTP Verification : 5 essais par tranche de 5 minutes
  OTP_VERIFY: { maxRequests: 5, windowMs: 5 * 60 * 1000 },
  // Renvoi OTP : 1 renvoi par minute
  OTP_RESEND: { maxRequests: 1, windowMs: 60 * 1000 },
  // API standard : 60 requêtes par minute
  STANDARD_API: { maxRequests: 60, windowMs: 60 * 1000 }
};

/**
 * Extrait l'adresse IP du client depuis les headers de la requête
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}
