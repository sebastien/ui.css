import { contrast, cross, group, mods, named, rule, vars } from "../js/uicss.js";
import { colormixin } from "./colors.js";

const SIZES = [
	"smallest",
	"smaller",
	"small",
	"regular",
	"large",
	"larger",
	"largest",
];

const STATES = [
	"",
	":hover",
	"hover",
	":active",
	".active",
	":focus",
	":focus-within",
	".focus",
];

const COLOR_VARIANTS = ["primary", "secondary", "tertiary", "success", "warning", "danger", "accent"]

function outlineText(base) {
	return colormixin({
		base,
		tint: `${vars.color.ink}`,
		blend: "75%",
		opacity: "100%",
	})
}

function outlineEdge(base) {
	return colormixin({
		base,
		tint: base,
		blend: "100%",
		opacity: "90%",
	})
}

function outlineFill(base, opacity) {
	return colormixin({
		base,
		tint: `${vars.color.paper}`,
		blend: "82%",
		opacity: `${opacity}`,
	})
}

function focusOutline(base) {
	return colormixin({
		base,
		tint: `${vars.color.paper}`,
		blend: "62%",
		opacity: "72%",
	})
}

// Function: bare
// Removes all visual styling for the bare variant.
function bare(name) {
	return rule(
		[
			...cross(name, [".bare"]),
			...cross(
				name,
				[".bare"],
				STATES.filter((_) => _),
			),
		],
		{
			margin: "0px",
			padding: "0px",
			background: "transparent",
			border: "0px solid transparent",
			outline: "0px solid transparent",
			border_radius: "0px",
			box_shadow: "none",
			transition: "none",
			appearance: "none",
		},
	);
}

// Function: colorVariantRules
// Generates CSS variable overrides for color variant classes.
function colorVariantRules(name, selectors) {
	return COLOR_VARIANTS.map(
		(variant) =>
			rule(mods(selectors, variant), {
				...variantStyle(name, variant),
			}),
	);
}

function colorVariantStateRules(name, selectors) {
	return COLOR_VARIANTS.flatMap(
		(variant) => {
			const variantColor = cascade(name, ["color", variant], `${vars.color.primary}`)
			return [
				rule(cross(selectors, [`.${variant}`], [":hover", ".hover"]), {
					background: `color-mix(in oklch, ${variantColor}, ${vars.color.paper} 14%)`,
					border_color: `color-mix(in oklch, ${variantColor}, ${vars.color.paper} 14%)`,
					color: contrast(`color-mix(in oklch, ${variantColor}, ${vars.color.paper} 14%)`),
				}),
				rule(cross(selectors, [`.${variant}`], [":active", ".active"]), {
					background: `color-mix(in oklch, ${variantColor}, ${vars.color.ink} 18%)`,
					border_color: `color-mix(in oklch, ${variantColor}, ${vars.color.ink} 18%)`,
					color: contrast(`color-mix(in oklch, ${variantColor}, ${vars.color.ink} 18%)`),
				}),
			]
		},
	)
}

const INHERIT = {
	selectable: "button",
	selector: "button",
	checkbox: "button",
	radio: "button",
	textarea: "input",
	select: "input",
};

const FALLBACK = {
	font: {
		family: "sans-serif",
		line: "1.2",
		weight: "400",
		size: "1rem",
	},
	spacing: {
		padding: "0px",
		margin: "0px",
		radius: "0px",
		gap: "0px",
		item_padding: "0.5em 0.875em",
	},
	border: { width: "1px", style: "solid" },
	outline: { width: "2px", style: "solid" },
	color: {
		border: { base: `${vars.color.neutral}`, tint: `${vars.color.paper}`, blend: "70%", opacity: "100%" },
		text: { base: `${vars.color.ink}`, tint: `${vars.color.ink}`, blend: "0%", opacity: "100%" },
		background: { base: `${vars.color.neutral}`, tint: `${vars.color.paper}`, blend: "3%", opacity: "100%" },
		outline: { base: `${vars.color.neutral}`, tint: `${vars.color.paper}`, blend: "100%", opacity: "25%" },
	},
};

const norm = (value) => `${value}`.replaceAll("_", "-");
const cssVar = (name, ...path) => `--${[name, ...path].map(norm).join("-")}`;

function ancestry(name) {
	const chain = [name];
	let current = name;
	while (INHERIT[current]) {
		current = INHERIT[current];
		chain.push(current);
	}
	return chain;
}

function cascade(name, path, fallback) {
	return ancestry(name).reduceRight(
		(acc, component) => `var(${cssVar(component, ...path)}, ${acc})`,
		fallback,
	);
}

function normalToken(name, prop, key) {
	return cascade(name, ["normal", prop, key], FALLBACK.color[prop][key]);
}

function stateToken(name, state, prop, key) {
	return cascade(name, [state, prop, key], normalToken(name, prop, key));
}

function isDefinedToken(value) {
	return value !== undefined && !(value instanceof Object && value._name)
}

function hasToken(name, path) {
	for (const component of ancestry(name)) {
		let value = vars[component]
		for (const key of path) {
			value = value?.[key]
		}
		if (isDefinedToken(value)) {
			return true
		}
	}
	return false
}

function mixState(name, state, prop) {
	return colormixin({
		base: stateToken(name, state, prop, "base"),
		tint: stateToken(name, state, prop, "tint"),
		blend: stateToken(name, state, prop, "blend"),
		opacity: stateToken(name, state, prop, "opacity"),
	});
}

function mixMode(name, mode, prop) {
	return colormixin({
		base: cascade(name, [mode, prop, "base"], normalToken(name, prop, "base")),
		tint: cascade(name, [mode, prop, "tint"], normalToken(name, prop, "tint")),
		blend: cascade(name, [mode, prop, "blend"], normalToken(name, prop, "blend")),
		opacity: cascade(name, [mode, prop, "opacity"], normalToken(name, prop, "opacity")),
	});
}

function variantStyle(name, variant) {
	const variantColor = cascade(name, ["color", variant], `${vars.color.primary}`);
	return {
		background: variantColor,
		border_color: variantColor,
		color: contrast(variantColor),
	};
}

