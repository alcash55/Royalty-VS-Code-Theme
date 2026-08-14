/**
 * Verifies the generated theme against WCAG 2.1 contrast minimums.
 *
 * Exits non-zero if anything fails, so "accessible" is a checked property of the
 * theme rather than a claim in the README.
 *
 * Run: `npm run check`  (or `npm run check -- --verbose` to list every pair)
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { contrast, rating } from './contrast.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const theme = JSON.parse(readFileSync(join(ROOT, 'themes', 'King-color-theme.json'), 'utf8'));
const verbose = process.argv.includes('--verbose');

const colors = theme.colors;
const EDITOR_BG = colors['editor.background'];

/** Minimum ratio for body text. */
const AA_TEXT = 4.5;
/** Minimum ratio for large text, icons and non-text UI boundaries. */
const AA_LARGE = 3.0;

const results = [];

/**
 * @param {string} label
 * @param {string} fg
 * @param {string} bgColor
 * @param {number} min
 */
function check(label, fg, bgColor, min) {
  if (!fg || !bgColor) return;

  const ratio = contrast(fg, bgColor);
  results.push({ label, fg, bg: bgColor, ratio, min, pass: ratio >= min });
}

// ---- Every syntax color against the editor background ----------------------
for (const rule of theme.tokenColors) {
  const fg = rule.settings?.foreground;
  if (!fg) continue;

  check(`syntax: ${rule.name}`, fg, EDITOR_BG, AA_TEXT);
}

// ---- Semantic token colors -------------------------------------------------
for (const [token, value] of Object.entries(theme.semanticTokenColors ?? {})) {
  const fg = typeof value === 'string' ? value : value.foreground;
  if (!fg) continue;

  check(`semantic: ${token}`, fg, EDITOR_BG, AA_TEXT);
}

// ---- Workbench text on its own surface -------------------------------------
/** @type {Array<[string, string, number]>} foreground key, background key, minimum */
const UI_PAIRS = [
  ['editor.foreground', 'editor.background', AA_TEXT],
  ['editorLineNumber.foreground', 'editor.background', AA_LARGE],
  ['editorLineNumber.activeForeground', 'editor.background', AA_TEXT],
  ['editorCodeLens.foreground', 'editor.background', AA_LARGE],
  ['editorGhostText.foreground', 'editor.background', AA_LARGE],
  ['breadcrumb.foreground', 'breadcrumb.background', AA_TEXT],
  ['editorInlayHint.foreground', 'editor.background', AA_LARGE],

  ['sideBar.foreground', 'sideBar.background', AA_TEXT],
  ['sideBarTitle.foreground', 'sideBar.background', AA_TEXT],
  ['sideBarSectionHeader.foreground', 'sideBarSectionHeader.background', AA_TEXT],
  ['list.activeSelectionForeground', 'list.activeSelectionBackground', AA_TEXT],
  ['list.inactiveSelectionForeground', 'list.inactiveSelectionBackground', AA_TEXT],
  ['list.highlightForeground', 'sideBar.background', AA_TEXT],
  ['list.errorForeground', 'sideBar.background', AA_TEXT],
  ['list.warningForeground', 'sideBar.background', AA_TEXT],

  ['activityBar.foreground', 'activityBar.background', AA_TEXT],
  ['activityBar.inactiveForeground', 'activityBar.background', AA_LARGE],
  ['activityBarBadge.foreground', 'activityBarBadge.background', AA_TEXT],

  ['tab.activeForeground', 'tab.activeBackground', AA_TEXT],
  ['tab.inactiveForeground', 'tab.inactiveBackground', AA_TEXT],
  ['tab.hoverForeground', 'tab.hoverBackground', AA_TEXT],

  ['statusBar.foreground', 'statusBar.background', AA_TEXT],
  ['statusBar.debuggingForeground', 'statusBar.debuggingBackground', AA_TEXT],
  ['statusBarItem.prominentForeground', 'statusBarItem.prominentBackground', AA_TEXT],
  ['statusBarItem.remoteForeground', 'statusBarItem.remoteBackground', AA_TEXT],
  ['statusBarItem.errorForeground', 'statusBarItem.errorBackground', AA_TEXT],
  ['statusBarItem.warningForeground', 'statusBarItem.warningBackground', AA_TEXT],

  ['titleBar.activeForeground', 'titleBar.activeBackground', AA_TEXT],
  ['titleBar.inactiveForeground', 'titleBar.inactiveBackground', AA_LARGE],

  ['button.foreground', 'button.background', AA_TEXT],
  ['button.secondaryForeground', 'button.secondaryBackground', AA_TEXT],
  ['badge.foreground', 'badge.background', AA_TEXT],
  ['extensionButton.prominentForeground', 'extensionButton.prominentBackground', AA_TEXT],

  ['input.foreground', 'input.background', AA_TEXT],
  ['input.placeholderForeground', 'input.background', AA_LARGE],
  ['dropdown.foreground', 'dropdown.background', AA_TEXT],
  ['inputValidation.errorForeground', 'inputValidation.errorBackground', AA_TEXT],
  ['inputValidation.warningForeground', 'inputValidation.warningBackground', AA_TEXT],
  ['inputValidation.infoForeground', 'inputValidation.infoBackground', AA_TEXT],

  ['menu.foreground', 'menu.background', AA_TEXT],
  ['menu.selectionForeground', 'menu.selectionBackground', AA_TEXT],
  ['quickInput.foreground', 'quickInput.background', AA_TEXT],
  ['quickInputList.focusForeground', 'quickInputList.focusBackground', AA_TEXT],
  ['pickerGroup.foreground', 'quickInput.background', AA_TEXT],
  ['keybindingLabel.foreground', 'keybindingLabel.background', AA_TEXT],

  ['editorWidget.foreground', 'editorWidget.background', AA_TEXT],
  ['editorSuggestWidget.foreground', 'editorSuggestWidget.background', AA_TEXT],
  ['editorSuggestWidget.highlightForeground', 'editorSuggestWidget.background', AA_TEXT],
  ['editorSuggestWidget.selectedForeground', 'editorSuggestWidget.selectedBackground', AA_TEXT],
  ['editorHoverWidget.foreground', 'editorHoverWidget.background', AA_TEXT],

  ['panelTitle.activeForeground', 'panel.background', AA_TEXT],
  ['panelTitle.inactiveForeground', 'panel.background', AA_LARGE],
  ['terminal.foreground', 'terminal.background', AA_TEXT],

  ['notifications.foreground', 'notifications.background', AA_TEXT],
  ['notificationLink.foreground', 'notifications.background', AA_TEXT],
  ['notificationCenterHeader.foreground', 'notificationCenterHeader.background', AA_TEXT],

  ['peekViewResult.fileForeground', 'peekViewResult.background', AA_TEXT],
  ['peekViewResult.lineForeground', 'peekViewResult.background', AA_LARGE],
  ['peekViewResult.selectionForeground', 'peekViewResult.selectionBackground', AA_TEXT],
  ['peekViewTitleLabel.foreground', 'peekViewTitle.background', AA_TEXT],
  ['peekViewTitleDescription.foreground', 'peekViewTitle.background', AA_LARGE],

  ['settings.headerForeground', 'editor.background', AA_TEXT],
  ['welcomePage.tileBackground', 'editor.background', 1],
];

