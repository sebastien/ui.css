# Colors

ui.css uses semantic and palette color tokens with property-specific paint
variables.

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

These colors can be defined or overridden directly as `--color-{color}`. A
palette can expose any additional scale tokens it needs, but ui.css utilities
only depend on the unqualified palette name.

## Semantic Colors

The semantic vocabulary is defined in `src/css/colors.js` as `SEMANTIC`; the
actual values are root tokens from `src/css/tokens.js` and can be themed:

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

## Color Roles And Paint Channels

Global tokens describe semantic intent and inherit through the document:

- `--color-page`, `--color-text` — page roles, swapped by `.light` and `.dark`
- `--color-surface`, `--color-surface-text` — component surface roles
- `--accent-color` — the nearest component or container semantic identity

Paint channels are local to a painted element. Components initialize them and
utilities can override them in the later `colors` cascade layer:

Actual color values are computed colors from these variables:

- `--{background,text,border,outline}-color-base`
- `--{background,text,border,outline}-color-tint`
- `--{background,text,border,outline}-color-blend`
- `--{background,text,border,outline}-color-opacity`

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

- `.{bg,tx,bd,ol}-{0..9}o`, plus unnumbered `.{bg,tx,bd,ol}o`
- `0` means fully transparent
- `9` means 90% opaque; the unnumbered form is fully opaque

Blend helpers:

- `.{bg,tx,bd,ol}-{0..9}b`, plus unnumbered `.{bg,tx,bd,ol}b`
- `0` means 100% tint
- `9` means 90% base; the unnumbered form is 100% base

Tint helpers:

- `.{bg,tx,bd,ol}-to-{color}`
- `.{bg,tx,bd,ol}-to-paper`
- `.{bg,tx,bd,ol}-to-ink`
- `.{bg,tx,bd,ol}-to-white`
- `.{bg,tx,bd,ol}-to-black`
- `.{bg,tx,bd,ol}-to-transparent`

`to-transparent` sets opacity to `0`; it does not assign a tint color.

Add the corresponding apply class (`bg`, `bd`, etc.) to paint a channel. The
utility layer comes after controls and components, so `bg bg-primary`,
`bd bd-danger`, and `ol ol-primary` override component chrome without needing
component-specific color selectors.

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
