// Smoke-check the static export in out/ before FTP deploy.

import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { dirname, join, normalize, relative, resolve, sep } from 'path';

const root = resolve(process.cwd());
const outDir = join(root, 'out');
const failures = [];

const ANALYTICS_GOALS = [
  'cta_calculate',
  'cta_contact',
  'phone_click',
  'email_click',
  'messenger_click',
  'map_click',
  'contact_copy',
  'calculator_start',
  'calculator_complete',
];

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

function walkHtmlFiles(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walkHtmlFiles(full, acc);
    else if (entry.name.endsWith('.html')) acc.push(full);
  }
  return acc;
}

function isExternalOrSpecial(raw) {
  return (
    !raw ||
    raw.startsWith('#') ||
    raw.startsWith('mailto:') ||
    raw.startsWith('tel:') ||
    raw.startsWith('data:') ||
    raw.startsWith('javascript:') ||
    /^[a-z][a-z0-9+.-]*:/i.test(raw)
  );
}

function stripQueryHash(urlPath) {
  return urlPath.split('#')[0].split('?')[0];
}

/** Resolve a site-root or relative URL to an absolute filesystem path under out/. */
function resolveOutPath(fromHtmlFile, rawUrl) {
  const cleaned = stripQueryHash(rawUrl.trim());
  if (!cleaned || isExternalOrSpecial(cleaned)) return null;

  let pathname = cleaned;
  try {
    if (cleaned.startsWith('//')) return null;
    if (/^https?:\/\//i.test(cleaned)) {
      const u = new URL(cleaned);
      if (
        u.hostname !== 'metallmontage33.ru' &&
        u.hostname !== 'www.metallmontage33.ru'
      ) {
        return null;
      }
      pathname = u.pathname;
    }
  } catch {
    return null;
  }

  try {
    pathname = decodeURIComponent(pathname);
  } catch {
    // Keep the raw path if it is not valid percent-encoding.
  }

  let fsPath;
  if (pathname.startsWith('/')) {
    fsPath = join(outDir, pathname.replace(/^\//, ''));
  } else {
    fsPath = resolve(dirname(fromHtmlFile), pathname);
  }

  const normalized = normalize(fsPath);
  const rel = relative(outDir, normalized);
  if (rel.startsWith('..') || rel.includes(`..${sep}`)) return null;
  return normalized;
}

function candidatePaths(resolved) {
  const paths = [resolved];
  if (resolved.endsWith(`${sep}`) || resolved.endsWith('/')) {
    paths.push(join(resolved, 'index.html'));
  } else if (!/\.[a-z0-9]+$/i.test(resolved.split(/[/\\]/).pop() || '')) {
    paths.push(`${resolved}.html`);
    paths.push(join(resolved, 'index.html'));
  }
  return paths;
}

function pathExists(resolved) {
  return candidatePaths(resolved).some((p) => existsSync(p));
}

function extractRefs(html) {
  const refs = new Set();
  const attrRe = /\b(?:href|src|poster|data-full-src)\s*=\s*(["'])(.*?)\1/gi;
  let match;
  while ((match = attrRe.exec(html))) {
    refs.add(match[2]);
  }

  const srcsetRe = /\bsrcset\s*=\s*(["'])(.*?)\1/gi;
  while ((match = srcsetRe.exec(html))) {
    for (const part of match[2].split(',')) {
      const url = part.trim().split(/\s+/)[0];
      if (url) refs.add(url);
    }
  }

  const cssUrlRe = /url\(\s*(['"]?)([^'")]+)\1\s*\)/gi;
  while ((match = cssUrlRe.exec(html))) {
    refs.add(match[2]);
  }

  return refs;
}

function crawlExportedLinksAndResources() {
  console.log('\nExported link and resource crawl');
  const htmlFiles = walkHtmlFiles(outDir);
  assert(htmlFiles.length > 0, `found ${htmlFiles.length} HTML files in out/`);

  const missing = [];
  const checked = new Set();

  for (const htmlFile of htmlFiles) {
    const html = readFileSync(htmlFile, 'utf8');
    const fromRel = relative(outDir, htmlFile).split(sep).join('/');

    for (const raw of extractRefs(html)) {
      const resolved = resolveOutPath(htmlFile, raw);
      if (!resolved) continue;
      const key = `${fromRel} -> ${raw}`;
      if (checked.has(key)) continue;
      checked.add(key);
      if (!pathExists(resolved)) {
        missing.push(`${fromRel}: missing ${raw}`);
      }
    }
  }

  assert(
    missing.length === 0,
    `all local href/src/srcset targets exist (${checked.size} checked)`,
    missing.slice(0, 20).join('\n        ') +
      (missing.length > 20 ? `\n        …and ${missing.length - 20} more` : ''),
  );
}

console.log('\nProduction out/ checks');

assert(existsSync(outDir), 'out/ directory exists');
assert(existsSync(join(outDir, 'index.html')), 'out/index.html exists');
assert(existsSync(join(outDir, '404.html')), 'out/404.html exists');
assert(
  existsSync(join(outDir, 'blog', 'index.html')),
  'out/blog/index.html exists',
);
assert(
  existsSync(join(outDir, 'about', 'index.html')),
  'out/about/index.html exists',
);
assert(
  existsSync(
    join(outDir, 'blog', 'kak-vybrat-metallicheskij-garazh', 'index.html'),
  ),
  'out/blog article page exists',
);
assert(
  existsSync(join(outDir, 'catalog', 'index.html')),
  'out/catalog/index.html exists',
);
assert(
  existsSync(join(outDir, 'catalog', 'garazhi', 'index.html')),
  'out/catalog/garazhi/index.html exists',
);
assert(
  existsSync(join(outDir, 'catalog', 'navesy', 'index.html')),
  'out/catalog/navesy/index.html exists',
);
assert(
  read('404.html').includes('Страница не найдена'),
  '404.html contains not-found copy',
);
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
  html.includes('data-analytics-goal="cta_calculate"') ||
    html.includes("data-analytics-goal='cta_calculate'"),
  'CTA calculate markup present',
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
assert(
  sw.includes('...NEXT_SHELL_FILES'),
  'SW precache spreads NEXT_SHELL_FILES',
);
assert(
  sw.includes('MAX_CACHE_GENERATIONS'),
  'SW retains previous cache generation',
);
const shellMatch = sw.match(/const NEXT_SHELL_FILES = (\[[\s\S]*?\]);/);
assert(shellMatch, 'SW NEXT_SHELL_FILES array present');
const shellFiles = JSON.parse(shellMatch[1]);
assert(
  Array.isArray(shellFiles) && shellFiles.length > 0,
  'SW NEXT_SHELL_FILES is a non-empty shell list',
);
assert(
  shellFiles.some((file) => file.endsWith('.js')),
  'SW shell list includes JS',
);
assert(
  shellFiles.some((file) => file.endsWith('.css')),
  'SW shell list includes CSS',
);
assert(
  shellFiles.every(
    (file) => file.startsWith('_next/') && /\.(js|css)$/.test(file),
  ),
  'SW shell list only contains _next JS/CSS paths',
);
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

const analyticsConfig = readFileSync(
  join(root, 'lib/analytics-config.ts'),
  'utf8',
);
assert(
  analyticsConfig.includes('counterId: 110290656'),
  'Metrika counter preserved',
);

const constants = readFileSync(join(root, 'lib/constants.ts'), 'utf8');
for (const goal of ANALYTICS_GOALS) {
  assert(constants.includes(`'${goal}'`), `analytics goal defined: ${goal}`);
}

const catalogGaragesHtml = read('catalog/garazhi/index.html');
const markupGoals = {
  cta_calculate: html,
  cta_contact: catalogGaragesHtml,
  messenger_click: html,
  map_click: html,
  contact_copy: html,
  calculator_complete: html,
};
for (const [goal, pageHtml] of Object.entries(markupGoals)) {
  assert(
    pageHtml.includes(`data-analytics-goal="${goal}"`) ||
      pageHtml.includes(`data-analytics-goal='${goal}'`),
    `analytics goal in export markup: ${goal}`,
  );
}

assert(
  /href=["']tel:/i.test(html),
  'phone links present for phone_click tracking',
);
assert(
  /href=["']mailto:/i.test(html),
  'mailto links present for email_click tracking',
);
const calculatorSource = readFileSync(
  join(root, 'components/sections/Calculator.tsx'),
  'utf8',
);
assert(
  calculatorSource.includes('GOAL.calculator_start') ||
    calculatorSource.includes("'calculator_start'"),
  'calculator_start dispatched from Calculator',
);

assert(
  statSync(join(outDir, '_next')).isDirectory(),
  '_next static assets exist',
);

crawlExportedLinksAndResources();

if (failures.length) {
  console.error(`\n${failures.length} validation checks failed.`);
  process.exit(1);
}

console.log(`\nAll out/ validation checks passed.\n`);
