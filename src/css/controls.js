import css, { vars, where } from "../js/uicss.js";
import colors from "./colors.js";

const control = {
	color: Object.assign(
		(blend = 1.0, opacity = 1.0, tint = vars.color.paper) =>
			colors.mixed(
				control.color.base(),
				control.color.tint(tint),
				control.color.blend(blend),
				control.color.opacity(opacity),
			),
		{
			base: (fallback = vars.color.neutral) =>
				vars.control.color.base.or(fallback),
			tint: (fallback = vars.color.paper) =>
				vars.control.color.tint.or(fallback),
			blend: (fallback = 1.0) => vars.control.color.blend.or(fallback),
			opacity: (fallback = 1.0) => vars.control.color.opacity.or(fallback),
		},
	),
	background: Object.assign(
		(
			blend = 1.0,
			opacity = 1.0,
			tint = vars.color.paper,
			base = vars.color.neutral,
		) =>
			colors.mixed(
				control.background.base(base),
				control.background.tint(tint),
				control.background.blend(blend),
				control.background.opacity(opacity),
			),
		{
			base: (fallback = vars.color.neutral) =>
				vars.control.background.base.or(vars.control.color.base, fallback),
			tint: (fallback = vars.color.paper) =>
				vars.control.background.tint.or(vars.control.color.tint, fallback),
			blend: (fallback = 1.0) => vars.control.background.blend.or(fallback),
			opacity: (fallback = 1.0) => vars.control.background.opacity.or(fallback),
		},
	),
	border: Object.assign(
		(blend = 0.8, opacity = 0.75, tint = vars.color.paper) =>
			colors.mixed(
				control.border.base(),
				control.border.tint(tint),
				control.border.blend(blend),
				control.border.opacity(opacity),
			),
		{
			// Generic `.bd-*` overrides win over the interactive tokens, which
			// always have root defaults, so only one fallback step is reachable.
			base: (fallback = vars.color.surface_text) =>
				vars.border.base.or(vars.control.border.base, fallback),
			tint: (fallback = vars.color.tint) =>
				vars.border.tint.or(vars.control.border.tint, fallback),
			blend: (fallback = 1.0) =>
				vars.border.blend.or(vars.control.border.blend, fallback),
			opacity: (fallback = 0.75) =>
				vars.border.opacity.or(vars.control.border.opacity, fallback),
		},
	),
	outline: Object.assign(
		(blend = 0.8, opacity = 0.5, tint = vars.color.paper) =>
			colors.mixed(
				control.outline.base(),
				control.outline.tint(tint),
				control.outline.blend(blend),
				control.outline.opacity(opacity),
			),
		{
			// Generic `.ol-*` overrides win over the interactive tokens, which
			// always have root defaults, so only one fallback step is reachable.
			base: (fallback = vars.color.neutral) =>
				vars.outline.base.or(vars.control.outline.base, fallback),
			tint: (fallback = vars.color.paper) =>
				vars.outline.tint.or(vars.control.outline.tint, fallback),
			blend: (fallback = 0.8) =>
				vars.outline.blend.or(vars.control.outline.blend, fallback),
			opacity: (fallback = 0.5) =>
				vars.outline.opacity.or(vars.control.outline.opacity, fallback),
		},
	),
};

const controlContrast = () => `contrast-color(${control.background()})`;

// Field edge channels. Precedence: a per-field `--field-border-*` override,
// then the generic `.bd-*` utility override, then the shared control token.
const fieldBorderBase = () =>
	vars.field.border.base.or(vars.border.base, vars.control.border.base);
const fieldBorderTint = () =>
	vars.field.border.tint.or(vars.border.tint, vars.control.border.tint);
const fieldBorderBlend = () =>
	vars.field.border.blend.or(vars.border.blend, vars.control.border.blend);
const fieldBorderOpacity = (fallback = 0.75) =>
	vars.field.border.opacity.or(
		vars.border.opacity,
		vars.control.border.opacity,
		fallback,
	);

const baseHosts = [
	"button",
	".button",
	"input[type=submit]",
	"input[type=button]",
	"input[type=reset]",
	"input:where(:not([type=submit],[type=button],[type=reset],[type=image]):not(.button))",
	"textarea",
	"select",
	".input",
	".textarea",
	".select",
	".group > :not(input, textarea, select, button, .input, .textarea, .select, .button)",
	"input[type=checkbox]:not(.toggle):not(.selector)",
	".checkbox",
	":not(.selector) input[type=radio]:not(.toggle)",
	".radio",
	"input[type=range]",
	".range",
	":not(.selector) input[type=checkbox].toggle",
	"input[type=checkbox][role=switch]",
	".toggle:not(.selector)",
	":where(.selector)",
];

function colorvariants() {
	return css.nesting(
		where(baseHosts),
		{},
		...colors.semantic.map((color) =>
			css.rule(css.mods("&", color), {
				__control_color_base: vars.color[color],
				__control_border_base: vars.color[color],
				__control_border_opacity: 1.0,
				__accent_color: vars.color[color],
			}),
		),
		css.rule("&.bw", {
			__control_color_base: vars.color.ink,
			__control_color_tint: vars.color.paper,
			__control_color_blend: 1.0,
			__control_color_opacity: 1.0,
			__control_border_opacity: 1.0,
			__control_outline_opacity: 1.0,
		}),
	);
}

function basechrome() {
	const transition = [
		"opacity",
		"outline-color",
		"border-color",
		"color",
		"background-color",
	]
		.map(
			(_) =>
				`${_} ${vars.motion.duration.normal} ${vars.motion.easing.emphasized}`,
		)
		.join(", ");
	return css.group(
		css.rule(baseHosts, {
			font_family: vars.control.font.family.or(vars.font.controls.family),
			font_size: vars.control.font.size.or("1em"),
			line_height: vars.control.font.line.or(vars.font.controls.line),
			font_weight: vars.control.font.weight.or(vars.font.controls.weight),
			display: "inline-flex",
			align_items: "center",
			__gap: "0.25em",
			gap: vars.control.gap.or(vars.gap),
			box_sizing: "border-box",
			padding: vars.control.padding.or("0.5em 1em"),
			margin: vars.control.margin.or("0em"),
			white_space: "nowrap",
			text_overflow: "ellipsis",
			// Paint recipes are local: inherited text recipes must not restyle controls.
			__text_color: "initial",
			__control_color_base: vars.accent.color.or(vars.control.color.base),
			border_width: vars.control.border.width.or("1px"),
			border_radius: vars.control.border.radius.or("0.25em"),
			border_color: control.border(),
			outline_width: "0px",
			outline_color: control.outline(),
			user_select: "none",
			transition: transition,
		}),
		css.rule(
			baseHosts.map((selector) => `${selector}.compact`),
			{
				padding: vars.control.padding.compact.or("0.15em 0.25em"),
			},
		),
		css.rule(
			baseHosts.map((selector) => `${selector}.compacted`),
			{
				padding: vars.control.padding.compacted.or("0.1em 0.15em"),
			},
		),
		css.rule(
			baseHosts.flatMap((selector) => [
				`${selector}:focus:not(.nofocus)`,
				`${selector}.focus:not(.nofocus)`,
			]),
			{ outline_width: vars.control.outline.width.or("2px") },
		),
	);
}

// Component builders only emit their differences from the shared control chrome.
function base(selector, ...rest) {
	return css.nesting(selector, {}, ...rest);
}

const fieldHosts = [
	".input",
	"input:where(:not([type=submit],[type=button],[type=reset],[type=image]):not(.button))",
	"textarea",
	".textarea",
	"select",
	".select",
	".group > :not(input, textarea, select, button, .input, .textarea, .select, .button)",
	".checkbox",
	".radio",
	".range",
	".toggle:not(.selector)",
	":where(.selector)",
];

