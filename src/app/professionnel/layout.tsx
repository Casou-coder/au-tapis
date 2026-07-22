import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Poker Professionnel — Mental game, multi-tables et haut niveau',
  description: 'Stratégies de haut niveau, gestion mentale, multi-tabling, bankroll management professionnel. Pour ceux qui veulent jouer au niveau des meilleurs.',
  keywords: ['poker professionnel', 'mental game poker', 'multi-table poker', 'bankroll management', 'poker haut niveau'],
  openGraph: {
    title: 'Poker Professionnel — Mental game et haut niveau',
    description: 'Le niveau ultime : mental game, jeu multi-tables, gestion de bankroll professionnelle et stratégies élites.',
    url: 'https://autapis.fr/professionnel',
  },
  alternates: { canonical: 'https://autapis.fr/professionnel' },
};

export default function ProfessionnelLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
