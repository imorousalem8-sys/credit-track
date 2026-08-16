import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "./dashboard.css";
import AppLayout from "@/components/layout/AppLayout";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#1B3BBB",
};

export const metadata: Metadata = {
  title: "CréditTrack PRO - Solution de Recouvrement Panafricain",
  description: "Plateforme professionnelle de comptabilité et de recouvrement panafricain",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/logo_3d.png", type: "image/png" },
      { url: "/favicon.ico" }
    ],
    apple: "/logo_3d.png",
    shortcut: "/logo_3d.png"
  },
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
