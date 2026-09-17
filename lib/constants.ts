// Theme, carousel, menu, analytics, and UI timing constants.

export const THEME_KEY = 'mm33-theme';

// theme-color meta values for light / dark browser chrome.
export const THEME_COLORS = {
  light: '#f6f7f9',
  dark: '#111418',
} as const;

export const CAROUSEL_NAMES = ['garages', 'canopies'] as const;

// Matches the CSS breakpoint where the header collapses into a drawer.
export const MOBILE_MENU_QUERY = '(max-width: 1360px)';

export const SCROLL_TOP_THRESHOLD = 320;

// Must match the lightbox close CSS transition duration.
export const LIGHTBOX_CLOSE_MS = 260;

// Yandex Metrika reachGoal names used across CTAs and conversion links.
export const GOAL = {
  cta_calculate: 'cta_calculate',
  cta_contact: 'cta_contact',
  phone_click: 'phone_click',
  email_click: 'email_click',
  messenger_click: 'messenger_click',
  map_click: 'map_click',
  contact_copy: 'contact_copy',
  calculator_start: 'calculator_start',
  calculator_complete: 'calculator_complete',
} as const;

export type AnalyticsGoal = (typeof GOAL)[keyof typeof GOAL];

// Ordered list of conversion goal ids (kept for tests and docs).
export const ANALYTICS_GOALS: readonly AnalyticsGoal[] = [
  GOAL.cta_calculate,
  GOAL.cta_contact,
  GOAL.phone_click,
  GOAL.email_click,
  GOAL.messenger_click,
  GOAL.map_click,
  GOAL.contact_copy,
  GOAL.calculator_start,
  GOAL.calculator_complete,
];
