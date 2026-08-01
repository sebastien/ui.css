# UIcss Quick Reference

## Mental model

Compose interfaces in layers. Before writing custom CSS, reach for these classes:

1. **Structure** with `layout` — `.row`, `.stack`, `.grid`, `.fill`, `.g-*`
2. **Surface & contrast** with `colors` — `.bg`, `.tx`, `.bd` + modifiers
3. **Interactive primitives** — `button`, `input`, `.card`, `.pill`, `.selector`
4. **Spacing & finish** — `.p-*`, `.m-*`, `.rd`, `.sh-*`, `.raised`

## Layout quick reference

### Primary containers

| Class | What it does |
|-------|-------------|
| `.row` | Horizontal flex, `align-items: center`, applies `gap` |
| `.stack` | Vertical flex, applies `gap` |
| `.grid` | CSS grid, applies `gap` |
| `.col-{1-8}` | `grid-template-columns: repeat(n, 1fr)` + grid + gap |
| `.centered` | Flex, both axes centered |

### Flex alignment

| Class | Effect on `.row` / `.stack` |
|-------|----------------------------|
| `.top` | `align-items: flex-start` |
| `.middle` | `align-items: center` (default on `.row`) |
| `.end` | `justify-content: flex-end` |
| `.stretch` | `align-items: stretch` |
| `.wrap` | `flex-wrap: wrap` |

### Flex children

| Class | What it does |
|-------|-------------|
| `.fill` | `flex-grow: 1` |
| `.shrink` | `flex-shrink: 1` |
| `.noshrink` | `flex-shrink: 0` |
| `.filled > *` | All direct children grow |

### Grid children

| Class | What it does |
|-------|-------------|
| `.span-{1-8}` | `grid-column: span n` |

### Gap scale

| Class | Value |
|-------|-------|
| `.g-0` | 0 |
| `.g-1` – `.g-10` | Increasing gap token values |

### Positioning

| Class | CSS |
|-------|-----|
| `.rel` | `position: relative` |
| `.abs` | `position: absolute` |
| `.fix` | `position: fixed` |
| `.sticky` | `position: sticky` |
| `.cover` | Absolute, all 4 sides at 0 (fills parent) |

### Pinning (on positioned elements)

| Class | Pins to |
|-------|---------|
| `.to-tl` | Top-left corner |
| `.to-br` | Bottom-right corner |
| `.to-t` / `.to-b` / `.to-l` / `.to-r` | Edge |

### Sizing shortcuts

| Class | What it does |
|-------|-------------|
| `.fit-w` | `width: 100%; max-width: 100%` |
| `.fit-h` | `height: 100%` |
| `.fit` | Both width and height 100% |
| `.fill-w` | `min-width: 100%` |
| `.fill-h` | `min-height: 100%` |
| `.fit-text` | `max-width: 80ch` |
| `.fit-content` | `max-width: fit-content` |
| `.fit-page` | `max-width: 1080px` |
| `.limit-text` | `max-width: 80ch` |
| `.limit-page` | `max-width: 1080px` |
| `.w-{0-10}`, `.h-{0-10}` | Width/height from size tokens |
| `.w-{5,10,...,100}p` | Percentage width |
| `.w-{1-5}bl` | Block-based widths (120px * n) |

### Overflow

| Class | What it does |
|-------|-------------|
| `.overflow` | `overflow: auto` with thin scrollbar |
| `.overflow-x` / `.overflow-y` | Directional overflow |
| `.noflow` / `.nooverflow` | `overflow: clip` |

## Color quick reference

### Apply classes (emit the actual CSS property)

| Class | Applies |
|-------|---------|
| `.bg` | `background-color` |
| `.tx` | `color` |
| `.bd` | `border-color` + border width + border style |
| `.ol` | `outline-color` + outline width |

Using `.bg` and `.tx` together on the same element uses `contrast-color()` for automatically readable text when the browser supports it.

### Base colors

Add a color name to set the source: `.{prop}-{color}`

