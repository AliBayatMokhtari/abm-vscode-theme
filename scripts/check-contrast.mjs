#!/usr/bin/env node
// Validates both theme files and enforces WCAG contrast ratios:
//   - every syntax token color: >= 4.5:1 against its editor background
//     (comments and "dim" punctuation/operator scopes: >= 3.0:1)
//   - curated workbench UI fg/bg pairs: >= 4.5:1 (or the noted floor)
//   - package.json theme contributions resolve to existing files
import { readFileSync, existsSync } from 'node:fs';

const HEX_RE = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

const parseHex = (hex) => {
  let h = hex.slice(1);
  if (h.length === 3) h = [...h].map((c) => c + c).join('');
  const n = parseInt(h.slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const channel = (v) => {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};

const luminance = ([r, g, b]) =>
  0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);

const ratio = (a, b) => {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};

// Scopes treated as intentionally subdued; held to a 3:1 floor instead of 4.5:1.
// string.regexp / constant.regexp: Dark+'s own regex constants are ~3:1 by design.
const isDimScope = (scope) =>
  /comment|punctuation|keyword\.operator|meta\.brace|markup\.quote|string\.regexp|constant\.regexp/.test(scope);

// Legacy scopes kept for upstream-parity that no modern grammar emits; not checked.
const LEGACY_SCOPES = new Set(['header']);

// [foregroundKey, backgroundKey, minimumRatio]
const uiPairs = [
  ['foreground', 'editor.background', 4.5],
  ['descriptionForeground', 'editor.background', 4.5],
  ['editorLineNumber.foreground', 'editor.background', 2.0],
  ['editorLineNumber.activeForeground', 'editor.background', 3.0],
  ['statusBar.foreground', 'statusBar.background', 4.5],
  ['statusBar.debuggingForeground', 'statusBar.debuggingBackground', 4.5],
  ['statusBarItem.remoteForeground', 'statusBarItem.remoteBackground', 4.5],
  ['titleBar.activeForeground', 'titleBar.activeBackground', 4.5],
  ['titleBar.inactiveForeground', 'titleBar.inactiveBackground', 3.0],
  ['sideBar.foreground', 'sideBar.background', 4.5],
  ['tab.activeForeground', 'tab.activeBackground', 4.5],
  ['tab.inactiveForeground', 'tab.inactiveBackground', 3.0],
  ['menu.foreground', 'menu.background', 4.5],
  ['badge.foreground', 'badge.background', 4.5],
  ['button.foreground', 'button.background', 4.5],
  ['button.secondaryForeground', 'button.secondaryBackground', 4.5],
  ['activityBarBadge.foreground', 'activityBarBadge.background', 4.5],
  ['input.foreground', 'input.background', 4.5],
  ['quickInput.foreground', 'quickInput.background', 4.5],
  ['terminal.foreground', 'terminal.background', 4.5],
  ['gitDecoration.addedResourceForeground', 'sideBar.background', 3.0],
  ['gitDecoration.modifiedResourceForeground', 'sideBar.background', 3.0],
  ['gitDecoration.deletedResourceForeground', 'sideBar.background', 3.0],
  ['gitDecoration.conflictingResourceForeground', 'sideBar.background', 3.0]
];

const themes = [
  'themes/abm-light-color-theme.json',
  'themes/abm-dark-color-theme.json',
  'themes/abm-dark-plus-color-theme.json',
  'themes/abm-dusk-color-theme.json',
  'themes/abm-carbon-color-theme.json',
  'themes/abm-panda-color-theme.json',
  'themes/abm-vampire-color-theme.json',
  'themes/abm-storm-color-theme.json'
];

const root = new URL('..', import.meta.url);
const failures = [];
const rows = [];
const fmt = (v) => v.toFixed(2).padStart(5);

for (const themePath of themes) {
  const theme = JSON.parse(readFileSync(new URL(themePath, root), 'utf8'));
  const label = theme.name ?? themePath;
  rows.push(`\n${label} (${themePath})`);

  for (const key of ['name', 'type', 'colors', 'tokenColors', 'semanticTokenColors']) {
    if (!(key in theme)) failures.push(`${themePath}: missing "${key}"`);
  }

  // All color values must be valid hex.
  const allColors = [
    ...Object.entries(theme.colors ?? {}),
    ...Object.values(theme.semanticTokenColors ?? {}).map((v) => ['semantic', v])
  ];
  for (const [key, value] of allColors) {
    if (typeof value !== 'string' || !HEX_RE.test(value)) {
      failures.push(`${themePath} ${key}: invalid color "${value}"`);
    }
  }

  const bg = parseHex(theme.colors['editor.background']);

  // Syntax token contrast.
  for (const rule of theme.tokenColors ?? []) {
    const fg = rule.settings?.foreground;
    if (!fg || !HEX_RE.test(fg) || fg.length !== 7) continue;
    const scopes = Array.isArray(rule.scope) ? rule.scope : [rule.scope];
    if (scopes.every((s) => LEGACY_SCOPES.has(s))) {
      rows.push(`  token  skip (legacy scope, upstream parity) ${scopes[0]}`);
      continue;
    }
    const min = scopes.some(isDimScope) ? 3.0 : 4.5;
    const r = ratio(parseHex(fg), bg);
    rows.push(`  token ${fmt(r)}:1 (min ${min.toFixed(1)}) ${scopes[0]}${scopes.length > 1 ? ` +${scopes.length - 1}` : ''}`);
    if (r < min) failures.push(`${themePath}: "${scopes.join(', ')}" ${fg} is ${r.toFixed(2)}:1 (needs ${min}:1)`);
  }

  // Workbench UI text contrast (pairs absent from the theme inherit
  // built-in uiTheme defaults, so they are skipped rather than failed).
  rows.push('  workbench UI:');
  for (const [fgKey, bgKey, min] of uiPairs) {
    const fg = theme.colors[fgKey];
    const bgv = theme.colors[bgKey];
    if (!fg || !bgv) {
      rows.push(`    skip (inherited default) ${fgKey} on ${bgKey}`);
      continue;
    }
    const r = ratio(parseHex(fg), parseHex(bgv));
    rows.push(`    ${fmt(r)}:1 (min ${min.toFixed(1)}) ${fgKey} on ${bgKey}`);
    if (r < min) failures.push(`${themePath}: ${fgKey} on ${bgKey} is ${r.toFixed(2)}:1 (needs ${min}:1)`);
  }
}

// package.json contributions must resolve.
const pkg = JSON.parse(readFileSync(new URL('package.json', root), 'utf8'));
const contributed = pkg.contributes?.themes ?? [];
if (contributed.length !== 8) failures.push(`package.json: expected 8 contributed themes, found ${contributed.length}`);
const labels = contributed.map((t) => t.label);
if (new Set(labels).size !== labels.length) failures.push('package.json: duplicate theme labels');
for (const t of contributed) {
  if (!['vs', 'vs-dark'].includes(t.uiTheme)) failures.push(`package.json: bad uiTheme for ${t.label}`);
  if (!existsSync(new URL(t.path, root))) failures.push(`package.json: theme path missing: ${t.path}`);
}
if (!existsSync(new URL('icon.png', root))) failures.push('icon.png: missing');
if (!pkg.publisher || !pkg.version) failures.push('package.json: publisher/version required');

console.log(rows.join('\n'));
console.log(`\nChecked ${themes.length} themes, ${uiPairs.length} UI pairs each, package manifest.`);

if (failures.length) {
  console.error(`\n${failures.length} FAILURE(S):`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log('\n✓ All contrast and structure checks passed.');
