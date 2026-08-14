/**
 * Renders the README preview images.
 *
 * The HTML is generated from themes/King-color-theme.json, so a preview can
 * never drift from the colors the theme actually ships. It is a faithful
 * rendering of the palette in a VS Code style layout, not a capture of a running
 * editor.
 *
 * Run: `npm run preview`
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { contrast, rating } from './contrast.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const theme = JSON.parse(readFileSync(join(ROOT, 'themes', 'King-color-theme.json'), 'utf8'));
const c = theme.colors;

/** Pulls a token color out of the theme by rule name so previews follow the theme. */
function token(name) {
  const rule = theme.tokenColors.find((t) => t.name === name);
  if (!rule) throw new Error(`No token rule named "${name}"`);
  return rule.settings.foreground;
}

const T = {
  comment: token('Comment'),
  string: token('String'),
  number: token('Number, constant, language literal'),
  keyword: token('Keyword'),
  operator: token('Operator'),
  punctuation: token('Punctuation'),
  func: token('Function and method'),
  type: token('Class, type, interface, enum'),
  variable: token('Variable'),
  parameter: token('Parameter'),
  property: token('Object property'),
  langVar: token('Language variable (this, self, super)'),
  decorator: token('Decorator and annotation'),
  tag: token('HTML/XML tag'),
  attribute: token('HTML/XML attribute'),
  heading: token('Markdown heading'),
};

/** Shorthand for a colored span. */
const s = (color, text, style = '') =>
  `<span style="color:${color}${style ? `;${style}` : ''}">${text}</span>`;

const kw = (t) => s(T.keyword, t);
const fn = (t) => s(T.func, t);
const ty = (t) => s(T.type, t);
const str = (t) => s(T.string, t);
const num = (t) => s(T.number, t);
const op = (t) => s(T.operator, t);
const pn = (t) => s(T.punctuation, t);
const va = (t) => s(T.variable, t);
const pa = (t) => s(T.parameter, t);
const pr = (t) => s(T.property, t);
const cm = (t) => s(T.comment, t, 'font-style:italic');

/** The sample file shown in the editor pane. */
const CODE_LINES = [
  `${cm('/** Awards a title to a member of the court. */')}`,
  `${kw('import')} ${pn('{')} ${va('Registry')} ${pn('}')} ${kw('from')} ${str("'./registry'")}${pn(';')}`,
  ``,
  `${kw('export')} ${kw('type')} ${ty('Rank')} ${op('=')} ${str("'duke'")} ${op('|')} ${str("'earl'")} ${op('|')} ${str("'baron'")}${pn(';')}`,
  ``,
  `${kw('export')} ${kw('interface')} ${ty('Peer')} ${pn('{')}`,
  `  ${pr('name')}${pn(':')} ${ty('string')}${pn(';')}`,
  `  ${pr('rank')}${pn(':')} ${ty('Rank')}${pn(';')}`,
  `  ${pr('granted')}${pn('?:')} ${ty('Date')}${pn(';')}`,
  `${pn('}')}`,
  ``,
  `${kw('const')} ${va('PRECEDENCE')}${pn(':')} ${ty('Record')}${pn('<')}${ty('Rank')}${pn(',')} ${ty('number')}${pn('> = {')}`,
  `  ${pr('duke')}${pn(':')} ${num('1')}${pn(',')} ${pr('earl')}${pn(':')} ${num('2')}${pn(',')} ${pr('baron')}${pn(':')} ${num('3')}${pn(',')}`,
  `${pn('};')}`,
  ``,
  `${kw('export')} ${kw('function')} ${fn('ennoble')}${pn('(')}${pa('peer')}${pn(':')} ${ty('Peer')}${pn(',')} ${pa('rank')}${pn(':')} ${ty('Rank')}${pn('):')} ${ty('Peer')} ${pn('{')}`,
  `  ${kw('if')} ${pn('(')}${ty('PRECEDENCE')}${pn('[')}${pa('rank')}${pn(']')} ${op('>=')} ${ty('PRECEDENCE')}${pn('[')}${pa('peer')}${pn('.')}${pr('rank')}${pn(']) {')}`,
  `    ${kw('throw')} ${kw('new')} ${ty('Error')}${pn('(')}${str('`Cannot demote ')}${pn('${')}${pa('peer')}${pn('.')}${pr('name')}${pn('}')}${str('`')}${pn(');')}`,
  `  ${pn('}')}`,
  ``,
  `  ${cm('// The crown grants; the registry remembers.')}`,
  `  ${ty('Registry')}${pn('.')}${fn('record')}${pn('(')}${pa('peer')}${pn('.')}${pr('name')}${pn(',')} ${pa('rank')}${pn(');')}`,
  ``,
  `  ${kw('return')} ${pn('{')} ${op('...')}${pa('peer')}${pn(',')} ${pr('rank')}${pn(',')} ${pr('granted')}${pn(':')} ${kw('new')} ${ty('Date')}${pn('()')} ${pn('};')}`,
  `${pn('}')}`,
];

