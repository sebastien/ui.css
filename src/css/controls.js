import { group, nesting, rule } from "../js/uicss.js?v=2"

// ----------------------------------------------------------------------------
//
// COMPUTED-STATE CONTROLS
//
// Two visual categories: field-like and button-like.
// State behavior (hover, focus, active, disabled) is computed from base values
// using calc(). Variants (outline, ghost, blank) are structural presets.
// Checked/selected flips from field → button styling.
//
// Theme surface:
//   --field-bg-blend, --field-bd-opacity, --field-bd-width, --field-bd-radius
//   --button-bg-blend, --button-bd-opacity, --button-bd-width, --button-bd-radius
//   --ctrl-hover-blend-shift, --ctrl-hover-bd-shift, --ctrl-focus-ol-opacity
//   --ctrl-disabled-opacity
//   --ctrl-color (per-control semantic color)
//
// ----------------------------------------------------------------------------

// Semantic colors assignable to any control via class.
const SEMANTIC_COLORS = ["neutral", "primary", "secondary", "tertiary", "accent", "success", "warning", "danger", "info", "error"]

// ----------------------------------------------------------------------------
//
// SELECTORS
//
// ----------------------------------------------------------------------------

const FIELD_SELECTORS = [
	"input:not([type=checkbox]):not([type=radio]):not([type=range])",
	".input", "textarea", ".textarea", "select", ".select",
]

const TOGGLE_SELECTORS = [
	'input[type="checkbox"]', ".checkbox",
	'input[type="radio"]', ".radio",
]

const BUTTON_SELECTORS = ["button", ".button"]

const SLIDER_SELECTORS = ['input[type="range"]', ".range", ".slider"]

const SELECTOR_SELECTORS = [".selector"]
const OPTION_SELECTORS = [".selector > .option", ".selector > label", ".selector > button", ".selector > a"]

const PANEL_SELECTORS = [".panel"]

// All controls — used for the shared computation base.
const ALL_CONTROLS = `:where(${[
	...FIELD_SELECTORS, ...TOGGLE_SELECTORS, ...BUTTON_SELECTORS,
	...SLIDER_SELECTORS, ...SELECTOR_SELECTORS, ...OPTION_SELECTORS,
	...PANEL_SELECTORS,
].join(", ")})`

// Compact :where() wrappers for category selectors.
const FIELD_SEL = `:where(${FIELD_SELECTORS.join(", ")})`
const TOGGLE_SEL = `:where(${TOGGLE_SELECTORS.join(", ")})`
const BUTTON_SEL = `:where(${BUTTON_SELECTORS.join(", ")})`
const SLIDER_SEL = `:where(${SLIDER_SELECTORS.join(", ")})`
const SELECTOR_SEL = `:where(${SELECTOR_SELECTORS.join(", ")})`
const OPTION_SEL = `:where(${OPTION_SELECTORS.join(", ")})`
const PANEL_SEL = `:where(${PANEL_SELECTORS.join(", ")})`

// State selector fragments.
const HOVER = ":is(:hover, .hover)"
const ACTIVE = ":is(:active, .active)"
const FOCUS = ":is(:focus-visible, .focus)"
const DISABLED = ":is([disabled], .disabled)"
const CHECKED = ":is(:checked, .selected)"
const INVALID = ":is(:invalid, .invalid)"

// ----------------------------------------------------------------------------
//
// COLOR COMPUTATION
//
// ----------------------------------------------------------------------------
//
// All controls share the same color-mix() formula.  State rules only change
// the --ctrl-{ch}-{facet} variables; the computed properties are set once
// in the base rule and never repeated.
//
// Color formula:  color-mix(in oklch,
//   color-mix(in oklch, <base>, <tint> <blend>),
//   transparent calc(100% - <opacity>))
//

function colormix(base, tint, blend, opacity) {
	const inner = `color-mix(in oklch, ${base}, ${tint} ${blend})`
	return `color-mix(in oklch, ${inner}, transparent calc(100% - ${opacity}))`
}

// ----------------------------------------------------------------------------
//
// SHARED BASE — emitted once for ALL controls
//
// ----------------------------------------------------------------------------

