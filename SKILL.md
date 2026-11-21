---
name: illustration-marshmallow-chibi
description: Draw original belly-up chibi animals as self-contained SVG cards with grainy, soft-focus edges and crisp ink faces, seen from above on water, grass or a bed. Use for pastel animal scenes, cosy wallpapers, stickers, greeting cards and spot illustrations.
---

# Marshmallow chibi

Small round animals lie on their backs, seen from straight above. Their **silhouettes feather out into loose, fleecy fibres**, while the **eyes, mouth, whiskers and toe beans stay sharp**. Colours are light star-pink pastels. Every shape is plump and round like a marshmallow — no thin parts, no sharp tips. Decoration mixes **hard-edged stars with soft glows**.

The blur does most of the work: simple ellipses and thick round strokes merge into one plush form, so the shapes below never need to be precise. Precision goes into the few crisp ink marks.

## The three layers

Every soft object (animal, pillow, lily pad, cloud) is drawn in up to three layers. This contrast is the style; never blur the ink, and never leave the silhouette sharp.

| Layer | Filter | Holds |
|---|---|---|
| SOFT | `xx-fleece`: a diffuse outer fringe overlaid with a denser surface | the silhouette: head, body, legs, arms, ears, tail |
| MID | `xx-mid`: blur 1.8, displacement 6 | patches inside the silhouette: belly, markings, inner ears, chin shade, blush, tucked paws |
| INK | none | eyes, mouth, whiskers, toe beans, held items, small line details |

Paste these filters into `defs` (rename the `xx-` prefix per card). The displacement scatters the blurred edge into grain, like the soft-focus edges of an airbrushed photo.

```svg
<filter id="xx-fleece" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB">
  <feMorphology in="SourceGraphic" operator="dilate" radius="2.2" result="loft"/>
  <feGaussianBlur in="loft" stdDeviation="6.6" result="down"/>
  <feTurbulence type="fractalNoise" baseFrequency=".34 .54" numOctaves="2" seed="17" result="fibres"/>
  <feDisplacementMap in="down" in2="fibres" scale="30" xChannelSelector="R" yChannelSelector="G" result="fringe"/>
  <feGaussianBlur in="SourceGraphic" stdDeviation="5.3" result="body"/>
  <feDisplacementMap in="body" in2="fibres" scale="18" xChannelSelector="G" yChannelSelector="R" result="surface"/>
  <feMerge><feMergeNode in="fringe"/><feMergeNode in="surface"/></feMerge>
</filter>
<filter id="xx-soft" x="-40%" y="-40%" width="180%" height="180%" color-interpolation-filters="sRGB">
  <feGaussianBlur stdDeviation="3.6" result="b"/>
  <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="2" seed="4" result="n"/>
  <feDisplacementMap in="b" in2="n" scale="13" xChannelSelector="R" yChannelSelector="G"/>
</filter>
<filter id="xx-mid" x="-40%" y="-40%" width="180%" height="180%" color-interpolation-filters="sRGB">
  <feGaussianBlur stdDeviation="1.8" result="b"/>
  <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="2" seed="7" result="n"/>
  <feDisplacementMap in="b" in2="n" scale="6" xChannelSelector="R" yChannelSelector="G"/>
</filter>
<filter id="xx-haze" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="12"/></filter>
<filter id="xx-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="5"/></filter>
<filter id="xx-grain" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="11"/>
  <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -2.4 1.7"/>
</filter>
```

Group the animal silhouette under `<g filter="url(#xx-fleece)">` so its ears, cheeks and paws feather into the ground. Use `xx-soft` on scene objects such as clover, lily pads and pillows. Place the MID and INK groups alongside the silhouette group. Keep the generous filter region; a tight one clips the blur into a hard box. Filter values live in the animal's local units, so a scaled animal gets proportionally softer edges — that is intended.

## Animal frame

**Big head, tiny body, marshmallow limbs.** The head is a wide marshmallow; the body is a small bean tucked under the chin. Arms and legs are short, fat stubs — about as long as they are wide — each ending in a round paw. Ears are plump with rounded tips. Nothing is thin or pointed.

Draw each animal in a local frame: head centre (0,0), head 108 wide, the tail toward +y. Place it with `translate(X Y) rotate(R) scale(S)` and change nothing else. The face is drawn upright in this frame; the rotation tilts the whole animal.

Fur ramp: a radial gradient `cx .42 cy .36 r .72`, **light** at 0, **base** at .55, **shade** at 1, used for head and body. Limbs use the base colour, paw tips the light colour.

