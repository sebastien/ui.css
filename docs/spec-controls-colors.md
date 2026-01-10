# Control Colors

## All Controls

### Requirements
- Outline width, color, and opacity when focus/active should be consistent across all components
- Overrides through `{bg,ol,bd,tx}-*` should be taken into account

### Colors
- Accent color is sourced from the semantic classes (`neutral`, `primary`, `secondary`, `tertiary`, `success`, `info`, `warning`, `danger`)
- Accent color may be applied to background (e.g., buttons), border (e.g., outline button) and/or text (e.g., icon button) depending on control and variant

### Behaviour
- **Focus**: displays an outline, 2px width, 0.15 opacity (1.35/9)
- **Hover**: -0.25 delta (towards ink)
- **Selected**: -0.5 delta (towards ink)
- **Active**: -0.75 delta (towards ink)
- **Outline variants**: deltas are amplified 2x for text/border since thin lines need more contrast for equivalent visibility
- **Text contrast**: Text luminosity is constrained based on background (threshold 5.5):
  - Background L <= 5 (dark): text L constrained to 8-9 (towards paper)
  - Background L >= 6 (light): text L constrained to 0-1 (towards ink)
  - The `tx-*` classes override these constraints

### Implementation
- Use CSS variables with direction-aware luminosity: `L = 0.5 + direction * (l + delta_l - 4.5) / 10`
- Direction: 1 for light mode, -1 for dark mode
- Contrast threshold at 5.5 ensures bg-5 pushes text towards paper, bg-6 towards ink

---

## Selectable

Container/wrapper interactive items that change appearance on hover/focus/active/selected states.

- **Variables**: Uses namespaced `--selectable-*` variables to avoid affecting children
- **Accent**: neutral by default, applied to background
- **Text**: Inherited from parent (no WCAG contrast calculation)
- **Default l/c**: 5/5 (mid-tone, moderate chroma)

### States
| State | Background Opacity | Delta L |
|-------|-------------------|---------|
| Base | 0 | 0 |
| Hover | 0.15 (1.35/9) | -0.25 |
| Focus | - | - (outline appears) |
| Selected | 0.20 (1.8/9) | -0.5 |
| Active | 0.25 (2.25/9) | -0.75 |

### Focus Outline
- Width: 2px
- Opacity: 0.15 (1.35/9)
- Offset: 1px
- Color: `oklch(from base 0.5 0.15 h)`

---

## Pills & Buttons

Interactive controls with filled or outline variants.

- **Variables**: Uses standard `--background-*`, `--text-*`, `--border-*`, `--outline-*` variables
- **Default l/c**: 5/5 for background/text/border, applied with opacity 9 (opaque)

### Normal Mode (filled)
- Accent is mapped to background
- Text color uses WCAG contrast calculation against background (threshold 5.5)
- Border matches background luminosity

#### States
| State | Delta L (bg) | Delta L (border) |
|-------|-------------|------------------|
| Hover | -0.25 | -0.25 |
| Selected | -0.5 | -0.5 |
| Active | -0.75 | -0.75 |

### Outline Mode
- Background opacity starts at 0, appears on interaction (like Selectable)
- Accent is mapped to text and border
- Text and border luminosity follow `--background-l`, so `bg-[0-9]` modifiers control text/border luminosity
- WCAG text constraints disabled (text-l-min: 0, text-l-max: 9)
- Border uses accent color at background luminosity, **80% opacity** (7.2/9) to match text visual weight
- `tx-*` classes can still override text color
- **Amplified deltas**: text and border use 2x delta for visibility
- Border width: 2px (vs 1px for filled)

#### States
| State | Background Opacity | Delta L (bg) | Delta L (text/border) |
|-------|-------------------|--------------|----------------------|
| Base | 0 | 0 | 0 |
| Hover | 0.15 (1.35/9) | -0.25 | -0.5 |
| Selected | 0.20 (1.8/9) | -0.5 | -1.0 |
| Active | 0.25 (2.25/9) | -0.75 | -1.5 |

### Blank/Icon Mode
- Accent is mapped to text only
- Background and border opacity start at 0, background appears on interaction (like Selectable)
- Text luminosity follows `--background-l`, so `bg-[0-9]` modifiers control text luminosity
- WCAG text constraints disabled (text-l-min: 0, text-l-max: 9)
- **Amplified deltas**: text uses 2x delta for visibility
- Applies to both `.blank` and `.icon` button variants
- `.icon` variant has minimal padding (4px)

#### States
| State | Background Opacity | Delta L (bg) | Delta L (text) |
|-------|-------------------|--------------|----------------|
| Base | 0 | 0 | 0 |
| Hover | 0.15 (1.35/9) | -0.25 | -0.5 |
| Selected | 0.20 (1.8/9) | -0.5 | -1.0 |
| Active | 0.25 (2.25/9) | -0.75 | -1.5 |