function controlBase() {
	const tx = colormix("var(--ctrl-tx-base)", "var(--ctrl-tx-tint)", "var(--ctrl-tx-blend)", "var(--ctrl-tx-opacity)")
	const bg = colormix("var(--ctrl-bg-base)", "var(--ctrl-bg-tint)", "var(--ctrl-bg-blend)", "var(--ctrl-bg-opacity)")
	const bd = colormix("var(--ctrl-bd-base)", "var(--ctrl-bd-tint)", "var(--ctrl-bd-blend)", "var(--ctrl-bd-opacity)")
	const ol = colormix("var(--ctrl-ol-base)", "var(--ctrl-ol-tint)", "var(--ctrl-ol-blend)", "var(--ctrl-ol-opacity)")

	const semanticRules = SEMANTIC_COLORS.map((c) =>
		rule(`&.${c}`, { "--ctrl-color": `var(--color-${c})` })
	)

	return nesting([ALL_CONTROLS], {
		"--ctrl-color": "var(--color-neutral)",
		// Text
		"--ctrl-tx-base": "var(--ctrl-color)",
		"--ctrl-tx-tint": "var(--color-ink)",
		"--ctrl-tx-blend": "75%",
		"--ctrl-tx-opacity": "100%",
		color: tx,
		// Background
		"--ctrl-bg-base": "var(--ctrl-color)",
		"--ctrl-bg-tint": "var(--color-paper)",
		"--ctrl-bg-blend": "95%",
		"--ctrl-bg-opacity": "100%",
		background: bg,
		"--ctrl-bg": bg,
		// Border
		"--ctrl-bd-base": "var(--ctrl-color)",
		"--ctrl-bd-tint": "var(--color-ink)",
		"--ctrl-bd-blend": "85%",
		"--ctrl-bd-opacity": "25%",
		"--ctrl-bd-width": "1px",
		"--ctrl-bd-radius": "4px",
		border_color: bd,
		border_width: "var(--ctrl-bd-width)",
		border_radius: "var(--ctrl-bd-radius)",
		border_style: "solid",
		// Outline
		"--ctrl-ol-base": "var(--ctrl-color)",
		"--ctrl-ol-tint": "var(--color-paper)",
		"--ctrl-ol-blend": "75%",
		"--ctrl-ol-opacity": "0%",
		"--ctrl-ol-width": "2px",
		outline_color: ol,
		outline_width: "var(--ctrl-ol-width)",
		outline_style: "solid",
		outline_offset: "2px",
		// Shared
		transition: "var(--control-transition)",
	}, semanticRules)
}

// ----------------------------------------------------------------------------
//
// FIELD CATEGORY — input, textarea, select (+ unchecked toggles)
//
// ----------------------------------------------------------------------------
//
// Base: ink text, paper bg (95% blend), visible border (25% opacity).
// Hover:  border opacity +15%, border blend -5%.
// Focus:  border opacity +25%, border blend -10%, outline appears.
// Active: bg blend +3% (slightly lighter).
// Disabled: bg/tx/bd opacity × 0.5.
// Invalid: border switches to danger color.
//

