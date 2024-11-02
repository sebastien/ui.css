const camelToKebab = (str) =>
	str
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
	if (Object.getPrototypeOf(value) === Object.prototype) {
		for (const kk in value) {
			for (const v of properties(
				value[kk],
				k ? `${camelToKebab(k)}-${camelToKebab(kk)}` : camelToKebab(kk)
			)) {
				yield v;
			}
		}
	} else {
		yield k ? [k, value] : [null, value];
	}
}

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
}
const rule = (...args) => {
	// TODO: We could do basic selector parsing to extract classnames, tagnames
	// and ids.
	const selectors = args
		.slice(0, -1)
		.reduce((r, v) => (v instanceof Array ? [...r, ...v] : [...r, v]), []);
	const body = args.at(-1);
	const props = {};
	for (const b of body instanceof Array ? body : [body]) {
		if (typeof b === "string") {
			// TODO: What is this for again?
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
	}
	return new Rule(selectors, props);
};

// --
// Scope defines variables, and allows to keep track of them.
class Scope {
	// NOTE: It is a bit awkward
	static get(target, property) {
		return typeof property === "string" &&
			property !== "_name" &&
			property != "walk"
			? (target[property] = target[property] ?? scope(property, target))
			: target[property];
	}
	static set(target, property, value) {
		// TODO: We should have the vars in a map instead
		target[property] = value;
	}
	constructor(name, parent) {
		this._name = parent?._name ? `${parent._name}-${name}` : name;
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
		if (s instanceof Array) {
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
		get: (target, property) =>
			typeof property === "string"
				? (target[property] =
						target[property] ??
						((...sel) => pseudo(property, ...sel)))
				: target[property],
	}
);

class Group {
	constructor(contents, name = undefined) {
		this.contents = [];
		for (const v of contents) {
			if (v instanceof Array) {
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
			yield `};`;
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

class Token {
	constructor(name, value) {
		this.name = name;
		this.value = value;
		this.ref = `--${this.name.replaceAll(".", "-").toLowerCase()}`;
	}
	*lines() {
		yield `${this.ref}: ${this.value};`;
	}
	toString() {
		return `var(${this.ref}: ${this.value})`;
	}
}
class Tokens extends Group {
	static *Expand(collection, prefix = undefined) {
		if (collection instanceof Array) {
			for (const v of collection) {
				for (const w of Tokens.Expand(v, prefix)) {
					yield w;
				}
			}
		} else {
			for (const k in collection) {
				const v = collection[k];
				const p = prefix
					? `${prefix}.${k.replaceAll("_", ".")}`
					: k.replaceAll("_", ".");
				if (Object.getPrototypeOf(v) === Object.prototype) {
					for (const _ of Tokens.Expand(v, p)) {
						yield _;
					}
				} else {
					if (v instanceof Array) {
						for (let i = 0; i < v.length; i++) {
							yield new Token(p ? `${p}.${i}` : `${i}`, v[i]);
						}
					} else {
						yield new Token(p, v);
					}
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
}
const tokens = (...values) => {
	return new Tokens([...Tokens.Expand(values)]);
};

class Meta {
	constructor(value) {
		this.value = value;
	}
}
class Documentation extends Meta {}
const doc = (value) => new Documentation(value);

class ImportURL {
	constructor(url) {
		this.url = url;
	}
	*lines() {
		yield `@import url('${this.url}');`;
	}
}
const url = (value) => new ImportURL(value);

const named = (mapping) => {
	const items = [];
	for (const k in mapping) {
		const v = mapping[k];
		if (v instanceof Group) {
			v.name = k;
			items.push(v);
		} else {
			items.push(new Group(v instanceof Array ? v : v ? [v] : [], k));
		}
	}
	return new Group(items);
};

function* css(...values) {
	yield `/* Generated by LittleCSS */`;
	for (const v of values.flatMap((_) => _)) {
		for (const l of v.lines(true)) {
			yield l;
		}
	}
	yield "/* EOF */";
}

// --
// Injects the styles directly as stylesheets into the DOM.
css.mount = (...values) => {
	for (const v of values.flatMap((_) => _)) {
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
			if (globalThis.document) {
				const style = globalThis.document.createElement("style");
				if (s.name) {
					style.setAttribute("id", s.name);
				}
				style.textContent = [...s.lines()].join("\n");
				globalThis.document.head.appendChild(style);
			}
		}
	}
};
const sizes = ["xxs", "xs", "s", "m", "l", "xl", "xxl"];
const sizenames = {
	smallest: 0, //"xxs",
	smaller: 1, //"xs",
	small: 2, //"s",
	medium: 3, //"m",
	large: 4, //"l",
	larger: 5, // "xl",
	largest: 6, //"xxl",
};
const sides = { l: "left", t: "top", r: "right", b: "bottom" };
const classes = (...values) => values.map((_) => `.${_}`);

const percent = (v) => `${Math.round(v * 10000) / 100}%`;

const blended = (name, color, other, percentage = 0.5, opacity = undefined) => {
	const base = `color-mix(in oklab, ${color} ${percent(
		percentage
	)}, ${other})`;
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

const mods = (classes, ...modifiers) =>
	modifiers
		.flatMap((_) => [`:${_}`, `.${_}`])
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
			? (r instanceof Array ? r : [r]).flatMap((_) =>
					(v instanceof Array ? v : [v]).map((w) => `${_}${w}`)
			  )
			: v instanceof Array
			? v
			: [v]
	);

export {
	classes,
	cross,
	sides,
	sizes,
	sizenames,
	Vars,
	url,
	on,
	vars,
	rule,
	mods,
	blended,
	times,
	layer,
	layers,
	group,
	css,
	named,
	tokens,
	percent,
	doc,
};
export default css;
// EOF
