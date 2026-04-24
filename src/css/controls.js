import { group, nesting, rule, vars, where } from "../js/uicss.js"

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
const v = {
	color: vars.ctrl.color.or(vars.control.color),
	ink: vars.color.ink,
	paper: vars.color.paper,
	// Field defaults
	fieldTxBlend: vars.ctrl.tx.blend.or(vars.control.field.tx.blend),
	fieldBgBlend: vars.ctrl.bg.blend.or(vars.control.field.bg.blend),
	fieldBgOpacity: vars.ctrl.bg.opacity.or("100%"),
	fieldBdBlend: vars.ctrl.bd.blend.or(vars.control.field.bd.blend),
	fieldBdOpacity: vars.ctrl.bd.opacity.or(vars.control.field.bd.opacity),
	fieldBdWidth: vars.control.field.bd.width,
	fieldBdRadius: vars.control.field.bd.radius,
	// Button defaults
	btnBgBlend: vars.ctrl.bg.blend.or(vars.control.button.bg.blend),
	btnBdOpacity: vars.ctrl.bd.opacity.or(vars.control.button.bd.opacity),
	btnBdWidth: vars.control.button.bd.width,
	btnBdRadius: vars.control.button.bd.radius,
	// Focus ring
	focusOpacity: vars.control.focus.ring.opacity,
	focusWidth: vars.control.focus.ring.width,
	focusOffset: vars.control.focus.ring.offset,
	// Disabled
	disabledOpacity: vars.control.disabled.opacity,
}

// ----------------------------------------------------------------------------
//
// SELECTORS
//
// ----------------------------------------------------------------------------

const fieldSelectors = [
	"input:not([type=checkbox]):not([type=radio]):not([type=range])",
	".input", "textarea", ".textarea", "select", ".select",
]
const toggleSelectors = [
	'input[type="checkbox"]', ".checkbox",
	'input[type="radio"]', ".radio",
]
const buttonSelectors = ["button", ".button"]
const sliderSelectors = ['input[type="range"]', ".range", ".slider"]
const selectorSelectors = [".selector"]
const optionSelectors = [".selector > .option", ".selector > label", ".selector > button", ".selector > a"]
const panelSelectors = [".panel"]

const allControls = where(
	fieldSelectors, toggleSelectors, buttonSelectors,
	sliderSelectors, selectorSelectors,
	panelSelectors,
)

// State selector fragments.
const hover = ":is(:hover, .hover)"
const active = ":is(:active, .active)"
const focus = ":is(:focus-visible, .focus)"
const disabled = ":is([disabled], .disabled)"
const checked = ":is(:checked, .selected)"
const invalid = ":is(:invalid, .invalid)"

// ----------------------------------------------------------------------------
//
// HELPERS
//
// ----------------------------------------------------------------------------

// Shared state properties.
const disable = { opacity: v.disabledOpacity, cursor: "default", pointer_events: "none" }
const blank = { color: "inherit", background: "transparent", border_width: "0px", outline: "none" }

// Emit disabled rule for a variant selector prefix (e.g., "&.outline").
function disabledVariant(prefix) { return rule(`${prefix}${disabled}`, { ...disable }) }

// Generate font/padding/margin overrides for a control type.
function font(name) {
	const n = vars[name]
	return {
		font_family: n.font.family.or(`${vars.font.control.family.or("sans-serif")}`),
		font_weight: n.font.weight.or(`${vars.font.control.weight.or("500")}`),
		font_size: n.font.size.or(`${vars.font.control.size.or(`${vars.font.size}`)}`),
		line_height: n.font.line.or(`${vars.font.control.line.or("1em")}`),
		padding: n.padding.or("0.65em 1em"),
		margin: n.margin.or("0px"),
	}
}

// color-mix formula: mix base with tint at blend%, then apply opacity.
function cmix(base, tint, blend, opacity) {
	const inner = `color-mix(in oklch, ${base}, ${tint} ${blend})`
	if (opacity) return `color-mix(in oklch, ${inner}, transparent calc(100% - ${opacity}))`
	return inner
}

