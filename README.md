# ABM Theme

A balanced **light & dark theme for Visual Studio Code**, crafted for front-end development — comfortable, colorful, and easy on the eyes during long coding sessions.

- **ABM Light** — *Warm Paper*: an off-white, cream background with a restrained set of rich accents for comfortable daytime coding.
- **ABM Dark** — *Indigo Night*: a deep indigo-slate background with a wider, more colorful pastel palette for engaging nighttime coding.
- **ABM Dark Plus** — *Dark+ in ABM clothes*: VSCode Dark+'s exact syntax colors on an indigo-tinted workbench with a violet status bar, focus, and badges. Pick this if you want the familiar Dark+ code colors with the ABM look.
- **ABM Dusk** — *One Dark's spirit, original colors*: a muted medium-dark blue-slate background with desaturated, comfortable hues (not a copy of Atom One Dark — every value is original and WCAG-verified). Blue functions, green strings, purple keywords, red-rose tags, with the ABM violet accent on the workbench.
- **ABM Carbon** — *GitHub Dark's spirit, original colors*: a near-black blue-slate background with coral keywords, pale-blue strings, purple functions, and green tags (not a copy of GitHub Dark — every value is original and WCAG-verified). The deepest, most neutral dark of the family.
- **ABM Panda** — *Panda Syntax's spirit, original colors*: a soft gray canvas with candy-pastel syntax (pink keywords, cream strings, light-purple functions, cyan types, salmon tags) and a bold pink accent across the workbench.
- **ABM Vampire** — *Dracula's spirit, original colors*: a purple-slate night with magenta keywords, green functions, pale-yellow strings, purple constants, and cyan types, finished with a purple accent and status bar.
- **ABM Storm** — *WebStorm/Darcula's spirit, original colors*: a warm neutral gray IDE feel — orange keywords, olive-green strings, steel-blue numbers, golden functions — with understated chrome and a steel-blue accent.
- **ABM Kiln** — *an original concept, designed from scratch*: "a ceramics studio at night." A warm fired-clay canvas with glaze-inspired accents — cobalt keywords, celadon strings, honey numbers, copper functions, plum types, iron-rust tags — and a copper-glow status bar. The only warm-earth dark in the family, based on no existing theme.

Every theme is built entirely from original, WCAG-verified colors — none are copies. All share full workbench theming (terminal ANSI, git decorations, diff/merge, testing, and more) and identical front-end token coverage, and each keeps its own accent identity on the chrome.

## Install

**From the Marketplace** (once published): open the Extensions view (`Ctrl/Cmd+Shift+X`), search for `ABM Theme`, and install.

**From a `.vsix` file**:

```bash
code --install-extension abm-vscode-theme-1.0.0.vsix
```

or via the Extensions view → `⋯` → **Install from VSIX…**.

Then open the Command Palette (`Ctrl/Cmd+Shift+P`) → **Preferences: Color Theme** → pick **ABM Light** or **ABM Dark**.

## Front-end first

Syntax highlighting is tuned for the front-end stack:

- **HTML / JSX / TSX** — tags, components, and attributes each get their own color so markup structure reads at a glance
- **CSS / SCSS / Less** — selectors, properties, values, units, at-rules, pseudo-classes, and custom properties (`--vars` / `$vars`) are all distinguished
- **JavaScript / TypeScript** — functions, types, generics, object keys, template-literal expressions, regex, and decorators
- **JSON, YAML, Markdown** — configuration files and docs look intentional too
- **Vue / Svelte / Astro** — supported automatically through shared HTML/CSS/JS scopes

The same care extends to the workbench: tabs, sidebar, activity bar, status bar, a fully remapped terminal ANSI palette, find/replace, git decorations, the diff editor, and more.

## Palette

| Theme | Background | Keywords | Strings | Functions | Types | Tags | Accent |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ABM Dark | `#191B27` | `#BC93E6` | `#8FD694` | `#4ED0C8` | `#E9C983` | `#F08FB4` | violet `#8B8CF7` |
| ABM Light | `#FAF8F4` | `#7C4DCE` | `#257A54` | `#0B7580` | `#966906` | `#C73766` | violet `#6D4FD8` |
| ABM Dusk | `#242833` | `#A486D6` | `#8FBF82` | `#74A9F5` | `#D9B36A` | `#DB7A86` | violet `#8B8CF7` |
| ABM Carbon | `#10141A` | `#F08078` | `#A2CDF3` | `#C9A6F7` | `#F5A662` | `#7FDC8B` | violet `#8B8CF7` |
| ABM Panda | `#26282E` | `#F78FC6` | `#E5D58F` | `#B99CF0` | `#7BD0DC` | `#FF9E9E` | pink `#F78FC6` |
| ABM Vampire | `#262437` | `#F381C0` | `#F0EEA8` | `#6FDC86` | `#7FD8E8` | `#F381C0` | purple `#A98BF0` |
| ABM Storm | `#26272B` | `#E8964F` | `#9DB96A` | `#E8C476` | `#AB8BC8` | `#E8964F` | steel blue `#6FA3DC` |
| ABM Kiln | `#221C18` | `#82A7EC` | `#9CC7A5` | `#E08B55` | `#C79AD9` | `#EF7B6F` | copper `#E08B55` |

ABM Dark Plus uses VSCode Dark+'s exact syntax colors (`#569CD6` keywords, `#CE9178` strings, `#DCDCAA` functions, `#4EC9B0` types) on an indigo workbench with the violet accent.

Every syntax color is verified to meet WCAG AA contrast (≥ 4.5:1; comments and punctuation ≥ 3:1) against its background — see Development below.

## Development

No dependencies. Node.js 18+ required.

```bash
npm run check   # validate theme JSON + WCAG contrast ratios (run in CI before releasing)
npm run icon    # regenerate icon.png
npx @vscode/vsce package   # build a .vsix
```

## Publishing

```bash
npx @vscode/vsce login <publisher>
npx @vscode/vsce publish
```

Make sure `publisher` in `package.json` matches your Marketplace publisher ID. See the [vsce docs](https://code.visualstudio.com/api/working-with-extensions/publishing-extension).

## License

[MIT](./LICENSE)