**SOFT layer**, back to front (mirror each right-side part with `scale(-1 1)` or negated x):

```
tail        <path d="M10 74 C18 92 36 92 40 80" stroke=BASE stroke-width="12" stroke-linecap="round" fill="none"/>     short and thick
hind legs   <path d="M10 68 L20 80" stroke=BASE stroke-width="21" stroke-linecap="round"/> + paw <circle cx="21" cy="82" r="11.5" fill=LIGHT/>   stubby
body        <ellipse cx="0" cy="56" rx="24" ry="24" fill=FUR-GRADIENT/>          tiny: less than half the head width
arms (up)   <path d="M14 46 L28 38" stroke=BASE stroke-width="19" stroke-linecap="round"/> + paw <circle cx="30" cy="36" r="10.5" fill=LIGHT/>   stubby
ears        cat: <path d="M8 -34 C12 -52 26 -64 39 -61 C51 -58 54 -38 50 -14 Z" fill=BASE stroke=BASE stroke-width="10" stroke-linejoin="round"/>   puffy, round tip
head        <ellipse cx="0" cy="0" rx="54" ry="42" fill=FUR-GRADIENT/>
```

**MID layer**:

```
chin shade  <ellipse cx="0" cy="40" rx="24" ry="5" fill=SHADE opacity=".55"/>
belly       <ellipse cx="0" cy="60" rx="13" ry="15" fill=BELLY/>
inner ear   cat: <path d="M20 -38 C24 -49 31 -54 37 -52 C43 -50 44 -41 42 -31 Z" fill=EAR/>
blush       <ellipse cx="38" cy="15" rx="8" ry="4.5" fill="#F2B0C7" opacity=".55"/>
markings    any ellipse or blob in a darker/lighter fur tone: a cap patch at (-26,-22), a spot on the body, a mask
```

**INK layer** — sharp, **thick** and round-ended. Chunky lines give the blunt, dopey cuteness; thin lines look scratchy against the soft fur. Ink stroke widths: mouth and whiskers **2.4**, line eyes **2.8**, never below 2. Eyes are solid ovals with **no highlights**.

```
eyes        <ellipse cx="±30" cy="2" rx="4.6" ry="6.2" fill="#695580"/>      solid, no highlight, set far apart
mouth (ω)   <path d="M-9 7 Q-4.5 15 0 8.5 Q4.5 15 9 7" stroke="#695580" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
whiskers    <path d="M42 6 L76 -1 M43 12 L80 12 M42 18 L75 25"/>  same stroke; mirror for the left
toe beans   on every upturned paw at (px,py): <ellipse cx=px cy=py+1.9 rx="3.5" ry="2.9"/> + three <circle r="1.6"/> at (px-4.2,py-2.3) (px,py-4.2) (px+4.2,py-2.3), fill "#DDA1BE"
```

Face proportions: the head is wider than tall (108 × 84). The eyes sit on the horizontal centre line, **60 apart (55% of head width)** — wide-set eyes make the animal look a little dim and sweet. The ω mouth is big, **18 wide**, just below the eye line in the middle of the gap. Three whiskers per side start near the cheek edge (x ≈ 42) and reach well past the head. Blush sits under and slightly outside each eye.

### Faces

| Eyes | Mood | Build (right eye at (30,2); mirror) |
|---|---|---|
| `open` | default | solid ellipse rx 4.6 ry 6.2, **no highlight** |
| `closed` | asleep | `M23 1 Q30 7 37 1`, stroke 2.8, round caps |
| `happy` | laughing ^ ^ | `M23 5 Q30 -2 37 5`, stroke 2.8 |
| `squeeze` | > < | `M35 -3 L25 2 L35 7`, stroke 2.8, round joins |

| Mouth | Build (stroke 2.4) |
|---|---|
| `w` (default ω) | above |
| `open` | ω + tongue `M-4.5 11.5 Q0 19 4.5 11.5` filled `#DF9BB4`, stroke 2 |
| `line` | `M-5 10 Q0 13 5 10` — sleepy |
| `o` | filled ellipse (0,12) rx 3.2 ry 3.8 |

### Poses — what makes it read as "lying on its back"

Three cues together: **paws turned up with toe beans showing**, **hind legs splayed out** like a frog, and the **whole body tilted** in the frame. Keep at least two in every animal.