function fieldVariantStyle(name, variant) {
	const variantColor = cascade(name, ["color", variant], `${vars.color.primary}`)
	return {
		background: colormixin({
			base: variantColor,
			tint: `${vars.color.paper}`,
			blend: "6%",
			opacity: "100%",
		}),
		border_color: colormixin({
			base: variantColor,
			tint: variantColor,
			blend: "100%",
			opacity: "90%",
		}),
		color: mixState(name, "normal", "text"),
	}
}

function modeStyle(name, mode) {
	const style = {}
	if (hasToken(name, [mode, "background", "base"]) || hasToken(name, [mode, "background", "tint"]) || hasToken(name, [mode, "background", "blend"]) || hasToken(name, [mode, "background", "opacity"])) {
		style.background = mixMode(name, mode, "background")
	}
	if (hasToken(name, [mode, "border", "base"]) || hasToken(name, [mode, "border", "tint"]) || hasToken(name, [mode, "border", "blend"]) || hasToken(name, [mode, "border", "opacity"])) {
		style.border_color = mixMode(name, mode, "border")
	}
	if (hasToken(name, [mode, "text", "base"]) || hasToken(name, [mode, "text", "tint"]) || hasToken(name, [mode, "text", "blend"]) || hasToken(name, [mode, "text", "opacity"])) {
		style.color = mixMode(name, mode, "text")
	}
	if (hasToken(name, [mode, "outline", "base"]) || hasToken(name, [mode, "outline", "tint"]) || hasToken(name, [mode, "outline", "blend"]) || hasToken(name, [mode, "outline", "opacity"])) {
		style.outline_color = mixMode(name, mode, "outline")
	}
	return style
}

function stateStyle(name, state) {
	return {
		border_width: cascade(name, [state, "border", "width"], cascade(name, ["normal", "border", "width"], FALLBACK.border.width)),
		border_style: cascade(name, [state, "border", "style"], cascade(name, ["normal", "border", "style"], FALLBACK.border.style)),
		border_color: mixState(name, state, "border"),
		outline_width: cascade(name, [state, "outline", "width"], cascade(name, ["normal", "outline", "width"], FALLBACK.outline.width)),
		outline_style: cascade(name, [state, "outline", "style"], cascade(name, ["normal", "outline", "style"], FALLBACK.outline.style)),
		outline_color: mixState(name, state, "outline"),
		background: mixState(name, state, "background"),
		color: mixState(name, state, "text"),
	};
}


