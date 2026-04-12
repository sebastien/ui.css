import {
	contrast,
	cross,
	group,
	mods,
	named,
	rule,
	vars,
} from "../js/littlecss.js";
import { colormix, SEMANTIC } from "./colors.js";

const SIZES = [
	"smallest",
	"smaller",
	"small",
	"regular",
	"large",
	"larger",
	"largest",
];

const STATES = [
	"",
	":hover",
	"hover",
	":active",
	".active",
	":focus",
	":focus-within",
	".focus",
];

function colorvars(name, mode = "color") {
	return {
		[`--${name}-current-color-base`]: vars[name][mode].base,
		[`--${name}-current-color-tint`]: vars[name][mode].tint,
		[`--${name}-current-color-blend`]: vars[name][mode].blend,
		[`--${name}-current-color-opacity`]: vars[name][mode].opacity,
		// TODO: That should be the color mix
		[`--${name}-current-color`]: vars[name].current.color.base,
	};
}

function state(name, mode = "color") {
	return {
		[`--${name}-current-color-base`]: vars[name][mode].base,
		[`--${name}-current-color-tint`]: vars[name][mode].tint,
		[`--${name}-current-color-blend`]: vars[name][mode].blend,
		[`--${name}-current-color-opacity`]: vars[name][mode].opacity,
		// TODO: That should be the color mix
		[`--${name}-current-color`]: vars[name].current.color.base,
	};
}

function bare(name, variant) {
	return rule(
		[
			...cross(name, [".bare"]),
			...cross(
				name,
				[".bare"],
				STATES.filter((_) => _),
			),
		],
		{
			margin: "0px",
			padding: "0px",
			background: "transparent",
			border: "0px solid transparent",
			outline: "0px solid transparent",
			border_radius: "0px",
			box_shadow: "none",
			transition: "none",
			appearance: "none",
			[`__${variant}_color_opacity`]: "100%",
		},
	);
}

