import { tokens, group, sizes, vars } from "../js/littlecss.js";
import defaults from "./defaults.js";

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
				line: `${vars.font.line}`,
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
			// FIXME: Rework
			// FIXME: Align higha/lowa
			white: "#FFFFFF",
			black: "#000000",
			// neutral: defaults.neutral[5],
			// primary: defaults.primary[6],
			// secondary: defaults.secondary[4],
			// tertiary: defaults.tertiary[4],
			// success: defaults.palette.green[4],
			// info: defaults.palette.sky[2],
			// warning: defaults.palette.orange[5],
			// danger: defaults.palette.red[5],
			transparent: "#FFFFFF00",
			transparentdk: "#00000000",
			//
			// accent: vars.color.blue,
			// focus: vars.color.grey,
			// These would be switched for dark mode
			high: vars.color.white,
			low: vars.color.black,
			text: vars.color.low,
			page: vars.color.high,

			// Default blending mode
			blend: "oklab",

			// Variants with transparency for blending
			higha: `color-mix(in ${vars.color.blend}, ${vars.color.high} 100%, transparent)`,
			lowa: `color-mix(in ${vars.color.blend},  ${vars.color.low}  100%, transparent)`,
			texta: `color-mix(in ${vars.color.blend}, ${vars.color.text} 100%, transparent)`,
			pagea: `color-mix(in ${vars.color.blend}, ${vars.color.page} 100%, transparent)`,

			// These are used by default in the UI, note how they blend with
			// the text.
			bg: `color-mix(in ${vars.color.blend},  ${vars.color.neutral}  20%, ${vars.color.page})`,
			bd: `color-mix(in ${vars.color.blend},  ${vars.color.neutral}  50%, ${vars.color.page})`,
			// FIXME: What's BDF for again?
			bdf: `color-mix(in ${vars.color.blend}, ${vars.color.neutral}  30%, ${vars.color.page})`,
			fg: `currentColor`,
		},
	}),
	tokens({
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
		size: [
			"5px", //  0:xxs
			"10px", // 1:xs
			"15px", // 2:s
			"30px", // 3:m
			"40px", // 4:l
			"50px", // 5:xl
			"26px", // 6:xxl
		],
		margin: [
			"5px", // xxs
			"10px", // xs
			"15px", // s
			"30px", // m
			"40px", // l
			"50px", // xl
			"26px", // xxl
		],
		// TODO: Should probably be related to the font size
		pad: [
			"2px", // xxs
			"4px", // xs
			"6px", // s
			"8px", // m
			"12px", // l
			"16px", // xl
			"32px", // xxl
		],
		gap: [
			"2px", // xxs - 0
			"4px", // xs - 1
			"6px", // s - 2
			"8px", // m - 3
			"12px", // l - 4
			"16px", // xl - 5
			"32px", // xxl -6
		],
		shadow: {
			depth: "2px",
			spread: "1px",
			color: "#00000020",
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
	})
);

// EOF
