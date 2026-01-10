# Control Colors

## All Controls

### Requirements
- Outline width, color, and opacity when focus/active should be consistent across all components
- Overrides through `{bg,ol,bd,tx}-*` should be taken into account

### Colors
- Accent color is sourced from the semantic classes (`neutral`, `primary`, `secondary`, `tertiary`, `success`, `info`, `warning`, `danger`)
- Accent color may be applied to background (e.g., buttons), border (e.g., outline button) and/or text (e.g., icon button) depending on control and variant

### Behaviour
- **Focus**: displays an outline, 2px width, 0.15 alpha (1.5/10)
- **Hover**: -1 level (towards ink)
- **Selected**: -2 level (towards ink)
- **Active**: -2 level (towards ink)
- **Outline variants**: level deltas are amplified 2x for text/border since thin lines need more contrast for equivalent visibility
- **Text contrast**: Text luminosity is constrained based on background (threshold 4.5):
  - Background level <= 4 (dark): text level constrained to 8-9 (towards paper)
  - Background level >= 5 (light): text level constrained to 0-1 (towards ink)
  - The `tx-*` classes override these constraints

### Implementation
- Use CSS variables with direction-aware luminosity: `L = 0.05 + effective_level * 0.1`
- Effective level: `direction == 1 ? level : (9 - level)`
- Direction: 1 for light mode, -1 for dark mode
- Contrast threshold at 4.5 ensures level-4 pushes text towards paper, level-5 towards ink

---

## Selectable

Container/wrapper interactive items that change appearance on hover/focus/active/selected states.

- **Variables**: Uses namespaced `--selectable-*` variables to avoid affecting children
- **Accent**: neutral by default, applied to background
- **Text**: Inherited from parent (no WCAG contrast calculation)
- **Default level**: direction-aware (8.5 in light mode, 0.5 in dark mode)

### States
| State | Background Alpha | Level Delta |
|-------|------------------|-------------|
| Base | 0 | 0 |
| Hover | 1.5 (/10 = 0.15) | -1 |
| Focus | - | - (outline appears) |
| Selected | 2.0 (/10 = 0.20) | -2 |
| Active | 2.5 (/10 = 0.25) | -2 |

### Focus Outline
- Width: 2px
- Alpha: 1.5 (/10 = 0.15)
- Offset: 1px
- Color: `oklch(0.5 0.15 h)`

---

## Pills & Buttons

Interactive controls with filled or outline variants.

- **Variables**: Uses standard `--background-*`, `--text-*`, `--border-*`, `--outline-*` variables
- **Default level**: 5 for background/text/border, alpha 10 (opaque)

### Normal Mode (filled)
- Accent is mapped to background
- Text color uses WCAG contrast calculation against background (threshold 4.5)
- Border matches background level

#### States
| State | Level Delta (bg) | Level Delta (border) |
|-------|------------------|----------------------|
| Hover | -1 | -1 |
| Selected | -2 | -2 |
| Active | -2 | -2 |

### Outline Mode
- Background alpha starts at 0, appears on interaction (like Selectable)
- Accent is mapped to text and border
- Text and border level follow `--background-level`, so `bg-[0-9]` modifiers control text/border level
- WCAG text constraints disabled (text-l-min: 0, text-l-max: 9)
- Border uses accent color at background level, **72% alpha** (7.2/10) to match text visual weight
- `tx-*` classes can still override text color
- **Amplified deltas**: text and border use 2x level delta for visibility
- Border width: 2px (vs 1px for filled)

#### States
| State | Background Alpha | Level Delta (bg) | Level Delta (text/border) |
|-------|------------------|------------------|---------------------------|
| Base | 0 | 0 | 0 |
| Hover | 1.5 (/10 = 0.15) | -1 | -2 |
| Selected | 2.0 (/10 = 0.20) | -2 | -4 |
| Active | 2.5 (/10 = 0.25) | -2 | -4 |

### Blank/Icon Mode
- Accent is mapped to text only
- Background and border alpha start at 0, background appears on interaction (like Selectable)
- Text level follows `--background-level`, so `bg-[0-9]` modifiers control text level
- WCAG text constraints disabled (text-l-min: 0, text-l-max: 9)
- **Amplified deltas**: text uses 2x level delta for visibility
- Applies to both `.blank` and `.icon` button variants
- `.icon` variant has minimal padding (4px)

#### States
| State | Background Alpha | Level Delta (bg) | Level Delta (text) |
|-------|------------------|------------------|-------------------|
| Base | 0 | 0 | 0 |
| Hover | 1.5 (/10 = 0.15) | -1 | -2 |
| Selected | 2.0 (/10 = 0.20) | -2 | -4 |
| Active | 2.5 (/10 = 0.25) | -2 | -4 |

