import { tokens, group, sizes, vars } from "../js/littlecss.js";
import defaults from "./defaults.js";

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
				family: `${vars.font.text}`,
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
		border: {
			width: "1px",
			style: "solid",
			color: `var(--theme-neutral)`,
			radius: `var(--border-radius-3)`,
		},
		block: {
			width: "140px",
		},
	}),
	tokens({
		// Palette is expected to be like:
		// 0: 50
		// 1: 100
		// 2: 200
		// 3: 300
		// 4: 400
		// 5: 500
		// 6: 600
		// 7: 700
		// 8: 800
		// 9: 900
		palette: defaults.palette,
		color: {
			// White and black points
			white: "#FFFFFF",
			black: "#303641",
			// These are the semantic colors
			neutral: defaults.palette.gray[5],
			primary: defaults.palette.blue[6],
			secondary: defaults.palette.sky[5],
			tertiary: defaults.palette.slate[3],
			success: defaults.palette.green[5],
			info: defaults.palette.sky[2],
			warning: defaults.palette.yellow[4],
			danger: defaults.palette.red[5],
			error: defaults.palette.red[5],
			// TODO: muted
			// TODO: accent
			// TODO: destructive
			// FIXME: Now sure we need these two?
			transparent: "#FFFFFF00",
			transparentdk: "#00000000",
			//
			// accent: vars.color.blue,
			// focus: vars.color.grey,
			// These would be switched for dark mode
			background: vars.color.white,
			foreground: vars.color.black,
			// Page is the page background
			page: vars.color.background,
			// These are the main colors used in the UI
			high: vars.color.background,
			low: vars.color.foreground,
			// Light and dark colors are typically less than high and low, they
			// are used to darken or lighten elements
			light: `color-mix(in ${vars.color.blend}, ${vars.color.page}, ${vars.color.background} 50%)`,
			dark: `color-mix(in ${vars.color.blend}, ${vars.color.page}, ${vars.color.background} 50%)`,
			shadow: vars.color.low,
			shadowa: `rgb(from ${vars.color.shadow} r g b / 0)`,
			// Default blending mode
			blend: "oklab",
			// Variants with transparency for blending
			higha: `color-mix(in ${vars.color.blend}, ${vars.color.high}, transparent 100%)`,
			lowa: `color-mix(in ${vars.color.blend},  ${vars.color.low}, transparent 100%)`,
			texta: `color-mix(in ${vars.color.blend}, ${vars.color.text}, transparent 100%)`,
			pagea: `color-mix(in ${vars.color.blend}, ${vars.color.page}, transparent 100%)`,

			// These are used by default in the UI, note how they blend with
			// the text.
			bg: `color-mix(in ${vars.color.blend},  ${vars.color.neutral}  20%, ${vars.color.page})`,
			bd: `color-mix(in ${vars.color.blend},  ${vars.color.neutral}  50%, ${vars.color.page})`,
			// FIXME: What's BDF for again, border focus?
			bdf: `color-mix(in ${vars.color.blend}, ${vars.color.neutral}  30%, ${vars.color.page})`,
			fg: `currentColor`,
		},
	}),
	tokens({
		background: {
			color: `${vars.color.bg}`,
			colora: `color-mix(in ${vars.color.blend}, ${vars.background.color}, transparent 100%)`,
		},
		border: {
			color: `${vars.color.bd}`,
			width: sizes.map((_, i) => `${i}px`),
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
			color: `${vars.color.bd}`,
		},
		size: [
			"5px", //  0:xxs
			"10px", // 1:xs
			"15px", // 2:s
			"30px", // 3:m
			"40px", // 4:l
			"50px", // 5:xl
			"60px", // 6:xxl
			// FIXME
		],
		margin: [
			"5px", // xxs
			"10px", // xs
			"15px", // s
			"30px", // m
			"40px", // l
			"50px", // xl
			"60px", // xxl
			// FIXME
		],
		// TODO: Should probably be related to the font size
		pad: [
			"2px", // xxs
			"4px", // xs
			"6px", // s
			"8px", // m
			"12px", // l
			"16px", // xl
			"24px", // xxl
			"32px", // xxxl
			"48px", // xxxxl
			"64px", // xxxxxl
		],
		gap: [
			"2px", // xxs - 0
			"4px", // xs - 1
			"6px", // s - 2
			"8px", // m - 3
			"12px", // l - 4
			"16px", // xl - 5
			"24px", // xxl - 6
			"32px", // xxxl - 7
			"64px", // xxxxl - 8
			"96px", // xxxxxl - 9
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
			color: `color-mix(in oklab, ${vars.color.shadow}, transparent 95%)`,
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
		text: {
			color: `${vars.color.fg}`,
			min: 9,
			max: 22,
			unit: "var(--page-unit)",
			base: "var(--text-min)",
			amplitude: "calc(var(--text-max) - var(--text-min))",
			size: [
				"calc((var(--text-base) + var(--text-amplitude) * ((6  - 6) / (18 - 6))) * var(--text-unit))", // 1: xxs
				"calc((var(--text-base) + var(--text-amplitude) * ((8  - 6) / (18 - 6))) * var(--text-unit))", // 2: xs
				"calc((var(--text-base) + var(--text-amplitude) * ((10 - 6) / (18 - 6))) * var(--text-unit))", // 3: s
				"calc((var(--text-base) + var(--text-amplitude) * ((12 - 6) / (18 - 6))) * var(--text-unit))", // 4: m
				"calc((var(--text-base) + var(--text-amplitude) * ((14 - 6) / (18 - 6))) * var(--text-unit))", // 5: l
				"calc((var(--text-base) + var(--text-amplitude) * ((16 - 6) / (18 - 6))) * var(--text-unit))", // 6: xl
				"calc((var(--text-base) + var(--text-amplitude) * ((18 - 6) / (18 - 6))) * var(--text-unit))", // 7: xxl
			],
		},
		heading: {
			min: "var(--page-base)",
			max: 42,
			unit: "var(--page-unit)",
			base: "var(--heading-min)",
			amplitude: "calc(var(--heading-max) - var(--heading-min))",
			size: [
				"calc((var(--heading-base) + var(--heading-amplitude) * ((12 - 12) / (48 - 12))) * var(--heading-unit))", // 1: xxs
				"calc((var(--heading-base) + var(--heading-amplitude) * ((14 - 12) / (48 - 12))) * var(--heading-unit))", // 2: xs
				"calc((var(--heading-base) + var(--heading-amplitude) * ((18 - 12) / (48 - 12))) * var(--heading-unit))", // 3: s
				"calc((var(--heading-base) + var(--heading-amplitude) * ((24 - 12) / (48 - 12))) * var(--heading-unit))", // 4: m
				"calc((var(--heading-base) + var(--heading-amplitude) * ((32 - 12) / (48 - 12))) * var(--heading-unit))", // 5: l
				"calc((var(--heading-base) + var(--heading-amplitude) * ((36 - 12) / (48 - 12))) * var(--heading-unit))", // 6: xl
				"calc((var(--heading-base) + var(--heading-amplitude) * ((48 - 12) / (48 - 12))) * var(--heading-unit))", // 7: xxl
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
				smallest: vars.text.size[1],
				smaller: vars.text.size[2],
				small: vars.text.size[3],
				regular: vars.text.size[4],
				large: vars.text.size[5],
				larger: vars.text.size[6],
				largest: vars.text.size[7],
			},
		},
	}),
);

// EOF