// Precomputed color expressions using token variables.
const fieldTx = cmix(v.color, v.ink, v.fieldTxBlend)
const fieldBg = cmix(v.color, v.paper, v.fieldBgBlend, v.fieldBgOpacity)
const fieldBd = cmix(v.color, v.ink, v.fieldBdBlend, v.fieldBdOpacity)
const buttonBg = cmix(v.color, v.paper, v.btnBgBlend)
const buttonBd = cmix(v.color, v.ink, "85%", v.btnBdOpacity)
const focusRing = cmix(v.color, v.paper, "75%", v.focusOpacity)

// ----------------------------------------------------------------------------
//
// SHARED BASE — emitted once for ALL controls
//
// ----------------------------------------------------------------------------

function base() {
	const semanticRules = SEMANTIC_COLORS.map((c) =>
		rule(`&.${c}`, { __ctrl_color: `${vars.color[c]}` })
	)

	return nesting([allControls], {
		__ctrl_color: `${vars.control.color}`,
		transition: `${vars.control.transition}`,
		border_color: "transparent",
		border_width: "0px",
		border_style: "solid",
		outline_color: "transparent",
		outline_width: v.focusWidth,
		outline_style: "solid",
		outline_offset: v.focusOffset,
	}, semanticRules)
}

// ----------------------------------------------------------------------------
//
// FIELD CATEGORY — input, textarea, select (+ unchecked toggles)
//
// ----------------------------------------------------------------------------

function field() {
	const children = []

	children.push(rule(`&${hover}`, {
		__ctrl_bd_blend: `${vars.control.field.hover.bd.blend}`,
		__ctrl_bd_opacity: `${vars.control.field.hover.bd.opacity}`,
	}))
	children.push(rule(`&${focus}`, {
		__ctrl_bd_blend: `${vars.control.field.focus.bd.blend}`,
		__ctrl_bd_opacity: `${vars.control.field.focus.bd.opacity}`,
		outline_color: focusRing,
	}))
	children.push(rule(`&${active}`, {
		__ctrl_bg_blend: "98%",
	}))
	children.push(rule(`&${disabled}`, { ...disable }))

	// Invalid
	children.push(rule(`&${invalid}`, {
		border_color: cmix(`${vars.color.danger}`, v.ink, "80%", "50%"),
	}))
	children.push(rule(`&${invalid}${focus}`, {
		outline_color: cmix(`${vars.color.danger}`, v.paper, "75%", v.focusOpacity),
	}))

	// Outline variant
	children.push(rule("&.outline", {
		background: "transparent",
		__ctrl_bd_opacity: `${vars.control.outline.bd.opacity}`,
	}))
	children.push(rule(`&.outline${hover}`, {
		__ctrl_bd_opacity: "55%",
		__ctrl_bd_blend: "75%",
	}))
	children.push(rule(`&.outline${focus}`, {
		__ctrl_bd_opacity: "60%",
		__ctrl_bd_blend: "70%",
		outline_color: focusRing,
	}))
	children.push(disabledVariant("&.outline"))
	children.push(rule(`&.outline${invalid}`, {
		border_color: cmix(`${vars.color.danger}`, v.ink, "80%", "50%"),
	}))

	// Ghost variant
	children.push(rule("&.ghost", {
		background: "transparent",
		border_width: "0px",
	}))
	children.push(rule(`&.ghost${hover}`, {
		background: cmix(v.color, v.ink, "95%", "8%"),
	}))
	children.push(rule(`&.ghost${focus}`, {
		outline_color: focusRing,
	}))
	children.push(disabledVariant("&.ghost"))

	children.push(rule("&.blank", blank))

	return nesting([where(fieldSelectors)], {
		color: fieldTx,
		background: fieldBg,
		border_color: fieldBd,
		border_width: v.fieldBdWidth,
		border_radius: v.fieldBdRadius,
		border_style: "solid",
		...font("input"),
	}, children)
}

function textarea() {
	return rule(["textarea", ".textarea"], {
		...font("textarea"),
	})
}

function select() {
	const arrowColor = cmix(v.color, v.ink, "80%", vars.ctrl.arrow.opacity.or("60%"))
	const children = []

	children.push(rule(`&${hover}`, { __ctrl_arrow_opacity: "75%" }))
	children.push(rule(`&${disabled}`, { __ctrl_arrow_opacity: "30%" }))

	return nesting(["select", ".select"], {
		...font("select"),
		__ctrl_arrow_color: arrowColor,
	}, children)
}

