// Focus-trap and inert helpers for client overlays (lightbox, mobile menu).

export const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function getFocusable(container: Element | null): HTMLElement[] {
  if (!container) return [];
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter(
    (element) =>
      !element.hidden &&
      !element.closest('[hidden]') &&
      element.getAttribute('aria-hidden') !== 'true',
  );
}

// Mark landmark chrome as inert so assistive tech stays inside the overlay.
export function setPageInert(inert: boolean): void {
  document
    .querySelectorAll<HTMLElement>(
      '.skip-link, header, main, footer, .scroll-top',
    )
    .forEach((element) => {
      element.inert = inert;
    });
}

// Keep the menu toggle + nav interactive while inerting the rest of the header.
export function setMenuBackgroundInert(
  inert: boolean,
  header: HTMLElement | null,
  toggle: HTMLElement | null,
  nav: HTMLElement | null,
): void {
  document
    .querySelectorAll<HTMLElement>('.skip-link, main, footer, .scroll-top')
    .forEach((element) => {
      element.inert = inert;
    });

  header
    ?.querySelectorAll<HTMLElement>('.header-inner > *')
    .forEach((element) => {
      if (element !== toggle && element !== nav) element.inert = inert;
    });
}
