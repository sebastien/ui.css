# Controls Module (`controls.js`)

## Interactive UI components and form controls

The `controls.js` module provides comprehensive styling for interactive elements like buttons, inputs, toggles, and selectable lists. It handles hover, focus, active, and selected states automatically.

### Main Components:

- `button`, `.button`: Standard button styling with configurable fonts and colors.
- `.selectable`: Base class for interactive items (list items, cards) that share button-like state logic but may have different layouts.
- `input`, `.input`: Standard text input styling.
- `input[type="file"]`, `.input.file`, `.file`: The `::file-selector-button` is styled as the field's action part, joined to the filename like a button group. Semantic colors (`.primary`, `.danger`, …) retint only the button; `.compact` / `.tight` and `:disabled` apply.
- `textarea`, `.textarea`: Multi-line text input styling.
- `input[type="checkbox"]`, `.checkbox`: Custom styled checkboxes with `:checked` markers.
- `input[type="radio"]`, `.radio`: Custom styled radio buttons.
- `.toggle`: Switch/toggle control (often used with a hidden checkbox).
- `input[type=checkbox][role=switch]`: Switch control. The knob is flat by default; add `.shadow` for a knob shadow.

### Style Variants:

- `.neutral`, `.primary`, `.secondary`, `.success`, `.warning`, `.danger`: Semantic color variants. `.neutral` is explicit on filled buttons (light surface) and on `.outline` / `.ghost` (medium chrome); bare `.outline` / `.ghost` default to ink.
- `.outline`: Transparent background with a visible border of the current color.
- `.onoff`: Ghost-like button with no border by default; add `.selected` to show the filled semantic state.
- `.ghost`: Fully transparent background and border; only shows state on interaction.
- `.blank`: No visual chrome at all (no background, border, outline, or padding).
- `.icon`: 1:1 aspect ratio button with minimal padding.
- `.compact`: reduced padding for buttons, fields, selectors, tabs, and listbox options.
- `.default`: Emphasized button style with a visible outline.
- `.tinted` (fields / `.selector`): Pure accent at low opacity (no paper blend); hover/focus do not force full opacity.
- `.tinted` (range): Accent progress track; set `--range-progress` to the current percentage for the WebKit gradient implementation.
- `.shadow` on switches: Adds a shadow to the knob; switches are flat by default.
- `.outline` on switches: Transparent track when off, neutral when checked without a semantic class, and semantic-colored when checked with a color class.
- Fields: semantic color always drives the border; text stays ink unless `.colored`.
- `.colored` (fields / `.selector`): Accent text (and stronger border on fields). On `.selector`, unselected labels also get accent text/border; only the checked option is accent-filled by default.
- `.selector` item colors: Add a semantic color class to an individual label; its checked, active, tinted, and colored states use that item color.
- `.selector.horizontal`, `.selector.vertical`: Joined horizontal or vertical selector items. Horizontal is the default.
- `.selector.toggle`: Segmented pill button group. Direct `button` children select with `[aria-pressed=true]` or `.selected`; `aria-pressed=false` (or `.selected` absent) is the resting state. Use it for view/range switchers, including buttons that open a dialog.
- `.tabs`: Classic bordered tab strip with the selected tab visually joined to the content below.
- `.tabs.group`: Filled, rounded tab group presentation.
- `.tabs.compact` or `.tab.compact`: Reduced padding for tab navigation.
- `.tabs.compacted`: Full-width bar with min-content tabs that do not stretch; tab padding is unchanged. Add `.tabs.wrap` to let tabs wrap when they exceed the parent width.
- `.tabs.outline`: Border-side tab navigation with neutral inactive tabs and ink active tabs by default, plus a `::after` active indicator. A semantic color on the tab bar makes inactive tabs ink and active tabs use that semantic color.
- `.tabs.bar`: Joined, bordered horizontal bar (Apple-style) with a solid accent fill and contrast text on the active tab, like a checked `.selector`. Add a semantic color to the bar (`.tabs.bar.primary`) or an individual tab; horizontal only.
- `.tabs.vertical`: Stacks tabs vertically; with `.outline`, the border and active indicator are on the right by default. Add `.left` or `.right` to choose the bar side.
- Tabs paint through the background color channel, so `.bg-*` color, tint, blend, and opacity modifiers apply to `.tabs` and `.tab` (for example `.tab.primary.active.bg-2o`).
- `select[multiple]`: Native vertical listbox with selector-like option rows. `select.vertical` opts into the same styling; pair it with `size` to render a listbox and control visible rows.

### Component States:

- `:hover`, `.hover`: Mouse over effect.
- `:active`, `.active`: Click/press effect.
- `:focus`, `:focus-visible`, `.focus`: Keyboard focus ring.
- `.selected`, `:checked`, `.checked`: Persistently selected state.
- `:disabled`, `.disabled`: Visual dimming and `pointer-events: none`. On `.selector`, either mark the hidden `input` with `disabled` or add `.disabled` to a `label` (or to the whole `.selector`) to disable individual items; on `.tabs`, add `disabled` / `.disabled` to a `.tab`.

### Color model

Controls derive all their colors from `color-mix()` expressions over four
channels — `color` (accent), `background` (surface), `border`, `outline` —
each driven by four variables: `base`, `tint`, `blend`, `opacity`.

- `--accent` is the inheritable semantic identity. Variant classes set it
  alongside the compatible `--control-color-base` input.
- `--control-color-*` drives coordinated accent state behavior.
- `--control-background-*` is the **surface**: the background the control sits
  on. It is **element-scoped by design**: controls pin it on themselves, so an
  inherited value from an ancestor can never defeat the accent variants.
  Only set it through selectors that target controls directly
  (e.g. `input, textarea, select { --control-background-base: … }`), never on
  containers — a container-level value would be inherited by every descendant
  control and silently override their variant colors.
