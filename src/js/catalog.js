import { COLORS, SEMANTIC } from "../css/colors.js";

const split = (value) => {
	const result = [];
	let depth = 0;
	let start = 0;
	for (let i = 0; i < value.length; i++) {
		if (value[i] === "(") depth++;
		else if (value[i] === ")") depth--;
		else if (value[i] === "," && depth === 0) {
			result.push(value.slice(start, i).trim());
			start = i + 1;
		}
	}
	result.push(value.slice(start).trim());
	return result.filter(Boolean);
};

const compose = (parents, selector) => {
	const children = split(selector);
	if (!parents.length) return children;
	return parents.flatMap((parent) =>
		children.map((child) => (child.includes("&") ? child.replaceAll("&", parent) : `${parent} ${child}`)),
	);
};

function walk(value, parents, visit) {
	if (!value) return;
	if (Array.isArray(value)) {
		for (const item of value) walk(item, parents, visit);
		return;
	}
	if (value.selectors && value.properties) {
		const selectors = compose(parents, value.selectors.join(","));
		for (const selector of selectors) visit(selector);
		for (const child of value.children || []) walk(child, selectors, visit);
		return;
	}
	if (value.contents) {
		for (const item of value.contents) walk(item, parents, visit);
	}
}

const classes = (selector) => [...selector.matchAll(/\.([a-zA-Z_][\w-]*)/g)].map((match) => match[1]);

const placeholder = (name) => `\${${name}}`;

const subjectOf = (selector) => {
	let depth = 0;
	let start = 0;
	for (let i = 0; i < selector.length; i++) {
		if (selector[i] === "(") depth++;
		else if (selector[i] === ")") depth--;
		else if (depth === 0 && (/[\s>+~]/.test(selector[i]))) start = i + 1;
	}
	return selector.slice(start).trim();
};

function hostOf(selector) {
	const subject = subjectOf(selector);
	const excluded = [...subject.matchAll(/:(?:not|is|has)\(([^)]*)\)/g)].flatMap((match) => classes(match[1]));
	const subjectClasses = classes(subject).filter((name) => !excluded.includes(name));
	const tag = subject.match(/^[a-z][a-z0-9-]*/i)?.[0];
	if (!tag && !subject.startsWith(".")) return;
	const host = tag || subjectClasses[0];
	if (!host) return;
	if (host === "button" || /input\[type=(submit|button|reset)/.test(subject)) return "button";
	if (/input\[type=checkbox/.test(subject)) return "checkbox";
	if (/input\[type=radio/.test(subject)) return "radio";
	if (/input\[type=range/.test(subject)) return "range";
	if (/role=switch/.test(subject) || host === "toggle") return "toggle";
	return host.replace(/^\./, "");
}

const colorValues = new Set([...SEMANTIC, ...COLORS]);
const numericFamilies = {
	p: "range", m: "range", pt: "range", pb: "range", pl: "range", pr: "range", pw: "range", ph: "range",
	g: "gap", col: "columns", span: "columns", w: "range", h: "range", sh: "shadow",
};

function templateFor(name) {
	for (const prefix of ["bg", "tx", "bd", "ol", "to"]) {
		if (name.startsWith(`${prefix}-`) && colorValues.has(name.slice(prefix.length + 1))) {
			return { key: "color", template: `.${prefix}-${placeholder("color")}`, value: name.slice(prefix.length + 1) };
		}
	}
	const match = name.match(/^(.+?)-(\d+)([a-z]+)?$/);
	if (!match) return;
	const [, prefix, number, suffix = ""] = match;
	const key = suffix === "o" ? "opacity" : suffix === "b" ? "blend" : numericFamilies[prefix];
	if (!key) return;
	return { key, template: `.${prefix}-${placeholder(key)}${suffix}`, value: Number(number) };
}

export function catalog(value) {
	const global = new Set();
	const bound = new Map();
	const hosts = new Map();
	walk(value, [], (selector) => {
		const names = classes(selector);
		if (selector.match(/^\.[a-zA-Z_][\w-]*$/)) global.add(names[0]);
		if (names.length < 2) return;
		const host = hostOf(selector);
		if (!host) return;
		const subject = subjectOf(selector);
		const excluded = [...subject.matchAll(/:(?:not|is|has)\(([^)]*)\)/g)].flatMap((match) => classes(match[1]));
		const subjectClasses = classes(subject).filter((name) => !excluded.includes(name));
		const modifiers = subjectClasses.slice(subject.match(/^\./) ? 1 : 0);
		if (!modifiers.length) return;
		for (const modifier of modifiers) {
			if (!bound.has(modifier)) bound.set(modifier, new Set());
			bound.get(modifier).add(host);
			if (!hosts.has(host)) hosts.set(host, new Set());
			hosts.get(host).add(subject);
		}
	});

	const vocabs = { color: [...colorValues] };
	const ops = [];
	const grouped = new Map();
	for (const name of global) {
		const item = templateFor(name);
		if (item) {
			const group = `${item.template}|${item.key}`;
			if (!grouped.has(group)) grouped.set(group, { ...item, values: new Set() });
			grouped.get(group).values.add(item.value);
		} else {
			ops.push({ template: `.${name}` });
		}
	}
	const vocabNames = new Map();
	const spacing = [0, 1, 2, 3, 4, 5, 6, 7, 8];
	vocabNames.set(`range:${JSON.stringify(spacing)}`, "range");
	vocabNames.set(`color:${JSON.stringify([...colorValues].sort())}`, "color");
	vocabs.range = spacing;
	for (const item of grouped.values()) {
		const values = [...item.values].sort((a, b) => (a > b ? 1 : -1));
		const signature = `${item.key}:${JSON.stringify(values)}`;
		if (!vocabNames.has(signature)) {
			let name = item.key === "range" && JSON.stringify(values) === JSON.stringify([0, 1, 2, 3, 4, 5, 6, 7, 8])
				? "range"
				: item.key;
			let index = 2;
			while (vocabs[name]) name = `${item.key}${index++}`;
			vocabNames.set(signature, name);
			vocabs[name] = values;
		}
		ops.push({ template: item.template, vocab: vocabNames.get(signature) });
	}
	for (const [name, values] of bound) {
		const known = SEMANTIC.includes(name)
			? { template: `.${placeholder("semantic")}`, vocab: "semantic" }
			: { template: `.${name}` };
		if (known.vocab) vocabs.semantic = [...SEMANTIC];
		ops.push({ ...known, on: [...values].sort() });
	}
	return {
		vocabs,
		hosts: Object.fromEntries([...hosts].map(([name, selectors]) => [name, [...selectors].sort()])),
		ops,
	};
}

export default catalog;
