// Marshmallow chibi — builders for belly-up chibi animals with grainy soft edges and crisp ink.
// Every function returns an SVG string. `p` is the id prefix for one card (e.g. 'pd-').
//
// Local animal frame: head centre = (0,0), head 108 wide, +y toward the tail.
// Three layers per animal: SOFT (silhouette, heavy grain blur) -> MID (interior
// patches, light blur) -> INK (eyes, mouth, whiskers, toe beans: no filter).

const f = (n) => +(+n).toFixed(2);

// ---------------------------------------------------------------- filters
export function defs(p, { soft = 3.6, grain = 13, seed = 4 } = {}) {
  return `
  <filter id="${p}fleece" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB">
    <feMorphology in="SourceGraphic" operator="dilate" radius="2.2" result="loft"/>
    <feGaussianBlur in="loft" stdDeviation="6.6" result="down"/>
    <feTurbulence type="fractalNoise" baseFrequency=".34 .54" numOctaves="2" seed="17" result="fibres"/>
    <feDisplacementMap in="down" in2="fibres" scale="30" xChannelSelector="R" yChannelSelector="G" result="fringe"/>
    <feGaussianBlur in="SourceGraphic" stdDeviation="5.3" result="body"/>
    <feDisplacementMap in="body" in2="fibres" scale="18" xChannelSelector="G" yChannelSelector="R" result="surface"/>
    <feMerge><feMergeNode in="fringe"/><feMergeNode in="surface"/></feMerge>
  </filter>
  <filter id="${p}soft" x="-40%" y="-40%" width="180%" height="180%" color-interpolation-filters="sRGB">
    <feGaussianBlur stdDeviation="${soft}" result="b"/>
    <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="2" seed="${seed}" result="n"/>
    <feDisplacementMap in="b" in2="n" scale="${grain}" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
  <filter id="${p}mid" x="-40%" y="-40%" width="180%" height="180%" color-interpolation-filters="sRGB">
    <feGaussianBlur stdDeviation="1.8" result="b"/>
    <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="2" seed="${seed + 3}" result="n"/>
    <feDisplacementMap in="b" in2="n" scale="6" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
  <filter id="${p}haze" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="12"/></filter>
  <filter id="${p}glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="5"/></filter>
  <filter id="${p}grain" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="11"/>
    <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -2.4 1.7"/>
  </filter>`;
}

export const radial = (id, stops, { cx = 0.5, cy = 0.45, r = 0.8 } = {}) =>
  `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops.map((c, i) => `<stop offset="${f(i / (stops.length - 1))}" stop-color="${c}"/>`).join('')}</radialGradient>`;
export const linear = (id, stops, [x1, y1, x2, y2] = [0, 0, 0, 1]) =>
  `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops.map((c, i) => `<stop offset="${f(i / (stops.length - 1))}" stop-color="${c}"/>`).join('')}</linearGradient>`;

// ---------------------------------------------------------------- palette
export const FUR = {
  // light / base / shade / belly / inner ear — every ramp stays in its own hue (no grey, no brown)
  strawberry: { light: '#FFEBF3', fur: '#F6C9DD', shade: '#E7AFCB', belly: '#FFF6F8', ear: '#EFAECA' },
  soda:       { light: '#EAF6FF', fur: '#C7E8FB', shade: '#A8CEE8', belly: '#F6FBFF', ear: '#F3C5D9' },
  lemon:      { light: '#FFF6D6', fur: '#FFEAAB', shade: '#EDCB87', belly: '#FFFAE8', ear: '#F6C9DD' },
  lime:       { light: '#EFF6DE', fur: '#D7E9C3', shade: '#BAD6A8', belly: '#FAFFF0', ear: '#F6C9DD' },
  grape:      { light: '#F4EDF9', fur: '#E2CCE9', shade: '#C8B2DA', belly: '#FBF3FA', ear: '#F3C5D9' },
  mint:       { light: '#ECFAF4', fur: '#C7E6DF', shade: '#A5D3C9', belly: '#F7FFFA', ear: '#F6C9DD' },
  peach:      { light: '#FFF0E1', fur: '#FAD5BB', shade: '#EDBA9D', belly: '#FFF7EF', ear: '#F3BBCB' },
  caramel:    { light: '#FFF4CF', fur: '#FFEAAB', shade: '#EBCB8E', belly: '#FFF7DD', ear: '#F2C2CF' },
  milk:       { light: '#FFFFFF', fur: '#FFFBF3', shade: '#E5D9E4', belly: '#FFFFFF', ear: '#F6C9DD' },
  berry:      { light: '#E7E3F6', fur: '#CBC2E6', shade: '#A999C8', belly: '#F4EFFA', ear: '#F3C6DD' }, // the one deep fur
};
export const INK = '#695580', PAD = '#DDA1BE', BLUSH = '#F2B0C7';

