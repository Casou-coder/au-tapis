import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Poker Expert : Solver thinking, HUD, mental game et étude',
  description: 'Apprenez à penser comme un solver, analysez avec un HUD, dominez le mental game et structurez votre routine d\'étude. Pour dominer les tables régulièrement.',
  keywords: ['GTO poker expert', 'solver poker', 'HUD poker', 'mental game poker', 'study poker', 'poker expert', 'table selection poker', 'tilt poker', 'balanced ranges'],
  openGraph: {
    title: 'Poker Expert : Solver thinking, HUD et mental game',
    description: 'Pensée solver, analyse HUD, mental game et routines d\'étude : le niveau qui sépare les réguliers des gagnants constants.',
    url: 'https://forgedpoker.com/expert',
  },
  alternates: { canonical: 'https://forgedpoker.com/expert' },
};

export default function ExpertLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
