// ----------------------------------------------------------------------------
//
// UTILITIES
//
// ----------------------------------------------------------------------------

// Function: kebab
// Normalizes a name to kebab-case for CSS keys and variables.
const kebab = (str) =>
	str === undefined || str === null
		? ""
		: str
				// Look for any lowercase letter followed by an uppercase letter
				.replaceAll("_", "-")
				.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
				// Convert the entire string to lowercase
				.toLowerCase();

// Function: times
// Builds an array by calling a mapper function n times.
const times = (n, f) => {
	const r = new Array(n);
	for (let i = 0; i < n; i++) {
		r[i] = f(i);
	}
	return r;
};

// Function: percent
// Formats a decimal number as a rounded percentage string.
const percent = (v) => `${Math.round(v * 10000) / 100}%`;

// Function: properties
// Flattens nested property objects into `[key, value]` CSS pairs.
function* properties(value, k) {
	if (value === null || value === undefined) {
		return;
	}
	if (Object.getPrototypeOf(value) === Object.prototype) {
		for (const kk in value) {
			for (const v of properties(
				value[kk],
				k ? `${kebab(k)}-${kebab(kk)}` : kebab(kk),
			)) {
				yield v;
			}
		}
	} else {
		yield k ? [k, value] : [null, value];
	}
}

// Function: classes
// Prefixes each class name with a `.` selector marker.
const classes = (...values) => values.map((_) => `.${_}`);

// Function: cross
// Builds the cartesian product of selector fragments.
const cross = (...sets) =>
	sets.reduce((r, v) =>
		r
			? (Array.isArray(r) ? r : [r]).flatMap((_) =>
					(Array.isArray(v) ? v : [v]).map((w) => `${_}${w}`),
				)
			: Array.isArray(v)
				? v
				: [v],
	);

// ----------------------------------------------------------------------------
//
// SHORTHAND PARSER
//
// ----------------------------------------------------------------------------

class Parser {
	measureIndent(line) {
		const m = line.match(/^(\s*)/);
		const leading = m ? m[1] : "";
		return leading.includes("\t")
			? leading.split("\t").length - 1
			: leading.length;
	}

