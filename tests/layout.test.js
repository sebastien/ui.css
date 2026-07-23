import { describe, expect, test } from "bun:test";
import css from "../src/js/uicss.js";
import all from "../src/css/all.js";

const output = [...css(all())].join("\n");

describe("lined layout utilities", () => {
	test("uses side-specific border utilities", () => {
		expect(output).toContain(".bdc, .lined {");
		expect(output).toContain("--border-color: color-mix(in oklch");
		expect(output).toContain(".row.lined > * {");
		expect(output).toContain("border-right-width: var(--border-width, 1px);");
		expect(output).toContain("border-right-style: var(--border-style, solid);");
		expect(output).toContain("border-bottom-width: var(--border-width, 1px);");
		expect(output).toContain("border-bottom-style: var(--border-style, solid);");
		expect(output).toContain(".row.lined > *:last-child {");
		expect(output).toContain("border-right-width: 0px;");
	});
});