```
.bg-primary    .tx-primary    .bd-primary    .ol-primary
.bg-secondary  .tx-secondary  .bd-secondary  .ol-secondary
.bg-success    .tx-success    .bd-success    .ol-success
.bg-warning    .tx-warning    .bd-warning    .ol-warning
.bg-danger     .tx-danger     .bd-danger     .ol-danger
.bg-info       .tx-info       .bd-info       .ol-info
.bg-neutral    .tx-neutral    .bd-neutral    .ol-neutral
.bg-paper      .tx-paper      .bd-paper      .ol-paper
.bg-ink        .tx-ink        .bd-ink        .ol-ink
.bg-accent     .tx-accent     .bd-accent     .ol-accent
```

Full palette also includes: `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose`, `slate`, `gray`, `zinc`, `stone`, `taupe`, `mauve`, `mist`, `olive`, `white`, `black`.

### Blend modifiers

Blend between the base color and a tint target.

| Class format | Meaning |
|-------------|---------|
| `.bg-to-{color}` | Set the tint color to blend toward |
| `.bg-to-paper` | Blend toward paper (light surface) |
| `.bg-to-ink` | Blend toward ink (dark surface) |
| `.bg-to-white` | Blend toward pure white |
| `.bg-to-black` | Blend toward pure black |
| `.bg-{0-9}b` | Blend ratio: 0 = 100% tint, 9 = 90% base |
| `.bgb` (unnumbered) | 100% base (no blend) |
| `.to-{color}` | Sets tint on ALL color channels at once |

### Opacity modifiers

| Class | Opacity | Class | Opacity |
|-------|---------|-------|---------|
| `.bg-0o` | 0.0 | `.bg-5o` | 0.5 |
| `.bg-1o` | 0.1 | `.bg-6o` | 0.6 |
| `.bg-2o` | 0.2 | `.bg-7o` | 0.7 |
| `.bg-3o` | 0.3 | `.bg-8o` | 0.8 |
| `.bg-4o` | 0.4 | `.bg-9o` | 0.9 |

Unnumbered `.{prop}o` = full opacity (1.0).

### Color recipes

```html
<!-- Filled surface with automatic readable text -->
<div class="bg bg-primary bg-to-paper bg-2b tx p-2">...</div>

<!-- Soft panel border -->
<div class="bd bd-neutral bd-to-paper bd-6b">...</div>

<!-- Muted surface at low opacity -->
<div class="bg bg-neutral bg-to-paper bg-2b bg-6o p-2">...</div>

<!-- Emphasis text -->
<span class="tx tx-primary tx-to-ink tx-7b">...</span>
```

### Reset classes

| Class | Resets |
|-------|--------|
| `.nobg` | `background-color: transparent` |
| `.notx` | `color: inherit` |
| `.nobd` | `border-color: transparent` |
| `.nool` | `outline-color: transparent; outline-width: 0` |

### Dark / Light mode

| Class | Effect |
|-------|--------|
| `.light` | Force light mode (swaps paper/ink to light endpoints) |
| `.dark` | Force dark mode (swaps paper/ink to dark endpoints) |

### Fade backgrounds

| Class | Gradient direction |
|-------|-------------------|
| `.bg-fade-t` | Toward top |
| `.bg-fade-b` | Toward bottom |
| `.bg-fade-l` | Toward left |
| `.bg-fade-r` | Toward right |

## Controls quick reference

### Buttons

```html
<button>Default</button>
<button class="primary">Primary</button>
<button class="secondary">Secondary</button>
<button class="success">Success</button>
<button class="warning">Warning</button>
<button class="danger">Danger</button>
<button class="neutral">Neutral</button>
```

### Button variants

| Class | Style |
|-------|-------|
| (none) | Filled, neutral |
| `.primary`, `.secondary`, etc. | Filled, semantic color |
| `.outline` | Transparent fill, visible border |
| `.ghost` | No fill, no border, subtle hover |
| `.blank` | No visual chrome |
| `.icon` | 1:1 aspect ratio, compact |
| `.compact` | Reduced padding |
| `.default` | Emphasized style |
| `.bw` | Black & white mode |

