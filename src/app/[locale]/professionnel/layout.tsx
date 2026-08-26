import type { Metadata } from 'next';

const BASE_URL = 'https://forgedpoker.com';

const FAQS = {
  fr: [
    {
      q: "Quelle est la différence entre cash game et tournoi au poker ?",
      a: "Au cash game, les chips ont une valeur directe et vous pouvez quitter à tout moment. En tournoi, la valeur des chips dépend du contexte ICM et la structure — niveaux croissants, prize pool fixe — modifie profondément la stratégie optimale.",
    },
    {
      q: "Comment Phil Ivey approche-t-il le poker ?",
      a: "Ivey est connu pour ses reads exceptionnels sur les adversaires, son agressivité contrôlée et sa capacité à exploiter les erreurs spécifiques plutôt qu'à appliquer un GTO rigide. Il adapte constamment son style au profil de chaque adversaire.",
    },
    {
      q: "Comment devenir joueur de poker professionnel ?",
      a: "Cela exige une edge prouvée sur les limites jouées, une gestion rigoureuse de la bankroll (minimum 20 à 30 buy-ins), une routine d'étude régulière avec solver et review de sessions, et une stabilité mentale solide face à la variance.",
    },
  ],
  en: [
    {
      q: "What is the difference between cash game and tournament poker?",
      a: "In cash games, chips have direct monetary value and you can leave anytime. In tournaments, chip value depends on ICM context and the increasing blind structure fundamentally changes optimal strategy.",
    },
    {
      q: "How does Phil Ivey approach poker?",
      a: "Ivey is known for exceptional opponent reads, controlled aggression and his ability to exploit specific errors rather than applying rigid GTO. He constantly adapts his style to each opponent's profile.",
    },
    {
      q: "How do you become a professional poker player?",
      a: "It requires a proven edge at your stakes, strict bankroll management (minimum 20 to 30 buy-ins), a regular study routine with solvers and session review, and strong mental resilience against variance.",
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
      ? 'Poker Professionnel : Mains légendaires et stratégies des champions'
      : 'Professional Poker : Legendary Hands and Champion Strategies',
    description: isFr
      ? "Analysez les mains de Phil Ivey et Moneymaker, les stratégies WSOP et les secrets du plus haut niveau de poker."
      : 'Analyze Phil Ivey and Moneymaker hands, WSOP strategies and the secrets of the highest level of poker.',
    keywords: isFr
      ? ['poker professionnel', 'mains légendaires poker', 'stratégie champions poker', 'WSOP poker', 'mental game élite', 'cash game vs tournois', 'Phil Ivey poker', 'Moneymaker poker', 'devenir joueur pro poker']
      : ['professional poker strategy', 'WSOP poker legends', 'cash game vs tournaments', 'elite mental game poker', 'poker champion strategy', 'Phil Ivey poker hands', 'pro poker tips', 'how to go pro poker'],
    openGraph: {
      title: isFr
        ? 'Poker Professionnel : Mains légendaires et stratégies des champions'
        : 'Professional Poker : Legendary Hands and Champion Strategies',
      description: isFr
        ? "Phil Ivey, Moneymaker, WSOP : les mains qui ont fait l'histoire et les stratégies des meilleurs joueurs du monde."
        : 'Phil Ivey, Moneymaker, WSOP: the hands that made history and the strategies of the best players in the world.',
      url: `${BASE_URL}/${locale}/professionnel`,
    },
    alternates: { canonical: `${BASE_URL}/${locale}/professionnel` },
  };
}

export default async function ProfessionnelLayout({
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
