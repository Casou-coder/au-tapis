import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Poker Intermédiaire : Pot odds, C-bet et jeu post-flop',
  description: 'Calculez les pot odds, maîtrisez la continuation bet, comprenez les ranges et le jeu post-flop. Niveau intermédiaire pour progresser rapidement au poker Texas Hold\'em.',
  keywords: ['pot odds poker', 'continuation bet', 'ranges poker', 'jeu post-flop', 'poker intermédiaire', 'stratégie poker'],
  openGraph: {
    title: 'Poker Intermédiaire : Pot odds, ranges et C-bet',
    description: 'Passez au niveau supérieur : pot odds, equity, continuation bet, ranges et hand reading.',
    url: 'https://forgedpoker.com/intermediaire',
  },
  alternates: { canonical: 'https://forgedpoker.com/intermediaire' },
};

export default function IntermediaireLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
