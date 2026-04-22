# Layout Module (`layout.js`)

## Flexbox, grid, and dimensional utilities

The `layout.js` module provides a comprehensive suite of utilities for controlling element display, positioning, alignment, and spacing using the project's standard 0-10 scales.

### Alignment and Display:

- `.centered`: Flex container with center alignment and justification.
- `.bbox`, `.cbox`: Sets `box-sizing` to `border-box` or `content-box`.
- `.bl`, `.il`, `.ibl`: Block, inline, and inline-block display.
- `.fl`, `.ifl`: Flex and inline-flex display.
- `.grid`, `.igrid`: Grid and inline-grid display.

### Positioning:

- `.rel`, `.abs`, `.fix`, `.sticky`: Position modes.
- `.cover`: Absolute positioning covering the entire parent (`0px` on all sides).
- `.to-tl`, `.to-tr`, `.to-bl`, `.to-br`: Pin to corners.
- `.to-t`, `.to-b`, `.to-l`, `.to-r`: Pin to sides.
- `.to-hc`, `.to-vc`, `.to-c`: Horizontal, vertical, or full centering using `50%` and `translate`.

### Spacing and Sizing (0-10):

- `.p-{0-10}`, `.pt-`, `.pb-`, `.pl-`, `.pr-`: Padding (all sides or specific).
- `.m-{0-10}`, `.mt-`, `.mb-`, `.ml-`, `.mr-`: Margin (all sides or specific).
- `.g-{0-10}`, `.gx-`, `.gy-`: Grid/Flex gap (all, horizontal, or vertical).
- `.w-{0-10}`, `.h-{0-10}`: Width and height scale.
- `.miw-{0-10}`, `.mih-`, `.maw-`, `.mah-`: Min/max width and height.

### Flex and Grid:

- `.row`, `.stack`: Flex-direction row and column.
- `.wrap`, `.nowrap`: Flex wrap control.
- `.grow`, `.nogrow`: Flex grow control.
- `.shrink`, `.noshrink`: Flex shrink control.
- `.fill`: Sets `flex: 1 1 0%` and `min-width: 0px`.
- `.start`, `.end`, `.center`, `.between`, `.around`, `.stretch`: Content justification and alignment helpers.

### Using

```html
<div class="row g-m items-center">
    <div class="p-s bg-neutral-8 rd">Fixed</div>
    <div class="fill p-s bg-neutral-9 rd">Expands to fill</div>
</div>

<div class="abs to-c">
    I am perfectly centered.
</div>
```

### API

### The `layout` module:

- `layout()`: Generates the layout utility classes.
- `rule(selector, properties)`: Internal helper used to define the utility rules.
- `vars.pad`, `vars.margin`, `vars.gap`, `vars.size`: Standardized scales (0-10) used for class generation.
