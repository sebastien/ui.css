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
		rule(".nolh", { line_height: "0em" }),
		rule(".nogap", { gap: "0em" })
	),
	font: group(
		rule(".lll", { font_weight: 100 }),
		rule(".ll", { font_weight: 200 }),
		rule(".l", { font_weight: 300 }),
		rule(".b", { font_weight: 600 }),
		rule(".bb", { font_weight: 700 }),
		rule(".bbb", { font_weight: 800 })
	),
	opacity: group(
		rule(".dim", { opacity: `0.65` }),
		rule(".dimmer", { opacity: `0.45` }),
		rule(".dimmest", { opacity: `0.25` })
	),
	visibility: group(
		rule(".skip", { display: "none !important" }),
		rule(".invisible", { display: "hidden !important" })
	),
	border: group(
		rule(".rd", { border_radius: `${vars.border.radius}` }),
		rule(".bd", {
			border: `${vars.border.width} solid ${vars.border.color}`,
		}),
		...times(10, (i) => rule(`.bd-${i}`, { __border_width: `${i}px` })),
		...Object.keys(sides).map((k) =>
			rule(`.bd-${k.substring(0, 1)}`, {
				[`border-${sides[k]}`]: `${vars.border.width} solid currentColor `,
			})
		)
	),
});
