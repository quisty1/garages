// ESLint flat config based on Next.js core-web-vitals + TypeScript presets.

import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  prettier,
  globalIgnores([
    'out/**',
    '.next/**',
    'node_modules/**',
    'public/sw.js',
    'next-env.d.ts',
  ]),
]);
