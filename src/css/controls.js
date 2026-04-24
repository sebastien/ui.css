import { group, nesting, rule } from "../js/uicss.js?v=2"

// ----------------------------------------------------------------------------
//
// TOKEN-DRIVEN CONTROLS
//
// Two visual categories: field-like and button-like.
// All parameters are defined as tokens in tokens.js (on :root) so they're
// always available — no FOUC from unresolved custom properties.
//
// Theme surface (override these tokens):
//   --control-color                      default semantic color
//   --control-field-{tx,bg,bd}-blend     field color mixing
//   --control-field-bd-{opacity,width,radius}
//   --control-button-bg-blend            button color mixing
//   --control-button-bd-{opacity,width,radius}
//   --control-focus-ring-{width,offset,opacity}
//   --control-disabled-opacity
//
// Per-element: --ctrl-color overrides the semantic color (set by .primary, etc.)
//
// ----------------------------------------------------------------------------

// Semantic colors assignable to any control via class.
const SEMANTIC_COLORS = ["neutral", "primary", "secondary", "tertiary", "accent", "success", "warning", "danger", "info", "error"]

// --- Shorthand variable references (tokens defined in tokens.js) ---
const V = {
	color: "var(--ctrl-color, var(--control-color))",
	ink: "var(--color-ink)",
	paper: "var(--color-paper)",
	// Field defaults
	fieldTxBlend: "var(--ctrl-tx-blend, var(--control-field-tx-blend))",
	fieldBgBlend: "var(--ctrl-bg-blend, var(--control-field-bg-blend))",
	fieldBgOpacity: "var(--ctrl-bg-opacity, 100%)",
	fieldBdBlend: "var(--ctrl-bd-blend, var(--control-field-bd-blend))",
	fieldBdOpacity: "var(--ctrl-bd-opacity, var(--control-field-bd-opacity))",
	fieldBdWidth: "var(--control-field-bd-width)",
	fieldBdRadius: "var(--control-field-bd-radius)",
	// Button defaults
	btnBgBlend: "var(--ctrl-bg-blend, var(--control-button-bg-blend))",
	btnBdOpacity: "var(--ctrl-bd-opacity, var(--control-button-bd-opacity))",
	btnBdWidth: "var(--control-button-bd-width)",
	btnBdRadius: "var(--control-button-bd-radius)",
	// Focus ring
	focusOpacity: "var(--control-focus-ring-opacity)",
	focusWidth: "var(--control-focus-ring-width)",
	focusOffset: "var(--control-focus-ring-offset)",
	// Disabled
	disabledOpacity: "var(--control-disabled-opacity)",
}

// Shared state properties.
const DISABLED_PROPS = { opacity: V.disabledOpacity, cursor: "default", pointer_events: "none" }
const BLANK_PROPS = { color: "inherit", background: "transparent", border_width: "0px", outline: "none" }

// Emit disabled rule for a variant selector prefix (e.g., "&.outline").
function variantDisabled(prefix) { return rule(`${prefix}${DISABLED}`, { ...DISABLED_PROPS }) }

// Generate font/padding/margin overrides for a control type.
function controlFont(name) {
	return {
		font_family: `var(--${name}-font-family, var(--font-control-family, sans-serif))`,
		font_weight: `var(--${name}-font-weight, var(--font-control-weight, 500))`,
		font_size: `var(--${name}-font-size, var(--font-control-size, var(--font-size)))`,
		line_height: `var(--${name}-font-line, var(--font-control-line, 1em))`,
		padding: `var(--${name}-padding, 0.65em 1em)`,
		margin: `var(--${name}-margin, 0px)`,
	}
}

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
// COLOR HELPERS
//
// ----------------------------------------------------------------------------

// color-mix formula: mix base with tint at blend%, then apply opacity.
function cmix(base, tint, blend, opacity) {
	const inner = `color-mix(in oklch, ${base}, ${tint} ${blend})`
	if (opacity) return `color-mix(in oklch, ${inner}, transparent calc(100% - ${opacity}))`
	return inner
}

// Safe color property helpers — compute into a variable, reference with fallback.
// If color-mix() fails (vars unresolved), the fallback applies instead of black.
function safeColor(expr) { return { "--ctrl-tx": expr, color: "var(--ctrl-tx, inherit)" } }
function safeBg(expr) { return { "--ctrl-bg": expr, background: "var(--ctrl-bg, transparent)" } }
function safeBd(expr) { return { "--ctrl-bd": expr, border_color: "var(--ctrl-bd, transparent)" } }
function safeOl(expr) { return { "--ctrl-ol": expr, outline_color: "var(--ctrl-ol, transparent)" } }

