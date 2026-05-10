import {
	contrast,
	group,
	rule,
	sides,
	times,
	vars,
	percent,
} from "../js/uicss.js";

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
	"white",
	"black",
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

function colorvar(name) {
	return {
		[`__${name}_color`]: colormix(
			vars[name].base,
			vars[name].tint.or(vars.color.tint),
			vars[name].blend,
			vars[name].opacity,
		),
	};
}

function colorvars(name, mode = "color") {
	return {
		[`__${name}_base`]: vars[name][mode].base,
		[`__${name}_tint`]: vars[name][mode].tint.or(vars.color.tint),
		[`__${name}_blend`]: vars[name][mode].blend,
		[`__${name}_opacity`]: vars[name][mode].opacity,
		...colorvar(name),
	};
}
function alpha(base, opacity = 1.0) {
	return `color-mix(in oklch, ${base}, transparent calc(100% - 100% * ${opacity}))`;
}

function colormix(
	base,
	tint = vars.color.tint.or(vars.color.paper),
	blend = 1.0,
	opacity = 1.0,
) {
	const inner = `color-mix(in oklch, ${base}, ${tint} calc(100% - 100% * ${blend}))`;
	return opacity === undefined
		? inner
		: `color-mix(in oklch, ${inner}, transparent calc(100% - 100% * ${opacity}))`;
}

// Function: colormixin
// Generates a color-mix() CSS expression using variable references.
// With opacity: wraps in a second color-mix for transparency.
function colormixin(color) {
	return colormix(color.base, color.tint, color.blend, color.opacity);
}

// NOTE: component token helper mutators were removed.
// Components now consume token variables directly with CSS fallback chains.

// ----------------------------------------------------------------------------
//
// EXPORTS
//
// ----------------------------------------------------------------------------

function colors(colors = COLORS) {
	const backgroundColor = colormix(
		vars.background.color.base,
		vars.background.color.tint,
		vars.background.color.blend,
		vars.background.color.opacity,
	);
	const textColor = colormix(
		vars.text.color.base,
		vars.text.color.tint,
		vars.text.color.blend,
		vars.text.color.opacity,
	);
	const borderColor = colormix(
		vars.border.color.base,
		vars.border.color.tint,
		vars.border.color.blend,
		vars.border.color.opacity,
	);
	const outlineColor = colormix(
		vars.outline.color.base,
		vars.outline.color.tint,
		vars.outline.color.blend,
		vars.outline.color.opacity,
	);

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
		// COLOR CLASSES - Palette colors
		// ------------------------------------------------------------------------
		// Creates .{bg,tx,bd,ol}-{color} classes from the provided colors list
		Object.keys(shorthands).flatMap((short) =>
			colors.map((color) =>
				rule(`.${short}-${color}`, {
					[`__${shorthands[short].name.replaceAll("-", "_")}_base`]:
						vars.color[color],
				}),
			),
		),

		// ------------------------------------------------------------------------
		// OPACITY CLASSES
		// ------------------------------------------------------------------------
		// Creates .{bg,tx,bd,ol}-{0-10}o classes for opacity control
		// 0 = transparent, 10 = opaque
		Object.keys(shorthands).flatMap((short) => [
			...times(10).map((index) =>
				rule(`.${short}-${index}o`, {
					[`__${shorthands[short].name.replaceAll("-", "_")}_opacity`]:
						index / 10,
				}),
			),
			rule(`.${short}-o`, {
				[`__${shorthands[short].name.replaceAll("-", "_")}_opacity`]: 1.0,
			}),
		]),

		// ------------------------------------------------------------------------
		// BLEND CLASSES
		// ------------------------------------------------------------------------
		// Creates .{bg,tx,bd,ol}-{0-10}b classes for blending
		// 0 = 100% tint, 10 = 100% base
		Object.keys(shorthands).flatMap((short) =>
			times(10).map((index) =>
				rule(`.${short}-${index}b`, {
					[`__${shorthands[short].name.replaceAll("-", "_")}_blend`]:
						index / 10,
				}),
			),
		),
		Object.keys(shorthands).map((short) =>
			rule(`.${short}-b`, {
				[`__${shorthands[short].name.replaceAll("-", "_")}_blend`]: 1.0,
			}),
		),
		// ------------------------------------------------------------------------
		// TINT COLOR CLASSES
		// ------------------------------------------------------------------------
		// Creates .{bg,tx,bd,ol}-to-{semantic} classes for setting tint
		Object.keys(shorthands).flatMap((short) =>
			[...Object.keys(SEMANTIC), ...colors].map((color) =>
				rule(`.${short}-to-${color}`, {
					[`__${shorthands[short].name.replaceAll("-", "_")}_tint`]:
						vars.color[color],
				}),
			),
		),
		// Sets all the tints to the given color
		[...Object.keys(SEMANTIC), ...colors].map((color) =>
			rule(`.to-${color}`, {
				__color_tint: vars.color[color],
				__border_color_tint: vars.color[color],
				__background_color_tint: vars.color[color],
				__outline_color_tint: vars.color[color],
			}),
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
		rule(".nool", {
			outline_color: "transparent !important",
			outline_width: "0px !important",
		}),
	);
}

export { COLORS, SEMANTIC, colormix, colormixin, colorvars };
export default Object.assign(colors, {
	mix: colormixin,
	mixed: colormix,
	vars: colorvars,
	alpha,
	names: Object.keys(SEMANTIC),
});
// EOF
