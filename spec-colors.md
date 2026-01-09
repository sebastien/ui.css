# Colors

There are basic colors (`--color-{white,black}`):

- white: white point (used for page in light mode, or for text if dark mode)
- black: black point (used for page in dark mode, or for text if light mode)

We define semantic colors (`--color-${name}`):

- neutral
- alternate
- primary
- secondary
- tertiary
- success
- info
- warning
- danger
- error

Colors are applicable to the following properties:

- background, `.bd-${color}`, sets `--background-color`
- text, `.tx-${color}`, sets `--text-color`
- border, `.bd-${color}`, sets `--border-color`
- outline, `.ot-${color}`, sets `--outline-color`


Each color is computed base on the following variables:

- base: the base color `--{background,text,border,outline}-base`
- shade: the luminosity of the color (0-10 inclusive) `--{background,text,border,outline}-base`, `.{bg,tx,bd,ol}-{0-10}`
- tint: the chroma of the color (0-10 inclusive) `--{background,text,border,outline}-tint`, `.{bg,tx,bd,ol}-{0-10}c`
- shade variant: a relative luminosity variance of the color `--{background,text,border,outline}-delta-l`, `.{bg,tx,bd,ol}-{darkest,darker,dark,normal,light,ligher,lightest}` or `.{bg,tx,bd,ol}-l[+-]{0-10}`
- chroma variant: a relative chroma variance of the color `--{background,text,border,outline}-delta-c`,`.{bg,tx,bd,ol}-c[+-]{0-10}`
- hue variant: a relative chroma variance of the color `--{background,text,border,outline}-delta-h`, `.{bg,tx,bd,ol}-h[+-]{0-10}`
- opacity:the opacity, (0-10 inclusive), `--{background,text,border,outline}-opacity`, `.{bg,tx,bd,ol}-{0-10}p`
- opacity variant: a relative chroma variance of the color `--{background,text,border,outline}-delta-a`, `.{bg,tx,bd,ol}-a[+-]{0-10}`

And the color is applied using `.{bg,tx,bd,ol}`:
- The luminosity of the text is constrained to ensure a 4.5:1 contrast against background.
- When in dark mode (`.dark`), luminosity range is reversed (includes shade and variant)
- When in light mode (`.light`), luminosity range is not reversed (includes shade and variant)

Dark `.dark` and `.light` modes each set a default luminance for each
style property (`background,text,border,outline`) and set the correct luminance high  (100
and low point (0) values so that application of the color respects the mode.


Components and controls leverage the color variable to define the behaviour of the component base
on their mode (hover, active, focus)
