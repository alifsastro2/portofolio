'use client'
import { useState, useTransition, useRef } from 'react'
import type { Certificate } from '@/lib/supabase/types'
import { createCertificate, updateCertificate, deleteCertificate } from '@/app/actions/certificates'

const inputCls = 'w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-[#06b6d4] transition-colors'
const labelCls = 'block font-mono text-xs text-gray-500 mb-1'
const fileCls = 'w-full text-xs text-gray-400 font-mono file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#06b6d4]/10 file:text-[#06b6d4] hover:file:bg-[#06b6d4]/20 file:cursor-pointer cursor-pointer'

function CertForm({
  cert, onSubmit, onCancel, pending,
}: {
  cert?: Certificate
  onSubmit: (fd: FormData) => void
  onCancel: () => void
  pending: boolean
}) {
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!formRef.current) return
    onSubmit(new FormData(formRef.current))
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="bg-[#161616] border border-[#06b6d4]/20 rounded-xl p-5 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className={labelCls}>Title *</label>
          <input name="title" className={inputCls} defaultValue={cert?.title ?? ''} required />
        </div>
        <div>
          <label className={labelCls}>Issuer</label>
          <input name="issuer" className={inputCls} defaultValue={cert?.issuer ?? ''} placeholder="Universitas Gunadarma" />
        </div>
        <div>
          <label className={labelCls}>Year</label>
          <input name="year" className={inputCls} defaultValue={cert?.year ?? ''} placeholder="Jun 2025" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Certificate image (PNG/JPG){cert ? '' : ' *'}</label>
          <input name="image" type="file" accept="image/png,image/jpeg,image/webp" className={fileCls} {...(cert ? {} : { required: true })} />
          {cert && <p className="text-[10px] font-mono text-gray-600 mt-1">Leave empty to keep current image.</p>}
        </div>
        <div>
          <label className={labelCls}>Original PDF (optional)</label>
          <input name="pdf" type="file" accept="application/pdf" className={fileCls} />
          {cert?.pdf_url && <p className="text-[10px] font-mono text-gray-600 mt-1">Leave empty to keep current PDF.</p>}
        </div>
      </div>

      <div className="w-32">
        <label className={labelCls}>Order</label>
        <input name="display_order" type="number" className={inputCls} defaultValue={String(cert?.display_order ?? 0)} />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={pending} className="px-5 py-2 bg-[#06b6d4] text-black text-sm font-semibold rounded-lg hover:bg-[#22d3ee] disabled:opacity-50 transition-colors">
          {pending ? 'Saving…' : 'Save'}
        </button>
        <button type="button" onClick={onCancel} className="px-5 py-2 border border-[#2a2a2a] text-gray-400 text-sm rounded-lg hover:border-[#3a3a3a] transition-colors">
          Cancel
        </button>
      </div>
    </form>
  )
}

export default function CertificatesManager({ certificates }: { certificates: Certificate[] }) {
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleCreate = (fd: FormData) => {
    setError(null)
    startTransition(async () => {
      const res = await createCertificate(fd)
      if (res?.error) setError(res.error)
      else setShowForm(false)
    })
  }

  const handleUpdate = (id: string, fd: FormData) => {
    setError(null)
    startTransition(async () => {
      const res = await updateCertificate(id, fd)
      if (res?.error) setError(res.error)
      else setEditId(null)
    })
  }

  const handleDelete = (id: string) => {
    if (!confirm('Delete this certificate? Its files will be removed too.')) return
    setError(null)
    startTransition(async () => {
      const res = await deleteCertificate(id)
      if (res?.error) setError(res.error)
    })
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="text-red-400 text-xs font-mono p-3 border border-red-400/30 bg-red-400/5 rounded-lg">{error}</p>
      )}

      {!showForm && (
        <button
          onClick={() => { setShowForm(true); setError(null) }}
          className="px-4 py-2 bg-[#06b6d4] text-black text-sm font-semibold rounded-lg hover:bg-[#22d3ee] transition-colors"
        >
          + Add Certificate
        </button>
      )}

      {showForm && (
        <CertForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} pending={isPending} />
      )}

      <div className="space-y-3">
        {certificates.length === 0 && (
          <p className="text-gray-600 font-mono text-sm py-8 text-center border border-[#1e1e1e] rounded-xl">
            No certificates yet. Add your first one above.
          </p>
        )}

        {certificates.map((c) => (
          <div key={c.id}>
            {editId === c.id ? (
              <CertForm
                cert={c}
                onSubmit={(fd) => handleUpdate(c.id, fd)}
                onCancel={() => setEditId(null)}
                pending={isPending}
              />
            ) : (
              <div className="flex items-center gap-4 p-4 bg-[#161616] border border-[#1e1e1e] rounded-xl hover:border-[#2a2a2a] transition-colors">
                <div className="w-12 h-16 flex-shrink-0 rounded-md overflow-hidden bg-[#0f0f0f] border border-[#1e1e1e] flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.image_url} alt={c.title} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{c.title}</p>
                  <p className="text-gray-600 text-xs font-mono mt-1">
                    {[c.issuer, c.year].filter(Boolean).join(' · ') || '—'}
                  </p>
                  <div className="flex gap-2 mt-1.5">
                    <span className="text-[10px] font-mono text-gray-700">#{c.display_order}</span>
                    {c.pdf_url && <span className="text-[10px] font-mono text-[#06b6d4]/70">PDF</span>}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => { setEditId(c.id); setError(null) }} className="px-3 py-1.5 text-xs font-mono text-gray-400 hover:text-[#06b6d4] border border-[#2a2a2a] rounded hover:border-[#06b6d4]/30 transition-all">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(c.id)} disabled={isPending} className="px-3 py-1.5 text-xs font-mono text-gray-600 hover:text-red-400 border border-[#2a2a2a] rounded hover:border-red-400/30 transition-all disabled:opacity-40">
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
