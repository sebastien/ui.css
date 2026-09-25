import { group, tokens, vars } from "../js/uicss.js";
import { colormix } from "./colors.js";

const REM_PIXELS = 16;
function scaled(unit, px, scale = undefined, base = REM_PIXELS) {
	return scale
		? `calc( ${unit} * ${scale} * ${px} / ${base} )`
		: `calc( ${unit} * ${px} / ${base} )`;
}
const pem = (px, scale) => scaled("1em", px, scale);
const rpem = (px, scale) => scaled("1rem", px, scale);
const scale = (fn, scaleVar, steps) => [
	"0em",
	...steps.map((px) => fn(px, scaleVar)),
];

// Module: tokens
// This defines the main parameters for the style. They can be overriden
// at will to theme everything.
export default group(
	tokens({
		font: {
			mono: "ui-monospace, Consolas, monospace",
			sans: "system-ui, sans-serif",
			serif: "serif",
			cursive: "cursive",
			base: 16,
			size: `calc(1rem * ${vars.font.base} / ${REM_PIXELS})`,
			weight: 400,
			line: "1.5em",
			text: {
				family: `${vars.font.sans}`,
			},
			heading: {
				family: `${vars.font.sans}`,
			},
			display: {
				family: `${vars.font.sans}`,
			},
			script: {
				family: `${vars.font.cursive}`,
			},
			code: {
				family: `${vars.font.mono}`,
			},
			controls: {
				family: `${vars.font.sans}`,
				size: `${vars.font.size}`,
				line: "1.25em",
				weight: 500,
			},
			family: `${vars.font.text.family}`,
		},
		block: {
			width: "120px",
		},
		column: {
			width: `${vars.block.width}`,
		},
		scaling: {
			size: 1.0,
			pad: 1.25,
			margin: 1.25,
			gap: 1.25,
		},
	}),
	// ------------------------------------------------------------------------
	//
	// COLORS
	//
	// ------------------------------------------------------------------------
	// Semantic colors - all defined at L=0.5 in OKLCH as neutral baseline
	// Color scales (0-9) are generated at build time in colors.js
	tokens({
		color: {
			// Softer endpoints than pure black/white (still neutral greys)
			ink: "#1e293b",
			paper: "#f8fafc",
			white: "#FFFFFF",
			black: "#000000",
			hi: "#FFFF00A0",
			// Full palette. Consumers may override any of these; ui.css ships
			// defaults so `.bg-*` / `.tx-*` utilities resolve without a theme.
			red: "#ef4444",
			orange: "#f97316",
			amber: "#f59e0b",
			yellow: "#eab308",
			lime: "#84cc16",
			green: "#22c55e",
			emerald: "#10b981",
			teal: "#14b8a6",
			cyan: "#06b6d4",
			sky: "#0ea5e9",
			blue: "#0c31bf",
			indigo: "#6366f1",
			violet: "#8b5cf6",
			purple: "#a855f7",
			fuchsia: "#d946ef",
			pink: "#ec4899",
			rose: "#f43f5e",
			// Neutral palette
			slate: "#64748b",
			gray: "#d5d5d5",
			zinc: "#71717a",
			stone: "#78716c",
			taupe: "#a8a29e",
			mauve: "#b39ddb",
			mist: "#cbd5e1",
			olive: "#65a30d",
			// Semantics from the prior default scheme
			// Medium neutral: borders, accents, chrome
			neutral: vars.color.gray,
			primary: vars.color.blue,
			secondary: "#23d9d9",
			tertiary: vars.color.green,
			success: vars.color.green,
			info: vars.color.cyan,
			warning: vars.color.amber,
			error: vars.color.red,
			danger: vars.color.error,
			accent: vars.color.primary,
			// Focus ring color for raw `outline` declarations (control outline
			// chrome tracks --control-outline-* instead).
			focus: vars.color.neutral,
			// Mode-dependent roles. Components consume these rather than fixed endpoints.
			page: vars.color.paper,
			text: vars.color.ink,
			surface: vars.color.page,
			surface_text: vars.color.text,
			// Aliases
			tint: vars.color.paper,
		},
	}),
	tokens({
		// Bare component identity (distinct from the global semantic
		// `--color-accent`). Components override `--accent` locally; paint
		// recipes remain local to each element.
		accent: vars.color.neutral,
	}),

	// ------------------------------------------------------------------------
	//
	// COLOR PROPERTIES
	//
	// ------------------------------------------------------------------------
	// Each color property has: color (base, tint, blend, opacity), level, alpha
	// See spec-colors.md for full documentation
	tokens({
		background: {
			color: {
				base: vars.color.surface,
				tint: vars.color.tint.or(vars.color.surface),
				blend: 1.0,
				opacity: 1.0,
				// Optional extra-light surface per role. `neutral` ships a
				// default; other roles are override hooks (see docs/hooks.md).
				neutral: "#e5e7eb",
			},
		},
		text: {
			color: {
				base: vars.color.surface_text,
				tint: vars.color.tint.or(vars.color.surface),
				blend: 1.0,
				opacity: 1.0,
			},
			gap: "0.25em",
			line: {
				height: "1.5em",
			},
			list: {
				unordered: { indent: "1.5em" },
				ordered: { indent: "2em" },
				item: { gap: "0.5em" },
			},
			blockquote: {
				border: { width: "4px" },
				padding: { horizontal: "1em", vertical: "0.25em" },
				opacity: 0.85,
			},
			code: {
				padding: { horizontal: "1em", vertical: "0.75em" },
				background: `color-mix(in oklch, ${vars.color.ink}, transparent 94%)`,
				radius: "3px",
			},
			dt: {
				margin: { top: "1.5em", bottom: "0.5em" },
				opacity: 0.75,
			},
			dd: {
				margin: { top: "0.5em", bottom: "1.5em" },
			},
			inline: {
				subsup_size: "0.75em",
			},
			// Text sizing scale (separate from text color)
			size: [
				"0.58", // 0: xxs
				"0.69", // 1: xs
				"0.83", // 2: s
				"1.00", // 3: m
				"1.20", // 4: l
				"1.44", // 5: xl
				"1.73", // 6: xxl
				"2.00", // 7: xxxl
				"2.25", // 8
				"2.50", // 9
				"2.75", // 10
			],
			width: `${vars.limit.text}`,
		},
		border: {
			color: {
				base: vars.color.surface_text,
				tint: vars.color.tint,
				blend: 1.0,
				opacity: 0.35,
			},
			width: "1px",
			style: "solid",
			radius: [
				"0px", // 0:xxs
				"2px", // 1:xs
				"4px", // 2:s
				"6px", // 3:m
				"8px", // 4:l
				"12px", // 5:xl
				"16px", // 6:xxl
			],
		},
		outline: {
			color: {
				base: vars.color.surface_text,
				tint: vars.color.tint.or(vars.color.surface),
				blend: 0.3,
				opacity: 0.8,
			},
		},
	}),
	// ------------------------------------------------------------------------
	//
	// SPACING & SIZING
	//
	// ------------------------------------------------------------------------
	tokens({
		motion: {
			duration: {
				instant: "80ms",
				fast: "120ms",
				base: "180ms",
				normal: vars.motion.duration.base,
				slow: "260ms",
				slower: "360ms",
			},
			easing: {
				standard: "cubic-bezier(0.2, 0, 0, 1)",
				out: "cubic-bezier(0, 0, 0.2, 1)",
				in: "cubic-bezier(0.4, 0, 1, 1)",
				soft: "cubic-bezier(0.16, 1, 0.3, 1)",
				snap: "cubic-bezier(0.34, 1.56, 0.64, 1)",
				emphasized: "ease-in-out",
			},
			shift: {
				hover_dx: "20%",
			},
			move: {
				xs: "4px",
				sm: "8px",
				md: "16px",
				lg: "24px",
			},
			scale: {
				in: "0.98",
				out: "0.98",
				press: "0.985",
				pop: "1.015",
			},
			lift: {
				y: "-2px",
				shadow: "0 8px 24px rgb(0 0 0 / 0.10)",
				shadow_soft: "0 4px 16px rgb(0 0 0 / 0.08)",
			},
			backdrop: {
				opacity: "0.36",
			},
			highlight: "rgb(255 220 120 / 0.38)",
			shimmer: {
				base: "rgb(0 0 0 / 0.06)",
				sheen: "rgb(255 255 255 / 0.42)",
			},
			animation: {
				duration: vars.motion.duration.base,
				ease: vars.motion.easing.standard,
				delay: "0ms",
				fill: "both",
			},
			stagger: {
				step: "45ms",
			},
		},
		size: scale(
			pem,
			vars.scaling.size,
			[4, 8, 12, 16, 24, 32, 48, 64, 96, 128],
		),
		pad: scale(rpem, vars.scaling.pad, [2, 4, 6, 8, 12, 16, 24, 32]),
		margin: scale(rpem, vars.scaling.margin, [2, 4, 6, 8, 12, 16, 24, 32]),
		gap: scale(pem, vars.scaling.gap, [4, 8, 12, 16, 24, 32, 48, 64, 96, 128]),

		opacity: {
			dim: 0.5,
			dimmer: 0.35,
			dimmest: 0.15,
		},
		shadow: {
			x: "2px",
			y: "2px",
			spread: "1px",
			color: {
				base: vars.color.ink,
				tint: vars.color.paper,
				blend: 0.4,
				opacity: 0.12,
			},
			// Trailing `_` emits the channel root (`--shadow-color`, the computed
			// mix) alongside the nested roles, mirroring `--background-color`.
			color_: colormix(
				vars.shadow.color.base,
				vars.shadow.color.tint,
				vars.shadow.color.blend,
				vars.shadow.color.opacity,
			),
		},
		limit: {
			text: "80ch",
			block: ["360px", "720px", "960px"],
			content: "1080px",
			page: "1080px",
		},
		// The logic here is as follows:
		// - Page baseline (page.base) defines the value for 1rem/100% at the body level
		// - Page unit (page.unit) defines the equivalent of 1px in rems.
		page: {
			base: 16,
		},
		heading: {
			min: `${vars.page.base}`,
			max: 42,
			line: vars.font.line,
			size: [
				"80%", // 0: xxs
				"100%", // 1: xs
				"113%", // 2: s
				"117%", // 3: m
				"129%", // 4: l
				"161%", // 5: xl
				"193%", // 6: xxl
			],
		},
		control: {
			font: {
				family: `${vars.font.controls.family}`,
				size: "1em",
				line: `${vars.font.controls.line}`,
				weight: `${vars.font.controls.weight}`,
			},
			gap: "0.25em",
			padding: "0.5em 0.8em",
			padding_compact: "0.15em 0.25em",
			padding_tight: "0.1em 0.15em",
			margin: "0em",
			color: {
				base: vars.color.neutral,
				tint: vars.color.tint,
				blend: 1.0,
				opacity: 1.0,
			},
			border: {
				width: "1px",
				radius: "0.25em",
				base: vars.color.surface_text,
				tint: vars.color.tint,
				blend: 1.0,
				opacity: 0.75,
			},
			outline: {
				width: "2px",
				// Dynamic default: tracks the control accent unless overridden.
				base: vars.control.color.base,
				tint: vars.control.color.tint,
				blend: 0.8,
				opacity: 0.5,
			},
			default: {
				outline: { opacity: 0.8 },
			},
			disabled: { opacity: 0.5 },
		},
		field: {
			font: {
				size: `${vars.control.font.size}`,
			},
			padding: "0.55em 0.7em",
			padding_compact: "0.35em 0.5em",
			padding_tight: "0.15em 0.25em",
			border: {
				radius: "0.25em",
			},
			width: "100%",
			gap: "0.5em",
			icon_size: "1.5em",
			slot_color: undefined,
			input_padding_block: "0.7143em",
			input_padding_block_compact: "0.5em",
			unit_padding: "0.7143em 0.5714em",
			unit_padding_compact: "0.6667em 0.5em",
			unit_background: undefined,
		},
		pill: {
			font_size: "0.75em",
			line_height: "1.15em",
			padding: "0.25em 1em",
			padding_compact: "0.125em 0.5em",
			padding_expanded: "0.5em 1.25em",
			gap: undefined,
			dot_size: "0.65em",
			dot_color: undefined,
			icon_size: "1em",
			bg: undefined,
			text: undefined,
		},
		badge: {
			size: "1.25rem",
		},
		tab: {
			padding: "0.5em 0.85em",
			padding_compact: "0.35em 0.5em",
		},
		action: {
			font: {
				size: `${vars.control.font.size}`,
			},
			padding: vars.control.padding,
			border: {
				width: "0px",
				radius: "0.25em",
			},
			outline: {
				width: "2px",
			},
			default: {
				outline: {
					opacity: 0.8,
				},
			},
		},
		selector: {
			border: {
				radius: "0.25em",
			},
		},
		card: {
			padding: "1.5rem",
			border: {
				width: "1px",
				radius: "0.5em",
			},
			color: {
				base: vars.color.neutral,
				tint: vars.color.paper,
				blend: 0,
				alpha: 1.0,
			},
		},
		checkbox: {
			size: "1.125em",
			border: {
				radius: "0.2em",
				width: "1px",
			},
		},
		radio: {
			size: "1.125em",
			dot: {
				size: "0.5em",
			},
		},
		toggle: {
			width: "2.75em",
			height: "1.5em",
			inset: "0.125em",
			border: { radius: vars.control.border.radius },
			knob: {
				border: { radius: "inherit" },
			},
		},
		range: {
			height: "1.5em",
			track: {
				height: "0.45em",
				radius: "999px",
			},
			thumb: { size: "1em" },
		},
		alert: {
			padding: "0.8rem 1rem",
			border: { radius: "4px" },
		},
		avatar: {
			size: "2.5rem",
			small: "2rem",
			large: "3.25rem",
		},
		dialog: {
			width: "32rem",
			padding: "1.5rem",
			border: { radius: "8px" },
		},
		progress: { height: "0.5rem" },
	}),
);

// EOF
