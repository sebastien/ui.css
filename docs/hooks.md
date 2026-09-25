# Override Hooks

Override hooks are CSS custom properties that ui.css **reads but does not
declare**. They exist so a theme, application, or wrapper element can adjust a
specific value without a `tokens.js` entry or a rebuild.

A hook appears in the emitted CSS only as `var(--hook, <fallback>)`. Declaring
it anywhere in the cascade takes precedence over the fallback:

```css
body[data-theme="material"] {
	--field-padding: 0.5em 0;
	--pill-gap: 0.5em;
}
```

Hooks are organized by component namespace. Every name below is stable API; if
you rely on one, declare it rather than depending on the fallback.

## Palette

- `--color-{name}` — palette families. `tokens.js` ships defaults for the full
  `COLORS` list; a theme may override any of them (see `spec-001-colors.md`).
- `--background-color-{role}` — optional extra-light background for a semantic
  role, preferred by filled controls before the solid role color. The neutral
  role is mode-paired (`--background-color-neutral-light` /
  `--background-color-neutral-dark`) and repointed by the `.light` / `.dark`
  rules; the other roles are hooks.

## Component hooks

### Actions (`button`, `.button`)
- `--action-hover-tint`, `--action-hover-blend`
- `--action-active-tint`, `--action-active-blend`
- `--action-padding-expanded`
- `--action-font-weight`, `--action-font-weight-{compact,tight,expanded}`
- `--action-font-size-{tight,expanded}`

### Fields (`input`, `textarea`, `select`)
- `--field-border-{base,tint,blend,opacity}`
- `--field-font-weight`
- `--field-font-line`, `--field-font-line-compact`
- `--field-font-size-compact`
- `--field-slot-color`
- `--field-unit-background`

### Status
- `--status-color-{base,tint}`
- `--status-border-size`, `--status-border-radius`, `--status-padding`

### Dividers
- `--divider-width`, `--divider-hit-width`
- `--divider-handle-width`, `--divider-handle-height`, `--divider-handle-radius`

### Sections (`details.section`)
- `--section-border-radius`, `--section-margin`
- `--section-summary-padding`, `--section-body-padding`

### Pills, badges, counters (`.pill`, `.badge`, `.count`)
- `--pill-gap`, `--pill-bg`, `--pill-text`, `--pill-dot-color`
- `--badge-size` (diameter of the circular `.count` chip)

### Tabs (`.tabs`)
- `--tab-padding`, `--tab-padding-compact` (density channel read by each tab)

### Popovers (`.popover`, `menu`)
- `--popover-anchor`, `--popover-area`, `--popover-fallbacks`

### Misc components
- `--checkbox-size-small`
- `--toggle-knob-border-width`
- `--selectable-bg`
- `--range-progress` (set by the application on `input[type=range]`)
- `--item-min`, `--item-max` (`.grid-items`)

### Utilities
- `--striped-background` (`.striped` alternating row wash)

### Typography weights
- `--font-weight-{regular,medium,bold,bolder,boldest}`

### Motion / structure
- `--motion-origin` (whole-value `transform-origin` override for `.origin-*` and popover animations), `--motion-origin-x` / `--motion-origin-y` (per-axis; set by `.origin-*` and read by `.open-rotate` and the disclosure markers), `--motion-rotation`, `--motion-stagger-index`
- `--accordion-marker-size`, `--accordion-marker-font-size` (accordion chevron box and glyph size)
- `--depth`, `--dx`, `--dy`
- `--meter-color`
- `--file-background`
- `--details-open-show-display`, `--details-open-hide-display`, `--details-open-rotate`

## Root channel defaults

The four paint channels are declared at the root and are *not* hooks:

- `--{background,text,border,outline}-color-{base,tint,blend,opacity}`
- computed: `--{background,text,border,outline}-color`
- shadow channel: `--shadow-color-{base,tint,blend,opacity}`, computed `--shadow-color`

`--accent` is the inheritable component identity (see
`spec-002-component_model.md`); `--color-accent` is the global semantic alias.
They are intentionally distinct.
