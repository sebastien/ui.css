# Colors Module Reference

The `colors.js` module provides utility classes for applying colors to backgrounds, text, borders, and outlines using a direction-aware OKLCH color system.

## Usage

```javascript
import colors from "littlecss/css/colors.js";
import { css } from "littlecss/js/littlecss.js";

for (const line of css(colors)) {
    console.log(line);
}
```

## Apply Classes

Apply computed colors from CSS variables:

| Class | Property | Description |
|-------|----------|-------------|
| `.bg` | `background-color` | Applies background and sets text contrast constraints |
| `.tx` | `color` | Applies text color with WCAG contrast clamping |
| `.bd` | `border-color` | Applies border color and width |
| `.ol` | `outline-color` | Applies outline color |

**Important**: Modifier classes only set variables. Use apply classes to render the color.

```html
<!-- Set primary color AND apply it -->
<div class="bg-primary bg">Primary background</div>

<!-- Set color variables without applying -->
<div class="bg-primary bg-primary-7">Variables set, no visible color yet</div>
```

## Semantic Colors

Available color names: `paper`, `ink`, `neutral`, `primary`, `secondary`, `tertiary`, `success`, `info`, `warning`, `danger`

### Background Colors

```html
<div class="bg-primary bg">Primary background</div>
<div class="bg-success bg">Success background</div>
<div class="bg-danger bg">Danger background</div>
<div class="bg-warning bg">Warning background</div>
<div class="bg-info bg">Info background</div>
<div class="bg-neutral bg">Neutral background</div>
```

### Text Colors

```html
<span class="tx-primary tx">Primary text</span>
<span class="tx-danger tx">Danger text</span>
<span class="tx-success tx">Success text</span>
```

### Border Colors

```html
<div class="bd-primary bd">Primary border</div>
<div class="bd-danger bd">Danger border</div>
```

### Outline Colors

```html
<button class="ol-primary ol">Primary outline</button>
```

### Special Colors: Ink and Paper

`ink` and `paper` are scale endpoint colors that swap in dark/light mode:

```html
<!-- ink: level 0 (black in light mode, white in dark mode) -->
<span class="tx-ink tx">Always maximum contrast text</span>

<!-- paper: level 9 (white in light mode, black in dark mode) -->
<div class="bg-paper bg">Always page background color</div>
```

These colors have level set to 0 (ink) or 9 (paper) with zero chroma.

## Level Scale (0-9)

Set absolute level on the 0-9 scale using `.{prop}-{color}-{level}`:

| Value | Light Mode | Dark Mode |
|-------|------------|-----------|
| 0 | Near-black (L=0.05) | Near-white (L=0.95) |
| 5 | Mid-tone (L=0.55) | Mid-tone (L=0.45) |
| 9 | Near-white (L=0.95) | Near-black (L=0.05) |

```html
<div class="bg-primary-8 bg">Light primary (level=8)</div>
<div class="bg-primary-2 bg">Dark primary (level=2)</div>
<div class="bg-neutral-7 bg">Light gray</div>
```

### Default Level

Using `.{prop}-{color}` without a level suffix sets level to 5 (mid-tone):

```html
<div class="bg-primary bg">Primary at level 5</div>
```

### Text Level Override

For text, setting `.tx-{0-9}` also removes WCAG contrast constraints:

```html
<!-- Auto-contrast: text adapts to background -->
<div class="bg-primary-2 bg tx">Auto light text on dark bg</div>

<!-- Manual override: force specific level -->
<div class="bg-primary-2 bg tx-5 tx">Mid-tone text (may break contrast)</div>
```

## Alpha Classes (0-10)

Set opacity with `.{prop}-a{0-10}`:

```html
<div class="bg-primary bg-a0 bg">Transparent</div>
<div class="bg-primary bg-a5 bg">50% opacity</div>
<div class="bg-primary bg-a10 bg">Fully opaque</div>
```

## Blend Classes

Blend toward ink or paper using `.{prop}+ink/{1-9}` or `.{prop}+paper/{1-9}`:

```html
<div class="bg-primary bg+paper/3 bg">Blend 30% toward paper</div>
<div class="bg-primary bg+ink/2 bg">Blend 20% toward ink</div>
```

| Pattern | Effect |
|---------|--------|
| `.bg+paper/1` | 10% blend toward paper |
| `.bg+paper/5` | 50% blend toward paper |
| `.bg+ink/3` | 30% blend toward ink |

## Reset/Remove Colors

### Using Variables (sets alpha to 0)

| Class | Description |
|-------|-------------|
| `.bg-no` | `--background-alpha: 0` |
| `.tx-no` | `--text-alpha: 0` |
| `.bd-no` | `--border-alpha: 0` |
| `.ol-no` | `--outline-alpha: 0` |

### Direct Transparent (bypasses variables)

| Class | Description |
|-------|-------------|
| `.nobg` | `background-color: transparent` |
| `.notx` | `color: inherit` |
| `.nobd` | `border-color: transparent` |
| `.nool` | `outline-color: transparent` |

