import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Session Tracker Poker",
  description: "Suivez vos sessions de poker, calculez votre ROI et analysez votre progression. Bilan complet de vos résultats en cash game et tournois.",
  keywords: ['tracker session poker', 'suivi résultats poker', 'ROI poker', 'bilan session poker', 'journal poker', 'résultats poker'],
  openGraph: {
    title: 'Session Tracker Poker',
    description: 'Suivez et analysez vos sessions de poker pour progresser en connaissance de cause.',
    url: 'https://forgedpoker.com/session',
  },
  alternates: { canonical: 'https://forgedpoker.com/session' },
};

export default function SessionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
