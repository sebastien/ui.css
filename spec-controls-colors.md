# Control colors

## All

Requirements:
- Outline width, color, and opacity when focus/active should be consistent across all components
- Overrides through `{bg,ot,bd,tx}-*` should be taken into account

Colors:
- Accent color is sourced from the semantic classes (`neutral primary secondary danger...`)
- Accent color may be applied to background (eg. buttons), border (eg. outline button) and/or text (eg. icon button) depending on control and variants

Behaviour:
- Focus should display an outline, 2px width, 0.15 opacity
- Hover should increase luminosity of accent color by 0.05
- Active should decrease luminosity of accent color by 0.05
- Text color should be based on accent color (unless `tx-{color} is used) and its luminosity should be adjusted (0.05 when bg l >= 0.6 otherwise 0.95)

Implementation:
- Use variables like `{selectable,button,input}-accent` to set the accent color
- Derive variants with corrected luminosity/opacity

## Selectable

- Accent: neutral by default, applied to background and border if `bd`
- Accent shade: is the current background color, darkened when light mode, lightened when dark mode, at opacity 0
- Border, outline, background: use accent by default, set to opacity 0 by default overrides apply
- Focus: outline appears
- Hover: background opacity set to 0.15
- Selected: background opacity set to 0.2, border opacity override unset if `bd`
- Active: background opacity set to 0.25

## Pills & Buttons

Normal mode:
- Accent is mapped to background

Outline mode:
- Accent is mapped to text and border

Icon/label mode:
- Accent is mapped to text
- Background works identical to selectable

## Inputs

- Background is paper by default, at 0.9 opacity, unless semantic class which then applies a tint to paper, bg overrides this
- Text follows the same luminosity rules against background, and is based on accent


