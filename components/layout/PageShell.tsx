// Shared page chrome: JSON-LD, skip link, header/footer, scroll-top, client effects.

import type { ReactNode } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  ClientEffects,
  ScrollTopButton,
} from '@/components/effects/ClientEffects';

interface PageShellProps {
  children: ReactNode;
  /** Optional content before the skip link (e.g. LCP preload). */
  before?: ReactNode;
  /** Structured data object; rendered as a JSON-LD script tag. */
  jsonLd?: unknown;
  /** Optional `id` on the JSON-LD script (home page uses `json-ld`). */
  jsonLdId?: string;
  skipHref?: string;
  skipLabel?: string;
  /** Extra nodes after Footer / before ClientEffects (e.g. Lightbox). */
  afterFooter?: ReactNode;
  /** Passed to ClientEffects when the page needs remount on navigation. */
  effectsKey?: string;
}

export function PageShell({
  children,
  before,
  jsonLd,
  jsonLdId,
  skipHref = '#main-content',
  skipLabel = 'Перейти к содержимому',
  afterFooter,
  effectsKey,
}: PageShellProps) {
  return (
    <>
      {before}
      {jsonLd != null ? (
        <script
          id={jsonLdId}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
          }}
        />
      ) : null}
      <a className="skip-link" href={skipHref}>
        {skipLabel}
      </a>
      <Header />
      <main id="top">{children}</main>
      <Footer />
      <ScrollTopButton />
      {afterFooter}
      <ClientEffects key={effectsKey} />
    </>
  );
}
