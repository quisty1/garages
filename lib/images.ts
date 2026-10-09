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
  src: '/assets/garage-project-8-8-v2-display-560.webp',
  srcSet:
    '/assets/garage-project-8-8-v2-display-560.webp 560w, /assets/garage-project-8-8-v2-display-960.webp 960w, /assets/garage-project-8-8-v2-display-1672.webp 1672w',
  sizes: '(max-width: 1120px) 92vw, 52vw',
  width: 1672,
  height: 941,
  type: 'image/webp' as const,
  preloadHref: '/assets/garage-project-8-8-v2-display-960.webp',
};

// Insert -560 before the file extension (keeps .webp / .jpg).
export function previewPath(source: string): string {
  return String(source || '').replace(/(\.[a-z0-9]+)$/i, '-560$1');
}

// Insert -960 before the file extension for medium project previews.
export function mediumPath(source: string): string {
  return String(source || '').replace(/(\.[a-z0-9]+)$/i, '-960$1');
}

export function landingSrcSet(source: string): string {
  const base = source.replace('-1280.webp', '');
  return [640, 768, 960, 1280]
    .map((width) => `${base}-display-${width}.webp ${width}w`)
    .join(', ');
}

export function projectSrcSet(source: string, width: number): string {
  const base = source.replace(/\.webp$/, '');
  return [560, 960, width]
    .map((size) => `${base}-display-${size}.webp ${size}w`)
    .join(', ');
}

// Catalog display variants; the original remains available for the lightbox.
export function carouselSrcSet(
  img: string,
  sizes = '(max-width: 720px) 82vw, (max-width: 980px) 48vw, 520px',
  width = 1536,
  height = 1024,
): CarouselSrcSet {
  const source = String(img || '');
  const sourceWidth = Number(width) || 1536;
  const sourceHeight = Number(height) || 1024;
  return {
    src: source,
    srcSet: [560, 768, 1024, sourceWidth]
      .map(
        (size) =>
          `${source.replace(/\.webp$/, '')}-display-${size}.webp ${size}w`,
      )
      .join(', '),
    sizes,
    width: sourceWidth,
    height: sourceHeight,
  };
}

export function seoImageAlt(title: string, kind: SeoImageKind): string {
  const lower = String(title || 'объект').toLowerCase();
  if (kind === 'garage') {
    if (/сэндвич[ -]панел/.test(lower)) {
      return `Металлический ${lower} на сварном каркасе — Металл Монтаж 33`;
    }
    return `Металлический ${lower} из сэндвич-панелей на сварном каркасе — Металл Монтаж 33`;
  }
  return `Металлический ${lower} под ключ — Металл Монтаж 33`;
}
