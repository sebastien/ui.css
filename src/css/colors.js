import { tokens, group, times, vars, rule } from "../js/littlecss.js";

const colors = "cyan blue purple red orange yellow pink green grey white black"
	.split(" ")
	.reduce((r, v) => ((r[v] = vars.color[v]), r), {});

// const bg = (color, other = vars.color.page, opacity = 0.25) => ({
// 	...blend("bg", color, other, opacity),
// 	background_color: "var(--${key}-color)",
// });
// FIXME: Move this outside
const map = (v, f) => {
	const r = {};
	for (const k in v) {
		r[k] = f(v[k], k);
	}
	return r;
};

export default group(
	// NOTE: This depends on other tokens being set
	tokens({
		color: map(colors, (_, k) =>
			times(
				11,
				(i) =>
					`color-mix(in oklab, ${vars.color[k]}, ${
						i < 5 ? vars.theme.low : vars.theme.high
					} ${
						i < 5
							? 100 - Math.round((100 * i) / 5)
							: Math.round((100 * (i - 5)) / 5)
					}%)`
			).reduce((r, v, k) => ((r[k] = v), r), {})
		),
	}),
	group(
		rule(".bg", { background_color: `${vars.theme.bg}` }),
		rule(".fg", { color: `${vars.theme.fg}` }),
		rule(".bd", { border_color: `${vars.theme.bd}` }),
		// Resets
		rule(".nobg", { __theme_bg: `transparent` }),
		rule(".nobd", { __theme_bg: `transparent` }),
		rule(".nofg", { __theme_fg: `${vars.theme.text}` })
	),
	group(
		...times(11, (i) =>
			rule(`.bg-${i}`, {
				background_color: `color-mix(in ${vars.theme.blend}, ${
					vars.theme.bg
				} ${i * 10}%, ${vars.theme.page})`,
			})
		)
	),
	...Object.keys(colors).map((color) =>
		rule(`.bg-${color}`, {
			__theme_bg: `${vars.color[color]}`,
		})
	),
	...Object.keys(colors).map((color) =>
		rule(`.bd-${color}`, {
			__theme_bd: `${vars.color[color]}`,
		})
	),
	...Object.keys(colors).map((color) =>
		rule(`.fg-${color}`, {
			__theme_fg: `${vars.color[color]}`,
		})
	),
	...Object.keys(colors).map((color) =>
		times(11, (i) =>
			rule(`.bg-${color}-${i}`, {
				__theme_bg: `${vars.color[color][i]}`,
			})
		)
	),
	...Object.keys(colors).map((color) =>
		times(11, (i) =>
			rule(`.bd-${color}-${i}`, {
				__theme_bd: `${vars.color[color][i]}`,
			})
		)
	),
	...Object.keys(colors).map((color) =>
		times(11, (i) =>
			rule(`.${color}-${i}`, {
				__theme_fg: `${vars.color[color][i]}`,
			})
		)
	)
	// dk and lt blends
	// ...times(11, (i)=> rule(`.bg-dk${i}`, {
	// 		background_color `color-mix(in oklab, ${vars.theme.bg} ${i*10}%, rgba(${vars.theme.low}, 0%))`,
	// })),
	// ...times(11, (i)=> rule(`.bg-lt{i}`, {
	// 		background_color `color-mix(in oklab, ${vars.theme.bg} ${i*10}%, rgba(${vars.theme.high}, 0%))`,
	// })),
);