const outlineFieldHosts = [
	".input",
	"input:where(:not([type=submit],[type=button],[type=reset],[type=image]):not(.button))",
	"textarea",
	".textarea",
	"select",
	".select",
	".group > :not(input, textarea, select, button, .input, .textarea, .select, .button)",
];

function fieldchrome() {
	return css.rule(fieldHosts, {
		font_size: vars.field.font.size.or(vars.control.font.size, "1em"),
		padding: vars.field.padding.or("0.5em 0.75em"),
		border_radius: vars.field.border.radius.or(
			vars.control.border.radius,
			"0.25em",
		),
		field_sizing: "content",
		color: vars.color.surface_text,
		__control_outline_base: vars.control.color.base,
		__control_outline_tint: vars.control.color.base,
		__control_outline_blend: 1.0,
		border_color: colors.mixed(
			fieldBorderBase(),
			fieldBorderTint(),
			fieldBorderBlend(),
			fieldBorderOpacity(),
		),
		__control_background_base: vars.color.surface,
		__control_background_tint: vars.color.surface,
		__control_background_blend: 1.0,
		__control_background_opacity: 0.8,
		background_color: control.background(
			1.0,
			0.8,
			vars.color.surface,
			vars.color.surface,
		),
	});
}

function fieldstates() {
	return css.group(
		css.rule(
			fieldHosts.map((s) => `${s}.compact`),
			{
				padding: vars.field.padding.compact.or("0.35em 0.5em"),
			},
		),
		css.rule(
			fieldHosts.map((s) => `${s}.tight`),
			{
				padding: vars.field.padding.tight.or("0.15em 0.25em"),
			},
		),
		css.rule(
			fieldHosts.map((s) => `${s}.tinted`),
			{
				__control_background_base: vars.control.color.base,
				__control_background_tint: vars.control.color.base,
				__control_background_blend: 1.0,
				__control_background_opacity: 0.15,
				background_color: control.background(1.0, 0.15),
			},
		),
		css.rule(
			outlineFieldHosts.map((s) => `${s}.outline`),
			{
				__control_background_opacity: 0,
				__control_border_opacity: 1.0,
				background_color: "transparent",
				// Full field/utility chain so color, tint, blend and opacity all
				// respond to --field-border-* and `.bd-*` modifiers.
				border_color: colors.mixed(
					fieldBorderBase(),
					fieldBorderTint(),
					fieldBorderBlend(),
					fieldBorderOpacity(1.0),
				),
			},
		),
		css.rule(
			fieldHosts.map((s) => `${s}.colored`),
			{
				color: control.color(1.0, 1.0, vars.color.ink),
				__control_border_opacity: 1.0,
				border_color: colors.mixed(
					fieldBorderBase(),
					fieldBorderTint(),
					fieldBorderBlend(),
					fieldBorderOpacity(1.0),
				),
			},
		),
		css.rule(
			fieldHosts.map((s) => `${s} > input, ${s} > textarea`),
			{
				flex: "1",
			},
		),
		css.rule(
			fieldHosts.map((s) => `${s}.bw`),
			{
				__control_background_base: vars.color.paper,
				outline_style: "groove",
			},
		),
		css.rule(
			fieldHosts.map((s) => `${s}.white`),
			{
				__control_background_base: vars.color.white,
				__control_background_blend: 1.0,
				__control_background_opacity: 1.0,
			},
		),
		css.rule(
			fieldHosts.flatMap((s) => [
				`${s}:not(.nofocus):not(.tinted):focus`,
				`${s}:not(.nofocus):not(.tinted).focus`,
			]),
			{
				__control_background_opacity: 1.0,
				__control_border_opacity: 1.0,
			},
		),
		css.rule(
			fieldHosts.flatMap((s) => [
				`${s}:not(.tinted):hover`,
				`${s}:not(.tinted).hover`,
			]),
			{
				__control_background_opacity: 1.0,
				__control_border_opacity: 0.95,
			},
		),
		css.rule(
			fieldHosts.flatMap((s) => [
				`${s}.tinted:not(.nofocus):focus`,
				`${s}.tinted:not(.nofocus).focus`,
			]),
			{
				__control_border_opacity: 1.0,
			},
		),
		css.rule(
			fieldHosts.flatMap((s) => [`${s}.tinted:hover`, `${s}.tinted.hover`]),
			{
				__control_border_opacity: 0.95,
			},
		),
		css.rule(
			fieldHosts.flatMap((s) => [`${s}:active`, `${s}.active`]),
			{
				__control_border_opacity: 1.0,
			},
		),
		css.rule(
			fieldHosts.flatMap((s) => [`${s}:disabled`, `${s}.disabled`]),
			{
				opacity: vars.control.disabled.opacity.or(0.5),
				pointer_events: "none",
				cursor: "not-allowed",
			},
		),
		css.nesting(
			fieldHosts.map((s) => `${s}.ghost`),
			{
				border_color: "transparent",
				outline_width: "0px",
				__control_background_blend: 0.1,
				__control_background_opacity: 0,
			},
			css.rule(
				[
					`&:not(.nofocus):focus`,
					`&:not(.nofocus).focus`,
					`&:active`,
					`&.active`,
				],
				{
					__control_background_opacity: 0.5,
				},
			),
		),
		...["white", ...colors.semantic].map((color) =>
			css.rule(
				fieldHosts.map((s) => `${s}.ghost.${color}`),
				{
					__control_background_base: vars.color[color].background.or(
						vars.color[color],
					),
					__control_background_blend: 1.0,
					__control_background_opacity: 1.0,
					background_color: control.background(1.0, 1.0),
				},
			),
		),
		css.rule(
			fieldHosts.flatMap((s) => [`${s}.blank`]),
			{
				background: "none !important",
				background_color: "transparent !important",
				border_width: "0px",
				border_color: "transparent !important",
				outline_width: "0px",
				outline_color: "transparent !important",
				padding: "unset",
			},
		),
		css.rule(
			fieldHosts.flatMap((s) => [`${s}.icon`]),
			{
				aspect_ratio: "1/1",
				box_sizing: "border-box",
				justify_content: "center",
				align_items: "center",
				padding: "0.15em",
				height: "2em",
				__control_background_blend: 0.1,
				__control_background_opacity: 0.1,
			},
		),
	);
}

function field(selector, ...rest) {
	return base(selector, ...rest);
}
// Base style for all action controls (button-like)
function selectable(...rest) {
	return css.nesting(
		".selectable",
		{
			// Cursor
			cursor: "pointer",
			__control_color_opacity: 0.0,
			__control_background_opacity: 0.0,
			__control_background_base: vars.color.neutral.background.or(
				vars.color.neutral,
			),
			// Default styling, background is pure primary color
			background_color: control.background(
				0.75,
				0.0,
				vars.color.tint,
				vars.selectable.bg.or(
					vars.color.neutral.background,
					vars.color.neutral,
				),
			),
		},
		// Color variants
		...colors.semantic.map((color) =>
			css.rule(css.mods("&", color), {
				__control_color_base: vars.color[color],
				__control_background_base: vars.color[color].background.or(
					vars.color[color],
				),
			}),
		),
		// Hover stays neutral even when the selectable has a semantic color.
		css.rule(css.mods("&", "hover"), {
			__control_color_opacity: 0.5,
			__control_background_base: vars.color.neutral.background.or(
				vars.color.neutral,
			),
			__control_background_opacity: 0.5,
		}),
		// Active/pressed: a step darker than hover.
		css.rule(css.mods("&", "active"), {
			__control_color_opacity: 0.75,
			__control_background_opacity: 0.75,
		}),
		// Selected: same neutral wash as hover, slightly darker so it reads as sticky.
		css.rule(["&.selected"], {
			__control_color_opacity: 0.6,
			__control_background_base: vars.color.neutral.background.or(
				vars.color.neutral,
			),
			__control_background_opacity: 0.6,
		}),
		// Disabled variant
		css.rule(css.mods("&", "disabled"), {
			background_color: "transparent",
			cursor: "default",
		}),
		...rest,
	);
}