// ----------------------------------------------------------------------------
//
// BUTTON
//
// ----------------------------------------------------------------------------
function button(colors) {
	const name = ["button", ".button"];
	const selectable = [".selectable"];
	const controls = [...name, ...selectable];
	const n = "button";
	const sn = "selectable";

	return group(
		// Base button
		rule(name, {
			cursor: "pointer",
			padding: cascade(n, ["padding"], FALLBACK.spacing.padding),
			margin: cascade(n, ["margin"], FALLBACK.spacing.margin),
			outline_width: cascade(n, ["normal", "outline", "width"], FALLBACK.outline.width),
			outline_style: cascade(n, ["normal", "outline", "style"], FALLBACK.outline.style),
			outline_color: "transparent",
			border_width: cascade(n, ["normal", "border", "width"], FALLBACK.border.width),
			border_style: cascade(n, ["normal", "border", "style"], FALLBACK.border.style),
			border_color: mixState(n, "normal", "border"),
			border_radius: cascade(n, ["box", "radius"], FALLBACK.spacing.radius),
			transition: `${vars.control.transition}`,
			font_family: cascade(n, ["font", "family"], FALLBACK.font.family),
			line_height: cascade(n, ["font", "line"], FALLBACK.font.line),
			font_weight: cascade(n, ["font", "weight"], FALLBACK.font.weight),
			font_size: cascade(n, ["font", "size"], FALLBACK.font.size),
			display: "inline-flex",
			justify_content: "center",
			align_items: "center",
			background: mixState(n, "normal", "background"),
			color: mixState(n, "normal", "text"),
		}),
		// Base selectable
		rule(selectable, {
			cursor: "pointer",
			padding: cascade(sn, ["padding"], FALLBACK.spacing.padding),
			margin: cascade(sn, ["margin"], FALLBACK.spacing.margin),
			outline_width: cascade(sn, ["normal", "outline", "width"], FALLBACK.outline.width),
			outline_style: cascade(sn, ["normal", "outline", "style"], FALLBACK.outline.style),
			outline_color: "transparent",
			border_width: cascade(sn, ["normal", "border", "width"], FALLBACK.border.width),
			border_style: cascade(sn, ["normal", "border", "style"], FALLBACK.border.style),
			border_color: mixState(sn, "normal", "border"),
			border_radius: cascade(sn, ["box", "radius"], FALLBACK.spacing.radius),
			transition: `${vars.control.transition}`,
			font_family: cascade(sn, ["font", "family"], FALLBACK.font.family),
			line_height: cascade(sn, ["font", "line"], FALLBACK.font.line),
			font_weight: cascade(sn, ["font", "weight"], FALLBACK.font.weight),
			font_size: cascade(sn, ["font", "size"], FALLBACK.font.size),
			justify_content: "center",
			align_items: "center",
			background: mixState(sn, "normal", "background"),
			color: mixState(sn, "normal", "text"),
		}),
		// Color variants
		...colorVariantRules(n, name),
		...colorVariantRules(sn, selectable),
		...colorVariantStateRules(n, name),
		...colorVariantStateRules(sn, selectable),
		// Sizes
		...SIZES.map((size, i) =>
			rule(mods(name, size), {
				font_size: `calc(${cascade(n, ["font", "size"], FALLBACK.font.size)} * ${vars.textsize.size[i]})`,
				padding: `calc(${cascade(n, ["padding"], FALLBACK.spacing.padding)} * ${vars.textsize.size[i]})`,
			}),
		),
		// States - button
		rule(cross(name, [":focus-visible", ".focus"]), {
			outline_width: cascade(n, ["focus", "outline", "width"], cascade(n, ["normal", "outline", "width"], FALLBACK.outline.width)),
			outline_style: cascade(n, ["focus", "outline", "style"], cascade(n, ["normal", "outline", "style"], FALLBACK.outline.style)),
			outline_color: mixState(n, "focus", "outline"),
			...stateStyle(n, "focus"),
		}),
		...COLOR_VARIANTS.map((variant) => {
			const variantColor = cascade(n, ["color", variant], `${vars.color.primary}`)
			return rule(cross(name, [`.${variant}`], [":focus-visible", ".focus"]), {
				outline_color: focusOutline(variantColor),
			})
		}),
		rule(mods(name, "hover"), {
			...stateStyle(n, "hover"),
		}),
		rule(mods(name, "active"), {
			...stateStyle(n, "active"),
		}),
		rule(mods(name, "selected"), {
			...stateStyle(n, "selected"),
		}),
		rule(mods(name, "disabled"), {
			cursor: "default",
			...stateStyle(n, "disabled"),
		}),
		// States - selectable
		rule(cross(selectable, [":focus-visible", ".focus"]), {
			outline_width: cascade(sn, ["focus", "outline", "width"], cascade(sn, ["normal", "outline", "width"], FALLBACK.outline.width)),
			outline_style: cascade(sn, ["focus", "outline", "style"], cascade(sn, ["normal", "outline", "style"], FALLBACK.outline.style)),
			outline_color: mixState(sn, "focus", "outline"),
			...stateStyle(sn, "focus"),
		}),
		...COLOR_VARIANTS.map((variant) => {
			const variantColor = cascade(sn, ["color", variant], `${vars.color.primary}`)
			return rule(cross(selectable, [`.${variant}`], [":focus-visible", ".focus"]), {
				outline_color: focusOutline(variantColor),
			})
		}),
		rule(mods(selectable, "hover"), {
			...stateStyle(sn, "hover"),
		}),
		rule(mods(selectable, "active"), {
			...stateStyle(sn, "active"),
		}),
		rule(mods(selectable, "selected"), {
			...stateStyle(sn, "selected"),
		}),
		rule(mods(selectable, "disabled"), {
			cursor: "default",
			...stateStyle(sn, "disabled"),
		}),
		// Style variants
		rule(mods(controls, "default"), {
			border_width: `${vars.control.style.default.border.width}`,
		}),
		rule(mods(controls, "outline"), {
			border_width: "1px",
			...modeStyle(n, "outline"),
			...modeStyle(sn, "outline"),
			background: "transparent",
			color: outlineText(`${vars.color.ink}`),
			border_color: outlineEdge(`${vars.color.ink}`),
			outline_color: outlineEdge(`${vars.color.ink}`),
		}),
		rule(["button.outline", ".button.outline"], {
			border_width: "1px",
			background: "transparent",
			color: outlineText(`${vars.color.ink}`),
			border_color: outlineEdge(`${vars.color.ink}`),
			outline_color: outlineEdge(`${vars.color.ink}`),
		}),
		...COLOR_VARIANTS.map((variant) => {
			const variantColor = cascade(n, ["color", variant], `${vars.color.primary}`)
			return rule(cross(name, [`.outline.${variant}`]), {
				border_width: "1px",
				background: "transparent",
				color: outlineText(variantColor),
				border_color: outlineEdge(variantColor),
				outline_color: outlineEdge(variantColor),
			})
		}),
		...COLOR_VARIANTS.map((variant) => {
			const variantColor = cascade(n, ["color", variant], `${vars.color.primary}`)
			return rule([`button.outline.${variant}`, `.button.outline.${variant}`], {
				border_width: "1px",
				background: "transparent",
				color: outlineText(variantColor),
				border_color: outlineEdge(variantColor),
				outline_color: outlineEdge(variantColor),
			})
		}),
		...COLOR_VARIANTS.map((variant) => {
			const variantColor = cascade(sn, ["color", variant], `${vars.color.primary}`)
			return rule(cross(selectable, [`.outline.${variant}`]), {
				border_width: "1px",
				background: "transparent",
				color: outlineText(variantColor),
				border_color: outlineEdge(variantColor),
				outline_color: outlineEdge(variantColor),
			})
		}),
		rule(mods(name, "ghost"), {
			...modeStyle(n, "ghost"),
			outline_width: "0px",
			outline_color: "transparent",
		}),
		rule(cross(controls, [".blank"]), {
			...modeStyle(n, "blank"),
			...modeStyle(sn, "blank"),
		}),
		rule(cross(name, [".icon"]), {
			...modeStyle(n, "icon"),
			background: "transparent",
			padding: `${vars.control.icon.padding}`,
			width: `${vars.control.icon.size}`,
			height: `${vars.control.icon.size}`,
			aspect_ratio: "1",
			box_sizing: "content-box",
		}),
		rule(cross(selectable, [".icon"]), {
			...modeStyle(sn, "icon"),
			background: "transparent",
		}),
		rule(cross(name, [".outline", ".icon"], [":hover", ".hover"]), {
			background: outlineFill(`${vars.color.ink}`, "18%"),
			color: outlineText(`${vars.color.ink}`),
			border_color: outlineEdge(`${vars.color.ink}`),
			outline_color: outlineEdge(`${vars.color.ink}`),
		}),
		rule(cross(name, [".outline", ".icon"], [":active", ".active"]), {
			background: outlineFill(`${vars.color.ink}`, "30%"),
			color: outlineText(`${vars.color.ink}`),
			border_color: outlineEdge(`${vars.color.ink}`),
			outline_color: outlineEdge(`${vars.color.ink}`),
		}),
		...COLOR_VARIANTS.map((variant) => {
			const variantColor = cascade(n, ["color", variant], `${vars.color.primary}`)
			return rule(cross(name, [`.outline.${variant}`], [":hover", ".hover"]), {
				background: outlineFill(variantColor, "18%"),
				color: outlineText(variantColor),
				border_color: outlineEdge(variantColor),
				outline_color: outlineEdge(variantColor),
			})
		}),
		...COLOR_VARIANTS.map((variant) => {
			const variantColor = cascade(n, ["color", variant], `${vars.color.primary}`)
			return rule(cross(name, [`.outline.${variant}`], [":active", ".active"]), {
				background: outlineFill(variantColor, "30%"),
				color: outlineText(variantColor),
				border_color: outlineEdge(variantColor),
				outline_color: outlineEdge(variantColor),
			})
		}),
		rule(cross(name, [".outline", ".icon"], [".selected"]), {
			...stateStyle(n, "selected"),
		}),
		rule(cross(name, [".ghost"], [":hover", ".hover"]), {
			...stateStyle(n, "hover"),
		}),
		rule(cross(name, [".ghost"], [":active", ".active"]), {
			...stateStyle(n, "active"),
		}),
		rule(cross(name, [".ghost"], [".selected"]), {
			...stateStyle(n, "selected"),
		}),
		rule(cross(name, [".ghost"], [":focus-visible", ".focus"]), {
			...stateStyle(n, "focus"),
		}),
		rule(cross(selectable, [".outline", ".icon"], [":hover", ".hover"]), {
			...stateStyle(sn, "hover"),
		}),
		rule(cross(selectable, [".outline", ".icon"], [":active", ".active"]), {
			...stateStyle(sn, "active"),
		}),
		rule(cross(selectable, [".outline", ".icon"], [".selected"]), {
			...stateStyle(sn, "selected"),
		}),
		bare(controls),
	);
}

