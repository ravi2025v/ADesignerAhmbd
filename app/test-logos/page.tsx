import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// CRC table for PNG encoding
const crcTable = new Int32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) {
      c = 0xedb88320 ^ (c >>> 1);
    } else {
      c = c >>> 1;
    }
  }
  crcTable[n] = c;
}

function crc32(buf: Buffer): number {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

function encodePNG(width: number, height: number, rgbaPixels: Buffer): Buffer {
  const chunks: Buffer[] = [];

  // 1. Signature
  chunks.push(Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]));

  // 2. IHDR Chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  const ihdrChunk = Buffer.alloc(4 + 4 + 13 + 4);
  ihdrChunk.writeUInt32BE(13, 0);
  ihdrChunk.write('IHDR', 4, 'ascii');
  ihdrData.copy(ihdrChunk, 8);
  ihdrChunk.writeUInt32BE(crc32(ihdrChunk.subarray(4, 21)), 21);
  chunks.push(ihdrChunk);

  // 3. IDAT Chunk (pixels with filter byte 0 at start of each scanline)
  const stride = 1 + width * 4;
  const idatRaw = Buffer.alloc(height * stride);
  for (let y = 0; y < height; y++) {
    idatRaw[y * stride] = 0; // Filter type 0 (None)
    rgbaPixels.copy(idatRaw, y * stride + 1, y * width * 4, (y + 1) * width * 4);
  }

  const compressed = zlib.deflateSync(idatRaw);
  const idatChunk = Buffer.alloc(4 + 4 + compressed.length + 4);
  idatChunk.writeUInt32BE(compressed.length, 0);
  idatChunk.write('IDAT', 4, 'ascii');
  compressed.copy(idatChunk, 8);
  idatChunk.writeUInt32BE(crc32(idatChunk.subarray(4, 8 + compressed.length)), 8 + compressed.length);
  chunks.push(idatChunk);

  // 4. IEND Chunk
  const iendChunk = Buffer.from([0, 0, 0, 0, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82]);
  chunks.push(iendChunk);

  return Buffer.concat(chunks);
}

function cropPNGTransparency(filePath: string): { success: boolean; cropped: boolean; info?: string } {
  const buf = fs.readFileSync(filePath);
  
  if (buf.readUInt32BE(0) !== 0x89504E47 || buf.readUInt32BE(4) !== 0x0D0A1A0A) {
    return { success: false, cropped: false, info: 'Not a PNG file' };
  }

  let pos = 8;
  let width = 0;
  let height = 0;
  let colorType = 0;
  let bitDepth = 0;
  const idatChunks: Buffer[] = [];

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
    return { success: false, cropped: false, info: `Unsupported PNG format (ColorType: ${colorType}, BitDepth: ${bitDepth}). Must be 32-bit RGBA.` };
  }

  const compressed = Buffer.concat(idatChunks);
  const decompressed = zlib.inflateSync(compressed);

  const stride = 1 + width * 4;
  let minX = width;
  let maxX = 0;
  let minY = height;
  let maxY = 0;
  let hasAlphaPixels = false;

  const pixels = Buffer.alloc(width * height * 4);

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
    return { success: true, cropped: false, info: 'Image is completely transparent' };
  }

  // Check if we even need to crop
  const contentWidth = maxX - minX + 1;
  const contentHeight = maxY - minY + 1;
  if (contentWidth === width && contentHeight === height) {
    return { success: true, cropped: false, info: 'Already fully cropped' };
  }

  // Crop the pixels
  const croppedPixels = Buffer.alloc(contentWidth * contentHeight * 4);
  for (let y = 0; y < contentHeight; y++) {
    const srcY = minY + y;
    const srcStart = (srcY * width + minX) * 4;
    const destStart = y * contentWidth * 4;
    pixels.copy(croppedPixels, destStart, srcStart, srcStart + contentWidth * 4);
  }

  // Encode new PNG
  const croppedPng = encodePNG(contentWidth, contentHeight, croppedPixels);
  
  // Write back to file
  fs.writeFileSync(filePath, croppedPng);

  return {
    success: true,
    cropped: true,
    info: `Cropped from ${width}x${height} to ${contentWidth}x${contentHeight} (minX: ${minX}, minY: ${minY})`
  };
}

export default async function TestLogosPage() {
  const dir = path.join(process.cwd(), 'public', 'brandlogos');
  
  if (!fs.existsSync(dir)) {
    return <div style={{ padding: 40 }}>Brand logos directory not found</div>;
  }

  const files = fs.readdirSync(dir).filter(f => f.toLowerCase().endsWith('.png'));

  const reports: Array<{ file: string; success: boolean; cropped: boolean; info?: string }> = [];
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    try {
      const res = cropPNGTransparency(filePath);
      reports.push({ file, ...res });
    } catch (err: any) {
      reports.push({ file, success: false, cropped: false, info: err.message });
    }
  }

  // Since all images are cropped to their content boundaries, we no longer need complex scaling factors!
  // Every logo will render perfectly within its containers now using object-fit contain.
  // Let's write a standard brandLogosData file with no scales (scale = 1.0) because the boundaries are now perfect.
  const brandLogos = files.map(file => ({
    src: `/brandlogos/${file}`,
    alt: 'Logo',
    style: {}
  }));

  const generatedCode = `export const brandLogos = [\n` + 
    brandLogos.map(r => `  { src: "${r.src}", alt: "Logo", style: {} },`).join("\n") +
    `\n];\n`;

  const targetPath = path.join(process.cwd(), 'components', 'brandLogosData.ts');
  fs.writeFileSync(targetPath, generatedCode);

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif', background: '#1e1e1e', color: '#fff' }}>
      <h1>Logo Auto-Cropping Utility</h1>
      <p style={{ color: '#2ecc71', fontWeight: 'bold' }}>
        Processed and cropped transparent padding from all PNG logos in public/brandlogos/
      </p>
      
      <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: 20 }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #555', textAlign: 'left' }}>
            <th style={{ padding: 8 }}>File</th>
            <th style={{ padding: 8 }}>Status</th>
            <th style={{ padding: 8 }}>Details</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #333' }}>
              <td style={{ padding: 8 }}>{r.file}</td>
              <td style={{ padding: 8, color: r.success ? (r.cropped ? '#e67e22' : '#2ecc71') : '#e74c3c' }}>
                {r.success ? (r.cropped ? 'Cropped In-Place' : 'No Padding / Skipped') : 'Failed'}
              </td>
              <td style={{ padding: 8, fontSize: '0.9em', color: '#ccc' }}>{r.info}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
