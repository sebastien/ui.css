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
		rule(".noresize", { resize: "none" }),
		rule(".nolh", { line_height: "0em" }),
		rule(".nogap", { gap: "0em" }),
		rule([".nostyle", ":hover .hover-nostyle", ".hover-nostyle:hover"], {
			appearance: "none",
			padding: "unset",
			margin: "unset",
			color: "unset",
			border: "unset",
			background: "unset",
			outline: "unset",
			width: "unset",
			min_width: "unset",
			max_width: "unset",
		})
	),
	interaction: group(
		rule(".noev", { pointer_events: "none" }),
		rule(".ev", { pointer_events: "auto" }),
		rule(".move", { cursor: "move" }),
		rule(".pointer", { cursor: "pointer" }),
		rule(".help", { cursor: "help" }),
		rule(".grab", { cursor: "grab" }),
		rule(".grabbing", { cursor: "grabbing" }),
		rule(".resize-w", { cursor: "col-resize" }),
		rule(".resize-h", { cursor: "row-resize" }),
		rule(".resize-lr", { cursor: "nwse-resize" })
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
		...times(10, (i) =>
			rule(`.rd-tl-${i}`, { border_top_left_radius: `${i}px` })
		),
		...times(10, (i) =>
			rule(`.rd-tr-${i}`, { border_top_right_radius: `${i}px` })
		),
		...times(10, (i) =>
			rule(`.rd-bl-${i}`, { border_bottom_left_radius: `${i}px` })
		),
		...times(10, (i) =>
			rule(`.rd-br-${i}`, { border_bottom_right_radius: `${i}px` })
		),
		...times(10, (i) => rule(`.rd-${i}`, { __border_radius: `${i}px` })),
		...times(10, (i) => rule(`.bd-${i}`, { __border_width: `${i}px` })),
		...times(10, (i) =>
			rule(`.bd-t-${i}`, { __border_top_width: `${i}px` })
		),
		...times(10, (i) =>
			rule(`.bd-b-${i}`, { __border_bottom_width: `${i}px` })
		),
		...times(10, (i) =>
			rule(`.bd-l-${i}`, { __border_left_width: `${i}px` })
		),
		...times(10, (i) =>
			rule(`.bd-r-${i}`, { __border_right_width: `${i}px` })
		),
		rule(".bd", {
			border: `${vars.border.width} ${vars.border.style} ${vars.border.color} `,
		}),
		...Object.keys(sides).map((k) =>
			rule(`.bd-${k.substring(0, 1)}`, {
				[`border-${sides[k]}`]: `${vars.border.width} solid ${vars.border.color} `,
			})
		),
		rule(".dashed", { border_style: "dashed" }),
		rule(".dotted", { border_style: "dotted" })
	),
	shadow: group(
		...times(10, (i) =>
			rule(`.sh-${i}`, {
				box_shadow: `calc(${vars.shadow.depth}*${i}) calc(${vars.shadow.depth}*${i}) calc(${vars.shadow.spread}*${i}) ${vars.shadow.color}`,
			})
		)
	),
	table: group(
		rule("table", {
			border_collapse: "separate",
			border_spacing: `0px ${vars.gap}`,
		}),
		// FIXME: Not sure the variables are correct.
		rule(["table.lined th", "table.lined td"], {
			border_bottom: `${vars.border.width} ${vars.border.style} ${vars.border.color}`,
		}),
		rule(["table.lined tr:last-child td", "table.lined tr:last-child th"], {
			border_bottom_width: "0px",
		})
	),
	// DISABLE, should be layout?
	// shape: group(
	// 	rule([".square", ".circle"], {
	// 		display: "inline-flex",
	// 		align_items: "center",
	// 		box_sizing: "border-box",
	// 		aspect_ratio: "1",
	// 	}),
	// 	rule([".circle"], {
	// 		border_radius: "100%",
	// 	})
	// ),
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
	striped: group(
		rule(".striped > *:nth-child(even)", {
			background_color: `${vars.color.bg}`,
		})
	),
	transparent: group(rule(".transparent", { color: "transparent" })),
	dark: group(
		// FIXME: THis is not right
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
