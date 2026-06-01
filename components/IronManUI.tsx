'use client'

/* ───────── Jarvis helmet (custom image asset) ───────── */
export function IronHelmet({ size = 24 }: { size?: number; eye?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/jarvis-helmet.png"
      alt="Jarvis"
      width={size}
      height={size}
      className="object-contain select-none pointer-events-none"
      style={{ width: size, height: size }}
      draggable={false}
    />
  )
}

/* ───────── Arc Reactor (animated) ───────── */
export function ArcReactor({ size = 28 }: { size?: number }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* outer rotating ring */}
      <div className="absolute inset-0 rounded-full spin-slow"
        style={{ border: '2px solid #22d3ee55', borderTopColor: '#22d3ee', borderRightColor: '#22d3ee' }} />
      {/* inner counter-rotating ring */}
      <div className="absolute rounded-full spin-reverse"
        style={{ inset: '20%', border: '1.5px dashed #22d3ee88' }} />
      {/* core */}
      <div className="rounded-full"
        style={{
          width: size * 0.34, height: size * 0.34,
          background: 'radial-gradient(circle, #ffffff 0%, #22d3ee 60%, #0891b2 100%)',
          boxShadow: '0 0 10px #22d3ee, 0 0 20px #22d3ee88',
        }}
      />
    </div>
  )
}
