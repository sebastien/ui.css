import {
	cross,
	named,
	rule,
	group,
	vars,
	blended,
	mods,
} from "../js/littlecss.js";

export default named({
	// ------------------------------------------------------------------------
	//
	// SELECTABLE
	//
	// ------------------------------------------------------------------------
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
	// ------------------------------------------------------------------------
	//
	// PILL
	//
	// ------------------------------------------------------------------------
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
	// ------------------------------------------------------------------------
	//
	// BUTTON
	//
	// ------------------------------------------------------------------------
	button: group(
		// TODO: Should pick the best contrasting color
		rule(["button", ".button"], {
			// Fonts
			__button_font_family: `${vars.font.controls.family}`,
			__button_font_line: `${vars.font.controls.line}`,
			__button_font_weight: `${vars.font.controls.weight}`,
			__button_font_size: `${vars.font.controls.size}`,
			__button_border_size: "1px",
			__button_outline_size: "2px",
			// Buttons define a main color, and derive the colors automatically
			// from the main color
			__button_color_text: vars.color.text,
			__button_color_main: vars.palette.neutral[3],
			__button_color_hover: `lch(from ${vars.button.color.main} clamp(0, calc(l - 10), 100) clamp(0, calc(c + 2), 150) clamp(0, calc(h - 2), 360))`,
			__button_color_active: `lch(from ${vars.button.color.main} clamp(0, calc(l - 20), 100) clamp(0, calc(c + 4), 150) clamp(0, calc(h - 4), 360))`,

			// Inactive (default)
			__button_bd: vars.button.color.main,
			__button_bg: vars.button.color.main,
			__button_fg: vars.button.color.text,
			__button_ot: vars.button.color.main,
			// Focus
			__button_focus_bd: vars.button.bd,
			__button_focus_bg: vars.button.bg,
			__button_focus_fg: vars.button.fg,
			__button_focus_ot: vars.button.color.hover,
			// Hover
			__button_hover_bd: vars.button.color.hover,
			__button_hover_bg: vars.button.color.hover,
			__button_hover_fg: vars.button.fg,
			__button_hover_ot: vars.button.ot,
			// Active
			__button_active_bd: vars.button.color.active,
			__button_active_bg: vars.button.color.active,
			__button_active_fg: vars.button.fg,
			__button_active_ot: vars.button.ot,
			// Parametric Styling
			border: `${vars.button.border.size} solid ${vars.button.bd}`,
			outline: `0px solid ${vars.button.ot}`,
			background: `${vars.button.bg}`,
			color: `${vars.button.fg}`,
			font_family: vars.button.font.family,
			line_height: vars.button.font.line,
			font_size: vars.button.font.size,
			font_weight: vars.button.font.weight,

			// Fixed styling
			cursor: "pointer",
			padding: `0.5em 0.75em`, // Padding will be based on font-size, which is what we want
			box_sizing: "border-box",
			display: "inline-flex",
			align_items: "center",
			white_space: "nowrap",
			transition_property:
				"border-width,border-color,background,color,transform,box-shadow,outline-width,outline-color",
			transition_duration: "0.1s",
		}),
		rule(["button.default", ".button.default", "button[type=submit]"], {
			outline: `${vars.button.outline.size} solid ${vars.button.color.main}`,
		}),
		rule(["button.primary", ".button.primary"], {
			__button_color_main: vars.color.primary,
		}),
		rule(["button.secondary", ".button.secondary"], {
			__button_color_main: vars.color.secondary,
		}),
		rule(["button.tertiary", ".button.tertiary"], {
			__button_color_main: vars.color.tertiary,
		}),
		rule(["button.success", ".button.success"], {
			__button_color_main: vars.color.success,
		}),
		rule(["button.info", ".button.info"], {
			__button_color_main: vars.color.info,
		}),
		rule(["button.warning", ".button.warning"], {
			__button_color_main: vars.color.warning,
		}),
		rule(["button.danger", ".button.danger"], {
			__button_color_main: vars.color.danger,
		}),
		rule(["button.shadow", ".button.shadow"], {
			box_shadow: `${vars.shadow.x} ${vars.shadow.y} ${vars.shadow.spread} ${vars.shadow.color}`,
		}),
		rule(["button.blank", ".button.blank"], {
			__button_color_main: `color-mix(in oklab, ${vars.color.text}, ${vars.color.pagea} 95%)`,
			__button_color_hover: `color-mix(in oklab, ${vars.color.text}, ${vars.color.pagea} 90%)`,
			__button_color_focus: `color-mix(in oklab, ${vars.color.text}, ${vars.color.pagea} 85%)`,
			__button_color_active: `color-mix(in oklab, ${vars.color.text}, ${vars.color.pagea} 80%)`,
			__button_color_text: `${vars.color.text}`,
			__button_bd: "transparent",
			__button_active_bd: "transparent",
			__button_hover_bd: "transparent",
			__button_focus_bd: "transparent",
			background: "transparent",
			box_shadow: "unset",
		}),
		rule(["button.outline", ".button.outline"], {
			__button_border_size: "2px",
			__button_bd: vars.button.color.main,
			__button_bg: `color-mix(in ${vars.color.blend}, ${vars.color.pagea}, ${vars.color.white} 25%)`,
			// Hover
			__button_hover_bd: vars.button.color.hover,
			__button_hover_bg: `color-mix(in ${vars.color.blend}, ${vars.color.pagea}, ${vars.color.white} 35%)`,
			// Focus
			__button_focus_bd: vars.button.color.focus,
			__button_focus_bg: `color-mix(in ${vars.color.blend}, ${vars.color.pagea}, ${vars.color.white} 45%)`,
			// Active
			__button_active_bd: vars.button.color.active,
			__button_active_bg: `color-mix(in ${vars.color.blend}, ${vars.color.pagea}, ${vars.color.white} 50%)`,
		}),

		rule(["button.icon", ".button.icon"], {
			__button_bg: "transparent",
			padding: "0px",
			min_width: "0px",
			width: "min-content",
			border_width: "0px",
		}),
		rule(mods(["button", ".button"], "focus"), {
			background_color: vars.button.focus.bg,
			color: vars.button.focus.fg,
			border_color: vars.button.focus.bd,
			outline_color: vars.button.focus.ot,
			outline_width: vars.button.outline.size,
		}),
		rule(mods(["button", ".button"], "hover"), {
			background_color: `${vars.button.hover.bg}`,
			color: `${vars.button.hover.fg}`,
			border_color: `${vars.button.hover.bd}`,
		}),
		rule(mods(["button", ".button"], "active"), {
			background_color: `${vars.button.active.bg}`,
			color: `${vars.button.active.fg}`,
			border_color: `${vars.button.active.bd}`,
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
	// ------------------------------------------------------------------------
	//
	// SELECTOR
	//
	// ------------------------------------------------------------------------
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
		// ====================================================================
		// LISTS & MENUS
		// ====================================================================
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
	// ------------------------------------------------------------------------
	//
	// INPUT
	//
	// ------------------------------------------------------------------------
	input: group(
		rule([".input", "input", "textarea"], {
			// Fonts
			__input_font_family: `${vars.font.controls.family}`,
			__input_font_line: `${vars.font.controls.line}`,
			__input_font_weight: `${vars.font.controls.weight}`,
			__input_font_size: `${vars.font.controls.size}`,
			__input_border_size: "1px",
			__input_outline_size: "2px",
			__input_color_text: vars.color.text,
			__input_color_main: vars.palette.neutral[3],
			__input_color_hover: `lch(from ${vars.input.color.main} clamp(0, calc(l - 10), 100) clamp(0, calc(c + 2), 150) clamp(0, calc(h - 2), 360))`,
			__input_color_active: `lch(from ${vars.input.color.main} clamp(0, calc(l - 20), 100) clamp(0, calc(c + 4), 150) clamp(0, calc(h - 4), 360))`,
			__input_gap: vars.gap[2],
			// Inactive (default)
			__input_fg: vars.input.color.text,
			__input_bg: vars.color.page,
			__input_bd: vars.input.color.main,
			__input_ot: vars.input.color.main,
			// Focus
			__input_focus_fg: vars.input.fg,
			__input_focus_bd: vars.input.bd,
			__input_focus_bg: vars.input.bg,
			__input_focus_ot: vars.input.ot,
			// Hover
			__input_hover_fg: vars.input.fg,
			__input_hover_bd: vars.input.color.hover,
			__input_hover_bg: vars.input.bg,
			__input_hover_ot: vars.input.ot,
			// Active
			__input_active_bd: vars.input.color.active,
			__input_active_bg: vars.input.bg,
			__input_active_fg: vars.input.fg,
			__input_active_ot: vars.input.ot,
			// Parametric styling
			border: `${vars.input.border.size} solid ${vars.input.bd}`,
			background: `${vars.input.bg}`,
			color: `${vars.input.fg}`,
			font_family: vars.input.font.family,
			line_height: vars.input.font.line,
			font_size: vars.input.font.size,
			font_weight: vars.input.font.weight,
			gap: `${vars.input.gap}`,
			// Static styling
			outline: `0px solid ${vars.input.ot}`,
			display: "inline-flex",
			flex_wrap: "nowrap",
			align_items: "center",
			padding: "0.5em 0.5em",
			box_sizing: "border-box",
			transition_property:
				"border-width,border-color,background,color,transform,box-shadow,outline-width,outline-color",
			transition_duration: "0.1s",
		}),
		rule([".textarea", "textarea"], {
			width: "100%",
			field_sizing: "content",
			resize: "none",
		}),
		rule(mods(["input", ".input", "textarea", ".textarea"], "focus"), {
			background_color: vars.input.focus.bg,
			color: vars.input.focus.fg,
			border_color: vars.input.focus.bd,
			outline_color: vars.input.focus.ot,
			outline_width: vars.input.outline.size,
		}),
		rule(mods(["button", ".button"], "hover"), {
			background_color: vars.button.hover.bg,
			color: vars.button.hover.fg,
			border_color: vars.button.hover.bd,
		}),
		rule(mods(["button", ".button"], "active"), {
			background_color: vars.button.active.bg,
			color: vars.button.active.fg,
			border_color: vars.button.active.bd,
		}),
		rule(cross(["input", ".input", "textarea", ".textarea"], ".missing"), {
			__input_color_main: vars.color.error,
			__input_fg: vars.input.color.text,
		}),
		rule(cross(["input", ".input", "textarea", ".textarea"], ".success"), {
			__input_color_main: vars.color.success,
			__input_color_text: `color-mix(in oklab, ${vars.color.success}, ${vars.color.text} 20%)`,
			__input_bg: `color-mix(in oklab, ${vars.color.success}, ${vars.color.pagea} 95%)`,
			__input_fg: vars.input.color.text,
		}),
		rule(cross(["input", ".input", "textarea", ".textarea"], ".warning"), {
			__input_color_main: vars.color.warning,
			__input_color_text: `color-mix(in oklab, ${vars.color.warning}, ${vars.color.text} 20%)`,
			__input_bg: `color-mix(in oklab, ${vars.color.warning}, ${vars.color.pagea} 95%)`,
			__input_fg: vars.input.color.text,
		}),
		rule(cross(["input", ".input", "textarea", ".textarea"], ".error"), {
			__input_color_main: vars.color.error,
			__input_color_text: `color-mix(in oklab, ${vars.color.error}, ${vars.color.text} 20%)`,
			__input_bg: `color-mix(in oklab, ${vars.color.error}, ${vars.color.pagea} 95%)`,
			__input_fg: vars.input.color.text,
		}),
		rule(
			[
				"input.blank",
				".input.blank",
				"textarea.blank",
				".textarea.blank",
			],
			{
				__input_color_main: `color-mix(in oklab, ${vars.color.text}, ${vars.color.pagea} 95%)`,
				__input_color_hover: `color-mix(in oklab, ${vars.color.text}, ${vars.color.pagea} 90%)`,
				__input_color_focus: `color-mix(in oklab, ${vars.color.text}, ${vars.color.pagea} 85%)`,
				__input_color_active: `color-mix(in oklab, ${vars.color.text}, ${vars.color.pagea} 80%)`,
				__input_color_text: `${vars.color.text}`,
				__input_bd: "transparent",
				__input_active_bd: "transparent",
				__input_hover_bd: "transparent",
				__input_focus_bd: "transparent",
				background: "transparent",
				box_shadow: "unset",
			}
		),
		rule(mods(["input", ".input", "textarea", ".textarea"], "disabled"), {
			opacity: 0.5,
			__input_focus_fg: vars.input.fg,
			__input_focus_bd: vars.input.bd,
			__input_focus_bg: vars.input.bg,
			__input_hover_bd: vars.input.bd,
			__input_hover_bg: vars.input.bg,
			__input_hover_ot: vars.input.ot,
			__input_hover_fg: vars.input.fg,
			__input_active_bd: vars.input.bd,
			__input_active_bg: vars.input.bg,
			__input_active_ot: vars.input.ot,
			__input_active_fg: vars.input.fg,
		}),
		// TODO: Checkbox
		// Overrides
		rule(mods([".noinput"], null, "focus", "active", "hover"), {
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
