# Colors

ui.css uses a simplified color system based on pre-computed palette scales and
property-specific color variables.

## Palette Colors

The core palette is defined in `src/css/colors.js` as `COLORS`:

```text
red
orange
amber
yellow
lime
green
emerald
teal
cyan
sky
blue
indigo
violet
purple
fuchsia
pink
rose
slate
gray
zinc
neutral
stone
taupe
mauve
mist
olive
```

Each palette color has 11 luminosity steps defined in `src/css/palette.css`:

1. `50`
2. `100`
3. `200`
4. `300`
5. `400`
6. `500`
7. `600`
8. `700`
9. `800`
10. `900`
11. `950`

These are exposed as CSS variables such as `--color-zinc-950`.

## Semantic Colors

The semantic color aliases are defined in `src/css/colors.js` as `SEMANTIC`:

- `paper` -> `white`
- `ink` -> `black`
- `neutral` -> `slate`
- `primary` -> `blue`
- `secondary` -> `violet`
- `tertiary` -> `teal`
- `success` -> `green`
- `info` -> `cyan`
- `warning` -> `amber`
- `danger` -> `red`
- `accent` -> `blue`

These aliases are emitted as root CSS variables such as `--color-primary`.

## Indexed Color Classes

The color module exposes indexed classes of the form
`.{bg,tx,bd,ol}-{color}-{index}`.

The current implementation maps indexes directly to the following luminosity
steps:

- `0` -> `950`
- `1` -> `900`
- `2` -> `800`
- `3` -> `700`
- `4` -> `600`
- `5` -> `500`
- `6` -> `400`
- `7` -> `300`
- `8` -> `200`
- `9` -> `100`
- `10` -> `50`

This mapping is fixed. The `.dark` class currently swaps page and text defaults,
but does not invert indexed color classes.

## Color Variables

ui.css computes applied colors from these variables:

- `--{background,text,border,outline}-base`
- `--{background,text,border,outline}-tint`
- `--{background,text,border,outline}-blend`
- `--{background,text,border,outline}-opacity`

The computed color is a color-mix of base and tint, then mixed with transparent
through the corresponding opacity value.

## Using Colors

Color classes set the base variable for a property:

- `.bg-blue`
- `.tx-zinc-3`
- `.bd-warning`
- `.ol-rose-7`

Apply classes emit the corresponding CSS property:

- `.bg` -> `background-color`
- `.tx` -> `color`
- `.bd` -> `border-color`, plus default border width and style
- `.ol` -> `outline-color`

Side-specific helpers are also available for borders and outlines:

- `.bd-t`, `.bd-r`, `.bd-b`, `.bd-l`
- `.ol-t`, `.ol-r`, `.ol-b`, `.ol-l`

## Altering Colors

Opacity helpers:

- `.{bg,tx,bd,ol}-{0..10}o`
- `0` means fully transparent
- `10` means fully opaque

Blend helpers:

- `.{bg,tx,bd,ol}-{0..10}b`
- `0` means 100% tint
- `10` means 100% base

Tint helpers:

- `.{bg,tx,bd,ol}-to-{color}-{0..10}`
- `.{bg,tx,bd,ol}-to-paper`
- `.{bg,tx,bd,ol}-to-ink`
- `.{bg,tx,bd,ol}-to-transparent`

`to-transparent` sets opacity to `0`; it does not assign a tint color.

## Contrast Text

The `.tx-contrast` helper sets:

```text
color: contrast-color(var(--text-base))
```

It currently derives contrast from `--text-base`.

## Reset Classes

The color module also exposes direct reset helpers:

```text
.nobg  -> background-color: transparent
.notx  -> color: inherit
.nobd  -> border-color: transparent
.nool  -> outline-color: transparent
```