/** The sample terminal session. */
const TERMINAL_LINES = [
  `${s(c['terminal.ansiMagenta'], '~/Code/royalty-theme')} ${s(c['terminal.ansiCyan'], 'main')} ${s(c['terminal.ansiYellow'], '❯')} npm run verify`,
  ``,
  `${s(c['terminal.ansiBrightBlack'], '>')} royaltytheme@3.0.0 verify`,
  `${s(c['terminal.ansiGreen'], '✔')} Wrote themes/King-color-theme.json`,
  `${s(c['terminal.ansiGreen'], '✔')} Checked ${s(c['terminal.ansiBrightWhite'], '174')} color pairs — ${s(c['terminal.ansiGreen'], '174 pass')}, ${s(c['terminal.ansiBrightBlack'], '0 fail')}  (${s(c['terminal.ansiYellow'], '158 at AAA')})`,
];

const FILE_TREE = [
  { label: 'themes', depth: 0, kind: 'folder' },
  { label: 'King-color-theme.json', depth: 1, kind: 'file', git: 'modified' },
  { label: 'scripts', depth: 0, kind: 'folder' },
  { label: 'build-theme.mjs', depth: 1, kind: 'file' },
  { label: 'check-contrast.mjs', depth: 1, kind: 'file', git: 'added' },
  { label: 'palette.mjs', depth: 1, kind: 'file', active: true },
  { label: 'README.md', depth: 0, kind: 'file', git: 'modified' },
  { label: 'package.json', depth: 0, kind: 'file' },
];

const gitColor = {
  modified: c['gitDecoration.modifiedResourceForeground'],
  added: c['gitDecoration.addedResourceForeground'],
};

const FONT = `'JetBrains Mono','Cascadia Code','Fira Code','SF Mono',Menlo,Consolas,monospace`;
const UI_FONT = `-apple-system,'Segoe UI',Ubuntu,'Helvetica Neue',sans-serif`;

/** Stroke-style icon paths on a 24x24 grid: files, search, source control, run, extensions. */
const ICONS = [
  'M4 4h6l2 2h8v12H4z',
  'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm5.5 12.5L21 21',
  'M7 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm0 4v10m0-4h6a3 3 0 0 0 3-3V9m0 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  'M7 4l13 8-13 8z',
  'M4 4h7v7H4zm9 0h7v7h-7zM4 13h7v7H4zm9 3h7m-3.5-3.5v7',
];

