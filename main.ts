import { copyFileSync, existsSync, mkdirSync, renameSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, 'entry.png');
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const target = join(outDir, 'entry.png');

if (!existsSync(source)) {
  console.error(`news-image-20261121: entry.png is missing beside main.ts (${source})`);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
// Copy to a temp file and rename, so a partial write never leaves a
// corrupt entry.png behind; then confirm the output is really there.
const temp = join(outDir, `.entry.png.tmp-${process.pid}`);
copyFileSync(source, temp);
renameSync(temp, target);
const bytes = statSync(target).size;
if (bytes === 0) {
  console.error('news-image-20261121: entry.png was written empty');
  process.exit(1);
}
