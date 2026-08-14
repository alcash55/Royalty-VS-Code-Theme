/**
 * The single source of truth for every color in the theme.
 *
 * Concept: 16th–19th century royalty — purple (royalty), gold (wealth),
 * white (purity). The base is a deep plum rather than the old washed-out
 * grey-purple, which is what let every syntax color sit at low contrast.
 *
 * Every value here is verified against `bg.editor` by `scripts/check-contrast.mjs`.
 * Text-bearing colors target WCAG AA (4.5:1); most reach AAA (7:1).
 */

/** Background ramp, darkest to lightest. All opaque so contrast is measurable. */
export const bg = {
  /** Activity bar and the deepest chrome. */
  deepest: '#100B18',
  /** Side bar, panels, tab bar. */
  deep: '#150F20',
  /** The editor surface itself. */
  editor: '#1A1426',
  /** Widgets, hovers, dropdowns — raised above the editor. */
  raised: '#241B33',
  /** Selected rows, active list items. */
  raisedHigh: '#332748',
};

/** Foreground ramp, brightest to dimmest. */
export const fg = {
  /** Primary editor text. Soft lavender-white — pure #fff glares on a dark ground. */
  primary: '#E9E4F2',
  /** Chrome text: tabs, sidebar entries, status bar. */
  chrome: '#D3CBE3',
  /** Secondary text: inactive tabs, breadcrumbs, descriptions. */
  muted: '#B0A5C7',
  /** Deliberately quiet: line numbers, whitespace, disabled entries. */
  subtle: '#8B7FA8',
};

/** The two crown colors, used as accents rather than as body text. */
export const accent = {
  gold: '#F2C94C',
  goldDim: '#C9A43B',
  purple: '#B48AE8',
  purpleDeep: '#5B2E8C',
  purpleDeeper: '#3D1F5E',
};

/**
 * Syntax hues. Deliberately small and pastel-desaturated: violet and gold carry
 * the theme, with cyan, sage and rose as supporting hues so the common token
 * types stay distinguishable without any of them shouting.
 */
export const syntax = {
  /** Keywords, control flow, storage modifiers. */
  violet: '#C89BF5',
  /** Types, classes, interfaces, attributes. */
  gold: '#F2CE7E',
  /** Functions and methods. */
  cyan: '#7FD3EC',
  /** Strings. */
  sage: '#9FD6A0',
  /** Numbers, constants, language literals, tags. */
  rose: '#F5A0C4',
  /** Parameters and regex. */
  peach: '#F2B085',
  /** Variables and properties — close to body text so code reads as prose. */
  lavender: '#DCD4EA',
  /**
   * Comments. Quiet, but still above AA — including when read through the
   * selection overlay, which is what sets the floor here.
   */
  comment: '#9A8FB6',
  /** Operators and punctuation. */
  punctuation: '#B0A5C7',
};

/** Status colors, tuned to sit on the plum ground rather than a neutral grey. */
export const status = {
  error: '#FF8A8A',
  warning: '#F2D06B',
  info: '#8FB8F0',
  success: '#8FDCA0',
};

/** Git decoration colors. */
export const git = {
  added: '#8FDCA0',
  modified: '#F2CE7E',
  deleted: '#FF8A8A',
  untracked: '#7FD3EC',
  ignored: '#6E6389',
  conflict: '#F5A0C4',
  submodule: '#C89BF5',
};

/** Terminal ANSI palette, harmonized with the syntax hues. */
export const ansi = {
  black: '#241B33',
  brightBlack: '#6E6389',
  red: '#F58A8A',
  brightRed: '#FFA5A5',
  green: '#8FDCA0',
  brightGreen: '#A9E9B7',
  yellow: '#F2CE7E',
  brightYellow: '#F7DC9E',
  blue: '#8FB8F0',
  brightBlue: '#AACCF7',
  magenta: '#C89BF5',
  brightMagenta: '#D9B6FA',
  cyan: '#7FD3EC',
  brightCyan: '#A3E1F3',
  white: '#D3CBE3',
  brightWhite: '#F2EEF8',
};

/** Bracket pair colorization, cycling through the crown colors. */
export const brackets = ['#F2C94C', '#C89BF5', '#7FD3EC', '#9FD6A0', '#F5A0C4', '#F2B085'];

/** Translucent overlays. Alpha is composited before contrast is measured. */
export const alpha = {
  /** Selection — light enough to read through. */
  selection: '#6B45A340',
  selectionInactive: '#6B45A326',
  /** Matches of the selected word. */
  wordHighlight: '#B48AE833',
  wordHighlightStrong: '#F2C94C40',
  /** Search hits. */
  findMatch: '#F2C94C59',
  findMatchHighlight: '#F2C94C33',
  /** The current line. */
  lineHighlight: '#FFFFFF0A',
  /** Hairlines: indent guides, rulers, borders. */
  hairline: '#FFFFFF12',
  hairlineStrong: '#FFFFFF24',
  /** Scrollbar states. */
  scrollbar: '#B48AE833',
  scrollbarHover: '#B48AE84D',
  scrollbarActive: '#B48AE866',
  /** Drop shadow under widgets. */
  shadow: '#00000066',
  /** Hover on lists and menus. */
  hover: '#FFFFFF0F',
  /** Inline diff backgrounds. */
  diffInserted: '#8FDCA01F',
  diffRemoved: '#FF8A8A1F',
  diffInsertedGutter: '#8FDCA033',
  diffRemovedGutter: '#FF8A8A33',
};
