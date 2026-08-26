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
      ? 'Glossaire Poker : Tous les termes expliqués'
      : 'Poker Glossary : All Terms Explained',
    description: isFr
      ? 'Dictionnaire complet du poker : VPIP, PFR, GTO, ICM, EV, equity, pot odds, range et 80+ termes expliqués simplement.'
      : 'Complete poker dictionary: VPIP, PFR, GTO, ICM, EV, equity, pot odds, range and 80+ terms explained simply.',
    keywords: isFr
      ? ['glossaire poker', 'termes poker', 'définitions poker', 'VPIP PFR GTO ICM', 'vocabulaire poker', 'lexique poker', 'signification VPIP poker', 'définition GTO poker', 'EV poker définition']
      : ['poker glossary', 'poker terms definitions', 'VPIP PFR poker', 'GTO ICM glossary', 'poker vocabulary', 'poker dictionary', 'what is GTO poker', 'poker terms explained', 'poker slang dictionary'],
    openGraph: {
      title: isFr ? 'Glossaire Poker : Tous les termes expliqués' : 'Poker Glossary : All Terms Explained',
      description: isFr
        ? 'Tous les termes du poker expliqués clairement, du débutant au pro.'
        : 'All poker terms explained clearly, from beginner to pro.',
      url: `${BASE_URL}/${locale}/glossaire`,
      locale: isFr ? 'fr_FR' : 'en_US',
    },
    alternates: { canonical: `${BASE_URL}/${locale}/glossaire` },
  };
}

export default function GlossaireLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
