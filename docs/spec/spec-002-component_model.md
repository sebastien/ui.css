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

- `button`, `.button`
- `input`, `.input`, `textarea`, `.textarea`
- `select`, `.select`
- `input[type="checkbox"]`, `.checkbox`
- `input[type="radio"]`, `.radio`
- `input[type="range"]`, `.range`, `.slider`
- `.selector` (container) + `.selector > .option` (items)
- `.panel`

All controls can be sized using the sizing classes (`smaller`, `larger`, etc.)
as they use `em` units.

## States

- `hover`: `:hover` or `.hover`
- `active`: `:active` or `.active`
- `focus`: `:focus-visible` or `.focus`
- `disabled`: `[disabled]` or `.disabled`
- `checked`/`selected`: `:checked` or `.selected` (toggles and options)
- `invalid`: `:invalid` or `.invalid` (field-like only)

## Color Variants

Applied as classes on any control — sets `--ctrl-color`:

- `neutral` (default)
- `primary`, `secondary`, `tertiary`, `accent`
- `success`, `warning`, `danger`, `info`, `error`

## Style Variants

- `default` — filled background (buttons) or light paper background (fields)
- `outline` — transparent background, visible border
- `ghost` — transparent background, no border; subtle ink wash on hover
- `blank` — no visual chrome, inherits text color, no state effects

Button-specific:

- `icon` — square aspect ratio, compact padding

