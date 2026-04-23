import {
	sizes,
	named,
	rule,
	group,
	vars,
	times,
	percentages,
} from "../js/uicss.js";

const t = { top: "0px" };
const b = { bottom: "0px" };
const l = { left: "0px" };
const r = { right: "0px" };
const tl = { ...t, ...l };
const br = { ...b, ...r };

export default named({
	align: group(
		rule(".centered", {
			display: "flex",
			justify_content: "center",
			align_items: "center",
		}),
	),
	box: group(
		rule(".bbox", { box_sizing: "border-box" }),
		rule(".cbox", { box_sizing: "content-box" }),
	),
	blocks: group(
		rule(".il", { display: "inline" }),
		rule(".ibl", { display: "inline-block" }),
		rule(".bl", { display: "block" }),
		rule(".fl", { display: "flex" }),
		rule(".ifl", { display: "inline-flex" }),
	),
	position: group(
		rule(".cover", {
			position: "absolute",
			top: "0px",
			left: "0px",
			bottom: "0px",
			right: "0px",
		}),
		rule(".sticky", { position: "sticky" }),
		rule(".rel", { position: "relative" }),
		rule(".abs", { position: "absolute" }),
		rule(".fix", { position: "fixed" }),
		rule(".to-tl", tl),
		rule(".to-br", br),
		rule(".to-l", l),
		rule(".to-r", r),
		rule(".to-t", t),
		rule(".to-b", b),
		rule(".to-s", { top: "100%" }),
		rule(".to-n", { top: "0%" }),
		rule(".to-e", { left: "0%" }),
		rule(".to-w", { left: "100%" }),
		rule(".to-hc", { left: "50%" }),
	),
	gap: group(
		sizes.map((k, i) =>
			rule([`.g-${k}`, `.g-${i}`], {
				gap: `${vars.gap[i]}`,
				__gap: `${vars.gap[i]}`,
			}),
		),
	),
	expand: group(
		rule(".expand", {
			position: "absolute",
			box_sizing: "border-box",
			...tl,
			...br,
		}),

		rule(".expand-w", {
			position: "absolute",
			box_sizing: "border-box",
			...l,
			...r,
		}),
		rule(".expand-h", {
			position: "absolute",
			box_sizing: "border-box",
			...t,
			...b,
		}),
	),
	container: rule(".container > *", {
		min_width: "100%",
		min_height: "100%",
		box_sizing: "border-box",
	}),
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
			// NOTE: Note sure this is necessary
			// min_width: "100%",
			max_width: "100%",
		}),
		rule(".fit-h", {
			box_sizing: "border-box",
			height: "100%",
			min_height: "100%",
			max_height: "100%",
		}),
		rule(".fit-min", {
			width: "min-content",
		}),
		rule(".fit-max", {
			width: "max-content",
		}),
		rule(".fit-page", {
			max_width: `${vars.page.width}`,
		}),
		rule(".fit-text", {
			max_width: `${vars.text.width}`,
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
		}),
	),
	filling: group(
		rule(".fill-screen", {
			box_sizing: "border-box",
			min_width: "100vw",
			min_height: "100vh",
		}),
	),
	limit: group(
		...["text", "content", "page"].map((_) =>
			rule(`.limit-${_}`, { max_width: `${vars.limit[_]}` }),
		),
		...times(3, (i) =>
			rule(`.limit-${i}b`, { max_width: `${vars.limit.block[i]}` }),
		),
	),
	sizing: group(
		named({
			// TODO: Support min/max width
			width: group(
				...sizes.map((k, i) =>
					rule(`.w-${k}`, { width: `${vars.size[i + 1]}` }),
				),
				...sizes.map((k, i) =>
					rule(`.h-${k}`, { height: `${vars.size[i + 1]}` }),
				),
				rule(".w-screen", { width: "100vw" }),
				rule(".h-screen", { width: "100vh" }),
				rule(".w-text", { max_width: `${vars.limit.text}` }),
				rule(".w-content", { max_width: `${vars.limit.content}` }),
				rule(".w-page", { max_width: `${vars.limit.page}` }),
				rule(".h-0", { height: "0px" }),
				rule(".w-0", { width: "0px" }),
				rule(".no-h", {
					height: "auto",
					min_height: "0px",
					max_height: "unset",
				}),
				rule(".no-w", {
					width: "auto",
					min_width: "0px",
					max_width: "unset",
				}),
			),
			chars: group(
				...times(10, (_) =>
					rule(`.w-${_ + 1}ch`, {
						width: `${Math.round(1.25 * (_ + 1))}ch`,
					}),
				),
			),
			columns: group(
				...times(10, (_) =>
					rule(`.w-${_ + 1}cl`, {
						width: `calc(${vars.column.width}*${_ + 1})`,
					}),
				),
			),

			blocks: group(
				...times(10, (_) =>
					rule(`.w-${_ + 1}bl`, {
						width: `calc(${vars.block.width}*${_ + 1})`,
					}),
				),
				...times(10, (_) =>
					rule(`.h-${_ + 1}bl`, {
						width: `calc(${vars.block.width}*${_ + 1})`,
					}),
				),
			),
			percentage: group(
				...percentages.map((p) =>
					rule(`.w-${p}p`, {
						width: `${
							p === 33 ? "calc(100%/3)" : p === 66 ? "calc(100%*2/3)" : `${p}%`
						}`,
					}),
				),
				...percentages.map((p) =>
					rule(`.h-${p}p`, {
						height: `${
							p === 33 ? "calc(100%/3)" : p === 66 ? "calc(100%*2/3)" : `${p}%`
						}`,
					}),
				),
			),
		}),
	),
	sticky: group(rule(".sticky", { position: "sticky", top: 0 })),
	shapes: group(
		rule(".square", { aspect_ratio: "1/1" }),
		rule(".circle", { aspect_ratio: "1/1", border_radius: "50%" }),
	),
	row: group(
		rule(".row", {
			display: "flex",
			align_items: "center",
			gap: `${vars.gap[3]}`,
		}),
		rule(".row.stretch", {
			align_items: "stretch",
		}),
		rule(".row.end", {
			justify_content: "flex-end",
		}),
		rule(".row.lined > *", {
			border_right: `${vars.border.width} ${vars.border.style} ${vars.border.color} `,
			border_collapse: "collapse",
		}),
		rule(".row.lined > *:last-child", {
			border_right_width: "0px",
		}),
	),
	stack: group(
		rule(".stack", {
			display: "flex",
			flex_direction: "column",
		}),
		rule([".stack > .left", ".stack > .start"], {
			align_self: "flex-start",
		}),
		rule([".stack > .right", ".stack > .end"], {
			align_self: "flex-end",
		}),
		rule(".stack.lined > *", {
			border_bottom: `${vars.border.width} ${vars.border.style} ${vars.border.color} `,
			border_collapse: "collapse",
		}),
		rule(".stack.lined > *:last-child", {
			border_bottom_width: "0px",
		}),
	),
	flex: group(
		rule(".fill", {
			flex_grow: "1",
		}),
		rule(".shrink", {
			flex_shrink: "1",
		}),
		rule([".stack > .stretch", ".row > .stretch"], {
			align_self: "stretch",
		}),
		rule([".row.wrap", ".stack.wrap"], {
			flex_wrap: "wrap",
		}),
		rule([".row.top", ".stack.top"], {
			align_items: "flex-start",
		}),
		rule([".row.stretch", ".stack.stretch"], {
			align_items: "stretch",
		}),
	),
	grid: group(
		...times(7, (_) =>
			rule(`.col-${_ + 1}`, {
				display: "grid",
				grid_template_columns: `repeat(${_ + 1}, 1fr)`,
				grid_column_gap: `${vars.gap[3]}`,
			}),
		),
	),
	table: group(
		rule(
			[
				"table.lined thead tr td",
				"table.lined thead tr th",
				"table.lined tbody tr td",
				"table.lined tbody tr th",
			],
			{
				border_bottom: `${vars.border.width} ${vars.border.style} ${vars.border.color} `,
			},
		),
	),
	overflow: group(
		rule(".overflow", {
			scrollbar_color: `${vars.color.text}`,
			scrollbar_width: "thin",
			overflow: "auto",
		}),
		rule([".nooverflow", ".noflow"], {
			overflow: "hidden",
		}),
	),
});
