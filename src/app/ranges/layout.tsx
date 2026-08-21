import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Range Builder',
  description: 'Construis et teste tes ranges préflop GTO par position. Exercices interactifs pour apprendre quelles mains ouvrir, 3-better ou défendre depuis chaque position en 6-max cash game.',
  keywords: ['range poker', 'construire range preflop', 'range builder', 'GTO ranges positions', 'range ouverture poker'],
};

export default function RangesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
