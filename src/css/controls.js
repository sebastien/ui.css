import css, { vars } from "../js/uicss.js";
import colors from "./colors.js";

const control = {
	color: Object.assign(
		(blend = 1.0, opacity = 1.0, tint = vars.color.paper) =>
			colors.mixed(
				control.color.base(),
				control.color.tint(tint),
				control.color.blend(blend),
				control.color.opacity(opacity),
			),
		{
			base: (fallback = vars.color.neutral) =>
				vars.control.color.base.or(fallback),
			tint: (fallback = vars.color.paper) =>
				vars.control.color.tint.or(fallback),
			blend: (fallback = 1.0) => vars.control.color.blend.or(fallback),
			opacity: (fallback = 1.0) => vars.control.color.opacity.or(fallback),
		},
	),
	background: Object.assign(
		(
			blend = 1.0,
			opacity = 1.0,
			tint = vars.color.paper,
			base = vars.color.neutral,
		) =>
			colors.mixed(
				control.background.base(base),
				control.background.tint(tint),
				control.background.blend(blend),
				control.background.opacity(opacity),
			),
		{
			base: (fallback = vars.color.neutral) =>
				vars.control.background.base.or(vars.control.color.base, fallback),
			tint: (fallback = vars.color.paper) =>
				vars.control.background.tint.or(vars.control.color.tint, fallback),
			blend: (fallback = 1.0) => vars.control.background.blend.or(fallback),
			opacity: (fallback = 1.0) => vars.control.background.opacity.or(fallback),
		},
	),
	border: Object.assign(
		(blend = 0.8, opacity = 0.8, tint = vars.color.paper) =>
			colors.mixed(
				control.border.base(),
				control.border.tint(tint),
				control.border.blend(blend),
				control.border.opacity(opacity),
			),
		{
			base: (fallback = vars.color.neutral) =>
				vars.control.border.base.or(vars.control.color.base, fallback),
			tint: (fallback = vars.color.paper) =>
				vars.control.border.tint.or(vars.control.color.tint, fallback),
			blend: (fallback = 0.8) => vars.control.border.blend.or(fallback),
			opacity: (fallback = 0.8) =>
				vars.control.border.opacity.or(
					vars.control.color.border.opacity,
					fallback,
				),
		},
	),
	outline: Object.assign(
		(blend = 0.8, opacity = 0.5, tint = vars.color.paper) =>
			colors.mixed(
				control.outline.color.base(vars.color.focus.or(vars.color.neutral)),
				control.outline.color.tint(tint),
				control.outline.color.blend(blend),
				control.outline.color.opacity(opacity),
			),
		{
			color: Object.assign(
				(fallback = vars.color.neutral) =>
					vars.control.outline.color.base.or(vars.control.color.base, fallback),
				{
					base: (fallback = vars.color.neutral) =>
						vars.control.outline.color.base.or(
							vars.control.color.base,
							fallback,
						),
					tint: (fallback = vars.color.paper) =>
						vars.control.outline.color.tint.or(
							vars.control.color.tint,
							fallback,
						),
					blend: (fallback = 0.8) =>
						vars.control.outline.color.blend.or(fallback),
					opacity: (fallback = 0.5) =>
						vars.control.outline.color.opacity.or(
							vars.control.outline.opacity,
							vars.control.color.outline.opacity,
							fallback,
						),
				},
			),
		},
	),
};

