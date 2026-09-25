import { describe, expect, test } from "bun:test";
import all from "../src/css/all.js";
import css from "../src/js/uicss.js";

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

describe("dark / light mode", () => {
	test("mode rules re-derive the paint channels in :where rules", () => {
		expect(output).toContain(":where(:root.light, :root .light)");
		expect(output).toContain(":where(:root.dark, :root .dark)");
	});

	test("dark mode swaps the tint toward ink", () => {
		expect(output).toContain("--color-tint: var(--color-ink)");
	});

	test("mode rules publish color-scheme", () => {
		expect(output).toContain("color-scheme: light;");
		expect(output).toContain("color-scheme: dark;");
	});

	test("mode rules pair the neutral chrome, link, and neutral surface", () => {
		expect(output).toContain("--color-neutral: var(--color-neutral-light);");
		expect(output).toContain("--color-neutral: var(--color-neutral-dark);");
		expect(output).toContain("--color-link: var(--color-link-light);");
		expect(output).toContain("--color-link: var(--color-link-dark);");
		expect(output).toContain(
			"--background-color-neutral: var(--background-color-neutral-dark);",
		);
	});

	test("dark semantic pairs are solved recipes over the palette source", () => {
		expect(output).toContain(
			"--color-neutral-dark: color-mix(in oklch, var(--color-gray), var(--color-ink) 54.7%);",
		);
		expect(output).toContain(
			"--color-link-dark: color-mix(in oklch, var(--color-blue), var(--color-paper) 42.2%);",
		);
		expect(output).toContain(
			"--color-primary-dark: color-mix(in oklch, var(--color-blue), var(--color-paper) 25.2%);",
		);
		expect(output).toContain("--color-primary: var(--color-primary-dark);");
		expect(output).toContain("--color-accent: var(--color-accent-dark);");
	});

	test("baseline channel opacities are solver values, not magic constants", () => {
		expect(output).toContain("--border-color-opacity: 0.35;");
		expect(output).toContain("--control-border-opacity: 0.749;");
		expect(output).toContain("--outline-color-opacity: 0.79;");
		expect(output).toContain("--control-outline-opacity: 0.484;");
	});

	test("tab and pagination recipes use the mode text role", () => {
		// Tabs and pagination labels follow the surface beneath; only explicit
		// .ink variants may pin the pole.
		expect(output).not.toMatch(/\.tabs \.tab \{[^}]*color: var\(--color-ink\)/);
		expect(output).not.toMatch(
			/\.pagination > \* > :is\(a, \.button\) \{[^}]*color: var\(--color-ink\)/,
		);
	});

	test("card and panel surfaces follow the mode", () => {
		// No root --card-color-tint alias: it would freeze to paper at :root.
		// The recipes carry the per-element fallback instead.
		expect(output).not.toContain("--card-color-tint:");
		expect(output).toContain(
			"--background-color-tint: var(--card-color-tint, var(--color-surface));",
		);
	});

	test("skeleton shimmer blends toward the surface, not the light pole", () => {
		expect(output).toContain(
			"color-mix(in oklch, var(--color-neutral), var(--color-surface) 92%)",
		);
	});

	test("pill outline keeps accent hue instead of mixing toward the poles", () => {
		// oklch mixes toward the ink/paper poles interpolate hue by shortest
		// arc (~260), swinging amber→pink and red→magenta. The border fades
		// with alpha; the text mixes toward the text pole in srgb.
		expect(output).toContain(
			"border-color: color-mix(in oklch, var(--accent), transparent 60%);",
		);
		expect(output).toContain(
			"color: color-mix(in srgb, var(--accent), var(--color-surface-text) 60%);",
		);
	});

	test("solid pills pick a contrast pole and tinted pills tint their text", () => {
		// Solid fills (neutral, green, amber, blue, …) need a readable label:
		// a fixed paper label was ~1.4:1 on the neutral fill.
		expect(output).toContain(
			"color: var(--pill-text, contrast-color(var(--background-color)));",
		);
		// Tinted text keeps the accent hue but mixes toward the text pole.
		expect(output).toContain(
			"color: var(--pill-text, color-mix(in srgb, var(--accent), var(--color-surface-text) 60%));",
		);
	});

	test("semantic message text mixes toward the text pole", () => {
		// Alerts, danger menu labels, and form errors keep their hue but clear
		// AA on the pale tint (raw red/green/amber was 2–3.9:1).
		expect(output).toContain(
			"color: color-mix(in srgb, var(--color-success), var(--color-surface-text) 60%);",
		);
		expect(output).toContain(
			"color: color-mix(in srgb, var(--color-danger), var(--color-surface-text) 60%);",
		);
		expect(output).toContain(
			"color: color-mix(in srgb, var(--color-error), var(--color-surface-text) 60%);",
		);
	});

	test("semantic card borders fade the accent, not mix toward the surface", () => {
		expect(output).toContain("--border-color-blend: 1;");
		expect(output).toContain("--border-color-opacity: 0.65;");
	});

	test("outline and ghost variants use the mode text role, not raw ink", () => {
		expect(output).toContain(
			"--control-color-base: var(--color-surface-text);",
		);
	});
});