// ----------------------------------------------------------------------------
//
// BUTTON
//
// ----------------------------------------------------------------------------
function button(colors) {
	const name = ["button", ".button"];
	const selectable = [".selectable"];
	const controls = [...name, ...selectable];
	return group(
		rule(name, {
			cursor: "pointer",
			padding: "0.5em 1em",
			outline: "0px solid transparent",
			border: "0px solid transparent",
			transition:
				"background 0.2s ease, color 0.2s ease, border 0.2s ease, outline-color 0.2s ease",
			font_family: vars.button.font.family,
			line_height: vars.button.font.line,
			font_weight: vars.button.font.weight,
			font_size: vars.button.font.size,
			display: "inline-flex",
			justify_content: "center",
			align_items: "center",
			...colorvars("button", "color"),
			background: "var(--button-current-color)",
		}),
		rule(selectable, {
			cursor: "pointer",
			outline: "0px solid transparent",
			border: "0px solid transparent",
			transition:
				"background 0.2s ease, color 0.2s ease, border 0.2s ease, outline-color 0.2s ease",
			font_family: vars.selectable.font.family,
			line_height: vars.selectable.font.line,
			font_weight: vars.selectable.font.weight,
			font_size: vars.selectable.font.size,
			justify_content: "center",
			align_items: "center",
			...colorvars("selectable", "color"),
			background: "transparent",
			color: "inherit",
		}),
		// ====================================================================
		// COLORS
		// ====================================================================
		...["primary", "secondary", "tertiary", "success", "warning", "danger"].map(
			(variant) =>
				rule(mods(name, variant), {
					__button_color_base: vars.button.color[variant],
					background: "var(--button-current-color)",
					color: contrast("var(--button-current-color)"),
				}),
		),
		...["primary", "secondary", "tertiary", "success", "warning", "danger"].map(
			(variant) =>
				rule(mods(selectable, variant), {
					__selectable_color_base: vars.selectable.color[variant],
				}),
		),
		// ====================================================================
		// STATES
		// ====================================================================

		rule(cross(name, [":focus-visible", ".focus"]), {
			outline_width: "2px",
			outline_color: colormix(
				vars.button.current.color,
				vars.button.focus.tint,
				vars.button.focus.blend,
				vars.button.focus.opacity,
			),
		}),
		rule(cross(selectable, [":focus-visible", ".focus"]), {
			outline_width: "2px",
			outline_color: colormix(
				vars.selectable.current.color,
				vars.selectable.focus.tint,
				vars.selectable.focus.blend,
				vars.selectable.focus.opacity,
			),
		}),
		rule(mods(name, "active"), {
			background: colormix(
				vars.button.current.color,
				vars.button.active.tint,
				vars.button.active.blend,
				vars.button.active.opacity,
			),
		}),
		rule(mods(name, "hover"), {
			background: colormix(
				vars.button.current.color,
				vars.button.hover.tint,
				vars.button.hover.blend,
				vars.button.hover.opacity,
			),
		}),
		rule(mods(name, "selected"), {
			background: colormix(
				vars.button.current.color,
				vars.button.selected.tint,
				vars.button.selected.blend,
				vars.button.selected.opacity,
			),
		}),
		rule(mods(selectable, "hover"), {
			background: colormix(
				vars.selectable.current.color,
				vars.selectable.hover.tint,
				vars.selectable.hover.blend,
				vars.selectable.hover.opacity,
			),
		}),
		rule(mods(selectable, "active"), {
			background: colormix(
				vars.selectable.current.color,
				vars.selectable.active.tint,
				vars.selectable.active.blend,
				vars.selectable.active.opacity,
			),
		}),
		rule(mods(selectable, "selected"), {
			background: colormix(
				vars.selectable.current.color,
				vars.selectable.selected.tint,
				vars.selectable.selected.blend,
				vars.selectable.selected.opacity,
			),
		}),
		rule(mods(name, "disabled"), {
			color: contrast("var(--button-current-color)"),
			cursor: "default",
			background: colormix(
				vars.button.current.color,
				vars.color.paper,
				"50%",
				"75%",
			),
		}),
		rule(mods(selectable, "disabled"), {
			cursor: "default",
			background: "transparent",
			color: "inherit",
		}),
		// ====================================================================
		// STYLE
		// ====================================================================
		rule(mods(controls, "default"), {
			border_width: "3px",
			border_color: vars.button.current.color,
			font_weight: "bold",
		}),
		rule(mods(selectable, "default"), {
			border_width: "3px",
			border_color: vars.selectable.current.color,
			font_weight: "bold",
		}),
		rule(mods(controls, "outline"), {
			border_width: "1px",
			background: "transparent",
			border_color: colormix(
				vars.button.current.color,
				vars.color.ink,
				"80%",
				"100%",
			),
			color: colormix(vars.button.current.color, vars.color.ink, "50%", "100%"),
		}),
		rule(mods(selectable, "outline"), {
			border_width: "1px",
			background: "transparent",
			border_color: colormix(
				vars.selectable.current.color,
				vars.color.ink,
				"80%",
				"100%",
			),
			color: colormix(
				vars.selectable.current.color,
				vars.color.ink,
				"50%",
				"100%",
			),
		}),
		rule(mods(name, "ghost"), {
			background: "transparent",
			border_color: "transparent",
			color: colormix(vars.button.current.color, vars.color.ink, "50%", "100%"),
		}),
		rule(cross(controls, [".blank"]), {
			background: "transparent",
			__button_color_opacity: "50%",
		}),
		rule(cross(selectable, [".blank"]), {
			background: "transparent",
			__selectable_color_opacity: "50%",
		}),
		rule(cross(name, [".icon"]), {
			__button_color_opacity: "50%",
			background: "transparent",
			padding: "0.25em",
			width: "1em",
			height: "1em",
			aspect_ratio: "1",
			box_sizing: "content-box",
		}),
		rule(cross(selectable, [".icon"]), {
			__selectable_color_opacity: "50%",
			background: "transparent",
		}),
		rule(cross(name, [".outline", ".icon"], [":hover", ".hover"]), {
			background: colormix(
				vars.button.current.color,
				vars.button.hover.tint,
				vars.button.hover.blend,
				vars.button.hover.opacity,
			),
		}),
		rule(cross(name, [".outline", ".icon"], [":active", ".active"]), {
			background: colormix(
				vars.button.current.color,
				vars.button.active.tint,
				vars.button.active.blend,
				vars.button.active.opacity,
			),
		}),
		rule(cross(name, [".outline", ".icon"], [".selected"]), {
			background: colormix(
				vars.button.current.color,
				vars.button.selected.tint,
				vars.button.selected.blend,
				vars.button.selected.opacity,
			),
		}),
		rule(cross(name, [".ghost"], [":hover", ".hover"]), {
			background: colormix(
				vars.button.current.color,
				vars.button.hover.tint,
				vars.button.hover.blend,
				vars.button.hover.opacity,
			),
		}),
		rule(cross(name, [".ghost"], [":active", ".active"]), {
			background: colormix(
				vars.button.current.color,
				vars.button.active.tint,
				vars.button.active.blend,
				vars.button.active.opacity,
			),
		}),
		rule(cross(name, [".ghost"], [".selected"]), {
			background: colormix(
				vars.button.current.color,
				vars.button.selected.tint,
				vars.button.selected.blend,
				vars.button.selected.opacity,
			),
		}),
		rule(cross(selectable, [".outline", ".icon"], [":hover", ".hover"]), {
			background: colormix(
				vars.selectable.current.color,
				vars.selectable.hover.tint,
				vars.selectable.hover.blend,
				vars.selectable.hover.opacity,
			),
		}),
		rule(cross(selectable, [".outline", ".icon"], [":active", ".active"]), {
			background: colormix(
				vars.selectable.current.color,
				vars.selectable.active.tint,
				vars.selectable.active.blend,
				vars.selectable.active.opacity,
			),
		}),
		rule(cross(selectable, [".outline", ".icon"], [".selected"]), {
			background: colormix(
				vars.selectable.current.color,
				vars.selectable.selected.tint,
				vars.selectable.selected.blend,
				vars.selectable.selected.opacity,
			),
		}),
		bare(controls, "button"),
	);
}

