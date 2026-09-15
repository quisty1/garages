// Static sitemap.xml — single homepage entry with featured images.

import type { MetadataRoute } from 'next';
import { company } from '@/lib/site-data';
import { absUrl, getSiteUrl, SITEMAP_IMAGES, SITEMAP_LASTMOD } from '@/lib/seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl(company);
  return [
    {
      url: `${siteUrl}/`,
      lastModified: SITEMAP_LASTMOD,
      changeFrequency: 'monthly',
      priority: 1,
      images: SITEMAP_IMAGES.map((path) => absUrl(company, path)),
    },
  ];
}
