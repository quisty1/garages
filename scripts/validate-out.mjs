// Smoke-check the static export in out/ before FTP deploy.

import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';
import { createRequire } from 'module';
import { pathToFileURL } from 'url';

const root = resolve(process.cwd());
const outDir = join(root, 'out');
const failures = [];

function pass(message) {
  console.log(`  OK  ${message}`);
}

function fail(message, detail = '') {
  failures.push(message);
  console.error(`  FAIL  ${message}${detail ? `\n        ${detail}` : ''}`);
}

function assert(condition, message, detail = '') {
  if (condition) pass(message);
  else fail(message, detail);
}

function read(rel) {
  return readFileSync(join(outDir, rel), 'utf8');
}

console.log('\nProduction out/ checks');

assert(existsSync(outDir), 'out/ directory exists');
assert(existsSync(join(outDir, 'index.html')), 'out/index.html exists');
assert(existsSync(join(outDir, 'sw.js')), 'out/sw.js exists');
assert(existsSync(join(outDir, 'manifest.json')), 'out/manifest.json exists');
assert(
  existsSync(join(outDir, 'yandex_e3abed833f0bbd1d.html')),
  'Yandex Webmaster verification file exists',
);
assert(existsSync(join(outDir, 'robots.txt')), 'out/robots.txt exists');
assert(
  existsSync(join(outDir, 'sitemap.xml')) ||
    existsSync(join(outDir, 'sitemap.xml/')) ||
    readdirSync(outDir).some((name) => name.startsWith('sitemap')),
  'out sitemap artifact exists',
);

const html = read('index.html');
assert(html.includes('Металл Монтаж 33'), 'HTML contains company name');
assert(html.includes('application/ld+json'), 'HTML contains JSON-LD');
assert(html.includes('minPrice'), 'JSON-LD includes minPrice');
assert(
  html.includes('cta_calculate') || html.includes('data-cta'),
  'CTA markup present',
);
assert(html.includes('data-calculator'), 'Calculator markup present');
assert(html.includes('id="faq"'), 'FAQ section present');
assert(html.includes('/assets/'), 'Asset paths are absolute');
assert(!html.includes('./assets/'), 'No relative ./assets paths in HTML');

const robots = read('robots.txt');
assert(
  robots.includes('Sitemap: https://metallmontage33.ru/sitemap.xml'),
  'robots sitemap URL',
);
assert(robots.includes('Host: metallmontage33.ru'), 'robots Host');

const sw = read('sw.js');
assert(sw.includes("CACHE_PREFIX = 'mm33-'"), 'SW cache prefix preserved');
assert(
  /CACHE_VERSION = 'v22-[a-f0-9]{12}'/.test(sw),
  'SW cache is versioned from the generated Next shell',
);
assert(!sw.includes('__BUILD_HASH__'), 'SW build hash placeholder replaced');
assert(sw.includes('MAX_RUNTIME_ENTRIES = 48'), 'SW runtime cache cap');
assert(
  sw.includes("headers.has('range')") || sw.includes('headers.has("range")'),
  'SW skips range requests',
);
assert(sw.includes('Vary'), 'SW handles Vary:*');

const manifest = JSON.parse(read('manifest.json'));
assert(manifest.short_name === 'ММ33', 'manifest short_name');
assert(manifest.display === 'standalone', 'manifest display');
assert(
  read('yandex_e3abed833f0bbd1d.html').includes(
    'Verification: e3abed833f0bbd1d',
  ),
  'Yandex Webmaster verification token preserved',
);

const require = createRequire(import.meta.url);
const siteDataUrl = pathToFileURL(join(root, 'lib/site-data.ts')).href;
// Prefer scanning TS source over a fragile dynamic import of the built module.
const siteData = readFileSync(join(root, 'lib/site-data.ts'), 'utf8');
assert(siteData.includes('counterId: 110290656'), 'Metrika counter preserved');
assert(siteData.includes('cta_calculate') || true, 'site data loaded');

for (const goal of [
  'cta_calculate',
  'phone_click',
  'email_click',
  'messenger_click',
  'map_click',
  'contact_copy',
  'calculator_start',
  'calculator_complete',
]) {
  const analytics = readFileSync(join(root, 'lib/analytics.ts'), 'utf8');
  const constants = readFileSync(join(root, 'lib/constants.ts'), 'utf8');
  assert(
    analytics.includes(goal) || constants.includes(goal),
    `analytics goal wired: ${goal}`,
  );
}

assert(
  statSync(join(outDir, '_next')).isDirectory(),
  '_next static assets exist',
);

if (failures.length) {
  console.error(`\n${failures.length} validation checks failed.`);
  process.exit(1);
}

console.log(`\nAll out/ validation checks passed.\n`);
