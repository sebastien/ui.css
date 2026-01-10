import { group, vars, rule } from "../js/littlecss.js";

// ----------------------------------------------------------------------------
//
// COLOR SYSTEM
//
// ----------------------------------------------------------------------------
// This module implements a simplified color system with pre-computed scales.
//
// Colors are computed using OKLCH with the formula:
//   L = 0.05 + effective_level * 0.1
//   effective_level = direction == 1 ? level : (9 - level)
//   color = oklch(L C H / alpha)
//
// Blending is done via color-mix:
//   blended = color-mix(in oklch, base, blending blend*10%)

// ----------------------------------------------------------------------------
// COLOR DEFINITIONS
// ----------------------------------------------------------------------------
// Base colors defined at L=0.5, with their chroma and hue extracted

export const colors = {
	paper: { c: 0, h: 0 },
	ink: { c: 0, h: 0 },
	neutral: { c: 0.02, h: 250 },
	primary: { c: 0.2, h: 250 },
	secondary: { c: 0.2, h: 280 },
	tertiary: { c: 0.2, h: 160 },
	success: { c: 0.24, h: 145 },
	info: { c: 0.22, h: 220 },
	warning: { c: 0.24, h: 90 },
	danger: { c: 0.28, h: 25 },
};

export const colorNames = Object.keys(colors);

// Property definitions: short prefix, full name, CSS property
export const props = [
	{ short: "bg", full: "background", css: "background_color" },
	{ short: "tx", full: "text", css: "color" },
	{ short: "bd", full: "border", css: "border_color" },
	{ short: "ol", full: "outline", css: "outline_color" },
];

// ----------------------------------------------------------------------------
// COLOR SCALE GENERATION (build-time)
// ----------------------------------------------------------------------------
// Generate 10-step scales for each color, from L=0.05 to L=0.95

function generateColorScales() {
	const scales = {};
	for (const [name, { c, h }] of Object.entries(colors)) {
		// Skip paper and ink - they don't have scales
		if (name === "paper" || name === "ink") continue;

		for (let i = 0; i < 10; i++) {
			const L = (0.05 + i * 0.1).toFixed(2);
			scales[`__color_${name}_${i}`] = `oklch(${L} ${c} ${h})`;
		}
		// Also store base chroma and hue for runtime use
		scales[`__color_${name}_c`] = c;
		scales[`__color_${name}_h`] = h;
	}
	return scales;
}

// ----------------------------------------------------------------------------
// CSS-NATIVE COLOR COMPUTATION
// ----------------------------------------------------------------------------

/**
 * Generate an oklch() color expression using CSS variables
 * @param {string|null} namespace - Variable prefix (e.g., "selectable", "input") or null for standard vars
 * @param {string} prop - Property name (e.g., "background", "text", "border", "outline")
 * @param {object} options - { useConstraints: boolean } for WCAG text constraints
 * @returns {string} CSS oklch() expression
 */
export function oklchColor(namespace, prop, options = {}) {
	const { useConstraints = false } = options;
	const prefix = namespace ? `${namespace}-${prop}` : prop;
	const dir = "var(--color-l-direction, 1)";

	// Direction-aware level: in dark mode (dir=-1), level 8 maps to position 1
	// effective = level * dir + (1 - dir) / 2 * 9
	// dir=1:  effective = level
	// dir=-1: effective = -level + 9 = 9 - level
	const effectiveLevel = `(var(--${prefix}-level) * ${dir} + (1 - ${dir}) / 2 * 9)`;

	// Luminosity from level: L = 0.05 + effective * 0.1
	const L = `calc(0.05 + ${effectiveLevel} * 0.1)`;

	let lCalc;
	if (useConstraints) {
		// For text with WCAG constraints
		const lMin = `calc(0.05 + (var(--${prefix}-l-min) * ${dir} + (1 - ${dir}) / 2 * 9) * 0.1)`;
		const lMax = `calc(0.05 + (var(--${prefix}-l-max) * ${dir} + (1 - ${dir}) / 2 * 9) * 0.1)`;
		lCalc = `clamp(${lMin}, ${L}, ${lMax})`;
	} else {
		lCalc = `clamp(0.05, ${L}, 0.95)`;
	}

	// Chroma and hue from property variables
	const C = `var(--${prefix}-c)`;
	const H = `var(--${prefix}-h)`;

	// Alpha from 0-10 scale
	const alpha = `calc(var(--${prefix}-alpha, 10) / 10)`;

	// Base color
	const baseColor = `oklch(${lCalc} ${C} ${H})`;

	// Blend with target if blend > 0
	const blended = `color-mix(in oklch, ${baseColor}, var(--${prefix}-blending, transparent) calc(var(--${prefix}-blend, 0) * 10%))`;

	// Apply alpha
	return `oklch(from ${blended} l c h / ${alpha})`;
}

// Compute the OKLCH color string using standard property variables
export function computeColor(prop, useConstraints = false) {
	return oklchColor(null, prop.full, { useConstraints });
}

// ----------------------------------------------------------------------------
// UTILITY CLASS GENERATORS
// ----------------------------------------------------------------------------

