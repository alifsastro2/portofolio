// Generate favicon assets from the headshot cutout.
//  - app/icon.png       (512) modern browsers
//  - app/apple-icon.png (180) iOS/Android home screen
//  - app/favicon.ico    (16/32/48 PNG-in-ICO) legacy /favicon.ico requests
import sharp from 'sharp'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SRC = 'C:/Users/LENOVO/Downloads/Untitled (Logo).png'
const appDir = path.join(__dirname, '..', 'app')

const BG = { r: 0, g: 0, b: 0, alpha: 0 } // transparent

// Returns a square avatar PNG buffer at the given size (transparent background).
async function avatar(size) {
  const pad = Math.max(1, Math.round(size * 0.04))
  const inner = size - pad * 2
  const head = await sharp(SRC)
    .trim()
    .resize(inner, inner, { fit: 'contain', background: BG })
    .png()
    .toBuffer()
  return sharp({ create: { width: size, height: size, channels: 4, background: BG } })
    .composite([{ input: head, gravity: 'center' }])
    .png()
    .toBuffer()
}

// Pack PNG buffers into a valid multi-image .ico (PNG-in-ICO, modern format).
function pngToIco(images) {
  const count = images.length
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0) // reserved
  header.writeUInt16LE(1, 2) // type: icon
  header.writeUInt16LE(count, 4)

  const dir = Buffer.alloc(16 * count)
  let offset = 6 + 16 * count
  images.forEach((img, i) => {
    const b = dir.subarray(i * 16)
    b.writeUInt8(img.size >= 256 ? 0 : img.size, 0) // width
    b.writeUInt8(img.size >= 256 ? 0 : img.size, 1) // height
    b.writeUInt8(0, 2) // palette
    b.writeUInt8(0, 3) // reserved
    b.writeUInt16LE(1, 4) // color planes
    b.writeUInt16LE(32, 6) // bits per pixel
    b.writeUInt32LE(img.buf.length, 8) // size in bytes
    b.writeUInt32LE(offset, 12) // offset
    offset += img.buf.length
  })

  return Buffer.concat([header, dir, ...images.map((i) => i.buf)])
}

await writeFile(path.join(appDir, 'icon.png'), await avatar(512))
console.log('✓ icon.png 512')
await writeFile(path.join(appDir, 'apple-icon.png'), await avatar(180))
console.log('✓ apple-icon.png 180')

const icoSizes = [16, 32, 48]
const icoImages = []
for (const s of icoSizes) icoImages.push({ size: s, buf: await avatar(s) })
await writeFile(path.join(appDir, 'favicon.ico'), pngToIco(icoImages))
console.log('✓ favicon.ico', icoSizes.join('/'))
console.log('Done.')
