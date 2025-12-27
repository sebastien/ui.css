# Controls Module Reference

The `controls.js` module provides comprehensive styling for interactive UI controls including buttons, inputs, selectors, toggles, pills, and selectable items.

## Usage

```javascript
import controls from "littlecss/css/controls.js";
import { css } from "littlecss/js/littlecss.js";

for (const line of css(controls)) {
    console.log(line);
}
```

## Selectable

The `.selectable` class creates interactive elements with consistent hover, focus, active, and selected states.

### Basic Usage

```html
<div class="selectable">Clickable item</div>
<li class="selectable">List item</li>
```

### States

| State | Selector |
|-------|----------|
| Hover | `:hover`, `.hover` |
| Focus | `:focus`, `:focus-within`, `.focus` |
| Selected | `.selected`, `[data-selected=true]` |
| Active | `:active`, `.active` |
| Disabled | `:disabled`, `.disabled` |

```html
<div class="selectable selected">Selected item</div>
<div class="selectable disabled">Disabled item</div>
```

### Color Variants

| Class | Color |
|-------|-------|
| `.primary` | Primary color |
| `.secondary` | Secondary color |
| `.tertiary` | Tertiary color |
| `.success` | Success green |
| `.info` | Info blue |
| `.warning` | Warning yellow |
| `.danger` | Danger red |

```html
<div class="selectable primary">Primary selectable</div>
<div class="selectable danger">Danger selectable</div>
```

### Size Variants

| Class | Size |
|-------|------|
| `.largest` | Largest padding |
| `.larger` | Larger padding |
| `.large` | Large padding |
| `.small` | Small padding |
| `.smaller` | Smaller padding |
| `.smallest` | Smallest padding |

```html
<div class="selectable large">Large item</div>
<div class="selectable small">Small item</div>
```

## Action

Simple clickable styling without visual feedback:

```html
<span class="action">Click me</span>
```

## Pills

Tag/chip-style elements for tags, filters, or selections.

### Container and Items

```html
<div class="pills">
    <span class="pill">Tag 1</span>
    <span class="pill">Tag 2</span>
    <span class="pill">Tag 3</span>
</div>
```

### Pill States

```html
<span class="pill selected">Selected tag</span>
<span class="pill active">Active tag</span>
<span class="pill disabled">Disabled tag</span>
```

### Pill Colors

```html
<span class="pill primary">Primary</span>
<span class="pill success">Success</span>
<span class="pill danger">Danger</span>
```

## Buttons

Full-featured button styling with multiple variants.

### Basic Button

```html
<button>Default button</button>
<div class="button">Div as button</div>
```

### Color Variants

```html
<button class="primary">Primary</button>
<button class="secondary">Secondary</button>
<button class="tertiary">Tertiary</button>
<button class="success">Success</button>
<button class="info">Info</button>
<button class="warning">Warning</button>
<button class="danger">Danger</button>
```

### Size Variants

```html
<button class="largest">Largest</button>
<button class="larger">Larger</button>
<button class="large">Large</button>
<button>Regular</button>
<button class="small">Small</button>
<button class="smaller">Smaller</button>
<button class="smallest">Smallest</button>
```

### Style Variants

| Class | Description |
|-------|-------------|
| `.icon` | Transparent background, minimal padding |
| `.default` | Default outline glow |
| `.transparent` | Transparent main color |
| `.shadow` | Box shadow |
| `.blank` | No visible styling |
| `.outline` | Border-focused styling |

```html
<button class="icon">
    <svg>...</svg>
</button>
<button class="outline primary">Outline button</button>
<button class="shadow">Shadow button</button>
```

### Shape Variants

| Class | Shape |
|-------|-------|
| `.square` | 1:1 aspect ratio |
| `.circle` | Circular button |

```html
<button class="circle icon">
    <svg>...</svg>
</button>
```

### States

```html
<button disabled>Disabled</button>
<button class="active">Active state</button>
```

## Selector (Button Groups)

Segmented control / button group styling.

### Basic Selector

```html
<ul class="selector">
    <li>Option 1</li>
    <li class="selected">Option 2</li>
    <li>Option 3</li>
</ul>
```

Or with items:

```html
<div class="selector">
    <div class="item">Left</div>
    <div class="item selected">Center</div>
    <div class="item">Right</div>
</div>
```

### Pills Variant

Adds gaps between items with pill shapes:

