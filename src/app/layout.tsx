import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://forgedpoker.com'),
  title: {
    default: "Forged Poker: Learn Texas Hold'em Poker",
    template: "%s | Forged Poker",
  },
  description: "Learn Texas Hold'em poker for free, from beginner to professional. Interactive courses, daily challenges, equity calculator and GTO tools. No real money.",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-[#0a0f0a] text-[#e8f5e9] antialiased">
        {children}
      </body>
    </html>
  );
}
