#!/usr/bin/env node
// Rebuilds examples/*.svg from marshmallow.mjs.   node scripts/build-examples.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as F from './marshmallow.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const out = (name, svg) => { fs.writeFileSync(path.join(here, '..', 'examples', name), svg); console.log('wrote', name, (svg.length / 1024).toFixed(1) + ' KB'); };

// ------------------------------------------------ 1. Pond Float: two cats floating on a starry pond
{
  const p = 'pd-';
  const extra = F.radial(`${p}water`, ['#EFF9FC', '#C7E8FB', '#AFD8ED'], { cx: 0.5, cy: 0.45, r: 0.85 });
  const scene = `<rect width="480" height="360" fill="url(#${p}water)"/>
  <g filter="url(#${p}haze)" opacity=".6"><ellipse cx="90" cy="300" rx="90" ry="40" fill="#F6F8F2"/><ellipse cx="400" cy="50" rx="90" ry="36" fill="#F2F6F4"/></g>
  <g filter="url(#${p}soft)">${F.lilyPad(64, 92, 34, '#C0DDAF', 20)}${F.lilyPad(420, 286, 40, '#C0DDAF', -140)}${F.lilyPad(442, 210, 18, '#D7E9C3', 70)}</g>
  <g filter="url(#${p}mid)">${F.flower(64, 86, 15, '#FBDCEB', '#FFEAAB', 10)}</g>`;
  const animals = [
    F.animal(p, { name: 'a', x: 148, y: 132, s: 1.0, rot: -16, fur: 'strawberry', arms: 'up', eyes: 'open', mouth: 'open', shadow: 'ripple', shadowColor: '#A0C6DE' }),
    F.animal(p, { name: 'b', x: 338, y: 160, s: 0.98, rot: 14, fur: 'grape', arms: 'tuck', eyes: 'closed', mouth: 'w', shadow: 'ripple', shadowColor: '#A0C6DE',
      marks: `<path d="M-30 -30 Q0 -40 30 -30 Q20 -22 0 -24 Q-20 -22 -30 -30 Z" fill="#C8B2DA" opacity=".8"/>` }),
  ].join('');
  const decor = [
    F.star(p, 410, 120, 11), F.star(p, 86, 210, 9), F.star(p, 120, 40, 6), F.star(p, 360, 322, 8), F.star(p, 250, 330, 5),
    F.star(p, 30, 150, 5, '#FBDCEB', false), F.star(p, 455, 60, 4.5, '#FFFFFF', false), F.star(p, 300, 26, 5, '#FBDCEB', false),
    F.twinkle(160, 300, 6), F.twinkle(440, 170, 4), F.twinkle(230, 30, 4),
  ].join('');
  out('pond-float.svg', F.card(p, { title: 'Pond Float', defs: extra, bg: '#C7E8FB', scene, animals, decor }));
}

// ------------------------------------------------ 2. Clover Nap: three friends on a meadow
{
  const p = 'cl-';
  const extra = F.radial(`${p}grass`, ['#FFFFF7', '#E7F3E2', '#C7E6E8'], { cx: 0.5, cy: 0.5, r: 0.8 });
  const clovers = [[40, 60, 14, 10], [440, 40, 12, 40], [30, 300, 16, -20], [452, 316, 13, 80], [250, 340, 11, 15], [150, 22, 10, 60], [330, 24, 9, -30], [470, 180, 10, 0]]
    .map(([x, y, r, a]) => F.clover(x, y, r, '#C0DDAF', a)).join('');
  const blades = Array.from({ length: 26 }, (_, i) => {
    const x = (i * 97) % 470 + 6, y = (i * 61) % 340 + 12;
    return `<path d="M${x} ${y} q2 -7 5 -10" />`;
  }).join('');
  const scene = `<rect width="480" height="360" fill="url(#${p}grass)"/>
  <g filter="url(#${p}soft)" opacity=".9">${clovers}</g>
  <g fill="none" stroke="#FFFFF7" stroke-width="2.4" stroke-linecap="round" opacity=".8">${blades}</g>
  ${F.flower(70, 140, 13, '#FFFFFF', '#FFEAAB', 0)}${F.flower(452, 62, 11, '#FBDCEB', '#FFEAAB', 20)}${F.flower(400, 330, 12, '#FFFFFF', '#FFEAAB', 40)}${F.flower(100, 330, 9, '#CBCFEA', '#FFEAAB', 10)}`;
  const strawberry = `<g transform="scale(.95)"><path d="M0 -10 C10 -10 13 -2 11 4 C9 11 3 15 0 15 C-3 15 -9 11 -11 4 C-13 -2 -10 -10 0 -10 Z" fill="#E782A9"/>
    <path d="M-7 -9 L-2 -6 L0 -12 L2 -6 L7 -9 L4 -4 L-4 -4 Z" fill="#85BAA1"/><g fill="#FFF4CC"><circle cx="-4" cy="0" r=".9"/><circle cx="3" cy="-1" r=".9"/><circle cx="0" cy="5" r=".9"/><circle cx="-5" cy="6" r=".9"/><circle cx="5" cy="5" r=".9"/></g></g>`;
  const animals = [
    F.animal(p, { name: 'a', x: 94, y: 140, s: 0.82, rot: -20, fur: 'milk', arms: 'up', eyes: 'happy', mouth: 'open', shadow: 'haze', shadowColor: '#A3C8CC',
      marks: `<path d="M-45 -18 Q-39 -35 -18 -38 Q-5 -39 -9 -28 Q-13 -14 -29 -12 Q-41 -10 -45 -18Z" fill="#EBA264"/><path d="M16 -36 Q33 -34 41 -22 Q36 -15 25 -18 Q14 -21 16 -36Z" fill="#524541"/><ellipse cx="12" cy="62" rx="9" ry="10" fill="#524541"/>` }),
    F.animal(p, { name: 'b', x: 240, y: 158, s: 0.86, rot: 4, fur: 'strawberry', ears: 'long', tail: 'puff', arms: 'hug', eyes: 'open', mouth: 'w', shadow: 'haze', shadowColor: '#A3C8CC',
      hold: strawberry, whiskers: false }),
    F.animal(p, { name: 'c', x: 388, y: 136, s: 0.82, rot: 18, fur: 'caramel', ears: 'round', tail: 'nub', arms: 'out', eyes: 'closed', mouth: 'line', shadow: 'haze', shadowColor: '#A3C8CC', whiskers: false,
      marks: `<ellipse cx="0" cy="12" rx="18" ry="12" fill="#FFF7DD"/>`, front: `<ellipse cx="0" cy="4.5" rx="3.6" ry="2.4" fill="#735B83"/>` }),
  ].join('');
  const decor = [F.star(p, 456, 250, 8), F.star(p, 24, 210, 7), F.star(p, 200, 300, 6), F.star(p, 300, 312, 5, '#FFFFFF', false), F.twinkle(180, 28, 5), F.twinkle(310, 260, 4)].join('');
  out('clover-nap.svg', F.card(p, { title: 'Clover Nap', defs: extra, bg: '#E7F3E2', scene, animals, decor }));
}

