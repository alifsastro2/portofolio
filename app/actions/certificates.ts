'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { SupabaseClient } from '@supabase/supabase-js'

const BUCKET = 'certificates'

// Upload a File to Storage and return its public URL, or null if no file given.
async function uploadFile(
  supabase: SupabaseClient,
  file: FormDataEntryValue | null,
  prefix: string,
): Promise<string | null> {
  if (!(file instanceof File) || file.size === 0) return null
  const ext = file.name.split('.').pop()?.toLowerCase() || 'bin'
  const path = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '31536000',
    upsert: false,
    contentType: file.type || undefined,
  })
  if (error) throw new Error(error.message)
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}

// Remove a previously-stored object given its public URL (best-effort).
async function removeByUrl(supabase: SupabaseClient, url: string | null) {
  if (!url) return
  const marker = `/storage/v1/object/public/${BUCKET}/`
  const idx = url.indexOf(marker)
  if (idx === -1) return // not a Storage URL (e.g. legacy /public path) — skip
  const path = decodeURIComponent(url.slice(idx + marker.length))
  await supabase.storage.from(BUCKET).remove([path])
}

export async function createCertificate(formData: FormData) {
  const supabase = await createClient()
  try {
    const image_url = await uploadFile(supabase, formData.get('image'), 'img')
    if (!image_url) return { error: 'Certificate image is required.' }
    const pdf_url = await uploadFile(supabase, formData.get('pdf'), 'pdf')

    const { error } = await supabase.from('certificates').insert({
      title: formData.get('title') as string,
      issuer: (formData.get('issuer') as string) || null,
      year: (formData.get('year') as string) || null,
      image_url,
      pdf_url,
      display_order: Number(formData.get('display_order') ?? 0),
    })
    if (error) return { error: error.message }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Upload failed' }
  }
  revalidatePath('/')
  revalidatePath('/admin/certificates')
}

export async function updateCertificate(id: string, formData: FormData) {
  const supabase = await createClient()
  try {
    const { data: existing } = await supabase
      .from('certificates')
      .select('image_url, pdf_url')
      .eq('id', id)
      .single()

    const newImage = await uploadFile(supabase, formData.get('image'), 'img')
    const newPdf = await uploadFile(supabase, formData.get('pdf'), 'pdf')

    const update: Record<string, unknown> = {
      title: formData.get('title') as string,
      issuer: (formData.get('issuer') as string) || null,
      year: (formData.get('year') as string) || null,
      display_order: Number(formData.get('display_order') ?? 0),
    }
    if (newImage) update.image_url = newImage
    if (newPdf) update.pdf_url = newPdf

    const { error } = await supabase.from('certificates').update(update).eq('id', id)
    if (error) return { error: error.message }

    // clean up replaced files
    if (newImage) await removeByUrl(supabase, existing?.image_url ?? null)
    if (newPdf) await removeByUrl(supabase, existing?.pdf_url ?? null)
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Upload failed' }
  }
  revalidatePath('/')
  revalidatePath('/admin/certificates')
}

export async function deleteCertificate(id: string) {
  const supabase = await createClient()
  const { data: existing } = await supabase
    .from('certificates')
    .select('image_url, pdf_url')
    .eq('id', id)
    .single()

  const { error } = await supabase.from('certificates').delete().eq('id', id)
  if (error) return { error: error.message }

  await removeByUrl(supabase, existing?.image_url ?? null)
  await removeByUrl(supabase, existing?.pdf_url ?? null)

  revalidatePath('/')
  revalidatePath('/admin/certificates')
}