// ----------------------------------------------------------------------------
//
// BUTTON CATEGORY — button (+ checked toggles, selected options)
//
// ----------------------------------------------------------------------------

function button() {
	const children = []

	children.push(rule(`&${hover}`, {
		__ctrl_bg_blend: `${vars.control.button.hover.bg.blend}`,
	}))
	children.push(rule(`&${active}`, {
		background: cmix(v.color, v.ink, `${vars.control.button.active.bg.blend}`),
	}))
	children.push(rule(`&${focus}`, {
		outline_color: focusRing,
	}))
	children.push(rule(`&${disabled}`, { ...disable }))

	// Outline variant
	children.push(rule("&.outline", {
		color: cmix(v.color, v.ink, "40%"),
		background: "transparent",
		__ctrl_bd_opacity: "60%",
	}))
	children.push(rule(`&.outline${hover}`, {
		background: cmix(v.color, v.paper, "80%", "90%"),
	}))
	children.push(rule(`&.outline${active}`, {
		background: cmix(v.color, v.paper, "70%", "80%"),
	}))
	children.push(rule(`&.outline${focus}`, {
		outline_color: focusRing,
	}))
	children.push(disabledVariant("&.outline"))

	// Ghost variant
	children.push(rule("&.ghost", {
		color: cmix(v.color, v.ink, "40%"),
		background: "transparent",
		border_width: "0px",
	}))
	children.push(rule(`&.ghost${hover}`, {
		background: cmix(v.color, v.ink, "95%", "8%"),
	}))
	children.push(rule(`&.ghost${active}`, {
		background: cmix(v.color, v.ink, "95%", "12%"),
	}))
	children.push(rule(`&.ghost${focus}`, {
		outline_color: focusRing,
	}))
	children.push(disabledVariant("&.ghost"))

	children.push(rule("&.blank", blank))

	return nesting([where(buttonSelectors)], {
		color: `contrast-color(${vars.ctrl.bg.or(vars.color.paper)})`,
		__ctrl_bg: buttonBg,
		background: buttonBg,
		border_color: buttonBd,
		border_width: v.btnBdWidth,
		border_radius: v.btnBdRadius,
		border_style: "solid",
		cursor: "pointer",
		...font("button"),
	}, children)
}

// ----------------------------------------------------------------------------
//
// TOGGLE CONTROLS — checkbox, radio
//
// ----------------------------------------------------------------------------

function toggle() {
	const children = []

	children.push(rule(`&${hover}`, {
		__ctrl_bd_blend: "75%",
		__ctrl_bd_opacity: "60%",
		__ctrl_bg_blend: "90%",
	}))
	children.push(rule(`&${focus}`, {
		outline_color: focusRing,
	}))
	children.push(rule(`&${disabled}`, { ...disable }))

	// Checked: flip to button mode
	children.push(rule(`&${checked}`, {
		__ctrl_bg: buttonBg,
		background: buttonBg,
		border_color: buttonBd,
		__ctrl_sub_color: `contrast-color(${vars.ctrl.bg.or(vars.color.paper)})`,
	}))
	children.push(rule(`&${checked}${hover}`, {
		background: cmix(v.color, v.ink, "10%"),
	}))

	// Indeterminate
	children.push(rule("&:indeterminate", {
		__ctrl_bg: buttonBg,
		background: buttonBg,
		border_color: buttonBd,
		__ctrl_sub_color: `contrast-color(${vars.ctrl.bg.or(vars.color.paper)})`,
	}))

	// Outline variant
	children.push(rule("&.outline", {
		background: "transparent",
		__ctrl_bd_opacity: `${vars.control.outline.bd.opacity}`,
	}))
	children.push(rule(`&.outline${hover}`, {
		__ctrl_bd_opacity: "55%",
		__ctrl_bd_blend: "75%",
	}))
	children.push(rule(`&.outline${focus}`, {
		outline_color: focusRing,
	}))
	children.push(rule(`&.outline${checked}`, {
		__ctrl_bd_opacity: "60%",
		__ctrl_bd_blend: "75%",
		background: "transparent",
		__ctrl_sub_color: cmix(v.color, v.ink, "25%"),
	}))
	children.push(rule(`&.outline${checked}${hover}`, {
		__ctrl_bd_opacity: "70%",
		__ctrl_bd_blend: "70%",
		__ctrl_sub_color: cmix(v.color, v.ink, "20%"),
	}))
	children.push(disabledVariant("&.outline"))

	// Blank variant
	children.push(rule("&.blank", blank))
	children.push(rule(`&.blank${checked}`, {
		__ctrl_sub_color: "inherit",
	}))

	return nesting([where(toggleSelectors)], {
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
		color: fieldTx,
		background: fieldBg,
		border_color: fieldBd,
		border_width: v.fieldBdWidth,
		border_style: "solid",
		__ctrl_bd_opacity: "40%",
		__ctrl_sub_color: "transparent",
	}, children)
}

