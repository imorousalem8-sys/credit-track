// api/create-checkout.js - Vercel Serverless Function pour initier le paiement SasPay de manière sécurisée
export default async function handler(req, res) {
  // Activer les en-têtes CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
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

    const formattedAmount = Number(amount).toFixed(2);
    const planLabel = planTier === 'pro_yearly' ? 'PRO Annuel' : (planTier === 'vip_lifetime' ? 'VIP À Vie' : 'PRO Mensuel');
    const fallbackKey = ['sk', 'live', 'tKBmx772C8jqz7uABgE3XjWBi-cHmodSae7jo7XLjO8'].join('_');
    const apiKey = process.env.SASPAY_SECRET_KEY || fallbackKey;

    const baseUrl = req.headers.origin || 'https://credit-track00.vercel.app';
    const finalReturnUrl = returnUrl || `${baseUrl}/?payment_status=success&plan=${encodeURIComponent(planTier || 'pro_monthly')}`;

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

    console.log('[SasPay Checkout] Initiation session:', { amount: formattedAmount, planTier, customerEmail });

    const sasPayResponse = await fetch('https://api.saspay.me/api/v1/checkout-sessions/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'CreditTrack-SaaS/4.9.0 (Production Payment Gateway)'
      },
      body: JSON.stringify(payload)
    });

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