/** @param {string} path @param {string} color @param {number} size */
const svg = (path, color, size) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="${path}"/></svg>`;

/** Source-control branch mark used in the status bar. */
const branchIcon = (color) =>
  `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-1px"><path d="M7 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm0 4v10m0-4h6a3 3 0 0 0 3-3V9m0 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>`;

function editorPreview() {
  const gutter = CODE_LINES.map((_, i) => {
    const active = i === 15;
    return `<div style="color:${
      active ? c['editorLineNumber.activeForeground'] : c['editorLineNumber.foreground']
    }">${i + 1}</div>`;
  }).join('');

  const code = CODE_LINES.map((line, i) => {
    const active = i === 15;
    return `<div class="line"${
      active ? ` style="background:${c['editor.lineHighlightBackground']}"` : ''
    }>${line || '&nbsp;'}</div>`;
  }).join('');

  const tree = FILE_TREE.map((entry) => {
    const color = entry.git ? gitColor[entry.git] : c['sideBar.foreground'];
    const icon = entry.kind === 'folder' ? '▾' : '';
    return `<div class="row" style="${
      entry.active
        ? `background:${c['list.activeSelectionBackground']};color:${c['list.activeSelectionForeground']}`
        : `color:${color}`
    };padding-left:${12 + entry.depth * 14}px">
      <span style="opacity:.55;display:inline-block;width:12px">${icon}</span>${entry.label}
      ${entry.git ? `<span style="float:right;padding-right:12px;opacity:.9">${entry.git === 'added' ? 'A' : 'M'}</span>` : ''}
    </div>`;
  }).join('');

  // Inline SVG rather than glyphs — icon fonts are not guaranteed in the
  // rendering environment and missing glyphs show up as tofu boxes.
  const activity = ICONS.map(
    (path, i) => `<div class="act" style="${
      i === 0
        ? `border-left:2px solid ${c['activityBar.activeBorder']};background:${c['activityBar.activeBackground']}`
        : 'border-left:2px solid transparent'
    }">${svg(path, i === 0 ? c['activityBar.foreground'] : c['activityBar.inactiveForeground'], 21)}</div>`
  ).join('');

  return `<div class="window">
  <div class="titlebar">palette.mjs — Royalty VS Code Theme</div>
  <div class="body">
    <div class="activitybar">${activity}</div>
    <div class="sidebar">
      <div class="sidebar-title">EXPLORER</div>
      ${tree}
    </div>
    <div class="main">
      <div class="tabs">
        <div class="tab inactive">King-color-theme.json</div>
        <div class="tab active">palette.mjs</div>
        <div class="tab inactive">README.md</div>
      </div>
      <div class="breadcrumb">scripts <span style="opacity:.5">›</span> <span style="color:${c['breadcrumb.activeSelectionForeground']}">palette.mjs</span></div>
      <div class="editor">
        <div class="gutter">${gutter}</div>
        <div class="code">${code}</div>
      </div>
      <div class="panel">
        <div class="panel-tabs">
          <span class="ptab active">TERMINAL</span>
          <span class="ptab">PROBLEMS</span>
          <span class="ptab">OUTPUT</span>
        </div>
        <div class="terminal">${TERMINAL_LINES.map((l) => `<div>${l || '&nbsp;'}</div>`).join('')}</div>
      </div>
    </div>
  </div>
  <div class="statusbar">
    <span style="background:${c['statusBarItem.remoteBackground']};color:${c['statusBarItem.remoteForeground']};padding:0 8px;margin-right:8px">WSL: Ubuntu</span>
    <span>${branchIcon(c['statusBar.foreground'])} main*</span>
    <span style="color:${c['statusBar.foreground']}">✔ 174 pass</span>
    <span style="margin-left:auto">Ln 16, Col 24</span>
    <span>Spaces: 2</span>
    <span>UTF-8</span>
    <span>JavaScript</span>
  </div>
</div>`;
}