### Button composition

```html
<!-- Primary action -->
<button class="primary">Save</button>

<!-- Secondary outline -->
<button class="outline neutral">Cancel</button>

<!-- Destructive -->
<button class="danger">Delete</button>

<!-- Ghost icon button -->
<button class="ghost icon">…</button>

<!-- Disabled -->
<button class="primary" disabled>Disabled</button>
```

### Input fields

```html
<input class="input" type="text" placeholder="Default field">
<input class="input outline" type="text" placeholder="Outline field">
<input class="input ghost" type="text" placeholder="Ghost field">
<input class="input tinted" type="text" placeholder="Tinted field">
<input class="input compact" type="text" placeholder="Compact field">
```

### Field variants

| Class | Style |
|-------|-------|
| (none) | Paper background, accent border |
| `.outline` | Transparent background, visible border |
| `.ghost` | Transparent, subtle accent on focus |
| `.blank` | No chrome |
| `.tinted` | Accent background at low opacity |
| `.colored` | Accent text + accent border |
| `.compact` | Reduced padding |

### Checkbox, Radio, Toggle

```html
<label><input type="checkbox"> Checkbox</label>
<label><input type="radio" name="opt"> Radio</label>
<label><input type="checkbox" class="toggle"> Toggle</label>
<label><input type="checkbox" class="toggle rounded"> Rounded toggle</label>
```

### Select

```html
<select class="select">
    <option>Option</option>
</select>

<select class="select vertical" multiple size="4">
    <option>Option 1</option>
    <option>Option 2</option>
</select>
```

### Selector (segmented control)

```html
<div class="selector stretch">
    <input id="day" type="radio" name="range" checked>
    <label for="day">Day</label>
    <input id="week" type="radio" name="range">
    <label for="week">Week</label>
    <input id="month" type="radio" name="range">
    <label for="month">Month</label>
</div>
```

### Range

```html
<input type="range" class="range">
```

### Form helper

```html
<label class="field">
    <span>Label</span>
    <input class="input fit-w" placeholder="...">
    <small class="hint">Hint text</small>
</label>
```

### Tabs

```html
<div class="tabs">
    <button class="tab active">Tab 1</button>
    <button class="tab">Tab 2</button>
    <button class="tab" disabled>Tab 3</button>
</div>
```

### Selectable rows

```html
<div class="selectable p-2">Clickable row</div>
<div class="selectable p-2 selected">Selected row</div>
<div class="selectable p-2 disabled">Disabled row</div>
```

## Components quick reference

### Badge / Pill

```html
<span class="pill">Default</span>
<span class="pill primary">Primary</span>
<span class="pill success">Success</span>
<span class="pill danger">Danger</span>
<span class="pill outline neutral">Outline</span>
<span class="pill tinted warning">Tinted</span>
<span class="pill compact">Compact</span>
<span class="pill dot"><span>With dot</span></span>
```

### Card / Panel

```html
<article class="card stack g-2">
    <h3>Card title</h3>
    <p>Card content</p>
</article>
```

### Alert

```html
<div class="alert success">Success message</div>
<div class="alert warning">Warning message</div>
<div class="alert danger">Error message</div>
<div class="alert info ghost">Ghost info</div>
```

### Avatar

```html
<figure class="avatar">
    <abbr title="John Doe">JD</abbr>
</figure>

<figure class="avatar small">
    <img src="..." alt="">
</figure>

<div class="avatars">
    <figure class="avatar"><abbr>JD</abbr></figure>
    <figure class="avatar"><abbr>AB</abbr></figure>
</div>
```

### Breadcrumbs

```html
<nav>
    <ol class="breadcrumbs">
        <li><a href="/">Home</a></li>
        <li><a href="/products">Products</a></li>
        <li>Current page</li>
    </ol>
</nav>
```

### Disclosure

```html
<!-- Accordion section -->
<details class="section">
    <summary>Section title</summary>
    <p>Section content</p>
</details>

<!-- Tree navigation -->
<details class="tree" open>
    <summary>Parent</summary>
    <details class="tree">
        <summary>Child</summary>
        <p>Content</p>
    </details>
</details>
```

