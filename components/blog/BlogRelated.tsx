// Related posts and linked SEO landings under a blog article.
import Link from 'next/link';
import { blogHref, type BlogPost } from '@/lib/blog';
import { landingHref, type LandingPage } from '@/lib/landing-pages';

export function BlogRelated({
  posts,
  landings,
}: {
  posts: BlogPost[];
  landings: LandingPage[];
}) {
  return (
    <section className="section section--muted" aria-labelledby="blog-related">
      <div className="container">
        <div className="section__eyebrow">Читайте также</div>
        <h2 className="section__title" id="blog-related">
          Связанные статьи и решения
        </h2>
        <div className="blog-related">
          {posts.map((post) => (
            <Link
              className="blog-related__item"
              href={blogHref(post)}
              key={post.slug}
            >
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <span>К статье →</span>
            </Link>
          ))}
          {landings.map((page) => (
            <Link
              className="blog-related__item"
              href={landingHref(page)}
              key={page.slug}
            >
              <h3>{page.label}</h3>
              <p>{page.intro}</p>
              <span>К решению →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
