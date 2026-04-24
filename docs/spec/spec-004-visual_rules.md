# Visual Rules

Uses: spec-001, spec-002

This spec documents the intended visual behavior for each control type. The
shorthand notation below is a compact way to express color/border rules:

- `tx: base/tint blend/opacity` — text color
- `bg: base/tint blend/opacity` — background color
- `bd: width radius base/tint blend/opacity` — border
- `ol: width radius base/tint blend/opacity` — outline
- `.` — inherit from parent scope
- `0` — transparent (opacity 0)
- `contrast` — auto-contrast against background
- `self` — the control's own semantic color

States are prefixed with `!` (e.g., `!hover`, `!disabled`). Sub-element
blocks (e.g., `marker:`, `track:`, `thumb:`) nest within a state and use the
same property notation.

## Controls

Styled controls:

- button
- input, textarea
- checkbox, radio
- slider (range)
- select (combo boxes)
- selector (horizontal option list)

## Style Variants

Following spec-002:

- `default` — filled background (buttons) or light paper background (fields)
- `outline` — transparent background, visible border
- `ghost` — transparent background, no border; subtle ink wash on hover
- `blank` — no visual chrome, inherits text color, no state effects

Button-specific:

- `icon` - square aspect ratio, compact padding, same visual rules as default

## States

- `hover`
- `active` (alias: `selected`)
- `focus` (alias: `focus-visible`, `focus-within`)
- `disabled`

## Semantic Colors

Applied as base color via classes:

- `accent`, `primary`, `secondary`, `tertiary`
- `success`, `warning`, `danger`

Default base is `neutral`.

## Buttons

### All Buttons

- Focus: `2px` outline, base color tinted to paper at 75%, 50% opacity (except `blank`)
- Disabled: 60% opacity on text, background, and border - clearly dimmed
- Base color: `--color-{neutral,primary,accent,...}`
- Cursor: `pointer` on all button variants (except `blank`)

### Default (Filled)

```
button:
  default:
    !default:
      tx: contrast                              # Contrast text against bg
      bg: ./paper 0%/1.0                        # Pure base color background
      bd: 1px 4px ./ink 85%/0.15                # Subtle darkened border
      ol: 2px 4px ./paper 75%/0.0               # Hidden outline
    !hover:
      bg: ./paper 20%/1.0                       # Lighten towards paper
    !active:
      bg: ./ink 20%/1.0                         # Darken towards ink
    !focus:
      ol: . . ./. ./0.5                         # Show outline
    !disabled:
      tx: . . ./0.6
      bg: . . ./0.6
      bd: . . . ./0.6
```

Rationale:

- Text uses `contrast` (from spec-001 `.tx-contrast`) to ensure readability
  against the filled background regardless of base color lightness.
- Hover *lightens* (tint towards paper at 20%) giving a visible lift effect.
- Active *darkens* (tint towards ink at 20%) giving clear pressed feedback.
- Border is a subtle ink-tinted edge (15% opacity) that adds definition without
  competing with the fill color.
- Disabled dims everything to 60% opacity for a clearly muted appearance.

### Outline

```
button:
  outline:
    !default:
      tx: self/ink 40%/1.0                      # Colored text (control color)
      bg: 0                                     # Transparent background
      bd: 1px 4px ./. 20%/0.6                   # Visible colored border
      ol: 2px 4px ./paper 75%/0.0               # Hidden outline
    !hover:
      bg: ./paper 80%/0.90                      # Base-tinted fill at 90% opacity
    !active:
      bg: ./paper 70%/0.80                      # Stronger fill at 80% opacity
    !focus:
      ol: . . ./. ./0.5
    !disabled:
      tx: . . ./0.6
      bd: . . . ./0.6
```

Rationale:

- Text uses `self` keyword to pick up the control's semantic color.
- Hover fills with a wash of the base color at 90% opacity, making the button
  feel responsive without being heavy.
- Active deepens the fill to 80% opacity for clear pressed feedback.
- Border uses 20% paper blend and 60% opacity for a visible colored edge.

### Ghost

```
button:
  ghost:
    !default:
      tx: self/ink 40%/1.0
      bg: 0
      bd: 0
      ol: 2px 4px ./paper 75%/0.0
    !hover:
      bg: ./ink 95%/0.08                        # Very subtle darkening
    !active:
      bg: ./ink 95%/0.12                        # Slightly more
    !focus:
      ol: . . ./. ./0.5
    !disabled:
      tx: . . ./0.6
```

