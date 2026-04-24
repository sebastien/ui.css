// ----------------------------------------------------------------------------
//
// CONTROL DEFAULTS
//
// ----------------------------------------------------------------------------
// Default visual rules for all controls, expressed as spec-003 shorthand.
//
// Shorthand keys:
//   tx = text color       "base/tint blend/opacity"
//   bg = background color "base/tint blend/opacity"
//   bd = border           "width radius base/tint blend/opacity"
//   ol = outline          "width radius base/tint blend/opacity"
//
// `.` means inherit from parent. `0` means transparent/zero.
// `contrast` means auto-contrast text against background.
// `inherit` means CSS inherit from parent element.

export default `
	# ==================================================================
	# BUTTON
	# ==================================================================
	button:
		default:
			!default:
				tx: contrast
				bg: ./paper 0%/1.0
				bd: 1px 4px ./ink 85%/0.15
				ol: 2px 4px ./paper 75%/0.0
			!hover:
				bg: ./paper 20%/1.0
			!active:
				bg: ./ink 20%/1.0
			!focus:
				ol: . . ./. ./0.5
			!disabled:
				tx: . . ./0.6
				bg: . . ./0.6
				bd: . . . ./0.6
		outline:
			!default:
				tx: self/ink 40%/1.0
				bg: 0
				bd: 1px 4px ./. 20%/0.6
				ol: 2px 4px ./paper 75%/0.0
			!hover:
				bg: ./paper 80%/0.90
			!active:
				bg: ./paper 70%/0.80
			!focus:
				ol: . . ./. ./0.5
			!disabled:
				tx: . . ./0.6
				bd: . . . ./0.6
		ghost:
			!default:
				tx: self/ink 40%/1.0
				bg: 0
				bd: 0
				ol: 2px 4px ./paper 75%/0.0
			!hover:
				bg: ./ink 95%/0.08
			!active:
				bg: ./ink 95%/0.12
			!focus:
				ol: . . ./. ./0.5
			!disabled:
				tx: . . ./0.6
		blank:
			!default:
				tx: inherit
				bg: 0
				bd: 0
				ol: 0

	# ==================================================================
	# INPUT
	# ==================================================================
	input:
		default:
			!default:
				tx: ./ink 75%/1.0
				bg: ./paper 95%/1.0
				bd: 1px 4px ./ink 85%/0.25
				ol: 2px 4px ./paper 75%/0.0
			!hover:
				bd: . . ./ink 80%/0.40
			!focus:
				bd: . . ./ink 75%/0.50
				ol: . . ./. ./0.5
			!active:
				bg: ./paper 98%/1.0
			!disabled:
				tx: . . ./0.5
				bg: ./paper 90%/0.5
				bd: . . . ./0.15
			!invalid:
				bd: danger/ink 80%/0.50
				ol: danger/paper 75%/0.0
			!invalid+focus:
				ol: danger/paper 75%/0.5
		outline:
			!default:
				tx: ./ink 75%/1.0
				bg: 0
				bd: 1px 4px ./ink 80%/0.40
				ol: 2px 4px ./paper 75%/0.0
			!hover:
				bd: . . ./ink 75%/0.55
			!focus:
				bd: . . ./ink 70%/0.60
				ol: . . ./. ./0.5
			!disabled:
				tx: . . ./0.5
				bd: . . . ./0.20
			!invalid:
				bd: danger/ink 80%/0.50
		ghost:
			!default:
				tx: ./ink 75%/1.0
				bg: 0
				bd: 0
				ol: 2px 4px ./paper 75%/0.0
			!hover:
				bg: ./ink 95%/0.08
			!focus:
				ol: . . ./. ./0.5
			!disabled:
				tx: . . ./0.5
		blank:
			!default:
				tx: inherit
				bg: 0
				bd: 0
				ol: 0

	# ==================================================================
	# TEXTAREA
	# ==================================================================
	textarea:
		default:
			!default:
				tx: ./ink 75%/1.0
				bg: ./paper 95%/1.0
				bd: 1px 4px ./ink 85%/0.25
				ol: 2px 4px ./paper 75%/0.0
			!hover:
				bd: . . ./ink 80%/0.40
			!focus:
				bd: . . ./ink 75%/0.50
				ol: . . ./. ./0.5
			!active:
				bg: ./paper 98%/1.0
			!disabled:
				tx: . . ./0.5
				bg: ./paper 90%/0.5
				bd: . . . ./0.15
			!invalid:
				bd: danger/ink 80%/0.50
				ol: danger/paper 75%/0.0
			!invalid+focus:
				ol: danger/paper 75%/0.5
		outline:
			!default:
				tx: ./ink 75%/1.0
				bg: 0
				bd: 1px 4px ./ink 80%/0.40
				ol: 2px 4px ./paper 75%/0.0
			!hover:
				bd: . . ./ink 75%/0.55
			!focus:
				bd: . . ./ink 70%/0.60
				ol: . . ./. ./0.5
			!disabled:
				tx: . . ./0.5
				bd: . . . ./0.20
		ghost:
			!default:
				tx: ./ink 75%/1.0
				bg: 0
				bd: 0
				ol: 2px 4px ./paper 75%/0.0
			!hover:
				bg: ./ink 95%/0.08
			!focus:
				ol: . . ./. ./0.5
			!disabled:
				tx: . . ./0.5
		blank:
			!default:
				tx: inherit
				bg: 0
				bd: 0
				ol: 0

	# ==================================================================
	# CHECKBOX
	# ==================================================================
	checkbox:
		default:
			!default:
				tx: ./ink 75%/1.0
				bg: ./paper 95%/1.0
				bd: 1px 0.2em ./ink 85%/0.25
				ol: 2px 0.2em ./paper 75%/0.0
				marker:
					bg: 0
			!hover:
				bd: . . ./ink 80%/0.40
				bg: ./paper 92%/1.0
			!focus:
				ol: . . ./. ./0.5
			!checked:
				bg: ./paper 0%/1.0
				bd: . . ./ink 85%/0.15
				tx: contrast
				marker:
					bg: contrast/1.0
			!checked+hover:
				bg: ./ink 90%/1.0
			!indeterminate:
				bg: ./paper 0%/1.0
				bd: . . ./ink 85%/0.15
				marker:
					bg: contrast/1.0
			!disabled:
				tx: . . ./0.5
				bg: . . ./0.5
				bd: . . . ./0.15
				marker:
					bg: . ./0.5
		outline:
			!default:
				tx: ./ink 75%/1.0
				bg: 0
				bd: 1px 0.2em ./ink 80%/0.40
				ol: 2px 0.2em ./paper 75%/0.0
				marker:
					bg: 0
			!hover:
				bd: . . ./ink 75%/0.55
			!focus:
				ol: . . ./. ./0.5
			!checked:
				bd: . . ./ink 75%/0.60
				marker:
					bg: ./ink 25%/1.0
			!checked+hover:
				bd: . . ./ink 70%/0.70
				marker:
					bg: ./ink 20%/1.0
			!disabled:
				tx: . . ./0.5
				bd: . . . ./0.20
				marker:
					bg: . ./0.5
		blank:
			!default:
				tx: inherit
				bg: 0
				bd: 0
				ol: 0
				marker:
					bg: 0
			!checked:
				marker:
					bg: inherit/1.0

	# ==================================================================
	# RADIO
	# ==================================================================
	radio:
		default:
			!default:
				tx: ./ink 75%/1.0
				bg: ./paper 95%/1.0
				bd: 1px 50% ./ink 85%/0.25
				ol: 2px 50% ./paper 75%/0.0
				dot:
					bg: 0
			!hover:
				bd: . . ./ink 80%/0.40
				bg: ./paper 92%/1.0
			!focus:
				ol: . . ./. ./0.5
			!checked:
				bg: ./paper 0%/1.0
				bd: . . ./ink 85%/0.15
				dot:
					bg: contrast/1.0
			!checked+hover:
				bg: ./ink 90%/1.0
			!disabled:
				tx: . . ./0.5
				bg: . . ./0.5
				bd: . . . ./0.15
				dot:
					bg: . ./0.5
		outline:
			!default:
				tx: ./ink 75%/1.0
				bg: 0
				bd: 1px 50% ./ink 80%/0.40
				ol: 2px 50% ./paper 75%/0.0
				dot:
					bg: 0
			!hover:
				bd: . . ./ink 75%/0.55
			!focus:
				ol: . . ./. ./0.5
			!checked:
				bd: . . ./ink 75%/0.60
				dot:
					bg: ./ink 25%/1.0
			!checked+hover:
				bd: . . ./ink 70%/0.70
				dot:
					bg: ./ink 20%/1.0
			!disabled:
				tx: . . ./0.5
				bd: . . . ./0.20
				dot:
					bg: . ./0.5
		blank:
			!default:
				tx: inherit
				bg: 0
				bd: 0
				ol: 0
				dot:
					bg: 0
			!checked:
				dot:
					bg: inherit/1.0

	# ==================================================================
	# SELECT
	# ==================================================================
	select:
		default:
			!default:
				tx: ./ink 75%/1.0
				bg: ./paper 95%/1.0
				bd: 1px 4px ./ink 85%/0.25
				ol: 2px 4px ./paper 75%/0.0
				arrow:
					tx: ./ink 80%/0.60
			!hover:
				bd: . . ./ink 80%/0.40
				arrow:
					tx: ./ink 75%/0.75
			!focus:
				bd: . . ./ink 75%/0.50
				ol: . . ./. ./0.5
			!disabled:
				tx: . . ./0.5
				bg: ./paper 90%/0.5
				bd: . . . ./0.15
				arrow:
					tx: . ./0.30
			!invalid:
				bd: danger/ink 80%/0.50
				ol: danger/paper 75%/0.0
			!invalid+focus:
				ol: danger/paper 75%/0.5
		outline:
			!default:
				tx: ./ink 75%/1.0
				bg: 0
				bd: 1px 4px ./ink 80%/0.40
				ol: 2px 4px ./paper 75%/0.0
				arrow:
					tx: ./ink 80%/0.50
			!hover:
				bd: . . ./ink 75%/0.55
				arrow:
					tx: ./ink 75%/0.65
			!focus:
				bd: . . ./ink 70%/0.60
				ol: . . ./. ./0.5
			!disabled:
				tx: . . ./0.5
				bd: . . . ./0.20
				arrow:
					tx: . ./0.25
			!invalid:
				bd: danger/ink 80%/0.50
		ghost:
			!default:
				tx: ./ink 75%/1.0
				bg: 0
				bd: 0
				ol: 2px 4px ./paper 75%/0.0
				arrow:
					tx: ./ink 80%/0.50
			!hover:
				bg: ./ink 95%/0.08
				arrow:
					tx: ./ink 75%/0.65
			!focus:
				ol: . . ./. ./0.5
			!disabled:
				tx: . . ./0.5
				arrow:
					tx: . ./0.25
		blank:
			!default:
				tx: inherit
				bg: 0
				bd: 0
				ol: 0
				arrow:
					tx: inherit/0.50

	# ==================================================================
	# SLIDER
	# ==================================================================
	slider:
		default:
			!default:
				bg: 0
				bd: 0
				ol: 2px 4px ./paper 75%/0.0
				track:
					bg: ./ink 90%/0.15
					bd: 0
				thumb:
					bg: ./paper 0%/1.0
					bd: 1px 50% ./ink 85%/0.15
			!hover:
				thumb:
					bg: ./ink 90%/1.0
					bd: . . ./ink 80%/0.20
				track:
					bg: ./ink 88%/0.20
			!active:
				thumb:
					bg: ./ink 85%/1.0
			!focus:
				ol: . . ./. ./0.5
				thumb:
					bd: . . ./paper 75%/0.40
			!disabled:
				thumb:
					bg: . . ./0.5
					bd: . . . ./0.10
				track:
					bg: . . ./0.08
		blank:
			!default:
				bg: 0
				bd: 0
				ol: 0
				track:
					bg: ./ink 90%/0.10
					bd: 0
				thumb:
					bg: ./ink 75%/1.0
					bd: 0

	# ==================================================================
	# SELECTOR (container)
	# ==================================================================
	selector:
		default:
			!default:
				bg: 0
				bd: 1px 100px ./. 20%/0.5
				ol: 2px 100px ./paper 75%/0.0
			!focus-within:
				ol: . . ./. ./0.5
			!disabled:
				bg: . . ./0.5
				bd: . . . ./0.15

	# ==================================================================
	# SELECTOR OPTION
	# ==================================================================
	selector.option:
		default:
			!default:
				tx: self/ink 40%/1.0
				bg: 0
				bd: 0 4px
			!hover:
				bg: ./ink 95%/0.08
			!active:
				bg: ./ink 95%/0.12
			!selected:
				tx: contrast
				bg: ./paper 0%/1.0
				bd: 0 4px
			!selected+hover:
				bg: ./paper 20%/1.0
			!selected+active:
				bg: ./ink 20%/1.0
			!disabled:
				tx: . . ./0.6
				bg: 0

	# ==================================================================
	# PANEL
	# ==================================================================
	panel:
		default:
			!default:
				tx: ./ink 75%/1.0
				bg: ./paper 4%/1.0
				bd: 1px 4px ./paper 14%/1.0
				ol: 2px 4px ./paper 75%/0.0
		outline:
			!default:
				bg: 0
				bd: 1px 4px ./ink 80%/0.40
				ol: 2px 4px ./paper 75%/0.0
		blank:
			!default:
				bg: 0
				bd: 0
				ol: 0
				tx: inherit
`
