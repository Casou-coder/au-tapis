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
      ? "Calculateur d'Équité Poker : Odds en temps réel"
      : 'Poker Equity Calculator : Real-time Odds',
    description: isFr
      ? "Calculez l'équité de votre main face à un adversaire, les pot odds et le ROI de chaque action. Calculateur de probabilités poker Texas Hold'em gratuit."
      : "Calculate your hand equity against an opponent, pot odds and the ROI of each action. Free Texas Hold'em poker probability calculator.",
    keywords: isFr
      ? ['calculateur équité poker', 'odds poker', 'pot odds calculateur', 'probabilités poker', 'equity calculator', 'calculateur poker gratuit', 'outs poker calcul', 'probabilité main poker']
      : ['poker equity calculator', 'pot odds calculator', 'poker odds', 'poker probability calculator', 'poker hand equity', 'free poker calculator', 'poker outs calculator', 'texas holdem odds'],
    openGraph: {
      title: isFr ? "Calculateur Poker : Équité et Pot Odds" : 'Poker Calculator : Equity and Pot Odds',
      description: isFr
        ? "Calculez instantanément l'équité de vos mains, les pot odds et prenez les meilleures décisions au poker."
        : 'Instantly calculate your hand equity, pot odds and make the best poker decisions.',
      url: `${BASE_URL}/${locale}/calculateur`,
    },
    alternates: { canonical: `${BASE_URL}/${locale}/calculateur` },
  };
}

export default function CalculateurLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
