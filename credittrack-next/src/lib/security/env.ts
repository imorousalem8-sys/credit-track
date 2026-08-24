/**
 * Module Centralisé de Gestion Sécurisée de l'Environnement
 * Isole les clés privées du frontend et valide la présence des configurations obligatoires.
 */

export const ServerEnv = {
  // Clés publiques (autorisées côté client et serveur)
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bnkwplwlfnhukevwdcen.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_hjz2yi3KHdNtSBlsgrCQnw_IssHIkvK',

  // Clés privées (Serveur Uniquement - Ne jamais préfixer par NEXT_PUBLIC)
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  JWT_SECRET: process.env.JWT_SECRET || 'ct_default_jwt_secret_dev_mode_only_change_in_prod',
  AUTH_SECRET: process.env.AUTH_SECRET || 'ct_default_auth_secret_dev_mode_only',
  PAYMENT_WEBHOOK_SECRET: process.env.PAYMENT_WEBHOOK_SECRET || '',
  
  // Whitelist CORS
  CORS_ALLOWED_ORIGINS: (process.env.CORS_ALLOWED_ORIGINS || 'https://credit-track00.vercel.app,https://credittrack.pro,https://www.credittrack.pro,https://credit-track.vercel.app,http://localhost:3000,http://localhost:8085')
    .split(',')
    .map(o => o.trim()),

  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production'
};

/**
 * Empêche la fuite accidentelle de variables secrètes vers le client
 */
export function getSafePublicConfig() {
  return {
    supabaseUrl: ServerEnv.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: ServerEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    environment: ServerEnv.NODE_ENV
  };
}
