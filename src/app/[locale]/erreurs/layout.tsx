import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Erreurs Fréquentes au Poker",
  description: "Les erreurs les plus communes à chaque niveau du poker Texas Hold'em. Identifiez et corrigez vos fuites pour progresser plus vite.",
  keywords: ['erreurs poker', 'fautes poker', 'fuites poker', 'leaks poker', 'corriger son jeu poker', 'mistakes poker', 'améliorer son poker'],
  openGraph: {
    title: 'Erreurs Fréquentes au Poker',
    description: "Identifiez vos leaks les plus coûteux et corrigez-les niveau par niveau.",
    url: 'https://forgedpoker.com/erreurs',
  },
  alternates: { canonical: 'https://forgedpoker.com/erreurs' },
};

export default function ErreursLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
