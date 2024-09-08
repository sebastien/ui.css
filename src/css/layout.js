import { sizes, named, rule, group, vars, times } from "../js/littlecss.js";

const t = { top: "0px" };
const b = { bottom: "0px" };
const l = { left: "0px" };
const r = { r: "0px" };
const tl = { ...t, ...l };
const br = { ...b, ...r };

export default named({
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
				margin: `${vars.margin[i + 1]}`,
			})
		),
		sizes.map((k, i) =>
			rule([`.mt-${k}`, `.mt-${i}`], {
				margin_top: `${vars.margin[i + 1]}`,
			})
		),
		sizes.map((k, i) =>
			rule([`.mb-${k}`, `.mb-${i}`], {
				margin_bottom: `${vars.margin[i + 1]}`,
			})
		),
		sizes.map((k, i) =>
			rule([`.ml-${k}`, `.ml-${i}`], {
				margin_left: `${vars.margin[i + 1]}`,
			})
		),
		sizes.map((k, i) =>
			rule([`.mr-${k}`, `.mr-${i}`], {
				margin_right: `${vars.margin[i + 1]}`,
			})
		)
	),
	padding: group(
		sizes.map((k, i) =>
			rule([`.p-${k}`, `.m-${i}`], {
				padding: `${vars.padding[i + 1]}`,
			})
		),
		sizes.map((k, i) =>
			rule([`.pt-${k}`, `.pt-${i}`], {
				padding_top: `${vars.padding[i + 1]}`,
			})
		),
		sizes.map((k, i) =>
			rule([`.pb-${k}`, `.pb-${i}`], {
				padding_bottom: `${vars.padding[i + 1]}`,
			})
		),
		sizes.map((k, i) =>
			rule([`.pl-${k}`, `.pl-${i}`], {
				padding_left: `${vars.padding[i + 1]}`,
			})
		),
		sizes.map((k, i) =>
			rule([`.pr-${k}`, `.pr-${i}`], {
				padding_right: `${vars.padding[i + 1]}`,
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
		})
	),
	wcol: group(
		...times(10, (_) =>
			rule(`.w-${_ + 1}col`, {
				width: `calc(${vars.column.width}*${_ + 1})`,
			})
		)
	),
	wbl: group(
		...times(10, (_) =>
			rule(`.w-${_ + 1}bl`, {
				width: `calc(${vars.block.width}*${_ + 1})`,
			})
		)
	),
});
