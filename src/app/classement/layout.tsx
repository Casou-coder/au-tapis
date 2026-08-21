import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Classement Poker : Meilleurs Joueurs de la Semaine',
  description: 'Classement hebdomadaire Forged Poker : qui enchaîne le plus de jours consécutifs, cumule le plus d\'XP et répond le mieux aux défis difficiles ?',
  keywords: ['classement poker', 'meilleur joueur poker', 'streak poker', 'XP poker', 'leaderboard poker'],
  openGraph: {
    title: 'Classement Forged Poker',
    description: 'Classement hebdomadaire : séries, XP et précision. Réinitialisé chaque lundi.',
    url: 'https://forgedpoker.com/classement',
    locale: 'fr_FR',
  },
  alternates: { canonical: 'https://forgedpoker.com/classement' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
