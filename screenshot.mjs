// Screenshot helper for the frontend design review loop.
// Usage: node screenshot.mjs <url> [label]
//   node screenshot.mjs http://localhost:3000
//   node screenshot.mjs http://localhost:3000 hero-v2
//
// Saves to "./temporary screeenshots/screenshot-N.png" (or "-label" suffixed),
// auto-incrementing N so previous screenshots are never overwritten.
import puppeteer from "puppeteer";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(ROOT, "temporary screeenshots");

const [, , url, label] = process.argv;
if (!url) {
  console.error("Usage: node screenshot.mjs <url> [label]");
  process.exit(1);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

// Find the next free screenshot-N index.
const existing = fs.readdirSync(OUT_DIR);
let n = 1;
for (const f of existing) {
  const m = f.match(/^screenshot-(\d+)(?:-.+)?\.png$/);
  if (m) n = Math.max(n, parseInt(m[1], 10) + 1);
}

const filename = `screenshot-${n}${label ? `-${label}` : ""}.png`;
const outPath = path.join(OUT_DIR, filename);

const browser = await puppeteer.launch({
  headless: true,
  defaultViewport: { width: 1440, height: 900 },
});

try {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle0" });
  await page.screenshot({ path: outPath, fullPage: true });
  console.log(`Saved ${outPath}`);
} finally {
  await browser.close();
}
