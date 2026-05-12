import css, { vars } from "../js/uicss.js";
import colors from "./colors.js";

// Base style for all controls, covering font, box, outline and border properties,
// as well as color variants and focus ring.
function base(selector, ...rest) {
	return css.nesting(
		selector,
		{},
		css.rule("&", {
			// Font
			font_family: vars.control.font.family.or(vars.font.controls.family),
			// We inerit font size
			font_size: "inherit",
			line_height: vars.control.font.line.or(vars.font.controls.line),
			font_weight: vars.control.font.weight.or(vars.font.controls.weight),
			// Box
			display: "inline-flex",
			align_items: "center",
			__gap: "0.25em",
			gap: vars.control.gap.or(vars.gap),
			box_sizing: "border-box",
			padding: vars.control.padding.or("0.5em 1em"),
			margin: vars.control.margin.or("0em"),
			__control_border_tint: vars.control.color.tint.or(vars.color.paper),
			// Border
			border_width: vars.control.border.size.or("1px"),
			border_color: colors.mixed(
				vars.control.color.base.or(vars.color.neutral),
				vars.control.border.tint,
				vars.control.color.blend.or(0.8),
				vars.control.border.opacity.or(0.8),
			),
			// Outline
			outline_width: "0px",
			outline_color: colors.mixed(
				vars.control.color.base.or(vars.color.focus, vars.color.neutral),
				vars.control.color.tint.or(vars.color.paper),
				vars.control.color.blend.or(0.8),
				vars.control.outline.opacity.or(0.5),
			),
			// No user select
			user_select: "none",
			transition: [
				"opacity",
				"outline-color",
				"border-color",
				"color",
				"background-color",
			]
				.map(
					(_) =>
						`${_} ${vars.motion.duration.normal} ${vars.motion.easing.emphasized}`,
				)
				.join(", "),
		}),
		css.rule("&.compact", {
			padding: vars.control.padding.or("0.35em 0.5em"),
		}),
		// Color variants
		...colors.names.map((color) =>
			css.rule(css.mods("&", color), {
				__control_color_base: vars.color[color],
			}),
		),
		// Color variants
		css.rule("&.bw", {
			__control_color_base: vars.color.ink,
			__control_color_tint: vars.color.paper,
			__control_color_blend: 1.0,
			__control_color_opacity: 1.0,
			__control_color_border_opacity: 1.0,
			__control_color_outline_opacity: 1.0,
		}),
		// Focus ring
		css.rule(css.mods("&", "focus"), {
			outline_width: vars.control.outline.width.or("2px"),
		}),
		...rest,
	);
}

