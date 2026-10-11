# ABM Theme

A balanced **light & dark theme for Visual Studio Code**, crafted for front-end development — comfortable, colorful, and easy on the eyes during long coding sessions.

- **ABM Light** — *Warm Paper*: an off-white, cream background with a restrained set of rich accents for comfortable daytime coding.
- **ABM Dark** — *Indigo Night*: a deep indigo-slate background with a wider, more colorful pastel palette for engaging nighttime coding.

Both variants share the same visual identity and the same semantic color roles (tags are always rose, functions are always teal, properties are always blue…), so switching between them feels like the same theme in a different light.

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

| Role | ABM Dark (Indigo Night) | ABM Light (Warm Paper) |
| --- | --- | --- |
| Editor background | `#191B27` | `#FAF8F4` |
| Editor foreground | `#E8EAF6` | `#37353F` |
| Keywords | `#BC93E6` | `#7C4DCE` |
| Strings | `#8FD694` | `#257A54` |
| Numbers & constants | `#F5A370` | `#A85A1B` |
| Functions | `#4ED0C8` | `#0B7580` |
| Types & classes | `#E9C983` | `#966906` |
| Tags & selectors | `#F08FB4` | `#C73766` |
| Attributes & properties | `#8FA8F8` | `#3B62D6` |
| `this` / `super` | `#F08FB4` *italic* | `#C4314F` *italic* |
| Comments | `#6B7194` *italic* | `#8A8798` *italic* |

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
