import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Range Builder : Construis tes Ranges Préflop GTO',
  description: 'Exercices interactifs de range building : construis la range GTO de chaque position (BTN, CO, UTG, 3-bet) sur la grille 13×13, puis compare à la réponse exacte.',
  keywords: ['range builder poker', 'range preflop GTO', 'construire range poker', 'range BTN CO UTG', 'exercice range poker'],
  openGraph: {
    title: 'Range Builder Poker : Exercices GTO Interactifs',
    description: 'Construis les ranges GTO par position sur une grille 13×13 et compare à la réponse. BTN, CO, UTG, SB 3-bet.',
    url: 'https://forgedpoker.com/ranges',
    locale: 'fr_FR',
  },
  alternates: { canonical: 'https://forgedpoker.com/ranges' },
};

export default function RangesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
