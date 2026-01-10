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
<div class="bg-primary bg-7">Variables set, no visible color yet</div>
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
<!-- ink: scale position 0 (black in light mode, white in dark mode) -->
<span class="tx-ink tx">Always maximum contrast text</span>

<!-- paper: scale position 9 (white in light mode, black in dark mode) -->
<div class="bg-paper bg">Always page background color</div>
```

These colors ignore luminosity/chroma modifiers but respect opacity.

## Luminosity Scale (0-9)

Set absolute luminosity on the 0-9 scale:

| Value | Light Mode | Dark Mode |
|-------|------------|-----------|
| 0 | Near-black (L=0.05) | Near-white (L=0.95) |
| 5 | Mid-tone (L=0.55) | Mid-tone (L=0.45) |
| 9 | Near-white (L=0.95) | Near-black (L=0.05) |

```html
<div class="bg-primary bg-8 bg">Light primary (l=8)</div>
<div class="bg-primary bg-2 bg">Dark primary (l=2)</div>
<div class="bg-neutral bg-7 bg">Light gray</div>
```

### Text Luminosity Override

For text, setting `.tx-{0-9}` also removes WCAG contrast constraints:

```html
<!-- Auto-contrast: text adapts to background -->
<div class="bg-primary bg-2 bg tx">Auto light text on dark bg</div>

<!-- Manual override: force specific luminosity -->
<div class="bg-primary bg-2 bg tx-5 tx">Mid-tone text (may break contrast)</div>
```

## Chroma Classes (0-9)

Set color saturation with the `c` suffix:

```html
<div class="bg-primary bg-0c bg">Grayscale (no chroma)</div>
<div class="bg-primary bg-5c bg">Medium saturation</div>
<div class="bg-primary bg-9c bg">Maximum saturation</div>
```

## Opacity Classes (0-9)

Set opacity with the `o` suffix:

```html
<div class="bg-primary bg-0o bg">Transparent</div>
<div class="bg-primary bg-5o bg">50% opacity</div>
<div class="bg-primary bg-9o bg">Fully opaque</div>
```

## Delta Modifiers

Adjust values relative to the base:

### Delta Luminosity

```html
<div class="bg-primary bg-l+2 bg">Lighter (+2)</div>
<div class="bg-primary bg-l-1 bg">Darker (-1)</div>
```

### Named Luminosity Variants

| Class | Delta | Effect |
|-------|-------|--------|
| `.{prop}-darkest` | -4 | Much darker |
| `.{prop}-darker` | -2 | Darker |
| `.{prop}-dark` | -1 | Slightly darker |
| `.{prop}-light` | +1 | Slightly lighter |
| `.{prop}-lighter` | +2 | Lighter |
| `.{prop}-lightest` | +4 | Much lighter |

```html
<div class="bg-primary bg-lighter bg">Lighter primary</div>
<div class="bg-primary bg-darker bg">Darker primary</div>
```

### Delta Chroma

```html
<div class="bg-primary bg-c+2 bg">More saturated</div>
<div class="bg-primary bg-c-2 bg">Less saturated</div>
```

### Delta Hue

Each unit shifts hue by 40 degrees:

```html
<div class="bg-primary bg-h+1 bg">Hue shifted +40°</div>
<div class="bg-primary bg-h-1 bg">Hue shifted -40°</div>
```

### Delta Opacity

```html
<div class="bg-primary bg-o+2 bg">More opaque</div>
<div class="bg-primary bg-o-2 bg">More transparent</div>
```

## Reset/Remove Colors

### Using Variables (sets opacity to 0)

| Class | Description |
|-------|-------------|
| `.bg-no` | `--background-o: 0` |
| `.tx-no` | `--text-o: 0` |
| `.bd-no` | `--border-o: 0` |
| `.ol-no` | `--outline-o: 0` |

### Direct Transparent (bypasses variables)

| Class | Description |
|-------|-------------|
| `.nobg` | `background-color: transparent` |
| `.notx` | `color: inherit` |
| `.nobd` | `border-color: transparent` |
| `.nool` | `outline-color: transparent` |

## Dark/Light Mode

The system automatically adapts to dark/light mode via direction-aware luminosity:

```html
<!-- These classes set the mode -->
<body class="light">...</body>
<body class="dark">...</body>

<!-- Colors automatically invert in dark mode -->
<div class="bg-primary bg-7 bg">
    Light shade in both modes (adapts automatically)
</div>
```

| Class | Effect |
|-------|--------|
| `.light` | `--color-l-direction: 1` (default) |
| `.dark` | `--color-l-direction: -1` |

## Automatic Text Contrast

When `.bg` is applied, it sets text luminosity constraints based on background:

- Background L >= 6 (light): text constrained to L 0-1 (dark)
- Background L <= 5 (dark): text constrained to L 8-9 (light)

```html
<!-- Text automatically contrasts with background -->
<div class="bg-primary bg-8 bg tx">Dark text on light bg (auto)</div>
<div class="bg-primary bg-2 bg tx">Light text on dark bg (auto)</div>
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
<div class="bg-neutral bg-8 bg p-m bd-neutral bd-6 bd">
    <h3 class="tx">Card Title</h3>
    <p class="tx-neutral tx-4 tx">Muted text content</p>
</div>
```

### Semantic Color Shades

```html
<div class="bg-primary bg-8 bg p-m">Light primary</div>
<div class="bg-primary bg-5 bg p-m tx">Medium primary</div>
<div class="bg-primary bg-2 bg p-m tx">Dark primary</div>
```

### Transparent Overlays

```html
<div class="rel">
    <img src="photo.jpg" alt="Background">
    <div class="cover bg-ink bg-5o bg tx centered">
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
<div class="bg-primary bg-8 bg bd-primary bd-5 bd tx-primary tx">
    Primary bg (light), darker border, primary text
</div>
```

### Hover State with Delta

```html
<button class="bg-primary bg hover:bg-l-1">
    Darkens on hover
</button>
```

## CSS Variables Reference

Each property has these variables:

| Variable | Range | Description |
|----------|-------|-------------|
| `--{prop}-base` | color | Semantic base color |
| `--{prop}-l` | 0-9 | Luminosity |
| `--{prop}-c` | 0-9 | Chroma |
| `--{prop}-h` | 0-9 | Hue offset (×40°) |
| `--{prop}-o` | 0-9 | Opacity |
| `--{prop}-delta-l` | -9 to +9 | Luminosity adjustment |
| `--{prop}-delta-c` | -9 to +9 | Chroma adjustment |
| `--{prop}-delta-h` | -9 to +9 | Hue adjustment |
| `--{prop}-delta-o` | -9 to +9 | Opacity adjustment |

Text-specific:

| Variable | Description |
|----------|-------------|
| `--text-l-min` | Minimum luminosity (set by `.bg`) |
| `--text-l-max` | Maximum luminosity (set by `.bg`) |

Global:

| Variable | Default | Description |
|----------|---------|-------------|
| `--color-l-direction` | 1 | 1 (light) or -1 (dark) |
| `--color-saturation` | 0.8 | Global saturation multiplier |
| `--color-temperature` | 0.15 | Warm/cool shift intensity |
| `--color-warm` | 60 | Hue shift toward warm at light extremes |
| `--color-cool` | 100 | Hue shift toward cool at dark extremes |