function field(selector, ...rest) {
	return base(
		selector,
		css.rule("&", {
			padding: vars.field.padding.or("0.5em 0.75em"),
			border_radius: vars.field.border.radius.or("0.25em"),
			// By default, a small tint and a bit of transparency
			__control_background_base: vars.color.paper,
			background_color: colors.mixed(
				vars.control.background.base,
				vars.control.color.tint.or(vars.color.paper),
				0.1,
				0.9,
			),
			// Border blended to paper, fully opaque
			border_color: colors.mixed(
				vars.control.color.base.or(vars.color.neutral),
				vars.control.border.tint,
				0.5,
				1.0,
			),
		}),
		// Color variants
		...colors.names.map((color) =>
			css.rule(css.mods("&", color), {
				__control_background_base: vars.color[color].background.or(
					vars.color[color],
				),
			}),
		),
		css.rule("&.bw", {
			__control_background_base: vars.color.paper,
			outline_style: "groove",
		}),
		// Focus state, reinforcing opacity
		css.rule(css.mods("&", "focus"), {
			background_color: colors.mixed(
				vars.control.background.base.or(vars.color.paper),
				vars.control.color.tint.or(vars.color.paper),
				0.1,
				1.0,
			),
			// Border focus, less tinted
			border_color: colors.mixed(
				vars.control.color.base.or(vars.color.neutral),
				vars.control.border.tint,
				0.7,
				1.0,
			),
		}),
		// Hover state, reinforcing opacity
		css.rule(css.mods("&", "hover"), {
			// Same as focus
			background_color: colors.mixed(
				vars.control.background.base.or(vars.color.paper),
				vars.control.color.tint.or(vars.color.paper),
				0.1,
				1.0,
			),
			// But slighly less tinted border
			border_color: colors.mixed(
				vars.control.color.base.or(vars.color.neutral),
				vars.control.border.tint,
				0.8,
				1.0,
			),
		}),
		// Active state, typically a blend to ink
		css.rule(css.mods("&", "active"), {
			border_color: colors.mixed(
				vars.control.color.base.or(vars.color.neutral),
				vars.control.border.tint,
				0.9,
				1.0,
			),
		}),

		// Disabled variant
		css.rule(css.mods("&", "disabled"), {
			opacity: 0.5,
			pointer_events: "none",
			cursor: "not-allowed",
		}),
		// Ghost variant, typically no background, unless on hover
		css.nesting(
			"&.ghost",
			{
				border_color: "transparent",
				// No outline for ghost
				outline_width: "0px",
				background_color: colors.mixed(
					vars.control.base.or(vars.color.ink),
					vars.control.color.tint.or(vars.color.paper),
					0.1,
					0.0,
				),
			},
			css.rule(css.mods("&", "focus", "active"), {
				background_color: colors.mixed(
					vars.control.base.or(vars.color.ink),
					vars.control.color.tint.or(vars.color.paper),
					0.1,
					0.5,
				),
			}),
		),
		// Blank variant
		css.rule(css.mods("&", "blank"), {
			background_color: "transparent !important",
			border_color: "transparent !important",
			outline_color: "transparent !important",
			padding: "unset",
		}),
		// Icon variant
		css.rule(css.mods("&", "icon"), {
			aspect_ratio: "1/1",
			box_sizing: "border-box",
			justify_content: "center",
			align_items: "center",
			padding: "0.15em",
			height: "2em",
			background_color: colors.mixed(
				vars.control.base.or(vars.color.ink),
				vars.control.color.tint.or(vars.color.paper),
				0.1,
				0.0,
			),
		}),
		...rest,
	);
}
// Base style for all action controls (button-like)
function selectable(...rest) {
	return css.nesting(
		".selectable",
		{
			// Cursor
			cursor: "pointer",
			__control_color_opacity: 0.0,
			__control_background_base: vars.neutral.background.or(vars.neutral),
			// Default styling, background is pure primary color
			background_color: colors.mixed(
				vars.control.background.base.or(
					vars.color.neutral.background,
					vars.color.neutral,
				),
				vars.control.color.tint.or(vars.color.tint),
				vars.control.color.blend.or(0.75),
				vars.control.color.opacity.or(0.0),
			),
		},
		// Color variants
		...colors.names.map((color) =>
			css.rule(css.mods("&", color), {
				__control_color_base: vars.color[color],
				__control_background_base: vars.color[color].background.or(
					vars.color[color],
				),
			}),
		),
		// Hover state, typically a blent to paper
		css.rule(css.mods("&", "hover"), {
			__control_color_opacity: 0.5,
		}),
		// Active state, typically a blend to ink
		css.rule(css.mods("&", "active"), {
			__control_color_opacity: 0.75,
		}),
		// Disabled variant
		css.rule(css.mods("&", "disabled"), {
			background_color: "transparent",
			cursor: "default",
		}),
		...rest,
	);
}

