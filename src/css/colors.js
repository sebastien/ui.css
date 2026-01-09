import { group, vars, rule } from "../js/littlecss.js";

// ----------------------------------------------------------------------------
//
// COLOR SYSTEM
//
// ----------------------------------------------------------------------------
// This module implements the unified color system described in spec-colors.md.
// Colors are computed using OKLCH with the formula:
//   color = oklch(L C H / A)
// where:
//   L = clamp(0, 0.05 + (l + delta-l) / 10, 1)  // 0→0.05 (near-black), 9→0.95 (near-white)
//   C = clamp(0, (c + delta-c) / 9 * 0.4, 0.4)
//   H = base-hue + (h + delta-h) * 40
//   A = clamp(0, (o + delta-o) / 9, 1)

const COLOR_NAMES = [
	"paper",
	"ink",
	"neutral",
	"primary",
	"secondary",
	"tertiary",
	"success",
	"info",
	"warning",
	"danger",
];

// Property definitions: short prefix, full name, CSS property
export const PROPS = [
	{ short: "bg", full: "background", css: "background_color" },
	{ short: "tx", full: "text", css: "color" },
	{ short: "bd", full: "border", css: "border_color" },
	{ short: "ol", full: "outline", css: "outline_color" },
];

// Compute the OKLCH color string from variables
// For text, we clamp L between l-min and l-max for contrast
// Luminosity maps 0-9 to 0.05-0.95 (near-black to near-white in light mode)
// In dark mode, the scale inverts: 0-9 maps to 0.95-0.05
// Formula: L = 0.5 + direction * (l - 4.5) / 10
//   direction=1:  L = 0.05 + l/10 (light mode)
//   direction=-1: L = 0.95 - l/10 (dark mode)
export function computeColor(prop, useConstraints = false) {
	const v = vars[prop.full];
	const dir = vars.color.l.direction;

	// Base luminosity calculation with direction
	const lBase = `(0.5 + ${dir} * ((${v.l} + ${v.delta.l}) - 4.5) / 10)`;

	const lCalc = useConstraints
		? `clamp(0.5 + ${dir} * (${v.l.min} - 4.5) / 10, ${lBase}, 0.5 + ${dir} * (${v.l.max} - 4.5) / 10)`
		: `clamp(0, ${lBase}, 1)`;

	return `oklch(from ${v.base} calc(${lCalc}) calc(clamp(0, (${v.c} + ${v.delta.c}) / 9 * c * 2, 0.4)) calc(h + (${v.h} + ${v.delta.h}) * 40) / calc(clamp(0, (${v.o} + ${v.delta.o}) / 9, 1)))`;
}

// Generate luminosity modifier classes
function luminosityClasses(prop) {
	return Array.from({ length: 10 }, (_, i) =>
		rule(`.${prop.short}-${i}`, { [`__${prop.full}_l`]: i }),
	);
}

// Generate chroma modifier classes (suffix: c)
function chromaClasses(prop) {
	return Array.from({ length: 10 }, (_, i) =>
		rule(`.${prop.short}-${i}c`, { [`__${prop.full}_c`]: i }),
	);
}

// Generate opacity modifier classes (suffix: o)
function opacityClasses(prop) {
	return Array.from({ length: 10 }, (_, i) =>
		rule(`.${prop.short}-${i}o`, { [`__${prop.full}_o`]: i }),
	);
}

// Generate delta luminosity classes (+/-)
function deltaLuminosityClasses(prop) {
	const plus = Array.from({ length: 9 }, (_, i) =>
		rule(`.${prop.short}-l\\+${i + 1}`, {
			[`__${prop.full}_delta_l`]: i + 1,
		}),
	);
	const minus = Array.from({ length: 9 }, (_, i) =>
		rule(`.${prop.short}-l-${i + 1}`, {
			[`__${prop.full}_delta_l`]: -(i + 1),
		}),
	);
	return [...plus, ...minus];
}

