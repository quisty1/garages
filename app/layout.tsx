// Root layout: global CSS, SEO metadata, theme boot script, and JSON-LD.

import type { Metadata, Viewport } from 'next';
import { company } from '@/lib/site-data';
import { absUrl, buildGeoPlacename, getSiteUrl } from '@/lib/seo';
import '@/styles/tokens.css';
import '@/styles/base.css';
import '@/styles/header.css';
import '@/styles/hero.css';
import '@/styles/sections.css';
import '@/styles/calculator.css';
import '@/styles/gallery.css';
import '@/styles/workflow-faq.css';
import '@/styles/contact.css';
import '@/styles/overlays.css';
import '@/styles/interactions.css';
import '@/styles/landing.css';

const siteUrl = getSiteUrl(company);
const pageUrl = `${siteUrl}/`;
const ogImage = absUrl(company, company.seo.ogImage);
const placename = buildGeoPlacename(company);

export const metadata: Metadata = {
  metadataBase: new URL(pageUrl),
  title: company.seo.title,
  description: company.seo.description,
  keywords: company.seo.keywords,
  authors: [{ name: company.name }],
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
  },
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    type: 'website',
    siteName: company.name,
    title: company.seo.title,
    description: company.seo.description,
    locale: 'ru_RU',
    url: pageUrl,
    images: [
      {
        url: ogImage,
        width: company.seo.ogImageWidth,
        height: company.seo.ogImageHeight,
        type: 'image/webp',
        alt: `${company.name} — гаражи и навесы под ключ`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: company.seo.title,
    description: company.seo.description,
    images: [ogImage],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/assets/favicon-48.png', type: 'image/png', sizes: '48x48' },
      { url: '/assets/favicon-96.png', type: 'image/png', sizes: '96x96' },
      { url: '/assets/icon-512.png', type: 'image/png', sizes: '512x512' },
      { url: '/assets/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/assets/apple-touch-icon.png', sizes: '180x180' }],
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
  other: {
    'geo.region': company.seo.region,
    'geo.placename': placename,
    'geo.position': `${company.address.latitude};${company.address.longitude}`,
    ICBM: `${company.address.latitude}, ${company.address.longitude}`,
    'format-detection': 'telephone=yes',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'dark light',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#111418' },
    { media: '(prefers-color-scheme: light)', color: '#f6f7f9' },
  ],
};

// Inline boot: mark JS, apply stored/system theme before paint to avoid flash.
const themeBootScript = `(function(){var root=document.documentElement;var saved=null;root.classList.add('js');window.setTimeout(function(){if(!root.classList.contains('js-ready')){root.classList.remove('js');}},5000);try{saved=localStorage.getItem('mm33-theme');}catch(e){saved=null;}var theme=saved==='light'||saved==='dark'?saved:(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');root.setAttribute('data-theme',theme);})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <link
          rel="sitemap"
          type="application/xml"
          title="Sitemap"
          href={`${siteUrl}/sitemap.xml`}
        />

        <meta
          name="twitter:image:alt"
          content={`${company.name} — гаражи и навесы под ключ`}
        />
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
