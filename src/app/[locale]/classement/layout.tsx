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
      ? 'Classement Poker : Meilleurs Joueurs de la Semaine'
      : 'Poker Leaderboard : Best Players of the Week',
    description: isFr
      ? "Classement hebdomadaire Forged Poker : qui enchaîne le plus de jours consécutifs, cumule le plus d'XP et répond le mieux aux défis difficiles ?"
      : 'Weekly Forged Poker leaderboard: who chains the most consecutive days, accumulates the most XP and answers the hardest challenges best?',
    keywords: isFr
      ? ['classement poker', 'meilleur joueur poker', 'streak poker', 'XP poker', 'leaderboard poker', 'classement hebdomadaire poker', 'compétition poker gratuite']
      : ['poker leaderboard', 'poker ranking', 'poker streak ranking', 'poker XP leaderboard', 'weekly poker competition', 'poker challenge ranking'],
    openGraph: {
      title: isFr ? 'Classement Forged Poker' : 'Forged Poker Leaderboard',
      description: isFr
        ? 'Classement hebdomadaire : séries, XP et précision. Réinitialisé chaque lundi.'
        : 'Weekly ranking: streaks, XP and accuracy. Reset every Monday.',
      url: `${BASE_URL}/${locale}/classement`,
      locale: isFr ? 'fr_FR' : 'en_US',
    },
    alternates: { canonical: `${BASE_URL}/${locale}/classement` },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
