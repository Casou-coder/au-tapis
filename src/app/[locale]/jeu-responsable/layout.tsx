import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jeu Responsable',
  description: "Jouez au poker de façon saine. Conseils pour contrôler votre pratique, reconnaître les signes d'alerte et trouver de l'aide si nécessaire.",
  alternates: { canonical: 'https://forgedpoker.com/jeu-responsable' },
  openGraph: {
    title: 'Jeu Responsable | Forged Poker',
    description: "Jouez au poker de façon saine. Conseils pour contrôler votre pratique, reconnaître les signes d'alerte et trouver de l'aide si nécessaire.",
    url: 'https://forgedpoker.com/jeu-responsable',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
