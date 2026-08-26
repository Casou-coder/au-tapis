import { MetadataRoute } from 'next';

const BASE_URL = 'https://forgedpoker.com';
const LOCALES = ['fr', 'en'] as const;

function localizedEntries(
  paths: { path: string; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }[]
): MetadataRoute.Sitemap {
  return paths.flatMap(({ path, changeFrequency, priority }) =>
    LOCALES.map(locale => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    }))
  );
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // Root — redirect to locale, lower priority
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
    // Locale roots
    ...LOCALES.map(locale => ({
      url: `${BASE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    })),
    // Localized pages
    ...localizedEntries([
      { path: '/debutant',      changeFrequency: 'monthly', priority: 0.9 },
      { path: '/intermediaire', changeFrequency: 'monthly', priority: 0.9 },
      { path: '/avance',        changeFrequency: 'monthly', priority: 0.9 },
      { path: '/expert',        changeFrequency: 'monthly', priority: 0.9 },
      { path: '/professionnel', changeFrequency: 'monthly', priority: 0.9 },
      { path: '/defis',         changeFrequency: 'daily',   priority: 0.8 },
      { path: '/glossaire',     changeFrequency: 'monthly', priority: 0.8 },
      { path: '/preflop',       changeFrequency: 'monthly', priority: 0.7 },
      { path: '/calculateur',   changeFrequency: 'monthly', priority: 0.7 },
      { path: '/outils',        changeFrequency: 'monthly', priority: 0.7 },
      { path: '/classement',    changeFrequency: 'daily',   priority: 0.6 },
      { path: '/erreurs',       changeFrequency: 'monthly', priority: 0.6 },
      { path: '/jeu-responsable', changeFrequency: 'yearly', priority: 0.4 },
    ]),
  ];
}