### Contrast Mode
- `.contrast` class forces maximum text contrast
- **Filled**: text forced to level 0 (ink) or 9 (paper) based on background darkness
- **Outline/Blank/Icon**: text and border shifted by `direction * -2.25` toward ink/paper

### Focus Outline
- Width: 2px
- Alpha: 1.5 (/10 = 0.15)
- No offset (default)

---

## Selector

Grouped buttons for mutually exclusive choices.

- **Variables**: Uses standard `--background-*`, `--text-*`, `--border-*` variables
- **Container**: `display: inline-flex`, items share borders (margin-left: -1px)
- **Default**: Background alpha 0, border alpha 10

### Item States
| State | Background Alpha | Level Delta |
|-------|------------------|-------------|
| Base | 0 | 0 |
| Hover | 1.5 (/10 = 0.15) | -1 |
| Focus | - | - (outline appears) |
| Selected | 10 (/10 = 1.0) | -2 |
| Active | 2.5 (/10 = 0.25) | -2 |

### Focus Outline
- Width: 2px
- Alpha: 1.5 (/10 = 0.15)
- Offset: -2px (inset)
- Color: `oklch(0.5 0.15 h)`

### Style Variants
- `.pills`: adds gap between items, rounded borders

---

## Inputs

Text entry fields with paper-based background.

- **Variables**: Uses namespaced `--input-*` variables (background, border, outline, text)
- **Background**: `paper` at 0.9 alpha (9/10) by default, level=9, c=0
- **Border**: neutral at level=4, alpha 10
- **Text**: Uses WCAG contrast calculation against input background
  - Constraints: 0-2 or 7-9 (slightly wider range than standard controls)

### Color Variants
When a semantic class is applied (e.g., `.primary`):
- Background gets a light tint of the semantic color (level=8, c from color)
- Border, outline, and text use the semantic color

### States
| State | Border Level Delta |
|-------|--------------------|
| Hover | -1 |
| Active | -2 |

### Focus Outline
- Width: 2px
- Alpha: 1.5 (/10 = 0.15)

### Style Variants
- `.blank`: background, border, and outline alpha set to 0
- `.noinput`: removes all styling (transparent, no padding)

---

## Toggle

On/off switches with track and slider.

- **Variables**: Uses namespaced `--toggle-*` variables (background, border, active)
- **Track**: neutral color, level=7, c=0.02 (lighter background)
- **Border**: neutral at level=5, alpha 10
- **Slider**: `paper` color (adapts to dark/light mode)
- **Active state**: Uses `--toggle-active-c` and `--toggle-active-h` (primary by default)

### States
| State | Track Level Delta |
|-------|-------------------|
| Hover | -1 |
| Checked | Uses active color at level=5 |

### Checked State
- Background c/h switches to `--toggle-active-c/h`
- Background level changes to 5 (mid-tone)
- Border c/h also switches to active color
- Slider translates to the right

### Color Variants
Color classes (`.primary`, `.secondary`, `.success`, `.warning`, `.danger`) set the `--toggle-active-c` and `--toggle-active-h` for the checked state.

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
const FOCUS = { width: "2px", alpha: 1.5 }; // 1.5/10 = 0.15

// Level deltas for states (towards ink)
const LEVEL_DELTA = { hover: -1, selected: -2, active: -2 };

// Amplification factor for outline variants (text/border only)
const OUTLINE_AMP = 2;

// Selectable/outline background alphas (on 0-10 scale)
const SELECTABLE = {
  alpha: { hover: 1.5, selected: 2, active: 2.5 }
}; // /10 → 0.15, 0.20, 0.25

// Input background
const INPUT = { backgroundAlpha: 9 }; // 9/10 = 0.9

// Contrast threshold for WCAG text constraints
const CONTRAST_THRESHOLD = 4.5; // level-4 → paper, level-5 → ink
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

## CSS Variables per Property

Each color property uses these variables:

| Variable | Range | Description |
|----------|-------|-------------|
| `--{prop}-level` | 0-9 | Scale position (0=dark, 9=light) |
| `--{prop}-c` | 0-0.4 | Chroma |
| `--{prop}-h` | 0-360 | Hue |
| `--{prop}-alpha` | 0-10 | Opacity (10=opaque) |
| `--{prop}-blend` | 0-9 | Blend amount |
| `--{prop}-blending` | color | Blend target |

Text-specific (for WCAG contrast):

| Variable | Description |
|----------|-------------|
| `--text-l-min` | Minimum level (set by `.bg`) |
| `--text-l-max` | Maximum level (set by `.bg`) |
