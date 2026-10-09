// Generate display variants; retain the originals for lightbox and social previews.
import sharp from 'sharp';
import { readFileSync, readdirSync, statSync } from 'node:fs';

const photos = [
  ...new Set(
    [
      ...readFileSync('lib/site-data.ts', 'utf8').matchAll(
        /img: '(\/assets\/(?:garage-|canopy-)[^']+)'/g,
      ),
    ].map((match) => `public${match[1]}`),
  ),
];
const landings = readdirSync('public/assets/landings')
  .filter((name) => name.endsWith('-1280.webp') && !name.includes('-display-'))
  .map((name) => `public/assets/landings/${name}`);

let variants = 0;
let bytes = 0;
for (const source of [...photos, ...landings]) {
  const { width } = await sharp(source).metadata();
  const isLanding = source.includes('/landings/');
  const base = isLanding
    ? source.replace('-1280.webp', '')
    : source.replace('.webp', '');
  const widths = isLanding
    ? [640, 768, 960, 1280]
    : source.includes('-project-')
      ? [560, 960, width]
      : [560, 768, 1024, width];
  for (const size of widths) {
    const target = `${base}-display-${size}.webp`;
    await sharp(source)
      .resize({ width: size, withoutEnlargement: true })
      .webp({ quality: 76, effort: 6 })
      .toFile(target);
    bytes += statSync(target).size;
    variants++;
  }
}
console.log(
  `Prepared ${variants} display images (${Math.round(bytes / 1024)} KiB). Originals retained.`,
);
