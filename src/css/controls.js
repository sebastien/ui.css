import { Parser, contrast as contrastColor, group, nesting, rule, vars } from "../js/uicss.js?v=2"
import { colormixin } from "./colors.js"
import DEFAULTS_SPEC from "./controls.defaults.js"

const PARSER = new Parser()

// Property name expansions from shorthand keys.
const PROPS = { tx: "text", bg: "background", bd: "border", ol: "outline" }

// Color facets produced by the color pipeline.
const COLOR_FACETS = ["base", "tint", "blend", "opacity"]

// Structural facets for border/outline geometry.
const GEOM_FACETS = ["width", "radius"]

const DEFAULTS = PARSER.style(DEFAULTS_SPEC)

// ----------------------------------------------------------------------------
//
// COLOR RESOLUTION — CSS variable indirection
//
// ----------------------------------------------------------------------------

// Default facet values when nothing is specified.
const BASE_COLOR = "__CONTROL_COLOR__"
const FACET_DEFAULTS = {
	text: { base: "var(--color-ink)", tint: "var(--color-ink)", blend: "0%", opacity: "100%" },
	background: { base: BASE_COLOR, tint: "var(--color-paper)", blend: "100%", opacity: "100%" },
	border: { base: BASE_COLOR, tint: "var(--color-paper)", blend: "80%", opacity: "100%", width: "1px", radius: "4px" },
	outline: { base: BASE_COLOR, tint: "var(--color-paper)", blend: "80%", opacity: "0%", width: "2px", radius: "4px" },
}

