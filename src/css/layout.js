import { sizes, named, rule, group, vars, times } from "../js/littlecss.js";

const t = { top: "0px" };
const b = { bottom: "0px" };
const l = { left: "0px" };
const r = { r: "0px" };
const tl = { ...t, ...l };
const br = { ...b, ...r };

export default named({
	align: group(
		rule(".centered", {
			display: "flex",
			justify_content: "center",
			align_items: "center",
		})
	),
	box: group(
		rule(".bbox", { box_sizing: "border-box" }),
		rule(".cbox", { box_sizing: "content-box" })
	),
	blocks: group(
		rule(".il", { display: "inline" }),
		rule(".ibl", { display: "inline-block" }),
		rule(".bl", { display: "block" }),
		rule(".fl", { display: "flex" }),
		rule(".ifl", { display: "inline-flex" })
	),
	position: group(
		rule(".sticky", { position: "sticky" }),
		rule(".rel", { position: "relative" }),
		rule(".abs", { position: "absolute" }),
		rule(".tl", tl),
		rule(".br", br),
		rule(".l", l),
		rule(".r", r)
	),
	margin: group(
		sizes.map((k, i) =>
			rule([`.m-${k}`, `.m-${i}`], {
				margin: `${vars.margin[i]}`,
				__margin: `${vars.margin[i]}`,
			})
		),
		sizes.map((k, i) =>
			rule([`.mt-${k}`, `.mt-${i}`], {
				margin_top: `${vars.margin[i]}`,
			})
		),
		sizes.map((k, i) =>
			rule([`.mb-${k}`, `.mb-${i}`], {
				margin_bottom: `${vars.margin[i]}`,
			})
		),
		sizes.map((k, i) =>
			rule([`.ml-${k}`, `.ml-${i}`], {
				margin_left: `${vars.margin[i]}`,
			})
		),
		sizes.map((k, i) =>
			rule([`.mr-${k}`, `.mr-${i}`], {
				margin_right: `${vars.margin[i]}`,
			})
		)
	),
	padding: group(
		sizes.map((k, i) =>
			rule([`.p-${k}`, `.m-${i}`], {
				padding: `${vars.pad[i]}`,
				__pad: `${vars.pad[i]}`,
			})
		),
		sizes.map((k, i) =>
			rule([`.pt-${k}`, `.pt-${i}`], {
				padding_top: `${vars.pad[i]}`,
			})
		),
		sizes.map((k, i) =>
			rule([`.pb-${k}`, `.pb-${i}`], {
				padding_bottom: `${vars.pad[i]}`,
			})
		),
		sizes.map((k, i) =>
			rule([`.pl-${k}`, `.pl-${i}`], {
				padding_left: `${vars.pad[i]}`,
			})
		),
		sizes.map((k, i) =>
			rule([`.pr-${k}`, `.pr-${i}`], {
				padding_right: `${vars.pad[i]}`,
			})
		)
	),
	gap: group(
		sizes.map((k, i) =>
			rule([`.g-${k}`, `.g-${i}`], {
				gap: `${vars.gap[i]}`,
				__gap: `${vars.gap[i]}`,
			})
		)
	),
	expand: group(
		rule(".expand", {
			position: "absolute",
			box_sizing: "border-box",
			...tl,
			...br,
		}),

		rule(".expand-h", {
			position: "absolute",
			box_sizing: "border-box",
			...l,
			...r,
		}),
		rule(".expand-v", {
			position: "absolute",
			box_sizing: "border-box",
			...t,
			...b,
		})
	),
	fit: group(
		rule(".fit", {
			box_sizing: "border-box",
			width: "100%",
			height: "100%",
			min_width: "100%",
			min_height: "100%",
			max_width: "100%",
			max_height: "100%",
		}),
		rule(".fit-w", {
			box_sizing: "border-box",
			width: "100%",
			min_width: "100%",
			max_width: "100%",
		}),
		rule(".fit-h", {
			box_sizing: "border-box",
			height: "100%",
			min_height: "100%",
			max_height: "100%",
		}),
		rule(".fit-page", {
			max_width: vars.page.width,
		}),
		rule(".fit-text", {
			max_width: vars.text.width,
		}),
		rule(".fit-content", {
			max_width: "fit-content",
		}),
		rule(".fit-screen", {
			box_sizing: "border-box",
			min_height: "100vh",
			height: "100vh",
			max_height: "100vh",
			min_width: "100vw",
			width: "100vw",
			max_width: "100vw",
		})
	),
	filling: group(
		rule(".fill-screen", {
			box_sizing: "border-box",
			min_width: "100vw",
			min_height: "100vh",
		})
	),
	limit: group(
		...["text", "content", "page"].map((_) =>
			rule(`.limit-${_}`, { max_width: `${vars.limit[_]}` })
		),
		...times(3, (i) =>
			rule(`.limit-0b`, { max_width: `${vars.limit.block[i]}` })
		)
	),
	sizing: group(
		named({
			width: group(
				...sizes.map((k, i) =>
					rule(`.w-${k}`, { width: `${vars.size[i + 1]}` })
				),
				...sizes.map((k, i) =>
					rule(`.h-${k}`, { height: `${vars.size[i + 1]}` })
				),
				rule(".w-screen", { width: "100vw" }),
				rule(".h-screen", { width: "100vh" })
			),
			chars: group(
				...times(10, (_) =>
					rule(`.w-${_ + 1}ch`, {
						width: `${Math.round(1.25 * (_ + 1))}ch`,
					})
				)
			),
			columns: group(
				...times(10, (_) =>
					rule(`.w-${_ + 1}c`, {
						width: `calc(${vars.column.width}*${_ + 1})`,
					})
				)
			),
			blocks: group(
				...times(10, (_) =>
					rule(`.w-${_ + 1}b`, {
						width: `calc(${vars.block.width}*${_ + 1})`,
					})
				)
			),
		})
	),
	shapes: group(
		rule(".square", { aspect_ratio: "1/1" }),
		rule(".circle", { aspect_ratio: "1/1", border_radius: "50%" })
	),
	row: group(
		rule(".row", {
			display: "flex",
			align_items: "center",
			gap: `${vars.gap}`,
		}),
		rule(".row.wrap", {
			flex_wrap: "wrap",
		})
	),
	stack: group(
		rule(".stack", {
			display: "flex",
			flex_direction: "column",
			gap: `${vars.gap}`,
		})
	),
	flex: group(
		rule(".fill", {
			flex_grow: "1",
		}),
		rule(".shrink", {
			flex_shrink: "1",
		})
	),
});
