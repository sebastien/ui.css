import { cross, named, rule, group, vars, mods } from "../js/littlecss.js";
import { computeColor, oklchColor, PROPS } from "./colors.js";

// ----------------------------------------------------------------------------
// CONTROL CONSTANTS (aligned with spec-controls-colors.md)
// ----------------------------------------------------------------------------
// Values are on 0-9 scale where /9 gives the actual value
// Focus: 2px outline at 15% opacity
const FOCUS = { width: "2px", opacity: 1.35 }; // 1.35/9 ≈ 0.15
// Luminosity deltas (towards ink: negative values make colors darker in light mode)
const DELTA = { hover: -0.25, selected: -0.5, active: -0.75 };
// Amplification factor for outline variants (text/border need more contrast)
const OUTLINE_AMP = 2;
// Selectable background opacities
const SELECTABLE = { opacity: { hover: 1.35, selected: 1.8, active: 2.25 } }; // /9 → 0.15, 0.20, 0.25
// Input background (paper at 90% opacity)
const INPUT = { backgroundOpacity: 8.1 }; // 8.1/9 ≈ 0.9

// ----------------------------------------------------------------------------
//
// CONTROLS
//
// ----------------------------------------------------------------------------
// All controls use the unified color system from tokens.js and colors.js.
// Controls override the standard --background-*, --text-*, --border-*, --outline-*
// variables to set their default colors, which can then be modified using
// utility classes like .bg-primary, .tx-danger, etc.
//
// Text color automatically adjusts for WCAG-compatible contrast based on
// background luminosity using the same mechanism as .bg/.tx classes.
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

