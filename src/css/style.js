import {
	sides,
	sizes,
	named,
	rule,
	group,
	vars,
	times,
} from "../js/littlecss.js";

export default named({
	border: group(
		...sizes.map((k, i) => rule(`.bd-${k}`, { __border_width: `${i}px` })),
		...sides.map((k) =>
			rule(`.bd-${k.substring(0, 1)}`, {
				[`border-${k}`]: `${vars.border.width} solid currentColor `,
			})
		)
	),
});