- Actions (buttons) fill from `--background-color-{semantic}` when set, else
  the solid semantic color. Default/neutral buttons use the light
  `--background-color-neutral` surface; medium `--color-neutral` stays for
  borders and chrome. Checked controls still pin fill to the accent.
- Fields default to the mode-aware surface at 0.8 opacity.
- Decorative edges (`.bd`, cards, alerts, tabs) use `--border-color-*`
  (softer, default opacity 0.35). Interactive chrome (outline buttons,
  checkboxes, inputs) uses `--control-border-*` (default opacity 0.75).
  Fields follow control; set `--field-border-*` to override inputs only.
  Semantic classes override the border from the accent. Focus outlines use
  the accent.
- Field/selector `.tinted` applies a soft wash of the main accent
  (`--control-color-base`, primary unless a semantic class is set). Semantic
  classes alone only set the accent (border/focus); they do not recolor the fill.

### Difference with utility-only frameworks:

- Components coordinate `--control-{color,background,border,outline}-*`
  variables internally; states (hover/active/checked) only adjust blend and
  opacity, so theming a handful of variables restyles every state.
- States are coordinated across different component types for a consistent feel.
- Automatic contrast calculation for text inside accent-filled controls
  (`contrast-color()` against the control background).

### Using

```html
<!-- Semantic buttons -->
<div class="row g-2">
    <button class="primary">Submit</button>
    <button class="outline danger">Delete</button>
    <button class="ghost">Cancel</button>
</div>

<!-- Toggle-style actions -->
<div class="row g-2">
    <button class="onoff primary">Off</button>
    <button class="onoff primary selected">On</button>
</div>

<!-- Form controls -->
<div class="stack g-2">
    <input type="text" placeholder="Username" class="success">
    <textarea placeholder="Bio"></textarea>
    <label class="row g-2 middle pointer">
        <input type="checkbox" class="primary">
        <span>Accept terms</span>
    </label>
</div>

<!-- Per-item selector colors -->
<div class="selector tinted colored">
    <input id="normal" type="radio" name="action">
    <label for="normal">Normal</label>
    <input id="delete" type="radio" name="action">
    <label for="delete" class="danger">Delete</label>
</div>

<!-- Native multi-select listbox -->
<select name="roles" multiple size="4">
    <option value="reader">Reader</option>
    <option value="writer" selected>Writer</option>
    <option value="editor">Editor</option>
    <option value="admin">Admin</option>
</select>

<!-- Styled horizontal single-choice selector -->
<div class="selector horizontal">
    <input id="day" type="radio" name="range" checked>
    <label for="day">Day</label>
    <input id="week" type="radio" name="range">
    <label for="week">Week</label>
</div>

<!-- Styled vertical multi-choice selector -->
<div class="selector vertical">
    <input id="email" type="checkbox" name="channels" checked>
    <label for="email">Email</label>
    <input id="push" type="checkbox" name="channels">
    <label for="push">Push</label>
</div>

<!-- Segmented toggle button group -->
<div class="selector toggle">
    <button type="button" aria-pressed="false">7D</button>
    <button type="button" aria-pressed="true">1M</button>
    <button type="button" aria-haspopup="dialog" aria-expanded="false">Custom</button>
</div>

<!-- Range progress and switches -->
<input class="range tinted primary" type="range" min="0" max="100" value="60" style="--range-progress: 60%">
<input type="checkbox" role="switch" class="shadow">
<input type="checkbox" role="switch" class="outline primary" checked>
```

Native `select` options are browser-owned UI, so `select.horizontal` cannot be
rendered as a selector-style segmented control reliably. Use
`.selector.horizontal` when that presentation is required.

Browsers may retain platform-specific selection highlights for native listboxes,
but ui.css supplies the option-row styles wherever the browser permits them.

### API

`controls.js` composes its output from internal factory functions; there is no
public runtime API. The theming surface is the set of CSS variables consumed
via fallback chains:

- `--control-{color,background,border,outline}-{base,tint,blend,opacity}`:
  per-channel color computation.
- `--control-font-*`, `--control-padding`, `--control-padding-{compact,tight}`, `--control-gap`,
  `--control-border-width`, `--control-border-radius`,
  `--control-outline-width`: shared geometry.
- `--field-font-size`, `--field-padding`, `--field-padding-{compact,tight}`, `--field-border-radius`,
  `--field-border-{base,tint,blend,opacity}`,
  `--action-font-size`, `--action-padding`, `--action-border-width`, `--action-border-radius`,
  `--action-outline-width`: per-kind geometry and typography overrides
  (fields vs actions). These fall back to the shared `--control-*` tokens.
- `--{checkbox,radio,toggle,range,select,selector}-*`: per-component sizing.
- `.bd-*` / `.ol-*` color, tint, blend and opacity modifiers publish
  `--border-{base,tint,blend,opacity}` / `--outline-{base,tint,blend,opacity}`.
  Controls and fields consume them ahead of the `--control-*` tokens, so the
  modifiers reach interactive chrome even without the `.bd` / `.ol` apply class.
  Fields take `--field-border-*` first, then `--border-*`, then `--control-border-*`.

> Migration: the old `--input-*` field namespace was renamed. Use `--field-*`
> for the field-specific channel and `--control-*` for the shared interactive
> one (`--input-border-opacity` → `--field-border-opacity`). No aliases remain.
>
> Field density is now themed through `--field-padding-{compact,tight}`.
> Fields no longer read `--control-padding-compact` / `--control-padding-tight`;
> set the `--field-padding-*` tokens to retheme field padding.

Note: `input[type=submit]`, `input[type=button]`, and `input[type=reset]` are
styled as actions, not fields.