## Dark/Light Mode

The system automatically adapts to dark/light mode via direction-aware level calculation:

```html
<!-- These classes set the mode -->
<body class="light">...</body>
<body class="dark">...</body>

<!-- Colors automatically invert in dark mode -->
<div class="bg-primary-7 bg">
    Light shade in both modes (adapts automatically)
</div>
```

| Class | Effect |
|-------|--------|
| `.light` | `--color-l-direction: 1` (default) |
| `.dark` | `--color-l-direction: -1` |

## Automatic Text Contrast

When `.bg` is applied, it sets text level constraints based on background:

- Background level >= 5 (light): text constrained to level 0-1 (dark)
- Background level <= 4 (dark): text constrained to level 8-9 (light)

```html
<!-- Text automatically contrasts with background -->
<div class="bg-primary-8 bg tx">Dark text on light bg (auto)</div>
<div class="bg-primary-2 bg tx">Light text on dark bg (auto)</div>
```

## Usage Examples

### Status Badges with Auto-Contrast

```html
<span class="bg-success bg tx p-xs">Success</span>
<span class="bg-warning bg tx p-xs">Warning</span>
<span class="bg-danger bg tx p-xs">Error</span>
<span class="bg-info bg tx p-xs">Info</span>
```

### Card with Subtle Background

```html
<div class="bg-neutral-8 bg p-m bd-neutral-6 bd">
    <h3 class="tx">Card Title</h3>
    <p class="tx-neutral-4 tx">Muted text content</p>
</div>
```

### Semantic Color Shades

```html
<div class="bg-primary-8 bg p-m">Light primary</div>
<div class="bg-primary bg p-m tx">Medium primary (level 5)</div>
<div class="bg-primary-2 bg p-m tx">Dark primary</div>
```

### Transparent Overlays

```html
<div class="rel">
    <img src="photo.jpg" alt="Background">
    <div class="cover bg-ink bg-a5 bg tx centered">
        Overlay text
    </div>
</div>
```

### Form Validation States

```html
<input class="bd-success bd" placeholder="Valid input">
<input class="bd-danger bd" placeholder="Invalid input">
<input class="bd-warning bd" placeholder="Warning state">
```

### Button Variants

```html
<!-- Filled button with auto-contrast text -->
<button class="bg-primary bg tx">Primary</button>

<!-- Outline button -->
<button class="bg-no bd-primary bd tx-primary tx">Outline</button>

<!-- Ghost button -->
<button class="nobg nobd tx-primary tx">Ghost</button>
```

### Multiple Properties

```html
<div class="bg-primary-8 bg bd-primary-5 bd tx-primary tx">
    Primary bg (light), darker border, primary text
</div>
```

### Blended Colors

```html
<!-- Soften a color by blending toward paper -->
<button class="bg-primary bg+paper/2 bg tx">Softened primary</button>

<!-- Deepen a color by blending toward ink -->
<button class="bg-primary bg+ink/1 bg tx">Deepened primary</button>
```

## CSS Variables Reference

Each property has these variables:

| Variable | Range | Description |
|----------|-------|-------------|
| `--{prop}-level` | 0-9 | Scale position (0=dark, 9=light) |
| `--{prop}-c` | 0-0.4 | Chroma |
| `--{prop}-h` | 0-360 | Hue |
| `--{prop}-alpha` | 0-10 | Opacity (10=opaque) |
| `--{prop}-blend` | 0-9 | Blend amount toward blending target |
| `--{prop}-blending` | color | Blend target color |

Text-specific:

| Variable | Description |
|----------|-------------|
| `--text-l-min` | Minimum level (set by `.bg`) |
| `--text-l-max` | Maximum level (set by `.bg`) |

Global:

| Variable | Default | Description |
|----------|---------|-------------|
| `--color-l-direction` | 1 | 1 (light) or -1 (dark) |

## Color Computation Formula

Colors are computed using OKLCH:

```
L = 0.05 + effective_level * 0.1
effective_level = direction == 1 ? level : (9 - level)
color = oklch(L C H / alpha)
```

Blending uses `color-mix`:
```
blended = color-mix(in oklch, base, blending blend*10%)
```

## Class Pattern Summary

| Pattern | Example | Effect |
|---------|---------|--------|
| `.{prop}-{color}` | `.bg-primary` | Color at level 5 |
| `.{prop}-{color}-{0-9}` | `.bg-primary-8` | Color at specific level |
| `.{prop}-a{0-10}` | `.bg-a7` | 70% alpha |
| `.{prop}+paper/{1-9}` | `.bg+paper/3` | Blend 30% toward paper |
| `.{prop}+ink/{1-9}` | `.tx+ink/2` | Blend 20% toward ink |
| `.tx-{0-9}` | `.tx-3` | Text level (disables contrast) |
| `.{prop}-no` | `.bg-no` | Set alpha to 0 |
| `.no{prop}` | `.nobg` | Direct transparent |
