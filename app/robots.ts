// Static robots.txt for the exported site.

import type { MetadataRoute } from 'next';
import { company } from '@/lib/site-data';
import { getSiteUrl } from '@/lib/seo';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl(company);
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    host: 'metallmontage33.ru',
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
