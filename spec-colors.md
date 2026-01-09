# Colors

## Base Colors

- `white`: white point (page in light mode, text in dark mode)
- `black`: black point (page in dark mode, text in light mode)

## Semantic Colors

- `neutral`: near-gray, very low chroma
- `primary`: main brand color (blue)
- `secondary`: secondary brand color (violet)
- `tertiary`: tertiary accent (teal)
- `success`: positive feedback (green)
- `info`: informational (cyan-blue)
- `warning`: caution (amber)
- `danger`: error/destructive (red)

All semantic colors are defined at L=0.5 in OKLCH as a neutral baseline.

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

Examples:
- `.bg-primary` → `--background-base: var(--color-primary)`
- `.tx-danger` → `--text-base: var(--color-danger)`
- `.bd-neutral` → `--border-base: var(--color-neutral)`

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
.bg   → applies background-color
.tx   → applies color
.bd   → applies border-color
.ol   → applies outline-color
```

**Important**: Setting modifier classes (`.bg-primary`, `.bg-8`, etc.) only sets
variables. You must use `.bg` to actually apply the color.

## Automatic Text Contrast

When `.bg` is applied, it automatically sets text luminosity constraints to
ensure WCAG 4.5:1 contrast ratio:

- Light backgrounds (L > 4) constrain text to dark (L: 0-2)
- Dark backgrounds (L <= 4) constrain text to light (L: 7-9)

The `.tx` class respects these constraints by clamping `--text-l` between
`--text-l-min` and `--text-l-max`.

### Override Contrast

Explicitly setting `.tx-{0-9}` removes the automatic constraint, allowing
any luminosity value. Use with caution as this may break accessibility.

## Dark Mode

The `.dark` and `.light` classes set mode-specific defaults:

```css
.light, :root {
  --color-page: var(--color-white);
  --color-text: var(--color-black);
}

.dark {
  --color-page: var(--color-black);
  --color-text: var(--color-white);
}
```

Components and controls inherit these values and adjust their color
computations accordingly.

## Color Computation Formula

The final color is computed as:

```
L = clamp(0, 0.05 + (l + delta-l) / 10, 1)   // 0→0.05 (near-black), 9→0.95 (near-white)
C = clamp(0, (c + delta-c) / 9 * 0.4, 0.4)
H = base-hue + (h + delta-h) * 40
A = clamp(0, (o + delta-o) / 9, 1)

color = oklch(L C H / A)
```

The luminosity scale maps 0-9 to OKLCH L values of 0.05-0.95, ensuring that:
- `l=0` produces near-black (L=0.05) but never pure black
- `l=9` produces near-white (L=0.95) but never pure white

For text with contrast constraints:
```
L = clamp(0.05 + l-min / 10, 0.05 + (l + delta-l) / 10, 0.05 + l-max / 10)
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
