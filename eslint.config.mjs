// ESLint flat config based on Next.js core-web-vitals + TypeScript presets.

import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const eslintConfig = [
  ...nextVitals,
  ...nextTypescript,
  {
    ignores: [
      'out/**',
      '.next/**',
      'node_modules/**',
      'public/sw.js',
      'scripts/**',
      'tests/visual/**',
      'next-env.d.ts',
    ],
  },
];

export default eslintConfig;
