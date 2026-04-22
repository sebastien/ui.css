import { vars, named, group, rule } from "../js/uicss.js";

	export default named({
	undim: group(
		rule(".hover-undim", {
			transition: `opacity ${vars.theme.motion.duration.normal} ${vars.theme.motion.easing.emphasized}`,
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
				transition: `opacity ${vars.theme.motion.duration.normal} ${vars.theme.motion.easing.emphasized}`,
			},
		),
	),
	summary: group(
		rule("details .open-show", { display: "none" }),
		rule("details:open .open-show", { display: "unset" }),
	),
	show: group(
		rule(".hovered .hover-show", { opacity: "0.0" }),
		rule(
			[
				".hovered:focus .hover-show",
				".hovered:focus-within .hover-show",
				".hovered:hover .hover-show",
				".hover-show:hover",
				".hover-show:focus",
				".hover-show:focus-within",
			].map((_) => `body:not(.no-hover) ${_}`),
			{
				opacity: "1.0",
				transition: `opacity ${vars.theme.motion.duration.normal} ${vars.theme.motion.easing.emphasized}`,
			},
		),
		rule(".hover .hover-visible", { opacity: "hidden" }),
		rule(
			[
				".hovered:focus .hover-show",
				".hovered:focus-within .hover-show",
				".hovered:hover .hover-show",
				".hover-show:hover",
				".hover-show:focus",
				".hover-show:focus-within",
			].map((_) => `body:not(.no-hover) ${_}`),
			{
				visibility: "visible",
			},
		),
		rule(".hovered .when-hovered", { display: "none" }),
		rule("body:not(.no-hover) .hovered:hover .when-hovered", {
			display: "unset",
		}),
		rule("body:not(.no-hover) .hovered:hover .when-not-hovered", {
			display: "none",
		}),
	),
	shift: group(
		rule(".hover-dx", {
			transition: `transform ${vars.theme.motion.duration.fast} ${vars.theme.motion.easing.standard}`,
		}),
		rule(
			[
				"body:not(.no-hover) .hover-dx:hover",
				"body:not(.no-hover) .hovered:hover .hover-dx",
			],
			{
				transform: `translateX(${vars.theme.motion.shift.hover_dx})`,
			},
		),
	),
});
// EOF