// Base style for all action controls (button-like)
function action(selector, ...rest) {
	return base(
		selector,
		css.rule("&", {
			// Cursor
			cursor: "pointer",
			// Default syling, background is pure primary color
			background_color: colors.mixed(
				vars.control.background.base.or(
					vars.color.neutral.background,
					vars.color.neutral,
				),
				vars.control.color.ink.or(vars.color.ink),
				1.0,
				1.0,
			),
			color: `contrast-color(${vars.control.color.base.or(
				vars.color.neutral,
			)})`,
			// Border
			border_width: vars.action.border.width.or("0px"),
			border_radius: vars.action.border.radius.or("0.25em"),
		}),
		css.rule(css.mods("&", "default"), {
			outline_width: vars.control.outline.width.or("2px"),
			outline_color: colors.mixed(
				vars.control.color.base.or(vars.color.neutral),
				vars.control.color.tint.or(vars.color.ink),
				0.9,
				vars.control.default.outline.opacity.or(0.8),
			),
		}),
		// Hover state, typically a blent to paper
		css.rule(css.mods("&", "hover"), {
			background_color: colors.mixed(
				vars.control.color.base.or(vars.color.neutral),
				vars.control.color.tint.or(vars.color.paper),
				0.9,
				1.0,
			),
		}),
		// Active state, typically a blend to ink
		css.rule(css.mods("&", "active"), {
			background_color: colors.mixed(
				vars.control.color.base.or(vars.color.neutral),
				vars.control.color.tint.or(vars.color.ink),
				0.9,
				1.0,
			),
		}),
		// Disabled variant
		css.rule(css.mods("&", "disabled"), {
			opacity: 0.5,
			pointer_events: "none",
			cursor: "not-allowed",
		}),
		// Outline variant, typically text and border blend to ink,
		// with border a bit more transparent thatn text.
		css.nesting(
			css.mods("&", "outline"),
			{
				__control_default_outline_opacity: 0.4,
				color: colors.mixed(
					vars.control.color.base.or(vars.color.neutral),
					vars.control.color.tint.or(vars.color.ink),
					vars.control.color.blend.or(0.5),
					1.0,
				),
				border_color: colors.mixed(
					vars.control.color.base.or(vars.color.neutral),
					vars.control.color.tint.or(vars.color.ink),
					vars.control.color.blend.or(0.9),
					0.8,
				),
				background_color: colors.mixed(
					vars.control.color.base.or(vars.color.neutral),
					vars.control.color.tint.or(vars.color.paper),
					vars.control.color.blend.or(0.9),
					0.0,
				),
			},
			css.rule("&:hover, &.hover", {
				background_color: colors.mixed(
					vars.control.color.base.or(vars.color.neutral),
					vars.control.color.tint.or(vars.color.paper),
					0.9,
					0.1,
				),
			}),
			css.rule("&:active, &.active", {
				background_color: colors.mixed(
					vars.control.color.base.or(vars.color.neutral),
					vars.control.color.tint.or(vars.color.paper),
					0.9,
					0.2,
				),
			}),
		),
		// Ghost variant, typically no background, unless on hover
		css.nesting(
			css.mods("&", "ghost"),
			{
				__control_color_opacity: 0,
				__control_default_outline_opacity: 0.2,
				__control_color_border_opacity: 0,
				background_color: colors.mix(vars.control.color),
			},
			css.rule("&:hover, &.hover", {
				__control_color_opacity: 0.25,
				background_color: colors.mix(vars.control.color),
			}),
			css.rule("&:active, &.active", {
				__control_color_opacity: 0.35,
				background_color: colors.mix(vars.control.color),
			}),
		),

		// Blank variant
		css.rule(css.mods("&", "blank"), {
			background_color: "transparent !important",
			border_color: "transparent !important",
			outline_color: "transparent !important",
			padding: "unset",
		}),

		// Icon variant
		css.rule(css.mods("&", "icon"), {
			aspect_ratio: "1/1",
			box_sizing: "border-box",
			justify_content: "center",
			align_items: "center",
			padding: "0.25em",
		}),
		...rest,
	);
}

