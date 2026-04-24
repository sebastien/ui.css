import { contrast as contrastColor, group, rule, vars } from "../js/uicss.js"
import { colormixin } from "./colors.js"
import DEFAULTS_SPEC from "./controls.defaults.js"

// ----------------------------------------------------------------------------
//
// SHORTHAND PARSERS
//
// ----------------------------------------------------------------------------

// Property name expansions from shorthand keys.
const PROPS = { tx: "text", bg: "background", bd: "border", ol: "outline" }

// Color facets produced by the color pipeline.
const COLOR_FACETS = ["base", "tint", "blend", "opacity"]

// Structural facets for border/outline geometry.
const GEOM_FACETS = ["width", "radius"]

// Function: parseColor
// Parses a color shorthand into facet values.
// `.` means inherit (null). `0` means transparent. Returns `{base, tint, blend, opacity}`.
function parseColor(str) {
	const s = str.trim()
	if (s === "0") return { base: null, tint: null, blend: null, opacity: "0" }
	if (s === ".") return { base: null, tint: null, blend: null, opacity: null }
	if (s === "contrast") return { base: "contrast", tint: null, blend: null, opacity: null }
	if (s === "inherit") return { base: "inherit", tint: null, blend: null, opacity: null }

	const parts = s.split(/\s+/)
	const [rawBase, rawTint] = (parts[0] || "./.").split("/")

	if (rawBase === "contrast" || rawBase === "inherit") {
		const inh = (v) => (v === undefined || v === "." ? null : v)
		return { base: rawBase, tint: null, blend: null, opacity: inh(rawTint) }
	}

	const [rawBlend, rawOpacity] = (parts[1] || "./.").split("/")
	const inh = (v) => (v === undefined || v === "." ? null : v)
	return { base: inh(rawBase), tint: inh(rawTint), blend: inh(rawBlend), opacity: inh(rawOpacity) }
}

// Function: parseBorder
// Parses a border/outline shorthand. Returns `{width, radius, base, tint, blend, opacity}`.
function parseBorder(str) {
	const s = str.trim()
	if (s === "0") return { width: "0px", radius: null, base: null, tint: null, blend: null, opacity: "0" }
	if (s === ".") return { width: null, radius: null, base: null, tint: null, blend: null, opacity: null }

	const parts = s.split(/\s+/)

	// Legacy tilde form
	if (parts[0] && parts[0].includes("~")) {
		const [w, r] = parts[0].split("~")
		const inh = (v) => (v === "." || v === "_" ? null : v)
		const color = parseColor(parts.slice(1).join(" ") || "./. ./.")
		return { width: inh(w), radius: inh(r), ...color }
	}

	// Space form: "width radius color..."
	const isDim = (v) => /^[0-9.]/.test(v) || v === "." || /^(0|[0-9]+(%|px|em|rem|vw|vh))$/.test(v)
	if (parts.length >= 2 && isDim(parts[0]) && isDim(parts[1])) {
		const inh = (v) => (v === "." ? null : v)
		const color = parseColor(parts.slice(2).join(" ") || "./. ./.")
		return { width: inh(parts[0]), radius: inh(parts[1]), ...color }
	}

	const color = parseColor(s)
	return { width: null, radius: null, ...color }
}

// Function: parseProperty
// Dispatches to parseBorder for bd/ol, parseColor for tx/bg.
function parseProperty(key, value) {
	return (key === "bd" || key === "ol") ? parseBorder(value) : parseColor(value)
}

// ----------------------------------------------------------------------------
//
// TEXT TREE PARSER
//
// ----------------------------------------------------------------------------

function measureIndent(line) {
	const m = line.match(/^(\s*)/)
	const leading = m ? m[1] : ""
	return leading.includes("\t") ? leading.split("\t").length - 1 : leading.length
}

