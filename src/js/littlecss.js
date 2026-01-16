// ----------------------------------------------------------------------------
//
// UTILITIES
//
// ----------------------------------------------------------------------------

const kebab = (str) =>
	str === undefined || str === null
		? ""
		: str
				// Look for any lowercase letter followed by an uppercase letter
				.replaceAll("_", "-")
				.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
				// Convert the entire string to lowercase
				.toLowerCase();

const times = (n, f) => {
	const r = new Array(n);
	for (let i = 0; i < n; i++) {
		r[i] = f(i);
	}
	return r;
};

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

const classes = (...values) => values.map((_) => `.${_}`);

const percent = (v) => `${Math.round(v * 10000) / 100}%`;

const blend = (color, other, percentage = 0.5, opacity = undefined) => {
	const r = `color-mix(in oklab, ${color}, ${other} ${percent(percentage)})`;
	return opacity
		? `color-mix(in oklab,${r}, transparent ${percent(1 - opacity)})`
		: r;
};

const dim = (color, percentage = 0.5) => {
	return `color-mix(in oklab, ${color}, transparent ${percent(1 - percentage)})`;
};

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

const sizes = [
	"xxs", // 0
	"xs", // 1
	"s", // 2
	"m", // 3
	"l", // 4
	"xl", // 5
	"xxl", // 6
	"xxxl", // 7
	"xxxxl", // 8
	"xxxxxl", // 9
];
const sizenames = {
	smallest: 0, //"xxs",
	smaller: 1, //"xs",
	small: 2, //"s",
	medium: 3, //"m",
	large: 4, //"l",
	larger: 5, // "xl",
	largest: 6, //"xxl",
	huge: 7, //"xxxl",
	huger: 8, //"xxxxl",
	hugest: 9, //"xxxxxl",
};
const sides = { l: "left", t: "top", r: "right", b: "bottom" };
// ----------------------------------------------------------------------------
//
// SCOPE
//
// ----------------------------------------------------------------------------

// --
// Scope defines variables, and allows to keep track of them.
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
		this._name = parent?._name
			? `${parent._name}-${kebab(name)}`
			: kebab(name);
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
const scope = (name, parent) =>
	new Proxy(name instanceof Scope ? name : new Scope(name, parent), Scope);
const Vars = new Scope();
const vars = scope(Vars);

// --
// Pseudo-selectors support
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

// ----------------------------------------------------------------------------
//
// RULE
//
// ----------------------------------------------------------------------------

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
					props[line.substring(0, i).trim()] = line
						.substring(i + 1)
						.trim();
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

// ----------------------------------------------------------------------------
//
// GROUP
//
// ----------------------------------------------------------------------------

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
const group = (...rules) => new Group(rules);
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

const layer = (...rules) => new Layer(rules);
const layers = (layers) => {
	const res = [];
	for (const k in layers) {
		const l = layer(layers[k]);
		l.name = k;
		res.push(l);
	}
	return res;
};

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
// GROUP
//
// ----------------------------------------------------------------------------

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
			path: path
				? [...path, this.name]
				: ["tokens", ...this.name.split(".")],
		};
	}

	toString() {
		return `var(${this.ref}: ${this.value})`;
	}
}

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
						console.warn(`[littlecss] Undefined key '${k}' in`, {
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
const tokens = (...values) => {
	return new Tokens([...Tokens.Expand(values)]);
};

// ----------------------------------------------------------------------------
//
// META
//
// ----------------------------------------------------------------------------

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

class Documentation extends Meta {}
const doc = (value) => new Documentation(value);

// ----------------------------------------------------------------------------
//
// URL
//
// ----------------------------------------------------------------------------

class ImportURL {
	constructor(url) {
		this.url = url;
	}
	*lines() {
		yield `@import url('${this.url}');`;
	}
}
const url = (value) => new ImportURL(value);

// ----------------------------------------------------------------------------
//
// HIGH-LEVEL
//
// ----------------------------------------------------------------------------

function* css(...values) {
	// yield `/* Generated by LittleCSS */`;
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

function* docs(...values) {
	for (const v of values) {
		if (v.constructor === Object) {
			yield docs(...Object.values(v));
		} else {
			for (const _ of v.docs()) {
				yield _;
			}
		}
	}
}

// --
// Injects the styles directly as stylesheets into the DOM.
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
					style.setAttribute("id", `littlecss-${s.name}`);
				}
				style.textContent = [...s.lines()].join("\n");
				globalThis.document.head.appendChild(style);
			}
		}
	}
	return res;
};

const mods = (classes, ...modifiers) =>
	modifiers
		.flatMap((_) => (_ ? [`:${_}`, `.${_}`] : ""))
		.flatMap((m) => classes.map((c) => `${c}${m}`));

// --
// Does the cross product of the given arrays.
// >> cross(
// >> 				[".selector.pills", ".selector.bar"],
// >> 				["> li", "> .item"],
// >> 				[":hover", ".hover"]
// >> 			),
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

const percentages = [5, 10, 15, 20, 25, 33, 50, 66, 75, 80, 90, 100];
export {
	Vars,
	blended,
	blend,
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
export default css;
// EOF
