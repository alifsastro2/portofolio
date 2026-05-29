'use client'
import { useState, useTransition } from 'react'
import type { ContactLink } from '@/lib/supabase/types'
import { createContactLink, updateContactLink, deleteContactLink } from '@/app/actions/contact'

type FormValues = { label: string; value: string; href: string; icon: string; display_order: string }
const emptyForm: FormValues = { label: '', value: '', href: '', icon: '', display_order: '0' }
const linkToForm = (l: ContactLink): FormValues => ({
  label: l.label, value: l.value ?? '', href: l.href ?? '',
  icon: l.icon ?? '', display_order: String(l.display_order),
})

function LinkForm({ initial, onSubmit, onCancel, pending }: {
  initial: FormValues; onSubmit: (fd: FormData) => void; onCancel: () => void; pending: boolean
}) {
  const [values, setValues] = useState(initial)
  const set = (k: keyof FormValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) => setValues((v) => ({ ...v, [k]: e.target.value }))

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const fd = new FormData()
    Object.entries(values).forEach(([k, v]) => fd.set(k, v))
    onSubmit(fd)
  }

  const inputCls = 'w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-[#06b6d4] transition-colors'
  const labelCls = 'block font-mono text-xs text-gray-500 mb-1'

  return (
    <form onSubmit={handleSubmit} className="bg-[#161616] border border-[#06b6d4]/20 rounded-xl p-5 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Label *</label>
          <input className={inputCls} value={values.label} onChange={set('label')} placeholder="Email" required />
        </div>
        <div>
          <label className={labelCls}>Icon / Emoji</label>
          <input className={inputCls} value={values.icon} onChange={set('icon')} placeholder="✉ or 'in'" />
        </div>
      </div>
      <div>
        <label className={labelCls}>Display value</label>
        <input className={inputCls} value={values.value} onChange={set('value')} placeholder="alif@cybergl.co.id" />
      </div>
      <div>
        <label className={labelCls}>URL / href</label>
        <input className={inputCls} value={values.href} onChange={set('href')} placeholder="mailto:... or https://..." />
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={pending} className="px-5 py-2 bg-[#06b6d4] text-black text-sm font-semibold rounded-lg hover:bg-[#22d3ee] disabled:opacity-50 transition-colors">
          {pending ? 'Saving...' : 'Save'}
        </button>
        <button type="button" onClick={onCancel} className="px-5 py-2 border border-[#2a2a2a] text-gray-400 text-sm rounded-lg transition-colors">Cancel</button>
      </div>
    </form>
  )
}

export default function ContactManager({ links }: { links: ContactLink[] }) {
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleCreate = (fd: FormData) => startTransition(async () => { await createContactLink(fd); setShowForm(false) })
  const handleUpdate = (id: string, fd: FormData) => startTransition(async () => { await updateContactLink(id, fd); setEditId(null) })
  const handleDelete = (id: string) => { if (!confirm('Delete this link?')) return; startTransition(async () => { await deleteContactLink(id) }) }

  return (
    <div className="space-y-4">
      {!showForm && (
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-[#06b6d4] text-black text-sm font-semibold rounded-lg hover:bg-[#22d3ee] transition-colors">
          + Add Link
        </button>
      )}
      {showForm && <LinkForm initial={emptyForm} onSubmit={handleCreate} onCancel={() => setShowForm(false)} pending={isPending} />}

      <div className="space-y-3">
        {links.length === 0 && (
          <p className="text-gray-600 font-mono text-sm py-8 text-center border border-[#1e1e1e] rounded-xl">No links yet.</p>
        )}
        {links.map((l) => (
          <div key={l.id}>
            {editId === l.id ? (
              <LinkForm initial={linkToForm(l)} onSubmit={(fd) => handleUpdate(l.id, fd)} onCancel={() => setEditId(null)} pending={isPending} />
            ) : (
              <div className="flex items-center gap-4 p-4 bg-[#161616] border border-[#1e1e1e] rounded-xl">
                <div className="w-9 h-9 rounded-lg bg-[#06b6d4]/10 border border-[#06b6d4]/20 flex items-center justify-center text-sm text-[#06b6d4] font-mono flex-shrink-0">
                  {l.icon ?? '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold">{l.label}</p>
                  <p className="text-gray-600 text-xs font-mono truncate">{l.href}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => setEditId(l.id)} className="px-3 py-1.5 text-xs font-mono text-gray-400 hover:text-[#06b6d4] border border-[#2a2a2a] rounded transition-all">Edit</button>
                  <button onClick={() => handleDelete(l.id)} disabled={isPending} className="px-3 py-1.5 text-xs font-mono text-gray-600 hover:text-red-400 border border-[#2a2a2a] rounded transition-all disabled:opacity-40">Del</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
