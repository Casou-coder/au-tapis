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
      ? 'Outils Poker : Calculateur GTO, Range Builder, Board Texture'
      : 'Poker Tools : GTO Calculator, Range Builder, Board Texture',
    description: isFr
      ? "Outils poker gratuits : board texture, bounty PKO, range builder, quiz d'équité et bankroll manager. Tout pour progresser au poker."
      : 'Free poker tools: board texture, PKO bounty, range builder, equity quiz and bankroll manager. Everything to improve at poker.',
    keywords: isFr
      ? ['outils poker', 'calculateur poker', 'range builder poker', 'board texture poker', 'bounty poker', 'bankroll poker', 'outils GTO poker gratuit', 'range builder 13x13', 'analyse board poker']
      : ['poker tools', 'poker calculator', 'range builder poker', 'board texture analyzer', 'poker bankroll tool', 'free GTO poker tools', 'PKO bounty calculator', 'poker range builder free'],
    openGraph: {
      title: isFr ? 'Outils Poker Gratuits' : 'Free Poker Tools',
      description: isFr
        ? "Board texture, range builder, bounty PKO, quiz d'équité, bankroll manager : tous les outils pour progresser au poker."
        : 'Board texture, range builder, PKO bounty, equity quiz, bankroll manager: all the tools to improve at poker.',
      url: `${BASE_URL}/${locale}/outils`,
    },
    alternates: { canonical: `${BASE_URL}/${locale}/outils` },
  };
}

export default function OutilsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