// Precomputed color expressions using token variables.
const FIELD_TX = cmix(V.color, V.ink, V.fieldTxBlend)
const FIELD_BG = cmix(V.color, V.paper, V.fieldBgBlend, V.fieldBgOpacity)
const FIELD_BD = cmix(V.color, V.ink, V.fieldBdBlend, V.fieldBdOpacity)
const BUTTON_BG = cmix(V.color, V.paper, V.btnBgBlend)
const BUTTON_BD = cmix(V.color, V.ink, "85%", V.btnBdOpacity)
const FOCUS_RING = cmix(V.color, V.paper, "75%", V.focusOpacity)

// ----------------------------------------------------------------------------
//
// SHARED BASE — emitted once for ALL controls
//
// ----------------------------------------------------------------------------

function controlBase() {
	const semanticRules = SEMANTIC_COLORS.map((c) =>
		rule(`&.${c}`, { "--ctrl-color": `var(--color-${c})` })
	)

	return nesting([ALL_CONTROLS], {
		"--ctrl-color": "var(--control-color)",
		transition: "var(--control-transition)",
		// Safe defaults — no color-mix() here, so no FOUC
		border_color: "transparent",
		border_width: "0px",
		border_style: "solid",
		outline_color: "transparent",
		outline_width: V.focusWidth,
		outline_style: "solid",
		outline_offset: V.focusOffset,
	}, semanticRules)
}

// ----------------------------------------------------------------------------
//
// FIELD CATEGORY — input, textarea, select (+ unchecked toggles)
//
// ----------------------------------------------------------------------------

function fieldRules() {
	const children = []

	// -- Hover
	children.push(rule(`&${HOVER}`, {
		"--ctrl-bd-blend": "var(--control-field-hover-bd-blend)",
		"--ctrl-bd-opacity": "var(--control-field-hover-bd-opacity)",
	}))

	// -- Focus
	children.push(rule(`&${FOCUS}`, {
		"--ctrl-bd-blend": "var(--control-field-focus-bd-blend)",
		"--ctrl-bd-opacity": "var(--control-field-focus-bd-opacity)",
		outline_color: FOCUS_RING,
	}))

	// -- Active
	children.push(rule(`&${ACTIVE}`, {
		"--ctrl-bg-blend": "98%",
	}))

	// -- Disabled
	children.push(rule(`&${DISABLED}`, {
		...DISABLED_PROPS,
	}))

	// -- Invalid
	children.push(rule(`&${INVALID}`, {
		border_color: cmix("var(--color-danger)", V.ink, "80%", "50%"),
	}))
	children.push(rule(`&${INVALID}${FOCUS}`, {
		outline_color: cmix("var(--color-danger)", V.paper, "75%", V.focusOpacity),
	}))

	// -- Variants
	children.push(rule("&.outline", {
		background: "transparent",
		"--ctrl-bd-opacity": "var(--control-outline-bd-opacity)",
	}))
	children.push(rule(`&.outline${HOVER}`, {
		"--ctrl-bd-opacity": "55%",
		"--ctrl-bd-blend": "75%",
	}))
	children.push(rule(`&.outline${FOCUS}`, {
		"--ctrl-bd-opacity": "60%",
		"--ctrl-bd-blend": "70%",
		outline_color: FOCUS_RING,
	}))
	children.push(variantDisabled("&.outline"))
	children.push(rule(`&.outline${INVALID}`, {
		border_color: cmix("var(--color-danger)", V.ink, "80%", "50%"),
	}))

	children.push(rule("&.ghost", {
		background: "transparent",
		border_width: "0px",
	}))
	children.push(rule(`&.ghost${HOVER}`, {
		background: cmix(V.color, V.ink, "95%", "8%"),
	}))
	children.push(rule(`&.ghost${FOCUS}`, {
		outline_color: FOCUS_RING,
	}))
	children.push(variantDisabled("&.ghost"))

	children.push(rule("&.blank", BLANK_PROPS))

	return nesting([FIELD_SEL], {
		color: FIELD_TX,
		background: FIELD_BG,
		border_color: FIELD_BD,
		border_width: V.fieldBdWidth,
		border_radius: V.fieldBdRadius,
		border_style: "solid",
		...controlFont("input"),
	}, children)
}

// Textarea gets same styling but its own identity vars.
function textareaRules() {
	return rule(["textarea", ".textarea"], {
		...controlFont("textarea"),
	})
}

