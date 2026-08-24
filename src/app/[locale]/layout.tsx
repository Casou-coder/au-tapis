import type { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { AuthProvider } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import ResponsibleGamblingBanner from '@/components/ResponsibleGamblingBanner';
import CookieConsent from '@/components/CookieConsent';
import SiteFooter from '@/components/SiteFooter';

const BASE_URL = 'https://forgedpoker.com';

// JSON-LD structured data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'Forged Poker',
  url: BASE_URL,
  description: "Poker Texas Hold'em learning platform, from beginner to professional.",
  isAccessibleForFree: true,
  teaches: [
    "Texas Hold'em poker rules",
    'Pot odds and equity calculation',
    'GTO (Game Theory Optimal) strategies',
    'ICM (Independent Chip Model)',
    'Bankroll management',
    'Reading opponents',
    'Bluffing and semi-bluffing',
    'Positional play',
  ],
  hasCourse: [
    { '@type': 'Course', name: 'Beginner Poker', url: `${BASE_URL}/en/debutant` },
    { '@type': 'Course', name: 'Intermediate Poker', url: `${BASE_URL}/en/intermediaire` },
    { '@type': 'Course', name: 'Advanced Poker', url: `${BASE_URL}/en/avance` },
    { '@type': 'Course', name: 'Expert Poker', url: `${BASE_URL}/en/expert` },
    { '@type': 'Course', name: 'Professional Poker', url: `${BASE_URL}/en/professionnel` },
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
    metadataBase: new URL(BASE_URL),
    title: {
      default: isFr
        ? "Forged Poker : Apprenez le Poker Texas Hold'em en Français"
        : "Forged Poker — Learn Texas Hold'em Poker",
      template: '%s | Forged Poker',
    },
    description: isFr
      ? "Apprenez le poker Texas Hold'em gratuitement, du niveau débutant au professionnel. Cours interactifs, défis quotidiens, calculateur d'équité et outils GTO. Sans argent réel."
      : "Learn Texas Hold'em poker for free, from beginner to professional. Interactive courses, daily challenges, equity calculator and GTO tools. No real money.",
    openGraph: {
      type: 'website',
      locale: isFr ? 'fr_FR' : 'en_US',
      url: `${BASE_URL}/${locale}`,
      siteName: 'Forged Poker',
      title: isFr
        ? "Forged Poker : Apprenez le Poker Texas Hold'em en Français"
        : "Forged Poker — Learn Texas Hold'em Poker",
      description: isFr
        ? "Cours interactifs du débutant au pro. Défis quotidiens, outils GTO et calculateur d'équité. Gratuit."
        : 'Interactive courses from beginner to pro. Daily challenges, GTO tools and equity calculator. Free.',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@ForgedPoker',
      title: isFr
        ? "Forged Poker : Apprenez le Poker Texas Hold'em en Français"
        : "Forged Poker — Learn Texas Hold'em Poker",
      description: isFr
        ? "Cours interactifs du débutant au pro. Défis quotidiens, outils GTO et calculateur d'équité. Gratuit."
        : 'Interactive courses from beginner to pro. Daily challenges, GTO tools and equity calculator. Free.',
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        'en': `${BASE_URL}/en`,
        'fr': `${BASE_URL}/fr`,
      },
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AuthProvider>
        {/* Skip to main content */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-yellow-500 focus:text-black focus:rounded-lg focus:font-bold focus:text-sm"
        >
          {locale === 'fr' ? 'Aller au contenu principal' : 'Skip to main content'}
        </a>
        <Navigation />
        {children}
        <SiteFooter />
        <ResponsibleGamblingBanner />
        <CookieConsent />
      </AuthProvider>

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </NextIntlClientProvider>
  );
}
