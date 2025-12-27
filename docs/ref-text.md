# Text Module Reference

The `text.js` module provides typography utilities for text styling, headings, lists, and font properties.

## Usage

```javascript
import text from "littlecss/css/text.js";
import { css } from "littlecss/js/littlecss.js";

for (const line of css(text)) {
    console.log(line);
}
```

## Headings

### Sized Headings (h1-h7)

Each heading level supports size modifiers:

```html
<h1 class="xxs">Extra extra small h1</h1>
<h1 class="xs">Extra small h1</h1>
<h1 class="s">Small h1</h1>
<h1 class="m">Medium h1</h1>
<h1 class="l">Large h1</h1>
<h1 class="xl">Extra large h1</h1>
<h1 class="xxl">Extra extra large h1</h1>
```

### Heading Classes

Apply heading styles to any element:

```html
<div class="h1">Styled like h1</div>
<div class="h2">Styled like h2</div>
<span class="h3">Styled like h3</span>
```

### Text Container Headings

Within a `.t` (text) container, headings get proper margins and underlines:

```html
<div class="t">
    <h1>Heading with underline and margins</h1>
    <p>Paragraph text</p>
</div>
```

Or apply `.t` directly to headings:

```html
<h1 class="t">Heading with text container styling</h1>
```

## Text Container (`.t`)

The `.t` class creates a rich text container with proper spacing and styling for prose content.

### Paragraphs

```html
<div class="t">
    <p>First paragraph with proper margins.</p>
    <p>Second paragraph with proper margins.</p>
</div>
```

### Inline Elements

Within `.t`:

| Element | Styling |
|---------|---------|
| `code` | Monospace font, background |
| `em` | Italic |
| `s` | Strikethrough, dimmed |
| `strong` | Bold |
| `a` | Link styling |
| `sub`, `sup` | Subscript/superscript positioning |

### Block Elements

| Element | Styling |
|---------|---------|
| `blockquote` | Indented with left border |
| `pre` | Preformatted with background |

### Lists

```html
<ul class="t">
    <li>Bulleted item 1</li>
    <li>Bulleted item 2</li>
</ul>

<ol class="t">
    <li>Numbered item 1</li>
    <li>Numbered item 2</li>
</ol>

<dl class="t">
    <dt>Term</dt>
    <dd>Definition</dd>
</dl>
```

Or within a text container:

```html
<div class="t">
    <ul>
        <li>Item with proper indentation</li>
    </ul>
</div>
```

## Whitespace

| Class | Description |
|-------|-------------|
| `.nobreak` | Prevents line breaks |
| `.nowrap` | No text wrapping |
| `.wrap` | Force word break |
| `.pre` | Preserve whitespace |
| `.pre-lines` | Preserve line breaks |
| `.ellipsis` | Text overflow with ellipsis |

```html
<div class="ellipsis" style="width: 100px">
    This text will be truncated...
</div>
```

## Text Transform

| Class | Transform |
|-------|-----------|
| `.upper` | UPPERCASE |
| `.lower` | lowercase |
| `.cap` | Capitalize Each Word |

## Text Alignment

| Class | Alignment |
|-------|-----------|
| `.t-center` | Center |
| `.t-right` | Right |
| `.t-left` | Left |
| `.t-justify` | Justified |

## Text Direction

| Class | Direction |
|-------|-----------|
| `.t-rtl` | Right-to-left |
| `.t-ltr` | Left-to-right |

## Delimiters/Separators

Add automatic separators between child elements:

| Class | Separator |
|-------|-----------|
| `.sep-path` | `/` |
| `.sep-comma` | `,` |
| `.sep-dash` | `―` |

```html
<nav class="sep-path">
    <span>Home</span>
    <span>Products</span>
    <span>Details</span>
</nav>
<!-- Output: Home / Products / Details -->
```

## Decorations

Add brackets or parentheses around content:

| Class | Output |
|-------|--------|
| `.parens` | `(content)` |
| `.brackets` | `{content}` |
| `.sqbrackets` | `[content]` |

```html
<span class="parens">optional</span>
<!-- Output: (optional) -->
```

## Font Style

### Italic

| Class | Description |
|-------|-------------|
| `.em` | Italic |
| `.italic` | Italic |

### Font Weight

| Class | Weight |
|-------|--------|
| `.ltr`, `.lighter`, `.thin` | 100 |
| `.lt`, `.light` | 200 |
| `.r`, `.regular` | 400 |
| `.sb`, `.medium` | 500 |
| `.b`, `.bold` | 600 |
| `.br`, `.bolder` | 700 |
| `.bst`, `.boldest` | 800 |

### Font Family

| Class | Font Family |
|-------|-------------|
| `.mono` | `--font-mono` |
| `.sans` | `--font-sans` |
| `.serif` | `--font-serif` |
| `.script` | `--font-script-family` |
| `.code` | `--font-code-family` |
| `.control` | `--font-controls-family` |
| `.heading` | `--font-heading-family` |
| `.display` | `--font-display-family` |

### Text Decorations

| Class | Decoration |
|-------|------------|
| `.striked` | Line-through |
| `.ul` | Underline |
| `.ol` | Overline |

### Font Size

| Class | Size |
|-------|------|
| `.t-xxs` | Extra extra small |
| `.t-xs` | Extra small |
| `.t-s` | Small |
| `.t-m` | Medium |
| `.t-l` | Large |
| `.t-xl` | Extra large |
| `.t-xxl` | Extra extra large |

## Usage Examples

### Article Layout

```html
<article class="t">
    <h1>Article Title</h1>
    <p class="dim">Published on <time>2024-01-15</time></p>
    
    <p>Introduction paragraph with <strong>important</strong> text
    and <a href="#">links</a>.</p>
    
    <h2>Section Heading</h2>
    <p>More content with <code>inline code</code>.</p>
    
    <pre><code>Code block here</code></pre>
    
    <ul>
        <li>List item one</li>
        <li>List item two</li>
    </ul>
</article>
```

### Breadcrumb Navigation

```html
<nav class="sep-path t-s">
    <a href="/">Home</a>
    <a href="/docs">Documentation</a>
    <span>Current Page</span>
</nav>
```

### Styled Heading

```html
<h1 class="heading bold t-xl t-center">
    Centered Bold Heading
</h1>
```

### Truncated Text

```html
<div class="row">
    <span class="fill ellipsis">Very long text that gets truncated</span>
    <span class="nowrap">Fixed content</span>
</div>
```