// Select arrow styling.
function selectRules() {
	const arrowColor = cmix(V.color, V.ink, "80%", "var(--ctrl-arrow-opacity, 60%)")
	const children = []

	children.push(rule(`&${HOVER}`, { "--ctrl-arrow-opacity": "75%" }))
	children.push(rule(`&${DISABLED}`, { "--ctrl-arrow-opacity": "30%" }))

	return nesting(["select", ".select"], {
		...controlFont("select"),
		"--ctrl-arrow-color": arrowColor,
	}, children)
}

// ----------------------------------------------------------------------------
//
// BUTTON CATEGORY — button (+ checked toggles, selected options)
//
// ----------------------------------------------------------------------------

function buttonRules() {
	const children = []

	// -- Hover: blend toward paper
	children.push(rule(`&${HOVER}`, {
		"--ctrl-bg-blend": "var(--control-button-hover-bg-blend)",
	}))

	// -- Active: blend toward ink
	children.push(rule(`&${ACTIVE}`, {
		background: cmix(V.color, V.ink, "var(--control-button-active-bg-blend)"),
	}))

	// -- Focus
	children.push(rule(`&${FOCUS}`, {
		outline_color: FOCUS_RING,
	}))

	// -- Disabled
	children.push(rule(`&${DISABLED}`, {
		...DISABLED_PROPS,
	}))

	// -- Variants
	children.push(rule("&.outline", {
		color: cmix(V.color, V.ink, "40%"),
		background: "transparent",
		"--ctrl-bd-opacity": "60%",
	}))
	children.push(rule(`&.outline${HOVER}`, {
		background: cmix(V.color, V.paper, "80%", "90%"),
	}))
	children.push(rule(`&.outline${ACTIVE}`, {
		background: cmix(V.color, V.paper, "70%", "80%"),
	}))
	children.push(rule(`&.outline${FOCUS}`, {
		outline_color: FOCUS_RING,
	}))
	children.push(variantDisabled("&.outline"))

	children.push(rule("&.ghost", {
		color: cmix(V.color, V.ink, "40%"),
		background: "transparent",
		border_width: "0px",
	}))
	children.push(rule(`&.ghost${HOVER}`, {
		background: cmix(V.color, V.ink, "95%", "8%"),
	}))
	children.push(rule(`&.ghost${ACTIVE}`, {
		background: cmix(V.color, V.ink, "95%", "12%"),
	}))
	children.push(rule(`&.ghost${FOCUS}`, {
		outline_color: FOCUS_RING,
	}))
	children.push(variantDisabled("&.ghost"))

	children.push(rule("&.blank", BLANK_PROPS))

	return nesting([BUTTON_SEL], {
		color: "contrast-color(var(--ctrl-bg, var(--color-paper)))",
		"--ctrl-bg": BUTTON_BG,
		background: BUTTON_BG,
		border_color: BUTTON_BD,
		border_width: V.btnBdWidth,
		border_radius: V.btnBdRadius,
		border_style: "solid",
		cursor: "pointer",
		...controlFont("button"),
	}, children)
}

// ----------------------------------------------------------------------------
//
// TOGGLE CONTROLS — checkbox, radio
//
// ----------------------------------------------------------------------------