### Contrast Mode
- `.contrast` class forces maximum text contrast
- **Filled**: text forced to 0 (ink) or 9 (paper) based on background darkness
- **Outline/Blank/Icon**: text and border shifted by `direction * -2.25` toward ink/paper

### Focus Outline
- Width: 2px
- Opacity: 0.15 (1.35/9)
- No offset (default)

---

## Selector

Grouped buttons for mutually exclusive choices.

- **Variables**: Uses standard `--background-*`, `--text-*`, `--border-*` variables
- **Container**: `display: inline-flex`, items share borders (margin-left: -1px)
- **Default**: Background opacity 0, border opacity 9

### Item States
| State | Background Opacity | Delta L |
|-------|-------------------|---------|
| Base | 0 | 0 |
| Hover | 0.15 (1.35/9) | -0.25 |
| Focus | - | - (outline appears) |
| Selected | 1.0 (9/9) | -0.5 |
| Active | 0.25 (2.25/9) | -0.75 |

### Focus Outline
- Width: 2px
- Opacity: 0.15 (1.35/9)
- Offset: -2px (inset)
- Color: `oklch(from base 0.5 0.15 h)`

### Style Variants
- `.pills`: adds gap between items, rounded borders

---

## Inputs

Text entry fields with paper-based background.

- **Variables**: Uses namespaced `--input-*` variables (background, border, outline, text)
- **Background**: `paper` at 0.9 opacity (8.1/9) by default, L=9, C=0
- **Border**: neutral at L=4, opacity 9
- **Text**: Uses WCAG contrast calculation against input background
  - Constraints: 0-2 or 7-9 (slightly wider range than standard controls)

### Color Variants
When a semantic class is applied (e.g., `.primary`):
- Background gets a light tint of the semantic color (L=8, C=2)
- Border, outline, and text use the semantic color

### States
| State | Border Delta L |
|-------|---------------|
| Hover | -0.25 |
| Active | -0.75 |

### Focus Outline
- Width: 2px
- Opacity: 0.15 (1.35/9)

### Style Variants
- `.blank`: background, border, and outline opacity set to 0
- `.noinput`: removes all styling (transparent, no padding)

---

## Toggle

On/off switches with track and slider.

- **Variables**: Uses namespaced `--toggle-*` variables (background, border, active)
- **Track**: neutral color, L=7, C=2 (lighter background)
- **Border**: neutral at L=5, opacity 9
- **Slider**: `paper` color (adapts to dark/light mode)
- **Active state**: Uses `--toggle-active-base` (primary by default)

### States
| State | Track Delta L |
|-------|--------------|
| Hover | -0.25 |
| Checked | Uses active base color at L=5 |

### Checked State
- Background base switches to `--toggle-active-base`
- Background L changes to 5 (mid-tone)
- Border base also switches to active color
- Slider translates to the right

### Color Variants
Color classes (`.primary`, `.secondary`, `.success`, `.warning`, `.danger`) set the `--toggle-active-base` for the checked state.

### Size Variants
| Size | Track Width | Track Height | Slider Size |
|------|-------------|--------------|-------------|
| small | 2.5em | 1.25em | 1.25em - 4px |
| default | 3em | 1.5em | 1.5em - 4px |
| large | 3.5em | 1.75em | 1.75em - 4px |

---

## Constants Reference

```javascript
// Focus outline
const FOCUS = { width: "2px", opacity: 1.35 }; // 1.35/9 ≈ 0.15

// Luminosity deltas (on 0-9 scale, towards ink)
const DELTA = { hover: -0.25, selected: -0.5, active: -0.75 };

// Amplification factor for outline variants (text/border only)
const OUTLINE_AMP = 2;

// Selectable/outline background opacities (on 0-9 scale)
const SELECTABLE = {
  opacity: { hover: 1.35, selected: 1.8, active: 2.25 }
}; // /9 → 0.15, 0.20, 0.25

// Input background
const INPUT = { backgroundOpacity: 8.1 }; // 8.1/9 ≈ 0.9

// Contrast threshold for WCAG text constraints
const CONTRAST_THRESHOLD = 5.5; // bg-5 → paper, bg-6 → ink
```

## Variable Namespacing

Controls use different variable strategies:

| Control | Variables | Reason |
|---------|-----------|--------|
| Button | Standard (`--background-*`, etc.) | Full override support |
| Pill | Standard | Full override support |
| Selector | Standard | Full override support |
| Selectable | Namespaced (`--selectable-*`) | Avoid affecting children |
| Input | Namespaced (`--input-*`) | Avoid affecting children |
| Toggle | Namespaced (`--toggle-*`) | Unique track/slider needs |
