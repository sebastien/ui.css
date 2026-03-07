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

// ----------------------------------------------------------------------------
//
// BUTTON
//
// ----------------------------------------------------------------------------
function button(colors) {
	const name = ["button", ".button"];
	return group(
		rule(name, {
			cursor: "pointer",
			padding: "0.5em 1em",
			outline: "0px solid transparent",
			border: "0px solid transparent",
			transition:
				"background 0.2s ease, color 0.2s ease, border 0.2s ease, outline-color 0.2s ease",
			font_family: vars.button.font.family,
			font_line: vars.button.font.line,
			font_weight: vars.button.font.weight,
			font_size: vars.button.font.size,
			...colorvars("button", "color"),
			background: "var(--button-current-color)",
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
		// ====================================================================
		// STATES
		// ====================================================================
		rule(mods(name, "hover"), {
			background: colormix(
				vars.button.current.color,
				vars.button.hover.tint,
				vars.button.hover.blend,
				vars.button.hover.opacity,
			),
		}),
		rule(mods(name, "focus"), {
			outline_width: "2px",
			outline_color: colormix(
				vars.button.current.color,
				vars.button.focus.tint,
				vars.button.focus.blend,
				vars.button.focus.opacity,
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
		// ====================================================================
		// STYLE
		// ====================================================================
		rule(mods(name, "default"), {
			border_width: "3px",
			border_color: vars.button.current.color,
			font_weight: "bold",
		}),
		rule(mods(name, "outline"), {
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
		rule(cross(name, [".blank"]), {
			background: "transparent",
			__button_color_opacity: "50%",
		}),
		rule(cross(name, [".icon"]), {
			background: "transparent",
			__button_color_opacity: "50%",
			aspect_ratio: "1",
		}),
		rule(cross(name, [".bare"], STATES), {
			background: "transparent",
			outline_width: "0px",
			border_width: "0px",
			__button_color_opacity: "100%",
		}),
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
			font_line: vars.input.font.line,
			font_weight: vars.input.font.weight,
			font_size: vars.input.font.size,
			...colorvars("input", "color"),
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
		rule(cross(name, [".bare"], STATES), {
			background: "transparent",
			outline_width: "0px",
			border_width: "0px",
			__input_color_opacity: "100%",
		}),
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
			font_line: vars.textarea.font.line,
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
		rule(cross(name, [".bare"], STATES), {
			background: "transparent",
			outline_width: "0px",
			border_width: "0px",
			__textarea_color_opacity: "100%",
		}),
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
			padding: "0.75em",
			outline: "0px solid transparent",
			border: "0px solid transparent",
			transition:
				"background 0.2s ease, color 0.2s ease, border 0.2s ease, outline-color 0.2s ease",
			font_family: vars.checkbox.font.family,
			font_line: vars.checkbox.font.line,
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
		rule(cross(name, [".bare"], STATES), {
			background: "transparent",
			outline_width: "0px",
			border_width: "0px",
			__checkbox_color_opacity: "100%",
		}),
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
});
// EOF
