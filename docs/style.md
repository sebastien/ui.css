# Style Module (`style.js`)

## Interaction, spacing, borders, shadows, and visibility

The `style.js` module provides miscellaneous styling utilities for spacing, element appearance, interactive states, depth effects, and visibility.

### Spacing (0-8):

- `.p-{0-8}`, `.pt-{0-8}`, `.pb-{0-8}`, `.pl-{0-8}`, `.pr-{0-8}`: Padding (all sides or specific).
- `.pw-{0-8}`, `.ph-{0-8}`: Horizontal/vertical padding.
- `.m-{0-8}`, `.mt-{0-8}`, `.mb-{0-8}`, `.ml-{0-8}`, `.mr-{0-8}`: Margin (all sides or specific).
- `.mw-{0-8}`, `.mh-{0-8}`: Horizontal/vertical margin.
- `.ma`: Sets `margin: auto`.
- `.no-p`, `.no-ph`, `.no-pv`: Suppresses padding on all, horizontal, or vertical axes.
- `.no-m`, `.no-mh`, `.no-mv`: Suppresses margin on all, horizontal, or vertical axes.

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

- `.sh-0` through `.sh-4`: Box shadow levels using standard displacement and spread variables.
- `.noblur`: Removes shadow spread (sets `--shadow-spread: 0`).
- `.inset`: Pressed/sunken 3D effect.
- `.outset`, `.raised`: Elevated/popping 3D effect (`.raised` is a compatibility alias).
- `.embossed`: Inset highlight and shadow effect.
- `.d`, `.d-0` through `.d-4`: Visual depth scale from `0px` to `1px` in `0.25px` steps; `.d` defaults to `.d-1` (`0.25px`).
- `.t-inset`, `.t-outset`: Inset and outset text-shadow effects.
- `.z-0` through `.z-10`: Z-index scale (indices 0, 10, 20, ..., 100).

### Border and Rounding:

- `.rd`: Applies the current `--border-radius`.
- `.rd-0` through `.rd-4`: Sets `--border-radius` to a specific pixel value.
- `.nord`, `.nord-tl`, `.nord-tr`, `.nord-bl`, `.nord-br`, `.nord-t`, `.nord-r`, `.nord-b`, `.nord-l`: Removes rounding globally or on a side/corner.
- `.rounded`, `.rounder`, `.roundest`: Relative rounding based on line-height (`0.25lh`, `0.5lh`, `1.5lh`).
- `.bdw-0` through `.bdw-4`: Sets the custom border width token.
- `.inset`, `.outset`, and `.embossed` inherit their border width from the current border width token.
- `.bd-t`, `.bd-b`, `.bd-l`, `.bd-r`: Applies border width and style to one side; color-side utilities are provided by the colors module.
- `.dashed`, `.dotted`: Sets `border-style`.

### Components and Mixins:

- `table`: Reset table with `border-collapse: separate`.
- `table.lined`: Adds borders to table cells.
- `.sep`: Adds `/` separators between children (use with `.dash` or `.comma`).
- `.striped`: Adds alternating background colors to children.

### Using

```html
<div class="bd rd-4 sh-2 p-2 bg-paper">
    <div class="row middle g-2">
        <span class="icon pointer">Icon</span>
        <span class="fill">Interactive Card</span>
    </div>
</div>

<button class="raised rd-2 p-2 pointer">
    Click Me
</button>

<ul class="striped bd-t-1 bd">
    <li>Row 1</li>
    <li>Row 2</li>
</ul>
```

### API

### The `style` module:

- The default export is a named module object consumed by the CSS renderer; it is not a runtime function.
- `vars.pad`, `vars.margin`: Standardized spacing scales used by spacing utilities.
- `vars.border.radius`, `vars.border`, `vars.shadow`: Configuration variables for rounding and depth.
- `vars.opacity`: Level definitions for `.dim` classes.