// ----------------------------------------------------------------------------
//
// INPUT
//
// ----------------------------------------------------------------------------
function input(colors) {
	const name = ["input", ".input"];
	return group(
		rule(name, {
			padding: "0.75em",
			outline: "0px solid transparent",
			border: "0px solid transparent",
			transition:
				"background 0.2s ease, color 0.2s ease, border 0.2s ease, outline-color 0.2s ease",
			font_family: vars.input.font.family,
			line_height: vars.input.font.line,
			font_weight: vars.input.font.weight,
			font_size: vars.input.font.size,
			...colorvars("input", "color"),
			display: "inline-flex",
			justify_content: "stretch",
			align_items: "center",
			border_width: "1px",
			border_color: colormix(
				vars.input.current.color,
				vars.color.paper,
				"25%",
				"90%",
			),
			background: colormix(
				vars.input.current.color,
				vars.color.paper,
				"5%",
				"100%",
			),
		}),
		// ====================================================================
		// COLORS
		// ====================================================================
		...colors.map((variant) =>
			rule(mods(name, variant), {
				__input_color_base: vars.input.color[variant],
				background: colormix(
					vars.input.current.color,
					vars.color.paper,
					"20%",
					"100%",
				),
				color: contrast(vars.input.current.color),
			}),
		),
		// ====================================================================
		// STATES
		// ====================================================================
		rule(mods(name, "hover"), {}),
		rule(mods(name, "focus"), {
			outline_width: "2px",
			outline_color: colormix(
				vars.input.current.color,
				vars.input.focus.tint,
				vars.input.focus.blend,
				vars.input.focus.opacity,
			),
			background_color: colormix(
				vars.input.current.color,
				vars.color.paper,
				"0%",
				"100%",
			),
		}),
		rule(mods(name, "active"), {
			border_color: colormix(
				vars.input.current.color,
				vars.input.active.tint,
				vars.input.active.blend,
				vars.input.active.opacity,
			),
		}),
		rule(mods(name, "disabled"), {
			cursor: "default",
			background: colormix(vars.colo.neutral, vars.color.paper, "50%", "75%"),
			color: colormix(vars.color.neutral, vars.color.ink, "50%", "75%"),
		}),
		// ====================================================================
		// STYLE
		// ====================================================================
		rule(mods(name, "default"), {
			border_width: "3px",
			border_color: vars.input.current.color,
			font_weight: "bold",
		}),
		rule(mods(name, "outline"), {
			border_width: "1px",
			background: "transparent",
			border_color: colormix(
				vars.input.current.color,
				vars.color.paper,
				"80%",
				"50%",
			),
			color: colormix(vars.input.current.color, vars.color.ink, "50%", "100%"),
		}),
		rule(mods(name, "ghost"), {
			background: "transparent",
			border_color: "transparent",
			color: colormix(vars.input.current.color, vars.color.ink, "50%", "100%"),
		}),
		rule(cross(name, [".blank"]), {
			background: "transparent",
			border_color: "transparent",
			__input_color_opacity: "50%",
		}),
		rule(cross(name, [".icon"]), {
			background: "transparent",
			__input_color_opacity: "50%",
			aspect_ratio: "1",
		}),
		bare(name, "input"),
	);
}