function detectIndent(lines) {
	let baseIndent = 0
	let indentUnit = 0
	for (const raw of lines) {
		const stripped = raw.replace(/#.*$/, "").trimEnd()
		if (stripped.trim() === "") continue
		baseIndent = measureIndent(stripped)
		break
	}
	for (const raw of lines) {
		const stripped = raw.replace(/#.*$/, "").trimEnd()
		if (stripped.trim() === "") continue
		const len = measureIndent(stripped)
		if (len > baseIndent) { indentUnit = len - baseIndent; break }
	}
	return { baseIndent, indentUnit: indentUnit || 1 }
}

// Function: parseTree
// Parses spec-003 indented text into `{ name: { control, definition } }`.
function parseTree(text) {
	const lines = text.split("\n")
	const result = {}
	let control = null, currentVariant = null, currentState = null, currentSubElement = null, definition = null
	const { baseIndent, indentUnit } = detectIndent(lines)

	for (const raw of lines) {
		const stripped = raw.replace(/#.*$/, "").trimEnd()
		if (stripped.trim() === "") continue
		const depth = Math.round((measureIndent(stripped) - baseIndent) / indentUnit)
		const content = stripped.trim()
		if (!content) continue
		const colonIdx = content.indexOf(":")
		if (colonIdx < 0) continue
		const key = content.substring(0, colonIdx).trim()
		const value = content.substring(colonIdx + 1).trim()

		if (depth === 0) {
			control = key; definition = {}; currentVariant = null; currentState = null; currentSubElement = null
			result[control] = { control, definition }
		} else if (depth === 1 && definition) {
			currentVariant = key; if (!definition[currentVariant]) definition[currentVariant] = {}
			currentState = null; currentSubElement = null
		} else if (depth === 2 && key.startsWith("!") && definition && currentVariant) {
			currentState = key.substring(1)
			if (!definition[currentVariant][currentState]) definition[currentVariant][currentState] = {}
			currentSubElement = null
		} else if (depth === 3 && definition && currentVariant && currentState) {
			if (value === "" || value === undefined) { currentSubElement = key }
			else if (currentSubElement) { definition[currentVariant][currentState][`${currentSubElement}.${key}`] = value }
			else { definition[currentVariant][currentState][key] = value }
		} else if (depth === 4 && definition && currentVariant && currentState && currentSubElement && value) {
			definition[currentVariant][currentState][`${currentSubElement}.${key}`] = value
		}
	}

	const keys = Object.keys(result)
	if (keys.length === 1) { result.control = result[keys[0]].control; result.definition = result[keys[0]].definition }
	return result
}

// Function: style
// Tagged template literal for spec-003 shorthand.
function style(strings, ...values) {
	const text = Array.isArray(strings) ? strings.reduce((r, s, i) => r + s + (values[i] ?? ""), "") : strings
	return parseTree(text)
}

const DEFAULTS = style(DEFAULTS_SPEC)

// ----------------------------------------------------------------------------
//
// COLOR RESOLUTION — direct CSS values
//
// ----------------------------------------------------------------------------

// Resolve a color name to a CSS value.
function resolveColorName(name) {
	if (!name) return null
	if (name === "contrast") return "contrast"
	if (name === "inherit") return "inherit"
	if (name === "transparent") return "transparent"
	// BASE_COLOR placeholder → the control's runtime color variable
	if (name === BASE_COLOR || name === "self") return "var(--ctrl-color)"
	// Already a CSS expression (from FACET_DEFAULTS)
	if (name.startsWith("var(") || name.startsWith("#") || name.startsWith("color-mix(")) return name
	return `var(--color-${name})`
}

// Normalize blend to percentage string.
function normalizeBlend(v) {
	if (!v) return null
	if (v.endsWith("%")) return v
	const n = Number.parseFloat(v)
	return Number.isNaN(n) ? v : `${n}%`
}

// Normalize opacity to percentage string.
function normalizeOpacity(v) {
	if (!v) return null
	if (v === "0") return "0%"
	if (v.endsWith("%")) return v
	const n = Number.parseFloat(v)
	if (Number.isNaN(n)) return v
	return n > 1 ? `${n}%` : `${Math.round(n * 100)}%`
}

// ----------------------------------------------------------------------------
//
// FACET RESOLUTION WITH INHERITANCE
//
// ----------------------------------------------------------------------------

// Default facet values when nothing is specified.
// The base for bg/bd/ol uses the control's --color variable (set per semantic class).
// This is a placeholder that gets replaced with the control-specific variable in buildColorValue.
const BASE_COLOR = "__CONTROL_COLOR__"
const FACET_DEFAULTS = {
	text: { base: "var(--color-ink)", tint: "var(--color-ink)", blend: "0%", opacity: "100%" },
	background: { base: BASE_COLOR, tint: "var(--color-paper)", blend: "100%", opacity: "100%" },
	border: { base: BASE_COLOR, tint: "var(--color-paper)", blend: "80%", opacity: "100%", width: "1px", radius: "4px" },
	outline: { base: BASE_COLOR, tint: "var(--color-paper)", blend: "80%", opacity: "0%", width: "2px", radius: "4px" },
}

// Function: resolveAllFacets
// For a given variant+state, resolves all facets for a property by walking
// the inheritance chain: state → variant default → definition default → FACET_DEFAULTS.
function resolveAllFacets(definition, variant, state, shortKey) {
	const propName = PROPS[shortKey]
	const isEdge = shortKey === "bd" || shortKey === "ol"
	const facetNames = isEdge ? [...COLOR_FACETS, ...GEOM_FACETS] : COLOR_FACETS
	const defaults = FACET_DEFAULTS[propName] || {}

	// Collect all parsed values at each level of the chain
	const getValue = (v, s) => {
		const raw = definition[v]?.[s]?.[shortKey]
		return raw ? parseProperty(shortKey, raw) : null
	}

	const layers = []
	// 1. Current variant+state
	const current = getValue(variant, state)
	if (current) layers.push(current)
	// 2. Current variant default state (for state inheritance within same variant)
	if (state !== "default") {
		const vDefault = getValue(variant, "default")
		if (vDefault) layers.push(vDefault)
	}

	// If the current variant defines this property at all (in any state above),
	// don't fall through to the default variant — fill from FACET_DEFAULTS instead.
	// Only fall through to default variant if the current variant never defines this property.
	if (layers.length === 0 && variant !== "default") {
		// Current variant doesn't define this property — try default variant
		const dState = getValue("default", state)
		if (dState) layers.push(dState)
		const dDefault = getValue("default", "default")
		if (dDefault) layers.push(dDefault)
	}

	if (layers.length === 0) {
		return { ...defaults }
	}

	// Per-facet merge across layers (within same variant or default fallback)
	const result = {}
	for (const facet of facetNames) {
		for (const layer of layers) {
			if (layer[facet] !== null && layer[facet] !== undefined) {
				result[facet] = layer[facet]
				break
			}
		}
		if (result[facet] === undefined) result[facet] = defaults[facet] || null
	}
	return result
}

// Function: resolveSubFacets
// Same as resolveAllFacets but for sub-element properties like "marker.bg".
function resolveSubFacets(definition, variant, state, subElement, shortKey) {
	const propName = PROPS[shortKey]
	const isEdge = shortKey === "bd" || shortKey === "ol"
	const facetNames = isEdge ? [...COLOR_FACETS, ...GEOM_FACETS] : COLOR_FACETS
	const defaults = FACET_DEFAULTS[propName] || {}
	const fullKey = `${subElement}.${shortKey}`

	const getValue = (v, s) => {
		const raw = definition[v]?.[s]?.[fullKey]
		return raw ? parseProperty(shortKey, raw) : null
	}

	const layers = []
	const current = getValue(variant, state)
	if (current) layers.push(current)
	if (state !== "default") {
		const vDefault = getValue(variant, "default")
		if (vDefault) layers.push(vDefault)
	}
	if (layers.length === 0 && variant !== "default") {
		const dState = getValue("default", state)
		if (dState) layers.push(dState)
		const dDefault = getValue("default", "default")
		if (dDefault) layers.push(dDefault)
	}

	const result = {}
	if (layers.length === 0) return { ...defaults }
	for (const facet of facetNames) {
		for (const layer of layers) {
			if (layer[facet] !== null && layer[facet] !== undefined) {
				result[facet] = layer[facet]
				break
			}
		}
		if (result[facet] === undefined) result[facet] = defaults[facet] || null
	}
	return result
}

// Function: buildColorValue
// Builds a CSS color value from resolved facets.
function buildColorValue(facets) {
	const base = resolveColorName(facets.base)
	const tint = resolveColorName(facets.tint)
	const blend = normalizeBlend(facets.blend)
	const opacity = normalizeOpacity(facets.opacity)

	if (!base) return null

	// Special: contrast uses contrast-color()
	if (base === "contrast") {
		if (opacity && opacity !== "100%") {
			return `color-mix(in oklch, contrast-color(var(--ctrl-bg, var(--color-paper))), transparent calc(100% - ${opacity}))`
		}
		return `contrast-color(var(--ctrl-bg, var(--color-paper)))`
	}

	// Special: inherit
	if (base === "inherit") {
		if (opacity && opacity !== "100%") {
			return `color-mix(in oklch, inherit, transparent calc(100% - ${opacity}))`
		}
		return "inherit"
	}

	// Special: transparent shorthand (opacity=0)
	if (opacity === "0%") return "transparent"

	// Normal color-mix
	// Spec blend: 0% = pure base, 100% = pure tint.
	// We emit color-mix directly: tint percentage = blend.
	const b = blend || "0%"
	const o = opacity || "100%"
	const inner = `color-mix(in oklch, ${base}, ${tint || base} ${b})`
	if (o !== "100%") {
		return `color-mix(in oklch, ${inner}, transparent calc(100% - ${o}))`
	}
	return inner
}

// Function: buildCSSProps
// Builds the CSS property object for a given variant+state.
function buildCSSProps(definition, variant, state) {
	const props = {}

	// Text color
	const txFacets = resolveAllFacets(definition, variant, state, "tx")
	const txColor = buildColorValue(txFacets)
	if (txColor) props.color = txColor

	// Background
	const bgFacets = resolveAllFacets(definition, variant, state, "bg")
	const bgColor = buildColorValue(bgFacets)
	if (bgColor) {
		props.background = bgColor
		// Store for contrast-color reference
		if (bgColor !== "transparent" && bgColor !== "inherit") {
			props["--ctrl-bg"] = bgColor
		}
	}

	// Border
	const bdFacets = resolveAllFacets(definition, variant, state, "bd")
	const bdColor = buildColorValue(bdFacets)
	if (bdColor) props.border_color = bdColor
	if (bdFacets.width) props.border_width = bdFacets.width
	if (bdFacets.radius) props.border_radius = bdFacets.radius
	props.border_style = "solid"

	// Outline
	const olFacets = resolveAllFacets(definition, variant, state, "ol")
	const olColor = buildColorValue(olFacets)
	if (olColor) props.outline_color = olColor
	if (olFacets.width) props.outline_width = olFacets.width
	props.outline_style = "solid"
	props.outline_offset = "0px"

	return props
}

// Function: hasChanges
// Returns true if the variant+state has any explicit property declarations.
function hasChanges(definition, variant, state) {
	const stateProps = definition[variant]?.[state]
	return stateProps && Object.keys(stateProps).length > 0
}

// Function: changedProps
// Returns only the CSS properties that actually change relative to the base.
// For the default variant+default state, returns everything.
// For other states, returns only what the shorthand explicitly sets.
function changedProps(definition, variant, state) {
	const stateProps = definition[variant]?.[state]
	if (!stateProps) return {}
	const props = {}

	for (const rawKey in stateProps) {
		const dotIdx = rawKey.indexOf(".")
		if (dotIdx >= 0) continue // Skip sub-elements here

		const shortKey = rawKey
		const propName = PROPS[shortKey]
		if (!propName) continue

		const facets = resolveAllFacets(definition, variant, state, shortKey)

		if (propName === "text") {
			const v = buildColorValue(facets)
			if (v) props.color = v
		} else if (propName === "background") {
			const v = buildColorValue(facets)
			if (v) {
				props.background = v
				if (v !== "transparent" && v !== "inherit") props["--ctrl-bg"] = v
			}
		} else if (propName === "border") {
			const v = buildColorValue(facets)
			if (v) props.border_color = v
			if (facets.width) props.border_width = facets.width
			if (facets.radius) props.border_radius = facets.radius
		} else if (propName === "outline") {
			const v = buildColorValue(facets)
			if (v) props.outline_color = v
			if (facets.width) props.outline_width = facets.width
		}
	}

	return props
}

// ----------------------------------------------------------------------------
//
// STATE SELECTORS
//
// ----------------------------------------------------------------------------

const STATE_SELECTORS = {
	default: [],
	hover: [":hover", ".hover"],
	active: [":active", ".active"],
	focus: [":focus-visible", ":focus-within", ".focus"],
	"focus-within": [":focus-within"],
	disabled: ["[disabled]", ".disabled"],
	selected: [".selected", '[aria-pressed="true"]'],
	checked: [":checked"],
	indeterminate: [":indeterminate"],
	invalid: [":invalid", ".invalid"],
	readonly: ["[readonly]", ".readonly"],
}

function stateSelectors(state) {
	if (STATE_SELECTORS[state]) return STATE_SELECTORS[state]
	const parts = state.split("+")
	if (parts.length > 1) {
		const sets = parts.map((p) => STATE_SELECTORS[p] || [`.${p}`])
		let combos = [...sets[0]]
		for (let i = 1; i < sets.length; i++) {
			const next = []
			for (const a of combos) for (const b of sets[i]) next.push(`${a}${b}`)
			combos = next
		}
		return combos
	}
	return [`.${state}`]
}

// ----------------------------------------------------------------------------
//
// CONTROL SELECTORS
//
// ----------------------------------------------------------------------------

const SELECTORS = {
	button: ["button", ".button"],
	input: ["input:not([type=checkbox]):not([type=radio]):not([type=range])", ".input"],
	textarea: ["textarea", ".textarea"],
	select: ["select", ".select"],
	selectable: [".selectable"],
	selector: [".selector"],
	"selector.option": [".selector > .option", ".selector > label", ".selector > button", ".selector > a"],
	checkbox: ['input[type="checkbox"]', ".checkbox"],
	radio: ['input[type="radio"]', ".radio"],
	range: ['input[type="range"]', ".range"],
	slider: ['input[type="range"]', ".range", ".slider"],
	panel: [".panel"],
}

// ----------------------------------------------------------------------------
//
// CONTROL BUILDER
//
// ----------------------------------------------------------------------------

// Function: controlRules
// Generates CSS rules for a single control from its shorthand definition.
// Emits direct CSS properties (no --current-* indirection).
function controlRules(control, selectors, definition) {
	const rules = []

	// Base rule: font, padding, transition + default variant default state colors
	const CLICKABLE = new Set(["button", "selectable", "selector", "checkbox", "radio", "range", "slider"])
	const baseProps = buildCSSProps(definition, "default", "default")
	rules.push(rule(selectors, {
		"--ctrl-color": `var(--color-neutral)`,
		...(CLICKABLE.has(control) ? { cursor: "pointer" } : {}),
		font_family: `var(--${control}-font-family, var(--font-control-family, sans-serif))`,
		font_weight: `var(--${control}-font-weight, var(--font-control-weight, 500))`,
		font_size: `var(--${control}-font-size, var(--font-control-size, var(--font-size)))`,
		line_height: `var(--${control}-font-line, var(--font-control-line, 1em))`,
		padding: `var(--${control}-padding, 0.65em 1em)`,
		margin: `var(--${control}-margin, 0px)`,
		transition: `var(--control-transition)`,
		...baseProps,
	}))

	// Semantic color classes: .primary, .accent, etc. override --ctrl-color
	const SEMANTIC_COLORS = ["neutral", "primary", "secondary", "tertiary", "accent", "success", "warning", "danger", "info", "error"]
	for (const color of SEMANTIC_COLORS) {
		const sel = selectors.map((s) => `${s}.${color}`)
		rules.push(rule(sel, { "--ctrl-color": `var(--color-${color})` }))
	}

	// Variant + state rules
	for (const variant in definition) {
		for (const state in definition[variant]) {
			// Skip default+default (already in base rule)
			if (variant === "default" && state === "default") continue

			// For variant defaults, use full resolution; for states, only changes
			const props = (state === "default" && variant !== "default")
				? buildCSSProps(definition, variant, state)
				: changedProps(definition, variant, state)
			if (Object.keys(props).length === 0) continue

			// Build selectors
			let sel
			if (state === "default" && variant !== "default") {
				sel = selectors.map((s) => `${s}.${variant}`)
			} else if (variant === "default") {
				const suffixes = stateSelectors(state)
				sel = suffixes.flatMap((m) => selectors.map((s) => `${s}${m}`))
			} else {
				const variantSel = selectors.map((s) => `${s}.${variant}`)
				const suffixes = stateSelectors(state)
				sel = suffixes.flatMap((m) => variantSel.map((s) => `${s}${m}`))
			}

			// Add disabled extras
			if (state === "disabled") {
				props.cursor = "default"
				props.pointer_events = "none"
			}

			rules.push(rule(sel, props))
		}
	}

	// ----------------------------------------------------------------
	// Control-specific structural rules (pseudo-elements, sizing, etc.)
	// ----------------------------------------------------------------

	if (control === "checkbox") {
		// Checkbox: square box with checkmark pseudo-element
		rules.push(rule(selectors, {
			appearance: "none",
			width: "1.125em",
			height: "1.125em",
			min_width: "1.125em",
			min_height: "1.125em",
			padding: "0",
			border_radius: "0.2em",
			display: "inline-flex",
			align_items: "center",
			justify_content: "center",
			flex_shrink: "0",
			vertical_align: "middle",
			box_sizing: "border-box",
		}))
		const afterSel = selectors.map((s) => `${s}::after`)
		rules.push(rule(afterSel, {
			content: '""',
			display: "block",
			width: "0.35em",
			height: "0.6em",
			border: "solid transparent",
			border_width: "0 0.14em 0.14em 0",
			transform: "rotate(45deg) translate(-0.02em, -0.02em)",
			transition: "var(--control-transition)",
		}))
		const checkedAfterSel = selectors.flatMap((s) => [
			`${s}:checked::after`, `${s}.selected::after`,
		])
		rules.push(rule(checkedAfterSel, {
			border_color: "contrast-color(var(--ctrl-bg, var(--color-paper)))",
		}))
		const indeterminateAfterSel = selectors.flatMap((s) => [
			`${s}:indeterminate::after`,
		])
		rules.push(rule(indeterminateAfterSel, {
			width: "0.55em",
			height: "0",
			border_width: "0 0 0.14em 0",
			transform: "none",
			border_color: "contrast-color(var(--ctrl-bg, var(--color-paper)))",
		}))
	}

	if (control === "radio") {
		// Radio: circular box with dot pseudo-element
		rules.push(rule(selectors, {
			appearance: "none",
			width: "1.125em",
			height: "1.125em",
			min_width: "1.125em",
			min_height: "1.125em",
			padding: "0",
			border_radius: "50%",
			display: "inline-flex",
			align_items: "center",
			justify_content: "center",
			flex_shrink: "0",
			vertical_align: "middle",
			box_sizing: "border-box",
		}))
		const afterSel = selectors.map((s) => `${s}::after`)
		rules.push(rule(afterSel, {
			content: '""',
			display: "block",
			width: "0.5em",
			height: "0.5em",
			border_radius: "50%",
			background: "transparent",
			transition: "var(--control-transition)",
		}))
		const checkedAfterSel = selectors.flatMap((s) => [
			`${s}:checked::after`, `${s}.selected::after`,
		])
		rules.push(rule(checkedAfterSel, {
			background: "contrast-color(var(--ctrl-bg, var(--color-paper)))",
		}))
	}

	if (control === "selector") {
		// Selector container: flex row, pill-shaped, small padding
		rules.push(rule(selectors, {
			display: "inline-flex",
			flex_wrap: "nowrap",
			align_items: "center",
			gap: "2px",
			padding: "2px",
			border_style: "solid",
		}))
		// Hide radio/checkbox inputs inside selector
		const inputSel = selectors.flatMap((s) => [
			`${s} > input[type="radio"]`,
			`${s} > input[type="checkbox"]`,
		])
		rules.push(rule(inputSel, {
			position: "absolute",
			width: "1px",
			height: "1px",
			padding: "0",
			margin: "-1px",
			overflow: "hidden",
			clip: "rect(0,0,0,0)",
			white_space: "nowrap",
			border: "0",
		}))
	}

	if (control === "selector.option") {
		// Option labels: ghost-button style, with padding and cursor
		rules.push(rule(selectors, {
			padding: "0.35em 0.75em",
			cursor: "pointer",
			user_select: "none",
			white_space: "nowrap",
			border_style: "solid",
			transition: "var(--control-transition)",
		}))

		// :checked + label mirrors the .selected state for input+label pattern
		const checkedLabelSel = [
			".selector > input:checked + label",
			".selector > input:checked + .option",
		]
		const selectedProps = buildCSSProps(definition, "default", "selected")
		if (selectedProps && Object.keys(selectedProps).length > 0) {
			rules.push(rule(checkedLabelSel, selectedProps))
		}
		// :checked + label hover
		const checkedHoverLabelSel = [
			".selector > input:checked + label:hover",
			".selector > input:checked + .option:hover",
		]
		const selHoverProps = changedProps(definition, "default", "selected+hover")
		if (Object.keys(selHoverProps).length > 0) {
			rules.push(rule(checkedHoverLabelSel, selHoverProps))
		}
		// :checked + label active
		const checkedActiveLabelSel = [
			".selector > input:checked + label:active",
			".selector > input:checked + .option:active",
		]
		const selActiveProps = changedProps(definition, "default", "selected+active")
		if (Object.keys(selActiveProps).length > 0) {
			rules.push(rule(checkedActiveLabelSel, selActiveProps))
		}
	}

	if (control === "range" || control === "slider") {
		// Range/slider: custom track and thumb
		rules.push(rule(selectors, {
			appearance: "none",
			width: "100%",
			height: "auto",
			padding: "0.5em 0",
			background: "transparent",
			border: "none",
			outline: "none",
		}))
		// Track — webkit
		const trackWebkit = selectors.map((s) => `${s}::-webkit-slider-runnable-track`)
		rules.push(rule(trackWebkit, {
			height: "4px",
			border_radius: "2px",
			background: "color-mix(in oklch, var(--ctrl-color), var(--color-paper) 60%)",
		}))
		// Track — moz
		const trackMoz = selectors.map((s) => `${s}::-moz-range-track`)
		rules.push(rule(trackMoz, {
			height: "4px",
			border_radius: "2px",
			background: "color-mix(in oklch, var(--ctrl-color), var(--color-paper) 60%)",
		}))
		// Thumb — webkit
		const thumbWebkit = selectors.map((s) => `${s}::-webkit-slider-thumb`)
		rules.push(rule(thumbWebkit, {
			appearance: "none",
			width: "1.25em",
			height: "1.25em",
			border_radius: "50%",
			background: "var(--ctrl-color)",
			border: "2px solid var(--color-paper)",
			margin_top: "calc((1.25em - 4px) / -2)",
			cursor: "pointer",
			transition: "var(--control-transition)",
		}))
		// Thumb — moz
		const thumbMoz = selectors.map((s) => `${s}::-moz-range-thumb`)
		rules.push(rule(thumbMoz, {
			appearance: "none",
			width: "1.25em",
			height: "1.25em",
			border_radius: "50%",
			background: "var(--ctrl-color)",
			border: "2px solid var(--color-paper)",
			cursor: "pointer",
			transition: "var(--control-transition)",
		}))
		// Hover — enlarge thumb
		const hoverThumbWebkit = selectors.map((s) => `${s}:hover::-webkit-slider-thumb`)
		const hoverThumbMoz = selectors.map((s) => `${s}:hover::-moz-range-thumb`)
		rules.push(rule(hoverThumbWebkit, {
			transform: "scale(1.15)",
		}))
		rules.push(rule(hoverThumbMoz, {
			transform: "scale(1.15)",
		}))
		// Focus — ring on thumb
		const focusThumbWebkit = selectors.map((s) => `${s}:focus-visible::-webkit-slider-thumb`)
		const focusThumbMoz = selectors.map((s) => `${s}:focus-visible::-moz-range-thumb`)
		rules.push(rule(focusThumbWebkit, {
			outline: "2px solid color-mix(in oklch, var(--ctrl-color), var(--color-paper) 50%)",
			outline_offset: "2px",
		}))
		rules.push(rule(focusThumbMoz, {
			outline: "2px solid color-mix(in oklch, var(--ctrl-color), var(--color-paper) 50%)",
			outline_offset: "2px",
		}))
		// Disabled
		const disabledTrackWebkit = selectors.flatMap((s) => [`${s}[disabled]::-webkit-slider-runnable-track`, `${s}.disabled::-webkit-slider-runnable-track`])
		const disabledTrackMoz = selectors.flatMap((s) => [`${s}[disabled]::-moz-range-track`, `${s}.disabled::-moz-range-track`])
		const disabledThumbWebkit = selectors.flatMap((s) => [`${s}[disabled]::-webkit-slider-thumb`, `${s}.disabled::-webkit-slider-thumb`])
		const disabledThumbMoz = selectors.flatMap((s) => [`${s}[disabled]::-moz-range-thumb`, `${s}.disabled::-moz-range-thumb`])
		rules.push(rule(disabledTrackWebkit, { opacity: "0.5" }))
		rules.push(rule(disabledTrackMoz, { opacity: "0.5" }))
		rules.push(rule(disabledThumbWebkit, { opacity: "0.5", cursor: "default" }))
		rules.push(rule(disabledThumbMoz, { opacity: "0.5", cursor: "default" }))
	}

	return group(...rules)
}

// ----------------------------------------------------------------------------
//
// CONTROLS FACTORY
//
// ----------------------------------------------------------------------------

function controls(defs = DEFAULTS, selectors = {}) {
	const rules = []
	for (const key in defs) {
		const entry = defs[key]
		if (!entry || !entry.control || !entry.definition) continue
		const { control, definition } = entry
		const sel = selectors[key] || SELECTORS[control] || SELECTORS[key] || [`.${control}`]
		rules.push(controlRules(control, sel, definition))
	}
	return group(...rules)
}

// ----------------------------------------------------------------------------
//
// MAIN / EXPORT
//
// ----------------------------------------------------------------------------

if (import.meta.main) {
	const css = (await import("../js/uicss.js")).css
	console.log([...css(controls())].join("\n"))
}

export { controls, controlRules, parseColor, parseBorder, parseTree, style, SELECTORS, DEFAULTS }
export default controls()