function paletteSwatches() {
  const groups = [
    {
      title: 'Syntax',
      items: [
        ['Keyword / storage', T.keyword],
        ['Type / class', T.type],
        ['Function', T.func],
        ['String', T.string],
        ['Number / constant', T.number],
        ['Parameter', T.parameter],
        ['Variable / property', T.variable],
        ['Comment', T.comment],
        ['Operator / punctuation', T.punctuation],
      ],
    },
    {
      title: 'Interface',
      items: [
        ['Editor text', c['editor.foreground']],
        ['Chrome text', c.foreground],
        ['Muted text', c.descriptionForeground],
        ['Line numbers', c['editorLineNumber.foreground']],
        ['Gold accent', c['editorCursor.foreground']],
        ['Purple accent', c.focusBorder],
      ],
    },
    {
      title: 'Status',
      items: [
        ['Error', c['editorError.foreground']],
        ['Warning', c['editorWarning.foreground']],
        ['Info', c['editorInfo.foreground']],
        ['Added', c['gitDecoration.addedResourceForeground']],
        ['Modified', c['gitDecoration.modifiedResourceForeground']],
        ['Deleted', c['gitDecoration.deletedResourceForeground']],
      ],
    },
  ];

  const bgc = c['editor.background'];

  const rendered = groups
    .map(
      (g) => `<div class="group">
      <div class="group-title">${g.title}</div>
      ${g.items
        .map(([label, color]) => {
          const ratio = contrast(color, bgc);
          const level = rating(ratio);
          return `<div class="swatch">
            <span class="chip" style="background:${color}"></span>
            <span class="sw-label">${label}</span>
            <span class="sw-hex">${color.toUpperCase()}</span>
            <span class="sw-ratio">${ratio.toFixed(1)}:1</span>
            <span class="sw-level ${level === 'AAA' ? 'aaa' : 'aa'}">${level}</span>
          </div>`;
        })
        .join('')}
    </div>`
    )
    .join('');

  return `<div class="palette">
    <div class="pal-head">
      <div class="pal-title">Royalty · King</div>
      <div class="pal-sub">Every color measured against the editor background <code>${bgc.toUpperCase()}</code> — 174 pairs checked, 0 below WCAG AA.</div>
    </div>
    <div class="groups">${rendered}</div>
  </div>`;
}

