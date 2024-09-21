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
			display: "inline-block",
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
