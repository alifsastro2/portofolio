'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createCategory(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('skill_categories').insert({
    name: formData.get('name') as string,
    display_order: Number(formData.get('display_order') ?? 0),
  })
  if (error) return { error: error.message }
  revalidatePath('/')
  revalidatePath('/admin/skills')
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('skill_categories').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/')
  revalidatePath('/admin/skills')
}

export async function createSkill(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('skills').insert({
    category_id: formData.get('category_id') as string,
    name: formData.get('name') as string,
    display_order: Number(formData.get('display_order') ?? 0),
  })
  if (error) return { error: error.message }
  revalidatePath('/')
  revalidatePath('/admin/skills')
}

export async function deleteSkill(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('skills').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/')
  revalidatePath('/admin/skills')
}