Rationale:

- Hover at 8% opacity (up from original 5%) ensures the state change is
  perceptible on both light and dark backgrounds.
- Active at 12% gives clear feedback without being heavy.

### Blank

```
button:
  blank:
    !default:
      tx: inherit
      bg: 0
      bd: 0
      ol: 0
```

No hover, active, focus, or disabled visual effects. The element inherits
text color and has no chrome. Used for custom-styled buttons where the visual
treatment is handled by child content.

### Icon

Same visual rules as `default`, with:

- Square aspect ratio (equal horizontal/vertical padding)
- Compact padding (typically `0.25em`)
- Content centered

## Input / Textarea

### All Inputs

- Focus: `2px` outline, base color tinted to paper at 75%, 50% opacity (except `blank`)
- Disabled: 50% opacity, suppress hover/active effects
- Base color: `--color-{neutral,primary,accent,...}`
- Placeholder text: base tinted to ink at 80%, 45% opacity

### Default

```
input:
  default:
    !default:
      tx: ./ink 75%/1.0                         # Dark readable text
      bg: ./paper 95%/1.0                       # Near-white, slight warmth from base
      bd: 1px 4px ./ink 85%/0.25                # Subtle but visible border
      ol: 2px 4px ./paper 75%/0.0               # Hidden outline
      placeholder: ./ink 80%/0.45               # Muted placeholder
    !hover:
      bd: . . ./ink 80%/0.40                    # Border becomes more visible
    !focus:
      bd: . . ./ink 75%/0.50                    # Border strengthens
      ol: . . ./. ./0.5                         # Outline appears
    !active:
      bg: ./paper 98%/1.0                       # Slightly brighter on input
    !disabled:
      tx: . . ./0.5
      bg: ./paper 90%/0.5
      bd: . . . ./0.15
    !invalid:
      bd: danger/ink 80%/0.50                   # Red border for errors
      ol: danger/paper 75%/0.0                  # Prepare red outline
    !invalid+focus:
      ol: danger/paper 75%/0.5                  # Red outline on focus
```

Rationale:

- Background is near-white (paper 95%) rather than pure white, giving a slight
  warmth that helps inputs feel grounded on the page.
- For non-neutral colors, the paper 95% blend means a very subtle tint
  (e.g., faint blue for primary inputs) - enough to signal context without
  being distracting.
- Hover progressively strengthens the border (25% -> 40%) rather than changing
  the background, matching the convention that text inputs should feel stable.
- `!invalid` state is defined because form validation feedback is critical
  for inputs. Uses `danger` base color to override whatever semantic color
  is applied.

### Outline

```
input:
  outline:
    !default:
      tx: ./ink 75%/1.0
      bg: 0                                     # Transparent
      bd: 1px 4px ./ink 80%/0.40                # Stronger border since no bg
      ol: 2px 4px ./paper 75%/0.0
      placeholder: ./ink 80%/0.35
    !hover:
      bd: . . ./ink 75%/0.55
    !focus:
      bd: . . ./ink 70%/0.60
      ol: . . ./. ./0.5
    !disabled:
      tx: . . ./0.5
      bd: . . . ./0.20
    !invalid:
      bd: danger/ink 80%/0.50
```

Rationale:

- Without a background, the border must be more prominent (40% vs 25%) to
  clearly delineate the input area.

### Ghost

```
input:
  ghost:
    !default:
      tx: ./ink 75%/1.0
      bg: 0
      bd: 0 0 1px 0 ./ink 85%/0.25             # Bottom border only
      ol: 2px 4px ./paper 75%/0.0
      placeholder: ./ink 80%/0.35
    !hover:
      bd: . . . . ./ink 80%/0.40
    !focus:
      bd: . . . . ./ink 75%/0.55
      ol: . . ./. ./0.5
    !disabled:
      tx: . . ./0.5
      bd: . . . . . ./0.15
    !invalid:
      bd: . . . . danger/ink 80%/0.50
```

Rationale:

- Ghost inputs use an underline (bottom border only) as the minimal affordance
  that signals editability. This is the Material Design text-field pattern.

### Bare

```
input:
  blank:
    !default:
      tx: inherit
      bg: 0
      bd: 0
      ol: 0
      placeholder: ./ink 80%/0.35
```

No chrome. Inherits text color. Placeholder still styled for usability.

### Read-only

