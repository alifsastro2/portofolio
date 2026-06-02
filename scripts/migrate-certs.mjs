// One-time migration: upload the 9 existing certificate PNG+PDF files to
// Supabase Storage and insert rows into the `certificates` table.
// Run:  node scripts/migrate-certs.mjs
import { createClient } from '@supabase/supabase-js'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const URL = 'https://eygunjcuvjlvgogkiedn.supabase.co'
const SERVICE_KEY = process.env.SR_KEY
if (!SERVICE_KEY) { console.error('Set SR_KEY env var to the service_role key'); process.exit(1) }

const supabase = createClient(URL, SERVICE_KEY, { auth: { persistSession: false } })
const BUCKET = 'certificates'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.join(__dirname, '..', 'public', 'certificates')

const certs = [
  { slug: 'business-intelligence', title: 'Creating Business Intelligence',         issuer: 'Universitas Gunadarma', year: 'Jun 2025' },
  { slug: 'data-analytics',        title: 'Data Analytics',                          issuer: 'RevoU',                 year: 'Mar 2025' },
  { slug: 'oracle-intermediate',   title: 'Oracle for Intermediate',                 issuer: 'Universitas Gunadarma', year: 'Aug 2024' },
  { slug: 'data-prep',             title: 'Data Preparation for Business Processes', issuer: 'Universitas Gunadarma', year: 'Sep 2024' },
  { slug: 'html5',                 title: 'Building Website using HTML5',            issuer: 'Universitas Gunadarma', year: 'May 2023' },
  { slug: 'java',                  title: 'Java Programming (J2SE)',                 issuer: 'Universitas Gunadarma', year: 'Feb 2023' },
  { slug: 'oracle-beginner',       title: 'Oracle for Beginner',                     issuer: 'Universitas Gunadarma', year: 'Feb 2023' },
  { slug: 'dbms',                  title: 'Fundamental DBMS',                        issuer: 'Universitas Gunadarma', year: 'Aug 2022' },
  { slug: 'erp',                   title: 'Fundamental ERP',                         issuer: 'Universitas Gunadarma', year: 'Feb 2022' },
]

async function up(name, buf, contentType) {
  const { error } = await supabase.storage.from(BUCKET).upload(name, buf, {
    cacheControl: '31536000', upsert: true, contentType,
  })
  if (error) throw new Error(`${name}: ${error.message}`)
  return supabase.storage.from(BUCKET).getPublicUrl(name).data.publicUrl
}

// Skip if table already has rows (avoid duplicates on re-run)
const { count } = await supabase.from('certificates').select('*', { count: 'exact', head: true })
if (count && count > 0) {
  console.log(`Table already has ${count} rows — skipping migration to avoid duplicates.`)
  process.exit(0)
}

let order = 0
for (const c of certs) {
  const png = await readFile(path.join(publicDir, `${c.slug}.png`))
  const pdf = await readFile(path.join(publicDir, `${c.slug}.pdf`))
  const image_url = await up(`${c.slug}.png`, png, 'image/png')
  const pdf_url = await up(`${c.slug}.pdf`, pdf, 'application/pdf')
  const { error } = await supabase.from('certificates').insert({
    title: c.title, issuer: c.issuer, year: c.year,
    image_url, pdf_url, display_order: order++,
  })
  if (error) throw new Error(`insert ${c.slug}: ${error.message}`)
  console.log(`✓ ${c.slug}`)
}
console.log('Done — 9 certificates migrated.')
