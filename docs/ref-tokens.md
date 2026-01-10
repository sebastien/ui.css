# Tokens Module Reference

The `tokens.js` module defines all CSS custom properties (design tokens) that form the foundation of LittleCSS's theming system. These tokens are rendered in the `:root` selector and can be overridden to customize the entire design system.

## Usage

```javascript
import tokens from "littlecss/css/tokens.js";
import { css } from "littlecss/js/littlecss.js";

// Generate CSS
for (const line of css(tokens)) {
    console.log(line);
}
```

## Token Categories

### Font Tokens

Base font stacks:

| Token | Default Value |
|-------|---------------|
| `--font-mono` | `monospace` |
| `--font-sans` | `sans-serif` |
| `--font-serif` | `serif` |
| `--font-cursive` | `cursive` |
| `--font-size` | `1rem` |
| `--font-base` | `14` |
| `--font-line` | `1.25em` |

Typography variants:

| Token Family | Properties |
|--------------|------------|
| `--font-text-*` | family, size, line |
| `--font-heading-*` | family, size, line |
| `--font-display-*` | family, size, line |
| `--font-script-*` | family, size, line |
| `--font-code-*` | family, size, line |
| `--font-controls-*` | family, size, line, weight (500) |

### Semantic Colors

All semantic colors are defined at L=0.5 in OKLCH:

| Token | Value | Description |
|-------|-------|-------------|
| `--color-ink` | `#000000` | Scale position 0 (black) |
| `--color-paper` | `#FFFFFF` | Scale position 9 (white) |
| `--color-neutral` | `oklch(0.5 0.02 250)` | Near-gray, very low chroma |
| `--color-primary` | `oklch(0.5 0.20 250)` | Calm blue |
| `--color-secondary` | `oklch(0.5 0.20 280)` | Violet |
| `--color-tertiary` | `oklch(0.5 0.20 160)` | Teal |
| `--color-success` | `oklch(0.5 0.24 145)` | Green |
| `--color-info` | `oklch(0.5 0.22 220)` | Cyan-blue |
| `--color-warning` | `oklch(0.5 0.24 90)` | Amber |
| `--color-danger` | `oklch(0.5 0.28 25)` | Red |

Mode-dependent colors (swap in dark mode):

| Token | Default | Description |
|-------|---------|-------------|
| `--color-page` | `var(--color-paper)` | Page background |
| `--color-text` | `var(--color-ink)` | Default text |

### Color System Tokens

| Token | Default | Description |
|-------|---------|-------------|
| `--color-l-direction` | `1` | Luminosity direction: 1 (light), -1 (dark) |
| `--color-saturation` | `0.8` | Global saturation multiplier |
| `--color-temperature` | `0.15` | Warm/cool shift intensity |
| `--color-warm` | `60` | Hue degrees toward warm at light extremes |
| `--color-cool` | `100` | Hue degrees toward cool at dark extremes |
| `--color-blend` | `oklch` | Color blending space |

### Color Property Tokens

Each color property (background, text, border, outline) has these tokens:

#### Background

| Token | Default | Description |
|-------|---------|-------------|
| `--background-base` | `var(--color-neutral)` | Semantic base color |
| `--background-l` | `7` | Luminosity (0-9) |
| `--background-c` | `7` | Chroma (0-9) |
| `--background-h` | `0` | Hue offset |
| `--background-o` | `9` | Opacity (0-9) |
| `--background-delta-l` | `0` | Luminosity adjustment |
| `--background-delta-c` | `0` | Chroma adjustment |
| `--background-delta-h` | `0` | Hue adjustment |
| `--background-delta-o` | `0` | Opacity adjustment |

#### Text

| Token | Default | Description |
|-------|---------|-------------|
| `--text-base` | `var(--color-text)` | Semantic base color |
| `--text-l` | `1` | Luminosity (dark by default) |
| `--text-c` | `0` | Chroma (neutral) |
| `--text-h` | `0` | Hue offset |
| `--text-o` | `9` | Opacity |
| `--text-delta-*` | `0` | Delta adjustments |
| `--text-l-min` | `0` | Contrast constraint min |
| `--text-l-max` | `9` | Contrast constraint max |

#### Border

| Token | Default | Description |
|-------|---------|-------------|
| `--border-base` | `var(--color-neutral)` | Semantic base color |
| `--border-l` | `6` | Luminosity |
| `--border-c` | `2` | Chroma (low) |
| `--border-h` | `0` | Hue offset |
| `--border-o` | `9` | Opacity |
| `--border-delta-*` | `0` | Delta adjustments |
| `--border-width` | `1px` | Default width |
| `--border-style` | `solid` | Default style |

#### Outline

| Token | Default | Description |
|-------|---------|-------------|
| `--outline-base` | `var(--color-neutral)` | Semantic base color |
| `--outline-l` | `5` | Luminosity |
| `--outline-c` | `2` | Chroma |
| `--outline-h` | `0` | Hue offset |
| `--outline-o` | `9` | Opacity |
| `--outline-delta-*` | `0` | Delta adjustments |
| `--outline-width` | `2px` | Default width |

### Border Tokens

| Token | Default | Description |
|-------|---------|-------------|
| `--border-width` | `1px` | Default border width |
| `--border-style` | `solid` | Default border style |
| `--border-sizes-{0-n}` | `{n}px` | Border width scale |
| `--border-radius-0` | `1px` | xxs |
| `--border-radius-1` | `2px` | xs |
| `--border-radius-2` | `4px` | s |
| `--border-radius-3` | `6px` | m |
| `--border-radius-4` | `8px` | l |
| `--border-radius-5` | `12px` | xl |
| `--border-radius-6` | `16px` | xxl |

### Spacing Tokens

**Sizes:**

