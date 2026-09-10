# Tokens Module (`tokens.js`)

## Core design variables and CSS custom properties

The `tokens.js` module defines the foundational design system variables, including typography scales, spacing, sizing, and semantic color roles.

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
- `--font-text-family`, `--font-heading-family`, `--font-display-family`, `--font-script-family`, `--font-code-family`: Font family configuration.
- `--font-controls-family`, `--font-controls-size`, `--font-controls-line`, `--font-controls-weight`: Form controls configuration.

#### Colors
- `--color-white`, `--color-black`: Basic color constants.
- `--color-ink`: Primary text color baseline.
- `--color-paper`: Primary background color baseline.
- `--color-neutral`, `--color-primary`, `--color-secondary`, `--color-tertiary`: Semantic color baselines.
- `--color-success`, `--color-info`, `--color-warning`, `--color-danger`, `--color-error`: Status color baselines.
- `--color-page`, `--color-text`: Context-dependent aliases for paper/ink.

#### Property Specific Colors (Base, Tint, Blend, Opacity)
Each of these properties supports `base`, `tint`, `blend`, and `opacity` tokens (e.g., `--background-base`, `--background-blend`).
- `background`: General background color.
- `text`: General text color.
- `border`: Border color and style (`--border-width`, `--border-style`).
- `outline`: Outline color and style (`--outline-width`, `--outline-style`).

#### Spacing & Sizing
- `--pad-0` through `--pad-8`: Padding scale.
- `--margin-0` through `--margin-8`: Margin scale.
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
Controls use shared `--control-*` and per-kind `--field-*`/`--action-*` namespaces, with component-specific namespaces for `checkbox`, `radio`, `toggle`, `range`, `select`, and `selector`:
- `--control-font-*`, `--control-padding`, `--control-gap`,
  `--control-border-radius`.
- `--control-color-*`, `--control-background-*`, `--control-border-*`, `--control-outline-*`: Each color channel supports `base`, `tint`, `blend`, and `opacity`. `--border-color-*` is decorative chrome; `--control-border-*` is interactive. `--field-border-*` is optional and falls back to control.
- `--field-font-size`, `--field-padding`, `--field-border-radius`,
  `--action-font-size`, `--action-border-width`, `--action-border-radius`,
  `--action-outline-width`: Per-kind overrides that fall back to shared control tokens.
- Component namespaces provide sizing and geometry tokens such as `--checkbox-size`, `--radio-dot-size`, and `--range-track-height`.

### Scale indices:

Gap and size use an 11-step scale. Padding and margin use a 9-step scale. For example, `pad`:

- `0`: 0em
- `1` to `8`: Increasingly larger values calculated via `pem()` (Pixel-to-EM) based on the `scaling-pad` and `font-base`.
