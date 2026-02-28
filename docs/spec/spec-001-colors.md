# Colors

LittleCSS uses a simplified color system based on pre-computed 10-step
luminosity scales.

## Color Types

### Palette Color

At the core, colors are defined based on a palette of named colors:

```
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

default color names are defined in the `COLORS` export of the `colors.js` module.

Each color has 11 variations based on an OKLCH luminosity gradient, where 0 is the lightest
and 1000 the darkest:

1. 50
2. 100
3. 200
4. 300
5. 400
6. 500
7. 600
8. 700
9. 800
10. 900
11. 950

This follows the TailwindCSS colors <https://tailwindcss.com/docs/colors>. Each
color has corresponding css variable `--color-{name}-{luminosity}`, eg `--color-zinc-950`.

Depending on the mode (light or dark), each color is then mapped to its
corresponding index 0 to 10 inclusive. In light mode `color-zinc-10` will alias to `color-zinc-950`
but in dark mode, it will alias to `color-zinc-10`.

### Base colors

Two base colors define the paper and ink, which is useful for dark and light
modes, where they are inverted:

- `paper`: white point (#FFFFFF)
- `ink`: black point (#000000)

## Semantic Colors

The following colors are semantic:

- `neutral`, near-gray, very low chroma
- `primary` , main brand color, calm blue
- `secondary` , secondary brand color, violet
- `tertiary` , tertiary accent, teal
- `success` , positive feedback, green
- `info` , informational, cyan-blue
- `warning` , caution, amber
- `danger` , error/destructive, red
- `accent`, typically aliased to primary

## Color computation

LittleCSS using the following variables to compute the final applied color:

- `--{type}-base` for the base color (eg. `--background-base` or `--text-base`)
- `--{type}-tint` the tint color to blend to (default paper)
- `--{type}-blend` 0=100% tint, 10=100% base (default 10)
- `--{type}-opacity` for affecting opacity, 0=transparent,10=opaque (default 10)

## Using colors

Current colors are mapped to `--{background,border,text,outline}-base`. To assign
a given color to the corresponding CSS variable, use `.{bg,bd,tx,ol}-{color}-{index}`,
like `.bg-zinc-4`. Note that because we use the index here, this will work nicely
when switching from dark to light.

To apply the current color to the background, border, text or outline, use `.{bg,bd,tx,ol}`. Without
it, only the CSS variable is changed.

## Contrast Colors

The `.tx-contrast` class automatically sets the text color to ensure maximum contrast against the
background. This uses CSS `contrast-color()` to dynamically select between paper (light) and ink (dark)
based on the computed background color.

```
.bg-primary.tx-contrast  → Text color automatically contrasts with primary background
```

## Altering colors

- Changing opacity can be done through `.{bg,bd,tx,ol}-{0,1,2,3,4,5,6,7,8,9,10}o`
- Changing blend can be done through `.{bg,bd,tx,ol}-{0,1,2,3,4,5,6,7,8,9,10}b`
- Changing tint can be done through `.{bg,bd,tx,ol}-to-{name}-{index}`

### Reset Classes

```
.nobg    → background-color: transparent (direct CSS)
.notx    → color: inherit
.nobd    → border-color: transparent
.nool    → outline-color: transparent
```

### Dark modes

By using `dark` or `light`, the indices in color are switched, so that in light 10 maps to 950, while in dark it maps to 50.
