// Image path and SEO alt helpers for carousels and projects.

export type SeoImageKind = 'garage' | 'canopy' | string;

export type CarouselSrcSet = {
  src: string;
  srcSet: string;
  sizes: string;
  width: number;
  height: number;
};

// Insert -560 before the file extension (keeps .webp / .jpg).
export function previewPath(source: string): string {
  return String(source || '').replace(/(\.[a-z0-9]+)$/i, '-560$1');
}

// Insert -960 before the file extension for medium project previews.
export function mediumPath(source: string): string {
  return String(source || '').replace(/(\.[a-z0-9]+)$/i, '-960$1');
}

// Responsive srcset: 560w preview + full-size candidate.
export function carouselSrcSet(
  img: string,
  sizes = '(max-width: 720px) 82vw, (max-width: 980px) 48vw, 520px',
  width = 680,
  height = 453,
): CarouselSrcSet {
  const source = String(img || '');
  const small = previewPath(source);
  const sourceWidth = Number(width) || 680;
  const sourceHeight = Number(height) || 453;
  return {
    src: source,
    srcSet: `${small} 560w, ${source} ${sourceWidth}w`,
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
