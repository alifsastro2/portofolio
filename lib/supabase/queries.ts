import { createClient } from './server'
import type { Project, AboutContent, ContactLink, Certificate } from './types'
import {
  projects as staticProjects,
  skillCategories as staticSkillCategories,
  certificates as staticCertificates,
} from '@/lib/data'

export type SkillCategoryWithItems = { name: string; items: string[] }

export async function getProjects(): Promise<Project[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('display_order')
    if (!data || data.length === 0) return staticProjects as unknown as Project[]
    return data
  } catch {
    return staticProjects as unknown as Project[]
  }
}

export async function getSkillCategories(): Promise<SkillCategoryWithItems[]> {
  try {
    const supabase = await createClient()
    const [{ data: cats }, { data: skills }] = await Promise.all([
      supabase.from('skill_categories').select('*').order('display_order'),
      supabase.from('skills').select('*').order('display_order'),
    ])
    if (!cats || cats.length === 0) return staticSkillCategories
    return cats.map((cat) => ({
      name: cat.name,
      items: (skills ?? [])
        .filter((s) => s.category_id === cat.id)
        .map((s) => s.name),
    }))
  } catch {
    return staticSkillCategories
  }
}

export async function getAboutContent(): Promise<AboutContent | null> {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('about_content').select('*').single()
    return data
  } catch {
    return null
  }
}

export async function getCertificates(): Promise<Certificate[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('certificates')
      .select('*')
      .order('display_order')
    if (!data || data.length === 0) return staticCertificates
    return data
  } catch {
    return staticCertificates
  }
}

export async function getContactLinks(): Promise<ContactLink[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('contact_links')
      .select('*')
      .order('display_order')
    return data ?? []
  } catch {
    return []
  }
}
