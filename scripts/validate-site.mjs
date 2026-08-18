// Zero-dependency checks for the Metall Montage 33 static site.
// Run with: npm test  (or node ./scripts/validate-site.mjs)

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, extname, isAbsolute, relative, resolve } from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
let passed = 0;

// Record a passing check.
function pass(message) {
  passed += 1;
  console.log(`  OK  ${message}`);
}

// Record a failing check without aborting the rest of the run.
function fail(message, detail = '') {
  failures.push(detail ? `${message}: ${detail}` : message);
  console.error(`  ERR ${message}${detail ? `: ${detail}` : ''}`);
}

// Pass or fail based on a boolean condition.
function assert(condition, message, detail = '') {
  if (condition) pass(message);
  else fail(message, detail);
}

// Print a section title between groups of checks.
function heading(message) {
  console.log(`\n${message}`);
}

// Read a UTF-8 file relative to the project root, stripping a BOM if present.
function read(relativePath) {
  const absolutePath = resolve(projectRoot, relativePath);
  if (!existsSync(absolutePath)) {
    fail(`Required file exists`, relativePath);
    return '';
  }
  return readFileSync(absolutePath, 'utf8').replace(/^\uFEFF/, '');
}

// Count global regex matches in a string.
function countMatches(value, pattern) {
  return Array.from(value.matchAll(pattern)).length;
}

// Read PNG/WebP width and height from file headers without extra dependencies.
function parseImageDimensions(relativePath) {
  const absolutePath = resolve(projectRoot, relativePath);
  if (!existsSync(absolutePath)) return null;

  const bytes = readFileSync(absolutePath);
  if (
    bytes.length >= 24 &&
    bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  ) {
    return {
      width: bytes.readUInt32BE(16),
      height: bytes.readUInt32BE(20),
    };
  }

  if (
    bytes.length >= 30 &&
    bytes.toString('ascii', 0, 4) === 'RIFF' &&
    bytes.toString('ascii', 8, 12) === 'WEBP'
  ) {
    const format = bytes.toString('ascii', 12, 16);
    if (format === 'VP8X' && bytes.length >= 30) {
      return {
        width: 1 + bytes.readUIntLE(24, 3),
        height: 1 + bytes.readUIntLE(27, 3),
      };
    }
    if (format === 'VP8 ' && bytes.length >= 30) {
      return {
        width: bytes.readUInt16LE(26) & 0x3fff,
        height: bytes.readUInt16LE(28) & 0x3fff,
      };
    }
    if (format === 'VP8L' && bytes.length >= 25 && bytes[20] === 0x2f) {
      return {
        width: 1 + bytes[21] + ((bytes[22] & 0x3f) << 8),
        height:
          1 + (bytes[22] >> 6) + (bytes[23] << 2) + ((bytes[24] & 0x0f) << 10),
      };
    }
  }

  return null;
}

// Walk path segments and report a case mismatch on a case-insensitive filesystem.
function findCaseMismatch(relativePath) {
  let currentDirectory = projectRoot;
  const traversed = [];

  for (const segment of relativePath
    .replaceAll('\\', '/')
    .split('/')
    .filter(Boolean)) {
    let entries;
    try {
      entries = readdirSync(currentDirectory);
    } catch {
      return null;
    }

    const actualSegment = entries.find(
      (entry) =>
        entry.toLocaleLowerCase('en-US') === segment.toLocaleLowerCase('en-US'),
    );
    if (!actualSegment) return null;

    traversed.push(actualSegment);
    if (actualSegment !== segment) {
      return `${relativePath} (segment "${segment}" is actually "${actualSegment}")`;
    }
    currentDirectory = resolve(currentDirectory, actualSegment);
  }

  return null;
}

// Normalize a phone to digits, converting a leading 8 to 7.
function normalizePhone(value) {
  const digits = String(value ?? '').replace(/\D/g, '');
  return digits.length === 11 && digits.startsWith('8')
    ? `7${digits.slice(1)}`
    : digits;
}

