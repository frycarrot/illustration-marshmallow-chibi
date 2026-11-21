#!/usr/bin/env node
// SVG -> PNG (optional helper; the skill works without it).
//
//   node scripts/render.mjs card.svg card.png                  # 2x render
//   node scripts/render.mjs card.svg face.png --zoom x,y,w,h --scale 6
//   node scripts/render.mjs --sheet sheet.png a.svg b.svg c.svg
//
// Uses Playwright when it can be found (PLAYWRIGHT_NODE_MODULES or ./node_modules);
// otherwise falls back to a headless Chrome/Chromium on PATH (or CHROME=/path/to/chrome).
// Filters (blur, turbulence) need a real browser engine: rsvg/inkscape output will differ.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';

const args = process.argv.slice(2);
const opt = (k) => { const i = args.indexOf(k); if (i < 0) return null; const v = args[i + 1]; args.splice(i, 2); return v; };
const sheet = opt('--sheet');
const zoom = opt('--zoom');
const scale = Number(opt('--scale') || 2);

const size = (svg) => {
  const m = svg.match(/viewBox="([-\d.\s]+)"/);
  const [, , w, h] = m ? m[1].trim().split(/\s+/).map(Number) : [0, 0, 480, 360];
  return { w, h };
};

let html, W, H, outFile;
if (sheet) {
  const cell = 480, cols = Math.min(3, args.length);
  const figs = args.map((f) => {
    const svg = fs.readFileSync(f, 'utf8'); const { w, h } = size(svg);
    return `<figure style="margin:0"><div style="line-height:0">${svg.replace('<svg', `<svg width="${cell}" height="${cell * h / w}"`)}</div><figcaption style="font:12px monospace;padding:4px 0">${path.basename(f)}</figcaption></figure>`;
  });
  W = cols * (cell + 16) + 16; H = Math.ceil(args.length / cols) * (cell * 0.75 + 40) + 16;
  html = `<body style="margin:16px;background:#fff;display:grid;grid-template-columns:repeat(${cols},${cell}px);gap:16px">${figs.join('')}</body>`;
  outFile = sheet;
} else {
  const [inFile, o] = args;
  if (!inFile || !o) { console.error('usage: render.mjs in.svg out.png [--zoom x,y,w,h] [--scale n]'); process.exit(1); }
  let svg = fs.readFileSync(inFile, 'utf8'); ({ w: W, h: H } = size(svg));
  if (zoom) { const [x, y, w, h] = zoom.split(',').map(Number); svg = svg.replace(/viewBox="[^"]*"/, `viewBox="${x} ${y} ${w} ${h}"`); W = w; H = h; }
  html = `<body style="margin:0">${svg.replace('<svg', `<svg width="${W}" height="${H}" style="display:block"`)}</body>`;
  outFile = o;
}

async function playwright() {
  const bases = [process.env.PLAYWRIGHT_NODE_MODULES, path.join(process.cwd(), 'node_modules')].filter(Boolean);
  for (const b of bases) { const req = createRequire(path.join(b, 'noop.js')); for (const n of ['playwright', 'playwright-core', '@playwright/test']) { try { return req(n).chromium; } catch {} } }
  for (const n of ['playwright', 'playwright-core']) { try { return (await import(n)).chromium; } catch {} }
  return null;
}

const chromium = await playwright();
if (chromium) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ deviceScaleFactor: scale, viewport: { width: Math.ceil(W), height: Math.ceil(H) } });
  await page.setContent(html);
  await page.screenshot({ path: outFile, fullPage: !!sheet });
  await browser.close();
} else {
  const bins = [process.env.CHROME, 'chromium', 'chromium-browser', 'google-chrome', 'google-chrome-stable',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', 'C:/Program Files/Google/Chrome/Application/chrome.exe'].filter(Boolean);
  const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'fz-')), 'page.html');
  fs.writeFileSync(tmp, html);
  let done = false;
  for (const bin of bins) {
    try {
      execFileSync(bin, ['--headless', '--no-sandbox', '--disable-gpu', '--hide-scrollbars', `--force-device-scale-factor=${scale}`,
        `--window-size=${Math.ceil(W)},${Math.ceil(H)}`, `--screenshot=${path.resolve(outFile)}`, `file://${tmp}`], { stdio: 'ignore' });
      done = true; break;
    } catch {}
  }
  if (!done) { console.error('No Playwright or Chrome found. Install one, or set CHROME=/path/to/chrome.'); process.exit(1); }
}
console.log('ok', outFile);
