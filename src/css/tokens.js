import { tokens, group, sizes, vars } from "../js/littlecss.js";

// Module: tokens
// This defines the main parameters for the style. They can be overriden
// at will to theme everything.
export default group(
	tokens({
		font: {
			mono: "monospace",
			sans: "sans-serif",
			serif: "serif",
			size: "1rem",
			cursive: "cursive",
			base: 14,
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
	}),
	// ------------------------------------------------------------------------
	//
	// COLORS
	//
	// ------------------------------------------------------------------------
	// Semantic colors - all defined at L=0.5 in OKLCH as neutral baseline
	tokens({
		color: {
			// Scale endpoint colors (swap with dark/light mode)
			ink: "#000000" /* scale position 0 */,
			paper: "#FFFFFF" /* scale position 9 */,
			// Luminosity direction: 1 = normal (light mode), -1 = inverted (dark mode)
			l: { direction: 1 },
			// Blending color space
			blend: "oklch",
			// Semantic colors (all at L=0.5)
			neutral: "oklch(0.5 0.01 250)" /* near-gray, very low chroma */,
			primary: "oklch(0.5 0.15 250)" /* calm blue */,
			secondary: "oklch(0.5 0.15 280)" /* violet */,
			tertiary: "oklch(0.5 0.15 160)" /* teal */,
			success: "oklch(0.5 0.18 145)" /* green */,
			info: "oklch(0.5 0.16 220)" /* cyan-blue */,
			warning: "oklch(0.5 0.18 90)" /* amber */,
			danger: "oklch(0.5 0.22 25)" /* red */,
			// Mode-dependent colors (defaults to light mode, swapped by .dark)
			page: vars.color.paper,
			text: vars.color.ink,
		},
	}),
	// ------------------------------------------------------------------------
	//
	// COLOR PROPERTIES
	//
	// ------------------------------------------------------------------------
	// Each color property has: base, l, c, h, o, delta.{l,c,h,o}
	// See spec-colors.md for full documentation
	tokens({
		background: {
			// Base semantic color
			base: vars.color.neutral,
			// Absolute values (0-9 scale)
			l: 7 /* luminosity: 0=dark, 9=light */,
			c: 5 /* chroma: 0=gray, 9=vivid */,
			h: 0 /* hue offset from base */,
			o: 9 /* opacity: 0=transparent, 9=opaque */,
			// Delta adjustments (-9 to +9)
			delta: { l: 0, c: 0, h: 0, o: 0 },
		},
		text: {
			base: vars.color.text,
			l: 1 /* dark text by default */,
			c: 0 /* neutral chroma */,
			h: 0,
			o: 9,
			delta: { l: 0, c: 0, h: 0, o: 0 },
			// Contrast constraints (set by .bg for accessibility)
			l: {
				min: 0,
				max: 9,
			},
		},
		// Text sizing properties (separate from text color)
		textsize: {
			min: 9,
			max: 22,
			unit: "var(--page-unit)",
			base: "var(--textsize-min)",
			amplitude: "calc(var(--textsize-max) - var(--textsize-min))",
			size: [
				"calc((var(--textsize-base) + var(--textsize-amplitude) * ((6  - 6) / (18 - 6))) * var(--textsize-unit))", // 0: xxs
				"calc((var(--textsize-base) + var(--textsize-amplitude) * ((8  - 6) / (18 - 6))) * var(--textsize-unit))", // 1: xs
				"calc((var(--textsize-base) + var(--textsize-amplitude) * ((10 - 6) / (18 - 6))) * var(--textsize-unit))", // 2: s
				"calc((var(--textsize-base) + var(--textsize-amplitude) * ((12 - 6) / (18 - 6))) * var(--textsize-unit))", // 3: m
				"calc((var(--textsize-base) + var(--textsize-amplitude) * ((14 - 6) / (18 - 6))) * var(--textsize-unit))", // 4: l
				"calc((var(--textsize-base) + var(--textsize-amplitude) * ((16 - 6) / (18 - 6))) * var(--textsize-unit))", // 5: xl
				"calc((var(--textsize-base) + var(--textsize-amplitude) * ((18 - 6) / (18 - 6))) * var(--textsize-unit))", // 6: xxl
			],
		},
		border: {
			base: vars.color.neutral,
			l: 6 /* mid-light luminosity */,
			c: 2 /* low chroma */,
			h: 0,
			o: 9,
			delta: { l: 0, c: 0, h: 0, o: 0 },
			width: "1px",
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
			base: vars.color.neutral,
			l: 5,
			c: 2,
			h: 0,
			o: 9,
			delta: { l: 0, c: 0, h: 0, o: 0 },
			width: "2px",
		},
	}),
	// ------------------------------------------------------------------------
	//
	// SPACING & SIZING
	//
	// ------------------------------------------------------------------------
	tokens({
		size: [
			"5px", //  0:xxs
			"10px", // 1:xs
			"15px", // 2:s
			"30px", // 3:m
			"40px", // 4:l
			"50px", // 5:xl
			"60px", // 6:xxl
		],
		margin: [
			"5px", // 0: xxs
			"10px", // 1: xs
			"15px", // 2: s
			"30px", // 3: m
			"40px", // 4: l
			"50px", // 5: xl
			"60px", // 6: xxl
		],
		pad: [
			"2px", // 0: xxs
			"4px", // 1: xs
			"6px", // 2: s
			"8px", // 3: m
			"12px", // 4: l
			"16px", // 5: xl
			"24px", // 6: xxl
			"32px", // 7: xxxl
			"48px", // 8: xxxxl
			"64px", // 9: xxxxxl
		],
		gap: [
			"2px", // 0: xxs
			"4px", // 1: xs
			"6px", // 2: s
			"8px", // 3: m
			"12px", // 4: l
			"16px", // 5: xl
			"24px", // 6: xxl
			"32px", // 7: xxxl
			"64px", // 8: xxxxl
			"96px", // 9: xxxxxl
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
			color: "oklch(0 0 0 / 0.05)",
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
				"calc((var(--heading-base) + var(--heading-amplitude) * ((12 - 12) / (48 - 12))) * var(--heading-unit))", // 0: xxs
				"calc((var(--heading-base) + var(--heading-amplitude) * ((14 - 12) / (48 - 12))) * var(--heading-unit))", // 1: xs
				"calc((var(--heading-base) + var(--heading-amplitude) * ((18 - 12) / (48 - 12))) * var(--heading-unit))", // 2: s
				"calc((var(--heading-base) + var(--heading-amplitude) * ((24 - 12) / (48 - 12))) * var(--heading-unit))", // 3: m
				"calc((var(--heading-base) + var(--heading-amplitude) * ((32 - 12) / (48 - 12))) * var(--heading-unit))", // 4: l
				"calc((var(--heading-base) + var(--heading-amplitude) * ((36 - 12) / (48 - 12))) * var(--heading-unit))", // 5: xl
				"calc((var(--heading-base) + var(--heading-amplitude) * ((48 - 12) / (48 - 12))) * var(--heading-unit))", // 6: xxl
			],
		},
		controls: {
			padding: {
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
		},
	}),
);

// EOF
