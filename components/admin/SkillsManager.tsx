'use client'
import { useState, useTransition } from 'react'
import type { Skill, SkillCategory } from '@/lib/supabase/types'
import { createCategory, deleteCategory, createSkill, deleteSkill } from '@/app/actions/skills'

export default function SkillsManager({
  categories, skills,
}: { categories: SkillCategory[]; skills: Skill[] }) {
  const [newCat, setNewCat] = useState('')
  const [newSkill, setNewSkill] = useState<Record<string, string>>({})
  const [isPending, startTransition] = useTransition()

  const skillsFor = (catId: string) => skills.filter((s) => s.category_id === catId)

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCat.trim()) return
    const fd = new FormData()
    fd.set('name', newCat.trim())
    fd.set('display_order', String(categories.length))
    startTransition(async () => {
      await createCategory(fd)
      setNewCat('')
    })

  }

  const handleAddSkill = (catId: string) => {
    const name = newSkill[catId]?.trim()
    if (!name) return
    const fd = new FormData()
    fd.set('category_id', catId)
    fd.set('name', name)
    fd.set('display_order', String(skillsFor(catId).length))
    startTransition(async () => {
      await createSkill(fd)
      setNewSkill((v) => ({ ...v, [catId]: '' }))
    })
  }

  const inputCls = 'bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-[#06b6d4] transition-colors'

  return (
    <div className="space-y-6">
      {/* Add category */}
      <form onSubmit={handleAddCategory} className="flex gap-3">
        <input
          className={inputCls + ' flex-1'}
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          placeholder="New category name (e.g. Mobile)"
        />
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-[#06b6d4] text-black text-sm font-semibold rounded-lg hover:bg-[#22d3ee] disabled:opacity-50 transition-colors"
        >
          Add Category
        </button>
      </form>

      {/* Categories */}
      {categories.length === 0 && (
        <p className="text-gray-600 font-mono text-sm py-8 text-center border border-[#1e1e1e] rounded-xl">
          No categories yet.
        </p>
      )}

      {categories.map((cat) => (
        <div key={cat.id} className="bg-[#161616] border border-[#1e1e1e] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-mono text-[#06b6d4] text-sm tracking-wider uppercase">{cat.name}</h3>
            <button
              onClick={() => startTransition(async () => { await deleteCategory(cat.id) })}
              disabled={isPending}
              className="text-xs font-mono text-gray-600 hover:text-red-400 transition-colors disabled:opacity-40"
            >
              Delete category
            </button>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {skillsFor(cat.id).map((skill) => (
              <div key={skill.id} className="flex items-center gap-1.5 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-2.5 py-1 group">
                <span className="text-xs font-mono text-gray-400">{skill.name}</span>
                <button
                  onClick={() => startTransition(async () => { await deleteSkill(skill.id) })}
                  disabled={isPending}
                  className="text-gray-700 hover:text-red-400 text-xs transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-40"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Add skill */}
          <div className="flex gap-2">
            <input
              className={inputCls + ' flex-1 text-xs'}
              value={newSkill[cat.id] ?? ''}
              onChange={(e) => setNewSkill((v) => ({ ...v, [cat.id]: e.target.value }))}
              placeholder="Add skill..."
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(cat.id) } }}
            />
            <button
              type="button"
              onClick={() => handleAddSkill(cat.id)}
              disabled={isPending}
              className="px-3 py-2 text-xs font-mono border border-[#06b6d4]/30 text-[#06b6d4] rounded-lg hover:bg-[#06b6d4]/10 disabled:opacity-50 transition-all"
            >
              + Add
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
