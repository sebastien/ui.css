# Controls Module (`controls.js`)

## Interactive UI components and form controls

The `controls.js` module provides comprehensive styling for interactive elements like buttons, inputs, toggles, and selectable lists. It handles hover, focus, active, and selected states automatically.

### Main Components:

- `button`, `.button`: Standard button styling with configurable fonts and colors.
- `.selectable`: Base class for interactive items (list items, cards) that share button-like state logic but may have different layouts.
- `input`, `.input`: Standard text input styling.
- `textarea`, `.textarea`: Multi-line text input styling.
- `input[type="checkbox"]`, `.checkbox`: Custom styled checkboxes with `:checked` markers.
- `input[type="radio"]`, `.radio`: Custom styled radio buttons.
- `.toggle`: Switch/toggle control (often used with a hidden checkbox).

### Style Variants:

- `.primary`, `.secondary`, `.success`, `.warning`, `.danger`: Semantic color variants.
- `.outline`: Transparent background with a visible border of the current color.
- `.ghost`: Fully transparent background and border; only shows state on interaction.
- `.blank`: No visual chrome at all (no background, border, outline, or padding).
- `.icon`: 1:1 aspect ratio button with minimal padding.
- `.default`: Emphasized button style with a visible outline.

### Component States:

- `:hover`, `.hover`: Mouse over effect.
- `:active`, `.active`: Click/press effect.
- `:focus`, `:focus-visible`, `.focus`: Keyboard focus ring.
- `.selected`, `:checked`, `.checked`: Persistently selected state.
- `:disabled`, `.disabled`: Visual dimming and `pointer-events: none`.

### Color model

Controls derive all their colors from `color-mix()` expressions over four
channels — `color` (accent), `background` (surface), `border`, `outline` —
each driven by four variables: `base`, `tint`, `blend`, `opacity`.

- `--control-color-*` is the **accent**: the semantic color of the control.
  Variant classes (`.primary`, `.danger`, …) only set `--control-color-base`.
  It is inheritable and safe to set globally (e.g. on `:root` or `body`).
- `--control-background-*` is the **surface**: the background the control sits
  on. It is **element-scoped by design**: controls pin it on themselves, so an
  inherited value from an ancestor can never defeat the accent variants.
  Only set it through selectors that target controls directly
  (e.g. `input, textarea, select { --control-background-base: … }`), never on
  containers — a container-level value would be inherited by every descendant
  control and silently override their variant colors.
- Actions (buttons, checked checkboxes/radios/toggles, selected options) pin
  `--control-background-base: var(--control-color-base)` so their fill tracks
  the accent; fields pin it to `var(--color-page, var(--color-paper))` so they
  follow the page surface in light and dark mode.
- Field variants additionally look up `--color-{semantic}-background`
  (e.g. `--color-primary-background`): an optional, theme-definable "surface
  variant" of each semantic color, falling back to the semantic color itself.

### Difference with utility-only frameworks:

- Components coordinate `--control-{color,background,border,outline}-*`
  variables internally; states (hover/active/checked) only adjust blend and
  opacity, so theming a handful of variables restyles every state.
- States are coordinated across different component types for a consistent feel.
- Automatic contrast calculation for text inside accent-filled controls
  (`contrast-color()` against the control color).

### Using

```html
<!-- Semantic buttons -->
<div class="row g-s">
    <button class="primary">Submit</button>
    <button class="outline danger">Delete</button>
    <button class="ghost">Cancel</button>
</div>

<!-- Form controls -->
<div class="stack g-m">
    <input type="text" placeholder="Username" class="success">
    <textarea placeholder="Bio"></textarea>
    <label class="row g-s items-center pointer">
        <input type="checkbox" class="primary">
        <span>Accept terms</span>
    </label>
</div>
```

### API

`controls.js` composes its output from internal factory functions; there is no
public runtime API. The theming surface is the set of CSS variables consumed
via fallback chains:

- `--control-{color,background,border,outline}-{base,tint,blend,opacity}`:
  per-channel color computation.
- `--control-font-*`, `--control-padding`, `--control-gap`,
  `--control-border-width`, `--control-border-radius`,
  `--control-outline-width`: shared geometry.
- `--field-padding`, `--field-border-radius`, `--action-border-width`,
  `--action-border-radius`, `--action-outline-width`: per-kind geometry
  overrides (fields vs actions).
- `--{checkbox,radio,toggle,range,select,selector}-*`: per-component sizing.

Note: `input[type=submit]`, `input[type=button]` and `input[type=reset]` are
styled as actions, not fields. The `src/css/theme.*.css` files still reference
the retired `--control-{button,field}-*` variable names and are stale.
