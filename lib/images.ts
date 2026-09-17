// Image path and SEO alt helpers for carousels and projects.

export type SeoImageKind = 'garage' | 'canopy' | string;

export type CarouselSrcSet = {
  src: string;
  srcSet: string;
  sizes: string;
  width: number;
  height: number;
};

/** Shared LCP hero image — keep preload and <img> in sync. */
export const heroProjectImage = {
  src: '/assets/garage-project-8-8-v2-560.webp',
  srcSet:
    '/assets/garage-project-8-8-v2-560.webp 560w, /assets/garage-project-8-8-v2-960.webp 960w, /assets/garage-project-8-8-v2.webp 1672w',
  sizes: '(max-width: 1120px) 92vw, 52vw',
  width: 1672,
  height: 941,
  type: 'image/webp' as const,
  preloadHref: '/assets/garage-project-8-8-v2-960.webp',
};

// Insert -560 before the file extension (keeps .webp / .jpg).
export function previewPath(source: string): string {
  return String(source || '').replace(/(\.[a-z0-9]+)$/i, '-560$1');
}

// Insert -960 before the file extension for medium project previews.
export function mediumPath(source: string): string {
  return String(source || '').replace(/(\.[a-z0-9]+)$/i, '-960$1');
}

// Catalog photos have 560, 1024 and 1536 pixel variants.
export function carouselSrcSet(
  img: string,
  sizes = '(max-width: 720px) 82vw, (max-width: 980px) 48vw, 520px',
  width = 1536,
  height = 1024,
): CarouselSrcSet {
  const source = String(img || '');
  const small = previewPath(source);
  const medium = source.replace(/(\.[a-z0-9]+)$/i, '-1024$1');
  const sourceWidth = Number(width) || 1536;
  const sourceHeight = Number(height) || 1024;
  return {
    src: source,
    srcSet: `${small} 560w, ${medium} 1024w, ${source} ${sourceWidth}w`,
    sizes,
    width: sourceWidth,
    height: sourceHeight,
  };
}

export function seoImageAlt(title: string, kind: SeoImageKind): string {
  const lower = String(title || 'объект').toLowerCase();
  if (kind === 'garage') {
    return `Металлический ${lower} из сэндвич-панелей на сварном каркасе — Металл Монтаж 33`;
  }
  return `Металлический ${lower} под ключ — Металл Монтаж 33`;
}
