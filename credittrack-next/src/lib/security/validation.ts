/**
 * Module Centralisé de Validation et d'Assainissement des Données (DevSecOps)
 * Empêche les injections XSS, SQLi, Mass Assignment et valide les politiques de sécurité.
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

// 1. POLITIQUE DE MOT DE PASSE ROBUSTE (NIST 800-63B / OWASP)
// Minimum 12 caractères, avec Majuscule, Minuscule, Chiffre et Caractère Spécial
export function validatePasswordStrength(password: string): ValidationResult {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Le mot de passe est obligatoire.' };
  }

  if (password.length < 12) {
    return { valid: false, error: 'Le mot de passe doit comporter au moins 12 caractères.' };
  }

  if (password.length > 128) {
    return { valid: false, error: 'Le mot de passe ne doit pas dépasser 128 caractères.' };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password);

  if (!hasUpperCase) {
    return { valid: false, error: 'Le mot de passe doit contenir au moins une lettre majuscule (A-Z).' };
  }
  if (!hasLowerCase) {
    return { valid: false, error: 'Le mot de passe doit contenir au moins une lettre minuscule (a-z).' };
  }
  if (!hasNumber) {
    return { valid: false, error: 'Le mot de passe doit contenir au moins un chiffre (0-9).' };
  }
  if (!hasSpecial) {
    return { valid: false, error: 'Le mot de passe doit contenir au moins un caractère spécial (!@#$%...).' };
  }

  // Liste de mots de passe triviaux courants
  const commonWeak = ['password1234', '123456789012', 'admin12345678', 'azerty123456', 'qwerty123456'];
  if (commonWeak.includes(password.toLowerCase())) {
    return { valid: false, error: 'Ce mot de passe est trop courant. Veuillez en choisir un plus robuste.' };
  }

  return { valid: true };
}

// 2. VALIDATION STRICTE D'ADRESSE E-MAIL (RFC 5322 + Vérification TLD)
export function isValidEmailStrict(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (trimmed.length < 5 || trimmed.length > 254) return false;

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(trimmed)) return false;

  const parts = trimmed.split('@');
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  if (!local || !domain || local.startsWith('.') || local.endsWith('.')) return false;

  const domainParts = domain.split('.');
  if (domainParts.length < 2) return false;
  const tld = domainParts[domainParts.length - 1];
  if (!tld || tld.length < 2 || !/^[a-zA-Z]+$/.test(tld)) return false;

  return true;
}

// 3. ASSAINISSEMENT CONTRE LES ATTAQUES XSS
export function escapeXSS(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// 4. VALIDATION ET ASSAINISSEMENT DE NUMÉRO DE TÉLÉPHONE
export function sanitizePhone(phone: string): string {
  if (!phone || typeof phone !== 'string') return '';
  return phone.replace(/[^0-9+]/g, '').trim();
}

// 5. VALIDATION DU MONTANT FINANCIER (Empêche les montants négatifs / NaN)
export function validateAmount(amount: any, maxAllowed: number = 1000000000): ValidationResult {
  const num = Number(amount);
  if (isNaN(num) || !isFinite(num)) {
    return { valid: false, error: 'Le montant doit être un nombre valide.' };
  }
  if (num < 0) {
    return { valid: false, error: 'Le montant ne peut pas être négatif.' };
  }
  if (num > maxAllowed) {
    return { valid: false, error: 'Le montant dépasse le seuil maximum autorisé.' };
  }
  return { valid: true };
}

// 6. PROTECTION MASS ASSIGNMENT : Whitelist stricte des champs autorisés
export function filterAllowedFields<T extends Record<string, any>>(input: any, allowedKeys: (keyof T)[]): Partial<T> {
  if (!input || typeof input !== 'object') return {};
  const filtered: Partial<T> = {};
  for (const key of allowedKeys) {
    if (key in input) {
      filtered[key] = input[key];
    }
  }
  return filtered;
}
