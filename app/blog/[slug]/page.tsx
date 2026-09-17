// Individual blog post page: article body, related posts/landings, BlogPosting JSON-LD.
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageShell } from '@/components/layout/PageShell';
import { BlogArticleBody } from '@/components/blog/BlogArticleBody';
import { BlogAuthor } from '@/components/blog/BlogAuthor';
import { BlogRelated } from '@/components/blog/BlogRelated';
import { Lightbox } from '@/components/ui/Lightbox';
import {
  blogHref,
  blogIndexHref,
  blogPosts,
  formatBlogDate,
  getPost,
  linkedLandings,
  relatedPosts,
} from '@/lib/blog';
import { company } from '@/lib/site-data';
import { absUrl, buildJsonLd } from '@/lib/seo';

// Only pre-built post slugs; unknown paths 404 at build/runtime.
export const dynamicParams = false;

export function generateStaticParams() {
  return blogPosts.map(({ slug }) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

async function getPage(params: Props['params']) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  return post;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPage(params);
  const url = absUrl(company, blogHref(post));
  return {
    title: `${post.title} | Металл Монтаж 33`,
    description: post.description,
    authors: [{ name: post.author.name }],
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      locale: 'ru_RU',
      siteName: company.name,
      title: post.title,
      description: post.description,
      url,
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: [{ url: absUrl(company, post.cover.src), alt: post.cover.alt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [absUrl(company, post.cover.src)],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPage(params);
  const url = absUrl(company, blogHref(post));
  const home = absUrl(company, '/');
  const blogUrl = absUrl(company, blogIndexHref());
  const related = relatedPosts(post);
  const landings = linkedLandings(post);
  const graph = buildJsonLd(company)['@graph'].filter((node) =>
    ['HomeAndConstructionBusiness', 'WebSite'].includes(String(node['@type'])),
  );
  // BlogPosting + WebPage + BreadcrumbList for this article.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      ...graph,
      {
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        url,
        headline: post.title,
        description: post.description,
        datePublished: post.publishedAt,
        dateModified: post.publishedAt,
        inLanguage: 'ru-RU',
        image: absUrl(company, post.cover.src),
        author: {
          '@type': 'Organization',
          name: post.author.name,
          url: home,
        },
        publisher: { '@id': `${home}#organization` },
        mainEntityOfPage: { '@id': `${url}#webpage` },
        isPartOf: { '@id': `${blogUrl}#blog` },
      },
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: post.title,
        description: post.description,
        inLanguage: 'ru-RU',
        isPartOf: { '@id': `${home}#website` },
        breadcrumb: { '@id': `${url}#breadcrumbs` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumbs`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Главная', item: home },
          { '@type': 'ListItem', position: 2, name: 'Блог', item: blogUrl },
          { '@type': 'ListItem', position: 3, name: post.title, item: url },
        ],
      },
    ],
  };

  return (
    <PageShell
      jsonLd={jsonLd}
      effectsKey={post.slug}
      afterFooter={<Lightbox />}
    >
      <article data-blog-gallery>
        <section className="section blog-hero" id="main-content">
          <div className="container blog-article__header">
            <nav className="landing-breadcrumbs" aria-label="Хлебные крошки">
              <Link href="/">Главная</Link>
              <span aria-hidden="true">/</span>
              <Link href={blogIndexHref()}>Блог</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">Статья</span>
            </nav>
            <div className="section__eyebrow">
              <time dateTime={post.publishedAt}>
                {formatBlogDate(post.publishedAt)}
              </time>
              <span aria-hidden="true">·</span>
              <span>{post.author.name}</span>
            </div>
            <h1>{post.title}</h1>
            <p className="blog-hero__intro">{post.excerpt}</p>
            <figure className="blog-article__cover">
              <button
                className="slide__img"
                type="button"
                aria-label={`Открыть фото: ${post.cover.alt}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.cover.src}
                  data-full-src={post.cover.src}
                  alt={post.cover.alt}
                  width={1280}
                  height={853}
                  decoding="async"
                />
              </button>
            </figure>
          </div>
        </section>
        <section className="section">
          <div className="container blog-article__layout">
            <BlogArticleBody body={post.body} />
            <BlogAuthor author={post.author} />
          </div>
        </section>
      </article>
      <BlogRelated posts={related} landings={landings} />
    </PageShell>
  );
}
