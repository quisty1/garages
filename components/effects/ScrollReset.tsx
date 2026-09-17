'use client';

// Scroll to top on push navigations; let the browser restore on refresh/Back/Forward.

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function ScrollReset() {
  const pathname = usePathname();
  const isPopNavigation = useRef(false);
  const prevPathname = useRef<string | null>(null);

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'auto';
    }

    const onPopState = () => {
      isPopNavigation.current = true;
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    const prev = prevPathname.current;
    prevPathname.current = pathname;
    // Initial load / refresh / Strict Mode remount: keep browser scroll.
    if (prev === null || prev === pathname) return;
    if (isPopNavigation.current) {
      isPopNavigation.current = false;
      return;
    }
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