function checkbox() {
	return field(
		["input[type=checkbox]:not(.toggle)", ".checkbox"],
		css.rule("&", {
			appearance: "none",
			padding: "0em",
			margin: "0em",
			aspect_ratio: "1/1",
			width: vars.checkbox.size.or("1.125em"),
			place_content: "center",
			display: "inline-grid",
			vertical_align: "middle",
			__control_border_tint: vars.color.ink,
			border_radius: vars.checkbox.border.radius.or("0.2em"),
			cursor: "pointer",
			border_color: colors.mixed(
				vars.control.color.base.or(vars.color.neutral),
				vars.control.border.tint,
				0.9,
				1.0,
			),
			color: colors.mixed(
				vars.control.color.base.or(vars.color.neutral),
				vars.color.ink,
				0.0,
				1.0,
			),
		}),
		// Checkbox content is rendered with a pseudo element, which is scaled up when checked or indeterminate.
		css.rule("&::before", {
			content: '""',
			box_sizing: "border-box",
			width: "0.32em",
			height: "0.62em",
			border_style: "solid",
			border_width: "0 0.14em 0.14em 0",
			transform: "rotate(45deg) scale(0)",
			transform_origin: "center",
			color: colors.mixed(
				vars.control.color.base.or(vars.color.neutral),
				vars.color.ink,
				0.3,
				0.9,
			),
		}),
		css.rule(css.mods("&", "checked"), {
			// Full color when checked
			background_color: colors.mixed(
				vars.control.color.base.or(vars.color.neutral),
				vars.control.tint,
				0.8,
				1.0,
			),
			// Slightly darker border when checked
			border_color: colors.mixed(
				vars.control.color.base.or(vars.color.neutral),
				vars.control.border.tint,
				0.8,
				1.0,
			),
		}),
		css.rule("&:checked::before, &.checked::before", {
			transform: "rotate(45deg) scale(1)",
		}),
		css.rule("&:indeterminate, &.indeterminate", {
			background_color: colors.mixed(
				vars.control.color.base.or(vars.color.neutral),
				vars.control.tint,
				0.9,
				1.0,
			),
			border_color: colors.mixed(
				vars.control.color.base.or(vars.color.neutral),
				vars.control.border.tint,
				0.9,
				1.0,
			),
		}),
		css.rule("&:indeterminate::before, &.indeterminate::before", {
			width: "0.6em",
			height: "0.14em",
			border_width: "0",
			background_color: "currentColor",
			transform: "scale(1)",
		}),
		css.rule("&:disabled, &.disabled", {
			cursor: "not-allowed",
		}),
	);
}

function radio() {
	return field(
		["input[type=radio]", ".radio"],
		css.rule("&", {
			appearance: "none",
			padding: "0em",
			margin: "0em",
			width: vars.radio.size.or("1.125em"),
			height: vars.radio.size.or("1.125em"),
			min_width: vars.radio.size.or("1.125em"),
			min_height: vars.radio.size.or("1.125em"),
			place_content: "center",
			display: "inline-grid",
			vertical_align: "middle",
			border_radius: "100%",
			cursor: "pointer",
		}),
		css.rule("&::before", {
			content: '""',
			width: vars.radio.dot.size.or("0.5em"),
			height: vars.radio.dot.size.or("0.5em"),
			border_radius: "100%",
			background_color: "currentColor",
			transform: "scale(0)",
			transform_origin: "center",
			color: colors.mixed(
				vars.control.color.base.or(vars.color.neutral),
				vars.control.color.tint.or(vars.color.ink),
				0.3,
				0.9,
			),
		}),
		css.rule("&:checked, &.checked", {
			background_color: colors.mixed(
				vars.control.color.base.or(vars.color.neutral),
				vars.control.color.tint.or(vars.color.ink),
				1.0,
				1.0,
			),
			border_color: colors.mixed(
				vars.control.color.base.or(vars.color.neutral),
				vars.control.color.tint.or(vars.color.ink),
				0.95,
				1.0,
			),
			color: colors.mixed(
				vars.control.color.base.or(vars.color.neutral),
				vars.control.color.tint.or(vars.color.paper),
				0.0,
				1.0,
			),
		}),
		css.rule("&:checked::before, &.checked::before", {
			transform: "scale(1)",
		}),
		css.rule("&:disabled, &.disabled", {
			cursor: "not-allowed",
		}),
	);
}