// Generate delta chroma classes (+/-)
function deltaChromaClasses(prop) {
	const plus = Array.from({ length: 9 }, (_, i) =>
		rule(`.${prop.short}-c\\+${i + 1}`, {
			[`__${prop.full}_delta_c`]: i + 1,
		}),
	);
	const minus = Array.from({ length: 9 }, (_, i) =>
		rule(`.${prop.short}-c-${i + 1}`, {
			[`__${prop.full}_delta_c`]: -(i + 1),
		}),
	);
	return [...plus, ...minus];
}

// Generate delta hue classes (+/-)
function deltaHueClasses(prop) {
	const plus = Array.from({ length: 9 }, (_, i) =>
		rule(`.${prop.short}-h\\+${i + 1}`, {
			[`__${prop.full}_delta_h`]: i + 1,
		}),
	);
	const minus = Array.from({ length: 9 }, (_, i) =>
		rule(`.${prop.short}-h-${i + 1}`, {
			[`__${prop.full}_delta_h`]: -(i + 1),
		}),
	);
	return [...plus, ...minus];
}

// Generate delta opacity classes (+/-)
function deltaOpacityClasses(prop) {
	const plus = Array.from({ length: 9 }, (_, i) =>
		rule(`.${prop.short}-o\\+${i + 1}`, {
			[`__${prop.full}_delta_o`]: i + 1,
		}),
	);
	const minus = Array.from({ length: 9 }, (_, i) =>
		rule(`.${prop.short}-o-${i + 1}`, {
			[`__${prop.full}_delta_o`]: -(i + 1),
		}),
	);
	return [...plus, ...minus];
}

// Named luminosity variants
function namedLuminosityClasses(prop) {
	return [
		rule(`.${prop.short}-darkest`, { [`__${prop.full}_delta_l`]: -4 }),
		rule(`.${prop.short}-darker`, { [`__${prop.full}_delta_l`]: -2 }),
		rule(`.${prop.short}-dark`, { [`__${prop.full}_delta_l`]: -1 }),
		rule(`.${prop.short}-light`, { [`__${prop.full}_delta_l`]: 1 }),
		rule(`.${prop.short}-lighter`, { [`__${prop.full}_delta_l`]: 2 }),
		rule(`.${prop.short}-lightest`, { [`__${prop.full}_delta_l`]: 4 }),
	];
}

// Semantic color classes for a property
// Ink and paper are special: they ignore luminosity and chroma modifiers
// but still allow opacity adjustments
function semanticColorClasses(prop) {
	return COLOR_NAMES.map((color) => {
		const base = { [`__${prop.full}_base`]: vars.color[color] };
		// Ink: forces scale position 0 (dark in light mode, light in dark mode)
		if (color === "ink") {
			return rule(`.${prop.short}-${color}`, {
				...base,
				[`__${prop.full}_l`]: 0,
				[`__${prop.full}_c`]: 0,
				[`__${prop.full}_delta_l`]: 0,
				[`__${prop.full}_delta_c`]: 0,
			});
		}
		// Paper: forces scale position 9 (light in light mode, dark in dark mode)
		if (color === "paper") {
			return rule(`.${prop.short}-${color}`, {
				...base,
				[`__${prop.full}_l`]: 9,
				[`__${prop.full}_c`]: 0,
				[`__${prop.full}_delta_l`]: 0,
				[`__${prop.full}_delta_c`]: 0,
			});
		}
		return rule(`.${prop.short}-${color}`, base);
	});
}

// Text luminosity classes that override contrast constraints
function textLuminosityOverrideClasses() {
	return Array.from({ length: 10 }, (_, i) =>
		rule(`.tx-${i}`, {
			__text_l: i,
			// Remove constraints when explicitly set
			__text_l_min: 0,
			__text_l_max: 9,
		}),
	);
}

