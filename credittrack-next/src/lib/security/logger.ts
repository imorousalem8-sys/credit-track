/**
 * Journal d'Audit et de Sécurité Structuré (Security Logger)
 * Masque automatiquement les données sensibles (mots de passe, tokens, numéros complets).
 */

export interface SecurityLogEntry {
  timestamp: string;
  eventType: 'AUTH_SUCCESS' | 'AUTH_FAILED' | 'RATE_LIMIT_BLOCKED' | 'REGISTRATION' | 'UNAUTHORIZED_ACCESS' | 'WEBHOOK_EVENT' | 'SECURITY_WARNING';
  ip?: string;
  userId?: string;
  email?: string;
  route?: string;
  details?: Record<string, any>;
}

// Fonction de masquage des e-mails
function maskEmail(email?: string): string {
  if (!email || !email.includes('@')) return '***@***.com';
  const [local, domain] = email.split('@');
  const visible = local.length > 2 ? local.substring(0, 2) + '***' : local[0] + '***';
  return `${visible}@${domain}`;
}

// Fonction de masquage des données sensibles
function sanitizeLogDetails(details?: Record<string, any>): Record<string, any> {
  if (!details) return {};
  const clean = { ...details };
  const sensitiveKeys = ['password', 'passwordConfirm', 'token', 'jwt', 'secret', 'key', 'accessToken', 'refreshToken', 'apiKey'];
  
  for (const k of Object.keys(clean)) {
    if (sensitiveKeys.some(s => k.toLowerCase().includes(s))) {
      clean[k] = '[REDACTED_SECRET]';
    }
  }
  return clean;
}

export function logSecurityEvent(entry: Omit<SecurityLogEntry, 'timestamp'>) {
  const payload: SecurityLogEntry = {
    timestamp: new Date().toISOString(),
    eventType: entry.eventType,
    ip: entry.ip || 'unknown',
    userId: entry.userId || 'anonymous',
    email: entry.email ? maskEmail(entry.email) : undefined,
    route: entry.route,
    details: sanitizeLogDetails(entry.details)
  };

  // En production, ce log est transmis au SIEM / CloudWatch / Datadog
  console.info(`[SECURITY_AUDIT] [${payload.eventType}]`, JSON.stringify(payload));
}
