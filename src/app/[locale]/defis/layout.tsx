import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Défis Quotidiens : Entraînez-vous chaque jour au poker',
  description: 'Un défi poker adapté à votre niveau chaque jour. Calculez vos outs, prenez les bonnes décisions, analysez des mains réelles. 145 défis de débutant à professionnel.',
  keywords: ['défis poker quotidiens', 'entraînement poker', 'exercices poker', 'quiz poker', 'pratique poker', 'défi poker quotidien', 'streak poker', '145 défis poker'],
  openGraph: {
    title: 'Défis Poker Quotidiens',
    description: 'Un nouveau défi poker chaque jour, adapté à votre niveau. Construisez votre série et progressez régulièrement.',
    url: 'https://forgedpoker.com/defis',
  },
  alternates: { canonical: 'https://forgedpoker.com/defis' },
};

export default function DefisLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