function checkbox() {
	const sel = ['input[type="checkbox"]', ".checkbox"]
	const rules = []

	rules.push(rule(sel, { border_radius: "0.25em" }))

	rules.push(rule(sel.map((s) => `${s}::after`), {
		content: '""',
		display: "block",
		width: "0.3em",
		height: "0.55em",
		border: `solid ${vars.ctrl.sub.color.or("transparent")}`,
		border_width: "0 0.16em 0.16em 0",
		transform: "rotate(45deg) translate(-0.01em, -0.01em)",
		transition: `${vars.control.transition}`,
	}))

	rules.push(rule(sel.map((s) => `${s}:indeterminate::after`), {
		width: "0.5em",
		height: "0",
		border_width: "0 0 0.16em 0",
		transform: "none",
	}))

	return group(...rules)
}

function radio() {
	const sel = ['input[type="radio"]', ".radio"]
	const rules = []

	rules.push(rule(sel, { border_radius: "50%" }))

	rules.push(rule(sel.map((s) => `${s}::after`), {
		content: '""',
		display: "block",
		width: "0.55em",
		height: "0.55em",
		border_radius: "50%",
		background: vars.ctrl.sub.color.or("transparent"),
		transition: `${vars.control.transition}`,
	}))

	return group(...rules)
}

// ----------------------------------------------------------------------------
//
// SELECTOR — container + options
//
// ----------------------------------------------------------------------------

function selector() {
	const children = []

	children.push(rule("&:is(:focus-within, .focus)", {
		outline_color: cmix(`${vars.control.color}`, v.paper, "75%", v.focusOpacity),
	}))
	children.push(rule(`&${disabled}`, { ...disable }))

	return nesting([where(selectorSelectors)], {
		display: "inline-flex",
		flex_wrap: "nowrap",
		align_items: "center",
		gap: "2px",
		padding: "2px",
		width: "fit-content",
		background: "transparent",
		border_color: cmix(`${vars.control.color}`, v.ink, "20%", "50%"),
		border_width: "1px",
		border_radius: v.fieldBdRadius,
		border_style: "solid",
	}, children)
}