// ----------------------------------------------------------------------------
//
// SELECTOR
//
// ----------------------------------------------------------------------------
function selector(colors) {
	const name = [".selector"];
	const option = [
		...cross(name, ["> .option", "> label", "> button", "> a"]),
	];
	const selected = [
		...cross(name, ["> .selected", '> [aria-pressed="true"]', '> [aria-checked="true"]']),
		...cross(name, [" input:checked + label"]),
	];
	const n = "selector";

	return group(
		rule(name, {
			display: "inline-flex",
			width: "fit-content",
			align_self: "flex-start",
			flex_wrap: "nowrap",
			align_items: "center",
			overflow: "hidden",
			gap: cascade(n, ["box", "gap"], FALLBACK.spacing.gap),
			padding: cascade(n, ["padding"], FALLBACK.spacing.padding),
			margin: cascade(n, ["margin"], FALLBACK.spacing.margin),
			outline_width: cascade(n, ["normal", "outline", "width"], FALLBACK.outline.width),
			outline_style: cascade(n, ["normal", "outline", "style"], FALLBACK.outline.style),
			outline_color: mixState(n, "normal", "outline"),
			border_width: cascade(n, ["normal", "border", "width"], FALLBACK.border.width),
			border_style: cascade(n, ["normal", "border", "style"], FALLBACK.border.style),
			border_color: mixState(n, "normal", "border"),
			border_radius: cascade(n, ["box", "radius"], FALLBACK.spacing.radius),
			background: mixState(n, "normal", "background"),
			color: mixState(n, "normal", "text"),
			box_shadow: "none",
			transition: `${vars.control.transition}`,
			font_family: cascade(n, ["font", "family"], FALLBACK.font.family),
			line_height: cascade(n, ["font", "line"], FALLBACK.font.line),
			font_weight: cascade(n, ["font", "weight"], FALLBACK.font.weight),
			font_size: cascade(n, ["font", "size"], FALLBACK.font.size),
		}),
		rule(option, {
			cursor: "pointer",
			display: "inline-flex",
			flex: "0 0 auto",
			align_items: "center",
			justify_content: "center",
			position: "relative",
			padding: cascade(n, ["item", "padding"], FALLBACK.spacing.item_padding),
			border: "0px solid transparent",
			border_radius: cascade(n, ["box", "radius"], FALLBACK.spacing.radius),
			background: "transparent",
			color: "inherit",
			white_space: "nowrap",
			font: "inherit",
			text_decoration: "none",
			line_height: "1",
			user_select: "none",
			transition: `${vars.control.transition}`,
			margin: "0px",
		}),
		rule(cross(name, [" input[type=checkbox]", " input[type=radio]"]), {
			display: "none",
		}),
		...colors.map((variant) =>
			rule(mods(name, variant), {
				...fieldVariantStyle(n, variant),
			}),
		),
		rule(cross(name, [":focus-within", ".focus"]), {
			outline_width: cascade(n, ["normal", "outline", "width"], FALLBACK.outline.width),
			outline_color: mixState(n, "normal", "outline"),
			...stateStyle(n, "focus"),
		}),
		rule(cross(option, [":hover", ".hover"]), {
			background: mixState(n, "normal", "background"),
			...stateStyle(n, "hover"),
		}),
		rule(cross(option, [":active", ".active"]), {
			background: mixState(n, "normal", "background"),
			box_shadow: "none",
			...stateStyle(n, "active"),
		}),
		rule(selected, {
			background: mixState(n, "normal", "background"),
			color: stateToken(n, "selected", "text", "base"),
			box_shadow: "none",
			...stateStyle(n, "selected"),
		}),
		rule(cross(option, [":focus-visible", ".focus"]), {
			outline_width: cascade(n, ["normal", "outline", "width"], FALLBACK.outline.width),
			outline_color: mixState(n, "normal", "outline"),
			...stateStyle(n, "focus"),
		}),
		rule(cross(name, [".disabled", '[aria-disabled="true"]']), {
			cursor: "default",
			...stateStyle(n, "disabled"),
		}),
		rule(cross(option, [":disabled", ".disabled", '[aria-disabled="true"]']), {
			cursor: "default",
			opacity: "0.65",
			box_shadow: "none",
		}),
		rule(mods(name, "default"), {
			border_width: `${vars.control.style.default.border.width}`,
		}),
		rule(mods(name, "outline"), {
			border_width: `${vars.control.style.outline.border.width}`,
			...modeStyle(n, "outline"),
			outline_color: mixState(n, "normal", "background"),
		}),
		rule(cross(name, [".blank"]), {
			background: "transparent",
			border_color: "transparent",
			...modeStyle(n, "blank"),
		}),
		...SIZES.map((size, i) =>
			rule(mods(name, size), {
				font_size: `calc(${cascade(n, ["font", "size"], FALLBACK.font.size)} * ${vars.textsize.size[i]})`,
			}),
		),
		bare(name),
	);
}

