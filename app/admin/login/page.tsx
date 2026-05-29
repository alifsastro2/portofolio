'use client'
import { useState } from 'react'
import { login } from '@/app/actions/auth'

export default function LoginPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const formData = new FormData(e.currentTarget)
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <span className="font-mono text-[#06b6d4] font-bold text-2xl">AAZ</span>
          <span className="font-mono text-white font-bold text-2xl">.</span>
          <p className="text-gray-600 text-sm font-mono mt-2">Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#161616] border border-[#1e1e1e] rounded-xl p-6 space-y-4">
          <div>
            <label className="block font-mono text-xs text-gray-500 mb-1.5">Email</label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-[#06b6d4] transition-colors"
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-gray-500 mb-1.5">Password</label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-[#06b6d4] transition-colors"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs font-mono bg-red-400/10 border border-red-400/20 rounded px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#06b6d4] text-black font-semibold text-sm rounded-lg hover:bg-[#22d3ee] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-6">
          <a href="/" className="text-xs font-mono text-gray-700 hover:text-[#06b6d4] transition-colors">
            ← Back to portfolio
          </a>
        </p>
      </div>
    </div>
  )
}
