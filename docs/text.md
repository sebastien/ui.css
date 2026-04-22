# Text Module (`text.js`)

## Typography, font properties, and text containers

The `text.js` module provides utilities for styling typography, headings, lists, and prose content. It supports relative and absolute font sizing and a variety of formatting helpers.

### Headings:

- `h1-h7`: Global reset headings with no default margins or sizes.
- `h1.t` through `h7.t`: Themed headings with standard margins and sizes when used inside or as a `.t` container.
- `.h1` through `.h7`: Utility classes to apply heading sizes and weights to any element.
- `h1.m`, `h2.s`, etc.: Heading level with an explicit size modifier (index 0-10).
- `.noheading`: Resets heading variables (size, amplitude) to a flat 1rem baseline.

### Font Properties:

- `.ltr`, `.lighter`, `.thin`: Weight 100.
- `.lt`, `.light`: Weight 200.
- `.r`, `.regular`: Weight 400.
- `.sb`, `.medium`: Weight 500.
- `.b`, `.bold`: Weight 600.
- `.br`, `.bolder`: Weight 700.
- `.bst`, `.boldest`: Weight 800.
- `.mono`, `.sans`, `.serif`, `.script`, `.display`: Font family selection.
- `.italic`, `.em`: Italic style.
- `.ul`, `.ol`, `.striked`: Underline, overline, and strikethrough.
- `.tight`, `.tighter`, `.tightest`: Negative letter spacing.

### Font Sizing:

- `.t-smallest` through `.t-largest`: Absolute sizing (rem-based, index 0-6).
- `.smallest` through `.largest`: Relative sizing (em-based, index 0-6).

### Text Container (`.t`):

The `.t` class creates a prose-optimized container where child elements receive semantic styling:
- `p`: Paragraph margins and line height.
- `ul`, `ol`, `dl`: Proper indentation and list markers.
- `blockquote`: Left border with indentation.
- `pre`, `code`: Monospace styling and backgrounds.
- `a`: Underlined link styling with hover effects.

### Formatting Utilities:

- `.nobreak`, `.nowrap`, `.wrap`: White-space and word-break control.
- `.pre`, `.pre-lines`: Preserve whitespace or line breaks.
- `.ellipsis`: Truncate text with an ellipsis.
- `.upper`, `.lower`, `.cap`: Text transformation.
- `.t-left`, `.t-right`, `.t-center`, `.t-justify`: Text alignment.
- `.sep-path`, `.sep-comma`, `.sep-dash`: Automatically insert separators between children.
- `.parens`, `.brackets`, `.sqbrackets`: Automatically wrap content in delimiters.

### Using

```html
<article class="t">
    <h1>Article Title</h1>
    <p>This is a paragraph with <strong>bold</strong> text and a <a href="#">link</a>.</p>
    
    <div class="sep-path t-s dim">
        <span>Category</span>
        <span>Subcategory</span>
    </div>
</article>

<div class="row g-m items-center">
    <span class="fill ellipsis">This is a very long text that will be truncated...</span>
    <span class="nowrap b">Fixed Price</span>
</div>
```

### API

### The `text` module:

- `text()`: Generates the typography and text utility classes.
- `vars.font`: Internal configuration used for font families and baseline sizes.
- `vars.pad`, `vars.margin`: Scales used for container spacing.
