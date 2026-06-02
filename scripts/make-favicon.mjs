// Generate favicon assets from the headshot cutout.
import sharp from 'sharp'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SRC = 'C:/Users/LENOVO/Downloads/Untitled (Logo).png'
const appDir = path.join(__dirname, '..', 'app')

const BG = { r: 0x16, g: 0x16, b: 0x16, alpha: 1 } // #161616 brand card color

async function build(size, outName) {
  const pad = Math.round(size * 0.06)
  const inner = size - pad * 2

  // Trim transparent margins so the head fills the frame, then fit inside inner box.
  const head = await sharp(SRC)
    .trim()
    .resize(inner, inner, { fit: 'cover', position: 'top' })
    .png()
    .toBuffer()

  // Rounded-rect mask for the whole tile.
  const radius = Math.round(size * 0.22)
  const mask = Buffer.from(
    `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="#fff"/></svg>`
  )

  await sharp({ create: { width: size, height: size, channels: 4, background: BG } })
    .composite([
      { input: head, top: pad, left: pad },
      { input: mask, blend: 'dest-in' },
    ])
    .png()
    .toFile(path.join(appDir, outName))
  console.log('✓', outName, `${size}x${size}`)
}

await build(512, 'icon.png')
await build(180, 'apple-icon.png')
console.log('Done.')
