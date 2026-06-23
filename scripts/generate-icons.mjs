import sharp from 'sharp';
import toIco from 'to-ico';
import { writeFile, unlink, rename } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
/** Hero logo — ближе к квадрату, лучше заполняет иконку. */
const source = join(root, 'assets/logo-hero.webp');
const bg = { r: 30, g: 30, b: 34, alpha: 1 };

/** ~4% отступ от края — защита от скругления iOS, без «уменьшения» логотипа. */
const INSET = 0.04;

async function makeSquareIcon(size) {
  const inner = Math.round(size * (1 - INSET * 2));

  const logo = await sharp(source)
    .trim()
    .resize(inner, inner, { fit: 'cover', position: 'centre' })
    .toBuffer();

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: bg,
    },
  }).composite([{ input: logo, gravity: 'center' }]);
}

const outputs = [
  { size: 48, path: 'assets/favicon-48.png' },
  { size: 96, path: 'assets/favicon-96.png' },
  { size: 180, path: 'assets/apple-touch-icon.png' },
  { size: 192, path: 'assets/icon-192.png' },
  { size: 512, path: 'assets/icon-512.png' },
];

for (const { size, path } of outputs) {
  await (await makeSquareIcon(size)).png().toFile(join(root, path));
  console.log('wrote', path);
}

for (const size of [192, 512]) {
  const finalPath = join(root, `assets/icon-${size}.webp`);
  const tempPath = join(root, `assets/icon-${size}.tmp.webp`);
  await (await makeSquareIcon(size)).webp({ quality: 90 }).toFile(tempPath);
  try {
    await unlink(finalPath);
  } catch {
    /* first run */
  }
  await rename(tempPath, finalPath);
  console.log('wrote', `assets/icon-${size}.webp`);
}

const icoBuffers = await Promise.all(
  [16, 32, 48].map(async (size) =>
    (await makeSquareIcon(size)).png().toBuffer(),
  ),
);
await writeFile(join(root, 'favicon.ico'), await toIco(icoBuffers));
console.log('wrote favicon.ico');
