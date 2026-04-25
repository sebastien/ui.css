import { group, sizes, tokens, vars } from "../js/uicss.js";

const REM_PIXELS = 16;
function scaled(unit, px, scale = undefined, base = REM_PIXELS) {
	return scale
		? `calc( ${unit} * ${scale} * ${px} / ${base} )`
		: `calc( ${unit} * ${px} / ${base} )`;
}
const pem = (px, scale) => scaled("1em", px, scale);
const rpem = (px, scale) => scaled("1rem", px, scale);
const spacingScale = (fn, scaleVar, steps) => [
	"0em",
	...steps.map((px) => fn(px, scaleVar)),
];

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
			size: `calc(1rem * ${vars.font.base} / ${REM_PIXELS})`,
			line: "1.25em",
			text: {
				family: `${vars.font.sans}`,
			},
			heading: {
				family: `${vars.font.sans}`,
			},
			display: {
				family: `${vars.font.sans}`,
			},
			script: {
				family: `${vars.font.cursive}`,
			},
			code: {
				family: `${vars.font.mono}`,
			},
			controls: {
				family: `${vars.font.sans}`,
				size: `${vars.font.size}`,
				line: "1em",
				weight: 500,
			},
			family: `${vars.font.text.family}`,
			line_height: `${vars.font.line}`,
			control: {
				family: `${vars.font.controls.family}`,
				size: `${vars.font.controls.size}`,
				line: `${vars.font.controls.line}`,
				weight: `${vars.font.controls.weight}`,
			},
		},
		block: {
			width: "140px",
		},
		column: {
			width: `${vars.block.width}`,
		},
		scaling: {
			size: 1.0,
			pad: 1.25,
			gap: 1.25,
			margin: 1.0,
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
			ink: "var(--color-slate-950, #020617)",
			paper: "#FFFFFF",
			// Semantic colors (reference palette variables with fallback defaults)
			neutral: "var(--color-gray-200, #e5e7eb)",
			primary: "#1400ff",
			secondary: "#469485",
			tertiary: "var(--color-teal-500, #14b8a6)",
			success: "var(--color-green-500, #22c55e)",
			info: "var(--color-cyan-500, #06b6d4)",
			warning: "var(--color-amber-500, #f59e0b)",
			error: "var(--color-red-500, #ef4444)",
			danger: vars.color.error,
			accent: vars.color.primary,
			// Mode-dependent colors (defaults to light mode, swapped by .dark)
			text: `${vars.color.ink}`,
		},
	}),

	// ------------------------------------------------------------------------
	//
	// COLOR PROPERTIES
	//
	// ------------------------------------------------------------------------
	// Each color property has: color (base, tint, blend, opacity), level, alpha
	// See spec-colors.md for full documentation
	tokens({
		background: {
			color: {
				base: `${vars.color.paper}`,
				tint: `${vars.color.paper}`,
				blend: 1.0,
				opacity: 1.0,
			},
			o: 9,
		},
		text: {
			color: {
				base: `${vars.color.ink}`,
				tint: `${vars.color.paper}`,
				blend: 1.0,
				opacity: 1.0,
			},
			stack: "0.75em",
			line: {
				min_height: "1.5em",
			},
			list: {
				unordered: { indent: "1.5em" },
				ordered: { indent: "2em" },
				item: { gap: "0.5em" },
			},
			blockquote: {
				border: { width: "4px" },
				pad: { horizontal: "1em", vertical: "0.25em" },
				opacity: 0.85,
			},
			code: {
				pad: { horizontal: "1em", vertical: "0.75em" },
				background: "rgba(128, 128, 128, 0.1)",
				radius: "4px",
			},
			dt: {
				margin: { top: "1.5em", bottom: "0.5em" },
				opacity: 0.75,
			},
			dd: {
				margin: { top: "0.5em", bottom: "1.5em" },
			},
			inline: {
				subsup_size: "0.75em",
			},
			width: `${vars.limit.text}`,
		},
		border: {
			color: {
				base: `${vars.color.ink}`,
				tint: `${vars.color.paper}`,
				blend: 0.5,
				opacity: 0.9,
			},
			l: 5,
			o: 9,
			width: "1px",
			style: "solid",
			radius: [
				"1px", // 0:xxs
				"2px", // 1:xs
				"4px", // 2:s
				"6px", // 3:m
				"8px", // 4:l
				"12px", // 5:xl
				"16px", // 6:xxl
			],
		},
		outline: {
			color: {
				base: `${vars.color.ink}`,
				tint: `${vars.color.paper}`,
				blend: 0.3,
				opacity: 0.8,
			},
		},
		// Text sizing properties (separate from text color)
		textsize: {
			size: [
				"0.58", // 0: xxs
				"0.69", // 1: xs
				"0.83", // 2: s
				"1.00", // 3: m
				"1.20", // 4: l
				"1.44", // 5: xl
				"1.73", // 6: xxl
			],
		},
	}),
	// ------------------------------------------------------------------------
	//
	// SPACING & SIZING
	//
	// ------------------------------------------------------------------------
	tokens({
		motion: {
			duration: {
				fast: "0.1s",
				normal: "0.2s",
			},
			easing: {
				standard: "ease",
				emphasized: "ease-in-out",
			},
			shift: {
				hover_dx: "20%",
			},
		},
		size: spacingScale(
			pem,
			vars.scaling.size,
			[4, 8, 12, 16, 24, 32, 48, 64, 96, 128],
		),
		margin: spacingScale(
			rpem,
			vars.scaling.margin,
			[4, 8, 12, 16, 24, 32, 48, 64],
		),
		pad: spacingScale(rpem, vars.scaling.pad, [2, 4, 6, 8, 12, 16, 24, 32]),
		gap: spacingScale(
			pem,
			vars.scaling.gap,
			[4, 8, 12, 16, 24, 32, 48, 64, 96, 128],
		),

		opacity: {
			dim: 0.65,
			dimmer: 0.45,
			dimmest: 0.25,
		},
		shadow: {
			x: "2px",
			y: "2px",
			spread: "1px",
			base: `${vars.color.ink}`,
			opacity: 0.25,
			color: `color-mix(in oklch, ${vars.shadow.base}, transparent calc(100% - 100% * ${vars.shadow.opacity}))`,
		},
		limit: {
			text: "80ch",
			block: ["360px", "720px", "960px"],
			content: "960px",
			page: "960px",
		},
		// The logic here is as follows:
		// - Page baseline (page.base) defines the value for 1rem/100% at the body level
		// - Page unit (page.unit) defines the equivalent of 1px in rems.
		page: {
			base: 16,
		},
		heading: {
			min: `${vars.page.base}`,
			max: 42,
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
