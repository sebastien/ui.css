import { contrast, group, rule, sides, times, vars } from "../js/uicss.js";

// ----------------------------------------------------------------------------
//
// COLOR SYSTEM
//
// ----------------------------------------------------------------------------
// This module implements a simplified color system with pre-computed scales.
//
// Colors use pre-defined CSS variables from palette.css:
//   --color-{name}-{luminosity} where luminosity is 50, 100, 200, ..., 900, 950
//
// In light mode, index 0 maps to 950 (darkest) and index 10 maps to 50 (lightest)
// In dark mode, index 0 maps to 50 (lightest) and index 10 maps to 950 (darkest)

// ----------------------------------------------------------------------------
// COLOR DEFINITIONS
// ----------------------------------------------------------------------------
// Base palette colors defined in palette.css

const COLORS = [
	// Primary palette
	"red",
	"orange",
	"amber",
	"yellow",
	"lime",
	"green",
	"emerald",
	"teal",
	"cyan",
	"sky",
	"blue",
	"indigo",
	"violet",
	"purple",
	"fuchsia",
	"pink",
	"rose",
	// Neutral palette
	"slate",
	"gray",
	"zinc",
	"stone",
	"taupe",
	"mauve",
	"mist",
	"olive",
];

// Semantic colors (subsets of palette)
const SEMANTIC = {
	paper: "white", // Special: maps to #FFFFFF
	ink: "black", // Special: maps to #000000
	neutral: "slate",
	primary: "blue",
	secondary: "violet",
	tertiary: "teal",
	success: "green",
	info: "cyan",
	warning: "amber",
	danger: "red",
	accent: "blue", // aliased to primary
};

// Special color values that don't exist in palette
const SPECIAL_COLORS = {
	white: "#FFFFFF",
	black: "#000000",
};

// Color property shorthands
const shorthands = {
	bg: { name: "background-color", css: "background-color" },
	tx: { name: "text-color", css: "color" },
	bd: { name: "border-color", css: "border-color" },
	ol: { name: "outline-color", css: "outline-color" },
};

function colorvar(name) {
	return {
		[`--${name}-color`]: `color-mix(in oklch, color-mix(in oklch, ${vars[name].base}, ${vars[name].tint} calc((1 - ${vars[name].blend}) * 100%)), transparent calc((1 - ${vars[name].opacity})) * 100%))`,
	};
}

function colorvars(name, mode = "color") {
	return {
		[`--${name}-base`]: vars[name][mode].base,
		[`--${name}-tint`]: vars[name][mode].tint,
		[`--${name}-blend`]: vars[name][mode].blend,
		[`--${name}-opacity`]: vars[name][mode].opacity,
		...colorvar(name),
	};
}

// Luminosity scale mapping: index 0-10 -> CSS variable suffix
const luminosityScale = [
	950, // 0 - darkest
	900, // 1
	800, // 2
	700, // 3
	600, // 4
	500, // 5 - base
	400, // 6
	300, // 7
	200, // 8
	100, // 9
	50, // 10 - lightest
];

const level = (index, dark = false) =>
	luminosityScale[dark ? 10 - index : index];

const indexedColor = (color, index, dark = false) =>
	`var(--color-${color}-${level(index, dark)})`;

const indexedSemantic = (palette, index, dark = false) =>
	SPECIAL_COLORS[palette] ?? indexedColor(palette, index, dark);

const indexedColorVars = (colors, dark = false) =>
	Object.fromEntries(
		colors.flatMap((color) =>
			luminosityScale.map((_, index) => [
				`--color-${color}-i-${index}`,
				indexedColor(color, index, dark),
			]),
		),
	);

const indexedSemanticVars = (semantic, dark = false) =>
	Object.fromEntries(
		Object.entries(semantic).flatMap(([name, palette]) =>
			luminosityScale.map((_, index) => [
				`--color-${name}-i-${index}`,
				indexedSemantic(palette, index, dark),
			]),
		),
	);

function colormix(base, tint, blend, opacity) {
	const color = `color-mix(in srgb,${tint},${base} ${blend})`;
	return `color-mix(in srgb, transparent, ${color} ${opacity})`;
}

// ----------------------------------------------------------------------------
//
// EXPORTS
//
// ----------------------------------------------------------------------------

