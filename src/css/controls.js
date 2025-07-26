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

function button(fg, bg, index, direction = 1) {
	return {
		__button_bd: `${bg[index]}`,
		__button_bg: `${bg[index]}`,
		__button_fg: fg,
		__button_ot: `${bg[index + 1 * direction]}`,
		// Hover
		__button_hover_bd: `${bg[index + 1 * direction]}`,
		__button_hover_bg: `${bg[index + 1 * direction]}`,
		// Active
		__button_active_bd: `${bg[index + 2 * direction]}`,
		__button_active_bg: `${bg[index + 2 * direction]}`,
	};
}
export default named({
	selectable: group(
		rule(".selectable", {
			cursor: "pointer",
			user_select: "none",
			__selectable_inactive_bg: vars.color.neutral,
			__selectable_active_bg: vars.color.secondary,
		}),
		rule([".selectable:hover", ".selectable.hover"], {
			...blended(
				"background-color",
				vars.selectable.inactive.bg,
				vars.color.pagea,
				0.15
			),
		}),
		rule([".selectable.highlighted", ".selectable[data-highligted=true]"], {
			...blended(
				"background-color",
				vars.selectable.active.bg,
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
					vars.selectable.active.bg,
					vars.neutral.pagea,
					0.35
				),
			}
		)
	),
	resizable: group(
		rule(".resize-h", {
			cursor: "col-resize",
			user_select: "none",
		})
	),
	action: group(
		rule(".action", {
			cursor: "pointer",
			user_select: "none",
		})
	),
	pill: group(
		rule(".pills", {
			display: "inline-flex",
			flex_wrap: "wrap",
			gap: `${vars.gap}`,
		}),
		rule(".pill", {
			__pill_inactive_bd: vars.color.neutral,
			__pill_inactive_bg: vars.color.neutral,
			__pill_active_bd: vars.color.bd,
			__pill_active_bg: vars.color.bg,
			display: "inline-flex",
			cursor: "pointer",
			border: `${vars.border.width} solid ${vars.color.pill.bd}`,
			padding: `${vars.pad[0]} ${vars.pad[2]}`,
			transition_properties: "color,border-color,background-color",
			transition_duration: "150ms",
			border_radius: `2lh`,
			background_color: `color-mix(in oklab, ${vars.pill.inactive.bg} 0%, ${vars.color.page})`,
		}),
		rule([".pill:hover", ".pill.hover"], {
			background_color: `color-mix(in oklab, ${vars.pill.inactive.bg} 50%, ${vars.color.page})`,
		}),
		rule(".pill.selected", {
			background_color: `color-mix(in oklab, ${vars.pill.active.bg} 100%, ${vars.color.page})`,
		}),
		rule(".pill.transparent", {
			background_color: "transparent",
		}),
		rule([".pill.transparent:hover", ".pill.transparent.hover"], {
			background_color: `color-mix(in oklab, ${vars.pill.active.bg} 5%, ${vars.color.page})`,
		}),
		rule(".pill.transparent.selected", {
			background_color: `color-mix(in oklab, ${vars.pill.active.bg} 15%, ${vars.color.page})`,
		})
	),
	// TODO: https://tailwindcss.com/plus/ui-blocks/application-ui/elements/buttons
	// TODO: https://tailwindcss.com/plus/ui-blocks/application-ui/forms/checkboxes
	// TODO: https://tailwindcss.com/plus/ui-blocks/application-ui/forms/radio-groups
	button: group(
		rule(["button", ".button"], {
			__button_font: `${vars.font.control.family}`,
			// Default (inactive)
			__button_bd: `${vars.palette.neutral[3]}`,
			__button_bg: `${vars.palette.neutral[2]}`,
			__button_fg: `${vars.palette.neutral[8]}`,
			__button_ot: `${vars.palette.neutral[3]}`,
			// Focus
			__button_focus_bd: `${vars.button.bg}`,
			__button_focus_bg: `${vars.button.bg}`,
			__button_focus_fg: `${vars.button.fg}`,
			__button_focus_ot: `${vars.button.ot}`,
			// Hover
			__button_hover_bd: `${vars.palette.neutral[4]}`,
			__button_hover_bg: `${vars.palette.neutral[3]}`,
			__button_hover_fg: `${vars.button.fg}`,
			__button_hover_ot: `${vars.button.ot}`,
			// Active
			__button_active_bd: `${vars.palette.neutral[5]}`,
			__button_active_bg: `${vars.palette.neutral[4]}`,
			__button_active_fg: `${vars.button.fg}`,
			__button_active_ot: `${vars.button.ot}`,

			display: "inline-flex",
			align_items: "center",
			white_space: "nowrap",
			// FIXME: Is this OK?
			padding: `0.5em 0.75em`,
			border: `1px solid ${vars.button.bd}`,
			background: `${vars.button.bg}`,
			color: `${vars.button.fg}`,
			cursor: "pointer",
			font_family: vars.button.font,
			// FIXME: Line height should be font line height no?
			line_height: "1em",
			font_size: "100%",
			box_sizing: "border-box",
			transition_property:
				"border-color,background,color,transform,box-shadow",
			transition_duration: "0.15s",
		}),
		rule(["button.default", ".button.default", "button[type=submit]"], {
			outline: `3px solid ${vars.color.primary}`,
		}),
		rule(["button.primary", ".button.primary"], {
			...button(vars.color.white, vars.palette.blue, 7),
		}),
		rule(["button.secondary", ".button.secondary"], {
			...button(vars.color.white, vars.palette.sky, 6),
		}),
		rule(["button.tertiary", ".button.tertiary"], {
			...button(vars.color.text, vars.palette.slate, 3),
		}),
		rule(["button.success", ".button.success"], {
			...button(vars.color.white, vars.palette.green, 5),
		}),
		rule(["button.info", ".button.info"], {
			...button(vars.color.text, vars.palette.cyan, 2),
		}),
		rule(["button.warning", ".button.warning"], {
			...button(vars.color.text, vars.palette.amber, 4),
		}),
		rule(["button.danger", ".button.danger"], {
			...button(vars.color.white, vars.palette.red, 5),
		}),
		rule(["button.shadow", ".button.shadow"], {
			box_shadow: `3px 3px 0px color-mix(in hsl, ${vars.color.bg}, #FFFFFF00 80%)`,
		}),
		rule(["button.blank", ".button.blank"], {
			__button_bg: `color-mix(in oklab, ${vars.color.text}, ${vars.color.page} 90%)`,
			__button_fg: `${vars.color.text}`,
			__button_bd: "transparent",
			__button_active_bd: "transparent",
			__button_hover_bd: "transparent",
			__button_focus_bd: "transparent",
			background: "transparent",
			box_shadow: "unset",
		}),
		rule(["button.outline", ".button.outline"], {
			__button_bd: `${vars.neutral.blue[7]}`,
			__button_bg: `color-mix(in ${vars.color.blend}, ${vars.color.pagea}, ${vars.color.white} 25%)`,
			__button_fg: `${vars.palette.neutral[6]}`,
			__button_ot: `${vars.palette.blue[7]}`,
			// Hover
			__button_hover_bd: `${vars.palette.blue[8]}`,
			__button_hover_bg: `color-mix(in ${vars.color.blend}, ${vars.color.pagea}, ${vars.color.white} 35%)`,
			// Active
			__button_active_bd: `${vars.palette.blue[9]}`,
			__button_active: `color-mix(in ${vars.color.blend}, ${vars.color.pagea}, ${vars.color.white} 50%)`,

			border_width: "2px",
		}),
		rule(["button.icon", ".button.icon"], {
			__button_bg: "transparent",
			padding: "0px",
			min_width: "0px",
			width: "min-content",
			border_width: "0px",
		}),

		rule(mods(["button", ".button"], "focus"), {
			background_color: `${vars.button.focus.bg}`,
			color: `${vars.button.focus.fg}`,
			border_color: `${vars.button.focus.bd}`,
			outline_color: `${vars.button.focus.ot}`,
			outline_width: "2px",
		}),
		rule(mods(["button", ".button"], "hover"), {
			background_color: `${vars.button.hover.bg}`,
			color: `${vars.button.hover.fg}`,
			border_color: `${vars.button.hover.bd}`,
			outline_color: `${vars.button.hover.ot}`,
		}),
		rule(mods(["button", ".button"], "active"), {
			background_color: `${vars.button.active.bg}`,
			color: `${vars.button.active.fg}`,
			border_color: `${vars.button.active.bd}`,
			outline_color: `${vars.button.active.bd}`,
		}),
		rule(mods(["button", ".button"], "disabled"), {
			opacity: 0.5,
			__button_focus_fg: vars.button.fg,
			__button_focus_bd: vars.button.bd,
			__button_focus_bg: vars.button.bg,
			__button_hover_bd: vars.button.bd,
			__button_hover_bg: vars.button.bg,
			__button_hover_ot: vars.button.ot,
			__button_hover_fg: vars.button.fg,
			__button_active_bd: vars.button.bd,
			__button_active_bg: vars.button.bg,
			__button_active_ot: vars.button.ot,
			__button_active_fg: vars.button.fg,
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
			// FIXME: Should be __selector_{active,inactive,hover}_{bd,fg}
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
			font_family: `${vars.font.control.family}`,
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
			font_family: `${vars.font.control.family}`,
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
			field_sizing: "content",
			resize: "none",
		}),
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
		// TODO: Checkbox
		// Overrides
		rule(mods([".noinput"], null, "focus", "active", "hover"), {
			__input_ol: "transparent",
			__input_olw: "0px",
			__input_bdw: "0px",
			__input_bd: "transparent",
			__input_bdf: "transparent",
			__input_bg: "transparent",
			background_color: "transparent",
			border_color: "transparent",
			outline: "none",
			min_width: "0px",
			padding: "0px",
		}),
		rule([".input.nopad", "input.nopad"], {
			padding: "0em",
		})
	),
});
// EOF