export default named({
	// ------------------------------------------------------------------------
	//
	// SELECTABLE
	//
	// ------------------------------------------------------------------------
	// Selectable elements are wrapper/container interactive items that change
	// appearance on hover/focus/active/selected states. They use their own
	// namespaced variables (--selectable-*) to avoid affecting child elements
	// that may use the standard --background-*, --text-* variables.
	// Text color is inherited from parent - no WCAG contrast calculation.
	selectable: group(
		rule(".selectable", {
			cursor: "pointer",
			user_select: "none",
			transition_property:
				"background-color,color,border-color,outline-color,border-width,outline-width,opacity,transform,box-shadow",
			transition_duration: "150ms",
			// Selectable-specific variables (namespaced to avoid affecting children)
			__selectable_background_base: vars.color.neutral,
			// Direction-aware: near paper (8.5) in light mode, near ink (0.5) in dark mode
			__selectable_background_l: `calc(4.5 + var(--color-l-direction) * 4)`,
			__selectable_background_c: 5,
			__selectable_background_h: 0,
			__selectable_background_o: 0,
			__selectable_background_delta_l: 0,
			__selectable_background_delta_c: 0,
			__selectable_background_delta_h: 0,
			__selectable_background_delta_o: 0,
			// Outline variables for focus state
			__selectable_outline_base: vars.color.neutral,
			__selectable_outline_l: 5,
			__selectable_outline_c: 5,
			__selectable_outline_h: 0,
			__selectable_outline_o: 0,
			__selectable_outline_delta_l: 0,
			__selectable_outline_delta_c: 0,
			__selectable_outline_delta_h: 0,
			__selectable_outline_delta_o: 0,
			// Computed background color using direction-aware luminosity
			background_color: oklchColor("selectable", "background"),
		}),
		rule(hover(".selectable"), {
			__selectable_background_o: SELECTABLE.opacity.hover,
			__selectable_background_delta_l: DELTA.hover,
		}),
		rule(
			[
				".selectable:focus",
				".selectable:focus-within",
				".selectable.focus",
			],
			{
				outline: `${FOCUS.width} solid oklch(from ${vars.selectable_outline.base} 0.5 0.15 h / ${FOCUS.opacity / 9})`,
				outline_offset: "1px",
			},
		),
		rule([".selectable.selected", ".selectable[data-selected=true]"], {
			__selectable_background_o: SELECTABLE.opacity.selected,
			__selectable_background_delta_l: DELTA.selected,
		}),
		rule([".selectable:active", ".selectable.active"], {
			__selectable_background_o: SELECTABLE.opacity.active,
			__selectable_background_delta_l: DELTA.active,
		}),
		rule([".selectable:disabled", ".selectable.disabled"], {
			opacity: 0.5,
			cursor: "not-allowed",
			pointer_events: "none",
		}),
		// Color variants
		rule(".selectable.primary", {
			__selectable_background_base: vars.color.primary,
			__selectable_outline_base: vars.color.primary,
		}),
		rule(".selectable.secondary", {
			__selectable_background_base: vars.color.secondary,
			__selectable_outline_base: vars.color.secondary,
		}),
		rule(".selectable.tertiary", {
			__selectable_background_base: vars.color.tertiary,
			__selectable_outline_base: vars.color.tertiary,
		}),
		rule(".selectable.success", {
			__selectable_background_base: vars.color.success,
			__selectable_outline_base: vars.color.success,
		}),
		rule(".selectable.info", {
			__selectable_background_base: vars.color.info,
			__selectable_outline_base: vars.color.info,
		}),
		rule(".selectable.warning", {
			__selectable_background_base: vars.color.warning,
			__selectable_outline_base: vars.color.warning,
		}),
		rule(".selectable.danger", {
			__selectable_background_base: vars.color.danger,
			__selectable_outline_base: vars.color.danger,
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
	// Uses standard variables (--background-*, --text-*, --border-*)
	pill: group(
		rule(".pills", {
			display: "inline-flex",
			flex_wrap: "wrap",
			gap: vars.gap[2],
		}),
		rule(".pill", {
			// Override standard color property variables
			__background_base: vars.color.neutral,
			__background_l: 5,
			__background_c: 5,
			__background_h: 0,
			__background_o: 9,
			__background_delta_l: 0,
			__background_delta_c: 0,
			__background_delta_h: 0,
			__background_delta_o: 0,
			__border_base: vars.color.neutral,
			__border_l: 5,
			__border_c: 5,
			__border_h: 0,
			__border_o: 9,
			__border_delta_l: 0,
			__border_delta_c: 0,
			__border_delta_h: 0,
			__border_delta_o: 0,
			// Text color with WCAG contrast
			__text_base: vars.background.base,
			__text_l: 5,
			__text_c: 5,
			__text_h: 0,
			__text_o: 9,
			__text_delta_l: 0,
			__text_delta_c: 0,
			__text_delta_h: 0,
			__text_delta_o: 0,
			// WCAG contrast calculation (threshold 5.5: bg-5 → paper, bg-6 → ink)
			// bg_is_dark: 1 if background is dark, 0 if light
			__bg_is_dark: `clamp(0, (5.5 - ${vars.background.l} - ${vars.background.delta.l}) * 10, 1)`,
			// Direction-aware text luminosity: in dark mode (direction=-1), invert the mapping
			__text_l_min: `calc((1 + ${vars.color.l.direction} * (2 * ${vars.bg.is.dark} - 1)) / 2 * 8)`,
			__text_l_max: `calc(1 + (1 + ${vars.color.l.direction} * (2 * ${vars.bg.is.dark} - 1)) / 2 * 8)`,
			// Styling
			display: "inline-flex",
			cursor: "pointer",
			user_select: "none",
			__border_width: "2px",
			border_width: vars.border.width,
			border_style: "solid",
			border_color: computeColor(PROPS[2]),
			background_color: computeColor(PROPS[0]),
			color: computeColor(PROPS[1], true),
			padding: `${vars.pad[0]} ${vars.pad[2]}`,
			transition_property:
				"background-color,color,border-color,outline-color,border-width,outline-width,opacity,transform,box-shadow",
			transition_duration: "150ms",
			__border_radius: "2lh",
			border_radius: vars.border.radius,
		}),
		rule(".pill:not(.outline)", {
			__border_l: vars.background.l,
		}),
		rule(hover(".pill"), {
			__background_delta_l: DELTA.hover,
		}),
		rule(hover(".pill:not(.outline)"), {
			__border_delta_l: DELTA.hover,
		}),
		rule(hover(".pill.outline"), {
			__background_o: SELECTABLE.opacity.hover,
			__text_delta_l: DELTA.hover * OUTLINE_AMP,
			__border_delta_l: DELTA.hover * OUTLINE_AMP,
		}),
		rule([".pill.selected", ".pill[data-selected=true]"], {
			__background_delta_l: DELTA.selected,
		}),
		rule(
			[
				".pill:not(.outline).selected",
				".pill:not(.outline)[data-selected=true]",
			],
			{
				__border_delta_l: DELTA.selected,
			},
		),
		rule([".pill.outline.selected", ".pill.outline[data-selected=true]"], {
			__background_o: SELECTABLE.opacity.selected,
			__text_delta_l: DELTA.selected * OUTLINE_AMP,
			__border_delta_l: DELTA.selected * OUTLINE_AMP,
		}),
		rule([".pill:active", ".pill.active"], {
			__background_delta_l: DELTA.active,
		}),
		rule([".pill:not(.outline):active", ".pill:not(.outline).active"], {
			__border_delta_l: DELTA.active,
		}),
		rule([".pill.outline:active", ".pill.outline.active"], {
			__background_o: SELECTABLE.opacity.active,
			__text_delta_l: DELTA.active * OUTLINE_AMP,
			__border_delta_l: DELTA.active * OUTLINE_AMP,
		}),
		rule([".pill:disabled", ".pill.disabled"], {
			opacity: 0.5,
			cursor: "not-allowed",
		}),
		// Color variants
		rule(".pill.primary", {
			__background_base: vars.color.primary,
			__border_base: vars.color.primary,
			__text_base: vars.color.primary,
		}),
		rule(".pill.secondary", {
			__background_base: vars.color.secondary,
			__border_base: vars.color.secondary,
			__text_base: vars.color.secondary,
		}),
		rule(".pill.tertiary", {
			__background_base: vars.color.tertiary,
			__border_base: vars.color.tertiary,
			__text_base: vars.color.tertiary,
		}),
		rule(".pill.success", {
			__background_base: vars.color.success,
			__border_base: vars.color.success,
			__text_base: vars.color.success,
		}),
		rule(".pill.info", {
			__background_base: vars.color.info,
			__border_base: vars.color.info,
			__text_base: vars.color.info,
		}),
		rule(".pill.warning", {
			__background_base: vars.color.warning,
			__border_base: vars.color.warning,
			__text_base: vars.color.warning,
		}),
		rule(".pill.danger", {
			__background_base: vars.color.danger,
			__border_base: vars.color.danger,
			__text_base: vars.color.danger,
		}),
		// Style variants
		// Outline: text uses accent color exactly (disable WCAG constraints)
		// Border at 80% opacity to match text visual weight
		rule(".pill.outline", {
			__background_o: 0,
			__text_l: vars.background.l,
			__text_l_min: 0,
			__text_l_max: 9,
			__border_l: vars.background.l,
			__border_o: 7.2,
		}),
		// Contrast: force maximum text contrast (0.05 or 0.95 luminosity)
		// For filled pills: text uses ink color at extreme luminosity based on bg darkness
		rule(".pill.contrast:not(.outline)", {
			// Use ink as base for true black/white contrast
			__text_base: vars.color.ink,
			__text_c: 0,
			// Force text to 0 (ink) or 9 (paper) with no range - direction aware
			__text_l_min: `calc((1 + ${vars.color.l.direction} * (2 * ${vars.bg.is.dark} - 1)) / 2 * 9)`,
			__text_l_max: `calc((1 + ${vars.color.l.direction} * (2 * ${vars.bg.is.dark} - 1)) / 2 * 9)`,
		}),
		// For outline pills: shift text/border halfway toward paper/ink
		// In light mode (direction=1): darken by moving toward ink (delta-l negative)
		// In dark mode (direction=-1): lighten by moving toward paper (delta-l positive)
		rule(".pill.outline.contrast", {
			__text_delta_l: `calc(var(--color-l-direction) * -2.25)`,
			__border_delta_l: `calc(var(--color-l-direction) * -2.25)`,
		}),
	),

	// ------------------------------------------------------------------------
	//
	// BUTTON
	//
	// ------------------------------------------------------------------------
	// Button elements are primary interactive controls.
	button: group(
		rule(["button", ".button"], {
			// Font settings (button-specific, kept as __button_font_*)
			__button_font_family: vars.font.controls.family,
			__button_font_line: vars.font.controls.line,
			__button_font_weight: vars.font.controls.weight,
			__button_font_size: vars.font.controls.size,
			// Override standard color property variables
			__background_base: vars.color.neutral,
			__background_l: 5,
			__background_c: 5,
			__background_h: 0,
			__background_o: 9,
			__background_delta_l: 0,
			__background_delta_c: 0,
			__background_delta_h: 0,
			__background_delta_o: 0,
			__border_base: vars.color.neutral,
			__border_l: 4,
			__border_c: 5,
			__border_h: 0,
			__border_o: 9,
			__border_delta_l: 0,
			__border_delta_c: 0,
			__border_delta_h: 0,
			__border_delta_o: 0,
			__outline_base: vars.color.neutral,
			__outline_l: 5,
			__outline_c: 5,
			__outline_h: 0,
			__outline_o: 0,
			__outline_delta_l: 0,
			__outline_delta_c: 0,
			__outline_delta_h: 0,
			__outline_delta_o: 0,
			// Text color with WCAG contrast
			__text_base: vars.background.base,
			__text_l: 5,
			__text_c: 5,
			__text_h: 0,
			__text_o: 9,
			__text_delta_l: 0,
			__text_delta_c: 0,
			__text_delta_h: 0,
			__text_delta_o: 0,
			// WCAG contrast calculation (threshold 5.5: bg-5 → paper, bg-6 → ink)
			// bg_is_dark: 1 if background is dark, 0 if light
			__bg_is_dark: `clamp(0, (5.5 - ${vars.background.l} - ${vars.background.delta.l}) * 10, 1)`,
			// Direction-aware text luminosity: in dark mode (direction=-1), invert the mapping
			// effective_is_dark = (1 + direction * (2 * bg_is_dark - 1)) / 2
			// This gives: dir=1,dark=1→1, dir=1,dark=0→0, dir=-1,dark=1→0, dir=-1,dark=0→1
			__text_l_min: `calc((1 + ${vars.color.l.direction} * (2 * ${vars.bg.is.dark} - 1)) / 2 * 8)`,
			__text_l_max: `calc(1 + (1 + ${vars.color.l.direction} * (2 * ${vars.bg.is.dark} - 1)) / 2 * 8)`,
			// Computed colors
			border_width: "1px",
			border_style: "solid",
			border_color: computeColor(PROPS[2]),
			outline_width: "0px",
			outline_style: "solid",
			outline_color: computeColor(PROPS[3]),
			background_color: computeColor(PROPS[0]),
			color: computeColor(PROPS[1], true),
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
			__background_o: 0,
			__border_o: 0,
			// Direction-aware: near paper (8.5) in light mode, near ink (0.5) in dark mode
			__background_l: `calc(4.5 + var(--color-l-direction) * 4)`,
			// Text follows background-l so bg-* modifiers control text luminosity
			__text_l: vars.background.l,
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
		rule(["button.primary", ".button.primary"], {
			__background_base: vars.color.primary,
			__border_base: vars.color.primary,
			__outline_base: vars.color.primary,
			__text_base: vars.color.primary,
		}),
		rule(["button.secondary", ".button.secondary"], {
			__background_base: vars.color.secondary,
			__border_base: vars.color.secondary,
			__outline_base: vars.color.secondary,
			__text_base: vars.color.secondary,
		}),
		rule(["button.tertiary", ".button.tertiary"], {
			__background_base: vars.color.tertiary,
			__border_base: vars.color.tertiary,
			__outline_base: vars.color.tertiary,
			__text_base: vars.color.tertiary,
		}),
		rule(["button.success", ".button.success"], {
			__background_base: vars.color.success,
			__border_base: vars.color.success,
			__outline_base: vars.color.success,
			__text_base: vars.color.success,
		}),
		rule(["button.info", ".button.info"], {
			__background_base: vars.color.info,
			__border_base: vars.color.info,
			__outline_base: vars.color.info,
			__text_base: vars.color.info,
		}),
		rule(["button.warning", ".button.warning"], {
			__background_base: vars.color.warning,
			__border_base: vars.color.warning,
			__outline_base: vars.color.warning,
			__text_base: vars.color.warning,
		}),
		rule(["button.danger", ".button.danger"], {
			__background_base: vars.color.danger,
			__border_base: vars.color.danger,
			__outline_base: vars.color.danger,
			__text_base: vars.color.danger,
		}),
		rule(["button.shadow", ".button.shadow"], {
			box_shadow: `${vars.shadow.x} ${vars.shadow.y} ${vars.shadow.spread} ${vars.shadow.color}`,
		}),
		rule(["button.blank", ".button.blank"], {
			__background_o: 0,
			__border_o: 0,
			__outline_o: 0,
			// Direction-aware: near paper (8.5) in light mode, near ink (0.5) in dark mode
			__background_l: `calc(4.5 + var(--color-l-direction) * 4)`,
			// Text follows background-l so bg-* modifiers control text luminosity
			__text_l: vars.background.l,
			__text_l_min: 0,
			__text_l_max: 9,
		}),
		// Outline: text uses accent color exactly (disable WCAG constraints)
		// Border at 80% opacity to match text visual weight
		rule(["button.outline", ".button.outline"], {
			__background_o: 0,
			__border_o: 7.2,
			// Direction-aware: near paper (8.5) in light mode, near ink (0.5) in dark mode
			__background_l: `calc(4.5 + var(--color-l-direction) * 4)`,
			// Text and border follow background-l so bg-* modifiers control their luminosity
			__text_l: vars.background.l,
			__text_l_min: 0,
			__text_l_max: 9,
			__border_l: vars.background.l,
			border_width: "2px",
		}),
		// State: focus
		rule(mods(["button", ".button"], "focus", "focus-within"), {
			__outline_o: FOCUS.opacity,
			outline_width: FOCUS.width,
		}),
		// State: hover (filled)
		rule(
			hover(
				"button:not(.outline):not(.blank):not(.icon)",
				".button:not(.outline):not(.blank):not(.icon)",
			),
			{
				__background_delta_l: DELTA.hover,
				__border_delta_l: DELTA.hover,
			},
		),
		// State: hover (outline/blank/icon - amplified for visibility, with background)
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
				__background_o: SELECTABLE.opacity.hover,
				__background_delta_l: DELTA.hover,
				__border_delta_l: DELTA.hover * OUTLINE_AMP,
				__text_delta_l: DELTA.hover * OUTLINE_AMP,
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
				__background_delta_l: DELTA.selected,
				__border_delta_l: DELTA.selected,
			},
		),
		rule(
			[
				"button:not(.outline):not(.blank):not(.icon)[data-selected=true]",
				".button:not(.outline):not(.blank):not(.icon)[data-selected=true]",
			],
			{
				__background_delta_l: DELTA.selected,
				__border_delta_l: DELTA.selected,
			},
		),
		// State: selected (outline/blank/icon - amplified for visibility, with background)
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
				__background_o: SELECTABLE.opacity.selected,
				__background_delta_l: DELTA.selected,
				__border_delta_l: DELTA.selected * OUTLINE_AMP,
				__text_delta_l: DELTA.selected * OUTLINE_AMP,
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
				__background_o: SELECTABLE.opacity.selected,
				__background_delta_l: DELTA.selected,
				__border_delta_l: DELTA.selected * OUTLINE_AMP,
				__text_delta_l: DELTA.selected * OUTLINE_AMP,
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
				__background_delta_l: DELTA.active,
				__border_delta_l: DELTA.active,
			},
		),
		// State: active (outline/blank/icon - amplified for visibility, with background)
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
				__background_o: SELECTABLE.opacity.active,
				__background_delta_l: DELTA.active,
				__border_delta_l: DELTA.active * OUTLINE_AMP,
				__text_delta_l: DELTA.active * OUTLINE_AMP,
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
		// Contrast: force maximum text contrast (0.05 or 0.95 luminosity)
		// For filled buttons: text uses ink color at extreme luminosity based on bg darkness
		rule(
			[
				"button.contrast:not(.outline):not(.blank):not(.icon)",
				".button.contrast:not(.outline):not(.blank):not(.icon)",
			],
			{
				// Use ink as base for true black/white contrast
				__text_base: vars.color.ink,
				__text_c: 0,
				// Force text to 0 (ink) or 9 (paper) with no range - direction aware
				__text_l_min: `calc((1 + ${vars.color.l.direction} * (2 * ${vars.bg.is.dark} - 1)) / 2 * 9)`,
				__text_l_max: `calc((1 + ${vars.color.l.direction} * (2 * ${vars.bg.is.dark} - 1)) / 2 * 9)`,
			},
		),
		// For outline/blank/icon buttons: shift text/border toward ink for more contrast
		// Uses base l instead of delta-l so hover/active states can still add deltas
		// In light mode: 8.5 - 2.25 = 6.25 (darker text)
		// In dark mode: 0.5 + 2.25 = 2.75 (lighter text)
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
				__text_l: `calc(var(--background-l) - var(--color-l-direction) * 2.25)`,
				__border_l: `calc(var(--background-l) - var(--color-l-direction) * 2.25)`,
			},
		),
	),

	// ------------------------------------------------------------------------
	//
	// SELECTOR
	//
	// ------------------------------------------------------------------------
	// Selector elements are grouped buttons for mutually exclusive choices.
	selector: group(
		rule(".selector", {
			// Font settings (selector-specific)
			__selector_font_family: vars.font.controls.family,
			__selector_font_line: vars.font.controls.line,
			__selector_font_weight: vars.font.controls.weight,
			// Override standard color property variables
			__background_base: vars.color.neutral,
			__background_l: 5,
			__background_c: 5,
			__background_h: 0,
			__background_o: 0,
			__background_delta_l: 0,
			__background_delta_c: 0,
			__background_delta_h: 0,
			__background_delta_o: 0,
			__border_base: vars.color.neutral,
			__border_l: 5,
			__border_c: 5,
			__border_h: 0,
			__border_o: 9,
			__border_delta_l: 0,
			__border_delta_c: 0,
			__border_delta_h: 0,
			__border_delta_o: 0,
			// Text color with WCAG contrast
			__text_base: vars.background.base,
			__text_l: 5,
			__text_c: 5,
			__text_h: 0,
			__text_o: 9,
			__text_delta_l: 0,
			__text_delta_c: 0,
			__text_delta_h: 0,
			__text_delta_o: 0,
			// WCAG contrast calculation (threshold 5.5: bg-5 → paper, bg-6 → ink)
			__bg_is_dark: `clamp(0, (5.5 - ${vars.background.l} - ${vars.background.delta.l}) * 10, 1)`,
			// Direction-aware text luminosity: in dark mode (direction=-1), invert the mapping
			__text_l_min: `calc((1 + ${vars.color.l.direction} * (2 * ${vars.bg.is.dark} - 1)) / 2 * 8)`,
			__text_l_max: `calc(1 + (1 + ${vars.color.l.direction} * (2 * ${vars.bg.is.dark} - 1)) / 2 * 8)`,
			// Container styling
			display: "inline-flex",
			gap: "0",
			flex_wrap: "nowrap",
		}),
		rule([".selector > li", ".selector > .item"], {
			// Styling
			border_width: "1px",
			border_style: "solid",
			border_color: computeColor(PROPS[2]),
			background_color: computeColor(PROPS[0]),
			color: computeColor(PROPS[1], true),
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
			__background_o: SELECTABLE.opacity.hover,
			__background_delta_l: DELTA.hover,
			z_index: "1",
		}),
		rule(
			mods(
				[".selector > li", ".selector > .item"],
				"focus",
				"focus-within",
			),
			{
				outline: `${FOCUS.width} solid oklch(from ${vars.background.base} 0.5 0.15 h / ${FOCUS.opacity / 9})`,
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
				__background_delta_l: DELTA.selected,
				// Text contrast is now automatic via WCAG calculation
				z_index: "2",
			},
		),
		rule(mods([".selector > li", ".selector > .item"], "active"), {
			__background_o: SELECTABLE.opacity.active,
			__background_delta_l: DELTA.active,
		}),
		// Color variants
		rule(".selector.primary", {
			__background_base: vars.color.primary,
			__border_base: vars.color.primary,
			__text_base: vars.color.primary,
		}),
		rule(".selector.secondary", {
			__background_base: vars.color.secondary,
			__border_base: vars.color.secondary,
			__text_base: vars.color.secondary,
		}),
		rule(".selector.tertiary", {
			__background_base: vars.color.tertiary,
			__border_base: vars.color.tertiary,
			__text_base: vars.color.tertiary,
		}),
		rule(".selector.success", {
			__background_base: vars.color.success,
			__border_base: vars.color.success,
			__text_base: vars.color.success,
		}),
		rule(".selector.info", {
			__background_base: vars.color.info,
			__border_base: vars.color.info,
			__text_base: vars.color.info,
		}),
		rule(".selector.warning", {
			__background_base: vars.color.warning,
			__border_base: vars.color.warning,
			__text_base: vars.color.warning,
		}),
		rule(".selector.danger", {
			__background_base: vars.color.danger,
			__border_base: vars.color.danger,
			__text_base: vars.color.danger,
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
	// Input elements are text entry fields. They use their own namespaced
	// variables (--input-*) to avoid affecting child elements.
	// Text color has WCAG-adaptive contrast based on input background.
	// Neutral inputs have paper background at 0.9 opacity; colored inputs
	// have a light tint of their semantic color.
	input: group(
		rule([".input", "input", "textarea", ".textarea"], {
			// Font settings (input-specific)
			__input_font_family: vars.font.controls.family,
			__input_font_line: vars.font.controls.line,
			__input_font_weight: vars.font.controls.weight,
			__input_font_size: vars.font.controls.size,
			// Input-specific background variables (paper at 0.9 opacity per spec)
			__input_background_base: vars.color.paper,
			__input_background_l: 9,
			__input_background_c: 0,
			__input_background_h: 0,
			__input_background_o: INPUT.backgroundOpacity,
			__input_background_delta_l: 0,
			__input_background_delta_c: 0,
			__input_background_delta_h: 0,
			__input_background_delta_o: 0,
			// Input-specific border variables
			__input_border_base: vars.color.neutral,
			__input_border_l: 4,
			__input_border_c: 5,
			__input_border_h: 0,
			__input_border_o: 9,
			__input_border_delta_l: 0,
			__input_border_delta_c: 0,
			__input_border_delta_h: 0,
			__input_border_delta_o: 0,
			// Input-specific outline variables
			__input_outline_base: vars.color.neutral,
			__input_outline_l: 5,
			__input_outline_c: 5,
			__input_outline_h: 0,
			__input_outline_o: 0,
			__input_outline_delta_l: 0,
			__input_outline_delta_c: 0,
			__input_outline_delta_h: 0,
			__input_outline_delta_o: 0,
			// Input-specific text variables
			__input_text_base: vars.color.text,
			__input_text_l: 5,
			__input_text_c: 0,
			__input_text_h: 0,
			__input_text_o: 9,
			__input_text_delta_l: 0,
			__input_text_delta_c: 0,
			__input_text_delta_h: 0,
			__input_text_delta_o: 0,
			// WCAG contrast calculation for input
			__input_is_dark: `clamp(0, ${vars.color.l.direction} * (4.5 - ${vars.input_background.l} - ${vars.input_background.delta.l}) * 10 + 0.5, 1)`,
			// Direction-aware input text luminosity: in dark mode (direction=-1), invert the mapping
			__input_text_l_min: `calc((1 + ${vars.color.l.direction} * (2 * ${vars.input.is.dark} - 1)) / 2 * 7)`,
			__input_text_l_max: `calc(2 + (1 + ${vars.color.l.direction} * (2 * ${vars.input.is.dark} - 1)) / 2 * 7)`,
			// Computed styling using direction-aware colors
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
				__input_outline_o: FOCUS.opacity,
				outline_width: FOCUS.width,
			},
		),
		// State: hover
		rule(hover("input", ".input", "textarea", ".textarea"), {
			__input_border_delta_l: DELTA.hover,
		}),
		// State: active
		rule(mods(["input", ".input", "textarea", ".textarea"], "active"), {
			__input_border_delta_l: DELTA.active,
		}),
		// State: disabled
		rule(mods(["input", ".input", "textarea", ".textarea"], "disabled"), {
			opacity: 0.5,
			cursor: "not-allowed",
		}),
		// Color variants - light tint of semantic color
		rule(cross(["input", ".input", "textarea", ".textarea"], ".primary"), {
			__input_border_base: vars.color.primary,
			__input_outline_base: vars.color.primary,
			__input_background_base: vars.color.primary,
			__input_background_l: 8,
			__input_background_c: 2,
			__input_text_base: vars.color.primary,
		}),
		rule(
			cross(["input", ".input", "textarea", ".textarea"], ".secondary"),
			{
				__input_border_base: vars.color.secondary,
				__input_outline_base: vars.color.secondary,
				__input_background_base: vars.color.secondary,
				__input_background_l: 8,
				__input_background_c: 2,
				__input_text_base: vars.color.secondary,
			},
		),
		rule(cross(["input", ".input", "textarea", ".textarea"], ".tertiary"), {
			__input_border_base: vars.color.tertiary,
			__input_outline_base: vars.color.tertiary,
			__input_background_base: vars.color.tertiary,
			__input_background_l: 8,
			__input_background_c: 2,
			__input_text_base: vars.color.tertiary,
		}),
		rule(cross(["input", ".input", "textarea", ".textarea"], ".success"), {
			__input_border_base: vars.color.success,
			__input_outline_base: vars.color.success,
			__input_background_base: vars.color.success,
			__input_background_l: 8,
			__input_background_c: 2,
			__input_text_base: vars.color.success,
		}),
		rule(cross(["input", ".input", "textarea", ".textarea"], ".info"), {
			__input_border_base: vars.color.info,
			__input_outline_base: vars.color.info,
			__input_background_base: vars.color.info,
			__input_background_l: 8,
			__input_background_c: 2,
			__input_text_base: vars.color.info,
		}),
		rule(cross(["input", ".input", "textarea", ".textarea"], ".warning"), {
			__input_border_base: vars.color.warning,
			__input_outline_base: vars.color.warning,
			__input_background_base: vars.color.warning,
			__input_background_l: 8,
			__input_background_c: 2,
			__input_text_base: vars.color.warning,
		}),
		rule(
			cross(
				["input", ".input", "textarea", ".textarea"],
				".error",
				".danger",
			),
			{
				__input_border_base: vars.color.danger,
				__input_outline_base: vars.color.danger,
				__input_background_base: vars.color.danger,
				__input_background_l: 8,
				__input_background_c: 2,
				__input_text_base: vars.color.danger,
			},
		),
		rule(cross(["input", ".input", "textarea", ".textarea"], ".missing"), {
			__input_border_base: vars.color.danger,
			__input_outline_base: vars.color.danger,
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
				__input_background_o: 0,
				__input_border_o: 0,
				__input_outline_o: 0,
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
	// Toggle elements are on/off switches.
	// Note: Toggle keeps its own __toggle_* variables as it has unique behavior
	// (track + slider with different color needs).
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
			// Toggle-specific color variables (kept separate due to unique behavior)
			__toggle_background_base: vars.color.neutral,
			__toggle_background_l: 7,
			__toggle_background_c: 2,
			__toggle_background_h: 0,
			__toggle_background_o: 9,
			__toggle_background_delta_l: 0,
			__toggle_background_delta_c: 0,
			__toggle_background_delta_h: 0,
			__toggle_background_delta_o: 0,
			__toggle_border_base: vars.color.neutral,
			__toggle_border_l: 5,
			__toggle_border_c: 5,
			__toggle_border_h: 0,
			__toggle_border_o: 9,
			__toggle_border_delta_l: 0,
			__toggle_border_delta_c: 0,
			__toggle_border_delta_h: 0,
			__toggle_border_delta_o: 0,
			// Active color (when checked)
			__toggle_active_base: vars.color.primary,
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
			__toggle_background_delta_l: DELTA.hover,
		}),
		rule(
			[
				".toggle.checked",
				".toggle[data-checked=true]",
				"input[type=checkbox]:checked + .toggle",
			],
			{
				__toggle_background_base: vars.toggle.active.base,
				__toggle_background_l: 5,
				__toggle_border_base: vars.toggle.active.base,
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
		rule(".toggle.secondary", {
			__toggle_active_base: vars.color.secondary,
		}),
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