// ----------------------------------------------------------------------------
//
// INPUT
//
// ----------------------------------------------------------------------------
function input(colors) {
	const name = ["input", ".input"];
	const n = "input";

	return group(
			rule(name, {
			padding: cascade(n, ["padding"], FALLBACK.spacing.padding),
			margin: cascade(n, ["margin"], FALLBACK.spacing.margin),
			outline_width: cascade(n, ["normal", "outline", "width"], FALLBACK.outline.width),
			outline_style: cascade(n, ["normal", "outline", "style"], FALLBACK.outline.style),
			outline_color: "transparent",
			border_width: cascade(n, ["normal", "border", "width"], FALLBACK.border.width),
			border_style: cascade(n, ["normal", "border", "style"], FALLBACK.border.style),
			border_color: mixState(n, "normal", "border"),
			border_radius: cascade(n, ["box", "radius"], FALLBACK.spacing.radius),
			transition: `${vars.control.transition}`,
			font_family: cascade(n, ["font", "family"], FALLBACK.font.family),
			line_height: cascade(n, ["font", "line"], FALLBACK.font.line),
			font_weight: cascade(n, ["font", "weight"], FALLBACK.font.weight),
			font_size: cascade(n, ["font", "size"], FALLBACK.font.size),
			display: "inline-flex",
			justify_content: "stretch",
			align_items: "center",
			background: mixState(n, "normal", "background"),
			color: mixState(n, "normal", "text"),
		}),
		...colors.map((variant) =>
			rule(mods(name, variant), {
				...fieldVariantStyle(n, variant),
			}),
		),
		rule(mods(name, "hover"), {
			...stateStyle(n, "hover"),
		}),
		rule(mods(name, "focus"), {
			outline_width: cascade(n, ["focus", "outline", "width"], cascade(n, ["normal", "outline", "width"], FALLBACK.outline.width)),
			outline_style: cascade(n, ["focus", "outline", "style"], cascade(n, ["normal", "outline", "style"], FALLBACK.outline.style)),
			outline_color: mixState(n, "focus", "outline"),
			border_width: cascade(n, ["focus", "border", "width"], cascade(n, ["normal", "border", "width"], FALLBACK.border.width)),
			border_style: cascade(n, ["focus", "border", "style"], cascade(n, ["normal", "border", "style"], FALLBACK.border.style)),
			border_color: mixState(n, "focus", "border"),
		}),
		...COLOR_VARIANTS.map((variant) => {
			const variantColor = cascade(n, ["color", variant], `${vars.color.primary}`)
			return rule(cross(name, [`.${variant}`], [":focus", ":focus-visible", ".focus"]), {
				outline_color: focusOutline(variantColor),
			})
		}),
		rule(mods(name, "active"), {
			...stateStyle(n, "active"),
		}),
		rule(cross(name, [":focus", ":focus-visible", ".focus"], [":active", ".active"]), {
			outline_width: cascade(n, ["focus", "outline", "width"], cascade(n, ["normal", "outline", "width"], FALLBACK.outline.width)),
			outline_style: cascade(n, ["focus", "outline", "style"], cascade(n, ["normal", "outline", "style"], FALLBACK.outline.style)),
			outline_color: mixState(n, "focus", "outline"),
		}),
		...COLOR_VARIANTS.map((variant) => {
			const variantColor = cascade(n, ["color", variant], `${vars.color.primary}`)
			return rule(cross(name, [`.${variant}`], [":focus", ":focus-visible", ".focus"], [":active", ".active"]), {
				outline_color: focusOutline(variantColor),
			})
		}),
		rule(mods(name, "disabled"), {
			cursor: "default",
			...stateStyle(n, "disabled"),
		}),
		rule(mods(name, "default"), {
			border_width: `${vars.control.style.default.border.width}`,
		}),
		rule(mods(name, "outline"), {
			border_width: `${vars.control.style.outline.border.width}`,
			...modeStyle(n, "outline"),
			outline_color: mixState(n, "normal", "background"),
		}),
		rule(mods(name, "ghost"), {
			...modeStyle(n, "ghost"),
			outline_width: "0px",
			outline_color: "transparent",
		}),
		rule(cross(name, [".blank"]), {
			background: "transparent",
			border_color: "transparent",
			...modeStyle(n, "blank"),
		}),
		rule(cross(name, [".icon"]), {
			background: "transparent",
			...modeStyle(n, "icon"),
			aspect_ratio: "1",
		}),
		rule(cross(name, [".ghost"], [":focus", ":focus-visible", ".focus"]), {
			...stateStyle(n, "focus"),
		}),
		...SIZES.map((size, i) =>
			rule(mods(name, size), {
				font_size: `calc(${cascade(n, ["font", "size"], FALLBACK.font.size)} * ${vars.textsize.size[i]})`,
			}),
		),
		bare(name),
	);
}