| Arms | Build |
|---|---|
| `up` (万岁) | the raised arms above, paws beside the lower cheeks; beans on all four paws |
| `out` | `M16 50 L30 54`, stroke 19 + paw at (32,55) r 10.5; beans on all four |
| `tuck` | no arm strokes; paws `<circle cx="±9" cy="44" r="8" fill=LIGHT/>` in MID, on the chest |
| `hug` | an item about 20 wide held at (0,48), drawn in INK **after** the MID layer; then the paws `<circle cx="±14" cy="46" r="7.5" fill=LIGHT/>` in their own MID group on top, so they blur over its sides |

Rotation: −25° to 25° for most animals; an occasional 180° (head toward the bottom) gives a playful upside-down nap.

### Other species

Swap ears, tail and markings; keep head, body, face and pose.

| Species | Ears (right side, mirror) | Tail | Notes |
|---|---|---|---|
| cat | `point` above (puffy, stroke 10); inner `M20 -38 C24 -49 31 -54 37 -52 C43 -50 44 -41 42 -31 Z` | curl | whiskers |
| rabbit | `M8 -32 C0 -64 8 -92 26 -94 C44 -96 48 -66 38 -28 Z` with a 6-wide round-joined stroke (fat, round-topped), inner `M17 -40 C12 -62 17 -82 27 -83 C37 -84 39 -62 32 -40 Z` | puff: circle (0,80) r 9, light | no whiskers |
| bear | circle (36,-48) r 16, inner r 9 at (36,-41) in MID | nub (none) | muzzle: MID ellipse (0,12) rx 18 ry 12 in belly colour + ink nose ellipse (0,4.5) rx 3.6 ry 2.4 `#735B83`; no whiskers |
| puppy | floppy `M28 -38 C52 -44 70 -26 68 2 C66 22 52 26 44 16 C38 2 42 -18 24 -26 Z` in SHADE, drawn **after** the head in SOFT | curl | the same ink nose; no whiskers |

For any other animal, add its ear, horn or tail shape to SOFT and its marking to MID; the blur forgives rough shapes. Keep the marshmallow rule: fatten thin parts, round every tip (a round-joined stroke of 6–10 in the fill colour puffs any shape).

## Colour — star-pink pastels

Use petal pink `#F6C9DD`, sky blue `#C7E8FB` and star yellow `#FFEAAB` for readable patches of colour on a pale ground. Draw faces in grape ink `#695580`. Keep shadows close to the local hue and save the strongest pink for a small accent such as a strawberry.

| Fur | light / base / shade | belly | inner ear |
|---|---|---|---|
| strawberry | `#FFEBF3 / #F6C9DD / #E7AFCB` | `#FFF6F8` | `#EFAECA` |
| soda | `#EAF6FF / #C7E8FB / #A8CEE8` | `#F6FBFF` | `#F3C5D9` |
| lemon | `#FFF6D6 / #FFEAAB / #EDCB87` | `#FFFAE8` | `#F6C9DD` |
| lime | `#EFF6DE / #D7E9C3 / #BAD6A8` | `#FAFFF0` | `#F6C9DD` |
| grape | `#F4EDF9 / #E2CCE9 / #C8B2DA` | `#FBF3FA` | `#F3C5D9` |
| mint | `#ECFAF4 / #C7E6DF / #A5D3C9` | `#F7FFFA` | `#F6C9DD` |
| peach | `#FFF0E1 / #FAD5BB / #EDBA9D` | `#FFF7EF` | `#F3BBCB` |
| caramel | `#FFF4CF / #FFEAAB / #EBCB8E` | `#FFF7DD` | `#F2C2CF` |
| milk | `#FFFFFF / #FFFBF3 / #E5D9E4` | `#FFFFFF` | `#F6C9DD` |
| berry (deep) | `#E7E3F6 / #CBC2E6 / #A999C8` | `#F4EFFA` | `#F3C6DD` |

Toe beans `#DDA1BE`, blush `#F2B0C7`, stars `#FFF1BE` / `#FFFFFF` / `#FBDCEB`, calico markings in ginger `#EBA264` and charcoal brown `#524541` on cream-white fur.

**Separate by hue and value.** The blur cannot add contrast. Put an animal on a ground of a different hue family (pink cat on aqua water, milk cat on lime grass, berry cat on a pink bed), never pink-on-pink or lime-on-lime. Neighbouring animals should differ in hue so their fuzzy edges don't merge into one blob.

## Scenes from above

