'use client';

// Full-screen image lightbox opened from carousel / project slide buttons.

import { useEffect, useRef, useState } from 'react';
import { LIGHTBOX_CLOSE_MS } from '@/lib/constants';
import { getFocusable, setPageInert } from '@/lib/focus';

interface LightboxItem {
  src: string;
  alt: string;
}

export function Lightbox() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [items, setItems] = useState<LightboxItem[]>([]);
  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  // Keep the DOM mounted briefly after close so the CSS exit transition can run.
  const [visible, setVisible] = useState(false);
  const openerRef = useRef<HTMLElement | null>(null);

  const show = items[index];

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const slideImg = (e.target as Element).closest('.slide__img');
      if (!slideImg) return;
      const image = slideImg.querySelector('img');
      if (!image) return;
      e.preventDefault();

      // Group images from the same carousel, projects, or composition list.
      const group =
        slideImg.closest('[data-carousel]') ||
        slideImg.closest('[data-garage-projects]') ||
        slideImg.closest('[data-composition]');
      const images = group
        ? Array.from(
            group.querySelectorAll<HTMLImageElement>('.slide__img img'),
          )
        : [image];
      const startIndex = Math.max(0, images.indexOf(image));

      openerRef.current = slideImg as HTMLElement;
      setItems(
        images.map((el) => ({
          src: el.dataset.fullSrc || el.src,
          alt: el.alt,
        })),
      );
      setIndex(startIndex);
      setVisible(true);
      setIsOpen(true);
      document.body.classList.add('lightbox-open');
      setPageInert(true);
      requestAnimationFrame(() => closeBtnRef.current?.focus());
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setIndex((current) => Math.max(0, current - 1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setIndex((current) => Math.min(items.length - 1, current + 1));
      } else if (e.key === 'Tab') {
        // Trap focus inside the dialog while open.
        const overlay = overlayRef.current;
        if (!overlay) return;
        const focusable = getFocusable(overlay);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, items.length]);

  function close() {
    if (!isOpen) return;
    setIsOpen(false);
    document.body.classList.remove('lightbox-open');
    setPageInert(false);
    openerRef.current?.focus?.();
    openerRef.current = null;
    window.setTimeout(() => {
      setVisible(false);
      setItems([]);
      setIndex(0);
    }, LIGHTBOX_CLOSE_MS);
  }

  if (!visible) return null;

  const hasMany = items.length > 1;

  return (
    <div
      ref={overlayRef}
      className={`lightbox${isOpen ? ' is-open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-hidden={isOpen ? 'false' : 'true'}
      aria-label="Просмотр изображения"
      aria-describedby="lightbox-caption"
      onClick={(e) => {
        if (e.target === overlayRef.current) close();
      }}
    >
      <button
        ref={closeBtnRef}
        className="lightbox__close"
        type="button"
        aria-label="Закрыть просмотр"
        onClick={close}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      <button
        className="lightbox__nav lightbox__nav--prev"
        type="button"
        aria-label="Предыдущее фото"
        hidden={!hasMany}
        disabled={index <= 0}
        onClick={(e) => {
          e.stopPropagation();
          setIndex((current) => Math.max(0, current - 1));
        }}
      >
        ←
      </button>
      <button
        className="lightbox__nav lightbox__nav--next"
        type="button"
        aria-label="Следующее фото"
        hidden={!hasMany}
        disabled={index >= items.length - 1}
        onClick={(e) => {
          e.stopPropagation();
          setIndex((current) => Math.min(items.length - 1, current + 1));
        }}
      >
        →
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="lightbox__img"
        src={show?.src}
        alt={show?.alt || ''}
        onClick={(e) => e.stopPropagation()}
      />
      <div
        className="lightbox__caption"
        id="lightbox-caption"
        aria-live="polite"
      >
        {show
          ? hasMany
            ? `${show.alt} · ${index + 1} / ${items.length}`
            : show.alt
          : ''}
      </div>
    </div>
  );
}