// Base style for all action controls (button-like)
function action(selector, ...rest) {
	return base(
		selector,
		css.rule("&", {
			padding: vars.action.padding.or(vars.control.padding, "0.5em 1em"),
		}),
		css.rule("&", {
			font_size: vars.action.font.size.or(vars.control.font.size, "1em"),
			// Cursor
			cursor: "pointer",
			// Default fill uses the light neutral surface (not medium neutral,
			// which is reserved for borders/chrome). --control-background-base
			// is element-scoped: never set it on ancestors.
			__control_color_opacity: 1.0,
			__control_background_base: vars.color.neutral.background.or(
				vars.color.neutral,
			),
			__control_background_blend: 1.0,
			__control_background_opacity: 1.0,
			// Default styling, solid fill from background-base
			background_color: control.background(1.0, 1.0, vars.color.ink),
			// Prefer --text-color when .tx / .tx-* utilities set it; otherwise
			// contrast against the accent fill.
			color: `var(--text-color, ${controlContrast()})`,
			// Border
			border_width: vars.action.border.width.or(
				vars.control.border.width,
				"0px",
			),
			border_radius: vars.action.border.radius.or(
				vars.control.border.radius,
				"0.25em",
			),
		}),
		css.rule("&.compact", {
			padding: vars.control.padding.compact.or("0.15em 0.25em"),
		}),
		css.rule("&.compacted", {
			padding: vars.control.padding.compacted.or("0.1em 0.15em"),
		}),
		// Semantic fills: prefer --color-{semantic}-background when defined
		// (neutral → light surface), else the solid semantic color.
		...colors.semantic.map((color) =>
			css.rule(css.mods("&", color), {
				__control_background_base: vars.color[color].background.or(
					vars.color[color],
				),
			}),
		),
		css.rule(css.mods("&", "default"), {
			outline_width: vars.action.outline.width.or(
				vars.control.outline.width,
				"2px",
			),
			outline_color: control.outline(
				0.9,
				vars.action.default.outline.opacity.or(
					vars.control.default.outline.opacity,
					0.8,
				),
				vars.color.ink,
			),
		}),
		// Hover state, typically a blent to paper
		css.rule(css.mods("&", "hover"), {
			background_color: control.background(0.9, 1.0),
		}),
		// Active state, typically a blend to ink
		css.rule(css.mods("&", "active"), {
			background_color: control.background(0.9, 1.0, vars.color.ink),
		}),
		// Disabled variant
		css.rule(css.mods("&", "disabled"), {
			opacity: vars.control.disabled.opacity.or(0.5),
			pointer_events: "none",
			cursor: "not-allowed",
		}),
		// Outline variant: ink text + ink border by default. Use .neutral /
		// .primary / … for an explicit color. Press wash uses the solid
		// accent (medium neutral / ink / …), not light neutral-background.
		css.nesting(
			css.mods("&", "outline"),
			{
				__control_color_base: vars.color.ink,
				__control_default_outline_opacity: 0.4,
				__control_border_width: vars.border.width.or("2px"),
				// Prefer --text-color from .tx utilities over the accent
				color: `var(--text-color, ${control.color(1.0, 1.0, vars.color.ink)})`,
				border_width: vars.control.border.width,
				border_color: control.border(1.0, 1.0, vars.color.paper),
				// Wash from solid accent at opacity (not light surface token)
				__control_background_base: vars.control.color.base,
				__control_background_tint: vars.control.color.base,
				__control_background_blend: 1.0,
				__control_background_opacity: 0,
				background_color: control.background(1.0, 0),
			},
			css.rule("&:hover, &.hover", {
				__control_background_opacity: 0.12,
				background_color: control.background(1.0, 0.12),
			}),
			css.rule("&:active, &.active", {
				__control_background_opacity: 0.22,
				background_color: control.background(1.0, 0.22),
			}),
		),
		// Ghost variant: ink text by default, no chrome until hover.
		css.nesting(
			css.mods("&", "ghost"),
			{
				__control_color_base: vars.color.ink,
				__control_default_outline_opacity: 0.2,
				__control_border_opacity: 0,
				__control_background_opacity: 0,
				// Transparent fill: text is the accent (not contrast-color of
				// the accent, which yields white and disappears on light surfaces).
				color: `var(--text-color, ${control.color(1.0, 1.0, vars.color.ink)})`,
				background_color: control.background(1.0, 0),
			},
			css.rule("&:hover, &.hover", {
				__control_background_opacity: 0.25,
			}),
			css.rule("&:active, &.active", {
				__control_background_opacity: 0.35,
			}),
		),
		// On/off buttons are ghost-like until selected, then use the regular fill.
		css.nesting(
			css.mods("&", "onoff"),
			{
				__control_color_base: vars.color.ink,
				__control_border_opacity: 0,
				__control_background_opacity: 0,
				color: `var(--text-color, ${control.color(1.0, 1.0, vars.color.ink)})`,
				background_color: control.background(1.0, 0),
			},
			css.rule("&:hover, &.hover", {
				__control_background_opacity: 0.25,
			}),
			css.rule("&:active, &.active", {
				__control_background_opacity: 0.35,
			}),
			css.rule("&.on, &.selected", {
				__control_background_base: vars.control.color.base,
				__control_background_tint: vars.control.color.base,
				__control_background_blend: 1.0,
				__control_border_base: vars.control.color.base,
				__control_border_opacity: 0.8,
				__control_background_opacity: 1.0,
				background_color: control.background(1.0, 1.0, vars.color.ink),
				color: `var(--text-color, ${controlContrast()})`,
			}),
		),
		// Explicit color variants win over outline/ghost ink defaults.
		// .neutral is first-class (filled → light surface; outline/ghost → medium chrome).
		...colors.semantic.map((color) =>
			css.rule(css.mods("&", color), {
				__control_color_base: vars.color[color],
			}),
		),
		css.rule(css.mods("&", "neutral"), {
			__control_color_base: vars.color.neutral,
			__control_background_base: vars.color.neutral.background.or(
				vars.color.neutral,
			),
		}),
		// Outline neutral: medium neutral is too light for chrome — blend toward ink
		css.rule("&.outline.neutral", {
			__control_color_base: vars.color.neutral,
			__control_color_tint: vars.color.ink,
			__control_color_blend: 0.3,
			__control_border_base: vars.color.neutral,
			__control_border_tint: vars.color.ink,
			__control_border_blend: 0.3,
			__control_background_base: vars.color.neutral,
			__control_background_tint: vars.color.neutral,
			__control_background_blend: 1.0,
			color: `var(--text-color, ${control.color(0.3, 1.0, vars.color.ink)})`,
			border_color: control.border(0.3, 1.0, vars.color.ink),
		}),
		css.rule("&.ghost.neutral", {
			__control_background_base: vars.color.neutral,
			__control_background_tint: vars.color.neutral,
			__control_background_blend: 1.0,
		}),
		// Blank variant
		css.rule(css.mods("&", "blank"), {
			background_color: "transparent !important",
			border_color: "transparent !important",
			outline_color: "transparent !important",
			padding: "unset",
		}),

		// Icon variant
		css.rule(css.mods("&", "icon"), {
			aspect_ratio: "1/1",
			box_sizing: "border-box",
			justify_content: "center",
			align_items: "center",
			padding: "0.25em",
			width: "2em",
			height: "2em",
		}),
		...rest,
	);
}

