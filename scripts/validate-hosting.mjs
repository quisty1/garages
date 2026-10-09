// Exercise the exported .htaccess with real Apache, including Timeweb's proxy header.
import { spawn } from 'node:child_process';
import {
  existsSync,
  mkdtempSync,
  writeFileSync,
  readFileSync,
  rmSync,
} from 'node:fs';
import { createServer } from 'node:net';
import { request as httpRequest } from 'node:http';
import { tmpdir, userInfo } from 'node:os';
import { join, resolve } from 'node:path';
import assert from 'node:assert/strict';
import { setTimeout as delay } from 'node:timers/promises';

const apache = ['/usr/sbin/httpd', '/usr/sbin/apache2'].find(existsSync);
assert(apache, 'Apache 2.4 is required (apt-get install apache2 on Linux)');
const modules = existsSync('/usr/libexec/apache2')
  ? '/usr/libexec/apache2'
  : '/usr/lib/apache2/modules';
const mimeTypes = existsSync('/etc/apache2/mime.types')
  ? '/etc/apache2/mime.types'
  : '/etc/mime.types';
const documentRoot = resolve('out');
assert(existsSync(join(documentRoot, 'index.html')), 'Run npm run build first');
const directory = mkdtempSync(join(tmpdir(), 'mm33-hosting-'));
const socket = createServer();
await new Promise((resolve) => socket.listen(0, '127.0.0.1', resolve));
const port = socket.address().port;
await new Promise((resolve) => socket.close(resolve));
const config = join(directory, 'httpd.conf');
writeFileSync(
  config,
  `ServerRoot "${directory}"
ServerName localhost
Listen 127.0.0.1:${port}
PidFile "${directory}/httpd.pid"
ErrorLog "${directory}/error.log"
LoadModule mpm_event_module "${modules}/mod_mpm_event.so"
${existsSync(join(modules, 'mod_unixd.so')) ? `LoadModule unixd_module "${modules}/mod_unixd.so"` : ''}
LoadModule authz_core_module "${modules}/mod_authz_core.so"
LoadModule dir_module "${modules}/mod_dir.so"
LoadModule mime_module "${modules}/mod_mime.so"
LoadModule rewrite_module "${modules}/mod_rewrite.so"
LoadModule headers_module "${modules}/mod_headers.so"
User ${userInfo().username}
Group "#${process.getgid()}"
TypesConfig "${mimeTypes}"
DocumentRoot "${documentRoot}"
<Directory "${documentRoot}">
  AllowOverride All
  Require all granted
</Directory>
`,
);
let log = '';
const server = spawn(apache, ['-f', config, '-D', 'FOREGROUND']);
server.stderr.on('data', (data) => (log += data));
// Node's fetch overrides Host; use HTTP directly to exercise the actual vhost headers.
const request = (path, headers = {}) =>
  new Promise((resolve, reject) => {
    const req = httpRequest(
      {
        hostname: '127.0.0.1',
        port,
        path,
        headers: { Host: 'metallmontage33.ru', 'X-HTTPS': '1', ...headers },
        signal: AbortSignal.timeout(5000),
      },
      (res) => {
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('error', reject);
        res.on('end', () =>
          resolve(
            new Response(Buffer.concat(chunks), {
              status: res.statusCode,
              headers: res.headers,
            }),
          ),
        );
      },
    );
    req.on('error', reject);
    req.end();
  });

try {
  let ready = false;
  for (let attempt = 0; attempt < 50; attempt++) {
    if (server.exitCode !== null) throw new Error(`Apache failed: ${log}`);
    try {
      await request('/');
      ready = true;
      break;
    } catch {
      await delay(100);
    }
  }
  assert(ready, `Apache did not start: ${log}`);

  const sitemapPaths = [
    ...readFileSync(join(documentRoot, 'sitemap.xml'), 'utf8').matchAll(
      /<loc>(.*?)<\/loc>/g,
    ),
  ].map((match) => new URL(match[1]).pathname);
  assert.equal(sitemapPaths.length, 13);
  const redirects = [
    ['/', { 'X-HTTPS': '0' }, '/'],
    ['/', { Host: 'www.metallmontage33.ru' }, '/'],
    ['/catalog?utm_source=test', {}, '/catalog/?utm_source=test'],
    [
      '/catalog',
      { Host: 'www.metallmontage33.ru', 'X-HTTPS': '0' },
      '/catalog/',
    ],
    ['/index.html', {}, '/'],
    ['/blog/index.html?x=1', {}, '/blog/?x=1'],
    [
      '/catalog/garazhi/index.html',
      { Host: 'www.metallmontage33.ru' },
      '/catalog/garazhi/',
    ],
    ['//', {}, '/'],
    ...sitemapPaths.flatMap((path) => [
      [path, { Host: 'www.metallmontage33.ru', 'X-HTTPS': '0' }, path],
      [
        `${path}index.html?utm_source=seo`,
        { Host: 'www.metallmontage33.ru' },
        `${path}?utm_source=seo`,
      ],
      ...(path === '/'
        ? []
        : [[`${path.slice(0, -1)}?x=1`, {}, `${path}?x=1`]]),
    ]),
  ];
  for (const [path, headers, target] of redirects) {
    const response = await request(path, headers);
    assert.equal(response.status, 301, `redirect status for ${path}`);
    assert.equal(
      response.headers.get('location'),
      `https://metallmontage33.ru${target}`,
    );
    await response.arrayBuffer();
  }
  for (const path of sitemapPaths) {
    const response = await request(path);
    assert.equal(
      response.status,
      200,
      `canonical page ${path}: ${response.headers.get('location')}`,
    );
    assert.equal(
      response.headers.get('location'),
      null,
      `no proxy redirect loop: ${path}`,
    );
    await response.arrayBuffer();
  }
  for (const path of [
    '/missing-seo-page/',
    '/blog/missing/',
    '/404.html',
    '/404/',
    '/_not-found/',
  ]) {
    const response = await request(path);
    assert.equal(response.status, 404, `real error status: ${path}`);
    assert.match(
      await response.text(),
      /Страница не найдена/,
      `custom error body: ${path}`,
    );
  }
  for (const path of [
    '/index.txt',
    '/blog/index.txt',
    '/blog/__next._tree.txt',
  ]) {
    const response = await request(path);
    assert.equal(response.status, 200, `RSC remains available: ${path}`);
    assert.match(
      response.headers.get('x-robots-tag') || '',
      /noindex/,
      `RSC excluded: ${path}`,
    );
    await response.arrayBuffer();
  }
  for (const path of ['/robots.txt', '/sitemap.xml']) {
    const response = await request(path);
    assert.equal(response.status, 200);
    assert.equal(
      response.headers.get('x-robots-tag'),
      null,
      `discovery file: ${path}`,
    );
    await response.arrayBuffer();
  }
  console.log(
    'Hosting checks passed: canonical redirects, proxy HTTPS, custom 404 and RSC noindex.',
  );
} catch (error) {
  const errorLog = join(directory, 'error.log');
  if (existsSync(errorLog)) console.error(readFileSync(errorLog, 'utf8'));
  throw error;
} finally {
  server.kill('SIGTERM');
  await new Promise((resolve) => {
    if (server.exitCode !== null) resolve();
    else server.once('exit', resolve);
  });
  rmSync(directory, { recursive: true, force: true });
}
