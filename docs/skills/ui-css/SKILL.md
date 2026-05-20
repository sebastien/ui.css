---
name: ui-css
description: use ui.css utility and component classes with emphasis on layout, color composition, and component styling
---

# About the skill

- Use this skill when you need to build or edit HTML that should rely on `ui.css` classes instead of bespoke CSS
- Prefer composing existing utilities and component classes before adding new selectors
- Focus first on three layers: layout, color, and components; then add text or style utilities only where needed

# Working model

`ui.css` is organized as composable layers:

- `tokens`: design variables for spacing, radii, colors, motion, sizing
- `layout`: structure, positioning, flex, grid, sizing, overflow
- `colors`: background, text, border, and outline color composition
- `controls` and `components`: ready-made interactive and content primitives
- `style` and `text`: spacing, depth, rounding, typography, visibility

When authoring markup, prefer this order of thought:

1. Choose structure with `layout`
2. Apply surface and contrast with `colors`
3. Pick a control or component primitive
4. Add spacing, rounding, and depth from `style`

# Layout guidance

Start with the smallest structural primitive that matches the UI:

- Use `.row` for horizontal flex layout
- Use `.stack` for vertical layout
- Use `.grid` for equal-column grid layout
- Use `.centered` when both axes should center content

Common layout classes:

- Flow and alignment: `.row`, `.stack`, `.wrap`, `.stretch`, `.top`, `.middle`, `.end`, `.fill`, `.filled`
- Gap scale: `.g-0` through `.g-9`
- Grid columns: `.col-1` through `.col-7`
- Grid span: `.span-1` through `.span-5`
- Positioning: `.rel`, `.abs`, `.fix`, `.sticky`, `.cover`, `.to-t`, `.to-r`, `.to-b`, `.to-l`, `.to-tl`, `.to-br`
- Fill and fit: `.fit`, `.fit-w`, `.fit-h`, `.fill-w`, `.fill-h`, `.fill-screen`, `.fit-screen`
- Width limits: `.limit-text`, `.limit-content`, `.limit-page`
- Overflow: `.overflow`, `.noflow`

Layout patterns to prefer:

- Toolbar: `.row middle g-2`
- Form sections: `.stack g-3`
- Two-column card grid: `.grid col-2 g-3`
- Expanding content beside a fixed control: parent `.row`, content child `.fill`
- Full-card overlay actions: parent `.rel`, child `.cover`

Avoid:

- Adding custom flex or grid CSS before trying `.row`, `.stack`, `.grid`, `.fill`, `.wrap`, `.col-*`, and `.span-*`
- Hardcoded widths when `.limit-*`, `.w-*`, `.w-*p`, `.w-*bl`, or `.fit-*` already express the intent

# Color guidance

The color system is class-driven and token-based. Most color work should be done by combining an apply class with one or more modifiers.

Apply classes:

- `.bg` applies computed background color
- `.tx` applies computed text color
- `.bd` applies border color, width, and style
- `.ol` applies outline color and width

Base semantic colors:

- `primary`, `secondary`, `tertiary`
- `neutral`, `success`, `info`, `warning`, `danger`, `error`
- `paper`, `ink`, `accent`

Color composition patterns:

- Base color: `.bg-primary`, `.tx-ink`, `.bd-neutral`
- Tint target: `.bg-to-paper`, `.tx-to-ink`, `.bd-to-white`
- Blend amount: `.bg-2b` means closer to tint, `.bg-8b` means closer to base
- Opacity: `.bg-5o`, `.tx-8o`, `.bd-4o`, `.ol-6o`
- Reset: `.nobg`, `.notx`, `.nobd`, `.nool`

Preferred recipes:

- Filled surface with automatic readable text: `class="bg bg-primary bg-to-paper bg-2b tx"`
- Soft panel border: `class="bd bd-neutral bd-to-paper bd-6b"`
- Muted surface: `class="bg bg-neutral bg-to-paper bg-2b bg-6o"`
- Emphasis text on neutral surface: `class="tx tx-primary tx-to-ink tx-7b"`

Important behavior:

- `.bg.tx` uses `contrast-color()` when available, so pairing `bg` and `tx` is the safest default for filled surfaces
- Use semantic colors before raw palette names unless you are intentionally matching a specific hue
- Components inherit semantic variants more reliably than arbitrary palette variants

