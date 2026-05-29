import { createClient } from '@/lib/supabase/server'
import SkillsManager from '@/components/admin/SkillsManager'

export default async function AdminSkillsPage() {
  const supabase = await createClient()

  const [{ data: categories }, { data: skills }] = await Promise.all([
    supabase.from('skill_categories').select('*').order('display_order'),
    supabase.from('skills').select('*').order('display_order'),
  ])

  return (
    <div className="pt-14 md:pt-0 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Skills</h1>
        <p className="text-gray-600 text-sm font-mono mt-1">Manage skill categories and individual skills</p>
      </div>
      <SkillsManager categories={categories ?? []} skills={skills ?? []} />
    </div>
  )
}