	detectIndent(lines) {
		let baseIndent = 0;
		let indentUnit = 0;
		for (const raw of lines) {
			const stripped = raw.replace(/#.*$/, "").trimEnd();
			if (stripped.trim() === "") continue;
			baseIndent = this.measureIndent(stripped);
			break;
		}
		for (const raw of lines) {
			const stripped = raw.replace(/#.*$/, "").trimEnd();
			if (stripped.trim() === "") continue;
			const len = this.measureIndent(stripped);
			if (len > baseIndent) {
				indentUnit = len - baseIndent;
				break;
			}
		}
		return { baseIndent, indentUnit: indentUnit || 1 };
	}

	parseColor(str) {
		const s = str.trim();
		if (s === "0") return { base: null, tint: null, blend: null, opacity: "0" };
		if (s === ".") return { base: null, tint: null, blend: null, opacity: null };
		if (s === "contrast")
			return { base: "contrast", tint: null, blend: null, opacity: null };
		if (s === "inherit")
			return { base: "inherit", tint: null, blend: null, opacity: null };

		const parts = s.split(/\s+/);
		const [rawBase, rawTint] = (parts[0] || "./.").split("/");

		if (rawBase === "contrast" || rawBase === "inherit") {
			const inh = (v) => (v === undefined || v === "." ? null : v);
			return { base: rawBase, tint: null, blend: null, opacity: inh(rawTint) };
		}

		const [rawBlend, rawOpacity] = (parts[1] || "./.").split("/");
		const inh = (v) => (v === undefined || v === "." ? null : v);
		return {
			base: inh(rawBase),
			tint: inh(rawTint),
			blend: inh(rawBlend),
			opacity: inh(rawOpacity),
		};
	}

	parseBorder(str) {
		const s = str.trim();
		if (s === "0") {
			return {
				width: "0px",
				radius: null,
				base: null,
				tint: null,
				blend: null,
				opacity: "0",
			};
		}
		if (s === ".") {
			return {
				width: null,
				radius: null,
				base: null,
				tint: null,
				blend: null,
				opacity: null,
			};
		}

		const parts = s.split(/\s+/);

		if (parts[0]?.includes("~")) {
			const [w, r] = parts[0].split("~");
			const inh = (v) => (v === "." || v === "_" ? null : v);
			const color = this.parseColor(parts.slice(1).join(" ") || "./. ./.");
			return { width: inh(w), radius: inh(r), ...color };
		}

		const isDim = (v) =>
			/^[0-9.]/.test(v) ||
			v === "." ||
			/^(0|[0-9]+(%|px|em|rem|vw|vh))$/.test(v);
		if (parts.length >= 2 && isDim(parts[0]) && isDim(parts[1])) {
			const inh = (v) => (v === "." ? null : v);
			const color = this.parseColor(parts.slice(2).join(" ") || "./. ./.");
			return { width: inh(parts[0]), radius: inh(parts[1]), ...color };
		}

		const color = this.parseColor(s);
		return { width: null, radius: null, ...color };
	}

	parseProperty(key, value) {
		return key === "bd" || key === "ol"
			? this.parseBorder(value)
			: this.parseColor(value);
	}

	parseTree(text) {
		const lines = text.split("\n");
		const result = {};
		let control = null;
		let currentVariant = null;
		let currentState = null;
		let currentSubElement = null;
		let definition = null;
		const { baseIndent, indentUnit } = this.detectIndent(lines);

		for (const raw of lines) {
			const stripped = raw.replace(/#.*$/, "").trimEnd();
			if (stripped.trim() === "") continue;
			const depth = Math.round(
				(this.measureIndent(stripped) - baseIndent) / indentUnit,
			);
			const content = stripped.trim();
			if (!content) continue;
			const colonIdx = content.indexOf(":");
			if (colonIdx < 0) continue;
			const key = content.substring(0, colonIdx).trim();
			const value = content.substring(colonIdx + 1).trim();

			if (depth === 0) {
				control = key;
				definition = {};
				currentVariant = null;
				currentState = null;
				currentSubElement = null;
				result[control] = { control, definition };
			} else if (depth === 1 && definition) {
				currentVariant = key;
				if (!definition[currentVariant]) definition[currentVariant] = {};
				currentState = null;
				currentSubElement = null;
			} else if (
				depth === 2 &&
				key.startsWith("!") &&
				definition &&
				currentVariant
			) {
				currentState = key.substring(1);
				if (!definition[currentVariant][currentState]) {
					definition[currentVariant][currentState] = {};
				}
				currentSubElement = null;
			} else if (depth === 3 && definition && currentVariant && currentState) {
				if (value === "" || value === undefined) {
					currentSubElement = key;
				} else if (currentSubElement) {
					definition[currentVariant][currentState][`${currentSubElement}.${key}`] =
						value;
				} else {
					definition[currentVariant][currentState][key] = value;
				}
			} else if (
				depth === 4 &&
				definition &&
				currentVariant &&
				currentState &&
				currentSubElement &&
				value
			) {
				definition[currentVariant][currentState][`${currentSubElement}.${key}`] =
					value;
			}
		}

		const keys = Object.keys(result);
		if (keys.length === 1) {
			result.control = result[keys[0]].control;
			result.definition = result[keys[0]].definition;
		}
		return result;
	}

	style(strings, ...values) {
		const text = Array.isArray(strings)
			? strings.reduce((r, s, i) => r + s + (values[i] ?? ""), "")
			: strings;
		return this.parseTree(text);
	}
}

// ----------------------------------------------------------------------------
//
// COLOR UTILITIES
//
// ----------------------------------------------------------------------------

// Function: blend
// Mixes two colors in oklab space with optional transparency.
const blend = (color, other, percentage = 0.5, opacity = undefined) => {
	const r = `color-mix(in oklab, ${color}, ${other} ${percent(percentage)})`;
	return opacity
		? `color-mix(in oklab,${r}, transparent ${percent(1 - opacity)})`
		: r;
};

// Function: contrast
// Returns a CSS contrast-color expression for a background color.
const contrast = (color) => {
	// CSS contrast-color() selects white or black automatically based on background luminance
	return `contrast-color(${color})`;
};

// Function: dim
// Applies transparency to a color using color-mix.
const dim = (color, percentage = 0.5) => {
	return `color-mix(in oklab, ${color}, transparent ${percent(1 - percentage)})`;
};

// Function: blended
// Builds one or more CSS variables from a blended color recipe.
const blended = (name, color, other, percentage = 0.5, opacity = undefined) => {
	const base = blend(color, other, percentage);
	name = name.replaceAll("_", "-");
	const temp = `${name.startsWith("--") ? "" : "--"}${name}-base`;
	return opacity
		? {
				[temp]: base,
				[name]: `rgba(${base}, ${percent(opacity)}`,
			}
		: {
				[name]: base,
			};
};

// ----------------------------------------------------------------------------
//
// CONSTANTS
//
// ----------------------------------------------------------------------------

// Constant: sizes
// Ordered size scale labels used by spacing and sizing utilities.
const sizes = [
	"no", // 0
	"xxs", // 1
	"xs", // 2
	"s", // 3
	"m", // 4
	"l", // 5
	"xl", // 6
	"xxl", // 7
	"xxxl", // 8
	"xxxxl", // 9
	"xxxxxl", // 10
];

// Constant: sizenames
// Named aliases that map semantic size names to scale indexes.
const sizenames = {
	smallest: 0, //"xxs",
	smaller: 1, //"xs",
	small: 2, //"s",
	medium: 3, //"m",
	large: 4, //"l",
	larger: 5, // "xl",
	largest: 6, //"xxl",
};

// Constant: sides
// Short side aliases expanded to full CSS side names.
const sides = { l: "left", t: "top", r: "right", b: "bottom" };

// Constant: percentages
// Common percentage steps used by utility builders.
const percentages = [5, 10, 15, 20, 25, 33, 50, 66, 75, 80, 90, 100];

// ----------------------------------------------------------------------------
//
// META
//
// ----------------------------------------------------------------------------

// Class: Meta
// Base wrapper for values that carry non-rule metadata.
class Meta {
	constructor(value) {
		this.value = value;
	}
}

// ----------------------------------------------------------------------------
//
// DOCUMENTATION
//
// ----------------------------------------------------------------------------

// Class: Documentation
// Metadata node used to attach documentation payloads.
class Documentation extends Meta {}

// Function: doc
// Creates a documentation metadata wrapper.
const doc = (value) => new Documentation(value);

// ----------------------------------------------------------------------------
//
// URL
//
// ----------------------------------------------------------------------------

// Class: ImportURL
// Represents a CSS `@import url(...)` directive.
class ImportURL {
	constructor(url) {
		this.url = url;
	}
	*lines() {
		yield `@import url('${this.url}');`;
	}
}

// Function: url
// Creates an `ImportURL` value for stylesheet imports.
const url = (value) => new ImportURL(value);

// ----------------------------------------------------------------------------
//
// SCOPE
//
// ----------------------------------------------------------------------------

// --
// Scope defines variables, and allows to keep track of them.
// Class: Scope
// Tracks nested CSS variable scopes and lazily creates child scopes.
class Scope {
	// NOTE: It is a bit awkward
	static get(target, property) {
		if (
			typeof property === "string" &&
			property !== "_name" &&
			property !== "walk"
		) {
			if (target[property] === undefined) {
				target[property] = scope(property, target);
			}
			return target[property];
		}
		return target[property];
	}
	static set(target, property, value) {
		// TODO: We should have the vars in a map instead
		target[property] = value;
	}
	constructor(name, parent) {
		this._name = parent?._name ? `${parent._name}-${kebab(name)}` : kebab(name);
		// TODO: This should define properties
	}
	*walk() {
		for (const k in this) {
			if (typeof k === "string" && k !== "_name") {
				if (this[k] instanceof Scope) {
					for (const _ of this[k].walk()) {
						yield _;
					}
				} else {
					yield this._name;
				}
			}
		}
	}
	toString() {
		return `var(--${this._name})`;
	}
}

// Function: scope
// Wraps a scope instance in a proxy that autovivifies nested paths.
const scope = (name, parent) =>
	new Proxy(name instanceof Scope ? name : new Scope(name, parent), Scope);

// Constant: Vars
// Root scope object used as the source of CSS variable trees.
const Vars = new Scope();

// Constant: vars
// Proxied root scope for ergonomic variable access.
const vars = scope(Vars);

// ----------------------------------------------------------------------------
//
// SELECTORS
//
// ----------------------------------------------------------------------------

// Function: pseudo
// Appends a pseudo-selector to each selector in a flat list.
const pseudo = (type, ...selectors) => {
	let res = [];
	for (const s of selectors) {
		if (Array.isArray(s)) {
			res = res.concat(pseudo(type, ...s));
		} else {
			res.push(`${s}:${type}`);
		}
	}
	return res;
};

// Constant: on
// Dynamic pseudo-selector helpers (for example `on.hover(".btn")`).
const on = new Proxy(
	{},
	{
		get: (target, property) => {
			if (typeof property === "string") {
				if (target[property] === undefined) {
					target[property] = (...sel) => pseudo(property, ...sel);
				}
				return target[property];
			}
			return target[property];
		},
	},
);

// Function: mods
// Expands class modifiers into complete selector combinations.
const mods = (classes, ...modifiers) =>
	modifiers
		.flatMap((_) => {
			switch (_) {
				case "disabled":
					return ["[disabled]", ".disabled"];
				case "hover":
				case "active":
					return [`:${_}`, `.${_}`];
				case "focus":
					return [":focus", ":focus-within", ".focus"];
				default:
					return _ ? `.${_}` : "";
			}
		})
		.flatMap((m) => classes.map((c) => `${c}${m}`));

// ----------------------------------------------------------------------------
//
// RULES AND GROUPS
//
// ----------------------------------------------------------------------------

// Class: Rule
// Represents a CSS selector block and its declaration properties.
class Rule {
	constructor(selectors, properties) {
		this.selectors = selectors;
		this.properties = properties;
	}
	*lines(compact) {
		const sel = this.selectors
			? this.selectors.join(compact ? "," : ", ")
			: "*";
		yield compact ? `${sel}{` : `${sel} {`;
		for (const k in this.properties) {
			yield compact
				? `${k}:${this.properties[k]};`
				: `\t${k}: ${this.properties[k]};`;
		}
		yield "}";
	}

	*rules() {
		yield [...this.lines(true)].join("\n");
	}
	*docs(path) {
		for (const name of this.selectors) {
			yield {
				type: "Rule",
				name,
				path,
				definition: Object.keys(this.properties).reduce((r, k) => {
					r[k] = `${this.properties[k]}`;
					return r;
				}, {}),
			};
		}
	}
}

// Function: rule
// Creates a `Rule` from selectors and mixed body inputs.
function rule(selector, ...body) {
	// TODO: We could do basic selector parsing to extract classnames, tagnames
	// and ids.
	const sel = Array.isArray(selector) ? selector : [selector];
	const props = {};
	for (const b of body) {
		if (typeof b === "string") {
			for (let line of b.split("\n")) {
				line = line.trim("");
				if (line.endsWith(";")) {
					line = line.substring(0, line.length - 1);
				}
				const i = line.indexOf(":");
				if (!line.startsWith("//") && i >= 0) {
					props[line.substring(0, i).trim()] = line.substring(i + 1).trim();
				}
			}
		} else {
			for (const [k, v] of properties(b)) {
				props[k] = v;
			}
		}
		return new Rule(sel, props);
	}
}

// Function: blockselectors
// Normalizes a selector value into a flat selector list.
const blockselectors = (selector) =>
	(Array.isArray(selector) ? selector : [selector])
		.flatMap((_) => `${_}`.split(","))
		.map((_) => _.trim())
		.filter(Boolean);

// Function: blockcompose
// Composes parent and child selectors, including `&` replacement.
const blockcompose = (parents, selector) => {
	const children = blockselectors(selector);
	if (!parents || parents.length === 0) {
		return children;
	}
	const res = [];
	for (const parent of parents) {
		for (const child of children) {
			res.push(
				child.includes("&")
					? child.replaceAll("&", parent)
					: `${parent} ${child}`,
			);
		}
	}
	return res;
};

// Function: blockmappings
// Normalizes nested block payloads into selector maps.
function* blockmappings(value) {
	if (value === null || value === undefined) {
		return;
	}
	if (Array.isArray(value)) {
		for (const _ of value) {
			yield* blockmappings(_);
		}
		return;
	}
	if (Object.getPrototypeOf(value) === Object.prototype) {
		yield value;
		return;
	}
	throw new Error(`Unsupported nested block value: ${value}`);
}

// Function: blockbody
// Expands a block body into concrete rules.
const blockbody = (selectors, body, rules) => {
	if (body === null || body === undefined) {
		return;
	}
	if (Array.isArray(body)) {
		for (const _ of body) {
			blockbody(selectors, _, rules);
		}
		return;
	}
	if (Object.getPrototypeOf(body) !== Object.prototype) {
		throw new Error(`Unsupported block body: ${body}`);
	}
	const props = {};
	const nested = [];
	for (const key in body) {
		const value = body[key];
		if (key === "...") {
			for (const mapping of blockmappings(value)) {
				for (const selector in mapping) {
					nested.push([blockcompose(selectors, selector), mapping[selector]]);
				}
			}
		} else if (Object.getPrototypeOf(value) === Object.prototype) {
			nested.push([blockcompose(selectors, key), value]);
		} else {
			props[key] = value;
		}
	}
	if (Object.keys(props).length > 0) {
		const style = {};
		for (const [k, v] of properties(props)) {
			style[k] = v;
		}
		rules.push(new Rule(selectors, style));
	}
	for (const [nestedSelectors, nestedBody] of nested) {
		blockbody(nestedSelectors, nestedBody, rules);
	}
};

// Function: block
// Creates a `Group` from nested selector maps.
const block = (...values) => {
	const rules = [];
	for (const value of values.flat()) {
		for (const mapping of blockmappings(value)) {
			for (const selector in mapping) {
				blockbody(blockcompose(undefined, selector), mapping[selector], rules);
			}
		}
	}
	return new Group(rules);
};

// Class: Group
// Collects rules and nested groups into a traversable unit.
class Group {
	constructor(contents, name = undefined) {
		this.contents = [];
		for (const v of contents) {
			if (Array.isArray(v)) {
				this.contents = this.contents.concat(v);
			} else {
				this.contents.push(v);
			}
		}
		this.name = name;
	}
	*rules() {
		for (const r of this.contents) {
			if (r instanceof Meta) {
				// pass
			} else if (r instanceof Group) {
				for (const _ of r.rules()) {
					yield _;
				}
			} else {
				yield r;
			}
		}
	}

	*docs(path = undefined) {
		path = this.name ? (path ? [...path, this.name] : [this.name]) : null;
		for (const r of this.contents) {
			for (const _ of r.docs(path)) {
				yield _;
			}
		}
	}

	*lines(compact = true) {
		if (!compact && this.name) {
			yield `/* @${this.constructor.name.toLowerCase()} ${this.name} */`;
		}
		for (const r of this.contents) {
			for (const _ of r.lines(compact)) {
				yield _;
			}
		}
		if (!compact && this.name) {
			yield `/* @end ${this.name} */`;
		}
	}
}

// Function: group
// Shorthand for creating a `Group` from rule values.
const group = (...rules) => new Group(rules);

// Class: Layer
// Specialized group that emits its content inside `@layer`.
class Layer extends Group {
	*lines(compact = true) {
		if (this.name) {
			yield `@layer ${this.name} {`;
		}
		for (const line of super.lines(compact)) {
			yield line;
		}
		if (this.name) {
			yield `}`;
		}
	}
}

// Function: layer
// Shorthand for creating a `Layer` from rule values.
const layer = (...rules) => new Layer(rules);

// Function: layers
// Converts an object of named groups into layer instances.
const layers = (layers) => {
	const res = [];
	for (const k in layers) {
		const l = layer(layers[k]);
		l.name = k;
		res.push(l);
	}
	return res;
};

// Function: named
// Converts a key/value map into named groups for organization.
const named = (mapping) => {
	const items = [];
	for (const k in mapping) {
		const v = mapping[k];
		if (v instanceof Group) {
			v.name = k;
			items.push(v);
		} else {
			items.push(new Group(Array.isArray(v) ? v : v ? [v] : [], k));
		}
	}
	return new Group(items);
};

// ----------------------------------------------------------------------------
//
// TOKENS
//
// ----------------------------------------------------------------------------

// Class: Token
// Represents a single design token rendered as a CSS variable.
class Token {
	constructor(name, value) {
		this.name = name;
		this.value = value;
		this.ref = `--${this.name.replaceAll(".", "-").toLowerCase()}`;
	}
	*lines() {
		yield `${this.ref}: ${this.value};`;
	}
	*rules() {}
	*docs(path) {
		yield {
			type: "Token",
			name: this.ref,
			value: `${this.value}`,
			path: path ? [...path, this.name] : ["tokens", ...this.name.split(".")],
		};
	}

	toString() {
		return `var(${this.ref}: ${this.value})`;
	}
}

// Class: Tokens
// Group wrapper that expands objects into token declarations.
class Tokens extends Group {
	static *Expand(collection, prefix = undefined) {
		if (Array.isArray(collection)) {
			for (const v of collection) {
				for (const w of Tokens.Expand(v, prefix)) {
					yield w;
				}
			}
		} else {
			for (const k in collection) {
				const v = collection[k];
				// Strip trailing underscore from key before processing
				const cleanKey = k.endsWith("_") ? k.slice(0, -1) : k;
				const p = prefix
					? `${prefix}.${cleanKey.replaceAll("_", ".")}`
					: cleanKey.replaceAll("_", ".");
				switch (v?.constructor) {
					case Object:
						for (const _ of Tokens.Expand(v, p)) {
							yield _;
						}
						break;
					case Array:
						for (let i = 0; i < v.length; i++) {
							yield new Token(p ? `${p}.${i}` : `${i}`, v[i]);
						}
						break;
					case undefined:
						console.warn(`[uicss] Undefined key '${k}' in`, {
							collection,
						});
						break;
					default:
						yield new Token(p, v);
						break;
				}
			}
		}
	}
	*lines() {
		yield "/* @tokens */";
		yield ":root {";
		for (const token of this.contents) {
			for (const line of token.lines()) {
				yield line;
			}
		}
		yield "}";
	}
	*rules() {
		const lines = [...this.lines()];
		lines.splice(0, 1);
		yield lines.join("\n");
	}
}

// Function: tokens
// Creates a `Tokens` group from one or more token collections.
const tokens = (...values) => {
	return new Tokens([...Tokens.Expand(values)]);
};

// ----------------------------------------------------------------------------
//
// OUTPUT
//
// ----------------------------------------------------------------------------

// Function: css
// Recursively renders values that expose a `lines()` generator.
function* css(...values) {
	// yield `/* Generated by ui.css */`;
	for (const v of values) {
		if (v.constructor === Array) {
			for (const w of v) {
				yield* css(w);
			}
		} else if (v.constructor === Object) {
			yield* css(Object.values(v));
		} else if (v && typeof v.lines === "function") {
			for (const l of v.lines(true)) {
				yield l;
			}
		}
		// Skip primitive values that don't have a lines method
	}
}

// Function: docs
// Recursively emits documentation entries from documentable values.
function* docs(...values) {
	for (const v of values) {
		if (v === null || v === undefined) {
			continue;
		}
		if (v.constructor === Object) {
			yield* docs(...Object.values(v));
		} else if (typeof v.docs === "function") {
			for (const _ of v.docs()) {
				yield _;
			}
		}
	}
}

// --
// Injects the styles directly as stylesheets into the DOM.
// Function: css.mount
// Mounts generated style blocks into `document.head` when available.
css.mount = (...values) => {
	const res = [];
	for (const v of values.flat()) {
		const styles = [];
		if (v instanceof Rule || v instanceof Group) {
			styles.push(v);
		} else if (Object.getPrototypeOf(v) === Object.prototype) {
			for (const k in v) {
				styles.push(v[k]);
			}
		} else {
			throw new Error(`Unsupported type: ${v}`);
		}
		for (const s of styles) {
			// NOTE: Leaving this here for now, that's for wev components
			// const style = new CSSStyleSheet();
			// for (const r of s.rules()) {
			// 	style.insertRule(r, style.cssRules.length);
			// }
			// res.push(style);
			if (globalThis.document) {
				const style = globalThis.document.createElement("style");
				if (s.name) {
					style.setAttribute("id", `uicss-${s.name}`);
				}
				style.textContent = [...s.lines()].join("\n");
				globalThis.document.head.appendChild(style);
			}
		}
	}
	return res;
};

// ----------------------------------------------------------------------------
//
// EXPORTS
//
// ----------------------------------------------------------------------------

export {
	Parser,
	Vars,
	blended,
	blend,
	block,
	contrast,
	dim,
	classes,
	cross,
	css,
	doc,
	docs,
	group,
	layer,
	layers,
	mods,
	named,
	on,
	percent,
	percentages,
	rule,
	sides,
	sizenames,
	sizes,
	times,
	tokens,
	url,
	vars,
};
export default Object.assign(css, {
	css,
	doc,
	rule,
	mods,
	block,
	vars,
	group,
	layer,
});
// EOF
