import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Preloader } from "@/components/Preloader";
import { PWA } from "@/components/PWA";
import { InstallPWA } from "@/components/InstallPWA";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.sksurewinspredictions.com'),
  title: "SK Sure Wins | Uganda's #1 Premium Betting Tips",
  description: "Join 50,000+ happy subscribers winning daily with SK Sure Wins. Get verified Bronze, Silver, Gold & Premium VIP betting tips delivered straight to your phone. 95% win rate. Munakapapula!",
  keywords: ["betting tips", "Uganda betting", "VIP tips", "SK Sure Wins", "football predictions", "sure wins", "Munakapapula", "sports betting Uganda"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SK Sure Wins",
  },
  openGraph: {
    title: "SK Sure Wins — Munakapapula 🏆",
    description: "Uganda's Most Trusted Tipster. 95% Win Rate. Join the winning team today!",
    type: "website",
    locale: "en_UG",
    siteName: "SK Sure Wins",
  },
  twitter: {
    card: "summary_large_image",
    title: "SK Sure Wins — Munakapapula 🏆",
    description: "Uganda's Most Trusted Tipster. 95% Win Rate.",
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased overflow-x-hidden`}
    >
      <body className="w-full max-w-[100vw] min-h-full flex flex-col font-sans bg-background text-foreground relative overflow-x-hidden">
        <PWA />
        <InstallPWA />
        <Preloader />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
