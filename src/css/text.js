import { sizes, named, rule, group, vars, times } from "../js/littlecss.js";
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
	text: group(
		rule(".italic", { font_style: "italic" }),
		rule(".bold", { font_weight: "400" }),
		rule(".bolder", { font_weight: "600" }),
		rule(".boldest", { font_weight: "800" })
	),
});
