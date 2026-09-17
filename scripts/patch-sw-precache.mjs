// After `next export`, stamp CACHE_VERSION and inject hashed /_next shell URLs into out/sw.js.

import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { join, relative } from 'path';
import { createHash } from 'crypto';

const outDir = join(process.cwd(), 'out');
const swPath = join(outDir, 'sw.js');

if (!existsSync(swPath)) {
  console.warn('[patch-sw] out/sw.js missing — skip');
  process.exit(0);
}

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

// Collect JS/CSS under out/_next for network-first shell caching.
const nextFiles = walk(join(outDir, '_next'))
  .filter((file) => /\.(js|css)$/.test(file))
  .map((file) => relative(outDir, file).replace(/\\/g, '/'));

let source = readFileSync(swPath, 'utf8');
const marker = '/* __NEXT_SHELL__ */';
const buildHash = createHash('sha256')
  .update(nextFiles.join('\n'))
  .digest('hex')
  .slice(0, 12);

source = source.replace(
  /const CACHE_VERSION = 'v22-[^']+';/,
  `const CACHE_VERSION = 'v22-${buildHash}';`,
);

if (!source.includes(marker)) {
  source = source.replace(
    'const NETWORK_FIRST_URLS = new Set(',
    `${marker}\nconst NEXT_SHELL_FILES = ${JSON.stringify(nextFiles)};\nconst NETWORK_FIRST_URLS = new Set(`,
  );
  source = source.replace(
    '].map((path) => new URL(path, SCOPE_URL).href),\n);',
    `].map((path) => new URL(path, SCOPE_URL).href),\n);\nNEXT_SHELL_FILES.forEach((path) => NETWORK_FIRST_URLS.add(new URL(path, SCOPE_URL).href));`,
  );
  console.log(`[patch-sw] injected ${nextFiles.length} _next shell URLs`);
} else {
  console.log('[patch-sw] already patched');
}

writeFileSync(swPath, source);
console.log(`[patch-sw] cache version v22-${buildHash}`);