// ------------------------------------------------ 3. Rainbow Quilt: a berry cat asleep on a striped quilt
{
  const p = 'sq-';
  const hem = 'M-10 196 Q240 176 490 196 L490 370 L-10 370 Z';
  const extra = F.linear(`${p}sheet`, ['#FFF4F8', '#FBDCEB'], [0, 0, 0, 1]) + `<clipPath id="${p}quilt"><path d="${hem}"/></clipPath>`;
  const bands = ['#F6C9DD', '#FFEAAB', '#D7E9C3', '#C7E8FB', '#CBCFEA', '#F6C9DD'];
  const stripes = bands.map((c, i) => `<path d="M-10 ${190 + i * 32} Q240 ${170 + i * 32} 490 ${190 + i * 32} L490 ${226 + i * 32} Q240 ${206 + i * 32} -10 ${226 + i * 32} Z" fill="${c}"/>`).join('');
  const dots = Array.from({ length: 18 }, (_, i) => `<circle cx="${(i * 89) % 470 + 10}" cy="${200 + (i * 47) % 160}" r="3" />`).join('');
  const scene = `<rect width="480" height="360" fill="url(#${p}sheet)"/>
  <g fill="#FFFFFF" opacity=".7">${Array.from({ length: 12 }, (_, i) => `<circle cx="${(i * 83) % 460 + 12}" cy="${(i * 37) % 170 + 8}" r="3.5"/>`).join('')}</g>
  <g filter="url(#${p}haze)" opacity=".45"><rect x="80" y="30" width="320" height="110" rx="50" fill="#E7BBD2"/></g>
  <g filter="url(#${p}soft)"><rect x="96" y="22" width="288" height="100" rx="46" fill="#FFFFFF"/></g>
  <g clip-path="url(#${p}quilt)">${stripes}<g fill="#FFFFFF" opacity=".75">${dots}</g></g>
  <path d="M-10 196 Q240 176 490 196" stroke="#FFFFFF" stroke-width="6" fill="none"/>
  <g filter="url(#${p}soft)"><path d="${F.starPath(400, 270, 52, 0.52)}" fill="#FFE39F" stroke="#FFE39F" stroke-width="18" stroke-linejoin="round"/></g>
  <g filter="url(#${p}mid)"><path d="${F.starPath(400, 270, 30, 0.52)}" fill="#FFF2CB" stroke="#FFF2CB" stroke-width="10" stroke-linejoin="round"/></g>
  <g fill="none" stroke="#695580" stroke-width="2.6" stroke-linecap="round"><path d="M391 268 Q394 271 397 268 M403 268 Q406 271 409 268"/></g>`;
  const animals = F.animal(p, { name: 'a', x: 222, y: 120, s: 1.3, rot: -10, fur: 'berry', arms: 'up', eyes: 'closed', mouth: 'line', shadow: 'haze', shadowColor: '#D7ADCA',
    ink: '#695580', marks: `<ellipse cx="-28" cy="-20" rx="16" ry="11" fill="#A999C8"/>`,
    front: `<g fill="none" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round"><path d="M66 -40 q8 -6 12 0 q-6 6 0 10 M84 -58 q5 -4 8 0 q-4 4 0 7"/></g>` });
  const decor = [F.star(p, 60, 60, 12), F.star(p, 432, 62, 9, '#FFFFFF'), F.star(p, 40, 300, 8, '#FFF1BE'), F.star(p, 300, 330, 6, '#FFFFFF', false),
    F.twinkle(110, 200, 6), F.twinkle(456, 160, 5), F.twinkle(24, 170, 4)].join('');
  out('rainbow-quilt.svg', F.card(p, { title: 'Rainbow Quilt', defs: extra, bg: '#FFF4F8', scene, animals, decor }));
}