function toggle() {
	return field(
		["input[type=checkbox].toggle", ".toggle"],
		css.rule("&", {
			// Box
			cursor: "pointer",
			position: "relative",
			display: "inline-flex",
			vertical_align: "middle",
			appearance: "none",
			padding: "0em",
			margin: "0em",
			width: vars.toggle.width.or("2.5em"),
			height: vars.toggle.height.or("1.5em"),
			// Background
			background_color: colors.mixed(
				vars.control.color.base.or(vars.color.neutral),
				vars.control.color.tint.or(vars.color.paper),
				0.0,
				0.95,
			),
			// Border
			border_radius: vars.control.border.radius.or("0.25em"),
			border_color: colors.mixed(
				vars.color.neutral,
				vars.color.paper,
				0.8,
				0.9,
			),
			// Outline
			outline_color: colors.mixed(
				vars.control.color.base.or(vars.color.neutral),
				vars.control.color.tint.or(vars.color.paper),
				0.8,
				0.6,
			),
			// Transition
			transition: "background-color 140ms ease, outline-color 140ms ease",
		}),
		css.rule("&::before", {
			// Content
			content: '""',
			// Box
			display: "block",
			position: "absolute",
			top: "2px",
			bottom: "2px",
			left: "2px",
			aspect_ratio: "1/1",
			// Border
			border_style: "solid",
			border_radius: vars.toggle.knob.border.radius.or(
				vars.control.border.radius,
				"0.25em",
			),
			border_width: vars.toggle.knob.border.width.or(
				vars.control.border.width,
				"1px",
			),
			border_color: colors.mixed(vars.color.neutral, vars.color.ink, 0.8, 0.6),
			// Background
			background_color: colors.mixed(
				vars.control.color.base.or(vars.color.neutral),
				vars.control.color.tint.or(vars.color.paper),
				0.7,
				1.0,
			),
			transition: "all 140ms ease",
		}),

		css.rule("&:checked, &.checked", {
			background_color: colors.mixed(
				vars.control.color.base.or(vars.color.neutral),
				vars.control.color.tint.or(vars.color.paper),
				vars.control.color.blend.or(0.9),
				0.9,
			),
		}),
		css.rule("&:checked::before, &.checked::before", {
			left: "calc(100% - 2px)",
			border_color: colors.mixed(vars.color.neutral, vars.color.ink, 0.7, 0.8),
			transform: "translateX(-100%)",
		}),
		css.rule("&:active::before, &.active::before", {}),
		css.rule("&:checked:active::before, &.checked.active::before", {}),
		css.rule("&:hover, &.hover", {
			background_color: colors.mixed(
				vars.control.color.base.or(vars.color.neutral),
				vars.control.color.tint.or(vars.color.paper),
				0.35,
				1.0,
			),
		}),
		css.rule("&:checked:hover, &.checked.hover", {
			background_color: colors.mixed(
				vars.control.color.base.or(vars.color.neutral),
				vars.control.color.tint.or(vars.color.ink),
				0.82,
				1.0,
			),
		}),
		css.rule("&:focus, &:focus-within, &.focus", {
			outline_width: vars.control.outline.width.or("2px"),
		}),
		css.rule("&:disabled, &.disabled", {
			cursor: "not-allowed",
		}),
	);
}

