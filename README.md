```
 ___  ___  ___      ________  ________   ________
|\  \|\  \|\  \    |\   ____\|\   ____\ |\   ____\
\ \  \\\  \ \  \   \ \  \___|\ \  \___|_\ \  \___|_
 \ \  \\\  \ \  \   \ \  \    \ \_____  \\ \_____  \
  \ \  \\\  \ \  \ __\ \  \____\|____|\  \\|____|\  \
   \ \_______\ \__\\__\ \_______\____\_\  \ ____\_\  \
    \|_______|\|__\|__|\|_______|\_________\\_________\
                                \|_________\|_________|
```

*ui.css* is a lightweight, logic-driven CSS toolkit for building modern user interfaces using a functional JavaScript DSL. It provides a robust set of utility classes and component primitives that are direction-aware, themeable, and highly composable.

Unlike traditional CSS frameworks, `ui.css` uses a JavaScript engine to generate optimized stylesheets. This allows for advanced features like a direction-aware OKLCH color system, automatic contrast calculation, and dynamic scaling for layout and typography.

It is designed to be small, fast, and easy to embed, making it ideal for everything from small plugins to complete web applications that value performance and design consistency.

## Documentation

You can learn more about each module:

- **Tokens**: Core design variables ― [manual](docs/tokens.md)
- **Layout**: Flexbox, grid, positioning, and sizing ― [manual](docs/layout.md)
- **Colors**: OKLCH color system and themes ― [manual](docs/colors.md)
- **Text**: Typography and font utilities ― [manual](docs/text.md)
- **Style**: Spacing, borders, shadows, and interaction ― [manual](docs/style.md)
- **Controls**: Buttons, inputs, and form elements ― [manual](docs/controls.md)
- **Reset**: Baseline browser normalization ― [manual](docs/reset.md)

## In a nutshell

```javascript
import { css } from "ui.css/js/uicss.js";
import layout from "ui.css/css/layout.js";
import colors from "ui.css/css/colors.js";
import text from "ui.css/css/text.js";

// Generate a tailored stylesheet
const stylesheet = css(
    layout,
    colors(),
    text
);

for (const line of stylesheet) {
    console.log(line);
}
```

```html
<!-- Resulting usage in HTML -->
<div class="bg-primary-8 bg tx p-m rd-4 sh-2">
    <h1 class="heading bold t-xl">Hello World</h1>
    <p class="dim">Functional CSS generation in JavaScript.</p>
</div>
```

### Core Concepts

- **Functional DSL**: Composable rules using `rule()`, `group()`, and `named()`.
- **Direction-Aware**: Colors and levels that automatically adapt to light/dark modes.
- **Smart Contrast**: Progressive automatic contrast for `.bg.tx` and explicit max-contrast via `.tx-contrast`.
- **Scale-Driven**: Consistent 0-10 scales for spacing, sizing, and luminosity.
- **No-Build ESM**: Works directly in modern runtimes (Bun/Node) and browsers via ESM.

### Features

- *OKLCH Color System*: Perceptually uniform colors with semantic aliases.
- *Flexible Layout*: Powerful flexbox and grid utilities with minimal footprint.
- *Themeable*: First-class support for dark mode and color variants.
- *Embeddable*: Perfect for shadow DOM or isolated component styling.
- *Logic-Powered*: Generates only what you need, with the full power of JavaScript.
