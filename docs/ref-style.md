# Style Module Reference

The `style.js` module provides miscellaneous styling utilities for appearance, interaction, borders, shadows, and theming.

## Usage

```javascript
import style from "littlecss/css/style.js";
import { css } from "littlecss/js/littlecss.js";

for (const line of css(style)) {
    console.log(line);
}
```

## Style Resets

| Class | Description |
|-------|-------------|
| `.nolink` | Remove link styling |
| `.noresize` | Disable element resize |
| `.nolh` | Zero line height |
| `.nogap` | Zero gap |
| `.nostyle` | Reset all appearance properties |
| `.hover-nostyle` | Reset on hover |

```html
<a href="#" class="nolink">Link without underline</a>
<textarea class="noresize">Non-resizable textarea</textarea>
```

## Interaction

### Pointer Events

| Class | Description |
|-------|-------------|
| `.noev` | `pointer-events: none` |
| `.ev` | `pointer-events: auto` |

### Cursors

| Class | Cursor |
|-------|--------|
| `.move` | `move` |
| `.pointer` | `pointer` |
| `.help` | `help` |
| `.grab` | `grab` |
| `.grabbing` | `grabbing` |
| `.resize-w` | `ew-resize` |
| `.resize-h` | `ns-resize` |
| `.resize-lr` | `nesw-resize` |

```html
<div class="grab">Draggable element</div>
<button class="pointer">Clickable button</button>
<div class="noev">Click-through element</div>
```

## Font Weight (Short)

| Class | Weight |
|-------|--------|
| `.lll` | 100 |
| `.ll` | 200 |
| `.l` | 300 |
| `.b` | 600 |
| `.bb` | 700 |
| `.bbb` | 800 |

## Opacity

### Element Opacity

| Class | Opacity Level |
|-------|---------------|
| `.dim` | `var(--opacity-dim)` |
| `.dimmer` | `var(--opacity-dimmer)` |
| `.dimmest` | `var(--opacity-dimmest)` |

### Background with Opacity

| Class | Description |
|-------|-------------|
| `.bg-dim` | Background with dim opacity |
| `.bg-dimmer` | Background with dimmer opacity |
| `.bg-dimmest` | Background with dimmest opacity |

```html
<span class="dim">Slightly faded text</span>
<span class="dimmest">Very faded text</span>
```

## Visibility

| Class | Effect |
|-------|--------|
| `.skip` | `display: none !important` |
| `.invisible` | `opacity: 0 !important` |
| `.hidden` | `visibility: hidden !important` |

```html
<div class="skip">Completely hidden, no space</div>
<div class="invisible">Invisible but takes space</div>
<div class="hidden">Hidden but takes space</div>
```

## Border Radius

### Relative Rounding

| Class | Radius |
|-------|--------|
| `.rounded` | `0.25lh` |
| `.rounder` | `0.5lh` |
| `.roundest` | `1.5lh` |

### Token-Based Radius

```html
<div class="rd">Default radius from token</div>
```

### Pixel-Based Radius

| Class | Radius |
|-------|--------|
| `.rd-0` | `0px` |
| `.rd-1` | `1px` |
| `.rd-2` | `2px` |
| `.rd-3` | `3px` |
| ... | ... |
| `.rd-9` | `9px` |

### Corner-Specific Radius

| Class | Corner |
|-------|--------|
| `.rd-tl-{0-9}` | Top-left |
| `.rd-tr-{0-9}` | Top-right |
| `.rd-bl-{0-9}` | Bottom-left |
| `.rd-br-{0-9}` | Bottom-right |

```html
<div class="rd-tl-4 rd-tr-4">Rounded top corners only</div>
```

## Borders

### Default Border

```html
<div class="bd">Border using tokens</div>
```

### Border Width

| Class | Width |
|-------|-------|
| `.bd-0` | `0px` |
| `.bd-1` | `1px` |
| `.bd-2` | `2px` |
| ... | ... |
| `.bd-9` | `9px` |

