import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quiz de niveau poker',
  description: '5 questions pour découvrir votre niveau au poker et commencer au bon endroit. Débutant, intermédiaire, avancé ou expert ?',
  keywords: ['quiz niveau poker', 'quel niveau poker', 'test poker débutant', 'commencer poker', 'évaluation niveau poker'],
  openGraph: {
    title: 'Quiz de niveau poker',
    description: 'Découvrez votre niveau en 5 questions et commencez au bon endroit.',
    url: 'https://forgedpoker.com/onboarding',
  },
  alternates: { canonical: 'https://forgedpoker.com/onboarding' },
};

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
