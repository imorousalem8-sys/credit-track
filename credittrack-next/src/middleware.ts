import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Whitelist des origines CORS autorisées
const ALLOWED_ORIGINS = [
  'https://credittrack.pro',
  'https://www.credittrack.pro',
  'http://localhost:3000',
  'http://localhost:8085'
];

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin') || '';
  const pathname = request.nextUrl.pathname;

  // 1. Initialiser la réponse Next.js
  let response = NextResponse.next();

  // 2. Gestion des Requêtes OPTIONS Preflight & Contrôle CORS
  if (request.method === 'OPTIONS') {
    const isAllowed = ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.vercel.app');
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': isAllowed ? origin : ALLOWED_ORIGINS[0],
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Max-Age': '86400',
      }
    });
  }

  // 3. Application des Headers de Sécurité Stricts (OWASP Top 10)
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(self)');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

  // 4. Header CORS sécurisé si origine autorisée
  if (origin && (ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.vercel.app'))) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  // 5. Protection du Back-Office (/admin)
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const authHeader = request.headers.get('authorization');
    const cookieToken = request.cookies.get('sb-access-token')?.value || request.cookies.get('auth_token')?.value;

    if (!authHeader && !cookieToken) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Accès non autorisé. Authentification administrateur requise.' }, { status: 401 });
      }
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
