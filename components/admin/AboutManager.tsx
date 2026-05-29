'use client'
import { useState, useTransition } from 'react'
import type { AboutContent } from '@/lib/supabase/types'
import { upsertAbout } from '@/app/actions/about'

export default function AboutManager({ about }: { about: AboutContent | null }) {
  const [values, setValues] = useState({
    bio_1: about?.bio_1 ?? '',
    bio_2: about?.bio_2 ?? '',
    location: about?.location ?? '',
    available: about?.available ?? true,
  })
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()

  const set = (k: keyof typeof values) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((v) => ({ ...v, [k]: e.target.value }))

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const fd = new FormData()
    fd.set('bio_1', values.bio_1)
    fd.set('bio_2', values.bio_2)
    fd.set('location', values.location)
    fd.set('available', String(values.available))
    startTransition(async () => {
      await upsertAbout(fd)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    })
  }

  const inputCls = 'w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-[#06b6d4] transition-colors'
  const labelCls = 'block font-mono text-xs text-gray-500 mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="bg-[#161616] border border-[#1e1e1e] rounded-xl p-6 space-y-5">
      <div>
        <label className={labelCls}>Bio paragraph 1</label>
        <textarea className={inputCls + ' resize-none h-24'} value={values.bio_1} onChange={set('bio_1')}
          placeholder="I'm a final-year Information Systems student..." />
      </div>

      <div>
        <label className={labelCls}>Bio paragraph 2</label>
        <textarea className={inputCls + ' resize-none h-24'} value={values.bio_2} onChange={set('bio_2')}
          placeholder="I specialize in Flutter for mobile and Next.js..." />
      </div>

      <div>
        <label className={labelCls}>Location</label>
        <input className={inputCls} value={values.location} onChange={set('location')} placeholder="Kota Bekasi, Jawa Barat" />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setValues((v) => ({ ...v, available: !v.available }))}
          className={`relative w-11 h-6 rounded-full transition-colors ${values.available ? 'bg-[#06b6d4]' : 'bg-[#2a2a2a]'}`}
        >
          <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${values.available ? 'left-6' : 'left-1'}`} />
        </button>
        <span className="text-sm font-mono text-gray-400">
          {values.available ? 'Open to Work' : 'Not Available'}
        </span>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="px-5 py-2 bg-[#06b6d4] text-black text-sm font-semibold rounded-lg hover:bg-[#22d3ee] disabled:opacity-50 transition-colors"
        >
          {isPending ? 'Saving...' : 'Save Changes'}
        </button>
        {saved && <span className="text-xs font-mono text-emerald-400">✓ Saved</span>}
      </div>
    </form>
  )
}
