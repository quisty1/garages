// Sidebar author card shown under the article body.
import type { BlogAuthor } from '@/lib/blog';

export function BlogAuthor({ author }: { author: BlogAuthor }) {
  return (
    <aside className="blog-author" aria-label="Автор статьи">
      <div className="blog-author__label">Автор</div>
      <div className="blog-author__name">{author.name}</div>
      <p className="blog-author__text">
        Производство и монтаж металлических гаражей и навесов под ключ
      </p>
    </aside>
  );
}
