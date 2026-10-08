import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const output = path.resolve('public/assets');
await fs.mkdir(output, { recursive: true });
const assets = [
  ['logo-group.png', 'https://sandhousehospitality.com/wp-content/uploads/2024/07/logo-1-2.png', 600],
  ['mark-group.png', 'https://sandhousehospitality.com/wp-content/uploads/2024/07/logo-1-1.png', 128],
  ['logo-sandburgs.png', 'https://sandhousehospitality.com/wp-content/uploads/2024/09/sandburgs-new-logo.png', 600],
  ['logo-canteen.png', 'https://sandhousehospitality.com/wp-content/uploads/2024/07/canteen-1.png', 600],
  ['logo-diner.png', 'https://sandhousehospitality.com/wp-content/uploads/2024/07/Sandhouse_Vertical-CC-1.png', 600],
  ['sandburgs-food.webp', 'https://sandhousehospitality.com/wp-content/uploads/2024/09/food-1-1.jpg', 1400],
  ['sandburgs-shake.webp', 'https://sandhousehospitality.com/wp-content/uploads/2024/09/food-4-1.jpg', 1000],
  ['canteen-food.webp', 'https://sandhousehospitality.com/wp-content/uploads/2024/09/food-4.jpg', 1200],
  ['canteen-chai.webp', 'https://sandhousehospitality.com/wp-content/uploads/2024/09/food-5.jpg', 1000],
  ['diner-venue.webp', 'https://sandhousehospitality.com/wp-content/uploads/2024/09/sandhouse-place.jpg', 1600],
  ['diner-food.webp', 'https://sandhousehospitality.com/wp-content/uploads/2024/09/the-food-1-1.jpg', 1000],
  ['diner-moment.webp', 'https://sandhousehospitality.com/wp-content/uploads/2024/09/moment-1.jpg', 1100],
  ['diner-moment-2.webp', 'https://sandhousehospitality.com/wp-content/uploads/2024/09/moment-2.jpg', 1100],
  ['story-original.webp', 'https://sandhousehospitality.com/wp-content/uploads/2024/08/Group-8-2-2.png', 1400],
];

const sourceManifest = [];
for (const [filename, url, width] of assets) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Asset download failed: ${url} (${response.status})`);
  const input = Buffer.from(await response.arrayBuffer());
  const image = sharp(input).resize({ width, withoutEnlargement: true });
  await (filename.endsWith('.png') ? image.png() : image.webp({ quality: 88 })).toFile(path.join(output, filename));
  sourceManifest.push({ filename, source: url, kind: 'Official Sandhouse website asset' });
}

const generated = [
  ['hero-food.webp', 'sources/generated/burger-hero-concept.png', 1536],
  ['canteen-concept.webp', 'sources/generated/canteen-bread-rolls-concept.png', 1448],
  ['diner-pizza-concept.webp', 'sources/generated/diner-pizza-concept.png', 1536],
];
for (const [filename, input, width] of generated) {
  await sharp(input).resize({ width }).webp({ quality: 88 }).toFile(path.join(output, filename));
  sourceManifest.push({ filename, source: input, kind: 'AI-generated creative concept, guided by official food references' });
}

const fontCss = await (await fetch('https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@1&display=swap')).text();
const fontFiles = [...fontCss.matchAll(/url\(['"]?(\/\/[^'"\)]+\.woff2)['"]?\)/g)].map((m) => `https:${m[1]}`);
if (fontFiles.length < 1) throw new Error('Fontshare returned no font asset');
await fs.mkdir(path.join(output, 'fonts'), { recursive: true });
await fs.writeFile(path.join(output, 'fonts/CabinetGrotesk-Variable.woff2'), Buffer.from(await (await fetch(fontFiles[0])).arrayBuffer()));
if (fontFiles[1]) await fs.writeFile(path.join(output, 'fonts/Supreme-Variable.woff2'), Buffer.from(await (await fetch(fontFiles[1])).arrayBuffer()));

await sharp({ create: { width: 64, height: 64, channels: 4, background: '#191a19' } })
  .composite([{ input: await sharp(path.join(output, 'mark-group.png')).resize(46, 46, { fit: 'inside' }).png().toBuffer(), gravity: 'centre' }])
  .png().toFile(path.join(output, 'favicon.png'));

await fs.writeFile('sources/asset-manifest.json', JSON.stringify(sourceManifest, null, 2));
console.log(`Prepared ${sourceManifest.length} optimized food and brand assets and self-hosted fonts.`);
