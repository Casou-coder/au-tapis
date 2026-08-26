import type { Metadata } from 'next';

const BASE_URL = 'https://forgedpoker.com';

const FAQS = {
  fr: [
    {
      q: "Combien de temps faut-il pour apprendre les bases du poker ?",
      a: "Avec 20 à 30 minutes par jour, vous maîtrisez les règles, la force des mains et les positions en 2 à 3 semaines. Atteindre le niveau intermédiaire demande 2 à 3 mois de pratique régulière.",
    },
    {
      q: "Peut-on apprendre le poker sans jouer avec de l'argent réel ?",
      a: "Oui. Forged Poker propose des cours interactifs, des défis quotidiens et des quiz sans aucune mise réelle ni inscription bancaire. Vous construisez vos bases théoriques avant tout.",
    },
    {
      q: "Quelle est la main la plus forte au poker Texas Hold'em ?",
      a: "La quinte flush royale (A-K-Q-J-10 de la même couleur) est la main la plus forte. Suivent la quinte flush, le carré, le full house, la couleur, la suite, le brelan, la double paire et la paire.",
    },
  ],
  en: [
    {
      q: "How long does it take to learn poker basics?",
      a: "With 20 to 30 minutes of daily practice, you can master the rules, hand rankings and positions in 2 to 3 weeks. Reaching intermediate level typically takes 2 to 3 months of regular play.",
    },
    {
      q: "Can I learn poker without playing with real money?",
      a: "Yes. Forged Poker offers interactive courses, daily challenges and quizzes with no real money required. Build your theoretical foundation before playing real stakes.",
    },
    {
      q: "What is the strongest hand in Texas Hold'em?",
      a: "The royal flush (A-K-Q-J-10 of the same suit) is the strongest hand. Below it: straight flush, four of a kind, full house, flush, straight, three of a kind, two pair and one pair.",
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
      ? "Poker Débutant : Apprenez les bases du Texas Hold'em"
      : "Beginner Poker : Learn Texas Hold'em Basics",
    description: isFr
      ? "Maîtrisez les règles du poker, la force des mains et les positions. Cours interactif avec quiz et exercices pratiques. Gratuit."
      : "Master poker rules, hand rankings and positions. Interactive course with quizzes and practical exercises. Free.",
    keywords: isFr
      ? ['poker débutant', 'règles poker', 'apprendre poker', 'force des mains poker', 'positions poker', 'texas holdem débutant', 'apprendre poker gratuitement', 'comment jouer au poker', 'bases poker texas holdem']
      : ['learn poker', 'poker for beginners', 'texas holdem rules', 'poker hand rankings', 'poker positions', 'how to play poker', 'poker basics free', 'beginner poker guide', 'poker starting hands'],
    openGraph: {
      title: isFr ? "Poker Débutant : Les bases du Texas Hold'em" : "Beginner Poker : Texas Hold'em Basics",
      description: isFr
        ? "Règles, mains, positions, sélection : tout ce qu'il faut pour jouer sa première main correctement."
        : "Rules, hands, positions, selection: everything you need to play your first poker hand correctly.",
      url: `${BASE_URL}/${locale}/debutant`,
    },
    alternates: { canonical: `${BASE_URL}/${locale}/debutant` },
  };
}

export default async function DebutantLayout({
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
