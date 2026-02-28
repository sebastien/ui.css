# Controls CSS

We want to implement styling for the following controls:

- Selectable: a generic selectable item (typically used in lists)
- Button
- Input
- Textarea
- Checkbox: supporting both checkbox and radio

Each comes in the following variants:
- State: normal, focus, hover, active, selected, disabled
- Colors: neutral, primary, secondary, tertiary, success/valid, warning/issue, danger/error
- Variants: default, outline, blank, bare (no styling, even on interaction)
- Sizes: smallest, smaller, small, regular, large, larger, largest

All of the controls is parameterized by the follow properties defined in "token.js"
- `--${type}-bg-base-${color}` base background color
- `--${type}-bg-${tint,blend,opacity}` base background color
- `--${type}-tx-base-${color}` base tx color
- `--${type}-tx-${tint,blend,opacity}` blending parameters for text
- `--${type}-bd-${tint,blend,opacity}` blending parameters for border
- `--${type}-ol-${tint,blend,opacity}` blending parameters for outline
- `--${type}-{state}-{bg,tx,bd,ol}-${tint,blend,opacity}` override parameters for state



The base color is then blended according to the colorspec