```html
<ul class="selector pills">
    <li>One</li>
    <li>Two</li>
    <li>Three</li>
</ul>
```

### Color Variants

```html
<ul class="selector primary">
    <li>A</li>
    <li class="selected">B</li>
    <li>C</li>
</ul>
```

### Size Variants

```html
<ul class="selector small">
    <li>Small</li>
    <li>Options</li>
</ul>
```

## Inputs

Form input styling for text inputs, textareas, and similar controls.

### Basic Input

```html
<input type="text" placeholder="Enter text">
<textarea placeholder="Enter message"></textarea>
```

Or with class:

```html
<div class="input" contenteditable>Editable div</div>
```

### Size Variants

```html
<input class="largest" placeholder="Largest">
<input class="large" placeholder="Large">
<input placeholder="Regular">
<input class="small" placeholder="Small">
<input class="smallest" placeholder="Smallest">
```

### Validation States

| Class | State |
|-------|-------|
| `.missing` | Missing/required |
| `.success` | Valid input |
| `.warning` | Warning state |
| `.error` | Error state |

```html
<input class="success" value="Valid">
<input class="error" value="Invalid">
<input class="warning" value="Check this">
```

### Style Variants

| Class | Description |
|-------|-------------|
| `.bg` | Custom background |
| `.blank` | No visible borders/background |
| `.noinput` | Completely unstyled |
| `.nopad` | No padding |

```html
<input class="blank" placeholder="Borderless input">
```

### States

```html
<input disabled placeholder="Disabled">
<input readonly value="Read only">
```

## Toggle (Switch)

Toggle/switch control for boolean values.

### Basic Toggle

```html
<div class="toggle"></div>
<div class="toggle checked"></div>
```

### With Checkbox

```html
<label>
    <input type="checkbox">
    <span class="toggle"></span>
    Enable feature
</label>
```

The toggle automatically responds to the checkbox state.

### Data Attribute

```html
<div class="toggle" data-checked="true"></div>
<div class="toggle" data-checked="false"></div>
```

### Color Variants

```html
<div class="toggle primary checked"></div>
<div class="toggle success checked"></div>
<div class="toggle warning checked"></div>
<div class="toggle danger checked"></div>
```

### Size Variants

```html
<div class="toggle small"></div>
<div class="toggle large"></div>
```

### Disabled State

```html
<div class="toggle disabled"></div>
```

## Usage Examples

### Navigation Menu

```html
<nav>
    <ul class="stack">
        <li class="selectable">Home</li>
        <li class="selectable selected">Products</li>
        <li class="selectable">About</li>
        <li class="selectable">Contact</li>
    </ul>
</nav>
```

### Tag Cloud

```html
<div class="pills">
    <span class="pill primary">JavaScript</span>
    <span class="pill primary">CSS</span>
    <span class="pill primary">HTML</span>
    <span class="pill">React</span>
    <span class="pill">Vue</span>
</div>
```

### Form with Validation

```html
<form class="stack g-m">
    <input type="text" class="success" placeholder="Username" value="validuser">
    <input type="email" class="error" placeholder="Email" value="invalid">
    <textarea class="warning" placeholder="Message">Check spelling</textarea>
    <div class="row g-m">
        <button class="primary fill">Submit</button>
        <button class="outline">Cancel</button>
    </div>
</form>
```

### Settings Panel

```html
<div class="stack g-m">
    <label class="row">
        <span class="fill">Dark mode</span>
        <input type="checkbox">
        <span class="toggle"></span>
    </label>
    <label class="row">
        <span class="fill">Notifications</span>
        <input type="checkbox" checked>
        <span class="toggle success"></span>
    </label>
</div>
```

### Toolbar

```html
<div class="row g-s">
    <ul class="selector">
        <li class="selected">Edit</li>
        <li>View</li>
        <li>Share</li>
    </ul>
    <div class="fill"></div>
    <button class="icon"><svg>...</svg></button>
    <button class="icon"><svg>...</svg></button>
    <button class="primary">Save</button>
</div>
```

### Filter Bar

```html
<div class="row g-m wrap">
    <div class="pills">
        <span class="pill selected">All</span>
        <span class="pill">Active</span>
        <span class="pill">Completed</span>
    </div>
    <input type="search" class="small" placeholder="Search...">
    <button class="small primary">Add New</button>
</div>
```