function fieldRules() {
	// Fields inherit the base defaults, so default props are minimal.
	// Only need identity (font, padding) + state overrides.
	const fieldSel = [FIELD_SEL]
	const children = []

	// -- Hover
	children.push(rule(`&${HOVER}`, {
		"--ctrl-bd-blend": "80%",
		"--ctrl-bd-opacity": "40%",
	}))

	// -- Focus
	children.push(rule(`&${FOCUS}`, {
		"--ctrl-bd-blend": "75%",
		"--ctrl-bd-opacity": "50%",
		"--ctrl-ol-opacity": "var(--ctrl-focus-ol-opacity, 50%)",
	}))

	// -- Active
	children.push(rule(`&${ACTIVE}`, {
		"--ctrl-bg-blend": "98%",
	}))

	// -- Disabled
	children.push(rule(`&${DISABLED}`, {
		"--ctrl-tx-opacity": "50%",
		"--ctrl-bg-blend": "90%",
		"--ctrl-bg-opacity": "50%",
		"--ctrl-bd-opacity": "15%",
		cursor: "default",
		pointer_events: "none",
	}))

	// -- Invalid
	children.push(rule(`&${INVALID}`, {
		"--ctrl-bd-base": "var(--color-danger)",
		"--ctrl-bd-blend": "80%",
		"--ctrl-bd-opacity": "50%",
		"--ctrl-ol-base": "var(--color-danger)",
	}))

	// -- Invalid + Focus
	children.push(rule(`&${INVALID}${FOCUS}`, {
		"--ctrl-ol-opacity": "var(--ctrl-focus-ol-opacity, 50%)",
	}))

	// -- Variants
	children.push(rule("&.outline", {
		"--ctrl-bg-opacity": "0%",
		"--ctrl-bd-opacity": "40%",
	}))
	children.push(rule(`&.outline${HOVER}`, {
		"--ctrl-bd-opacity": "55%",
		"--ctrl-bd-blend": "75%",
	}))
	children.push(rule(`&.outline${FOCUS}`, {
		"--ctrl-bd-opacity": "60%",
		"--ctrl-bd-blend": "70%",
		"--ctrl-ol-opacity": "var(--ctrl-focus-ol-opacity, 50%)",
	}))
	children.push(rule(`&.outline${DISABLED}`, {
		"--ctrl-tx-opacity": "50%",
		"--ctrl-bd-opacity": "20%",
		cursor: "default",
		pointer_events: "none",
	}))
	children.push(rule(`&.outline${INVALID}`, {
		"--ctrl-bd-base": "var(--color-danger)",
		"--ctrl-bd-opacity": "50%",
	}))

	children.push(rule("&.ghost", {
		"--ctrl-bg-opacity": "0%",
		"--ctrl-bd-width": "0px",
	}))
	children.push(rule(`&.ghost${HOVER}`, {
		"--ctrl-bg-tint": "var(--color-ink)",
		"--ctrl-bg-blend": "95%",
		"--ctrl-bg-opacity": "8%",
	}))
	children.push(rule(`&.ghost${FOCUS}`, {
		"--ctrl-ol-opacity": "var(--ctrl-focus-ol-opacity, 50%)",
	}))
	children.push(rule(`&.ghost${DISABLED}`, {
		"--ctrl-tx-opacity": "50%",
		cursor: "default",
		pointer_events: "none",
	}))

	children.push(rule("&.blank", {
		color: "inherit",
		"--ctrl-bg-opacity": "0%",
		"--ctrl-bd-width": "0px",
		"--ctrl-ol-width": "0px",
	}))

	return nesting(fieldSel, {
		font_family: "var(--input-font-family, var(--font-control-family, sans-serif))",
		font_weight: "var(--input-font-weight, var(--font-control-weight, 500))",
		font_size: "var(--input-font-size, var(--font-control-size, var(--font-size)))",
		line_height: "var(--input-font-line, var(--font-control-line, 1em))",
		padding: "var(--input-padding, 0.65em 1em)",
		margin: "var(--input-margin, 0px)",
	}, children)
}

// Textarea gets same styling but its own identity vars.
function textareaRules() {
	return rule(["textarea", ".textarea"], {
		font_family: "var(--textarea-font-family, var(--font-control-family, sans-serif))",
		font_weight: "var(--textarea-font-weight, var(--font-control-weight, 500))",
		font_size: "var(--textarea-font-size, var(--font-control-size, var(--font-size)))",
		line_height: "var(--textarea-font-line, var(--font-control-line, 1em))",
		padding: "var(--textarea-padding, 0.65em 1em)",
		margin: "var(--textarea-margin, 0px)",
	})
}

// Select arrow styling.
function selectRules() {
	const children = []

	children.push(rule(`&${HOVER}`, {
		"--ctrl-arrow-opacity": "75%",
	}))
	children.push(rule(`&${DISABLED}`, {
		"--ctrl-arrow-opacity": "30%",
	}))

	return nesting(["select", ".select"], {
		font_family: "var(--select-font-family, var(--font-control-family, sans-serif))",
		font_weight: "var(--select-font-weight, var(--font-control-weight, 500))",
		font_size: "var(--select-font-size, var(--font-control-size, var(--font-size)))",
		line_height: "var(--select-font-line, var(--font-control-line, 1em))",
		padding: "var(--select-padding, 0.65em 1em)",
		margin: "var(--select-margin, 0px)",
		"--ctrl-arrow-opacity": "60%",
		"--ctrl-arrow-color": `color-mix(in oklch, color-mix(in oklch, var(--ctrl-color), var(--color-ink) 80%), transparent calc(100% - var(--ctrl-arrow-opacity)))`,
	}, children)
}

// ----------------------------------------------------------------------------
//
// BUTTON CATEGORY — button (+ checked toggles, selected options)
//
// ----------------------------------------------------------------------------
//
// Base: contrast text, solid bg (0% blend = pure ctrl-color), subtle border.
// Hover:  bg blend +20% toward paper.
// Active: bg blend +20% toward ink.
// Focus:  outline appears.
// Disabled: opacity fade.
//

