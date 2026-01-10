import { cross, named, rule, group, vars, mods } from "../js/littlecss.js";
import {
	computeColor,
	oklchColor,
	props,
	colors,
	colorNames,
} from "./colors.js";

// ----------------------------------------------------------------------------
// CONTROL CONSTANTS
// ----------------------------------------------------------------------------
// Focus: 2px outline at 15% opacity
const focus = { width: "2px", alpha: 1.5 }; // 1.5/10 = 0.15
// Level deltas for states (relative adjustments)
const levelDelta = { hover: -1, selected: -2, active: -2 };
// Selectable background alphas
const selectable = { alpha: { hover: 1.5, selected: 2, active: 2.5 } }; // /10
// Input background (paper at 90% opacity)
const input = { backgroundAlpha: 9 }; // 9/10 = 0.9

// ----------------------------------------------------------------------------
//
// CONTROLS
//
// ----------------------------------------------------------------------------
// All controls use the simplified color system with level, alpha, blend.
// State changes (hover, focus, active) use relative level adjustments:
//   level: calc(var(--background-level) - 1)  // darker on hover
//
// Text color automatically adjusts for WCAG-compatible contrast based on
// background level using the same mechanism as .bg/.tx classes.

function hover(...args) {
	const res = [];
	for (const a of args) {
		res.push(`${a}:hover`);
		res.push(`${a}.hover`);
	}
	return res;
}

