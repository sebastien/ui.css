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
		})
	),
});
// EOF
