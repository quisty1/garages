// Vitest + React Testing Library for unit and component tests.

import path from 'path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    environmentOptions: {
      jsdom: { url: 'https://metallmontage33.ru/' },
    },
    setupFiles: ['./tests/setup.ts'],
    include: [
      'tests/unit/**/*.{test,spec}.{ts,tsx}',
      'tests/components/**/*.{test,spec}.{ts,tsx}',
    ],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
      include: [
        'components/layout/{MobileNav,ThemeToggle}.tsx',
        'components/sections/{Calculator,ContactCopy,Faq}.tsx',
        'components/ui/Carousel.tsx',
        'lib/{analytics,calculator,focus,format,images,seo}.ts',
        'scripts/patch-sw-precache.mjs',
      ],
      thresholds: {
        statements: 80,
        branches: 60,
        functions: 80,
        lines: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, '.'),
    },
  },
});