function buttonRules() {
	const children = []

	// -- Hover
	children.push(rule(`&${HOVER}`, {
		"--ctrl-bg-blend": "20%",
	}))

	// -- Active
	children.push(rule(`&${ACTIVE}`, {
		"--ctrl-bg-tint": "var(--color-ink)",
		"--ctrl-bg-blend": "20%",
	}))

	// -- Focus
	children.push(rule(`&${FOCUS}`, {
		"--ctrl-ol-opacity": "var(--ctrl-focus-ol-opacity, 50%)",
	}))

	// -- Disabled: visibly faded — override color directly since buttons use contrast-color
	children.push(rule(`&${DISABLED}`, {
		opacity: "var(--ctrl-disabled-opacity, 0.4)",
		cursor: "default",
		pointer_events: "none",
	}))

	// -- Variants
	children.push(rule("&.outline", {
		color: colormix("var(--ctrl-color)", "var(--color-ink)", "40%", "100%"),
		"--ctrl-bg-opacity": "0%",
		"--ctrl-bd-opacity": "60%",
		"--ctrl-bd-blend": "80%",
	}))
	children.push(rule(`&.outline${HOVER}`, {
		"--ctrl-bg-tint": "var(--color-paper)",
		"--ctrl-bg-blend": "80%",
		"--ctrl-bg-opacity": "90%",
	}))
	children.push(rule(`&.outline${ACTIVE}`, {
		"--ctrl-bg-tint": "var(--color-paper)",
		"--ctrl-bg-blend": "70%",
		"--ctrl-bg-opacity": "80%",
	}))
	children.push(rule(`&.outline${FOCUS}`, {
		"--ctrl-ol-opacity": "var(--ctrl-focus-ol-opacity, 50%)",
	}))
	children.push(rule(`&.outline${DISABLED}`, {
		opacity: "var(--ctrl-disabled-opacity, 0.4)",
		cursor: "default",
		pointer_events: "none",
	}))

	children.push(rule("&.ghost", {
		color: colormix("var(--ctrl-color)", "var(--color-ink)", "40%", "100%"),
		"--ctrl-bg-opacity": "0%",
		"--ctrl-bd-width": "0px",
	}))
	children.push(rule(`&.ghost${HOVER}`, {
		"--ctrl-bg-tint": "var(--color-ink)",
		"--ctrl-bg-blend": "95%",
		"--ctrl-bg-opacity": "8%",
	}))
	children.push(rule(`&.ghost${ACTIVE}`, {
		"--ctrl-bg-tint": "var(--color-ink)",
		"--ctrl-bg-blend": "95%",
		"--ctrl-bg-opacity": "12%",
	}))
	children.push(rule(`&.ghost${FOCUS}`, {
		"--ctrl-ol-opacity": "var(--ctrl-focus-ol-opacity, 50%)",
	}))
	children.push(rule(`&.ghost${DISABLED}`, {
		opacity: "var(--ctrl-disabled-opacity, 0.4)",
		cursor: "default",
		pointer_events: "none",
	}))

	children.push(rule("&.blank", {
		color: "inherit",
		"--ctrl-bg-opacity": "0%",
		"--ctrl-bd-width": "0px",
		"--ctrl-ol-width": "0px",
	}))

	return nesting([BUTTON_SEL], {
		// Button-mode: contrast text, filled bg, subtle border
		color: "contrast-color(var(--ctrl-bg, var(--color-paper)))",
		"--ctrl-bg-blend": "var(--button-bg-blend, 0%)",
		"--ctrl-bg-opacity": "var(--button-bg-opacity, 100%)",
		"--ctrl-bd-opacity": "var(--button-bd-opacity, 15%)",
		"--ctrl-bd-width": "var(--button-bd-width, 1px)",
		"--ctrl-bd-radius": "var(--button-bd-radius, 4px)",
		cursor: "pointer",
		font_family: "var(--button-font-family, var(--font-control-family, sans-serif))",
		font_weight: "var(--button-font-weight, var(--font-control-weight, 500))",
		font_size: "var(--button-font-size, var(--font-control-size, var(--font-size)))",
		line_height: "var(--button-font-line, var(--font-control-line, 1em))",
		padding: "var(--button-padding, 0.65em 1em)",
		margin: "var(--button-margin, 0px)",
	}, children)
}

