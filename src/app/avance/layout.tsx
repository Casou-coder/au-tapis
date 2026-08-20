import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Poker Avancé : GTO, ranges, 3-bets et ICM tournois',
  description: 'Maîtrisez le GTO, la construction de ranges, les 3-bets et 4-bets, les blockers, l\'ICM tournois et le bet sizing. Poker avancé pour joueurs sérieux.',
  keywords: ['GTO poker avancé', 'range construction poker', '3-bet poker', '4-bet poker', 'blockers poker', 'ICM poker avancé', 'bet sizing GTO', 'multiway pots poker', 'poker avancé'],
  openGraph: {
    title: 'Poker Avancé : GTO, ranges, 3-bets et ICM tournois',
    description: 'GTO, blockers, ICM, bet sizing et jeu multiway : les concepts qui séparent les joueurs bons des excellents.',
    url: 'https://forgedpoker.com/avance',
  },
  alternates: { canonical: 'https://forgedpoker.com/avance' },
};

export default function AvanceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