function toggleRules() {
	const children = []

	// -- Unchecked hover: bolder border, slightly darker bg
	children.push(rule(`&${HOVER}`, {
		"--ctrl-bd-blend": "75%",
		"--ctrl-bd-opacity": "60%",
		"--ctrl-bg-blend": "90%",
	}))

	// -- Focus
	children.push(rule(`&${FOCUS}`, {
		outline_color: FOCUS_RING,
	}))

	// -- Disabled
	children.push(rule(`&${DISABLED}`, {
		...DISABLED_PROPS,
	}))

	// -- Checked: flip to button mode
	children.push(rule(`&${CHECKED}`, {
		"--ctrl-bg": BUTTON_BG,
		background: BUTTON_BG,
		border_color: BUTTON_BD,
		"--ctrl-sub-color": "contrast-color(var(--ctrl-bg, var(--color-paper)))",
	}))
	children.push(rule(`&${CHECKED}${HOVER}`, {
		background: cmix(V.color, V.ink, "10%"),
	}))

	// -- Indeterminate
	children.push(rule("&:indeterminate", {
		"--ctrl-bg": BUTTON_BG,
		background: BUTTON_BG,
		border_color: BUTTON_BD,
		"--ctrl-sub-color": "contrast-color(var(--ctrl-bg, var(--color-paper)))",
	}))

	// -- Outline variant
	children.push(rule("&.outline", {
		background: "transparent",
		"--ctrl-bd-opacity": "var(--control-outline-bd-opacity)",
	}))
	children.push(rule(`&.outline${HOVER}`, {
		"--ctrl-bd-opacity": "55%",
		"--ctrl-bd-blend": "75%",
	}))
	children.push(rule(`&.outline${FOCUS}`, {
		outline_color: FOCUS_RING,
	}))
	children.push(rule(`&.outline${CHECKED}`, {
		"--ctrl-bd-opacity": "60%",
		"--ctrl-bd-blend": "75%",
		background: "transparent",
		"--ctrl-sub-color": cmix(V.color, V.ink, "25%"),
	}))
	children.push(rule(`&.outline${CHECKED}${HOVER}`, {
		"--ctrl-bd-opacity": "70%",
		"--ctrl-bd-blend": "70%",
		"--ctrl-sub-color": cmix(V.color, V.ink, "20%"),
	}))
	children.push(variantDisabled("&.outline"))

	// -- Blank variant
	children.push(rule("&.blank", BLANK_PROPS))
	children.push(rule(`&.blank${CHECKED}`, {
		"--ctrl-sub-color": "inherit",
	}))

	return nesting([TOGGLE_SEL], {
		appearance: "none",
		cursor: "pointer",
		width: "1.25em",
		height: "1.25em",
		min_width: "1.25em",
		min_height: "1.25em",
		padding: "0",
		display: "inline-flex",
		align_items: "center",
		justify_content: "center",
		flex_shrink: "0",
		vertical_align: "middle",
		box_sizing: "border-box",
		// Field-like base
		color: FIELD_TX,
		background: FIELD_BG,
		border_color: FIELD_BD,
		border_width: V.fieldBdWidth,
		border_style: "solid",
		// Toggles get more visible border
		"--ctrl-bd-opacity": "40%",
		"--ctrl-sub-color": "transparent",
	}, children)
}

// Checkbox-specific: checkmark pseudo-element.
function checkboxStructure() {
	const cbSel = ['input[type="checkbox"]', ".checkbox"]
	const rules = []

	rules.push(rule(cbSel, { border_radius: "0.25em" }))

	const afterSel = cbSel.map((s) => `${s}::after`)
	rules.push(rule(afterSel, {
		content: '""',
		display: "block",
		width: "0.3em",
		height: "0.55em",
		border: "solid var(--ctrl-sub-color, transparent)",
		border_width: "0 0.16em 0.16em 0",
		transform: "rotate(45deg) translate(-0.01em, -0.01em)",
		transition: "var(--control-transition)",
	}))

	const indeterminateSel = cbSel.map((s) => `${s}:indeterminate::after`)
	rules.push(rule(indeterminateSel, {
		width: "0.5em",
		height: "0",
		border_width: "0 0 0.16em 0",
		transform: "none",
	}))

	return group(...rules)
}