// ----------------------------------------------------------------------------
//
// TOGGLE CONTROLS — checkbox, radio
//
// ----------------------------------------------------------------------------
//
// Unchecked: field-like (inherits field base from shared base).
// Checked: flips to button-like (filled bg, contrast text).
//

function toggleRules() {
	const children = []

	// -- Field-mode states (unchecked)
	children.push(rule(`&${HOVER}`, {
		"--ctrl-bd-blend": "80%",
		"--ctrl-bd-opacity": "40%",
		"--ctrl-bg-blend": "92%",
	}))
	children.push(rule(`&${FOCUS}`, {
		"--ctrl-ol-opacity": "var(--ctrl-focus-ol-opacity, 50%)",
	}))
	children.push(rule(`&${DISABLED}`, {
		"--ctrl-tx-opacity": "50%",
		"--ctrl-bg-opacity": "50%",
		"--ctrl-bd-opacity": "15%",
		"--ctrl-sub-opacity": "50%",
		cursor: "default",
		pointer_events: "none",
	}))

	// -- Checked: flip to button mode
	children.push(rule(`&${CHECKED}`, {
		"--ctrl-bg-blend": "var(--button-bg-blend, 0%)",
		"--ctrl-bd-opacity": "var(--button-bd-opacity, 15%)",
		"--ctrl-sub-color": "contrast-color(var(--ctrl-bg, var(--color-paper)))",
	}))
	children.push(rule(`&${CHECKED}${HOVER}`, {
		"--ctrl-bg-tint": "var(--color-ink)",
		"--ctrl-bg-blend": "10%",
	}))

	// -- Indeterminate (checkbox only, but harmless on radio)
	children.push(rule("&:indeterminate", {
		"--ctrl-bg-blend": "var(--button-bg-blend, 0%)",
		"--ctrl-bd-opacity": "var(--button-bd-opacity, 15%)",
		"--ctrl-sub-color": "contrast-color(var(--ctrl-bg, var(--color-paper)))",
	}))

	// -- Variants
	children.push(rule("&.outline", {
		"--ctrl-bg-opacity": "0%",
		"--ctrl-bd-opacity": "40%",
	}))
	children.push(rule(`&.outline${HOVER}`, {
		"--ctrl-bd-opacity": "55%",
		"--ctrl-bd-blend": "75%",
	}))
	children.push(rule(`&.outline${FOCUS}`, {
		"--ctrl-ol-opacity": "var(--ctrl-focus-ol-opacity, 50%)",
	}))
	children.push(rule(`&.outline${CHECKED}`, {
		"--ctrl-bd-opacity": "60%",
		"--ctrl-bd-blend": "75%",
		"--ctrl-sub-color": colormix("var(--ctrl-color)", "var(--color-ink)", "25%", "100%"),
	}))
	children.push(rule(`&.outline${CHECKED}${HOVER}`, {
		"--ctrl-bd-opacity": "70%",
		"--ctrl-bd-blend": "70%",
		"--ctrl-sub-color": colormix("var(--ctrl-color)", "var(--color-ink)", "20%", "100%"),
	}))
	children.push(rule(`&.outline${DISABLED}`, {
		"--ctrl-tx-opacity": "50%",
		"--ctrl-bd-opacity": "20%",
		"--ctrl-sub-opacity": "50%",
		cursor: "default",
		pointer_events: "none",
	}))

	children.push(rule("&.blank", {
		color: "inherit",
		"--ctrl-bg-opacity": "0%",
		"--ctrl-bd-width": "0px",
		"--ctrl-ol-width": "0px",
	}))
	children.push(rule(`&.blank${CHECKED}`, {
		"--ctrl-sub-color": "inherit",
	}))

	return nesting([TOGGLE_SEL], {
		appearance: "none",
		cursor: "pointer",
		width: "1.125em",
		height: "1.125em",
		min_width: "1.125em",
		min_height: "1.125em",
		padding: "0",
		display: "inline-flex",
		align_items: "center",
		justify_content: "center",
		flex_shrink: "0",
		vertical_align: "middle",
		box_sizing: "border-box",
		"--ctrl-sub-color": "transparent",
		"--ctrl-sub-opacity": "100%",
	}, children)
}