function checkbox() {
	// Checked background: the accent softened toward the page surface, with a
	// check mark contrasting against the actual blended background.
	const checkedBg = control.background(
		0.5,
		1.0,
		vars.color.page.or(vars.color.paper),
	);
	const checkedContrast = `contrast-color(${checkedBg})`;
	return field(
		["input[type=checkbox]:not(.toggle):not(.selector):not([role=switch])", ".checkbox"],
		css.rule("&", {
			appearance: "none",
			padding: "0em",
			margin: "0em",
			aspect_ratio: "1",
			width: vars.checkbox.size.or("1.125em"),
			line_height: "0",
			place_items: "center",
			display: "inline-grid",
			vertical_align: "middle",
			flex_shrink: "0",
			__control_border_tint: vars.color.ink,
			cursor: "pointer",
			border_color: control.border(0.9, 1.0, vars.color.ink),
			border_radius: vars.checkbox.border.radius.or("0.2em"),
			border_width: vars.checkbox.border.width.or("1px"),
			color: control.color(0.0, 1.0, vars.color.ink),
		}),
		// Checkbox content is rendered with a pseudo element, which is scaled up when checked or indeterminate.
		css.rule("&::before", {
			content: '""',
			box_sizing: "border-box",
			width: "0.32em",
			height: "0.62em",
			border_style: "solid",
			border_width: "0 0.14em 0.14em 0",
			transform: "rotate(45deg) scale(0)",
			transform_origin: "center",
		}),
		css.rule(css.mods("&", "checked"), {
			// Checked fill tracks the accent, blended toward the page surface.
			__control_background_base: vars.control.color.base,
			background_color: checkedBg,
			// Keep the border visually aligned with the selected fill.
			border_color: control.border(0.95, 1.0, vars.color.ink),
			color: checkedContrast,
		}),
		css.rule("&:checked::before, &.checked::before", {
			transform: "translate(-0.02em, -0.06em) rotate(45deg) scale(1)",
		}),
		css.rule("&:indeterminate, &.indeterminate", {
			__control_background_base: vars.control.color.base,
			background_color: checkedBg,
			border_color: control.border(0.95, 1.0, vars.color.ink),
			color: checkedContrast,
		}),
		css.rule("&:indeterminate::before, &.indeterminate::before", {
			width: "0.6em",
			height: "0.14em",
			border_width: "0",
			background_color: "currentColor",
			transform: "scale(1)",
		}),
		css.rule("&:disabled, &.disabled", {
			cursor: "not-allowed",
		}),
		css.rule("&.compact", {
			padding: "0em",
		}),
	);
}

function radio() {
	return field(
		[":not(.selector) input[type=radio]:not(.toggle)", ".radio"],
		css.rule("&", {
			appearance: "none",
			padding: "0em",
			margin: "0em",
			aspect_ratio: "1",
			width: vars.radio.size.or("1.125em"),
			height: "auto",
			min_width: vars.radio.size.or("1.125em"),
			min_height: "0",
			line_height: "0",
			place_items: "center",
			display: "inline-grid",
			vertical_align: "middle",
			flex_shrink: "0",
			border_radius: "50%",
			overflow: "clip",
			cursor: "pointer",
		}),
		css.rule("&::before", {
			content: '""',
			aspect_ratio: "1",
			width: "0.45em",
			height: "auto",
			border_radius: "50%",
			justify_self: "center",
			align_self: "center",
			background_color: "currentColor",
			transform: "scale(0)",
			transform_origin: "center",
			color: control.color(0.3, 0.9, vars.color.ink),
		}),
		css.rule("&:checked, &.checked", {
			// Checked fill tracks the accent, not the field surface.
			__control_background_base: vars.control.color.base,
			background_color: control.background(1.0, 1.0, vars.color.ink),
			border_color: control.border(0.95, 1.0, vars.color.ink),
			color: controlContrast(),
		}),
		css.rule("&:checked::before, &.checked::before", {
			color: controlContrast(),
			transform: "scale(1)",
		}),
		css.rule("&:disabled, &.disabled", {
			cursor: "not-allowed",
		}),
		css.rule("&.compact", {
			padding: "0em",
		}),
	);
}

function toggle() {
	// Inset between track padding-edge and knob; shared by off/on positions.
	const inset = vars.toggle.inset.or("0.125em");
	const height = vars.toggle.height.or("1.5em");
	const width = vars.toggle.width.or("2.75em");
	return field(
		[
			":not(.selector) input[type=checkbox].toggle",
			"input[type=checkbox][role=switch]",
			".toggle:not(.selector)",
		],
		css.rule("&", {
			// Box — pin size so field-sizing/min-content cannot shrink the track
			cursor: "pointer",
			position: "relative",
			display: "inline-flex",
			flex_shrink: "0",
			vertical_align: "middle",
			appearance: "none",
			field_sizing: "fixed",
			padding: "0em",
			margin: "0em",
			width: width,
			min_width: width,
			height: height,
			min_height: height,
			// Off track is a visible gray — pin the whole recipe so field chrome cannot wash it.
			__control_background_base: vars.control.color.base.or(vars.color.neutral),
			__control_background_tint: vars.color.paper,
			__control_background_blend: 0.45,
			__control_background_opacity: 1.0,
			background_color: control.background(0.45, 1.0),
			// Border
			border_radius: vars.toggle.border.radius.or(
				vars.control.border.radius,
				"0.25em",
			),
			border_width: vars.control.border.width.or("1px"),
			border_color: "transparent",
			// Outline
			outline_color: control.outline(0.8, 0.6),
			// Transition
			transition: "background-color 140ms ease, outline-color 140ms ease",
		}),
		css.rule("&::before", {
			// Content
			content: '""',
			// Box — height from padding-box; translateY centers (ignores border asymmetry)
			display: "block",
			position: "absolute",
			box_sizing: "border-box",
			top: "50%",
			left: inset,
			height: `calc(100% - 2 * ${inset})`,
			aspect_ratio: "1/1",
			width: "auto",
			transform: "translateY(-50%)",
			// Border — radius matches the track (squared vs pill)
			border_style: "solid",
			border_radius: vars.toggle.knob.border.radius.or("inherit"),
			border_width: "0px",
			border_color: "transparent",
			// Knob is solid paper so it reads on the gray off-track
			__control_background_base: vars.color.paper,
			__control_background_tint: vars.color.paper,
			__control_background_blend: 0,
			background_color: vars.color.paper,
			box_shadow: "none",
			transition:
				"left 140ms ease, transform 140ms ease, border-color 140ms ease, box-shadow 140ms ease, border-radius 140ms ease",
		}),
		css.rule("&.shadow::before", {
			box_shadow: "0 1px 2px oklch(0% 0 0 / 0.16)",
		}),

		css.rule("&:checked, &.checked", {
			// Checked track tracks the accent, not the field surface.
			__control_background_base: vars.control.color.base,
			background_color: control.background(control.color.blend(0.9), 1.0),
		}),
		css.rule("&:checked::before, &.checked::before", {
			left: `calc(100% - ${inset})`,
			transform: "translate(-100%, -50%)",
		}),
		// Outline switches are transparent while off and use their semantic
		// color as a solid track when on. Bare .outline defaults to neutral.
		css.rule("&.outline", {
			__control_background_base: vars.control.color.base.or(vars.color.neutral),
			__control_background_opacity: 0,
			background_color: "transparent",
			border_width: vars.control.border.width.or("1px"),
			border_color: control.border(1.0, 1.0),
		}),
		css.rule("&.outline::before", {
			border_width: vars.toggle.knob.border.width.or(
				vars.control.border.width,
				"1px",
			),
			border_color: control.border(0.55, 0.55, vars.color.ink),
		}),
		css.rule("&.outline:checked::before, &.outline.checked::before", {
			border_color: control.border(0.5, 0.4, vars.color.ink),
		}),
		css.rule("&.outline:checked, &.outline.checked", {
			__control_background_opacity: 1.0,
			background_color: control.background(1.0, 1.0),
			border_color: control.border(0.85, 1.0),
		}),
		css.rule("&.outline:hover, &.outline.hover", {
			background_color: "transparent",
		}),
		css.rule("&.outline:checked:hover, &.outline.checked.hover", {
			background_color: control.background(0.82, 1.0),
		}),
		// Apple-like pill track + floating circular knob
		css.rule("&.rounded", {
			__toggle_border_radius: "999px",
			__border_radius: "999px",
			border_radius: "999px",
		}),
		css.rule("&.rounded::before", {
			box_shadow: "none",
		}),
		css.rule("&.rounded.shadow::before", {
			box_shadow:
				"0 1px 3px oklch(0% 0 0 / 0.22), 0 0 0 0.5px oklch(0% 0 0 / 0.06)",
		}),
		css.rule("&:hover, &.hover", {
			background_color: control.background(0.55, 1.0),
		}),
		css.rule("&:checked:hover, &.checked.hover", {
			background_color: control.background(0.82, 1.0, vars.color.ink),
		}),
		css.rule(
			"&:focus:not(.nofocus), &:focus-within:not(.nofocus), &.focus:not(.notfocus)",
			{
				outline_width: vars.control.outline.width.or("2px"),
			},
		),
		css.rule("&:disabled, &.disabled", {
			cursor: "not-allowed",
		}),
		css.rule("&.compact", {
			padding: "0em",
		}),
	);
}