// ----------------------------------------------------------------------------
//
// TEXTAREA
//
// ----------------------------------------------------------------------------
function textarea(colors) {
	const name = ["textarea", ".textarea"];
	const n = "textarea";

	return group(
		rule(name, {
			padding: cascade(n, ["padding"], FALLBACK.spacing.padding),
			margin: cascade(n, ["margin"], FALLBACK.spacing.margin),
			outline_width: cascade(n, ["normal", "outline", "width"], FALLBACK.outline.width),
			outline_style: cascade(n, ["normal", "outline", "style"], FALLBACK.outline.style),
			outline_color: "transparent",
			border_width: cascade(n, ["normal", "border", "width"], FALLBACK.border.width),
			border_style: cascade(n, ["normal", "border", "style"], FALLBACK.border.style),
			border_color: mixState(n, "normal", "border"),
			border_radius: cascade(n, ["box", "radius"], FALLBACK.spacing.radius),
			transition: `${vars.control.transition}`,
			font_family: cascade(n, ["font", "family"], FALLBACK.font.family),
			line_height: cascade(n, ["font", "line"], FALLBACK.font.line),
			font_weight: cascade(n, ["font", "weight"], FALLBACK.font.weight),
			font_size: cascade(n, ["font", "size"], FALLBACK.font.size),
			background: mixState(n, "normal", "background"),
			color: mixState(n, "normal", "text"),
		}),
		...colors.map((variant) =>
			rule(mods(name, variant), {
				...fieldVariantStyle(n, variant),
			}),
		),
		rule(mods(name, "hover"), {
			...stateStyle(n, "hover"),
		}),
		rule(mods(name, "focus"), {
			outline_width: cascade(n, ["focus", "outline", "width"], cascade(n, ["normal", "outline", "width"], FALLBACK.outline.width)),
			outline_style: cascade(n, ["focus", "outline", "style"], cascade(n, ["normal", "outline", "style"], FALLBACK.outline.style)),
			outline_color: mixState(n, "focus", "outline"),
			border_width: cascade(n, ["focus", "border", "width"], cascade(n, ["normal", "border", "width"], FALLBACK.border.width)),
			border_style: cascade(n, ["focus", "border", "style"], cascade(n, ["normal", "border", "style"], FALLBACK.border.style)),
			border_color: mixState(n, "focus", "border"),
		}),
		...COLOR_VARIANTS.map((variant) => {
			const variantColor = cascade(n, ["color", variant], `${vars.color.primary}`)
			return rule(cross(name, [`.${variant}`], [":focus", ":focus-visible", ".focus"]), {
				outline_color: focusOutline(variantColor),
			})
		}),
		rule(mods(name, "active"), {
			...stateStyle(n, "active"),
		}),
		rule(cross(name, [":focus", ":focus-visible", ".focus"], [":active", ".active"]), {
			outline_width: cascade(n, ["focus", "outline", "width"], cascade(n, ["normal", "outline", "width"], FALLBACK.outline.width)),
			outline_style: cascade(n, ["focus", "outline", "style"], cascade(n, ["normal", "outline", "style"], FALLBACK.outline.style)),
			outline_color: mixState(n, "focus", "outline"),
		}),
		...COLOR_VARIANTS.map((variant) => {
			const variantColor = cascade(n, ["color", variant], `${vars.color.primary}`)
			return rule(cross(name, [`.${variant}`], [":focus", ":focus-visible", ".focus"], [":active", ".active"]), {
				outline_color: focusOutline(variantColor),
			})
		}),
		rule(mods(name, "disabled"), {
			cursor: "default",
			...stateStyle(n, "disabled"),
		}),
		rule(mods(name, "default"), {
			border_width: `${vars.control.style.default.border.width}`,
		}),
		rule(mods(name, "outline"), {
			border_width: `${vars.control.style.outline.border.width}`,
			...modeStyle(n, "outline"),
			outline_color: mixState(n, "normal", "background"),
		}),
		rule(mods(name, "ghost"), {
			...modeStyle(n, "ghost"),
			outline_width: "0px",
			outline_color: "transparent",
		}),
		rule(cross(name, [".blank"]), {
			background: "transparent",
			border_color: "transparent",
			...modeStyle(n, "blank"),
		}),
		rule(cross(name, [".icon"]), {
			background: "transparent",
			...modeStyle(n, "icon"),
			aspect_ratio: "1",
		}),
		rule(cross(name, [".ghost"], [":focus", ":focus-visible", ".focus"]), {
			...stateStyle(n, "focus"),
		}),
		...SIZES.map((size, i) =>
			rule(mods(name, size), {
				font_size: `calc(${cascade(n, ["font", "size"], FALLBACK.font.size)} * ${vars.textsize.size[i]})`,
			}),
		),
		bare(name),
	);
}

// ----------------------------------------------------------------------------
//
// SELECT
//
// ----------------------------------------------------------------------------
function select(colors) {
	const name = ["select", ".select"];
	const n = "select";

	return group(
		rule(name, {
			padding: cascade(n, ["padding"], FALLBACK.spacing.padding),
			margin: cascade(n, ["margin"], FALLBACK.spacing.margin),
			outline_width: cascade(n, ["normal", "outline", "width"], FALLBACK.outline.width),
			outline_style: cascade(n, ["normal", "outline", "style"], FALLBACK.outline.style),
			outline_color: "transparent",
			border_width: cascade(n, ["normal", "border", "width"], FALLBACK.border.width),
			border_style: cascade(n, ["normal", "border", "style"], FALLBACK.border.style),
			border_color: mixState(n, "normal", "border"),
			border_radius: cascade(n, ["box", "radius"], FALLBACK.spacing.radius),
			appearance: "none",
			transition: `${vars.control.transition}`,
			font_family: cascade(n, ["font", "family"], FALLBACK.font.family),
			line_height: cascade(n, ["font", "line"], FALLBACK.font.line),
			font_weight: cascade(n, ["font", "weight"], FALLBACK.font.weight),
			font_size: cascade(n, ["font", "size"], FALLBACK.font.size),
			display: "inline-flex",
			justify_content: "stretch",
			align_items: "center",
			background_color: mixState(n, "normal", "background"),
			color: mixState(n, "normal", "text"),
		}),
		rule(cross(name, [":not([multiple]):not([size])"]), {
			padding_right: `calc(${cascade(n, ["padding"], FALLBACK.spacing.padding)} + ${cascade(n, ["arrow", "offset"], "0.75em")} + ${cascade(n, ["arrow", "size"], "0.3em")})`,
			background_image:
				"linear-gradient(45deg, transparent 50%, currentColor 50%), linear-gradient(135deg, currentColor 50%, transparent 50%)",
			background_position: `right ${cascade(n, ["arrow", "offset"], "0.75em")} center, right calc(${cascade(n, ["arrow", "offset"], "0.75em")} - ${cascade(n, ["arrow", "gap"], "0.33em")}) center`,
			background_size: `${cascade(n, ["arrow", "size"], "0.3em")} ${cascade(n, ["arrow", "size"], "0.3em")}, ${cascade(n, ["arrow", "size"], "0.3em")} ${cascade(n, ["arrow", "size"], "0.3em")}`,
			background_repeat: "no-repeat",
		}),
		...colors.map((variant) =>
			rule(mods(name, variant), {
				...variantStyle(n, variant),
			}),
		),
		rule(mods(name, "focus"), {
			outline_width: cascade(n, ["focus", "outline", "width"], cascade(n, ["normal", "outline", "width"], FALLBACK.outline.width)),
			outline_style: cascade(n, ["focus", "outline", "style"], cascade(n, ["normal", "outline", "style"], FALLBACK.outline.style)),
			outline_color: mixState(n, "focus", "outline"),
			border_width: cascade(n, ["focus", "border", "width"], cascade(n, ["normal", "border", "width"], FALLBACK.border.width)),
			border_style: cascade(n, ["focus", "border", "style"], cascade(n, ["normal", "border", "style"], FALLBACK.border.style)),
			border_color: mixState(n, "focus", "border"),
		}),
		...COLOR_VARIANTS.map((variant) => {
			const variantColor = cascade(n, ["color", variant], `${vars.color.primary}`)
			return rule(cross(name, [`.${variant}`], [":focus", ":focus-visible", ".focus"]), {
				outline_color: focusOutline(variantColor),
			})
		}),
		rule(mods(name, "default"), {
			border_width: `${vars.control.style.default.border.width}`,
		}),
		rule(mods(name, "outline"), {
			border_width: `${vars.control.style.outline.border.width}`,
			...modeStyle(n, "outline"),
		}),
		rule(mods(name, "disabled"), {
			cursor: "default",
			...stateStyle(n, "disabled"),
		}),
		...SIZES.map((size, i) =>
			rule(mods(name, size), {
				font_size: `calc(${cascade(n, ["font", "size"], FALLBACK.font.size)} * ${vars.textsize.size[i]})`,
			}),
		),
		bare(name),
	);
}

