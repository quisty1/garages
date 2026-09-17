// Unit: patch-sw-precache updates NEXT_SHELL_FILES and CACHE_VERSION in out/sw.js.
import { mkdirSync, writeFileSync, readFileSync, rmSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';

type PatchResult = { buildHash: string; shellCount: number };

async function loadPatcher() {
  const mod = (await import('../../scripts/patch-sw-precache.mjs')) as {
    patchServiceWorker: (outDir: string) => PatchResult;
  };
  return mod.patchServiceWorker;
}

const SW_FIXTURE = `const CACHE_VERSION = 'v22-__BUILD_HASH__';
const NEXT_SHELL_FILES = [];
const PRECACHE_URLS = [
  './',
  'index.html',
  ...NEXT_SHELL_FILES,
].map((path) => path);
`;

describe('patchServiceWorker', () => {
  let outDir: string;
  let patchServiceWorker: (outDir: string) => PatchResult;

  beforeEach(async () => {
    patchServiceWorker = await loadPatcher();
    outDir = join(
      tmpdir(),
      `mm33-sw-patch-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    );
    mkdirSync(join(outDir, '_next', 'static', 'chunks'), { recursive: true });
    mkdirSync(join(outDir, '_next', 'static', 'css'), { recursive: true });
    writeFileSync(join(outDir, 'sw.js'), SW_FIXTURE);
  });

  afterEach(() => {
    rmSync(outDir, { recursive: true, force: true });
  });

  it('injects shell files into NEXT_SHELL_FILES and versions the cache', () => {
    writeFileSync(
      join(outDir, '_next', 'static', 'chunks', 'main-aaa.js'),
      'console.log(1)',
    );
    writeFileSync(join(outDir, '_next', 'static', 'css', 'app.css'), 'body{}');

    const first = patchServiceWorker(outDir);
    const patched = readFileSync(join(outDir, 'sw.js'), 'utf8');

    expect(first.shellCount).toBe(2);
    expect(patched).toMatch(/CACHE_VERSION = 'v22-[a-f0-9]{12}'/);
    expect(patched).toContain('_next/static/chunks/main-aaa.js');
    expect(patched).toContain('_next/static/css/app.css');
    expect(patched).toContain('...NEXT_SHELL_FILES');

    writeFileSync(
      join(outDir, '_next', 'static', 'chunks', 'main-bbb.js'),
      'console.log(2)',
    );
    const second = patchServiceWorker(outDir);
    expect(second.buildHash).not.toBe(first.buildHash);
    expect(second.shellCount).toBe(3);
  });

  it('refuses to patch when PRECACHE does not spread NEXT_SHELL_FILES', () => {
    writeFileSync(
      join(outDir, 'sw.js'),
      `const CACHE_VERSION = 'v22-__BUILD_HASH__';
const NEXT_SHELL_FILES = [];
const PRECACHE_URLS = ['./'].map((path) => path);
`,
    );
    writeFileSync(join(outDir, '_next', 'static', 'chunks', 'x.js'), '1');
    expect(() => patchServiceWorker(outDir)).toThrow(/spread NEXT_SHELL_FILES/);
  });
});
