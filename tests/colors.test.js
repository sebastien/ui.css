import { describe, expect, test } from "bun:test";
import css from "../src/js/uicss.js";
import all from "../src/css/all.js";

const output = [...css(all())].join("\n");

describe("color utility override channels", () => {
	test("color utilities publish the control border and outline channels", () => {
		expect(output).toContain("--border-base: var(--color-danger);");
		expect(output).toContain("--outline-base: var(--color-danger);");
	});

	test("blend and opacity modifiers publish border and outline overrides", () => {
		expect(output).toContain("--border-opacity: 0.3;");
		expect(output).toContain("--outline-opacity: 0.3;");
		expect(output).toContain("--border-blend: 0.4;");
		expect(output).toContain("--outline-blend: 0.4;");
	});

	test("to-color utilities publish border and outline tints", () => {
		expect(output).toContain("--border-tint: var(--color-danger);");
		expect(output).toContain("--outline-tint: var(--color-danger);");
	});
});
