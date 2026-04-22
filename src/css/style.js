import {
	group,
	mods,
	named,
	rule,
	sizes,
	sides,
	times,
	vars,
} from "../js/uicss.js";

export default named({
	base: rule(".base", {
		font_family: `${vars.font.family}`,
		font_size: vars.font.size,
		line_height: `${vars.font.line_height}`,
	}),
	style: group(
		rule([".nolink", ".nolink:hover"], {
			color: "unset",
			text_decoration: "none",
		}),
		rule(".noresize", { resize: "none" }),
		rule(".nolh", { line_height: "0em" }),
		rule(".noblur", { __shadow_spread: "0" }),
		rule(".nogap", { gap: "0em" }),
		rule(".ma", { margin: "auto" }),
		sizes.map((k, i) =>
			rule([`.m-${k}`, `.m-${i}`], {
				margin: `${vars.margin[i]}`,
				__margin: `${vars.margin[i]}`,
			}),
		),
		sizes.map((k, i) =>
			rule([`.mt-${k}`, `.mt-${i}`], {
				margin_top: `${vars.margin[i]}`,
			}),
		),
		sizes.map((k, i) =>
			rule([`.mb-${k}`, `.mb-${i}`], {
				margin_bottom: `${vars.margin[i]}`,
			}),
		),
		sizes.map((k, i) =>
			rule([`.ml-${k}`, `.ml-${i}`], {
				margin_left: `${vars.margin[i]}`,
			}),
		),
		sizes.map((k, i) =>
			rule([`.mr-${k}`, `.mr-${i}`], {
				margin_right: `${vars.margin[i]}`,
			}),
		),
		sizes.map((k, i) =>
			rule([`.mh-${k}`, `.mh-${i}`], {
				margin_left: `${vars.margin[i]}`,
				margin_right: `${vars.margin[i]}`,
			}),
		),
		sizes.map((k, i) =>
			rule([`.mv-${k}`, `.mv-${i}`], {
				margin_top: `${vars.margin[i]}`,
				margin_bottom: `${vars.margin[i]}`,
			}),
		),
		sizes.map((k, i) =>
			rule([`.p-${k}`, `.p-${i}`], {
				padding: `${vars.pad[i]}`,
				__pad: `${vars.pad[i]}`,
			}),
		),
		sizes.map((k, i) =>
			rule([`.pt-${k}`, `.pt-${i}`], {
				padding_top: `${vars.pad[i]}`,
			}),
		),
		sizes.map((k, i) =>
			rule([`.pb-${k}`, `.pb-${i}`], {
				padding_bottom: `${vars.pad[i]}`,
			}),
		),
		sizes.map((k, i) =>
			rule([`.pl-${k}`, `.pl-${i}`], {
				padding_left: `${vars.pad[i]}`,
			}),
		),
		sizes.map((k, i) =>
			rule([`.pr-${k}`, `.pr-${i}`], {
				padding_right: `${vars.pad[i]}`,
			}),
		),
		sizes.map((k, i) =>
			rule([`.ph-${k}`, `.ph-${i}`], {
				padding_left: `${vars.pad[i]}`,
				padding_right: `${vars.pad[i]}`,
			}),
		),
		sizes.map((k, i) =>
			rule([`.pv-${k}`, `.pv-${i}`], {
				padding_top: `${vars.pad[i]}`,
				padding_bottom: `${vars.pad[i]}`,
			}),
		),
		rule([".nop", ".no-p"], { padding: "0px" }),
		rule([".nom", ".no-m"], { margin: "0px" }),
		rule([".noph", ".no-ph"], { padding_left: "0px", padding_right: "0px" }),
		rule([".nopv", ".no-pv"], { padding_top: "0px", padding_bottom: "0px" }),
		rule([".nomh", ".no-mh"], { margin_left: "0px", margin_right: "0px" }),
		rule([".nomv", ".no-mv"], { margin_top: "0px", margin_bottom: "0px" }),
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
		}),
	),

	interaction: group(
		rule(".noev", { pointer_events: "none" }),
		rule(".ev", { pointer_events: "auto" }),
		rule(".move", { cursor: "move" }),
		rule(".pointer", { cursor: "pointer" }),
		rule(".help", { cursor: "help" }),
		rule(".grab", { cursor: "grab" }),
		rule(".grabbing", { cursor: "grabbing" }),
		rule(".move", { cursor: "move" }),
		rule(".resize-w", { cursor: "col-resize", user_select: "none" }),
		rule(".resize-h", { cursor: "row-resize", user_select: "none" }),
		rule([".resize", ".resize-lr"], {
			cursor: "nwse-resize",
			user_select: "none",
		}),
	),
	font: group(
		rule(".lll", { font_weight: 100 }),
		rule(".ll", { font_weight: 200 }),
		rule(".l", { font_weight: 300 }),
		rule(".b", { font_weight: 600 }),
		rule(".bb", { font_weight: 700 }),
		rule(".bbb", { font_weight: 800 }),
	),
	opacity: group(
		rule(".dim", { opacity: vars.opacity.dim }),
		rule(".dimmer", { opacity: vars.opacity.dimmer }),
		rule(".dimmest", { opacity: vars.opacity.dimmest }),
		// FIXME: Maybe should be deprecated or moved to colors.js
		// Background opacity variants using new color system
		rule(".bg-dim", {
			__background_o: 6,
		}),
		rule(".bg-dimmer", {
			__background_o: 4,
		}),
		rule(".bg-dimmest", {
			__background_o: 2,
		}),
	),
	visibility: group(
		rule(".skip", { display: "none !important" }),
		rule(".invisible", { opacity: "0 !important" }),
		rule(".hidden", { visibility: "hidden !important" }),
	),
	rounding: group(
		rule(".rounded", {
			__border_radius: "0.25lh",
			border_radius: vars.border.radius,
		}),
		rule(".rounder", {
			__border_radius: "0.5lh",
			border_radius: vars.border.radius,
		}),
		rule(".roundest", {
			__border_radius: "1.5lh",
			border_radius: vars.border.radius,
		}),
	),
	border: group(
		rule(".rd", { border_radius: vars.border.radius }),
		...times(10, (i) =>
			rule(`.rd-tl-${i}`, { border_top_left_radius: `${i}px` }),
		),
		...times(10, (i) =>
			rule(`.rd-tr-${i}`, { border_top_right_radius: `${i}px` }),
		),
		...times(10, (i) =>
			rule(`.rd-bl-${i}`, { border_bottom_left_radius: `${i}px` }),
		),
		...times(10, (i) =>
			rule(`.rd-br-${i}`, { border_bottom_right_radius: `${i}px` }),
		),
		...times(10, (i) => rule(`.rd-${i}`, { __border_radius: `${i}px` })),
		...times(10, (i) => rule(`.bdw-${i}`, { __border_width: `${i}px` })),
		...times(10, (i) => rule(`.bdw-t-${i}`, { __border_top_width: `${i}px` })),
		...times(10, (i) =>
			rule(`.bdw-b-${i}`, { __border_bottom_width: `${i}px` }),
		),
		...times(10, (i) => rule(`.bdw-l-${i}`, { __border_left_width: `${i}px` })),
		...times(10, (i) =>
			rule(`.bdw-r-${i}`, { __border_right_width: `${i}px` }),
		),
		...times(10, (i) => rule(`.bd-${i}`, { __border_width: `${i}px` })),
		...Object.keys(sides).map((k) =>
			rule(`.bd-${k.substring(0, 1)}`, {
				[`border_${sides[k]}_width`]: vars.border.width,
				[`border_${sides[k]}_style`]: "solid",
			}),
		),
		...times(10, (i) => rule(`.olw-${i}`, { __outline_width: `${i}px` })),
		rule(".dashed", { border_style: "dashed" }),
		rule(".dotted", { border_style: "dotted" }),
	),
	shadow: group(
		...times(10, (i) =>
			rule(`.sh-${i}`, {
				box_shadow: `calc(${vars.shadow.x}*${i}) calc(${vars.shadow.y}*${i}) calc(${vars.shadow.spread}*${i}) ${vars.shadow.color}`,
			}),
		),
	),
	table: group(
		rule("table", {
			border_collapse: "separate",
			border_spacing: `0px ${vars.gap[3]}`,
		}),
		rule(["table.lined tbody th", "table.lined tbody td"], {
			border_bottom_width: vars.border.width,
			border_bottom_style: "solid",
		}),
		rule(
			[
				"table.lined tbody tr:last-child td",
				"table.lined tbody tr:last-child th",
			],
			{
				border_bottom_width: "0px",
			},
		),
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
		}),
	),
	striped: group(
		rule(".striped > *:nth-child(even)", {
			__background_l: 7,
		}),
	),
	depth: group(
		...times(11, (i) => rule(`.z-${i}`, { z_index: i * 10 })),
		rule(mods([".inset"], undefined, "focus", "hover", "active"), {
			__inset_shadow: `oklch(0 0 0 / 0.1)`,
			__inset_light: `oklch(1 0 0 / 0.5)`,
			border_width: "2px",
			border_top_color: vars.inset.shadow,
			border_left_color: vars.inset.shadow,
			border_bottom_color: vars.inset.light,
			border_right_color: vars.inset.light,
		}),
		rule(mods([".raised"], undefined, "focus", "hover", "active"), {
			__inset_shadow: `oklch(0 0 0 / 0.1)`,
			__inset_light: `oklch(1 0 0 / 0.5)`,
			border_width: "2px",
			border_top_color: vars.inset.light,
			border_left_color: vars.inset.light,
			border_bottom_color: vars.inset.shadow,
			border_right_color: vars.inset.shadow,
		}),
	),
});
// EOF
