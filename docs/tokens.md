# Tokens Module (`tokens.js`)

## Core design variables and CSS custom properties

The `tokens.js` module defines the foundational design system variables, including typography scales, spacing, sizing, and the luminosity scale for the OKLCH color system.

### CSS Custom Properties (Configuration Tokens):

These properties can be overridden to theme the application.

#### Typography
- `--font-mono`: Monospace font family.
- `--font-sans`: Sans-serif font family.
- `--font-serif`: Serif font family.
- `--font-cursive`: Cursive font family.
- `--font-base`: Base font size in pixels (default: 14).
- `--font-size`: Calculated base font size.
- `--font-line`: Base line height.
- `--font-text-family`, `--font-text-size`, `--font-text-line`: Body text configuration.
- `--font-heading-family`, `--font-heading-size`, `--font-heading-line`: Heading text configuration.
- `--font-display-family`, `--font-display-size`, `--font-display-line`: Display text configuration.
- `--font-script-family`, `--font-script-size`, `--font-script-line`: Script text configuration.
- `--font-code-family`, `--font-code-size`, `--font-code-line`: Monospace code configuration.
- `--font-controls-family`, `--font-controls-size`, `--font-controls-line`, `--font-controls-weight`: Form controls configuration.

#### Colors
- `--color-white`, `--color-black`: Basic color constants.
- `--color-ink`: Primary text color baseline.
- `--color-paper`: Primary background color baseline.
- `--color-action`: Default action color.
- `--color-border`: Default border color.
- `--color-l-direction`: Luminosity direction (1 for light mode, -1 for dark mode).
- `--color-neutral`, `--color-primary`, `--color-secondary`, `--color-tertiary`: Semantic color baselines.
- `--color-success`, `--color-valid`, `--color-info`, `--color-warning`, `--color-issue`, `--color-danger`, `--color-error`: Status color baselines.
- `--color-page`, `--color-text`: Context-dependent aliases for paper/ink.

#### Property Specific Colors (Base, Tint, Blend, Opacity)
Each of these properties supports `base`, `tint`, `blend`, and `opacity` tokens (e.g., `--background-base`, `--background-blend`).
- `background`: General background color.
- `text`: General text color.
- `border`: Border color and style (`--border-width`, `--border-style`).
- `outline`: Outline color and style (`--outline-width`, `--outline-style`).

#### Spacing & Sizing
- `--pad-0` through `--pad-10`: Padding scale.
- `--margin-0` through `--margin-10`: Margin scale.
- `--gap-0` through `--gap-10`: Gap scale.
- `--size-0` through `--size-10`: Dimensional sizing scale.
- `--scaling-pad`: Scaling factor for padding.
- `--block-width`: Default block element width.

#### Radius & Elevation
- `--border-radius-0` through `--border-radius-6`: Border radius scale.
- `--shadow-x`, `--shadow-y`, `--shadow-spread`, `--shadow-base`, `--shadow-opacity`, `--shadow-color`: Box shadow configuration.

#### Layout & Limits
- `--limit-text`: Maximum width for text blocks (default: 80ch).
- `--limit-content`, `--limit-page`: Maximum width for content containers.
- `--limit-block-0` through `--limit-block-2`: Responsive block width limits.

#### Page & Headings
- `--page-base`: Base page font size for rem calculations.
- `--page-unit`: Calculated unit equivalent to 1px in rems.
- `--heading-min`, `--heading-max`: Font size bounds for responsive headings.
- `--heading-size-0` through `--heading-size-6`: Heading size scale (percentage-based).

#### Component Specific (Button, Input, etc.)
Components like `button`, `selectable`, `input`, `textarea`, `checkbox`, and `radio` have their own token namespaces for:
- `font`: `family`, `line`, `weight`, `size`.
- `color`: `base`, `primary`, `secondary`, etc., plus `tint`, `blend`, `opacity`.
- States: `focus`, `selected`, `hover`, `active` (supporting `tint`, `blend`, `opacity`).
- `checkbox` & `radio`: `content-checked`, `content-partial`.

### Scale indices (0-10):

Most scales (padding, margin, gap, size) use an 11-step scale. For example, `pad`:

- `0`: 0em
- `1` to `10`: Increasingly larger values calculated via `pem()` (Pixel-to-EM) based on the `scaling-pad` and `font-base`.