// Resolve a color name to a CSS value.
function resolveColorName(name) {
	if (!name) return null
	if (name === "contrast") return "contrast"
	if (name === "inherit") return "inherit"
	if (name === "transparent") return "transparent"
	if (name === BASE_COLOR || name === "self") return "var(--ctrl-color)"
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

function resolveAllFacets(definition, variant, state, shortKey) {
	const propName = PROPS[shortKey]
	const isEdge = shortKey === "bd" || shortKey === "ol"
	const facetNames = isEdge ? [...COLOR_FACETS, ...GEOM_FACETS] : COLOR_FACETS
	const defaults = FACET_DEFAULTS[propName] || {}

	const getValue = (v, s) => {
		const raw = definition[v]?.[s]?.[shortKey]
		return raw ? PARSER.parseProperty(shortKey, raw) : null
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

	if (layers.length === 0) return { ...defaults }

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

function resolveSubFacets(definition, variant, state, subElement, shortKey) {
	const propName = PROPS[shortKey]
	const isEdge = shortKey === "bd" || shortKey === "ol"
	const facetNames = isEdge ? [...COLOR_FACETS, ...GEOM_FACETS] : COLOR_FACETS
	const defaults = FACET_DEFAULTS[propName] || {}
	const fullKey = `${subElement}.${shortKey}`

	const getValue = (v, s) => {
		const raw = definition[v]?.[s]?.[fullKey]
		return raw ? PARSER.parseProperty(shortKey, raw) : null
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
// Builds a CSS color value from resolved facets (used for special cases only).
function buildColorValue(facets) {
	const base = resolveColorName(facets.base)
	const tint = resolveColorName(facets.tint)
	const blend = normalizeBlend(facets.blend)
	const opacity = normalizeOpacity(facets.opacity)

	if (!base) return null

	if (base === "contrast") {
		if (opacity && opacity !== "100%") {
			return `color-mix(in oklch, contrast-color(var(--ctrl-bg, var(--color-paper))), transparent calc(100% - ${opacity}))`
		}
		return `contrast-color(var(--ctrl-bg, var(--color-paper)))`
	}

	if (base === "inherit") {
		if (opacity && opacity !== "100%") {
			return `color-mix(in oklch, inherit, transparent calc(100% - ${opacity}))`
		}
		return "inherit"
	}

	if (opacity === "0%") return "transparent"

	const b = blend || "0%"
	const o = opacity || "100%"
	const inner = `color-mix(in oklch, ${base}, ${tint || base} ${b})`
	if (o !== "100%") {
		return `color-mix(in oklch, ${inner}, transparent calc(100% - ${o}))`
	}
	return inner
}

// ----------------------------------------------------------------------------
//
// VARIABLE INDIRECTION — the core size optimization
//
// ----------------------------------------------------------------------------
// Instead of emitting computed color-mix() per rule, we emit CSS variable
// overrides. A shared base rule computes the actual colors from variables.
//
// Variables per channel (tx, bg, bd, ol):
//   --ctrl-{ch}-base    color base (e.g. var(--ctrl-color))
//   --ctrl-{ch}-tint    color tint (e.g. var(--color-paper))
//   --ctrl-{ch}-blend   blend percentage (e.g. 20%)
//   --ctrl-{ch}-opacity opacity percentage (e.g. 100%)
// Plus geometry for bd/ol:
//   --ctrl-{ch}-width   border/outline width
//   --ctrl-{ch}-radius  border/outline radius

// Channels that use the variable indirection system.
const CHANNELS = ["tx", "bg", "bd", "ol"]

// Check if facets use a special mode (contrast/inherit/transparent)
// that cannot be expressed through variable indirection.
function facetMode(facets) {
	const base = facets.base
	if (!base) return "normal"
	if (base === "contrast") return "contrast"
	if (base === "inherit") return "inherit"
	const opacity = normalizeOpacity(facets.opacity)
	if (opacity === "0%") return "transparent"
	return "normal"
}

// Build variable overrides for a single channel.
// Returns an object of CSS variable assignments, or null if all defaults.
// `baseFacets` are the resolved facets for the base state to diff against.
function channelVarOverrides(ch, facets, baseFacets) {
	const overrides = {}
	let hasOverride = false

	const base = resolveColorName(facets.base)
	const tint = resolveColorName(facets.tint)
	const blend = normalizeBlend(facets.blend)
	const opacity = normalizeOpacity(facets.opacity)

	const baseBase = baseFacets ? resolveColorName(baseFacets.base) : null
	const baseTint = baseFacets ? resolveColorName(baseFacets.tint) : null
	const baseBlend = baseFacets ? normalizeBlend(baseFacets.blend) : null
	const baseOpacity = baseFacets ? normalizeOpacity(baseFacets.opacity) : null

	if (base && base !== baseBase) { overrides[`--ctrl-${ch}-base`] = base; hasOverride = true }
	if (tint && tint !== baseTint) { overrides[`--ctrl-${ch}-tint`] = tint; hasOverride = true }
	if (blend && blend !== baseBlend) { overrides[`--ctrl-${ch}-blend`] = blend; hasOverride = true }
	if (opacity && opacity !== baseOpacity) { overrides[`--ctrl-${ch}-opacity`] = opacity; hasOverride = true }

	// Geometry for border/outline
	if (ch === "bd" || ch === "ol") {
		const baseWidth = baseFacets?.width || null
		const baseRadius = baseFacets?.radius || null
		if (facets.width && facets.width !== baseWidth) { overrides[`--ctrl-${ch}-width`] = facets.width; hasOverride = true }
		if (facets.radius && facets.radius !== baseRadius) { overrides[`--ctrl-${ch}-radius`] = facets.radius; hasOverride = true }
	}

	return hasOverride ? overrides : null
}

// Build the full set of variable overrides for all channels at a given variant+state.
// `baseDefinition` is the resolved facets at the base state to diff against (null for absolute).
function buildVarOverrides(definition, variant, state, baseFacetsMap) {
	const overrides = {}
	let hasOverride = false
	const directProps = {} // For contrast/inherit special cases
	let hasDirect = false

	for (const ch of CHANNELS) {
		const facets = resolveAllFacets(definition, variant, state, ch)
		const mode = facetMode(facets)

		if (mode === "contrast") {
			// Direct property override for contrast
			const value = buildColorValue(facets)
			if (ch === "tx") directProps.color = value
			else if (ch === "bg") { directProps.background = value; directProps["--ctrl-bg"] = value }
			hasDirect = true
			continue
		}
		if (mode === "inherit") {
			const value = buildColorValue(facets)
			if (ch === "tx") directProps.color = value
			else if (ch === "bg") directProps.background = value
			hasDirect = true
			continue
		}

		const baseFacets = baseFacetsMap?.[ch] || null
		const chOverrides = channelVarOverrides(ch, facets, baseFacets)
		if (chOverrides) {
			Object.assign(overrides, chOverrides)
			hasOverride = true
		}
	}

	return { vars: hasOverride ? overrides : null, direct: hasDirect ? directProps : null }
}

// Build variable overrides for state changes only (only channels explicitly set).
function buildStateVarOverrides(definition, variant, state, baseFacetsMap) {
	const stateProps = definition[variant]?.[state]
	if (!stateProps) return { vars: null, direct: null }

	const overrides = {}
	let hasOverride = false
	const directProps = {}
	let hasDirect = false

	for (const rawKey in stateProps) {
		if (rawKey.indexOf(".") >= 0) continue
		if (!PROPS[rawKey]) continue
		const ch = rawKey

		const facets = resolveAllFacets(definition, variant, state, ch)
		const mode = facetMode(facets)

		if (mode === "contrast") {
			const value = buildColorValue(facets)
			if (ch === "tx") directProps.color = value
			else if (ch === "bg") { directProps.background = value; directProps["--ctrl-bg"] = value }
			hasDirect = true
			continue
		}
		if (mode === "inherit") {
			const value = buildColorValue(facets)
			if (ch === "tx") directProps.color = value
			else if (ch === "bg") directProps.background = value
			hasDirect = true
			continue
		}

		const baseFacets = baseFacetsMap?.[ch] || null
		const chOverrides = channelVarOverrides(ch, facets, baseFacets)
		if (chOverrides) {
			Object.assign(overrides, chOverrides)
			hasOverride = true
		}
	}

	return { vars: hasOverride ? overrides : null, direct: hasDirect ? directProps : null }
}

// Build the base facets map for a given variant+state (used as diff base).
function buildBaseFacetsMap(definition, variant, state) {
	const map = {}
	for (const ch of CHANNELS) {
		map[ch] = resolveAllFacets(definition, variant, state, ch)
	}
	return map
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

// Combine state suffixes into a single :is() or direct suffix.
// Returns a single suffix string to append to a base selector.
function stateSuffix(state) {
	const sels = STATE_SELECTORS[state]
	if (sels) {
		if (sels.length === 0) return ""
		if (sels.length === 1) return sels[0]
		return `:is(${sels.join(", ")})`
	}
	const parts = state.split("+")
	if (parts.length > 1) {
		return parts.map((p) => {
			const s = STATE_SELECTORS[p] || [`.${p}`]
			return s.length === 1 ? s[0] : `:is(${s.join(", ")})`
		}).join("")
	}
	return `.${state}`
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

// All control selectors combined — used for the shared computation base rule.
// Uses :where() to keep specificity at 0 so per-control rules can override easily.
const ALL_CONTROL_SELECTORS = [
	":where(button, .button, input:not([type=checkbox]):not([type=radio]):not([type=range]), .input, textarea, .textarea, select, .select, .selectable, .selector, input[type=checkbox], .checkbox, input[type=radio], .radio, input[type=range], .range, .slider, .panel)",
]

// ----------------------------------------------------------------------------
//
// SHARED COMPUTATION BASE RULE
//
// ----------------------------------------------------------------------------

// The shared base defaults match the most common control pattern (input-like).
// Button and other outliers override just the few variables that differ.
const SHARED_BASE_FACETS = {
	tx: { base: "var(--ctrl-color)", tint: "var(--color-ink)", blend: "75%", opacity: "100%" },
	bg: { base: "var(--ctrl-color)", tint: "var(--color-paper)", blend: "95%", opacity: "100%" },
	bd: { base: "var(--ctrl-color)", tint: "var(--color-ink)", blend: "85%", opacity: "25%", width: "1px", radius: "4px" },
	ol: { base: "var(--ctrl-color)", tint: "var(--color-paper)", blend: "75%", opacity: "0%", width: "2px" },
}

// Function: controlBase
// Emits the shared base rule that computes actual CSS properties from
// --ctrl-{channel}-{facet} variables. Emitted once for all controls.
function controlBase() {
	// Semantic color classes — nested inside the shared base
	const SEMANTIC_COLORS = ["neutral", "primary", "secondary", "tertiary", "accent", "success", "warning", "danger", "info", "error"]
	const semanticRules = SEMANTIC_COLORS.map((color) =>
		rule(`&.${color}`, { "--ctrl-color": `var(--color-${color})` })
	)

	return nesting(ALL_CONTROL_SELECTORS, {
		"--ctrl-color": "var(--color-neutral)",
		// Text color variables + computation
		"--ctrl-tx-base": SHARED_BASE_FACETS.tx.base,
		"--ctrl-tx-tint": SHARED_BASE_FACETS.tx.tint,
		"--ctrl-tx-blend": SHARED_BASE_FACETS.tx.blend,
		"--ctrl-tx-opacity": SHARED_BASE_FACETS.tx.opacity,
		color: "color-mix(in oklch, color-mix(in oklch, var(--ctrl-tx-base), var(--ctrl-tx-tint) var(--ctrl-tx-blend)), transparent calc(100% - var(--ctrl-tx-opacity)))",
		// Background variables + computation
		"--ctrl-bg-base": SHARED_BASE_FACETS.bg.base,
		"--ctrl-bg-tint": SHARED_BASE_FACETS.bg.tint,
		"--ctrl-bg-blend": SHARED_BASE_FACETS.bg.blend,
		"--ctrl-bg-opacity": SHARED_BASE_FACETS.bg.opacity,
		background: "color-mix(in oklch, color-mix(in oklch, var(--ctrl-bg-base), var(--ctrl-bg-tint) var(--ctrl-bg-blend)), transparent calc(100% - var(--ctrl-bg-opacity)))",
		"--ctrl-bg": "color-mix(in oklch, color-mix(in oklch, var(--ctrl-bg-base), var(--ctrl-bg-tint) var(--ctrl-bg-blend)), transparent calc(100% - var(--ctrl-bg-opacity)))",
		// Border variables + computation
		"--ctrl-bd-base": SHARED_BASE_FACETS.bd.base,
		"--ctrl-bd-tint": SHARED_BASE_FACETS.bd.tint,
		"--ctrl-bd-blend": SHARED_BASE_FACETS.bd.blend,
		"--ctrl-bd-opacity": SHARED_BASE_FACETS.bd.opacity,
		"--ctrl-bd-width": SHARED_BASE_FACETS.bd.width,
		"--ctrl-bd-radius": SHARED_BASE_FACETS.bd.radius,
		border_color: "color-mix(in oklch, color-mix(in oklch, var(--ctrl-bd-base), var(--ctrl-bd-tint) var(--ctrl-bd-blend)), transparent calc(100% - var(--ctrl-bd-opacity)))",
		border_width: "var(--ctrl-bd-width)",
		border_radius: "var(--ctrl-bd-radius)",
		border_style: "solid",
		// Outline variables + computation
		"--ctrl-ol-base": SHARED_BASE_FACETS.ol.base,
		"--ctrl-ol-tint": SHARED_BASE_FACETS.ol.tint,
		"--ctrl-ol-blend": SHARED_BASE_FACETS.ol.blend,
		"--ctrl-ol-opacity": SHARED_BASE_FACETS.ol.opacity,
		"--ctrl-ol-width": SHARED_BASE_FACETS.ol.width,
		outline_color: "color-mix(in oklch, color-mix(in oklch, var(--ctrl-ol-base), var(--ctrl-ol-tint) var(--ctrl-ol-blend)), transparent calc(100% - var(--ctrl-ol-opacity)))",
		outline_width: "var(--ctrl-ol-width)",
		outline_style: "solid",
		outline_offset: "0px",
		// Shared
		transition: "var(--control-transition)",
	}, semanticRules)
}

// ----------------------------------------------------------------------------
//
// CONTROL BUILDER
//
// ----------------------------------------------------------------------------

// Function: controlSharedRules
// Emits state/variant variable-override rules with merged selectors.
// Uses nesting to avoid repeating long selector lists.
function controlSharedRules(selectors, definition) {
	const defaultFacets = buildBaseFacetsMap(definition, "default", "default")

	// Wrap selectors in :where() for compact output
	const base = selectors.length > 2 ? [`:where(${selectors.join(", ")})`] : selectors

	// Default variant overrides (diff against shared base)
	const { vars: defaultVars, direct: defaultDirect } = buildVarOverrides(definition, "default", "default", SHARED_BASE_FACETS)
	const defaultProps = { ...(defaultVars || {}), ...(defaultDirect || {}) }

	// Collect nested child rules for variant+state
	const children = []
	for (const variant in definition) {
		const variantBaseFacets = buildBaseFacetsMap(definition, variant, "default")
		for (const state in definition[variant]) {
			if (variant === "default" && state === "default") continue
			let result
			if (state === "default" && variant !== "default") {
				result = buildVarOverrides(definition, variant, state, defaultFacets)
			} else {
				result = buildStateVarOverrides(definition, variant, state, variantBaseFacets)
			}
			const { vars: stateVars, direct: stateDirect } = result
			const props = { ...(stateVars || {}), ...(stateDirect || {}) }
			if (Object.keys(props).length === 0) continue

			let suffix_
			const suffix = stateSuffix(state)
			if (state === "default" && variant !== "default") {
				suffix_ = `&.${variant}`
			} else if (variant === "default") {
				suffix_ = `&${suffix}`
			} else {
				suffix_ = `&.${variant}${suffix}`
			}
			if (state === "disabled") { props.cursor = "default"; props.pointer_events = "none" }
			children.push(rule(suffix_, props))
		}
	}

	return nesting(base, defaultProps, children)
}

// Function: controlIdentityRules
// Emits per-control identity (font, padding, cursor) and structural rules.
function controlIdentityRules(control, selectors, definition) {
	const rules = []
	const CLICKABLE = new Set(["button", "selectable", "selector", "checkbox", "radio", "range", "slider"])

	rules.push(rule(selectors, {
		...(CLICKABLE.has(control) ? { cursor: "pointer" } : {}),
		font_family: `var(--${control}-font-family, var(--font-control-family, sans-serif))`,
		font_weight: `var(--${control}-font-weight, var(--font-control-weight, 500))`,
		font_size: `var(--${control}-font-size, var(--font-control-size, var(--font-size)))`,
		line_height: `var(--${control}-font-line, var(--font-control-line, 1em))`,
		padding: `var(--${control}-padding, 0.65em 1em)`,
		margin: `var(--${control}-margin, 0px)`,
	}))

	// Structural rules (checkbox, radio, etc.)
	emitStructuralRules(control, selectors, definition, rules)

	return group(...rules)
}

// Function: controlRules
// Generates CSS rules for a single control from its shorthand definition.
// Used for controls that don't share a definition with others.
function controlRules(control, selectors, definition) {
	const rules = []
	const CLICKABLE = new Set(["button", "selectable", "selector", "checkbox", "radio", "range", "slider"])

	// Use :where() for compact state selectors when multiple base selectors exist
	const baseSel = selectors.length > 2 ? [`:where(${selectors.join(", ")})`] : selectors

	// Per-control identity rule: font, padding, cursor + variable overrides
	// that differ from the shared base.
	const defaultFacets = buildBaseFacetsMap(definition, "default", "default")
	const { vars: defaultVars, direct: defaultDirect } = buildVarOverrides(definition, "default", "default", SHARED_BASE_FACETS)

	const identityProps = {
		...(CLICKABLE.has(control) ? { cursor: "pointer" } : {}),
		font_family: `var(--${control}-font-family, var(--font-control-family, sans-serif))`,
		font_weight: `var(--${control}-font-weight, var(--font-control-weight, 500))`,
		font_size: `var(--${control}-font-size, var(--font-control-size, var(--font-size)))`,
		line_height: `var(--${control}-font-line, var(--font-control-line, 1em))`,
		padding: `var(--${control}-padding, 0.65em 1em)`,
		margin: `var(--${control}-margin, 0px)`,
		...(defaultVars || {}),
		...(defaultDirect || {}),
	}

	// Collect nested child rules for variant+state
	const children = []
	for (const variant in definition) {
		const variantBaseFacets = buildBaseFacetsMap(definition, variant, "default")

		for (const state in definition[variant]) {
			if (variant === "default" && state === "default") continue

			let result
			if (state === "default" && variant !== "default") {
				result = buildVarOverrides(definition, variant, state, defaultFacets)
			} else {
				result = buildStateVarOverrides(definition, variant, state, variantBaseFacets)
			}

			const { vars: stateVars, direct: stateDirect } = result
			const props = { ...(stateVars || {}), ...(stateDirect || {}) }

			if (Object.keys(props).length === 0) continue

			let suffix_
			const suffix = stateSuffix(state)
			if (state === "default" && variant !== "default") {
				suffix_ = `&.${variant}`
			} else if (variant === "default") {
				suffix_ = `&${suffix}`
			} else {
				suffix_ = `&.${variant}${suffix}`
			}

			// Add disabled extras
			if (state === "disabled") {
				props.cursor = "default"
				props.pointer_events = "none"
			}

			children.push(rule(suffix_, props))
		}
	}

	// Emit as nesting rule: identity + state children nested inside
	rules.push(nesting(selectors, identityProps, children))

	// ----------------------------------------------------------------
	// Control-specific structural rules (pseudo-elements, sizing, etc.)
	// ----------------------------------------------------------------
	emitStructuralRules(control, selectors, definition, rules)

	return group(...rules)
}

// Function: emitStructuralRules
// Emits control-specific structural rules (pseudo-elements, sizing, etc.)
function emitStructuralRules(control, selectors, definition, rules) {
	if (control === "checkbox") {
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
		rules.push(rule(selectors, {
			display: "inline-flex",
			flex_wrap: "nowrap",
			align_items: "center",
			gap: "2px",
			padding: "2px",
			border_style: "solid",
		}))
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
		rules.push(rule(selectors, {
			padding: "0.35em 0.75em",
			cursor: "pointer",
			user_select: "none",
			white_space: "nowrap",
			border_style: "solid",
			transition: "var(--control-transition)",
		}))

		// :checked + label mirrors the .selected state
		const checkedLabelSel = [
			".selector > input:checked + label",
			".selector > input:checked + .option",
		]
		const selectedBaseFacets = buildBaseFacetsMap(definition, "default", "default")
		const { vars: selVars, direct: selDirect } = buildVarOverrides(definition, "default", "selected", selectedBaseFacets)
		const selectedProps = { ...(selVars || {}), ...(selDirect || {}) }
		if (Object.keys(selectedProps).length > 0) {
			rules.push(rule(checkedLabelSel, selectedProps))
		}
		// :checked + label hover
		const checkedHoverLabelSel = [
			".selector > input:checked + label:hover",
			".selector > input:checked + .option:hover",
		]
		const selHoverBaseFacets = buildBaseFacetsMap(definition, "default", "selected")
		const { vars: selHoverVars, direct: selHoverDirect } = buildStateVarOverrides(definition, "default", "selected+hover", selHoverBaseFacets)
		const selHoverProps = { ...(selHoverVars || {}), ...(selHoverDirect || {}) }
		if (Object.keys(selHoverProps).length > 0) {
			rules.push(rule(checkedHoverLabelSel, selHoverProps))
		}
		// :checked + label active
		const checkedActiveLabelSel = [
			".selector > input:checked + label:active",
			".selector > input:checked + .option:active",
		]
		const { vars: selActiveVars, direct: selActiveDirect } = buildStateVarOverrides(definition, "default", "selected+active", selHoverBaseFacets)
		const selActiveProps = { ...(selActiveVars || {}), ...(selActiveDirect || {}) }
		if (Object.keys(selActiveProps).length > 0) {
			rules.push(rule(checkedActiveLabelSel, selActiveProps))
		}
	}

	if (control === "range" || control === "slider") {
		rules.push(rule(selectors, {
			appearance: "none",
			width: "100%",
			height: "auto",
			padding: "0.5em 0",
			background: "transparent",
			border: "none",
			outline: "none",
		}))
		const trackWebkit = selectors.map((s) => `${s}::-webkit-slider-runnable-track`)
		rules.push(rule(trackWebkit, {
			height: "4px",
			border_radius: "2px",
			background: "color-mix(in oklch, var(--ctrl-color), var(--color-paper) 60%)",
		}))
		const trackMoz = selectors.map((s) => `${s}::-moz-range-track`)
		rules.push(rule(trackMoz, {
			height: "4px",
			border_radius: "2px",
			background: "color-mix(in oklch, var(--ctrl-color), var(--color-paper) 60%)",
		}))
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
		const hoverThumbWebkit = selectors.map((s) => `${s}:hover::-webkit-slider-thumb`)
		const hoverThumbMoz = selectors.map((s) => `${s}:hover::-moz-range-thumb`)
		rules.push(rule(hoverThumbWebkit, { transform: "scale(1.15)" }))
		rules.push(rule(hoverThumbMoz, { transform: "scale(1.15)" }))
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
		const disabledTrackWebkit = selectors.flatMap((s) => [`${s}[disabled]::-webkit-slider-runnable-track`, `${s}.disabled::-webkit-slider-runnable-track`])
		const disabledTrackMoz = selectors.flatMap((s) => [`${s}[disabled]::-moz-range-track`, `${s}.disabled::-moz-range-track`])
		const disabledThumbWebkit = selectors.flatMap((s) => [`${s}[disabled]::-webkit-slider-thumb`, `${s}.disabled::-webkit-slider-thumb`])
		const disabledThumbMoz = selectors.flatMap((s) => [`${s}[disabled]::-moz-range-thumb`, `${s}.disabled::-moz-range-thumb`])
		rules.push(rule(disabledTrackWebkit, { opacity: "0.5" }))
		rules.push(rule(disabledTrackMoz, { opacity: "0.5" }))
		rules.push(rule(disabledThumbWebkit, { opacity: "0.5", cursor: "default" }))
		rules.push(rule(disabledThumbMoz, { opacity: "0.5", cursor: "default" }))
	}
}

// ----------------------------------------------------------------------------
//
// CONTROLS FACTORY
//
// ----------------------------------------------------------------------------

// Controls known to share nearly identical definitions — merged to save output bytes.
// input/textarea/select share the same visual definition (input is the superset).
const MERGE_GROUPS = {
	"text-field": ["input", "textarea", "select"],
}

function controls(defs = DEFAULTS, selectors = {}) {
	const rules = []
	// Emit shared base rule once
	rules.push(controlBase())

	// Build entries
	const entries = {}
	for (const key in defs) {
		const entry = defs[key]
		if (!entry || !entry.control || !entry.definition) continue
		const { control, definition } = entry
		const sel = selectors[key] || SELECTORS[control] || SELECTORS[key] || [`.${control}`]
		entries[key] = { key, control, definition, sel }
	}

	// Track which entries have been emitted via merge groups
	const emitted = new Set()

	// Emit merged groups first
	for (const [, memberKeys] of Object.entries(MERGE_GROUPS)) {
		const members = memberKeys.map((k) => entries[k]).filter(Boolean)
		if (members.length < 2) continue
		members.forEach((m) => emitted.add(m.key))

		// Use the first member's definition as the superset (it should have all states)
		const mergedSel = members.flatMap((e) => e.sel)
		const { definition } = members[0]
		rules.push(controlSharedRules(mergedSel, definition))
		for (const { control, sel } of members) {
			rules.push(controlIdentityRules(control, sel, definition))
		}
	}

	// Emit remaining controls individually
	for (const key in entries) {
		if (emitted.has(key)) continue
		const { control, sel, definition } = entries[key]
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

export { controls, controlRules, SELECTORS, DEFAULTS }
export default controls()
