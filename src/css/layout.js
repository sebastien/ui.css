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
		rule(".rl-90", { transform: "rotate(-90deg)" }),
		rule(".rr-90", { transform: "rotate(90deg)" }),
	),
	gap: group(
		sizes.map((k, i) =>
			rule(`.g-${i}`, {
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
		rule(".fill-w", {
			box_sizing: "border-box",
			min_width: "100%",
		}),
		rule(".fill-h", {
			box_sizing: "border-box",
			min_height: "100%",
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
					rule(`.w-${i}`, { width: `${vars.size[i + 1]}` }),
				),
				...sizes.map((k, i) =>
					rule(`.h-${i}`, { height: `${vars.size[i + 1]}` }),
				),
				...times(10).map((_) => rule(`.w-${_}em`, { width: `${_}em` })),
				...times(10).map((_) => rule(`.h-${_}em`, { height: `${_}em` })),
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
				...times(5, (_) =>
					rule(`.w-${_ + 1}ch`, {
						width: `${Math.round(1.25 * (_ + 1))}ch`,
					}),
				),
			),
			columns: group(
				...times(5, (_) =>
					rule(`.w-${_ + 1}cl`, {
						width: `calc(${vars.column.width}*${_ + 1})`,
					}),
				),
			),

			blocks: group(
				...times(5, (_) =>
					rule(`.w-${_ + 1}bl`, {
						width: `calc(${vars.block.width}*${_ + 1})`,
					}),
				),
				...times(5, (_) =>
					rule(`.wmn-${_ + 1}bl`, {
						min_width: `calc(${vars.block.width}*${_ + 1})`,
					}),
				),
				...times(5, (_) =>
					rule(`.wmx-${_ + 1}bl`, {
						max_width: `calc(${vars.block.width}*${_ + 1})`,
					}),
				),
				...times(5, (_) =>
					rule(`.h-${_ + 1}bl`, {
						height: `calc(${vars.block.width}*${_ + 1})`,
					}),
				),
				...times(5, (_) =>
					rule(`.hmn-${_ + 1}bl`, {
						min_height: `calc(${vars.block.width}*${_ + 1})`,
					}),
				),
				...times(5, (_) =>
					rule(`.hmx-${_ + 1}bl`, {
						max_width: `calc(${vars.block.width}*${_ + 1})`,
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
			delta: group(
				rule(".d", {
					transform: `translate(var(--dx, 0px),var(--dy,0px))`,
				}),
				rule(".dp", {
					position: "relative",
					top: "var(--dy, 0px)",
					left: "var(--dy, 0px)",
				}),
				rule(".dm", {
					margin_top: "var(--dy, 0px)",
					margin_left: "var(--dy, 0px)",
				}),
				...times(5, (_) => rule(`.dr-${_ + 1}`, { __dx: `${_ + 1}px` })),
				...times(5, (_) => rule(`.dl-${_ + 1}`, { __dx: `-${_ + 1}px` })),
				...times(5, (_) => rule(`.db-${_ + 1}`, { __dy: `${_ + 1}px` })),
				...times(5, (_) => rule(`.dt-${_ + 1}`, { __dy: `-${_ + 1}px` })),
				...times(4, (_) =>
					rule(`.dr-${(_ + 1) * 25}`, { __dx: `${(_ + 1) * 25}%` }),
				),
				...times(4, (_) =>
					rule(`.dl-${(_ + 1) * 25}`, { __dx: `-${(_ + 1) * 25}%` }),
				),
				...times(4, (_) =>
					rule(`.db-${(_ + 1) * 25}`, { __dy: `${(_ + 1) * 25}%` }),
				),
				...times(4, (_) =>
					rule(`.dt-${(_ + 1) * 25}`, { __dy: `-${(_ + 1) * 25}%` }),
				),
			),
		}),
	),
	sticky: group(rule(".sticky", { position: "sticky", top: 0 })),
	shapes: group(
		rule([".square", ".disc", ".circle"], {
			box_sizing: "border-box",
			display: "inline-flex",
			align_items: "center",
			justify_content: "center",
			aspect_ratio: "1/1",
			line_height: "0em",
		}),
		rule([".circle", ".disc"], {
			border_radius: "50%",
		}),
		rule(".r-4_3", { aspect_ratio: "4/3" }),
		rule(".r-16_9", { aspect_ratio: "16/9" }),
	),
	row: group(
		rule(".row", {
			display: "flex",
			align_items: "center",
			gap: vars.gap,
		}),
		rule(".row.stretch", {
			align_items: "stretch",
		}),
		rule(".row.end", {
			justify_content: "flex-end",
		}),

		rule(".row.lined > *", {
			border_right: `${vars.border.width.or("1px")} ${vars.border.style.or("solid")} ${vars.border.color.or(vars.color.neutral)} `,
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
			align_items: "unset",
			align_self: "unset",
			justify_content: "unset",
			gap: vars.gap,
		}),
		rule([".stack > .left", ".stack > .start"], {
			align_self: "flex-start",
		}),
		rule([".stack > .right", ".stack > .end"], {
			align_self: "flex-end",
		}),
		rule(".stack.lined > *", {
			border_bottom: `${vars.border.width.or("1px")} ${vars.border.style.or("solid")} ${vars.border.color.or(vars.color.neutral)} `,
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
		rule(".filled > *", {
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
		rule(".grid", {
			display: "grid",
			gap: vars.gap,
			display: "grid",
		}),
		rule(".grid.lined > *", {
			border_right: `${vars.border.width.or("1px")} ${vars.border.style.or("solid")} ${vars.border.color.or(vars.color.neutral)} `,
			border_collapse: "collapse",
		}),
		rule(".grid.lined > *:last-child", {
			border_right_width: "0px",
		}),
		...times(5, (_) =>
			rule(`.span-${_ + 1}`, {
				__color: "red",
				grid_column: `span ${_ + 1}`,
			}),
		),

		...times(7, (_) =>
			rule(`.col-${_ + 1}`, {
				grid_template_columns: `repeat(${_ + 1}, 1fr)`,
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
	misc: group(
		rule(".lined", {
			gap: "0em",
		}),
	),
});
// EOF
