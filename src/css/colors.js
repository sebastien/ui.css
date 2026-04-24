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
	error: "red",
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

const ckey = (...path) => `__${path.join("_")}`;

function colorvar(name) {
	return {
		[ckey(name, "color")]:
			`color-mix(in oklch, color-mix(in oklch, ${vars[name].base}, ${vars[name].tint} calc((1 - ${vars[name].blend}) * 100%)), transparent calc((1 - ${vars[name].opacity})) * 100%))`,
	};
}

function colorvars(name, mode = "color") {
	return {
		[ckey(name, "base")]: vars[name][mode].base,
		[ckey(name, "tint")]: vars[name][mode].tint,
		[ckey(name, "blend")]: vars[name][mode].blend,
		[ckey(name, "opacity")]: vars[name][mode].opacity,
		...colorvar(name),
	};
}

function colormix(base, tint, blend, opacity) {
	const color = `color-mix(in srgb,${tint},${base} ${blend})`;
	return `color-mix(in srgb, transparent, ${color} ${opacity})`;
}

// Function: colormixin
// Generates a color-mix() CSS expression using variable references.
// With opacity: wraps in a second color-mix for transparency.
function colormixin(color) {
	const inner = `color-mix(in oklch, ${color.base}, ${color.tint} calc(100% - ${color.blend}))`;
	if (color.opacity) {
		return `color-mix(in oklch, ${inner}, transparent calc(100% - ${color.opacity}))`;
	}
	return inner;
}

// NOTE: component token helper mutators were removed.
// Components now consume token variables directly with CSS fallback chains.

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
			// Apply actual properties
			background_color: `${vars.color.paper}`,
			color: `${vars.color.ink}`,
		}),
		rule(".dark", {
			__color_page: `${vars.color.ink}`,
			__color_text: `${vars.color.paper}`,
			// Apply actual properties with swapped colors
			background_color: `${vars.color.ink}`,
			color: `${vars.color.paper}`,
		}),
		// ------------------------------------------------------------------------
		// APPLY CLASSES
		// ------------------------------------------------------------------------
		// .bg - sets the computed background color
		rule(".bg", {
			__background_color: backgroundColor,
			background_color: `${vars.background.color}`,
		}),
		// .tx - applies the computed text color
		rule(".tx", {
			__text_color: textColor,
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
			__border_color: borderColor,
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
			__outline_color: outlineColor,
			outline_color: `${vars.outline.color}`,
		}),

		// ------------------------------------------------------------------------
		// COLOR CLASSES - Semantic colors
		// ------------------------------------------------------------------------
		// Creates .{bg,tx,bd,ol}-{semantic} classes for semantic colors
		Object.keys(shorthands).flatMap((short) =>
			Object.keys(SEMANTIC).map((semantic) =>
				rule(`.${short}-${semantic}`, {
					[`__${shorthands[short].name.replaceAll("-", "_")}_base`]:
						vars.color[semantic],
				}),
			),
		),

		// ------------------------------------------------------------------------
		// OPACITY CLASSES
		// ------------------------------------------------------------------------
		// Creates .{bg,tx,bd,ol}-{0,2,4,6,8,10}o classes for opacity control
		// 0 = transparent, 10 = opaque
		Object.keys(shorthands).flatMap((short) =>
			[0, 2, 4, 6, 8, 10].map((index) =>
				rule(`.${short}-${index}o`, {
					[`__${shorthands[short].name.replaceAll("-", "_")}_opacity`]:
						index / 10,
				}),
			),
		),

		// ------------------------------------------------------------------------
		// BLEND CLASSES
		// ------------------------------------------------------------------------
		// Creates .{bg,tx,bd,ol}-{0,2,4,6,8,10}b classes for blending
		// 0 = 100% tint, 10 = 100% base
		Object.keys(shorthands).flatMap((short) =>
			[0, 2, 4, 6, 8, 10].map((index) =>
				rule(`.${short}-${index}b`, {
					[`__${shorthands[short].name.replaceAll("-", "_")}_blend`]:
						index / 10,
				}),
			),
		),

		// ------------------------------------------------------------------------
		// TINT COLOR CLASSES
		// ------------------------------------------------------------------------
		// Creates .{bg,tx,bd,ol}-to-{semantic} classes for setting tint
		Object.keys(shorthands).flatMap((short) =>
			Object.keys(SEMANTIC).map((semantic) =>
				rule(`.${short}-to-${semantic}`, {
					[`__${shorthands[short].name.replaceAll("-", "_")}_tint`]:
						vars.color[semantic],
				}),
			),
		),

		// Special tint classes (no index required)
		Object.keys(shorthands).flatMap((short) => [
			rule(`.${short}-to-white`, {
				[`__${shorthands[short].name.replaceAll("-", "_")}_tint`]:
					SPECIAL_COLORS.white,
			}),
			rule(`.${short}-to-black`, {
				[`__${shorthands[short].name.replaceAll("-", "_")}_tint`]:
					SPECIAL_COLORS.black,
			}),
			rule(`.${short}-to-paper`, {
				[`__${shorthands[short].name.replaceAll("-", "_")}_tint`]: `${vars.color.paper}`,
			}),
			rule(`.${short}-to-ink`, {
				[`__${shorthands[short].name.replaceAll("-", "_")}_tint`]: `${vars.color.ink}`,
			}),
			rule(`.${short}-to-transparent`, {
				[`__${shorthands[short].name.replaceAll("-", "_")}_opacity`]: 0,
			}),
		]),

		// ------------------------------------------------------------------------
		// RESET CLASSES
		// ------------------------------------------------------------------------
		rule(".nobg", { background_color: "transparent" }),
		rule(".notx", { color: "inherit" }),
		rule(".nobd", { border_color: "transparent" }),
		rule(".nool", { outline_color: "transparent" }),
	);
}

export { COLORS, SEMANTIC, colormix, colormixin, colorvars };
export default Object.assign(colors, {
	mix: colormix,
	colormixin,
	vars: colorvars,
});
// EOF
