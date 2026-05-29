import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Login page: render tanpa sidebar (middleware yang handle redirect)
  if (!user) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      <AdminSidebar userEmail={user.email ?? ''} />
      <main className="flex-1 ml-0 md:ml-60 p-6 lg:p-8">
        {children}
      </main>
    </div>
  )
}
