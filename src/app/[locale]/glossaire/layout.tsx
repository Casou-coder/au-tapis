import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Glossaire Poker : Tous les termes expliqués',
  description: 'Dictionnaire complet du poker : VPIP, PFR, GTO, ICM, EV, equity, pot odds, range et 80+ termes expliqués simplement.',
  keywords: ['glossaire poker', 'termes poker', 'définitions poker', 'VPIP PFR GTO ICM', 'vocabulaire poker', 'lexique poker'],
  openGraph: {
    title: 'Glossaire Poker : Tous les termes expliqués',
    description: 'Tous les termes du poker expliqués clairement, du débutant au pro.',
    url: 'https://forgedpoker.com/glossaire',
    locale: 'fr_FR',
  },
  alternates: { canonical: 'https://forgedpoker.com/glossaire' },
};

export default function GlossaireLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
