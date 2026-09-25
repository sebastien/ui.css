import {
	contrast,
	group,
	root,
	rule,
	sides,
	times,
	vars,
	where,
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

// Border and outline utilities also publish override-only variables that the
// interactive control recipes read, so `.bd-*`/`.ol-*` modifiers reach controls.
// They must be separate names: the generic `--*-color-*` tokens have root
// defaults that would otherwise clobber the control tokens.
const overrideChannels = { bd: "border", ol: "outline" };
const overrideChannel = (short, channel, value) => {
	const name = overrideChannels[short];
	return name ? { [`__${name}_${channel}`]: value } : {};
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
	const wrap = (color) =>
		opacity === undefined || opacity === 1
			? color
			: `color-mix(in oklch, ${color}, transparent calc(100% - 100% * ${opacity}))`;
	// Full-strength blends collapse to the surviving color: a mix with a 0%
	// weight side is degenerate in Chromium, which drops the surviving hue
	// (oklch(… none) renders as hue 0). Only literal full-strength calls
	// collapse; var()-driven blends keep the runtime-responsive expression.
	if (blend === 1) {
		return wrap(base);
	}
	if (blend === 0) {
		return wrap(tint);
	}
	const inner = `color-mix(in oklch, ${base}, ${tint} calc(100% - 100% * ${blend}))`;
	return wrap(inner);
}

// Function: colormixin
// Generates a color-mix() CSS expression using variable references.
// With opacity: wraps in a second color-mix for transparency.
function colormixin(color) {
	return colormix(color.base, color.tint, color.blend, color.opacity);
}

// Function: modechannels
// Paint-channel inputs derived from the mode roles, for one mode. Mode rules
// re-declare these so nested .light/.dark containers re-substitute inherited
// values locally instead of freezing the root-resolved ones.
function modechannels(mode) {
	return {
		__color_tint: `${mode.tint}`,
		__color_neutral: `${mode.neutral}`,
		__color_link: `${mode.link}`,
		__color_focus: `${vars.color.neutral}`,
		// Re-pair the inheritable accent chain with the flipped neutral so bare
		// controls (which read --accent / --control-color-base) follow the mode.
		__accent: `${vars.color.neutral}`,
		__control_color_base: `${vars.color.neutral}`,
		__control_outline_base: `${vars.control.color.base}`,
		__background_color_neutral: `${mode.background_neutral}`,
		__background_color_base: `${vars.color.surface}`,
		__background_color_tint: vars.color.tint.or(vars.color.surface),
		__text_color_base: `${mode.surface_text}`,
		__text_color_tint: vars.color.tint.or(vars.color.surface),
		__border_color_base: `${mode.surface_text}`,
		__border_color_tint: `${vars.color.tint}`,
		__outline_color_base: `${mode.surface_text}`,
		__outline_color_tint: vars.color.tint.or(vars.color.surface),
		__control_color_tint: `${vars.color.tint}`,
		__control_border_base: `${mode.surface_text}`,
		__control_border_tint: `${vars.color.tint}`,
		...(mode.primary
			? {
					__color_primary: `${mode.primary}`,
					__color_accent: `${mode.accent}`,
				}
			: {}),
	};
}

// Mode-paired channel values. Surface text and tint swap with the page roles;
// neutral/link/background-neutral switch to their dark counterparts.
const lightchannels = {
	tint: vars.color.paper,
	surface_text: vars.color.ink,
	neutral: vars.color.neutral_light,
	link: vars.color.link_light,
	background_neutral: vars.background.color.neutral_light,
};

const darkchannels = {
	tint: vars.color.ink,
	surface_text: vars.color.paper,
	neutral: vars.color.neutral_dark,
	link: vars.color.link_dark,
	background_neutral: vars.background.color.neutral_dark,
	// Accents below the dark non-text floor lift toward paper via solved
	// recipes (see tokens.js); the rest of the palette already clears 3:1.
	primary: vars.color.primary_dark,
	accent: vars.color.accent_dark,
};

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
		// Mode classes swap the page/surface roles and repaint the host. The
		// role declarations and host paint use `:where(:root)` so the mode
		// selector stays at (0,1,0) and still wins over the base `:root` by
		// source order, while the paint-channel inputs live in a fully
		// `:where()`-wrapped rule. Nested mode containers re-substitute
		// locally, and utilities or component variants on the mode element
		// out-rank the mode defaults.
		rule([root], {
			__color_page: `${vars.color.paper}`,
			__color_text: `${vars.color.ink}`,
			__color_surface: `${vars.color.paper}`,
			__color_surface_text: `${vars.color.ink}`,
			// Publish the structural border color once so components and the
			// .lined/table separators share one mode-aware value.
			__border_color: borderColor,
			color_scheme: "light",
			color: `${vars.color.ink}`,
		}),
		rule([`${where(root)}.light`, `${where(root)} .light`], {
			__color_page: `${vars.color.paper}`,
			__color_text: `${vars.color.ink}`,
			__color_surface: `${vars.color.paper}`,
			__color_surface_text: `${vars.color.ink}`,
			color_scheme: "light",
			// Apply actual properties
			background_color: `${vars.color.paper}`,
			color: `${vars.color.ink}`,
		}),
		rule(where(`${root}.light`, `${root} .light`), modechannels(lightchannels)),
		rule([`${where(root)}.dark`, `${where(root)} .dark`], {
			__color_page: `${vars.color.ink}`,
			__color_text: `${vars.color.paper}`,
			__color_surface: `${vars.color.ink}`,
			__color_surface_text: `${vars.color.paper}`,
			color_scheme: "dark",
			// Apply actual properties with swapped colors
			background_color: `${vars.color.ink}`,
			color: `${vars.color.paper}`,
		}),
		rule(where(`${root}.dark`, `${root} .dark`), modechannels(darkchannels)),
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
		rule([".bgc", ".pill", ".badge", ".count"], {
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
					...(short === "bg"
						? {
								__background_color_tint: vars.color.tint,
								__background_color_blend: 1.0,
								__background_color_opacity: 1.0,
							}
						: {}),
					...overrideChannel(short, "base", vars.color[semantic]),
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
					...(short === "bg"
						? {
								__background_color_tint: vars.color.tint,
								__background_color_blend: 1.0,
								__background_color_opacity: 1.0,
							}
						: {}),
					...overrideChannel(short, "base", vars.color[color]),
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
					...overrideChannel(short, "opacity", index / 10),
				}),
			),
			rule(`.${short}o`, {
				[`__${shorthands[short].name.replaceAll("-", "_")}_opacity`]: 1.0,
				...overrideChannel(short, "opacity", 1.0),
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
					...overrideChannel(short, "blend", index / 10),
				}),
			),
		),
		Object.keys(shorthands).map((short) =>
			rule(`.${short}b`, {
				[`__${shorthands[short].name.replaceAll("-", "_")}_blend`]: 1.0,
				...overrideChannel(short, "blend", 1.0),
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
					...overrideChannel(short, "tint", vars.color[color]),
				}),
			),
		),
		// Sets all the tints to the given color
		[...SEMANTIC, ...colors].map((color) =>
			rule(`.to-${color}`, {
				__color_tint: vars.color[color],
				__text_color_tint: vars.color[color],
				__border_color_tint: vars.color[color],
				__border_tint: vars.color[color],
				__background_color_tint: vars.color[color],
				__outline_color_tint: vars.color[color],
				__outline_tint: vars.color[color],
			}),
		),

		// Transparent is an opacity alias, not a tint value.
		Object.keys(shorthands).flatMap((short) => [
			rule(`.${short}-to-transparent`, {
				[`__${shorthands[short].name.replaceAll("-", "_")}_opacity`]: 0,
				...overrideChannel(short, "opacity", 0),
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

export { COLORS, colormix, colormixin, colorvars, SEMANTIC };
export default Object.assign(colors, {
	mix: colormixin,
	mixed: colormix,
	vars: colorvars,
	alpha,
	semantic: SEMANTIC,
});
// EOF