Applied as a modifier on any variant:

```
input:
  *:
    !readonly:
      bg: ./paper 90%/0.75                      # Slightly grayed
      bd: . . . ./0.15                          # Faded border
      cursor: default
```

## Checkbox

Sub-elements:

- **box** (implicit) - the square container, styled via the control's own `bg/bd/ol`
- **marker** - the check indicator (`::after` pseudo-element), a filled shape
  that appears on `:checked` and `:indeterminate`

Sizing: `box.size` = `1.15em`, `box.marker` = `0.72em`.

### All Checkboxes

- Focus: `2px` outline, base to paper 75%, 50% opacity (except `blank`)
- Disabled: 50% opacity, suppress hover effects
- Marker renders as `::after` with `inset`, `border-radius: inherit`, `background: currentColor`
- Indeterminate uses same marker styling as checked (a horizontal dash vs. check
  shape is handled by `content` tokens, not color rules)

### Default

```
checkbox:
  default:
    !default:
      tx: ./ink 75%/1.0                         # Label text
      bg: ./paper 95%/1.0                       # Light box fill
      bd: 1px 0.2em ./ink 85%/0.25              # Subtle border
      ol: 2px 0.2em ./paper 75%/0.0             # Hidden outline
      marker:
        bg: 0                                   # Hidden when unchecked
    !hover:
      bd: . . ./ink 80%/0.40                    # Border strengthens
      bg: ./paper 92%/1.0                       # Slight darkening
    !focus:
      ol: . . ./. ./0.5                         # Show outline
    !checked:
      bg: ./paper 0%/1.0                        # Fill with base color
      bd: . . ./ink 85%/0.15                    # Subtle edge on filled
      tx: contrast                              # Label stays readable
      marker:
        bg: contrast/1.0                        # Marker contrasts against fill
    !checked+hover:
      bg: ./ink 90%/1.0                         # Darken fill on hover
    !indeterminate:
      bg: ./paper 0%/1.0                        # Same fill as checked
      bd: . . ./ink 85%/0.15
      marker:
        bg: contrast/1.0
    !disabled:
      tx: . . ./0.5
      bg: . . ./0.5
      bd: . . . ./0.15
      marker:
        bg: . ./0.5                             # Faded marker
```

Rationale:

- Unchecked state matches input default: light paper background with subtle border.
  This consistency signals "editable field" across both text inputs and checkboxes.
- Checked state fills with the base color (same visual weight as a filled button),
  making the on/off distinction immediately obvious.
- Marker uses `contrast` to remain visible regardless of base color lightness.
- Hover on unchecked slightly darkens the background and strengthens the border,
  matching the progressive-hover pattern used for inputs.
- Hover on checked darkens the fill (tint to ink), matching the button hover pattern.

### Outline

```
checkbox:
  outline:
    !default:
      tx: ./ink 75%/1.0
      bg: 0                                     # Transparent box
      bd: 1px 0.2em ./ink 80%/0.40              # Visible border
      ol: 2px 0.2em ./paper 75%/0.0
      marker:
        bg: 0
    !hover:
      bd: . . ./ink 75%/0.55
    !focus:
      ol: . . ./. ./0.5
    !checked:
      bd: . . ./ink 75%/0.60                    # Stronger border
      marker:
        bg: ./ink 25%/1.0                       # Marker in base color
    !checked+hover:
      bd: . . ./ink 70%/0.70
      marker:
        bg: ./ink 20%/1.0                       # Slightly deeper marker
    !disabled:
      tx: . . ./0.5
      bd: . . . ./0.20
      marker:
        bg: . ./0.5
```

Rationale:

- Outline checkbox never fills the box, keeping visual consistency with outline
  buttons. The marker itself carries the color instead.
- Border strengthens on checked to reinforce that this is the "on" state.

### Bare

```
checkbox:
  blank:
    !default:
      tx: inherit
      bg: 0
      bd: 0
      ol: 0
      marker:
        bg: 0
    !checked:
      marker:
        bg: inherit/1.0
```

No chrome. Marker inherits color on checked.

## Radio

Sub-elements:

- **box** (implicit) - the circular container, always `border-radius: 50%`
- **dot** - the checked indicator (`::after` pseudo-element), a centered circle

Sizing: `box.size` = `1.15em`, `box.dot` = `0.72em`.

The radio shares the checkbox's visual logic but is always circular. The key
difference is `border-radius: 50%` on both box and outline, and the dot is
a filled circle rather than a check shape.

