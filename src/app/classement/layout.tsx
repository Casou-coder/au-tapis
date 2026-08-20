import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Classement',
  description: 'Classement des joueurs Forged Poker : séries de défis, XP de la semaine et précision sur les questions expert.',
  alternates: { canonical: 'https://forgedpoker.com/classement' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