function range() {
	return field(
		["input[type=range]", ".range"],
		css.rule("&", {
			appearance: "none",
			padding: "0em",
			margin: "0em",
			border_width: "0px",
			background: "transparent",
			height: vars.range.height.or("1.5em"),
			min_height: vars.range.height.or("1.5em"),
			cursor: "pointer",
		}),
		css.rule("&.tinted", {
			background_color: "transparent !important",
		}),
		css.rule("&::-webkit-slider-runnable-track", {
			box_sizing: "border-box",
			height: vars.range.track.height.or("0.45em"),
			border_radius: vars.range.track.radius.or("999px"),
			border: "0",
			// Track stays neutral; only progress and thumb carry the accent.
			// NOTE: no --control-* pins here, the thumb inherits from the track.
			box_shadow: `inset 0 0 0 ${vars.control.border.width.or("1px")} ${colors.mixed(
				vars.color.neutral,
				vars.color.paper,
				0.6,
				1.0,
			)}`,
			background_color: colors.mixed(
				vars.color.neutral,
				vars.color.page.or(vars.color.paper),
				0.2,
				0.95,
			),
		}),
		css.rule("&::-webkit-slider-thumb", {
			appearance: "none",
			box_sizing: "border-box",
			margin_top: `calc(( ${vars.range.track.height.or("0.45em")} - ${vars.range.thumb.size.or("1em")} ) / 2)`,
			width: vars.range.thumb.size.or("1em"),
			height: vars.range.thumb.size.or("1em"),
			border_radius: "50%",
			border: "0",
			__control_background_base: vars.color.paper,
			__control_background_tint: vars.color.paper,
			__control_background_blend: 0,
			__control_background_opacity: 1.0,
			background_color: vars.color.paper,
			box_shadow: `0 0 0 ${vars.control.border.width.or("1px")} ${control.border(0.9, 1.0, vars.color.ink)}`,
		}),
		css.rule("&::-moz-range-track", {
			box_sizing: "border-box",
			height: vars.range.track.height.or("0.45em"),
			border_radius: vars.range.track.radius.or("999px"),
			border: "0",
			// Track stays neutral; only progress and thumb carry the accent
			box_shadow: `inset 0 0 0 ${vars.control.border.width.or("1px")} ${colors.mixed(
				vars.color.neutral,
				vars.color.paper,
				0.6,
				1.0,
			)}`,
			background_color: colors.mixed(
				vars.color.neutral,
				vars.color.page.or(vars.color.paper),
				0.2,
				0.95,
			),
		}),
		css.rule("&::-moz-range-progress", {
			height: vars.range.track.height.or("0.45em"),
			border_radius: vars.range.track.radius.or("999px"),
			background_color: control.color(1.0, 1.0, vars.color.ink),
		}),
		css.rule("&.tinted::-webkit-slider-runnable-track", {
			background: `linear-gradient(to right, ${control.color(1.0, 1.0, vars.color.ink)} 0 var(--range-progress, 50%), ${colors.mixed(
				vars.color.neutral,
				vars.color.page.or(vars.color.paper),
				0.2,
				0.95,
			)} var(--range-progress, 50%) 100%)`,
		}),
		css.rule("&.tinted::-moz-range-progress", {
			background_color: control.color(1.0, 1.0, vars.color.ink),
		}),
		css.rule("&::-moz-range-thumb", {
			box_sizing: "border-box",
			width: vars.range.thumb.size.or("1em"),
			height: vars.range.thumb.size.or("1em"),
			border_radius: "50%",
			border: "0",
			__control_background_base: vars.color.paper,
			__control_background_tint: vars.color.paper,
			__control_background_blend: 0,
			__control_background_opacity: 1.0,
			background_color: vars.color.paper,
			box_shadow: `0 0 0 ${vars.control.border.width.or("1px")} ${control.border(0.9, 1.0, vars.color.ink)}`,
		}),
		css.rule(
			"&:hover::-webkit-slider-runnable-track, &.hover::-webkit-slider-runnable-track",
			{
				border_color: colors.mixed(
					vars.color.neutral,
					vars.color.paper,
					0.8,
					1.0,
				),
			},
		),
		css.rule(
			"&:focus::-webkit-slider-runnable-track, &:focus-within::-webkit-slider-runnable-track, &.focus::-webkit-slider-runnable-track",
			{
				border_color: colors.mixed(
					vars.color.neutral,
					vars.color.paper,
					0.85,
					1.0,
				),
			},
		),
		// Same selector as the base focus ring so this suppression wins the cascade
		css.rule(css.mods("&:not(.nofocus)", "focus"), {
			outline_width: "0px",
		}),
		css.rule(
			"&:focus::-webkit-slider-thumb, &:focus-within::-webkit-slider-thumb, &.focus::-webkit-slider-thumb",
			{
				box_shadow: `0 0 0 ${vars.control.border.width.or("1px")} ${control.border(0.9, 1.0, vars.color.ink)}, 0 0 0 calc(${vars.control.border.width.or("1px")} + ${vars.control.outline.width.or("2px")}) ${control.outline(0.8, 0.5)}`,
			},
		),
		css.rule(
			"&:focus::-moz-range-thumb, &:focus-within::-moz-range-thumb, &.focus::-moz-range-thumb",
			{
				box_shadow: `0 0 0 ${vars.control.border.width.or("1px")} ${control.border(0.9, 1.0, vars.color.ink)}, 0 0 0 calc(${vars.control.border.width.or("1px")} + ${vars.control.outline.width.or("2px")}) ${control.outline(0.8, 0.5)}`,
			},
		),
		css.rule("&:active::-webkit-slider-thumb, &.active::-webkit-slider-thumb", {
			transform: "scale(0.95)",
		}),
		css.rule("&:disabled, &.disabled", {
			cursor: "not-allowed",
		}),
		css.rule("&.compact", {
			padding: "0em",
		}),
	);
}
function select() {
	return field(
		["select", ".select"],
		css.rule("&:not([multiple]):not(.vertical)", {
			appearance: "none",
			cursor: "pointer",
		}),
		// Multi-selects remain native listboxes so their keyboard and assistive
		// technology behavior is preserved. .vertical makes that intent explicit.
		css.rule("&[multiple], &.vertical", {
			appearance: "auto",
			cursor: "pointer",
			display: "inline-flex",
			width: "100%",
			align_items: "stretch",
			padding: "0em",
			border_width: "0px",
			text_align: "left",
			background_color: "transparent",
			scrollbar_width: "none",
		}),
		css.rule("&[multiple]::-webkit-scrollbar, &.vertical::-webkit-scrollbar", {
			display: "none",
		}),
		css.rule(
			"&[multiple]:focus, &[multiple]:focus-within, &.vertical:focus, &.vertical:focus-within",
			{
				outline: "none !important",
			},
		),
		css.nesting("&[multiple] > option, &.vertical > option", {
			display: "block",
			width: "100%",
			box_sizing: "border-box",
			font_family: "inherit",
			font_size: "inherit",
			line_height: "inherit",
			font_weight: "inherit",
			padding: "0.5em 1em",
			color: vars.color.ink,
			text_align: "left",
			outline: "none !important",
			box_shadow: "none !important",
			border_radius: "0em",
			// Pin border to the shared structural color (not the semantic accent).
			__control_border_base: vars.border.color.base,
			__control_background_opacity: 0,
			border_width: vars.control.border.width.or("1px"),
			border_top_width: "0px",
			border_color: control.border(0.55, 0.9, vars.color.paper),
			background_color: control.background(1.0, 0.0, vars.color.paper),
		}),
		css.rule("&.compact > option", {
			padding: "0.35em 0.5em",
		}),
		css.rule(
			"&[multiple] > option:first-child, &.vertical > option:first-child",
			{
				border_top_width: vars.control.border.width.or("1px"),
				border_top_left_radius: vars.selector.border.radius.or("0.25em"),
				border_top_right_radius: vars.selector.border.radius.or("0.25em"),
			},
		),
		css.rule(
			"&[multiple] > option:last-child, &.vertical > option:last-child",
			{
				border_bottom_left_radius: vars.selector.border.radius.or("0.25em"),
				border_bottom_right_radius: vars.selector.border.radius.or("0.25em"),
			},
		),
		css.rule("&.selector[multiple] > option, &.selector.vertical > option", {
			// Selector listboxes use row separators, not a second outer border.
			border_left_width: "0px",
			border_right_width: "0px",
		}),
		css.rule(
			"&.selector[multiple] > option:first-child, &.selector.vertical > option:first-child",
			{
				border_top_width: "0px",
			},
		),
		css.rule(
			"&.selector[multiple] > option:last-child, &.selector.vertical > option:last-child",
			{
				border_bottom_width: "0px",
			},
		),
		css.rule(
			[
				"&[multiple] > option:not(:checked):hover",
				"&.vertical > option:not(:checked):hover",
			],
			{
				__control_background_opacity: 0.45,
			},
		),
		css.nesting("&[multiple] > option:checked, &.vertical > option:checked", {
			// Solid accent fill — full opacity, no paper blend or hover wash.
			// Border stays ink (structural); only the fill uses the accent.
			__control_background_base: vars.control.color.base,
			__control_background_tint: vars.control.color.base,
			__control_background_blend: 1.0,
			__control_background_opacity: 1.0,
			color: controlContrast(),
			background_color: control.background(1.0, 1.0),
			outline: "none !important",
			box_shadow: "none !important",
		}),
		css.rule("&.selector:disabled, &.selector.disabled", {
			// Disabled selectors dim their content channels, not their border.
			opacity: 1,
			__control_color_opacity: 0.5,
			__control_background_opacity: 0,
			color: `color-mix(in oklch, ${vars.color.surface_text}, transparent 50%)`,
			background_color: control.background(1.0, 0.0),
		}),
		css.rule(
			"&.selector:disabled > option:checked, &.selector.disabled > option:checked",
			{
				__control_background_opacity: 0.15,
				color: `color-mix(in oklch, ${controlContrast()}, transparent 50%)`,
				background_color: control.background(1.0, 0.15),
			},
		),
		...colors.semantic.map((color) =>
			css.rule(
				css.mods(["&[multiple] > option", "&.vertical > option"], color),
				{
					__control_color_base: vars.color[color],
				},
			),
		),
		css.rule("&[multiple].colored > option, &.vertical.colored > option", {
			color: control.color(1.0, 1.0, vars.color.ink),
			__control_border_base: vars.control.color.base,
			border_color: control.border(0.9, 1.0, vars.color.paper),
		}),
		css.rule("&[multiple].tinted > option, &.vertical.tinted > option", {
			__control_background_base: vars.control.color.base,
			__control_background_tint: vars.control.color.base,
			__control_background_blend: 1.0,
			__control_background_opacity: 0.15,
			background_color: control.background(1.0, 0.15),
		}),
		css.rule("&[multiple] > option:checked, &.vertical > option:checked", {
			color: controlContrast(),
		}),
		css.rule("&:disabled, &.disabled", {
			cursor: "not-allowed",
		}),
		css.rule("&.compact[multiple], &.vertical.compact", {
			padding: "0em",
		}),
	);
}

