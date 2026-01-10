# Colors

## Overview

LittleCSS uses a simplified color system based on pre-computed 10-step luminosity scales. Each semantic color has a scale from 0 (dark, near ink) to 9 (light, near paper), with the base color at position 5.

## Base Colors

- `paper`: white point (#FFFFFF)
- `ink`: black point (#000000)

## Semantic Colors

| Name | Description | OKLCH Definition |
|------|-------------|------------------|
| `neutral` | near-gray, very low chroma | `oklch(0.5 0.02 250)` |
| `primary` | main brand color, calm blue | `oklch(0.5 0.20 250)` |
| `secondary` | secondary brand color, violet | `oklch(0.5 0.20 280)` |
| `tertiary` | tertiary accent, teal | `oklch(0.5 0.20 160)` |
| `success` | positive feedback, green | `oklch(0.5 0.24 145)` |
| `info` | informational, cyan-blue | `oklch(0.5 0.22 220)` |
| `warning` | caution, amber | `oklch(0.5 0.24 90)` |
| `danger` | error/destructive, red | `oklch(0.5 0.28 25)` |

All semantic colors are defined at L=0.5 in OKLCH. The chroma and hue are preserved across the luminosity scale.

## Color Scales

For each semantic color, a 10-step scale is generated at build time:

```css
--color-primary-0: oklch(0.05 0.20 250);  /* near ink */
--color-primary-1: oklch(0.15 0.20 250);
--color-primary-2: oklch(0.25 0.20 250);
--color-primary-3: oklch(0.35 0.20 250);
--color-primary-4: oklch(0.45 0.20 250);
--color-primary-5: oklch(0.55 0.20 250);  /* base color */
--color-primary-6: oklch(0.65 0.20 250);
--color-primary-7: oklch(0.75 0.20 250);
--color-primary-8: oklch(0.85 0.20 250);
--color-primary-9: oklch(0.95 0.20 250);  /* near paper */
```

These can be overridden manually for fine-tuning.

## Global Tokens

| Token | Default | Description |
|-------|---------|-------------|
| `--color-l-direction` | 1 | Luminosity direction: 1 (light mode), -1 (dark mode) |

## Color Properties

Colors can be applied to four properties:

| Property | Prefix | CSS Property |
|----------|--------|--------------|
| Background | `bg` | `background-color` |
| Text | `tx` | `color` |
| Border | `bd` | `border-color` |
| Outline | `ol` | `outline-color` |

## CSS Variables (per property)

| Variable | Range | Default | Description |
|----------|-------|---------|-------------|
| `--{prop}-level` | 0-9 | 5 | Scale position (0=dark, 9=light) |
| `--{prop}-c` | 0-0.4 | varies | Chroma from base color |
| `--{prop}-h` | 0-360 | varies | Hue from base color |
| `--{prop}-alpha` | 0-10 | 10 | Opacity (10=opaque) |
| `--{prop}-blend` | 0-9 | 0 | Blend amount toward target |
| `--{prop}-blending` | color | transparent | Blend target color |

Text also has contrast constraint variables:

| Variable | Description |
|----------|-------------|
| `--text-l-min` | Minimum level (set by `.bg` for contrast) |
| `--text-l-max` | Maximum level (set by `.bg` for contrast) |

## Utility Classes

### Color Classes

Set the color and level for a property:

```
.{bg,tx,bd,ol}-{color}        → level 5 (default)
.{bg,tx,bd,ol}-{color}-{0-9}  → specific level
```

Where color is: `paper`, `ink`, `neutral`, `primary`, `secondary`, `tertiary`, `success`, `info`, `warning`, `danger`

Examples:
```html
<div class="bg-primary bg">Primary at level 5</div>
<div class="bg-primary-8 bg">Light primary (level 8)</div>
<div class="bg-primary-2 bg">Dark primary (level 2)</div>
<div class="tx-danger tx">Danger text</div>
```

**Special handling for ink/paper:**
- `.bg-ink` forces level 0, no chroma
- `.bg-paper` forces level 9, no chroma

### Apply Classes

Apply the computed color to the CSS property:

| Class | Effect |
|-------|--------|
| `.bg` | Apply `background-color` (and set text contrast constraints) |
| `.tx` | Apply `color` (with contrast constraints) |
| `.bd` | Apply `border-color` and `border-width` |
| `.ol` | Apply `outline-color` |

**Important**: Setting modifier classes only sets variables. You must use the apply class to render the color.

### Alpha Classes

Set opacity (0-10 scale, 10 = fully opaque):

```
.{bg,tx,bd,ol}-a{0-10}
```

Examples:
```html
<div class="bg-primary bg-a5 bg">50% opacity</div>
<div class="bg-primary bg-a0 bg">Transparent</div>
```

### Blend Classes

Blend the color toward paper or ink:

```
.{bg,tx,bd,ol}+paper/{1-9}   → blend toward paper
.{bg,tx,bd,ol}+ink/{1-9}     → blend toward ink
```

The number indicates blend percentage (1 = 10%, 9 = 90%).

Examples:
```html
<div class="bg-primary bg+paper/3 bg">Primary blended 30% toward paper</div>
<div class="tx-danger tx+ink/2 tx">Danger text blended 20% toward ink</div>
```

### Reset Classes

Remove color from a property:

```
.bg-no   → --background-alpha: 0
.tx-no   → --text-alpha: 0
.bd-no   → --border-alpha: 0
.ol-no   → --outline-alpha: 0

.nobg    → background-color: transparent (direct CSS)
.notx    → color: inherit
.nobd    → border-color: transparent
.nool    → outline-color: transparent
```

## Automatic Text Contrast

When `.bg` is applied, it automatically sets text level constraints to ensure WCAG-compatible contrast:

- Dark backgrounds (level <= 4) constrain text to light levels (8-9)
- Light backgrounds (level >= 5) constrain text to dark levels (0-1)

The `.tx` class respects these constraints by clamping `--text-level` between `--text-l-min` and `--text-l-max`.

### Override Contrast

Explicitly setting `.tx-{0-9}` removes the automatic constraint:

```html
<div class="bg-primary-3 bg tx-5 tx">Override: medium text on dark bg</div>
```

Use with caution as this may break accessibility.

## Dark Mode

The `.dark` and `.light` classes set mode-specific defaults:

```css
.light, :root {
  --color-l-direction: 1;
  background-color: var(--color-paper);
  color: var(--color-ink);
}

.dark {
  --color-l-direction: -1;
  background-color: var(--color-ink);
  color: var(--color-paper);
}
```

With `--color-l-direction: -1`, the level scale inverts:
- Level 8 in dark mode = dark shade (same visual meaning as level 8 in light mode: "light shade")

This means `.bg-primary-8` always produces a "light shade of primary" regardless of mode.

## Color Computation Formula

The final color is computed as:

```
effective_level = direction == 1 ? level : (9 - level)
L = 0.05 + effective_level * 0.1
base_color = oklch(L, C, H)
blended = color-mix(in oklch, base_color, blending blend*10%)
final = oklch(from blended l c h / alpha/10)
```

## Usage Examples

```html
<!-- Primary background at default level (5) -->
<div class="bg-primary bg">Primary background</div>

<!-- Light primary background -->
<div class="bg-primary-8 bg">Light primary</div>

<!-- Dark background with auto-contrasting text -->
<div class="bg-neutral-2 bg tx">Dark bg, light text (auto)</div>

<!-- Semi-transparent primary -->
<div class="bg-primary bg-a7 bg">70% opacity</div>

<!-- Blended toward paper for muted effect -->
<div class="bg-primary-7 bg+paper/2 bg">Muted primary</div>

<!-- Multiple properties -->
<div class="bg-primary-8 bg bd-primary-6 bd tx-primary tx">
  Light blue bg, medium blue border, blue text
</div>

<!-- Danger with blend for softer appearance -->
<div class="bg-danger-7 bg+paper/3 bg tx">Soft danger alert</div>
```

## Controls Integration

Controls (button, input, selector, etc.) use the same variable system with relative level adjustments for states:

```css
/* Button defaults */
button {
  --background-level: 5;
  --background-c: 0.02;
  --background-h: 250;
}

/* Hover: darken by 1 level */
button:hover {
  --background-level: calc(var(--background-level) - 1);
}

/* Active: darken by 2 levels */
button:active {
  --background-level: calc(var(--background-level) - 2);
}

/* Color variant */
button.primary {
  --background-c: 0.20;
  --background-h: 250;
}
```

This ensures consistent color behavior across utilities and components.

## Adding Custom Colors

Custom colors can be added in `tokens.js`:

```javascript
color: {
  // ... existing colors
  brand: "oklch(0.5 0.18 30)",  // custom orange
}
```

The build system will generate the 10-step scale and utility classes automatically.

Alternatively, override specific scale positions in CSS:

```css
:root {
  --color-brand-0: oklch(0.05 0.18 30);
  --color-brand-1: oklch(0.15 0.18 30);
  /* ... */
  --color-brand-9: oklch(0.95 0.18 30);
}
```
