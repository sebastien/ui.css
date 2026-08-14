# Layout Module (`layout.js`)

## Flexbox, grid, and dimensional utilities

The `layout.js` module provides a comprehensive suite of utilities for controlling element display, positioning, alignment, and sizing.

### Alignment and Display:

- `.centered`: Flex container with center alignment and justification.
- `.bbox`, `.cbox`: Sets `box-sizing` to `border-box` or `content-box`.
- `.bl`, `.il`, `.ibl`: Block, inline, and inline-block display.
- `.fl`, `.ifl`: Flex and inline-flex display.
- `.grid`: Grid display.
- `.grid-items`: Responsive grid with automatic columns sized from `--item-min`; direct children are capped by `--item-max`.

### Positioning:

- `.rel`, `.abs`, `.fix`, `.sticky`: Position modes.
- `.cover`: Absolute positioning covering the entire parent (`0px` on all sides).
- `.to-tl`, `.to-tr`, `.to-br`, `.to-bl`: Pin to a corner.
- `.to-t`, `.to-b`, `.to-l`, `.to-r`: Pin to sides.
- `.to-s`, `.to-n`, `.to-e`, `.to-w`: Position relative to the corresponding edge.
- `.to-hc`, `.to-wc`: Set the corresponding axis to `50%`.
- `.to-c`: Set both axes to `50%`; it does not apply a centering transform.

### Sizing and Gaps:

- `.g-{0-10}`: Grid/Flex gap.
- `.w-{0-10}`, `.h-{0-10}`: Width and height token scale.
- `.w-{n}bl`, `.wmn-{n}bl`, `.wmx-{n}bl`, `.h-{n}bl`, `.hmn-{n}bl`, `.hmx-{n}bl`: Block-based dimensions for `n` from 1 to 5.

### Flex and Grid:

- `.row`, `.stack`: Flex-direction row and column.
- `.wrap`, `.nowrap`: Flex wrap control.
- `.fill`, `.filled > *`: Flex growth control.
- `.shrink`, `.noshrink`: Flex shrink control.
- `.fl-{0-6}`: Explicit flex values.
- `.top`, `.middle`, `.end`, `.centered`, `.stretch`: Alignment helpers. `.fill` sets `flex-grow: 1`.

### Using

```html
<div class="row g-2 middle">
    <div class="p-2 bg-neutral bg-to-ink bg-2b bg rd">Fixed</div>
    <div class="fill p-2 bg-neutral bg-to-ink bg-1b bg rd">Expands to fill</div>
</div>

<div class="centered">
    I am centered on both axes.
</div>

<section class="grid-items g-3" style="--item-min: 160px; --item-max: 500px">
  <article class="card">A responsive item</article>
  <article class="card">Another responsive item</article>
</section>
```

### API

### The `layout` module:

- The default export is a named module object consumed by the CSS renderer; it is not a runtime function.
- `rule(selector, properties)`: Internal helper used to define the utility rules.
- `vars.gap`, `vars.size`: Standardized scales used for class generation.

`.grid-items` uses CSS Grid's `auto-fit` behavior and does not require container queries. Set `--item-min` and optionally `--item-max` inline or in a custom rule. The maximum applies to direct children only, not to the grid tracks.
