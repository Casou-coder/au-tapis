import type { Metadata } from 'next';

const BASE_URL = 'https://forgedpoker.com';

const FAQS = {
  fr: [
    {
      q: "Comment calculer les pot odds au poker ?",
      a: "Divisez le montant à appeler par le pot total après votre appel. Exemple : vous payez 100 dans un pot de 300 total → pot odds = 33%. Si votre équité dépasse 33%, l'appel est rentable à long terme.",
    },
    {
      q: "Qu'est-ce que la continuation bet au poker ?",
      a: "C'est une mise effectuée par le relanceur préflop au flop, même si la board ne l'a pas aidé. Elle représente la force montrée préflop et est l'outil de base du jeu post-flop agressif.",
    },
    {
      q: "Comment construire une range de départ au poker ?",
      a: "Une range se construit par position : plus vous êtes proche du BTN, plus vous pouvez ouvrir de mains. UTG joue environ 14% des mains, le BTN peut aller jusqu'à 45-50% en 6-max cash game.",
    },
  ],
  en: [
    {
      q: "How do you calculate pot odds in poker?",
      a: "Divide the amount to call by the total pot after your call. Example: you call 100 into a 300 total pot → pot odds = 33%. If your equity exceeds 33%, the call is profitable long term.",
    },
    {
      q: "What is a continuation bet in poker?",
      a: "A bet made by the preflop aggressor on the flop, regardless of whether the board helped them. It represents the strength shown preflop and is the foundation of aggressive postflop play.",
    },
    {
      q: "How do you build a starting range in poker?",
      a: "Ranges are built by position: the closer you are to the BTN, the more hands you can open. UTG plays around 14% of hands, while the BTN can open up to 45-50% in 6-max cash games.",
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
      ? 'Poker Intermédiaire : Pot odds, C-bet et jeu post-flop'
      : 'Intermediate Poker : Pot Odds, C-bet and Postflop Play',
    description: isFr
      ? "Calculez les pot odds, maîtrisez la continuation bet et les ranges. Progressez au niveau intermédiaire en poker Texas Hold'em."
      : "Calculate pot odds, master the continuation bet and ranges. Improve to intermediate level at Texas Hold'em poker.",
    keywords: isFr
      ? ['pot odds poker', 'continuation bet', 'ranges poker', 'jeu post-flop', 'poker intermédiaire', 'stratégie poker', 'améliorer son poker', 'equity poker', 'hand reading poker']
      : ['intermediate poker strategy', 'pot odds poker', 'continuation bet poker', 'postflop play poker', 'poker range strategy', 'poker equity', 'hand reading poker', 'improve poker skills'],
    openGraph: {
      title: isFr ? 'Poker Intermédiaire : Pot odds, ranges et C-bet' : 'Intermediate Poker : Pot Odds, Ranges and C-bet',
      description: isFr
        ? 'Passez au niveau supérieur : pot odds, equity, continuation bet, ranges et hand reading.'
        : 'Level up: pot odds, equity, continuation bet, ranges and hand reading.',
      url: `${BASE_URL}/${locale}/intermediaire`,
    },
    alternates: { canonical: `${BASE_URL}/${locale}/intermediaire` },
  };
}

export default async function IntermediaireLayout({
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
