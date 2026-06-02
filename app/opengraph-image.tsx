import { ImageResponse } from 'next/og'

export const alt = 'Alif Ardezir Zidane — Fullstack & Mobile Developer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  const chips = ['Flutter', 'Next.js', 'TypeScript', 'Supabase', 'Claude AI']

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#0f0f0f',
          color: '#ffffff',
          padding: '80px',
          position: 'relative',
          fontFamily: 'sans-serif',
        }}
      >
        {/* ambient glow */}
        <div
          style={{
            position: 'absolute',
            top: '-180px',
            right: '-120px',
            width: '600px',
            height: '600px',
            borderRadius: '9999px',
            background: 'radial-gradient(circle, rgba(6,182,212,0.22) 0%, rgba(6,182,212,0) 70%)',
            display: 'flex',
          }}
        />

        {/* logo + label */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'flex', fontSize: '38px', fontWeight: 900, letterSpacing: '-1px' }}>
            <span style={{ color: '#06b6d4' }}>AAZ</span>
            <span style={{ color: '#ffffff' }}>.</span>
          </div>
          <div
            style={{
              display: 'flex',
              marginLeft: '22px',
              fontSize: '18px',
              letterSpacing: '8px',
              color: '#6b7280',
            }}
          >
            PORTFOLIO
          </div>
        </div>

        {/* name */}
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
          <div style={{ display: 'flex', fontSize: '82px', fontWeight: 900, letterSpacing: '-2px' }}>
            Alif Ardezir
          </div>
          <div style={{ display: 'flex', fontSize: '82px', fontWeight: 900, letterSpacing: '-2px', color: '#06b6d4' }}>
            Zidane
          </div>
        </div>

        {/* subtitle */}
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '26px' }}>
          <div style={{ display: 'flex', width: '46px', height: '3px', background: '#06b6d4', marginRight: '18px' }} />
          <div style={{ display: 'flex', fontSize: '30px', color: '#cbd5e1' }}>
            Fullstack &amp; Mobile Developer
          </div>
        </div>

        {/* chips */}
        <div style={{ display: 'flex', marginTop: '40px' }}>
          {chips.map((c) => (
            <div
              key={c}
              style={{
                display: 'flex',
                marginRight: '14px',
                padding: '10px 20px',
                fontSize: '22px',
                color: '#67e8f9',
                background: 'rgba(6,182,212,0.10)',
                border: '1px solid rgba(6,182,212,0.30)',
                borderRadius: '10px',
              }}
            >
              {c}
            </div>
          ))}
        </div>

        {/* bottom: status + url */}
        <div
          style={{
            position: 'absolute',
            left: '80px',
            bottom: '64px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', width: '12px', height: '12px', borderRadius: '9999px', background: '#34d399', marginRight: '12px' }} />
          <div style={{ display: 'flex', fontSize: '22px', color: '#9ca3af' }}>Open to Work</div>
        </div>
        <div
          style={{
            position: 'absolute',
            right: '80px',
            bottom: '64px',
            display: 'flex',
            fontSize: '22px',
            color: '#6b7280',
          }}
        >
          alifzidane-portofolio.vercel.app
        </div>
      </div>
    ),
    { ...size }
  )
}