const controlContrast = () => `contrast-color(${control.color.base()})`;

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
			white_space: "nowrap",
			text_overflow: "ellipsis",
			// Don't inherit an ancestor's applied --text-color (e.g. body.tx).
			// A local .tx re-sets it; otherwise action color falls back to contrast/accent.
			__text_color: "initial",
			__control_border_tint: vars.control.color.tint.or(vars.color.paper),
			__control_border_blend: 0.8,
			__control_border_opacity: 0.8,
			// Border
			border_width: vars.control.border.width.or("1px"),
			border_color: control.border(),
			// Outline
			outline_width: "0px",
			outline_color: control.outline(),
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
		...colors.semantic.map((color) =>
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
		css.rule(css.mods("&:not(.nofocus)", "focus"), {
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
			border_radius: vars.field.border.radius.or(
				vars.control.border.radius,
				"0.25em",
			),
			field_sizing: "content",
			// Surface follows the page (mode-aware), small tint and transparency
			__control_background_base: vars.color.page.or(vars.color.paper),
			__control_background_tint: vars.color.page.or(vars.color.paper),
			background_color: control.background(0.1, 0.9),
			// Border blended to paper, fully opaque
			border_color: control.border(0.5, 1.0, vars.color.ink),
		}),
		// Color variants
		...colors.semantic.map((color) =>
			css.rule(css.mods("&", color), {
				__control_background_base: vars.color[color].background.or(
					vars.color[color],
				),
			}),
		),
		// Nested inputs are filled
		css.rule(["& > input", "& > textarea"], {
			flex: "1",
		}),
		css.rule("&.bw", {
			__control_background_base: vars.color.paper,
			outline_style: "groove",
		}),
		css.rule("&.white", {
			__control_background_base: vars.color.white,
			__control_background_blend: 1.0,
			__control_background_opacity: 1.0,
		}),
		// Focus state, reinforcing opacity
		css.rule(css.mods("&:not(.nofocus)", "focus"), {
			// Focused background is fully opaque
			__control_background_opacity: 1.0,
			// And border has more of the main color
			__control_border_blend: 0.7,
		}),
		// Hover state, reinforcing opacity
		css.rule(css.mods("&", "hover"), {
			// Same as focus
			__control_background_opacity: 1.0,
			// But even more of the main color
			__control_border_blend: 0.8,
		}),
		// Active state, typically a blend to ink
		css.rule(css.mods("&", "active"), {
			__control_border_blend: 0.9,
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
				// Very faint primary color, transparent by default
				__control_background_blend: 0.1,
				__control_background_opacity: 0,
			},
			css.rule(css.mods("&:not(.nofocus)", "focus", "active"), {
				__control_background_opacity: 0.5,
			}),
		),
		// Blank variant
		css.rule(css.mods("&", "blank"), {
			background: "none !important",
			background_color: "transparent !important",
			border_width: "0px",
			border_color: "transparent !important",
			outline_width: "0px",
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
			// Like ghost
			__control_background_blend: 0.1,
			__control_background_opacity: 0.1,
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
			__control_background_opacity: 0.0,
			__control_background_base: vars.color.neutral.background.or(
				vars.color.neutral,
			),
			// Default styling, background is pure primary color
			background_color: control.background(
				0.75,
				0.0,
				vars.color.tint,
				vars.selectable.bg.or(
					vars.color.neutral.background,
					vars.color.neutral,
				),
			),
		},
		// Color variants
		...colors.semantic.map((color) =>
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
			__control_background_opacity: 0.5,
		}),
		// Active state, typically a blend to ink
		css.rule(css.mods("&", "active"), {
			__control_color_opacity: 0.75,
			__control_background_opacity: 0.75,
		}),
		// Active state, typically a blend to ink
		css.rule(["&.selected"], {
			__control_color_opacity: 0.95,
			__control_background_opacity: 0.95,
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
			// Background tracks the accent by default. --control-background-base is
			// element-scoped: never set it on ancestors, it would defeat variants.
			__control_background_base: vars.control.color.base,
			// Default syling, background is pure primary color
			background_color: control.background(1.0, 1.0, vars.color.ink),
			// Prefer --text-color when .tx / .tx-* utilities set it; otherwise
			// contrast against the accent fill.
			color: `var(--text-color, ${controlContrast()})`,
			// Border
			border_width: vars.action.border.width.or(
				vars.control.border.width,
				"0px",
			),
			border_radius: vars.action.border.radius.or(
				vars.control.border.radius,
				"0.25em",
			),
		}),
		css.rule(css.mods("&", "default"), {
			outline_width: vars.action.outline.width.or(
				vars.control.outline.width,
				"2px",
			),
			outline_color: control.outline(
				0.9,
				vars.action.default.outline.opacity.or(
					vars.control.default.outline.opacity,
					0.8,
				),
				vars.color.ink,
			),
		}),
		// Hover state, typically a blent to paper
		css.rule(css.mods("&", "hover"), {
			background_color: control.background(0.9, 1.0),
		}),
		// Active state, typically a blend to ink
		css.rule(css.mods("&", "active"), {
			background_color: control.background(0.9, 1.0, vars.color.ink),
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
				__control_border_width: vars.border.width.or("2px"),
				// Prefer --text-color from .tx utilities over the accent blend
				color: `var(--text-color, ${control.color(0.5, 1.0, vars.color.ink)})`,
				border_width: vars.control.border.width,
				border_color: control.border(0.9, 0.8, vars.color.ink),
				background_color: control.background(0.9, 0.0),
			},
			css.rule("&:hover, &.hover", {
				background_color: control.background(0.9, 0.1),
			}),
			css.rule("&:active, &.active", {
				background_color: control.background(0.9, 0.2),
			}),
		),
		// Ghost variant, typically no background, unless on hover
		css.nesting(
			css.mods("&", "ghost"),
			{
				__control_default_outline_opacity: 0.2,
				__control_color_border_opacity: 0,
				__control_background_opacity: 0,
				// Transparent fill: text must be the accent (not contrast-color of
				// the accent, which yields white and disappears on light surfaces).
				color: `var(--text-color, ${control.color(1.0, 1.0, vars.color.ink)})`,
				background_color: control.background(1.0, 0),
			},
			css.rule("&:hover, &.hover", {
				__control_background_opacity: 0.25,
			}),
			css.rule("&:active, &.active", {
				__control_background_opacity: 0.35,
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
			width: "2em",
			height: "2em",
		}),
		...rest,
	);
}

