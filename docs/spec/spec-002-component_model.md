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
- `.tabs` / `.tab`
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

`--accent-color` is the inheritable semantic identity. Controls retain the
`--control-*` channels as their default and state inputs. The later `bg`, `tx`,
`bd`, and `ol` apply utilities provide explicit final property overrides; their
modifier classes configure the corresponding shared paint recipe.

Pinning rules:

- Actions and selected states derive their fill from the control accent.
- Fields establish a local surface. Default field borders follow
  `--control-border-*` (optional `--field-border-*` override); semantic
  variant classes override the border from the accent. Focus outlines use
  the accent. A local `bg-*`, `bd-*`, or `ol-*` modifier overrides that
  channel.
- Tabs paint through the shared `--background-color-*` channel, so `.bg-*`
  modifiers tweak bar and tab fills (including selected opacity).

## Color Variants

Applied as classes on any control — sets `--accent-color` and the compatible
`--control-color-base` input:

- `neutral` (default)
- `primary`, `secondary`, `tertiary`, `accent`
- `success`, `warning`, `danger`, `info`, `error`

## Style Variants

- `default` — filled background (buttons) or light paper background (fields)
- `outline` — transparent background, visible border
- `onoff` — button-like action with transparent background and no border until `.selected`; selected actions use the semantic fill
- `ghost` — transparent background, no border; subtle ink wash on hover
- `blank` — no visual chrome, inherits text color, no state effects
- `horizontal` / `vertical` — joined selector-item orientation; horizontal is the default
- `toggle` (selectors) — segmented pill presentation; direct buttons select with `[aria-pressed=true]` or `.selected`

Native `<select>` options remain browser-owned UI. Use a `.selector` with radio
or checkbox inputs for selector-style horizontal or vertical choices.

Button-specific:

- `icon` — square aspect ratio, compact padding

Switch-specific:

- `shadow` — adds a shadow to the switch knob; the default knob is flat
- `outline` — transparent track while off; neutral when checked without a semantic color, or semantic-colored when checked with one

Range-specific:

- `tinted` — renders accent progress over a neutral track; applications should expose the current percentage through `--range-progress` for WebKit browsers
