import {
	cross,
	named,
	rule,
	group,
	vars,
	mods,
} from "../js/littlecss.js";

// ----------------------------------------------------------------------------
//
// CONTROLS
//
// ----------------------------------------------------------------------------
// All controls use the unified color system from tokens.js
// Colors are computed using the background/text/border/outline variables
// with their l/c/h/o and delta modifiers.
//
// State changes (hover, focus, active) are achieved through delta-l adjustments:
// - hover: delta-l = -1 (slightly darker)
// - active: delta-l = -2 (more darker)
// - focus: adds outline
// - selected: delta-l = -2, higher opacity

function hover(...args) {
	const res = [];
	for (const a of args) {
		res.push(`${a}:hover`);
		res.push(`${a}.hover`);
	}
	return res;
}

// Helper to compute color from base with L/C/H/O parameters
function colorFromBase(base, l = 5, c = 5, o = 9) {
	return `oklch(from ${base} calc(${l} / 9) calc(${c} / 9 * c * 2) h / calc(${o} / 9))`;
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
			transition_property:
				"background-color,color,border-color,outline-color,opacity",
			transition_duration: "150ms",
			// Use unified color system
			__background_base: vars.color.neutral,
			__background_l: 8,
			__background_c: 5,
			__background_o: 0, // transparent by default
			__background_delta_l: 0,
		}),
		rule(hover(".selectable"), {
			__background_o: 3,
			__background_delta_l: -1,
		}),
		rule(
			[
				".selectable:focus",
				".selectable:focus-within",
				".selectable.focus",
			],
			{
				__background_o: 2,
				outline: `2px solid ${vars.background.base}`,
				outline_offset: "1px",
			},
		),
		rule([".selectable.selected", ".selectable[data-selected=true]"], {
			__background_o: 5,
			__background_delta_l: -2,
		}),
		rule([".selectable:active", ".selectable.active"], {
			__background_o: 4,
			__background_delta_l: -2,
		}),
		rule([".selectable:disabled", ".selectable.disabled"], {
			opacity: 0.5,
			cursor: "not-allowed",
			pointer_events: "none",
		}),
		// Color variants
		rule(".selectable.primary", { __background_base: vars.color.primary }),
		rule(".selectable.secondary", { __background_base: vars.color.secondary }),
		rule(".selectable.tertiary", { __background_base: vars.color.tertiary }),
		rule(".selectable.success", { __background_base: vars.color.success }),
		rule(".selectable.info", { __background_base: vars.color.info }),
		rule(".selectable.warning", { __background_base: vars.color.warning }),
		rule(".selectable.danger", { __background_base: vars.color.danger }),
		// Size variants
		rule(".selectable.largest", { padding: vars.controls.padding.largest }),
		rule(".selectable.larger", { padding: vars.controls.padding.larger }),
		rule(".selectable.large", { padding: vars.controls.padding.large }),
		rule(".selectable.small", { padding: vars.controls.padding.small }),
		rule(".selectable.smaller", { padding: vars.controls.padding.smaller }),
		rule(".selectable.smallest", { padding: vars.controls.padding.smallest }),
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
			gap: vars.gap[2],
		}),
		rule(".pill", {
			// Use unified color system
			__background_base: vars.color.neutral,
			__background_l: 5,
			__background_c: 5,
			__background_o: 0, // transparent bg
			__border_base: vars.color.neutral,
			__border_l: 5,
			__border_c: 5,
			__border_o: 9,
			// Styling
			display: "inline-flex",
			cursor: "pointer",
			user_select: "none",
			border_width: vars.border.width[1],
			border_style: "solid",
			border_color: colorFromBase(vars.border.base, vars.border.l, vars.border.c, vars.border.o),
			background_color: colorFromBase(vars.background.base, vars.background.l, vars.background.c, vars.background.o),
			padding: `${vars.pad[0]} ${vars.pad[2]}`,
			transition_property: "color,border-color,background-color",
			transition_duration: "150ms",
			border_radius: "2lh",
		}),
		rule(hover(".pill"), {
			__background_o: 3,
			__background_delta_l: -1,
		}),
		rule([".pill.selected", ".pill[data-selected=true]"], {
			__background_o: 5,
			__background_delta_l: -2,
		}),
		rule([".pill:active", ".pill.active"], {
			__background_o: 4,
			__background_delta_l: -2,
		}),
		rule([".pill:disabled", ".pill.disabled"], {
			opacity: 0.5,
			cursor: "not-allowed",
		}),
		// Color variants
		rule(".pill.primary", {
			__background_base: vars.color.primary,
			__border_base: vars.color.primary,
		}),
		rule(".pill.secondary", {
			__background_base: vars.color.secondary,
			__border_base: vars.color.secondary,
		}),
		rule(".pill.tertiary", {
			__background_base: vars.color.tertiary,
			__border_base: vars.color.tertiary,
		}),
		rule(".pill.success", {
			__background_base: vars.color.success,
			__border_base: vars.color.success,
		}),
		rule(".pill.info", {
			__background_base: vars.color.info,
			__border_base: vars.color.info,
		}),
		rule(".pill.warning", {
			__background_base: vars.color.warning,
			__border_base: vars.color.warning,
		}),
		rule(".pill.danger", {
			__background_base: vars.color.danger,
			__border_base: vars.color.danger,
		}),
	),

	// ------------------------------------------------------------------------
	//
	// BUTTON
	//
	// ------------------------------------------------------------------------
	button: group(
		rule(["button", ".button"], {
			// Font settings
			__button_font_family: vars.font.controls.family,
			__button_font_line: vars.font.controls.line,
			__button_font_weight: vars.font.controls.weight,
			__button_font_size: vars.font.controls.size,
			// Use unified color system
			__background_base: vars.color.neutral,
			__background_l: 5,
			__background_c: 5,
			__background_o: 9,
			__background_delta_l: 0,
			__border_base: vars.color.neutral,
			__border_l: 4,
			__border_o: 9,
			__outline_base: vars.color.neutral,
			__outline_l: 5,
			__outline_o: 0,
			// Computed colors
			border_width: "1px",
			border_style: "solid",
			border_color: colorFromBase(vars.border.base, `(${vars.border.l} + ${vars.border.delta.l})`, vars.border.c, vars.border.o),
			outline_width: "0px",
			outline_style: "solid",
			outline_color: colorFromBase(vars.outline.base, vars.outline.l, vars.outline.c, vars.outline.o),
			background_color: colorFromBase(vars.background.base, `(${vars.background.l} + ${vars.background.delta.l})`, vars.background.c, vars.background.o),
			color: vars.color.text,
			// Typography
			font_family: vars.button.font.family,
			line_height: vars.button.font.line,
			height: vars.button.font.line,
			font_weight: vars.button.font.weight,
			font_size: vars.button.font.size,
			gap: vars.gap[2],
			// Layout
			cursor: "pointer",
			padding: vars.controls.padding.regular,
			box_sizing: "content-box",
			display: "inline-flex",
			align_items: "center",
			justify_content: "center",
			white_space: "nowrap",
			transition_property:
				"border-width,border-color,background,color,transform,box-shadow,outline-width,outline-color",
			transition_duration: "150ms",
		}),
		rule(["button.icon", ".button.icon"], {
			__background_o: 0,
			__border_o: 0,
			padding: "4px",
			min_width: "0px",
			width: "min-content",
		}),
		// Size variants
		rule(["button.largest", ".button.largest"], { padding: vars.controls.padding.largest }),
		rule(["button.larger", ".button.larger"], { padding: vars.controls.padding.larger }),
		rule(["button.large", ".button.large"], { padding: vars.controls.padding.large }),
		rule(["button.small", ".button.small"], { padding: vars.controls.padding.small }),
		rule(["button.smaller", ".button.smaller"], { padding: vars.controls.padding.smaller }),
		rule(["button.smallest", ".button.smallest"], { padding: vars.controls.padding.smallest }),
		// Color variants
		rule(["button.primary", ".button.primary"], {
			__background_base: vars.color.primary,
			__border_base: vars.color.primary,
		}),
		rule(["button.secondary", ".button.secondary"], {
			__background_base: vars.color.secondary,
			__border_base: vars.color.secondary,
		}),
		rule(["button.tertiary", ".button.tertiary"], {
			__background_base: vars.color.tertiary,
			__border_base: vars.color.tertiary,
		}),
		rule(["button.success", ".button.success"], {
			__background_base: vars.color.success,
			__border_base: vars.color.success,
		}),
		rule(["button.info", ".button.info"], {
			__background_base: vars.color.info,
			__border_base: vars.color.info,
		}),
		rule(["button.warning", ".button.warning"], {
			__background_base: vars.color.warning,
			__border_base: vars.color.warning,
		}),
		rule(["button.danger", ".button.danger"], {
			__background_base: vars.color.danger,
			__border_base: vars.color.danger,
		}),
		rule(["button.shadow", ".button.shadow"], {
			box_shadow: `${vars.shadow.x} ${vars.shadow.y} ${vars.shadow.spread} ${vars.shadow.color}`,
		}),
		rule(["button.blank", ".button.blank"], {
			__background_o: 0,
			__border_o: 0,
			__outline_o: 0,
		}),
		rule(["button.outline", ".button.outline"], {
			__background_o: 0,
			__border_o: 9,
			border_width: "2px",
		}),
		// State: focus
		rule(mods(["button", ".button"], "focus", "focus-within"), {
			__outline_o: 5,
			outline_width: "3px",
		}),
		// State: hover
		rule(hover("button", ".button"), {
			__background_delta_l: -1,
			__border_delta_l: -1,
		}),
		// State: active
		rule(mods(["button", ".button"], "active"), {
			__background_delta_l: -2,
			__border_delta_l: -2,
		}),
		// State: disabled
		rule(mods(["button", ".button"], "disabled"), {
			opacity: 0.5,
			cursor: "not-allowed",
			pointer_events: "none",
		}),
		rule(
			["button.square", ".button.square", "button.circle", ".button.circle"],
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
			// Font settings
			__selector_font_family: vars.font.controls.family,
			__selector_font_line: vars.font.controls.line,
			__selector_font_weight: vars.font.controls.weight,
			// Use unified color system
			__background_base: vars.color.neutral,
			__background_l: 5,
			__background_o: 0,
			__border_base: vars.color.neutral,
			__border_l: 5,
			__border_o: 9,
			// Container styling
			display: "inline-flex",
			gap: "0",
			flex_wrap: "nowrap",
		}),
		rule([".selector > li", ".selector > .item"], {
			// Styling
			border_width: "1px",
			border_style: "solid",
			border_color: colorFromBase(vars.border.base, vars.border.l, vars.border.c, vars.border.o),
			background_color: colorFromBase(vars.background.base, vars.background.l, vars.background.c, vars.background.o),
			font_family: vars.selector.font.family,
			line_height: vars.selector.font.line,
			font_weight: vars.selector.font.weight,
			// Layout
			display: "inline-flex",
			align_items: "center",
			justify_content: "center",
			white_space: "nowrap",
			padding: "0.35em 0.65em",
			cursor: "pointer",
			user_select: "none",
			box_sizing: "border-box",
			transition_property: "border-color,background,color",
			transition_duration: "150ms",
			margin_left: "-1px",
		}),
		rule([".selector > li:first-child", ".selector > .item:first-child"], {
			margin_left: "0",
			border_top_left_radius: vars.border.radius[3],
			border_bottom_left_radius: vars.border.radius[3],
		}),
		rule([".selector > li:last-child", ".selector > .item:last-child"], {
			border_top_right_radius: vars.border.radius[3],
			border_bottom_right_radius: vars.border.radius[3],
		}),
		rule(hover(".selector > li", ".selector > .item"), {
			__background_o: 5,
			__background_delta_l: -1,
			z_index: "1",
		}),
		rule(
			mods([".selector > li", ".selector > .item"], "focus", "focus-within"),
			{
				__background_o: 4,
				outline: `2px solid ${vars.background.base}`,
				outline_offset: "-2px",
				z_index: "1",
			},
		),
		rule(
			[
				".selector > li.selected",
				".selector > .item.selected",
				".selector > li[data-selected=true]",
				".selector > .item[data-selected=true]",
			],
			{
				__background_o: 9,
				__background_delta_l: 0,
				color: vars.color.white,
				z_index: "2",
			},
		),
		rule(mods([".selector > li", ".selector > .item"], "active"), {
			__background_o: 7,
			__background_delta_l: -2,
		}),
		// Color variants
		rule(".selector.primary", {
			__background_base: vars.color.primary,
			__border_base: vars.color.primary,
		}),
		rule(".selector.secondary", {
			__background_base: vars.color.secondary,
			__border_base: vars.color.secondary,
		}),
		rule(".selector.tertiary", {
			__background_base: vars.color.tertiary,
			__border_base: vars.color.tertiary,
		}),
		rule(".selector.success", {
			__background_base: vars.color.success,
			__border_base: vars.color.success,
		}),
		rule(".selector.info", {
			__background_base: vars.color.info,
			__border_base: vars.color.info,
		}),
		rule(".selector.warning", {
			__background_base: vars.color.warning,
			__border_base: vars.color.warning,
		}),
		rule(".selector.danger", {
			__background_base: vars.color.danger,
			__border_base: vars.color.danger,
		}),
		// Style variants
		rule(".selector.pills", { gap: vars.gap[1] }),
		rule([".selector.pills > li", ".selector.pills > .item"], {
			border_radius: "2lh",
			margin_left: "0",
		}),
		// Disabled state
		rule(mods([".selector > li", ".selector > .item"], "disabled"), {
			opacity: 0.5,
			cursor: "not-allowed",
		}),
		// Size variants
		rule([".selector.largest > li", ".selector.largest > .item"], {
			padding: vars.controls.padding.largest,
		}),
		rule([".selector.larger > li", ".selector.larger > .item"], {
			padding: vars.controls.padding.larger,
		}),
		rule([".selector.large > li", ".selector.large > .item"], {
			padding: vars.controls.padding.large,
		}),
		rule([".selector.small > li", ".selector.small > .item"], {
			padding: vars.controls.padding.small,
		}),
		rule([".selector.smaller > li", ".selector.smaller > .item"], {
			padding: vars.controls.padding.smaller,
		}),
		rule([".selector.smallest > li", ".selector.smallest > .item"], {
			padding: vars.controls.padding.smallest,
		}),
	),

	// ------------------------------------------------------------------------
	//
	// INPUT
	//
	// ------------------------------------------------------------------------
	input: group(
		rule([".input", "input", "textarea", ".textarea"], {
			// Font settings
			__input_font_family: vars.font.controls.family,
			__input_font_line: vars.font.controls.line,
			__input_font_weight: vars.font.controls.weight,
			__input_font_size: vars.font.controls.size,
			// Use unified color system
			__background_base: vars.color.white,
			__background_l: 9,
			__background_c: 0,
			__background_o: 3,
			__background_delta_l: 0,
			__border_base: vars.color.neutral,
			__border_l: 4,
			__border_o: 9,
			__border_delta_l: 0,
			__outline_base: vars.color.neutral,
			__outline_l: 5,
			__outline_o: 0,
			// Computed styling
			border_width: "1px",
			border_style: "solid",
			border_color: colorFromBase(vars.border.base, `(${vars.border.l} + ${vars.border.delta.l})`, vars.border.c, vars.border.o),
			outline_width: "0px",
			outline_style: "solid",
			outline_color: colorFromBase(vars.outline.base, vars.outline.l, vars.outline.c, vars.outline.o),
			background_color: colorFromBase(vars.background.base, `(${vars.background.l} + ${vars.background.delta.l})`, vars.background.c, vars.background.o),
			color: vars.color.text,
			// Typography
			font_family: vars.input.font.family,
			line_height: vars.input.font.line,
			height: vars.input.font.line,
			font_weight: vars.input.font.weight,
			font_size: vars.input.font.size,
			gap: vars.gap[2],
			// Layout
			display: "inline-flex",
			flex_wrap: "nowrap",
			white_space: "nowrap",
			align_items: "center",
			padding: vars.controls.padding.regular,
			box_sizing: "content-box",
			transition_property:
				"border-width,border-color,background,color,transform,box-shadow,outline-width,outline-color",
			transition_duration: "150ms",
		}),
		rule([".textarea", "textarea"], {
			width: "100%",
			field_sizing: "content",
			resize: "none",
		}),
		// Size variants
		rule(
			["input.largest", ".input.largest", "textarea.largest", ".textarea.largest"],
			{ padding: vars.controls.padding.largest },
		),
		rule(
			["input.larger", ".input.larger", "textarea.larger", ".textarea.larger"],
			{ padding: vars.controls.padding.larger, font_size: vars.controls.size.larger },
		),
		rule(
			["input.large", ".input.large", "textarea.large", ".textarea.large"],
			{ padding: vars.controls.padding.large, font_size: vars.controls.size.large },
		),
		rule(
			["input.small", ".input.small", "textarea.small", ".textarea.small"],
			{ padding: vars.controls.padding.small, font_size: vars.controls.size.small },
		),
		rule(
			["input.smaller", ".input.smaller", "textarea.smaller", ".textarea.smaller"],
			{ padding: vars.controls.padding.smaller, font_size: vars.controls.size.smaller },
		),
		rule(
			["input.smallest", ".input.smallest", "textarea.smallest", ".textarea.smallest"],
			{ padding: vars.controls.padding.smallest, font_size: vars.controls.size.smallest },
		),
		// State: focus
		rule(
			mods(["input", ".input", "textarea", ".textarea"], "focus", "focus-within"),
			{
				__outline_o: 2,
				outline_width: "3px",
			},
		),
		// State: hover
		rule(hover("input", ".input", "textarea", ".textarea"), {
			__border_delta_l: -1,
		}),
		// State: active
		rule(mods(["input", ".input", "textarea", ".textarea"], "active"), {
			__border_delta_l: -2,
		}),
		// State: disabled
		rule(mods(["input", ".input", "textarea", ".textarea"], "disabled"), {
			opacity: 0.5,
			cursor: "not-allowed",
		}),
		// Validation states
		rule(cross(["input", ".input", "textarea", ".textarea"], ".success"), {
			__border_base: vars.color.success,
			__background_base: vars.color.success,
			__background_l: 9,
			__background_o: 1,
		}),
		rule(cross(["input", ".input", "textarea", ".textarea"], ".warning"), {
			__border_base: vars.color.warning,
			__background_base: vars.color.warning,
			__background_l: 9,
			__background_o: 1,
		}),
		rule(cross(["input", ".input", "textarea", ".textarea"], ".error"), {
			__border_base: vars.color.danger,
			__background_base: vars.color.danger,
			__background_l: 9,
			__background_o: 1,
		}),
		rule(cross(["input", ".input", "textarea", ".textarea"], ".missing"), {
			__border_base: vars.color.danger,
		}),
		// Blank style
		rule(
			["input.blank", ".input.blank", "textarea.blank", ".textarea.blank"],
			{
				__background_o: 0,
				__border_o: 0,
				__outline_o: 0,
			},
		),
		// No input styling
		rule(
			mods(
				["input.noinput", ".input.noinput", "textarea.noinput", ".textarea.noinput"],
				null, "focus", "focus-within", "active", "hover",
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
			["input.nopad", ".input.nopad", "textarea.nopad", ".textarea.nopad"],
			{ padding: "0em" },
		),
	),

	// ------------------------------------------------------------------------
	//
	// TOGGLE
	//
	// ------------------------------------------------------------------------
	toggle: group(
		rule(".toggle", {
			// Toggle track dimensions
			__toggle_track_width: "3em",
			__toggle_track_height: "1.5em",
			__toggle_track_border_radius: "1em",
			__toggle_track_border_width: "1px",
			// Toggle slider
			__toggle_slider_size: "calc(1.5em - 4px)",
			__toggle_slider_offset: "2px",
			// Use unified color system
			__background_base: vars.color.neutral,
			__background_l: 7,
			__background_c: 2,
			__background_o: 9,
			__border_base: vars.color.neutral,
			__border_l: 5,
			__border_o: 9,
			// Active color (when checked)
			__toggle_active_base: vars.color.primary,
			// Base styling
			display: "inline-block",
			position: "relative",
			width: vars.toggle.track.width,
			height: vars.toggle.track.height,
			background: colorFromBase(vars.background.base, vars.background.l, vars.background.c, vars.background.o),
			border: `${vars.toggle.track.border.width} solid ${colorFromBase(vars.border.base, vars.border.l, vars.border.c, vars.border.o)}`,
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
			background: vars.color.white,
			border_radius: "50%",
			box_shadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
			transition: "transform 0.2s ease",
			transform: "translateX(0)",
		}),
		rule(hover(".toggle"), {
			__background_delta_l: -1,
		}),
		rule(
			[
				".toggle.checked",
				".toggle[data-checked=true]",
				"input[type=checkbox]:checked + .toggle",
			],
			{
				__background_base: vars.toggle.active.base,
				__background_l: 5,
				__border_base: vars.toggle.active.base,
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
			},
		),
		// Color variants (for active state)
		rule(".toggle.primary", { __toggle_active_base: vars.color.primary }),
		rule(".toggle.secondary", { __toggle_active_base: vars.color.secondary }),
		rule(".toggle.success", { __toggle_active_base: vars.color.success }),
		rule(".toggle.warning", { __toggle_active_base: vars.color.warning }),
		rule(".toggle.danger", { __toggle_active_base: vars.color.danger }),
		// Disabled state
		rule([".toggle:disabled", ".toggle.disabled"], {
			opacity: 0.5,
			cursor: "not-allowed",
		}),
		// Size variants
		rule(".toggle.small", {
			__toggle_track_width: "2.5em",
			__toggle_track_height: "1.25em",
			__toggle_slider_size: "calc(1.25em - 4px)",
		}),
		rule(".toggle.large", {
			__toggle_track_width: "3.5em",
			__toggle_track_height: "1.75em",
			__toggle_slider_size: "calc(1.75em - 4px)",
		}),
	),
});
// EOF
