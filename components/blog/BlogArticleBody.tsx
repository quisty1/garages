// Renders BlogBlock[] (heading / paragraph / list / image) for a post body.
import type { BlogBlock } from '@/lib/blog';

export function BlogArticleBody({ body }: { body: BlogBlock[] }) {
  return (
    <div className="blog-article__body">
      {body.map((block, index) => {
        if (block.type === 'heading') {
          return <h2 key={index}>{block.text}</h2>;
        }
        if (block.type === 'paragraph') {
          return <p key={index}>{block.text}</p>;
        }
        if (block.type === 'list') {
          return (
            <ul key={index} className="side-list">
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        }
        return (
          <figure key={index} className="blog-article__figure">
            <button
              className="slide__img"
              type="button"
              aria-label={`Открыть фото: ${block.alt}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={block.src}
                data-full-src={block.src}
                alt={block.alt}
                width={1280}
                height={853}
                loading="lazy"
                decoding="async"
              />
            </button>
            {block.caption ? <figcaption>{block.caption}</figcaption> : null}
          </figure>
        );
      })}
    </div>
  );
}
