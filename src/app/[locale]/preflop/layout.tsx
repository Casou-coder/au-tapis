import type { Metadata } from 'next';

const BASE_URL = 'https://forgedpoker.com';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === 'fr';

  return {
    title: isFr
      ? 'Ranges Préflop : Ranges GTO par Position'
      : 'Preflop Ranges : GTO Ranges by Position',
    description: isFr
      ? 'Tableaux de ranges préflop GTO par position (UTG, HJ, CO, BTN, SB, BB). Visualisez quelles mains ouvrir en 6-max cash game.'
      : 'GTO preflop range charts by position (UTG, HJ, CO, BTN, SB, BB). Visualize which hands to open in 6-max cash game.',
    keywords: isFr
      ? ['charts préflop poker', 'ranges preflop GTO', 'tableaux mains poker', 'ouverture par position', 'ranges 6-max', 'BTN SB BB poker', 'range UTG poker', 'quelles mains jouer poker', 'grille de départ poker']
      : ['preflop poker charts', 'GTO preflop ranges', 'poker opening ranges', '6-max poker ranges', 'BTN CO UTG poker ranges', 'which hands to open poker', 'preflop range chart', 'poker starting hands chart'],
    openGraph: {
      title: isFr ? 'Ranges Préflop : Ranges GTO par Position' : 'Preflop Ranges : GTO Ranges by Position',
      description: isFr
        ? "Référence visuelle des ranges d'ouverture et de défense au poker."
        : 'Visual reference for poker opening and defense ranges.',
      url: `${BASE_URL}/${locale}/preflop`,
    },
    alternates: { canonical: `${BASE_URL}/${locale}/preflop` },
  };
}

export default function PreflopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
