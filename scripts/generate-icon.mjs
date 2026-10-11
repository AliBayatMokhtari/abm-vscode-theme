#!/usr/bin/env node
// Regenerates icon.png (128x128) with zero dependencies.
// Design: rounded square split diagonally — warm paper (top-left) vs indigo night
// (bottom-right) — with a "</>" mark whose strokes switch accent shades across
// the diagonal, mirroring the theme's dual modes.
import { deflateSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';

const W = 128;
const H = 128;
const buf = new Uint8Array(W * H * 4);

const PAPER = [0xfa, 0xf8, 0xf4];
const INDIGO = [0x19, 0x1b, 0x27];
const SEAM = [0x8b, 0x8c, 0xf7];

// Glyph accent colors: dark variants read on the paper half, light variants on the indigo half.
const ACCENTS = {
  left:   { paper: [0x7c, 0x4d, 0xce], indigo: [0xbc, 0x93, 0xe6] }, // <
  slash:  { paper: [0x0b, 0x75, 0x80], indigo: [0x4e, 0xd0, 0xc8] }, // /
  right:  { paper: [0xc7, 0x37, 0x66], indigo: [0xf0, 0x8f, 0xb4] }  // >
};

const blend = (x, y, [r, g, b], a) => {
  const i = (y * W + x) * 4;
  const sa = a / 255;
  buf[i] = Math.round(r * sa + buf[i] * (1 - sa));
  buf[i + 1] = Math.round(g * sa + buf[i + 1] * (1 - sa));
  buf[i + 2] = Math.round(b * sa + buf[i + 2] * (1 - sa));
  buf[i + 3] = 255;
};

const clamp01 = (v) => Math.max(0, Math.min(1, v));

// Signed distance to a rounded rectangle centered in the canvas.
const sdRoundRect = (px, py, hw, hh, r) => {
  const qx = Math.abs(px) - (hw - r);
  const qy = Math.abs(py) - (hh - r);
  const ax = Math.max(qx, 0);
  const ay = Math.max(qy, 0);
  return Math.hypot(ax, ay) + Math.min(Math.max(qx, qy), 0) - r;
};

// Distance from point to line segment.
const sdSegment = (px, py, x1, y1, x2, y2) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const t = clamp01(((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
};

const glyphSegments = [
  // <
  { x1: 50, y1: 52, x2: 38, y2: 64, w: 6.5, accent: 'left' },
  { x1: 38, y1: 64, x2: 50, y2: 76, w: 6.5, accent: 'left' },
  // /
  { x1: 58, y1: 80, x2: 70, y2: 48, w: 7, accent: 'slash' },
  // >
  { x1: 78, y1: 52, x2: 90, y2: 64, w: 6.5, accent: 'right' },
  { x1: 90, y1: 64, x2: 78, y2: 76, w: 6.5, accent: 'right' }
];

for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const d = sdRoundRect(x + 0.5 - 64, y + 0.5 - 64, 56, 56, 26);
    if (d >= 0.5) continue;
    const shapeAlpha = clamp01(0.5 - d);

    const onPaper = x + y < W;
    const base = onPaper ? PAPER : INDIGO;
    blend(x, y, base, 255 * shapeAlpha);

    // Subtle seam along the diagonal.
    const seamDist = Math.abs(x + y - W);
    if (seamDist < 2.5) {
      blend(x, y, SEAM, 0.55 * 255 * clamp01(1 - seamDist / 2.5) * shapeAlpha);
    }

    // "</>" mark.
    for (const s of glyphSegments) {
      const gd = sdSegment(x + 0.5, y + 0.5, s.x1, s.y1, s.x2, s.y2) - s.w / 2;
      if (gd < 0.5) {
        const color = ACCENTS[s.accent][onPaper ? 'paper' : 'indigo'];
        blend(x, y, color, 255 * clamp01(0.5 - gd) * shapeAlpha);
      }
    }
  }
}

// --- Minimal PNG encoder -----------------------------------------------------
const crcTable = new Int32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  crcTable[n] = c;
}
const crc32 = (bytes) => {
  let c = 0xffffffff;
  for (const b of bytes) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, 'ascii');
  data.copy(out, 8);
  out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length);
  return out;
};

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8;  // bit depth
ihdr[9] = 6;  // color type: RGBA
// Filter type 0 per scanline.
const raw = Buffer.alloc(H * (1 + W * 4));
for (let y = 0; y < H; y++) {
  raw[y * (1 + W * 4)] = 0;
  Buffer.from(buf.buffer, y * W * 4, W * 4).copy(raw, y * (1 + W * 4) + 1);
}

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0))
]);

writeFileSync(new URL('../icon.png', import.meta.url), png);
console.log(`icon.png written (${png.length} bytes, ${W}x${H})`);
