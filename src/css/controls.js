import {
	contrast,
	cross,
	group,
	mods,
	named,
	rule,
	vars,
} from "../js/uicss.js";
import { colormixin } from "./colors.js";

// ----------------------------------------------------------------------------
//
// CONSTANTS
//
// ----------------------------------------------------------------------------

const SIZES = [
	"smallest",
	"smaller",
	"small",
	"regular",
	"large",
	"larger",
	"largest",
];
const COLORS = [
	"primary",
	"secondary",
	"tertiary",
	"success",
	"warning",
	"danger",
	"accent",
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

// Inheritance chain: child inherits unset tokens from parent.
const INHERIT = {
	selectable: "button",
	selector: "input",
	checkbox: "input",
	radio: "input",
	textarea: "input",
	select: "input",
};

const FALLBACK = {
	font: { family: "sans-serif", line: "1.2", weight: "400", size: "1rem" },
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
		border: {
			base: `${vars.color.neutral}`,
			tint: `${vars.color.paper}`,
			blend: "70%",
			opacity: "100%",
		},
		text: {
			base: `${vars.color.ink}`,
			tint: `${vars.color.ink}`,
			blend: "0%",
			opacity: "100%",
		},
		background: {
			base: `${vars.color.neutral}`,
			tint: `${vars.color.paper}`,
			blend: "100%",
			opacity: "100%",
		},
		outline: {
			base: `${vars.color.neutral}`,
			tint: `${vars.color.paper}`,
			blend: "100%",
			opacity: "25%",
		},
	},
	hover: {
		background: {
			base: `${vars.color.neutral}`,
			tint: `${vars.color.paper}`,
			blend: "82%",
			opacity: "100%",
		},
	},
	active: {
		background: {
			base: `${vars.color.neutral}`,
			tint: `${vars.color.paper}`,
			blend: "100%",
			opacity: "100%",
		},
		border: {
			base: `${vars.color.neutral}`,
			tint: `${vars.color.ink}`,
			blend: "50%",
			opacity: "100%",
		},
	},
};

// ----------------------------------------------------------------------------
//
// TOKEN RESOLUTION
//
// ----------------------------------------------------------------------------

// Function: chain
// Walks the inheritance chain for a component name.
function chain(name) {
	const res = [name];
	let cur = name;
	while (INHERIT[cur]) {
		cur = INHERIT[cur];
		res.push(cur);
	}
	return res;
}

const norm = (v) => `${v}`.replaceAll("_", "-");
const cssvar = (name, ...path) => `--${[name, ...path].map(norm).join("-")}`;

// Function: tok
// Builds a var() fallback chain through the inheritance hierarchy.
// tok("checkbox", ["font","size"]) → var(--checkbox-font-size, var(--input-font-size, 1rem))
function tok(name, path, fallback) {
	return chain(name).reduceRight(
		(acc, c) => `var(${cssvar(c, ...path)}, ${acc})`,
		fallback,
	);
}

// Function: ntok
// Normal-state color token: tok(name, ["normal", prop, key], FALLBACK.color[prop][key])
function ntok(name, prop, key) {
	return tok(name, ["normal", prop, key], FALLBACK.color[prop][key]);
}

// Function: stok
// State color token with fallback to state-specific default, then normal.
function stok(name, state, prop, key) {
	const fb = FALLBACK[state]?.[prop]?.[key];
	const normal = ntok(name, prop, key);
	return tok(name, [state, prop, key], fb ? fb : normal);
}

// Function: mix
// Produces a colormixin expression for (name, state, prop).
function mix(name, state, prop) {
	return colormixin({
		base: stok(name, state, prop, "base"),
		tint: stok(name, state, prop, "tint"),
		blend: stok(name, state, prop, "blend"),
		opacity: stok(name, state, prop, "opacity"),
	});
}

// Function: mmix
// Produces a colormixin expression for a mode (outline, ghost, etc).
function mmix(name, mode, prop) {
	return colormixin({
		base: tok(name, [mode, prop, "base"], ntok(name, prop, "base")),
		tint: tok(name, [mode, prop, "tint"], ntok(name, prop, "tint")),
		blend: tok(name, [mode, prop, "blend"], ntok(name, prop, "blend")),
		opacity: tok(name, [mode, prop, "opacity"], ntok(name, prop, "opacity")),
	});
}

// Function: defined
// Checks if a token value is actually set (not undefined, not a proxy Scope).
function defined(value) {
	return value !== undefined && !(value instanceof Object && value._name);
}

// Function: hastok
// Returns true if any component in the chain defines the given token path.
function hastok(name, path) {
	for (const c of chain(name)) {
		let v = vars[c];
		for (const k of path) {
			v = v?.[k];
		}
		if (defined(v)) return true;
	}
	return false;
}

