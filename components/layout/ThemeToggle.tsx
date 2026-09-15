'use client';

// Light/dark theme toggle with localStorage preference and system fallback.

import { useEffect } from 'react';
import { THEME_COLORS, THEME_KEY } from '@/lib/constants';
import type { ThemeMode } from '@/lib/types';

const ICON_DARK = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const ICON_LIGHT = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

function getSystemTheme(): ThemeMode {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function readStoredTheme(): ThemeMode | null {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    return stored === 'light' || stored === 'dark' ? stored : null;
  } catch {
    return null;
  }
}

function applyTheme(theme: ThemeMode) {
  document.documentElement.setAttribute('data-theme', theme);
  document.querySelector<HTMLElement>('[data-theme-toggle]')?.setAttribute(
    'aria-label',
    theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему',
  );
  // Keep matching theme-color metas in sync for browser chrome.
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
    const media = meta.getAttribute('media') || '';
    if (media.includes('light')) {
      meta.setAttribute('content', THEME_COLORS.light);
    } else if (media.includes('dark')) {
      meta.setAttribute('content', THEME_COLORS.dark);
    } else if (!media) {
      meta.setAttribute(
        'content',
        theme === 'light' ? THEME_COLORS.light : THEME_COLORS.dark,
      );
    }
  });
}

export function ThemeToggle() {
  useEffect(() => {
    const active = readStoredTheme() ?? getSystemTheme();
    applyTheme(active);

    // Follow OS preference only when the user has not picked an explicit theme.
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = () => {
      if (!readStoredTheme()) {
        const next = getSystemTheme();
        applyTheme(next);
      }
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label="Переключить цветовую тему"
      data-theme-toggle
      onClick={() => {
        const current: ThemeMode =
          document.documentElement.getAttribute('data-theme') === 'light'
            ? 'light'
            : 'dark';
        const next: ThemeMode = current === 'dark' ? 'light' : 'dark';
        try {
          localStorage.setItem(THEME_KEY, next);
        } catch {
          // persistence may be blocked
        }
        applyTheme(next);
      }}
    >
      <span className="theme-toggle__icon theme-toggle__icon--dark">
        {ICON_DARK}
      </span>
      <span className="theme-toggle__icon theme-toggle__icon--light">
        {ICON_LIGHT}
      </span>
    </button>
  );
}
