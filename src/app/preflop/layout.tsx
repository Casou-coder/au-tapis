import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ranges Préflop : Ranges par Position',
  description: 'Tableaux de ranges préflop GTO par position (UTG, HJ, CO, BTN, SB, BB). Visualisez quelles mains ouvrir en 6-max cash game.',
  keywords: ['charts préflop poker', 'ranges preflop GTO', 'tableaux mains poker', 'ouverture par position', 'ranges 6-max', 'BTN SB BB poker'],
  openGraph: {
    title: 'Ranges Préflop : Ranges par Position',
    description: 'Référence visuelle des ranges d\'ouverture et de défense au poker.',
    url: 'https://forgedpoker.com/preflop',
  },
  alternates: { canonical: 'https://forgedpoker.com/preflop' },
};

export default function PreflopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
