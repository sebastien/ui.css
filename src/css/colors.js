import { group, vars, blend, rule } from "../js/littlecss.js";
import defaults from "./defaults.js";
const colors = [...Object.keys(defaults.palette)];
const transparent = [5, 10, 15, 20, 25, 50, 75, 90];

const COLOR_NAMES = [
	"white",
	"black",
	"neutral",
	"primary",
	"secondary",
	"tertiary",
	"success",
	"info",
	"warning",
	"danger",
	"error",
];
function* ivariants(color, prefix, property, values) {
	for (let i = 0; i < values.length; i++) {
		const scope = [`.${prefix}-${color}-${i}`];
		if (i === 5) {
			scope.splice(0, 0, `.${prefix}-${color}`);
		}
		yield rule(scope, { [`__${property}`]: values[i] });
	}
}

export default group(
	group(
		rule(".bg", { background_color: `${vars.background.color}` }),
		rule(".fg", { color: `${vars.text.color}` }),
		rule(".bd", { border_color: `${vars.border.color}` }),
		rule(".ot", { outline_color: `${vars.outline.color}` }),
		group(
			...COLOR_NAMES.map((color) =>
				rule(`.bg-${color}`, {
					__background_color: `${vars.color[color]}`,
				}),
			),
			...COLOR_NAMES.map((color) =>
				rule(`.fg-${color}`, {
					__text_color: `${vars.color[color]}`,
				}),
			),
			...COLOR_NAMES.map((color) =>
				rule(`.bd-${color}`, {
					__border_color: `${vars.color[color]}`,
				}),
			),
			...COLOR_NAMES.map((color) =>
				rule(`.ot-${color}`, {
					__outline_color: `${vars.color[color]}`,
				}),
			),
		),
		// NOTE: These can be used to fade the colors to transparency
		...transparent.map((_) =>
			group(
				rule(`.bg-${_}p`, {
					background_color: `color-mix(in ${vars.color.blend}, ${vars.bacground.color} ${_}%, ${vars.color.pagea})`,
				}),
				rule(`.fg-${_}p`, {
					color: `color-mix(in ${vars.color.blend}, ${vars.text.color} ${_}%, ${vars.color.pagea})`,
				}),
				rule(`.bd-${_}p`, {
					border_color: `color-mix(in ${vars.color.blend}, ${vars.border.color} ${_}%, ${vars.color.pagea})`,
				}),
				rule(`.ot-${_}p`, {
					outline_color: `color-mix(in ${vars.color.blend}, ${vars.outline.color} ${_}%, ${vars.color.pagea})`,
				}),
			),
		),

		// Resets
		rule(".bg-no", { __background_color: "transparent" }),
		rule(".bd-no", { __border_color: "transparent" }),
		rule(".fg-no", { __text_color: "transparent" }),
		rule(".ot-no", { __outline_color: "transparent" }),
		rule(".nobg", { background_color: "transparent" }),
		rule(".nobd", { border_color: "transparent" }),
		rule(".nofg", { text_color: "transparent" }),
		rule(".noot", { outline_color: "transparent" }),
	),
	group(
		// FIXME: This is the only way I managed to get the selectable to work as a contrast
		rule(".bg-darkest", {
			background_color: `oklch(from ${vars.background.color} calc(l * 0.91) c h)`,
			__color_background: `oklch(from ${vars.background.color} calc(l * 0.91) c h)`,
		}),
		rule(".bg-darker", {
			background_color: `oklch(from ${vars.background.color} calc(l * 0.94) c h)`,
			__color_background: `oklch(from ${vars.background.color} calc(l * 0.94) c h)`,
		}),
		rule(".bg-dark", {
			background_color: `oklch(from ${vars.background.color} calc(l * 0.97) c h)`,
			__color_background: `oklch(from ${vars.background.color} calc(l * 0.97) c h)`,
		}),
		rule(".bg-light", {
			background_color: `oklch(from ${vars.background.color} calc(l * 1.03) c h)`,
			__color_background: `oklch(from ${vars.background.color} calc(l * 1.03) c h)`,
		}),
		rule(".bg-lighter", {
			background_color: `oklch(from ${vars.background.color} calc(l * 1.06) c h)`,
			__color_background: `oklch(from ${vars.background.color} calc(l * 1.06) c h)`,
		}),
		rule(".bg-lightest", {
			background_color: `oklch(from ${vars.background.color} calc(l * 1.09) c h)`,
			__color_background: `oklch(from ${vars.background.color} calc(l * 1.06) c h)`,
		}),
	),
	group(
		rule(".bd-darkest", {
			border_color: `oklch(from ${vars.border.color} calc(l * 0.91) c h)`,
		}),
		rule(".bd-darker", {
			border_color: `oklch(from ${vars.border.color} calc(l * 0.94) c h)`,
		}),
		rule(".bd-dark", {
			border_color: `oklch(from ${vars.border.color} calc(l * 0.97) c h)`,
		}),
		rule(".bd-light", {
			border_color: `oklch(from ${vars.border.color} calc(l * 1.03) c h)`,
		}),
		rule(".bd-lighter", {
			border_color: `oklch(from ${vars.border.color} calc(l * 1.06) c h)`,
		}),
		rule(".bd-lightest", {
			border_color: `oklch(from ${vars.border.color} calc(l * 1.09) c h)`,
		}),
	),
	...colors.map((color) =>
		group(
			...ivariants(
				color,
				"bg",
				"background_color",
				defaults.palette[color] ?? defaults[color],
			),
		),
	),
	...colors.map((color) =>
		group(
			...ivariants(
				color,
				"bd",
				"border_color",
				defaults.palette[color] ?? defaults[color],
			),
		),
	),
	...colors.map((color) =>
		group(
			...ivariants(
				color,
				"fd",
				"text_color",
				defaults.palette[color] ?? defaults[color],
			),
		),
	),
	...colors.map((color) =>
		group(
			...ivariants(
				color,
				"ot",
				"outline_color",
				defaults.palette[color] ?? defaults[color],
			),
		),
	),
);
