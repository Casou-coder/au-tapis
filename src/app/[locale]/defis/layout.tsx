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
      ? 'Défis Quotidiens : Entraînez-vous chaque jour au poker'
      : 'Daily Poker Challenges : Practice Every Day',
    description: isFr
      ? 'Un défi poker adapté à votre niveau chaque jour. 200+ défis du débutant au pro. Construisez votre série et progressez régulièrement.'
      : 'A poker challenge adapted to your level every day. 200+ challenges from beginner to pro. Build your streak and improve consistently.',
    keywords: isFr
      ? ['défis poker quotidiens', 'entraînement poker', 'exercices poker', 'quiz poker', 'pratique poker', 'défi poker quotidien', 'streak poker', '200 défis poker', 'challenge poker gratuit', 'quiz texas holdem']
      : ['daily poker challenges', 'poker quiz', 'poker training exercises', 'poker practice', 'poker streak', 'poker challenge free', 'poker daily quiz', 'texas holdem quiz', 'poker decision training'],
    openGraph: {
      title: isFr ? 'Défis Poker Quotidiens' : 'Daily Poker Challenges',
      description: isFr
        ? 'Un nouveau défi poker chaque jour, adapté à votre niveau. Construisez votre série et progressez régulièrement.'
        : 'A new poker challenge every day, adapted to your level. Build your streak and improve regularly.',
      url: `${BASE_URL}/${locale}/defis`,
    },
    alternates: { canonical: `${BASE_URL}/${locale}/defis` },
  };
}

export default function DefisLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