function checkbox() {
	// Checked background: the accent softened toward the page surface, with a
	// check mark contrasting against the actual blended background.
	const checkedBg = control.background(0.5, 1.0, vars.color.page.or(vars.color.paper));
	const checkedContrast = `contrast-color(${checkedBg})`;
	return field(
		["input[type=checkbox]:not(.toggle,.selector)", ".checkbox"],
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
			border_color: control.border(0.9, 1.0, vars.color.ink),
			color: control.color(0.0, 1.0, vars.color.ink),
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
		}),
		css.rule(css.mods("&", "checked"), {
			// Checked fill tracks the accent, blended toward the page surface.
			__control_background_base: vars.control.color.base,
			background_color: checkedBg,
			// Keep the border visually aligned with the selected fill.
			border_color: control.border(0.95, 1.0, vars.color.ink),
			color: checkedContrast,
		}),
		css.rule("&:checked::before, &.checked::before", {
			transform: "rotate(45deg) scale(1)",
		}),
		css.rule("&:indeterminate, &.indeterminate", {
			__control_background_base: vars.control.color.base,
			background_color: checkedBg,
			border_color: control.border(0.95, 1.0, vars.color.ink),
			color: checkedContrast,
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
		[":not(.selector) input[type=radio]:not(.toggle)", ".radio"],
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
			color: control.color(0.3, 0.9, vars.color.ink),
		}),
		css.rule("&:checked, &.checked", {
			// Checked fill tracks the accent, not the field surface.
			__control_background_base: vars.control.color.base,
			background_color: control.background(1.0, 1.0, vars.color.ink),
			border_color: control.border(0.95, 1.0, vars.color.ink),
			color: controlContrast(),
		}),
		css.rule("&:checked::before, &.checked::before", {
			color: controlContrast(),
			transform: "scale(1)",
		}),
		css.rule("&:disabled, &.disabled", {
			cursor: "not-allowed",
		}),
	);
}