function colors(colors = COLORS) {
	const backgroundColor = `color-mix(in oklch, color-mix(in oklch, ${vars.background.color.base}, ${vars.background.color.tint} calc((1 - ${vars.background.color.blend}) * 100%)), transparent calc((1 - ${vars.background.color.opacity}) * 100%))`;
	const textColor = `color-mix(in oklch, color-mix(in oklch, ${vars.text.color.base}, ${vars.text.color.tint} calc((1 - ${vars.text.color.blend}) * 100%)), transparent calc((1 - ${vars.text.color.opacity}) * 100%))`;
	const borderColor = `color-mix(in oklch, color-mix(in oklch, ${vars.border.color.base}, ${vars.border.color.tint} calc((1 - ${vars.border.color.blend}) * 100%)), transparent calc((1 - ${vars.border.color.opacity}) * 100%))`;
	const outlineColor = `color-mix(in oklch, color-mix(in oklch, ${vars.outline.color.base}, ${vars.outline.color.tint} calc((1 - ${vars.outline.color.blend}) * 100%)), transparent calc((1 - ${vars.outline.color.opacity}) * 100%))`;

	return group(
		// ------------------------------------------------------------------------
		// DARK / LIGHT MODE
		// ------------------------------------------------------------------------
		rule(".light, :root", {
			__color_page: `${vars.color.paper}`,
			__color_text: `${vars.color.ink}`,
			...indexedColorVars(colors, false),
			...indexedSemanticVars(SEMANTIC, false),
			// Apply actual properties
			background_color: `${vars.color.paper}`,
			color: `${vars.color.ink}`,
		}),
		rule(".dark", {
			__color_page: `${vars.color.ink}`,
			__color_text: `${vars.color.paper}`,
			...indexedColorVars(colors, true),
			...indexedSemanticVars(SEMANTIC, true),
			// Apply actual properties with swapped colors
			background_color: `${vars.color.ink}`,
			color: `${vars.color.paper}`,
		}),
		// ------------------------------------------------------------------------
		// APPLY CLASSES
		// ------------------------------------------------------------------------
		// .bg - sets the computed background color
		rule(".bg", {
			"--background-color": backgroundColor,
			background_color: `${vars.background.color}`,
		}),
		// .tx - applies the computed text color
		rule(".tx", {
			"--text-color": textColor,
			color: `${vars.text.color}`,
		}),
		// Progressive enhancement: when supported, prefer dynamic contrast for paired bg+tx.
		rule(".bg.tx", {
			color: contrast(`${vars.background.color}`),
		}),
		// .tx-contrast - automatically selects paper or ink for maximum contrast
		rule(".tx-contrast", {
			color: contrast(`${vars.background.color}`),
		}),
		// .bd - applies the computed border color
		rule(".bd", {
			"--border-color": borderColor,
			border_color: `${vars.border.color}`,
			border_width: `${vars.border.width}`,
			border_style: `${vars.border.style}`,
		}),
		Object.entries(sides).map(([short, side]) =>
			rule(`.bd-${short}`, {
				[`border_${side}_color`]: borderColor,
				[`border_${side}_width`]: `${vars.border.width}`,
				[`border_${side}_style`]: `${vars.border.style}`,
			}),
		),
		// .ol - applies the computed outline color
		rule(".ol", {
			"--outline-color": outlineColor,
			outline_color: `${vars.outline.color}`,
		}),
		Object.entries(sides).map(([short, side]) =>
			rule(`.ol-${short}`, {
				[`outline_${side}_color`]: outlineColor,
				[`outline_${side}_width`]: `${vars.outline.width}`,
				[`outline_${side}_style`]: `${vars.outline.style}`,
			}),
		),

		// ------------------------------------------------------------------------
		// COLOR CLASSES - Base colors (500 level by default)
		// ------------------------------------------------------------------------
		// Creates .{bg,tx,bd,ol}-{color} classes for each palette color
		Object.keys(shorthands).flatMap((short) =>
			colors.map((color) =>
				rule(`.${short}-${color}`, {
					[`--${shorthands[short].name}-base`]: vars.color[color][500],
				}),
			),
		),

		// Semantic color classes (handle paper/ink specially)
		Object.keys(shorthands).flatMap((short) =>
			Object.keys(SEMANTIC).map((semantic) =>
				rule(`.${short}-${semantic}`, {
					[`--${shorthands[short].name}-base`]: vars.color[semantic],
				}),
			),
		),

		// ------------------------------------------------------------------------
		// COLOR CLASSES - Index variants (0-10)
		// ------------------------------------------------------------------------
		// Creates .{bg,tx,bd,ol}-{color}-{0-10} classes
		// Index 0 = darkest (950), Index 10 = lightest (50)
		// In light mode: 0->950, 10->50
		// In dark mode: 0->50, 10->950 (inverted via per-mode index vars)
		Object.keys(shorthands).flatMap((short) =>
			colors.flatMap((color) =>
				luminosityScale.map((_, index) =>
					rule(`.${short}-${color}-${index}`, {
						[`--${shorthands[short].name}-base`]: `var(--color-${color}-i-${index})`,
					}),
				),
			),
		),

		// Semantic index variants (handle paper/ink specially - they don't have scales)
		Object.keys(shorthands).flatMap((short) =>
			Object.keys(SEMANTIC).flatMap((semantic) =>
				luminosityScale.map((_, index) =>
					rule(`.${short}-${semantic}-${index}`, {
						[`--${shorthands[short].name}-base`]: `var(--color-${semantic}-i-${index})`,
					}),
				),
			),
		),

		// ------------------------------------------------------------------------
		// OPACITY CLASSES
		// ------------------------------------------------------------------------
		// Creates .{bg,tx,bd,ol}-{0-10}o classes for opacity control
		// 0 = transparent, 10 = opaque
		Object.keys(shorthands).flatMap((short) =>
			times(11, (index) =>
				rule(`.${short}-${index}o`, {
					[`--${shorthands[short].name}-opacity`]: index / 10,
				}),
			),
		),

		// ------------------------------------------------------------------------
		// BLEND CLASSES
		// ------------------------------------------------------------------------
		// Creates .{bg,tx,bd,ol}-{0-10}b classes for blending
		// 0 = 100% tint, 10 = 100% base
		Object.keys(shorthands).flatMap((short) =>
			times(11, (index) =>
				rule(`.${short}-${index}b`, {
					[`--${shorthands[short].name}-blend`]: index / 10,
				}),
			),
		),

		// ------------------------------------------------------------------------
		// TINT COLOR CLASSES
		// ------------------------------------------------------------------------
		// Creates .{bg,tx,bd,ol}-to-{color}-{index} classes for setting tint
		Object.keys(shorthands).flatMap((short) =>
			colors.flatMap((color) =>
				luminosityScale.map((_, index) =>
					rule(`.${short}-to-${color}-${index}`, {
						[`--${shorthands[short].name}-tint`]: `var(--color-${color}-i-${index})`,
					}),
				),
			),
		),

		Object.keys(shorthands).flatMap((short) =>
			Object.keys(SEMANTIC).flatMap((semantic) =>
				luminosityScale.map((_, index) =>
					rule(`.${short}-to-${semantic}-${index}`, {
						[`--${shorthands[short].name}-tint`]: `var(--color-${semantic}-i-${index})`,
					}),
				),
			),
		),

		Object.keys(shorthands).flatMap((short) =>
			luminosityScale.flatMap((_, index) => [
				rule(`.${short}-to-white-${index}`, {
					[`--${shorthands[short].name}-tint`]: SPECIAL_COLORS.white,
				}),
				rule(`.${short}-to-black-${index}`, {
					[`--${shorthands[short].name}-tint`]: SPECIAL_COLORS.black,
				}),
			]),
		),

		// Special tint classes (no index required)
		Object.keys(shorthands).flatMap((short) => [
			rule(`.${short}-to-paper`, {
				[`--${shorthands[short].name}-tint`]: `${vars.color.paper}`,
			}),
			rule(`.${short}-to-ink`, {
				[`--${shorthands[short].name}-tint`]: `${vars.color.ink}`,
			}),
			rule(`.${short}-to-transparent`, {
				[`--${shorthands[short].name}-opacity`]: 0,
			}),
		]),

		// ------------------------------------------------------------------------
		// RESET CLASSES
		// ------------------------------------------------------------------------
		rule(".nobg", { background_color: "transparent" }),
		rule(".notx", { color: "inherit" }),
		rule(".nobd", { border_color: "transparent" }),
		rule(".nool", { outline_color: "transparent" }),
		// Opacity-based resets
		rule(".bg-0o", { "--background-color-opacity": 0 }),
		rule(".tx-0o", { "--text-color-opacity": 0 }),
		rule(".bd-0o", { "--border-color-opacity": 0 }),
		rule(".ol-0o", { "--outline-color-opacity": 0 }),
	);
}

export { COLORS, SEMANTIC, colormix, colorvars };
export default Object.assign(colors, { mix: colormix, vars: colorvars });
// EOF
