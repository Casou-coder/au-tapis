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
      ? 'Erreurs Fréquentes au Poker'
      : 'Common Poker Mistakes to Avoid',
    description: isFr
      ? "Les erreurs les plus communes à chaque niveau du poker Texas Hold'em. Identifiez et corrigez vos fuites pour progresser plus vite."
      : "The most common mistakes at every level of Texas Hold'em poker. Identify and fix your leaks to improve faster.",
    keywords: isFr
      ? ['erreurs poker', 'fautes poker', 'fuites poker', 'leaks poker', 'corriger son jeu poker', 'mistakes poker', 'améliorer son poker', 'erreurs débutant poker', 'comment progresser poker']
      : ['poker mistakes', 'poker leaks', 'fix poker game', 'poker errors', 'improve poker', 'common poker mistakes', 'beginner poker errors', 'poker leaks to fix', 'how to improve poker'],
    openGraph: {
      title: isFr ? 'Erreurs Fréquentes au Poker' : 'Common Poker Mistakes',
      description: isFr
        ? 'Identifiez vos leaks les plus coûteux et corrigez-les niveau par niveau.'
        : 'Identify your most costly leaks and fix them level by level.',
      url: `${BASE_URL}/${locale}/erreurs`,
    },
    alternates: { canonical: `${BASE_URL}/${locale}/erreurs` },
  };
}

export default function ErreursLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
