# Colors

## Base Colors

- `paper`: white point (page in light mode, text in dark mode) - scale position 9
- `ink`: black point (page in dark mode, text in light mode) - scale position 0

## Semantic Colors

- `neutral`: near-gray, very low chroma (oklch 0.5 0.02 250)
- `primary`: main brand color, calm blue (oklch 0.5 0.20 250)
- `secondary`: secondary brand color, violet (oklch 0.5 0.20 280)
- `tertiary`: tertiary accent, teal (oklch 0.5 0.20 160)
- `success`: positive feedback, green (oklch 0.5 0.24 145)
- `info`: informational, cyan-blue (oklch 0.5 0.22 220)
- `warning`: caution, amber (oklch 0.5 0.24 90)
- `danger`: error/destructive, red (oklch 0.5 0.28 25)

All semantic colors are defined at L=0.5 in OKLCH as a neutral baseline.

## Global Color Tokens

| Token | Default | Description |
|-------|---------|-------------|
| `--color-l-direction` | 1 | Luminosity direction: 1 (light mode), -1 (dark mode) |
| `--color-saturation` | 0.8 | Global saturation multiplier |
| `--color-temperature` | 0.15 | Warm/cool shift intensity |
| `--color-warm` | 60 | Hue degrees to shift toward warm at light extremes |
| `--color-cool` | 100 | Hue degrees to shift toward cool at dark extremes |

## Color Properties

Colors can be applied to four properties:

| Property | Prefix | CSS Property | Variable Prefix |
|----------|--------|--------------|-----------------|
| Background | `bg` | `background-color` | `--background-` |
| Text | `tx` | `color` | `--text-` |
| Border | `bd` | `border-color` | `--border-` |
| Outline | `ol` | `outline-color` | `--outline-` |

## CSS Variables

Each property has these CSS variables:

| Variable | Range | Description |
|----------|-------|-------------|
| `--{prop}-base` | color | The semantic base color |
| `--{prop}-l` | 0-9 | Luminosity (0=darkest, 9=lightest) |
| `--{prop}-c` | 0-9 | Chroma (0=gray, 9=vivid) |
| `--{prop}-h` | 0-9 | Hue offset from base (each unit = 40°) |
| `--{prop}-o` | 0-9 | Opacity (0=transparent, 9=opaque) |
| `--{prop}-delta-l` | -9 to +9 | Relative luminosity adjustment |
| `--{prop}-delta-c` | -9 to +9 | Relative chroma adjustment |
| `--{prop}-delta-h` | -9 to +9 | Relative hue adjustment |
| `--{prop}-delta-o` | -9 to +9 | Relative opacity adjustment |

Text also has contrast constraint variables:

| Variable | Description |
|----------|-------------|
| `--text-l-min` | Minimum luminosity (set by `.bg` for contrast) |
| `--text-l-max` | Maximum luminosity (set by `.bg` for contrast) |

## Utility Classes

### Semantic Color Classes

Set the base color for a property:

```
.{bg,tx,bd,ol}-{color}
```

Where color is one of: `paper`, `ink`, `neutral`, `primary`, `secondary`, `tertiary`, `success`, `info`, `warning`, `danger`

Examples:
- `.bg-primary` → `--background-base: var(--color-primary)`
- `.tx-danger` → `--text-base: var(--color-danger)`
- `.bd-neutral` → `--border-base: var(--color-neutral)`

**Special handling for ink/paper:**
- `.bg-ink` forces `l=0, c=0` (ignores luminosity/chroma modifiers)
- `.bg-paper` forces `l=9, c=0` (ignores luminosity/chroma modifiers)
- Opacity adjustments still apply to both

### Luminosity Classes

Set absolute luminosity (0-9):

```
.{bg,tx,bd,ol}-{0-9}
```

Examples:
- `.bg-8` → `--background-l: 8` (light background)
- `.bg-2` → `--background-l: 2` (dark background)
- `.tx-1` → `--text-l: 1` (dark text)

### Chroma Classes

Set absolute chroma (0-9):

```
.{bg,tx,bd,ol}-{0-9}c
```

Examples:
- `.bg-0c` → `--background-c: 0` (grayscale)
- `.bg-9c` → `--background-c: 9` (vivid/saturated)

### Opacity Classes

Set absolute opacity (0-9):

```
.{bg,tx,bd,ol}-{0-9}o
```

Examples:
- `.bg-5o` → `--background-o: 5` (50% opacity)
- `.bg-0o` → `--background-o: 0` (transparent)

### Delta Luminosity Classes

Relative luminosity adjustment:

```
.{bg,tx,bd,ol}-l+{1-9}   (lighter)
.{bg,tx,bd,ol}-l-{1-9}   (darker)
```

Examples:
- `.bg-l+2` → `--background-delta-l: 2`
- `.bg-l-1` → `--background-delta-l: -1`

### Named Luminosity Variants

Preset delta values:

| Class | Delta | Effect |
|-------|-------|--------|
| `.{prop}-darkest` | -4 | Much darker |
| `.{prop}-darker` | -2 | Darker |
| `.{prop}-dark` | -1 | Slightly darker |
| `.{prop}-light` | +1 | Slightly lighter |
| `.{prop}-lighter` | +2 | Lighter |
| `.{prop}-lightest` | +4 | Much lighter |

