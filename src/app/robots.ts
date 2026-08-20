import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/profil', '/api/', '/login', '/register', '/auth', '/onboarding', '/reset-password'],
    },
    sitemap: 'https://forgedpoker.com/sitemap.xml',
  };
}
