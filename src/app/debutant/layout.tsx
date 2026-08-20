import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Poker Débutant : Apprenez les bases du Texas Hold\'em',
  description: 'Maîtrisez les règles du poker, la force des mains, les positions et la sélection de mains de départ. Module interactif avec quiz, exercices et mains réelles à rejouer. Gratuit.',
  keywords: ['poker débutant', 'règles poker', 'apprendre poker', 'force des mains poker', 'positions poker', 'texas holdem débutant'],
  openGraph: {
    title: "Poker Débutant : Les bases du Texas Hold'em",
    description: 'Règles, mains, positions, sélection : tout ce qu\'il faut pour jouer sa première main de poker correctement.',
    url: 'https://forgedpoker.com/debutant',
  },
  alternates: { canonical: 'https://forgedpoker.com/debutant' },
};

export default function DebutantLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
