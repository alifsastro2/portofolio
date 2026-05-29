'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('blog_posts').insert({
    title: formData.get('title') as string,
    summary: (formData.get('summary') as string) || null,
    content: (formData.get('content') as string) || null,
    tag: (formData.get('tag') as string) || null,
    published: formData.get('published') === 'true',
  })
  if (error) return { error: error.message }
  revalidatePath('/')
  revalidatePath('/admin/blog')
}

export async function updatePost(id: string, formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('blog_posts').update({
    title: formData.get('title') as string,
    summary: (formData.get('summary') as string) || null,
    content: (formData.get('content') as string) || null,
    tag: (formData.get('tag') as string) || null,
    published: formData.get('published') === 'true',
  }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/')
  revalidatePath('/admin/blog')
}

export async function deletePost(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('blog_posts').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/')
  revalidatePath('/admin/blog')
}

export async function togglePublished(id: string, current: boolean) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('blog_posts')
    .update({ published: !current })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/')
  revalidatePath('/admin/blog')
}
