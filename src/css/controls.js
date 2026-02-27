import { cross, group, mods, named, rule, vars } from "../js/littlecss.js";
import { SEMANTIC } from "./colors.js";

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
	// namespaced variables (--{background,border,outline}-*) to avoid affecting child elements.
	selectable: group(
		rule(".selectable", {
			cursor: "pointer",
			user_select: "none",
			transition_property:
				"background-color,color,border-color,outline-color,border-width,outline-width,opacity,transform,box-shadow",
			transition_duration: "150ms",
			// Color system: base, tint, opacity, blend (0=100% tint, 10=100% base)
			__background_base: vars.color.ink,
			__background_tint: vars.color.paper,
			__background_opacity: "0%",
			__background_blend: vars.selectable.blend,
			__outline_opacity: vars.controls.outline.opacity,
			__outline_width: vars.outline.width,
			// Apply computed background color
			background_color: `color-mix(in oklch, color-mix(in oklch, var(--background-base), var(--background-tint) calc((1 - var(--background-blend)) * 100%)), transparent calc((1 - var(--background-opacity)) * 100%))`,
			outline_color: `color-mix(in oklch, color-mix(in oklch, var(--background-base), var(--background-tint) calc((1 - var(--outline-blend, var(--background-blend))) * 100%)), transparent calc((1 - var(--outline-opacity)) * 100%))`,
			outline_width: "0px",
		}),
		rule(hover(".selectable"), {
			__background_opacity: vars.selectable.hover.opacity,
		}),
		rule(
			[".selectable:focus", ".selectable:focus-within", ".selectable.focus"],
			{
				__outline_opacity: vars.selectable.active.opacity,
				outline_width: vars.selectable.outline.width,
			},
		),
		rule([".selectable.selected", ".selectable[data-selected=true]"], {
			__background_opacity: vars.selectable.selected.opacity,
		}),
		rule([".selectable:active", ".selectable.active"], {
			__background_opacity: vars.selectable.active.opacity,
		}),
		rule([".selectable:disabled", ".selectable.disabled"], {
			opacity: vars.selectable.disabled.opacity,
			cursor: "not-allowed",
			pointer_events: "none",
		}),
		// Semantic color variants - map to CSS color variables for theming
		...Object.keys(SEMANTIC).map((semantic) =>
			rule(`.selectable.${semantic}`, {
				__background_base:
					SEMANTIC[semantic] === "white"
						? "#FFFFFF"
						: SEMANTIC[semantic] === "black"
							? "#000000"
							: `var(--color-${SEMANTIC[semantic]}-500)`,
			}),
		),
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

			// Color system: base, tint, opacity, blend
			__background_base: vars.color.ink,
			__background_tint: vars.color.paper,
			__background_opacity: vars.pill.opacity,
			__background_blend: vars.pill.blend,
			__border_base: vars.color.ink,
			__border_tint: vars.color.paper,
			__border_opacity: vars.pill.border.opacity,
			__border_blend: vars.pill.border.blend,
			__outline_base: vars.color.ink,
			__outline_tint: vars.color.paper,
			__outline_opacity: vars.pill.outline.opacity,
			__outline_blend: vars.pill.outline.blend,

			// Computed colors
			background_color: `color-mix(in oklch, color-mix(in oklch, var(--background-base), var(--background-tint) calc((1 - var(--background-blend)) * 100%)), transparent calc((1 - var(--background-opacity)) * 100%))`,
			color: vars.color.ink,
			border_color: `color-mix(in oklch, color-mix(in oklch, var(--border-base), var(--border-tint) calc((1 - var(--border-blend)) * 100%)), transparent calc((1 - var(--border-opacity)) * 100%))`,
			border_width: vars.pill.border.width,
			border_style: "solid",
			outline_color: `color-mix(in oklch, color-mix(in oklch, var(--outline-base), var(--outline-tint) calc((1 - var(--outline-blend)) * 100%)), transparent calc((1 - var(--outline-opacity)) * 100%))`,
			outline_width: "0px",
			outline_style: "solid",

			// Layout
			display: "inline-flex",
			padding: `${vars.pad[0]} ${vars.pad[2]}`,
			border_radius: vars.border.radius,
		}),
		// State: hover
		rule(hover(".pill"), {
			__background_blend: vars.pill.hover.blend,
		}),
		// State: selected
		rule([".pill.selected", ".pill[data-selected=true]"], {
			__background_blend: vars.pill.selected.blend,
		}),
		// State: active
		rule([".pill:active", ".pill.active"], {
			__background_blend: vars.pill.active.blend,
		}),
		rule(hover(".pill:not(.outline)"), {
			__border_blend: vars.pill.hover.blend,
		}),
		// State: selected (filled)
		rule([".pill.selected", ".pill[data-selected=true]"], {
			__background_blend: vars.pill.selected.blend,
		}),
		rule(
			[
				".pill:not(.outline).selected",
				".pill:not(.outline)[data-selected=true]",
			],
			{
				__border_blend: vars.pill.selected.blend,
			},
		),
		// State: active
		rule([".pill:active", ".pill.active"], {
			__background_blend: vars.pill.active.blend,
		}),
		rule([".pill:not(.outline):active", ".pill:not(.outline).active"], {
			__border_blend: vars.pill.active.blend,
		}),
		// State: focus
		rule([".pill:focus", ".pill:focus-within", ".pill.focus"], {
			__outline_opacity: vars.controls.active.delta,
			outline_width: vars.pill.outline.width,
		}),
		// State: disabled
		rule([".pill:disabled", ".pill.disabled"], {
			opacity: vars.controls.disabled.opacity,
			cursor: "not-allowed",
			pointer_events: "none",
		}),
		// Semantic color variants
		...Object.keys(SEMANTIC).map((semantic) =>
			rule(`.pill.${semantic}`, {
				__background_base:
					SEMANTIC[semantic] === "white"
						? "#FFFFFF"
						: SEMANTIC[semantic] === "black"
							? "#000000"
							: `var(--color-${SEMANTIC[semantic]}-500)`,
				__border_base:
					SEMANTIC[semantic] === "white"
						? "#FFFFFF"
						: SEMANTIC[semantic] === "black"
							? "#000000"
							: `var(--color-${SEMANTIC[semantic]}-500)`,
			}),
		),
		// =====================================================================
		// OUTLINE
		// =====================================================================
		rule(".pill.outline", {
			__background_opacity: "0%",
			__border_opacity: "80%",
			__background_blend: "100%",
			border_width: vars.border.width,
		}),
		rule(hover(".pill.outline"), {
			__background_opacity: vars.selectable.hover.opacity,
		}),
		rule([".pill.outline.selected", ".pill.outline[data-selected=true]"], {
			__background_opacity: vars.selectable.selected.opacity,
		}),
		rule([".pill.outline:active", ".pill.outline.active"], {
			__background_opacity: vars.selectable.active.opacity,
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
			// Color system: base, tint, opacity, blend
			__background_base: vars.color.ink,
			__background_tint: vars.color.paper,
			__background_opacity: vars.button.opacity,
			__background_blend: vars.button.blend,
			__border_base: vars.color.ink,
			__border_tint: vars.color.paper,
			__border_opacity: vars.button.border.opacity,
			__border_blend: vars.button.border.blend,
			__outline_base: vars.color.ink,
			__outline_tint: vars.color.paper,
			__outline_opacity: vars.button.outline.opacity,
			__outline_blend: vars.button.outline.blend,

			// Computed colors
			background_color: `color-mix(in oklch, color-mix(in oklch, var(--background-base), var(--background-tint) calc((1 - var(--background-blend)) * 100%)), transparent calc((1 - var(--background-opacity)) * 100%))`,
			color: vars.text.color,
			border_color: `color-mix(in oklch, color-mix(in oklch, var(--border-base), var(--border-tint) calc((1 - var(--border-blend)) * 100%)), transparent calc((1 - var(--border-opacity)) * 100%))`,
			border_width: vars.button.border.width,
			border_style: "solid",
			outline_color: `color-mix(in oklch, color-mix(in oklch, var(--outline-base), var(--outline-tint) calc((1 - var(--outline-blend)) * 100%)), transparent calc((1 - var(--outline-opacity)) * 100%))`,
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
		// Semantic color variants
		...Object.keys(SEMANTIC).map((semantic) =>
			rule([`button.${semantic}`, `.button.${semantic}`], {
				__background_base:
					SEMANTIC[semantic] === "white"
						? "#FFFFFF"
						: SEMANTIC[semantic] === "black"
							? "#000000"
							: `var(--color-${SEMANTIC[semantic]}-500)`,
				__border_base:
					SEMANTIC[semantic] === "white"
						? "#FFFFFF"
						: SEMANTIC[semantic] === "black"
							? "#000000"
							: `var(--color-${SEMANTIC[semantic]}-500)`,
			}),
		),
		rule(["button.shadow", ".button.shadow"], {
			box_shadow: `${vars.shadow.x} ${vars.shadow.y} ${vars.shadow.spread} ${vars.shadow.color}`,
		}),
		rule(["button.blank", ".button.blank"], {
			__background_opacity: "0%",
			__border_opacity: "0%",
			// We keep the outline and hover states
		}),
		// Outline style
		rule(["button.outline", ".button.outline"], {}),
		// =====================================================================
		// REGULAR
		// =====================================================================
		// State: focus
		rule(mods(["button", ".button"], "focus", "focus-within"), {
			__outline_opacity: vars.controls.active.delta,
			outline_width: vars.button.outline.width,
		}),
		// State: hover (filled)
		rule(hover("button", ".button"), {
			__background_blend: vars.button.hover.blend,
		}),
		// State: selected (filled)
		rule(mods(["button", ".button"], "selected"), {
			__background_blend: vars.button.selected.blend,
		}),
		// State: active
		rule(mods(["button", ".button"], "active"), {
			__background_blend: vars.button.active.blend,
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
			__background_opacity: "0%",
			__border_opacity: "80%",
			__background_blend: "100%",
			border_width: vars.border.width,
		}),
		rule(["button.outline.default", ".button.outline.default"], {
			border_width: `calc(1px + ${vars.border.width})`,
		}),
		rule(hover("button.outline", ".button.outline"), {
			// Same as selectable
			__background_opacity: vars.selectable.hover.opacity,
		}),
		rule(mods(["button.outline", ".button.outline"], "selected"), {
			__background_opacity: vars.selectable.selected.opacity,
		}),
		rule(mods(["button.outline", ".button.outline"], "active"), {
			__background_opacity: vars.selectable.active.opacity,
		}),

		// =====================================================================
		// ICONS
		// =====================================================================
		rule(["button.icon", ".button.icon"], {
			__background_opacity: "0%",
			__border_opacity: "0%",
		}),
		rule(hover("button.icon", ".button.icon"), {
			// Same as selectable
			__background_opacity: vars.selectable.hover.opacity,
		}),
		rule(mods(["button.icon", ".button.icon"], "selected"), {
			__background_opacity: vars.selectable.selected.opacity,
		}),
		rule(mods(["button.icon", ".button.icon"], "active"), {
			__background_opacity: vars.selectable.active.opacity,
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

			// Color system: base, tint, opacity, blend for items
			__background_base: vars.color.ink,
			__background_tint: vars.color.paper,
			__background_opacity: vars.selector.opacity,
			__background_blend: vars.selector.blend,
			__border_base: vars.color.ink,
			__border_tint: vars.color.paper,
			__border_opacity: vars.selector.border.opacity,
			__border_blend: vars.selector.border.blend,
			__outline_base: vars.color.ink,
			__outline_tint: vars.color.paper,
			__outline_opacity: vars.selector.outline.opacity,
			__outline_blend: vars.selector.outline.blend,

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

			// Colors - inherit from parent .selector
			background_color: `color-mix(in oklch, color-mix(in oklch, var(--background-base), var(--background-tint) calc((1 - var(--background-blend)) * 100%)), transparent calc((1 - var(--background-opacity)) * 100%))`,
			border_color: `color-mix(in oklch, color-mix(in oklch, var(--border-base), var(--border-tint) calc((1 - var(--border-blend)) * 100%)), transparent calc((1 - var(--border-opacity)) * 100%))`,
			outline_color: `color-mix(in oklch, color-mix(in oklch, var(--outline-base), var(--outline-tint) calc((1 - var(--outline-blend)) * 100%)), transparent calc((1 - var(--outline-opacity)) * 100%))`,
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
			__background_opacity: vars.selector.hover.opacity,
			z_index: "1",
		}),
		// State: focus
		rule(
			mods([".selector > li", ".selector > .item"], "focus", "focus-within"),
			{
				__outline_opacity: vars.controls.active.delta,
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
				__background_opacity: vars.selector.selected.opacity,
				z_index: "2",
			},
		),
		// State: active
		rule(mods([".selector > li", ".selector > .item"], "active"), {
			__background_opacity: vars.selector.active.opacity,
		}),
		// State: disabled
		rule(mods([".selector > li", ".selector > .item"], "disabled"), {
			opacity: vars.controls.disabled.opacity,
			cursor: "not-allowed",
			pointer_events: "none",
		}),
		// Semantic color variants
		...Object.keys(SEMANTIC).map((semantic) =>
			rule(`.selector.${semantic}`, {
				__background_base:
					SEMANTIC[semantic] === "white"
						? "#FFFFFF"
						: SEMANTIC[semantic] === "black"
							? "#000000"
							: `var(--color-${SEMANTIC[semantic]}-500)`,
				__border_base:
					SEMANTIC[semantic] === "white"
						? "#FFFFFF"
						: SEMANTIC[semantic] === "black"
							? "#000000"
							: `var(--color-${SEMANTIC[semantic]}-500)`,
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
			// Color system: base, tint, opacity, blend
			__background_base: vars.color.ink,
			__background_tint: vars.color.paper,
			__background_opacity: vars.input.opacity,
			__background_blend: vars.input.blend,
			__border_base: vars.color.ink,
			__border_tint: vars.color.paper,
			__border_opacity: vars.input.border.opacity,
			__border_blend: vars.input.border.blend,
			__outline_base: vars.color.ink,
			__outline_tint: vars.color.paper,
			__outline_opacity: vars.input.outline.opacity,
			__outline_blend: vars.input.outline.blend,

			background_color: `color-mix(in oklch, color-mix(in oklch, var(--background-base), var(--background-tint) calc((1 - var(--background-blend)) * 100%)), transparent calc((1 - var(--background-opacity)) * 100%))`,
			color: vars.text.color,
			border_color: `color-mix(in oklch, color-mix(in oklch, var(--border-base), var(--border-tint) calc((1 - var(--border-blend)) * 100%)), transparent calc((1 - var(--border-opacity)) * 100%))`,
			border_width: vars.input.border.width,
			border_style: "solid",

			outline_color: `color-mix(in oklch, color-mix(in oklch, var(--outline-base), var(--outline-tint) calc((1 - var(--outline-blend)) * 100%)), transparent calc((1 - var(--outline-opacity)) * 100%))`,
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
		// State: focus
		rule(
			mods(
				["input", ".input", "textarea", ".textarea"],
				"focus",
				"focus-within",
			),
			{
				__input_outline_opacity: "80%",
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
				__outline_opacity: vars.input.focus.outline.opacity,
				__background_opacity: vars.input.focus.opacity,
				outline_width: vars.input.outline.width,
			},
		),
		// State: disabled
		rule(mods(["input", ".input", "textarea", ".textarea"], "disabled"), {
			opacity: vars.controls.disabled.opacity,
			cursor: "not-allowed",
		}),
		// Semantic color variants
		...Object.keys(SEMANTIC).map((semantic) =>
			rule(
				cross(["input", ".input", "textarea", ".textarea"], `.${semantic}`),
				{
					__background_base:
						SEMANTIC[semantic] === "white"
							? "#FFFFFF"
							: SEMANTIC[semantic] === "black"
								? "#000000"
								: `var(--color-${SEMANTIC[semantic]}-500)`,
					__border_base:
						SEMANTIC[semantic] === "white"
							? "#FFFFFF"
							: SEMANTIC[semantic] === "black"
								? "#000000"
								: `var(--color-${SEMANTIC[semantic]}-500)`,
				},
			),
		),
		rule(
			cross(["input", ".input", "textarea", ".textarea"], ".error", ".danger"),
			{
				__background_base: `var(--color-${SEMANTIC.danger}-500)`,
				__border_base: `var(--color-${SEMANTIC.danger}-500)`,
			},
		),
		rule(cross(["input", ".input", "textarea", ".textarea"], ".missing"), {
			__background_base: `var(--color-${SEMANTIC.danger}-500)`,
			__border_opacity: "100%",
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
			__background_opacity: "0%",
			__border_opacity: "0%",
			__outline_opacity: "0%",
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
	// Toggle elements are interactive on/off switches with a sliding indicator.
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
			// Color system: base, tint, opacity, blend
			__background_base: vars.color.ink,
			__background_tint: vars.color.paper,
			__background_opacity: vars.toggle.opacity,
			__background_blend: vars.toggle.blend,
			__border_base: vars.color.ink,
			__border_tint: vars.color.paper,
			__border_opacity: vars.toggle.border.opacity,
			__border_blend: vars.toggle.border.blend,
			background_color: `color-mix(in oklch, color-mix(in oklch, var(--background-base), var(--background-tint) calc((1 - var(--background-blend)) * 100%)), transparent calc((1 - var(--background-opacity)) * 100%))`,
			border_color: `color-mix(in oklch, color-mix(in oklch, var(--border-base), var(--border-tint) calc((1 - var(--border-blend)) * 100%)), transparent calc((1 - var(--border-opacity)) * 100%))`,
			border_width: vars.toggle.track.border.width,
			border_style: "solid",
			// Base styling
			display: "inline-block",
			position: "relative",
			width: vars.toggle.track.width,
			height: vars.toggle.track.height,
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
			// Hover state if needed
		}),
		rule(
			[
				".toggle.checked",
				".toggle[data-checked=true]",
				"input[type=checkbox]:checked + .toggle",
			],
			{
				__background_blend: vars.toggle.active.blend,
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
		// Semantic color variants (for active state)
		...Object.keys(SEMANTIC).map((semantic) =>
			rule(`.toggle.${semantic}`, {
				__background_base:
					SEMANTIC[semantic] === "white"
						? "#FFFFFF"
						: SEMANTIC[semantic] === "black"
							? "#000000"
							: `var(--color-${SEMANTIC[semantic]}-500)`,
				__border_base:
					SEMANTIC[semantic] === "white"
						? "#FFFFFF"
						: SEMANTIC[semantic] === "black"
							? "#000000"
							: `var(--color-${SEMANTIC[semantic]}-500)`,
			}),
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
				__toggle_base: vars.color[color],
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
