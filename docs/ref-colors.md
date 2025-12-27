# Colors Module Reference

The `colors.js` module provides utility classes for applying colors to backgrounds, text, borders, and outlines.

## Usage

```javascript
import colors from "littlecss/css/colors.js";
import { css } from "littlecss/js/littlecss.js";

for (const line of css(colors)) {
    console.log(line);
}
```

## Basic Color Classes

Apply colors from CSS variables:

| Class | Property | Source Variable |
|-------|----------|-----------------|
| `.bg` | `background-color` | `--background-color` |
| `.fg` | `color` | `--text-color` |
| `.bd` | `border-color` | `--border-color` |
| `.ot` | `outline-color` | `--outline-color` |

## Semantic Colors

Available color names: `white`, `black`, `neutral`, `primary`, `secondary`, `tertiary`, `success`, `info`, `warning`, `danger`, `error`

### Background Colors

```html
<div class="bg-primary">Primary background</div>
<div class="bg-success">Success background</div>
<div class="bg-danger">Danger background</div>
<div class="bg-warning">Warning background</div>
<div class="bg-info">Info background</div>
<div class="bg-neutral">Neutral background</div>
```

### Text Colors

```html
<span class="fg-primary">Primary text</span>
<span class="fg-danger">Danger text</span>
<span class="fg-success">Success text</span>
```

### Border Colors

```html
<div class="bd-primary">Primary border</div>
<div class="bd-danger">Danger border</div>
```

### Outline Colors

```html
<button class="ot-primary">Primary outline on focus</button>
```

## Transparency

Apply transparent colors with percentage opacity:

Available percentages: 5, 10, 15, 20, 25, 50, 75, 90

### Transparent Backgrounds

```html
<div class="bg-5p">5% opacity background</div>
<div class="bg-25p">25% opacity background</div>
<div class="bg-50p">50% opacity background</div>
<div class="bg-75p">75% opacity background</div>
```

### Transparent Text, Borders, Outlines

```html
<span class="fg-50p">50% opacity text</span>
<div class="bd-25p">25% opacity border</div>
<div class="ot-50p">50% opacity outline</div>
```

## Reset/Remove Colors

### Using Variables

Sets the color variable to transparent:

| Class | Description |
|-------|-------------|
| `.bg-no` | No background |
| `.fg-no` | No text color |
| `.bd-no` | No border color |
| `.ot-no` | No outline color |

### Direct Transparent

Sets the property directly to transparent:

| Class | Description |
|-------|-------------|
| `.nobg` | `background-color: transparent` |
| `.nobd` | `border-color: transparent` |
| `.nofg` | `color: transparent` |
| `.noot` | `outline-color: transparent` |

## Lightness Modifiers

Adjust the lightness of backgrounds and borders:

### Background Lightness

| Class | Lightness |
|-------|-----------|
| `.bg-darkest` | 91% |
| `.bg-darker` | 94% |
| `.bg-dark` | 97% |
| `.bg-light` | 103% |
| `.bg-lighter` | 106% |
| `.bg-lightest` | 109% |

### Border Lightness

| Class | Lightness |
|-------|-----------|
| `.bd-darkest` | 91% |
| `.bd-darker` | 94% |
| `.bd-dark` | 97% |
| `.bd-light` | 103% |
| `.bd-lighter` | 106% |
| `.bd-lightest` | 109% |

```html
<div class="bg-primary bg-lighter">Lighter primary</div>
<div class="bg-primary bg-darker">Darker primary</div>
```

## Palette Colors

Access the full color palette directly. Available palettes: gray, slate, zinc, neutral, stone, red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose

Shade indices: 0-10 (mapping to 50-950 in standard color scales)

### Background from Palette

```html
<div class="bg-blue-5">Blue 500</div>
<div class="bg-red-3">Red 300</div>
<div class="bg-green-7">Green 700</div>
<div class="bg-slate-1">Slate 100</div>
```

### Border from Palette

```html
<div class="bd-blue-5">Blue 500 border</div>
<div class="bd-gray-3">Gray 300 border</div>
```

### Foreground from Palette

```html
<span class="fd-blue-5">Blue 500 text</span>
<span class="fd-red-6">Red 600 text</span>
```

### Outline from Palette

```html
<button class="ot-blue-5">Blue 500 outline</button>
```

## Usage Examples

### Status Badges

```html
<span class="bg-success fg-white p-xs">Success</span>
<span class="bg-warning fg-black p-xs">Warning</span>
<span class="bg-danger fg-white p-xs">Error</span>
<span class="bg-info fg-white p-xs">Info</span>
```

### Card with Subtle Background

```html
<div class="bg-neutral bg-lighter p-m bd bd-light">
    <h3>Card Title</h3>
    <p class="fg-neutral">Card content with muted text</p>
</div>
```

### Gradient-like Sections

```html
<div class="bg-blue-1 p-l">Light blue section</div>
<div class="bg-blue-3 p-l">Medium blue section</div>
<div class="bg-blue-5 p-l fg-white">Dark blue section</div>
```

### Transparent Overlays

```html
<div class="rel">
    <img src="photo.jpg" alt="Background">
    <div class="cover bg-black bg-50p fg-white centered">
        Overlay text
    </div>
</div>
```

### Form Validation States

```html
<input class="bd-success" placeholder="Valid input">
<input class="bd-danger" placeholder="Invalid input">
<input class="bd-warning" placeholder="Warning state">
```

### Button Variants

```html
<button class="bg-primary fg-white">Primary</button>
<button class="bg-secondary fg-white">Secondary</button>
<button class="nobg bd-primary fg-primary">Outline</button>
```
