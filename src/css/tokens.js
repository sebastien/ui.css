import { tokens, group, sizes, vars } from "../js/littlecss.js";

const REM_PIXELS = 16;
function pem(px, scale = undefined) {
	return scale
		? `calc( 1em * ${scale} * ${px} / ${REM_PIXELS} )`
		: `calc( 1em * ${px} / ${REM_PIXELS} )`;
}

// Module: tokens
// This defines the main parameters for the style. They can be overriden
// at will to theme everything.
export default group(
	tokens({
		font: {
			mono: "monospace",
			sans: "sans-serif",
			serif: "serif",
			cursive: "cursive",
			base: 14,
			size: `calc(1rem * var(--font-base) / ${REM_PIXELS})`,
			line: "1.25em",
			text: {
				family: `${vars.font.sans}`,
				size: `${vars.font.size}`,
				line: `${vars.font.line}`,
			},
			heading: {
				family: `${vars.font.sans}`,
				size: `${vars.font.size}`,
				line: `${vars.font.line}`,
			},
			display: {
				family: `${vars.font.sans}`,
				size: `${vars.font.size}`,
				line: `${vars.font.line}`,
			},
			script: {
				family: `${vars.font.cursive}`,
				size: `${vars.font.size}`,
				line: `${vars.font.line}`,
			},
			code: {
				family: `${vars.font.mono}`,
				size: `${vars.font.size}`,
				line: `${vars.font.line}`,
			},
			controls: {
				family: `${vars.font.sans}`,
				size: `${vars.font.size}`,
				line: "1em",
				weight: 500,
			},
		},
		block: {
			width: "140px",
		},
		scaling: {
			pad: 1.5,
		},
	}),
	// ------------------------------------------------------------------------
	//
	// COLORS
	//
	// ------------------------------------------------------------------------
	// Semantic colors - all defined at L=0.5 in OKLCH as neutral baseline
	// Color scales (0-9) are generated at build time in colors.js
	tokens({
		color: {
			// Scale endpoint colors
			ink: "#000000",
			action: "#A0A0A0",
			border: "#A0A0A0",
			paper: "#FFFFFF",
			// Luminosity direction: 1 = normal (light mode), -1 = inverted (dark mode)
			l: { direction: 1 },
			// Semantic colors (all at L=0.5, chroma and hue preserved in scales)
			neutral: "oklch(0.5 0.02 250)" /* near-gray, very low chroma */,
			primary: "oklch(0.5 0.20 250)" /* calm blue */,
			secondary: "oklch(0.5 0.20 280)" /* violet */,
			tertiary: "oklch(0.5 0.20 160)" /* teal */,
			success: "oklch(0.5 0.24 145)" /* green */,
			info: "oklch(0.5 0.22 220)" /* cyan-blue */,
			warning: "oklch(0.5 0.24 90)" /* amber */,
			danger: "oklch(0.5 0.28 25)" /* red */,
			// Mode-dependent colors (defaults to light mode, swapped by .dark)
			page: vars.color.paper,
			text: vars.color.ink,
		},
	}),
	tokens({
		controls: {
			padding: {
				no: "0em 0em",
				largest: "1em 1.25em",
				larger: "0.85em 1.15em",
				large: "0.75em 1em",
				regular: "0.5em 0.75em",
				small: "0.25em 0.5em",
				smaller: "0.15em 0.35em",
				smallest: "0.15em 0.15em",
			},
			size: {
				smallest: vars.textsize.size[0],
				smaller: vars.textsize.size[1],
				small: vars.textsize.size[2],
				regular: vars.textsize.size[3],
				large: vars.textsize.size[4],
				larger: vars.textsize.size[5],
				largest: vars.textsize.size[6],
			},
			border: {
				shade: "50%",
				opacity: "80%",
			},
			outline: {
				shade: "50%",
				opacity: "20%",
			},
			hover: { delta: "15%" },
			active: { delta: "20%" },
			selected: { delta: "25%" },
			disabled: { opacity: "50%" },
		},
		selectable: {
			shade: "50%",
			hover: { opacity: vars.controls.hover.delta },
			active: { opacity: vars.controls.active.delta },
			selected: { opacity: vars.controls.selected.delta },
			disabled: { opacity: vars.controls.disabled.opacity },
		},
		button: {
			shade: "75%",
			opacity: "100%",
			base: vars.color.action,
			tint: vars.color.paper,
			font: {
				family: vars.font.controls.family,
				line: vars.font.controls.line,
				weight: vars.font.controls.weight,
				size: vars.font.controls.size,
			},
			border: {
				width: "1px",
				shade: "80%",
				opacity: "90%",
			},
			outline: {
				width: "2px",
				shade: "70%",
				opacity: "20%",
			},
			// We alter the shade by the same amount as base controls opacity
			hover: {
				shade: "calc(var(--button-shade) + var(--controls-hover-delta))",
				opacity: vars.button.opacity,
			},
			active: {
				shade: "calc(var(--button-shade) + var(--controls-active-delta))",
				opacity: vars.button.opacity,
			},
			selected: {
				shade: "calc(var(--button-shade) + var(--controls-selected-delta))",
				opacity: vars.button.opacity,
			},
		},
		pill: {
			shade: "50%",
			opacity: "100%",
			border: {
				width: "2px",
				shade: "80%",
				opacity: "90%",
			},
			outline: {
				width: "2px",
				shade: "70%",
				opacity: "20%",
			},
			hover: {
				shade: "calc(var(--pill-shade) + var(--controls-hover-delta))",
				opacity: vars.pill.opacity,
			},
			active: {
				shade: "calc(var(--pill-shade) + var(--controls-active-delta))",
				opacity: vars.pill.opacity,
			},
			selected: {
				shade: "calc(var(--pill-shade) + var(--controls-selected-delta))",
				opacity: vars.pill.opacity,
			},
		},
		input: {
			base: vars.color.page,
			tint: vars.color.paper,
			color: vars.color.ink,
			shade: "25%",
			opacity: "50%",
			font: {
				family: vars.font.controls.family,
				line: vars.font.controls.line,
				weight: vars.font.controls.weight,
				size: vars.font.controls.size,
			},
			border: {
				width: "1px",
				shade: "50%",
				opacity: "80%",
				color: vars.color.ink,
			},
			outline: {
				width: "2px",
				shade: "50%",
				opacity: "0%",
			},
			focus: {
				opacity: "90%",
				outline: {
					opacity: "40%",
				},
			},
			// We alter the shade by the same amount as base controls opacity
			hover: {
				shade: "calc(var(--button-shade) + var(--controls-hover-delta))",
				opacity: vars.button.opacity,
			},
			active: {
				shade: "calc(var(--button-shade) + var(--controls-active-delta))",
				opacity: vars.button.opacity,
			},
			selected: {
				shade: "calc(var(--button-shade) + var(--controls-selected-delta))",
				opacity: vars.button.opacity,
			},
		},
		selector: {
			shade: "50%",
			opacity: "0%",
			border: {
				width: "1px",
				shade: "50%",
				opacity: "0%",
			},
			outline: {
				width: "2px",
				shade: "50%",
				opacity: "0%",
			},
			hover: { opacity: vars.selectable.hover.opacity },
			active: { opacity: vars.selectable.active.opacity },
			selected: { opacity: vars.selectable.selected.opacity },
		},
	}),
	// ------------------------------------------------------------------------
	//
	// COLOR PROPERTIES
	//
	// ------------------------------------------------------------------------
	// Each color property has: level, alpha, blend, blending
	// See spec-colors.md for full documentation
	tokens({
		background: {
			base: vars.color.paper,
			tint: vars.color.paper,
			shade: "100%",
			opacity: "100%",
			color: `color-mix(in oklch, var(--background-base), var(--background-tint) calc(100% - var(--background-shade)))`,
		},
		text: {
			base: vars.color.ink,
			tint: vars.color.paper,
			shade: "100%",
			opacity: "100%",
			color: `color-mix(in oklch, var(--text-base), var(--text-tint) calc(100% - var(--text-shade)))`,
		},
		border: {
			base: vars.color.ink,
			tint: vars.color.paper,
			color: `color-mix(in oklch, var(--border-base), var(--border-tint) calc(100% - var(--border-shade)))`,
			shade: "50%",
			width: "1px",
			opacity: "90%",
			style: "solid",
			// FIXME: Should move this out
			// Non-color properties
			sizes: sizes.map((_, i) => `${i}px`),
			radius: [
				"1px", // 0:xxs
				"2px", // 1:xs
				"4px", // 2:s
				"6px", // 3:m
				"8px", // 4:l
				"12px", // 5:xl
				"16px", // 6:xxl
			],
			style: "solid",
		},
		outline: {
			width: "2px",
			base: vars.color.ink,
			tint: vars.color.paper,
			opacity: "80%",
			shade: "30%",
			style: "solid",
		},
		// Text sizing properties (separate from text color)
		textsize: {
			size: [
				"40%", // 0: xxs
				"60%", // 1: xs
				"80%", // 2: s
				"120%", // 3: m
				"140%", // 4: l
				"180%", // 5: xl
				"200%", // 6: xxl
			],
		},
	}),
	// ------------------------------------------------------------------------
	//
	// SPACING & SIZING
	//
	// ------------------------------------------------------------------------
	tokens({
		size: [
			"0em",
			pem(5), // 1:xxs
			pem(10), // 2:xs
			pem(15), // 3:s
			pem(30), // 4:m
			pem(40), // 5:l
			pem(50), // 6:xl
			pem(60), // 7:xxl
			pem(70), // 8:xxxl
			pem(80), // 9:xxxxl
			pem(100), // 10:xxxxl
		],
		margin: [
			"0em",
			pem(5), // 1: xxs
			pem(10), // 2: xs
			pem(15), // 3: s
			pem(30), // 4: m
			pem(40), // 5: l
			pem(50), // 6: xl
			pem(70), // 7: xxl
			pem(80), // 8: xxl
			pem(120), // 9: xxl
			pem(140), // 10: xxl
		],
		pad: [
			"0em",
			pem(2, vars.scaling.pad), // 1: xxs
			pem(4, vars.scaling.pad), // 2: xs
			pem(6, vars.scaling.pad), // 3: s
			pem(8, vars.scaling.pad), // 4: m
			pem(12, vars.scaling.pad), // 5: l
			pem(16, vars.scaling.pad), // 6: xl
			pem(24, vars.scaling.pad), // 7: xxl
			pem(32, vars.scaling.pad), // 8: xxxl
			pem(48, vars.scaling.pad), // 9: xxxxl
			pem(64, vars.scaling.pad), // 10: xxxxxl
		],
		gap: [
			"0em",
			pem(2), // 1: xxs
			pem(4), // 2: xs
			pem(6), // 3: s
			pem(8), // 4: m
			pem(12), // 5: l
			pem(16), // 6: xl
			pem(24), // 7: xxl
			pem(32), // 8: xxxl
			pem(64), // 9: xxxxl
			pem(96), // 10: xxxxxl
		],
		opacity: {
			dim: 0.65,
			dimmer: 0.45,
			dimmest: 0.25,
		},
		shadow: {
			x: "2px",
			y: "2px",
			spread: "1px",
			base: vars.color.ink,
			opacity: 0.25,
			color: `color-mix(in oklch, var(--shadow-base), transparent calc(100% - 100% * var(--shadow-opacity)))`,
		},
		limit: {
			text: "80ch",
			block: ["360px", "720px", "960"],
			content: "960px",
			page: "960px",
		},
		// The logic here is as follows:
		// - Page baseline (page.base) defines the value for 1rem/100% at the body level
		// - Page unit (page.unit) defines the equivalent of 1px in rems.
		page: {
			base: 16,
			unit: "calc( (1rem/16) * var(--page-base) / 16)",
		},
		heading: {
			min: "var(--page-base)",
			max: 42,
			unit: "var(--page-unit)",
			base: "var(--heading-min)",
			amplitude: "calc(var(--heading-max) - var(--heading-min))",
			size: [
				"80%", // 0: xxs
				"100%", // 1: xs
				"115%", // 2: s
				"130%", // 3: m
				"160%", // 4: l
				"200%", // 5: xl
				"240%", // 6: xxl
			],
		},
	}),
);

// EOF