### Dialog

```html
<dialog>
    <header>Dialog title</header>
    <p>Content</p>
    <footer class="row end g-2">
        <button class="outline">Cancel</button>
        <button class="primary">Confirm</button>
    </footer>
</dialog>
```

### Pagination

```html
<nav class="pagination">
    <span><a href="/prev">Prev</a></span>
    <span><a href="/1">1</a></span>
    <span><a href="/2" aria-current="page" class="active">2</a></span>
    <span><a href="/next">Next</a></span>
</nav>
```

### Progress / Meter

```html
<progress value="60" max="100"></progress>
<progress class="tinted primary" value="60" max="100"></progress>
```

### Skeleton loading

```html
<div class="skeleton line"></div>
<div class="skeleton box"></div>
```

### Status indicator

```html
<span class="status success">Online</span>
<span class="status danger">Offline</span>
```

### Tags

```html
<div class="tags">
    <span class="tag">Tag 1 <button>×</button></span>
    <span class="tag primary">Tag 2 <button>×</button></span>
    <input type="text" placeholder="Add tag...">
</div>
```

### Panels (sliding views)

```html
<div class="panels" data-panels="3" data-panel="0">
    <div class="horizontal">
        <div>Panel 1</div>
        <div>Panel 2</div>
        <div>Panel 3</div>
    </div>
</div>
```

## Spacing quick reference

### Padding

| Class | All sides | Top | Bottom | Left | Right | Horizontal | Vertical |
|-------|-----------|-----|--------|------|-------|------------|----------|
| n=0..8 | `.p-{n}` | `.pt-{n}` | `.pb-{n}` | `.pl-{n}` | `.pr-{n}` | `.pw-{n}` | `.ph-{n}` |

Reset: `.nop` / `.no-p` (all), `.noph` (horizontal), `.nopv` (vertical).

### Margin

| Class | All sides | Top | Bottom | Left | Right | Horizontal | Vertical |
|-------|-----------|-----|--------|------|-------|------------|----------|
| n=0..8 | `.m-{n}` | `.mt-{n}` | `.mb-{n}` | `.ml-{n}` | `.mr-{n}` | `.mw-{n}` | `.mh-{n}` |

Reset: `.nom` / `.no-m` (all), `.nomh` (horizontal), `.nomv` (vertical). Auto: `.ma`.

## Borders & rounding

### Rounding

| Class | Radius |
|-------|--------|
| `.rd` | Default token border radius |
| `.rd-{0-4}` | Explicit pixel radius |
| `.rounded` | `--border-radius: 0.25lh` |
| `.rounder` | `--border-radius: 0.5lh` |
| `.roundest` | `--border-radius: 1.5lh` |
| `.squared` / `.nord` | `border-radius: 0` |
| `.nord-t` / `.nord-b` / `.nord-l` / `.nord-r` | Zero radius on that side |
| `.nord-tl` / `.nord-tr` / `.nord-bl` / `.nord-br` | Zero radius on that corner |

### Border style

| Class | Style |
|-------|-------|
| `.dashed` | `border-style: dashed` |
| `.dotted` | `border-style: dotted` |

### Border width (pixels)

| Class | Width |
|-------|-------|
| `.bdw-{0-4}` | Explicit border width tokens |

### Shadows & depth

| Class | Effect |
|-------|--------|
| `.sh-{0-4}` | Box shadow, scale 0 (none) to 4 (deepest) |
| `.raised` | Elevated 3D look |
| `.inset` | Pressed/sunken 3D look |
| `.outset` | Elevated 3D look; `.raised` remains an alias |
| `.d`, `.d-{0-4}` | Visual depth scale, `0px` to `1px`; default `0.25px` |
| `.t-inset`, `.t-outset` | Inset/outset text-shadow effects |
| `.noblur` | `--shadow-spread: 0` |

### Z-index

