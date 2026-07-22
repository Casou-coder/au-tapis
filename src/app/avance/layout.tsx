import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Poker Avancé — 3-bet, 4-bet, bluff et hand reading',
  description: 'Maîtrisez les 3-bets et 4-bets, le bluff optimal, le hand reading avancé et l\'exploitation des adversaires. Poker avancé pour joueurs sérieux.',
  keywords: ['3-bet poker', '4-bet poker', 'bluff poker', 'hand reading', 'poker avancé', 'exploitation poker'],
  openGraph: {
    title: 'Poker Avancé — 3-bet, 4-bet, bluff et hand reading',
    description: 'Techniques avancées : 3-bet/4-bet, bluff semi-bluff, hand reading et exploitation des profils adverses.',
    url: 'https://autapis.fr/avance',
  },
  alternates: { canonical: 'https://autapis.fr/avance' },
};

export default function AvanceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