The card **is** the surface — no horizon, no perspective. Fill it with a gradient and scatter things on it at the same top-down angle.

| Scene | Ground | Soft things | Hard things |
|---|---|---|---|
| Water | radial `#EFF9FC → #C7E8FB → #AFD8ED` | lime lily pads `#C0DDAF`, white light patches, a pink floating flower | reflected stars, twinkles |
| Grass | radial `#FFFFF7 → #E7F3E2 → #C7E6E8` | three-heart clovers `#C0DDAF` | white / pink / lilac five-petal flowers with yellow centres, pale grass flicks `q2 -7 5 -10` (stroke 2.4) |
| Bed | pink sheet `#FFF4F8 → #FBDCEB` | plump white pillow with four softly pinched cloth corners and gently bowed sides, lemon star cushion | a rainbow-striped quilt (pink, lemon, mint, soda, lavender) with a curved hem and white dots |

Shape a bed pillow as one full, gently bowed form with four rounded corners that flare slightly past the sides. Make the corner pinches broad enough to survive the xx-soft filter. Feather the entire silhouette into the sheet and show the loft with a white centre and a faint blush shadow underneath.

Others work the same way: a picnic blanket, a cloud, a pile of laundry, a tatami mat, a bath with bubbles.

Under each animal put either a **haze shadow** (`<ellipse cx="2" cy="40" rx="62" ry="60" fill=DEEP-GROUND opacity=".35" filter="url(#xx-haze)"/>`) or, on water, **ripple rings** (white stroked ellipses rx 80 ry 76 at (0,34) in MID, stroke 2.8, opacity .75) plus the same tinted haze. Shadows are a slightly deeper version of the ground (aqua `#A0C6DE`, lime `#A3C8CC`, pink `#D7ADCA`), never grey.

**Hard vs soft on the ground.** A crisp ground pattern (quilt checks, flowers) makes the fuzzy animal read better; soft ground blobs (lily pads, clover) give depth. Use both.

## Decoration

Mix hard edges and soft light. A **glowing star** is a soft circle behind a hard star:

```svg
<circle cx="X" cy="Y" r="1.3R" fill="#FFF1BE" opacity=".85" filter="url(#xx-glow)"/>
<path d="(10-point star, outer R, inner .45R)" fill="#FFF1BE" stroke="#FFF1BE" stroke-width=".35R" stroke-linejoin="round"/>
```

The thick round-joined stroke makes a plump marshmallow star without blurring it. Add bare stars (no glow) in white, butter or pink, and white four-point twinkles. Use 8–14 marks, sizes 4–13, in the open space around the animals; leave the faces clear.

## Compose and deliver

One self-contained SVG, viewBox `0 0 480 360` (square sticker `0 0 360 360`), with `<title>`, prefixed IDs, a full-bleed background rect first and the grain rect last:

```svg
<rect width="480" height="360" fill="#FFFFFF" filter="url(#xx-grain)" opacity=".22" pointer-events="none"/>
```

| Animals | S | Head-centre spacing |
|---|---|---|
| 1 | 1.2–1.4 | hero near the centre, slightly high (the body runs down) |
| 2 | 0.95–1.05 | ≥ 185 apart, tilted toward or away from each other |
| 3 | 0.8–0.88 | ≈ 145 apart, alternating tilt |
| 4 | 0.65–0.75 | a loose 2×2 or a gentle arc |

The full animal occupies about 160 × 160 × S including whiskers, ears and legs (rabbit ears add 45 on top). **Whisker tips and raised paws must not touch a neighbour's face.** Keep about 35% of the card as calm ground. No text, scripts, images or external links. Target under 40 KB.

**Standalone chat:** copy the filters and frame above, or start from `references/template.svg` and edit colours, pose and scene. Check: faces sharp with thick lines and no eye highlights, body clearly tiny under the head, every silhouette fuzzy, beans visible, colours clear against the pale ground, limbs stubby and ears round-tipped, animals clearly separated from the ground, nothing important hidden behind a neighbour.

**With Node:** `scripts/marshmallow.mjs` builds animals (`animal(p, {x, y, s, rot, fur, ears, eyes, mouth, arms, tail, marks, hold, shadow})`), stars, flowers, clovers and lily pads; see `scripts/build-examples.mjs`. Render with `node scripts/render.mjs card.svg card.png` (Playwright or a local Chrome; filters need a real browser engine) and lint with `node scripts/lint.mjs card.svg --prefix xx-`. Use `references/craft.md` for a closer review.