// ----------------------------------------------------------------------------
//
// TEXTAREA
//
// ----------------------------------------------------------------------------
function textarea(colors) {
	const name = ["textarea", ".textarea"];
	return group(
		rule(name, {
			padding: "0.75em",
			outline: "0px solid transparent",
			border: "0px solid transparent",
			transition:
				"background 0.2s ease, color 0.2s ease, border 0.2s ease, outline-color 0.2s ease",
			font_family: vars.textarea.font.family,
			line_height: vars.textarea.font.line,
			font_weight: vars.textarea.font.weight,
			font_size: vars.textarea.font.size,
			...colorvars("textarea", "color"),
			border_width: "1px",
			border_color: colormix(
				vars.textarea.current.color,
				vars.color.paper,
				"25%",
				"90%",
			),
			background: colormix(
				vars.textarea.current.color,
				vars.color.paper,
				"5%",
				"100%",
			),
		}),
		// ====================================================================
		// COLORS
		// ====================================================================
		...colors.map((variant) =>
			rule(mods(name, variant), {
				__textarea_color_base: vars.textarea.color[variant],
				background: colormix(
					vars.textarea.current.color,
					vars.color.paper,
					"20%",
					"100%",
				),
				color: contrast(vars.textarea.current.color),
			}),
		),
		// ====================================================================
		// STATES
		// ====================================================================
		rule(mods(name, "hover"), {}),
		rule(mods(name, "focus"), {
			outline_width: "2px",
			outline_color: colormix(
				vars.textarea.current.color,
				vars.textarea.focus.tint,
				vars.textarea.focus.blend,
				vars.textarea.focus.opacity,
			),
			background_color: colormix(
				vars.textarea.current.color,
				vars.color.paper,
				"0%",
				"100%",
			),
		}),
		rule(mods(name, "active"), {
			border_color: colormix(
				vars.textarea.current.color,
				vars.textarea.active.tint,
				vars.textarea.active.blend,
				vars.textarea.active.opacity,
			),
		}),
		rule(mods(name, "disabled"), {
			cursor: "default",
			background: colormix(vars.colo.neutral, vars.color.paper, "50%", "75%"),
			color: colormix(vars.color.neutral, vars.color.ink, "50%", "75%"),
		}),
		// ====================================================================
		// STYLE
		// ====================================================================
		rule(mods(name, "default"), {
			border_width: "3px",
			border_color: vars.textarea.current.color,
			font_weight: "bold",
		}),
		rule(mods(name, "outline"), {
			border_width: "1px",
			background: "transparent",
			border_color: colormix(
				vars.textarea.current.color,
				vars.color.paper,
				"80%",
				"50%",
			),
			color: colormix(
				vars.textarea.current.color,
				vars.color.ink,
				"50%",
				"100%",
			),
		}),
		rule(mods(name, "ghost"), {
			background: "transparent",
			border_color: "transparent",
			color: colormix(
				vars.textarea.current.color,
				vars.color.ink,
				"50%",
				"100%",
			),
		}),
		rule(cross(name, [".blank"]), {
			background: "transparent",
			border_color: "transparent",
			__textarea_color_opacity: "50%",
		}),
		rule(cross(name, [".icon"]), {
			background: "transparent",
			__textarea_color_opacity: "50%",
			aspect_ratio: "1",
		}),
		bare(name, "textarea"),
	);
}