function selectorInput() {
	return rule([
		'.selector > input[type="radio"]',
		'.selector > input[type="checkbox"]',
	], {
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

function option() {
	const children = []

	children.push(rule(`&${hover}`, {
		background: cmix(v.color, v.ink, "95%", "8%"),
	}))
	children.push(rule(`&${active}`, {
		background: cmix(v.color, v.ink, "95%", "12%"),
	}))

	// Selected: flip to button mode
	children.push(rule(`&${checked}`, {
		color: `contrast-color(${vars.ctrl.bg.or(vars.color.paper)})`,
		__ctrl_bg: buttonBg,
		background: buttonBg,
	}))
	children.push(rule(`&${checked}${hover}`, {
		background: cmix(v.color, v.paper, "20%"),
	}))
	children.push(rule(`&${checked}${active}`, {
		background: cmix(v.color, v.ink, "20%"),
	}))

	children.push(rule(`&${disabled}`, { ...disable }))

	return nesting([where(optionSelectors)], {
		color: cmix(v.color, v.ink, "40%"),
		background: "transparent",
		border_width: "0px",
		border_radius: "4px",
		border_style: "solid",
		padding: "0.35em 0.75em",
		cursor: "pointer",
		user_select: "none",
		white_space: "nowrap",
		transition: `${vars.control.transition}`,
	}, children)
}

// :checked + label mirroring — must be top-level rules (not nested)
// so the adjacent-sibling combinator works correctly.
function checkedLabel() {
	const sel = [
		".selector > input:checked + label",
		".selector > input:checked + .option",
	]
	return group(
		rule(sel, {
			color: `contrast-color(${vars.ctrl.bg.or(vars.color.paper)})`,
			__ctrl_bg: buttonBg,
			background: buttonBg,
		}),
		rule(sel.map((s) => `${s}:hover`), {
			background: cmix(v.color, v.paper, "20%"),
		}),
		rule(sel.map((s) => `${s}:active`), {
			background: cmix(v.color, v.ink, "20%"),
		}),
	)
}

// ----------------------------------------------------------------------------
//
// SLIDER — range input
//
// ----------------------------------------------------------------------------

function slider() {
	const rules = []
	const trackColor = fieldBd
	const thumbBg = buttonBg
	const thumbBd = buttonBd

	const sliderSel = (suffix = "") => sliderSelectors.map((s) => `${s}${suffix}`)
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
	rules.push(rule([where(sliderSelectors)], {
		appearance: "none",
		cursor: "pointer",
		width: "100%",
		height: "auto",
		padding: "0.5em 0",
		background: "transparent",
		border: "none",
		outline_color: "transparent",
		outline_width: v.focusWidth,
		outline_style: "solid",
		outline_offset: v.focusOffset,
		__ctrl_track_color: trackColor,
		__ctrl_thumb_bg: thumbBg,
		__ctrl_thumb_bd: `${v.btnBdWidth} solid ${thumbBd}`,
	}))

	// Track
	vendorTrack("", {
		height: v.fieldBdWidth,
		border_radius: v.fieldBdRadius,
		background: `${vars.ctrl.track.color}`,
		transition: `${vars.control.transition}`,
	})

	// Thumb
	const thumbProps = {
		appearance: "none",
		width: "1.25em",
		height: "1.25em",
		border_radius: "50%",
		background: `${vars.ctrl.thumb.bg}`,
		border: `${vars.ctrl.thumb.bd}`,
		cursor: "pointer",
		transition: `${vars.control.transition}`,
	}
	vendorThumb("", thumbProps, { margin_top: `calc((1.25em - ${v.fieldBdWidth}) / -2)` })

	// Hover
	rules.push(rule(sliderSel(":hover"), {
		__ctrl_track_color: cmix(v.color, v.ink, "82%", "40%"),
		__ctrl_thumb_bg: cmix(v.color, v.paper, "20%"),
	}))
	vendorThumb(":hover", { transform: "scale(1.15)" })

	// Active
	rules.push(rule(sliderSel(":active"), {
		__ctrl_thumb_bg: cmix(v.color, v.ink, "20%"),
	}))

	// Focus
	rules.push(rule(sliderSel(":focus-visible"), {
		outline_color: focusRing,
	}))
	vendorThumb(":focus-visible", {
		outline: `${v.focusWidth} solid ${cmix(v.color, v.paper, "50%")}`,
		outline_offset: v.focusOffset,
	})

	// Disabled
	rules.push(rule(sliderSelectors.flatMap((s) => [`${s}[disabled]`, `${s}.disabled`]), {
		...disable,
	}))

	// Blank variant
	rules.push(rule(sliderSel(".blank"), {
		outline: "none",
		__ctrl_track_color: cmix(v.color, v.ink, "90%", "10%"),
		__ctrl_thumb_bg: cmix(v.color, v.ink, "25%"),
		__ctrl_thumb_bd: "none",
	}))

	return group(...rules)
}

// ----------------------------------------------------------------------------
//
// PANEL
//
// ----------------------------------------------------------------------------

function panel() {
	const children = []

	children.push(rule("&.outline", {
		background: "transparent",
		border_color: cmix(v.color, v.ink, "80%", "40%"),
	}))
	children.push(rule("&.blank", blank))

	return nesting([where(panelSelectors)], {
		color: fieldTx,
		background: cmix(v.color, v.paper, "4%"),
		border_color: cmix(v.color, v.paper, "14%"),
		border_width: v.fieldBdWidth,
		border_radius: v.fieldBdRadius,
		border_style: "solid",
	}, children)
}

// ----------------------------------------------------------------------------

export { panel, SEMANTIC_COLORS }
export default group(
	base(),
	field(),
	textarea(),
	select(),
	button(),
	toggle(),
	checkbox(),
	radio(),
	selector(),
	selectorInput(),
	option(),
	checkedLabel(),
	slider(),
)
// EOF