# Component guidance

Prefer the built-in primitives before inventing new card, badge, button, or selector CSS.

Controls from `controls.js`:

- Actions: `button`, `.button`
- Fields: `input`, `.input`, `textarea`, `.textarea`, `select`, `.select`
- Stateful inputs: `.checkbox`, `.radio`, `.toggle`, `.range`
- Composite choice control: `.selector`
- Selectable container: `.selectable`

Common control variants:

- Semantic variants: `.primary`, `.secondary`, `.success`, `.warning`, `.danger`, `.neutral`
- Presentation variants: `.outline`, `.ghost`, `.blank`, `.icon`, `.compact`
- State helpers when markup needs explicit state: `.hover`, `.active`, `.focus`, `.disabled`
- Emphasis: `.default`

Component primitives from `components.js`:

- Pills and badges: `.pill`, `.badge`
- Status meter: `.status`
- Surface containers: `.card`, `.panel`
- Navigation: `.breadcrumbs`
- Disclosure section: `details.section`
- Sliding content views: `.panels`
- Hierarchical disclosure: `details.tree`

Preferred component recipes:

- Primary action: `<button class="primary">Save</button>`
- Secondary action: `<button class="outline neutral">Cancel</button>`
- Destructive action: `<button class="danger">Delete</button>`
- Quiet icon action: `<button class="ghost icon">…</button>`
- Text field: `<input class="input">` or plain `<input>` with library CSS loaded
- Segmented control: `.selector` containing hidden inputs and adjacent labels
- Content card: `.card stack g-2`
- Badge: `.pill compact`
- Muted outline badge: `.pill outline neutral`

Component composition rules:

- Wrap related controls in `.row` or `.stack` rather than adding margin on each control
- Use color variants on the component itself before layering raw `bg-*` or `tx-*` classes on top
- Use utility classes to place or size a component, not to restyle its internal states
- Use `.selectable` for clickable list rows or cards that are not literal buttons

# Spacing and finish

Once layout and component choice are correct, use `style.js` utilities for finish:

- Padding and margin: `.p-0` to `.p-8`, `.m-0` to `.m-8`, plus side variants like `.pt-2`, `.mw-3`
- Rounding: `.rounded`, `.rounder`, `.roundest`, `.rd`, `.rd-0` to `.rd-4`
- Depth: `.sh-0` to `.sh-4`, `.raised`, `.inset`
- Visibility and interaction: `.dim`, `.dimmer`, `.skip`, `.pointer`, `.noev`

Prefer gap-based spacing between siblings over per-child margins when using `.row`, `.stack`, or `.grid`.

# Agent rules of thumb

- Reach for `.row`, `.stack`, `.grid`, `.fill`, and `.g-*` before custom layout CSS
- Reach for `.bg`, `.tx`, `.bd`, and their modifiers before hardcoded color declarations
- Reach for `button`, `input`, `.card`, `.pill`, and `.selector` before inventing new component classes
- Use semantic variants first; use palette-specific color classes only when the design calls for a specific hue
- Keep custom CSS for cases that the utility and component layers genuinely cannot express

# Examples

## Toolbar

```html
<div class="row middle g-2 p-2 bg bg-paper tx bd bd-neutral bd-to-paper bd-6b">
  <div class="fill">Project</div>
  <button class="ghost">Cancel</button>
  <button class="primary">Save</button>
</div>
```

## Cards grid

```html
<section class="grid col-3 g-3 limit-page">
  <article class="card stack g-2 sh-1">
    <div class="row middle g-2">
      <span class="pill compact success">Active</span>
      <span class="fill b">Account</span>
      <button class="ghost icon">⋯</button>
    </div>
    <p class="tx tx-neutral tx-to-ink tx-7b">Summary text</p>
    <div class="row end g-2">
      <button class="outline neutral">Details</button>
      <button class="primary">Open</button>
    </div>
  </article>
</section>
```

## Segmented selector

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

# Source references

- Layout utilities: `src/css/layout.js`
- Color system: `src/css/colors.js`
- Control styling: `src/css/controls.js`
- Component styling: `src/css/components.js`
- Spacing and finish: `src/css/style.js`
- Tokens and defaults: `src/css/tokens.js`