// ----------------------------------------------------------------------------
//
// CHECKBOX
//
// ----------------------------------------------------------------------------
function checkbox(colors) {
	const name = ['input[type="checkbox"]', ".checkbox"];
	return group(
		rule(name, {
			cursor: "pointer",
			padding: "0.65em",
			outline: "0px solid transparent",
			border: "0px solid transparent",
			transition:
				"background 0.2s ease, color 0.2s ease, border 0.2s ease, outline-color 0.2s ease",
			font_family: vars.checkbox.font.family,
			line_height: vars.checkbox.font.line,
			font_weight: vars.checkbox.font.weight,
			font_size: vars.checkbox.font.size,
			...colorvars("checkbox", "color"),
			border_width: "1px",
			border_color: colormix(
				vars.checkbox.current.color,
				vars.color.paper,
				"25%",
				"90%",
			),
			background: colormix(
				vars.checkbox.current.color,
				vars.color.paper,
				"5%",
				"100%",
			),
		}),
		// ====================================================================
		// COLORS
		// ====================================================================
		...colors.map((variant) =>
			rule(mods(name, variant), {
				__checkbox_color_base: vars.checkbox.color[variant],
				background: colormix(
					vars.checkbox.current.color,
					vars.color.paper,
					"20%",
					"100%",
				),
				color: contrast(vars.checkbox.current.color),
			}),
		),
		// ====================================================================
		// STATES
		// ====================================================================
		rule(mods(name, "hover"), {}),
		rule(mods(name, "focus"), {
			outline_width: "2px",
			outline_color: colormix(
				vars.checkbox.current.color,
				vars.checkbox.focus.tint,
				vars.checkbox.focus.blend,
				vars.checkbox.focus.opacity,
			),
			background_color: colormix(
				vars.checkbox.current.color,
				vars.color.paper,
				"0%",
				"100%",
			),
		}),
		rule(mods(name, "active"), {
			border_color: colormix(
				vars.checkbox.current.color,
				vars.checkbox.active.tint,
				vars.checkbox.active.blend,
				vars.checkbox.active.opacity,
			),
		}),
		rule(mods(name, "disabled"), {
			cursor: "default",
			background: colormix(vars.colo.neutral, vars.color.paper, "50%", "75%"),
			color: colormix(vars.color.neutral, vars.color.ink, "50%", "75%"),
		}),
		// ====================================================================
		// CHECKED & PARTIAL CONTENT
		// ====================================================================
		rule(
			name.map((n) => `${n}:checked`),
			{
				appearance: "none",
				position: "relative",
			},
		),
		rule(
			name.map((n) => `${n}:checked::after`),
			{
				content: vars.checkbox.content.checked,
				position: "absolute",
				top: "50%",
				left: "50%",
				transform: "translate(-50%, -50%)",
				font_size: "1.2em",
				color: contrast(vars.checkbox.current.color),
			},
		),
		rule(
			name.map((n) => `${n}:indeterminate`),
			{
				appearance: "none",
				position: "relative",
			},
		),
		rule(
			name.map((n) => `${n}:indeterminate::after`),
			{
				content: vars.checkbox.content.partial,
				position: "absolute",
				top: "50%",
				left: "50%",
				transform: "translate(-50%, -50%)",
				font_size: "1.2em",
				color: contrast(vars.checkbox.current.color),
			},
		),
		// ====================================================================
		// STYLE
		// ====================================================================
		rule(mods(name, "default"), {
			border_width: "3px",
			border_color: vars.checkbox.current.color,
			font_weight: "bold",
		}),
		rule(mods(name, "outline"), {
			border_width: "1px",
			background: "transparent",
			border_color: colormix(
				vars.checkbox.current.color,
				vars.color.paper,
				"80%",
				"50%",
			),
			color: colormix(
				vars.checkbox.current.color,
				vars.color.ink,
				"50%",
				"100%",
			),
		}),
		rule(cross(name, [".blank"]), {
			background: "transparent",
			border_color: "transparent",
			__checkbox_color_opacity: "50%",
		}),
		rule(cross(name, [".icon"]), {
			background: "transparent",
			__checkbox_color_opacity: "50%",
			aspect_ratio: "1",
		}),
		bare(name, "checkbox"),
	);
}