### Delta Chroma/Hue/Opacity Classes

```
.{bg,tx,bd,ol}-c+{1-9}   (more saturated)
.{bg,tx,bd,ol}-c-{1-9}   (less saturated)
.{bg,tx,bd,ol}-h+{1-9}   (hue shift +)
.{bg,tx,bd,ol}-h-{1-9}   (hue shift -)
.{bg,tx,bd,ol}-o+{1-9}   (more opaque)
.{bg,tx,bd,ol}-o-{1-9}   (more transparent)
```

### Apply Classes

Apply the computed color to the CSS property:

```
.bg   → applies background-color (and sets text contrast constraints)
.tx   → applies color (with contrast constraints)
.bd   → applies border-color (and border-width)
.ol   → applies outline-color
```

**Important**: Setting modifier classes (`.bg-primary`, `.bg-8`, etc.) only sets
variables. You must use `.bg` to actually apply the color.

### Reset Classes

Remove color from a property:

```
.bg-no   → --background-o: 0 (transparent via opacity)
.tx-no   → --text-o: 0
.bd-no   → --border-o: 0
.ol-no   → --outline-o: 0

.nobg    → background-color: transparent (direct CSS)
.notx    → color: inherit
.nobd    → border-color: transparent
.nool    → outline-color: transparent
```

## Automatic Text Contrast

When `.bg` is applied, it automatically sets text luminosity constraints to
ensure WCAG 4.5:1 contrast ratio:

- Light backgrounds (L >= 6, threshold 5.5) constrain text to dark (L: 0-1)
- Dark backgrounds (L <= 5, threshold 5.5) constrain text to light (L: 8-9)

The threshold at 5.5 means:
- `bg-5` → text toward paper (light: 8-9, dark: 0-1)
- `bg-6` → text toward ink (light: 0-1, dark: 8-9)

The `.tx` class respects these constraints by clamping `--text-l` between
`--text-l-min` and `--text-l-max`.

### Override Contrast

Explicitly setting `.tx-{0-9}` removes the automatic constraint, allowing
any luminosity value. Use with caution as this may break accessibility.

## Dark Mode

The `.dark` and `.light` classes set mode-specific defaults:

```css
.light, :root {
  --color-page: var(--color-paper);
  --color-text: var(--color-ink);
  --color-l-direction: 1;
}

.dark {
  --color-page: var(--color-ink);
  --color-text: var(--color-paper);
  --color-l-direction: -1;
}
```

The direction-aware luminosity formula automatically inverts the scale in dark mode,
so `l=7` always means "light shade" regardless of mode.

## Color Computation Formula

The final color is computed using direction-aware luminosity:

```
L = 0.5 + direction * (l + delta-l - 4.5) / 10
    direction=1 (light mode):  0→0.05 (near-black), 9→0.95 (near-white)
    direction=-1 (dark mode):  0→0.95 (near-white), 9→0.05 (near-black)

C = clamp(0, (c + delta-c) / 9 * base-chroma * 2.5 * saturation, 0.4)

H = base-hue + (h + delta-h) * 40 + temperature-shift
    temperature-shift = temperature * (
        max(0, L - 0.5) * 2 * warm    // lights shift toward warm
      - max(0, 0.5 - L) * 2 * cool    // darks shift toward cool
    )

A = clamp(0, (o + delta-o) / 9, 1)

color = oklch(L C H / A)
```

The direction-aware luminosity provides automatic dark mode support:
- In light mode (direction=1): `l=0` produces near-black, `l=9` produces near-white
- In dark mode (direction=-1): `l=0` produces near-white, `l=9` produces near-black

For text with contrast constraints:
```
L = clamp(L-min, L-base, L-max)
where L-min and L-max are computed using the same direction-aware formula
```

## Usage Examples

```html
<!-- Primary color, light shade, applied to background -->
<div class="bg-primary bg-8 bg">Light blue background</div>

<!-- Dark background with auto-contrasting text -->
<div class="bg-neutral bg-2 bg tx">Dark bg, light text (auto)</div>

<!-- Danger color, reduced chroma, semi-transparent -->
<div class="bg-danger bg-5c bg-7o bg">Muted red, 70% opacity</div>

<!-- Multiple properties -->
<div class="bg-primary bg-8 bg bd-primary bd-6 bd tx-primary tx">
  Blue bg, darker blue border, blue text
</div>

<!-- Using delta adjustments for hover states -->
<button class="bg-primary bg-6 bg hover:bg-l-1">
  Darkens on hover
</button>
```

## Controls Integration

Controls (button, input, selector, etc.) use the same variable system:

```css
button {
  --background-base: var(--color-neutral);
  --background-l: 5;
  --background-o: 9;
}

button:hover {
  --background-delta-l: -1;
}

button:active {
  --background-delta-l: -2;
}

button.primary {
  --background-base: var(--color-primary);
}
```

This ensures consistent color behavior across utilities and components.
