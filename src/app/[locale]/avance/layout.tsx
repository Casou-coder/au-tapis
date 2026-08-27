import type { Metadata } from 'next';

const BASE_URL = 'https://forgedpoker.com';

const FAQS = {
  fr: [
    {
      q: "Qu'est-ce que le GTO au poker ?",
      a: "GTO (Game Theory Optimal) : une stratégie mathématiquement équilibrée qui ne peut pas être exploitée. Elle mélange des mises de différentes tailles à des fréquences précises pour que l'adversaire soit indifférent entre ses options.",
    },
    {
      q: "Quand utiliser un 4-bet au poker ?",
      a: "Principalement avec des mains premium (QQ+, AK) pour du value, et quelques mains de bluff polarisantes (A2s-A5s). Un 4-bet équilibre votre range et protège vos meilleures mains contre les relances adverses.",
    },
    {
      q: "Qu'est-ce que l'ICM en tournoi de poker ?",
      a: "ICM (Independent Chip Model) : un modèle qui convertit les chips de tournoi en valeur monétaire réelle. Il explique pourquoi vous devez jouer plus serré quand des joueurs à faible stack sont proches de l'élimination.",
    },
  ],
  en: [
    {
      q: "What is GTO poker strategy?",
      a: "GTO (Game Theory Optimal): a mathematically balanced strategy that cannot be exploited. It mixes bet sizes at precise frequencies so opponents are indifferent between their options.",
    },
    {
      q: "When should you 4-bet in poker?",
      a: "Primarily with premium hands (QQ+, AK) for value, and a few polarizing bluff hands (A2s-A5s). A 4-bet balances your range and protects your strongest hands against further aggression.",
    },
    {
      q: "What is ICM in tournament poker?",
      a: "ICM (Independent Chip Model): a model that converts tournament chips into real monetary value. It explains why you should play tighter when short stacks are near elimination, even with a chip EV edge.",
    },
  ],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === 'fr';

  return {
    title: isFr
      ? 'Poker Avancé : GTO, ranges, 3-bets et ICM tournois'
      : 'Advanced Poker : GTO, Ranges, 3-bets and Tournament ICM',
    description: isFr
      ? "Maîtrisez le GTO, la construction de ranges, les 3-bets, les blockers et l'ICM tournois. Poker avancé pour joueurs sérieux."
      : 'Master GTO, range construction, 3-bets, blockers and tournament ICM. Advanced poker for serious players.',
    keywords: isFr
      ? ['GTO poker avancé', 'range construction poker', '3-bet poker', '4-bet poker', 'blockers poker', 'ICM poker avancé', 'bet sizing GTO', 'multiway pots poker', 'poker avancé', 'solver poker français']
      : ['advanced GTO poker', 'range construction poker', '3-bet 4-bet poker', 'blockers poker', 'ICM advanced poker', 'bet sizing GTO', 'multiway pots poker', 'poker solver thinking'],
    openGraph: {
      title: isFr ? 'Poker Avancé : GTO, ranges, 3-bets et ICM tournois' : 'Advanced Poker : GTO, Ranges, 3-bets and ICM',
      description: isFr
        ? 'GTO, blockers, ICM, bet sizing et jeu multiway : les concepts qui séparent les bons des excellents.'
        : 'GTO, blockers, ICM, bet sizing and multiway play: the concepts that separate good players from great ones.',
      url: `${BASE_URL}/${locale}/avance`,
    },
    alternates: { canonical: `${BASE_URL}/${locale}/avance` },
  };
}

export default async function AvanceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const faqs = locale === 'fr' ? FAQS.fr : FAQS.en;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
