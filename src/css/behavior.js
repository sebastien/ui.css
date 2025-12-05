import { vars, named, group, rule } from "../js/littlecss.js";

export default named({
	undim: group(
		rule(".hover-undim", {
			transition: "opacity 0.2s ease-in-out",
		}),
		rule(
			[
				".hovered:focus .hover-undim",
				".hovered:focus-within .hover-undim",
				".hovered:hover .hover-undim",
				".hover-undim:hover",
				".hover-undim:focus",
				".hover-undim:focus-within",
			],
			{
				opacity: "1.0",
				transition: "opacity 0.2s ease-in-out",
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
			],
			{
				opacity: "1.0",
				transition: "opacity 0.2s ease-in-out",
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
			],
			{
				visibility: "visible",
			},
		),
		rule(".hovered .when-hovered", { display: "none" }),
		rule(".hovered:hover .when-hovered", { display: "unset" }),
		rule(".hovered:hover .when-not-hovered", { display: "none" }),
	),
	shift: group(
		rule(".hover-dx", { transition: "transform 0.1s" }),
		rule([".hover-dx:hover", ".hovered:hover .hover-dx"], {
			transform: "translateX(20%)",
		}),
	),
});
// EOF