// Get color properties (c, h) for a color name
function getColorProps(name) {
	const color = colors[name] || colors.neutral;
	return { c: color.c, h: color.h };
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
			// Selectable-specific variables (namespaced to avoid affecting children)
			// Direction-aware: level 8.5 in light mode, level 0.5 in dark mode
			__selectable_background_level: `calc(4.5 + var(--color-l-direction) * 4)`,
			__selectable_background_c: 0.02,
			__selectable_background_h: 250,
			__selectable_background_alpha: 0,
			__selectable_background_blend: 0,
			__selectable_background_blending: "transparent",
			// Outline variables for focus state
			__selectable_outline_level: 5,
			__selectable_outline_c: 0.02,
			__selectable_outline_h: 250,
			__selectable_outline_alpha: 0,
			__selectable_outline_blend: 0,
			__selectable_outline_blending: "transparent",
			// Computed background color
			background_color: oklchColor("selectable", "background"),
		}),
		rule(hover(".selectable"), {
			__selectable_background_alpha: selectable.alpha.hover,
			__selectable_background_level: `calc(4.5 + var(--color-l-direction) * 4 + ${levelDelta.hover})`,
		}),
		rule(
			[
				".selectable:focus",
				".selectable:focus-within",
				".selectable.focus",
			],
			{
				outline: `${focus.width} solid oklch(0.5 0.15 var(--selectable-outline-h) / ${focus.alpha / 10})`,
				outline_offset: "1px",
			},
		),
		rule([".selectable.selected", ".selectable[data-selected=true]"], {
			__selectable_background_alpha: selectable.alpha.selected,
			__selectable_background_level: `calc(4.5 + var(--color-l-direction) * 4 + ${levelDelta.selected})`,
		}),
		rule([".selectable:active", ".selectable.active"], {
			__selectable_background_alpha: selectable.alpha.active,
			__selectable_background_level: `calc(4.5 + var(--color-l-direction) * 4 + ${levelDelta.active})`,
		}),
		rule([".selectable:disabled", ".selectable.disabled"], {
			opacity: 0.5,
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
			const { c, h } = getColorProps(color);
			return rule(`.selectable.${color}`, {
				__selectable_background_c: c,
				__selectable_background_h: h,
				__selectable_outline_c: c,
				__selectable_outline_h: h,
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
			// Color properties
			__background_level: 5,
			__background_c: 0.02,
			__background_h: 250,
			__background_alpha: 10,
			__background_blend: 0,
			__background_blending: "transparent",
			__border_level: 5,
			__border_c: 0.02,
			__border_h: 250,
			__border_alpha: 10,
			__border_blend: 0,
			__border_blending: "transparent",
			// Text color with WCAG contrast
			__text_level: 5,
			__text_c: 0.02,
			__text_h: 250,
			__text_alpha: 10,
			__text_blend: 0,
			__text_blending: "transparent",
			// WCAG contrast calculation
			__bg_is_dark: `clamp(0, (4.5 - var(--background-level)) * 10, 1)`,
			__text_l_min: `calc((1 + var(--color-l-direction) * (2 * var(--bg-is-dark) - 1)) / 2 * 8)`,
			__text_l_max: `calc(1 + (1 + var(--color-l-direction) * (2 * var(--bg-is-dark) - 1)) / 2 * 8)`,
			// Styling
			display: "inline-flex",
			cursor: "pointer",
			user_select: "none",
			__border_width: "2px",
			border_width: vars.border.width,
			border_style: "solid",
			border_color: computeColor(props[2]),
			background_color: computeColor(props[0]),
			color: computeColor(props[1], true),
			padding: `${vars.pad[0]} ${vars.pad[2]}`,
			transition_property:
				"background-color,color,border-color,outline-color,border-width,outline-width,opacity,transform,box-shadow",
			transition_duration: "150ms",
			__border_radius: "2lh",
			border_radius: vars.border.radius,
		}),
		rule(".pill:not(.outline)", {
			__border_level: "var(--background-level)",
		}),
		rule(hover(".pill"), {
			__background_level: `calc(var(--background-level) + ${levelDelta.hover})`,
		}),
		rule(hover(".pill:not(.outline)"), {
			__border_level: `calc(var(--border-level) + ${levelDelta.hover})`,
		}),
		rule(hover(".pill.outline"), {
			__background_alpha: selectable.alpha.hover,
			__text_level: `calc(var(--text-level) + ${levelDelta.hover * 2})`,
			__border_level: `calc(var(--border-level) + ${levelDelta.hover * 2})`,
		}),
		rule([".pill.selected", ".pill[data-selected=true]"], {
			__background_level: `calc(var(--background-level) + ${levelDelta.selected})`,
		}),
		rule(
			[
				".pill:not(.outline).selected",
				".pill:not(.outline)[data-selected=true]",
			],
			{
				__border_level: `calc(var(--border-level) + ${levelDelta.selected})`,
			},
		),
		rule([".pill.outline.selected", ".pill.outline[data-selected=true]"], {
			__background_alpha: selectable.alpha.selected,
			__text_level: `calc(var(--text-level) + ${levelDelta.selected * 2})`,
			__border_level: `calc(var(--border-level) + ${levelDelta.selected * 2})`,
		}),
		rule([".pill:active", ".pill.active"], {
			__background_level: `calc(var(--background-level) + ${levelDelta.active})`,
		}),
		rule([".pill:not(.outline):active", ".pill:not(.outline).active"], {
			__border_level: `calc(var(--border-level) + ${levelDelta.active})`,
		}),
		rule([".pill.outline:active", ".pill.outline.active"], {
			__background_alpha: selectable.alpha.active,
			__text_level: `calc(var(--text-level) + ${levelDelta.active * 2})`,
			__border_level: `calc(var(--border-level) + ${levelDelta.active * 2})`,
		}),
		rule([".pill:disabled", ".pill.disabled"], {
			opacity: 0.5,
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
		].map((color) => {
			const { c, h } = getColorProps(color);
			return rule(`.pill.${color}`, {
				__background_c: c,
				__background_h: h,
				__border_c: c,
				__border_h: h,
				__text_c: c,
				__text_h: h,
			});
		}),
		// Style variants
		// Outline: transparent background, text uses same level as bg
		rule(".pill.outline", {
			__background_alpha: 0,
			__text_level: "var(--background-level)",
			__text_l_min: 0,
			__text_l_max: 9,
			__border_level: "var(--background-level)",
			__border_alpha: 7.2,
		}),
		// Contrast: force maximum text contrast
		rule(".pill.contrast:not(.outline)", {
			__text_c: 0,
			__text_l_min: `calc((1 + var(--color-l-direction) * (2 * var(--bg-is-dark) - 1)) / 2 * 9)`,
			__text_l_max: `calc((1 + var(--color-l-direction) * (2 * var(--bg-is-dark) - 1)) / 2 * 9)`,
		}),
		rule(".pill.outline.contrast", {
			__text_level: `calc(var(--background-level) - var(--color-l-direction) * 2.25)`,
			__border_level: `calc(var(--background-level) - var(--color-l-direction) * 2.25)`,
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
			// Color properties
			__background_level: 5,
			__background_c: 0.02,
			__background_h: 250,
			__background_alpha: 10,
			__background_blend: 0,
			__background_blending: "transparent",
			__border_level: 4,
			__border_c: 0.02,
			__border_h: 250,
			__border_alpha: 10,
			__border_blend: 0,
			__border_blending: "transparent",
			__outline_level: 5,
			__outline_c: 0.02,
			__outline_h: 250,
			__outline_alpha: 0,
			__outline_blend: 0,
			__outline_blending: "transparent",
			// Text color with WCAG contrast
			__text_level: 5,
			__text_c: 0.02,
			__text_h: 250,
			__text_alpha: 10,
			__text_blend: 0,
			__text_blending: "transparent",
			// WCAG contrast calculation
			__bg_is_dark: `clamp(0, (4.5 - var(--background-level)) * 10, 1)`,
			__text_l_min: `calc((1 + var(--color-l-direction) * (2 * var(--bg-is-dark) - 1)) / 2 * 8)`,
			__text_l_max: `calc(1 + (1 + var(--color-l-direction) * (2 * var(--bg-is-dark) - 1)) / 2 * 8)`,
			// Computed colors
			border_width: "1px",
			border_style: "solid",
			border_color: computeColor(props[2]),
			outline_width: "0px",
			outline_style: "solid",
			outline_color: computeColor(props[3]),
			background_color: computeColor(props[0]),
			color: computeColor(props[1], true),
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
				"background-color,color,border-color,outline-color,border-width,outline-width,opacity,transform,box-shadow",
			transition_duration: "150ms",
		}),
		rule(["button.icon", ".button.icon"], {
			__background_alpha: 0,
			__border_alpha: 0,
			// Direction-aware level
			__background_level: `calc(4.5 + var(--color-l-direction) * 4)`,
			__text_level: "var(--background-level)",
			__text_l_min: 0,
			__text_l_max: 9,
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
		].map((color) => {
			const { c, h } = getColorProps(color);
			return rule([`button.${color}`, `.button.${color}`], {
				__background_c: c,
				__background_h: h,
				__border_c: c,
				__border_h: h,
				__outline_c: c,
				__outline_h: h,
				__text_c: c,
				__text_h: h,
			});
		}),
		rule(["button.shadow", ".button.shadow"], {
			box_shadow: `${vars.shadow.x} ${vars.shadow.y} ${vars.shadow.spread} ${vars.shadow.color}`,
		}),
		rule(["button.blank", ".button.blank"], {
			__background_alpha: 0,
			__border_alpha: 0,
			__outline_alpha: 0,
			__background_level: `calc(4.5 + var(--color-l-direction) * 4)`,
			__text_level: "var(--background-level)",
			__text_l_min: 0,
			__text_l_max: 9,
		}),
		// Outline style
		rule(["button.outline", ".button.outline"], {
			__background_alpha: 0,
			__border_alpha: 7.2,
			__background_level: `calc(4.5 + var(--color-l-direction) * 4)`,
			__text_level: "var(--background-level)",
			__text_l_min: 0,
			__text_l_max: 9,
			__border_level: "var(--background-level)",
			border_width: "2px",
		}),
		// State: focus
		rule(mods(["button", ".button"], "focus", "focus-within"), {
			__outline_alpha: focus.alpha,
			outline_width: focus.width,
		}),
		// State: hover (filled)
		rule(
			hover(
				"button:not(.outline):not(.blank):not(.icon)",
				".button:not(.outline):not(.blank):not(.icon)",
			),
			{
				__background_level: `calc(var(--background-level) + ${levelDelta.hover})`,
				__border_level: `calc(var(--border-level) + ${levelDelta.hover})`,
			},
		),
		// State: hover (outline/blank/icon)
		rule(
			hover(
				"button.outline",
				".button.outline",
				"button.blank",
				".button.blank",
				"button.icon",
				".button.icon",
			),
			{
				__background_alpha: selectable.alpha.hover,
				__background_level: `calc(var(--background-level) + ${levelDelta.hover})`,
				__border_level: `calc(var(--border-level) + ${levelDelta.hover * 2})`,
				__text_level: `calc(var(--text-level) + ${levelDelta.hover * 2})`,
			},
		),
		// State: selected (filled)
		rule(
			mods(
				[
					"button:not(.outline):not(.blank):not(.icon)",
					".button:not(.outline):not(.blank):not(.icon)",
				],
				"selected",
			),
			{
				__background_level: `calc(var(--background-level) + ${levelDelta.selected})`,
				__border_level: `calc(var(--border-level) + ${levelDelta.selected})`,
			},
		),
		rule(
			[
				"button:not(.outline):not(.blank):not(.icon)[data-selected=true]",
				".button:not(.outline):not(.blank):not(.icon)[data-selected=true]",
			],
			{
				__background_level: `calc(var(--background-level) + ${levelDelta.selected})`,
				__border_level: `calc(var(--border-level) + ${levelDelta.selected})`,
			},
		),
		// State: selected (outline/blank/icon)
		rule(
			mods(
				[
					"button.outline",
					".button.outline",
					"button.blank",
					".button.blank",
					"button.icon",
					".button.icon",
				],
				"selected",
			),
			{
				__background_alpha: selectable.alpha.selected,
				__background_level: `calc(var(--background-level) + ${levelDelta.selected})`,
				__border_level: `calc(var(--border-level) + ${levelDelta.selected * 2})`,
				__text_level: `calc(var(--text-level) + ${levelDelta.selected * 2})`,
			},
		),
		rule(
			[
				"button.outline[data-selected=true]",
				".button.outline[data-selected=true]",
				"button.blank[data-selected=true]",
				".button.blank[data-selected=true]",
				"button.icon[data-selected=true]",
				".button.icon[data-selected=true]",
			],
			{
				__background_alpha: selectable.alpha.selected,
				__background_level: `calc(var(--background-level) + ${levelDelta.selected})`,
				__border_level: `calc(var(--border-level) + ${levelDelta.selected * 2})`,
				__text_level: `calc(var(--text-level) + ${levelDelta.selected * 2})`,
			},
		),
		// State: active (filled)
		rule(
			mods(
				[
					"button:not(.outline):not(.blank):not(.icon)",
					".button:not(.outline):not(.blank):not(.icon)",
				],
				"active",
			),
			{
				__background_level: `calc(var(--background-level) + ${levelDelta.active})`,
				__border_level: `calc(var(--border-level) + ${levelDelta.active})`,
			},
		),
		// State: active (outline/blank/icon)
		rule(
			mods(
				[
					"button.outline",
					".button.outline",
					"button.blank",
					".button.blank",
					"button.icon",
					".button.icon",
				],
				"active",
			),
			{
				__background_alpha: selectable.alpha.active,
				__background_level: `calc(var(--background-level) + ${levelDelta.active})`,
				__border_level: `calc(var(--border-level) + ${levelDelta.active * 2})`,
				__text_level: `calc(var(--text-level) + ${levelDelta.active * 2})`,
			},
		),
		// State: disabled
		rule(mods(["button", ".button"], "disabled"), {
			opacity: 0.5,
			cursor: "not-allowed",
			pointer_events: "none",
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
		// Contrast: force maximum text contrast
		rule(
			[
				"button.contrast:not(.outline):not(.blank):not(.icon)",
				".button.contrast:not(.outline):not(.blank):not(.icon)",
			],
			{
				__text_c: 0,
				__text_l_min: `calc((1 + var(--color-l-direction) * (2 * var(--bg-is-dark) - 1)) / 2 * 9)`,
				__text_l_max: `calc((1 + var(--color-l-direction) * (2 * var(--bg-is-dark) - 1)) / 2 * 9)`,
			},
		),
		rule(
			[
				"button.outline.contrast",
				".button.outline.contrast",
				"button.blank.contrast",
				".button.blank.contrast",
				"button.icon.contrast",
				".button.icon.contrast",
			],
			{
				__text_level: `calc(var(--background-level) - var(--color-l-direction) * 2.25)`,
				__border_level: `calc(var(--background-level) - var(--color-l-direction) * 2.25)`,
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
			// Color properties
			__background_level: 5,
			__background_c: 0.02,
			__background_h: 250,
			__background_alpha: 0,
			__background_blend: 0,
			__background_blending: "transparent",
			__border_level: 5,
			__border_c: 0.02,
			__border_h: 250,
			__border_alpha: 10,
			__border_blend: 0,
			__border_blending: "transparent",
			// Text color with WCAG contrast
			__text_level: 5,
			__text_c: 0.02,
			__text_h: 250,
			__text_alpha: 10,
			__text_blend: 0,
			__text_blending: "transparent",
			// WCAG contrast calculation
			__bg_is_dark: `clamp(0, (4.5 - var(--background-level)) * 10, 1)`,
			__text_l_min: `calc((1 + var(--color-l-direction) * (2 * var(--bg-is-dark) - 1)) / 2 * 8)`,
			__text_l_max: `calc(1 + (1 + var(--color-l-direction) * (2 * var(--bg-is-dark) - 1)) / 2 * 8)`,
			// Container styling
			display: "inline-flex",
			gap: "0",
			flex_wrap: "nowrap",
		}),
		rule([".selector > li", ".selector > .item"], {
			border_width: "1px",
			border_style: "solid",
			border_color: computeColor(props[2]),
			background_color: computeColor(props[0]),
			color: computeColor(props[1], true),
			font_family: vars.selector.font.family,
			line_height: vars.selector.font.line,
			font_weight: vars.selector.font.weight,
			display: "inline-flex",
			align_items: "center",
			justify_content: "center",
			white_space: "nowrap",
			padding: "0.35em 0.65em",
			cursor: "pointer",
			user_select: "none",
			box_sizing: "border-box",
			transition_property:
				"background-color,color,border-color,outline-color,border-width,outline-width,opacity,transform,box-shadow",
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
			__background_alpha: selectable.alpha.hover,
			__background_level: `calc(var(--background-level) + ${levelDelta.hover})`,
			z_index: "1",
		}),
		rule(
			mods(
				[".selector > li", ".selector > .item"],
				"focus",
				"focus-within",
			),
			{
				outline: `${focus.width} solid oklch(0.5 0.15 var(--background-h) / ${focus.alpha / 10})`,
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
				__background_alpha: 10,
				__background_level: `calc(var(--background-level) + ${levelDelta.selected})`,
				z_index: "2",
			},
		),
		rule(mods([".selector > li", ".selector > .item"], "active"), {
			__background_alpha: selectable.alpha.active,
			__background_level: `calc(var(--background-level) + ${levelDelta.active})`,
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
			const { c, h } = getColorProps(color);
			return rule(`.selector.${color}`, {
				__background_c: c,
				__background_h: h,
				__border_c: c,
				__border_h: h,
				__text_c: c,
				__text_h: h,
			});
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
			// Input-specific color variables
			__input_background_level: 9,
			__input_background_c: 0,
			__input_background_h: 0,
			__input_background_alpha: input.backgroundAlpha,
			__input_background_blend: 0,
			__input_background_blending: "transparent",
			__input_border_level: 4,
			__input_border_c: 0.02,
			__input_border_h: 250,
			__input_border_alpha: 10,
			__input_border_blend: 0,
			__input_border_blending: "transparent",
			__input_outline_level: 5,
			__input_outline_c: 0.02,
			__input_outline_h: 250,
			__input_outline_alpha: 0,
			__input_outline_blend: 0,
			__input_outline_blending: "transparent",
			__input_text_level: 5,
			__input_text_c: 0,
			__input_text_h: 0,
			__input_text_alpha: 10,
			__input_text_blend: 0,
			__input_text_blending: "transparent",
			// WCAG contrast calculation for input
			__input_is_dark: `clamp(0, var(--color-l-direction) * (4.5 - var(--input-background-level)) * 10 + 0.5, 1)`,
			__input_text_l_min: `calc((1 + var(--color-l-direction) * (2 * var(--input-is-dark) - 1)) / 2 * 7)`,
			__input_text_l_max: `calc(2 + (1 + var(--color-l-direction) * (2 * var(--input-is-dark) - 1)) / 2 * 7)`,
			// Computed styling
			border_width: "1px",
			border_style: "solid",
			border_color: oklchColor("input", "border"),
			outline_width: "0px",
			outline_style: "solid",
			outline_color: oklchColor("input", "outline"),
			background_color: oklchColor("input", "background"),
			color: oklchColor("input", "text", { useConstraints: true }),
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
				"background-color,color,border-color,outline-color,border-width,outline-width,opacity,transform,box-shadow",
			transition_duration: "150ms",
		}),
		rule([".textarea", "textarea"], {
			width: "100%",
			field_sizing: "content",
			resize: "none",
		}),
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
		// State: focus
		rule(
			mods(
				["input", ".input", "textarea", ".textarea"],
				"focus",
				"focus-within",
			),
			{
				__input_outline_alpha: focus.alpha,
				outline_width: focus.width,
			},
		),
		// State: hover
		rule(hover("input", ".input", "textarea", ".textarea"), {
			__input_border_level: `calc(var(--input-border-level) + ${levelDelta.hover})`,
		}),
		// State: active
		rule(mods(["input", ".input", "textarea", ".textarea"], "active"), {
			__input_border_level: `calc(var(--input-border-level) + ${levelDelta.active})`,
		}),
		// State: disabled
		rule(mods(["input", ".input", "textarea", ".textarea"], "disabled"), {
			opacity: 0.5,
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
		].map((color) => {
			const { c, h } = getColorProps(color);
			return rule(
				cross(
					["input", ".input", "textarea", ".textarea"],
					`.${color}`,
				),
				{
					__input_border_c: c,
					__input_border_h: h,
					__input_outline_c: c,
					__input_outline_h: h,
					__input_background_c: c,
					__input_background_h: h,
					__input_background_level: 8,
					__input_text_c: c,
					__input_text_h: h,
				},
			);
		}),
		rule(
			cross(
				["input", ".input", "textarea", ".textarea"],
				".error",
				".danger",
			),
			{
				__input_border_c: colors.danger.c,
				__input_border_h: colors.danger.h,
				__input_outline_c: colors.danger.c,
				__input_outline_h: colors.danger.h,
				__input_background_c: colors.danger.c,
				__input_background_h: colors.danger.h,
				__input_background_level: 8,
				__input_text_c: colors.danger.c,
				__input_text_h: colors.danger.h,
			},
		),
		rule(cross(["input", ".input", "textarea", ".textarea"], ".missing"), {
			__input_border_c: colors.danger.c,
			__input_border_h: colors.danger.h,
			__input_outline_c: colors.danger.c,
			__input_outline_h: colors.danger.h,
		}),
		// Blank style
		rule(
			[
				"input.blank",
				".input.blank",
				"textarea.blank",
				".textarea.blank",
			],
			{
				__input_background_alpha: 0,
				__input_border_alpha: 0,
				__input_outline_alpha: 0,
			},
		),
		// No input styling
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
			__toggle_active_c: colors.primary.c,
			__toggle_active_h: colors.primary.h,
			// Base styling
			display: "inline-block",
			position: "relative",
			width: vars.toggle.track.width,
			height: vars.toggle.track.height,
			background: oklchColor("toggle", "background"),
			border: `${vars.toggle.track.border.width} solid ${oklchColor("toggle", "border")}`,
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
			__toggle_background_level: `calc(var(--toggle-background-level) + ${levelDelta.hover})`,
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
		...["primary", "secondary", "success", "warning", "danger"].map(
			(color) => {
				const { c, h } = getColorProps(color);
				return rule(`.toggle.${color}`, {
					__toggle_active_c: c,
					__toggle_active_h: h,
				});
			},
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
