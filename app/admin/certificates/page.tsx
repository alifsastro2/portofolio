import { createClient } from '@/lib/supabase/server'
import CertificatesManager from '@/components/admin/CertificatesManager'

export default async function AdminCertificatesPage() {
  const supabase = await createClient()
  const { data: certificates } = await supabase
    .from('certificates')
    .select('*')
    .order('display_order')

  return (
    <div className="pt-14 md:pt-0 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Certificates</h1>
        <p className="text-gray-600 text-sm font-mono mt-1">Upload, edit, or remove certificates — images & PDFs stored in Supabase</p>
      </div>
      <CertificatesManager certificates={certificates ?? []} />
    </div>
  )
}
