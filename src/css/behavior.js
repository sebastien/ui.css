import { vars, named, group, rule } from "../js/uicss.js";

export default named({
	// NOTE: We use hovered as hover is reserved as a :hover alias.
	undim: group(
		rule(".hover-undim", {
			transition: `opacity ${vars.motion.duration.normal} ${vars.motion.easing.emphasized}`,
		}),
		rule(
			[
				".hovered:focus .hover-undim",
				".hovered:focus-within .hover-undim",
				".hovered:hover .hover-undim",
				".hover-undim:hover",
				".hover-undim:focus",
				".hover-undim:focus-within",
			].map((_) => `body.no-hover ${_}`),
			{
				opacity: "1.0",
				transition: `opacity ${vars.motion.duration.normal} ${vars.motion.easing.emphasized}`,
			},
		),
	),
	reveal: group(
		rule(".hovered .hover-reveal", { opacity: "0.0" }),
		rule(
			[".hovered:hover .hover-reveal", ".hover-reveal:hover"].map(
				(_) => `body:not(.nohover) ${_}`,
			),
			{
				opacity: "1.0",
				transition: `opacity ${vars.motion.duration.normal} ${vars.motion.easing.emphasized}`,
			},
		),
	),
	show: group(
		rule([".hovered .hover-show", ".hovered:not(:hover) .hover-show"], {
			visibility: "hidden",
		}),
		rule(
			[".hovered:hover .hover-show", ".hover-show:hover"].map(
				(_) => `body:not(.nohover) ${_}`,
			),
			{
				visibility: "visible",
			},
		),
		rule([".focused .focus-show"], {
			visibility: "hidden",
		}),
		rule(
			[
				".focused:focus .focus-show",
				".focused:focus-within .focus-show",
				".focus-show:focus",
				".focus-show:focus-within",
				".focus-show:hover",
			].map((_) => `body:not(.nofocus) ${_}`),
			{
				visibility: "visible",
			},
		),
	),
	whenhover: group(
		rule(".hovered .when-hover", { display: "none" }),
		rule("body:not(.nohover) .hovered:hover .when-hover", {
			display: "unset",
		}),
		rule("body:not(.nohover) .hovered:hover .when-not-hover", {
			display: "none",
		}),
	),
	shift: group(
		rule(".hover-dx", {
			transition: `transform ${vars.motion.duration.fast} ${vars.motion.easing.standard}`,
		}),
		rule(
			[
				"body:not(.no-hover) .hover-dx:hover",
				"body:not(.no-hover) .hovered:hover .hover-dx",
			],
			{
				transform: `translateX(${vars.motion.shift.hover_dx})`,
			},
		),
	),
	summary: group(
		rule("details .open-show, details .when-open", { display: "none" }),
		rule("details:open .open-show, details:open .when-open", {
			display: "inherit",
		}),
		rule(".open-rotate", {
			transform: "rotate(0deg)",
			transform_origin: "center",
			transition: `transform ${vars.motion.duration.fast} ${vars.motion.easing.standard}`,
		}),
		rule("details:open .open-rotate", { transform: "rotate(90deg)" }),
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
});
// EOF
