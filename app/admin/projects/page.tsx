import { createClient } from '@/lib/supabase/server'
import ProjectsManager from '@/components/admin/ProjectsManager'

export default async function AdminProjectsPage() {
  const supabase = await createClient()
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('display_order')

  return (
    <div className="pt-14 md:pt-0 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Projects</h1>
        <p className="text-gray-600 text-sm font-mono mt-1">Add, edit, or remove portfolio projects</p>
      </div>
      <ProjectsManager projects={projects ?? []} />
    </div>
  )
}
