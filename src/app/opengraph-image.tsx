import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Forged Poker : Apprenez le Poker Texas Hold\'em en Français';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #060d08 0%, #0d1f10 50%, #060d08 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: 'absolute',
            width: '800px',
            height: '800px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(26,74,46,0.5) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Card suits background */}
        <div style={{ position: 'absolute', top: '40px', left: '60px', fontSize: '100px', opacity: 0.08, color: 'white' }}>♠</div>
        <div style={{ position: 'absolute', top: '40px', right: '60px', fontSize: '80px', opacity: 0.08, color: '#ef4444' }}>♥</div>
        <div style={{ position: 'absolute', bottom: '40px', left: '60px', fontSize: '90px', opacity: 0.08, color: '#ef4444' }}>♦</div>
        <div style={{ position: 'absolute', bottom: '40px', right: '60px', fontSize: '85px', opacity: 0.08, color: 'white' }}>♣</div>

        {/* Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(202,163,60,0.15)',
            border: '1px solid rgba(202,163,60,0.35)',
            borderRadius: '999px',
            padding: '8px 20px',
            marginBottom: '32px',
            color: '#c9a84c',
            fontSize: '16px',
            fontWeight: '600',
            letterSpacing: '0.05em',
          }}
        >
          Du débutant au niveau professionnel
        </div>

        {/* Logo + Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '16px' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #b8860b, #daa520)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '36px',
              color: 'black',
              fontWeight: '900',
            }}
          >
            ♠
          </div>
          <div
            style={{
              fontSize: '80px',
              fontWeight: '800',
              color: '#c9a84c',
              letterSpacing: '-2px',
              lineHeight: 1,
            }}
          >
            Forged Poker
          </div>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '30px',
            color: 'rgba(255,255,255,0.55)',
            fontWeight: '300',
            marginBottom: '48px',
            letterSpacing: '0.02em',
          }}
        >
          Maîtrisez le poker.
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: '48px' }}>
          {[
            { value: '5', label: 'niveaux' },
            { value: '35+', label: 'modules' },
            { value: '50+', label: 'mains' },
            { value: '100%', label: 'gratuit' },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span style={{ fontSize: '36px', fontWeight: '800', color: 'white' }}>{stat.value}</span>
              <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
