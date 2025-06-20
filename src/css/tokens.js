import { tokens, group, sizes, vars } from "../js/littlecss.js";

export default group(
	tokens({
		font: {
			mono: "monospace",
			sans: "sans-serif",
			serif: "serif",
			size: "1rem",
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
		color: {
			cyan: "#14D3CA",
			blue: "#1717BB",
			purple: "#A21899",
			red: "#FF3939",
			orange: "#EE7204",
			yellow: "#FBBE08",
			pink: "#FF00FF",
			green: "#3DBC1A",
			grey: "#808080",
			white: "#FFFFFF",
			black: "#000000",
			// FIXME: Align higha/lowa
			transparent: "#FFFFFF00",
			transparentdk: "#00000000",
		},
		theme: {
			neutral: vars.color.grey,
			accent: vars.color.blue,
			focus: vars.color.grey,

			// These would be switched for dark mode
			high: vars.color.white,
			low: vars.color.black,
			higha: vars.color.transparent,
			lowa: vars.color.transparentdk,

			// FIXME: These should be blended
			// FIXME: higha/lowa should be page/text probably
			//
			text: vars.theme.low,
			page: vars.theme.high,
			texta: vars.theme.lowa,
			pagea: vars.theme.higha,

			// Default blending mode
			blend: "oklab",

			// These are used by default in the UI, note how they blend with
			// the text.
			bg: `color-mix(in ${vars.theme.blend}, ${vars.theme.neutral}  20%, ${vars.theme.page})`,
			bd: `color-mix(in ${vars.theme.blend}, ${vars.theme.neutral}  50%, ${vars.theme.page})`,
			bdf: `color-mix(in ${vars.theme.blend}, ${vars.theme.neutral} 30%, ${vars.theme.page})`,
			fg: `currentColor`,
		},
	}),
	tokens({
		border: {
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
			"18px", // xxl
		],
		// These are too big
		space: [
			"5px", // xxs
			"10px", // xs
			"15px", // s
			"30px", // m
			"40px", // l
			"50px", // xl
			"26px", // xxl
		],
		gap: [
			"0px", // xxs - 0
			"1px", // xs - 1
			"2px", // s - 2
			"3px", // m - 3
			"6px", // l - 4
			"12px", // xl - 5
			"24px", // xxl - 6
		],
		shadow: {
			depth: "2px",
			spread: "1px",
			color: "#00000020",
		},
		text: {
			base: "12",
			unit: "16px",
			size: [
				"calc( 6 / var(--text-base) * var(--text-unit))", // xxs
				"calc( 8 / var(--text-base) * var(--text-unit))", // xs
				"calc(10 / var(--text-base) * var(--text-unit))", // s
				"calc(12 / var(--text-base) * var(--text-unit))", // m
				"calc(14 / var(--text-base) * var(--text-unit))", // l
				"calc(16 / var(--text-base) * var(--text-unit))", // xl
				"calc(18 / var(--text-base) * var(--text-unit))", // xxl
			],
		},
		limit: {
			text: "60ch",
			block: ["360px", "720px", "960"],
			content: "960px",
			page: "960px",
		},
		heading: {
			base: "14",
			unit: "14px",
			size: [
				"calc(12 / var(--heading-base) * var(--heading-unit))", // 1: xxs
				"calc(14 / var(--heading-base) * var(--heading-unit))", // 2: xs
				"calc(18 / var(--heading-base) * var(--heading-unit))", // 3: s
				"calc(24 / var(--heading-base) * var(--heading-unit))", // 4: m
				"calc(32 / var(--heading-base) * var(--heading-unit))", // 5: l
				"calc(36 / var(--heading-base) * var(--heading-unit))", // 6: xl
				"calc(48 / var(--heading-base) * var(--heading-unit))", // 7: xxl
			],
		},
	})
);

// EOF
