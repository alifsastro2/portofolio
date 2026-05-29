import { createClient } from '@/lib/supabase/server'
import AboutManager from '@/components/admin/AboutManager'

export default async function AdminAboutPage() {
  const supabase = await createClient()
  const { data: about } = await supabase
    .from('about_content')
    .select('*')
    .single()

  return (
    <div className="pt-14 md:pt-0 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">About</h1>
        <p className="text-gray-600 text-sm font-mono mt-1">Edit your bio, location, and availability status</p>
      </div>
      <AboutManager about={about} />
    </div>
  )
}
