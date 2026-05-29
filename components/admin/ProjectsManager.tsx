'use client'
import { useState, useTransition } from 'react'
import type { Project } from '@/lib/supabase/types'
import { createProject, updateProject, deleteProject } from '@/app/actions/projects'

const PROJECT_TYPES = ['Web App', 'SaaS', 'Mobile App', 'API', 'Other']

type FormValues = {
  title: string; description: string; type: string; tags: string
  github: string; live: string; image: string; display_order: string
}

const emptyForm: FormValues = {
  title: '', description: '', type: 'Web App', tags: '',
  github: '', live: '', image: '', display_order: '0',
}

function projectToForm(p: Project): FormValues {
  return {
    title: p.title, description: p.description ?? '',
    type: p.type ?? 'Web App', tags: p.tags.join(', '),
    github: p.github ?? '', live: p.live ?? '',
    image: p.image ?? '', display_order: String(p.display_order),
  }
}

function ProjectForm({
  initial, onSubmit, onCancel, pending,
}: {
  initial: FormValues
  onSubmit: (fd: FormData) => void
  onCancel: () => void
  pending: boolean
}) {
  const [values, setValues] = useState(initial)
  const set = (k: keyof FormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }))

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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Title *</label>
          <input className={inputCls} value={values.title} onChange={set('title')} required />
        </div>
        <div>
          <label className={labelCls}>Type</label>
          <select className={inputCls} value={values.type} onChange={set('type')}>
            {PROJECT_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className={labelCls}>Description</label>
        <textarea className={inputCls + ' resize-none h-20'} value={values.description} onChange={set('description')} />
      </div>

      <div>
        <label className={labelCls}>Tags (comma-separated)</label>
        <input className={inputCls} value={values.tags} onChange={set('tags')} placeholder="Next.js, TypeScript, Supabase" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>GitHub URL</label>
          <input className={inputCls} value={values.github} onChange={set('github')} placeholder="https://github.com/..." />
        </div>
        <div>
          <label className={labelCls}>Live URL</label>
          <input className={inputCls} value={values.live} onChange={set('live')} placeholder="https://..." />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Image path (in /public)</label>
          <input className={inputCls} value={values.image} onChange={set('image')} placeholder="/projects/pos-cashier.png" />
        </div>
        <div>
          <label className={labelCls}>Order</label>
          <input className={inputCls} type="number" value={values.display_order} onChange={set('display_order')} />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={pending} className="px-5 py-2 bg-[#06b6d4] text-black text-sm font-semibold rounded-lg hover:bg-[#22d3ee] disabled:opacity-50 transition-colors">
          {pending ? 'Saving...' : 'Save'}
        </button>
        <button type="button" onClick={onCancel} className="px-5 py-2 border border-[#2a2a2a] text-gray-400 text-sm rounded-lg hover:border-[#3a3a3a] transition-colors">
          Cancel
        </button>
      </div>
    </form>
  )
}

export default function ProjectsManager({ projects }: { projects: Project[] }) {
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleCreate = (fd: FormData) => {
    startTransition(async () => {
      await createProject(fd)
      setShowForm(false)
    })
  }

  const handleUpdate = (id: string, fd: FormData) => {
    startTransition(async () => {
      await updateProject(id, fd)
      setEditId(null)
    })
  }

  const handleDelete = (id: string) => {
    if (!confirm('Delete this project?')) return
    startTransition(async () => { await deleteProject(id) })
  }

  return (
    <div className="space-y-4">
      {/* Add button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-[#06b6d4] text-black text-sm font-semibold rounded-lg hover:bg-[#22d3ee] transition-colors"
        >
          + Add Project
        </button>
      )}

      {/* Create form */}
      {showForm && (
        <ProjectForm
          initial={emptyForm}
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
          pending={isPending}
        />
      )}

      {/* Projects list */}
      <div className="space-y-3">
        {projects.length === 0 && (
          <p className="text-gray-600 font-mono text-sm py-8 text-center border border-[#1e1e1e] rounded-xl">
            No projects yet. Add your first one above.
          </p>
        )}

        {projects.map((p) => (
          <div key={p.id}>
            {editId === p.id ? (
              <ProjectForm
                initial={projectToForm(p)}
                onSubmit={(fd) => handleUpdate(p.id, fd)}
                onCancel={() => setEditId(null)}
                pending={isPending}
              />
            ) : (
              <div className="flex items-start gap-4 p-4 bg-[#161616] border border-[#1e1e1e] rounded-xl hover:border-[#2a2a2a] transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-semibold text-sm">{p.title}</span>
                    <span className="text-[10px] font-mono text-[#06b6d4] bg-[#06b6d4]/10 border border-[#06b6d4]/20 px-2 py-0.5 rounded">
                      {p.type}
                    </span>
                  </div>
                  <p className="text-gray-600 text-xs mt-1 truncate">{p.description}</p>
                  <div className="flex gap-2 flex-wrap mt-2">
                    {p.tags.map((t) => (
                      <span key={t} className="text-[10px] font-mono text-gray-600 bg-[#1e1e1e] px-2 py-0.5 rounded">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => setEditId(p.id)} className="px-3 py-1.5 text-xs font-mono text-gray-400 hover:text-[#06b6d4] border border-[#2a2a2a] rounded hover:border-[#06b6d4]/30 transition-all">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(p.id)} disabled={isPending} className="px-3 py-1.5 text-xs font-mono text-gray-600 hover:text-red-400 border border-[#2a2a2a] rounded hover:border-red-400/30 transition-all disabled:opacity-40">
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