| Class | Value |
|-------|-------|
| `.z-{0-10}` | z-index from 0 to 100 (step of 10) |

## Text quick reference

### Headings

| Class | Equivalent |
|-------|-----------|
| `.h1` – `.h7` | Heading appearance without `<hN>` semantics |
| `.noheading` | Reset heading to flat 1rem |

### Font weight

| Class | Weight | | Class | Weight |
|-------|--------|-|-------|--------|
| `.ltr` / `.thinner` | 100 | | `.r` / `.regular` | 400 |
| `.lt` / `.thin` | 200 | | `.sb` / `.medium` | 500 |
| `.b` / `.bold` | 600 | | `.br` / `.bolder` / `.bbb` | 700 |
| `.bst` / `.boldest` | 800 | | | |

### Font family

| Class | Font |
|-------|------|
| `.mono` | Monospace |
| `.sans` | Sans-serif |
| `.serif` | Serif |
| `.script` | Cursive / script |
| `.display` | Display font |
| `.code` | Code font |

### Text decoration & transform

| Class | Effect |
|-------|--------|
| `.unl` / `.u` | Underline |
| `.ovl` / `.o` | Overline |
| `.stk` / `.striked` / `.s` | Line-through |
| `.em` / `.italic` / `.i` | Italic |
| `.caps` / `.upper` | Uppercase |
| `.lower` | Lowercase |
| `.cap` | Capitalize |

### Text alignment

| Class | Effect |
|-------|--------|
| `.t-left` / `.left` | `text-align: start` |
| `.t-right` / `.right` | `text-align: end` |
| `.t-center` / `.center` | `text-align: center` |
| `.t-justify` / `.justify` | `text-align: justify` |

### Whitespace

| Class | Effect |
|-------|--------|
| `.nowrap` / `.nobreak` | `white-space: nowrap` |
| `.pre` | `white-space: pre` |
| `.pre-lines` | `white-space: pre-line` |
| `.break` | `overflow-wrap: break-word` |
| `.ellipsis` | `text-overflow: ellipsis; overflow: clip` |

### Letter spacing

| Class | Effect |
|-------|--------|
| `.tight` | `-0.05ch` |
| `.tighter` | `-0.10ch` |
| `.tightest` | `-0.15ch` |

### Line height

| Class | Value |
|-------|-------|
| `.lh-0` / `.lh-1` / `.lh-100` | 1.0 |
| `.lh-125` | 1.25 |
| `.lh-150` | 1.5 |
| `.lh-175` | 1.75 |
| `.lh-200` | 2.0 |

### Prose container (`.t`)

The `.t` class auto-styles child elements as prose: paragraphs get margins, headings get sizing, lists get indentation, blockquotes get a left border, code gets monospace background.

```html
<article class="t">
    <h1>Title</h1>
    <p>Paragraph text.</p>
    <blockquote>A quote.</blockquote>
    <pre><code>code block</code></pre>
</article>
```

## Visual finish

### Opacity

| Class | Opacity |
|-------|---------|
| `.dim` | 0.5 |
| `.dimmer` | 0.35 |
| `.dimmest` | 0.15 |
| `.bg-dim` | Background opacity 0.6 |
| `.bg-dimmer` | Background opacity 0.4 |
| `.bg-dimmest` | Background opacity 0.2 |

### Visibility

| Class | Effect |
|-------|--------|
| `.skip` / `.SKIP` | `display: none !important` |
| `.invisible` | `opacity: 0 !important` |
| `.hidden` | `visibility: hidden !important` |

### Cursors

| Class | Cursor |
|-------|--------|
| `.pointer` | `pointer` |
| `.action` | `pointer` + `user-select: none` |
| `.move` | `move` |
| `.grab` | `grab` |
| `.help` | `help` |
| `.noev` | `pointer-events: none` |

### Reset all styles

```html
<div class="nostyle">Removes all padding, margin, border, background, outline</div>
```

## Common patterns

### Toolbar

