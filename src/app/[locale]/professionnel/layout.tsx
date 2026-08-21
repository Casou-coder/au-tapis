import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Poker Professionnel : Mains légendaires et stratégies des champions',
  description: 'Analysez les mains légendaires de Phil Ivey et Moneymaker, découvrez les stratégies des champions WSOP, le mental game elite et les secrets du plus haut niveau.',
  keywords: ['poker professionnel', 'mains légendaires poker', 'stratégie champions poker', 'WSOP poker', 'mental game élite', 'cash game vs tournois', 'Phil Ivey poker'],
  openGraph: {
    title: 'Poker Professionnel : Mains légendaires et stratégies des champions',
    description: 'Phil Ivey, Moneymaker, WSOP : analysez les mains qui ont fait l\'histoire et adoptez les stratégies des meilleurs joueurs du monde.',
    url: 'https://forgedpoker.com/professionnel',
  },
  alternates: { canonical: 'https://forgedpoker.com/professionnel' },
};

export default function ProfessionnelLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
