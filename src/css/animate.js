import { group, keyframes, media, named, rule, times, vars } from "../js/uicss.js";

const duration = vars.motion.animation.duration;
const ease = vars.motion.animation.ease;
const delay = vars.motion.animation.delay;
const fill = vars.motion.animation.fill;

const fast = vars.motion.duration.fast;
const slow = vars.motion.duration.slow;
const softer = vars.motion.easing.soft;
const standard = vars.motion.easing.standard;
const easeIn = vars.motion.easing.in;
const easeOut = vars.motion.easing.out;

const moveXs = vars.motion.move.xs;
const moveSm = vars.motion.move.sm;
const moveMd = vars.motion.move.md;

const transition = (...properties) =>
	properties
		.map((property) => `${property} ${fast} ${standard}`)
		.join(", ");

const namedAnimation = (selector, name, props = {}) =>
	rule(selector, {
		animation_name: name,
		...props,
	});

export default named({
	base: group(
		rule(".anim", {
			animation_duration: duration,
			animation_timing_function: ease,
			animation_delay: delay,
			animation_fill_mode: fill,
		}),
		rule(".anim-fast", { __motion_animation_duration: fast }),
		rule(".anim-slow", { __motion_animation_duration: slow }),
		rule(".anim-soft", { __motion_animation_ease: softer }),
		rule(".anim-in", { __motion_animation_ease: easeOut }),
		rule(".anim-out", { __motion_animation_ease: easeIn }),
		...times(4, (i) =>
			rule(`.delay-${i + 1}`, {
				__motion_animation_delay: `${(i + 1) * 40}ms`,
			}),
		),
		rule(".will-change-transform", { will_change: "transform, opacity" }),
		// Editor caret pulse (step-end = hard on/off like a native caret).
		namedAnimation(".caret-blink", "caret-blink", {
			animation_duration: "1.05s",
			animation_timing_function: "step-end",
			animation_iteration_count: "infinite",
			animation_fill_mode: "none",
		}),
		keyframes("caret-blink", {
			"0%, 100%": { opacity: 1 },
			"50%": { opacity: 0 },
		}),
	),
	reveal: group(
		namedAnimation(".fade-in", "fade-in"),
		namedAnimation(".fade-out", "fade-out"),
		namedAnimation(".fade-up", "fade-up"),
		namedAnimation(".fade-down", "fade-down"),
		namedAnimation(".scale-in", "scale-in", {
			__motion_animation_ease: softer,
		}),
		namedAnimation(".scale-out", "scale-out", {
			__motion_animation_ease: easeIn,
		}),
		keyframes("fade-in", {
			from: { opacity: 0 },
			to: { opacity: 1 },
		}),
		keyframes("fade-out", {
			from: { opacity: 1 },
			to: { opacity: 0 },
		}),
		keyframes("fade-up", {
			from: {
				opacity: 0,
				transform: `translateY(${moveSm})`,
			},
			to: {
				opacity: 1,
				transform: "translateY(0)",
			},
		}),
		keyframes("fade-down", {
			from: {
				opacity: 0,
				transform: `translateY(calc(${moveSm} * -1))`,
			},
			to: {
				opacity: 1,
				transform: "translateY(0)",
			},
		}),
		keyframes("scale-in", {
			from: {
				opacity: 0,
				transform: `scale(${vars.motion.scale.in})`,
			},
			to: {
				opacity: 1,
				transform: "scale(1)",
			},
		}),
		keyframes("scale-out", {
			from: {
				opacity: 1,
				transform: "scale(1)",
			},
			to: {
				opacity: 0,
				transform: `scale(${vars.motion.scale.out})`,
			},
		}),
	),
	slide: group(
		namedAnimation(".slide-in-left", "slide-in-left", {
			__motion_animation_ease: softer,
		}),
		namedAnimation(".slide-in-right", "slide-in-right", {
			__motion_animation_ease: softer,
		}),
		namedAnimation(".slide-out-left", "slide-out-left", {
			__motion_animation_ease: easeIn,
		}),
		namedAnimation(".slide-out-right", "slide-out-right", {
			__motion_animation_ease: easeIn,
		}),
		namedAnimation(".slide-up", "slide-up", {
			__motion_animation_ease: softer,
		}),
		namedAnimation(".slide-down", "slide-down", {
			__motion_animation_ease: softer,
		}),
		keyframes("slide-in-left", {
			from: {
				opacity: 0,
				transform: `translateX(calc(${moveMd} * -1))`,
			},
			to: {
				opacity: 1,
				transform: "translateX(0)",
			},
		}),
		keyframes("slide-in-right", {
			from: {
				opacity: 0,
				transform: `translateX(${moveMd})`,
			},
			to: {
				opacity: 1,
				transform: "translateX(0)",
			},
		}),
		keyframes("slide-out-left", {
			from: {
				opacity: 1,
				transform: "translateX(0)",
			},
			to: {
				opacity: 0,
				transform: `translateX(calc(${moveMd} * -1))`,
			},
		}),
		keyframes("slide-out-right", {
			from: {
				opacity: 1,
				transform: "translateX(0)",
			},
			to: {
				opacity: 0,
				transform: `translateX(${moveMd})`,
			},
		}),
		keyframes("slide-up", {
			from: {
				opacity: 0,
				transform: `translateY(${moveMd})`,
			},
			to: {
				opacity: 1,
				transform: "translateY(0)",
			},
		}),
		keyframes("slide-down", {
			from: {
				opacity: 0,
				transform: `translateY(calc(${moveMd} * -1))`,
			},
			to: {
				opacity: 1,
				transform: "translateY(0)",
			},
		}),
	),
	surface: group(
		namedAnimation(".popover-in", "popover-in", {
			transform_origin: "var(--motion-origin, top center)",
			__motion_animation_duration: fast,
			__motion_animation_ease: softer,
		}),
		namedAnimation(".popover-out", "popover-out", {
			transform_origin: "var(--motion-origin, top center)",
			__motion_animation_duration: fast,
			__motion_animation_ease: easeIn,
		}),
		namedAnimation(".dialog-in", "dialog-in", {
			transform_origin: "center",
			__motion_animation_duration: slow,
			__motion_animation_ease: softer,
		}),
		namedAnimation(".dialog-out", "dialog-out", {
			transform_origin: "center",
			__motion_animation_duration: fast,
			__motion_animation_ease: easeIn,
		}),
		namedAnimation(".backdrop-in", "backdrop-in", {
			__motion_animation_duration: fast,
		}),
		namedAnimation(".backdrop-out", "backdrop-out", {
			__motion_animation_duration: fast,
		}),
		namedAnimation(".drawer-in-left", "drawer-in-left", {
			__motion_animation_duration: slow,
			__motion_animation_ease: softer,
		}),
		namedAnimation(".drawer-in-right", "drawer-in-right", {
			__motion_animation_duration: slow,
			__motion_animation_ease: softer,
		}),
		namedAnimation(".drawer-out-left", "drawer-out-left", {
			__motion_animation_duration: fast,
			__motion_animation_ease: easeIn,
		}),
		namedAnimation(".drawer-out-right", "drawer-out-right", {
			__motion_animation_duration: fast,
			__motion_animation_ease: easeIn,
		}),
		namedAnimation(".sheet-in-bottom", "sheet-in-bottom", {
			__motion_animation_duration: slow,
			__motion_animation_ease: softer,
		}),
		namedAnimation(".sheet-out-bottom", "sheet-out-bottom", {
			__motion_animation_duration: fast,
			__motion_animation_ease: easeIn,
		}),
		keyframes("popover-in", {
			from: {
				opacity: 0,
				transform: `translateY(calc(${moveXs} * -1)) scale(0.985)`,
			},
			to: {
				opacity: 1,
				transform: "translateY(0) scale(1)",
			},
		}),
		keyframes("popover-out", {
			from: {
				opacity: 1,
				transform: "translateY(0) scale(1)",
			},
			to: {
				opacity: 0,
				transform: `translateY(calc(${moveXs} * -1)) scale(0.985)`,
			},
		}),
		keyframes("dialog-in", {
			from: {
				opacity: 0,
				transform: `translateY(${moveSm}) scale(0.985)`,
			},
			to: {
				opacity: 1,
				transform: "translateY(0) scale(1)",
			},
		}),
		keyframes("dialog-out", {
			from: {
				opacity: 1,
				transform: "translateY(0) scale(1)",
			},
			to: {
				opacity: 0,
				transform: `translateY(${moveXs}) scale(0.985)`,
			},
		}),
		keyframes("backdrop-in", {
			from: { opacity: 0 },
			to: { opacity: vars.motion.backdrop.opacity },
		}),
		keyframes("backdrop-out", {
			from: { opacity: vars.motion.backdrop.opacity },
			to: { opacity: 0 },
		}),
		keyframes("drawer-in-left", {
			from: { transform: "translateX(-100%)" },
			to: { transform: "translateX(0)" },
		}),
		keyframes("drawer-in-right", {
			from: { transform: "translateX(100%)" },
			to: { transform: "translateX(0)" },
		}),
		keyframes("drawer-out-left", {
			from: { transform: "translateX(0)" },
			to: { transform: "translateX(-100%)" },
		}),
		keyframes("drawer-out-right", {
			from: { transform: "translateX(0)" },
			to: { transform: "translateX(100%)" },
		}),
		keyframes("sheet-in-bottom", {
			from: { transform: "translateY(100%)" },
			to: { transform: "translateY(0)" },
		}),
		keyframes("sheet-out-bottom", {
			from: { transform: "translateY(0)" },
			to: { transform: "translateY(100%)" },
		}),
	),
	interaction: group(
		rule(".lift", {
			transition: transition("transform", "box-shadow", "border-color", "background-color"),
		}),
		rule(".lift:hover", {
			transform: `translateY(${vars.motion.lift.y})`,
			box_shadow: vars.motion.lift.shadow_soft,
		}),
		rule(".press", {
			transition: transition("transform", "box-shadow", "background-color", "border-color"),
		}),
		rule(".press:active", {
			transform: `scale(${vars.motion.scale.press})`,
		}),
		rule(".flip", { perspective: "1000px" }),
		rule(".flip-inner", {
			position: "relative",
			transform_style: "preserve-3d",
			transition: `transform ${vars.motion.duration.slower} ${softer}`,
		}),
		rule([".flip-front", ".flip-back"], {
			backface_visibility: "hidden",
		}),
		rule(".flip-back", {
			position: "absolute",
			inset: 0,
			transform: "rotateY(180deg)",
		}),
		rule([".flip.is-flipped .flip-inner", ".flip:hover .flip-inner"], {
			transform: "rotateY(180deg)",
		}),
		rule(".flip-y .flip-back", {
			transform: "rotateX(180deg)",
		}),
		rule([".flip-y.is-flipped .flip-inner", ".flip-y:hover .flip-inner"], {
			transform: "rotateX(180deg)",
		}),
	),
	feedback: group(
		namedAnimation(".shake", "shake", {
			__motion_animation_duration: slow,
			__motion_animation_ease: standard,
		}),
		namedAnimation(".highlight", "highlight", {
			__motion_animation_duration: "900ms",
			__motion_animation_ease: easeOut,
		}),
		namedAnimation(".pop", "pop", {
			__motion_animation_duration: slow,
			__motion_animation_ease: vars.motion.easing.snap,
		}),
		rule(".focus-soft", {
			transition: transition("outline-color", "box-shadow", "border-color"),
		}),
		rule(".focus-soft:focus-visible", {
			outline: "2px solid color-mix(in srgb, currentColor 36%, transparent)",
			outline_offset: "2px",
		}),
		keyframes("shake", {
			"0%, 100%": { transform: "translateX(0)" },
			"20%": { transform: "translateX(-4px)" },
			"40%": { transform: "translateX(4px)" },
			"60%": { transform: "translateX(-2px)" },
			"80%": { transform: "translateX(2px)" },
		}),
		keyframes("highlight", {
			from: { background_color: vars.motion.highlight },
			to: { background_color: "transparent" },
		}),
		keyframes("pop", {
			"0%": { transform: "scale(1)" },
			"45%": { transform: `scale(${vars.motion.scale.pop})` },
			"100%": { transform: "scale(1)" },
		}),
	),
	loading: group(
		rule(".pulse", {
			animation_name: "pulse",
			animation_duration: "1.4s",
			animation_timing_function: standard,
			animation_iteration_count: "infinite",
		}),
		rule(".shimmer", {
			position: "relative",
			overflow: "hidden",
			background: vars.motion.shimmer.base,
		}),
		rule(".shimmer::after", {
			content: "\"\"",
			position: "absolute",
			inset: 0,
			transform: "translateX(-100%)",
			background: `linear-gradient(90deg, transparent, ${vars.motion.shimmer.sheen}, transparent)`,
			animation: `shimmer 1.4s ${standard} infinite`,
		}),
		rule(".spinner", {
			inline_size: "1em",
			block_size: "1em",
			border: "1.5px solid currentColor",
			border_block_start_color: "transparent",
			border_radius: "999px",
			animation: "spinner 720ms linear infinite",
		}),
		rule(".progress-indeterminate", {
			position: "relative",
			overflow: "hidden",
		}),
		rule(".progress-indeterminate::before", {
			content: "\"\"",
			position: "absolute",
			inset_block: 0,
			inline_size: "38%",
			transform: "translateX(-120%)",
			background: "currentColor",
			opacity: "0.42",
			animation: `progress-indeterminate 1.1s ${standard} infinite`,
		}),
		keyframes("pulse", {
			"0%, 100%": { opacity: 1 },
			"50%": { opacity: "0.62" },
		}),
		keyframes("shimmer", {
			to: { transform: "translateX(100%)" },
		}),
		keyframes("spinner", {
			to: { transform: "rotate(360deg)" },
		}),
		keyframes("progress-indeterminate", {
			to: { transform: "translateX(280%)" },
		}),
	),
	panels: group(
		namedAnimation(".list-enter", "list-enter", {
			__motion_animation_duration: vars.motion.duration.base,
			__motion_animation_ease: softer,
		}),
		namedAnimation(".list-exit", "list-exit", {
			__motion_animation_duration: fast,
			__motion_animation_ease: easeIn,
		}),
		rule(".accordion", {
			display: "grid",
			grid_template_rows: "auto 0fr",
			transition: `grid-template-rows ${slow} ${softer}`,
		}),
		rule(".accordion > :not(summary)", {
			overflow: "hidden",
		}),
		rule([".accordion.is-open", ".accordion[open]"], {
			grid_template_rows: "auto 1fr",
		}),
		namedAnimation(".details-reveal", "details-reveal", {
			__motion_animation_duration: vars.motion.duration.base,
			__motion_animation_ease: softer,
		}),
		keyframes("list-enter", {
			from: {
				opacity: 0,
				transform: `translateY(${moveXs})`,
			},
			to: {
				opacity: 1,
				transform: "translateY(0)",
			},
		}),
		keyframes("list-exit", {
			from: {
				opacity: 1,
				transform: "translateY(0)",
			},
			to: {
				opacity: 0,
				transform: `translateY(calc(${moveXs} * -1))`,
			},
		}),
		keyframes("details-reveal", {
			from: {
				opacity: 0,
				transform: `translateY(calc(${moveXs} * -1))`,
			},
			to: {
				opacity: 1,
				transform: "translateY(0)",
			},
		}),
	),
	messages: group(
		namedAnimation(".toast-in", "toast-in", {
			__motion_animation_duration: slow,
			__motion_animation_ease: softer,
		}),
		namedAnimation(".toast-out", "toast-out", {
			__motion_animation_duration: fast,
			__motion_animation_ease: easeIn,
		}),
		namedAnimation(".banner-in", "banner-in", {
			__motion_animation_duration: slow,
			__motion_animation_ease: softer,
		}),
		namedAnimation(".banner-out", "banner-out", {
			__motion_animation_duration: fast,
			__motion_animation_ease: easeIn,
		}),
		keyframes("toast-in", {
			from: {
				opacity: 0,
				transform: `translateY(${moveMd}) scale(0.985)`,
			},
			to: {
				opacity: 1,
				transform: "translateY(0) scale(1)",
			},
		}),
		keyframes("toast-out", {
			from: {
				opacity: 1,
				transform: "translateY(0) scale(1)",
			},
			to: {
				opacity: 0,
				transform: `translateY(${moveSm}) scale(0.985)`,
			},
		}),
		keyframes("banner-in", {
			from: {
				opacity: 0,
				transform: `translateY(calc(${moveMd} * -1))`,
			},
			to: {
				opacity: 1,
				transform: "translateY(0)",
			},
		}),
		keyframes("banner-out", {
			from: {
				opacity: 1,
				transform: "translateY(0)",
			},
			to: {
				opacity: 0,
				transform: `translateY(calc(${moveSm} * -1))`,
			},
		}),
	),
	stagger: group(
		rule(".stagger > *", {
			animation_delay: `calc(var(--motion-stagger-index, 0) * ${vars.motion.stagger.step})`,
		}),
		...times(12, (i) =>
			rule(`.stagger > *:nth-child(${i + 1})`, {
				__motion_stagger_index: i,
			}),
		),
	),
	reduced: media(
		"(prefers-reduced-motion: reduce)",
		rule(":root", {
			__motion_duration_instant: "1ms",
			__motion_duration_fast: "1ms",
			__motion_duration_base: "1ms",
			__motion_duration_slow: "1ms",
			__motion_duration_slower: "1ms",
		}),
		rule(
			[
				".anim",
				".pulse",
				".shimmer::after",
				".spinner",
				".progress-indeterminate::before",
			],
			{
				animation_duration: "1ms !important",
				animation_delay: "0ms !important",
				animation_iteration_count: "1 !important",
				transition_duration: "1ms !important",
				scroll_behavior: "auto !important",
			},
		),
		rule(
			[
				".flip-inner",
				".lift",
				".press",
				".focus-soft",
				".accordion",
			],
			{
				transition_duration: "1ms !important",
			},
		),
	),
});

// EOF