function range() {
	return field(
		["input[type=range]", ".range"],
		css.rule("&", {
			appearance: "none",
			padding: "0em",
			margin: "0em",
			border_width: "0px",
			background: "transparent",
			height: vars.range.height.or("1.5em"),
			min_height: vars.range.height.or("1.5em"),
			cursor: "pointer",
		}),
		css.rule("&::-webkit-slider-runnable-track", {
			height: vars.range.track.height.or("0.45em"),
			border_radius: vars.range.track.radius.or("999px"),
			border_width: vars.control.border.size.or("1px"),
			border_style: "solid",
			border_color: colors.mixed(
				vars.control.color.base.or(vars.color.neutral),
				vars.control.color.tint.or(vars.color.paper),
				0.6,
				1.0,
			),
			background_color: colors.mixed(
				vars.control.color.base.or(vars.color.neutral),
				vars.control.color.tint.or(vars.color.paper),
				0.2,
				0.95,
			),
		}),
		css.rule("&::-webkit-slider-thumb", {
			appearance: "none",
			margin_top: `calc(( ${vars.range.track.height.or("0.45em")} - ${vars.range.thumb.size.or("1em")} ) / 2)`,
			width: vars.range.thumb.size.or("1em"),
			height: vars.range.thumb.size.or("1em"),
			border_radius: "100%",
			border_width: vars.control.border.size.or("1px"),
			border_style: "solid",
			border_color: colors.mixed(
				vars.control.color.base.or(vars.color.neutral),
				vars.control.color.tint.or(vars.color.ink),
				0.9,
				1.0,
			),
			background_color: colors.mixed(
				vars.control.color.base.or(vars.color.neutral),
				vars.control.color.tint.or(vars.color.ink),
				1.0,
				1.0,
			),
		}),
		css.rule("&::-moz-range-track", {
			height: vars.range.track.height.or("0.45em"),
			border_radius: vars.range.track.radius.or("999px"),
			border_width: vars.control.border.size.or("1px"),
			border_style: "solid",
			border_color: colors.mixed(
				vars.control.color.base.or(vars.color.neutral),
				vars.control.color.tint.or(vars.color.paper),
				0.6,
				1.0,
			),
			background_color: colors.mixed(
				vars.control.color.base.or(vars.color.neutral),
				vars.control.color.tint.or(vars.color.paper),
				0.2,
				0.95,
			),
		}),
		css.rule("&::-moz-range-progress", {
			height: vars.range.track.height.or("0.45em"),
			border_radius: vars.range.track.radius.or("999px"),
			background_color: colors.mixed(
				vars.control.color.base.or(vars.color.neutral),
				vars.control.color.tint.or(vars.color.ink),
				0.7,
				1.0,
			),
		}),
		css.rule("&::-moz-range-thumb", {
			width: vars.range.thumb.size.or("1em"),
			height: vars.range.thumb.size.or("1em"),
			border_radius: "100%",
			border_width: vars.control.border.size.or("1px"),
			border_style: "solid",
			border_color: colors.mixed(
				vars.control.color.base.or(vars.color.neutral),
				vars.control.color.tint.or(vars.color.ink),
				0.9,
				1.0,
			),
			background_color: colors.mixed(
				vars.control.color.base.or(vars.color.neutral),
				vars.control.color.tint.or(vars.color.ink),
				1.0,
				1.0,
			),
		}),
		css.rule(
			"&:hover::-webkit-slider-runnable-track, &.hover::-webkit-slider-runnable-track",
			{
				border_color: colors.mixed(
					vars.control.color.base.or(vars.color.neutral),
					vars.control.color.tint.or(vars.color.paper),
					0.8,
					1.0,
				),
			},
		),
		css.rule(
			"&:focus::-webkit-slider-runnable-track, &:focus-within::-webkit-slider-runnable-track, &.focus::-webkit-slider-runnable-track",
			{
				border_color: colors.mixed(
					vars.control.color.base.or(vars.color.neutral),
					vars.control.color.tint.or(vars.color.paper),
					0.85,
					1.0,
				),
			},
		),
		css.rule("&:focus, &:focus-within, &.focus", {
			outline_width: "0px",
		}),
		css.rule(
			"&:focus::-webkit-slider-thumb, &:focus-within::-webkit-slider-thumb, &.focus::-webkit-slider-thumb",
			{
				box_shadow: `0 0 0 ${vars.control.outline.width.or("2px")} ${colors.mixed(
					vars.control.color.base.or(vars.color.neutral),
					vars.control.color.tint.or(vars.color.paper),
					0.8,
					0.5,
				)}`,
			},
		),
		css.rule(
			"&:focus::-moz-range-thumb, &:focus-within::-moz-range-thumb, &.focus::-moz-range-thumb",
			{
				box_shadow: `0 0 0 ${vars.control.outline.width.or("2px")} ${colors.mixed(
					vars.control.color.base.or(vars.color.neutral),
					vars.control.color.tint.or(vars.color.paper),
					0.8,
					0.5,
				)}`,
			},
		),
		css.rule("&:active::-webkit-slider-thumb, &.active::-webkit-slider-thumb", {
			transform: "scale(0.95)",
		}),
		css.rule("&:disabled, &.disabled", {
			cursor: "not-allowed",
		}),
	);
}
function select() {
	return field(
		["select", ".select"],
		css.rule("&", {
			appearance: "none",
			cursor: "pointer",
			padding_right: vars.select.icon.gap.or("2.2em"),
			background_repeat: "no-repeat",
			background_position: "right 0.75em center",
			background_size: vars.select.icon.size.or("0.65em 0.45em"),
		}),
		css.rule("&:disabled, &.disabled", {
			cursor: "not-allowed",
		}),
	);
}

