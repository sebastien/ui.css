# Controls Module (`controls.js`)

## Interactive UI components and form controls

The `controls.js` module provides comprehensive styling for interactive elements like buttons, inputs, toggles, and selectable lists. It handles hover, focus, active, and selected states automatically.

### Main Components:

- `button`, `.button`: Standard button styling with configurable fonts and colors.
- `.selectable`: Base class for interactive items (list items, cards) that share button-like state logic but may have different layouts.
- `input`, `.input`: Standard text input styling.
- `textarea`, `.textarea`: Multi-line text input styling.
- `input[type="checkbox"]`, `.checkbox`: Custom styled checkboxes with `:checked` markers.
- `input[type="radio"]`, `.radio`: Custom styled radio buttons.
- `.toggle`: Switch/toggle control (often used with a hidden checkbox).

### Style Variants:

- `.primary`, `.secondary`, `.success`, `.warning`, `.danger`: Semantic color variants.
- `.outline`: Transparent background with a 1px border of the current color.
- `.ghost`: Fully transparent background and border; only shows state on interaction.
- `.blank`: Minimal styling with reduced opacity.
- `.icon`: 1:1 aspect ratio button with minimal padding.
- `.bare`: Resets all styling (removes padding, borders, backgrounds).
- `.default`: Emphasized style with 3px borders and bold text.

### Component States:

- `:hover`, `.hover`: Mouse over effect.
- `:active`, `.active`: Click/press effect.
- `:focus`, `:focus-visible`, `.focus`: Keyboard focus ring.
- `.selected`, `[data-selected="true"]`: Persistently selected state.
- `:disabled`, `.disabled`: Visual dimming and `pointer-events: none`.

### Difference with utility-only frameworks:

- Components manage internal color variables (`--button-current-color`, etc.).
- States are coordinated across different component types for a consistent feel.
- Automatic contrast calculation for text inside colored buttons.

### Using

```html
<!-- Semantic buttons -->
<div class="row g-s">
    <button class="primary">Submit</button>
    <button class="outline danger">Delete</button>
    <button class="ghost">Cancel</button>
</div>

<!-- Form controls -->
<div class="stack g-m">
    <input type="text" placeholder="Username" class="success">
    <textarea placeholder="Bio"></textarea>
    <label class="row g-s items-center pointer">
        <input type="checkbox" class="primary">
        <span>Accept terms</span>
    </label>
</div>
```

### API

### The `controls` module:

- `controls()`: Generates the interactive component classes.
- `button(colors)`, `input(colors)`, `textarea(colors)`, etc.: Internal factory functions for specific components.
- `colorvars(name, mode)`: Internal helper for managing component-specific color variables.
- `bare(name, variant)`: Internal helper for generating the `.bare` reset rule.
