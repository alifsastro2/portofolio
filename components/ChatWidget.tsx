'use client'
import { useState, useRef, useEffect } from 'react'
import { IoClose, IoSend } from 'react-icons/io5'
import { IronHelmet, ArcReactor } from './IronManUI'

type Message = { role: 'user' | 'assistant'; content: string }

const SUGGESTIONS = [
  "What are Alif's main skills?",
  "Tell me about his projects",
  "Is he available for hire?",
  "How can I contact Alif?",
]

// Cyan "arc reactor" palette (matches site theme)
const GOLD = '#06b6d4'   // accent (cyan)
const RED = '#0e7490'    // deep cyan

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full animate-bounce"
          style={{ backgroundColor: `${GOLD}99`, animationDelay: `${i * 0.15}s` }}
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
      content:
        "Good day. I am Anne, Mr. Zidane's personal AI assistant. How may I assist you — perhaps his skills, projects, or availability?",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [booting, setBooting] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [glowOnce, setGlowOnce] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const greetingAudioRef = useRef<HTMLAudioElement | null>(null)
  const bootAudioRef = useRef<HTMLAudioElement | null>(null)
  const bootTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const glowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // siapkan audio (sapaan ElevenLabs + boot sound)
  useEffect(() => {
    const g = new Audio('/anne-greeting.mp3'); g.preload = 'auto'
    greetingAudioRef.current = g
    const b = new Audio('/boot-sound.mp3'); b.preload = 'auto'
    bootAudioRef.current = b
    // aktifkan :active di iOS (efek hover muncul saat disentuh)
    const noop = () => {}
    document.body.addEventListener('touchstart', noop, { passive: true })
    return () => document.body.removeEventListener('touchstart', noop)
  }, [])

  const stopBootSound = () => {
    const b = bootAudioRef.current
    if (b) { b.pause(); b.currentTime = 0 }
  }

  const stopVoice = () => {
    const a = greetingAudioRef.current
    if (a) { a.pause(); a.currentTime = 0 }
    setSpeaking(false)
    setGlowOnce(false)
  }

  const toggle = () => {
    if (open) {
      // tutup: batalkan boot yang tertunda + hentikan semua suara
      if (bootTimerRef.current) clearTimeout(bootTimerRef.current)
      if (glowTimerRef.current) clearTimeout(glowTimerRef.current)
      stopBootSound()
      stopVoice()
      setBooting(false)
      setOpen(false)
      return
    }
    setOpen(true)
    setBooting(true)
    // boot sound selama "initializing"
    const b = bootAudioRef.current
    if (b) { b.currentTime = 0; b.play().catch(() => {}) }
    const playGreeting = messages.length === 1
    bootTimerRef.current = setTimeout(() => {
      setBooting(false)
      stopBootSound()
      if (playGreeting) {
        const a = greetingAudioRef.current
        if (a) {
          a.currentTime = 0
          a.onended = () => { setSpeaking(false); setGlowOnce(false) }
          setSpeaking(true)
          setGlowOnce(true) // glow sekali, lalu mati
          glowTimerRef.current = setTimeout(() => setGlowOnce(false), 1200)
          a.play().catch(() => { setSpeaking(false); setGlowOnce(false) })
        }
      }
    }, 1500)
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (open && !booting) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open, booting])

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
        className={`fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] max-w-[380px] flex flex-col bg-[#161616] rounded-2xl shadow-2xl transition-all duration-300 origin-bottom-right ${
          open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-90 pointer-events-none'
        }`}
        style={{ maxHeight: '520px', border: `1px solid ${GOLD}30`, boxShadow: `0 0 40px ${RED}25` }}
      >
        {/* Boot-up overlay */}
        {booting && (
          <div className="absolute inset-0 z-20 rounded-2xl bg-[#0d0d0f] flex flex-col items-center justify-center gap-4 overlay-in">
            <ArcReactor size={64} />
            <div className="text-center">
              <p className="font-mono font-bold text-sm tracking-[0.3em]" style={{ color: GOLD }}>
                ANNE
              </p>
              <p className="font-mono text-[10px] text-gray-500 mt-1">
                initializing<span className="cursor-blink">_</span>
              </p>
            </div>
            <div className="w-40 h-px bg-[#1e1e1e] overflow-hidden">
              <div className="boot-bar h-full" style={{ background: `linear-gradient(90deg, ${RED}, ${GOLD}, #22d3ee)` }} />
            </div>
            <p className="font-mono text-[8px] text-gray-700 tracking-[0.2em]">ARC REACTOR ONLINE</p>
          </div>
        )}

        {/* Header — Anne */}
        <div
          className="flex items-center justify-between px-4 py-3 flex-shrink-0 rounded-t-2xl"
          style={{
            borderBottom: `1px solid ${GOLD}22`,
            background: `linear-gradient(135deg, ${RED}22 0%, ${GOLD}10 100%)`,
          }}
        >
          <div className="flex items-center gap-3">
            {/* Iron Man helmet avatar */}
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center relative"
              style={{
                background: 'radial-gradient(circle at 50% 40%, #15323d 0%, #0d0d0f 100%)',
                border: `1px solid ${GOLD}45`,
                boxShadow: `0 0 10px ${GOLD}35`,
              }}
            >
              <IronHelmet size={26} />
            </div>
            <div>
              <p className="text-sm font-bold tracking-wide" style={{ color: GOLD }}>
                ANNE
              </p>
              <p className="text-[10px] font-mono flex items-center gap-1.5" style={{ color: '#22d3ee' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#22d3ee] animate-pulse inline-block"
                  style={{ boxShadow: '0 0 6px #22d3ee' }} />
                Online · Alif&apos;s AI
              </p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-500 hover:text-gray-200 transition-colors p-1"
          >
            <IoClose size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
          {!booting && messages.map((msg, i) => {
            const isGreeting = i === 0
            const greetGlow = isGreeting && glowOnce   // pulse sekali
            const greetSpeak = isGreeting && speaking  // sound bars + border, selama suara
            return (
              <div key={i} className={`overlay-in flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${greetGlow ? 'speak-glow' : ''}`}
                    style={{ background: `${GOLD}12`, border: `1px solid ${GOLD}40` }}
                  >
                    <IronHelmet size={15} />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${greetGlow ? 'speak-glow' : ''}`}
                  style={
                    msg.role === 'user'
                      ? { background: `linear-gradient(135deg, ${GOLD}, #0891b2)`, color: '#03242b', fontWeight: 500, borderBottomRightRadius: 4 }
                      : { background: '#1e1e1e', color: '#d1d5db', border: `1px solid ${greetSpeak ? GOLD + '55' : GOLD + '18'}`, borderBottomLeftRadius: 4 }
                  }
                >
                  {msg.content}
                  {greetSpeak && (
                    <span className="flex items-end gap-1 mt-2.5" style={{ height: 16 }}>
                      {[0, 1, 2, 3, 4].map((b) => (
                        <span
                          key={b}
                          className="sound-bar block w-1 rounded-full"
                          style={{ background: GOLD, animationDelay: `${b * 0.11}s`, boxShadow: `0 0 4px ${GOLD}` }}
                        />
                      ))}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
          {loading && (
            <div className="flex gap-2 justify-start">
              <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: `${GOLD}12`, border: `1px solid ${GOLD}40` }}>
                <IronHelmet size={15} />
              </div>
              <div className="rounded-2xl" style={{ background: '#1e1e1e', border: `1px solid ${GOLD}18` }}>
                <TypingIndicator />
              </div>
            </div>
          )}

          {/* Suggestions */}
          {!booting && messages.length === 1 && !loading && (
            <div className="overlay-in flex flex-wrap gap-2 pt-1">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-[11px] font-mono rounded-full px-3 py-1 transition-colors text-left"
                  style={{ color: GOLD, border: `1px solid ${GOLD}30`, background: `${GOLD}0a` }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-3 py-3 flex-shrink-0" style={{ borderTop: `1px solid ${GOLD}18` }}>
          <form
            onSubmit={(e) => { e.preventDefault(); send(input) }}
            className="flex items-center gap-2 bg-[#0f0f0f] rounded-xl px-3 py-2 transition-colors"
            style={{ border: `1px solid ${GOLD}25` }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Anne about Alif..."
              className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none font-mono"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="transition-colors flex-shrink-0 disabled:opacity-40"
              style={{ color: GOLD }}
            >
              <IoSend size={16} />
            </button>
          </form>
          <p className="text-[9px] text-gray-700 font-mono text-center mt-1.5">
            Anne · powered by Groq
          </p>
        </div>
      </div>

      {/* Toggle button — Iron Man helmet */}
      <button
        onClick={toggle}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
        style={
          open
            ? { background: '#161616', border: `1px solid ${GOLD}40` }
            : {
                background: 'radial-gradient(circle at 50% 40%, #15323d 0%, #0d0d0f 100%)',
                boxShadow: `0 0 22px ${GOLD}55, 0 0 6px ${GOLD}40`,
                border: `1px solid ${GOLD}55`,
              }
        }
        aria-label="Chat with Anne"
      >
        {open ? <IoClose size={22} style={{ color: GOLD }} /> : <IronHelmet size={34} />}
      </button>
    </>
  )
}
