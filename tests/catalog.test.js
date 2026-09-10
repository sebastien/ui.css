import { describe, expect, test } from "bun:test";
import all from "../src/css/all.js";
import catalog from "../src/js/catalog.js";

const output = catalog(all());

describe("catalog", () => {
	test("clusters generated numeric and color utilities", () => {
		expect(output.ops).toContainEqual({ template: ".p-${range}", vocab: "range" });
		expect(output.ops).toContainEqual({ template: ".bg-${color}", vocab: "color" });
		expect(output.vocabs.range).toEqual(expect.arrayContaining([0, 8]));
		expect(output.vocabs.color).toEqual(expect.arrayContaining(["primary", "secondary"]));
	});

	test("records component-only variants with normalized hosts", () => {
		expect(output.ops.find(({ template }) => template === ".compact")).toEqual({
			template: ".compact",
			on: expect.arrayContaining(["button", "pill"]),
		});
		expect(output.ops.find(({ template }) => template === ".compact").on).not.toContain("focus");
	});
});
