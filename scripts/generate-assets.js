import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Helper to create uncompressed/raw PNG buffer
function createPng(width, height, getPixelRgba) {
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixelRgba(x, y);
      const pxOffset = rowOffset + 1 + x * 4;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8-bit depth
  ihdr[9] = 6; // Color type 6 (RGBA)
  ihdr[10] = 0; // Compression (deflate)
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace (none)

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  const length = data.length;
  const chunk = Buffer.alloc(8 + length + 4);
  chunk.writeUInt32BE(length, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);

  const crcTarget = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crcVal = crc32(crcTarget);
  chunk.writeUInt32BE(crcVal >>> 0, 8 + length);
  return chunk;
}

// CRC32 implementation
function crc32(buf) {
  let table = [];
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ (-1)) >>> 0;
}

// 1. Generate Favicon PNG (64x64)
const faviconPng = createPng(64, 64, (x, y) => {
  // Rounded square border radius ~ 8
  const rx = Math.abs(x - 31.5);
  const ry = Math.abs(y - 31.5);
  if (rx > 28 || ry > 28) return [0, 0, 0, 0];

  // Draw Schtandart "S" shape in white
  // Top bar: y in [14, 22], x in [16, 47]
  // Top-left vertical: x in [16, 25], y in [14, 33]
  // Middle bar: y in [28, 36], x in [16, 47]
  // Bottom-right vertical: x in [38, 47], y in [31, 50]
  // Bottom bar: y in [42, 50], x in [16, 47]
  const isTopBar = (y >= 14 && y <= 21 && x >= 16 && x <= 47);
  const isTopLeft = (x >= 16 && x <= 25 && y >= 14 && y <= 33);
  const isMidBar = (y >= 28 && y <= 35 && x >= 16 && x <= 47);
  const isBottomRight = (x >= 38 && x <= 47 && y >= 31 && y <= 50);
  const isBottomBar = (y >= 42 && y <= 49 && x >= 16 && x <= 47);

  if (isTopBar || isTopLeft || isMidBar || isBottomRight || isBottomBar) {
    return [255, 255, 255, 255];
  }

  // Black background
  return [14, 17, 23, 255];
});
fs.writeFileSync(path.join(publicDir, 'favicon.png'), faviconPng);

// 2. Generate Marker PNG (38 x 50)
const markerPng = createPng(38, 50, (x, y) => {
  // Pin shape:
  // Top is rounded rect from y=0 to y=36, x from 2 to 35
  // Bottom is triangle from y=36 to y=49, pointing to (19, 49)
  let inside = false;
  if (y <= 36) {
    if (x >= 2 && x <= 35) {
      if ((y < 4 && (x < 6 || x > 31)) || (y > 32 && (x < 6 || x > 31))) {
        inside = false;
      } else {
        inside = true;
      }
    }
  } else if (y <= 49) {
    // Triangle from width 34 at y=36 down to width 2 at y=49
    const dy = y - 36;
    const halfWidth = 16 * (1 - dy / 13);
    if (Math.abs(x - 18.5) <= halfWidth) {
      inside = true;
    }
  }

  if (!inside) return [0, 0, 0, 0];

  // Inside marker: Black pin body
  // Now check "S" glyph centered in y in [8, 28], x in [9, 28]
  // Dimensions scaled:
  const isSTop = (y >= 8 && y <= 12 && x >= 9 && x <= 28);
  const isSTopL = (x >= 9 && x <= 15 && y >= 8 && y <= 19);
  const isSMid = (y >= 16 && y <= 20 && x >= 9 && x <= 28);
  const isSBotR = (x >= 22 && x <= 28 && y >= 17 && y <= 28);
  const isSBot = (y >= 24 && y <= 28 && x >= 9 && x <= 28);

  if (isSTop || isSTopL || isSMid || isSBotR || isSBot) {
    return [255, 255, 255, 255]; // Crisp white letter S
  }

  return [10, 12, 16, 255]; // Black pin
});
fs.writeFileSync(path.join(publicDir, 'marker.png'), markerPng);

// Also generate high-def SVG files for Marker and Logo
const markerSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="38" height="50" viewBox="0 0 38 50" fill="none">
  <path d="M4 4C4 1.79086 5.79086 0 8 0H30C32.2091 0 34 1.79086 34 4V32C34 34.2091 32.2091 36 30 36H24L19 49L14 36H8C5.79086 36 4 34.2091 4 32V4Z" fill="#0F172A"/>
  <path d="M9 8H29V13H15V17H29V28H9V23H23V19H9V8Z" fill="white"/>
</svg>`;
fs.writeFileSync(path.join(publicDir, 'marker.svg'), markerSvg);

const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 80" width="320" height="80" fill="none">
  <rect width="320" height="80" rx="10" fill="#0A0D14"/>
  <g fill="#FFFFFF">
    <!-- Stylized SCHTANDART -->
    <text x="160" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="900" letter-spacing="4" text-anchor="middle">SCHTANDART</text>
    <text x="160" y="65" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="400" letter-spacing="5" text-anchor="middle" fill="#CBD5E1">гарантия качества</text>
  </g>
</svg>`;
fs.writeFileSync(path.join(publicDir, 'logo.svg'), logoSvg);
fs.writeFileSync(path.join(publicDir, 'logo.png'), Buffer.from(logoSvg));

console.log('Assets created successfully in /public');