for (const [fgKey, bgKey, min] of UI_PAIRS) {
  check(`ui: ${fgKey} on ${bgKey}`, colors[fgKey], colors[bgKey], min);
}

// ---- Diagnostics and git decorations ---------------------------------------
for (const key of [
  'editorError.foreground',
  'editorWarning.foreground',
  'editorInfo.foreground',
  'problemsErrorIcon.foreground',
  'problemsWarningIcon.foreground',
  'problemsInfoIcon.foreground',
]) {
  check(`diagnostic: ${key}`, colors[key], EDITOR_BG, AA_LARGE);
}

for (const key of Object.keys(colors).filter((k) => k.startsWith('gitDecoration.'))) {
  // Git decorations render on the side bar, and ignored files are intentionally dim.
  const min = key.includes('ignored') ? 1 : AA_LARGE;
  check(`git: ${key}`, colors[key], colors['sideBar.background'], min);
}

// ---- Terminal ANSI colors --------------------------------------------------
for (const key of Object.keys(colors).filter((k) => k.startsWith('terminal.ansi'))) {
  // ansiBlack is a background swatch, not text; the dim variants are AA Large.
  if (key === 'terminal.ansiBlack') continue;

  const min = key === 'terminal.ansiBrightBlack' ? AA_LARGE : AA_TEXT;
  check(`terminal: ${key}`, colors[key], colors['terminal.background'], min);
}

// ---- Bracket pair colors ---------------------------------------------------
for (const key of Object.keys(colors).filter((k) =>
  k.startsWith('editorBracketHighlight.foreground')
)) {
  check(`bracket: ${key}`, colors[key], EDITOR_BG, AA_TEXT);
}

// ---- Selection must stay readable ------------------------------------------
// Text sits on top of the selection overlay, so contrast is measured against the
// composited result rather than the bare editor background.
{
  const { flatten } = await import('./contrast.mjs');
  const overSelection = flatten(colors['editor.selectionBackground'], EDITOR_BG);
  check('selection: editor.foreground over selection', colors['editor.foreground'], overSelection, AA_TEXT);
  check('selection: comment over selection', theme.tokenColors[0].settings.foreground, overSelection, AA_TEXT);

  const overLine = flatten(colors['editor.lineHighlightBackground'], EDITOR_BG);
  check('line highlight: editor.foreground over current line', colors['editor.foreground'], overLine, AA_TEXT);

  const overFind = flatten(colors['editor.findMatchBackground'], EDITOR_BG);
  check('find: editor.foreground over find match', colors['editor.foreground'], overFind, AA_TEXT);
}

// ---- Report ----------------------------------------------------------------
const failures = results.filter((r) => !r.pass);
const rows = verbose ? results : failures;

if (rows.length) {
  console.log(
    ['', 'RATIO'.padStart(7), ' MIN'.padStart(6), ' LEVEL'.padEnd(10), ' PAIR'].join('') + '\n'
  );

  for (const r of [...rows].sort((a, b) => a.ratio - b.ratio)) {
    console.log(
      `${r.pass ? '  ' : '✗ '}${r.ratio.toFixed(2).padStart(6)} ${String(r.min).padStart(5)} ` +
        `${rating(r.ratio).padEnd(10)} ${r.label}  (${r.fg} on ${r.bg})`
    );
  }
  console.log('');
}

const aaa = results.filter((r) => r.ratio >= 7).length;

console.log(
  `Checked ${results.length} color pairs — ${results.length - failures.length} pass, ` +
    `${failures.length} fail  (${aaa} at AAA)`
);

if (failures.length) {
  console.error(`\n${failures.length} pair(s) below the required contrast ratio.`);
  process.exit(1);
}
