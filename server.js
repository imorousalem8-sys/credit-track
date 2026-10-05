// server.js - Serveur local autonome CreditTrack PRO avec API Checkout SasPay intégrée
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chargement automatique des variables d'environnement depuis .env
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  });
}

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4'
};

const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // 1. ROUTE API SERVERLESS LOCALE : /api/create-checkout
  if (req.url.startsWith('/api/create-checkout') && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const parsedBody = body ? JSON.parse(body) : {};
        const mockReq = {
          method: 'POST',
          headers: req.headers,
          body: parsedBody
        };
        const mockRes = {
          statusCode: 200,
          headers: {},
          setHeader(k, v) { this.headers[k] = v; },
          status(code) { this.statusCode = code; return this; },
          json(data) {
            res.writeHead(this.statusCode, {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              ...this.headers
            });
            res.end(JSON.stringify(data));
          }
        };

        const checkoutModule = await import('./api/create-checkout.js');
        await checkoutModule.default(mockReq, mockRes);
      } catch (err) {
        console.error('[Local API Error]:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // 2. ROUTE FICHIERS STATIQUES (avec Cache-Control: no-store pour éviter tout gel du cache)
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  const filePath = path.join(__dirname, reqPath);

  // Sécurité traversée de dossier
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Accès interdit');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Fichier non trouvé : ' + reqPath);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('================================================================');
  console.log(`🚀 SERVEUR LOCAL CREDITTRACK PRO DÉMARRÉ SUR LE PORT ${PORT}`);
  console.log(`👉 Lien Local Principal : http://localhost:${PORT}`);
  console.log(`👉 Lien Local IP        : http://127.0.0.1:${PORT}`);
  console.log(`⚡ API Checkout SasPay  : http://localhost:${PORT}/api/create-checkout`);
  console.log('================================================================');
});
