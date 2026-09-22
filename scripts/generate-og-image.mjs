import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'public', 'assets');
const outPath = path.join(outDir, 'og-default.png');

mkdirSync(outDir, { recursive: true });

async function main() {
  const svg = path.join(outDir, 'og-default.svg');
  await sharp(svg, { density: 144 }).resize(1200, 630).png().toFile(outPath);
  console.log(`[og] wrote ${path.relative(root, outPath)}`);
}

main().catch((err) => {
  console.error('[og] failed:', err);
  process.exitCode = 1;
});
