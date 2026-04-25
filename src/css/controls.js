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
			font_size: vars.control.font.size.or(vars.font.controls.size),
			line_height: vars.control.font.line.or(vars.font.controls.line),
			font_weight: vars.control.font.weight.or(vars.font.controls.weight),
			// Box
			display: "inline-flex",
			box_sizing: "border-box",
			padding: vars.control.padding.or("0.5em 1em"),
			margin: vars.control.margin.or("0em"),
			// Border
			border_width: vars.control.border.size.or("1px"),
			border_color: colors.mixed(
				vars.control.color.base.or(vars.color.neutral),
				vars.control.color.tint.or(vars.color.paper),
				vars.control.color.blend.or(0.8),
				vars.control.color.alpha.or(0.8),
			),
			// Outline
			outline_width: "0px",
			outline_color: colors.mixed(
				vars.control.color.base.or(vars.color.neutral),
				vars.control.color.tint.or(vars.color.paper),
				vars.control.color.blend.or(0.8),
				vars.control.color.alpha.or(0.5),
			),
		}),
		// Color variants
		...colors.names.map((color) =>
			css.rule(css.mods("&", color), {
				__control_color_base: vars.color[color],
			}),
		),
		// Focus ring
		css.rule(css.mods("&", "focus"), {
			outline_width: vars.control.outline.width.or("2px"),
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
				vars.control.color.base.or(vars.color.neutral),
				vars.control.color.ink.or(vars.color.ink),
				1.0,
				1.0,
			),
			// Border
			border_radius: vars.action.border.radius.or("0.25em"),
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
				color: colors.mixed(
					vars.control.color.base.or(vars.color.neutral),
					vars.control.color.tint.or(vars.color.ink),
					vars.control.color.blend.or(0.9),
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
		}),

		// Icon variant
		css.rule(css.mods("&", "icon"), {
			aspect_ratio: "1/1",
			box_sizing: "border-box",
			justify_content: "center",
			align_items: "center",
			height: "2em",
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
			background_color: colors.mixed(
				vars.control.color.base.or(vars.color.neutral),
				vars.control.color.tint.or(vars.color.paper),
				0.1,
				0.9,
			),
			// Border blended to paper, fully opaque
			border_color: colors.mixed(
				vars.control.color.base.or(vars.color.neutral),
				vars.control.color.tint.or(vars.color.paper),
				0.5,
				1.0,
			),
		}),
		// Focus state, reinforcing opacity
		css.rule(css.mods("&", "focus"), {
			background_color: colors.mixed(
				vars.control.color.base.or(vars.color.neutral),
				vars.control.color.tint.or(vars.color.paper),
				0.1,
				1.0,
			),
			// Border focus, less tinted
			border_color: colors.mixed(
				vars.control.color.base.or(vars.color.neutral),
				vars.control.color.tint.or(vars.color.paper),
				0.7,
				1.0,
			),
		}),
		// Hover state, reinforcing opacity
		css.rule(css.mods("&", "hover"), {
			// Same as focus
			background_color: colors.mixed(
				vars.control.color.base.or(vars.color.neutral),
				vars.control.color.tint.or(vars.color.paper),
				0.1,
				1.0,
			),
			// But slighly less tinted border
			border_color: colors.mixed(
				vars.control.color.base.or(vars.color.neutral),
				vars.control.color.tint.or(vars.color.paper),
				0.8,
				1.0,
			),
		}),
		// Active state, typically a blend to ink
		css.rule(css.mods("&", "active"), {
			border_color: colors.mixed(
				vars.control.color.base.or(vars.color.neutral),
				vars.control.color.tint.or(vars.color.paper),
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
		css.nesting(css.mods("&", "ghost"), {
			border_color: "transparent",
		}),

		// Blank variant
		css.rule(css.mods("&", "blank"), {
			background_color: "transparent !important",
			border_color: "transparent !important",
			outline_color: "transparent !important",
		}),
		// Icon variant
		css.rule(css.mods("&", "icon"), {
			aspect_ratio: "1/1",
			box_sizing: "border-box",
			justify_content: "center",
			align_items: "center",
			height: "2em",
		}),
		...rest,
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
		}),
		css.nesting("& > input", {
			display: "none",
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
			color: colors.mixed(
				vars.control.color.base.or(vars.color.neutral),
				vars.control.color.tint.or(vars.color.ink),
				vars.control.color.blend.or(0.1),
				1.0,
			),
			background_color: colors.mixed(
				vars.control.color.base.or(vars.color.neutral),
				vars.control.color.tint.or(vars.color.paper),
				vars.control.color.blend.or(0.9),
				0.9,
			),
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
	selector: selector(),
});
// EOF
