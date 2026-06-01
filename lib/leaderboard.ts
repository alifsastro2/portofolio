import { createClient } from './supabase/browser'

export type ScoreRow = {
  id: string
  name: string
  score: number
  created_at: string
}

export async function getTopScores(limit = 10): Promise<ScoreRow[]> {
  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('game_scores')
      .select('*')
      .order('score', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(limit)
    return (data as ScoreRow[]) ?? []
  } catch {
    return []
  }
}

export async function submitScore(name: string, score: number): Promise<string | null> {
  try {
    const supabase = createClient()
    const clean = name.trim().slice(0, 20) || 'Anonymous'
    const { error } = await supabase
      .from('game_scores')
      .insert({ name: clean, score })
    return error ? error.message : null
  } catch (e) {
    return e instanceof Error ? e.message : 'Failed to submit'
  }
}
