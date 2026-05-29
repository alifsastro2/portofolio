'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createProject(formData: FormData) {
  const supabase = await createClient()
  const tags = (formData.get('tags') as string)
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  const { error } = await supabase.from('projects').insert({
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    type: formData.get('type') as string,
    tags,
    github: (formData.get('github') as string) || null,
    live: (formData.get('live') as string) || null,
    image: (formData.get('image') as string) || null,
    display_order: Number(formData.get('display_order') ?? 0),
  })

  if (error) return { error: error.message }
  revalidatePath('/')
  revalidatePath('/admin/projects')
}

export async function updateProject(id: string, formData: FormData) {
  const supabase = await createClient()
  const tags = (formData.get('tags') as string)
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  const { error } = await supabase.from('projects').update({
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    type: formData.get('type') as string,
    tags,
    github: (formData.get('github') as string) || null,
    live: (formData.get('live') as string) || null,
    image: (formData.get('image') as string) || null,
    display_order: Number(formData.get('display_order') ?? 0),
  }).eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/')
  revalidatePath('/admin/projects')
}

export async function deleteProject(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/')
  revalidatePath('/admin/projects')
}
