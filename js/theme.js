// Dark/light theme: localStorage, system preference, toggle icon, theme-color.
import { SELECTORS } from './shared.js';

// localStorage key for the chosen theme (kept in sync with the inline script in index.html).
const THEME_KEY = 'mm33-theme';

// meta theme-color values for light and dark.
const THEME_COLORS = {
  light: '#f4efe6',
  dark: '#111418',
};

// Moon SVG (shown in dark theme — switch to light).
const ICON_DARK =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

// Sun SVG (shown in light theme — switch to dark).
const ICON_LIGHT =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';

// OS theme from prefers-color-scheme.
function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark';
}

// Saved theme, or the system theme.
function getActiveTheme() {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    return stored === 'light' || stored === 'dark' ? stored : getSystemTheme();
  } catch {
    return getSystemTheme();
  }
}

// localStorage may be unavailable in private/restricted browser contexts.
function hasStoredTheme() {
  try {
    return Boolean(localStorage.getItem(THEME_KEY));
  } catch {
    return false;
  }
}

// Persist the choice; the applied theme still works if storage is blocked.
function storeTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // The applied theme still works for this page even when persistence is blocked.
  }
}

// Apply theme: data-theme on <html>, theme-color in meta,
// icon and aria-label on [data-theme-toggle].
function applyTheme(theme) {
  const html = document.documentElement;
  html.setAttribute('data-theme', theme);
  const metaThemes = document.querySelectorAll('meta[name="theme-color"]');
  metaThemes.forEach((meta) => {
    const media = meta.getAttribute('media') || '';
    if (media.includes('light')) {
      meta.content = THEME_COLORS.light;
    } else if (media.includes('dark')) {
      meta.content = THEME_COLORS.dark;
    } else if (!media) {
      meta.content = theme === 'light' ? THEME_COLORS.light : THEME_COLORS.dark;
    }
  });
  const btn = document.querySelector(SELECTORS.themeToggle);
  if (btn) {
    btn.innerHTML = theme === 'dark' ? ICON_DARK : ICON_LIGHT;
    btn.setAttribute(
      'aria-label',
      theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему',
    );
  }
}

// Init theme: apply, toggle, watch OS changes.
function initTheme() {
  applyTheme(getActiveTheme());

  const btn = document.querySelector(SELECTORS.themeToggle);
  if (!btn) return;

  btn.addEventListener('click', () => {
    const current =
      document.documentElement.getAttribute('data-theme') || getSystemTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    storeTheme(next);
    applyTheme(next);
  });

  window
    .matchMedia('(prefers-color-scheme: light)')
    .addEventListener('change', () => {
      if (!hasStoredTheme()) {
        applyTheme(getSystemTheme());
      }
    });
}

export { initTheme, THEME_COLORS };