### Default

```
radio:
  default:
    !default:
      tx: ./ink 75%/1.0
      bg: ./paper 95%/1.0
      bd: 1px 50% ./ink 85%/0.25                # Circular border
      ol: 2px 50% ./paper 75%/0.0               # Circular outline
      dot:
        bg: 0                                   # Hidden when unchecked
        size: 0.72em
        radius: 50%
    !hover:
      bd: . . ./ink 80%/0.40
      bg: ./paper 92%/1.0
    !focus:
      ol: . . ./. ./0.5
    !checked:
      bg: ./paper 0%/1.0                        # Fill with base color
      bd: . . ./ink 85%/0.15
      dot:
        bg: contrast/1.0                        # Dot contrasts against fill
    !checked+hover:
      bg: ./ink 90%/1.0                         # Darken fill
    !disabled:
      tx: . . ./0.5
      bg: . . ./0.5
      bd: . . . ./0.15
      dot:
        bg: . ./0.5
```

Rationale:

- Mirrors checkbox default exactly, except for circular geometry. This ensures
  checkboxes and radios are visually consistent when used in the same form.
- The dot is a single filled circle, not a ring - this is the clearest indicator
  at small sizes and works well across all base colors.

### Outline

```
radio:
  outline:
    !default:
      tx: ./ink 75%/1.0
      bg: 0
      bd: 1px 50% ./ink 80%/0.40
      ol: 2px 50% ./paper 75%/0.0
      dot:
        bg: 0
    !hover:
      bd: . . ./ink 75%/0.55
    !focus:
      ol: . . ./. ./0.5
    !checked:
      bd: . . ./ink 75%/0.60
      dot:
        bg: ./ink 25%/1.0                       # Dot in base color
    !checked+hover:
      bd: . . ./ink 70%/0.70
      dot:
        bg: ./ink 20%/1.0
    !disabled:
      tx: . . ./0.5
      bd: . . . ./0.20
      dot:
        bg: . ./0.5
```

### Bare

```
radio:
  blank:
    !default:
      tx: inherit
      bg: 0
      bd: 0
      ol: 0
      dot:
        bg: 0
    !checked:
      dot:
        bg: inherit/1.0
```

## Select

Sub-elements:

- **arrow** - the dropdown chevron indicator, rendered via CSS `background-image`
  (two rotated linear-gradients forming a chevron). Positioned to the right of
  the select content.

Sizing: `arrow.size` = `0.3em`, `arrow.offset` = `0.75em`, `arrow.gap` = `0.33em`.

The arrow is only rendered on single-value selects (`:not([multiple]):not([size])`).
Extra `padding-right` is computed from arrow sizing tokens to prevent content overlap.

The select shares the input's visual foundation. The main distinction is the
arrow sub-element and the fact that selects don't have a placeholder state.

### Default

```
select:
  default:
    !default:
      tx: ./ink 75%/1.0
      bg: ./paper 95%/1.0
      bd: 1px 4px ./ink 85%/0.25
      ol: 2px 4px ./paper 75%/0.0
      arrow:
        tx: ./ink 80%/0.60                      # Muted chevron
        size: 0.3em
        offset: 0.75em
    !hover:
      bd: . . ./ink 80%/0.40
      arrow:
        tx: ./ink 75%/0.75                      # Chevron strengthens
    !focus:
      bd: . . ./ink 75%/0.50
      ol: . . ./. ./0.5
    !disabled:
      tx: . . ./0.5
      bg: ./paper 90%/0.5
      bd: . . . ./0.15
      arrow:
        tx: . ./0.30                            # Faded chevron
    !invalid:
      bd: danger/ink 80%/0.50
      ol: danger/paper 75%/0.0
    !invalid+focus:
      ol: danger/paper 75%/0.5
```

Rationale:

- Arrow starts at 60% opacity (muted but clearly visible) and strengthens to
  75% on hover, giving a subtle interactive signal without being distracting.
- All other properties mirror the input default exactly, ensuring form controls
  look cohesive when placed side by side.
- Invalid state uses danger color same as input, since select is a form field.

### Outline

