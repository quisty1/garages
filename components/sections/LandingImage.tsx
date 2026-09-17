import type { BlueprintSizes } from '@/lib/landing-pages';

export function LandingImage({
  src,
  alt,
  priority = false,
  blueprint,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  blueprint?: BlueprintSizes;
}) {
  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={blueprint ? undefined : 'landing-hero__image'}
      src={src}
      srcSet={`${src.replace('-1280.webp', '-640.webp')} 640w, ${src} 1280w`}
      sizes="(max-width: 760px) 92vw, 46vw"
      alt={alt}
      width={1280}
      height={853}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
    />
  );

  if (!blueprint) {
    return <figure className="landing-figure">{img}</figure>;
  }

  return (
    <figure className="landing-figure landing-figure--blueprint">
      <div className="hero-card" data-hero-card>
        <div className="hero-card__img">
          {img}
          <div className="hero-blueprint" aria-hidden="true">
            <span className="hero-blueprint__line hero-blueprint__line--width" />
            <span className="hero-blueprint__line hero-blueprint__line--height" />
            <span className="hero-blueprint__label hero-blueprint__label--width">
              {blueprint.width}
            </span>
            <span className="hero-blueprint__label hero-blueprint__label--height">
              {blueprint.height}
            </span>
            <span className="hero-blueprint__point hero-blueprint__point--a" />
            <span className="hero-blueprint__point hero-blueprint__point--b" />
          </div>
        </div>
      </div>
    </figure>
  );
}
