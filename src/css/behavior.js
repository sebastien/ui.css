import { named, group, rule } from "../js/littlecss.js";

export default named({
	undim: group(
		rule([".hover:hover .hover-undim", ".hover-undim:hover"], {
			opacity: "1.0",
		})
	),
	show: group(
		rule(".hover .hover-show", { visibility: "hidden" }),
		rule([".hover:hover .hover-show", ".hover-show:hover"], {
			visibility: "visible",
		}),
		rule(".hover .when-hovered", { display: "none" }),
		rule(".hover:hover .when-hovered", { display: "unset" }),
		rule(".hover:hover .when-not-hovered", { display: "none" })
	),
});
// EOF
