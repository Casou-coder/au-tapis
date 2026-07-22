import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Poker Expert — GTO, ICM et stratégies tournoi',
  description: 'Apprenez le GTO (Game Theory Optimal), l\'ICM pour les tournois, les solvers et les spots complexes. Niveau expert pour dominer les tables régulièrement.',
  keywords: ['GTO poker', 'ICM poker', 'poker tournoi', 'solver poker', 'poker expert', 'stratégie GTO'],
  openGraph: {
    title: 'Poker Expert — GTO, ICM et spots complexes',
    description: 'Maîtrisez le GTO, l\'ICM tournoi, les solvers et les concepts avancés de théorie des jeux appliqués au poker.',
    url: 'https://autapis.fr/expert',
  },
  alternates: { canonical: 'https://autapis.fr/expert' },
};

export default function ExpertLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
