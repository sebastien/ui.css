import reset from "../src/css/reset.js";
import layout from "../src/css/layout.js";
import { css } from "../src/js/littlecss.js";
console.log("--- CSS");
console.log([...css(reset, layout)].join("\n"));
