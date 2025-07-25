import { group, vars, rule } from "../js/littlecss.js";
import defaults from "./defaults.js";
const semantic = ["neutral", "primary", "secondary", "tertiary"];
const colors = [...Object.keys(defaults.palette), ...semantic];
const transparent = [5, 10, 15, 20, 25, 50, 75, 90];

function* ivariants(color, prefix, values) {
	for (let i = 0; i < values.length; i++) {
		const scope = [`.${prefix}-${color}-${i}`];
		if (i === 5) {
			scope.splice(0, 0, `.${prefix}-${color}`);
		}
		yield rule(scope, { [`__color_${prefix}`]: values[i] });
	}
}

export default group(
	group(
		rule(".bg", { background_color: `${vars.color.bg}` }),
		rule(".fg", { color: `${vars.color.fg}` }),
		rule(".bd", { border_color: `${vars.color.bd}` }),
		rule(".ot", { outline_color: `${vars.color.ot}` }),

		...transparent.map((_) =>
			group(
				rule(`.bg-${_}p`, {
					background_color: `color-mix(in ${vars.color.blend}, ${vars.color.bg} ${_}%, ${vars.color.page})`,
				}),
				rule(`.fg-${_}p`, {
					color: `color-mix(in ${vars.color.blend}, ${vars.color.fg} ${_}%, ${vars.color.page})`,
				}),
				rule(`.bd-${_}p`, {
					border_color: `color-mix(in ${vars.color.blend}, ${vars.color.bd} ${_}%, ${vars.color.page})`,
				}),
				rule(`.ot-${_}p`, {
					outline_color: `color-mix(in ${vars.color.blend}, ${vars.color.ol} ${_}%, ${vars.color.page})`,
				})
			)
		),

		// Resets
		rule(".nobg", { __color_bg: `transparent` }),
		rule(".nobd", { __color_bg: `transparent` }),
		rule(".nofg", { __color_fg: `${vars.color.text}` }),
		rule(".noot", { __color_ot: `${vars.color.text}` })
	),
	...colors.map((color) =>
		group(
			...ivariants(
				color,
				"bg",
				defaults.palette[color] ?? defaults[color]
			)
		)
	),
	...colors.map((color) =>
		group(
			...ivariants(
				color,
				"bd",
				defaults.palette[color] ?? defaults[color]
			)
		)
	),
	...colors.map((color) =>
		group(
			...ivariants(
				color,
				"fd",
				defaults.palette[color] ?? defaults[color]
			)
		)
	),
	...colors.map((color) =>
		group(
			...ivariants(
				color,
				"ot",
				defaults.palette[color] ?? defaults[color]
			)
		)
	)
);
