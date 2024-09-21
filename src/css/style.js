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
	style: group(
		rule([".nolink", ".nolink:hover"], {
			color: "unset",
			text_decoration: "none",
		}),
		rule(".nolh", { line_height: "0em" })
	),
	opacity: group(
		rule(".dim", { opacity: `0.65` }),
		rule(".dimmer", { opacity: `0.45` }),
		rule(".dimmest", { opacity: `0.25` })
	),
	border: group(
		rule(".bd", {
			border: `${vars.border.width} solid ${vars.border.color}`,
		}),
		...sizes.map((k, i) => rule(`.bd-${k}`, { __border_width: `${i}px` })),
		...sides.map((k) =>
			rule(`.bd-${k.substring(0, 1)}`, {
				[`border-${k}`]: `${vars.border.width} solid currentColor `,
			})
		)
	),
});
