import {
	cross,
	named,
	dim,
	rule,
	group,
	vars,
	blended,
	blend,
	mods,
} from "../js/littlecss.js";

function hover(...args) {
	const res = [];
	for (const a of args) {
		res.push(`${a}:hover`);
		res.push(`${a}.hover`);
	}
	return res;
}

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
			transition_properties:
				"background-color,color,border-color,outline-color,opacity",
			transition_duration: "150ms",
			// NOTE: Should be same as button.icon
			__selectable_color_main: vars.color.background,
			__selectable_color_hover: `oklch(from ${vars.selectable.color.main} calc(l * 0.9) c h / 0.35)`,
			__selectable_color_active: `oklch(from ${vars.selectable.color.main} calc(l * 0.9) c h / 0.45)`,
			__selectable_color_selected: `oklch(from ${vars.selectable.color.main} calc(l * 0.9) c h / 0.55)`,
		}),
		rule(hover(".selectable"), {
			background_color: vars.selectable.color.hover,
		}),
		rule([".selectable.selected", ".selectable[data-selected=true]"], {
			background_color: vars.selectable.color.selected,
		}),
		rule([".selectable:active", ".selectable.active"], {
			background_color: vars.selectable.color.active,
		}),
	),
	resizable: group(
		rule(".resize-h", {
			cursor: "col-resize",
			user_select: "none",
		}),
	),
	action: group(
		rule(".action", {
			cursor: "pointer",
			user_select: "none",
		}),
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
			// TODO: Redo these following buttons
			__pill_inactive_bd: vars.color.neutral,
			__pill_inactive_bg: vars.color.neutral,
			__pill_active_bd: vars.border.color,
			__pill_active_bg: vars.color.neutral,
			display: "inline-flex",
			cursor: "pointer",
			border: `${vars.border.width} solid ${vars.color.pill.bd}`,
			padding: `${vars.pad[0]} ${vars.pad[2]}`,
			transition_properties: "color,border-color,background-color",
			transition_duration: "150ms",
			border_radius: `2lh`,
			background_color: `color-mix(in oklab, ${vars.pill.inactive.bg} 0%, ${vars.color.page})`,
		}),
		rule(hover(".pill"), {
			background_color: `color-mix(in oklab, ${vars.pill.inactive.bg} 50%, ${vars.color.page})`,
		}),
		rule(".pill.selected", {
			background_color: `color-mix(in oklab, ${vars.pill.active.bg} 100%, ${vars.color.page})`,
		}),
		rule(".pill.transparent", {
			background_color: "transparent",
		}),
		rule(hover(".pill.transparent"), {
			background_color: `color-mix(in oklab, ${vars.pill.active.bg} 5%, ${vars.color.page})`,
		}),
		rule(".pill.transparent.selected", {
			background_color: `color-mix(in oklab, ${vars.pill.active.bg} 15%, ${vars.color.page})`,
		}),
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
			__button_outline_size: "3px",
			// Buttons define a main color, and derive the colors automatically
			// from the main color
			__button_color_text: vars.color.text,
			__button_color_main: blend(vars.color.low, vars.color.pagea, 0.25),
			__button_color_hover: blend(
				vars.button.color.main,
				vars.color.high,
				0.2,
			),
			__button_color_focus: blend(
				vars.button.color.main,
				vars.color.high,
				0.1,
			),
			__button_color_active: blend(
				vars.button.color.main,
				vars.color.high,
				0.1,
			),

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
			__button_padding: vars.button.padding,
			__gap: vars.gap[2],
			// Parametric Styling
			border: `${vars.button.border.size} solid ${vars.button.bd}`,
			outline: `0px solid ${vars.button.ot}`,
			background: `${vars.button.bg}`,
			color: `${vars.button.fg}`,
			font_family: vars.button.font.family,
			line_height: vars.button.font.line,
			height: vars.button.font.line,
			font_weight: vars.button.font.weight,
			font_size: vars.button.font.size,
			gap: vars.gap,
			// Fixed styling
			cursor: "pointer",
			padding: vars.controls.padding.regular,
			box_sizing: "content-box", // Content-box to align with inputs
			display: "inline-flex",
			align_items: "center",
			justify_content: "center",
			white_space: "nowrap",
			transition_property:
				"border-width,border-color,background,color,transform,box-shadow,outline-width,outline-color",
			transition_duration: "0.1s",
		}),
		rule(["button.icon", ".button.icon"], {
			__button_color_main: vars.color.background,
			__button_bg: "transparent",
			__button_ot: "transparent",
			__button_focus_ot: "transparent",
			// NOTE: Same factors as selectable
			__button_hover_bg: `oklch(from ${vars.button.color.main} calc(l * 0.9) c h / 0.35)`,
			__button_active_bg: `oklch(from ${vars.button.color.main} calc(l * 0.8) c h / 0.45)`,
			__button_active_ot: `oklch(from ${vars.button.color.main} calc(l * 0.8) c h / 0.15)`,
			__padding: "4px",
			padding: vars.padding,
			min_width: "0px",
			width: "min-content",
			border_width: "0px",
		}),
		rule(["button.largest", ".button.largest"], {
			padding: vars.controls.padding.largest,
		}),
		rule(["button.larger", ".button.larger"], {
			padding: vars.controls.padding.larger,
		}),
		rule(["button.large", ".button.large"], {
			padding: vars.controls.padding.large,
		}),
		rule(["button.small", ".button.small"], {
			padding: vars.controls.padding.small,
		}),
		rule(["button.smaller", ".button.smaller"], {
			padding: vars.controls.padding.smaller,
		}),
		rule(["button.smallest", ".button.smallest"], {
			padding: vars.controls.padding.smallest,
		}),
		rule(["button.default", ".button.default"], {
			__button_outline_size: "3px",
			outline_width: vars.button.outline.size,
			outline_color: `color-mix(in oklab, ${vars.button.color.main}, ${vars.color.lowa} 10%)`,
		}),
		rule(["button.primary", ".button.primary"], {
			__button_color_main: vars.color.primary,
			__button_color_text: `color-mix(in oklab, ${vars.button.color.main}, ${vars.color.text} 30%)`,
		}),
		rule(["button.secondary", ".button.secondary"], {
			__button_color_main: vars.color.secondary,
			__button_color_text: `color-mix(in oklab, ${vars.button.color.main}, ${vars.color.text} 30%)`,
		}),
		rule(["button.tertiary", ".button.tertiary"], {
			__button_color_main: vars.color.tertiary,
			__button_color_text: `color-mix(in oklab, ${vars.button.color.main}, ${vars.color.text} 30%)`,
		}),
		rule(["button.success", ".button.success"], {
			// We need a bit more contrast here
			__button_color_main: `color-mix(in oklab, ${vars.color.success}, ${vars.color.pagea} 20%)`,
			__button_color_text: `color-mix(in oklab, ${vars.button.color.main}, ${vars.color.text} 60%)`,
		}),
		rule(["button.info", ".button.info"], {
			__button_color_main: vars.color.info,
			__button_color_text: `color-mix(in oklab, ${vars.button.color.main}, ${vars.color.text} 30%)`,
		}),
		rule(["button.warning", ".button.warning"], {
			__button_color_main: vars.color.warning,
			__button_color_text: `color-mix(in oklab, ${vars.button.color.main}, ${vars.color.text} 30%)`,
		}),
		rule(["button.danger", ".button.danger"], {
			__button_color_main: vars.color.danger,
			__button_color_text: `color-mix(in oklab, ${vars.button.color.main}, ${vars.color.text} 30%)`,
		}),
		rule(["button.transparent", ".button.transparent"], {
			__button_color_main: vars.color.transparent,
			__button_color_text: vars.color.text,
		}),
		rule(["button.shadow", ".button.shadow"], {
			box_shadow: `${vars.shadow.x} ${vars.shadow.y} ${vars.shadow.spread} ${vars.shadow.color}`,
		}),
		rule(["button.blank", ".button.blank"], {
			__button_color_main: `color-mix(in oklab, ${vars.button.color.text}, ${vars.color.pagea} 95%)`,
			__button_color_hover: `color-mix(in oklab, ${vars.button.color.main}, ${vars.color.pagea} 90%)`,
			__button_color_focus: `color-mix(in oklab, ${vars.button.color.main}, ${vars.color.pagea} 85%)`,
			__button_color_active: `color-mix(in oklab, ${vars.button.color.main}, ${vars.color.pagea} 80%)`,
			__button_color_text: `${vars.color.text}`,
			__button_bd: "transparent",
			__button_active_bd: "transparent",
			__button_hover_bd: "transparent",
			__button_focus_bd: "transparent",
			__button_active_ot: "transparent",
			__button_hover_ot: "transparent",
			__button_focus_ot: "transparent",
			__button_outline_size: "0px",
			background: "transparent",
			box_shadow: "unset",
		}),
		rule(["button.outline", ".button.outline"], {
			__button_border_size: "2px",
			__button_outline_size: "2px",
			__button_bd: vars.button.color.main,
			__button_ot: `color-mix(in oklab, ${vars.button.color.main}, ${vars.color.pagea} 50%)`,
			__button_bg: `color-mix(in ${vars.color.blend}, ${vars.color.pagea}, ${vars.color.white} 25%)`,
			// Hover
			__button_hover_bd: vars.button.color.hover,
			__button_hover_ot: `color-mix(in oklab, ${vars.button.color.hover}, ${vars.color.pagea} 50%)`,
			__button_hover_bg: `color-mix(in ${vars.color.blend}, ${vars.color.pagea}, ${vars.color.white} 35%)`,
			// Focus
			__button_focus_bd: vars.button.color.focus,
			__button_focus_ot: `color-mix(in oklab, ${vars.button.color.focus}, ${vars.color.pagea} 50%)`,
			__button_focus_bg: `color-mix(in ${vars.color.blend}, ${vars.color.pagea}, ${vars.color.white} 45%)`,
			// Active
			__button_active_bd: vars.button.color.active,
			__button_active_ot: `color-mix(in oklab, ${vars.button.color.active}, ${vars.color.pagea} 50%)`,
			__button_active_bg: `color-mix(in ${vars.color.blend}, ${vars.color.pagea}, ${vars.color.white} 50%)`,
		}),

		rule(mods(["button", ".button"], "focus", "focus-within"), {
			background_color: vars.button.focus.bg,
			color: vars.button.focus.fg,
			border_color: vars.button.focus.bd,
			outline_color: vars.button.focus.ot,
			outline_width: vars.button.outline.size,
		}),
		rule(hover("button", ".button"), {
			background_color: vars.button.hover.bg,
			color: vars.button.hover.fg,
			border_color: vars.button.hover.bd,
			outline_color: vars.button.hover.ot,
		}),
		rule(mods(["button", ".button"], "active"), {
			background_color: vars.button.active.bg,
			color: vars.button.active.fg,
			border_color: vars.button.active.bd,
			outline_color: vars.button.active.ot,
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
			},
		),
	),
	// ------------------------------------------------------------------------
	//
	// SELECTOR
	//
	// ------------------------------------------------------------------------
	selector: group(
		rule(".selector", {
			// Fonts
			__selector_font_family: `${vars.font.controls.family}`,
			__selector_font_line: `${vars.font.controls.line}`,
			__selector_font_weight: `${vars.font.controls.weight}`,
			__selector_border_size: "1px",
			__selector_border_radius: vars.border.radius,

			// Define main color and derive others automatically
			__selector_color_text: vars.color.text,
			__selector_color_main: vars.background.color,
			__selector_color_hover: blend(
				vars.selector.color.main,
				vars.color.low,
				0.1,
			),
			__selector_color_active: blend(
				vars.selector.color.main,
				vars.color.low,
				0.15,
			),

			// Default (unselected) - transparent background
			__selector_bd: vars.selector.color.main,
			__selector_bg: "transparent",
			__selector_fg: vars.selector.color.text,

			// Hover
			__selector_hover_bd: vars.selector.color.hover,
			__selector_hover_bg: vars.selector.color.hover,
			__selector_hover_fg: vars.selector.fg,

			// Selected
			__selector_selected_bd: vars.selector.color.main,
			__selector_selected_bg: vars.selector.color.main,
			__selector_selected_fg: vars.color.page,

			// Active
			__selector_active_bd: vars.selector.color.active,
			__selector_active_bg: vars.selector.color.active,
			__selector_active_fg: vars.color.page,

			// Container styling
			display: "inline-flex",
			gap: "0",
			flex_wrap: "nowrap",
		}),

		rule([".selector > li", ".selector > .item"], {
			// Parametric styling
			border: `${vars.selector.border.size} solid ${vars.selector.bd}`,
			background: `${vars.selector.bg}`,
			color: `${vars.selector.fg}`,
			font_family: vars.selector.font.family,
			line_height: vars.selector.font.line,
			font_weight: vars.selector.font.weight,
			font_size: vars.selector.font.size,

			// Fixed styling
			display: "inline-flex",
			align_items: "center",
			justify_content: "center",
			white_space: "nowrap",
			padding: "0.35em 0.65em",
			cursor: "pointer",
			user_select: "none",
			box_sizing: "border-box",
			transition_property: "border-color,background,color",
			transition_duration: "0.15s",
			margin_left: "-1px",
		}),

		rule([".selector > li:first-child", ".selector > .item:first-child"], {
			margin_left: "0",
		}),

		rule(hover(".selector > li", ".selector > .item"), {
			background_color: vars.selector.hover.bg,
			color: vars.selector.hover.fg,
			border_color: vars.selector.hover.bd,
			z_index: "1",
		}),

		rule(
			[
				".selector > li.selected",
				".selector > .item.selected",
				".selector > li[data-selected=true]",
				".selector > .item[data-selected=true]",
			],
			{
				background_color: vars.selector.selected.bg,
				color: vars.selector.selected.fg,
				border_color: vars.selector.selected.bd,
				z_index: "2",
			},
		),

		rule(mods([".selector > li", ".selector > .item"], "active"), {
			background_color: vars.selector.active.bg,
			color: vars.selector.active.fg,
			border_color: vars.selector.active.bd,
		}),

		// Color variants - just override the main color like buttons do
		rule([".selector.primary"], {
			__selector_color_main: vars.color.primary,
		}),
		rule([".selector.secondary"], {
			__selector_color_main: vars.color.secondary,
		}),
		rule([".selector.tertiary"], {
			__selector_color_main: vars.color.tertiary,
		}),
		rule([".selector.success"], {
			__selector_color_main: vars.color.success,
		}),
		rule([".selector.info"], {
			__selector_color_main: vars.color.info,
		}),
		rule([".selector.warning"], {
			__selector_color_main: vars.color.warning,
		}),
		rule([".selector.danger"], {
			__selector_color_main: vars.color.danger,
		}),

		// Style variants
		rule([".selector.pills"], {
			gap: `${vars.gap[1]}`,
		}),
		rule([".selector.pills > li", ".selector.pills > .item"], {
			border_radius: "2lh",
			margin_left: "0",
		}),

		rule([".selector > li:first-child", ".selector > .item:first-child"], {
			border_top_left_radius: vars.selector.border.radius,
			border_bottom_left_radius: vars.selector.border.radius,
		}),
		rule([".selector > li:last-child", ".selector > .item:last-child"], {
			border_top_right_radius: vars.selector.border.radius,
			border_bottom_right_radius: vars.selector.border.radius,
		}),

		// Disabled state
		rule(mods([".selector > li", ".selector > .item"], "disabled"), {
			opacity: 0.5,
			cursor: "not-allowed",
		}),
	),
	// ------------------------------------------------------------------------
	//
	// TOGGLE
	//
	// INPUT
	//
	// ------------------------------------------------------------------------
	input: group(
		rule([".input", "input", "textarea", ".textarea"], {
			// Fonts
			__input_font_family: `${vars.font.controls.family}`,
			__input_font_line: `${vars.font.controls.line}`,
			__input_font_weight: `${vars.font.controls.weight}`,
			__input_font_size: `${vars.font.controls.size}`,
			__input_border_size: "1px",
			__input_outline_size: "3px",
			__input_color_text: vars.color.text,
			__input_color_main: blend(
				vars.color.low,
				vars.color.background,
				0.25,
			),
			__input_color_hover: blend(
				vars.input.color.main,
				vars.color.high,
				0.2,
			),
			__input_color_focus: blend(
				vars.input.color.main,
				vars.color.high,
				0.1,
			),
			__input_color_active: blend(
				vars.input.color.main,
				vars.color.high,
				0.1,
			),
			__input_gap: vars.gap[2],
			// Inactive (default)
			__input_fg: vars.input.text.color,
			__input_bg: blend(vars.color.high, vars.color.background, 0.25),
			__input_bd: vars.input.border.color,
			__input_ot: blend(
				vars.color.low,
				vars.color.background,
				0.25,
				0.15,
			),
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
			height: vars.input.font.line, // Need as inputs ignore line-height
			font_weight: vars.input.font.weight,
			font_size: vars.input.font.size,
			gap: `${vars.input.gap}`,
			// Static styling
			outline: `0px solid ${vars.input.ot}`,
			display: "inline-flex",
			flex_wrap: "nowrap",
			white_space: "nowrap",
			align_items: "center",
			padding: vars.controls.padding.regular,
			// NOTE: Content-box here as line-height does not include padding
			box_sizing: "content-box",
			transition_property:
				"border-width,border-color,background,color,transform,box-shadow,outline-width,outline-color",
			transition_duration: "0.1s",
		}),
		rule(cross(["input", ".input", "textarea", ".textarea"], ".bg"), {
			__input_bg: vars.color.bg,
		}),
		rule([".textarea", "textarea"], {
			width: "100%",
			field_sizing: "content", // FIXME: This does not seem to work
			resize: "none",
		}),
		rule(
			[
				"input.largest",
				".input.largest",
				"textarea.largest",
				".textarea.largest",
			],
			{
				padding: vars.controls.padding.largest,
			},
		),
		rule(
			[
				"input.larger",
				".input.larger",
				"textarea.larger",
				".textarea.larger",
			],
			{
				padding: vars.controls.padding.larger,
				font_size: vars.controls.size.larger,
			},
		),
		rule(
			[
				"input.large",
				".input.large",
				"textarea.large",
				".textarea.large",
			],
			{
				padding: vars.controls.padding.large,
				font_size: vars.controls.size.large,
			},
		),
		rule(
			[
				"input.small",
				".input.small",
				"textarea.small",
				".textarea.small",
			],
			{
				padding: vars.controls.padding.small,
				font_size: vars.controls.size.small,
			},
		),
		rule(
			[
				"input.smaller",
				".input.smaller",
				"textarea.smaller",
				".textarea.smaller",
			],
			{
				padding: vars.controls.padding.smaller,
				font_size: vars.controls.size.smaller,
			},
		),
		rule(
			[
				"input.smallest",
				".input.smallest",
				"textarea.smallest",
				".textarea.smallest",
			],
			{
				padding: vars.controls.padding.smallest,
				font_size: vars.controls.size.smallest,
			},
		),
		rule(
			mods(
				["input", ".input", "textarea", ".textarea"],
				"focus",
				"focus-within",
			),
			{
				background_color: vars.input.focus.bg,
				color: vars.input.focus.fg,
				border_color: vars.input.focus.bd,
				outline_color: vars.input.focus.ot,
				outline_width: vars.input.outline.size,
			},
		),
		rule(hover("input", ".input", "textarea", ".textarea"), {
			background_color: vars.input.hover.bg,
			color: vars.input.hover.fg,
			border_color: vars.input.hover.bd,
			outline_color: vars.input.hover.ot,
		}),
		rule(
			mods(
				["input", ".input", "textarea", ".textarea"],
				"focus",
				"focus-within",
			),
			{
				background_color: vars.input.focus.bg,
				color: vars.input.focus.fg,
				border_color: vars.input.focus.bd,
				outline_color: vars.input.focus.ot,
				outline_width: vars.input.outline.size,
			},
		),
		rule(mods(["input", ".input", "textarea", ".textarea"], "active"), {
			background_color: vars.input.active.bg,
			color: vars.input.active.fg,
			border_color: vars.input.active.bd,
			outline_color: vars.input.active.ot,
		}),
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
				__input_active_ot: "transparent",
				__input_hover_ot: "transparent",
				__input_focus_ot: "transparent",
				__input_outline_size: "0px",
				background: "transparent",
				box_shadow: "unset",
			},
		),

		// TODO: Checkbox
		// Overrides
		rule(
			mods(
				[
					"input.noinput",
					".input.noinput",
					"textarea.noinput",
					".textarea.noinput",
				],
				null,
				"focus",
				"focus-within",
				"active",
				"hover",
			),
			{
				background_color: "transparent",
				border_color: "transparent",
				outline: "none",
				min_width: "0px",
				padding: "0px",
			},
		),
		rule(
			[
				"input.nopad",
				".input.nopad",
				"textarea.nopad",
				".textarea.nopad",
			],
			{
				padding: "0em",
			},
		),
	),
	// ------------------------------------------------------------------------
	//
	// TOGGLE
	//
	// ------------------------------------------------------------------------
	toggle: group(
		rule(".toggle", {
			// Toggle track
			__toggle_track_width: "3em",
			__toggle_track_height: "1.5em",
			__toggle_track_border_radius: "1em",
			__toggle_track_border_width: "1px",

			// Toggle slider
			__toggle_slider_size: "calc(1.5em - 4px)",
			__toggle_slider_offset: "2px",

			// Colors - themeable like buttons
			__toggle_color_main: vars.color.neutral,
			__toggle_color_active: vars.color.primary,
			__toggle_color_hover: `lch(from ${vars.toggle.color.main} clamp(0, calc(l - 10), 100) clamp(0, calc(c + 2), 150) clamp(0, calc(h - 2), 360))`,

			// Inactive state
			__toggle_track_bg: `color-mix(in oklab, ${vars.toggle.color.main}, ${vars.color.page} 85%)`,
			__toggle_track_bd: vars.toggle.color.main,
			__toggle_slider_bg: vars.color.page,
			__toggle_slider_shadow: `0 1px 3px rgba(0, 0, 0, 0.3)`,

			// Active state
			__toggle_active_track_bg: vars.toggle.color.active,
			__toggle_active_track_bd: vars.toggle.color.active,
			__toggle_active_slider_bg: vars.color.page,

			// Base styling
			display: "inline-block",
			position: "relative",
			width: vars.toggle.track.width,
			height: vars.toggle.track.height,
			background: vars.toggle.track.bg,
			border: `${vars.toggle.track.border.width} solid ${vars.toggle.track.bd}`,
			border_radius: vars.toggle.track.border.radius,
			cursor: "pointer",
			user_select: "none",
			transition: "all 0.2s ease",
		}),

		rule(".toggle::before", {
			content: "''",
			position: "absolute",
			top: vars.toggle.slider.offset,
			left: vars.toggle.slider.offset,
			width: vars.toggle.slider.size,
			height: vars.toggle.slider.size,
			background: vars.toggle.slider.bg,
			border_radius: "50%",
			box_shadow: vars.toggle.slider.shadow,
			transition: "transform 0.2s ease",
			transform: "translateX(0)",
		}),

		rule(hover(".toggle"), {
			background: `color-mix(in oklab, ${vars.toggle.track.bg}, ${vars.toggle.color.hover} 15%)`,
		}),

		rule(
			[
				".toggle.checked",
				".toggle[data-checked=true]",
				"input[type=checkbox]:checked + .toggle",
			],
			{
				background: vars.toggle.active.track.bg,
				border_color: vars.toggle.active.track.bd,
			},
		),

		rule(
			[
				".toggle.checked::before",
				".toggle[data-checked=true]::before",
				"input[type=checkbox]:checked + .toggle::before",
			],
			{
				transform: `translateX(calc(${vars.toggle.track.width} - ${vars.toggle.slider.size} - ${vars.toggle.slider.offset} * 2))`,
				background: vars.toggle.active.slider.bg,
			},
		),

		// Color variants
		rule([".toggle.primary"], {
			__toggle_color_active: vars.color.primary,
		}),
		rule([".toggle.secondary"], {
			__toggle_color_active: vars.color.secondary,
		}),
		rule([".toggle.success"], {
			__toggle_color_active: vars.color.success,
		}),
		rule([".toggle.warning"], {
			__toggle_color_active: vars.color.warning,
		}),
		rule([".toggle.danger"], {
			__toggle_color_active: vars.color.danger,
		}),

		// Disabled state
		rule([".toggle:disabled", ".toggle.disabled"], {
			opacity: 0.5,
			cursor: "not-allowed",
		}),

		// Size variants
		rule([".toggle.small"], {
			__toggle_track_width: "2.5em",
			__toggle_track_height: "1.25em",
			__toggle_slider_size: "calc(1.25em - 4px)",
		}),
		rule([".toggle.large"], {
			__toggle_track_width: "3.5em",
			__toggle_track_height: "1.75em",
			__toggle_slider_size: "calc(1.75em - 4px)",
		}),
	),
});
// EOF
