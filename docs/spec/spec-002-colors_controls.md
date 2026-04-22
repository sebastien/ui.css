# Controls

Uses: spec-001

This spec describes the controls stylesheet implemented in
`src/css/controls.js`.

## Components

The current implementation exports these control groups:

- `button`
- `selectable`
- `input`
- `textarea`
- `checkbox`
- `radio`

`button` and `selectable` share part of their behavior, but remain distinct
selectors. `radio` is implemented as its own control, not as a checkbox variant.

## Supported Modifiers

The controls implementation currently supports these modifier families.

States:

- `hover`
- `active`
- `focus`
- `selected`
- `disabled`

Color variants:

- `primary`
- `secondary`
- `tertiary`
- `success`
- `warning`
- `danger`

Style variants:

- `default`
- `outline`
- `blank`
- `bare`

Additional style variants currently implemented:

- `ghost`
- `icon`

Named size modifiers are not currently implemented, even though a size list
exists in the source.

## Token Model

Controls are driven by control-specific token trees from `src/css/tokens.js`.

Each control defines:

- `--{control}-color-base`
- `--{control}-color-tint`
- `--{control}-color-blend`
- `--{control}-color-opacity`
- `--{control}-current-color-base`
- `--{control}-current-color-tint`
- `--{control}-current-color-blend`
- `--{control}-current-color-opacity`
- `--{control}-current-color`
- `--{control}-{focus|selected|hover|active}-{tint|blend|opacity}`

Checkbox and radio also define tokenized content values for checked states.

## Relationship With Generic Color Utilities

Generic color utility classes from `spec-001` do not currently redefine the
internal control color pipeline.

Controls compute their own `background`, `color`, `border-color`, and
`outline-color` values from control-specific variables such as
`--button-current-color` and `--input-current-color`.

Control color variants such as `.primary` and `.danger` set control-specific
base variables like `--button-color-base` or `--input-color-base`.

## Base Styling

Buttons and selectable items:

- use control font tokens
- default to a filled background derived from the current control color
- have no visible border by default
- use contrast text on filled button color variants

Inputs and textareas:

- use control font tokens
- default to a paper-tinted background based on the control color
- default to a tinted `1px` border
- use a stronger paper tint on focus

Checkboxes:

- use the same paper-tinted surface model as inputs
- default to a tinted `1px` border
- render a checked mark for `:checked`
- render a partial mark for `:indeterminate`

Radios:

- are separate from checkboxes
- default to a circular paper surface with a tinted `1px` border
- render a checked dot for `:checked`
- apply color variants to the checked indicator

## State Selectors

Where supported, controls use both pseudo-class and explicit class selectors:

- hover: `:hover` and `.hover`
- active: `:active` and `.active`
- focus: `:focus`, `:focus-within`, or `.focus` depending on the control
- disabled: `[disabled]` and `.disabled`

Selected state is class-driven in the current implementation.

## Variant Semantics

- `default` adds a stronger visible border
- `outline` removes the filled background and keeps a visible border
- `blank` reduces emphasis by clearing background and lowering color opacity
- `bare` removes visual styling and interaction chrome
- `ghost` is implemented for buttons, inputs, and textareas
- `icon` is implemented as a compact low-emphasis variant
