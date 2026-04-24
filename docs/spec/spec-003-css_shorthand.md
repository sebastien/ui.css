# CSS Shorthand

Uses: spec-001, spec-002

This spec defines the shorthand notation and variable-mapping rules used by
visual control specs.

## Shorthand Notation

### Color Shorthand

A color is expressed as `base/tint blend/opacity`:

- `neutral/paper 90%/0.75` - base `neutral`, tint `paper`, blend `90%`, opacity `75%`
- `./paper` - inherit current base, tint to `paper`
- `.` - inherit the current value (no change)
- `0` - shorthand for opacity `0` (transparent)

The `.` token always means "inherit/keep current". Omitted trailing fields
inherit from the parent scope.

### Edge Shorthand

Border and outline dimensions: `width radius` (two separate tokens):

- `1px 4px` - width `1px`, radius `4px`
- `. .` - inherit both from parent

### Combined Property Shorthand

A full property line combines edge and color:

- `tx: base/tint blend/opacity`
- `bg: base/tint blend/opacity`
- `bd: width radius base/tint blend/opacity`
- `ol: width radius base/tint blend/opacity`

### Sub-element Blocks

Controls with decorative sub-elements (checkbox marker, radio dot, slider
track/thumb, select arrow) use nested blocks within a state. A sub-element
block introduces a named scope that uses the same `tx/bg/bd/ol` properties:

```
checkbox:
  default:
    !default:
      bd: 1px 0.2em ./ink 85%/0.25
      marker:                                   # Sub-element block
        bg: 0                                   # Hidden when unchecked
    !checked:
      marker:
        bg: ./ink 75%/1.0                       # Visible when checked
```

Sub-elements map to CSS variables with the sub-element name inserted:

```
--checkbox-default-checked-marker-background-tint: var(--color-ink);
--checkbox-default-checked-marker-background-blend: 0.75;
--checkbox-default-checked-marker-background-opacity: 1.0;
```

Sub-elements inherit color from their parent control scope (the control's
base color flows into the sub-element). A sub-element's `.` token inherits
from the parent control's corresponding property at the same state level.

### Sizing Shorthand

Some sub-elements have dimensional properties beyond border/outline. These
use a `size:` property within the sub-element block:

```
slider:
  default:
    !default:
      track:
        size: . 0.28em                          # width: auto, height: 0.28em
      thumb:
        size: 0.95em 0.95em                     # width, height
```

## Cascade

The shorthand forms a tree of `control > variant > state`. Each level inherits
from its parent. A `.` at any position means "use the inherited value". The
`control` level inherits from an abstract `control` default, allowing shared
defaults across all controls.

## Tree Notation

```
control:                                        # Abstract control defaults
  default:
    !default:
      tx: ./ink 75%/1.0
      bg: ./paper 100%/1.0
      bd: 1px 4px ./paper 80%/0.75
      ol: 2px 4px ./paper 80%/0.0
    !hover: .                                   # No default hover
    !focus:
      ol: . . ./. ./0.5                         # Outline becomes visible
    !active: .
    !disabled:
      tx: . . ./0.5                             # Reduced text opacity
      bg: . . ./0.5                             # Reduced bg opacity
```

## CSS Variable Mapping

The tree maps to CSS custom properties:

```
--button-default-default-text-base: var(--button-color);
--button-default-default-text-tint: var(--color-ink);
--button-default-default-text-blend: 0.75;
--button-default-default-text-opacity: 1.0;
...
--button-default-focus-outline-opacity: 0.5;
...
--button-outline-default-background-opacity: 0.0;
--button-outline-default-border-tint: var(--color-ink);
--button-outline-default-border-blend: 0.8;
--button-outline-default-border-opacity: 0.5;
```

Sub-element properties insert the sub-element name after the state:

```
--checkbox-default-checked-marker-background-tint: contrast;
--checkbox-default-checked-marker-background-opacity: 1.0;
...
--slider-default-default-track-background-blend: 0.90;
--slider-default-default-track-background-opacity: 0.15;
--slider-default-default-thumb-background-blend: 0.0;
--slider-default-default-thumb-size: 0.95em;
...
--selector-option-default-selected-background-blend: 0.0;
--selector-option-default-selected-background-opacity: 1.0;
```

Each component's CSS rule binds these to `--{control}-current-{property}`
variables based on the active variant and state:

```css
button, .button {
  padding: var(--button-padding);
  margin: var(--button-margin);
  font-family: var(--button-font-family);
  font-weight: var(--button-font-weight);
  font-size: var(--button-font-size);
  line-height: var(--button-font-height);

  /* Default variant, default state */
  --button-current-text-base: var(--button-default-default-text-base, var(--control-default-default-text-base));
  /* ... other current bindings ... */
}
```

Variables cascade through fallbacks:

1. `--button-{variant}-{state}-{prop}` (component + variant + state specific)
2. `--button-{variant}-default-{prop}` (variant default)
3. `--control-{variant}-{state}-{prop}` (abstract control fallback)
4. `--control-default-default-{prop}` (global default)
