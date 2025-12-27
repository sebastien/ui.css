# Layout Module Reference

The `layout.js` module provides utility classes for layout, positioning, sizing, and flexbox/grid systems.

## Usage

```javascript
import layout from "littlecss/css/layout.js";
import { css } from "littlecss/js/littlecss.js";

for (const line of css(layout)) {
    console.log(line);
}
```

## Alignment

### `.centered`

Centers content using flexbox:

```html
<div class="centered">
    <span>Centered content</span>
</div>
```

## Box Sizing

| Class | Property |
|-------|----------|
| `.bbox` | `box-sizing: border-box` |
| `.cbox` | `box-sizing: content-box` |

## Display

| Class | Display Value |
|-------|---------------|
| `.il` | `inline` |
| `.ibl` | `inline-block` |
| `.bl` | `display: block` |
| `.fl` | `flex` |
| `.ifl` | `inline-flex` |

## Position

### Basic Positioning

| Class | Position Value |
|-------|----------------|
| `.sticky` | `sticky` (with `top: 0`) |
| `.rel` | `relative` |
| `.abs` | `absolute` |
| `.fix` | `fixed` |

### Cover

```html
<div class="rel">
    <div class="cover">
        <!-- Absolutely positioned, fills parent -->
    </div>
</div>
```

### Position Anchors

| Class | Position |
|-------|----------|
| `.to-tl` | Top-left corner |
| `.to-tr` | Top-right corner |
| `.to-bl` | Bottom-left corner |
| `.to-br` | Bottom-right corner |
| `.to-l` | Left edge, vertically centered |
| `.to-r` | Right edge, vertically centered |
| `.to-t` | Top edge, horizontally centered |
| `.to-b` | Bottom edge, horizontally centered |
| `.to-hc` | Horizontally centered |
| `.to-s` | South (bottom center) |
| `.to-n` | North (top center) |
| `.to-e` | East (right center) |
| `.to-w` | West (left center) |

## Margin

### Auto Margin

```html
<div class="ma">Horizontally centered block</div>
```

### Sized Margins

Using size tokens (xxs, xs, s, m, l, xl, xxl):

| Class | Description |
|-------|-------------|
| `.m-{size}` | Margin all sides |
| `.mt-{size}` | Margin top |
| `.mb-{size}` | Margin bottom |
| `.ml-{size}` | Margin left |
| `.mr-{size}` | Margin right |

Using numeric values (0-6):

| Class | Description |
|-------|-------------|
| `.m-{0-6}` | Margin all sides |

```html
<div class="m-m">Medium margin all around</div>
<div class="mt-l mb-s">Large top, small bottom</div>
<div class="m-3">Margin using size-3 token</div>
```

## Padding

### Sized Padding

| Class | Description |
|-------|-------------|
| `.p-{size}` | Padding all sides |
| `.pt-{size}` | Padding top |
| `.pb-{size}` | Padding bottom |
| `.pl-{size}` | Padding left |
| `.pr-{size}` | Padding right |

Numeric values (0-6):

| Class | Description |
|-------|-------------|
| `.p-{0-6}` | Padding all sides |

```html
<div class="p-l">Large padding</div>
<div class="pt-m pb-m">Vertical medium padding</div>
```

## Gap

| Class | Description |
|-------|-------------|
| `.g-{size}` | Gap using size tokens |
| `.g-{0-6}` | Gap using numeric scale |

```html
<div class="fl g-m">
    <div>Item 1</div>
    <div>Item 2</div>
</div>
```

## Expand

| Class | Description |
|-------|-------------|
| `.expand` | Absolute position, fills parent |
| `.expand-w` | Expands horizontally only |
| `.expand-h` | Expands vertically only |

## Container

The `.container` class makes direct children fill the available space:

```html
<div class="container">
    <div>This fills the container</div>
</div>
```

## Fit (Dimensions)

### Full Dimensions

| Class | Description |
|-------|-------------|
| `.fit` | Width and height 100% |
| `.fit-w` | Width 100% |
| `.fit-h` | Height 100% |
| `.fit-screen` | 100vw x 100vh |

### Content-Based

| Class | Description |
|-------|-------------|
| `.fit-min` | `width: min-content` |
| `.fit-max` | `width: max-content` |

### Limited Widths

