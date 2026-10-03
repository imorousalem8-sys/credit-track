// api/saspay-webhook.js - Webhook sécurisé pour la passerelle de paiement SasPay
import crypto from 'crypto';

export const config = {
  api: {
    bodyParser: false, // Nécessaire pour obtenir le buffer brut du corps de requête (HMAC strict)
  },
};

// Fonction utilitaire pour lire le flux brut de la requête
async function getRawBody(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée. Utilisez POST.' });
  }

  try {
    const rawBodyBuffer = await getRawBody(req);
    const rawBody = rawBodyBuffer.toString('utf8');

    const signatureHeader = req.headers['x-webhook-signature'] || req.headers['X-Webhook-Signature'];
    const timestampHeader = req.headers['x-webhook-timestamp'] || req.headers['X-Webhook-Timestamp'];
    const eventHeader = req.headers['x-webhook-event'] || req.headers['X-Webhook-Event'];

    console.log('[SasPay Webhook] Événement reçu:', eventHeader, 'Timestamp:', timestampHeader);

    // Si une clé secrète de webhook est configurée, vérifier la signature cryptographique
    const webhookSecret = process.env.SASPAY_WEBHOOK_SECRET;
    if (webhookSecret && signatureHeader && timestampHeader) {
      const now = Math.floor(Date.now() / 1000);
      const TOLERANCE_SECONDS = 300;

      // 1. Contrôle d'âge (5 minutes max)
      if (Math.abs(now - Number(timestampHeader)) > TOLERANCE_SECONDS) {
        console.warn('[SasPay Webhook] Horodatage rejeté (hors tolérance):', timestampHeader);
        return res.status(403).json({ error: 'Horodatage webhook hors tolérance' });
      }

      // 2. Contrôle de signature HMAC SHA256 en temps constant
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(`${timestampHeader}.${rawBody}`)
        .digest('hex');

      const sigBuf = Buffer.from(signatureHeader, 'utf8');
      const expectedBuf = Buffer.from(expectedSignature, 'utf8');

      if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
        console.warn('[SasPay Webhook] Signature invalide');
        return res.status(403).json({ error: 'Signature webhook invalide' });
      }
    }

    let payload = {};
    try {
      payload = JSON.parse(rawBody);
    } catch (e) {
      console.error('[SasPay Webhook] Erreur de décodage JSON du corps:', e);
      return res.status(400).json({ error: 'Corps JSON invalide' });
    }

    const event = payload.event || eventHeader;
    const data = payload.data || {};

    console.log('[SasPay Webhook] Payload analysé:', { event, id: data.id, reference: data.reference, amount: data.amount });

    if (event === 'transaction.success' || data.status === 'SUCCESS') {
      const amount = data.amount;
      const ref = data.reference || data.id || `SAS_${Date.now()}`;
      const planTier = data.metadata?.plan_tier || (Number(amount) >= 40000 ? 'pro_yearly' : 'pro_monthly');
      const userEmail = data.customer_email || data.metadata?.customer_email || '';

      console.log(`[SasPay Webhook] Paiement validé pour le plan ${planTier}, montant: ${amount}, email: ${userEmail}, ref: ${ref}`);

      // Mise à jour de Supabase si configuré côté serveur
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bnkwplwlfnhukevwdcen.supabase.co';
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (supabaseUrl && serviceRoleKey && userEmail) {
        try {
          const headers = {
            'apikey': serviceRoleKey,
            'Authorization': `Bearer ${serviceRoleKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          };

          // Trouver le user par email
          const userRes = await fetch(`${supabaseUrl}/rest/v1/rpc/get_user_by_email`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ email_input: userEmail })
          }).catch(() => null);

          // Enregistrer dans saas_subscription_payments
          await fetch(`${supabaseUrl}/rest/v1/saas_subscription_payments`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              amount: Number(amount) || 5000,
              currency: data.currency || 'XOF',
              plan_tier: planTier,
              payment_method: `SasPay (${data.network || 'Mobile Money'})`,
              transaction_ref: ref,
              status: 'completed'
            })
          }).catch(err => console.warn('[SasPay Webhook] Erreur insertion paiement:', err));
        } catch (sbErr) {
          console.warn('[SasPay Webhook] Erreur Supabase:', sbErr);
        }
      }
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('[SasPay Webhook Exception]:', error);
    return res.status(500).json({ error: error.message });
  }
}
