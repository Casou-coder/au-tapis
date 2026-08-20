import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import ResponsibleGamblingBanner from "@/components/ResponsibleGamblingBanner";
import CookieConsent from "@/components/CookieConsent";
import SiteFooter from "@/components/SiteFooter";
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

const BASE_URL = 'https://forgedpoker.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Forged Poker : Apprenez le Poker Texas Hold'em en Français",
    template: "%s | Forged Poker",
  },
  description: "Apprenez le poker Texas Hold'em gratuitement, du niveau débutant au professionnel. Cours interactifs, défis quotidiens, calculateur d'équité et outils GTO. Sans argent réel.",
  keywords: [
    'apprendre poker', 'cours poker français', 'poker texas holdem débutant',
    'stratégie poker', 'GTO poker', 'calcul equity poker', 'défis poker quotidiens',
    'école poker en ligne', 'pot odds', 'ICM poker', 'bluff poker',
    'poker débutant', 'poker intermédiaire', 'poker expert', 'poker professionnel',
  ],
  authors: [{ name: 'Forged Poker' }],
  creator: 'Forged Poker',
  publisher: 'Forged Poker',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: BASE_URL,
    siteName: 'Forged Poker',
    title: "Forged Poker : Maîtrisez le Poker Texas Hold'em",
    description: "De la première main jusqu'aux stratégies des champions. Cours gratuits, défis quotidiens, outils GTO. Apprenez le poker sans argent réel.",
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Forged Poker : Apprendre le Poker' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Forged Poker : Maîtrisez le Poker",
    description: "Apprenez le poker Texas Hold'em gratuitement, du débutant au professionnel.",
    images: ['/og-image.png'],
  },
  alternates: { canonical: BASE_URL },
};

// JSON-LD placed in body (Next.js App Router recommended pattern)
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'Forged Poker',
  url: BASE_URL,
  description: "Plateforme d'apprentissage du poker Texas Hold'em en français, du niveau débutant au professionnel.",
  inLanguage: 'fr',
  isAccessibleForFree: true,
  teaches: [
    "Règles du poker Texas Hold'em",
    "Calcul des pot odds et de l'équité",
    'Stratégies GTO (Game Theory Optimal)',
    'ICM (Independent Chip Model)',
    'Gestion du bankroll',
    'Lecture des adversaires',
    'Bluff et semi-bluff',
    'Jeu en position',
  ],
  hasCourse: [
    { '@type': 'Course', name: 'Poker Débutant', url: `${BASE_URL}/debutant`, description: 'Les règles, la force des mains, les positions et la sélection de départ.' },
    { '@type': 'Course', name: 'Poker Intermédiaire', url: `${BASE_URL}/intermediaire`, description: 'Pot odds, continuation bet, ranges et jeu post-flop.' },
    { '@type': 'Course', name: 'Poker Avancé', url: `${BASE_URL}/avance`, description: 'GTO basics, range construction, 3-bets, blockers, ICM tournois, bet sizing et multiway pots.' },
    { '@type': 'Course', name: 'Poker Expert', url: `${BASE_URL}/expert`, description: 'Solver thinking, balanced ranges, HUD, mental game et study routines.' },
    { '@type': 'Course', name: 'Poker Professionnel', url: `${BASE_URL}/professionnel`, description: 'Mains légendaires, stratégies des champions WSOP et secrets du plus haut niveau.' },
  ],
};

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: "Comment apprendre le poker Texas Hold'em en français ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Forged Poker propose 5 niveaux progressifs pour apprendre le poker gratuitement : débutant, intermédiaire, avancé, expert et professionnel. Chaque niveau contient des modules interactifs, des quiz et des mains à rejouer.",
      },
    },
    {
      '@type': 'Question',
      name: "C'est quoi les pot odds au poker ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Les pot odds sont le ratio entre la mise à payer et le pot total. Si le pot vaut 100€ et la mise est de 50€, les pot odds sont de 3:1 (33%). Si votre equity dépasse ce ratio, l'appel est rentable à long terme.",
      },
    },
    {
      '@type': 'Question',
      name: "Qu'est-ce que le GTO au poker ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Le GTO (Game Theory Optimal) est une stratégie d'équilibre mathématique qui rend votre jeu inexploitable. Au lieu de maximiser l'exploitation d'un adversaire spécifique, le GTO vise à trouver une stratégie qui ne peut pas être battue sur le long terme.",
      },
    },
    {
      '@type': 'Question',
      name: "Peut-on apprendre le poker sans jouer de l'argent réel ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Oui, Forged Poker est 100% gratuit et sans argent réel. Vous apprenez la théorie, les mathématiques et les stratégies du poker sans aucun risque financier. L'objectif est la maîtrise du jeu, pas les gains.",
      },
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-[#0a0f0a] text-[#e8f5e9] antialiased">
        {/* Skip to main content : accessibilité clavier */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-yellow-500 focus:text-black focus:rounded-lg focus:font-bold focus:text-sm"
        >
          Aller au contenu principal
        </a>

        <AuthProvider>
          <Navigation />
          {children}
          <SiteFooter />
          <ResponsibleGamblingBanner />
          <CookieConsent />
        </AuthProvider>

        {/* JSON-LD structured data : pattern recommandé Next.js App Router */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      </body>
    </html>
  );
}
