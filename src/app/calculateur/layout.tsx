import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Calculateur d'Équité Poker — Odds en temps réel",
  description: "Calculez l'équité de votre main face à un adversaire, les pot odds et le ROI de chaque action. Calculateur de probabilités poker Texas Hold'em gratuit.",
  keywords: ["calculateur équité poker", "odds poker", "pot odds calculateur", "probabilités poker", "equity calculator"],
  openGraph: {
    title: "Calculateur Poker — Équité et Pot Odds",
    description: "Calculez instantanément l'équité de vos mains, les pot odds et prenez les meilleures décisions au poker.",
    url: 'https://autapis.fr/calculateur',
  },
  alternates: { canonical: 'https://autapis.fr/calculateur' },
};

export default function CalculateurLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
