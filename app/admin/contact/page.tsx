import { createClient } from '@/lib/supabase/server'
import ContactManager from '@/components/admin/ContactManager'

export default async function AdminContactPage() {
  const supabase = await createClient()
  const { data: links } = await supabase
    .from('contact_links')
    .select('*')
    .order('display_order')

  return (
    <div className="pt-14 md:pt-0 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Contact</h1>
        <p className="text-gray-600 text-sm font-mono mt-1">Manage contact links shown on the portfolio</p>
      </div>
      <ContactManager links={links ?? []} />
    </div>
  )
}