// Extract a hex custom property from a CSS block.
function cssToken(block, name) {
  return (
    block?.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})\\s*;`, 'i'))?.[1] ||
    ''
  );
}

// WCAG relative luminance for a #rrggbb color.
function relativeLuminance(hexColor) {
  const channels = hexColor
    .slice(1)
    .match(/.{2}/g)
    .map((value) => parseInt(value, 16) / 255)
    .map((value) =>
      value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
    );
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

// WCAG contrast ratio between two #rrggbb colors.
function contrastRatio(first, second) {
  const firstLuminance = relativeLuminance(first);
  const secondLuminance = relativeLuminance(second);
  return (
    (Math.max(firstLuminance, secondLuminance) + 0.05) /
    (Math.min(firstLuminance, secondLuminance) + 0.05)
  );
}

// Parse application/ld+json script blocks from HTML.
function jsonLdDocuments(html) {
  const documents = [];
  const scriptPattern = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi;
  for (const match of html.matchAll(scriptPattern)) {
    if (!/\btype\s*=\s*(["'])application\/ld\+json\1/i.test(match[1])) continue;
    try {
      documents.push(JSON.parse(match[2]));
    } catch (error) {
      fail('Static JSON-LD is valid JSON', error.message);
    }
  }
  return documents;
}

// Walk a JSON tree, calling visitor on every object/array node.
function visit(value, visitor) {
  if (!value || typeof value !== 'object') return;
  visitor(value);
  if (Array.isArray(value)) {
    value.forEach((item) => visit(item, visitor));
    return;
  }
  Object.values(value).forEach((item) => visit(item, visitor));
}

// True if a JSON-LD node's @type includes the expected type name.
function hasType(node, expected) {
  const types = Array.isArray(node?.['@type'])
    ? node['@type']
    : [node?.['@type']];
  return types.includes(expected);
}

// Evaluate site-data.js in a sandbox and return MM33_COMPANY.
function loadCompany(source) {
  const context = vm.createContext({
    console: { log() {}, warn() {}, error() {} },
    module: { exports: {} },
    exports: {},
  });
  try {
    vm.runInContext(source, context, {
      filename: resolve(projectRoot, 'site-data.js'),
      timeout: 1_000,
    });
  } catch (error) {
    fail('site-data.js can be evaluated in isolation', error.message);
    return null;
  }
  return context.MM33_COMPANY || context.module.exports || null;
}

// List files in a project subdirectory that match the given extensions.
function listDirectoryFiles(directory, extensions) {
  const absoluteDirectory = resolve(projectRoot, directory);
  if (!existsSync(absoluteDirectory)) return [];
  return readdirSync(absoluteDirectory, { withFileTypes: true })
    .filter(
      (entry) => entry.isFile() && extensions.includes(extname(entry.name)),
    )
    .map((entry) => `${directory}/${entry.name}`)
    .sort((left, right) => left.localeCompare(right, 'en'));
}

// Page modules in the order they must be concatenated for vm checks.
const JS_MODULE_ORDER = [
  'js/shared.js',
  'js/theme.js',
  'js/content.js',
  'js/seo.js',
  'js/ui.js',
  'js/pwa.js',
  'js/main.js',
];

// Stylesheets imported by styles.css; used to detect stray/missing partials.
const CSS_PARTIALS = [
  'css/tokens.css',
  'css/base.css',
  'css/header.css',
  'css/hero.css',
  'css/sections.css',
  'css/gallery.css',
  'css/workflow-faq.css',
  'css/contact.css',
  'css/overlays.css',
];

// Drop ESM import/export lines so modules can be concatenated and run in vm.
function stripEsm(source) {
  return source
    .replace(/^\s*import\s[\s\S]*?from\s+['"][^'"]+['"];?\s*$/gm, '')
    .replace(/^\s*export\s*\{[\s\S]*?\};?\s*$/gm, '');
}

// Concatenate page JS modules in load order after stripping ESM syntax.
function bundleJsModules() {
  return JS_MODULE_ORDER.map((relativePath) =>
    stripEsm(read(relativePath)),
  ).join('\n');
}

// Inline @import chains into one stylesheet string.
function resolveStylesheet(entry = 'styles.css') {
  const seen = new Set();
  const chunks = [];

  function visit(relativePath) {
    const key = relativePath.replaceAll('\\', '/');
    if (seen.has(key)) return;
    seen.add(key);
    const source = read(key);
    const importPattern =
      /@import\s+(?:url\(\s*)?(?:["']([^"']+)["']|([^);]+))\s*\)?\s*;/gi;
    for (const match of source.matchAll(importPattern)) {
      const href = String(match[1] || match[2] || '').trim();
      if (!href || /^(?:https?:|data:)/i.test(href)) continue;
      const resolved = relative(
        projectRoot,
        resolve(dirname(resolve(projectRoot, key)), href),
      ).replaceAll('\\', '/');
      visit(resolved);
    }
    chunks.push(source.replace(importPattern, ''));
  }

  visit(entry);
  return chunks.join('\n');
}

// Run renderJsonLd() from js/seo.js in a stub DOM and return the parsed graph.
function renderRuntimeJsonLd(source, company) {
  const host = {};
  const context = vm.createContext({
    MM33_COMPANY: company,
    Intl,
    console: { log() {}, warn() {}, error() {} },
    document: {
      documentElement: { classList: { add() {} } },
      getElementById(id) {
        return id === 'json-ld' ? host : null;
      },
      addEventListener() {},
    },
  });

  try {
    vm.runInContext(
      `${source}\nglobalThis.__renderJsonLd = renderJsonLd;`,
      context,
      {
        filename: resolve(projectRoot, 'js/seo.js'),
        timeout: 1_000,
      },
    );
    const siteUrl = String(company?.seo?.siteUrl || '').replace(/\/$/, '');
    const pageUrl = siteUrl ? `${siteUrl}/` : '';
    context.__renderJsonLd(
      siteUrl,
      pageUrl,
      siteUrl ? `${siteUrl}/assets/logo-og.webp` : './assets/logo-og.webp',
    );
    return JSON.parse(host.textContent);
  } catch (error) {
    fail('Runtime JSON-LD can be rendered in isolation', error.message);
    return null;
  }
}

// All JS/MJS files that should parse under node --check.
function listScriptFiles() {
  return [
    'site-data.js',
    'sw.js',
    ...listDirectoryFiles('js', ['.js']),
    ...listDirectoryFiles('scripts', ['.js', '.mjs', '.cjs']),
  ];
}

// Run `node --check` on a file and record pass/fail.
function checkJavaScriptSyntax(relativePath) {
  const absolutePath = resolve(projectRoot, relativePath);
  const result = spawnSync(process.execPath, ['--check', absolutePath], {
    encoding: 'utf8',
  });
  if (result.status === 0) {
    pass(`JavaScript syntax: ${relativePath}`);
    return;
  }
  fail(
    `JavaScript syntax: ${relativePath}`,
    String(result.stderr || result.stdout || 'node --check failed').trim(),
  );
}

// Load the sources used by the remaining check groups.
const indexHtml = read('index.html');
const mainSource = bundleJsModules();
const stylesSource = resolveStylesheet('styles.css');
const siteDataSource = read('site-data.js');
const serviceWorkerSource = read('sw.js');
const manifestSource = read('manifest.json');
const sitemapXml = read('sitemap.xml');
const robotsText = read('robots.txt');
const packageSource = read('package.json');

// Syntax of JS files, JSON of manifest/package, and the known CSS module list.
heading('JavaScript and JSON');
const discoveredJsModules = listDirectoryFiles('js', ['.js']);
const missingJsModules = discoveredJsModules.filter(
  (file) => !JS_MODULE_ORDER.includes(file),
);
const extraJsModules = JS_MODULE_ORDER.filter(
  (file) => !discoveredJsModules.includes(file),
);
assert(
  missingJsModules.length === 0 && extraJsModules.length === 0,
  'JS bundle order lists every module in js/',
  [...missingJsModules, ...extraJsModules].join(', '),
);
const discoveredCssPartials = listDirectoryFiles('css', ['.css']);
const missingCssPartials = discoveredCssPartials.filter(
  (file) => !CSS_PARTIALS.includes(file),
);
const extraCssPartials = CSS_PARTIALS.filter(
  (file) => !discoveredCssPartials.includes(file),
);
assert(
  missingCssPartials.length === 0 && extraCssPartials.length === 0,
  'CSS entry lists every stylesheet in css/',
  [...missingCssPartials, ...extraCssPartials].join(', '),
);
for (const relativePath of listScriptFiles()) {
  checkJavaScriptSyntax(relativePath);
}

let manifest = null;
let packageJson = null;
try {
  manifest = JSON.parse(manifestSource);
  pass('manifest.json is valid JSON');
} catch (error) {
  fail('manifest.json is valid JSON', error.message);
}
try {
  packageJson = JSON.parse(packageSource);
  pass('package.json is valid JSON');
} catch (error) {
  fail('package.json is valid JSON', error.message);
}

if (packageJson) {
  const dependencies = Object.keys(packageJson.dependencies || {});
  const developmentDependencies = Object.keys(
    packageJson.devDependencies || {},
  );
  assert(
    dependencies.length === 0 && developmentDependencies.length === 0,
    'Validation remains zero-dependency',
    [...dependencies, ...developmentDependencies].join(', '),
  );
  assert(
    packageJson.scripts?.validate && packageJson.scripts?.test,
    'npm validate and test scripts are defined',
  );
}

// XML declaration, namespaces, and lastmod format.
heading('Sitemap structure');
assert(
  /^\s*<\?xml\s+version=["']1\.0["']/i.test(sitemapXml),
  'Sitemap has an XML declaration',
);
assert(
  /<urlset\b[^>]*\bxmlns=["']http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9["']/i.test(
    sitemapXml,
  ),
  'Sitemap declares the standard namespace',
);
assert(
  /<urlset\b[^>]*\bxmlns:image=["']http:\/\/www\.google\.com\/schemas\/sitemap-image\/1\.1["']/i.test(
    sitemapXml,
  ),
  'Sitemap declares the image namespace',
);
for (const tag of [
  'urlset',
  'url',
  'loc',
  'lastmod',
  'changefreq',
  'priority',
  'image:image',
  'image:loc',
]) {
  const escapedTag = tag.replace(':', '\\:');
  const opens = countMatches(
    sitemapXml,
    new RegExp(`<${escapedTag}(?:\\s[^>]*)?>`, 'gi'),
  );
  const closes = countMatches(
    sitemapXml,
    new RegExp(`</${escapedTag}\\s*>`, 'gi'),
  );
  assert(
    opens === closes && opens > 0,
    `Sitemap tag is balanced: ${tag}`,
    `${opens} open / ${closes} close`,
  );
}
assert(
  !/<\/?image(?:\s|>)/i.test(sitemapXml),
  'Sitemap does not use an unprefixed image element',
);

const imageBlocks = Array.from(
  sitemapXml.matchAll(/<image:image\b[^>]*>([\s\S]*?)<\/image:image\s*>/gi),
);
assert(imageBlocks.length > 0, 'Sitemap contains namespaced image entries');
assert(
  imageBlocks.every(
    (block) =>
      countMatches(block[1], /<image:loc\b[^>]*>[\s\S]*?<\/image:loc\s*>/gi) ===
      1,
  ),
  'Every sitemap image has exactly one image:loc',
);
const lastModifiedValues = Array.from(
  sitemapXml.matchAll(/<lastmod\b[^>]*>\s*([^<]+?)\s*<\/lastmod\s*>/gi),
  (match) => match[1].trim(),
);
assert(
  lastModifiedValues.length > 0 &&
    lastModifiedValues.every((value) => /^\d{4}-\d{2}-\d{2}$/.test(value)),
  'Sitemap lastmod values use YYYY-MM-DD',
);

// Runtime data, HTML fallback, and JSON-LD must stay in sync.
heading('Single source of truth');
const company = loadCompany(siteDataSource);
assert(
  company && typeof company === 'object',
  'site-data.js exposes MM33_COMPANY',
);

const jsonLd = jsonLdDocuments(indexHtml);
assert(jsonLd.length > 0, 'index.html contains parseable JSON-LD');
const jsonLdText = JSON.stringify(jsonLd);

if (company) {
  const runtimeJsonLd = renderRuntimeJsonLd(mainSource, company);
  assert(
    Boolean(runtimeJsonLd),
    'Runtime JSON-LD can be rendered from site data',
  );
  if (runtimeJsonLd && jsonLd[0]) {
    assert(
      JSON.stringify(runtimeJsonLd) === JSON.stringify(jsonLd[0]),
      'Static and runtime JSON-LD are identical',
    );
  }

  const dataScriptPosition = indexHtml.search(
    /<script\b[^>]*\bsrc=["']\.\/site-data\.js["'][^>]*>/i,
  );
  const mainScriptPosition = indexHtml.search(
    /<script\b[^>]*\bsrc=["']\.\/js\/main\.js["'][^>]*>/i,
  );
  assert(
    dataScriptPosition >= 0 && mainScriptPosition > dataScriptPosition,
    'site-data.js loads before js/main.js',
  );
  assert(
    /<script\b[^>]*\btype=["']module["'][^>]*\bsrc=["']\.\/js\/main\.js["']/i.test(
      indexHtml,
    ) ||
      /<script\b[^>]*\bsrc=["']\.\/js\/main\.js["'][^>]*\btype=["']module["']/i.test(
        indexHtml,
      ),
    'js/main.js is loaded as an ES module',
  );

  let siteOrigin = '';
  try {
    siteOrigin = new URL(company.seo?.siteUrl).origin;
    pass('company.seo.siteUrl is an absolute URL');
  } catch (error) {
    fail('company.seo.siteUrl is an absolute URL', error.message);
  }

  if (siteOrigin) {
    assert(
      indexHtml.includes(siteOrigin),
      'Canonical domain is present in index.html',
      siteOrigin,
    );
    assert(
      jsonLdText.includes(siteOrigin),
      'Canonical domain is present in JSON-LD',
      siteOrigin,
    );
    assert(
      sitemapXml.includes(`<loc>\n`) || sitemapXml.includes('<loc>'),
      'Sitemap contains a page loc',
    );
    const sitemapLocations = Array.from(
      sitemapXml.matchAll(/<loc\b[^>]*>\s*([^<]+?)\s*<\/loc\s*>/gi),
      (match) => match[1].trim(),
    );
    assert(
      sitemapLocations.length > 0 &&
        sitemapLocations.every((location) => {
          try {
            return new URL(location).origin === siteOrigin;
          } catch {
            return false;
          }
        }),
      'All sitemap page URLs use the canonical domain',
    );
    assert(
      robotsText.includes(`${siteOrigin}/sitemap.xml`),
      'robots.txt uses the canonical sitemap URL',
    );
  }

  assert(
    indexHtml.includes(company.name),
    'Company name is present in index.html',
    company.name,
  );
  assert(
    jsonLdText.includes(company.name),
    'Company name is present in JSON-LD',
    company.name,
  );
  assert(
    indexHtml
      .toLocaleLowerCase('ru-RU')
      .includes(String(company.email).toLocaleLowerCase('ru-RU')),
    'Company email is present in index.html',
    company.email,
  );
  assert(
    jsonLdText
      .toLocaleLowerCase('ru-RU')
      .includes(String(company.email).toLocaleLowerCase('ru-RU')),
    'Company email is present in JSON-LD',
    company.email,
  );

  const jsonPhoneDigits = normalizePhone(jsonLdText);
  for (const phone of Array.isArray(company.phones) ? company.phones : []) {
    const expected = normalizePhone(phone.href || phone.value);
    assert(
      expected.length >= 10,
      `Company phone is structurally valid: ${phone.value || phone.href}`,
    );
    assert(
      indexHtml.includes(phone.href),
      `Company phone link is present in index.html: ${phone.href}`,
    );
    assert(
      jsonPhoneDigits.includes(expected),
      `Company phone is present in JSON-LD: ${phone.value || phone.href}`,
    );
  }

  if (manifest) {
    assert(
      manifest.name === company.name ||
        manifest.name?.startsWith(`${company.name} `),
      'Manifest name matches company data',
    );
    assert(
      manifest.short_name === company.shortName,
      'Manifest short_name matches company data',
    );
  }

  const regions = company.seo?.serviceArea?.regions;
  assert(
    Array.isArray(regions) && regions.length > 0,
    'Company data contains service regions',
  );
  if (Array.isArray(regions)) {
    const geographicNames = regions.flatMap((region) => [
      region.name,
      ...(Array.isArray(region.cities) ? region.cities : []),
    ]);
    const missingFromJsonLd = geographicNames.filter(
      (name) => name && !jsonLdText.includes(name),
    );
    assert(
      missingFromJsonLd.length === 0,
      'Service geography is synchronized with static JSON-LD',
      missingFromJsonLd.join(', '),
    );

    const nizhnyNovgorod = regions.find((region) =>
      /Нижегородская область/i.test(region.name),
    );
    const ivanovo = regions.find((region) =>
      /Ивановская область/i.test(region.name),
    );
    assert(
      !nizhnyNovgorod?.cities?.includes('Клявлино'),
      'Клявлино is absent from Нижегородская область',
    );
    assert(
      ivanovo?.cities?.includes('Заволжск'),
      'Заволжск is present in Ивановская область',
    );
  }

  for (const [label, value] of [
    ['site-data.js', siteDataSource],
    ['index.html and JSON-LD', indexHtml],
  ]) {
    assert(!value.includes('Клявлино'), `Клявлино is absent from ${label}`);
    assert(!value.includes('Заволжье'), `Заволжье is absent from ${label}`);
    assert(value.includes('Заволжск'), `Заволжск is present in ${label}`);
  }
}

// Name, icons, start_url, and theme colors vs site-data.js.
heading('Web app manifest invariants');
if (manifest) {
  const manifestBase = (() => {
    try {
      return new URL(company?.seo?.siteUrl || 'https://example.invalid/');
    } catch {
      return new URL('https://example.invalid/');
    }
  })();

  let manifestScopeUrl = null;
  let manifestIdUrl = null;
  let manifestStartUrl = null;
  try {
    manifestScopeUrl = new URL(manifest.scope || './', manifestBase);
    pass('Manifest scope is a valid URL reference');
  } catch (error) {
    fail('Manifest scope is a valid URL reference', error.message);
  }
  try {
    manifestIdUrl = new URL(manifest.id, manifestBase);
    pass('Manifest has a stable, valid id');
  } catch (error) {
    fail('Manifest has a stable, valid id', error.message);
  }
  try {
    manifestStartUrl = new URL(manifest.start_url, manifestBase);
    pass('Manifest has a valid start_url');
  } catch (error) {
    fail('Manifest has a valid start_url', error.message);
  }

  function urlIsWithinManifestScope(candidate) {
    if (
      !candidate ||
      !manifestScopeUrl ||
      candidate.origin !== manifestScopeUrl.origin
    )
      return false;
    const scopePath = manifestScopeUrl.pathname.endsWith('/')
      ? manifestScopeUrl.pathname
      : `${manifestScopeUrl.pathname}/`;
    return (
      candidate.pathname === manifestScopeUrl.pathname ||
      candidate.pathname.startsWith(scopePath)
    );
  }

  assert(
    Boolean(manifest.id) &&
      urlIsWithinManifestScope(manifestIdUrl) &&
      !manifestIdUrl?.search &&
      !manifestIdUrl?.hash,
    'Manifest id is stable and within scope',
    manifest.id,
  );
  assert(
    Boolean(manifest.start_url) && urlIsWithinManifestScope(manifestStartUrl),
    'Manifest start_url is within scope',
    manifest.start_url,
  );
  assert(
    ['standalone', 'minimal-ui', 'fullscreen', 'browser'].includes(
      manifest.display,
    ),
    'Manifest display mode is installable',
    manifest.display,
  );
  assert(
    manifest.orientation === undefined || manifest.orientation === 'any',
    'Manifest does not impose an unnecessary orientation lock',
    manifest.orientation,
  );

  let languageIsValid = false;
  try {
    languageIsValid =
      Boolean(manifest.lang) &&
      new Intl.Locale(manifest.lang).toString() === manifest.lang;
  } catch {
    languageIsValid = false;
  }
  assert(
    languageIsValid,
    'Manifest lang is a valid canonical language tag',
    manifest.lang,
  );

  const validHexColor = /^#[0-9a-f]{6}(?:[0-9a-f]{2})?$/i;
  assert(
    validHexColor.test(manifest.theme_color || ''),
    'Manifest theme_color is a valid hex color',
    manifest.theme_color,
  );
  assert(
    validHexColor.test(manifest.background_color || ''),
    'Manifest background_color is a valid hex color',
    manifest.background_color,
  );

  const manifestIcons = Array.isArray(manifest.icons) ? manifest.icons : [];
  const mimeByExtension = new Map([
    ['.png', 'image/png'],
    ['.webp', 'image/webp'],
    ['.svg', 'image/svg+xml'],
    ['.ico', 'image/x-icon'],
  ]);
  const iconIssues = [];
  const anyPurposeIcons = [];
  const maskableIcons = [];

  for (const icon of manifestIcons) {
    const purposeTokens = String(icon?.purpose || 'any')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (purposeTokens.includes('any')) anyPurposeIcons.push(icon);
    if (purposeTokens.includes('maskable')) maskableIcons.push(icon);

    const extension = extname(
      String(icon?.src || '').split(/[?#]/, 1)[0],
    ).toLowerCase();
    const expectedMime = mimeByExtension.get(extension);
    if (!expectedMime || icon?.type !== expectedMime) {
      iconIssues.push(
        `${icon?.src || '(missing src)'} declares ${icon?.type || '(missing type)'}`,
      );
    }

    const declaredSizes = String(icon?.sizes || '')
      .split(/\s+/)
      .filter(Boolean);
    const localPath = String(icon?.src || '')
      .replace(/^\.\//, '')
      .split(/[?#]/, 1)[0];
    const dimensions = parseImageDimensions(localPath);
    if (!dimensions) {
      iconIssues.push(
        `${icon?.src || '(missing src)'} dimensions cannot be verified`,
      );
    } else if (
      !declaredSizes.includes(`${dimensions.width}x${dimensions.height}`)
    ) {
      iconIssues.push(
        `${icon.src} is ${dimensions.width}x${dimensions.height}, declared ${icon.sizes || '(missing sizes)'}`,
      );
    }
  }

  assert(manifestIcons.length > 0, 'Manifest contains icons');
  assert(
    iconIssues.length === 0,
    'Manifest icon sizes and MIME types match the assets',
    iconIssues.join('; '),
  );
  for (const requiredSize of ['192x192', '512x512']) {
    assert(
      anyPurposeIcons.some((icon) =>
        String(icon.sizes || '')
          .split(/\s+/)
          .includes(requiredSize),
      ),
      `Manifest has an any-purpose ${requiredSize} icon`,
    );
  }

  const generalIconSources = new Set(anyPurposeIcons.map((icon) => icon.src));
  const misleadingMaskable = maskableIcons.filter((icon) => {
    const purposes = String(icon.purpose || '')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    return purposes.includes('any') || generalIconSources.has(icon.src);
  });
  assert(
    misleadingMaskable.length === 0,
    'Manifest has no falsely labelled maskable icon',
    misleadingMaskable.map((icon) => icon.src).join(', '),
  );
}

// WCAG AA contrast for core text/background token pairs in both themes.
heading('Core color contrast');
const darkTokens = stylesSource.match(/:root\s*\{([\s\S]*?)\}/)?.[1] || '';
const lightTokens =
  stylesSource.match(
    /html\[data-theme=['"]light['"]\]\s*\{([\s\S]*?)\}/,
  )?.[1] || '';
for (const [theme, block] of [
  ['dark', darkTokens],
  ['light', lightTokens],
]) {
  const pairs = [
    ['text', 'bg'],
    ['text', 'card'],
    ['on-primary', 'primary'],
    ['on-primary', 'primary-2'],
  ];
  for (const [foregroundName, backgroundName] of pairs) {
    const foreground = cssToken(block, foregroundName);
    const background = cssToken(block, backgroundName);
    const ratio =
      foreground && background ? contrastRatio(foreground, background) : 0;
    assert(
      ratio >= 4.5,
      `${theme} ${foregroundName}/${backgroundName} meets WCAG AA`,
      ratio ? `${ratio.toFixed(2)}:1` : 'token not found',
    );
  }
}

// Offers use minPrice (“от”), not a fake exact Product.price.
heading('Truthful price structured data');
const structuredNodes = [];
jsonLd.forEach((document) =>
  visit(document, (node) => structuredNodes.push(node)),
);
const offerNodes = structuredNodes.filter((node) => hasType(node, 'Offer'));
const priceSpecifications = structuredNodes.filter((node) =>
  hasType(node, 'PriceSpecification'),
);
const exactPriceOffers = offerNodes.filter((node) =>
  Object.prototype.hasOwnProperty.call(node, 'price'),
);
const availabilityNodes = structuredNodes.filter((node) =>
  Object.prototype.hasOwnProperty.call(node, 'availability'),
);
const productNodes = structuredNodes.filter((node) => hasType(node, 'Product'));

assert(offerNodes.length > 0, 'JSON-LD contains service offers');
assert(
  exactPriceOffers.length === 0,
  'JSON-LD has no exact Offer.price values',
);
assert(
  availabilityNodes.length === 0,
  'JSON-LD has no misleading availability values',
);
assert(
  productNodes.length === 0,
  'JSON-LD does not model custom work as Product',
);
assert(
  priceSpecifications.length > 0 &&
    priceSpecifications.every((node) => {
      const value = Number(node.minPrice);
      return (
        Object.prototype.hasOwnProperty.call(node, 'minPrice') &&
        Number.isFinite(value) &&
        value > 0
      );
    }),
  'PriceSpecification uses a positive minPrice',
);
assert(
  offerNodes.every((offer) => {
    const specifications = Array.isArray(offer.priceSpecification)
      ? offer.priceSpecification
      : [offer.priceSpecification];
    return specifications.some(
      (specification) =>
        specification &&
        Object.prototype.hasOwnProperty.call(specification, 'minPrice'),
    );
  }),
  'Every Offer expresses a starting price via PriceSpecification.minPrice',
);

if (company?.pricing && typeof company.pricing === 'object') {
  const configuredMinimums = Object.values(company.pricing)
    .map((entry) => Number(entry?.from))
    .filter((value) => Number.isFinite(value) && value > 0);
  const structuredMinimums = priceSpecifications.map((entry) =>
    Number(entry.minPrice),
  );
  const missingMinimums = configuredMinimums.filter(
    (value) => !structuredMinimums.includes(value),
  );
  assert(
    missingMinimums.length === 0,
    'Configured starting prices are synchronized with JSON-LD',
    missingMinimums.join(', '),
  );
}

// Every local file referenced from HTML, CSS, JS, and the manifest must exist.
heading('Local assets');
const siteOrigin = (() => {
  try {
    return company?.seo?.siteUrl ? new URL(company.seo.siteUrl).origin : '';
  } catch {
    return '';
  }
})();
const references = new Map();

// Record a same-origin file path referenced from a source file.
function recordReference(rawReference, sourceFile) {
  let reference = String(rawReference || '')
    .trim()
    .replace(/&amp;/g, '&');
  if (
    !reference ||
    /^(?:#|data:|blob:|mailto:|tel:|javascript:)/i.test(reference)
  )
    return;

  try {
    if (/^https?:\/\//i.test(reference)) {
      const url = new URL(reference);
      if (!siteOrigin || url.origin !== siteOrigin) return;
      reference = url.pathname;
    } else if (reference.startsWith('//')) {
      return;
    }
  } catch {
    fail('Referenced URL can be parsed', `${sourceFile}: ${reference}`);
    return;
  }

  reference = reference.split(/[?#]/, 1)[0];
  try {
    reference = decodeURIComponent(reference);
  } catch {
    fail(
      'Referenced path is URL-encoded correctly',
      `${sourceFile}: ${reference}`,
    );
    return;
  }

  if (
    !/\.(?:avif|cjs|css|gif|html?|ico|jpe?g|js|json|mjs|png|svg|webmanifest|webp|woff2?|xml)$/i.test(
      reference,
    )
  )
    return;
  const baseDirectory = dirname(resolve(projectRoot, sourceFile));
  const absolutePath = reference.startsWith('/')
    ? resolve(projectRoot, reference.replace(/^\/+/, ''))
    : resolve(baseDirectory, reference);
  const relativePath = relative(projectRoot, absolutePath);
  if (isAbsolute(relativePath) || relativePath.startsWith('..')) {
    fail(
      'Local reference stays inside the project',
      `${sourceFile}: ${reference}`,
    );
    return;
  }
  const key = relativePath.replaceAll('\\', '/');
  if (!references.has(key)) references.set(key, new Set());
  references.get(key).add(sourceFile);
}

for (const match of indexHtml.matchAll(
  /\b(?:content|href|poster|src)\s*=\s*(["'])([\s\S]*?)\1/gi,
)) {
  recordReference(match[2], 'index.html');
}
for (const match of indexHtml.matchAll(
  /\b(?:imagesrcset|srcset)\s*=\s*(["'])([\s\S]*?)\1/gi,
)) {
  for (const candidate of match[2].split(',')) {
    recordReference(candidate.trim().split(/\s+/)[0], 'index.html');
  }
}
for (const match of siteDataSource.matchAll(
  /(["'])([^"'\r\n]*\.(?:avif|gif|ico|jpe?g|png|svg|webp))\1/gi,
)) {
  recordReference(match[2], 'site-data.js');
}
for (const match of mainSource.matchAll(
  /(["'`])([^"'`\r\n]*\.(?:avif|cjs|css|gif|html?|ico|jpe?g|js|json|mjs|png|svg|webmanifest|webp|woff2?)(?:[?#][^"'`\r\n]*)?)\1/gi,
)) {
  // Filename suffixes used to derive a path (for example "-560.webp")
  // are not standalone asset references.
  if (match[2].startsWith('-')) continue;
  recordReference(match[2], 'js/');
}
for (const match of stylesSource.matchAll(
  /url\(\s*(?:(["'])(.*?)\1|([^)'"\s]+))\s*\)/gi,
)) {
  recordReference(match[2] || match[3], 'styles.css');
}
for (const match of serviceWorkerSource.matchAll(
  /(["'])([^"'\r\n]*\.(?:css|html?|ico|js|json|webmanifest))\1/gi,
)) {
  recordReference(match[2], 'sw.js');
}
if (manifest) {
  for (const collection of [manifest.icons, manifest.screenshots]) {
    for (const item of Array.isArray(collection) ? collection : []) {
      recordReference(item?.src, 'manifest.json');
    }
  }
  for (const shortcut of Array.isArray(manifest.shortcuts)
    ? manifest.shortcuts
    : []) {
    for (const icon of Array.isArray(shortcut.icons) ? shortcut.icons : []) {
      recordReference(icon?.src, 'manifest.json');
    }
  }
}
for (const block of imageBlocks) {
  const location = block[1].match(
    /<image:loc\b[^>]*>\s*([^<]+?)\s*<\/image:loc\s*>/i,
  )?.[1];
  if (location) recordReference(location.trim(), 'sitemap.xml');
}
const missingAssets = Array.from(references.entries())
  .filter(([relativePath]) => !existsSync(resolve(projectRoot, relativePath)))
  .map(
    ([relativePath, sources]) =>
      `${relativePath} (${Array.from(sources).join(', ')})`,
  );
const caseMismatches = Array.from(references.keys())
  .filter((relativePath) => existsSync(resolve(projectRoot, relativePath)))
  .map(findCaseMismatch)
  .filter(Boolean);
assert(references.size > 0, 'Local references were discovered');
assert(
  missingAssets.length === 0,
  'All referenced local files exist',
  missingAssets.join('; '),
);
assert(
  caseMismatches.length === 0,
  'Local asset path casing is exact',
  caseMismatches.join('; '),
);

const requiredAppShellAssets = new Set([
  'index.html',
  'styles.css',
  ...CSS_PARTIALS,
  'site-data.js',
  ...JS_MODULE_ORDER,
  'manifest.json',
  'favicon.ico',
  'assets/favicon.svg',
  'assets/favicon-48.png',
  'assets/favicon-96.png',
  'assets/apple-touch-icon.png',
  'assets/logo-hero-680.webp',
  'assets/logo-hero.webp',
]);
for (const icon of Array.isArray(manifest?.icons) ? manifest.icons : []) {
  const iconPath = String(icon?.src || '')
    .replace(/^\.\//, '')
    .split(/[?#]/, 1)[0];
  if (iconPath) requiredAppShellAssets.add(iconPath);
}
const missingFromAppShell = Array.from(requiredAppShellAssets).filter(
  (file) =>
    !serviceWorkerSource.includes(`'${file}'`) &&
    !serviceWorkerSource.includes(`"${file}"`),
);
assert(
  missingFromAppShell.length === 0,
  'Service worker precaches the complete app shell and installation assets',
  missingFromAppShell.join(', '),
);

// Minimal Headers/Request/Response/CacheStorage stubs for running sw.js in vm.
class ServiceWorkerTestHeaders {
  constructor(initial = {}) {
    this.values = new Map();
    const entries =
      initial instanceof ServiceWorkerTestHeaders
        ? initial.values.entries()
        : Array.isArray(initial)
          ? initial
          : Object.entries(initial);
    for (const [name, value] of entries) {
      this.values.set(String(name).toLowerCase(), String(value));
    }
  }

  get(name) {
    return this.values.get(String(name).toLowerCase()) ?? null;
  }

  has(name) {
    return this.values.has(String(name).toLowerCase());
  }
}

// Fake Response with clone(), text(), and Cache-Control-aware headers.
function serviceWorkerTestResponse(body, init = {}) {
  const status = init.status ?? 200;
  const response = {
    status,
    ok: status >= 200 && status < 300,
    type: init.type || 'basic',
    headers: new ServiceWorkerTestHeaders(init.headers),
    async text() {
      return String(body);
    },
    clone() {
      return serviceWorkerTestResponse(body, {
        status,
        type: this.type,
        headers: this.headers,
      });
    },
  };
  return response;
}

// Fake Request for fetch-handler tests (url, method, mode, destination).
function serviceWorkerTestRequest(path, init = {}) {
  return {
    url: new URL(path, 'https://sw.test/').href,
    method: init.method || 'GET',
    mode: init.mode || 'cors',
    destination: init.destination || '',
    headers: new ServiceWorkerTestHeaders(init.headers),
  };
}

// In-memory caches.open/match/put used by the service worker harness.
function createMemoryCacheStorage() {
  const stores = new Map();
  const storage = {
    rejectNextPuts: 0,
  };

  function keyOf(input) {
    return typeof input === 'string'
      ? new URL(input, 'https://sw.test/').href
      : input.url;
  }

  function createCache() {
    const entries = new Map();
    return {
      async addAll(urls) {
        for (const url of urls) {
          entries.set(
            keyOf(url),
            serviceWorkerTestResponse(`precache:${new URL(url).pathname}`),
          );
        }
      },
      async put(input, response) {
        if (storage.rejectNextPuts > 0) {
          storage.rejectNextPuts -= 1;
          throw new Error('Synthetic Cache.put rejection');
        }
        entries.set(keyOf(input), response.clone());
      },
      async match(input) {
        const response = entries.get(keyOf(input));
        return response?.clone();
      },
      async keys() {
        return Array.from(entries.keys(), (url) =>
          serviceWorkerTestRequest(url),
        );
      },
      async delete(input) {
        return entries.delete(keyOf(input));
      },
    };
  }

  const caches = {
    async open(name) {
      if (!stores.has(name)) stores.set(name, createCache());
      return stores.get(name);
    },
    async keys() {
      return Array.from(stores.keys());
    },
    async delete(name) {
      return stores.delete(name);
    },
  };

  return { caches, storage };
}

// Load sw.js in a sandbox with stubbed self, caches, fetch, and clients.
function createServiceWorkerHarness(options = {}) {
  const listeners = new Map();
  const cacheStorage = createMemoryCacheStorage();
  const state = {
    fetchCalls: [],
    fetchImpl:
      options.fetchImpl ||
      ((request) =>
        serviceWorkerTestResponse(`network:${request.url || request}`)),
    skipWaitingCalls: 0,
    claimCalls: 0,
  };

  const selfObject = {
    registration: { scope: 'https://sw.test/' },
    location: { origin: 'https://sw.test' },
    clients: {
      async claim() {
        state.claimCalls += 1;
      },
    },
    async skipWaiting() {
      state.skipWaitingCalls += 1;
    },
    addEventListener(type, handler) {
      listeners.set(type, handler);
    },
  };

  const context = vm.createContext({
    AbortController,
    URL,
    caches: cacheStorage.caches,
    clearTimeout: options.clearTimeoutImpl || clearTimeout,
    console: { log() {}, warn() {}, error() {} },
    fetch(request, fetchOptions) {
      state.fetchCalls.push({ request, fetchOptions });
      return state.fetchImpl(request, fetchOptions);
    },
    self: selfObject,
    setTimeout: options.setTimeoutImpl || setTimeout,
  });
  vm.runInContext(serviceWorkerSource, context, {
    filename: resolve(projectRoot, 'sw.js'),
    timeout: 1_000,
  });

  async function dispatchExtendable(type) {
    const waits = [];
    const listener = listeners.get(type);
    if (!listener) throw new Error(`Missing ${type} listener`);
    listener({
      waitUntil(value) {
        waits.push(Promise.resolve(value));
      },
    });
    await Promise.all(waits);
  }

  async function dispatchFetch(request) {
    const waits = [];
    let responsePromise = null;
    const listener = listeners.get('fetch');
    if (!listener) throw new Error('Missing fetch listener');
    listener({
      request,
      respondWith(value) {
        if (responsePromise)
          throw new Error('respondWith was called more than once');
        responsePromise = Promise.resolve(value);
      },
      waitUntil(value) {
        waits.push(Promise.resolve(value));
      },
    });
    const response = responsePromise ? await responsePromise : null;
    return {
      handled: Boolean(responsePromise),
      response,
      async waitForBackground() {
        await Promise.allSettled(waits);
      },
    };
  }

  return {
    cacheStorage,
    dispatchActivate: () => dispatchExtendable('activate'),
    dispatchFetch,
    dispatchInstall: () => dispatchExtendable('install'),
    setFetch(fetchImpl) {
      state.fetchImpl = fetchImpl;
    },
    state,
  };
}

// Read body text from a harness Response, or '' if missing.
async function responseText(response) {
  return response ? response.text() : '';
}

// Exercise install, activate, navigation, app-shell, and runtime cache paths.
async function runServiceWorkerBehaviorChecks() {
  heading('Service worker behavior');

  try {
    const harness = createServiceWorkerHarness();
    await harness.dispatchInstall();
    const namesAfterInstall = await harness.cacheStorage.caches.keys();
    const precacheName = namesAfterInstall.find((name) =>
      /^mm33-precache-/.test(name),
    );
    assert(
      Boolean(precacheName),
      'Service worker install creates the versioned MM33 precache',
    );
    assert(
      harness.state.skipWaitingCalls === 1,
      'Service worker install requests skipWaiting once',
    );

    const runtimeProbe = serviceWorkerTestRequest(
      '/assets/runtime-probe.webp',
      { destination: 'image' },
    );
    const probeEvent = await harness.dispatchFetch(runtimeProbe);
    await probeEvent.waitForBackground();
    const currentMm33Caches = (await harness.cacheStorage.caches.keys()).filter(
      (name) => name.startsWith('mm33-'),
    );

    await harness.cacheStorage.caches.open('mm33-precache-validator-old');
    await harness.cacheStorage.caches.open('mm33-runtime-validator-old');
    await harness.cacheStorage.caches.open('foreign-app-cache');
    await harness.dispatchActivate();
    const namesAfterActivate = await harness.cacheStorage.caches.keys();
    assert(
      !namesAfterActivate.includes('mm33-precache-validator-old') &&
        !namesAfterActivate.includes('mm33-runtime-validator-old'),
      'Service worker activate removes obsolete MM33 caches',
    );
    assert(
      currentMm33Caches.every((name) => namesAfterActivate.includes(name)),
      'Service worker activate preserves current MM33 caches',
    );
    assert(
      namesAfterActivate.includes('foreign-app-cache'),
      'Service worker activate preserves foreign caches',
    );
    assert(
      harness.state.claimCalls === 1,
      'Service worker activate claims clients once',
    );
  } catch (error) {
    fail(
      'Service worker install/activate VM scenario completes',
      error.message,
    );
  }

  try {
    const harness = createServiceWorkerHarness();
    await harness.dispatchInstall();
    const precacheName = (await harness.cacheStorage.caches.keys()).find(
      (name) => /^mm33-precache-/.test(name),
    );
    const precache = await harness.cacheStorage.caches.open(precacheName);
    const canonicalIndex = await precache.match('https://sw.test/index.html');
    const canonicalIndexBody = await responseText(canonicalIndex);

    harness.setFetch(async () => {
      throw new Error('offline');
    });
    const offlineNavigation = await harness.dispatchFetch(
      serviceWorkerTestRequest('/?utm_source=validator&utm_campaign=offline', {
        mode: 'navigate',
        destination: 'document',
      }),
    );
    assert(
      offlineNavigation.handled &&
        (await responseText(offlineNavigation.response)) === canonicalIndexBody,
      'Offline UTM navigation falls back to the canonical cached index',
    );
    const precacheKeys = await precache.keys();
    assert(
      precacheKeys.every((request) => !new URL(request.url).search),
      'Navigation query strings do not create precache variants',
    );

    harness.setFetch(async () =>
      serviceWorkerTestResponse('server error', { status: 503 }),
    );
    const failedNavigation = await harness.dispatchFetch(
      serviceWorkerTestRequest('/?utm_medium=validator', {
        mode: 'navigate',
        destination: 'document',
      }),
    );
    assert(
      (await responseText(failedNavigation.response)) === canonicalIndexBody,
      '5xx navigation falls back to the canonical cached index',
    );

    const notFoundResponse = serviceWorkerTestResponse('not found', {
      status: 404,
    });
    harness.setFetch(async () => notFoundResponse);
    const missingNavigation = await harness.dispatchFetch(
      serviceWorkerTestRequest('/missing', {
        mode: 'navigate',
        destination: 'document',
      }),
    );
    assert(
      missingNavigation.response === notFoundResponse &&
        missingNavigation.response.status === 404 &&
        (await responseText(missingNavigation.response)) === 'not found',
      '404 navigation responses pass through unchanged',
    );
  } catch (error) {
    fail('Service worker navigation VM scenario completes', error.message);
  }

  try {
    let timerFired = false;
    const harness = createServiceWorkerHarness({
      setTimeoutImpl(callback) {
        Promise.resolve().then(() => {
          timerFired = true;
          callback();
        });
        return 1;
      },
      clearTimeoutImpl() {},
    });
    await harness.dispatchInstall();
    harness.setFetch(
      (request, fetchOptions) =>
        new Promise((resolvePromise, rejectPromise) => {
          const rejectAsAborted = () => {
            const error = new Error('Synthetic navigation timeout');
            error.name = 'AbortError';
            rejectPromise(error);
          };
          if (fetchOptions?.signal?.aborted) rejectAsAborted();
          else
            fetchOptions?.signal?.addEventListener('abort', rejectAsAborted, {
              once: true,
            });
        }),
    );
    const timedOutNavigation = await harness.dispatchFetch(
      serviceWorkerTestRequest('/?utm_source=timeout', {
        mode: 'navigate',
        destination: 'document',
      }),
    );
    assert(
      timerFired &&
        (await responseText(timedOutNavigation.response)).startsWith(
          'precache:/index.html',
        ),
      'Navigation timeout aborts the request and serves the cached index',
    );
  } catch (error) {
    fail('Service worker timeout VM scenario completes', error.message);
  }

  try {
    const harness = createServiceWorkerHarness();
    const firstNetworkResponse = serviceWorkerTestResponse('runtime-v1');
    harness.setFetch(async () => firstNetworkResponse);
    const firstEvent = await harness.dispatchFetch(
      serviceWorkerTestRequest('/assets/query-normalized.webp?v=1', {
        destination: 'image',
      }),
    );
    await firstEvent.waitForBackground();
    assert(
      firstEvent.response === firstNetworkResponse,
      'Runtime cache miss returns the network response',
    );

    const runtimeName = (await harness.cacheStorage.caches.keys()).find(
      (name) => /^mm33-runtime-/.test(name),
    );
    const runtimeCache = await harness.cacheStorage.caches.open(runtimeName);
    const secondNetworkResponse = serviceWorkerTestResponse('runtime-v2');
    harness.setFetch(async () => secondNetworkResponse);
    const secondEvent = await harness.dispatchFetch(
      serviceWorkerTestRequest(
        '/assets/query-normalized.webp?v=2&utm_source=validator',
        { destination: 'image' },
      ),
    );
    assert(
      (await responseText(secondEvent.response)) === 'runtime-v1',
      'Runtime assets use stale-while-revalidate when cached',
    );
    await secondEvent.waitForBackground();
    const runtimeKeys = await runtimeCache.keys();
    assert(
      runtimeKeys.length === 1 &&
        runtimeKeys[0].url === 'https://sw.test/assets/query-normalized.webp',
      'Runtime cache keys normalize query strings',
    );
    assert(
      (await responseText(
        await runtimeCache.match(
          'https://sw.test/assets/query-normalized.webp',
        ),
      )) === 'runtime-v2',
      'Stale-while-revalidate refreshes the normalized runtime entry',
    );
  } catch (error) {
    fail(
      'Service worker stale-while-revalidate VM scenario completes',
      error.message,
    );
  }

  try {
    const harness = createServiceWorkerHarness();
    harness.setFetch(async () => serviceWorkerTestResponse('bootstrap'));
    const bootstrap = await harness.dispatchFetch(
      serviceWorkerTestRequest('/assets/bootstrap.webp', {
        destination: 'image',
      }),
    );
    await bootstrap.waitForBackground();
    const runtimeName = (await harness.cacheStorage.caches.keys()).find(
      (name) => /^mm33-runtime-/.test(name),
    );
    const runtimeCache = await harness.cacheStorage.caches.open(runtimeName);
    for (const request of await runtimeCache.keys())
      await runtimeCache.delete(request);
    for (let index = 0; index < 48; index += 1) {
      await runtimeCache.put(
        `https://sw.test/assets/runtime-${index}.webp`,
        serviceWorkerTestResponse(`seed-${index}`),
      );
    }
    harness.setFetch(async () => serviceWorkerTestResponse('newest'));
    const overflowEvent = await harness.dispatchFetch(
      serviceWorkerTestRequest('/assets/runtime-new.webp?version=1', {
        destination: 'image',
      }),
    );
    await overflowEvent.waitForBackground();
    const trimmedKeys = await runtimeCache.keys();
    assert(
      trimmedKeys.length === 48,
      'Runtime cache is capped at 48 entries',
      String(trimmedKeys.length),
    );
    assert(
      !trimmedKeys.some((request) =>
        request.url.endsWith('/assets/runtime-0.webp'),
      ) &&
        trimmedKeys.some((request) =>
          request.url.endsWith('/assets/runtime-new.webp'),
        ),
      'Runtime cache evicts the oldest entry when capped',
    );
  } catch (error) {
    fail('Service worker runtime-limit VM scenario completes', error.message);
  }

  try {
    const harness = createServiceWorkerHarness();
    const rangeEvent = await harness.dispatchFetch(
      serviceWorkerTestRequest('/assets/ranged.webp', {
        destination: 'image',
        headers: { Range: 'bytes=0-99' },
      }),
    );
    assert(
      !rangeEvent.handled && harness.state.fetchCalls.length === 0,
      'Range requests bypass service-worker routing',
    );

    const partialResponse = serviceWorkerTestResponse('partial bytes', {
      status: 206,
    });
    harness.setFetch(async () => partialResponse);
    const partialEvent = await harness.dispatchFetch(
      serviceWorkerTestRequest('/assets/partial.webp', {
        destination: 'image',
      }),
    );
    await partialEvent.waitForBackground();
    const runtimeName = (await harness.cacheStorage.caches.keys()).find(
      (name) => /^mm33-runtime-/.test(name),
    );
    const runtimeCache = await harness.cacheStorage.caches.open(runtimeName);
    assert(
      partialEvent.response === partialResponse &&
        !(await runtimeCache.match('https://sw.test/assets/partial.webp')),
      '206 responses remain available to the page and are not cached',
    );

    const variedResponse = serviceWorkerTestResponse('vary star', {
      headers: { Vary: '*' },
    });
    harness.setFetch(async () => variedResponse);
    const variedEvent = await harness.dispatchFetch(
      serviceWorkerTestRequest('/assets/vary-star.webp', {
        destination: 'image',
      }),
    );
    await variedEvent.waitForBackground();
    assert(
      variedEvent.response === variedResponse &&
        !(await runtimeCache.match('https://sw.test/assets/vary-star.webp')),
      'Vary:* responses remain available to the page and are not cached',
    );

    const cacheWriteFailureResponse = serviceWorkerTestResponse(
      'cache write failed but network succeeded',
    );
    harness.cacheStorage.storage.rejectNextPuts = 1;
    harness.setFetch(async () => cacheWriteFailureResponse);
    const cacheWriteFailureEvent = await harness.dispatchFetch(
      serviceWorkerTestRequest('/assets/cache-put-reject.webp', {
        destination: 'image',
      }),
    );
    await cacheWriteFailureEvent.waitForBackground();
    assert(
      cacheWriteFailureEvent.response === cacheWriteFailureResponse &&
        !(await runtimeCache.match(
          'https://sw.test/assets/cache-put-reject.webp',
        )),
      'Cache.put rejection does not discard a successful network response',
    );
  } catch (error) {
    fail('Service worker response-safety VM scenario completes', error.message);
  }
}

await runServiceWorkerBehaviorChecks();

// Unique IDs, aria-controls targets, skip link, and lightbox trigger semantics.
heading('Basic accessibility invariants');
const ids = Array.from(
  indexHtml.matchAll(/\bid\s*=\s*(["'])([^"']+)\1/gi),
  (match) => match[2],
);
const duplicateIds = Array.from(
  new Set(ids.filter((id, index) => ids.indexOf(id) !== index)),
);
assert(
  duplicateIds.length === 0,
  'Static HTML IDs are unique',
  duplicateIds.join(', '),
);
const idSet = new Set(ids);
const missingControlledIds = [];
for (const match of indexHtml.matchAll(
  /\baria-controls\s*=\s*(["'])([^"']+)\1/gi,
)) {
  for (const controlledId of match[2].trim().split(/\s+/)) {
    if (!idSet.has(controlledId)) missingControlledIds.push(controlledId);
  }
}
assert(
  missingControlledIds.length === 0,
  'Every aria-controls value references an existing ID',
  missingControlledIds.join(', '),
);

const menuToggle =
  indexHtml.match(/<button\b[^>]*\bdata-nav-toggle\b[^>]*>/i)?.[0] || '';
assert(Boolean(menuToggle), 'Mobile menu uses a button toggle');
assert(
  /\baria-expanded=["']false["']/i.test(menuToggle),
  'Mobile menu exposes its collapsed state',
);
assert(
  /\baria-controls=["']site-nav["']/i.test(menuToggle) && idSet.has('site-nav'),
  'Mobile menu toggle controls #site-nav',
);

const slideTriggers = Array.from(
  indexHtml.matchAll(
    /<(button|div)\b([^>]*\bclass\s*=\s*(["'])[^"']*\bslide__img\b[^"']*\3[^>]*)>/gi,
  ),
);
assert(slideTriggers.length > 0, 'Static carousel contains lightbox triggers');
assert(
  slideTriggers.every(
    (match) =>
      match[1].toLowerCase() === 'button' &&
      /\btype=["']button["']/i.test(match[2]) &&
      /\baria-label=/i.test(match[2]),
  ),
  'Every lightbox trigger is a labelled button',
);
assert(
  /setAttribute\(\s*['"]role['"]\s*,\s*['"]dialog['"]\s*\)/.test(mainSource),
  'Lightbox exposes dialog semantics',
);
assert(
  /setAttribute\(\s*['"]aria-modal['"]\s*,\s*['"]true['"]\s*\)/.test(
    mainSource,
  ),
  'Lightbox is marked as modal',
);
assert(
  /e\.key\s*===\s*['"]Escape['"]/.test(mainSource),
  'Keyboard Escape is handled',
);
assert(
  /\.focus\s*\(/.test(mainSource),
  'Interactive overlays manage keyboard focus',
);

console.log(`\n${passed} checks passed; ${failures.length} failed.`);
if (failures.length > 0) {
  console.error('\nValidation failures:');
  failures.forEach((message, index) =>
    console.error(`  ${index + 1}. ${message}`),
  );
  process.exitCode = 1;
}
