import { group, vars, blend, rule } from "../js/littlecss.js";
import defaults from "./defaults.js";
const colors = [...Object.keys(defaults.palette)];
const transparent = [5, 10, 15, 20, 25, 50, 75, 90];

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
		rule(".bg-page", { __background_color: vars.color.page }),
		rule(".fg", { color: `${vars.text.color}` }),
		rule(".bd", { border_color: `${vars.border.color}` }),
		rule(".ot", { outline_color: `${vars.outline.color}` }),

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
		rule(".nobg", { __background_color: "transparent" }),
		rule(".nobd", { __border_color: "transparent" }),
		rule(".nofg", { __text_color: `${vars.color.fg}` }),
		rule(".noot", { __outline_color: "transparent" }),
	),
	group(
		rule(".bg-darkest", {
			background_color: `oklch(from ${vars.background.color} calc(l * 0.91) c h)`,
		}),
		rule(".bg-darker", {
			background_color: `oklch(from ${vars.background.color} calc(l * 0.94) c h)`,
		}),
		rule(".bg-dark", {
			background_color: `oklch(from ${vars.background.color} calc(l * 0.97) c h)`,
		}),
		rule(".bg-light", {
			background_color: `oklch(from ${vars.background.color} calc(l * 1.03) c h)`,
		}),
		rule(".bg-lighter", {
			background_color: `oklch(from ${vars.background.color} calc(l * 1.06) c h)`,
		}),
		rule(".bg-lightest", {
			background_color: `oklch(from ${vars.background.color} calc(l * 1.09) c h)`,
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
