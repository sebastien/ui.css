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
		border: { width: "1px", color: `var(--color-text)` },
		block: {
			width: "160px",
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
			"5px", // xxs
			"10px", // xs
			"15px", // s
			"30px", // m
			"40px", // l
			"50px", // xl
			"26px", // xxl
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
		pad: [
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
			size: [
				"6px", // xxs
				"8px", // xs
				"10px", // s
				"12px", // m
				"14px", // l
				"16px", // xl
				"18px", // xxl
			],
		},
		heading: {
			size: [
				"10px", // xxs
				"12px", // xs
				"14px", // s
				"16px", // m
				"18px", // l
				"22px", // xl
				"26px", // xxl
			],
		},
	})
);

// EOF
