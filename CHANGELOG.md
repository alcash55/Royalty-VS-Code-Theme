# Change Log

All notable changes to the "Royalty VS Code Theme" extension are documented in this file.

This project follows [Keep a Changelog](http://keepachangelog.com/) and
[Semantic Versioning](https://semver.org/).

## [3.0.0] — 2026-08-14

A full visual rebuild. The theme keeps its purple-and-gold identity but is now legible: every
color it ships is measured against WCAG contrast minimums, and the build fails if any falls short.

### Changed

- **Editor background moved to a deep plum** (`#4a4063` → `#1A1426`). The old mid-tone ground was
  the root cause of the contrast problems — it left no room for foregrounds to separate from it.
- **Syntax palette rebuilt.** The neon green (`#2bff00`), hot pink (`#ff439b`), orange-red
  (`#ea4716`) and pure yellow (`#ffe300`) mix is replaced by six desaturated hues — violet, gold,
  cyan, sage, rose and peach — that stay distinguishable without competing.
- **Gold is now an accent, not a default.** It previously colored line numbers, indent guides,
  whitespace markers, terminal text, input text and the title bar simultaneously. It now marks the
  cursor, the active line number, badges, buttons and the active tab.
- **Body text softened** from `#ffffff` to `#E9E4F2` to cut glare on a dark ground.
- **Token rules reorganized by role rather than by language.** 241 mostly per-language rules became
  43 scope-level rules, so languages without a bespoke rule are themed correctly rather than
  falling through to editor defaults.
- **Title bar, status bar and activity bar unified** on the darkest surface. The title bar was
  previously translucent gold with white text on top of it.

### Added

- **Contrast gate** (`npm run check`) covering syntax tokens, semantic tokens, workbench text on
  its own surface, terminal ANSI colors, bracket pair colors, and text read through the
  translucent selection, current-line and find-match overlays. 174 pairs, 0 failures, 158 at AAA.
- **Generated theme.** `scripts/palette.mjs` is the single source of truth; the theme JSON is a
  build artifact produced by `npm run build`.
- **Semantic highlighting** expanded from 3 rules to 31, covering types, functions, parameters,
  properties, decorators, default-library symbols and deprecated symbols.
- **Workbench coverage** widened from 262 to 396 colors: bracket pair colorization, inlay hints,
  sticky scroll, peek view, notebooks, testing, merge conflicts, debug icons, charts, and a full
  16-color ANSI terminal palette.
- New preview screenshots, rendered from the theme JSON so they cannot drift from what ships.

### Fixed

- Five of nine syntax colors were below WCAG AA against the editor background, including keywords
  at 2.96:1 and storage types at 2.45:1 — roughly half the readable minimum on two of the most
  common token types in any file.
- Comments are now readable while selected. Text under the selection overlay was previously never
  accounted for.
- Removed `royalty-theme-color-theme.json`, an untracked duplicate of the shipped theme file.

## [2.2.0]

- Theme color adjustments and updated demo image.

## [2.1.0]

- Updated display name.

## [2.0.0]

- Style, README, package and icon updates.

## [1.0.0]

- Initial release.
