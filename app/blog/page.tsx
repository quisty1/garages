// Blog index: lists all posts from lib/blog with Blog + BreadcrumbList JSON-LD.
import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell } from '@/components/layout/PageShell';
import { BlogCard } from '@/components/blog/BlogCard';
import { getAllPosts, blogIndexHref } from '@/lib/blog';
import { company } from '@/lib/site-data';
import { absUrl, buildJsonLd } from '@/lib/seo';

const title = 'Блог о гаражах и навесах | Металл Монтаж 33';
const description =
  'Статьи Металл Монтаж 33: как выбрать металлический гараж, сэндвич-панели и навес. Практические советы по размерам, комплектации и монтажу.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absUrl(company, blogIndexHref()) },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: company.name,
    title,
    description,
    url: absUrl(company, blogIndexHref()),
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const url = absUrl(company, blogIndexHref());
  const home = absUrl(company, '/');
  const graph = buildJsonLd(company)['@graph'].filter((node) =>
    ['HomeAndConstructionBusiness', 'WebSite'].includes(String(node['@type'])),
  );
  // Blog listing entity plus breadcrumbs; each post summarized under blogPost.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      ...graph,
      {
        '@type': 'Blog',
        '@id': `${url}#blog`,
        url,
        name: title,
        description,
        inLanguage: 'ru-RU',
        publisher: { '@id': `${home}#organization` },
        blogPost: posts.map((post) => ({
          '@type': 'BlogPosting',
          headline: post.title,
          url: absUrl(company, `/blog/${post.slug}/`),
          datePublished: post.publishedAt,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumbs`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Главная', item: home },
          { '@type': 'ListItem', position: 2, name: 'Блог', item: url },
        ],
      },
    ],
  };

  return (
    <PageShell jsonLd={jsonLd} effectsKey="blog-index">
      <section className="section blog-hero" id="main-content">
        <div className="container">
          <nav className="landing-breadcrumbs" aria-label="Хлебные крошки">
            <Link href="/">Главная</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Блог</span>
          </nav>
          <div className="section__eyebrow">Полезные материалы</div>
          <h1>Блог Металл Монтаж 33</h1>
          <p className="blog-hero__intro">
            Разбираем выбор гаража и навеса: размеры, каркас, панели и
            комплектацию — на примерах реальных задач владельцев участков.
          </p>
        </div>
      </section>
      <section className="section section--muted">
        <div className="container blog-grid">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
