'use client'
import { useState, useTransition } from 'react'
import type { BlogPost } from '@/lib/supabase/types'
import { createPost, updatePost, deletePost, togglePublished } from '@/app/actions/blog'

type FormValues = { title: string; summary: string; content: string; tag: string; published: boolean }
const emptyForm: FormValues = { title: '', summary: '', content: '', tag: '', published: false }
const postToForm = (p: BlogPost): FormValues => ({
  title: p.title, summary: p.summary ?? '', content: p.content ?? '',
  tag: p.tag ?? '', published: p.published,
})

function PostForm({ initial, onSubmit, onCancel, pending }: {
  initial: FormValues; onSubmit: (fd: FormData) => void; onCancel: () => void; pending: boolean
}) {
  const [values, setValues] = useState(initial)
  const set = (k: keyof FormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((v) => ({ ...v, [k]: e.target.value }))

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const fd = new FormData()
    Object.entries(values).forEach(([k, v]) => fd.set(k, String(v)))
    onSubmit(fd)
  }

  const inputCls = 'w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-[#06b6d4] transition-colors'
  const labelCls = 'block font-mono text-xs text-gray-500 mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="bg-[#161616] border border-[#06b6d4]/20 rounded-xl p-5 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Title *</label>
          <input className={inputCls} value={values.title} onChange={set('title')} required />
        </div>
        <div>
          <label className={labelCls}>Tag</label>
          <input className={inputCls} value={values.tag} onChange={set('tag')} placeholder="Next.js, Flutter, AI..." />
        </div>
      </div>
      <div>
        <label className={labelCls}>Summary</label>
        <textarea className={inputCls + ' resize-none h-20'} value={values.summary} onChange={set('summary')} />
      </div>
      <div>
        <label className={labelCls}>Content (Markdown)</label>
        <textarea className={inputCls + ' resize-none h-40'} value={values.content} onChange={set('content')} />
      </div>
      <div className="flex items-center gap-3">
        <button type="button"
          onClick={() => setValues((v) => ({ ...v, published: !v.published }))}
          className={`relative w-11 h-6 rounded-full transition-colors ${values.published ? 'bg-[#06b6d4]' : 'bg-[#2a2a2a]'}`}
        >
          <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${values.published ? 'left-6' : 'left-1'}`} />
        </button>
        <span className="text-sm font-mono text-gray-400">{values.published ? 'Published' : 'Draft'}</span>
      </div>
      <div className="flex gap-3">
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

export default function BlogManager({ posts }: { posts: BlogPost[] }) {
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleCreate = (fd: FormData) => startTransition(async () => { await createPost(fd); setShowForm(false) })
  const handleUpdate = (id: string, fd: FormData) => startTransition(async () => { await updatePost(id, fd); setEditId(null) })
  const handleDelete = (id: string) => { if (!confirm('Delete this post?')) return; startTransition(async () => { await deletePost(id) }) }
  const handleToggle = (id: string, published: boolean) => startTransition(async () => { await togglePublished(id, published) })

  return (
    <div className="space-y-4">
      {!showForm && (
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-[#06b6d4] text-black text-sm font-semibold rounded-lg hover:bg-[#22d3ee] transition-colors">
          + New Post
        </button>
      )}
      {showForm && <PostForm initial={emptyForm} onSubmit={handleCreate} onCancel={() => setShowForm(false)} pending={isPending} />}

      <div className="space-y-3">
        {posts.length === 0 && (
          <p className="text-gray-600 font-mono text-sm py-8 text-center border border-[#1e1e1e] rounded-xl">No posts yet.</p>
        )}
        {posts.map((p) => (
          <div key={p.id}>
            {editId === p.id ? (
              <PostForm initial={postToForm(p)} onSubmit={(fd) => handleUpdate(p.id, fd)} onCancel={() => setEditId(null)} pending={isPending} />
            ) : (
              <div className="flex items-start gap-4 p-4 bg-[#161616] border border-[#1e1e1e] rounded-xl">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-semibold text-sm">{p.title}</span>
                    {p.tag && <span className="text-[10px] font-mono text-[#06b6d4] bg-[#06b6d4]/10 border border-[#06b6d4]/20 px-2 py-0.5 rounded">{p.tag}</span>}
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${p.published ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-gray-600 bg-[#1e1e1e] border-[#2a2a2a]'}`}>
                      {p.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  {p.summary && <p className="text-gray-600 text-xs mt-1 truncate">{p.summary}</p>}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => handleToggle(p.id, p.published)} disabled={isPending} className="px-3 py-1.5 text-xs font-mono text-gray-400 hover:text-[#06b6d4] border border-[#2a2a2a] rounded hover:border-[#06b6d4]/30 transition-all disabled:opacity-40">
                    {p.published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button onClick={() => setEditId(p.id)} className="px-3 py-1.5 text-xs font-mono text-gray-400 hover:text-[#06b6d4] border border-[#2a2a2a] rounded hover:border-[#06b6d4]/30 transition-all">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(p.id)} disabled={isPending} className="px-3 py-1.5 text-xs font-mono text-gray-600 hover:text-red-400 border border-[#2a2a2a] rounded hover:border-red-400/30 transition-all disabled:opacity-40">
                    Del
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