// ----------------------------------------------------------------------------
//
// STYLE RECIPES
//
// ----------------------------------------------------------------------------

// Function: base
// Common base style: border, outline, font, background, color.
function base(n) {
	return {
		padding: tok(n, ["padding"], FALLBACK.spacing.padding),
		margin: tok(n, ["margin"], FALLBACK.spacing.margin),
		outline_width: tok(
			n,
			["normal", "outline", "width"],
			FALLBACK.outline.width,
		),
		outline_style: tok(
			n,
			["normal", "outline", "style"],
			FALLBACK.outline.style,
		),
		outline_color: "transparent",
		border_width: tok(n, ["normal", "border", "width"], FALLBACK.border.width),
		border_style: tok(n, ["normal", "border", "style"], FALLBACK.border.style),
		border_color: mix(n, "normal", "border"),
		border_radius: tok(n, ["box", "radius"], FALLBACK.spacing.radius),
		transition: `${vars.control.transition}`,
		font_family: tok(n, ["font", "family"], FALLBACK.font.family),
		line_height: tok(n, ["font", "line"], FALLBACK.font.line),
		font_weight: tok(n, ["font", "weight"], FALLBACK.font.weight),
		font_size: tok(n, ["font", "size"], FALLBACK.font.size),
		background: mix(n, "normal", "background"),
		color: mix(n, "normal", "text"),
	};
}

// Function: state
// Full state style: border width/style/color, outline, background, color.
function state(n, s) {
	return {
		border_width: tok(
			n,
			[s, "border", "width"],
			tok(n, ["normal", "border", "width"], FALLBACK.border.width),
		),
		border_style: tok(
			n,
			[s, "border", "style"],
			tok(n, ["normal", "border", "style"], FALLBACK.border.style),
		),
		border_color: mix(n, s, "border"),
		outline_width: tok(
			n,
			[s, "outline", "width"],
			tok(n, ["normal", "outline", "width"], FALLBACK.outline.width),
		),
		outline_style: tok(
			n,
			[s, "outline", "style"],
			tok(n, ["normal", "outline", "style"], FALLBACK.outline.style),
		),
		outline_color: mix(n, s, "outline"),
		background: mix(n, s, "background"),
		color: mix(n, s, "text"),
	};
}

// Function: variant
// Solid color variant: background=color, border=color, text=contrast.
function variant(n, v) {
	const c = tok(n, ["color", v], `${vars.color.primary}`);
	return { background: c, border_color: c, color: contrast(c) };
}

// Function: fvariant
// Field variant: tinted background, colored border, normal text.
function fvariant(n, v) {
	const c = tok(n, ["color", v], `${vars.color.primary}`);
	return {
		background: colormixin({
			base: c,
			tint: `${vars.color.paper}`,
			blend: "6%",
			opacity: "100%",
		}),
		border_color: colormixin({
			base: c,
			tint: c,
			blend: "100%",
			opacity: "90%",
		}),
		color: mix(n, "normal", "text"),
	};
}

// Function: focusol
// Focus outline color from a base color.
function focusol(base) {
	return colormixin({
		base,
		tint: `${vars.color.paper}`,
		blend: "62%",
		opacity: "72%",
	});
}

// Function: oltxt
// Outline-mode text color.
function oltxt(base) {
	return colormixin({
		base,
		tint: `${vars.color.ink}`,
		blend: "75%",
		opacity: "100%",
	});
}

// Function: oledge
// Outline-mode edge color.
function oledge(base) {
	return colormixin({ base, tint: base, blend: "100%", opacity: "90%" });
}

// Function: olfill
// Outline-mode fill color.
function olfill(base, opacity) {
	return colormixin({
		base,
		tint: `${vars.color.paper}`,
		blend: "82%",
		opacity: `${opacity}`,
	});
}

// Function: modestyle
// Conditionally emits mode overrides only for tokens that are defined.
function modestyle(n, mode) {
	const s = {};
	const keys = ["base", "tint", "blend", "opacity"];
	if (keys.some((k) => hastok(n, [mode, "background", k])))
		s.background = mmix(n, mode, "background");
	if (keys.some((k) => hastok(n, [mode, "border", k])))
		s.border_color = mmix(n, mode, "border");
	if (keys.some((k) => hastok(n, [mode, "text", k])))
		s.color = mmix(n, mode, "text");
	if (keys.some((k) => hastok(n, [mode, "outline", k])))
		s.outline_color = mmix(n, mode, "outline");
	return s;
}

// Function: focusrule
// Focus outline properties for a control.
function focusrule(sel, n) {
	return {
		outline_width: tok(
			n,
			["focus", "outline", "width"],
			tok(n, ["normal", "outline", "width"], FALLBACK.outline.width),
		),
		outline_style: tok(
			n,
			["focus", "outline", "style"],
			tok(n, ["normal", "outline", "style"], FALLBACK.outline.style),
		),
		outline_color: mix(n, "focus", "outline"),
	};
}