```
select:
  outline:
    !default:
      tx: ./ink 75%/1.0
      bg: 0
      bd: 1px 4px ./ink 80%/0.40
      ol: 2px 4px ./paper 75%/0.0
      arrow:
        tx: ./ink 80%/0.50
    !hover:
      bd: . . ./ink 75%/0.55
      arrow:
        tx: ./ink 75%/0.65
    !focus:
      bd: . . ./ink 70%/0.60
      ol: . . ./. ./0.5
    !disabled:
      tx: . . ./0.5
      bd: . . . ./0.20
      arrow:
        tx: . ./0.25
    !invalid:
      bd: danger/ink 80%/0.50
```

### Ghost

```
select:
  ghost:
    !default:
      tx: ./ink 75%/1.0
      bg: 0
      bd: 0 0 1px 0 ./ink 85%/0.25
      ol: 2px 4px ./paper 75%/0.0
      arrow:
        tx: ./ink 80%/0.50
    !hover:
      bd: . . . . ./ink 80%/0.40
      arrow:
        tx: ./ink 75%/0.65
    !focus:
      bd: . . . . ./ink 75%/0.55
      ol: . . ./. ./0.5
    !disabled:
      tx: . . ./0.5
      bd: . . . . . ./0.15
      arrow:
        tx: . ./0.25
    !invalid:
      bd: . . . . danger/ink 80%/0.50
```

### Bare

```
select:
  blank:
    !default:
      tx: inherit
      bg: 0
      bd: 0
      ol: 0
      arrow:
        tx: inherit/0.50
```

## Range / Slider

Sub-elements:

- **track** - the horizontal bar along which the thumb moves. Rendered via
  `::-webkit-slider-runnable-track` and `::-moz-range-track`.
- **thumb** - the circular handle the user drags. Rendered via
  `::-webkit-slider-thumb` and `::-moz-range-thumb`.

Sizing: `track.height` = `0.28em`, `track.radius` = `999px` (fully rounded),
`thumb.size` = `0.95em`, `thumb.radius` = `50%`.

The slider is structurally different from other controls: the control itself has
a transparent background and no border. All visual identity comes from the
track and thumb sub-elements. This means the control-level `bg/bd` are always
transparent, and styling lives entirely within sub-element blocks.

### Default

```
slider:
  default:
    !default:
      bg: 0                                     # Transparent control bg
      bd: 0                                     # No control border
      ol: 2px 4px ./paper 75%/0.0               # Focus outline (hidden)
      track:
        bg: ./ink 90%/0.15                      # Light neutral track
        bd: 0
        size: . 0.28em                          # height
        radius: 999px                           # Fully rounded
      thumb:
        bg: ./paper 0%/1.0                      # Filled with base color
        bd: 1px 50% ./ink 85%/0.15              # Subtle darkened edge
        size: 0.95em 0.95em
        radius: 50%
    !hover:
      thumb:
        bg: ./ink 90%/1.0                       # Darken thumb slightly
        bd: . . ./ink 80%/0.20
      track:
        bg: ./ink 88%/0.20                      # Track slightly more visible
    !active:
      thumb:
        bg: ./ink 85%/1.0                       # Darken thumb more
        size: 1.05em 1.05em                     # Slight grow on drag
    !focus:
      ol: . . ./. ./0.5                         # Show outline
      thumb:
        bd: . . ./paper 75%/0.40                # Visible ring on thumb
    !disabled:
      thumb:
        bg: . . ./0.5                           # Faded thumb
        bd: . . . ./0.10
      track:
        bg: . . ./0.08                          # Faded track
```

Rationale:

- The thumb is the primary interactive element and gets the base color fill,
  matching the filled-button pattern. This makes the thumb immediately
  identifiable as the draggable handle.
- The track is a muted neutral bar (15% opacity toward ink) - enough to show
  the slider's range without competing with the thumb.
- Hover darkens the thumb (not lightens), consistent with the button hover rule.
- Active slightly enlarges the thumb (1.05em) to give tactile "grabbed" feedback.
  This is a common pattern in Material and Apple's HIG.
- Track also responds to hover (slightly more visible) so the entire slider
  control feels interactive, not just the thumb.
- Focus adds a visible ring to the thumb via border, supplementing the control-
  level outline for keyboard navigation.

### Bare

```
slider:
  blank:
    !default:
      bg: 0
      bd: 0
      ol: 0
      track:
        bg: ./ink 90%/0.10
        bd: 0
      thumb:
        bg: ./ink 75%/1.0
        bd: 0
```

No focus ring, no state effects. Minimal track and thumb for custom styling.

## Selector (Container)