// Generate color classes: .bg-{color} and .bg-{color}-{0-9}
function colorClasses(prop) {
	const classes = [];

	for (const [name, { c, h }] of Object.entries(colors)) {
		// Special handling for paper and ink
		if (name === "paper") {
			// .bg-paper → level 9, no chroma
			classes.push(
				rule(`.${prop.short}-paper`, {
					[`__${prop.full}_level`]: 9,
					[`__${prop.full}_c`]: 0,
					[`__${prop.full}_h`]: 0,
				}),
			);
			continue;
		}
		if (name === "ink") {
			// .bg-ink → level 0, no chroma
			classes.push(
				rule(`.${prop.short}-ink`, {
					[`__${prop.full}_level`]: 0,
					[`__${prop.full}_c`]: 0,
					[`__${prop.full}_h`]: 0,
				}),
			);
			continue;
		}

		// .bg-primary → level 5 (default)
		classes.push(
			rule(`.${prop.short}-${name}`, {
				[`__${prop.full}_level`]: 5,
				[`__${prop.full}_c`]: c,
				[`__${prop.full}_h`]: h,
			}),
		);

		// .bg-primary-0 through .bg-primary-9
		for (let i = 0; i < 10; i++) {
			classes.push(
				rule(`.${prop.short}-${name}-${i}`, {
					[`__${prop.full}_level`]: i,
					[`__${prop.full}_c`]: c,
					[`__${prop.full}_h`]: h,
				}),
			);
		}
	}

	return classes;
}

// Generate alpha classes: .bg-a0 through .bg-a10
function alphaClasses(prop) {
	return Array.from({ length: 11 }, (_, i) =>
		rule(`.${prop.short}-a${i}`, { [`__${prop.full}_alpha`]: i }),
	);
}

// Generate blend classes: .bg+paper/1 through .bg+paper/9, .bg+ink/1 through .bg+ink/9
function blendClasses(prop) {
	return ["paper", "ink"].flatMap((target) =>
		Array.from({ length: 9 }, (_, i) =>
			rule(`.${prop.short}\\+${target}\\/${i + 1}`, {
				[`__${prop.full}_blend`]: i + 1,
				[`__${prop.full}_blending`]: `var(--color-${target})`,
			}),
		),
	);
}

// Text luminosity classes that override contrast constraints
function textLevelOverrideClasses() {
	return Array.from({ length: 10 }, (_, i) =>
		rule(`.tx-${i}`, {
			__text_level: i,
			// Remove constraints when explicitly set
			__text_l_min: 0,
			__text_l_max: 9,
		}),
	);
}

// ----------------------------------------------------------------------------
// EXPORTS
// ----------------------------------------------------------------------------

export default group(
	// ------------------------------------------------------------------------
	// COLOR SCALES (build-time generated)
	// ------------------------------------------------------------------------
	rule(":root", generateColorScales()),

	// ------------------------------------------------------------------------
	// DARK / LIGHT MODE
	// ------------------------------------------------------------------------
	rule(".light, :root", {
		__color_page: vars.color.paper,
		__color_text: vars.color.ink,
		__color_l_direction: 1,
		// Apply actual properties
		background_color: vars.color.paper,
		color: vars.color.ink,
	}),
	rule(".dark", {
		__color_page: vars.color.ink,
		__color_text: vars.color.paper,
		__color_l_direction: -1,
		// Apply actual properties with swapped colors
		background_color: vars.color.ink,
		color: vars.color.paper,
	}),

	// ------------------------------------------------------------------------
	// APPLY CLASSES
	// ------------------------------------------------------------------------
	// .bg - applies background color and sets text contrast constraints
	rule(".bg", {
		background_color: computeColor(props[0]),
		// Calculate if background is dark (level <= 4) for contrast
		// bg-is-dark: 1 if dark, 0 if light
		// Threshold at 4.5 means level 4 → dark, level 5 → light
		__bg_is_dark: `clamp(0, (4.5 - var(--background-level)) * 10, 1)`,
		// Direction-aware text constraints for WCAG contrast
		__text_l_min: `calc((1 + var(--color-l-direction) * (2 * var(--bg-is-dark) - 1)) / 2 * 8)`,
		__text_l_max: `calc(1 + (1 + var(--color-l-direction) * (2 * var(--bg-is-dark) - 1)) / 2 * 8)`,
	}),
	// .tx - applies text color with contrast constraints
	rule(".tx", {
		color: computeColor(props[1], true),
	}),
	// .bd - applies border color
	rule(".bd", {
		border_color: computeColor(props[2]),
		border_width: vars.border.width,
	}),
	// .ol - applies outline color
	rule(".ol", {
		outline_color: computeColor(props[3]),
	}),

	// ------------------------------------------------------------------------
	// COLOR CLASSES
	// ------------------------------------------------------------------------
	...props.flatMap(colorClasses),

	// ------------------------------------------------------------------------
	// TEXT LEVEL OVERRIDE CLASSES
	// ------------------------------------------------------------------------
	...textLevelOverrideClasses(),

	// ------------------------------------------------------------------------
	// ALPHA CLASSES (0-10)
	// ------------------------------------------------------------------------
	...props.flatMap(alphaClasses),

	// ------------------------------------------------------------------------
	// BLEND CLASSES
	// ------------------------------------------------------------------------
	...props.flatMap(blendClasses),

	// ------------------------------------------------------------------------
	// RESET CLASSES
	// ------------------------------------------------------------------------
	rule(".bg-no", { __background_alpha: 0 }),
	rule(".tx-no", { __text_alpha: 0 }),
	rule(".bd-no", { __border_alpha: 0 }),
	rule(".ol-no", { __outline_alpha: 0 }),
	// Direct transparent application (no variables)
	rule(".nobg", { background_color: "transparent" }),
	rule(".notx", { color: "inherit" }),
	rule(".nobd", { border_color: "transparent" }),
	rule(".nool", { outline_color: "transparent" }),
);
