import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/profil', '/api/'],
    },
    sitemap: 'https://autapis.fr/sitemap.xml',
  };
}