```html
<div class="row middle g-2 p-2 bg bg-paper tx bd bd-neutral bd-to-paper bd-6b">
    <div class="fill b">Project</div>
    <button class="ghost">Cancel</button>
    <button class="primary">Save</button>
</div>
```

### Card grid

```html
<section class="grid col-3 g-3 limit-page">
    <article class="card stack g-2 sh-1">
        <div class="row middle g-2">
            <span class="pill compact success">Active</span>
            <span class="fill b">Title</span>
            <button class="ghost icon">…</button>
        </div>
        <p class="tx tx-neutral tx-to-ink tx-7b">Description</p>
        <div class="row end g-2">
            <button class="outline neutral">Details</button>
            <button class="primary">Open</button>
        </div>
    </article>
</section>
```

### Two-column form

```html
<div class="grid col-2 g-4">
    <label class="field">
        <span>First name</span>
        <input class="input fit-w">
    </label>
    <label class="field">
        <span>Last name</span>
        <input class="input fit-w">
    </label>
</div>
```

### Expanding content with fixed sidebar

```html
<div class="row top">
    <main class="fill stack g-3">Content</main>
    <aside class="noshrink w-3bl stack g-2">Sidebar</aside>
</div>
```

### Overlay on card

```html
<div class="rel">
    <div class="card">Content</div>
    <div class="cover bg bg-ink bg-5o centered">
        <button class="primary">Overlay action</button>
    </div>
</div>
```

### Button group

```html
<div class="buttons">
    <button class="button primary">Save</button>
    <button class="button">Cancel</button>
</div>
```

### Inline separators

```html
<span class="sep">
    <a href="/">Home</a>
    <a href="/docs">Docs</a>
    <span>Current</span>
</span>

<span class="sep dash"><span>alpha</span><span>beta</span></span>
<span class="sep comma"><span>one</span><span>two</span></span>
```

## Animation quick reference

### Entrance / exit

| Class | Effect |
|-------|--------|
| `.fade-in` / `.fade-out` | Fade |
| `.fade-up` / `.fade-down` | Fade + vertical slide |
| `.scale-in` / `.scale-out` | Scale |
| `.slide-in-left` / `.slide-in-right` | Horizontal slide in |
| `.slide-out-left` / `.slide-out-right` | Horizontal slide out |

### Interaction

| Class | Effect |
|-------|--------|
| `.lift` | Translate up + shadow on hover |
| `.press` | Scale down on active |
| `.flip` | 3D card flip |
| `.shake` | Horizontal shake |
| `.highlight` | Temporary background highlight |
| `.pop` | Scale bounce |

### Loading

| Class | Effect |
|-------|--------|
| `.pulse` | Opacity pulse |
| `.shimmer` | Shimmer sweep |
| `.spinner` | Rotating border spinner |
| `.progress-indeterminate` | Sliding progress bar |

### Stagger children

```html
<div class="stagger">
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
</div>
```

### Animation timing overrides

| Class | Effect |
|-------|--------|
| `.anim-fast` | Fast duration |
| `.anim-slow` | Slow duration |
| `.anim-soft` | Soft easing |
| `.anim-in` | Ease-in |
| `.anim-out` | Ease-out |
| `.delay-{1-4}` | Staggered delays (40ms, 80ms, 120ms, 160ms) |

## Behavior quick reference

### Hover reveal

| Parent | Child | Effect |
|--------|-------|--------|
| `.hovered` | `.hover-reveal` | Child hidden, shown on parent hover |
| `.hovered` | `.hover-show` | Child shown on parent hover |
| `.hovered` | `.hover-hide` | Child hidden on parent hover |
| `.hovered` | `.hover-undim` | Child full opacity on parent hover |
| `.hovered` | `.hover-dx` | Child slides right on parent hover |

### Focus reveal

| Parent | Child | Effect |
|--------|-------|--------|
| `.focused` | `.focus-show` | Child shown on parent focus |

### Details open state

| Class | Effect |
|-------|--------|
| `.open-show` / `.when-open` | Visible only when details is open |
| `.open-hide` | Hidden when details is open |
| `.open-rotate` | Rotates based on open state |
