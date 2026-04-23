# Colors Module (`colors.js`)

## Direction-aware OKLCH color system and semantic themes

The `colors.js` module implements a sophisticated color system that automatically adapts to light and dark modes. It uses composable base, tint, blend, and opacity controls to derive final colors.

### Apply Classes:

- `.bg`: Applies the computed background color.
- `.tx`: Applies the computed text color.
- `.bg.tx`: Progressive contrast enhancement that prefers `contrast-color()` when supported.
- `.tx-contrast`: Explicit maximum-contrast text color for the current background.
- `.bd`: Applies the computed border color and default border width/style.
- `.bd-t`, `.bd-r`, `.bd-b`, `.bd-l`: Applies border color and width to a specific side.
- `.ol`: Applies the computed outline color.

### Color and Level Modifiers:

- `.{prop}-{color}`: Sets the base color at level 5 (e.g., `.bg-primary`).
- `.{prop}-{0-10}o`: Sets the opacity (alpha) from 0 to 1.0 (e.g., `.bg-5o`).
- `.{prop}-to-{color}`: Sets a tint color for blending (e.g., `.bg-to-blue`).
- `.{prop}-to-{semantic}`: Sets a semantic tint color (e.g., `.bg-to-primary`).
- `.{prop}-to-white`, `.{prop}-to-black`: Endpoint tint helpers.
- `.{prop}-{0-10}b`: Blends between base color and tint. `0` is 100% tint, `10` is 100% base.

### Semantic Colors:

- `primary`, `secondary`, `tertiary`: Main brand colors.
- `success`, `info`, `warning`, `danger`: Status colors.
- `neutral`: Grayscale/Slate palette.
- `paper`, `ink`: Special colors mapping to the background and foreground endpoints.

### Differences with standard CSS colors:

- Logic-driven `color-mix` for sophisticated blending and opacity.
- Progressive contrast safety net when using `.bg` and `.tx` together.

### Using

```html
<!-- Dark background with auto-contrasted light text -->
<div class="bg-blue bg-to-ink bg-2b bg tx p-m">
    Blue background blended toward ink with auto light text.
</div>

<!-- Softened red border -->
<div class="bd-red bd-to-white bd-8b bd">
    Red border blended 20% toward white.
</div>

<!-- Transparent overlay -->
<div class="bg-ink bg-5o bg tx">
    50% opacity ink background.
</div>
```

### API

### The `colors` module:

- `colors(palette?)`: Generates the color utility classes. Accepts an optional palette override.
- `colormix(base, tint, blend, opacity)`: Internal helper for generating `color-mix` CSS strings.
- `COLORS`: Array of available palette color names (red, blue, slate, etc.).
- `SEMANTIC`: Mapping of semantic names to palette colors.
