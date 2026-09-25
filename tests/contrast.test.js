import { describe, expect, test } from "bun:test";
import contrast, { metrics } from "../src/js/contrast.js";
import { BLUE, GRAY, INK, PAPER } from "./support/colors.js";

const s = contrast();
const close = (a, b, eps = 0.01) => Math.abs(a - b) <= eps;

describe("contrast metric", () => {
	test("the canonical AA-threshold gray scores ~4.5 against both poles", () => {
		// #767676 is the documented WCAG AA-threshold gray: equal contrast
		// against white and black.
		expect(s.ratio("#767676", "#ffffff")).toBeGreaterThan(4.5);
		expect(s.ratio("#767676", "#ffffff")).toBeLessThan(4.6);
		expect(s.ratio("#767676", "#000000")).toBeGreaterThan(4.55);
		expect(s.ratio("#767676", "#000000")).toBeLessThan(4.7);
	});

	test("identical colors score 1", () => {
		expect(s.ratio(INK, INK)).toBe(1);
	});

	test("metric registry exposes wcag as default", () => {
		expect(metrics.wcag).toBeTypeOf("function");
		expect(contrast().metric).toBe("wcag");
	});
});

describe("compositing and mixing", () => {
	test("alpha compositing collapses to the endpoints", () => {
		expect(s.composite(INK, 1, PAPER)).toBe(INK);
		expect(s.composite(INK, 0, PAPER)).toBe(PAPER);
	});

	test("oklch mixing collapses to the endpoints", () => {
		expect(s.mix(INK, PAPER, 0)).toBe(INK);
		expect(s.mix(INK, PAPER, 1)).toBe(PAPER);
	});

	test("near-neutral endpoints are powerless for hue, matching CSS", () => {
		// Chromium renders color-mix(in oklch, #0c31bf, #f8fafc 41.7%) as
		// oklch(0.649679 0.130032 264.811) ≈ #678cde: paper's near-zero chroma
		// contributes no hue, so the result keeps blue's hue. A naive polar
		// blend would drag the hue toward paper and overestimate saturation.
		expect(s.mix(BLUE, PAPER, 0.417)).toBe("#678cde");
	});
});

describe("mixFor: solved alpha over a surface", () => {
	test("solves monotonically and meets the target", () => {
		const low = s.mixFor(INK, PAPER, 2.0);
		const high = s.mixFor(INK, PAPER, 4.5);
		expect(low).toBeGreaterThan(0);
		expect(low).toBeLessThan(high);
		expect(high).toBeLessThanOrEqual(1);
		expect(s.ratio(s.composite(INK, low, PAPER), PAPER)).toBeGreaterThanOrEqual(
			2.0,
		);
		expect(
			s.ratio(s.composite(INK, high, PAPER), PAPER),
		).toBeGreaterThanOrEqual(4.5);
	});

	test("parity: reproduces the legacy border opacities", () => {
		// Legacy constants measured against paper: structural border 0.35
		// (2.06:1), control border 0.75 (6.34:1).
		expect(close(s.mixFor(INK, PAPER, 2.06), 0.35)).toBe(true);
		expect(close(s.mixFor(INK, PAPER, 6.34), 0.75)).toBe(true);
	});

	test("returns null when the target is unreachable", () => {
		// Pure ink over paper is ~12:1; a target beyond that cannot be met.
		expect(s.mixFor(INK, PAPER, 100)).toBe(null);
	});
});

describe("liftFor / recedeFor: solved oklch weights", () => {
	test("lifts a dark accent toward paper until the dark-mode floor", () => {
		const w = s.liftFor(BLUE, INK, 3.0, PAPER);
		const lifted = s.mix(BLUE, PAPER, w);
		expect(w).toBeGreaterThan(0);
		expect(s.ratio(lifted, INK)).toBeGreaterThanOrEqual(3.0);
		// Solved dark primary ≈ #346ed2 (measured 24.9% toward paper).
		expect(close(w, 0.249, 0.005)).toBe(true);
	});

	test("recedes bright chrome toward the dark page to the same floor", () => {
		const w = s.recedeFor(GRAY, INK, 3.0, INK);
		const receded = s.mix(GRAY, INK, w);
		expect(w).toBeGreaterThan(0);
		expect(w).toBeLessThan(1);
		expect(s.ratio(receded, INK)).toBeGreaterThanOrEqual(3.0);
		// The paired dark neutral lands within tolerance of the hand-picked
		// #64748b (3.074 vs ink).
		expect(close(s.ratio(receded, INK), 3.074, 0.1)).toBe(true);
	});

	test("link target 4.5 solves to a mid blue, meeting AA against ink", () => {
		const w = s.liftFor(BLUE, INK, 4.5, PAPER);
		const link = s.mix(BLUE, PAPER, w);
		expect(s.ratio(link, INK)).toBeGreaterThanOrEqual(4.5);
		// Light-mode link (blue vs paper ≈ 9:1) needs no lift.
		expect(s.ratio(BLUE, PAPER)).toBeGreaterThanOrEqual(4.5);
	});
});
