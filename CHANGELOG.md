# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2026-10-14

### Added

- **ABM Panda** theme — Panda Syntax's soft-gray warmth in original colors: candy-pastel syntax with a pink accent and pink status bar.
- **ABM Vampire** theme — Dracula's candy-on-purple-night spirit in original colors: magenta keywords, green functions, pale-yellow strings, purple constants, on a purple-slate workbench with a purple accent.
- **ABM Storm** theme — WebStorm/Darcula's IDE feel in original colors: warm neutral gray, orange keywords, olive strings, steel-blue numbers, yellow functions, with an understated chrome and steel-blue accent.

## [1.3.0] - 2026-10-14

### Added

- **ABM Carbon** theme — GitHub Dark's spirit in original colors: near-black blue-slate background, coral keywords, pale-blue strings, purple functions, green tags. Not a copy — every value is original and WCAG-verified.

## [1.2.0] - 2026-10-14

### Added

- **ABM Dusk** theme — a muted, medium-dark blue-slate palette in the spirit of Atom One Dark, built entirely from original WCAG-verified colors (not a copy). Muted hues with the ABM violet accent retained on the workbench.

## [1.1.0] - 2026-10-14

### Added

- **ABM Dark Plus** theme — VSCode Dark+'s exact syntax highlighting on an ABM indigo-tinted workbench with the violet accent replacing VSCode's blue (status bar, focus, badges, buttons, tabs). Ideal if you love Dark+ code colors but want the ABM look.
- `npm run check` now validates all three themes; UI pairs a theme doesn't define are treated as inherited built-in defaults (skipped, not failed), and Dark+'s intentionally low-contrast regex/legacy scopes are recognized.

## [1.0.0] - 2026-10-11

### Added

- **ABM Light** theme — warm off-white "Warm Paper" palette for comfortable daytime coding.
- **ABM Dark** theme — colorful "Indigo Night" palette for engaging nighttime coding.
- Syntax highlighting tuned for front-end languages: HTML, CSS/SCSS/Less, JavaScript, TypeScript, JSX/TSX, JSON, YAML, and Markdown (Vue/Svelte/Astro inherit automatically).
- Full workbench UI theming: tabs, sidebar, activity bar, status bar, terminal (remapped ANSI palette), notifications, find/replace, git decorations, diff editor, and more.
- `npm run check` — WCAG contrast verification for all syntax and UI colors.
- `npm run icon` — regenerates the extension icon.
