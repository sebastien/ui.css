import { group, sizes, tokens, vars } from "../js/uicss.js";

const REM_PIXELS = 16;
function pem(px, scale = undefined) {
	return scale
		? `calc( 1em * ${scale} * ${px} / ${REM_PIXELS} )`
		: `calc( 1em * ${px} / ${REM_PIXELS} )`;
}

function color(name) {
	return `color-mix(in oklch, color-mix(in oklch, var(--${name}-base), var(--${name}-tint) calc((1 - var(--${name}-blend)) * 100%)), transparent calc((1 - var(--${name}-opacity)) * 100%))`;
}

// Module: tokens
// This defines the main parameters for the style. They can be overriden
// at will to theme everything.
export default group(
	tokens({
		font: {
			mono: "monospace",
			sans: "sans-serif",
			serif: "serif",
			cursive: "cursive",
			base: 14,
			size: `calc(1rem * var(--font-base) / ${REM_PIXELS})`,
			line: "1.25em",
			text: {
				family: `${vars.font.sans}`,
				size: `${vars.font.size}`,
				line: `${vars.font.line}`,
			},
			heading: {
				family: `${vars.font.sans}`,
				size: `${vars.font.size}`,
				line: `${vars.font.line}`,
			},
			display: {
				family: `${vars.font.sans}`,
				size: `${vars.font.size}`,
				line: `${vars.font.line}`,
			},
			script: {
				family: `${vars.font.cursive}`,
				size: `${vars.font.size}`,
				line: `${vars.font.line}`,
			},
			code: {
				family: `${vars.font.mono}`,
				size: `${vars.font.size}`,
				line: `${vars.font.line}`,
			},
			controls: {
				family: `${vars.font.sans}`,
				size: `${vars.font.size}`,
				line: "1em",
				weight: 500,
			},
			family: `${vars.font.text.family}`,
			line_height: `${vars.font.line}`,
			control: {
				family: `${vars.font.controls.family}`,
				size: `${vars.font.controls.size}`,
				line: `${vars.font.controls.line}`,
				weight: `${vars.font.controls.weight}`,
			},
		},
		block: {
			width: "140px",
		},
		column: {
			width: `${vars.block.width}`,
		},
		scaling: {
			pad: 1.5,
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
			// Scale endpoint colors
			white: "#FFFFFF",
			black: "#000000",
			ink: "var(--color-slate-950)",
			action: "var(--color-slate-400)",
			border: "var(--color-slate-400)",
			paper: "#FFFFFF",
			// Luminosity direction: 1 = normal (light mode), -1 = inverted (dark mode)
			l: { direction: 1 },
			// Semantic colors (reference palette.css variables)
			neutral: "var(--color-gray-500)",
			primary: "var(--color-blue-500)",
			secondary: "var(--color-violet-500)",
			tertiary: "var(--color-teal-500)",
			success: "var(--color-green-500)",
			valid: "var(--color-green-500)",
			info: "var(--color-cyan-500)",
			warning: "var(--color-amber-500)",
			issue: "var(--color-amber-500)",
			danger: "var(--color-red-500)",
			error: "var(--color-red-500)",
			// Mode-dependent colors (defaults to light mode, swapped by .dark)
			page: `${vars.color.paper}`,
			text: `${vars.color.ink}`,
		},
	}),

	// ------------------------------------------------------------------------
	//
	// COLOR PROPERTIES
	//
	// ------------------------------------------------------------------------
	// Each color property has: level, alpha, blend, blending
	// See spec-colors.md for full documentation
	tokens({
		background: {
			base: `${vars.color.paper}`,
			tint: `${vars.color.paper}`,
			blend: 1.0,
			opacity: 1.0,
			l: 5,
			o: 9,
			color: color("background"),
		},
		text: {
			base: `${vars.color.ink}`,
			tint: `${vars.color.paper}`,
			blend: 1.0,
			opacity: 1.0,
			color: color("text"),
		},
		border: {
			base: `${vars.color.ink}`,
			tint: `${vars.color.paper}`,
			blend: 0.5,
			opacity: 0.9,
			l: 5,
			o: 9,
			color: color("border"),
			width: "1px",
			style: "solid",
			// FIXME: Should move this out
			// Non-color properties
			sizes: sizes.map((_, i) => `${i}px`),
			radius: [
				"1px", // 0:xxs
				"2px", // 1:xs
				"4px", // 2:s
				"6px", // 3:m
				"8px", // 4:l
				"12px", // 5:xl
				"16px", // 6:xxl
			],
		},
		outline: {
			base: `${vars.color.ink}`,
			tint: `${vars.color.paper}`,
			blend: 0.3,
			opacity: 0.8,
			color: color("outline"),
			width: "2px",
			style: "solid",
		},
		// Text sizing properties (separate from text color)
		textsize: {
			size: [
				"0.40", // 0: xxs
				"0.60", // 1: xs
				"0.80", // 2: s
				"1.00", // 3: m
				"1.20", // 5: l
				"1.60", // 6: xl
				"1.80", // 7: xxl
			],
		},
	}),
	// ------------------------------------------------------------------------
	//
	// SPACING & SIZING
	//
	// ------------------------------------------------------------------------
	tokens({
		theme: {
			text: {
				body: {
					line: `${vars.font.line}`,
					color: `${vars.color.text}`,
				},
				heading: {
					line: `${vars.font.heading.line}`,
					weight: 600,
					color: `${vars.color.ink}`,
				},
			},
			surface: {
				page: `${vars.color.page}`,
				text: `${vars.color.text}`,
				code: {
					background: "rgba(128, 128, 128, 0.1)",
					radius: "4px",
				},
			},
			motion: {
				duration: {
					fast: "0.1s",
					normal: "0.2s",
					slow: "0.3s",
				},
				easing: {
					standard: "ease",
					emphasized: "ease-in-out",
				},
				shift: {
					hover_dx: "20%",
				},
			},
		},
		ui: {
			control: {
				transition: `background ${vars.theme.motion.duration.normal} ${vars.theme.motion.easing.standard}, color ${vars.theme.motion.duration.normal} ${vars.theme.motion.easing.standard}, border ${vars.theme.motion.duration.normal} ${vars.theme.motion.easing.standard}, outline-color ${vars.theme.motion.duration.normal} ${vars.theme.motion.easing.standard}`,
				border: {
					width: "1px",
				},
				focus: {
					ring: {
						width: "2px",
					},
				},
				style: {
					default: {
						border: {
							width: "3px",
						},
					},
					outline: {
						border: {
							width: "1px",
						},
					},
				},
				icon: {
					padding: "0.25em",
					size: "1em",
				},
				disabled: {
					blend: "50%",
					opacity: "75%",
				},
			},
			prose: {
				stack: "0.75em",
				line_min_height: "1.5em",
				list_indent: "1.5em",
				list_indent_ordered: "2em",
				list_item_gap: "0.5em",
				blockquote: {
					border_width: "4px",
					padding_x: "1em",
					padding_y: "0.25em",
					opacity: 0.85,
				},
				code: {
					padding_y: "0.75em",
					padding_x: "1em",
				},
				dt: {
					margin_top: "1.5em",
					margin_bottom: "0.5em",
					opacity: 0.75,
				},
				dd: {
					margin_top: "0.5em",
					margin_bottom: "1.5em",
				},
				inline: {
					subsup_size: "0.75em",
				},
			},
		},
		size: [
			"0em",
			pem(5), // 1:xxs
			pem(10), // 2:xs
			pem(15), // 3:s
			pem(30), // 4:m
			pem(40), // 5:l
			pem(50), // 6:xl
			pem(60), // 7:xxl
			pem(70), // 8:xxxl
			pem(80), // 9:xxxxl
			pem(100), // 10:xxxxl
		],
		margin: [
			"0em",
			pem(5), // 1: xxs
			pem(10), // 2: xs
			pem(15), // 3: s
			pem(30), // 4: m
			pem(40), // 5: l
			pem(50), // 6: xl
			pem(70), // 7: xxl
			pem(80), // 8: xxl
			pem(120), // 9: xxl
			pem(140), // 10: xxl
		],
		pad: [
			"0em",
			pem(2, vars.scaling.pad), // 1: xxs
			pem(4, vars.scaling.pad), // 2: xs
			pem(6, vars.scaling.pad), // 3: s
			pem(8, vars.scaling.pad), // 4: m
			pem(12, vars.scaling.pad), // 5: l
			pem(16, vars.scaling.pad), // 6: xl
			pem(24, vars.scaling.pad), // 7: xxl
			pem(32, vars.scaling.pad), // 8: xxxl
			pem(48, vars.scaling.pad), // 9: xxxxl
			pem(64, vars.scaling.pad), // 10: xxxxxl
		],
		gap: [
			"0em",
			pem(2), // 1: xxs
			pem(4), // 2: xs
			pem(6), // 3: s
			pem(8), // 4: m
			pem(12), // 5: l
			pem(16), // 6: xl
			pem(24), // 7: xxl
			pem(32), // 8: xxxl
			pem(64), // 9: xxxxl
			pem(96), // 10: xxxxxl
		],
		opacity: {
			dim: 0.65,
			dimmer: 0.45,
			dimmest: 0.25,
		},
		shadow: {
			x: "2px",
			y: "2px",
			spread: "1px",
			base: `${vars.color.ink}`,
			opacity: 0.25,
			color: `color-mix(in oklch, var(--shadow-base), transparent calc(100% - 100% * var(--shadow-opacity)))`,
		},
		limit: {
			text: "80ch",
			block: ["360px", "720px", "960px"],
			content: "960px",
			page: "960px",
		},
		// The logic here is as follows:
		// - Page baseline (page.base) defines the value for 1rem/100% at the body level
		// - Page unit (page.unit) defines the equivalent of 1px in rems.
		page: {
			base: 16,
			unit: "calc( (1rem/16) * var(--page-base) / 16)",
		},
		heading: {
			min: "var(--page-base)",
			max: 42,
			unit: "var(--page-unit)",
			base: "var(--heading-min)",
			amplitude: "calc(var(--heading-max) - var(--heading-min))",
			size: [
				"80%", // 0: xxs
				"100%", // 1: xs
				"115%", // 2: s
				"130%", // 3: m
				"160%", // 4: l
				"200%", // 5: xl
				"240%", // 6: xxl
			],
		},
		text: {
			width: `${vars.limit.text}`,
		},
	}),
	// ------------------------------------------------------------------------
	//
	// CONTROLS
	//
	// ------------------------------------------------------------------------
	tokens({
		// ====================================================================
		// BUTTON
		// ====================================================================
		button: {
			font: {
				family: `${vars.font.controls.family}`,
				line: `${vars.font.controls.line}`,
				weight: `${vars.font.controls.weight}`,
				size: `${vars.font.controls.size}`,
			},
			box: {
				padding: {
					x: "1em",
					y: "0.65em",
				},
				radius: `${vars.border.radius[1]}`,
			},
			// Background and text
			color: {
				base: `${vars.color.neutral}`,
				primary: `${vars.color.primary}`,
				secondary: `${vars.color.secondary}`,
				tertiary: `${vars.color.tertiary}`,
				success: `${vars.color.success}`,
				warning: `${vars.color.warning}`,
				danger: `${vars.color.danger}`,
				tint: `${vars.color.paper}`,
				blend: "0%",
				opacity: "100%",
			},
			// Outline
			focus: {
				tint: `${vars.color.paper}`,
				blend: "100%",
				opacity: "50%",
			},
			// Background
			selected: {
				tint: `${vars.color.ink}`,
				blend: "70%",
				opacity: "100%",
			},
			// Background
			hover: {
				tint: `${vars.color.ink}`,
				blend: "50%",
				opacity: "50%",
			},
			// Background
			active: {
				tint: `${vars.color.paper}`,
				blend: "80%",
				opacity: "100%",
			},
		},
		// ====================================================================
		// BUTTON
		// ====================================================================
		selectable: {
			font: {
				family: `${vars.font.controls.family}`,
				line: `${vars.font.controls.line}`,
				weight: `${vars.font.controls.weight}`,
				size: `${vars.font.controls.size}`,
			},
			box: {
				radius: `${vars.border.radius[1]}`,
			},
			color: {
				base: `${vars.color.neutral}`,
				primary: `${vars.color.primary}`,
				secondary: `${vars.color.secondary}`,
				tertiary: `${vars.color.tertiary}`,
				success: `${vars.color.success}`,
				warning: `${vars.color.warning}`,
				danger: `${vars.color.danger}`,
				tint: `${vars.color.paper}`,
				blend: "0%",
				opacity: "100%",
			},
			focus: {
				tint: `${vars.color.paper}`,
				blend: "100%",
				opacity: "25%",
			},
			selected: {
				tint: `${vars.color.ink}`,
				blend: "70%",
				opacity: "25%",
			},
			hover: {
				tint: `${vars.color.ink}`,
				blend: "50%",
				opacity: "25%",
			},
			active: {
				tint: `${vars.color.paper}`,
				blend: "80%",
				opacity: "25%",
			},
		},
		// ====================================================================
		// INPUTS
		// ====================================================================
		input: {
			font: {
				family: `${vars.font.controls.family}`,
				line: `${vars.font.controls.line}`,
				weight: `${vars.font.controls.weight}`,
				size: `${vars.font.controls.size}`,
			},
			box: {
				padding: {
					x: "0.875em",
					y: "0.625em",
				},
				radius: `${vars.border.radius[1]}`,
			},
			// Background and text
			color: {
				base: `${vars.color.neutral}`,
				primary: `${vars.color.primary}`,
				secondary: `${vars.color.secondary}`,
				tertiary: `${vars.color.tertiary}`,
				success: `${vars.color.success}`,
				warning: `${vars.color.warning}`,
				danger: `${vars.color.danger}`,
				tint: `${vars.color.paper}`,
				blend: "0%",
				opacity: "100%",
			},
			// Outline
			focus: {
				tint: `${vars.color.paper}`,
				blend: "100%",
				opacity: "10%",
			},
			// Background
			selected: {
				tint: `${vars.color.ink}`,
				blend: "70%",
				opacity: "100%",
			},
			// Background
			hover: {
				tint: `${vars.color.ink}`,
				blend: "50%",
				opacity: "50%",
			},
			// Background
			active: {
				tint: `${vars.color.paper}`,
				blend: "80%",
				opacity: "100%",
			},
		},
		// ====================================================================
		// TEXTAREA
		// ====================================================================
		textarea: {
			font: {
				family: `${vars.font.controls.family}`,
				line: `${vars.font.controls.line}`,
				weight: `${vars.font.controls.weight}`,
				size: `${vars.font.controls.size}`,
			},
			box: {
				padding: {
					x: "0.875em",
					y: "0.625em",
				},
				radius: `${vars.border.radius[1]}`,
			},
			// Background and text
			color: {
				base: `${vars.color.neutral}`,
				primary: `${vars.color.primary}`,
				secondary: `${vars.color.secondary}`,
				tertiary: `${vars.color.tertiary}`,
				success: `${vars.color.success}`,
				warning: `${vars.color.warning}`,
				danger: `${vars.color.danger}`,
				tint: `${vars.color.paper}`,
				blend: "0%",
				opacity: "100%",
			},
			// Outline
			focus: {
				tint: `${vars.color.paper}`,
				blend: "100%",
				opacity: "10%",
			},
			// Background
			selected: {
				tint: `${vars.color.ink}`,
				blend: "70%",
				opacity: "100%",
			},
			// Background
			hover: {
				tint: `${vars.color.ink}`,
				blend: "50%",
				opacity: "50%",
			},
			// Background
			active: {
				tint: `${vars.color.paper}`,
				blend: "80%",
				opacity: "100%",
			},
		},
		// ====================================================================
		// CHECKBOX
		// ====================================================================
		checkbox: {
			font: {
				family: `${vars.font.controls.family}`,
				line: `${vars.font.controls.line}`,
				weight: `${vars.font.controls.weight}`,
				size: `${vars.font.controls.size}`,
			},
			box: {
				size: "1.15em",
				radius: "0.2em",
				marker: "0.72em",
			},
			// Background and text
			color: {
				base: `${vars.color.neutral}`,
				primary: `${vars.color.primary}`,
				secondary: `${vars.color.secondary}`,
				tertiary: `${vars.color.tertiary}`,
				success: `${vars.color.success}`,
				warning: `${vars.color.warning}`,
				danger: `${vars.color.danger}`,
				tint: `${vars.color.paper}`,
				blend: "0%",
				opacity: "100%",
			},
			// Content to display for checked and partial states
			content: {
				checked: '"✓"',
				partial: '"─"',
			},
			// Outline
			focus: {
				tint: `${vars.color.paper}`,
				blend: "100%",
				opacity: "10%",
			},
			// Background
			selected: {
				tint: `${vars.color.ink}`,
				blend: "70%",
				opacity: "100%",
			},
			// Background
			hover: {
				tint: `${vars.color.ink}`,
				blend: "50%",
				opacity: "50%",
			},
			// Background
			active: {
				tint: `${vars.color.paper}`,
				blend: "80%",
				opacity: "100%",
			},
		},
		// ====================================================================
		// RADIO
		// ====================================================================
		radio: {
			font: {
				family: `${vars.font.controls.family}`,
				line: `${vars.font.controls.line}`,
				weight: `${vars.font.controls.weight}`,
				size: `${vars.font.controls.size}`,
			},
			box: {
				size: "1.15em",
				radius: "50%",
				marker: "0.72em",
			},
			// Background and text
			color: {
				base: `${vars.color.neutral}`,
				primary: `${vars.color.primary}`,
				secondary: `${vars.color.secondary}`,
				tertiary: `${vars.color.tertiary}`,
				success: `${vars.color.success}`,
				warning: `${vars.color.warning}`,
				danger: `${vars.color.danger}`,
				tint: `${vars.color.paper}`,
				blend: "0%",
				opacity: "100%",
			},
			// Content to display for checked state (dot character)
			content: {
				checked: '"●"',
			},
			// Outline
			focus: {
				tint: `${vars.color.paper}`,
				blend: "100%",
				opacity: "10%",
			},
			// Background
			selected: {
				tint: `${vars.color.ink}`,
				blend: "70%",
				opacity: "100%",
			},
			// Background
			hover: {
				tint: `${vars.color.ink}`,
				blend: "50%",
				opacity: "50%",
			},
			// Background
			active: {
				tint: `${vars.color.paper}`,
				blend: "80%",
				opacity: "100%",
			},
		},
		// ====================================================================
		// SELECT
		// ====================================================================
		select: {
			font: {
				family: `${vars.font.controls.family}`,
				line: `${vars.font.controls.line}`,
				weight: `${vars.font.controls.weight}`,
				size: `${vars.font.controls.size}`,
			},
			box: {
				padding: {
					x: "0.875em",
					y: "0.625em",
				},
				radius: `${vars.border.radius[1]}`,
			},
			arrow: {
				size: "0.3em",
				offset: "0.75em",
				gap: "0.33em",
			},
			color: {
				base: `${vars.color.neutral}`,
				primary: `${vars.color.primary}`,
				secondary: `${vars.color.secondary}`,
				tertiary: `${vars.color.tertiary}`,
				success: `${vars.color.success}`,
				warning: `${vars.color.warning}`,
				danger: `${vars.color.danger}`,
				tint: `${vars.color.paper}`,
				blend: "0%",
				opacity: "100%",
			},
			focus: {
				tint: `${vars.color.paper}`,
				blend: "100%",
				opacity: "10%",
			},
		},
		// ====================================================================
		// RANGE
		// ====================================================================
		range: {
			font: {
				family: `${vars.font.controls.family}`,
				line: `${vars.font.controls.line}`,
				weight: `${vars.font.controls.weight}`,
				size: `${vars.font.controls.size}`,
			},
			box: {
				max_width: "36em",
			},
			track: {
				size: "0.28em",
				radius: "999px",
				color: "#d7dbe0",
			},
			thumb: {
				size: "0.95em",
				radius: "50%",
			},
			color: {
				base: `${vars.color.primary}`,
				primary: `${vars.color.primary}`,
				secondary: `${vars.color.secondary}`,
				tertiary: `${vars.color.tertiary}`,
				success: `${vars.color.success}`,
				warning: `${vars.color.warning}`,
				danger: `${vars.color.danger}`,
				tint: `${vars.color.paper}`,
				blend: "0%",
				opacity: "100%",
			},
			focus: {
				tint: `${vars.color.paper}`,
				blend: "100%",
				opacity: "10%",
			},
		},
		// ====================================================================
		// PANEL
		// ====================================================================
		panel: {
			box: {
				padding: {
					x: `${vars.pad[4]}`,
					y: `${vars.pad[4]}`,
				},
				radius: `${vars.border.radius[2]}`,
				accent: "4px",
			},
			color: {
				base: `${vars.color.neutral}`,
				primary: `${vars.color.primary}`,
				secondary: `${vars.color.secondary}`,
				tertiary: `${vars.color.tertiary}`,
				success: `${vars.color.success}`,
				warning: `${vars.color.warning}`,
				danger: `${vars.color.danger}`,
				tint: `${vars.color.paper}`,
				blend: "0%",
				opacity: "100%",
			},
		},
	}),
);

// EOF