// Radio-specific: dot pseudo-element.
function radioStructure() {
	const rdSel = ['input[type="radio"]', ".radio"]
	const rules = []

	rules.push(rule(rdSel, { border_radius: "50%" }))

	const afterSel = rdSel.map((s) => `${s}::after`)
	rules.push(rule(afterSel, {
		content: '""',
		display: "block",
		width: "0.55em",
		height: "0.55em",
		border_radius: "50%",
		background: "var(--ctrl-sub-color, transparent)",
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
		outline_color: FOCUS_RING,
	}))
	children.push(rule(`&${DISABLED}`, {
		...DISABLED_PROPS,
	}))

	return nesting([SELECTOR_SEL], {
		display: "inline-flex",
		flex_wrap: "nowrap",
		align_items: "center",
		gap: "2px",
		padding: "2px",
		width: "fit-content",
		background: "transparent",
		border_color: cmix(V.color, V.ink, "20%", "50%"),
		border_width: "1px",
		border_radius: V.fieldBdRadius,
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
		background: cmix(V.color, V.ink, "95%", "8%"),
	}))
	children.push(rule(`&${ACTIVE}`, {
		background: cmix(V.color, V.ink, "95%", "12%"),
	}))

	// -- Selected: flip to button mode
	children.push(rule(`&${CHECKED}`, {
		color: "contrast-color(var(--ctrl-bg, var(--color-paper)))",
		"--ctrl-bg": BUTTON_BG,
		background: BUTTON_BG,
	}))
	children.push(rule(`&${CHECKED}${HOVER}`, {
		background: cmix(V.color, V.paper, "20%"),
	}))
	children.push(rule(`&${CHECKED}${ACTIVE}`, {
		background: cmix(V.color, V.ink, "20%"),
	}))

	// -- Disabled
	children.push(rule(`&${DISABLED}`, {
		...DISABLED_PROPS,
	}))

	// -- :checked + label mirroring
	const checkedLabel = [
		".selector > input:checked + label",
		".selector > input:checked + .option",
	]
	children.push(rule(checkedLabel, {
		color: "contrast-color(var(--ctrl-bg, var(--color-paper)))",
		"--ctrl-bg": BUTTON_BG,
		background: BUTTON_BG,
	}))
	children.push(rule(checkedLabel.map((s) => `${s}:hover`), {
		background: cmix(V.color, V.paper, "20%"),
	}))
	children.push(rule(checkedLabel.map((s) => `${s}:active`), {
		background: cmix(V.color, V.ink, "20%"),
	}))

	return nesting([OPTION_SEL], {
		color: cmix(V.color, V.ink, "40%"),
		background: "transparent",
		border_width: "0px",
		border_radius: "4px",
		border_style: "solid",
		padding: "0.35em 0.75em",
		cursor: "pointer",
		user_select: "none",
		white_space: "nowrap",
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

	// Track = same as field border color
	const trackColor = FIELD_BD
	// Thumb = button-like
	const thumbBg = BUTTON_BG
	const thumbBd = BUTTON_BD

	// Selector helpers
	const sliderSel = (suffix = "") => SLIDER_SELECTORS.map((s) => `${s}${suffix}`)
	// Emit rules for both webkit and moz pseudo-elements.
	function vendorThumb(suffix, props, webkitExtra) {
		const wk = sliderSel(`${suffix}::-webkit-slider-thumb`)
		const mz = sliderSel(`${suffix}::-moz-range-thumb`)
		rules.push(rule(wk, webkitExtra ? { ...props, ...webkitExtra } : props))
		rules.push(rule(mz, props))
	}
	function vendorTrack(suffix, props) {
		rules.push(rule(sliderSel(`${suffix}::-webkit-slider-runnable-track`), props))
		rules.push(rule(sliderSel(`${suffix}::-moz-range-track`), props))
	}

	// Base
	rules.push(rule([SLIDER_SEL], {
		appearance: "none",
		cursor: "pointer",
		width: "100%",
		height: "auto",
		padding: "0.5em 0",
		background: "transparent",
		border: "none",
		outline_color: "transparent",
		outline_width: V.focusWidth,
		outline_style: "solid",
		outline_offset: V.focusOffset,
		"--ctrl-track-color": trackColor,
		"--ctrl-thumb-bg": thumbBg,
		"--ctrl-thumb-bd": `${V.btnBdWidth} solid ${thumbBd}`,
	}))

	// Track
	vendorTrack("", {
		height: V.fieldBdWidth,
		border_radius: V.fieldBdRadius,
		background: "var(--ctrl-track-color)",
		transition: "var(--control-transition)",
	})

	// Thumb — round button
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
	vendorThumb("", thumbProps, { margin_top: `calc((1.25em - ${V.fieldBdWidth}) / -2)` })

	// Hover
	rules.push(rule(sliderSel(":hover"), {
		"--ctrl-track-color": cmix(V.color, V.ink, "82%", "40%"),
		"--ctrl-thumb-bg": cmix(V.color, V.paper, "20%"),
	}))
	vendorThumb(":hover", { transform: "scale(1.15)" })

	// Active
	rules.push(rule(sliderSel(":active"), {
		"--ctrl-thumb-bg": cmix(V.color, V.ink, "20%"),
	}))

	// Focus
	rules.push(rule(sliderSel(":focus-visible"), {
		outline_color: FOCUS_RING,
	}))
	vendorThumb(":focus-visible", {
		outline: `${V.focusWidth} solid ${cmix(V.color, V.paper, "50%")}`,
		outline_offset: V.focusOffset,
	})

	// Disabled
	rules.push(rule(SLIDER_SELECTORS.flatMap((s) => [`${s}[disabled]`, `${s}.disabled`]), {
		...DISABLED_PROPS,
	}))

	// Blank variant
	rules.push(rule(sliderSel(".blank"), {
		outline: "none",
		"--ctrl-track-color": cmix(V.color, V.ink, "90%", "10%"),
		"--ctrl-thumb-bg": cmix(V.color, V.ink, "25%"),
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
		background: "transparent",
		border_color: cmix(V.color, V.ink, "80%", "40%"),
	}))
	children.push(rule("&.blank", BLANK_PROPS))

	return nesting([PANEL_SEL], {
		color: FIELD_TX,
		background: cmix(V.color, V.paper, "4%"),
		border_color: cmix(V.color, V.paper, "14%"),
		border_width: V.fieldBdWidth,
		border_radius: V.fieldBdRadius,
		border_style: "solid",
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
