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
		...sizes.map((k, i) =>
			rule([times(7, (i) => `h${i + 1}.${k}`)], {
				font_size: `${vars.heading.size[i]}`,
			}),
		),
		// .hX rules do not have padding
		...times(7, (i) =>
			rule(`.h${i + 1}`, {
				font_size: `${vars.heading.size[6 - i]}`,
				font_weight: "600",
			}),
		),
		// hX.t have padding/margin
		...times(7, (i) =>
			rule([`h${i + 1}.t`, `.t h${i + 1}`], {
				font_size: `${vars.heading.size[6 - i]}`,
				font_weight: "600",
				margin_top: `${vars.margin[2]}`,
				margin_bottom: `${vars.margin[2]}`,
				padding_bottom: `${vars.pad[0]}`,
			}),
		),
	),
	lists: group(
		rule(["p.t", ".t p"], {
			margin_top: "0.75em",
			margin_bottom: "0.75em",
			min_height: "1.5em",
		}),
		rule(["p.t:first-child", ".t p:first-child"], {
			margin_top: "unset",
		}),
		rule(["p.t:last-child", ".t p:last-child"], {
			margin_bottom: "unset",
		}),
		rule([".t code", "code.t"], {
			font_family: vars.font.code.family,
		}),
		rule([".t em", "em.t"], {
			font_style: "italic",
		}),
		rule([".t s", "s.t"], {
			text_decoration: "line-through",
		}),
		rule([".t strong", "strong.t"], {
			font_weight: "bold",
		}),
		// Inline formats
		rule([".t a", "a.t"], {
			color: "inherit",
			text_decoration: "underline",
		}),
		rule([".t a:hover", "a.t:hover"], {
			opacity: 0.75,
		}),
		rule([".t sub", "sub.t"], {
			vertical_align: "sub",
			font_size: "0.75em",
		}),
		rule([".t sup", "sup.t"], {
			vertical_align: "super",
			font_size: "0.75em",
		}),
		rule([".t u", "u.t"], {
			text_decoration: "underline",
		}),
		// Block formats
		rule([".t blockquote", "blockquote.t"], {
			border_left: "4px solid",
			border_color: "currentColor",
			margin_left: "0",
			margin_right: "0",
			margin_top: "0.75em",
			margin_bottom: "0.75em",
			padding_left: "1em",
			padding_top: "0.25em",
			padding_bottom: "0.25em",
			opacity: 0.85,
		}),
		rule([".t pre", "pre.t"], {
			font_family: vars.font.code.family,
			background: "rgba(128, 128, 128, 0.1)",
			border_radius: "4px",
			margin_top: "0.75em",
			margin_bottom: "0.75em",
			padding: "0.75em 1em",
			overflow_x: "auto",
			white_space: "pre",
		}),
		rule([".t pre code", "pre.t code"], {
			background: "transparent",
			padding: "0",
		}),
		rule(["ul.t", "ol.t", "dl.t", ".t ul", ".t ol", ".t dl"], {
			margin_top: "0.75em",
			margin_bottom: "1.5em",
			padding_left: "1.5em",
		}),
		rule(["ol.t", ".t ol"], {
			padding_left: "2em",
		}),
		rule(["li.t > p", ".t li p"], {
			maring_top: "unset",
			maring_bottom: "unset",
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
		}),
	),
	whitespace: group(
		rule(".nobreak", { white_space: "nobreak" }),
		rule(".nowrap", { white_space: "nowrap" }),
		rule(".wrap", { overflow_wrap: "break-word" }),
		rule(".noheading", {
			__heading_base: 1,
			__heading_max: 1,
			__heading_min: 1,
			__heading_amplitude: 0,
			__heading_unit: "1rem",
			// FIXME: In theory, these should not be required, but
			// it doesn't seem that the sizes recalculate.
			__heading_size_0: "1rem",
			__heading_size_1: "1rem",
			__heading_size_2: "1rem",
			__heading_size_3: "1rem",
			__heading_size_4: "1rem",
			__heading_size_5: "1rem",
			__heading_size_6: "1rem",
			__heading_size_7: "1rem",
		}),
		rule(".pre", { white_space: "pre" }),
		rule(".pre-lines", { white_space: "pre-line" }),
		rule(".ellipsis", { text_overflow: "ellipsis", overflow: "hidden" }),
	),
	transform: group(
		rule(".upper", { text_transform: "uppercase" }),
		rule(".lower", { text_transform: "lowercase" }),
		rule(".cap", { text_transform: "capitalize" }),
	),
	alignment: group(
		rule(".t-center", { text_align: "center" }),
		rule(".t-right", { text_align: "right" }),
		rule(".t-left", { text_align: "left" }),
		rule(".t-justify", { text_align: "justify" }),
	),
	direction: group(
		rule(".t-rtl", {
			direction: "rtl",
			text_align: "inherit",
		}),
		rule(".t-ltr", {
			direction: "ltr",
		}),
	),
	delimiter: group(
		rule(".sep-path>*:after", { content: '"/"' }),
		rule(".sep-comma>*:after", { content: '", "' }),
		rule(".sep-dash>*:after", { content: '"―"' }),
		rule(
			[
				".sep-path>*:last-child:after",
				".sep-comma>*:last-child:after",
				".sep-dash>*:last-child:after",
			],
			{ display: "none" },
		),
	),
	overflow: group(rule(".ellipsis", { text_overflow: "ellipsis" })),
	decorations: named({
		parens: group(
			rule(".parens:before", { content: '"("' }),
			rule(".parens:after", { content: '")"' }),
		),
		brackets: group(
			rule(".brackets:before", { content: '"{"' }),
			rule(".brackets:after", { content: '"}"' }),
		),
		sqbrackets: group(
			rule(".sqbrackets:before", { content: '"["' }),
			rule(".sqbrackets:after", { content: '"]"' }),
		),
	}),
	font: group(
		rule([".em", ".italic"], { font_style: "italic" }),
		rule([".ltr", ".lighter", ".thin"], { font_weight: "100" }),
		rule([".lt", ".light"], { font_weight: "200" }),
		rule([".r", ".regular"], { font_weight: "400" }),
		rule([".sb", ".medium"], { font_weight: "500" }),
		rule([".b", ".bold"], { font_weight: "600" }),
		rule([".br", ".bolder"], { font_weight: "700" }),
		rule([".bst", ".boldest"], { font_weight: "800" }),
		rule(".mono", { font_family: `${vars.font.mono}` }),
		rule(".sans", { font_family: `${vars.font.sans}` }),
		rule(".serif", { font_family: `${vars.font.serif}` }),
		rule(".script", { font_family: `${vars.font.script.family}` }),
		rule(".code", { font_family: `${vars.font.code.family}` }),
		rule(".control", { font_family: `${vars.font.control.family}` }),
		rule(".heading", { font_family: `${vars.font.heading.family}` }),
		rule(".script", { font_family: `${vars.font.script.family}` }),
		rule(".display", { font_family: `${vars.font.display.family}` }),
		rule(".striked", { text_decoration: "line-through" }),
		rule(".ul", { text_decoration: "underline" }),
		rule(".ol", { text_decoration: "overline" }),
		...Object.keys(sizenames).map((k, i) =>
			rule(`.t-${k}`, { font_size: `${vars.textsize.size[i]}` }),
		),
		...Object.keys(sizes).map((k, i) =>
			rule(`.t-${k}`, { font_size: `${vars.textsize.size[i]}` }),
		),
	),
});
// EOF
