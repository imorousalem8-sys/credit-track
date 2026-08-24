import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "./dashboard.css";
import AppLayout from "@/components/layout/AppLayout";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#1B3BBB",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL('https://credit-track00.vercel.app'),
  title: {
    default: "CréditTrack PRO - Solution de Recouvrement & Caisse Panafricaine",
    template: "%s | CréditTrack PRO"
  },
  description: "Plateforme tout-en-un pour commerçants africains : gestion des crédits clients, encaissement Mobile Money, relances WhatsApp et sous-comptes caissiers sécurisés.",
  applicationName: "CréditTrack PRO",
  keywords: ["CréditTrack", "gestion crédit", "comptabilité africaine", "recouvrement", "Mobile Money", "Wave", "caisse commerçant"],
  authors: [{ name: "CréditTrack PRO" }],
  creator: "CréditTrack PRO",
  publisher: "CréditTrack PRO",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/logo_3d.png", type: "image/png" },
      { url: "/favicon.ico" }
    ],
    apple: "/logo_3d.png",
    shortcut: "/logo_3d.png"
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://credit-track00.vercel.app/",
    title: "CréditTrack PRO - Recouvrement & Gestion Commerciale",
    description: "Gérez vos créances, encaissez par Mobile Money et suivez vos caisses en temps réel sans dévoiler vos marges.",
    siteName: "CréditTrack PRO",
    images: [
      {
        url: "/logo_3d.png",
        width: 512,
        height: 512,
        alt: "CréditTrack PRO Logo"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "CréditTrack PRO - Recouvrement & Caisse Panafricaine",
    description: "Gérez vos créances, encaissez par Mobile Money et pilotez vos points de vente en temps réel.",
    images: ["/logo_3d.png"]
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" type="image/png" href="/logo_3d.png" />
        <link rel="apple-touch-icon" href="/logo_3d.png" />
        <link rel="shortcut icon" href="/logo_3d.png" />
      </head>
      <body className={plusJakartaSans.className}>
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}
