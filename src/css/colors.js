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

const COLORS = [
	"paper",
	"ink",
	"page",
	"text",
	"neutral",
	"primary",
	"secondary",
	"tertiary",
	"success",
	"info",
	"warning",
	"danger",
];

// Color properties with their default settings
const shorthands = {
	bg: { name: "background", css: "background_color" },
	tx: { name: "text", css: "color" },
	bd: { name: "border", css: "border_color" },
	ol: { name: "outline", css: "outline_color" },
};

const sides = {
	t: { name: "top" },
	r: { name: "right" },
	b: { name: "bottom" },
	l: { name: "left" },
};

// // ----------------------------------------------------------------------------
// // CSS-NATIVE COLOR COMPUTATION
// // ----------------------------------------------------------------------------
//
// /**
//  * Generate an oklch() color expression using CSS variables
//  * @param {string|null} namespace - Variable prefix (e.g., "selectable", "input") or null for standard vars
//  * @param {string} prop - Property name (e.g., "background", "text", "border", "outline")
//  * @param {object} options - { useConstraints: boolean } for WCAG text constraints
//  * @returns {string} CSS oklch() expression
//  */
// function oklchColor(namespace, prop, options = {}) {
// 	const { useConstraints = false } = options;
// 	const prefix = namespace ? `${namespace}-${prop}` : prop;
// 	const dir = "var(--color-l-direction, 1)";
//
// 	// Direction-aware level: in dark mode (dir=-1), level 8 maps to position 1
// 	// effective = level * dir + (1 - dir) / 2 * 9
// 	// dir=1:  effective = level
// 	// dir=-1: effective = -level + 9 = 9 - level
// 	const effectiveLevel = `(var(--${prefix}-level) * ${dir} + (1 - ${dir}) / 2 * 9)`;
//
// 	// Luminosity from level: L = 0.05 + effective * 0.1
// 	const L = `calc(0.05 + ${effectiveLevel} * 0.1)`;
//
// 	let lCalc;
// 	if (useConstraints) {
// 		// For text with WCAG constraints
// 		const lMin = `calc(0.05 + (var(--${prefix}-l-min) * ${dir} + (1 - ${dir}) / 2 * 9) * 0.1)`;
// 		const lMax = `calc(0.05 + (var(--${prefix}-l-max) * ${dir} + (1 - ${dir}) / 2 * 9) * 0.1)`;
// 		lCalc = `clamp(${lMin}, ${L}, ${lMax})`;
// 	} else {
// 		lCalc = `clamp(0.05, ${L}, 0.95)`;
// 	}
//
// 	// Chroma and hue from property variables
// 	const C = `var(--${prefix}-c)`;
// 	const H = `var(--${prefix}-h)`;
//
// 	// Alpha from 0-10 scale
// 	const alpha = `calc(var(--${prefix}-alpha, 10) / 10)`;
//
// 	// Base color
// 	const baseColor = `oklch(${lCalc} ${C} ${H})`;
//
// 	// Blend with target if blend > 0
// 	const blended = `color-mix(in oklch, ${baseColor}, var(--${prefix}-blending, transparent) calc(var(--${prefix}-blend, 0) * 10%))`;
//
// 	// Apply alpha
// 	return `oklch(from ${blended} l c h / ${alpha})`;
// }

const grades = [
	10, // 0
	20, // 1
	30, // 2
	40, // 3
	50, // 4
	60, //5
	70, // 6
	80, // 7
	90, // 8
	95, // 9
];

const shades = {
	darkest: { target: vars.color.ink, value: 85 },
	darker: { target: vars.color.ink, value: 90 },
	dark: { target: vars.color.ink, value: 95 },
	light: { target: vars.color.paper, value: 95 },
	lighter: { target: vars.color.paper, value: 90 },
	lightest: { target: vars.color.paper, value: 85 },
};

// ----------------------------------------------------------------------------
//
// EXPORTS
//
// ----------------------------------------------------------------------------