| Class | Uses Token |
|-------|------------|
| `.fit-page` | `--limit-page` |
| `.fit-text` | `--limit-text` |
| `.fit-content` | `--limit-content` |

## Fill Screen

```html
<div class="fill-screen">
    <!-- Minimum viewport height -->
</div>
```

## Width Limits

| Class | Max Width |
|-------|-----------|
| `.limit-text` | `var(--limit-text)` |
| `.limit-content` | `var(--limit-content)` |
| `.limit-page` | `var(--limit-page)` |

## Sizing

### Token-Based Sizes

| Class | Uses |
|-------|------|
| `.w-{size}` | `--size-{index}` |
| `.h-{size}` | `--size-{index}` |

### Viewport Units

| Class | Value |
|-------|-------|
| `.w-screen` | `100vw` |
| `.h-screen` | `100vh` |

### Character Width

| Class | Width |
|-------|-------|
| `.w-1ch` - `.w-10ch` | Character-based width |

### Column Width

| Class | Width |
|-------|-------|
| `.w-1cl` - `.w-10cl` | Column-based width |

### Block-Based

| Class | Description |
|-------|-------------|
| `.w-{1-10}bl` | Width in block units |
| `.h-{1-10}bl` | Height in block units |

### Percentage

Available percentages: 5, 10, 15, 20, 25, 33, 50, 66, 75, 80, 90, 100

| Class | Description |
|-------|-------------|
| `.w-{n}p` | Width percentage |
| `.h-{n}p` | Height percentage |

```html
<div class="w-50p">Half width</div>
<div class="w-33p">One third width</div>
```

### Auto Sizing

| Class | Description |
|-------|-------------|
| `.no-h` | Height auto, min/max unset |
| `.no-w` | Width auto, min/max unset |

## Shapes

| Class | Description |
|-------|-------------|
| `.square` | `aspect-ratio: 1` |
| `.circle` | Square + 50% border-radius |

## Flexbox: Row

```html
<div class="row">
    <div>Item 1</div>
    <div>Item 2</div>
</div>
```

### Row Modifiers

| Modifier | Description |
|----------|-------------|
| `.row.stretch` | Items stretch to fill |
| `.row.end` | Items align to end |
| `.row.lined` | Border between items |

## Flexbox: Stack

Vertical flex column:

```html
<div class="stack">
    <div>Top</div>
    <div>Bottom</div>
</div>
```

### Stack Modifiers

| Modifier | Description |
|----------|-------------|
| `.stack > .right` | Align child to end |
| `.stack.lined` | Border between items |

## Flex Utilities

| Class | Description |
|-------|-------------|
| `.fill` | `flex-grow: 1` |
| `.shrink` | `flex-shrink: 1` |
| `.stretch` | `align-items: stretch` |
| `.wrap` | `flex-wrap: wrap` |
| `.top` | `align-items: flex-start` |

## Grid

Column-based grid layouts:

| Class | Columns |
|-------|---------|
| `.col-1` | 1 column |
| `.col-2` | 2 columns |
| `.col-3` | 3 columns |
| `.col-4` | 4 columns |
| `.col-5` | 5 columns |
| `.col-6` | 6 columns |
| `.col-7` | 7 columns |

```html
<div class="col-3 g-m">
    <div>1</div>
    <div>2</div>
    <div>3</div>
</div>
```

## Overflow

| Class | Description |
|-------|-------------|
| `.overflow` | `overflow: auto` with thin scrollbar |
| `.nooverflow` | `overflow: hidden` |
| `.noflow` | `overflow: hidden` |

## Usage Examples

### Centered Card Layout

```html
<div class="centered fit-screen">
    <div class="stack g-m p-l limit-content">
        <h1>Title</h1>
        <p>Content</p>
    </div>
</div>
```

### Responsive Grid

```html
<div class="col-3 g-m p-m">
    <div class="p-m">Card 1</div>
    <div class="p-m">Card 2</div>
    <div class="p-m">Card 3</div>
</div>
```

### Header with Actions

```html
<div class="row g-m">
    <h1 class="fill">Page Title</h1>
    <button>Action 1</button>
    <button>Action 2</button>
</div>
```

### Sticky Sidebar

```html
<div class="row">
    <aside class="sticky w-25p">
        Sidebar content
    </aside>
    <main class="fill">
        Main content
    </main>
</div>
```
