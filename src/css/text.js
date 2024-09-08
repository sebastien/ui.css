import {
	sizes,
	sizenames,
	named,
	rule,
	group,
	vars,
	times,
} from "../js/littlecss.js";
export default named({
	headings: group(
		rule([times(7, (i) => `h${i + 1}`)], {
			font_family: `${vars.font.heading}`,
			margin: "unset",
			padding: "unset",
			font_size: "unset",
		}),
		...sizes.map((k, i) =>
			rule([times(7, (i) => `h${i + 1}.${k}`)], {
				font_size: `${vars.heading.size[i]}`,
			})
		)
	),
	font: group(
		rule(".italic", { font_style: "italic" }),
		rule(".bold", { font_weight: "400" }),
		rule(".bolder", { font_weight: "600" }),
		rule(".boldest", { font_weight: "800" }),
		rule(".code", { font_family: `${vars.font.code}` }),
		rule(".sans", { font_family: `${vars.font.sans}` }),
		rule(".serif", { font_family: `${vars.font.serif}` }),
		rule(".control", { font_family: `${vars.font.control}` }),
		rule(".heading", { font_family: `${vars.font.heading}` }),
		rule(".display", { font_family: `${vars.font.display}` }),
		...Object.keys(sizenames).map((k, i) =>
			rule(`.${k}`, { font_size: `${vars.text.size[i]}` })
		),
		...Object.keys(sizenames).map((k, i) =>
			rule(`.h-${k}`, { font_size: `${vars.heading.size[i]}` })
		)
	),
});