The selector is a compound control: the container wraps a set of option items.
It is defined as two separate rule blocks: `selector` for the container chrome
and `selector.option` for individual items within.

Container sub-elements: none (it's a wrapper).

### All Selectors

- Container provides the border, background, and overall shape
- Focus is handled at the container level via `:focus-within`
- Individual option state (hover, active, selected) is on `selector.option`
- Container disabled state disables all child options

### Default

```
selector:
  default:
    !default:
      bg: ./paper 95%/1.0                       # Light container fill
      bd: 1px 4px ./ink 85%/0.25                # Subtle container border
      ol: 2px 4px ./paper 75%/0.0               # Hidden outline
      gap: 0px                                  # No gap between options
      padding: 2px                              # Inset for selected indicator
    !focus-within:
      ol: . . ./. ./0.5                         # Show outline
    !disabled:
      bg: . . ./0.5
      bd: . . . ./0.15
```

### Outline

```
selector:
  outline:
    !default:
      bg: 0
      bd: 1px 4px ./ink 80%/0.40
      ol: 2px 4px ./paper 75%/0.0
      gap: 0px
      padding: 2px
    !focus-within:
      ol: . . ./. ./0.5
    !disabled:
      bd: . . . ./0.20
```

## Selector Option

Each option within a selector container. Options are `> .option`, `> label`,
`> button`, or `> a` children. Hidden `input[type=checkbox]` and
`input[type=radio]` elements are `display: none`.

Selected state is detected via `.selected`, `[aria-pressed="true"]`,
`[aria-checked="true"]`, or `input:checked + label`.

### Default

```
selector.option:
  default:
    !default:
      tx: ./ink 75%/1.0                         # Option text
      bg: 0                                     # Transparent (container provides bg)
      bd: 0                                     # No individual borders
      padding: 0.5em 0.875em
    !hover:
      bg: ./ink 95%/0.06                        # Subtle darkening
    !active:
      bg: ./ink 95%/0.10                        # Slightly more on press
    !selected:
      tx: contrast                              # Contrast text on filled bg
      bg: ./paper 0%/1.0                        # Fill with base color
      bd: 0 4px ./ink 85%/0.10                  # Subtle edge
    !selected+hover:
      bg: ./ink 90%/1.0                         # Darken selected fill
    !disabled:
      tx: . . ./0.5
      bg: 0
```

Rationale:

- Unselected options are transparent, relying on the container background. This
  ensures the selected option stands out as the only filled item.
- Selected state mirrors the filled-button pattern: base color fill with
  contrast text. This creates a strong, unambiguous "on" indicator.
- Hover on unselected uses the ghost-button pattern (subtle ink wash at 6%).
- Hover on selected darkens the fill, same as filled-button hover.
- Middle options get `border-radius: 0px` (handled by layout, not color rules).

### Outline

```
selector.option:
  outline:
    !default:
      tx: ./ink 75%/1.0
      bg: 0
      bd: 0
    !hover:
      bg: ./ink 95%/0.06
    !active:
      bg: ./ink 95%/0.10
    !selected:
      tx: ./ink 25%/1.0                         # Text in base color
      bg: 0                                     # No fill
      bd: 0 0 2px 0 ./ink 25%/0.75              # Bottom border indicator
    !selected+hover:
      bd: . . . . ./ink 20%/0.85                # Stronger underline
    !disabled:
      tx: . . ./0.5
```

Rationale:

- Outline selector uses an underline (bottom border) to indicate selection
  rather than a filled background, consistent with the outline variant's
  "no fill" principle. This is the tab-bar pattern used in many web UIs.

## Shared Patterns Summary

Across all controls, these patterns are consistently applied:

| Pattern | Rule | Controls |
|---------|------|----------|
| Focus ring | `ol: 2px . ./paper 75%/0.5` | All except blank |
| Disabled | 50% opacity on tx+bg, suppressed hover | All except blank |
| Filled hover | Darken toward ink (90%) | Button, checkbox checked, radio checked, slider thumb, selector.option selected |
| Outline hover | Strengthen border, no fill | Button outline, checkbox outline, input outline |
| Ghost hover | Ink wash 8% opacity | Button ghost, ghost input |
| Invalid | `danger` base on border + outline | Input, textarea, select |
| Contrast text | `contrast` on filled backgrounds | Button default, checkbox checked, radio checked, selector.option selected |
| Progressive border | Strengthen on hover -> focus | Input, select, checkbox unchecked, radio unchecked |
