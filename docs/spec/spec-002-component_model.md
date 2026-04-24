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

## Token Structure

Control tokens are defined in `src/css/tokens.js` under the `control` key:

```
control:
  transition          shared CSS transition string
  color               default semantic color (neutral)
  disabled:
    opacity            dimmed opacity for disabled state
  focus:
    ring:
      width            outline width
      offset           outline offset
      opacity          outline opacity
  field:
    tx: { blend }
    bg: { blend }
    bd: { blend, opacity, width, radius }
    hover:
      bd: { blend, opacity }
    focus:
      bd: { blend, opacity }
  button:
    bg: { blend }
    bd: { opacity, width, radius }
    hover:
      bg: { blend }
    active:
      bg: { blend }
  outline:
    bd: { opacity }
```

Per-element overrides use `--ctrl-*` variables set inline or via classes:

- `--ctrl-color` — overrides the semantic color
- `--ctrl-bg-blend`, `--ctrl-bd-blend`, etc. — per-element tuning

Individual control types (`input`, `textarea`, `select`, `button`) define
font tokens at `--{type}-font-{family,size,line,weight}`, `--{type}-padding`,
and `--{type}-margin`.

## Color Pipeline

Colors are computed using `color-mix()` expressions built from token variables.
The helper `cmix(base, tint, blend, opacity)` produces:

```css
color-mix(in oklch,
  color-mix(in oklch, <base>, <tint> <blend>),
  transparent calc(100% - <opacity>))
```

Pre-computed expressions used across all controls:

| Expression | Base | Tint | Blend | Opacity |
|-----------|------|------|-------|---------|
| `fieldTx` | ctrl-color | ink | field.tx.blend | — |
| `fieldBg` | ctrl-color | paper | field.bg.blend | field.bg.opacity |
| `fieldBd` | ctrl-color | ink | field.bd.blend | field.bd.opacity |
| `buttonBg` | ctrl-color | paper | button.bg.blend | — |
| `buttonBd` | ctrl-color | ink | 85% | button.bd.opacity |
| `focusRing` | ctrl-color | paper | 75% | focus.ring.opacity |

These expressions use `var()` with `.or()` fallbacks so that per-element
`--ctrl-*` overrides take precedence over the global `--control-*` tokens.

## Control Behavior

### Fields (input, textarea, select)

- Default: paper-tinted background, subtle ink-tinted border
- Hover: border strengthens (blend/opacity shift via `--ctrl-bd-*`)
- Focus: border strengthens further + outline ring appears
- Active: background blend shifts slightly (98%)
- Invalid: border switches to danger color; focus shows danger outline
- Outline variant: transparent background, stronger initial border
- Ghost variant: transparent background, no border; ink wash on hover
- Blank variant: no chrome, inherits text color

### Buttons

- Default: base color fill, contrast text, subtle ink border
- Hover: lighten toward paper (via button.hover.bg.blend)
- Active: darken toward ink (via button.active.bg.blend)
- Focus: outline ring appears
- Outline variant: transparent background, colored text and visible border
- Ghost variant: transparent, subtle ink wash on hover/active
- Blank variant: no chrome

### Toggles (checkbox, radio)

- Unchecked: field-like appearance (paper background, ink border)
- Checked: flips to button-like appearance (base color fill)
- Sub-element indicator (`::after`): color driven by `--ctrl-sub-color`
  - Checkbox: rotated border forming a checkmark; dash for indeterminate
  - Radio: filled circle dot
- Outline variant: transparent background when unchecked; no fill on checked,
  indicator uses ink-tinted base color instead
- Blank variant: no chrome; indicator inherits color on checked

### Selector (container + options)

- Container: transparent background, ink-tinted border, focus-within outline
- Options: transparent background, ink-tinted text
- Selected options: flip to button mode (base color fill, contrast text)
- Hidden native inputs (radio/checkbox) via clip pattern
- Supports `input:checked + label` mirroring for accessibility

### Slider (range)

- Track: field border color, thin bar
- Thumb: button-colored circle with subtle border
- Hover: track strengthens, thumb lightens and scales up
- Active: thumb darkens
- Focus: outline on control + ring on thumb
- Blank variant: minimal track/thumb, no focus ring

### Panel

- Light paper-tinted background with subtle paper-tinted border
- Uses field text color
- Outline variant: transparent background, ink-tinted border
- Blank variant: no chrome

## Relationship With Color Utilities

Generic color utility classes from spec-001 do not redefine the control
color pipeline. Controls compute their own `background`, `color`,
`border-color`, and `outline-color` from `--ctrl-*` / `--control-*` tokens.

Color variant classes (`.primary`, `.danger`, etc.) set `--ctrl-color` to
the corresponding `--color-{name}` semantic variable.
