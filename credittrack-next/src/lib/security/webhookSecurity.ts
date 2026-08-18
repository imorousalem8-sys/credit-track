import { createHmac, timingSafeEqual } from 'crypto';

/**
 * Module de Vérification Cryptographique des Webhooks
 * Empêche les attaques par rejeu et la falsification des notifications de paiement.
 */

export interface WebhookVerificationResult {
  valid: boolean;
  error?: string;
}

/**
 * Vérifie la signature HMAC-SHA256 d'un webhook en utilisant une comparaison en temps constant (Anti-Timing Attacks)
 */
export function verifyWebhookSignature(
  rawPayload: string | Buffer,
  signatureHeader: string,
  secretKey: string
): WebhookVerificationResult {
  if (!rawPayload || !signatureHeader || !secretKey) {
    return { valid: false, error: 'Signature, payload ou clé secrète manquante.' };
  }

  try {
    const computedHash = createHmac('sha256', secretKey)
      .update(rawPayload)
      .digest('hex');

    const expectedBuffer = Buffer.from(computedHash, 'utf-8');
    const providedBuffer = Buffer.from(signatureHeader.replace(/^sha256=/, ''), 'utf-8');

    if (expectedBuffer.length !== providedBuffer.length) {
      return { valid: false, error: 'Longueur de signature invalide.' };
    }

    // Comparaison en temps constant pour éviter les fuites par analyse temporelle
    const isValid = timingSafeEqual(expectedBuffer, providedBuffer);

    if (!isValid) {
      return { valid: false, error: 'Signature du webhook invalide.' };
    }

    return { valid: true };
  } catch (err: any) {
    return { valid: false, error: 'Erreur lors du calcul cryptographique de la signature.' };
  }
}
