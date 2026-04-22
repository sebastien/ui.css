# Tokens Module (`tokens.js`)

## Core design variables and CSS custom properties

The `tokens.js` module defines the foundational design system variables, including typography scales, spacing, sizing, and the luminosity scale for the OKLCH color system.

### Variables:

- `vars.font`: Typography configuration.
  - `vars.font.text`: Body text (`family`, `size`, `line`).
  - `vars.font.heading`: Heading text (`family`, `line`).
  - `vars.font.controls`: Form controls (`family`, `size`, `line`).
  - `vars.font.code`: Monospace code (`family`).
- `vars.pad`: Padding scale (0-10 indices).
- `vars.margin`: Margin scale (0-10 indices).
- `vars.gap`: Gap scale (0-10 indices).
- `vars.size`: Dimensional sizing scale (0-10 indices).
- `vars.radius`: Border radius defaults.
- `vars.border`: Border width and style defaults.
- `vars.shadow`: Shadow displacement and spread defaults.

### CSS Custom Properties (Output):

- `--font-text-family`, `--font-text-size`, `--font-text-line`
- `--font-heading-family`, `--font-heading-line`
- `--font-controls-family`, `--font-controls-size`, `--font-controls-line`
- `--font-code-family`
- `--pad-0` through `--pad-10`
- `--margin-0` through `--margin-10`
- `--gap-0` through `--gap-10`
- `--size-0` through `--size-10`
- `--border-radius`, `--border-width`, `--border-style`
- `--shadow-x`, `--shadow-y`, `--shadow-spread`, `--shadow-color`

### Scale indices (0-10):

Most scales (padding, margin, gap, size) use an 11-step exponential scale:

- `0`: 0px
- `1`: 0.125rem (2px)
- `2`: 0.25rem (4px)
- `3`: 0.5rem (8px)
- `4`: 0.75rem (12px)
- `5`: 1rem (16px)
- `6`: 1.5rem (24px)
- `7`: 2rem (32px)
- `8`: 3rem (48px)
- `9`: 4rem (64px)
- `10`: 8rem (128px)

### Using

```javascript
import tokens from "ui.css/css/tokens.js";
import { css } from "ui.css/js/uicss.js";

// Generate the :root variable declarations
for (const line of css(tokens)) {
    console.log(line);
}
```

### API

### The `tokens` module:

- `tokens(config?)`: Generates the global CSS variables. Can be customized by passing a configuration object to override defaults.
- `vars`: The internal object containing the numeric values and variable mappings used by other modules (layout, colors, etc.).