// Checkbox-specific: checkmark pseudo-element.
function checkboxStructure() {
	const cbSel = ['input[type="checkbox"]', ".checkbox"]
	const rules = []

	rules.push(rule(cbSel, { "--ctrl-bd-radius": "0.2em" }))

	const afterSel = cbSel.map((s) => `${s}::after`)
	rules.push(rule(afterSel, {
		content: '""',
		display: "block",
		width: "0.35em",
		height: "0.6em",
		border: "solid var(--ctrl-sub-color)",
		border_width: "0 0.14em 0.14em 0",
		opacity: "var(--ctrl-sub-opacity)",
		transform: "rotate(45deg) translate(-0.02em, -0.02em)",
		transition: "var(--control-transition)",
	}))

	const indeterminateSel = cbSel.map((s) => `${s}:indeterminate::after`)
	rules.push(rule(indeterminateSel, {
		width: "0.55em",
		height: "0",
		border_width: "0 0 0.14em 0",
		transform: "none",
	}))

	return group(...rules)
}

// Radio-specific: dot pseudo-element.
function radioStructure() {
	const rdSel = ['input[type="radio"]', ".radio"]
	const rules = []

	rules.push(rule(rdSel, { "--ctrl-bd-radius": "50%" }))

	const afterSel = rdSel.map((s) => `${s}::after`)
	rules.push(rule(afterSel, {
		content: '""',
		display: "block",
		width: "0.5em",
		height: "0.5em",
		border_radius: "50%",
		background: "var(--ctrl-sub-color)",
		opacity: "var(--ctrl-sub-opacity)",
		transition: "var(--control-transition)",
	}))

	return group(...rules)
}

// ----------------------------------------------------------------------------
//
// SELECTOR — container + options
//
// ----------------------------------------------------------------------------

function selectorRules() {
	const children = []

	children.push(rule("&:is(:focus-within, .focus)", {
		"--ctrl-ol-opacity": "var(--ctrl-focus-ol-opacity, 50%)",
	}))
	children.push(rule(`&${DISABLED}`, {
		"--ctrl-bg-opacity": "50%",
		"--ctrl-bd-opacity": "15%",
		cursor: "default",
		pointer_events: "none",
	}))

	return nesting([SELECTOR_SEL], {
		display: "inline-flex",
		flex_wrap: "nowrap",
		align_items: "center",
		gap: "2px",
		padding: "2px",
		width: "fit-content",
		"--ctrl-bg-opacity": "0%",
		"--ctrl-bd-opacity": "50%",
		"--ctrl-bd-blend": "20%",
		"--ctrl-bd-width": "1px",
		"--ctrl-bd-radius": "var(--field-bd-radius, 4px)",
		border_style: "solid",
	}, children)
}

function selectorInputRules() {
	const inputSel = [
		'.selector > input[type="radio"]',
		'.selector > input[type="checkbox"]',
	]
	return rule(inputSel, {
		position: "absolute",
		width: "1px",
		height: "1px",
		padding: "0",
		margin: "-1px",
		overflow: "hidden",
		clip: "rect(0,0,0,0)",
		white_space: "nowrap",
		border: "0",
	})
}

