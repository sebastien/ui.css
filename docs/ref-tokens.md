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
| `--font-mono` | System monospace stack |
| `--font-sans` | System sans-serif stack |
| `--font-serif` | System serif stack |
| `--font-size` | `1rem` |
| `--font-line` | `1.25em` |

Typography variants:

| Token Family | Properties |
|--------------|------------|
| `--font-text-*` | family, size, line |
| `--font-heading-*` | family, size, line |
| `--font-display-*` | family, size, line |
| `--font-script-*` | family, size, line |
| `--font-code-*` | family, size, line |
| `--font-controls-*` | family, size, line |

### Border Tokens

| Token | Default | Description |
|-------|---------|-------------|
| `--border-width` | `1px` | Default border width |
| `--border-style` | `solid` | Default border style |
| `--border-color` | `var(--theme-neutral)` | Default border color |
| `--border-radius` | `var(--border-radius-3)` | Default border radius |
| `--border-radius-0` | `1px` | Smallest radius |
| `--border-radius-1` | `2px` | |
| `--border-radius-2` | `3px` | |
| `--border-radius-3` | `4px` | |
| `--border-radius-4` | `6px` | |
| `--border-radius-5` | `8px` | |
| `--border-radius-6` | `16px` | Largest radius |

### Color Palette

The palette includes all Tailwind CSS v4 colors. Each color has 11 shades (0-10):

**Gray scales:** gray, slate, zinc, neutral, stone

**Warm colors:** red, orange, amber, yellow

**Green shades:** lime, green, emerald, teal

**Blue shades:** cyan, sky, blue, indigo

**Purple shades:** violet, purple, fuchsia

**Pink shades:** pink, rose

Usage: `--palette-{color}-{0-10}`

```css
.example {
    background: var(--palette-blue-5);
    color: var(--palette-slate-9);
}
```

### Semantic Colors

| Token | Purpose |
|-------|---------|
| `--color-white` | Pure white |
| `--color-black` | Pure black |
| `--color-neutral` | Neutral UI color |
| `--color-primary` | Primary brand color |
| `--color-secondary` | Secondary brand color |
| `--color-tertiary` | Tertiary brand color |
| `--color-success` | Success/positive state |
| `--color-info` | Informational state |
| `--color-warning` | Warning state |
| `--color-danger` | Danger/error state |
| `--color-error` | Error state |
| `--color-background` | Page background |
| `--color-foreground` | Default text color |
| `--color-page` | Page color |
| `--color-high` | High contrast |
| `--color-low` | Low contrast |
| `--color-bg` | Element background |
| `--color-bd` | Element border |
| `--color-fg` | Element foreground |

### Spacing Tokens

**Sizes:**

| Token | Value |
|-------|-------|
| `--size-0` | `5px` |
| `--size-1` | `10px` |
| `--size-2` | `15px` |
| `--size-3` | `20px` |
| `--size-4` | `30px` |
| `--size-5` | `45px` |
| `--size-6` | `60px` |

**Margins:** `--margin-0` through `--margin-6` (same values as sizes)

**Padding:**

| Token | Value |
|-------|-------|
| `--pad-0` | `2px` |
| `--pad-1` | `4px` |
| `--pad-2` | `6px` |
| `--pad-3` | `8px` |
| `--pad-4` | `12px` |
| `--pad-5` | `16px` |
| `--pad-6` | `24px` |
| `--pad-7` | `32px` |
| `--pad-8` | `48px` |
| `--pad-9` | `64px` |

**Gaps:**

| Token | Value |
|-------|-------|
| `--gap-0` | `2px` |
| `--gap-1` | `4px` |
| `--gap-2` | `6px` |
| `--gap-3` | `8px` |
| `--gap-4` | `12px` |
| `--gap-5` | `16px` |
| `--gap-6` | `24px` |
| `--gap-7` | `32px` |
| `--gap-8` | `48px` |
| `--gap-9` | `96px` |

### Typography Scale

**Text sizes:** `--text-size-0` through `--text-size-6` (calculated from `--text-min` and `--text-max`)

**Heading sizes:** `--heading-size-0` through `--heading-size-6` (calculated from `--heading-min` and `--heading-max`)

### Controls Tokens

Padding scales for form controls:

| Token | Usage |
|-------|-------|
| `--controls-padding-largest` | Extra large controls |
| `--controls-padding-larger` | Larger controls |
| `--controls-padding-large` | Large controls |
| `--controls-padding-regular` | Default size |
| `--controls-padding-small` | Small controls |
| `--controls-padding-smaller` | Smaller controls |
| `--controls-padding-smallest` | Compact controls |

### Other Tokens

**Opacity:**
- `--opacity-dim`
- `--opacity-dimmer`
- `--opacity-dimmest`

**Shadow:**
- `--shadow-color`
- `--shadow-offset`
- `--shadow-blur`
- `--shadow-spread`

**Width limits:**
- `--limit-text` - Maximum text width
- `--limit-content` - Maximum content width
- `--limit-page` - Maximum page width

**Block sizing:**
- `--block-width` - Base block width (`140px`)

## Customization

Override tokens to customize your theme:

```css
:root {
    --color-primary: oklch(60% 0.15 250);
    --font-sans: "Inter", system-ui, sans-serif;
    --border-radius: 8px;
}
```
