# Reset Module Reference

The `reset.js` module provides CSS reset/normalize rules that establish a consistent baseline styling across browsers. It removes default browser styles and applies sensible defaults using the design tokens.

## Usage

```javascript
import reset from "littlecss/css/reset.js";
import { css } from "littlecss/js/littlecss.js";

// Generate CSS
for (const line of css(reset)) {
    console.log(line);
}
```

The reset is automatically wrapped in a `@layer` directive for proper cascade ordering.

## Reset Rules

### Universal Reset

Applied to all HTML tags and elements with `.reset` class:

```css
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    margin-block: unset;
    font-style: unset;
    font-weight: unset;
    font-family: var(--font-text-family);
    line-height: var(--font-text-line);
    border: 0px solid transparent;
    outline: 0px solid transparent;
    list-style-type: none;
    background-color: transparent;
}
```

### Body Reset

```css
body {
    font-family: var(--font-text-family);
    font-size: var(--font-text-size);
    line-height: var(--font-text-line);
}
```

### Form Controls

Input elements receive special treatment:

```css
input, select, option, textarea, progress, meter {
    display: inline-flex;
    appearance: none;
    font-family: var(--font-controls-family);
    font-size: var(--font-controls-size);
    line-height: var(--font-controls-line);
}
```

### Contenteditable & Controls

```css
[contenteditable],
button, input, select, option, textarea, label,
fieldset, legend, progress, meter, output, details, summary {
    outline: 0px solid transparent;
}
```

### Headings

Headings h1-h7 use the heading font family:

```css
h1, h2, h3, h4, h5, h6, h7 {
    font-family: var(--font-heading);
    margin: unset;
    padding: unset;
    font-size: unset;
}
```

### Summary Marker

Hides the default disclosure triangle on `<details>`:

```css
summary::-webkit-details-marker {
    display: none;
}
```

## Usage Examples

### Basic Page Setup

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="littlecss.css">
</head>
<body>
    <!-- All elements now have consistent baseline styling -->
    <h1>Heading</h1>
    <p>Paragraph text</p>
    <ul>
        <li>List item (no bullets)</li>
    </ul>
</body>
</html>
```

### Resetting Specific Elements

Use the `.reset` class to apply reset styles to custom elements:

```html
<custom-element class="reset">
    Content with reset styles
</custom-element>
```

## What Gets Reset

| Property | Reset Value |
|----------|-------------|
| `box-sizing` | `border-box` |
| `margin` | `0` |
| `padding` | `0` |
| `font-style` | `unset` |
| `font-weight` | `unset` |
| `border` | `0px solid transparent` |
| `outline` | `0px solid transparent` |
| `list-style-type` | `none` |
| `background-color` | `transparent` |

## Notes

- The reset uses design tokens for font settings, ensuring consistency with the rest of the system
- Form controls use the `--font-controls-*` tokens for their typography
- The reset is applied via `@layer` to allow easy overriding in subsequent layers
