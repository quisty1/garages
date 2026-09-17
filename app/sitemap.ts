import { landingPages, landingHref } from '@/lib/landing-pages';
// Static sitemap.xml — single homepage entry with featured images.

import type { MetadataRoute } from 'next';
import { company } from '@/lib/site-data';
import { absUrl, getSiteUrl, SITEMAP_IMAGES, SITEMAP_LASTMOD } from '@/lib/seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl(company);
  return [
    ...landingPages.map((page) => ({
      url: absUrl(company, landingHref(page)),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      images: [absUrl(company, page.image), absUrl(company, page.detail.image)],
    })),
    {
      url: `${siteUrl}/`,
      lastModified: SITEMAP_LASTMOD,
      changeFrequency: 'monthly',
      priority: 1,
      images: SITEMAP_IMAGES.map((path) => absUrl(company, path)),
    },
  ];
}
