import { tokens, group, times, vars, rule } from "../js/littlecss.js";

const colors = {
	cyan: "#14D3CA",
	blue: "#1717BB",
	purple: "#A21899",
	red: "#FF3939",
	orange: "#EE7204",
	yellow: "#FBBE08",
	pink: "#FF00FF",
	green: "#3DBC1A",
	grey: "#808080",
};

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
	tokens({
		color: colors,
	}),
	tokens({
		color: {
			text: `var(--color-low)`,
			page: `var(--color-high)`,
			white: "#FFFFFF",
			black: "#000000",
			high: `${vars.color.white}`,
			low: `${vars.color.black}`,
			blend: "oklab",
			bg: `color-mix(in oklab, ${vars.color.text} 10%, ${vars.color.page})`,
			bd: `color-mix(in oklab, ${vars.color.text} 20%, ${vars.color.page})`,
			fg: `currentColor`,
		},
	}),
	tokens({
		color: map(colors, (_, k) =>
			times(
				11,
				(i) =>
					`color-mix(in oklab, ${vars.color[k]}, ${
						i < 5 ? vars.color.low : vars.color.high
					} ${
						i < 5
							? 100 - Math.round((100 * i) / 5)
							: Math.round((100 * (i - 5)) / 5)
					}%)`
			).reduce((r, v, k) => ((r[k] = v), r), {})
		),
	}),
	group(
		rule(".bg", { background_color: `${vars.color.bg}` }),
		rule(".fg", { color: `${vars.color.fg}` }),
		rule(".bd", { border_color: `${vars.color.bd}` }),
		// Resets
		rule(".nobg", { __color_bg: `transparent` }),
		rule(".nobd", { __color_bg: `transparent` }),
		rule(".nofg", { __color_fg: `${vars.color.text}` })
	),
	...Object.keys(colors).map((color) =>
		rule(`.bg-${color}`, {
			__color_bg: `${vars.color[color]}`,
		})
	),
	...Object.keys(colors).map((color) =>
		rule(`.bd-${color}`, {
			__color_bd: `${vars.color[color]}`,
		})
	),
	...Object.keys(colors).map((color) =>
		rule(`.fg-${color}`, {
			__color_fg: `${vars.color[color]}`,
		})
	),
	...Object.keys(colors).map((color) =>
		times(11, (i) =>
			rule(`.bg-${color}-${i}`, {
				__color_bg: `${vars.color[color][i]}`,
			})
		)
	),
	...Object.keys(colors).map((color) =>
		times(11, (i) =>
			rule(`.bd-${color}-${i}`, {
				__color_bd: `${vars.color[color][i]}`,
			})
		)
	),
	...Object.keys(colors).map((color) =>
		times(11, (i) =>
			rule(`.${color}-${i}`, {
				__color_fg: `${vars.color[color][i]}`,
			})
		)
	)
	// dk and lt blends
	// ...times(11, (i)=> rule(`.bg-dk${i}`, {
	// 		background_color `color-mix(in oklab, ${vars.color.bg} ${i*10}%, rgba(${vars.color.low}, 0%))`,
	// })),
	// ...times(11, (i)=> rule(`.bg-lt{i}`, {
	// 		background_color `color-mix(in oklab, ${vars.color.bg} ${i*10}%, rgba(${vars.color.high}, 0%))`,
	// })),
);
