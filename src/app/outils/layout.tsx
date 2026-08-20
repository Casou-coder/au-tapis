import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Outils Poker : Calculateur GTO, Range Builder, Board Texture',
  description: 'Suite d\'outils poker gratuits : analyse de board texture, calculateur de bounty PKO, range builder 13×13, quiz d\'équité, bankroll manager et planificateur d\'objectifs.',
  keywords: ['outils poker', 'calculateur poker', 'range builder poker', 'board texture poker', 'bounty poker', 'bankroll poker'],
  openGraph: {
    title: 'Outils Poker Gratuits',
    description: 'Board texture, range builder, bounty PKO, quiz d\'équité, bankroll manager : tous les outils pour progresser au poker.',
    url: 'https://forgedpoker.com/outils',
  },
  alternates: { canonical: 'https://forgedpoker.com/outils' },
};

export default function OutilsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
