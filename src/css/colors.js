import { tokens, group, times, vars, rule } from "../js/littlecss.js";

const colors = {
	cyan: "#00BCBC",
	blue: "#0000FF",
	purple: "#8000FF",
	red: "#FF0000",
	orange: "#FF7F00",
	yellow: "#BCBC00",
	pink: "#FF00FF",
	green: "#00BC00",
	grey: "#808080",
};

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
	...Object.keys(colors).map((color) =>
		rule(`.bg-${color}`, {
			__background_color: `${vars.color[color]}`,
		})
	),
	...Object.keys(colors).map((color) =>
		rule(`.bd-${color}`, {
			__border_color: `${vars.color[color]}`,
		})
	),
	...Object.keys(colors).map((color) =>
		rule(`.${color}`, {
			__color: `${vars.color[color]}`,
		})
	),
	...Object.keys(colors).map((color) =>
		times(11, (i) =>
			rule(`.bg-${color}-${i}`, {
				background_color: `${vars.color[color][i]}`,
			})
		)
	),
	...Object.keys(colors).map((color) =>
		times(11, (i) =>
			rule(`.bd-${color}-${i}`, {
				background_color: `${vars.color[color][i]}`,
			})
		)
	),
	...Object.keys(colors).map((color) =>
		times(11, (i) =>
			rule(`.${color}-${i}`, {
				color: `${vars.color[color][i]}`,
			})
		)
	)
);