function optionRules() {
	const children = []

	// -- Ghost-like hover
	children.push(rule(`&${HOVER}`, {
		"--ctrl-bg-tint": "var(--color-ink)",
		"--ctrl-bg-blend": "95%",
		"--ctrl-bg-opacity": "8%",
	}))
	children.push(rule(`&${ACTIVE}`, {
		"--ctrl-bg-tint": "var(--color-ink)",
		"--ctrl-bg-blend": "95%",
		"--ctrl-bg-opacity": "12%",
	}))

	// -- Selected: flip to button mode
	children.push(rule(`&${CHECKED}`, {
		color: "contrast-color(var(--ctrl-bg, var(--color-paper)))",
		"--ctrl-bg-blend": "var(--button-bg-blend, 0%)",
		"--ctrl-bg-opacity": "var(--button-bg-opacity, 100%)",
	}))
	children.push(rule(`&${CHECKED}${HOVER}`, {
		"--ctrl-bg-blend": "20%",
	}))
	children.push(rule(`&${CHECKED}${ACTIVE}`, {
		"--ctrl-bg-tint": "var(--color-ink)",
		"--ctrl-bg-blend": "20%",
	}))

	// -- Disabled
	children.push(rule(`&${DISABLED}`, {
		"--ctrl-tx-opacity": "60%",
		cursor: "default",
		pointer_events: "none",
	}))

	// -- :checked + label mirroring
	const checkedLabel = [
		".selector > input:checked + label",
		".selector > input:checked + .option",
	]
	children.push(rule(checkedLabel, {
		color: "contrast-color(var(--ctrl-bg, var(--color-paper)))",
		"--ctrl-bg-blend": "var(--button-bg-blend, 0%)",
		"--ctrl-bg-opacity": "var(--button-bg-opacity, 100%)",
	}))
	children.push(rule(checkedLabel.map((s) => `${s}:hover`), {
		"--ctrl-bg-blend": "20%",
	}))
	children.push(rule(checkedLabel.map((s) => `${s}:active`), {
		"--ctrl-bg-tint": "var(--color-ink)",
		"--ctrl-bg-blend": "20%",
	}))

	return nesting([OPTION_SEL], {
		color: colormix("var(--ctrl-color)", "var(--color-ink)", "40%", "100%"),
		"--ctrl-bg-opacity": "0%",
		"--ctrl-bd-width": "0px",
		"--ctrl-bd-radius": "4px",
		padding: "0.35em 0.75em",
		cursor: "pointer",
		user_select: "none",
		white_space: "nowrap",
		border_style: "solid",
		transition: "var(--control-transition)",
	}, children)
}

// ----------------------------------------------------------------------------
//
// SLIDER — range input
//
// ----------------------------------------------------------------------------

function sliderRules() {
	const rules = []

	// Track color = same as input border (ink blend 85%, opacity 25%)
	const trackColor = colormix("var(--ctrl-color)", "var(--color-ink)", "var(--field-bd-blend, 85%)", "var(--field-bd-opacity, 25%)")
	// Thumb = button-like (filled with ctrl-color, subtle border)
	const thumbBg = colormix("var(--ctrl-color)", "var(--color-paper)", "var(--button-bg-blend, 0%)", "100%")
	const thumbBd = colormix("var(--ctrl-color)", "var(--color-ink)", "85%", "var(--button-bd-opacity, 15%)")

	// Base
	rules.push(rule([SLIDER_SEL], {
		appearance: "none",
		cursor: "pointer",
		width: "100%",
		height: "auto",
		padding: "0.5em 0",
		background: "transparent",
		border: "none",
		outline: "none",
		"--ctrl-track-color": trackColor,
		"--ctrl-thumb-bg": thumbBg,
		"--ctrl-thumb-bd": `var(--button-bd-width, 1px) solid ${thumbBd}`,
	}))

	// Track (webkit + moz)
	const trackWebkit = SLIDER_SELECTORS.map((s) => `${s}::-webkit-slider-runnable-track`)
	const trackMoz = SLIDER_SELECTORS.map((s) => `${s}::-moz-range-track`)
	const trackProps = {
		height: "var(--field-bd-width, 1px)",
		border_radius: "var(--field-bd-radius, 4px)",
		background: "var(--ctrl-track-color)",
		transition: "var(--control-transition)",
	}
	rules.push(rule(trackWebkit, trackProps))
	rules.push(rule(trackMoz, trackProps))

	// Thumb (webkit + moz) — round button
	const thumbWebkit = SLIDER_SELECTORS.map((s) => `${s}::-webkit-slider-thumb`)
	const thumbMoz = SLIDER_SELECTORS.map((s) => `${s}::-moz-range-thumb`)
	const thumbProps = {
		appearance: "none",
		width: "1.25em",
		height: "1.25em",
		border_radius: "50%",
		background: "var(--ctrl-thumb-bg)",
		border: "var(--ctrl-thumb-bd)",
		cursor: "pointer",
		transition: "var(--control-transition)",
	}
	rules.push(rule(thumbWebkit, { ...thumbProps, margin_top: "calc((1.25em - var(--field-bd-width, 1px)) / -2)" }))
	rules.push(rule(thumbMoz, thumbProps))

	// Hover — button hover style (blend toward paper)
	const hoverSel = SLIDER_SELECTORS.map((s) => `${s}:hover`)
	rules.push(rule(hoverSel, {
		"--ctrl-track-color": colormix("var(--ctrl-color)", "var(--color-ink)", "82%", "40%"),
		"--ctrl-thumb-bg": colormix("var(--ctrl-color)", "var(--color-paper)", "20%", "100%"),
	}))
	const hoverThumbWebkit = SLIDER_SELECTORS.map((s) => `${s}:hover::-webkit-slider-thumb`)
	const hoverThumbMoz = SLIDER_SELECTORS.map((s) => `${s}:hover::-moz-range-thumb`)
	rules.push(rule(hoverThumbWebkit, { transform: "scale(1.15)" }))
	rules.push(rule(hoverThumbMoz, { transform: "scale(1.15)" }))

	// Active — button active style (blend toward ink)
	const activeSel = SLIDER_SELECTORS.map((s) => `${s}:active`)
	rules.push(rule(activeSel, {
		"--ctrl-thumb-bg": colormix("var(--ctrl-color)", "var(--color-ink)", "20%", "100%"),
	}))

	// Focus — outline on thumb
	rules.push(rule(SLIDER_SELECTORS.map((s) => `${s}:focus-visible`), {
		"--ctrl-ol-opacity": "var(--ctrl-focus-ol-opacity, 50%)",
	}))
	const focusThumbWebkit = SLIDER_SELECTORS.map((s) => `${s}:focus-visible::-webkit-slider-thumb`)
	const focusThumbMoz = SLIDER_SELECTORS.map((s) => `${s}:focus-visible::-moz-range-thumb`)
	const focusThumbProps = {
		outline: `2px solid ${colormix("var(--ctrl-color)", "var(--color-paper)", "50%", "100%")}`,
		outline_offset: "2px",
	}
	rules.push(rule(focusThumbWebkit, focusThumbProps))
	rules.push(rule(focusThumbMoz, focusThumbProps))

	// Disabled — faded like disabled button
	const disabledSel = SLIDER_SELECTORS.flatMap((s) => [`${s}[disabled]`, `${s}.disabled`])
	rules.push(rule(disabledSel, {
		"--ctrl-track-color": colormix("var(--ctrl-color)", "var(--color-ink)", "85%", "12%"),
		"--ctrl-thumb-bg": colormix("var(--ctrl-color)", "var(--color-paper)", "50%", "50%"),
		"--ctrl-thumb-bd": `var(--button-bd-width, 1px) solid ${colormix("var(--ctrl-color)", "var(--color-ink)", "85%", "8%")}`,
		cursor: "default",
		pointer_events: "none",
	}))

	// Blank variant
	const blankSel = SLIDER_SELECTORS.flatMap((s) => [`${s}.blank`])
	rules.push(rule(blankSel, {
		"--ctrl-ol-width": "0px",
		"--ctrl-track-color": colormix("var(--ctrl-color)", "var(--color-ink)", "90%", "10%"),
		"--ctrl-thumb-bg": colormix("var(--ctrl-color)", "var(--color-ink)", "25%", "100%"),
		"--ctrl-thumb-bd": "none",
	}))

	return group(...rules)
}

