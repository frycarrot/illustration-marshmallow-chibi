#!/usr/bin/env node
// Zero-dependency checks for a marshmallow-chibi card.   node scripts/lint.mjs card.svg [--prefix xx-]
import fs from 'node:fs';

const args = process.argv.slice(2);
const pi = args.indexOf('--prefix');
const prefix = pi >= 0 ? args.splice(pi, 2)[1] : null;
const file = args[0];
if (!file) { console.error('usage: lint.mjs card.svg [--prefix xx-]'); process.exit(1); }
const svg = fs.readFileSync(file, 'utf8');
const errors = [], warns = [];
const E = (m) => errors.push(m), W = (m) => warns.push(m);

const vb = svg.match(/<svg[^>]*viewBox="0 0 (\d+) (\d+)"/);
if (!vb) E('root <svg> needs viewBox="0 0 480 360" (or 360 360)');
if (!/<svg[^>]*xmlns="http:\/\/www\.w3\.org\/2000\/svg"/.test(svg)) E('root <svg> needs xmlns="http://www.w3.org/2000/svg"');
if (!/<title>[^<]+<\/title>/.test(svg)) W('add a <title>');
for (const [re, msg] of [[/<script[\s>]/, '<script>'], [/<image[\s>]/, '<image>'], [/<foreignObject[\s>]/, '<foreignObject>'],
  [/href="(https?:|data:)/, 'external or data href'], [/url\((?!#)/, 'url() that is not a local #id'], [/<text[\s>]/, 'visible <text>']]) if (re.test(svg)) E(`forbidden: ${msg}`);

// ids & references
const ids = [...svg.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
const dup = ids.filter((v, i) => ids.indexOf(v) !== i);
if (dup.length) E(`duplicate ids: ${[...new Set(dup)].join(', ')}`);
if (prefix) { const bad = ids.filter((i) => !i.startsWith(prefix)); if (bad.length) E(`ids without prefix ${prefix}: ${bad.slice(0, 6).join(', ')}`); }
for (const m of svg.matchAll(/url\(#([^)]+)\)/g)) if (!ids.includes(m[1])) E(`url(#${m[1]}) points to a missing id`);

// the three-layer technique
const filters = [...svg.matchAll(/<filter\b[\s\S]*?<\/filter>/g)].map((m) => m[0]);
const softF = filters.filter((f) => /feGaussianBlur/.test(f) && /feDisplacementMap/.test(f));
if (!softF.length) E('no grainy soft filter (feGaussianBlur + feTurbulence + feDisplacementMap) found');
for (const f of filters) { if (/feGaussianBlur/.test(f) && !/\swidth="(1[3-9]\d|[2-9]\d\d)%"/.test(f) && !/width="100%"/.test(f)) W('a blur filter has a tight region: use x="-40%" y="-40%" width="180%" height="180%" so edges are not clipped'); }
const usesSoft = softF.some((f) => { const id = f.match(/id="([^"]+)"/)?.[1]; return id && new RegExp(`filter="url\\(#${id}\\)"`).test(svg); });
if (softF.length && !usesSoft) E('the soft filter is defined but never applied');
if (!/<ellipse[^>]*rx="4(\.\d+)?"[^>]*ry="6(\.\d+)?"|stroke-linecap="round"/.test(svg)) W('no crisp ink found (eyes, whiskers, mouth)');
// ink must not sit inside a filtered group: rough check on whisker paths
const whisk = svg.indexOf('M42 6 L76 -1');
if (whisk > 0) { const before = svg.slice(0, whisk); const open = (before.match(/<g[^>]*filter=/g) || []).length; const lastOpen = before.lastIndexOf('<g'); if (/filter=/.test(before.slice(lastOpen, before.indexOf('>', lastOpen)))) E('whiskers are inside a filtered group: ink must stay crisp'); }
if (!/feTurbulence[^>]*baseFrequency="\.8|baseFrequency="0\.8/.test(svg)) W('no whole-card grain overlay found');

// colour: rough chroma check on fills/strokes (background excluded: first rect)
const hexes = [...svg.matchAll(/(?:fill|stroke|stop-color)="(#[0-9a-fA-F]{6})"/g)].map((m) => m[1].toUpperCase());
const chroma = (h) => { const n = parseInt(h.slice(1), 16); const c = [n >> 16 & 255, n >> 8 & 255, n & 255]; return Math.max(...c) - Math.min(...c); };
const hsl = (h) => { const n = parseInt(h.slice(1), 16); const [r, g, b] = [n >> 16 & 255, n >> 8 & 255, n & 255].map((v) => v / 255);
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2; const s = mx === mn ? 0 : (mx - mn) / (1 - Math.abs(2 * l - 1)); return [s, l]; };
// dopamine rule: colours are clean — no greyish mid-tones (low saturation at mid lightness), ink excepted
const muddy = [...new Set(hexes)].filter((h) => { const [s, l] = hsl(h); return l > 0.25 && l < 0.85 && s < 0.35 && h !== '#808080'; });
if (muddy.length) W(`greyish / muddy colours: ${muddy.join(', ')} — mix hues with white, not grey or brown`);
if (/filter="url\(#[^)]*grain\)"/.test(svg) && /fill="#808080"[^>]*grain|grain[^>]*fill="#808080"/.test(svg)) W('grey grain dulls the colours: use white grain');
if (hexes.includes('#000000')) W('pure black: use ink #2E2628');

const kb = Buffer.byteLength(svg) / 1024;
if (kb > 80) W(`file is ${kb.toFixed(1)} KB (target < 80 KB)`);

for (const m of errors) console.log('ERROR ', m);
for (const m of warns) console.log('warn  ', m);
console.log(errors.length ? `✗ ${errors.length} error(s)` : '✓ ok', warns.length ? `(${warns.length} warning(s))` : '');
process.exit(errors.length ? 1 : 0);