function toggle() {
	// Inset between track padding-edge and knob; shared by off/on positions.
	const inset = vars.toggle.inset.or("0.125em")
	const height = vars.toggle.height.or("1.5em")
	const width = vars.toggle.width.or("2.75em")
	return field(
		[
			":not(.selector) input[type=checkbox].toggle",
			"input[type=checkbox][role=switch]",
			".toggle",
		],
		css.rule("&", {
			// Box — pin size so field-sizing/min-content cannot shrink the track
			cursor: "pointer",
			position: "relative",
			display: "inline-flex",
			flex_shrink: "0",
			vertical_align: "middle",
			appearance: "none",
			field_sizing: "fixed",
			padding: "0em",
			margin: "0em",
			width: width,
			min_width: width,
			height: height,
			min_height: height,
			// Off track is a visible gray — pin base to neutral (field defaults to paper)
			__control_background_base: vars.control.color.base.or(vars.color.neutral),
			background_color: control.background(0.45, 1.0),
			// Border
			border_radius: vars.toggle.border.radius.or(
				vars.control.border.radius,
				"0.25em",
			),
			border_color: control.border(0.7, 0.85),
			// Outline
			outline_color: control.outline(0.8, 0.6),
			// Transition
			transition: "background-color 140ms ease, outline-color 140ms ease",
		}),
		css.rule("&::before", {
			// Content
			content: '""',
			// Box — height from padding-box; translateY centers (ignores border asymmetry)
			display: "block",
			position: "absolute",
			box_sizing: "border-box",
			top: "50%",
			left: inset,
			height: `calc(100% - 2 * ${inset})`,
			aspect_ratio: "1/1",
			width: "auto",
			transform: "translateY(-50%)",
			// Border — radius matches the track (squared vs pill)
			border_style: "solid",
			border_radius: vars.toggle.knob.border.radius.or("inherit"),
			border_width: vars.toggle.knob.border.width.or(
				vars.control.border.width,
				"1px",
			),
			border_color: control.border(0.55, 0.55, vars.color.ink),
			// Knob is solid paper so it reads on the gray off-track
			__control_background_base: vars.color.paper,
			__control_background_tint: vars.color.paper,
			__control_background_blend: 0,
			background_color: vars.color.paper,
			box_shadow: "0 1px 2px oklch(0% 0 0 / 0.16)",
			transition:
				"left 140ms ease, transform 140ms ease, border-color 140ms ease, box-shadow 140ms ease, border-radius 140ms ease",
		}),

		css.rule("&:checked, &.checked", {
			// Checked track tracks the accent, not the field surface.
			__control_background_base: vars.control.color.base,
			background_color: control.background(control.color.blend(0.9), 1.0),
			border_color: control.border(0.85, 0.9, vars.color.ink),
		}),
		css.rule("&:checked::before, &.checked::before", {
			left: `calc(100% - ${inset})`,
			border_color: control.border(0.5, 0.4, vars.color.ink),
			transform: "translate(-100%, -50%)",
		}),
		// Apple-like pill track + floating circular knob
		css.rule("&.rounded", {
			__toggle_border_radius: "999px",
			__border_radius: "999px",
			border_radius: "999px",
		}),
		css.rule("&.rounded::before", {
			border_width: "0px",
			box_shadow:
				"0 1px 3px oklch(0% 0 0 / 0.22), 0 0 0 0.5px oklch(0% 0 0 / 0.06)",
		}),
		css.rule("&:active::before, &.active::before", {}),
		css.rule("&:checked:active::before, &.checked.active::before", {}),
		css.rule("&:hover, &.hover", {
			background_color: control.background(0.55, 1.0),
		}),
		css.rule("&:checked:hover, &.checked.hover", {
			background_color: control.background(0.82, 1.0, vars.color.ink),
		}),
		css.rule(
			"&:focus:not(.nofocus), &:focus-within:not(.nofocus), &.focus:not(.notfocus)",
			{
				outline_width: vars.control.outline.width.or("2px"),
			},
		),
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
			border_width: vars.control.border.width.or("1px"),
			border_style: "solid",
			// Track stays neutral; only progress and thumb carry the accent.
			// NOTE: no --control-* pins here, the thumb inherits from the track.
			border_color: colors.mixed(vars.color.neutral, vars.color.paper, 0.6, 1.0),
			background_color: colors.mixed(
				vars.color.neutral,
				vars.color.page.or(vars.color.paper),
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
			border_width: vars.control.border.width.or("1px"),
			border_style: "solid",
			border_color: control.border(0.9, 1.0, vars.color.ink),
			background_color: control.background(1.0, 1.0, vars.color.ink),
		}),
		css.rule("&::-moz-range-track", {
			height: vars.range.track.height.or("0.45em"),
			border_radius: vars.range.track.radius.or("999px"),
			border_width: vars.control.border.width.or("1px"),
			border_style: "solid",
			// Track stays neutral; only progress and thumb carry the accent
			border_color: colors.mixed(vars.color.neutral, vars.color.paper, 0.6, 1.0),
			background_color: colors.mixed(
				vars.color.neutral,
				vars.color.page.or(vars.color.paper),
				0.2,
				0.95,
			),
		}),
		css.rule("&::-moz-range-progress", {
			height: vars.range.track.height.or("0.45em"),
			border_radius: vars.range.track.radius.or("999px"),
			background_color: control.background(0.7, 1.0, vars.color.ink),
		}),
		css.rule("&::-moz-range-thumb", {
			width: vars.range.thumb.size.or("1em"),
			height: vars.range.thumb.size.or("1em"),
			border_radius: "100%",
			border_width: vars.control.border.width.or("1px"),
			border_style: "solid",
			border_color: control.border(0.9, 1.0, vars.color.ink),
			background_color: control.background(1.0, 1.0, vars.color.ink),
		}),
		css.rule(
			"&:hover::-webkit-slider-runnable-track, &.hover::-webkit-slider-runnable-track",
			{
				border_color: colors.mixed(vars.color.neutral, vars.color.paper, 0.8, 1.0),
			},
		),
		css.rule(
			"&:focus::-webkit-slider-runnable-track, &:focus-within::-webkit-slider-runnable-track, &.focus::-webkit-slider-runnable-track",
			{
				border_color: colors.mixed(vars.color.neutral, vars.color.paper, 0.85, 1.0),
			},
		),
		// Same selector as the base focus ring so this suppression wins the cascade
		css.rule(css.mods("&:not(.nofocus)", "focus"), {
			outline_width: "0px",
		}),
		css.rule(
			"&:focus::-webkit-slider-thumb, &:focus-within::-webkit-slider-thumb, &.focus::-webkit-slider-thumb",
			{
				box_shadow: `0 0 0 ${vars.control.outline.width.or("2px")} ${control.outline(0.8, 0.5)}`,
			},
		),
		css.rule(
			"&:focus::-moz-range-thumb, &:focus-within::-moz-range-thumb, &.focus::-moz-range-thumb",
			{
				box_shadow: `0 0 0 ${vars.control.outline.width.or("2px")} ${control.outline(0.8, 0.5)}`,
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
		css.nesting("& > input[type]", {
			display: "none !important",
			visibility: "hidden !important",
		}),
		// Labels are rendered as buttons, ghost-like by default ,filled in
		// with a border. The selector may have rounded borders, which is then
		// set at the individual label level.
		css.nesting("& > label", {
			border_radius: "0em",
			padding: "0.5em 1em",
			justify_content: "center",
			cursor: "pointer",
			color: control.color(0.6, 1.0, vars.color.ink),
			__control_background_opacity: 0,
			border_width: vars.control.border.width.or("1px"),
			border_left_width: "0px",
			border_color: control.border(
				control.color.blend(0.9),
				0.8,
				vars.color.ink,
			),
			background_color: control.background(
				control.color.blend(0.9),
				0.0,
				vars.color.paper,
			),
		}),
		css.rule("& > label:hover, & > label.hover", {
			__control_background_opacity: 0.45,
		}),
		css.nesting(
			`&:not(${colors.semantic.map((color) => `.${color}`).join("):not(")}):not(.bw)`,
			{},
			css.rule("& > label", {
				__control_background_opacity: 1.0,
			}),
			css.rule("& > label:hover, & > label.hover", {
				__control_background_opacity: 1.0,
			}),
		),
		// css.rule("&:hover, &.hover", {
		// 	__control_background_blend: 0.9,
		// 	__control_background_opacity: 0.1,
		// }),
		css.rule("&:active, &.active", {
			__control_background_opacity: 0.2,
			background_color: control.background(0.9, 0.2, vars.color.paper),
		}),
		css.rule("& > label:last-child", {
			border_top_right_radius: vars.selector.border.radius.or("0.25em"),
			border_bottom_right_radius: vars.selector.border.radius.or("0.25em"),
		}),
		css.rule("& > input:first-child + label", {
			border_left_width: vars.control.border.width.or("1px"),
			border_top_left_radius: vars.selector.border.radius.or("0.25em"),
			border_bottom_left_radius: vars.selector.border.radius.or("0.25em"),
		}),
		css.nesting("& > input:checked + label", {
			// Checked label tracks the accent, not the field surface.
			__control_background_base: vars.control.color.base,
			color: controlContrast(),
			__control_background_opacity: 0.9,
			background_color: control.background(control.color.blend(0.9), 0.9),
		}),
		css.rule("&.compact > label", {
			padding: "0.35em 0.5em",
		}),
		css.rule("&.stretch", {
			width: "100%",
		}),
		css.rule("&.stretch > label", {
			flex: "1",
		}),
	);
}

function tab() {
	return css.group(
		css.rule([".tab"], {
			cursor: "pointer",
			border: "0",
			border_radius: "0.25rem",
			padding: "0.5em 0.85em",
			font: "inherit",
			color: vars.color.ink,
			background_color: "transparent",
			box_shadow: "none",
			outline: "0",
			appearance: "none",
		}),
		css.rule(["[role=tablist]"], {
			display: "inline-flex",
			gap: "0.15rem",
			padding: "0.25rem",
			border_radius: "0.375rem",
		}),
		css.rule([".tab:hover"], {
			background_color: `color-mix(in oklch, ${vars.color.paper}, transparent 60%)`,
		}),
		css.rule([".tab[aria-selected=true]", ".tab.active"], {
			background_color: vars.color.paper,
			box_shadow: `var(--shadow-x) var(--shadow-y) var(--shadow-spread) var(--shadow-color)`,
		}),
		css.rule([".tab:disabled, .tab.disabled"], {
			opacity: 0.5,
			pointer_events: "none",
		}),
		css.rule([".tab.ghost"], {
			background_color: "transparent",
			border: "0",
		}),
		css.rule([".tab.ghost:hover"], {
			background_color: `color-mix(in oklch, ${vars.color.paper}, transparent 60%)`,
		}),
		css.rule([".tab.ghost[aria-selected=true]", ".tab.ghost.active"], {
			background_color: vars.color.paper,
		}),
	);
}

export default css.named({
	actions: action([
		"button",
		".button",
		"input[type=submit]",
		"input[type=button]",
		"input[type=reset]",
	]),
	fields: field([
		".input",
		// :where() keeps element-level specificity so per-component rules win
		"input:where(:not([type=submit],[type=button],[type=reset],[type=image]):not(.button))",
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
	selectable: selectable(),
	tab: tab(),
	form: css.group(
		css.rule([".field", "[data-field]"], {
			display: "flex",
			flex_direction: "column",
			gap: "0.35rem",
		}),
		css.rule([".hint", "[data-hint]"], {
			font_size: "0.875em",
			color: `color-mix(in oklch, ${vars.color.ink}, ${vars.color.paper} 42%)`,
		}),
		css.rule([".error", "[data-field][aria-invalid=true] .error"], {
			font_size: "0.875em",
			color: vars.color.error,
		}),
		css.rule(".field:has(:is(input, textarea, select)[aria-invalid=true])", {
			color: vars.color.error,
		}),
		css.rule(".group", {
			display: "flex",
			align_items: "stretch",
		}),
		css.rule(".group > :not(:first-child)", {
			border_top_left_radius: "0",
			border_bottom_left_radius: "0",
			margin_left: "-1px",
		}),
		css.rule(".group > :not(:last-child)", {
			border_top_right_radius: "0",
			border_bottom_right_radius: "0",
		}),
	),
});
// EOF
