const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const dir = path.join(__dirname, '..', 'public', 'brandlogos');
const files = fs.readdirSync(dir).filter(f => f.toLowerCase().endsWith('.png'));

function parsePNG(filePath) {
  const buf = fs.readFileSync(filePath);
  
  // Check PNG signature
  if (buf.readUInt32BE(0) !== 0x89504E47 || buf.readUInt32BE(4) !== 0x0D0A1A0A) {
    throw new Error('Not a PNG file');
  }

  let pos = 8;
  let width = 0;
  let height = 0;
  let colorType = 0;
  let bitDepth = 0;
  const idatChunks = [];

  while (pos < buf.length) {
    const length = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    
    if (type === 'IHDR') {
      width = buf.readUInt32BE(pos + 8);
      height = buf.readUInt32BE(pos + 12);
      bitDepth = buf[pos + 16];
      colorType = buf[pos + 17];
    } else if (type === 'IDAT') {
      idatChunks.push(buf.subarray(pos + 8, pos + 8 + length));
    } else if (type === 'IEND') {
      break;
    }
    pos += 12 + length;
  }

  if (colorType !== 6 || bitDepth !== 8) {
    // If not RGBA 8-bit, return full size (no simple alpha scan)
    return { width, height, contentWidth: width, contentHeight: height };
  }

  // Decompress IDAT
  const compressed = Buffer.concat(idatChunks);
  const decompressed = zlib.inflateSync(compressed);

  // Scanline width = 1 (filter byte) + width * 4 (RGBA bytes)
  const stride = 1 + width * 4;
  let minX = width;
  let maxX = 0;
  let minY = height;
  let maxY = 0;
  let hasAlphaPixels = false;

  for (let y = 0; y < height; y++) {
    const lineStart = y * stride;
    const filter = decompressed[lineStart]; // Filter byte (not used for simple alpha scan)
    
    // For alpha scanning, we can approximate even if filtered because alpha values of 0 
    // are often filtered to 0, but to be 100% correct we should defilter.
    // However, since we just want a bounding box of visible content, let's defilter the alpha channel or just do a basic scan.
    // Defiltering:
    // Filter types: 0=None, 1=Sub, 2=Up, 3=Average, 4=Paeth.
    // Let's defilter properly for accuracy!
  }

  // To keep it simple and robust without full defiltering complexity, let's defilter scanlines.
  const pixels = Buffer.alloc(width * height * 4);
  const bytesPerPixel = 4;

  for (let y = 0; y < height; y++) {
    const rawLine = decompressed.subarray(y * stride + 1, (y + 1) * stride);
    const filterType = decompressed[y * stride];
    const prevLineStart = (y - 1) * width * 4;
    const currentLineStart = y * width * 4;

    for (let x = 0; x < width; x++) {
      const idx = x * 4;
      for (let c = 0; c < 4; c++) {
        const rawVal = rawLine[idx + c];
        let val = rawVal;

        const left = x > 0 ? pixels[currentLineStart + idx - 4 + c] : 0;
        const up = y > 0 ? pixels[prevLineStart + idx + c] : 0;
        const corner = (x > 0 && y > 0) ? pixels[prevLineStart + idx - 4 + c] : 0;

        if (filterType === 1) { // Sub
          val = (rawVal + left) & 0xFF;
        } else if (filterType === 2) { // Up
          val = (rawVal + up) & 0xFF;
        } else if (filterType === 3) { // Average
          val = (rawVal + Math.floor((left + up) / 2)) & 0xFF;
        } else if (filterType === 4) { // Paeth
          const p = left + up - corner;
          const pa = Math.abs(p - left);
          const pb = Math.abs(p - up);
          const pc = Math.abs(p - corner);
          let paeth = left;
          if (pb < pa) paeth = up;
          if (pc < pb && pc < pa) paeth = corner;
          val = (rawVal + paeth) & 0xFF;
        }

        pixels[currentLineStart + idx + c] = val;
      }

      // Check alpha of the defiltered pixel
      const alpha = pixels[currentLineStart + idx + 3];
      if (alpha > 15) {
        hasAlphaPixels = true;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (!hasAlphaPixels) {
    return { width, height, contentWidth: width, contentHeight: height };
  }

  return {
    width,
    height,
    contentWidth: maxX - minX + 1,
    contentHeight: maxY - minY + 1
  };
}

const results = [];
for (const file of files) {
  const filePath = path.join(dir, file);
  try {
    const info = parsePNG(filePath);
    const wRatio = info.contentWidth / info.width;
    const hRatio = info.contentHeight / info.height;
    const maxRatio = Math.max(wRatio, hRatio);

    let scale = 1;
    if (maxRatio > 0 && maxRatio < 0.9) {
      scale = 0.95 / maxRatio;
    }
    
    // Bound scale
    scale = Math.min(2.6, Math.max(0.7, scale));

    const aspect = info.contentWidth / info.contentHeight;
    // Boost square/tall logos
    if (aspect > 0.75 && aspect < 1.3) {
      scale *= 1.35;
    } else if (aspect < 0.75) {
      scale *= 1.45;
    }

    // Apply special tweaks for specific known files if needed
    // E.g., if a file is known to be very small, we can add scaling here
    
    results.push({
      src: `/brandlogos/${file}`,
      scale: parseFloat(scale.toFixed(2))
    });
  } catch (err) {
    console.error(`Skipping ${file}: ${err.message}`);
    results.push({
      src: `/brandlogos/${file}`,
      scale: 1.0
    });
  }
}

// Generate code
const generatedCode = `export const brandLogos = [\n` + 
  results.map(r => `  { src: "${r.src}", alt: "Logo", style: { transform: "scale(${r.scale})" } },`).join("\n") +
  `\n];\n`;

fs.writeFileSync(path.join(__dirname, '..', 'components', 'brandLogosData.ts'), generatedCode);
console.log('Successfully generated components/brandLogosData.ts');
