# Component Model

Uses: spec-001

This spec describes the canonical token structure for every UI component and
control. It applies across buttons, inputs, selectors, panels, and any future
component type.

## Supported Modifiers

Components support these modifier families.

States:

- `hover`
- `active`
- `selected` (defaults to active)
- `focus`
- `focus-visible` (defaults to focus)
- `focus-within` (defaults to focus)
- `disabled`

Color variants:

- `accent`
- `primary`
- `secondary`
- `tertiary`
- `success`
- `warning`
- `danger`

Style variants:

- `default`
- `outline` (no background)
- `bare` (no text, border, color, outline styling or variant styling)

  For button-like:
- `ghost` (no background, not border, no outline except for focus)
- `icon` (for icons, tyipcally square aspect ratio)

All components can be sized using the sizing classes `smaller`, `larger`, etc,
as they use `pem` or `em` units instead of pixels or rems.

## Token Model

Every component should define the following properties in its token tree:

```
--{component}-
  -font-{family,line,weight,size}
  -padding
  -margin
  -{normal,hover,focus,active,disabled}
    -{border,text,background,outline}-{base,tint,blend,opacity}
    -{border,outline}-{width,style}
```

### Token Shape

```js
component: {
  font: {
    family: "…"
    line: …,
    weight: …,
    size: …,
  },
  padding: "…",
  margin: "…",

  // Normal defines the defaults for the component
  normal: {
    color:  …,  // The CSS variable for the base color (neutral by default)
    text: { base, tint, blend, opacity },
    background: { base, tint, blend, opacity },
    border: {
      width: …,
      radius: …,
      style: …,
      opacity: …,
      base: …,
      tint: …,
      blend: …,
    },
    outline: { width, style, base, tint, blend, opacity },
  },

  // State overrides reference normal values by default.
  // If a property is not overridden it resolves to normal.
  hover: {
    border: {
      width: `${vars.component.border.normal.width}`,
      style: `${vars.component.border.normal.style}`,
      opacity: `${vars.component.border.normal.opacity}`,
      …
    },
    …
  },
  focus: { … },
  active: { … },
  disabled: { … },
}
```

### Current Token Structure (controls)

Controls are driven by token trees from `src/css/tokens.js`. Each control
defines:

```
component: {
  font: { family, line, weight, size },
  box: { padding: { x, y }, radius },
  color: { base, tint, blend, opacity, primary, secondary, … },
  focus: { tint, blend, opacity },
  hover: { tint, blend, opacity },
  active: { tint, blend, opacity },
  selected: { tint, blend, opacity },
}
```

Checkbox and radio also define:

- `box.size`, `box.radius`, `box.marker`
- `content.checked` (and `content.partial` for checkbox)

Select also defines:

- `arrow.size`, `arrow.offset`, `arrow.gap`

Range also defines:

- `box.max_width`
- `track.size`, `track.radius`, `track.color`
- `thumb.size`, `thumb.radius`

### Runtime Color Pipeline

At runtime, controls compute a "current color" pipeline via helper functions:

- `--{control}-current-color-base`
- `--{control}-current-color-tint`
- `--{control}-current-color-blend`
- `--{control}-current-color-opacity`
- `--{control}-current-color`

These are set by `colorvars()` and `state()` helpers in `controls.js` and
drive the computed `background`, `color`, `border-color`, and `outline-color`
values.

### Migration Notes

Key differences between the current token shape and the target model:

| Aspect | Current | Target |
|--------|---------|--------|
| Padding | `box.padding.{x,y}` | `padding` (single or shorthand) |
| Margin | not tokenized | `margin` |
| State grouping | flat at component root | nested under `normal` + state overrides |
| Property scoping | `component.hover.tint` | `component.hover.border.tint`, `component.hover.background.tint`, etc. |
| Default resolution | implicit in code | explicit `${vars.component.border.normal.width}` references |

## Relationship With Generic Color Utilities

Generic color utility classes from `spec-001` do not currently redefine the
internal component color pipeline.

Components compute their own `background`, `color`, `border-color`, and
`outline-color` values from component-specific variables such as
`--button-current-color` and `--input-current-color`.

Color variants such as `.primary` and `.danger` set component-specific base
variables like `--button-color-base` or `--input-color-base` via the
`__{component}_color_base` property convention.

## Base Styling

Buttons and selectable items:

- use component font tokens
- default to a filled background derived from the current component color
- have no visible border by default
- use contrast text on filled button color variants

Inputs and textareas:

- use component font tokens
- default to a paper-tinted background based on the component color
- default to a tinted `1px` border
- use a stronger paper tint on focus

Checkboxes:

- use the same paper-tinted surface model as inputs
- default to a tinted `1px` border
- render a check mark for `:checked`
- render a partial mark for `:indeterminate`

Radios:

- are separate from checkboxes
- default to a circular paper surface with a tinted `1px` border
- render a checked dot for `:checked`
- apply color variants to the checked indicator

Selectors:

- wrap checkbox/radio inputs with styled option items
- hide native inputs
- use `aria-pressed` and `aria-checked` for selected state detection

Range:

- transparent background with custom track and thumb
- uses `--range-current-color` for thumb fill
- webkit and moz pseudo-element support

## State Selectors

Where supported, components use both pseudo-class and explicit class selectors:

- hover: `:hover` and `.hover`
- active: `:active` and `.active`
- focus: `:focus`, `:focus-within`, `:focus-visible`, or `.focus` depending on the component
- disabled: `[disabled]`, `:disabled`, `.disabled`, and `[aria-disabled="true"]`

Selected state is class-driven in the current implementation.

## Variant Semantics

- `default` adds a stronger visible border
- `outline` removes the filled background and keeps a visible border
- `blank` reduces emphasis by clearing background and lowering color opacity
- `bare` removes visual styling and interaction chrome
- `ghost` is implemented for buttons, inputs, textareas, and selects
- `icon` is implemented as a compact low-emphasis variant
