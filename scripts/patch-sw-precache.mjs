// After `next export`, stamp CACHE_VERSION and inject hashed /_next shell URLs into out/sw.js
// so install() precaches HTML + required JS/CSS for offline reloads.

import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { join, relative } from 'path';
import { createHash } from 'crypto';
import { pathToFileURL } from 'url';

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

/**
 * Patch a built `sw.js` inside `outDir` so NEXT_SHELL_FILES lists every JS/CSS
 * under `_next` and CACHE_VERSION reflects that list.
 * @param {string} outDir
 * @returns {{ buildHash: string, shellCount: number }}
 */
export function patchServiceWorker(outDir) {
  const swPath = join(outDir, 'sw.js');

  if (!existsSync(swPath)) {
    throw new Error(`[patch-sw] ${swPath} missing`);
  }

  const nextRoot = join(outDir, '_next');
  if (!existsSync(nextRoot)) {
    throw new Error(`[patch-sw] ${nextRoot} missing`);
  }

  const nextFiles = walk(nextRoot)
    .filter((file) => /\.(js|css)$/.test(file))
    .map((file) => relative(outDir, file).replace(/\\/g, '/'))
    .sort();

  if (nextFiles.length === 0) {
    throw new Error('[patch-sw] no JS/CSS found under out/_next');
  }

  let source = readFileSync(swPath, 'utf8');
  const buildHash = createHash('sha256')
    .update(nextFiles.join('\n'))
    .digest('hex')
    .slice(0, 12);

  source = source.replace(
    /const CACHE_VERSION = 'v22-[^']+';/,
    `const CACHE_VERSION = 'v22-${buildHash}';`,
  );

  const shellLiteral = `const NEXT_SHELL_FILES = ${JSON.stringify(nextFiles)};`;
  if (!/const NEXT_SHELL_FILES = \[[\s\S]*?\];/.test(source)) {
    throw new Error('[patch-sw] NEXT_SHELL_FILES placeholder missing in sw.js');
  }
  source = source.replace(
    /const NEXT_SHELL_FILES = \[[\s\S]*?\];/,
    shellLiteral,
  );

  if (!source.includes('...NEXT_SHELL_FILES')) {
    throw new Error(
      '[patch-sw] PRECACHE_URLS must spread NEXT_SHELL_FILES — refusing to ship a broken SW',
    );
  }

  writeFileSync(swPath, source);
  return { buildHash, shellCount: nextFiles.length };
}

const isMain =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  const outDir = join(process.cwd(), 'out');
  if (!existsSync(join(outDir, 'sw.js'))) {
    console.warn('[patch-sw] out/sw.js missing — skip');
    process.exit(0);
  }

  try {
    const { buildHash, shellCount } = patchServiceWorker(outDir);
    console.log(
      `[patch-sw] precache shell: ${shellCount} _next files, cache v22-${buildHash}`,
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
