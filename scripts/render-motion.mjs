import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import ffmpeg from 'ffmpeg-static';

// These are original motion graphics made from still concepts and official photos,
// not footage claimed to have been shot in the restaurants.
const out = path.resolve('public/assets');
const staging = path.resolve('.asset-staging');
await fs.mkdir(staging, { recursive: true });
const run = (args) => new Promise((resolve, reject) => {
  const process = spawn(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: ['ignore', 'ignore', 'pipe'] });
  let error = '';
  process.stderr.on('data', chunk => { error += chunk; });
  process.on('error', reject);
  process.on('exit', code => code === 0 ? resolve() : reject(new Error(error || `FFmpeg exited ${code}`)));
});

async function loop(input, name, width, height, seconds = 8) {
  const frames = seconds * 24;
  const video = path.join(staging, name);
  await run(['-loop', '1', '-framerate', '24', '-i', path.join(out, input), '-t', String(seconds),
    '-vf', `scale=2560:-1,zoompan=z='1.06+0.025*sin(on*2*PI/${frames})':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=1:s=${width}x${height}:fps=24,format=yuv420p`,
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '22', '-threads', '2', '-an', '-movflags', '+faststart', video]);
  await fs.rename(video, path.join(out, name));
  console.log(`Rendered ${name}`);
}

if (!process.argv.includes('--film-only')) {
  await loop('hero-food.webp', 'burger-loop.mp4', 1280, 854);
  await loop('canteen-concept.webp', 'canteen-loop.mp4', 1280, 960);
}

// Use the food-preparation footage already published by the group for the hero.
const officialVideoUrl = 'https://sandhousehospitality.com/wp-content/uploads/2024/07/5f06-4f85-9c90-66fe8d2bfc80.mp4';
const officialSource = path.join(staging, 'official-food-film.mp4');
try { await fs.access(officialSource); } catch {
  const response = await fetch(officialVideoUrl);
  if (!response.ok) throw new Error(`Official film download failed (${response.status})`);
  await fs.writeFile(officialSource, Buffer.from(await response.arrayBuffer()));
}
let heroExists = false;
try { await fs.access(path.join(out, 'official-food-loop.mp4')); await fs.access(path.join(out, 'official-food-poster.webp')); heroExists = true; } catch { /* Prepare both assets below. */ }
if (!process.argv.includes('--film-only') || !heroExists) {
  await run(['-i', officialSource, '-vf', 'fps=24,scale=1476:-2', '-c:v', 'libx264', '-preset', 'fast', '-crf', '24', '-threads', '2', '-an', '-movflags', '+faststart', path.join(out, 'official-food-loop.mp4')]);
  const poster = path.join(staging, 'official-food-poster.png');
  await run(['-ss', '0.8', '-i', officialSource, '-frames:v', '1', poster]);
  await sharp(poster).webp({ quality: 90 }).toFile(path.join(out, 'official-food-poster.webp'));
}
console.log('Prepared the original food film for the hero');

// A composed 16:9 brand reel with legible type and source logos.
const scenes = [
  { image: 'hero-food.webp', logo: 'logo-sandburgs.png', lines: ['Your everyday', 'gourmet.'], title: 'Sandburgs', bg: '#fffaed', ink: '#191a19', accent: '#d94328', file: 'film-burger.png' },
  { image: 'canteen-concept.webp', logo: 'logo-canteen.png', lines: ['Comfort,', 'by the bite.'], title: 'The Canteen Project', bg: '#fffaed', ink: '#191a19', accent: '#d5433a', file: 'film-canteen.png' },
  { image: 'diner-venue.webp', logo: 'logo-diner.png', lines: ['Stay a little', 'longer.'], title: 'Sandhouse All Day Diner', bg: '#854617', ink: '#fffaed', accent: '#fffaed', file: 'film-diner.png' },
];
for (const scene of scenes) {
  const photo = await sharp(path.join(out, scene.image)).resize(1080, 1080, { fit: 'cover' }).png().toBuffer();
  const logo = await sharp(path.join(out, scene.logo)).resize({ width: scene.title === 'Sandhouse All Day Diner' ? 185 : 360, height: 190, fit: 'inside' }).png().toBuffer();
  const overlay = Buffer.from(`<svg width="1920" height="1080"><rect x="0" y="0" width="16" height="1080" fill="${scene.title === 'The Canteen Project' ? '#ecb722' : scene.accent}"/><text x="82" y="500" fill="${scene.accent}" font-size="86" font-family="Arial" font-weight="bold" letter-spacing="-4">${scene.lines[0]}</text><text x="82" y="595" fill="${scene.accent}" font-size="86" font-family="Arial" font-weight="bold" letter-spacing="-4">${scene.lines[1]}</text><text x="86" y="704" fill="${scene.ink}" font-size="25" font-family="Arial">${scene.title}</text><line x1="86" y1="887" x2="741" y2="887" stroke="${scene.ink}" stroke-opacity=".25"/><text x="86" y="947" fill="${scene.ink}" font-size="18" font-family="Arial" letter-spacing="3">THE SANDHOUSE FAMILY</text><text x="86" y="991" fill="${scene.ink}" font-size="18" font-family="Arial">From our table to yours.</text></svg>`);
  await sharp({ create: { width: 1920, height: 1080, channels: 3, background: scene.bg } }).composite([{ input: photo, top: 0, left: 840 }, { input: overlay }, { input: logo, top: 100, left: 82 }]).png().toFile(path.join(staging, scene.file));
}
await sharp(path.join(staging, scenes[0].file)).resize({ width: 1600 }).webp({ quality: 88 }).toFile(path.join(out, 'film-poster.webp'));
const filters = scenes.map((_, i) => `[${i}:v]scale=2560:-1,zoompan=z='1.01+on*0.00022':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=1:s=1280x720:fps=24,format=yuv420p,setpts=PTS-STARTPTS[v${i}]`).join(';') + ';[v0][v1]xfade=transition=fade:duration=0.65:offset=3.75[x];[x][v2]xfade=transition=fade:duration=0.65:offset=7.5[film]';
const inputs = scenes.flatMap(scene => ['-loop', '1', '-framerate', '24', '-t', '4.4', '-i', path.join(staging, scene.file)]);
await run([...inputs, '-filter_complex', filters, '-map', '[film]', '-t', '11.9', '-c:v', 'libx264', '-preset', 'fast', '-crf', '21', '-threads', '2', '-an', '-movflags', '+faststart', path.join(staging, 'sandhouse-film.mp4')]);
await fs.rename(path.join(staging, 'sandhouse-film.mp4'), path.join(out, 'sandhouse-film.mp4'));
console.log('Rendered sandhouse-film.mp4');
await fs.writeFile('sources/motion-assets.json', JSON.stringify({
  method: 'FFmpeg-composed motion graphics from AI concept stills and official website imagery',
  videos: ['official-food-loop.mp4', 'burger-loop.mp4', 'canteen-loop.mp4', 'sandhouse-film.mp4'],
  officialFootage: { filename: 'official-food-loop.mp4', source: officialVideoUrl },
  palettes: { group: ['#191a19', '#ef7f1a'], sandburgs: ['#d94328', '#fffaed'], canteen: ['#d5433a', '#ecb722', '#fffaed'], diner: ['#854617', '#fffaed'] },
  audio: 'Silent for website playback',
  generatedRestaurantFootage: false,
}, null, 2));
