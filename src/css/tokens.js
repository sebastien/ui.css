import { tokens, sizes } from "../js/littlecss.js";

export default tokens({
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
	padding: [
		"5px", // xxs
		"10px", // xs
		"15px", // s
		"30px", // m
		"40px", // l
		"50px", // xl
		"26px", // xxl
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
});
