'use client'
import { useEffect, useRef, useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import { getTopScores, submitScore, type ScoreRow } from '@/lib/leaderboard'
import {
  siFlutter, siNextdotjs, siTypescript, siSupabase,
  siFirebase, siLaravel, siClaude,
} from 'simple-icons'

const W = 580
const H_SMALL = 200
const H_FULL = 340
// H & GROUND bisa berubah (small box vs fullscreen). GROUND nempel ke bawah,
// jadi menambah H = menambah headroom di atas → lompatan tidak kepotong saat fullscreen.
let H = H_SMALL
let GROUND = H - 26
function setGeo(full: boolean) { H = full ? H_FULL : H_SMALL; GROUND = H - 26 }
const CHAR_H = 104
const CHAR_W = Math.round(CHAR_H * (1024 / 832)) // aspect ratio frame PNG
const PX = 46
const GRAVITY = 0.62
const JUMP_V = -14
const FRAME_COUNT = 21
const ANIM_FPS_START = 10  // fps animasi lari saat awal main
const ANIM_FPS_MAX = 22    // fps animasi saat speed maksimum (biar tetap proporsional)

// Difficulty cluster (Opsi A): span cluster = TARGET_RATIO × window lompatan.
// window (px) = speed × JUMP_WINDOW_FRAMES (jumlah frame karakter cukup tinggi).
const JUMP_WINDOW_FRAMES = 38
const TARGET_RATIO = 0.55

// Hitbox: hanya badan inti (abaikan ruang transparan + kaki/tangan terentang)
const HB = { x: 0.30, y: 0.10, w: 0.34, h: 0.82 }
const DEBUG_HITBOX = false

type Obs = { x: number; w: number; bh: number; es: number; color: string; label: string; emoji: string }
type Particle = { x: number; y: number; vx: number; vy: number; life: number; color: string }
type Coin = { x: number; y: number; idx: number; taken: boolean }
type Popup = { x: number; y: number; text: string; color: string; life: number }

const COIN_BONUS = 25
// Token = logo resmi tools (path SVG dari simple-icons), warna ring = aksen brand
const SKILL_TOKENS = [
  { name: 'Flutter',    ring: '#54C5F8', path: siFlutter.path },
  { name: 'Next.js',    ring: '#ffffff', path: siNextdotjs.path },
  { name: 'TypeScript', ring: '#3178C6', path: siTypescript.path },
  { name: 'Supabase',   ring: '#3FCF8E', path: siSupabase.path },
  { name: 'Firebase',   ring: '#FFA000', path: siFirebase.path },
  { name: 'Laravel',    ring: '#FF2D20', path: siLaravel.path },
  { name: 'Claude AI',  ring: '#D97757', path: siClaude.path },
]

export default function DevRunner() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const framesRef = useRef<HTMLImageElement[]>([])
  const audioCtxRef = useRef<AudioContext | null>(null)
  const mutedRef = useRef(false)
  const tokenImgsRef = useRef<HTMLImageElement[]>([])
  const boardRef = useRef<ScoreRow[]>([])
  const s = useRef({
    started: false,
    gameOver: false,
    score: 0,
    hiScore: 0,
    speed: 4,
    py: GROUND - CHAR_H,
    vy: 0,
    onGround: true,
    frame: 0,
    animFrame: 0,
    animAcc: 0,        // akumulator waktu (ms) untuk animasi sprite
    lastMilestone: 0,  // milestone skor terakhir (untuk sfx coin)
    bonus: 0,          // poin bonus dari token skill
    coins: [] as Coin[],
    popups: [] as Popup[],
    coinPhase: -1,     // blok jarak terakhir yang sudah di-spawn token
    phase: 0,          // fase waktu (day/dusk/night/dawn) — HANYA naik saat token di-claim
    obstacles: [] as Obs[],
    nextObs: 90,
    rafId: 0,
    particles: [] as Particle[],
    framesLoaded: 0,
  })

  // ── Leaderboard / overlay state ──
  const [over, setOver] = useState(false)
  const [finalScore, setFinalScore] = useState(0)
  const [board, setBoard] = useState<ScoreRow[]>([])
  const [boardLoading, setBoardLoading] = useState(false)
  const [playerName, setPlayerName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [muted, setMuted] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [portrait, setPortrait] = useState(false)

  // ── Audio (Web Audio API, tanpa file) ──
  const ensureAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      try {
        const Ctx = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        audioCtxRef.current = new Ctx()
      } catch { return null }
    }
    if (audioCtxRef.current?.state === 'suspended') audioCtxRef.current.resume()
    return audioCtxRef.current
  }, [])

  const playSound = useCallback((kind: 'jump' | 'over' | 'coin') => {
    if (mutedRef.current) return
    const ac = audioCtxRef.current
    if (!ac) return
    const now = ac.currentTime
    const osc = ac.createOscillator()
    const gain = ac.createGain()
    osc.connect(gain); gain.connect(ac.destination)

    if (kind === 'jump') {
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(420, now)
      osc.frequency.exponentialRampToValueAtTime(720, now + 0.1)
      gain.gain.setValueAtTime(0.18, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13)
      osc.start(now); osc.stop(now + 0.14)
    } else if (kind === 'coin') {
      osc.type = 'square'
      osc.frequency.setValueAtTime(880, now)
      osc.frequency.setValueAtTime(1320, now + 0.05)
      gain.gain.setValueAtTime(0.12, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)
      osc.start(now); osc.stop(now + 0.13)
    } else { // over
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(360, now)
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.45)
      gain.gain.setValueAtTime(0.2, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5)
      osc.start(now); osc.stop(now + 0.5)
    }
  }, [])

  const toggleMute = useCallback(() => {
    setMuted(m => {
      const next = !m
      mutedRef.current = next
      try { localStorage.setItem('runner_muted', next ? '1' : '0') } catch {}
      return next
    })
  }, [])

  // Preload sprite frames f001..f033
  useEffect(() => {
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new window.Image()
      img.src = `/runner-frames/f${String(i).padStart(3, '0')}.png`
      img.onload = () => { s.current.framesLoaded++ }
      framesRef.current[i - 1] = img
    }
  }, [])

  // Preload logo tools (SVG → image), diisi putih agar kontras di coin gelap
  useEffect(() => {
    SKILL_TOKENS.forEach((tok, i) => {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#ffffff" d="${tok.path}"/></svg>`
      const img = new window.Image()
      img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg)
      tokenImgsRef.current[i] = img
    })
  }, [])

  // Load nama tersimpan + status mute + leaderboard awal
  useEffect(() => {
    try {
      const saved = localStorage.getItem('runner_name')
      if (saved) setPlayerName(saved)
      const m = localStorage.getItem('runner_muted') === '1'
      mutedRef.current = m
      setMuted(m)
    } catch {}
    getTopScores(10).then(rows => { boardRef.current = rows; setBoard(rows) })
  }, [])

  const spawnParticles = useCallback((x: number, y: number, color: string) => {
    for (let i = 0; i < 10; i++) {
      s.current.particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 5,
        vy: -Math.random() * 5 - 1,
        life: 1,
        color,
      })
    }
  }, [])

  // jump / start (TIDAK restart saat over — itu lewat tombol Play Again)
  const act = useCallback(() => {
    const g = s.current
    ensureAudio() // inisialisasi audio pada interaksi pertama (wajib oleh browser)
    if (g.gameOver) return
    if (!g.started) { g.started = true; return }
    if (g.onGround) { g.vy = JUMP_V; g.onGround = false; playSound('jump') }
  }, [ensureAudio, playSound])

  const loadBoard = useCallback(async () => {
    // hanya tampilkan "Loading…" kalau board belum pernah terisi (hindari flash)
    if (boardRef.current.length === 0) setBoardLoading(true)
    const rows = await getTopScores(10)
    boardRef.current = rows
    setBoard(rows)
    setBoardLoading(false)
  }, [])

  const restart = useCallback(() => {
    const g = s.current
    Object.assign(g, {
      gameOver: false, started: true, score: 0, speed: 4,
      py: GROUND - CHAR_H, vy: 0, onGround: true,
      obstacles: [], particles: [], nextObs: 90, frame: 0, animFrame: 0, animAcc: 0, lastMilestone: 0,
      bonus: 0, coins: [], popups: [], coinPhase: -1, phase: 0,
    })
    setOver(false)
    setSubmitted(false)
  }, [])

  // Kembali ke layar awal (idle), seperti sebelum game dimainkan
  const toIdle = useCallback(() => {
    const g = s.current
    Object.assign(g, {
      started: false, gameOver: false, score: 0, speed: 4,
      py: GROUND - CHAR_H, vy: 0, onGround: true,
      obstacles: [], particles: [], nextObs: 90, frame: 0, animFrame: 0, animAcc: 0, lastMilestone: 0,
      bonus: 0, coins: [], popups: [], coinPhase: -1, phase: 0,
    })
    setOver(false)
    setSubmitted(false)
  }, [])

  // deteksi orientasi (untuk hint putar HP)
  useEffect(() => {
    const check = () => setPortrait(window.matchMedia('(orientation: portrait)').matches)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const toggleFullscreen = useCallback(() => {
    const next = !fullscreen
    setGeo(next)                 // ubah H & GROUND (headroom)
    const g = s.current          // reset ke idle di geometri baru
    Object.assign(g, {
      started: false, gameOver: false, score: 0, speed: 4,
      py: GROUND - CHAR_H, vy: 0, onGround: true,
      obstacles: [], particles: [], nextObs: 90, frame: 0, animFrame: 0, animAcc: 0, lastMilestone: 0,
      bonus: 0, coins: [], popups: [], coinPhase: -1, phase: 0,
    })
    setOver(false); setSubmitted(false)
    setFullscreen(next)
    // mobile: coba lock landscape (Android); iOS akan gagal → andalkan hint
    const orient = (screen as unknown as { orientation?: { lock?: (o: string) => Promise<void>; unlock?: () => void } }).orientation
    try {
      if (next) orient?.lock?.('landscape')?.catch(() => {})
      else orient?.unlock?.()
    } catch {}
  }, [fullscreen])

  const handleSubmit = useCallback(async () => {
    if (submitting || submitted) return
    setSubmitting(true)
    const nm = playerName.trim() || 'Anonymous'
    try { localStorage.setItem('runner_name', nm) } catch {}
    const err = await submitScore(nm, finalScore)
    setSubmitting(false)
    if (!err) { setSubmitted(true); loadBoard() }
  }, [submitting, submitted, playerName, finalScore, loadBoard])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const OBS_TYPES = [
      { label: 'BUG',  emoji: '🐛', color: '#ef4444' },
      { label: 'ERR',  emoji: '🐞', color: '#f97316' },
      { label: '404',  emoji: '🦗', color: '#a855f7' },
      { label: 'NULL', emoji: '🕷️', color: '#9ca3af' },
      { label: 'NaN',  emoji: '🪲', color: '#ec4899' },
    ]

    // pilih warna teks (putih/gelap) berdasar kecerahan warna box → kontras maksimal
    const textColorFor = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      const lum = 0.299 * r + 0.587 * g + 0.114 * b
      return lum > 150 ? '#0f0f0f' : '#ffffff'
    }

    function drawChar(x: number, y: number, animate: boolean) {
      const g = s.current
      const img = framesRef.current[g.animFrame % FRAME_COUNT]
      if (g.framesLoaded > 0 && img && img.complete) {
        ctx.drawImage(img, x, y, CHAR_W, CHAR_H)
      } else {
        ctx.fillStyle = '#06b6d4'
        ctx.fillRect(x + CHAR_W * 0.3, y + CHAR_H * 0.1, CHAR_W * 0.4, CHAR_H * 0.85)
      }
    }

    function drawShadow(x: number) {
      ctx.fillStyle = '#06b6d420'
      ctx.beginPath()
      ctx.ellipse(x + CHAR_W / 2, GROUND + 3, CHAR_W / 2 - 8, 5, 0, 0, Math.PI * 2)
      ctx.fill()
    }

    function drawObs(obs: Obs) {
      const cx = obs.x + obs.w / 2
      const boxTop = GROUND - obs.bh

      // ── Building (box) berwarna solid ──
      ctx.fillStyle = obs.color
      ctx.beginPath()
      ctx.roundRect(obs.x, boxTop, obs.w, obs.bh, 4)
      ctx.fill()
      // highlight tepi atas
      ctx.fillStyle = 'rgba(255,255,255,0.18)'
      ctx.beginPath()
      ctx.roundRect(obs.x, boxTop, obs.w, 3, [4, 4, 0, 0])
      ctx.fill()

      // ── Label nama (kontras dengan warna box) ──
      ctx.fillStyle = textColorFor(obs.color)
      ctx.font = 'bold 10px monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(obs.label, cx, boxTop + obs.bh / 2 + 0.5)

      // ── Bug duduk di atas building ──
      ctx.textBaseline = 'alphabetic'
      ctx.font = `${obs.es}px "Segoe UI Emoji", "Apple Color Emoji", sans-serif`
      ctx.fillText(obs.emoji, cx, boxTop - 1)
    }

    // ── Day/Night cycle: ganti tiap 150 skor ──
    const PHASES = [
      { name: 'DAY',   emoji: '☀️', top: '#13243d', bottom: '#0f0f0f', stars: 0 },
      { name: 'DUSK',  emoji: '🌆', top: '#2b1a33', bottom: '#0f0f0f', stars: 0 },
      { name: 'NIGHT', emoji: '🌙', top: '#0a0d1c', bottom: '#0f0f0f', stars: 1 },
      { name: 'DAWN',  emoji: '🌅', top: '#241a2e', bottom: '#0f0f0f', stars: 0 },
    ]
    // posisi bintang statis (untuk fase malam)
    const STARS = Array.from({ length: 22 }, () => ({
      x: Math.random() * W, y: Math.random() * (GROUND - 30), r: Math.random() * 1.2 + 0.3,
    }))

    function drawSky(phaseIdx: number) {
      const ph = PHASES[phaseIdx]
      const grad = ctx.createLinearGradient(0, 0, 0, H)
      grad.addColorStop(0, ph.top)
      grad.addColorStop(1, ph.bottom)
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, W, H)
      if (ph.stars) {
        for (const st of STARS) {
          ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.sin(performance.now() / 600 + st.x) * 0.25})`
          ctx.beginPath()
          ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    function drawPhaseBadge(phaseIdx: number) {
      const ph = PHASES[phaseIdx]
      ctx.font = '13px "Segoe UI Emoji", sans-serif'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'
      ctx.fillText(ph.emoji, 8, 14)
      ctx.fillStyle = '#9ca3af'
      ctx.font = 'bold 9px monospace'
      ctx.fillText(ph.name, 26, 14)
    }

    let lastTime = performance.now()

    function loop(now: number) {
      const g = s.current
      const dt = Math.min(now - lastTime, 100) // ms sejak frame lalu (cap biar tidak lompat)
      lastTime = now
      const phaseIdx = g.phase % PHASES.length
      ctx.clearRect(0, 0, W, H)
      drawSky(phaseIdx)

      // Grid
      ctx.strokeStyle = '#06b6d406'
      ctx.lineWidth = 0.5
      for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke() }
      for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() }

      // Ground line
      const grd = ctx.createLinearGradient(0, 0, W, 0)
      grd.addColorStop(0, '#06b6d420'); grd.addColorStop(0.5, '#06b6d4'); grd.addColorStop(1, '#06b6d420')
      ctx.fillStyle = grd
      ctx.fillRect(0, GROUND, W, 1.5)

      // Day/night badge (selalu tampil)
      drawPhaseBadge(phaseIdx)

      // ── IDLE ──
      if (!g.started) {
        drawShadow(PX)
        drawChar(PX, g.py, false)
        ctx.fillStyle = '#06b6d4'
        ctx.font = 'bold 13px monospace'
        ctx.textAlign = 'center'
        ctx.fillText('[ SPACE ] or TAP to play', W / 2, H / 2 - 6)
        ctx.fillStyle = '#374151'
        ctx.font = '10px monospace'
        ctx.fillText('Dodge the bugs!', W / 2, H / 2 + 12)
        g.rafId = requestAnimationFrame(loop)
        return
      }

      // ── GAME OVER (canvas: info ringkas, detail submit/leaderboard di overlay) ──
      if (g.gameOver) {
        drawShadow(PX)
        drawChar(PX, g.py, false)
        g.particles.forEach(p => {
          ctx.globalAlpha = Math.max(p.life, 0); ctx.fillStyle = p.color
          ctx.fillRect(p.x, p.y, 3, 3); ctx.globalAlpha = 1
        })

        const rank =
          g.score >= 1000 ? '10x Engineer' :
          g.score >= 600 ? 'Senior Dev' :
          g.score >= 300 ? 'Mid-level Dev' :
          g.score >= 100 ? 'Junior Dev' : 'Intern'
        const tokens = Math.round(g.bonus / COIN_BONUS)
        const isBest = g.score >= g.hiScore && g.score > 0

        ctx.textAlign = 'center'
        ctx.fillStyle = '#ef4444'
        ctx.font = 'bold 17px monospace'
        ctx.fillText('// GAME OVER', W / 2, H / 2 - 28)

        // skor besar
        ctx.fillStyle = '#06b6d4'
        ctx.font = 'bold 22px monospace'
        ctx.fillText(String(g.score), W / 2, H / 2 - 2)

        // badge "NEW BEST" atau "Best: x"
        ctx.font = '10px monospace'
        ctx.fillStyle = isBest ? '#4ade80' : '#6b7280'
        ctx.fillText(isBest ? '★ NEW BEST!' : `Best ${g.hiScore}`, W / 2, H / 2 + 16)

        // rank + token
        ctx.fillStyle = '#9ca3af'
        ctx.font = 'bold 10px monospace'
        ctx.fillText(`Rank: ${rank}   ·   Tokens: ${tokens}`, W / 2, H / 2 + 32)

        g.rafId = requestAnimationFrame(loop)
        return
      }

      // ── PLAYING ──
      g.frame++
      g.score = Math.floor(g.frame / 6) + g.bonus
      if (g.score > g.hiScore) g.hiScore = g.score
      g.speed = 4 + g.score / 300 // unlimited — terus bertambah seiring skor

      // Spawn token skill berkala (tiap ~150 jarak). Token = kesempatan ganti waktu.
      const distScore = Math.floor(g.frame / 6)
      const curPhaseBlock = Math.floor(distScore / 150)
      if (distScore % 150 >= 110 && g.coinPhase !== curPhaseBlock) {
        g.coinPhase = curPhaseBlock
        g.coins.push({
          x: W + 10,
          y: GROUND - (104 + Math.random() * 26),
          idx: Math.floor(Math.random() * SKILL_TOKENS.length),
          taken: false,
        })
      }

      // Animasi lari berbasis waktu (fps naik seiring speed). Cuma saat di tanah.
      if (g.onGround) {
        const speedT = (g.speed - 4) / 4 // 0 di awal, 1 saat speed max
        const animFps = ANIM_FPS_START + (ANIM_FPS_MAX - ANIM_FPS_START) * Math.min(speedT, 1)
        g.animAcc += dt
        const interval = 1000 / animFps
        while (g.animAcc >= interval) {
          g.animAcc -= interval
          g.animFrame = (g.animFrame + 1) % FRAME_COUNT
        }
      }

      // Physics
      if (!g.onGround) {
        g.vy += GRAVITY
        g.py += g.vy
        if (g.py >= GROUND - CHAR_H) { g.py = GROUND - CHAR_H; g.vy = 0; g.onGround = true }
      }

      // Spawn — cluster makin sering & padat seiring skor naik
      g.nextObs--
      if (g.nextObs <= 0) {
        // tentukan jumlah bug dalam satu cluster (cluster = grup RAPAT, sekali lompat)
        const r = Math.random()
        let clusterSize = 1
        if (g.score > 500 && r > 0.7) clusterSize = 3
        else if (g.score > 250 && r > 0.55) clusterSize = 2

        // Opsi A: hitung gap agar SPAN cluster = rasio tetap dari window lompatan.
        // window (px) = speed × JUMP_WINDOW_FRAMES. Karena lebar box konstan,
        // gap dihitung dari target span → difficulty cluster konsisten di semua speed.
        const boxW = 28
        let gap = 6
        if (clusterSize > 1) {
          const targetSpan = TARGET_RATIO * g.speed * JUMP_WINDOW_FRAMES
          gap = (targetSpan - clusterSize * boxW) / (clusterSize - 1)
          gap = Math.max(6, Math.min(gap, 140)) // clamp biar tidak terlalu rapat/jauh
        }
        gap += Math.random() * 6 // sedikit variasi

        let offset = 0
        for (let i = 0; i < clusterSize; i++) {
          const t = OBS_TYPES[Math.floor(Math.random() * OBS_TYPES.length)]
          const bh = 18 + Math.random() * 10  // tinggi building 18-28
          const es = 26 + Math.random() * 8   // ukuran bug 26-34
          g.obstacles.push({ x: W + 10 + offset, w: boxW, bh, es, color: t.color, label: t.label, emoji: t.emoji })
          offset += boxW + gap
        }

        // jeda sebelum spawn berikutnya: cukup untuk recovery & mendarat
        const base = 65 + Math.random() * 60 - Math.min(g.score / 130, 20)
        g.nextObs = Math.max(38, base + (clusterSize - 1) * 14)
      }

      // Hitbox (badan inti)
      const hitX = PX + CHAR_W * HB.x
      const hitW = CHAR_W * HB.w
      const hitY = g.py + CHAR_H * HB.y
      const hitH = CHAR_H * HB.h

      g.obstacles = g.obstacles.filter(obs => {
        obs.x -= g.speed
        // hitbox = building + bug di atasnya (emoji punya margin transparan → 0.82)
        const obsLeft = obs.x + 2
        const obsRight = obs.x + obs.w - 2
        const obsTop = GROUND - (obs.bh + obs.es * 0.82)
        if (
          hitX < obsRight &&
          hitX + hitW > obsLeft &&
          hitY + hitH > obsTop &&
          hitY < GROUND
        ) {
          g.gameOver = true
          spawnParticles(obs.x + obs.w / 2, GROUND - obs.bh, obs.color)
          playSound('over')
          setFinalScore(g.score)
          // Tampilkan layar GAME OVER di canvas dulu (~3s), baru overlay leaderboard
          setTimeout(() => {
            if (s.current.gameOver) { // batal jika sudah restart/quit
              setSubmitted(false)
              setOver(true)
              loadBoard()
            }
          }, 3000)
        }
        drawObs(obs)
        return obs.x + obs.w > -10
      })

      // ── Skill tokens (collectible) ──
      const R = 16
      g.coins = g.coins.filter(coin => {
        coin.x -= g.speed
        const tok = SKILL_TOKENS[coin.idx]
        // deteksi ambil: jarak titik terdekat hitbox ke pusat coin < radius
        const nx = Math.max(hitX, Math.min(coin.x, hitX + hitW))
        const ny = Math.max(hitY, Math.min(coin.y, hitY + hitH))
        const dist = Math.hypot(coin.x - nx, coin.y - ny)
        if (!coin.taken && dist < R) {
          coin.taken = true
          g.bonus += COIN_BONUS
          g.phase = (g.phase + 1) % PHASES.length // claim token → ganti waktu
          playSound('coin')
          g.popups.push({ x: coin.x, y: coin.y, text: `+${COIN_BONUS} ${tok.name}`, color: tok.ring, life: 1 })
          return false
        }
        // gambar coin (diam + glow + logo resmi)
        const cyc = coin.y
        ctx.save()
        ctx.shadowColor = tok.ring
        ctx.shadowBlur = 12
        ctx.beginPath(); ctx.arc(coin.x, cyc, R, 0, Math.PI * 2)
        ctx.fillStyle = '#161616'; ctx.fill()
        ctx.lineWidth = 2; ctx.strokeStyle = tok.ring; ctx.stroke()
        ctx.restore()
        // logo
        const img = tokenImgsRef.current[coin.idx]
        if (img && img.complete) {
          const s = 19
          ctx.drawImage(img, coin.x - s / 2, cyc - s / 2, s, s)
        }
        return coin.x + R > -10
      })

      // ── Popups skor (+25 Skill) ──
      g.popups = g.popups.filter(pp => {
        pp.y -= 0.7; pp.life -= 0.018
        ctx.globalAlpha = Math.max(pp.life, 0)
        ctx.fillStyle = pp.color
        ctx.font = 'bold 10px monospace'
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
        ctx.fillText(pp.text, pp.x, pp.y)
        ctx.globalAlpha = 1
        return pp.life > 0
      })

      // Particles
      g.particles = g.particles.filter(p => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.2; p.life -= 0.04
        ctx.globalAlpha = Math.max(p.life, 0); ctx.fillStyle = p.color
        ctx.fillRect(p.x, p.y, 3, 3); ctx.globalAlpha = 1
        return p.life > 0
      })

      drawShadow(PX)
      drawChar(PX, g.py, true)

      if (DEBUG_HITBOX) {
        ctx.strokeStyle = '#00ff00'; ctx.lineWidth = 1
        ctx.strokeRect(hitX, hitY, hitW, hitH)
      }

      // HUD — geser skor ke kiri saat fullscreen biar tidak ketutupan tombol ✕
      const scoreX = H > H_SMALL ? W - 40 : W - 8
      ctx.fillStyle = '#06b6d4'
      ctx.font = 'bold 11px monospace'
      ctx.textAlign = 'right'
      ctx.textBaseline = 'alphabetic' // eksplisit biar posisi skor konsisten
      ctx.fillText(String(g.score).padStart(5, '0'), scoreX, 16)
      ctx.fillStyle = '#1f2937'
      ctx.font = '9px monospace'
      ctx.fillText(`HI ${String(g.hiScore).padStart(5, '0')}`, scoreX, 27)

      if (g.speed > 5.5) {
        // di bawah badge fase biar tidak menumpuk
        ctx.fillStyle = '#06b6d415'
        ctx.beginPath(); ctx.roundRect(8, 24, 42, 15, 4); ctx.fill()
        ctx.fillStyle = '#06b6d4'
        ctx.font = 'bold 8px monospace'
        ctx.textAlign = 'left'
        ctx.fillText(`x${g.speed.toFixed(1)}`, 12, 34)
      }

      g.rafId = requestAnimationFrame(loop)
    }

    s.current.rafId = requestAnimationFrame(loop)
    const onKey = (e: KeyboardEvent) => {
      const g = s.current
      // ESC: keluar ke layar awal (kapan saja)
      if (e.code === 'Escape') {
        if (g.started || g.gameOver) { e.preventDefault(); toIdle() }
        return
      }
      // jangan ganggu saat user mengetik nama di input
      const el = document.activeElement
      if (el && el.tagName === 'INPUT') return
      if (e.code === 'Space') {
        e.preventDefault()
        if (g.gameOver) restart() // langsung main lagi tanpa submit
        else act()                // start / jump
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(s.current.rafId)
      window.removeEventListener('keydown', onKey)
    }
  }, [act, spawnParticles, loadBoard, restart, toIdle, playSound, fullscreen])

  const rankColor = (i: number) =>
    i === 0 ? 'text-[#06b6d4]' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-amber-600' : 'text-gray-500'

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <p className="font-mono text-[9px] text-gray-700 tracking-[0.3em] uppercase">
          Mini Game · Dev Runner
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="font-mono text-[10px] text-gray-600 hover:text-[#06b6d4] transition-colors px-2 py-0.5 border border-[#1e1e1e] rounded"
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? '🔇 muted' : '🔊 sound'}
          </button>
          <button
            onClick={toggleFullscreen}
            className="font-mono text-[10px] text-gray-600 hover:text-[#06b6d4] transition-colors px-2 py-0.5 border border-[#1e1e1e] rounded"
            aria-label="Fullscreen"
          >
            ⛶ fullscreen
          </button>
        </div>
      </div>

      {(() => {
      const panel = (
      <div
        className={
          fullscreen
            ? 'fixed z-[95] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl overflow-hidden border border-[#06b6d4]/30 shadow-2xl'
            : 'relative rounded-xl overflow-hidden border border-[#1e1e1e] hover:border-[#06b6d4]/20 transition-colors'
        }
        style={
          fullscreen
            ? { boxShadow: '0 0 60px #06b6d420', width: 'min(96vw, calc(80vh * 1.706))' }
            : { boxShadow: '0 0 30px #06b6d408' }
        }
      >
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="w-full cursor-pointer"
          style={{ display: 'block' }}
          onClick={act}
        />

        {/* Tombol exit (fullscreen) */}
        {fullscreen && (
          <button
            onClick={toggleFullscreen}
            className="absolute top-2 right-2 z-20 w-8 h-8 rounded-lg bg-[#0f0f0f]/80 border border-[#06b6d4]/40 text-[#06b6d4] flex items-center justify-center hover:bg-[#06b6d4]/15 transition-colors"
            aria-label="Exit fullscreen"
          >
            ✕
          </button>
        )}

        {/* Hint putar HP (mobile portrait saat fullscreen) */}
        {fullscreen && portrait && (
          <div className="absolute inset-0 z-30 bg-[#0d0d0f]/95 flex flex-col items-center justify-center gap-3 sm:hidden">
            <span className="text-4xl animate-pulse">🔄</span>
            <p className="font-mono text-[#06b6d4] text-sm">Rotate your phone</p>
            <p className="font-mono text-gray-600 text-[10px]">landscape for the best experience</p>
            <button onClick={toggleFullscreen} className="mt-2 font-mono text-[10px] text-gray-500 underline">exit</button>
          </div>
        )}

        {/* ── Leaderboard overlay (scroll dari atas agar tidak terpotong) ── */}
        {over && (
          <div className="overlay-in absolute inset-0 bg-[#0f0f0f] flex flex-col items-center justify-start px-4 py-2.5 overflow-y-auto">
            <p className="font-mono text-[10px] text-gray-500 mb-1.5 shrink-0">
              Score <span className="text-[#06b6d4] font-bold">{finalScore}</span>
            </p>
            {/* Submit row */}
            {!submitted ? (
              <div className="flex items-center gap-2 w-full max-w-[300px] shrink-0">
                <input
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit() }}
                  maxLength={20}
                  placeholder="Enter your name"
                  className="flex-1 min-w-0 bg-[#161616] border border-[#2a2a2a] rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-[#06b6d4] transition-colors"
                />
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-3 py-1.5 bg-[#06b6d4] text-black text-xs font-semibold rounded-lg hover:bg-[#22d3ee] disabled:opacity-50 transition-colors whitespace-nowrap shrink-0"
                >
                  {submitting ? '...' : 'Submit'}
                </button>
              </div>
            ) : (
              <p className="font-mono text-emerald-400 text-[11px] py-1 shrink-0">✓ Score submitted!</p>
            )}

            {/* Leaderboard (top 5) */}
            <div className="w-full max-w-[300px] mt-2 shrink-0">
              <p className="font-mono text-[9px] text-gray-600 tracking-[0.2em] uppercase mb-1 text-center">
                🏆 Top Players
              </p>
              <div className="space-y-0.5">
                {boardLoading && <p className="font-mono text-[10px] text-gray-700 text-center py-1.5">Loading…</p>}
                {!boardLoading && board.length === 0 && (
                  <p className="font-mono text-[10px] text-gray-700 text-center py-1.5">Be the first to submit!</p>
                )}
                {!boardLoading && board.slice(0, 5).map((row, i) => (
                  <div key={row.id} className="flex items-center justify-between font-mono text-[11px] bg-[#161616] rounded px-2 py-0.5">
                    <span className="flex items-center gap-2 min-w-0">
                      <span className={`font-bold w-3 ${rankColor(i)}`}>{i + 1}</span>
                      <span className="text-gray-300 truncate">{row.name}</span>
                    </span>
                    <span className="text-[#06b6d4] font-bold ml-2">{row.score}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2.5 shrink-0">
              <button
                onClick={restart}
                className="px-4 py-1.5 bg-[#06b6d4] text-black text-xs font-semibold rounded-lg hover:bg-[#22d3ee] transition-all"
              >
                ▸ Play Again
              </button>
              <button
                onClick={toIdle}
                className="px-4 py-1.5 border border-[#2a2a2a] text-gray-400 text-xs font-mono rounded-lg hover:border-[#3a3a3a] transition-all"
              >
                Quit
              </button>
            </div>
          </div>
        )}
      </div>
      )
      return fullscreen
        ? createPortal(
            <>
              <div className="fixed inset-0 z-[90] bg-black/85 backdrop-blur-sm" onClick={toggleFullscreen} />
              {panel}
            </>,
            document.body
          )
        : panel
      })()}

      <p className="font-mono text-[9px] text-gray-600 mt-2 text-right">
        space / tap · jump · esc quit
      </p>
    </div>
  )
}