// ----------------------------------------------------------------------------
//
// RANGE
//
// ----------------------------------------------------------------------------
function range(colors) {
	const name = ['input[type="range"]', ".range"];
	const n = "range";

	return group(
		rule(name, {
			appearance: "none",
			font_family: cascade(n, ["font", "family"], FALLBACK.font.family),
			line_height: cascade(n, ["font", "line"], FALLBACK.font.line),
			font_weight: cascade(n, ["font", "weight"], FALLBACK.font.weight),
			font_size: cascade(n, ["font", "size"], FALLBACK.font.size),
			width: "100%",
			max_width: cascade(n, ["box", "max", "width"], "100%"),
			cursor: "pointer",
			min_height: cascade(n, ["thumb", "size"], "1em"),
			padding: cascade(n, ["padding"], FALLBACK.spacing.padding),
			margin: cascade(n, ["margin"], FALLBACK.spacing.margin),
			background: "transparent",
			border: "0px solid transparent",
			border_radius: "0px",
			box_shadow: "none",
			transition: "none",
		}),
		...colors.map((variant) =>
			rule(mods(name, variant), {
				...variantStyle(n, variant),
			}),
		),
		rule(name.map((s) => `${s}::-webkit-slider-runnable-track`), {
			height: cascade(n, ["track", "size"], "0.28em"),
			border_radius: cascade(n, ["track", "radius"], "999px"),
			background: cascade(n, ["track", "color"], "#d7dbe0"),
		}),
		rule(name.map((s) => `${s}::-webkit-slider-thumb`), {
			appearance: "none",
			width: cascade(n, ["thumb", "size"], "0.95em"),
			height: cascade(n, ["thumb", "size"], "0.95em"),
			border_radius: cascade(n, ["thumb", "radius"], "50%"),
			background: mixState(n, "normal", "background"),
			border: "0px solid transparent",
			margin_top: `calc((${cascade(n, ["track", "size"], "0.28em")} - ${cascade(n, ["thumb", "size"], "0.95em")}) / 2)`,
		}),
		rule(name.map((s) => `${s}::-moz-range-track`), {
			height: cascade(n, ["track", "size"], "0.28em"),
			border_radius: cascade(n, ["track", "radius"], "999px"),
			background: cascade(n, ["track", "color"], "#d7dbe0"),
			border: "0px solid transparent",
		}),
		rule(name.map((s) => `${s}::-moz-range-thumb`), {
			width: cascade(n, ["thumb", "size"], "0.95em"),
			height: cascade(n, ["thumb", "size"], "0.95em"),
			border_radius: cascade(n, ["thumb", "radius"], "50%"),
			background: mixState(n, "normal", "background"),
			border: "0px solid transparent",
		}),
		rule(mods(name, "focus"), {
			outline_width: cascade(n, ["normal", "outline", "width"], FALLBACK.outline.width),
			outline_color: mixState(n, "normal", "outline"),
			...stateStyle(n, "focus"),
		}),
		rule(name.map((s) => `${s}:focus-visible`), {
			outline_width: cascade(n, ["normal", "outline", "width"], FALLBACK.outline.width),
			outline_color: mixState(n, "normal", "outline"),
		}),
		...SIZES.map((size, i) =>
			rule(mods(name, size), {
				font_size: `calc(${cascade(n, ["font", "size"], FALLBACK.font.size)} * ${vars.textsize.size[i]})`,
			}),
		),
		bare(name),
	);
}

// ----------------------------------------------------------------------------
//
// CHECKBOX
//
// ----------------------------------------------------------------------------
function checkbox(colors) {
	const name = ['input[type="checkbox"]', ".checkbox"];
	const n = "checkbox";

	return group(
		rule(name, {
			cursor: "pointer",
			appearance: "none",
			font_size: cascade(n, ["font", "size"], FALLBACK.font.size),
			width: cascade(n, ["box", "size"], "1.15em"),
			height: cascade(n, ["box", "size"], "1.15em"),
			padding: cascade(n, ["padding"], FALLBACK.spacing.padding),
			margin: cascade(n, ["margin"], FALLBACK.spacing.margin),
			display: "inline-block",
			position: "relative",
			box_sizing: "border-box",
			outline_width: cascade(n, ["normal", "outline", "width"], FALLBACK.outline.width),
			outline_style: cascade(n, ["normal", "outline", "style"], FALLBACK.outline.style),
			outline_color: mixState(n, "normal", "outline"),
			border_width: cascade(n, ["normal", "border", "width"], FALLBACK.border.width),
			border_style: cascade(n, ["normal", "border", "style"], FALLBACK.border.style),
			border_color: mixState(n, "normal", "border"),
			border_radius: cascade(n, ["box", "radius"], FALLBACK.spacing.radius),
			transition: `${vars.control.transition}`,
			font_family: cascade(n, ["font", "family"], FALLBACK.font.family),
			line_height: cascade(n, ["font", "line"], FALLBACK.font.line),
			font_weight: cascade(n, ["font", "weight"], FALLBACK.font.weight),
			background: mixState(n, "normal", "background"),
			color: mixState(n, "normal", "text"),
		}),
		...colors.map((variant) =>
			rule(mods(name, variant), {
				...variantStyle(n, variant),
			}),
		),
		rule(mods(name, "hover"), {
			...stateStyle(n, "hover"),
		}),
		rule(mods(name, "focus"), {
			outline_width: cascade(n, ["normal", "outline", "width"], FALLBACK.outline.width),
			outline_color: mixState(n, "normal", "outline"),
			...stateStyle(n, "focus"),
		}),
		rule(mods(name, "active"), {
			...stateStyle(n, "active"),
		}),
		rule(mods(name, "disabled"), {
			cursor: "default",
			...stateStyle(n, "disabled"),
		}),
			rule(
			name.map((s) => `${s}:checked`),
			{
				position: "relative",
				border_color: mixState(n, "normal", "background"),
				background: mixState(n, "normal", "background"),
			},
		),
		rule(
			name.map((s) => `${s}:checked::after`),
			{
				content: cascade(n, ["content", "checked"], "\"✓\""),
				position: "absolute",
				top: "50%",
				left: "50%",
				transform: "translate(-50%, -50%)",
				font_size: cascade(n, ["box", "marker"], "0.72em"),
				line_height: "1",
				color: stateToken(n, "normal", "text", "base"),
			},
		),
			rule(
			name.map((s) => `${s}:indeterminate`),
			{
				position: "relative",
				border_color: mixState(n, "normal", "background"),
				background: mixState(n, "normal", "background"),
			},
		),
		rule(
			name.map((s) => `${s}:indeterminate::after`),
			{
				content: cascade(n, ["content", "partial"], "\"─\""),
				position: "absolute",
				top: "50%",
				left: "50%",
				transform: "translate(-50%, -50%)",
				font_size: cascade(n, ["box", "marker"], "0.72em"),
				line_height: "1",
				color: stateToken(n, "normal", "text", "base"),
			},
		),
		rule(mods(name, "default"), {
			border_width: `${vars.control.style.default.border.width}`,
		}),
		rule(mods(name, "outline"), {
			border_width: `${vars.control.style.outline.border.width}`,
			...modeStyle(n, "outline"),
		}),
		rule(cross(name, [".blank"]), {
			background: "transparent",
			border_color: "transparent",
			...modeStyle(n, "blank"),
		}),
		rule(cross(name, [".icon"]), {
			background: "transparent",
			...modeStyle(n, "icon"),
			aspect_ratio: "1",
		}),
		...SIZES.map((size, i) =>
			rule(mods(name, size), {
				font_size: `calc(${cascade(n, ["font", "size"], FALLBACK.font.size)} * ${vars.textsize.size[i]})`,
			}),
		),
		bare(name),
	);
}

