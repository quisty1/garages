'use client';

// Brand logo link: always land at the top of home, including same-route clicks.

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

type BrandLinkProps = {
  children: ReactNode;
};

export function BrandLink({ children }: BrandLinkProps) {
  const pathname = usePathname();

  return (
    <Link
      className="brand__link"
      href="/"
      onClick={(e) => {
        const onHome = pathname === '/' || pathname === '';
        if (!onHome) return;
        e.preventDefault();
        if (window.location.hash) {
          window.history.replaceState(null, '', '/');
        }
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }}
    >
      {children}
    </Link>
  );
}