// Function: sizerules
// Size modifier rules.
function sizerules(sel, n) {
	return SIZES.map((size, i) =>
		rule(mods(sel, size), {
			font_size: `calc(${tok(n, ["font", "size"], FALLBACK.font.size)} * ${vars.textsize.size[i]})`,
		}),
	);
}

// Function: bare
// Strips all styling for the .bare modifier.
function bare(sel) {
	return rule(
		[
			...cross(sel, [".bare"]),
			...cross(
				sel,
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

// ----------------------------------------------------------------------------
//
// BUTTON
//
// ----------------------------------------------------------------------------

function button() {
	const name = ["button", ".button"];
	const selectable = [".selectable"];
	const controls = [...name, ...selectable];
	const n = "button";
	const sn = "selectable";

	return group(
		// Base button
		rule(name, {
			cursor: "pointer",
			...base(n),
			display: "inline-flex",
			justify_content: "center",
			align_items: "center",
		}),
		// Base selectable
		rule(selectable, {
			cursor: "pointer",
			...base(sn),
			justify_content: "center",
			align_items: "center",
		}),
		// Color variants
		...COLORS.flatMap((v) => [
			rule(mods(name, v), variant(n, v)),
			rule(mods(selectable, v), variant(sn, v)),
		]),
		// Color variant hover/active
		...COLORS.flatMap((v) => {
			const cn = tok(n, ["color", v], `${vars.color.primary}`);
			const cs = tok(sn, ["color", v], `${vars.color.primary}`);
			return [
				rule(cross(name, [`.${v}`], [":hover", ".hover"]), {
					background: `color-mix(in oklch, ${cn}, ${vars.color.paper} 14%)`,
					border_color: `color-mix(in oklch, ${cn}, ${vars.color.paper} 14%)`,
					color: contrast(
						`color-mix(in oklch, ${cn}, ${vars.color.paper} 14%)`,
					),
				}),
				rule(cross(name, [`.${v}`], [":active", ".active"]), {
					background: `color-mix(in oklch, ${cn}, ${vars.color.ink} 18%)`,
					border_color: `color-mix(in oklch, ${cn}, ${vars.color.ink} 18%)`,
					color: contrast(`color-mix(in oklch, ${cn}, ${vars.color.ink} 18%)`),
				}),
				rule(cross(selectable, [`.${v}`], [":hover", ".hover"]), {
					background: `color-mix(in oklch, ${cs}, ${vars.color.paper} 14%)`,
					border_color: `color-mix(in oklch, ${cs}, ${vars.color.paper} 14%)`,
					color: contrast(
						`color-mix(in oklch, ${cs}, ${vars.color.paper} 14%)`,
					),
				}),
				rule(cross(selectable, [`.${v}`], [":active", ".active"]), {
					background: `color-mix(in oklch, ${cs}, ${vars.color.ink} 18%)`,
					border_color: `color-mix(in oklch, ${cs}, ${vars.color.ink} 18%)`,
					color: contrast(`color-mix(in oklch, ${cs}, ${vars.color.ink} 18%)`),
				}),
			];
		}),
		// Sizes
		...SIZES.map((size, i) =>
			rule(mods(name, size), {
				font_size: `calc(${tok(n, ["font", "size"], FALLBACK.font.size)} * ${vars.textsize.size[i]})`,
				padding: `calc(${tok(n, ["padding"], FALLBACK.spacing.padding)} * ${vars.textsize.size[i]})`,
			}),
		),
		// States - button
		rule(cross(name, [":focus-visible", ".focus"]), {
			...focusrule(name, n),
			...state(n, "focus"),
		}),
		...COLORS.map((v) => {
			const vc = tok(n, ["color", v], `${vars.color.primary}`);
			const vs = variant(n, v);
			return rule(cross(name, [`.${v}`], [":focus-visible", ".focus"]), {
				outline_color: focusol(vc),
				background: vs.background,
				border_color: vs.border_color,
				color: vs.color,
			});
		}),
		rule(mods(name, "hover"), state(n, "hover")),
		rule(mods(name, "active"), state(n, "active")),
		rule(mods(name, "selected"), state(n, "selected")),
		rule(mods(name, "disabled"), {
			cursor: "default",
			...state(n, "disabled"),
		}),
		// States - selectable
		rule(cross(selectable, [":focus-visible", ".focus"]), {
			...focusrule(selectable, sn),
			...state(sn, "focus"),
		}),
		...COLORS.map((v) => {
			const vc = tok(sn, ["color", v], `${vars.color.primary}`);
			const vs = variant(sn, v);
			return rule(cross(selectable, [`.${v}`], [":focus-visible", ".focus"]), {
				outline_color: focusol(vc),
				background: vs.background,
				border_color: vs.border_color,
				color: vs.color,
			});
		}),
		rule(mods(selectable, "hover"), state(sn, "hover")),
		rule(mods(selectable, "active"), state(sn, "active")),
		rule(mods(selectable, "selected"), state(sn, "selected")),
		rule(mods(selectable, "disabled"), {
			cursor: "default",
			...state(sn, "disabled"),
		}),
		// Style variants
		rule(mods(controls, "default"), {
			border_width: `${vars.control.style.default.border.width}`,
		}),
		rule(mods(controls, "outline"), {
			border_width: "1px",
			...modestyle(n, "outline"),
			...modestyle(sn, "outline"),
			background: "transparent",
			color: oltxt(`${vars.color.ink}`),
			border_color: oledge(`${vars.color.ink}`),
			outline_color: oledge(`${vars.color.ink}`),
		}),
		rule(["button.outline", ".button.outline"], {
			border_width: "1px",
			background: "transparent",
			color: oltxt(`${vars.color.ink}`),
			border_color: oledge(`${vars.color.ink}`),
			outline_color: oledge(`${vars.color.ink}`),
		}),
		...COLORS.map((v) => {
			const vc = tok(n, ["color", v], `${vars.color.primary}`);
			return rule(cross(name, [`.outline.${v}`]), {
				border_width: "1px",
				background: "transparent",
				color: oltxt(vc),
				border_color: oledge(vc),
				outline_color: oledge(vc),
			});
		}),
		...COLORS.map((v) => {
			const vc = tok(n, ["color", v], `${vars.color.primary}`);
			return rule([`button.outline.${v}`, `.button.outline.${v}`], {
				border_width: "1px",
				background: "transparent",
				color: oltxt(vc),
				border_color: oledge(vc),
				outline_color: oledge(vc),
			});
		}),
		...COLORS.map((v) => {
			const vc = tok(sn, ["color", v], `${vars.color.primary}`);
			return rule(cross(selectable, [`.outline.${v}`]), {
				border_width: "1px",
				background: "transparent",
				color: oltxt(vc),
				border_color: oledge(vc),
				outline_color: oledge(vc),
			});
		}),
		rule(mods(name, "ghost"), {
			...modestyle(n, "ghost"),
			outline_width: "0px",
			outline_color: "transparent",
		}),
		rule(cross(controls, [".blank"]), {
			...modestyle(n, "blank"),
			...modestyle(sn, "blank"),
		}),
		rule(cross(name, [".icon"]), {
			...modestyle(n, "icon"),
			background: "transparent",
			padding: `${vars.control.icon.padding}`,
			width: `${vars.control.icon.size}`,
			height: `${vars.control.icon.size}`,
			aspect_ratio: "1",
			box_sizing: "content-box",
		}),
		rule(cross(selectable, [".icon"]), {
			...modestyle(sn, "icon"),
			background: "transparent",
		}),
		rule(cross(name, [".outline", ".icon"], [":hover", ".hover"]), {
			background: olfill(`${vars.color.ink}`, "18%"),
			color: oltxt(`${vars.color.ink}`),
			border_color: oledge(`${vars.color.ink}`),
			outline_color: oledge(`${vars.color.ink}`),
		}),
		rule(cross(name, [".outline", ".icon"], [":active", ".active"]), {
			background: olfill(`${vars.color.ink}`, "30%"),
			color: oltxt(`${vars.color.ink}`),
			border_color: oledge(`${vars.color.ink}`),
			outline_color: oledge(`${vars.color.ink}`),
		}),
		...COLORS.map((v) => {
			const vc = tok(n, ["color", v], `${vars.color.primary}`);
			return rule(cross(name, [`.outline.${v}`], [":hover", ".hover"]), {
				background: olfill(vc, "18%"),
				color: oltxt(vc),
				border_color: oledge(vc),
				outline_color: oledge(vc),
			});
		}),
		...COLORS.map((v) => {
			const vc = tok(n, ["color", v], `${vars.color.primary}`);
			return rule(cross(name, [`.outline.${v}`], [":active", ".active"]), {
				background: olfill(vc, "30%"),
				color: oltxt(vc),
				border_color: oledge(vc),
				outline_color: oledge(vc),
			});
		}),
		rule(
			cross(name, [".outline", ".icon"], [".selected"]),
			state(n, "selected"),
		),
		rule(cross(name, [".ghost"], [":hover", ".hover"]), state(n, "hover")),
		rule(cross(name, [".ghost"], [":active", ".active"]), state(n, "active")),
		rule(cross(name, [".ghost"], [".selected"]), state(n, "selected")),
		rule(
			cross(name, [".ghost"], [":focus-visible", ".focus"]),
			state(n, "focus"),
		),
		rule(
			cross(selectable, [".outline", ".icon"], [":hover", ".hover"]),
			state(sn, "hover"),
		),
		rule(
			cross(selectable, [".outline", ".icon"], [":active", ".active"]),
			state(sn, "active"),
		),
		rule(
			cross(selectable, [".outline", ".icon"], [".selected"]),
			state(sn, "selected"),
		),
		bare(controls),
	);
}

// ----------------------------------------------------------------------------
//
// SELECTOR
//
// ----------------------------------------------------------------------------

function selector() {
	const name = [".selector"];
	const sn = "selectable";
	const option = [...cross(name, ["> .option", "> label", "> button", "> a"])];
	const selected = [
		...cross(name, [
			"> .selected",
			'> [aria-pressed="true"]',
			'> [aria-checked="true"]',
		]),
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
			gap: `max(1px, ${tok(n, ["box", "gap"], FALLBACK.spacing.gap)})`,
			padding: `max(2px, ${tok(n, ["padding"], FALLBACK.spacing.padding)})`,
			margin: tok(n, ["margin"], FALLBACK.spacing.margin),
			outline_width: tok(
				n,
				["normal", "outline", "width"],
				FALLBACK.outline.width,
			),
			outline_style: tok(
				n,
				["normal", "outline", "style"],
				FALLBACK.outline.style,
			),
			outline_color: "transparent",
			border_width: tok(
				n,
				["normal", "border", "width"],
				FALLBACK.border.width,
			),
			border_style: tok(
				n,
				["normal", "border", "style"],
				FALLBACK.border.style,
			),
			border_color: mix(n, "normal", "border"),
			border_radius: tok(n, ["box", "radius"], FALLBACK.spacing.radius),
			background: mix(n, "normal", "background"),
			color: mix(n, "normal", "text"),
			box_shadow: "none",
			transition: `${vars.control.transition}`,
			font_family: tok(n, ["font", "family"], FALLBACK.font.family),
			line_height: tok(n, ["font", "line"], FALLBACK.font.line),
			font_weight: tok(n, ["font", "weight"], FALLBACK.font.weight),
			font_size: tok(n, ["font", "size"], FALLBACK.font.size),
		}),
		rule(option, {
			cursor: "pointer",
			display: "inline-flex",
			flex: "0 0 auto",
			align_items: "center",
			justify_content: "center",
			position: "relative",
			padding: tok(n, ["item", "padding"], FALLBACK.spacing.item_padding),
			border_width: tok(
				sn,
				["normal", "border", "width"],
				FALLBACK.border.width,
			),
			border_style: tok(
				sn,
				["normal", "border", "style"],
				FALLBACK.border.style,
			),
			border_color: "transparent",
			border_radius: tok(n, ["box", "radius"], FALLBACK.spacing.radius),
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
		rule(
			option.map((s) => `${s}:not(:first-child):not(:last-child)`),
			{ border_radius: "0px" },
		),
		rule(cross(name, [" input[type=checkbox]", " input[type=radio]"]), {
			display: "none",
		}),
		...COLORS.map((v) => rule(mods(name, v), fvariant(n, v))),
		rule(cross(name, [":focus-within", ".focus"]), {
			...focusrule(name, n),
			...state(n, "focus"),
		}),
		...COLORS.map((v) => {
			const vc = tok(n, ["color", v], `${vars.color.primary}`);
			return rule(cross(name, [`.${v}`], [":focus-within", ".focus"]), {
				outline_color: focusol(vc),
			});
		}),
		rule(cross(option, [":hover", ".hover"]), state(sn, "hover")),
		rule(cross(option, [":active", ".active"]), {
			box_shadow: "none",
			...state(sn, "active"),
		}),
		rule(selected, { ...state(sn, "selected"), box_shadow: "none" }),
		...COLORS.map((v) => {
			const sv = variant(sn, v);
			return rule(
				[
					...cross(
						name,
						[`.${v}`],
						[
							"> .selected",
							'> [aria-pressed="true"]',
							'> [aria-checked="true"]',
						],
					),
					...cross(name, [`.${v}`], [" input:checked + label"]),
				],
				{
					background: sv.background,
					border_color: sv.border_color,
					color: sv.color,
				},
			);
		}),
		rule(cross(option, [":focus-visible", ".focus"]), {
			...focusrule(option, sn),
			...state(sn, "focus"),
		}),
		rule(cross(name, [".disabled", '[aria-disabled="true"]']), {
			cursor: "default",
			...state(n, "disabled"),
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
			...modestyle(n, "outline"),
			outline_color: mix(n, "normal", "background"),
		}),
		rule(cross(name, [".blank"]), {
			background: "transparent",
			border_color: "transparent",
			...modestyle(n, "blank"),
		}),
		...sizerules(name, n),
		bare(name),
	);
}

// ----------------------------------------------------------------------------
//
// FIELD CONTROL (input, textarea share this structure)
//
// ----------------------------------------------------------------------------

function field(sel, n, extra = {}) {
	return group(
		rule(sel, { ...base(n), ...extra }),
		...COLORS.map((v) => rule(mods(sel, v), fvariant(n, v))),
		rule(mods(sel, "hover"), state(n, "hover")),
		rule(mods(sel, "focus"), {
			...focusrule(sel, n),
			border_width: tok(
				n,
				["focus", "border", "width"],
				tok(n, ["normal", "border", "width"], FALLBACK.border.width),
			),
			border_style: tok(
				n,
				["focus", "border", "style"],
				tok(n, ["normal", "border", "style"], FALLBACK.border.style),
			),
			border_color: mix(n, "focus", "border"),
		}),
		...COLORS.map((v) => {
			const vc = tok(n, ["color", v], `${vars.color.primary}`);
			return rule(
				cross(sel, [`.${v}`], [":focus", ":focus-visible", ".focus"]),
				{ outline_color: focusol(vc) },
			);
		}),
		rule(mods(sel, "active"), state(n, "active")),
		rule(
			cross(
				sel,
				[":focus", ":focus-visible", ".focus"],
				[":active", ".active"],
			),
			focusrule(sel, n),
		),
		...COLORS.map((v) => {
			const vc = tok(n, ["color", v], `${vars.color.primary}`);
			const fv = fvariant(n, v);
			return rule(
				cross(
					sel,
					[`.${v}`],
					[":focus", ":focus-visible", ".focus"],
					[":active", ".active"],
				),
				{
					outline_color: focusol(vc),
					border_color: fv.border_color,
					background: fv.background,
				},
			);
		}),
		rule(mods(sel, "disabled"), { cursor: "default", ...state(n, "disabled") }),
		rule(mods(sel, "default"), {
			border_width: `${vars.control.style.default.border.width}`,
		}),
		rule(mods(sel, "outline"), {
			border_width: `${vars.control.style.outline.border.width}`,
			...modestyle(n, "outline"),
			outline_color: mix(n, "normal", "background"),
		}),
		rule(mods(sel, "ghost"), {
			...modestyle(n, "ghost"),
			outline_width: "0px",
			outline_color: "transparent",
		}),
		rule(cross(sel, [".blank"]), {
			background: "transparent",
			border_color: "transparent",
			...modestyle(n, "blank"),
		}),
		rule(cross(sel, [".icon"]), {
			background: "transparent",
			...modestyle(n, "icon"),
			aspect_ratio: "1",
		}),
		rule(
			cross(sel, [".ghost"], [":focus", ":focus-visible", ".focus"]),
			state(n, "focus"),
		),
		...sizerules(sel, n),
		bare(sel),
	);
}

// ----------------------------------------------------------------------------
//
// TOGGLE CONTROL (checkbox, radio share this structure)
//
// ----------------------------------------------------------------------------

function toggle(sel, n, checkedAfterRadius) {
	return group(
		rule(sel, {
			cursor: "pointer",
			appearance: "none",
			font_size: tok(n, ["font", "size"], FALLBACK.font.size),
			width: tok(n, ["box", "size"], "1.15em"),
			height: tok(n, ["box", "size"], "1.15em"),
			padding: tok(n, ["padding"], FALLBACK.spacing.padding),
			margin: tok(n, ["margin"], FALLBACK.spacing.margin),
			display: "inline-block",
			position: "relative",
			box_sizing: "border-box",
			outline_width: tok(
				n,
				["normal", "outline", "width"],
				FALLBACK.outline.width,
			),
			outline_style: tok(
				n,
				["normal", "outline", "style"],
				FALLBACK.outline.style,
			),
			outline_color: "transparent",
			border_width: tok(
				n,
				["normal", "border", "width"],
				FALLBACK.border.width,
			),
			border_style: tok(
				n,
				["normal", "border", "style"],
				FALLBACK.border.style,
			),
			border_color: mix(n, "normal", "border"),
			border_radius: tok(n, ["box", "radius"], FALLBACK.spacing.radius),
			transition: `${vars.control.transition}`,
			font_family: tok(n, ["font", "family"], FALLBACK.font.family),
			line_height: tok(n, ["font", "line"], FALLBACK.font.line),
			font_weight: tok(n, ["font", "weight"], FALLBACK.font.weight),
			background: mix(n, "normal", "background"),
			color: mix(n, "normal", "text"),
		}),
		...COLORS.map((v) => rule(mods(sel, v), fvariant(n, v))),
		rule(mods(sel, "hover"), state(n, "hover")),
		rule(mods(sel, "focus"), {
			outline_width: tok(
				n,
				["normal", "outline", "width"],
				FALLBACK.outline.width,
			),
			outline_color: mix(n, "normal", "outline"),
			...state(n, "focus"),
		}),
		...COLORS.map((v) => {
			const vc = tok(n, ["color", v], `${vars.color.primary}`);
			const fv = fvariant(n, v);
			return rule(
				cross(sel, [`.${v}`], [":focus", ":focus-visible", ".focus"]),
				{
					outline_color: focusol(vc),
					border_color: fv.border_color,
					background: fv.background,
				},
			);
		}),
		rule(mods(sel, "active"), state(n, "active")),
		rule(mods(sel, "disabled"), { cursor: "default", ...state(n, "disabled") }),
		rule(
			sel.map((s) => `${s}:checked`),
			{
				position: "relative",
				...state(n, "selected"),
				background: mix(n, "normal", "background"),
				color: `${vars.color.ink}`,
			},
		),
		...COLORS.map((v) => {
			const fv = fvariant(n, v);
			return rule(
				cross(
					sel,
					[`.${v}`],
					[":checked", ...(n === "checkbox" ? [":indeterminate"] : [])],
				),
				{
					background: mix(n, "normal", "background"),
					border_color: fv.border_color,
					color: fv.border_color,
				},
			);
		}),
		rule(
			sel.map((s) => `${s}:checked::after`),
			{
				content: '""',
				position: "absolute",
				inset: "3px",
				border_radius: checkedAfterRadius,
				background: "currentColor",
			},
		),
		// Checkbox-specific: indeterminate state
		...(n === "checkbox"
			? [
					rule(
						sel.map((s) => `${s}:indeterminate`),
						{
							position: "relative",
							...state(n, "selected"),
							background: mix(n, "normal", "background"),
							color: `${vars.color.ink}`,
						},
					),
					rule(
						cross(
							sel,
							[":checked", ":indeterminate"],
							[":focus", ":focus-visible", ".focus"],
						),
						focusrule(sel, n),
					),
					rule(
						sel.map((s) => `${s}:indeterminate::after`),
						{
							content: '""',
							position: "absolute",
							inset: "3px",
							border_radius: "inherit",
							background: "currentColor",
						},
					),
				]
			: [
					// Radio: focus on checked
					rule(
						cross(sel, [":checked"], [":focus", ":focus-visible", ".focus"]),
						focusrule(sel, n),
					),
				]),
		// Radio-specific: focus-visible
		...(n === "radio"
			? [rule(cross(sel, [":focus-visible", ".focus"]), focusrule(sel, n))]
			: []),
		rule(mods(sel, "default"), {
			border_width: `${vars.control.style.default.border.width}`,
		}),
		rule(mods(sel, "outline"), {
			border_width: `${vars.control.style.outline.border.width}`,
			...modestyle(n, "outline"),
		}),
		rule(cross(sel, [".blank"]), {
			background: "transparent",
			border_color: "transparent",
			...modestyle(n, "blank"),
		}),
		rule(cross(sel, [".icon"]), {
			background: "transparent",
			...modestyle(n, "icon"),
			aspect_ratio: "1",
		}),
		...sizerules(sel, n),
		bare(sel),
	);
}

// ----------------------------------------------------------------------------
//
// RANGE
//
// ----------------------------------------------------------------------------

function range() {
	const sel = ['input[type="range"]', ".range"];
	const n = "range";
	const trackcolor = colormixin({
		base: tok(
			"input",
			["normal", "border", "base"],
			FALLBACK.color.border.base,
		),
		tint: tok(
			"input",
			["normal", "border", "tint"],
			FALLBACK.color.border.tint,
		),
		blend: tok(
			"input",
			["normal", "border", "blend"],
			FALLBACK.color.border.blend,
		),
		opacity: tok(
			"input",
			["normal", "border", "opacity"],
			FALLBACK.color.border.opacity,
		),
	});

	const track = {
		height: tok(n, ["track", "size"], "0.28em"),
		border_radius: tok(n, ["track", "radius"], "999px"),
		background: tok(n, ["track", "color"], trackcolor),
	};
	const thumb = {
		width: tok(n, ["thumb", "size"], "0.95em"),
		height: tok(n, ["thumb", "size"], "0.95em"),
		border_radius: tok(n, ["thumb", "radius"], "50%"),
		background: tok(
			n,
			["thumb", "background"],
			mix("input", "normal", "background"),
		),
		border_width: tok(
			n,
			["thumb", "border", "width"],
			tok("input", ["normal", "border", "width"], FALLBACK.border.width),
		),
		border_style: tok(
			n,
			["thumb", "border", "style"],
			tok("input", ["normal", "border", "style"], FALLBACK.border.style),
		),
		border_color: tok(
			n,
			["thumb", "border", "color"],
			mix("input", "normal", "border"),
		),
	};

	return group(
		rule(sel, {
			appearance: "none",
			font_family: tok(n, ["font", "family"], FALLBACK.font.family),
			line_height: tok(n, ["font", "line"], FALLBACK.font.line),
			font_weight: tok(n, ["font", "weight"], FALLBACK.font.weight),
			font_size: tok(n, ["font", "size"], FALLBACK.font.size),
			width: "100%",
			max_width: tok(n, ["box", "max", "width"], "100%"),
			cursor: "pointer",
			min_height: tok(n, ["thumb", "size"], "1em"),
			padding: tok(n, ["padding"], FALLBACK.spacing.padding),
			margin: tok(n, ["margin"], FALLBACK.spacing.margin),
			background: "transparent",
			border: "0px solid transparent",
			border_radius: "0px",
			box_shadow: "none",
			transition: "none",
		}),
		...COLORS.map((v) => rule(mods(sel, v), fvariant(n, v))),
		rule(
			sel.map((s) => `${s}::-webkit-slider-runnable-track`),
			track,
		),
		rule(
			sel.map((s) => `${s}::-webkit-slider-thumb`),
			{
				appearance: "none",
				...thumb,
				margin_top: `calc((${tok(n, ["track", "size"], "0.28em")} - ${tok(n, ["thumb", "size"], "0.95em")}) / 2)`,
			},
		),
		rule(
			sel.map((s) => `${s}::-moz-range-track`),
			{ ...track, border: "0px solid transparent" },
		),
		rule(
			sel.map((s) => `${s}::-moz-range-thumb`),
			thumb,
		),
		rule(mods(sel, "focus"), {
			outline_width: tok(
				n,
				["normal", "outline", "width"],
				FALLBACK.outline.width,
			),
			outline_color: mix(n, "normal", "outline"),
			...state(n, "focus"),
		}),
		rule(cross(sel, [":focus-visible", ".focus"]), focusrule(sel, n)),
		...COLORS.map((v) => {
			const vc = tok(n, ["color", v], `${vars.color.primary}`);
			const fv = fvariant(n, v);
			return rule(
				cross(sel, [`.${v}`], [":focus", ":focus-visible", ".focus"]),
				{
					outline_color: focusol(vc),
					border_color: fv.border_color,
					background: fv.background,
				},
			);
		}),
		rule(cross(sel, [":focus-visible", ".focus"]), focusrule(sel, n)),
		rule(
			sel.map((s) => `${s}:focus-visible`),
			{
				outline_width: tok(
					n,
					["normal", "outline", "width"],
					FALLBACK.outline.width,
				),
				outline_color: mix(n, "normal", "outline"),
			},
		),
		...sizerules(sel, n),
		bare(sel),
	);
}

// ----------------------------------------------------------------------------
//
// EXPORTS
//
// ----------------------------------------------------------------------------

export default named({
	button: button(),
	selector: selector(),
	input: field(["input", ".input"], "input", {
		display: "inline-flex",
		justify_content: "stretch",
		align_items: "center",
	}),
	textarea: field(["textarea", ".textarea"], "textarea", {}),
	select: group(
		field(["select", ".select"], "select", {
			appearance: "none",
			display: "inline-flex",
			justify_content: "stretch",
			align_items: "center",
		}),
		rule(cross(["select", ".select"], [":not([multiple]):not([size])"]), {
			padding_right: `calc(${tok("select", ["padding"], FALLBACK.spacing.padding)} + ${tok("select", ["arrow", "offset"], "0.75em")} + ${tok("select", ["arrow", "size"], "0.3em")})`,
			background_image:
				"linear-gradient(45deg, transparent 50%, currentColor 50%), linear-gradient(135deg, currentColor 50%, transparent 50%)",
			background_position: `right ${tok("select", ["arrow", "offset"], "0.75em")} center, right calc(${tok("select", ["arrow", "offset"], "0.75em")} - ${tok("select", ["arrow", "gap"], "0.33em")}) center`,
			background_size: `${tok("select", ["arrow", "size"], "0.3em")} ${tok("select", ["arrow", "size"], "0.3em")}, ${tok("select", ["arrow", "size"], "0.3em")} ${tok("select", ["arrow", "size"], "0.3em")}`,
			background_repeat: "no-repeat",
		}),
	),
	range: range(),
	checkbox: toggle(
		['input[type="checkbox"]', ".checkbox"],
		"checkbox",
		"inherit",
	),
	radio: toggle(['input[type="radio"]', ".radio"], "radio", "50%"),
});
// EOF
