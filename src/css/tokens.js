import { tokens, group, sizes } from "../js/littlecss.js";

export default group(
	tokens({
		border: { width: "1px", color: `var(--color-text)` },
		block: {
			width: "320px",
		},
	}),
	tokens({
		border: {
			width: sizes.map((_, i) => `${i}px`),
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
