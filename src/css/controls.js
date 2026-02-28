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
	);
}

// ----------------------------------------------------------------------------
//
// EXPORTS
//
// ----------------------------------------------------------------------------

export default named({
	button: button(SEMANTIC),
});
// EOF
