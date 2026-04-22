# Reset Module (`reset.js`)

## Baseline browser normalization and consistent defaults

The `reset.js` module establishes a consistent cross-browser baseline. It removes aggressive browser defaults and applies the project's design tokens (fonts, sizes, colors) to standard HTML elements.

### Universal Reset (`*`):

- Sets `box-sizing: border-box`.
- Removes all default `margin` and `padding`.
- Resets `border` and `outline` to `0px solid transparent`.
- Unsets `font-style` and `font-weight`.
- Applies the baseline text font family and line height.
- Removes default `list-style-type`.
- Sets `background-color: transparent`.
- Optimizes text rendering (`optimizeLegibility`).

### Element-Specific Resets:

- `html`, `body`: Applied baseline typography and scroll behavior.
- `h1-h7`: Unsets font sizes and margins; applies the heading font family.
- `input`, `select`, `textarea`, `button`: Normalizes appearance (`appearance: none`), display mode (`inline-flex`), and typography using control-specific tokens.
- `a`: Inherits color and removes text decoration.
- `summary`: Hides the default disclosure marker.

### Differences with standard CSS resets:

- **Token-Integrated**: Instead of just clearing styles, it immediately applies the `ui.css` design system variables.
- **Aggressive but Safe**: Resets almost everything to `unset` or `0`, forcing the developer to use utility classes or components for intentional styling.
- **Logic-Aware**: Can be wrapped in a `@layer` or a specific selector (like `.reset`) to isolate the effect.

### API

### The `reset` module:

- `reset()`: Generates the baseline normalization rules.
- `vars.font.text`, `vars.font.heading`, `vars.font.controls`: Variables used to set the normalized typography.