// ----------------------------------------------------------------------------
//
// PANEL
//
// ----------------------------------------------------------------------------

function panelRules() {
	const children = []

	children.push(rule("&.outline", {
		"--ctrl-bg-opacity": "0%",
		"--ctrl-bd-blend": "80%",
		"--ctrl-bd-tint": "var(--color-ink)",
		"--ctrl-bd-opacity": "40%",
	}))
	children.push(rule("&.blank", {
		color: "inherit",
		"--ctrl-bg-opacity": "0%",
		"--ctrl-bd-width": "0px",
		"--ctrl-ol-width": "0px",
	}))

	return nesting([PANEL_SEL], {
		"--ctrl-bg-blend": "4%",
		"--ctrl-bd-tint": "var(--color-paper)",
		"--ctrl-bd-blend": "14%",
		"--ctrl-bd-opacity": "100%",
	}, children)
}

// ----------------------------------------------------------------------------
//
// MAIN EXPORT
//
// ----------------------------------------------------------------------------

function controls() {
	return group(
		controlBase(),
		fieldRules(),
		textareaRules(),
		selectRules(),
		buttonRules(),
		toggleRules(),
		checkboxStructure(),
		radioStructure(),
		selectorRules(),
		selectorInputRules(),
		optionRules(),
		sliderRules(),
		panelRules(),
	)
}

// ----------------------------------------------------------------------------

if (import.meta.main) {
	const css = (await import("../js/uicss.js")).css
	console.log([...css(controls())].join("\n"))
}

export { controls, SEMANTIC_COLORS }
export default controls()
