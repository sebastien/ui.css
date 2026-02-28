# Controls

We want to implement a controls stylesheet `src/css/control.js` that covers the
following:

- Selectable: a generic selectable item (typically used in lists)
- Button: buttons
- Input: input fields
- Textarea: textarea
- Checkbox: supporting both checkbox and radio

Each comes in the following variants:
- State: normal, focus, hover, active, selected, disabled
- Colors: neutral, primary, secondary, tertiary, success/valid, warning/issue, danger/error
- Variants: default, outline, blank, bare (no styling, even on interaction)
- Sizes: smallest, smaller, small, regular, large, larger, largest

All of these variants are specified with classnames `.${variant}`.

All of the controls are parameterized by the follow properties defined in `token.js`:
- `--${type}-bg-base-${color}` base background color
- `--${type}-bg-${tint,blend,opacity}` base background color
- `--${type}-tx-base-${color}` base tx color
- `--${type}-tx-${tint,blend,opacity}` blending parameters for text
- `--${type}-bd-${tint,blend,opacity}` blending parameters for border
- `--${type}-ol-${tint,blend,opacity}` blending parameters for outline
- `--${type}-{state}-{bg,tx,bd,ol}-${tint,blend,opacity}` override parameters for state

While the base color can be defined through control color classes, it can also be overriden
by explicit colors classes from the color module. `bg-red-4` would then set the base
color to that.

The displayed background/text/outline/border color is blended from the base color variable
and its supporting tint/blend/opacity variables according to `spec-001`

All components should:
- Have pseudo `:hover` and explicit `.hover` selectors for states (when a pseudo exists)
- Sizing should vary  padding and font-size, although both may move at different scales

Buttons:
- Should have their text adapt to the background for good contrast
- Have no border by default

Inputs/Textarea:
- Background defaulting to paper
- Slight tint of base on top of paper (backround) or ink (text) when colored
- Have no border by default

Checkboxes:
- Should have checkbox unselected/partial/checked
- Should have radio variant
- Have no border
- Use the same background and text styling as the inputs