// ---------------------------------------------------------------- species parts
// Ears: [right-side shape, inner shape]; left side mirrors with scale(-1 1).
export const EARS = {
  // [right-side shape, inner shape, puff stroke]. Marshmallow rule: every tip is round and plump.
  point: ['M8 -34 C12 -52 26 -64 39 -61 C51 -58 54 -38 50 -14 Z', 'M20 -38 C24 -49 31 -54 37 -52 C43 -50 44 -41 42 -31 Z', 10], // cat, fox
  round: ['M36 -48 A16 16 0 1 1 35.9 -48 Z', 'M36 -41 A9 9 0 1 1 35.9 -41 Z', 0],                                              // bear, hamster
  long:  ['M8 -32 C0 -64 8 -92 26 -94 C44 -96 48 -66 38 -28 Z', 'M17 -40 C12 -62 17 -82 27 -83 C37 -84 39 -62 32 -40 Z', 6],     // rabbit
  floppy:['M28 -38 C52 -44 70 -26 68 2 C66 22 52 26 44 16 C38 2 42 -18 24 -26 Z', '', 0],                                          // puppy (drawn in front)
};

// ---------------------------------------------------------------- animal
// Big head, tiny body. Local frame: head centre (0,0), head 108 wide, tail toward +y.
// opts: x, y, s (scale), rot, fur (FUR key or ramp), ears, eyes, mouth, arms, tail,
//       coatPatch (cat head-and-ear fur, SVG), marks (MID-layer svg), hold (crisp item centred on the chest at (0,48), drawn over
//       the belly and under the MID-blurred hugging paws), front (extra ink), whiskers,
//       shadow ('haze' | 'ripple' | 'none'), shadowColor, ink
export function animal(p, o) {
  const c = typeof o.fur === 'string' ? FUR[o.fur] : o.fur;
  const id = `${p}${o.name || 'a'}`;
  const ears = EARS[o.ears || 'point'];
  const arms = o.arms || 'up';
  const eyes = o.eyes || 'open';
  const ink = o.ink || INK;
  const mirror = (svg) => `${svg}<g transform="scale(-1 1)">${svg}</g>`;
  const stroke = (d, w, col) => `<path d="${d}" stroke="${col}" stroke-width="${w}" stroke-linecap="round" fill="none"/>`;

  // SOFT: tail, hind legs, body, raised arms, ears, head
  const tails = {
    curl: stroke('M10 74 C18 92 36 92 40 80', 12, c.fur),
    puff: `<circle cx="0" cy="80" r="9" fill="${c.light}"/>`,
    nub: '', none: '',
  };
  const leg = `${stroke('M10 68 L20 80', 21, c.fur)}<circle cx="21" cy="82" r="11.5" fill="${c.light}"/>`;
  const armUp = `${stroke('M14 46 L28 38', 19, c.fur)}<circle cx="30" cy="36" r="10.5" fill="${c.light}"/>`;
  const armOut = `${stroke('M16 50 L30 54', 19, c.fur)}<circle cx="32" cy="55" r="10.5" fill="${c.light}"/>`;
  const earSoft = ears[2] ? `<path d="${ears[0]}" fill="${c.fur}" stroke="${c.fur}" stroke-width="${ears[2]}" stroke-linejoin="round"/>` : `<path d="${ears[0]}" fill="${c.fur}"/>`;
  const earsFront = o.ears === 'floppy';
  const head = `<ellipse cx="0" cy="0" rx="54" ry="42" fill="url(#${id})"/>`;
  const coat = o.coatPatch ? `<defs><mask id="${id}-coat" mask-type="alpha">${mirror(earSoft)}${head}</mask></defs><g mask="url(#${id}-coat)">${o.coatPatch}</g>` : '';
  const soft = [
    tails[o.tail || 'curl'],
    mirror(leg),
    `<ellipse cx="0" cy="56" rx="24" ry="24" fill="url(#${id})"/>`,
    arms === 'up' ? mirror(armUp) : arms === 'out' ? mirror(armOut) : '',
    earsFront ? '' : mirror(earSoft),
    head,
    earsFront ? mirror(`<path d="${ears[0]}" fill="${c.shade}"/>`) : '',
    coat,
  ].join('');

  // MID: chin shade, belly, markings, inner ears, blush, tucked paws
  const pawsTuck = mirror(arms === 'hug' ? `<circle cx="14" cy="46" r="7.5" fill="${c.light}"/>` : `<circle cx="9" cy="44" r="8" fill="${c.light}"/>`);
  const mid = [
    `<ellipse cx="0" cy="40" rx="24" ry="5" fill="${c.shade}" opacity=".55"/>`,
    `<ellipse cx="0" cy="60" rx="13" ry="15" fill="${c.belly}"/>`,
    o.marks || '',
    ears[1] ? mirror(`<path d="${ears[1]}" fill="${c.ear}"/>`) : '',
    mirror(`<ellipse cx="38" cy="15" rx="8" ry="4.5" fill="${o.blush ?? BLUSH}" opacity=".55"/>`),
  ].join('');

  // INK: toe beans, eyes, mouth, whiskers — all thick, round-capped, no highlights
  const bean = ([x, y]) => `<ellipse cx="${x}" cy="${f(y + 1.9)}" rx="3.5" ry="2.9"/><circle cx="${f(x - 4.2)}" cy="${f(y - 2.3)}" r="1.6"/><circle cx="${x}" cy="${f(y - 4.2)}" r="1.6"/><circle cx="${f(x + 4.2)}" cy="${f(y - 2.3)}" r="1.6"/>`;
  const beanAt = [[-21, 82], [21, 82]];
  if (arms === 'up') beanAt.push([-30, 36], [30, 36]);
  if (arms === 'out') beanAt.push([-32, 55], [32, 55]);
  const line = (d) => `<g fill="none" stroke="${ink}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">${mirror(d)}</g>`;
  const EYES = {
    open: `<g fill="${ink}">${mirror('<ellipse cx="30" cy="2" rx="4.6" ry="6.2"/>')}</g>`,
    closed: line('<path d="M23 1 Q30 7 37 1"/>'),
    happy: line('<path d="M23 5 Q30 -2 37 5"/>'),
    squeeze: line('<path d="M35 -3 L25 2 L35 7"/>'),
  };
  const MOUTHS = {
    w: '<path d="M-9 7 Q-4.5 15 0 8.5 Q4.5 15 9 7"/>',
    line: '<path d="M-5 10 Q0 13 5 10"/>',
    open: `<path d="M-9 7 Q-4.5 15 0 8.5 Q4.5 15 9 7"/><path d="M-4.5 11.5 Q0 19 4.5 11.5" fill="${o.tongue ?? '#DF9BB4'}" stroke-width="2"/>`,
    o: `<ellipse cx="0" cy="12" rx="3.2" ry="3.8" fill="${ink}" stroke="none"/>`,
  };
  const whisk = o.whiskers === false ? '' : mirror('<path d="M42 6 L76 -1 M43 12 L80 12 M42 18 L75 25"/>');
  const ink$ = [
    `<g fill="${o.pad ?? PAD}">${beanAt.map(bean).join('')}</g>`,
    EYES[eyes] || EYES.open,
    `<g fill="none" stroke="${ink}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${MOUTHS[o.mouth || 'w']}${whisk}</g>`,
    o.front || '',
  ].join('');

  const under = {
    haze: `<ellipse cx="2" cy="40" rx="62" ry="60" fill="${o.shadowColor || c.shade}" opacity=".35" filter="url(#${p}haze)"/>`,
    ripple: `<g fill="none" stroke="#FFFFFF" stroke-linecap="round" filter="url(#${p}mid)"><ellipse cx="0" cy="34" rx="80" ry="76" stroke-width="2.8" opacity=".75"/><ellipse cx="0" cy="34" rx="96" ry="92" stroke-width="2.2" opacity=".45"/></g><ellipse cx="0" cy="40" rx="60" ry="58" fill="${o.shadowColor || c.shade}" opacity=".35" filter="url(#${p}haze)"/>`,
    none: '',
  }[o.shadow || 'haze'];

  return `<g transform="translate(${o.x} ${o.y}) rotate(${o.rot || 0}) scale(${o.s || 1})">
  <defs><radialGradient id="${id}" cx=".42" cy=".36" r=".72"><stop offset="0" stop-color="${c.light}"/><stop offset=".55" stop-color="${c.fur}"/><stop offset="1" stop-color="${c.shade}"/></radialGradient></defs>
  ${under}
  <g filter="url(#${p}fleece)">${soft}</g>
  <g filter="url(#${p}mid)">${mid}</g>
  ${o.hold ? `<g transform="translate(0 48)">${o.hold}</g>` : ''}
  ${arms === 'tuck' || arms === 'hug' ? `<g filter="url(#${p}mid)">${pawsTuck}</g>` : ''}
  ${ink$}
</g>`;
}

