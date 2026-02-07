import { cross, group, mods, named, rule, vars } from "../js/littlecss.js";

// ----------------------------------------------------------------------------
//
// CONTROLS
//
// ----------------------------------------------------------------------------

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
	// Selectable elements are wrapper/container interactive items that change
	// appearance on hover/focus/active/selected states. They use their own
	// namespaced variables (--selectable-*) to avoid affecting child elements.
	selectable: group(
		rule(".selectable", {
			cursor: "pointer",
			user_select: "none",
			transition_property:
				"background-color,color,border-color,outline-color,border-width,outline-width,opacity,transform,box-shadow",
			transition_duration: "150ms",
			__selectable_base: vars.color.ink,
			__selectable_tint: vars.color.paper,
			__selectable_outline_opacity: vars.controls.outline.opacity,
			__selectable_outline_width: vars.outline.width,
			__selectable_opacity: "0%",
			// selectable.shade, selectable.opacity defined in tokens
			__selectable_color: `color-mix(in oklch, var(--selectable-base), var(--selectable-tint) calc(100% - var(--selectable-shade)))`,
			background_color: `color-mix(in oklch, var(--selectable-color), transparent calc(100% - var(--selectable-opacity)))`,
			outline_color: `color-mix(in oklch, var(--selectable-color), transparent calc(100% - var(--selectable-outline-opacity)))`,
			outline_width: "0px",
		}),
		rule(hover(".selectable"), {
			__selectable_opacity: vars.selectable.hover.opacity,
		}),
		rule(
			[".selectable:focus", ".selectable:focus-within", ".selectable.focus"],
			{
				__selectable_outline_opacity: vars.selectable.active.opacity,
				outline_width: vars.selectable.outline.width,
			},
		),
		rule([".selectable.selected", ".selectable[data-selected=true]"], {
			__selectable_opacity: vars.selectable.selected.opacity,
		}),
		rule([".selectable:active", ".selectable.active"], {
			__selectable_opacity: vars.selectable.active.opacity,
		}),
		rule([".selectable:disabled", ".selectable.disabled"], {
			opacity: vars.selectable.disabled.opacity,
			cursor: "not-allowed",
			pointer_events: "none",
		}),
		// Color variants
		...[
			"primary",
			"secondary",
			"tertiary",
			"success",
			"info",
			"warning",
			"danger",
		].map((color) => {
			return rule(`.selectable.${color}`, {
				__selectable_base: vars.color,
			});
		}),
		// Size variants
		rule(".selectable.largest", { padding: vars.controls.padding.largest }),
		rule(".selectable.larger", { padding: vars.controls.padding.larger }),
		rule(".selectable.large", { padding: vars.controls.padding.large }),
		rule(".selectable.small", { padding: vars.controls.padding.small }),
		rule(".selectable.smaller", { padding: vars.controls.padding.smaller }),
		rule(".selectable.smallest", {
			padding: vars.controls.padding.smallest,
		}),
	),

	action: group(
		rule(".action", {
			cursor: "pointer",
			user_select: "none",
			transition_property:
				"background-color,color,border-color,outline-color,border-width,outline-width,opacity,transform,box-shadow",
			transition_duration: "150ms",
		}),
	),

	// ------------------------------------------------------------------------
	//
	// PILL
	//
	// ------------------------------------------------------------------------
	// Pill elements are small, rounded interactive tags/badges.
	pill: group(
		rule(".pills", {
			display: "inline-flex",
			flex_wrap: "wrap",
			gap: vars.gap[2],
		}),
		rule(".pill", {
			cursor: "pointer",
			user_select: "none",
			transition_property:
				"background-color,color,border-color,outline-color,border-width,outline-width,opacity,transform,box-shadow",
			transition_duration: "150ms",

			// Computed colors
			__pill_base: vars.color.ink,
			__pill_tint: vars.color.paper,
			__pill_color: `color-mix(in oklch, var(--pill-base), var(--pill-tint) calc(100% - var(--pill-shade)))`,
			background_color: `color-mix(in oklch, var(--pill-color), transparent calc(100% - var(--pill-opacity)))`,
			color: vars.color.ink,

			border_color: `color-mix(in oklch, var(--pill-color), transparent calc(100% - var(--pill-border-opacity)))`,
			border_width: vars.pill.border.width,
			border_style: "solid",

			outline_color: `color-mix(in oklch, var(--pill-color), transparent calc(100% - var(--pill-outline-opacity)))`,
			outline_width: "0px",
			outline_style: "solid",

			// Layout
			display: "inline-flex",
			padding: `${vars.pad[0]} ${vars.pad[2]}`,
			__border_radius: "2lh",
			border_radius: vars.border.radius,
		}),
		// State: hover
		rule(hover(".pill"), {
			__pill_shade: vars.pill.hover.shade,
		}),
		// State: selected
		rule([".pill.selected", ".pill[data-selected=true]"], {
			__pill_shade: vars.pill.selected.shade,
		}),
		// State: active
		rule([".pill:active", ".pill.active"], {
			__pill_shade: vars.pill.active.shade,
		}),
		rule(hover(".pill:not(.outline)"), {
			__pill_border_shade: vars.pill.hover.shade,
		}),
		// State: selected (filled)
		rule([".pill.selected", ".pill[data-selected=true]"], {
			__pill_shade: vars.pill.selected.shade,
		}),
		rule(
			[
				".pill:not(.outline).selected",
				".pill:not(.outline)[data-selected=true]",
			],
			{
				__pill_border_shade: vars.pill.selected.shade,
			},
		),
		// State: active
		rule([".pill:active", ".pill.active"], {
			__pill_shade: vars.pill.active.shade,
		}),
		rule([".pill:not(.outline):active", ".pill:not(.outline).active"], {
			__pill_border_shade: vars.pill.active.shade,
		}),
		// State: focus
		rule([".pill:focus", ".pill:focus-within", ".pill.focus"], {
			__pill_outline_opacity: vars.controls.active.delta,
			outline_width: vars.pill.outline.width,
		}),
		// State: disabled
		rule([".pill:disabled", ".pill.disabled"], {
			opacity: vars.controls.disabled.opacity,
			cursor: "not-allowed",
			pointer_events: "none",
		}),
		// Color variants
		...[
			"primary",
			"secondary",
			"tertiary",
			"success",
			"info",
			"warning",
			"danger",
		].map((color) =>
			rule(`.pill.${color}`, {
				__pill_base: vars.color[color],
			}),
		),
		// =====================================================================
		// OUTLINE
		// =====================================================================
		rule(".pill.outline", {
			__pill_opacity: "0%",
			__pill_border_opacity: "80%",
			__pill_shade: "100%",
			border_width: vars.border.width,
		}),
		rule(hover(".pill.outline"), {
			__pill_opacity: vars.selectable.hover.opacity,
		}),
		rule([".pill.outline.selected", ".pill.outline[data-selected=true]"], {
			__pill_opacity: vars.selectable.selected.opacity,
		}),
		rule([".pill.outline:active", ".pill.outline.active"], {
			__pill_opacity: vars.selectable.active.opacity,
		}),
	),

	// ------------------------------------------------------------------------
	//
	// BUTTON
	//
	// ------------------------------------------------------------------------
	button: group(
		rule(["button", ".button"], {
			cursor: "pointer",
			user_select: "none",
			transition_property:
				"background-color,color,border-color,outline-color,border-width,outline-width,opacity,transform,box-shadow",
			transition_duration: "150ms",

			// Font settings
			// Computed colors
			__button_current_color: `color-mix(in oklch, var(--button-base), var(--button-tint) calc(100% - var(--button-shade)))`,
			__button_current_border_color: `color-mix(in oklch, var(--button-base), var(--button-tint) calc(100% - var(--button-border-shade)))`,
			__button_curent_outline_color: `color-mix(in oklch, var(--button-base), var(--button-tint) calc(100% - var(--button-border-shade)))`,
			background_color: `color-mix(in oklch, var(--button-current-color), transparent calc(100% - var(--button-opacity)))`,
			// TODO: Color should be computed based on background
			color: vars.text.color,

			border_color: `color-mix(in oklch, var(--button-current-border-color), transparent calc(100% - var(--button-border-opacity)))`,
			border_width: vars.button.border.width,
			border_style: "solid",

			outline_color: `color-mix(in oklch, var(--button-current-outline-color), transparent calc(100% - var(--button-outline-opacity)))`,
			outline_width: "0px",
			outline_style: "solid",

			// Typography
			font_family: vars.button.font.family,
			line_height: vars.button.font.line,
			font_weight: vars.button.font.weight,
			font_size: vars.button.font.size,
			gap: vars.gap[2],
			// Layout
			padding: vars.controls.padding.regular,
			box_sizing: "border-box",
			display: "inline-flex",
			align_items: "center",
			justify_content: "center",
			white_space: "nowrap",
		}),
		rule(["button.icon", ".button.icon"], {
			padding: "4px",
			min_width: "0px",
			width: "min-content",
		}),
		// Size variants
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
		// Color variants
		...[
			"primary",
			"secondary",
			"tertiary",
			"success",
			"info",
			"warning",
			"danger",
		].map((color) =>
			rule([`button.${color}`, `.button.${color}`], {
				__button_base: vars.color[color],
			}),
		),
		rule(["button.shadow", ".button.shadow"], {
			box_shadow: `${vars.shadow.x} ${vars.shadow.y} ${vars.shadow.spread} ${vars.shadow.color}`,
		}),
		rule(["button.blank", ".button.blank"], {
			__button_opacity: "0%",
			__button_border_opacity: "0%",
			// We keep the outline and hover states
		}),
		// Outline style
		rule(["button.outline", ".button.outline"], {}),
		// =====================================================================
		// REGULAR
		// =====================================================================
		// State: focus
		rule(mods(["button", ".button"], "focus", "focus-within"), {
			__button_outline_opacity: vars.controls.active.delta,
			outline_width: vars.button.outline.width,
		}),
		// State: hover (filled)
		rule(hover("button", ".button"), {
			__button_shade: vars.button.hover.shade,
		}),
		// State: selected (filled)
		rule(mods(["button", ".button"], "selected"), {
			__button_shade: vars.button.selected.shade,
		}),
		// State: active
		rule(mods(["button", ".button"], "active"), {
			__button_shade: vars.button.active.shade,
		}),
		// State: disabled
		rule(mods(["button", ".button"], "disabled"), {
			opacity: vars.controls.disabled.opacity,
			cursor: "not-allowed",
			pointer_events: "none",
		}),
		// =====================================================================
		// OUTLINE
		// =====================================================================
		rule(["button.outline", ".button.outline"], {
			// FIXME: Should that be curent?
			__button_shade: vars.selectable.shade,
			__button_opacity: "0%",
			__button_border_opacity: "80%",
			__button_border_color: vars.button.current.color,
			__button_outline_color: vars.button.current.color,
			// TODO: Should be almost the same as text
			__button_shade: "100%",
			border_width: vars.border.width,
		}),
		rule(["button.outline.default", ".button.outline.default"], {
			border_width: `calc(1px + ${vars.border.width})`,
		}),
		rule(hover("button.outline", ".button.outline"), {
			// Same as selectable
			__button_opacity: vars.selectable.hover.opacity,
		}),
		rule(mods(["button.outline", ".button.outline"], "selected"), {
			__button_opacity: vars.selectable.selected.opacity,
		}),
		rule(mods(["button.outline", ".button.outline"], "active"), {
			__button_opacity: vars.selectable.active.opacity,
		}),

		// =====================================================================
		// ICONS
		// =====================================================================
		rule(["button.icon", ".button.icon"], {
			__button_shade: vars.selectable.shade,
			__button_opacity: "0%",
			__button_border_opacity: "0%",
		}),
		rule(hover("button.icon", ".button.icon"), {
			// Same as selectable
			__button_opacity: vars.selectable.hover.opacity,
		}),
		rule(mods(["button.icon", ".button.icon"], "selected"), {
			__button_opacity: vars.selectable.selected.opacity,
		}),
		rule(mods(["button.icon", ".button.icon"], "active"), {
			__button_opacity: vars.selectable.active.opacity,
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

			// Computed colors
			__selector_base: vars.color.ink,
			__selector_tint: vars.color.paper,
			__selector_color: `color-mix(in oklch, var(--selector-base), var(--selector-tint) calc(100% - var(--selector-shade)))`,
			__selector_border_color: `color-mix(in oklch, var(--selector-base), var(--selector-tint) calc(100% - var(--selector-border-shade)))`,
			__selector_outline_color: `color-mix(in oklch, var(--selector-base), var(--selector-tint) calc(100% - var(--selector-outline-shade)))`,

			// Container styling
			display: "inline-flex",
			gap: "0",
			flex_wrap: "nowrap",
		}),
		rule([".selector > li", ".selector > .item"], {
			cursor: "pointer",
			user_select: "none",
			transition_property:
				"background-color,color,border-color,outline-color,border-width,outline-width,opacity,transform,box-shadow",
			transition_duration: "150ms",

			// Colors
			background_color: `color-mix(in oklch, var(--selector-color), transparent calc(100% - var(--selector-opacity)))`,
			border_color: `color-mix(in oklch, var(--selector-border-color), transparent calc(100% - var(--selector-border-opacity)))`,
			outline_color: `color-mix(in oklch, var(--selector-outline-color), transparent calc(100% - var(--selector-outline-opacity)))`,
			color: vars.color.ink,

			border_width: vars.selector.border.width,
			border_style: "solid",
			outline_width: "0px",
			outline_style: "solid",

			// Typography & Layout
			font_family: vars.selector.font.family,
			line_height: vars.selector.font.line,
			font_weight: vars.selector.font.weight,
			display: "inline-flex",
			align_items: "center",
			justify_content: "center",
			white_space: "nowrap",
			padding: "0.35em 0.65em",
			box_sizing: "border-box",
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
		// State: hover
		rule(hover(".selector > li", ".selector > .item"), {
			__selector_opacity: vars.selector.hover.opacity,
			z_index: "1",
		}),
		// State: focus
		rule(
			mods([".selector > li", ".selector > .item"], "focus", "focus-within"),
			{
				__selector_outline_opacity: vars.controls.active.delta,
				outline_width: vars.selector.outline.width,
				outline_offset: "-2px",
				z_index: "1",
			},
		),
		// State: selected
		rule(
			[
				".selector > li.selected",
				".selector > .item.selected",
				".selector > li[data-selected=true]",
				".selector > .item[data-selected=true]",
			],
			{
				__selector_opacity: vars.selector.selected.opacity,
				z_index: "2",
			},
		),
		// State: active
		rule(mods([".selector > li", ".selector > .item"], "active"), {
			__selector_opacity: vars.selector.active.opacity,
		}),
		// State: disabled
		rule(mods([".selector > li", ".selector > .item"], "disabled"), {
			opacity: vars.controls.disabled.opacity,
			cursor: "not-allowed",
			pointer_events: "none",
		}),
		// Color variants
		...[
			"primary",
			"secondary",
			"tertiary",
			"success",
			"info",
			"warning",
			"danger",
		].map((color) =>
			rule(`.selector.${color}`, {
				__selector_base: vars.color[color],
			}),
		),
		// Border variant - enable visible borders
		rule(".selector.bd", {
			__selector_border_opacity: "80%",
		}),
		// Style variants
		rule(".selector.pills", { gap: vars.gap[1] }),
		rule([".selector.pills > li", ".selector.pills > .item"], {
			border_radius: "2lh",
			margin_left: "0",
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
			// Computed colors
			__border_color: vars.input.border.color,
			__text_color: vars.input.color,
			__input_current_color: `color-mix(in oklch, var(--input-base), var(--input-tint) calc(100% - var(--input-shade)))`,
			__input_current_border_color: `color-mix(in oklch, var(--border-color), var(--input-tint) calc(100% - var(--input-border-shade)))`,
			__input_current_outline_color: `color-mix(in oklch, var(--border-color), var(--input-tint) calc(100% - var(--input-outline-shade)))`,
			__input_current_outline_opacity: vars.input.outline.opacity,
			background_color: `color-mix(in oklch, var(--input-current-color), transparent calc(100% - var(--input-opacity)))`,

			color: vars.text.color,
			border_color: `color-mix(in oklch, var(--input-current-border-color), transparent calc(100% - var(--input-border-opacity)))`,
			border_width: vars.input.border.width,
			border_style: "solid",

			outline_color: `color-mix(in oklch, var(--input-current-outline-color), transparent calc(100% - var(--input-current-outline-opacity)))`,
			outline_width: "0px",
			outline_style: "solid",

			// Typography
			font_family: vars.input.font.family,
			line_height: vars.input.font.line,
			font_weight: vars.input.font.weight,
			font_size: vars.input.font.size,
			gap: vars.gap[2],
			// Layout
			display: "inline-flex",
			flex_wrap: "nowrap",
			white_space: "nowrap",
			align_items: "center",
			padding: vars.controls.padding.regular,
			box_sizing: "border-box",
			transition_property:
				"background-color,color,border-color,outline-color,border-width,outline-width,opacity,transform,box-shadow",
			transition_duration: "150ms",
		}),
		rule([".textarea", "textarea"], {
			width: "100%",
			field_sizing: "content",
			resize: "none",
		}),
		// State: hover
		rule(hover(".input", "input", ".textarea", "textarea"), {
			// FIXME: Not ideal, we should adjust the current
			__input_border_shade: "100%",
		}),
		// State: focus
		rule(
			mods(
				["input", ".input", "textarea", ".textarea"],
				"focus",
				"focus-within",
			),
			{
				__input_current_outline_opacity: "80%",
				outline_width: vars.input.outline.width,
			},
		),

		// Size variants
		rule(
			[
				"input.largest",
				".input.largest",
				"textarea.largest",
				".textarea.largest",
			],
			{ padding: vars.controls.padding.largest },
		),
		rule(
			["input.larger", ".input.larger", "textarea.larger", ".textarea.larger"],
			{
				padding: vars.controls.padding.larger,
				font_size: vars.controls.size.larger,
			},
		),
		rule(["input.large", ".input.large", "textarea.large", ".textarea.large"], {
			padding: vars.controls.padding.large,
			font_size: vars.controls.size.large,
		}),
		rule(["input.small", ".input.small", "textarea.small", ".textarea.small"], {
			padding: vars.controls.padding.small,
			font_size: vars.controls.size.small,
		}),
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
		// State: focus
		rule(
			mods(
				["input", ".input", "textarea", ".textarea"],
				"focus",
				"focus-within",
			),
			{
				__input_current_outline_opacity: vars.input.focus.outline.opacity,
				__input_opacity: vars.input.focus.opacity,
				outline_width: vars.input.outline.width,
			},
		),
		// State: disabled
		rule(mods(["input", ".input", "textarea", ".textarea"], "disabled"), {
			opacity: vars.controls.disabled.opacity,
			cursor: "not-allowed",
		}),
		// Color variants
		...[
			"primary",
			"secondary",
			"tertiary",
			"success",
			"info",
			"warning",
			"danger",
		].map((color) =>
			rule(cross(["input", ".input", "textarea", ".textarea"], `.${color}`), {
				__input_base: vars.color[color],
			}),
		),
		rule(
			cross(["input", ".input", "textarea", ".textarea"], ".error", ".danger"),
			{
				__input_base: vars.color.danger,
			},
		),
		rule(cross(["input", ".input", "textarea", ".textarea"], ".missing"), {
			__input_base: vars.color.danger,
			__input_border_opacity: "100%",
		}),
		// Checkbox
		rule(["input[type=checkbox]"], {
			cursor: "pointer",
			box_sizing: "content-box",
			aspect_ratio: "1",
			padding: "0em",
			width: "1em",
		}),
		// Blank style
		rule(["input.blank", ".input.blank", "textarea.blank", ".textarea.blank"], {
			__input_opacity: "0%",
			__input_border_opacity: "0%",
			__input_outline_opacity: "0%",
		}),
		// No input styling
		rule(
			mods(
				["input.bare", ".input.bare", "textarea.bare", ".textarea.bare"],
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
				"input[type=range]",
				"input.nopad",
				".input.nopad",
				"textarea.nopad",
				".textarea.nopad",
			],
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
			// Toggle-specific color variables
			__toggle_background_level: 7,
			__toggle_background_c: 0.02,
			__toggle_background_h: 250,
			__toggle_background_alpha: 10,
			__toggle_background_blend: 0,
			__toggle_background_blending: "transparent",
			__toggle_border_level: 5,
			__toggle_border_c: 0.02,
			__toggle_border_h: 250,
			__toggle_border_alpha: 10,
			__toggle_border_blend: 0,
			__toggle_border_blending: "transparent",
			// Active color (when checked) - store the target c/h
			// TODO: __toggle_active_c: colors.primary.c,
			// TODO: __toggle_active_h: colors.primary.h,
			// Base styling
			display: "inline-block",
			position: "relative",
			width: vars.toggle.track.width,
			height: vars.toggle.track.height,
			// TODO: background: oklchColor("toggle", "background"),
			// TODO: border: `${vars.toggle.track.border.width} solid ${oklchColor("toggle", "border")}`,
			border_radius: vars.toggle.track.border.radius,
			cursor: "pointer",
			user_select: "none",
			transition_property:
				"background-color,color,border-color,outline-color,border-width,outline-width,opacity,transform,box-shadow",
			transition_duration: "150ms",
		}),
		rule(".toggle::before", {
			content: "''",
			position: "absolute",
			top: vars.toggle.slider.offset,
			left: vars.toggle.slider.offset,
			width: vars.toggle.slider.size,
			height: vars.toggle.slider.size,
			background: vars.color.paper,
			border_radius: "50%",
			box_shadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
			transition_property: "transform",
			transition_duration: "150ms",
			transform: "translateX(0)",
		}),
		rule(hover(".toggle"), {
			// __toggle_background_level: `calc(var(--toggle-background-level) + ${levelDelta.hover})`,
		}),
		rule(
			[
				".toggle.checked",
				".toggle[data-checked=true]",
				"input[type=checkbox]:checked + .toggle",
			],
			{
				__toggle_background_c: "var(--toggle-active-c)",
				__toggle_background_h: "var(--toggle-active-h)",
				__toggle_background_level: 5,
				__toggle_border_c: "var(--toggle-active-c)",
				__toggle_border_h: "var(--toggle-active-h)",
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
		...["primary", "secondary", "success", "warning", "danger"].map((color) =>
			rule(`.toggle.${color}`, {
				__toggle_color: vars.color[color],
			}),
		),
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