function colors(colors = COLORS) {
	return group(
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
			background_color: vars.background.color,
			__background_color: `color-mix(in oklch, var(--background-base), var(--background-tint) calc(100% - var(--background-shade)))`,
		}),
		// .tx - applies text color with contrast constraints
		rule(".tx", {
			background_color: vars.text.color,
			__text_color: `color-mix(in oklch, var(--text-base), var(--text-tint) calc(100% - var(--text-shade)))`,
		}),
		// .bd - applies border color
		rule(".bd", {
			border_color: vars.border.color,
			border_width: vars.border.width,
			border_style: vars.border.style,
			__border_color: `color-mix(in oklch, var(--border-base), var(--border-tint) calc(100% - var(--border-shade)))`,
		}),
		Object.entries(sides).map(([short, side]) =>
			rule(`.bd-${short}`, {
				[`border_${side.name}_color`]: vars.border.color,
				[`border_${side.name}_width`]: vars.border.width,
				[`border_${side.name}_style`]: vars.border.style,
				[`__border_${side.css}_color`]: `color-mix(in oklch, var(--border-base), var(--border-tint) calc(100% - var(--border-shade)))`,
			})
		),
		// .ol - applies outline color
		rule(".ol", {
			outline_color: vars.outline.color,
			__outline_color: `color-mix(in oklch, var(--outline-base), var(--outline-tint) calc(100% - var(--outline-shade)))`,
		}),
		Object.entries(sides).map(([short, side]) =>
			rule(`.ot-${short}`, {
				[`outline_${side.name}_color`]: vars.outline.color,
				[`outline_${side.name}_width`]: vars.outline.width,
				[`outline_${side.name}_style`]: vars.outline.style,
				[`__outline_${side.css}_color`]: `color-mix(in oklch, var(--outline-base), var(--outline-tint) calc(100% - var(--outline-shade)))`,
			})
		),
		// ------------------------------------------------------------------------
		// COLOR CLASSES
		// ------------------------------------------------------------------------
		// This creates `{.bg,.tx,.bd,.ol}-{color}` classes for each color
		...Object.keys(shorthands).flatMap((short) => [
			colors.map((color) =>
				rule(`.${short}-${color}`, {
					[`__${shorthands[short].name}-base`]: vars.color[color],
					[`__${shorthands[short].name}-tint`]: vars.color[color],
					[`__${shorthands[short].name}-shade`]: `100%`,
					[`__${shorthands[short].name}-opacity`]: `100%`,
				})
			),
			Object.entries(shades).flatMap(([index, grade]) =>
				rule(`.${short}-${index}`, {
					[`__${shorthands[short].name}-tint`]: grade.target,
					[`__${shorthands[short].name}-shade`]: `${grade.value}%`,
				})
			),
			Object.entries(grades).flatMap(([index, grade]) => [
				rule(`.${short}-ink-${index}`, {
					[`__${shorthands[short].name}-tint`]: vars.color.ink,
					[`__${shorthands[short].name}-shade`]: `${grade}%`,
				}),
				rule(`.${short}-paper-${index}`, {
					[`__${shorthands[short].name}-tint`]: vars.color.paper,
					[`__${shorthands[short].name}-shade`]: `${grade}%`,
				}),
				rule(`.${short}-${index}p`, {
					[`__${shorthands[short].name}-opacity`]: `${grade}%`,
				}),
			]),
		]),
		// ------------------------------------------------------------------------
		// RESET CLASSES
		// ------------------------------------------------------------------------
		// TODO: Maybe these should be moved later
		rule(".bg-no", { __background_alpha: 0 }),
		rule(".tx-no", { __text_alpha: 0 }),
		rule(".bd-no", { __border_alpha: 0 }),
		rule(".ol-no", { __outline_alpha: 0 }),
		// Direct transparent application (no variables)
		rule(".nobg", { background_color: "transparent" }),
		rule(".notx", { color: "inherit" }),
		rule(".nobd", { border_color: "transparent" }),
		rule(".nool", { outline_color: "transparent" })
	);
}

export { COLORS };
export default colors;
// EOF
