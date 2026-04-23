import {
	contrast,
	cross,
	group,
	mods,
	named,
	rule,
	vars,
} from "../js/uicss.js";
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
				padding: `${vars.button.box.padding.y} ${vars.button.box.padding.x}`,
				outline: "0px solid transparent",
				border: "0px solid transparent",
				border_radius: vars.button.box.radius,
				transition: `${vars.ui.control.transition}`,
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
				border_radius: vars.selectable.box.radius,
				transition: `${vars.ui.control.transition}`,
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
		...SIZES.map((size, i) =>
			rule(mods(name, size), {
				font_size: `calc(${vars.button.font.size} * ${vars.textsize.size[i]})`,
				padding: `calc(${vars.button.box.padding.y} * ${vars.textsize.size[i]}) calc(${vars.button.box.padding.x} * ${vars.textsize.size[i]})`,
			}),
		),
		// ====================================================================
		// STATES
		// ====================================================================

		rule(cross(name, [":focus-visible", ".focus"]), {
			outline_width: `${vars.ui.control.focus.ring.width}`,
			outline_color: colormix(
				vars.button.current.color,
				vars.button.focus.tint,
				vars.button.focus.blend,
				vars.button.focus.opacity,
			),
		}),
		rule(cross(selectable, [":focus-visible", ".focus"]), {
			outline_width: `${vars.ui.control.focus.ring.width}`,
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
				`${vars.ui.control.disabled.blend}`,
				`${vars.ui.control.disabled.opacity}`,
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
			border_width: `${vars.ui.control.style.default.border.width}`,
			border_color: vars.button.current.color,
			font_weight: "bold",
		}),
		rule(mods(selectable, "default"), {
			border_width: `${vars.ui.control.style.default.border.width}`,
			border_color: vars.selectable.current.color,
			font_weight: "bold",
		}),
		rule(mods(controls, "outline"), {
			border_width: `${vars.ui.control.style.outline.border.width}`,
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
			border_width: `${vars.ui.control.style.outline.border.width}`,
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
			padding: `${vars.ui.control.icon.padding}`,
			width: `${vars.ui.control.icon.size}`,
			height: `${vars.ui.control.icon.size}`,
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
// SELECTOR
//
// ----------------------------------------------------------------------------
function selector(colors) {
	const name = [".selector"];
	const option = [
		...cross(name, ["> .option", "> label", "> button", "> a"]),
	];
	const selected = [
		...cross(name, ["> .selected", '> [aria-pressed="true"]', '> [aria-checked="true"]']),
		...cross(name, [" input:checked + label"]),
	];
	return group(
		rule(name, {
			display: "inline-flex",
			width: "fit-content",
			align_self: "flex-start",
			flex_wrap: "nowrap",
			align_items: "center",
			overflow: "hidden",
			gap: vars.selector.box.gap,
			padding: `${vars.selector.box.padding.y} ${vars.selector.box.padding.x}`,
			outline: "0px solid transparent",
			border: "0px solid transparent",
			border_radius: vars.selector.box.radius,
			border_width: `${vars.ui.control.border.width}`,
			border_color: colormix(
				vars.selector.current.color,
				vars.color.paper,
				"45%",
				"100%",
			),
			background: colormix(
				vars.selector.current.color,
				vars.color.paper,
				"3%",
				"100%",
			),
			box_shadow: "none",
			transition: `${vars.ui.control.transition}`,
			font_family: vars.selector.font.family,
			line_height: vars.selector.font.line,
			font_weight: vars.selector.font.weight,
			font_size: vars.selector.font.size,
			...colorvars("selector", "color"),
		}),
		rule(option, {
			cursor: "pointer",
			display: "inline-flex",
			flex: "0 0 auto",
			align_items: "center",
			justify_content: "center",
			position: "relative",
			padding: `${vars.selector.item.padding.y} ${vars.selector.item.padding.x}`,
			border: "0px solid transparent",
			border_radius: vars.selector.box.radius,
			background: "transparent",
			color: "inherit",
			white_space: "nowrap",
			font: "inherit",
			text_decoration: "none",
			line_height: "1",
			user_select: "none",
			transition: `${vars.ui.control.transition}`,
			margin: "0px",
		}),
		rule(cross(name, [" input[type=checkbox]", " input[type=radio]"]), {
			display: "none",
		}),
		...colors.map((variant) =>
			rule(mods(name, variant), {
				__selector_color_base: vars.selector.color[variant],
			}),
		),
		rule(cross(name, [":focus-within", ".focus"]), {
			outline_width: `${vars.ui.control.focus.ring.width}`,
			outline_color: colormix(
				vars.selector.current.color,
				vars.selector.focus.tint,
				vars.selector.focus.blend,
				vars.selector.focus.opacity,
			),
		}),
		rule(cross(option, [":hover", ".hover"]), {
			background: colormix(
				vars.selector.current.color,
				vars.selector.hover.tint,
				vars.selector.hover.blend,
				vars.selector.hover.opacity,
			),
		}),
		rule(cross(option, [":active", ".active"]), {
			background: colormix(
				vars.selector.current.color,
				vars.selector.active.tint,
				vars.selector.active.blend,
				vars.selector.active.opacity,
			),
			box_shadow: "none",
		}),
		rule(selected, {
			background: "var(--selector-current-color)",
			color: contrast("var(--selector-current-color)"),
			box_shadow: "none",
		}),
		rule(cross(option, [":focus-visible", ".focus"]), {
			outline_width: `${vars.ui.control.focus.ring.width}`,
			outline_color: colormix(
				vars.selector.current.color,
				vars.selector.focus.tint,
				vars.selector.focus.blend,
				vars.selector.focus.opacity,
			),
		}),
		rule(cross(name, [".disabled", '[aria-disabled="true"]']), {
			cursor: "default",
			background: "transparent",
		}),
		rule(cross(option, [":disabled", ".disabled", '[aria-disabled="true"]']), {
			cursor: "default",
			opacity: "0.65",
			box_shadow: "none",
		}),
		rule(mods(name, "default"), {
			border_width: `${vars.ui.control.style.default.border.width}`,
			border_color: vars.selector.current.color,
		}),
		rule(mods(name, "outline"), {
			border_width: `${vars.ui.control.style.outline.border.width}`,
			background: "transparent",
			border_color: colormix(
				vars.selector.current.color,
				vars.color.paper,
				"80%",
				"50%",
			),
			color: colormix(vars.selector.current.color, vars.color.ink, "50%", "100%"),
		}),
		rule(cross(name, [".blank"]), {
			background: "transparent",
			border_color: "transparent",
			__selector_color_opacity: "50%",
		}),
		...SIZES.map((size, i) =>
			rule(mods(name, size), {
				font_size: `calc(${vars.selector.font.size} * ${vars.textsize.size[i]})`,
			}),
		),
		bare(name, "selector"),
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
			padding: `${vars.input.box.padding.y} ${vars.input.box.padding.x}`,
			outline: "0px solid transparent",
			border: "0px solid transparent",
				border_radius: vars.input.box.radius,
			transition: `${vars.ui.control.transition}`,
			font_family: vars.input.font.family,
			line_height: vars.input.font.line,
			font_weight: vars.input.font.weight,
			font_size: vars.input.font.size,
			...colorvars("input", "color"),
			display: "inline-flex",
			justify_content: "stretch",
			align_items: "center",
			border_width: `${vars.ui.control.border.width}`,
			border_color: colormix(
				vars.input.current.color,
				vars.color.paper,
				"45%",
				"100%",
			),
			background: colormix(
				vars.input.current.color,
				vars.color.paper,
				"3%",
				"100%",
			),
		}),
		// ====================================================================
		// COLORS
		// ====================================================================
		...colors.map((variant) =>
			rule(mods(name, variant), {
				__input_color_base: vars.input.color[variant],
			}),
		),
		// ====================================================================
		// STATES
		// ====================================================================
		rule(mods(name, "hover"), {
			border_color: colormix(
				vars.input.current.color,
				vars.input.hover.tint,
				vars.input.hover.blend,
				vars.input.hover.opacity,
			),
			background_color: colormix(
				vars.input.current.color,
				vars.color.paper,
				"4%",
				"100%",
			),
		}),
		rule(mods(name, "focus"), {
			outline_width: `${vars.ui.control.focus.ring.width}`,
			outline_color: colormix(
				vars.input.current.color,
				vars.input.focus.tint,
				vars.input.focus.blend,
				vars.input.focus.opacity,
			),
			background_color: colormix(
				vars.input.current.color,
				vars.color.paper,
				"6%",
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
				background: colormix(
					vars.input.current.color,
					vars.color.paper,
					`${vars.ui.control.disabled.blend}`,
					`${vars.ui.control.disabled.opacity}`,
				),
				color: colormix(
					vars.input.current.color,
					vars.color.ink,
					`${vars.ui.control.disabled.blend}`,
					`${vars.ui.control.disabled.opacity}`,
				),
				border_color: colormix(
					vars.input.current.color,
					vars.color.paper,
					`${vars.ui.control.disabled.blend}`,
					`${vars.ui.control.disabled.opacity}`,
				),
			}),
		// ====================================================================
		// STYLE
		// ====================================================================
		rule(mods(name, "default"), {
			border_width: `${vars.ui.control.style.default.border.width}`,
			border_color: vars.input.current.color,
			font_weight: "bold",
		}),
		rule(mods(name, "outline"), {
			border_width: `${vars.ui.control.style.outline.border.width}`,
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
		...SIZES.map((size, i) =>
			rule(mods(name, size), {
				font_size: `calc(${vars.input.font.size} * ${vars.textsize.size[i]})`,
			}),
		),
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
			padding: `${vars.textarea.box.padding.y} ${vars.textarea.box.padding.x}`,
			outline: "0px solid transparent",
			border: "0px solid transparent",
			border_radius: vars.textarea.box.radius,
			transition: `${vars.ui.control.transition}`,
			font_family: vars.textarea.font.family,
			line_height: vars.textarea.font.line,
			font_weight: vars.textarea.font.weight,
			font_size: vars.textarea.font.size,
			...colorvars("textarea", "color"),
			border_width: `${vars.ui.control.border.width}`,
			border_color: colormix(
				vars.textarea.current.color,
				vars.color.paper,
				"45%",
				"100%",
			),
			background: colormix(
				vars.textarea.current.color,
				vars.color.paper,
				"3%",
				"100%",
			),
		}),
		// ====================================================================
		// COLORS
		// ====================================================================
		...colors.map((variant) =>
			rule(mods(name, variant), {
				__textarea_color_base: vars.textarea.color[variant],
			}),
		),
		// ====================================================================
		// STATES
		// ====================================================================
		rule(mods(name, "hover"), {
			border_color: colormix(
				vars.textarea.current.color,
				vars.textarea.hover.tint,
				vars.textarea.hover.blend,
				vars.textarea.hover.opacity,
			),
			background_color: colormix(
				vars.textarea.current.color,
				vars.color.paper,
				"4%",
				"100%",
			),
		}),
		rule(mods(name, "focus"), {
			outline_width: `${vars.ui.control.focus.ring.width}`,
			outline_color: colormix(
				vars.textarea.current.color,
				vars.textarea.focus.tint,
				vars.textarea.focus.blend,
				vars.textarea.focus.opacity,
			),
			background_color: colormix(
				vars.textarea.current.color,
				vars.color.paper,
				"6%",
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
			background: colormix(
				vars.textarea.current.color,
				vars.color.paper,
				`${vars.ui.control.disabled.blend}`,
				`${vars.ui.control.disabled.opacity}`,
			),
			color: colormix(
				vars.textarea.current.color,
				vars.color.ink,
				`${vars.ui.control.disabled.blend}`,
				`${vars.ui.control.disabled.opacity}`,
			),
			border_color: colormix(
				vars.textarea.current.color,
				vars.color.paper,
				`${vars.ui.control.disabled.blend}`,
				`${vars.ui.control.disabled.opacity}`,
			),
		}),
		// ====================================================================
		// STYLE
		// ====================================================================
		rule(mods(name, "default"), {
			border_width: `${vars.ui.control.style.default.border.width}`,
			border_color: vars.textarea.current.color,
			font_weight: "bold",
		}),
		rule(mods(name, "outline"), {
			border_width: `${vars.ui.control.style.outline.border.width}`,
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
		...SIZES.map((size, i) =>
			rule(mods(name, size), {
				font_size: `calc(${vars.textarea.font.size} * ${vars.textsize.size[i]})`,
			}),
		),
		bare(name, "textarea"),
	);
}

// ----------------------------------------------------------------------------
//
// SELECT
//
// ----------------------------------------------------------------------------
function select(colors) {
	const name = ["select", ".select"];
	return group(
		rule(name, {
			padding: `${vars.select.box.padding.y} ${vars.select.box.padding.x}`,
			outline: "0px solid transparent",
			border: "0px solid transparent",
			border_radius: vars.select.box.radius,
			appearance: "none",
			transition: `${vars.ui.control.transition}`,
			font_family: vars.select.font.family,
			line_height: vars.select.font.line,
			font_weight: vars.select.font.weight,
			font_size: vars.select.font.size,
			...colorvars("select", "color"),
			display: "inline-flex",
			justify_content: "stretch",
			align_items: "center",
			border_width: `${vars.ui.control.border.width}`,
			border_color: colormix(
				vars.select.current.color,
				vars.color.paper,
				"45%",
				"100%",
			),
			background_color: colormix(
				vars.select.current.color,
				vars.color.paper,
				"3%",
				"100%",
			),
		}),
		rule(cross(name, [":not([multiple]):not([size])"]), {
			padding_right: `calc(${vars.select.box.padding.x} + ${vars.select.arrow.offset} + ${vars.select.arrow.size})`,
			background_image:
				"linear-gradient(45deg, transparent 50%, currentColor 50%), linear-gradient(135deg, currentColor 50%, transparent 50%)",
			background_position: `right ${vars.select.arrow.offset} center, right calc(${vars.select.arrow.offset} - ${vars.select.arrow.gap}) center`,
			background_size: `${vars.select.arrow.size} ${vars.select.arrow.size}, ${vars.select.arrow.size} ${vars.select.arrow.size}`,
			background_repeat: "no-repeat",
		}),
		...colors.map((variant) =>
			rule(mods(name, variant), {
				__select_color_base: vars.select.color[variant],
				background_color: colormix(
					vars.select.current.color,
					vars.color.paper,
					"20%",
					"100%",
				),
				color: contrast(vars.select.current.color),
			}),
		),
		rule(mods(name, "focus"), {
			outline_width: `${vars.ui.control.focus.ring.width}`,
			outline_color: colormix(
				vars.select.current.color,
				vars.select.focus.tint,
				vars.select.focus.blend,
				vars.select.focus.opacity,
			),
		}),
		rule(mods(name, "disabled"), {
			cursor: "default",
			background: colormix(
				vars.color.neutral,
				vars.color.paper,
				`${vars.ui.control.disabled.blend}`,
				`${vars.ui.control.disabled.opacity}`,
			),
			color: colormix(
				vars.color.neutral,
				vars.color.ink,
				`${vars.ui.control.disabled.blend}`,
				`${vars.ui.control.disabled.opacity}`,
			),
		}),
		...SIZES.map((size, i) =>
			rule(mods(name, size), {
				font_size: `calc(${vars.select.font.size} * ${vars.textsize.size[i]})`,
			}),
		),
		bare(name, "select"),
	)
}

// ----------------------------------------------------------------------------
//
// RANGE
//
// ----------------------------------------------------------------------------
function range(colors) {
	const name = ['input[type="range"]', ".range"];
	return group(
		rule(name, {
			appearance: "none",
			font_family: vars.range.font.family,
			line_height: vars.range.font.line,
			font_weight: vars.range.font.weight,
			font_size: vars.range.font.size,
			...colorvars("range", "color"),
			width: "100%",
			max_width: vars.range.box.max_width,
			cursor: "pointer",
			min_height: vars.range.thumb.size,
			padding: "0px",
			margin: "0px",
			background: "transparent",
			border: "0px solid transparent",
			border_radius: "0px",
			box_shadow: "none",
			transition: "none",
		}),
		...colors.map((variant) =>
			rule(mods(name, variant), {
				__range_color_base: vars.range.color[variant],
			}),
		),
		rule(name.map((n) => `${n}::-webkit-slider-runnable-track`), {
			height: vars.range.track.size,
			border_radius: vars.range.track.radius,
			background: vars.range.track.color,
		}),
		rule(name.map((n) => `${n}::-webkit-slider-thumb`), {
			appearance: "none",
			width: vars.range.thumb.size,
			height: vars.range.thumb.size,
			border_radius: vars.range.thumb.radius,
			background: "var(--range-current-color)",
			border: "0px solid transparent",
			margin_top: `calc((${vars.range.track.size} - ${vars.range.thumb.size}) / 2)`,
		}),
		rule(name.map((n) => `${n}::-moz-range-track`), {
			height: vars.range.track.size,
			border_radius: vars.range.track.radius,
			background: vars.range.track.color,
			border: "0px solid transparent",
		}),
		rule(name.map((n) => `${n}::-moz-range-thumb`), {
			width: vars.range.thumb.size,
			height: vars.range.thumb.size,
			border_radius: vars.range.thumb.radius,
			background: "var(--range-current-color)",
			border: "0px solid transparent",
		}),
		rule(mods(name, "focus"), {
			outline_width: `${vars.ui.control.focus.ring.width}`,
			outline_color: colormix(
				vars.range.current.color,
				vars.range.focus.tint,
				vars.range.focus.blend,
				vars.range.focus.opacity,
			),
		}),
		rule(name.map((n) => `${n}:focus-visible`), {
			outline_width: `${vars.ui.control.focus.ring.width}`,
			outline_color: colormix(
				vars.range.current.color,
				vars.range.focus.tint,
				vars.range.focus.blend,
				vars.range.focus.opacity,
			),
		}),
		...SIZES.map((size, i) =>
			rule(mods(name, size), {
				font_size: `calc(${vars.range.font.size} * ${vars.textsize.size[i]})`,
			}),
		),
		bare(name, "range"),
	)
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
			appearance: "none",
			font_size: vars.checkbox.font.size,
			width: vars.checkbox.box.size,
			height: vars.checkbox.box.size,
			padding: "0px",
			margin: "0px",
			display: "inline-block",
			position: "relative",
			box_sizing: "border-box",
			outline: "0px solid transparent",
			border: "0px solid transparent",
			border_radius: vars.checkbox.box.radius,
			transition: `${vars.ui.control.transition}`,
			font_family: vars.checkbox.font.family,
			line_height: vars.checkbox.font.line,
			font_weight: vars.checkbox.font.weight,
			...colorvars("checkbox", "color"),
			border_width: `${vars.ui.control.border.width}`,
			border_color: colormix(
				vars.checkbox.current.color,
				vars.color.paper,
				"25%",
				"90%",
			),
			background: vars.color.paper,
		}),
		// ====================================================================
		// COLORS
		// ====================================================================
		...colors.map((variant) =>
			rule(mods(name, variant), {
				__checkbox_color_base: vars.checkbox.color[variant],
			}),
		),
		// ====================================================================
		// STATES
		// ====================================================================
		rule(mods(name, "hover"), {}),
		rule(mods(name, "focus"), {
			outline_width: `${vars.ui.control.focus.ring.width}`,
			outline_color: colormix(
				vars.checkbox.current.color,
				vars.checkbox.focus.tint,
				vars.checkbox.focus.blend,
				vars.checkbox.focus.opacity,
			),
			background_color: vars.color.paper,
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
			background: colormix(
				vars.color.neutral,
				vars.color.paper,
				`${vars.ui.control.disabled.blend}`,
				`${vars.ui.control.disabled.opacity}`,
			),
			color: colormix(
				vars.color.neutral,
				vars.color.ink,
				`${vars.ui.control.disabled.blend}`,
				`${vars.ui.control.disabled.opacity}`,
			),
		}),
		// ====================================================================
		// CHECKED & PARTIAL CONTENT
		// ====================================================================
		rule(
			name.map((n) => `${n}:checked`),
			{
				position: "relative",
				border_color: "var(--checkbox-current-color)",
				background: "var(--checkbox-current-color)",
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
				font_size: vars.checkbox.box.marker,
				line_height: "1",
				color: contrast(vars.checkbox.current.color),
			},
		),
		rule(
			name.map((n) => `${n}:indeterminate`),
			{
				position: "relative",
				border_color: "var(--checkbox-current-color)",
				background: "var(--checkbox-current-color)",
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
				font_size: vars.checkbox.box.marker,
				line_height: "1",
				color: contrast(vars.checkbox.current.color),
			},
		),
		// ====================================================================
		// STYLE
		// ====================================================================
		rule(mods(name, "default"), {
			border_width: `${vars.ui.control.style.default.border.width}`,
			border_color: vars.checkbox.current.color,
			font_weight: "bold",
		}),
		rule(mods(name, "outline"), {
			border_width: `${vars.ui.control.style.outline.border.width}`,
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
		...SIZES.map((size, i) =>
			rule(mods(name, size), {
				font_size: `calc(${vars.checkbox.font.size} * ${vars.textsize.size[i]})`,
			}),
		),
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
			appearance: "none",
			font_size: vars.radio.font.size,
			width: vars.radio.box.size,
			height: vars.radio.box.size,
			padding: "0px",
			margin: "0px",
			display: "inline-block",
			position: "relative",
			box_sizing: "border-box",
			outline: "0px solid transparent",
			border: "0px solid transparent",
			border_radius: "50%",
			transition: `${vars.ui.control.transition}`,
			font_family: vars.radio.font.family,
			line_height: vars.radio.font.line,
			font_weight: vars.radio.font.weight,
			...colorvars("radio", "color"),
			border_width: `${vars.ui.control.border.width}`,
			border_color: colormix(
				vars.radio.current.color,
				vars.color.paper,
				"25%",
				"90%",
			),
			background: vars.color.paper,
		}),
		// ====================================================================
		// COLORS
		// ====================================================================
		...colors.map((variant) =>
			rule(mods(name, variant), {
				__radio_color_base: vars.radio.color[variant],
			}),
		),
		// ====================================================================
		// STATES
		// ====================================================================
		rule(mods(name, "hover"), {
			border_color: colormix(
				vars.radio.current.color,
				vars.radio.hover.tint,
				vars.radio.hover.blend,
				vars.radio.hover.opacity,
			),
		}),
		rule(mods(name, "focus"), {
			outline_width: `${vars.ui.control.focus.ring.width}`,
			outline_color: colormix(
				vars.radio.current.color,
				vars.radio.focus.tint,
				vars.radio.focus.blend,
				vars.radio.focus.opacity,
			),
		}),
		rule(mods(name, "active"), {
			border_color: colormix(
				vars.radio.current.color,
				vars.radio.active.tint,
				vars.radio.active.blend,
				vars.radio.active.opacity,
			),
		}),
		rule(mods(name, "disabled"), {
			cursor: "default",
			background: colormix(
				vars.radio.current.color,
				vars.color.paper,
				`${vars.ui.control.disabled.blend}`,
				`${vars.ui.control.disabled.opacity}`,
			),
			border_color: colormix(
				vars.radio.current.color,
				vars.color.paper,
				`${vars.ui.control.disabled.blend}`,
				`${vars.ui.control.disabled.opacity}`,
			),
		}),
		// ====================================================================
		// CHECKED CONTENT
		// ====================================================================
		rule(
			name.map((n) => `${n}:checked`),
			{
				position: "relative",
				border_color: "var(--radio-current-color)",
				background: "var(--radio-current-color)",
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
				font_size: vars.radio.box.marker,
				line_height: "1",
				color: contrast(vars.radio.current.color),
			},
		),
		// ====================================================================
		// STYLE
		// ====================================================================
		rule(mods(name, "default"), {
			border_width: `${vars.ui.control.style.default.border.width}`,
			border_color: vars.color.neutral,
			font_weight: "bold",
		}),
		rule(mods(name, "outline"), {
			border_width: `${vars.ui.control.style.outline.border.width}`,
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
		...SIZES.map((size, i) =>
			rule(mods(name, size), {
				font_size: `calc(${vars.radio.font.size} * ${vars.textsize.size[i]})`,
			}),
		),
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
	selector: selector(colors),
	input: input(colors),
	select: select(colors),
	textarea: textarea(colors),
	range: range(colors),
	checkbox: checkbox(colors),
	radio: radio(colors),
});
// EOF