// ----------------------------------------------------------------------------
//
// RADIO
//
// ----------------------------------------------------------------------------
function radio(colors) {
	const name = ['input[type="radio"]', ".radio"];
	return group(
		rule(name, {
			cursor: "pointer",
			padding: "0.65em",
			outline: "0px solid transparent",
			border: "0px solid transparent",
			border_radius: "50%",
			transition:
				"background 0.2s ease, color 0.2s ease, border 0.2s ease, outline-color 0.2s ease",
			font_family: vars.radio.font.family,
			line_height: vars.radio.font.line,
			font_weight: vars.radio.font.weight,
			font_size: vars.radio.font.size,
			...colorvars("radio", "color"),
			border_width: "1px",
			border_color: colormix(
				vars.color.neutral,
				vars.color.paper,
				"25%",
				"90%",
			),
			background: vars.color.paper,
		}),
		// ====================================================================
		// COLORS - affect the dot when checked
		// ====================================================================
		...colors.map((variant) =>
			rule(cross(name, [`.${variant}`], [":checked"]), {
				__radio_color_base: vars.radio.color[variant],
			}),
		),
		...colors.map((variant) =>
			rule(cross(name, [`.${variant}`], [":checked::after"]), {
				color: vars.radio.color[variant],
			}),
		),
		// ====================================================================
		// STATES
		// ====================================================================
		rule(mods(name, "hover"), {}),
		rule(mods(name, "focus"), {
			outline_width: "2px",
			outline_color: colormix(
				vars.color.neutral,
				vars.radio.focus.tint,
				vars.radio.focus.blend,
				vars.radio.focus.opacity,
			),
		}),
		rule(mods(name, "active"), {
			border_color: colormix(
				vars.color.neutral,
				vars.radio.active.tint,
				vars.radio.active.blend,
				vars.radio.active.opacity,
			),
		}),
		rule(mods(name, "disabled"), {
			cursor: "default",
			background: colormix(vars.colo.neutral, vars.color.paper, "50%", "75%"),
			border_color: colormix(
				vars.color.neutral,
				vars.color.paper,
				"50%",
				"75%",
			),
		}),
		// ====================================================================
		// CHECKED CONTENT
		// ====================================================================
		rule(
			name.map((n) => `${n}:checked`),
			{
				appearance: "none",
				position: "relative",
			},
		),
		rule(
			name.map((n) => `${n}:checked::after`),
			{
				content: vars.radio.content.checked,
				position: "absolute",
				top: "50%",
				left: "50%",
				transform: "translate(-50%, -50%)",
				font_size: "1.2em",
				color: vars.color.neutral,
			},
		),
		// ====================================================================
		// STYLE
		// ====================================================================
		rule(mods(name, "default"), {
			border_width: "3px",
			border_color: vars.color.neutral,
			font_weight: "bold",
		}),
		rule(mods(name, "outline"), {
			border_width: "1px",
			background: "transparent",
			border_color: colormix(
				vars.color.neutral,
				vars.color.paper,
				"80%",
				"50%",
			),
		}),
		rule(cross(name, [".blank"]), {
			background: "transparent",
			border_color: "transparent",
			__radio_color_opacity: "50%",
		}),
		rule(cross(name, [".icon"]), {
			background: "transparent",
			__radio_color_opacity: "50%",
			aspect_ratio: "1",
		}),
		bare(name, "radio"),
	);
}

// ----------------------------------------------------------------------------
//
// EXPORTS
//
// ----------------------------------------------------------------------------

const colors = [
	"primary",
	"secondary",
	"tertiary",
	"success",
	"warning",
	"danger",
];
export default named({
	button: button(colors),
	input: input(colors),
	textarea: textarea(colors),
	checkbox: checkbox(colors),
	radio: radio(colors),
});
// EOF
