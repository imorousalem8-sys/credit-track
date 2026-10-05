// api/create-checkout.js - Vercel Serverless Function pour initier le paiement SasPay de manière sécurisée
export default async function handler(req, res) {
  // 1. En-têtes CORS restreints et sécurisés
  const allowedOrigins = [
    'https://credit-track00.vercel.app',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ];
  const origin = req.headers.origin;
  if (origin && (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app'))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée. Utilisez POST.' });
  }

  try {
    const { amount, planTier, customerEmail, customerName, customerPhone, country, returnUrl } = req.body || {};

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Montant invalide.' });
    }

    // 2. Validation du format email si fourni
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (customerEmail && !emailRegex.test(customerEmail)) {
      return res.status(400).json({ error: 'Adresse email client invalide.' });
    }

    // 3. Récupération stricte de la clé secrète via variable d'environnement (zéro clé en dur)
    const apiKey = process.env.SASPAY_SECRET_KEY;
    if (!apiKey) {
      console.error('[SasPay Security Alert] SASPAY_SECRET_KEY manquante dans process.env.');
      return res.status(500).json({
        error: 'Configuration serveur incomplète. La clé secrète SasPay n\'est pas configurée.'
      });
    }

    const formattedAmount = Number(amount).toFixed(2);
    const planLabel = planTier === 'pro_yearly' ? 'PRO Annuel' : (planTier === 'vip_lifetime' ? 'VIP À Vie' : 'PRO Mensuel');

    // 4. Assainissement strict de returnUrl avec le parseur URL natif
    let finalReturnUrl = 'https://credit-track00.vercel.app/?payment_status=success&plan=' + encodeURIComponent(planTier || 'pro_monthly');
    if (returnUrl && typeof returnUrl === 'string') {
      try {
        const parsed = new URL(returnUrl);
        if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
          finalReturnUrl = returnUrl;
        }
      } catch {
        // En cas d'URL invalide, on conserve l'URL de retour par défaut officielle
      }
    }

    const payload = {
      amount: formattedAmount,
      currency: 'XOF',
      description: `Abonnement CreditTrack - Forfait ${planLabel}`,
      customer_email: customerEmail || 'client@credittrack.pro',
      customer_name: customerName || 'Commerçant CreditTrack',
      customer_phone: customerPhone || '',
      return_url: finalReturnUrl,
      metadata: {
        plan_tier: planTier || 'pro_monthly',
        customer_email: customerEmail || '',
        customer_name: customerName || '',
        app_name: 'CreditTrack PRO'
      }
    };

    if (country) {
      payload.country = country;
    }

    console.log('[SasPay Checkout] Initiation session:', { amount: formattedAmount, planTier, customerEmail, returnUrl: finalReturnUrl });

    // 5. Appel SasPay avec timeout 10 secondes (AbortController)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    let sasPayResponse;
    try {
      sasPayResponse = await fetch('https://api.saspay.me/api/v1/checkout-sessions/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'CreditTrack-SaaS/4.9.8 (Production Payment Gateway)'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
    } catch (fetchErr) {
      if (fetchErr.name === 'AbortError') {
        return res.status(504).json({
          error: 'Délai d’attente dépassé (timeout 10s) lors de la communication avec SasPay.'
        });
      }
      throw fetchErr;
    } finally {
      clearTimeout(timeout);
    }

    const data = await sasPayResponse.json().catch(() => null);

    const checkoutUrl = data?.data?.checkout_url || data?.checkout_url;

    if (!sasPayResponse.ok || !checkoutUrl) {
      console.error('[SasPay Error Response]', sasPayResponse.status, data);
      const errMsg = (data && data.error && typeof data.error === 'object')
        ? Object.values(data.error).flat().join(', ')
        : (data?.message || data?.detail || 'Erreur lors de la création de la session SasPay');

      return res.status(sasPayResponse.status || 500).json({
        error: errMsg,
        details: data
      });
    }

    return res.status(200).json({
      success: true,
      checkout_url: checkoutUrl,
      session_id: data?.data?.id || data?.id,
      amount: data?.data?.amount || data?.amount,
      currency: data?.data?.currency || data?.currency
    });
  } catch (error) {
    console.error('[API Checkout Exception]:', error);
    return res.status(500).json({
      error: 'Erreur interne du serveur lors de l’initiation du paiement.',
      details: error.message
    });
  }
}
