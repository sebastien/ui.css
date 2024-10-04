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
		),
		...times(7, (i) =>
			rule(`h${i + 1}.t`, {
				font_size: `${vars.heading.size[6 - i]}`,
				font_weight: "600",
				margin_top: `${vars.margin[2]}`,
				margin_bottom: `${vars.margin[2]}`,
				padding_bottom: `${vars.pad[0]}`,
			})
		)
	),
	lists: group(
		rule(["ul.t", "ol.t", "dl.t", ".t ul", ".t ol", ".t dl"], {
			margin_top: "0.75em",
			margin_bottom: "1.5em",
			padding_left: "1.5em",
		}),
		rule(["ul.t li", ".t ul li"], {
			list_style_type: "disc",
		}),
		rule(["ol.t li", ".t ol li"], {
			list_style_type: "decimal",
		}),
		rule([".t li", "li.t"], {
			margin_bottom: "0.5em",
		}),
		rule([".t dl", "dl.t"], {
			padding_left: "0em",
		}),
		rule([".t dt", "dt.t"], {
			margin_top: "1.5em",
			margin_bottom: "0.5em",
			font_weight: "bold",
			opacity: 0.75,
		}),
		rule([".t dd", "dd.t"], {
			margin_top: "0.5em",
			margin_bottom: "1.5em",
		})
	),
	font: group(
		rule(".italic", { font_style: "italic" }),
		rule([".lighter", ".thin"], { font_weight: "100" }),
		rule(".light", { font_weight: "200" }),
		rule(".regular", { font_weight: "400" }),
		rule(".medium", { font_weight: "500" }),
		rule(".bold", { font_weight: "600" }),
		rule(".bolder", { font_weight: "700" }),
		rule(".boldest", { font_weight: "800" }),
		rule(".code", { font_family: `${vars.font.code}` }),
		rule(".sans", { font_family: `${vars.font.sans}` }),
		rule(".serif", { font_family: `${vars.font.serif}` }),
		rule(".control", { font_family: `${vars.font.control}` }),
		rule(".heading", { font_family: `${vars.font.heading}` }),
		rule(".script", { font_family: `${vars.font.script}` }),
		rule(".display", { font_family: `${vars.font.display}` }),
		...Object.keys(sizenames).map((k, i) =>
			rule(`.${k}`, { font_size: `${vars.text.size[i]}` })
		)
	),
});
