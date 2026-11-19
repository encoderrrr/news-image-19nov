// news-image-20261119 entry.
// Copies the 19 November 2026 front page (entry.png, shipped in this repo)
// to the grader's output directory as entry.png.
import { closeSync, copyFileSync, existsSync, mkdirSync, openSync, readSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "out";
mkdirSync(outDir, { recursive: true });

const src = join(here, "entry.png");
if (!existsSync(src)) {
  throw new Error("entry.png missing next to main.ts");
}
const fd = openSync(src, "r");
const head = Buffer.alloc(8);
const read = readSync(fd, head, 0, 8, 0);
closeSync(fd);
const isPng = read >= 8 && head[0] === 0x89 && head[1] === 0x50 && head[2] === 0x4e && head[3] === 0x47;
const isJpeg = read >= 3 && head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff;
if (!isPng && !isJpeg) {
  throw new Error("entry.png is neither PNG nor JPEG (bad magic bytes)");
}
console.log(`entry.png format: ${isPng ? "PNG" : "JPEG"}`);
const dest = join(outDir, "entry.png");
copyFileSync(src, dest);
const bytes = statSync(dest).size;
if (bytes === 0 || bytes > 1048576) {
  throw new Error(`entry.png output is ${bytes} bytes, expected 1..1048576`);
}
console.log(`wrote ${dest} (${bytes} bytes)`);
