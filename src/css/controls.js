import {
	sides,
	classes,
	sizes,
	named,
	rule,
	group,
	vars,
	times,
	blended,
} from "../js/littlecss.js";
import { inputs } from "./lib/tags.js";

export default named({
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
			gap: "1px",
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
		rule(["button.default", ".button.default"], {
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
			background: "transparent",
			box_shadow: "unset",
			__button_bg: `color-mix(in oklab, ${vars.color.text}, ${vars.color.page} 90%)`,
			__button_fg: `${vars.color.text}`,
			__button_bd: "transparent",
		}),

		rule(["button:hover", ".button:hover"], {
			background_color: `color-mix(in oklab, ${vars.button.bg}, ${vars.color.page} 40%)`,
			border_color: `color-mix(in oklab, ${vars.button.bd}, ${vars.color.page} 20%)`,
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
	input: group(
		rule(".input", {
			border: `${vars.border.width} solid ${vars.color.bd}`,
			font_family: `${vars.font.control}`,
			padding: `${vars.pad[0]} ${vars.pad[0]}`,
			// NOTE: This is required as numeric fields have an extra height
			// This is so that the padding doesn't interfere.
			box_sizing: "border-box",
			gap: `${vars.gap[1]}`,
		})
	),
});
