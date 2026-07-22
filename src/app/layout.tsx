import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SK Sure Wins | Uganda's #1 Premium Betting Tips",
  description: "Join 50,000+ happy subscribers winning daily with SK Sure Wins. Get verified Bronze, Silver, Gold & Premium VIP betting tips delivered straight to your phone. 95% win rate. Munakapapula!",
  keywords: ["betting tips", "Uganda betting", "VIP tips", "SK Sure Wins", "football predictions", "sure wins", "Munakapapula", "sports betting Uganda"],
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
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground relative overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