export { COLOR_NAMES };
export default group(
	// ------------------------------------------------------------------------
	// DARK / LIGHT MODE
	// ------------------------------------------------------------------------
	rule(".light, :root", {
		__color_page: vars.color.paper,
		__color_text: vars.color.ink,
		__color_l_direction: 1,
	}),
	rule(".dark", {
		__color_page: vars.color.ink,
		__color_text: vars.color.paper,
		__color_l_direction: -1,
	}),

	// ------------------------------------------------------------------------
	// APPLY CLASSES
	// ------------------------------------------------------------------------
	// .bg - applies background color and sets text contrast constraints
	rule(".bg", {
		background_color: computeColor(PROPS[0]),
		// Calculate if background is dark (L <= 4) for contrast
		// bg-is-dark: 1 if dark, 0 if light
		__bg_is_dark: `clamp(0, (4.5 - ${vars.background.l} - ${vars.background.delta.l}) * 10, 1)`,
		// Set text constraints: dark bg = light text (8-9), light bg = dark text (0-1)
		__text_l_min: `calc(${vars.bg.is.dark} * 8)`,
		__text_l_max: `calc(1 + ${vars.bg.is.dark} * 8)`,
	}),
	// .tx - applies text color with contrast constraints
	rule(".tx", {
		color: computeColor(PROPS[1], true),
	}),
	// .bd - applies border color
	rule(".bd", {
		border_color: computeColor(PROPS[2]),
		border_width: vars.border.width,
	}),
	// .ol - applies outline color
	rule(".ol", {
		outline_color: computeColor(PROPS[3]),
	}),

	// ------------------------------------------------------------------------
	// SEMANTIC COLOR CLASSES
	// ------------------------------------------------------------------------
	...PROPS.flatMap(semanticColorClasses),

	// ------------------------------------------------------------------------
	// LUMINOSITY CLASSES (0-9)
	// ------------------------------------------------------------------------
	// For text, use override classes that remove constraints
	...luminosityClasses(PROPS[0]), // bg
	...textLuminosityOverrideClasses(), // tx (with constraint override)
	...luminosityClasses(PROPS[2]), // bd
	...luminosityClasses(PROPS[3]), // ol

	// ------------------------------------------------------------------------
	// CHROMA CLASSES (0-9)c
	// ------------------------------------------------------------------------
	...PROPS.flatMap(chromaClasses),

	// ------------------------------------------------------------------------
	// OPACITY CLASSES (0-9)o
	// ------------------------------------------------------------------------
	...PROPS.flatMap(opacityClasses),

	// ------------------------------------------------------------------------
	// DELTA LUMINOSITY CLASSES (l+1 to l+9, l-1 to l-9)
	// ------------------------------------------------------------------------
	...PROPS.flatMap(deltaLuminosityClasses),

	// ------------------------------------------------------------------------
	// NAMED LUMINOSITY VARIANTS
	// ------------------------------------------------------------------------
	...PROPS.flatMap(namedLuminosityClasses),

	// ------------------------------------------------------------------------
	// DELTA CHROMA CLASSES (c+1 to c+9, c-1 to c-9)
	// ------------------------------------------------------------------------
	...PROPS.flatMap(deltaChromaClasses),

	// ------------------------------------------------------------------------
	// DELTA HUE CLASSES (h+1 to h+9, h-1 to h-9)
	// ------------------------------------------------------------------------
	...PROPS.flatMap(deltaHueClasses),

	// ------------------------------------------------------------------------
	// DELTA OPACITY CLASSES (o+1 to o+9, o-1 to o-9)
	// ------------------------------------------------------------------------
	...PROPS.flatMap(deltaOpacityClasses),

	// ------------------------------------------------------------------------
	// RESET CLASSES
	// ------------------------------------------------------------------------
	rule(".bg-no", { __background_o: 0 }),
	rule(".tx-no", { __text_o: 0 }),
	rule(".bd-no", { __border_o: 0 }),
	rule(".ol-no", { __outline_o: 0 }),
	// Direct transparent application (no variables)
	rule(".nobg", { background_color: "transparent" }),
	rule(".notx", { color: "inherit" }),
	rule(".nobd", { border_color: "transparent" }),
	rule(".nool", { outline_color: "transparent" }),
);
