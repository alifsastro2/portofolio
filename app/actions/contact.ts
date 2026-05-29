'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createContactLink(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('contact_links').insert({
    label: formData.get('label') as string,
    value: (formData.get('value') as string) || null,
    href: (formData.get('href') as string) || null,
    icon: (formData.get('icon') as string) || null,
    display_order: Number(formData.get('display_order') ?? 0),
  })
  if (error) return { error: error.message }
  revalidatePath('/')
  revalidatePath('/admin/contact')
}

export async function updateContactLink(id: string, formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('contact_links').update({
    label: formData.get('label') as string,
    value: (formData.get('value') as string) || null,
    href: (formData.get('href') as string) || null,
    icon: (formData.get('icon') as string) || null,
    display_order: Number(formData.get('display_order') ?? 0),
  }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/')
  revalidatePath('/admin/contact')
}

export async function deleteContactLink(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('contact_links').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/')
  revalidatePath('/admin/contact')
}