// ---------------------------------------------------------------- decor
export function starPath(x, y, r, inner = 0.45) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * inner : r;
    pts.push(`${f(x + rr * Math.cos(a))} ${f(y + rr * Math.sin(a))}`);
  }
  return `M${pts.join(' L')} Z`;
}
// Hard-edged star with an optional soft glow behind it.
export const star = (p, x, y, r, col = '#FFF1BE', glow = true) =>
  (glow ? `<circle cx="${x}" cy="${y}" r="${f(r * 1.3)}" fill="${col}" opacity=".85" filter="url(#${p}glow)"/>` : '') +
  `<path d="${starPath(x, y, r)}" fill="${col}" stroke="${col}" stroke-width="${f(r * 0.35)}" stroke-linejoin="round"/>`;
// Four-point twinkle.
export const twinkle = (x, y, r, col = '#FFFFFF') =>
  `<path d="M${x} ${y - r} Q${x + r * .18} ${y - r * .18} ${x + r} ${y} Q${x + r * .18} ${y + r * .18} ${x} ${y + r} Q${x - r * .18} ${y + r * .18} ${x - r} ${y} Q${x - r * .18} ${y - r * .18} ${x} ${y - r} Z" fill="${col}"/>`;
// Glowing round orb (soft only).
export const orb = (p, x, y, r, col) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${col}" filter="url(#${p}glow)"/>`;
// Five-petal flower, hard edges, top-down.
export function flower(x, y, r, petal, centre = '#F3D98F', rot = 0) {
  const ps = Array.from({ length: 5 }, (_, i) => {
    const a = (rot + i * 72) * Math.PI / 180;
    return `<circle cx="${f(x + Math.sin(a) * r * .55)}" cy="${f(y - Math.cos(a) * r * .55)}" r="${f(r * .5)}"/>`;
  }).join('');
  return `<g fill="${petal}">${ps}</g><circle cx="${x}" cy="${y}" r="${f(r * .3)}" fill="${centre}"/>`;
}
// Lily pad (soft or hard depending on the filter you wrap it in).
export const lilyPad = (x, y, r, col, rot = 0) =>
  `<path transform="translate(${x} ${y}) rotate(${rot})" d="M0 0 L${f(r * .26)} ${f(-r * .97)} A${r} ${r} 0 1 1 ${f(-r * .26)} ${f(-r * .97)} Z" fill="${col}"/>`;
// Clover leaf (three hearts).
export const clover = (x, y, r, col, rot = 0) =>
  `<g transform="translate(${x} ${y}) rotate(${rot})" fill="${col}">${[0, 120, 240].map((a) => `<path transform="rotate(${a})" d="M0 0 C${f(-r * .9)} ${f(-r * .3)} ${f(-r * .8)} ${f(-r * 1.25)} 0 ${f(-r * .9)} C${f(r * .8)} ${f(-r * 1.25)} ${f(r * .9)} ${f(-r * .3)} 0 0 Z"/>`).join('')}</g>`;

// ---------------------------------------------------------------- card
export function card(p, { title, w = 480, h = 360, defs: extra = '', bg, scene = '', animals = '', decor = '', grain = 0.22 }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">
<title>${title}</title>
<defs>${defs(p)}${extra}</defs>
<rect width="${w}" height="${h}" fill="${bg}"/>
${scene}
${animals}
${decor}
<rect width="${w}" height="${h}" fill="#FFFFFF" filter="url(#${p}grain)" opacity="${grain}" pointer-events="none"/>
</svg>
`;
}
