import { randomUUID } from 'crypto';

/**
 * Module de Sécurisation des Uploads de Fichiers
 * Empêche l'exécution de code arbitraire, les virus et le dépassement de quota.
 */

export interface UploadValidationResult {
  valid: boolean;
  error?: string;
  sanitizedFilename?: string;
  mimeType?: string;
}

// Extensions formellement interdites (danger d'exécution)
const DANGEROUS_EXTENSIONS = new Set([
  'php', 'php3', 'php4', 'php5', 'phtml', 'exe', 'bat', 'sh', 'cmd', 'ps1',
  'cgi', 'pl', 'py', 'jar', 'vbs', 'scr', 'dll', 'msi', 'com', 'htm', 'html',
  'shtml', 'xhtml', 'jsp', 'asp', 'aspx', 'svg'
]);

// Types MIME stricts autorisés pour les reçus et logos de commerçants
const ALLOWED_MIME_TYPES = new Map<string, { ext: string; magicBytes: number[] }>([
  ['image/jpeg', { ext: 'jpg', magicBytes: [0xFF, 0xD8, 0xFF] }],
  ['image/png', { ext: 'png', magicBytes: [0x89, 0x50, 0x4E, 0x47] }],
  ['image/webp', { ext: 'webp', magicBytes: [0x52, 0x49, 0x46, 0x46] }],
  ['application/pdf', { ext: 'pdf', magicBytes: [0x25, 0x50, 0x44, 0x46] }]
]);

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 Mo maximum

/**
 * Valide un fichier téléversé avant enregistrement
 */
export async function validateUploadedFile(
  buffer: Buffer,
  declaredMimeType: string,
  originalFilename: string
): Promise<UploadValidationResult> {
  // 1. Contrôle de la taille
  if (!buffer || buffer.length === 0) {
    return { valid: false, error: 'Le fichier est vide.' };
  }

  if (buffer.length > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: 'Le fichier dépasse la limite maximale autorisée de 5 Mo.' };
  }

  // 2. Contrôle de l'extension originale
  const filenameParts = originalFilename.split('.');
  const ext = filenameParts.length > 1 ? filenameParts.pop()?.toLowerCase() || '' : '';

  if (!ext || DANGEROUS_EXTENSIONS.has(ext)) {
    return { valid: false, error: 'Type de fichier non autorisé ou potentiellement dangereux.' };
  }

  // 3. Contrôle du type MIME déclaré
  const normalizedMime = (declaredMimeType || '').toLowerCase().trim();
  const allowedConfig = ALLOWED_MIME_TYPES.get(normalizedMime);

  if (!allowedConfig) {
    return { valid: false, error: 'Format de fichier non supporté. Formats acceptés : JPG, PNG, WEBP, PDF.' };
  }

  // 4. Contrôle du Magic Number (signature binaire réelle du fichier)
  const magic = allowedConfig.magicBytes;
  let matchesMagic = true;
  for (let i = 0; i < magic.length; i++) {
    if (buffer[i] !== magic[i]) {
      matchesMagic = false;
      break;
    }
  }

  if (!matchesMagic) {
    return { valid: false, error: 'Le contenu réel du fichier ne correspond pas au format déclaré (Falsification détectée).' };
  }

  // 5. Génération d'un nom de fichier cryptographiquement aléatoire et sécurisé
  const secureFilename = `${randomUUID()}.${allowedConfig.ext}`;

  return {
    valid: true,
    sanitizedFilename: secureFilename,
    mimeType: normalizedMime
  };
}
