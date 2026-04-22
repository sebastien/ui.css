# Style Module (`style.js`)

## Interaction, borders, shadows, and visibility

The `style.js` module provides miscellaneous styling utilities for element appearance, interactive states, depth effects, and visibility.

### Interaction:

- `.move`, `.pointer`, `.help`, `.grab`, `.grabbing`: Cursor overrides.
- `.resize-w`, `.resize-h`, `.resize`: Resize handles with `col-resize`, `row-resize`, or `nwse-resize`.
- `.noev`, `.ev`: Controls `pointer-events`.
- `.nolink`: Removes default link colors and underlines.
- `.noresize`: Disables `textarea` resizing.

### Visibility and Opacity:

- `.skip`: `display: none !important`.
- `.invisible`: `opacity: 0 !important`.
- `.hidden`: `visibility: hidden !important`.
- `.dim`, `.dimmer`, `.dimmest`: Sets `opacity` via variables (`0.75`, `0.5`, `0.25`).
- `.bg-dim`, `.bg-dimmer`, `.bg-dimmest`: Sets background opacity variables.

### Depth and Shadows:

- `.sh-0` through `.sh-9`: Box shadow levels using standard displacement and spread variables.
- `.noblur`: Removes shadow spread (sets `--shadow-spread: 0`).
- `.inset`: Pressed/sunken 3D effect.
- `.raised`: Elevated/popping 3D effect.
- `.z-0` through `.z-10`: Z-index scale (indices 0, 10, 20, ..., 100).

### Border and Rounding:

- `.rd`: Applies the current `--border-radius`.
- `.rd-0` through `.rd-9`: Sets `--border-radius` to a specific pixel value (0-9px).
- `.rd-tl-`, `.rd-tr-`, `.rd-bl-`, `.rd-br-`: Corner-specific pixel rounding (e.g., `.rd-tl-4`).
- `.rounded`, `.rounder`, `.roundest`: Relative rounding based on line-height (`0.25lh`, `0.5lh`, `1.5lh`).
- `.bd-0` through `.bd-9`: Sets `--border-width` (0-9px).
- `.bdw-t-`, `.bdw-b-`, `.bdw-l-`, `.bdw-r-`: Side-specific border width.
- `.dashed`, `.dotted`: Sets `border-style`.

### Components and Mixins:

- `table`: Reset table with `border-collapse: separate`.
- `table.lined`: Adds borders to table cells.
- `.sep`: Adds `/` separators between children (use with `.dash` or `.comma`).
- `.striped`: Adds alternating background colors to children.

### Using

```html
<div class="bd rd-4 sh-2 p-m bg-paper">
    <div class="row items-center g-s">
        <span class="icon pointer">🔥</span>
        <span class="fill">Interactive Card</span>
    </div>
</div>

<button class="raised rd-2 p-s pointer">
    Click Me
</button>

<ul class="striped bd-t-1 bd">
    <li>Row 1</li>
    <li>Row 2</li>
</ul>
```

### API

### The `style` module:

- `style()`: Generates the miscellaneous style utility classes.
- `vars.radius`, `vars.border`, `vars.shadow`: Configuration variables for rounding and depth.
- `vars.opacity`: Level definitions for `.dim` classes.
