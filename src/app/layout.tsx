import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
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

const BASE_URL = 'https://autapis.fr';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Au Tapis — Apprenez le Poker Texas Hold'em en Français",
    template: "%s | Au Tapis",
  },
  description: "Apprenez le poker Texas Hold'em gratuitement, du niveau débutant au professionnel. Cours interactifs, défis quotidiens, calculateur d'équité et outils GTO. Sans argent réel.",
  keywords: [
    'apprendre poker', 'cours poker français', 'poker texas holdem débutant',
    'stratégie poker', 'GTO poker', 'calcul equity poker', 'défis poker quotidiens',
    'école poker en ligne', 'pot odds', 'ICM poker', 'bluff poker',
    'poker débutant', 'poker intermédiaire', 'poker expert', 'poker professionnel',
  ],
  authors: [{ name: 'Au Tapis' }],
  creator: 'Au Tapis',
  publisher: 'Au Tapis',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: BASE_URL,
    siteName: 'Au Tapis',
    title: "Au Tapis — Maîtrisez le Poker Texas Hold'em",
    description: "De la première main jusqu'aux stratégies des champions. Cours gratuits, défis quotidiens, outils GTO. Apprenez le poker sans argent réel.",
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Au Tapis — Apprendre le Poker' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Au Tapis — Maîtrisez le Poker",
    description: "Apprenez le poker Texas Hold'em gratuitement, du débutant au professionnel.",
    images: ['/og-image.png'],
  },
  alternates: { canonical: BASE_URL },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'Au Tapis',
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
    'Lecture des adversaires (reads)',
    'Bluff et semi-bluff',
    'Jeu en position',
  ],
  hasCourse: [
    { '@type': 'Course', name: 'Poker Débutant', url: `${BASE_URL}/debutant`, description: 'Les règles, la force des mains, les positions et la sélection de départ.' },
    { '@type': 'Course', name: 'Poker Intermédiaire', url: `${BASE_URL}/intermediaire`, description: 'Pot odds, continuation bet, ranges et jeu post-flop.' },
    { '@type': 'Course', name: 'Poker Avancé', url: `${BASE_URL}/avance`, description: 'Équité avancée, 3-bet/4-bet, exploits et hand reading.' },
    { '@type': 'Course', name: 'Poker Expert', url: `${BASE_URL}/expert`, description: 'GTO, solvers, ICM, tournois et spots complexes.' },
    { '@type': 'Course', name: 'Poker Professionnel', url: `${BASE_URL}/professionnel`, description: 'Stratégies de haut niveau, gestion mentale et jeu multi-tables.' },
  ],
};

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Comment apprendre le poker Texas Hold\'em en français ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Au Tapis propose 5 niveaux progressifs pour apprendre le poker gratuitement : débutant, intermédiaire, avancé, expert et professionnel. Chaque niveau contient des modules interactifs, des quiz et des mains à rejouer.",
      },
    },
    {
      '@type': 'Question',
      name: 'C\'est quoi les pot odds au poker ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Les pot odds sont le ratio entre la mise à payer et le pot total. Si le pot vaut 100€ et la mise est de 50€, les pot odds sont de 3:1 (33%). Si votre equity dépasse ce ratio, l'appel est rentable à long terme.",
      },
    },
    {
      '@type': 'Question',
      name: 'Qu\'est-ce que le GTO au poker ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Le GTO (Game Theory Optimal) est une stratégie d'équilibre mathématique qui rend votre jeu inexploitable. Au lieu de maximiser l'exploitation d'un adversaire spécifique, le GTO vise à trouver une stratégie qui ne peut pas être battue sur le long terme.",
      },
    },
    {
      '@type': 'Question',
      name: 'Peut-on apprendre le poker sans jouer de l\'argent réel ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Oui, Au Tapis est 100% gratuit et sans argent réel. Vous apprenez la théorie, les mathématiques et les stratégies du poker sans aucun risque financier. L'objectif est la maîtrise du jeu, pas les gains.",
      },
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      </head>
      <body className="min-h-screen bg-[#0a0f0a] text-[#e8f5e9] antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
