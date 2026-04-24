# Colors

ui.css uses a simplified color system based on pre-computed palette scales and
property-specific color variables.

## Palette Colors

The core palette is based on a set of colors defined in `src/css/colors.js` as `COLORS`:

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
stone
taupe
mauve
mist
olive
```

These colors can be overridden/defined. Note that `colors.js` does not define
values for the colors, these need to be provided as corresponding CSS
variables, like `--color-{color}-{luminosity}: …`. Each palette color has 11 luminosity steps:

1. `50` (light)
2. `100`
3. `200`
4. `300`
5. `400`
6. `500` (mid-point, default).
7. `600`
8. `700`
9. `800`
10. `900`
11. `950` (dark)

## Semantic Colors

The semantic color aliases are defined in `src/css/colors.js` as `SEMANTIC`:

- `paper` -> `white`
- `ink` -> `black`
- `neutral` -> `slate`
- `accent` -> `blue`
- `primary` -> `blue`
- `secondary` -> `violet`
- `tertiary` -> `teal`
- `success` -> `green`
- `info` -> `cyan`
- `warning` -> `amber`
- `danger` -> `red`
- `error` -> `red`

These aliases are emitted as root CSS variables such as `--color-primary`.

## Base Color Classes

The color module exposes base classes of the form
`.{bg,tx,bd,ol}-{color}` and `.{bg,tx,bd,ol}-{semantic}`.

## Color Variables

Actual color values are computed colors from these variables:

- `--{background,text,border,outline}-base`
- `--{background,text,border,outline}-tint`
- `--{background,text,border,outline}-blend`
- `--{background,text,border,outline}-opacity`

The computed color is a color-mix of base and tint, then mixed with transparent
through the corresponding opacity value. The resulting color is stored
as `--{background,text,border,outline}-color`.

## Using Colors

Color classes set the base variable for a property:

- `.bg-blue`
- `.tx-zinc`
- `.bd-warning`
- `.ol-rose`

Apply classes emit the corresponding CSS property:

- `.bg` → computes `--background-color` and sets `background-color: var(--background-color)`
- `.tx` → same for `color`
- `.bd` → same for `border-color`, plus default border width and style
- `.ol` → same for `outline-color`

Side-specific helpers are available for borders:

- `.bd-t`, `.bd-r`, `.bd-b`, `.bd-l`

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

- `.{bg,tx,bd,ol}-to-{color}`
- `.{bg,tx,bd,ol}-to-paper`
- `.{bg,tx,bd,ol}-to-ink`
- `.{bg,tx,bd,ol}-to-white`
- `.{bg,tx,bd,ol}-to-black`
- `.{bg,tx,bd,ol}-to-transparent`

`to-transparent` sets opacity to `0`; it does not assign a tint color.

After altering colors you should use the corresponding class `bg`, `bd`, etc to
apply the changes.

## Contrast Text

The `.tx-contrast` helper and `.bg.tx` combined class set:

```text
color: contrast-color(var(--background-color))
```

This derives contrast from the computed background color variable.

## Reset Classes

The color module also exposes direct reset helpers:

```text
.nobg  -> background-color: transparent
.notx  -> color: inherit
.nobd  -> border-color: transparent
.nool  -> outline-color: transparent
```
