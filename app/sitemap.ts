import { landingPages, landingHref } from '@/lib/landing-pages';
import { blogHref, blogIndexHref, getAllPosts } from '@/lib/blog';
import { aboutHref } from '@/lib/about';
// Static sitemap.xml — homepage, landings, blog, and about.

import type { MetadataRoute } from 'next';
import { company } from '@/lib/site-data';
import { absUrl, getSiteUrl, SITEMAP_IMAGES, SITEMAP_LASTMOD } from '@/lib/seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl(company);
  const posts = getAllPosts();
  return [
    ...landingPages.map((page) => ({
      url: absUrl(company, landingHref(page)),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      images: [absUrl(company, page.image), absUrl(company, page.detail.image)],
    })),
    {
      url: absUrl(company, '/catalog/'),
      changeFrequency: 'monthly' as const,
      priority: 0.85,
      images: [
        absUrl(company, company.garages[0].img),
        absUrl(company, company.canopies[0].img),
      ],
    },
    {
      url: absUrl(company, '/catalog/garazhi/'),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      images: [absUrl(company, company.garages[0].img)],
    },
    {
      url: absUrl(company, '/catalog/navesy/'),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      images: [absUrl(company, company.canopies[0].img)],
    },
    {
      url: absUrl(company, blogIndexHref()),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    ...posts.map((post) => ({
      url: absUrl(company, blogHref(post)),
      lastModified: post.publishedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
      images: [absUrl(company, post.cover.src)],
    })),
    {
      url: absUrl(company, aboutHref()),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${siteUrl}/`,
      lastModified: SITEMAP_LASTMOD,
      changeFrequency: 'monthly',
      priority: 1,
      images: SITEMAP_IMAGES.map((path) => absUrl(company, path)),
    },
  ];
}
