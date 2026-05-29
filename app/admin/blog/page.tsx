import { createClient } from '@/lib/supabase/server'
import BlogManager from '@/components/admin/BlogManager'

export default async function AdminBlogPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="pt-14 md:pt-0 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Blog</h1>
        <p className="text-gray-600 text-sm font-mono mt-1">Write, edit, and publish blog posts</p>
      </div>
      <BlogManager posts={posts ?? []} />
    </div>
  )
}
