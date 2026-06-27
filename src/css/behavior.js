import { vars, root, named, group, rule } from "../js/uicss.js";

const gated = (condition, ...selectors) =>
	selectors.map((selector) => `${root}${condition} ${selector}`);

export default named({
	// NOTE: We use hovered as hover is reserved as a :hover alias.
	undim: group(
		rule(".hover-undim", {
			transition: `opacity ${vars.motion.duration.normal} ${vars.motion.easing.emphasized}`,
		}),
		rule(
			gated(
				".nohover",
				".hovered:focus .hover-undim",
				".hovered:focus-within .hover-undim",
				".hovered:hover .hover-undim",
				".hover-undim:hover",
				".hover-undim:focus",
				".hover-undim:focus-within",
			),
			{
				opacity: "1.0",
				transition: `opacity ${vars.motion.duration.normal} ${vars.motion.easing.emphasized}`,
			},
		),
	),
	reveal: group(
		rule(".hovered .hover-reveal", { opacity: "0.0" }),
		rule(
			gated(
				":not(.nohover)",
				".hovered:hover .hover-reveal",
				".hover-reveal:hover",
			),
			{
				opacity: "1.0",
				transition: `opacity ${vars.motion.duration.normal} ${vars.motion.easing.emphasized}`,
			},
		),
	),
	show: group(
		rule(
			[
				".hovered .hover-show",
				".hovered:not(:hover) .hover-show",
				".hovered:hover .hover-hide",
			],
			{
				display: "none",
			},
		),
		rule(
			// TODO: We need to workout how .nohover works
			[
				".hovered:hover .hover-show",
				".hovered.hover .hover-show",
				".hover-show:hover",
				".hover-show.hover",
			],
			{
				display: "revert",
			},
		),
		rule([".focused .focus-show"], {
			display: "none!important",
		}),
		rule(
			[
				".focused.focus .focus-show",
				".focused:focus-within .focus-show",
				".focus-show:focus",
				".focus-show.focus",
				".focus-show:focus-within",
				".focus-show:hover",
				".focus-show.hover",
			],
			{
				display: "revert",
			},
		),
	),
	whenhover: group(
		rule(".hovered .when-hover", { display: "none" }),
		rule(`.hovered:hover .when-hover`, {
			display: "unset",
		}),
		rule(`.hovered:hover .when-nohover`, {
			display: "none",
		}),
	),
	shift: group(
		rule(".hover-dx", {
			transition: `transform ${vars.motion.duration.fast} ${vars.motion.easing.standard}`,
		}),
		rule(
			gated(":not(.nohover)", ".hover-dx:hover", ".hovered:hover .hover-dx"),
			{
				transform: `translateX(${vars.motion.shift.hover_dx})`,
			},
		),
	),
	summary: group(
		rule("details", {
			__details_open_show_display: "none",
			__details_open_hide_display: "inherit",
			__details_open_rotate: "0deg",
		}),
		rule("details:open", {
			__details_open_show_display: "inherit",
			__details_open_hide_display: "none",
			__details_open_rotate: vars.motion.rotation,
		}),
		rule(".open-show, .when-open", {
			display: "var(--details-open-show-display)",
		}),
		rule(".open-hide", { display: "var(--details-open-hide-display)" }),
		rule(".open-rotate", {
			transform: "rotate(var(--details-open-rotate, 0deg))",
			transform_origin: "center",
			transition: `transform ${vars.motion.duration.fast} ${vars.motion.easing.standard}`,
		}),
		rule("details::details-content", {
			transition: `height ${vars.motion.duration.fast} ${vars.motion.easing.standard}, opacity ${vars.motion.duration.fast} ${vars.motion.easing.standard}`,
			height: "0",
			overflow: "hidden",
		}),
		rule("details[open]::details-content", {
			height: "auto",
			opacity: "1",
		}),
	),
	rotation: group(
		rule(".r-180", { __motion_rotation: "180deg" }),
		rule(".r-90", { __motion_rotation: "90deg" }),
	),
});

// EOF