| Token | Value |
|-------|-------|
| `--size-0` | `5px` (xxs) |
| `--size-1` | `10px` (xs) |
| `--size-2` | `15px` (s) |
| `--size-3` | `30px` (m) |
| `--size-4` | `40px` (l) |
| `--size-5` | `50px` (xl) |
| `--size-6` | `60px` (xxl) |

**Margins:** Same scale as sizes (`--margin-0` through `--margin-6`)

**Padding:**

| Token | Value |
|-------|-------|
| `--pad-0` | `2px` (xxs) |
| `--pad-1` | `4px` (xs) |
| `--pad-2` | `6px` (s) |
| `--pad-3` | `8px` (m) |
| `--pad-4` | `12px` (l) |
| `--pad-5` | `16px` (xl) |
| `--pad-6` | `24px` (xxl) |
| `--pad-7` | `32px` (xxxl) |
| `--pad-8` | `48px` (xxxxl) |
| `--pad-9` | `64px` (xxxxxl) |

**Gaps:**

| Token | Value |
|-------|-------|
| `--gap-0` | `2px` (xxs) |
| `--gap-1` | `4px` (xs) |
| `--gap-2` | `6px` (s) |
| `--gap-3` | `8px` (m) |
| `--gap-4` | `12px` (l) |
| `--gap-5` | `16px` (xl) |
| `--gap-6` | `24px` (xxl) |
| `--gap-7` | `32px` (xxxl) |
| `--gap-8` | `64px` (xxxxl) |
| `--gap-9` | `96px` (xxxxxl) |

### Typography Scale

**Text sizes:** Calculated from `--textsize-min` (9) and `--textsize-max` (22)

| Token | Calculation |
|-------|-------------|
| `--textsize-size-0` | xxs (base) |
| `--textsize-size-1` | xs |
| `--textsize-size-2` | s |
| `--textsize-size-3` | m |
| `--textsize-size-4` | l |
| `--textsize-size-5` | xl |
| `--textsize-size-6` | xxl (max) |

**Heading sizes:** Calculated from `--heading-min` (page-base) and `--heading-max` (42)

| Token | Calculation |
|-------|-------------|
| `--heading-size-0` | xxs (12px equivalent) |
| `--heading-size-1` | xs (14px) |
| `--heading-size-2` | s (18px) |
| `--heading-size-3` | m (24px) |
| `--heading-size-4` | l (32px) |
| `--heading-size-5` | xl (36px) |
| `--heading-size-6` | xxl (48px) |

### Page Tokens

| Token | Default | Description |
|-------|---------|-------------|
| `--page-base` | `16` | Base value for 1rem |
| `--page-unit` | `calc((1rem/16) * var(--page-base) / 16)` | 1px equivalent in rems |

### Controls Tokens

**Padding scales:**

| Token | Value |
|-------|-------|
| `--controls-padding-largest` | `1em 1.25em` |
| `--controls-padding-larger` | `0.85em 1.15em` |
| `--controls-padding-large` | `0.75em 1em` |
| `--controls-padding-regular` | `0.5em 0.75em` |
| `--controls-padding-small` | `0.25em 0.5em` |
| `--controls-padding-smaller` | `0.15em 0.35em` |
| `--controls-padding-smallest` | `0.15em 0.15em` |

**Size scales:** Maps to textsize scale

| Token | Maps to |
|-------|---------|
| `--controls-size-smallest` | `--textsize-size-0` |
| `--controls-size-smaller` | `--textsize-size-1` |
| `--controls-size-small` | `--textsize-size-2` |
| `--controls-size-regular` | `--textsize-size-3` |
| `--controls-size-large` | `--textsize-size-4` |
| `--controls-size-larger` | `--textsize-size-5` |
| `--controls-size-largest` | `--textsize-size-6` |

### Other Tokens

**Opacity:**

| Token | Value |
|-------|-------|
| `--opacity-dim` | `0.65` |
| `--opacity-dimmer` | `0.45` |
| `--opacity-dimmest` | `0.25` |

**Shadow:**

| Token | Default |
|-------|---------|
| `--shadow-x` | `2px` |
| `--shadow-y` | `2px` |
| `--shadow-spread` | `1px` |
| `--shadow-color` | `oklch(0 0 0 / 0.05)` |

**Width limits:**

| Token | Default | Description |
|-------|---------|-------------|
| `--limit-text` | `80ch` | Maximum text width |
| `--limit-block-0` | `360px` | Small block |
| `--limit-block-1` | `720px` | Medium block |
| `--limit-block-2` | `960px` | Large block |
| `--limit-content` | `960px` | Maximum content width |
| `--limit-page` | `960px` | Maximum page width |

**Block sizing:**

| Token | Default |
|-------|---------|
| `--block-width` | `140px` |

## Customization

Override tokens to customize your theme:

```css
:root {
    /* Custom brand colors */
    --color-primary: oklch(0.5 0.25 200);
    --color-secondary: oklch(0.5 0.20 300);
    
    /* Custom fonts */
    --font-sans: "Inter", system-ui, sans-serif;
    --font-mono: "JetBrains Mono", monospace;
    
    /* Adjust saturation globally */
    --color-saturation: 1.0;
    
    /* Warmer color temperature */
    --color-temperature: 0.25;
    
    /* Custom spacing */
    --pad-3: 10px;
    --gap-3: 10px;
}
```

### Dark Mode

The system automatically handles dark mode via `--color-l-direction`:

```css
/* Light mode (default) */
.light, :root {
    --color-page: var(--color-paper);
    --color-text: var(--color-ink);
    --color-l-direction: 1;
}

/* Dark mode */
.dark {
    --color-page: var(--color-ink);
    --color-text: var(--color-paper);
    --color-l-direction: -1;
}
```
