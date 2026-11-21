# Card review

Use `SKILL.md` for the frame, colours and layers. Look at the rendered card at display size first, then zoom.

| Inspect | Look for |
|---|---|
| First read | At 480 px you can tell each animal is lying belly-up: beans showing, legs splayed, body tilted. Faces are the sharpest thing on the card. |
| Proportions | Head dominates; the body is a small bean under the chin. Eyes far apart, no highlights, big ω mouth. Ink lines thick and round-ended (≥ 2). |
| Soft vs sharp | Look for a loose fringe around the ears, cheeks and paws; eyes, ω mouth, whiskers and beans are crisp. No hard edge peeks out of a blurred group (a clipped filter region shows as a straight cut). |
| Value | Each animal separates from the ground in value. Two neighbours never melt into one blob. |
| Spacing | Whiskers and raised paws stay clear of other faces. ~35% of the card is calm ground. |
| Scene | The top-down surface reads with the animals hidden: ripples and pads = water, clovers and flowers = grass, pillow and quilt = bed. |
| Decoration | Stars mix glow and hard points, sit in open space, and stay off faces. |
| Colour | Bright clean dopamine candy; no greys, beiges or browns; shades and shadows stay in hue; white grain. |

## Common fixes

- **Animal vanishes into the background** → put it on a different hue family (pink on aqua, milk on lime); the blur cannot add contrast.
- **Colours look dirty** → remove grey/beige/brown, tint shadows with a deeper ground hue, use white grain.
- **Looks like it's standing** → raise the arms (`up`/`out`), show beans on all four paws, add 10–20° rotation and a full haze or ripple ring around it.
- **Looks thin or scratchy** → thicken mouth/whiskers to 2.4, line eyes to 2.8.
- **Face looks blurry** → an ink element ended up inside a filtered `<g>`; move it out.
- **Blur ends in a straight line** → enlarge the filter region (the animal fleece uses `x="-50%" width="200%"`).
- **Mush** → too many overlapping soft shapes in similar values; use MID patches in a clearly lighter/darker tone, or a crisp ground pattern for contrast.

## Render and inspect

- `node scripts/render.mjs card.svg card.png`
- `node scripts/render.mjs --sheet sheet.png examples/*.svg card.svg`
- `node scripts/render.mjs card.svg face.png --zoom x,y,w,h --scale 6`
- `node scripts/lint.mjs card.svg --prefix xx-`

Score 0–2 each: style fidelity (soft edges + sharp ink), appeal, belly-up readability, composition, scene clarity. Aim for 8/10.