// ----------------------------------------------------------------------------
//
// RADIO
//
// ----------------------------------------------------------------------------
function radio(colors) {
	const name = ['input[type="radio"]', ".radio"];
	const n = "radio";

	return group(
		rule(name, {
			cursor: "pointer",
			appearance: "none",
			font_size: cascade(n, ["font", "size"], FALLBACK.font.size),
			width: cascade(n, ["box", "size"], "1.15em"),
			height: cascade(n, ["box", "size"], "1.15em"),
			padding: cascade(n, ["padding"], FALLBACK.spacing.padding),
			margin: cascade(n, ["margin"], FALLBACK.spacing.margin),
			display: "inline-block",
			position: "relative",
			box_sizing: "border-box",
			outline_width: cascade(n, ["normal", "outline", "width"], FALLBACK.outline.width),
			outline_style: cascade(n, ["normal", "outline", "style"], FALLBACK.outline.style),
			outline_color: mixState(n, "normal", "outline"),
			border_width: cascade(n, ["normal", "border", "width"], FALLBACK.border.width),
			border_style: cascade(n, ["normal", "border", "style"], FALLBACK.border.style),
			border_color: mixState(n, "normal", "border"),
			border_radius: cascade(n, ["box", "radius"], FALLBACK.spacing.radius),
			transition: `${vars.control.transition}`,
			font_family: cascade(n, ["font", "family"], FALLBACK.font.family),
			line_height: cascade(n, ["font", "line"], FALLBACK.font.line),
			font_weight: cascade(n, ["font", "weight"], FALLBACK.font.weight),
			background: mixState(n, "normal", "background"),
			color: mixState(n, "normal", "text"),
		}),
		...colors.map((variant) =>
			rule(mods(name, variant), {
				...variantStyle(n, variant),
			}),
		),
		rule(mods(name, "hover"), {
			...stateStyle(n, "hover"),
		}),
		rule(mods(name, "focus"), {
			outline_width: cascade(n, ["normal", "outline", "width"], FALLBACK.outline.width),
			outline_color: mixState(n, "normal", "outline"),
			...stateStyle(n, "focus"),
		}),
		rule(mods(name, "active"), {
			...stateStyle(n, "active"),
		}),
		rule(mods(name, "disabled"), {
			cursor: "default",
			...stateStyle(n, "disabled"),
		}),
			rule(
			name.map((s) => `${s}:checked`),
			{
				position: "relative",
				border_color: mixState(n, "normal", "background"),
				background: mixState(n, "normal", "background"),
			},
		),
		rule(
			name.map((s) => `${s}:checked::after`),
			{
				content: cascade(n, ["content", "checked"], "\"●\""),
				position: "absolute",
				top: "50%",
				left: "50%",
				transform: "translate(-50%, -50%)",
				font_size: cascade(n, ["box", "marker"], "0.72em"),
				line_height: "1",
				color: stateToken(n, "normal", "text", "base"),
			},
		),
		rule(mods(name, "default"), {
			border_width: `${vars.control.style.default.border.width}`,
		}),
		rule(mods(name, "outline"), {
			border_width: `${vars.control.style.outline.border.width}`,
			...modeStyle(n, "outline"),
		}),
		rule(cross(name, [".blank"]), {
			background: "transparent",
			border_color: "transparent",
			...modeStyle(n, "blank"),
		}),
		rule(cross(name, [".icon"]), {
			background: "transparent",
			...modeStyle(n, "icon"),
			aspect_ratio: "1",
		}),
		...SIZES.map((size, i) =>
			rule(mods(name, size), {
				font_size: `calc(${cascade(n, ["font", "size"], FALLBACK.font.size)} * ${vars.textsize.size[i]})`,
			}),
		),
		bare(name),
	);
}

// ----------------------------------------------------------------------------
//
// EXPORTS
//
// ----------------------------------------------------------------------------

const colors = [
	"primary",
	"secondary",
	"tertiary",
	"success",
	"warning",
	"danger",
	"accent",
];
export default named({
	button: button(colors),
	selector: selector(colors),
	input: input(colors),
	select: select(colors),
	textarea: textarea(colors),
	range: range(colors),
	checkbox: checkbox(colors),
	radio: radio(colors),
});
// EOF
