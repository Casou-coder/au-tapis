import type { Metadata } from 'next';

const BASE_URL = 'https://forgedpoker.com';

const FAQS = {
  fr: [
    {
      q: "Comment fonctionne un solver de poker ?",
      a: "Un solver résout des équations de théorie des jeux pour trouver la stratégie GTO d'une situation donnée. Il indique quelles mains miser, checker ou folder à quelle fréquence, en supposant que les deux joueurs jouent de manière optimale.",
    },
    {
      q: "Qu'est-ce que le tilt au poker et comment l'éviter ?",
      a: "Le tilt est un état émotionnel où les mauvaises décisions s'enchaînent après un résultat frustrant. L'éviter passe par la reconnaissance de ses déclencheurs personnels, des stop-loss quotidiens et une routine de revue mentale post-session.",
    },
    {
      q: "Comment utiliser un HUD au poker en ligne ?",
      a: "Un HUD (Heads-Up Display) affiche des statistiques en temps réel sur vos adversaires : VPIP, PFR, taux d'agression, fréquence de fold au 3-bet. Utilisez ces données pour ajuster votre range contre chaque profil de joueur.",
    },
  ],
  en: [
    {
      q: "How does a poker solver work?",
      a: "A solver finds GTO strategies by solving game theory equations for specific situations. It tells you which hands to bet, check or fold at which frequency, assuming both players play optimally.",
    },
    {
      q: "What is tilt in poker and how do you avoid it?",
      a: "Tilt is an emotional state where poor decisions cascade after a frustrating result. Avoid it by recognizing your personal triggers, setting daily stop-loss limits and building a mental review routine after each session.",
    },
    {
      q: "How do you use a HUD in online poker?",
      a: "A HUD (Heads-Up Display) shows real-time stats on opponents: VPIP, PFR, aggression frequency, fold-to-3bet rate. Use this data to adjust your range against each player profile at the table.",
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
      ? 'Poker Expert : Solver thinking, HUD, mental game et étude'
      : 'Expert Poker : Solver Thinking, HUD, Mental Game and Study',
    description: isFr
      ? "Pensez comme un solver, analysez avec un HUD et dominez le mental game. Structurez votre routine d'étude pour gagner régulièrement."
      : 'Think like a solver, analyze with a HUD and master your mental game. Structure your study routine to win consistently.',
    keywords: isFr
      ? ['GTO poker expert', 'solver poker', 'HUD poker', 'mental game poker', 'study poker', 'poker expert', 'table selection poker', 'tilt poker', 'balanced ranges', 'routine étude poker']
      : ['GTO poker expert', 'poker solver thinking', 'HUD poker', 'mental game poker', 'poker study routine', 'balanced ranges poker', 'table selection poker', 'tilt control poker'],
    openGraph: {
      title: isFr ? 'Poker Expert : Solver thinking, HUD et mental game' : 'Expert Poker : Solver Thinking, HUD and Mental Game',
      description: isFr
        ? "Pensée solver, analyse HUD, mental game et routines d'étude : le niveau qui sépare les réguliers des gagnants constants."
        : 'Solver thinking, HUD analysis, mental game and study routines: the level that separates regular players from consistent winners.',
      url: `${BASE_URL}/${locale}/expert`,
    },
    alternates: { canonical: `${BASE_URL}/${locale}/expert` },
  };
}

export default async function ExpertLayout({
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
