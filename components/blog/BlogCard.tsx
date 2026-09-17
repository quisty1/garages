// Blog index card: cover, date, title, and excerpt linking to the post.
import Link from 'next/link';
import { blogHref, formatBlogDate, type BlogPost } from '@/lib/blog';

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link className="blog-card" href={blogHref(post)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="blog-card__image"
        src={post.cover.src}
        alt={post.cover.alt}
        width={640}
        height={427}
        loading="lazy"
        decoding="async"
      />
      <div className="blog-card__body">
        <time className="blog-card__date" dateTime={post.publishedAt}>
          {formatBlogDate(post.publishedAt)}
        </time>
        <h2 className="blog-card__title">{post.title}</h2>
        <p className="blog-card__excerpt">{post.excerpt}</p>
        <span className="blog-card__more">Читать статью →</span>
      </div>
    </Link>
  );
}
