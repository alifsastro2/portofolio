'use client'
import { useState, useRef, useEffect } from 'react'
import { FaRobot } from 'react-icons/fa'
import { IoClose, IoSend } from 'react-icons/io5'

type Message = { role: 'user' | 'assistant'; content: string }

const SUGGESTIONS = [
  "What are Alif's main skills?",
  "Tell me about his projects",
  "Is he available for hire?",
  "How can I contact Alif?",
]

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-[#06b6d4]/60 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  )
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm Alif's AI assistant 👋 Ask me anything about his skills, projects, or availability!",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open])

  async function send(text: string) {
    if (!text.trim() || loading) return
    const userMsg: Message = { role: 'user', content: text }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(1).map((m) => ({ role: m.role, content: m.content })),
        }),
      })
      const data = await res.json()
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply ?? data.error ?? 'Something went wrong.' },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Connection error. Please try again.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Chat panel */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-[340px] sm:w-[380px] flex flex-col bg-[#161616] border border-[#1e1e1e] rounded-2xl shadow-2xl transition-all duration-300 origin-bottom-right ${
          open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-90 pointer-events-none'
        }`}
        style={{ maxHeight: '520px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1e1e] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#06b6d4]/15 border border-[#06b6d4]/30 flex items-center justify-center">
              <FaRobot size={14} className="text-[#06b6d4]" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Alif&apos;s Assistant</p>
              <p className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                Online
              </p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-600 hover:text-gray-300 transition-colors p-1"
          >
            <IoClose size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#06b6d4] text-black font-medium rounded-br-sm'
                    : 'bg-[#1e1e1e] text-gray-300 rounded-bl-sm'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#1e1e1e] rounded-2xl rounded-bl-sm">
                <TypingIndicator />
              </div>
            </div>
          )}

          {/* Suggestions (only at start) */}
          {messages.length === 1 && !loading && (
            <div className="flex flex-wrap gap-2 pt-1">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-[11px] font-mono text-[#06b6d4] border border-[#06b6d4]/25 bg-[#06b6d4]/5 rounded-full px-3 py-1 hover:bg-[#06b6d4]/15 transition-colors text-left"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-3 py-3 border-t border-[#1e1e1e] flex-shrink-0">
          <form
            onSubmit={(e) => { e.preventDefault(); send(input) }}
            className="flex items-center gap-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl px-3 py-2 focus-within:border-[#06b6d4]/40 transition-colors"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Alif..."
              className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none font-mono"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="text-[#06b6d4] hover:text-[#22d3ee] disabled:text-gray-700 transition-colors flex-shrink-0"
            >
              <IoSend size={16} />
            </button>
          </form>
          <p className="text-[9px] text-gray-700 font-mono text-center mt-1.5">
            Powered by Groq · Llama 3
          </p>
        </div>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          open
            ? 'bg-[#1e1e1e] border border-[#2a2a2a] text-gray-400'
            : 'bg-[#06b6d4] text-black hover:bg-[#22d3ee] hover:scale-110'
        }`}
        style={!open ? { boxShadow: '0 0 30px #06b6d440' } : {}}
        aria-label="Chat with AI assistant"
      >
        {open ? <IoClose size={22} /> : <FaRobot size={22} />}
      </button>
    </>
  )
}
