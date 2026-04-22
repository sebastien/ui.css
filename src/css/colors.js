import { contrast, group, rule, vars } from "../js/uicss.js";

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
	"neutral",
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
	bg: { name: "background", css: "background-color" },
	tx: { name: "text", css: "color" },
	bd: { name: "border", css: "border-color" },
	ol: { name: "outline", css: "outline-color" },
};

// Side shortcuts for borders/outlines
const sides = {
	t: { name: "top" },
	r: { name: "right" },
	b: { name: "bottom" },
	l: { name: "left" },
};

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
	return group(
		// ------------------------------------------------------------------------
		// DARK / LIGHT MODE
		// ------------------------------------------------------------------------
		rule(".light, :root", {
			__color_page: "var(--color-paper)",
			__color_text: "var(--color-ink)",
			// Apply actual properties
			background_color: "var(--color-paper)",
			color: "var(--color-ink)",
		}),
		rule(".dark", {
			__color_page: "var(--color-ink)",
			__color_text: "var(--color-paper)",
			// Apply actual properties with swapped colors
			background_color: "var(--color-ink)",
			color: "var(--color-paper)",
		}),

		// ------------------------------------------------------------------------
		// SEMANTIC COLOR VARIABLES
		// ------------------------------------------------------------------------
		// Map semantic names to palette colors (handle paper/ink specially)
		Object.entries(SEMANTIC).map(([semantic, palette]) =>
			rule(`:root`, {
				[`__color-${semantic}`]: SPECIAL_COLORS[palette]
					? SPECIAL_COLORS[palette]
					: `var(--color-${palette}-500)`,
			}),
		),

		// ------------------------------------------------------------------------
		// APPLY CLASSES
		// ------------------------------------------------------------------------
		// .bg - applies the computed background color
		rule(".bg", {
			background_color: `color-mix(in oklch, color-mix(in oklch, var(--background-base), var(--background-tint) calc((1 - var(--background-blend)) * 100%)), transparent calc((1 - var(--background-opacity)) * 100%))`,
		}),
		// .tx - applies the computed text color
		rule(".tx", {
			color: `color-mix(in oklch, color-mix(in oklch, var(--text-base), var(--text-tint) calc((1 - var(--text-blend)) * 100%)), transparent calc((1 - var(--text-opacity)) * 100%))`,
		}),
		// .tx-contrast - automatically selects paper or ink for maximum contrast
		rule(".tx-contrast", {
			color: contrast("var(--text-base)"),
		}),
		// .bd - applies the computed border color
		rule(".bd", {
			border_color: `color-mix(in oklch, color-mix(in oklch, var(--border-base), var(--border-tint) calc((1 - var(--border-blend)) * 100%)), transparent calc((1 - var(--border-opacity)) * 100%))`,
			border_width: vars.border.width,
			border_style: vars.border.style,
		}),
		Object.entries(sides).map(([short, side]) =>
			rule(`.bd-${short}`, {
				[`border_${side.name}_color`]: `color-mix(in oklch, color-mix(in oklch, var(--border-base), var(--border-tint) calc((1 - var(--border-blend)) * 100%)), transparent calc((1 - var(--border-opacity)) * 100%))`,
				[`border_${side.name}_width`]: vars.border.width,
				[`border_${side.name}_style`]: vars.border.style,
			}),
		),
		// .ol - applies the computed outline color
		rule(".ol", {
			outline_color: `color-mix(in oklch, color-mix(in oklch, var(--outline-base), var(--outline-tint) calc((1 - var(--outline-blend)) * 100%)), transparent calc((1 - var(--outline-opacity)) * 100%))`,
		}),
		Object.entries(sides).map(([short, side]) =>
			rule(`.ol-${short}`, {
				[`outline_${side.name}_color`]: `color-mix(in oklch, color-mix(in oklch, var(--outline-base), var(--outline-tint) calc((1 - var(--outline-blend)) * 100%)), transparent calc((1 - var(--outline-opacity)) * 100%))`,
				[`outline_${side.name}_width`]: vars.outline.width,
				[`outline_${side.name}_style`]: vars.outline.style,
			}),
		),

		// ------------------------------------------------------------------------
		// COLOR CLASSES - Base colors (500 level by default)
		// ------------------------------------------------------------------------
		// Creates .{bg,tx,bd,ol}-{color} classes for each palette color
		Object.keys(shorthands).flatMap((short) =>
			colors.map((color) =>
				rule(`.${short}-${color}`, {
					[`--${shorthands[short].name}-base`]: `var(--color-${color}-500)`,
				}),
			),
		),

		// Semantic color classes (handle paper/ink specially)
		Object.keys(shorthands).flatMap((short) =>
			Object.keys(SEMANTIC).map((semantic) =>
				rule(`.${short}-${semantic}`, {
					[`--${shorthands[short].name}-base`]: `var(--color-${semantic})`,
				}),
			),
		),

		// ------------------------------------------------------------------------
		// COLOR CLASSES - Index variants (0-10)
		// ------------------------------------------------------------------------
		// Creates .{bg,tx,bd,ol}-{color}-{0-10} classes
		// Index 0 = darkest (950), Index 10 = lightest (50)
		// In light mode: 0->950, 10->50
		// In dark mode: 0->50, 10->950 (inverted via CSS logic)
		Object.keys(shorthands).flatMap((short) =>
			colors.flatMap((color) =>
				luminosityScale.map((luma, index) =>
					rule(`.${short}-${color}-${index}`, {
						[`--${shorthands[short].name}-base`]: `var(--color-${color}-${luma})`,
					}),
				),
			),
		),

		// Semantic index variants (handle paper/ink specially - they don't have scales)
		Object.keys(shorthands).flatMap((short) =>
			Object.keys(SEMANTIC).flatMap((semantic) =>
				luminosityScale.map((luma, index) =>
					rule(`.${short}-${semantic}-${index}`, {
						[`--${shorthands[short].name}-base`]: `var(--color-${semantic}-${luma})`,
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
				luminosityScale.map((luma, index) =>
					rule(`.${short}-to-${color}-${index}`, {
						[`--${shorthands[short].name}-tint`]: `var(--color-${color}-${luma})`,
					}),
				),
			),
		),

		// Special tint classes (no index required)
		Object.keys(shorthands).flatMap((short) => [
			rule(`.${short}-to-paper`, {
				[`--${shorthands[short].name}-tint`]: `var(--color-paper)`,
			}),
			rule(`.${short}-to-ink`, {
				[`--${shorthands[short].name}-tint`]: `var(--color-ink)`,
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
		rule(".bg-0o", { "--background-opacity": 0 }),
		rule(".tx-0o", { "--text-opacity": 0 }),
		rule(".bd-0o", { "--border-opacity": 0 }),
		rule(".ol-0o", { "--outline-opacity": 0 }),
	);
}

// Helper function for times
function times(n, f) {
	const r = new Array(n);
	for (let i = 0; i < n; i++) {
		r[i] = f(i);
	}
	return r;
}

export { COLORS, SEMANTIC, colormix };
export default colors;
// EOF
