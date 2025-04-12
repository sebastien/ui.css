import {
	sides,
	classes,
	sizes,
	cross,
	named,
	rule,
	group,
	vars,
	times,
	blended,
	mods,
} from "../js/littlecss.js";
import { inputs } from "./lib/tags.js";

export default named({
	selectable: group(
		rule(".selectable", {
			cursor: "pointer",
			user_select: "none",
			__color_bg: `${vars.color.grey}`,
		}),
		rule([".selectable:hover", ".selectable.hover"], {
			...blended(
				"background-color",
				vars.color.bg,
				vars.color.pagea,
				0.15
			),
		}),
		rule(
			[
				".selectable:active",
				".selectable.selected",
				".selectable[data-selected=true]",
			],
			{
				...blended(
					"background-color",
					vars.color.bg,
					vars.color.pagea,
					0.35
				),
			}
		)
	),
	action: group(
		rule(".action", {
			cursor: "pointer",
			user_select: "none",
			border_color: `${vars.color.bd}`,
			background_color: `${vars.color.bg}`,
			color: `${vars.color.fg}`,
		}),
		rule(".action:hover", {
			...blended("background-color", vars.color.bg, vars.color.low, 0.15),
		}),
		rule(".action.dark:hover", {
			...blended(
				"background-color",
				vars.current.bg,
				vars.color.high,
				0.15
			),
		})
	),
	pill: group(
		rule(".pills", {
			display: "inline-flex",
			flex_wrap: "wrap",
			gap: `${vars.gap}`,
		}),
		rule(".pill", {
			display: "inline-flex",
			border: `${vars.border.width} solid ${vars.color.bd}`,
			padding: `${vars.pad[0]} ${vars.pad[2]}`,
			transition_properties: "color,border-color,background-color",
			transition_duration: "150ms",
			border_radius: `2lh`,
			background_color: `color-mix(in oklab, ${vars.color.bg} 0%, ${vars.color.page})`,
		}),
		rule([".pill:hover", ".pill.hover"], {
			background_color: `color-mix(in oklab, ${vars.color.bg} 50%, ${vars.color.page})`,
		}),
		rule(".pill.selected", {
			background_color: `color-mix(in oklab, ${vars.color.bg} 100%, ${vars.color.page})`,
		}),
		rule(".pill.transparent", {
			background_color: "transparent",
		}),
		rule([".pill.transparent:hover", ".pill.transparent.hover"], {
			background_color: `color-mix(in oklab, ${vars.color.bg} 5%, ${vars.color.page})`,
		}),
		rule(".pill.transparent.selected", {
			background_color: `color-mix(in oklab, ${vars.color.bg} 15%, ${vars.color.page})`,
		})
	),
	button: group(
		rule(["button", ".button"], {
			__color_bg: `${vars.color.text}`,
			__button_bd: `${vars.color.bg}`,
			__button_bg: `${vars.color.bg}`,
			// __button_fg: `color-contrast(${vars.button.bg} vs ${vars.color.text}, ${vars.color.page})`,
			__button_fg: `${vars.color.page}`,
			display: "inline-flex",
			align_items: "center",
			white_space: "nowrap",
			padding: `0.5em 0.75em`,
			border: `1px solid ${vars.button.bd}`,
			background: `${vars.button.bg}`,
			color: `${vars.button.fg}`,
			cursor: "pointer",
			font_family: `${vars.font.control}`,
			line_height: "1em",
			font_size: "100%",
			box_sizing: "border-box",
			transition_property:
				"border-color,background,color,transform,box-shadow",
			transition_duration: "0.15s",
		}),
		rule(["button.outline", ".button.outline"], {
			__button_fg: `${vars.button.bd}`,
			__button_bg: "transparent",
			border: `2px solid ${vars.button.bd}`,
		}),
		rule(["button.default", ".button.default", "button[type=submit]"], {
			outline: `3px solid ${vars.button.bg}`,
		}),
		rule(["button.primary", ".button.primary"], {
			__color_bg: `${vars.color.blue[5]}`,
		}),
		rule(["button.success", ".button.success"], {
			__color_bg: `${vars.color.green[5]}`,
		}),
		rule(["button.info", ".button.info"], {
			__color_bg: `${vars.color.cyan[5]}`,
		}),
		rule(["button.warning", ".button.warning"], {
			__color_bg: `${vars.color.orange[5]}`,
		}),
		rule(["button.danger", ".button.danger"], {
			__color_bg: `${vars.color.red[5]}`,
		}),
		rule(["button.shadow", ".button.shadow"], {
			box_shadow: `3px 3px 0px color-mix(in hsl, ${vars.color.bg}, #FFFFFF00 80%)`,
		}),
		rule(["button.transparent", ".button.transparent"], {
			__button_bg: `color-mix(in oklab, ${vars.color.text}, ${vars.color.page} 90%)`,
			__button_fg: `${vars.color.text}`,
			__button_bd: "transparent",
			background: "transparent",
			box_shadow: "unset",
		}),

		rule(mods(["button", ".button"], "hover"), {
			background_color: `color-mix(in oklab, ${vars.button.bg}, ${vars.color.page} 40%)`,
			border_color: `color-mix(in oklab, ${vars.button.bd}, ${vars.color.page} 20%)`,
		}),
		rule(mods(["button.outline", ".button.ouline"], "hover"), {
			background_color: `${vars.button.bd}`,
			color: `${vars.color.page}`,
		}),
		rule(
			[
				"button.square",
				".button.square",
				"button.circle",
				".button.circle",
			],
			{
				width: "calc(1lh + 1em)",
				align_items: "center",
				justify_content: "center",
				aspect_ratio: "1",
			}
		)
	),
	selector: group(
		rule(".selector", {
			__selector_bd: `${vars.color.text}`,
			__selector_bg: `${vars.color.higha}`,
			__selector_bgs: `${vars.color.text}`,
			__selector_bgh: `color-mix(in oklab, ${vars.selector.bgs}, ${vars.color.pagea} 90%)`,
			__selector_bga: `color-mix(in oklab, ${vars.selector.bgs}, ${vars.color.pagea} 50%)`,
			__selector_fg: `${vars.color.text}`,
			__selector_fgs: `${vars.color.page}`,
			__selector_fgh: `${vars.color.text}`,
			__selector_fga: `${vars.color.text}`,
			display: "inline-flex",
			gap: `0em`,
			flex_wrap: "wrap",
		}),
		rule(".selector > li", ".selector > .item", {
			user_select: "none",
			align_items: "center",
			white_space: "nowrap",
			padding: `0.5em 0.75em`,
			border: `1px solid ${vars.selector.bd}`,
			background: `${vars.selector.bg}`,
			color: `${vars.selector.fg}`,
			cursor: "pointer",
			font_family: `${vars.font.control}`,
			line_height: "1em",
			font_size: "100%",
			box_sizing: "border-box",
			border_collapse: "collapse",
			transition_property:
				"border-color,background,color,color,transform,box-shadow",
			transition_duration: "0.15s",
		}),
		rule(
			...cross([".selector"], ["> li", "> .item"], [":hover", ".hover"]),
			{
				background_color: `${vars.selector.bgh}`,
				color: `${vars.selector.fgh}`,
			}
		),

		rule(...cross([".selector"], ["> li", "> .item"], ".selected"), {
			background_color: `${vars.selector.bgs}`,
			color: `${vars.selector.fgs}`,
		}),
		rule(
			...cross(
				[".selector"],
				["> li", "> .item"],
				[":active", ".active"]
			),
			{
				background_color: `${vars.selector.bga}`,
				color: `${vars.selector.fga}`,
			}
		),
		group(
			// Pills & Bar
			group(
				rule(".selector.pills", {
					__gap: `${vars.gap[2]}`,
					gap: `${vars.gap}`,
				}),
				rule(".selector.pills > li", ".selector.pills > .item", {
					border_radius: `2lh`,
				})
			),
			group(
				rule(
					".selector.bar.rounded > li:first-child",
					".selector.bar.rounded > .item:first-child",
					{
						border_top_left_radius: `2lh`,
						border_bottom_left_radius: `2lh`,
					}
				),
				rule(
					".selector.bar.rounded > li:last-child",
					".selector.bar.rounded > .item:last-child",

					{
						border_top_right_radius: `2lh`,
						border_bottom_right_radius: `2lh`,
					}
				),

				rule(
					".selector.bar.rounded > li:last-child",
					".selector.bar.rounded > .item:last-child",

					{
						border_top_right_radius: `2lh`,
						border_bottom_right_radius: `2lh`,
					}
				),

				rule(
					...cross(".selector.bar.transparent", ["> li", "> .item"]),
					{
						border_left: "0px solid transparent",
						border_top: "0px solid transparent",
						border_bottom: "0px solid transparent",
					}
				),
				rule(
					...cross(
						".selector.bar.transparent",
						["> li", "> .item"],
						[":last-child", ".last"]
					),
					{
						border_right: "0px solid transparent",
					}
				)
			)
		),

		group(
			// List & Menu
			rule(...cross([".selector"], [".list", ".menu"]), {
				__selector_bdw: "1px",
				display: "flex",
				gap: `${vars.gap}`,
				flex_direction: "column",
				flex_wrap: "nowrap",
			}),
			rule(...cross([".selector"], [".list", ".menu"], ".unlined"), {
				__selector_bdw: "0px",
			}),
			rule(
				...cross(
					[".selector"],
					[".list", ".menu"],
					["> li", "> .item"]
				),
				{
					display: "inline_flex",
					align_items: "center",
					border: "0px solid transparent",
					border_bottom: `${vars.selector.bdw} solid ${vars.selector.bd}`,
				}
			),
			rule(
				...cross(
					[".selector"],
					[".list", ".menu"],
					["> li", "> .item"],
					[":last-child", ".last"]
				),
				{
					border_bottom: `0px solid ${vars.selector.bd}`,
				}
			)
		)
	),
	input: group(
		rule([".input", "input", "textarea"], {
			__input_bdf: `color-mix(in oklab,${vars.input.bd},${vars.color.low} 20%)`,
			__input_bdw: `1px`,
			__input_ol: `color-mix(in oklab,${vars.color.focus},${vars.color.higha} 85%)`,
			__input_olw: "1px",
			__input_bd: `${vars.color.bd}`,
			__input_fg: `${vars.color.text}`,
			__input_bg: `${vars.color.page}`,
			__gap: `${vars.gap[2]}`,
			display: "inline-flex",
			flex_wrap: "nowrap",
			align_items: "center",
			gap: `${vars.gap}`,
			border: `${vars.input.bdw} solid ${vars.input.bd}`,
			outline: `1px solid ${vars.input.ol}`,
			font_family: `${vars.font.control}`,
			background_color: `${vars.input.bg}`,
			color: `${vars.input.fg}`,
			padding: `0.5em 0.5em`,
			line_height: "1em",
			font_size: "100%",
			// NOTE: This is required as numeric fields have an extra height
			// This is so that the padding doesn't interfere.
			box_sizing: "border-box",
			transition_property: "outline-width",
			transition_duration: "0.15s",
		}),
		rule([".textarea", "textarea"], {
			width: "100%",
			min_height: "7.25em",
		}),
		rule(
			[".input.transparent", "input.transparent", "textarea.transparent"],
			{
				__input_ol: "transparent",
				__input_olw: "0px",
				__input_bdw: "0px",
				__input_bd: "transparent",
				__input_bdf: "transparent",
				__input_bg: "transparent",
			}
		),
		rule(mods([".input", "input", "textarea"], "focus", "active"), {
			outline: `3px solid color-mix(in oklab,${vars.color.focus},${vars.color.higha} 85%)`,
			border_color: `${vars.color.bdf}`,
		}),
		rule(
			mods(
				cross([".input", "input", "textarea"], ".transparent"),
				"focus",
				"active"
			),
			{
				outline: `0px solid transparent`,
			}
		),
		// Overrides
		rule([".input.nopad", "input.nopad"], {
			padding: "0em",
		})
	),
});
// EOF