### Side-Specific Border Width

| Class | Side |
|-------|------|
| `.bd-t-{0-9}` | Top |
| `.bd-b-{0-9}` | Bottom |
| `.bd-l-{0-9}` | Left |
| `.bd-r-{0-9}` | Right |

### Side-Only Borders

| Class | Border |
|-------|--------|
| `.bd-l` | Left border only |
| `.bd-t` | Top border only |
| `.bd-r` | Right border only |
| `.bd-b` | Bottom border only |

### Border Styles

| Class | Style |
|-------|-------|
| `.dashed` | Dashed border |
| `.dotted` | Dotted border |

```html
<div class="bd dashed">Dashed border</div>
<div class="bd-b-2">2px bottom border</div>
```

## Outlines

| Class | Width |
|-------|-------|
| `.ot-0` | `0px` |
| `.ot-1` | `1px` |
| `.ot-2` | `2px` |
| ... | ... |
| `.ot-9` | `9px` |

## Shadows

| Class | Shadow Level |
|-------|--------------|
| `.sh-0` | No shadow |
| `.sh-1` | Subtle shadow |
| `.sh-2` | Light shadow |
| `.sh-3` | Medium shadow |
| ... | ... |
| `.sh-9` | Heavy shadow |

```html
<div class="sh-2 p-m">Card with shadow</div>
```

## Tables

Basic table styling:

```html
<table>
    <thead>
        <tr><th>Header</th></tr>
    </thead>
    <tbody>
        <tr><td>Cell</td></tr>
    </tbody>
</table>
```

### Lined Table

```html
<table class="lined">
    <tr><td>Bordered</td><td>Cells</td></tr>
</table>
```

## Separators

Add visual separators between child elements:

| Class | Separator |
|-------|-----------|
| `.sep` | `/` |
| `.sep.dash` | `-` |
| `.sep.comma` | `,` |

```html
<div class="sep">
    <span>One</span>
    <span>Two</span>
    <span>Three</span>
</div>
<!-- Output: One / Two / Three -->
```

## Striped

Add zebra striping to alternating children:

```html
<ul class="striped">
    <li>Row 1 (normal)</li>
    <li>Row 2 (striped background)</li>
    <li>Row 3 (normal)</li>
    <li>Row 4 (striped background)</li>
</ul>
```

## 3D Depth Effects

| Class | Effect |
|-------|--------|
| `.inset` | Pressed/inset appearance |
| `.raised` | Elevated/raised appearance |

```html
<button class="raised">Raised button</button>
<div class="inset p-m">Inset container</div>
```

## Theme Modes

### Mode Classes

| Class | Description |
|-------|-------------|
| `.m-dark` | Dark mode (swaps page/text colors) |
| `.m-light` | Light mode |

### Text Color Variants

| Class | Description |
|-------|-------------|
| `.t-dark` | Dark text color |
| `.t-light` | Light text color |

```html
<div class="m-dark p-l">
    Dark mode container
</div>

<span class="t-light">Light colored text</span>
```

## Usage Examples

### Card Component

```html
<div class="bd rd-4 sh-2 p-m">
    <h3>Card Title</h3>
    <p class="dim">Card description</p>
</div>
```

### Interactive Button

```html
<button class="pointer raised rd-2 p-m">
    Click me
</button>
```

### Data Table

```html
<table class="lined striped">
    <thead>
        <tr>
            <th>Name</th>
            <th>Value</th>
        </tr>
    </thead>
    <tbody>
        <tr><td>Item 1</td><td>100</td></tr>
        <tr><td>Item 2</td><td>200</td></tr>
    </tbody>
</table>
```

### Dark Mode Section

```html
<section class="m-dark p-l">
    <h2 class="t-light">Dark Section</h2>
    <p>Content with inverted colors</p>
</section>
```

### Disabled State

```html
<div class="noev dim">
    Disabled-looking element
</div>
```
