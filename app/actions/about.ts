'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function upsertAbout(formData: FormData) {
  const supabase = await createClient()

  const { data: existing } = await supabase
    .from('about_content')
    .select('id')
    .single()

  const payload = {
    bio_1: formData.get('bio_1') as string,
    bio_2: formData.get('bio_2') as string,
    location: formData.get('location') as string,
    available: formData.get('available') === 'true',
    updated_at: new Date().toISOString(),
  }

  const { error } = existing?.id
    ? await supabase.from('about_content').update(payload).eq('id', existing.id)
    : await supabase.from('about_content').insert(payload)

  if (error) return { error: error.message }
  revalidatePath('/')
  revalidatePath('/admin/about')
}
