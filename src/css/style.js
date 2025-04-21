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
		rule(".invisible", { visibility: "hidden !important" }),
		rule(".hidden", { visibility: "hidden !important" })
	),
	rounding: group(
		rule(".rounded", { border_radius: "0.25lh" }),
		rule(".rounder", { border_radius: "0.5lh" }),
		rule(".roundest", { border_radius: "1.5lh" })
	),
	border: group(
		rule(".rd", { border_radius: `${vars.border.radius}` }),
		rule(".bd", {
			border: `${vars.border.width} solid ${vars.color.bd}`,
		}),
		...times(10, (i) => rule(`.rd-${i}`, { __border_radius: `${i}px` })),
		...times(10, (i) => rule(`.bd-${i}`, { __border_width: `${i}px` })),
		...Object.keys(sides).map((k) =>
			rule(`.bd-${k.substring(0, 1)}`, {
				[`border-${sides[k]}`]: `${vars.border.width} solid ${vars.color.bd} `,
			})
		)
	),
	shape: group(
		rule([".square", ".circle"], {
			display: "inline-flex",
			align_items: "center",
			width: "1lh",
			box_sizing: "border-box",
			aspect_ratio: "1",
		}),
		rule([".circle"], {
			border_radius: "100%",
		})
	),
	sep: group(
		rule(".sep > *:after", {
			content: `"/"`,
		}),
		rule(".sep.dash > *:after", {
			content: `"-"`,
		}),
		rule(".sep.comma > *:after", {
			content: `", "`,
		}),
		rule(".sep:not(.trailing) > *:last-child:after", {
			content: `""`,
		})
	),
	dark: group(
		rule(".dark", {
			__color_page: `${vars.color.black}`,
			__color_text: `${vars.color.white}`,
			background_color: `${vars.color.page}`,
			color: `${vars.color.text}`,
		}),
		rule(".light", {
			__color_page: `${vars.color.white}`,
			__color_text: `${vars.color.black}`,
			background_color: `${vars.color.page}`,
			color: `${vars.color.text}`,
		})
	),
});