function selector() {
	// Selectors are like a `div` with `input + label`.
	// Surface/tint come from field() (paper @ 0.8, .tinted = accent wash).
	return css.group(
		// Structural reset lives outside the nested field wrapper so shared
		// field padding cannot win through nesting specificity.
		css.rule(".selector", {
			display: "inline-flex",
			width: "fit-content",
			align_items: "center",
			padding: "0em",
			border: "0",
			border_width: "0px",
			background: "transparent",
			box_shadow: "none",
			text_align: "center",
			gap: "0em",
			__control_gap: "0em",
			__gap: "0em",
		}),
		field(
			// Keep shared field styling lower specificity than selector-specific rules.
			":where(.selector)",
			css.nesting("& > input[type]", {
				display: "none !important",
				visibility: "hidden !important",
			}),
			// Labels: ink text + neutral borders by default. Only the checked
			// option takes the accent fill. .colored also accents label bd/tx.
			css.nesting("& > label", {
				border_radius: "0em",
				padding: "0.5em 1em",
				justify_content: "center",
				cursor: "pointer",
				color: vars.color.ink,
				// Pin border to the shared structural color (not the semantic accent)
				__control_border_base: vars.border.color.base,
				__control_background_opacity: 0.8,
				border_width: vars.control.border.width.or("1px"),
				border_left_width: "0px",
				border_color: control.border(0.55, 0.9, vars.color.paper),
				background_color: control.background(
					1.0,
					0.8,
					vars.color.surface,
					vars.color.surface,
				),
			}),
			css.rule("&.white > label", {
				__control_background_base: vars.color.white,
				__control_background_blend: 1.0,
				__control_background_opacity: 1.0,
				background_color: control.background(1.0, 1.0),
			}),
			css.rule("&.colored > label", {
				color: control.color(1.0, 1.0, vars.color.ink),
				__control_border_base: vars.control.color.base,
				border_color: control.border(0.9, 1.0, vars.color.paper),
			}),
			// Hover wash only on unselected labels (selected stays solid)
			css.rule(
				[
					"& > input:not(:checked) + label:hover",
					"& > input:not(:checked) + label.hover",
				],
				{
					__control_background_opacity: 0.45,
				},
			),
			css.rule("&:active, &.active", {
				__control_background_opacity: 0.2,
				background_color: control.background(0.9, 0.2, vars.color.paper),
			}),
			css.rule("& > label:last-child", {
				border_top_right_radius: vars.selector.border.radius.or("0.25em"),
				border_bottom_right_radius: vars.selector.border.radius.or("0.25em"),
			}),
			css.rule("& > input:first-child + label", {
				border_left_width: vars.control.border.width.or("1px"),
				border_top_left_radius: vars.selector.border.radius.or("0.25em"),
				border_bottom_left_radius: vars.selector.border.radius.or("0.25em"),
			}),
			css.rule("&.horizontal", {
				flex_direction: "row",
			}),
			css.rule("&.vertical", {
				flex_direction: "column",
				align_items: "stretch",
			}),
			css.rule("&.vertical > label", {
				width: "100%",
				border_left_width: vars.control.border.width.or("1px"),
				border_top_width: "0px",
			}),
			css.rule("&.vertical > input:first-child + label", {
				border_top_width: vars.control.border.width.or("1px"),
				border_top_right_radius: vars.selector.border.radius.or("0.25em"),
				border_bottom_left_radius: "0em",
			}),
			css.rule("&.vertical > label:last-child", {
				border_top_right_radius: "0em",
				border_bottom_left_radius: vars.selector.border.radius.or("0.25em"),
			}),
			css.nesting("& > input:checked + label", {
				// Solid accent fill — full opacity, no paper blend, no hover wash.
				// Border stays ink (structural); only the fill uses the accent.
				__control_background_base: vars.control.color.base,
				__control_background_tint: vars.control.color.base,
				__control_background_blend: 1.0,
				__control_background_opacity: 1.0,
				color: controlContrast(),
				background_color: control.background(1.0, 1.0),
			}),
			// Item colors are scoped to the rendered label. Checked and tinted
			// declarations above consume the local accent through CSS variables.
			...colors.semantic.map((color) =>
				css.rule(css.mods("& > label", color), {
					__control_color_base: vars.color[color],
				}),
			),
			css.rule("&.tinted > label", {
				__control_background_base: vars.control.color.base,
				__control_background_tint: vars.control.color.base,
				__control_background_blend: 1.0,
				__control_background_opacity: 0.15,
				background_color: control.background(1.0, 0.15),
			}),
			css.rule("&.tinted", {
				padding: "0em",
				background: "transparent",
			}),
			css.rule("& > label:active, & > label.active", {
				__control_background_opacity: 0.2,
				background_color: control.background(0.9, 0.2, vars.color.paper),
			}),
			css.rule("&.compact", {
				padding: "0em",
			}),
			css.rule("&.compact > label", {
				padding: "0.35em 0.5em",
			}),
			css.rule("&.stretch", {
				width: "100%",
			}),
			css.rule("&.stretch:not(.vertical) > label", {
				flex: "1",
			}),
		),
		// Segmented button group. Track chrome matches the switch (.toggle):
		// filled gray, no visible border; .outline / .shadow / .rounded apply.
		css.rule(".selector.toggle", {
			display: "inline-flex",
			align_items: "center",
			width: "fit-content",
			padding: "0.25em",
			gap: "0.125em",
			border_style: "solid",
			border_width: vars.control.border.width.or("1px"),
			border_color: "transparent",
			border_radius: vars.toggle.border.radius.or(
				vars.control.border.radius,
				"0.25em",
			),
			__control_background_base: vars.control.color.base.or(vars.color.neutral),
			__control_background_tint: vars.color.paper,
			__control_background_blend: 0.45,
			__control_background_opacity: 1.0,
			background_color: control.background(0.45, 1.0),
			__control_gap: "0.125em",
			__gap: "0.125em",
		}),
		css.rule(".selector.toggle.rounded", {
			border_radius: "999px",
		}),
		css.rule(".selector.toggle.outline", {
			__control_background_opacity: 0,
			background_color: "transparent",
			__control_border_base: vars.border.color.base,
			border_color: control.border(1.0, 1.0),
		}),
		css.rule(".selector.toggle > button", {
			appearance: "none",
			padding: "0.3em 0.75em",
			border: "0",
			border_width: vars.control.border.width.or("1px"),
			border_style: "solid",
			border_color: "transparent",
			border_radius: vars.toggle.border.radius.or(
				vars.control.border.radius,
				"0.25em",
			),
			background_color: "transparent",
			color: vars.color.ink,
			box_shadow: "none",
			transition:
				"background-color 140ms ease, color 140ms ease, box-shadow 140ms ease, border-color 140ms ease",
		}),
		css.rule(".selector.toggle.rounded > button", {
			border_radius: "999px",
		}),
		css.rule(".selector.toggle > button:hover, .selector.toggle > button.hover", {
			background_color: control.background(0.55, 0.35),
		}),
		css.rule(
			".selector.toggle > button[aria-pressed=true], .selector.toggle > button.selected",
			{
				__control_background_base: vars.color.paper,
				__control_background_tint: vars.color.paper,
				__control_background_blend: 0,
				__control_background_opacity: 1.0,
				background_color: vars.color.paper,
				color: vars.color.ink,
				box_shadow: "none",
			},
		),
		css.rule(
			".selector.toggle.shadow > button[aria-pressed=true], .selector.toggle.shadow > button.selected",
			{
				box_shadow: "0 1px 2px oklch(0% 0 0 / 0.16)",
			},
		),
		css.rule(
			".selector.toggle.rounded.shadow > button[aria-pressed=true], .selector.toggle.rounded.shadow > button.selected",
			{
				box_shadow:
					"0 1px 3px oklch(0% 0 0 / 0.22), 0 0 0 0.5px oklch(0% 0 0 / 0.06)",
			},
		),
		css.rule(
			".selector.toggle.outline > button[aria-pressed=true], .selector.toggle.outline > button.selected",
			{
				border_color: control.border(0.55, 0.55, vars.color.ink),
			},
		),
		css.rule(".selector.squared > input, .selector.squared > label", {
			border_radius: "0em",
		}),
	);
}

