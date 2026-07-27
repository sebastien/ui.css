import { describe, expect, test } from "bun:test";
import css, { rule, tokens } from "../src/js/uicss.js";
import all from "../src/css/all.js";

describe("rule", () => {
	test("merges all body arguments into one rule", () => {
		const output = [...css(rule(".probe", { color: "red" }, { background_color: "blue" }))].join("\n");

		expect(output).toContain("color: red;");
		expect(output).toContain("background-color: blue;");
	});
});

describe("Group", () => {
	test("can be spread for css.mount composition", () => {
		expect(() => css.mount(...all(), tokens({}))).not.toThrow();
	});
});

describe("guard", () => {
	test("scopes rules without native nesting", () => {
		const output = [...css(all(undefined, { guard: ".uicss" }))].join("\n");

		expect(output).toContain(".uicss .bg {");
		expect(output).toContain(".uicss .bg-paper {");
		expect(output).toContain(".uicss .sh-2 {");
		expect(output).toContain(".uicss {\n--font-mono:");
		expect(output).not.toContain("& .bg {");
	});
});
