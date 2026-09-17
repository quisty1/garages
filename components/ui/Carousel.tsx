'use client';

// Horizontal catalog carousel with scroll-synced prev/next controls.

import { useEffect, useRef } from 'react';
import { carouselSrcSet, seoImageAlt } from '@/lib/images';

export type Slide = {
  title: string;
  size?: string;
  meta?: string;
  img: string;
};

interface CarouselProps {
  name: string;
  label: string;
  slides: Slide[];
  kind: 'garage' | 'canopy';
}

export function Carousel({ name, label, slides, kind }: CarouselProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  // Canopy slides are photo-first; garage slides show size/meta body text.
  const photoOnly = kind === 'canopy';

  useEffect(() => {
    const carousel = rootRef.current;
    if (!carousel) return;
    const prevBtn = carousel.querySelector<HTMLButtonElement>(
      '[data-carousel-prev]',
    );
    const nextBtn = carousel.querySelector<HTMLButtonElement>(
      '[data-carousel-next]',
    );
    const viewport = carousel.querySelector<HTMLElement>(
      '[data-carousel-viewport]',
    );
    const slideEls = Array.from(
      carousel.querySelectorAll<HTMLElement>('.slide'),
    );
    if (!viewport || !slideEls.length) return;

    let activeIndex = 0;
    let updateFrame = 0;

    function updateControls() {
      // Small tolerance so subpixel scroll positions don't leave buttons stuck.
      const tolerance = 2;
      const maxScrollLeft = Math.max(
        0,
        viewport!.scrollWidth - viewport!.clientWidth,
      );
      if (prevBtn) prevBtn.disabled = viewport!.scrollLeft <= tolerance;
      if (nextBtn) {
        nextBtn.disabled = viewport!.scrollLeft >= maxScrollLeft - tolerance;
      }
    }

    // Pick the slide whose left edge is closest to the viewport origin.
    function syncActiveIndex() {
      updateFrame = 0;
      const viewportLeft = viewport!.getBoundingClientRect().left;
      let closestDistance = Number.POSITIVE_INFINITY;
      slideEls.forEach((slide, index) => {
        const distance = Math.abs(
          slide.getBoundingClientRect().left - viewportLeft,
        );
        if (distance < closestDistance) {
          closestDistance = distance;
          activeIndex = index;
        }
      });
      updateControls();
    }

    function scheduleSync() {
      if (!updateFrame) updateFrame = requestAnimationFrame(syncActiveIndex);
    }

    function goTo(index: number) {
      activeIndex = Math.max(0, Math.min(slideEls.length - 1, index));
      slideEls[activeIndex].scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
        inline: 'start',
        block: 'nearest',
      });
      updateControls();
    }

    const onPrev = () => goTo(activeIndex - 1);
    const onNext = () => goTo(activeIndex + 1);
    prevBtn?.addEventListener('click', onPrev);
    nextBtn?.addEventListener('click', onNext);
    viewport.addEventListener('scroll', scheduleSync, { passive: true });
    window.addEventListener('resize', scheduleSync, { passive: true });
    updateControls();

    return () => {
      prevBtn?.removeEventListener('click', onPrev);
      nextBtn?.removeEventListener('click', onNext);
      viewport.removeEventListener('scroll', scheduleSync);
      window.removeEventListener('resize', scheduleSync);
      if (updateFrame) cancelAnimationFrame(updateFrame);
    };
  }, [slides]);

  return (
    <div
      ref={rootRef}
      className="carousel"
      data-carousel={name}
      aria-label={label}
    >
      <button
        className="carousel__btn"
        type="button"
        data-carousel-prev
        aria-label="Предыдущий слайд"
      >
        ←
      </button>

      <div className="carousel__viewport" data-carousel-viewport tabIndex={0}>
        <div className="carousel__track" data-carousel-track>
          {slides.map((slide) => {
            const img = carouselSrcSet(slide.img);
            const alt = seoImageAlt(slide.title, kind);
            return (
              <article
                key={slide.title}
                className={`slide${photoOnly ? ' slide--photo' : ''}`}
              >
                <button
                  className={`slide__img${photoOnly ? ' slide__img--tall' : ''}`}
                  type="button"
                  aria-label={`Открыть фото: ${alt}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.src}
                    data-full-src={img.src}
                    srcSet={img.srcSet}
                    sizes={img.sizes}
                    alt={alt}
                    width={img.width}
                    height={img.height}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="slide__badge">
                    {kind === 'garage' ? 'сварной каркас' : 'навес под ключ'}
                  </span>
                </button>
                <div className="slide__body">
                  <div className="slide__kicker">
                    {kind === 'garage'
                      ? 'типовой размер'
                      : 'металлоконструкция'}
                  </div>
                  <div className="slide__title">{slide.title}</div>
                  {slide.size ? (
                    <p className="slide__size">{slide.size}</p>
                  ) : null}
                  {slide.meta ? (
                    <p className="slide__meta">{slide.meta}</p>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <button
        className="carousel__btn"
        type="button"
        data-carousel-next
        aria-label="Следующий слайд"
      >
        →
      </button>
    </div>
  );
}
