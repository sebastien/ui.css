# Component Model

Uses: spec-001

This spec describes the token-driven control architecture implemented in
`src/css/controls.js` and `src/css/tokens.js`.

## Architecture

Controls are split into two visual categories:

- **Field-like**: inputs, textareas, selects, unchecked toggles
- **Button-like**: buttons, checked toggles, selected options

Both categories share a common base (semantic color assignment, transitions,
outline setup) and derive their colors from the same token variables through
`color-mix()` expressions.

## Styled Controls

- `button`, `.button`, `input[type="submit"]`, `input[type="button"]`, `input[type="reset"]`
- `input`, `.input`, `textarea`, `.textarea` (excluding the button types above)
- `select`, `.select` (native listbox for `[multiple]`; pair `.vertical` with `size` for explicit single-select listboxes)
- `input[type="checkbox"]`, `.checkbox`
- `input[type="radio"]`, `.radio`
- `input[type="range"]`, `.range`
- `.selector` (container) with `input + label` items
- `.panel`

All controls can be sized using the sizing classes (`smaller`, `larger`, etc.)
as they use `em` units.

## States

- `hover`: `:hover` or `.hover`
- `active`: `:active` or `.active`
- `focus`: `:focus`, `:focus-within`, or `.focus` (component-specific selectors may vary)
- `disabled`: `[disabled]` or `.disabled`
- `checked`/`selected`: `:checked` or `.selected` (toggles and options)
- `invalid`: `[aria-invalid=true]` and `.error` field markers (native `:invalid` is not globally styled as a state alias)

## Color Variables

Each control computes its colors from four channels, each with
`base`, `tint`, `blend`, `opacity`:

- `--control-color-*` — the **accent** (semantic color), drives text, border,
  outline, and accent-filled backgrounds. Inheritable, themeable globally.
- `--control-background-*` — the **surface**. Element-scoped: every control
  pins `--control-background-base` on itself, so inherited values never
  interfere with variants. Only override it via selectors targeting controls.
- `--control-border-*`, `--control-outline-*` — derived from the accent by
  default (their `base` falls back to `--control-color-base`).

Pinning rules:

- Actions pin `--control-background-base: var(--control-color-base)` (fill
  tracks the accent), including checked states of checkbox/radio/toggle and
  selected options.
- Fields pin `--control-background-base` and `--control-background-tint` to
  `var(--color-page, var(--color-paper))` (follows the page surface in both
  light and dark mode). Field variants use the optional
  `--color-{semantic}-background` theme hook, falling back to the semantic
  color itself.

## Color Variants

Applied as classes on any control — sets `--control-color-base`:

- `neutral` (default)
- `primary`, `secondary`, `tertiary`, `accent`
- `success`, `warning`, `danger`, `info`, `error`

## Style Variants

- `default` — filled background (buttons) or light paper background (fields)
- `outline` — transparent background, visible border
- `ghost` — transparent background, no border; subtle ink wash on hover
- `blank` — no visual chrome, inherits text color, no state effects
- `horizontal` / `vertical` — joined selector-item orientation; horizontal is the default

Native `<select>` options remain browser-owned UI. Use a `.selector` with radio
or checkbox inputs for selector-style horizontal or vertical choices.

Button-specific:

- `icon` — square aspect ratio, compact padding
