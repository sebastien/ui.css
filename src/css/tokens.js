import { tokens, group, sizes, vars } from "../js/littlecss.js";

export default group(
	tokens({
		font: {
			mono: "monospace",
			sans: "sans-serif",
			serif: "serif",
			text: `${vars.font.sans}`,
			heading: `${vars.font.sans}`,
			display: `${vars.font.sans}`,
			controls: `${vars.font.sans}`,
			code: `${vars.font.mono}`,
			size: "14px",
			lh: "1.25em",
		},
		border: {
			width: "1px",
			color: `var(--color-text)`,
			radius: `var(--border-radius-3)`,
		},
		block: {
			width: "140px",
		},
	}),
	tokens({
		border: {
			width: sizes.map((_, i) => `${i}px`),
			radius: [
				"1px", // xxs
				"2px", // xs
				"4px", // s
				"6px", // m
				"8px", // l
				"12px", // xl
				"16px", // xxl
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
			"0px", // xxs
			"1px", // xs
			"2px", // s
			"3px", // m
			"6px", // l
			"12px", // xl
			"24px", // xxl
		],
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