const html = `<!doctype html>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: ${c['editor.background']};
    font-family: ${UI_FONT};
    -webkit-font-smoothing: antialiased;
  }
  .shot { width: 1280px; padding: 32px; }

  /* ---- Window chrome ---- */
  .window {
    width: 1216px;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 24px 60px rgba(0,0,0,.55);
    border: 1px solid ${c['widget.border']};
    display: flex;
    flex-direction: column;
  }
  .titlebar {
    background: ${c['titleBar.activeBackground']};
    color: ${c['titleBar.activeForeground']};
    font-size: 12px;
    text-align: center;
    padding: 9px;
    border-bottom: 1px solid ${c['titleBar.border']};
  }
  /* Sized so the code sample ends on a whole line rather than clipping one in half. */
  .body { display: flex; height: 730px; }
  .activitybar {
    width: 48px;
    background: ${c['activityBar.background']};
    padding-top: 8px;
    border-right: 1px solid ${c['activityBar.border']};
  }
  .act { height: 44px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
  .sidebar {
    width: 232px;
    background: ${c['sideBar.background']};
    border-right: 1px solid ${c['sideBar.border']};
    font-size: 12.5px;
  }
  .sidebar-title {
    color: ${c['sideBarTitle.foreground']};
    font-size: 10.5px;
    letter-spacing: .09em;
    padding: 11px 12px 8px;
  }
  .row { padding: 4px 0; line-height: 18px; }
  .main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
  .tabs { display: flex; background: ${c['editorGroupHeader.tabsBackground']}; }
  .tab {
    padding: 9px 16px;
    font-size: 12.5px;
    border-right: 1px solid ${c['tab.border']};
  }
  .tab.active {
    background: ${c['tab.activeBackground']};
    color: ${c['tab.activeForeground']};
    border-top: 2px solid ${c['tab.activeBorderTop']};
    padding-top: 7px;
  }
  .tab.inactive {
    background: ${c['tab.inactiveBackground']};
    color: ${c['tab.inactiveForeground']};
    border-top: 2px solid transparent;
    padding-top: 7px;
  }
  .breadcrumb {
    background: ${c['breadcrumb.background']};
    color: ${c['breadcrumb.foreground']};
    font-size: 11.5px;
    padding: 6px 16px;
  }
  .editor {
    flex: 1;
    background: ${c['editor.background']};
    display: flex;
    font-family: ${FONT};
    font-size: 13px;
    line-height: 20px;
    padding-top: 6px;
    overflow: hidden;
  }
  .gutter { text-align: right; padding: 0 14px 0 18px; font-size: 12px; user-select: none; }
  .code { flex: 1; color: ${c['editor.foreground']}; white-space: pre; }
  .line { padding: 0 12px; margin: 0 -12px; }

  /* ---- Panel ---- */
  .panel {
    height: 150px;
    background: ${c['panel.background']};
    border-top: 1px solid ${c['panel.border']};
  }
  .panel-tabs { padding: 8px 16px 6px; font-size: 10.5px; letter-spacing: .08em; }
  .ptab { color: ${c['panelTitle.inactiveForeground']}; margin-right: 18px; }
  .ptab.active {
    color: ${c['panelTitle.activeForeground']};
    border-bottom: 1px solid ${c['panelTitle.activeBorder']};
    padding-bottom: 5px;
  }
  .terminal {
    font-family: ${FONT};
    font-size: 12.5px;
    line-height: 20px;
    color: ${c['terminal.foreground']};
    padding: 8px 16px;
  }

  /* ---- Status bar ---- */
  .statusbar {
    background: ${c['statusBar.background']};
    color: ${c['statusBar.foreground']};
    font-size: 11.5px;
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 5px 0 5px 0;
    border-top: 1px solid ${c['statusBar.border']};
  }
  .statusbar > span:last-child { padding-right: 14px; }

  /* ---- Palette sheet ---- */
  .palette { width: 1216px; padding: 36px 40px 40px; }
  .pal-title { color: ${c['editorCursor.foreground']}; font-size: 26px; font-weight: 600; letter-spacing: .01em; }
  .pal-sub { color: ${c.descriptionForeground}; font-size: 13.5px; margin-top: 7px; }
  .pal-sub code { font-family: ${FONT}; color: ${c['editor.foreground']}; }
  .groups { display: grid; grid-template-columns: repeat(3, 1fr); gap: 26px; margin-top: 30px; }
  .group {
    background: ${c['editorWidget.background']};
    border: 1px solid ${c['widget.border']};
    border-radius: 9px;
    padding: 16px 18px 18px;
  }
  .group-title {
    color: ${c['sideBarTitle.foreground']};
    font-size: 10.5px;
    letter-spacing: .1em;
    margin-bottom: 12px;
  }
  .swatch { display: flex; align-items: center; gap: 9px; padding: 5px 0; font-size: 12px; }
  .chip { width: 15px; height: 15px; border-radius: 4px; flex: none; }
  .sw-label { color: ${c['editor.foreground']}; flex: 1; }
  .sw-hex { font-family: ${FONT}; font-size: 10.5px; color: ${c.descriptionForeground}; }
  .sw-ratio { font-family: ${FONT}; font-size: 10.5px; color: ${c['editor.foreground']}; width: 40px; text-align: right; }
  .sw-level {
    font-size: 9px;
    letter-spacing: .05em;
    padding: 2px 5px;
    border-radius: 3px;
    width: 32px;
    text-align: center;
  }
  .sw-level.aaa { background: ${c['gitDecoration.addedResourceForeground']}; color: ${c['editor.background']}; }
  .sw-level.aa { background: ${c['gitDecoration.modifiedResourceForeground']}; color: ${c['editor.background']}; }
</style>
<div class="shot" id="editor-shot">${editorPreview()}</div>
<div class="shot" id="palette-shot">${paletteSwatches()}</div>
`;

mkdirSync(join(ROOT, 'assets'), { recursive: true });
const out = join(ROOT, 'assets', 'preview.html');
writeFileSync(out, html, 'utf8');

console.log(`Wrote ${out}`);
console.log('Screenshot #editor-shot -> assets/preview-editor.png');
console.log('Screenshot #palette-shot -> assets/preview-palette.png');
