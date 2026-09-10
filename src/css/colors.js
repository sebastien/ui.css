import {
	contrast,
	group,
	root,
	rule,
	sides,
	times,
	vars,
} from "../js/uicss.js";

// ----------------------------------------------------------------------------
//
// COLOR SYSTEM
//
// ----------------------------------------------------------------------------
// This module composes semantic and palette tokens through color-mix().
// Palette names resolve directly as --color-{name}.

// ----------------------------------------------------------------------------
// COLOR DEFINITIONS
// ----------------------------------------------------------------------------
// Base palette colors are provided as --color-{name} tokens by a palette.

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

// Semantic token names. Their values are defined by tokens.js and themes.
const SEMANTIC = [
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
	"error",
	"accent",
];

// Color property shorthands
const shorthands = {
	bg: { name: "background-color", css: "background-color" },
	tx: { name: "text-color", css: "color" },
	bd: { name: "border-color", css: "border-color" },
	ol: { name: "outline-color", css: "outline-color" },
};

const fades = {
	t: "to top",
	b: "to bottom",
	l: "to left",
	r: "to right",
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
		rule([root], {
			__color_page: `${vars.color.paper}`,
			__color_text: `${vars.color.ink}`,
			__color_surface: `${vars.color.paper}`,
			__color_surface_text: `${vars.color.ink}`,
			// Publish the structural border color once so components and the
			// .lined/table separators share one mode-aware value.
			__border_color: borderColor,
			color: `${vars.color.ink}`,
		}),
		rule([`${root}.light`, `${root} .light`], {
			__color_page: `${vars.color.paper}`,
			__color_text: `${vars.color.ink}`,
			__color_surface: `${vars.color.paper}`,
			__color_surface_text: `${vars.color.ink}`,
			// Apply actual properties
			background_color: `${vars.color.paper}`,
			color: `${vars.color.ink}`,
		}),
		rule([`${root}.dark`, `${root} .dark`], {
			__color_page: `${vars.color.ink}`,
			__color_text: `${vars.color.paper}`,
			__color_surface: `${vars.color.ink}`,
			__color_surface_text: `${vars.color.paper}`,
			// Apply actual properties with swapped colors
			background_color: `${vars.color.ink}`,
			color: `${vars.color.paper}`,
		}),
		rule(`.bg-def`, {
			background_color: `${vars.color.page}`,
		}),
		rule(`.tx-def`, {
			color: `${vars.color.text}`,
		}),
		// ------------------------------------------------------------------------
		// APPLY CLASSES
		// ------------------------------------------------------------------------
		// .bg - sets the computed background color
		rule(".bg", {
			__background_color: backgroundColor,
			background_color: `${vars.background.color}`,
		}),
		Object.entries(fades).map(([short, direction]) =>
			rule(`.bg-fade-${short}`, {
				background_color: "transparent",
				background_image: `linear-gradient(${direction}, ${vars.background.color} 0%, transparent 100%)`,
				background_repeat: "no-repeat",
				background_size: "100% 100%",
			}),
		),
		rule([".bgc", ".pill", ".badge"], {
			__background_color: backgroundColor,
		}),
		// .tx - applies the computed text color
		rule(".txc", {
			color: `${vars.text.color}`,
		}),
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
		// .bdc and .lined compute the current border color.
		rule([".bdc", ".lined"], {
			__border_color: borderColor,
		}),
		rule(".bd", {
			__border_color: borderColor,
			border_color: `${vars.border.color}`,
			border_width: `${vars.border.width}`,
			border_style: `${vars.border.style}`,
		}),
		// Paints the border as an inset shadow to avoid layout shift when border is applied.
		rule(".bds", {
			__border_color: borderColor,
			box_shadow: `inset calc(-1 * ${vars.border.width}) 0 ${vars.border.color}`,
		}),
		...times(7).map((_) =>
			rule(`.bd-${_}`, {
				__border_width: `${_}px`,
			}),
		),
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
			outline_width: `${vars.outline.width.or("1px")}`,
			outline_offset: `${vars.outline.offset.or("0px")}`,
		}),
		...times(7).map((index) =>
			rule(`.oli-${index}`, {
				__outline_offset: `-${index}px`,
			}),
		),
		...times(7).map((index) =>
			rule(`.olo-${index}`, {
				__outline_offset: `${index}px`,
			}),
		),
		...times(7).map((index) =>
			rule(`.ol-${index}`, {
				__outline_width: `${index}px`,
			}),
		),
		// ------------------------------------------------------------------------
		// COLOR CLASSES - Semantic colors
		// ------------------------------------------------------------------------
		// Creates .{bg,tx,bd,ol}-{semantic} classes for semantic colors
		Object.keys(shorthands).flatMap((short) =>
			SEMANTIC.map((semantic) =>
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
			rule(`.${short}o`, {
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
			rule(`.${short}b`, {
				[`__${shorthands[short].name.replaceAll("-", "_")}_blend`]: 1.0,
			}),
		),
		// ------------------------------------------------------------------------
		// TINT COLOR CLASSES
		// ------------------------------------------------------------------------
		// Creates .{bg,tx,bd,ol}-to-{semantic} classes for setting tint
		Object.keys(shorthands).flatMap((short) =>
			[...SEMANTIC, ...colors].map((color) =>
				rule(`.${short}-to-${color}`, {
					[`__${shorthands[short].name.replaceAll("-", "_")}_tint`]:
						vars.color[color],
				}),
			),
		),
		// Sets all the tints to the given color
		[...SEMANTIC, ...colors].map((color) =>
			rule(`.to-${color}`, {
				__color_tint: vars.color[color],
				__text_color_tint: vars.color[color],
				__border_color_tint: vars.color[color],
				__background_color_tint: vars.color[color],
				__outline_color_tint: vars.color[color],
			}),
		),

		// Transparent is an opacity alias, not a tint value.
		Object.keys(shorthands).flatMap((short) => [
			rule(`.${short}-to-transparent`, {
				[`__${shorthands[short].name.replaceAll("-", "_")}_opacity`]: 0,
			}),
		]),
		// ------------------------------------------------------------------------
		// RESET CLASSES
		// ------------------------------------------------------------------------
		// Reset inherited color recipes on direct content children. :where() keeps
		// these wrappers weaker than any explicit color utility on the child.
		rule(":where(.reset-bg > *)", {
			__background_color_base: vars.color.surface,
			__background_color_tint: vars.color.tint.or(vars.color.surface),
			__background_color_blend: 1.0,
			__background_color_opacity: 1.0,
		}),
		rule(":where(.reset-txt > *)", {
			__text_color_base: vars.color.surface_text,
			__text_color_tint: vars.color.tint.or(vars.color.surface),
			__text_color_blend: 1.0,
			__text_color_opacity: 1.0,
		}),
		rule(":where(.reset-bd > *)", {
			__border_color_base: vars.color.surface_text,
			__border_color_tint: vars.color.tint,
			__border_color_blend: 1.0,
			__border_color_opacity: 0.35,
			border_width: "0px",
		}),
		rule(":where(.reset-ol > *)", {
			__outline_color_base: vars.color.surface_text,
			__outline_color_tint: vars.color.tint.or(vars.color.surface),
			__outline_color_blend: 0.3,
			__outline_color_opacity: 0.8,
			outline_width: "0px",
		}),
		rule(".nobg", { background_color: "transparent" }),
		rule(".notx", { color: "inherit" }),
		rule(".nobd", { border_color: "transparent" }),
		rule(".bd-i", { border_color: "inherit" }),
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
	semantic: SEMANTIC,
});
// EOF