function tabBackground() {
	return {
		__background_color: colors.mixed(
			vars.background.color.base,
			vars.background.color.tint,
			vars.background.color.blend,
			vars.background.color.opacity,
		),
		background_color: vars.background.color,
	};
}

function tab() {
	const tabBorder = colors.mixed(
		vars.border.color.base,
		vars.border.color.tint,
		vars.border.color.blend,
		vars.border.color.opacity,
	);
	return css.group(
		css.rule(".tabs", {
			display: "inline-flex",
			position: "relative",
			bottom: "-1px",
			z_index: 1,
			max_width: "100%",
			overflow: "hidden",
			border: `1px solid ${tabBorder}`,
			border_bottom: "0",
			border_radius: "0.375rem 0.375rem 0 0",
			background_color: "transparent",
			gap: "0",
		}),
		css.rule(".tabs:not(.group):not(.bar) .tab", {
			border_bottom: `1px solid ${tabBorder}`,
			border_left: `1px solid ${tabBorder}`,
			border_radius: "0",
			padding: "0.5em 1em",
			color: vars.color.neutral,
			background_color: "transparent",
		}),
		css.rule(".tabs:not(.group):not(.bar) .tab:first-child", {
			border_left: "0",
		}),
		css.rule(".tabs.group", {
			display: "inline-flex",
			flex_wrap: "wrap",
			max_width: "100%",
			gap: "0.15rem",
			padding: "0.35rem",
			border_radius: "0.375rem",
			border: "0",
			__background_color_base: vars.color.neutral,
			__background_color_tint: vars.color.paper,
			__background_color_blend: 1.0,
			__background_color_opacity: 0.2,
			...tabBackground(),
		}),
		css.rule(".tabs .tab", {
			cursor: "pointer",
			border: "0",
			border_radius: "0.25rem",
			padding: "0.5em 0.85em",
			font: "inherit",
			color: vars.color.ink,
			box_shadow: "none",
			outline: "0",
			appearance: "none",
			__background_color_base: vars.accent.color.or(vars.color.surface),
			__background_color_tint: vars.color.paper,
			__background_color_blend: 1.0,
			__background_color_opacity: 0,
			...tabBackground(),
		}),
		css.rule(".tabs.compact", {
			padding: "0.2rem",
		}),
		css.rule(".tabs.compact .tab, .tabs .tab.compact", {
			padding: "0.35em 0.5em",
		}),
		css.rule(".tabs.compacted", {
			display: "flex",
			width: "100%",
		}),
		css.rule(".tabs.compacted .tab", {
			width: "min-content",
			flex: "0 0 min-content",
		}),
		css.rule(".tabs.bar", {
			display: "flex",
			width: "100%",
			overflow: "visible",
			padding: "0",
			bottom: "0",
			border: "0",
			border_radius: "0",
			border_bottom: `${vars.border.width} solid ${tabBorder}`,
			background_color: "transparent",
			gap: "0",
		}),
		css.rule(".tabs.bar.top", {
			border_bottom: "0",
			border_top: `${vars.border.width} solid ${tabBorder}`,
		}),
		css.rule(".tabs.bar.bottom", {
			border_top: "0",
			border_bottom: `${vars.border.width} solid ${tabBorder}`,
		}),
		css.rule(".tabs.vertical", {
			flex_direction: "column",
			align_items: "stretch",
		}),
		css.rule(".tabs.bar.vertical", {
			width: "max-content",
			max_width: "100%",
			border_bottom: "0",
			border_right: `${vars.border.width} solid ${tabBorder}`,
		}),
		css.rule(".tabs.bar .tab", {
			position: "relative",
			top: "0",
			border: "0",
			border_radius: "0",
			color: vars.color.neutral,
			white_space: "nowrap",
		}),
		...colors.semantic.map((name) =>
			css.rule(`.tabs .tab.${name}`, {
				__accent_color: vars.color[name],
				__control_color_base: vars.color[name],
				__background_color_base: vars.color[name],
			}),
		),
		css.rule(".tabs.group .tab:hover", {
			__background_color_base: vars.color.paper,
			__background_color_opacity: 0.4,
		}),
		css.rule(".tabs.group .tab[aria-selected=true], .tabs.group .tab.active", {
			__background_color_base: vars.accent.color.or(vars.color.surface),
			__background_color_opacity: 1.0,
			color: `contrast-color(${vars.background.color})`,
			box_shadow: `var(--shadow-x) var(--shadow-y) var(--shadow-spread) var(--shadow-color)`,
		}),
		css.rule(".tabs:not(.group):not(.bar) .tab:hover", {
			__background_color_base: vars.color.neutral,
			__background_color_opacity: 0.35,
		}),
		css.rule(".tabs:not(.group):not(.bar) .tab[aria-selected=true], .tabs:not(.group):not(.bar) .tab.active", {
			__background_color_base: vars.color.surface,
			__background_color_opacity: 1.0,
			border_bottom_color: vars.color.surface,
			color: vars.color.ink,
			box_shadow: "none",
		}),
		...colors.semantic.flatMap((name) => [
			css.rule(`.tabs:not(.group):not(.bar).${name} .tab:not([aria-selected=true]):not(.active), .tabs.bar.${name} .tab:not([aria-selected=true]):not(.active)`, {
				color: vars.color.ink,
			}),
			css.rule(`.tabs:not(.group):not(.bar).${name} .tab[aria-selected=true], .tabs:not(.group):not(.bar).${name} .tab.active, .tabs.bar.${name} .tab[aria-selected=true], .tabs.bar.${name} .tab.active`, {
				color: vars.color[name],
			}),
		]),
		css.rule(".tabs.bar .tab[aria-selected=true], .tabs.bar .tab.active", {
			color: vars.color.ink,
			background_color: "transparent",
			box_shadow: "none",
			z_index: 1,
			margin_bottom: `calc(-1 * ${vars.border.width})`,
		}),
		css.rule(".tabs.bar .tab::after", {
			content: '""',
			position: "absolute",
			bottom: "0",
			left: "0",
			right: "0",
			height: vars.border.width,
			background_color: "currentColor",
			visibility: "hidden",
		}),
		css.rule(".tabs.bar .tab[aria-selected=true]::after, .tabs.bar .tab.active::after", {
			visibility: "visible",
		}),
		css.rule(".tabs.bar.vertical .tab", {
			top: "0",
			text_align: "start",
		}),
		css.rule(".tabs.bar.vertical .tab[aria-selected=true], .tabs.bar.vertical .tab.active", {
			margin_bottom: "0",
			margin_right: `calc(-1 * ${vars.border.width})`,
		}),
		css.rule(".tabs.bar.vertical .tab::after", {
			top: "0",
			right: "0",
			bottom: "0",
			left: "auto",
			width: vars.border.width,
			height: "auto",
		}),
		css.rule(".tabs.bar.top .tab[aria-selected=true], .tabs.bar.top .tab.active", {
			margin_bottom: "0",
			margin_top: `calc(-1 * ${vars.border.width})`,
		}),
		css.rule(".tabs.bar.top .tab::after", {
			top: "0",
			bottom: "auto",
		}),
		css.rule(".tabs.bar.vertical.left", {
			border_right: "0",
			border_left: `${vars.border.width} solid ${tabBorder}`,
		}),
		css.rule(".tabs.bar.vertical.left .tab[aria-selected=true], .tabs.bar.vertical.left .tab.active", {
			margin_right: "0",
			margin_left: `calc(-1 * ${vars.border.width})`,
		}),
		css.rule(".tabs.bar.vertical.left .tab::after", {
			right: "auto",
			left: "0",
		}),
		css.rule(".tabs.bar.vertical.right", {
			border_left: "0",
			border_right: `${vars.border.width} solid ${tabBorder}`,
		}),
		...colors.semantic.map((name) =>
			css.rule(`.tabs.bar .tab.${name}[aria-selected=true], .tabs.bar .tab.${name}.active`, {
				color: vars.color[name],
			}),
		),
		css.rule(".tabs.bar .tab:hover", {
			background_color: "transparent",
		}),
		css.rule(".tabs.bar .tab:not([aria-selected=true]):not(.active):hover", {
			color: vars.color.text,
		}),
		css.rule(".tabs .tab:focus-visible, .tabs .tab.focus", {
			outline: `2px solid ${vars.color.focus.or(vars.color.neutral)}`,
			outline_offset: "-2px",
		}),
		css.rule(".tabs .tab:disabled, .tabs .tab.disabled", {
			opacity: 0.5,
			pointer_events: "none",
		}),
		css.rule(".tabs.group .tab.ghost", {
			__background_color_opacity: 0,
			border: "0",
		}),
		css.rule(".tabs.group .tab.ghost:hover", {
			__background_color_base: vars.color.paper,
			__background_color_opacity: 0.4,
		}),
		css.rule(".tabs.group .tab.ghost[aria-selected=true], .tabs.group .tab.ghost.active", {
			__background_color_base: vars.accent.color.or(vars.color.surface),
			__background_color_opacity: 1.0,
		}),
	);
}