function selector() {
	// Selectors are like a `div` with `input + label`
	return field(
		".selector",
		css.rule("&", {
			display: "inline-flex",
			width: "fit-content",
			align_items: "center",
			padding: "0em",
			border_width: "0px",
			text_align: "center",
			gap: "0em",
		}),
		css.nesting("& > input", {
			display: "none !important",
		}),
		// Labels are rendered as buttons, ghost-like by default ,filled in
		// with a border. The selector may have rounded borders, which is then
		// set at the individual label level.
		css.nesting(
			"& > label",
			{
				border_radius: "0em",
				padding: "0.5em 1em",
				cursor: "pointer",
				color: colors.mixed(
					vars.control.color.base.or(vars.color.neutral),
					vars.control.color.tint.or(vars.color.ink),
					vars.control.color.blend.or(0.6),
					1.0,
				),
				border_width: vars.control.border.size.or("1px"),
				border_left_width: "0px",
				border_color: colors.mixed(
					vars.control.color.base.or(vars.color.neutral),
					vars.control.color.tint.or(vars.color.ink),
					vars.control.color.blend.or(0.9),
					0.8,
				),
				background_color: colors.mixed(
					vars.control.background.base.or(
						vars.color.neutral.background,
						vars.color.neutral,
					),
					vars.control.color.tint.or(vars.color.paper),
					vars.control.color.blend.or(0.9),
					0.0,
				),
			},

			css.rule("&:hover, &.hover", {
				background_color: colors.mixed(
					vars.control.background.base.or(
						vars.color.neutral.background,
						vars.color.neutral,
					),
					vars.control.color.tint.or(vars.color.paper),
					0.9,
					0.1,
				),
			}),
			css.rule("&:active, &.active", {
				background_color: colors.mixed(
					vars.control.background.base.or(
						vars.color.neutral.background,
						vars.color.neutral,
					),
					vars.control.color.tint.or(vars.color.paper),
					0.9,
					0.2,
				),
			}),
		),
		css.rule("& > label:last-child", {
			border_top_right_radius: vars.selector.border.radius.or("0.25em"),
			border_bottom_right_radius: vars.selector.border.radius.or("0.25em"),
		}),
		css.rule("& > input:first-child + label", {
			border_left_width: vars.control.border.size.or("1px"),
			border_top_left_radius: vars.selector.border.radius.or("0.25em"),
			border_bottom_left_radius: vars.selector.border.radius.or("0.25em"),
		}),
		css.nesting("& > input:checked + label", {
			color: `contrast-color(${vars.control.color.base.or(
				vars.color.neutral,
			)})`,
			background_color: colors.mixed(
				vars.control.color.base.or(vars.color.neutral),
				vars.control.color.tint.or(vars.color.paper),
				vars.control.color.blend.or(0.9),
				0.9,
			),
		}),
		css.rule("&.compact > label", {
			padding: "0.35em 0.5em",
		}),
	);
}

export default css.named({
	actions: action(["button", ".button"]),
	fields: field([
		".input",
		"input",
		".input",
		"textarea",
		".textarea",
		"select",
		".select",
		".selector",
	]),
	checkbox: checkbox(),
	radio: radio(),
	range: range(),
	toggle: toggle(),
	select: select(),
	selector: selector(),
	selectabe: selectable(),
});
// EOF