export default css.named({
	base: basechrome(),
	fieldbase: fieldchrome(),
	fieldstates: fieldstates(),
	colorvariants: colorvariants(),
	actions: action([
		"button",
		".button",
		"input[type=submit]",
		"input[type=button]",
		"input[type=reset]",
	]),
	fields: field([
		".input",
		// :where() keeps element-level specificity so per-component rules win
		"input:where(:not([type=submit],[type=button],[type=reset],[type=image]):not(.button))",
		"textarea",
		".textarea",
		"select",
		".select",
		".group > :not(input, textarea, select, button, .input, .textarea, .select, .button)",
	]),
	checkbox: checkbox(),
	radio: radio(),
	range: range(),
	toggle: toggle(),
	select: select(),
	selector: selector(),
	selectable: selectable(),
	tab: tab(),
	form: css.group(
		css.rule([".field", "[data-field]"], {
			display: "flex",
			flex_direction: "column",
			gap: "0.35rem",
		}),
		css.rule([".hint", "[data-hint]"], {
			font_size: "0.875em",
			color: `color-mix(in oklch, ${vars.color.ink}, ${vars.color.paper} 42%)`,
		}),
		css.rule([".error", "[data-field][aria-invalid=true] .error"], {
			font_size: "0.875em",
			color: vars.color.error,
		}),
		css.rule(".field:has(:is(input, textarea, select)[aria-invalid=true])", {
			color: vars.color.error,
		}),
		css.rule(".group", {
			display: "flex",
			align_items: "stretch",
		}),
		css.rule(".group > :not(:first-child)", {
			border_top_left_radius: "0",
			border_bottom_left_radius: "0",
			margin_left: "-1px",
		}),
		css.rule(".group > :not(:last-child)", {
			border_top_right_radius: "0",
			border_bottom_right_radius: "0",
		}),
	),
});
// EOF
