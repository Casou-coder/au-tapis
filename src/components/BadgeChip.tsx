'use client';

import { BadgeDef, BadgeIcon } from '@/lib/badges';

const CONIC_PATTERN = (() => {
  const parts: string[] = [];
  for (let i = 0; i < 12; i++) {
    const s = i * 30 + 7.5;
    parts.push(
      `rgba(255,255,255,0.07) ${s}deg ${s + 15}deg`,
      `transparent ${s + 15}deg ${s + 30}deg`,
    );
  }
  return `conic-gradient(${parts.join(', ')})`;
})();

function Icon({ type, size, color }: { type: BadgeIcon; size: number; color: string }) {
  const s = size;
  switch (type) {
    case 'flame':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 2C12 2 7 8 7 13a5 5 0 0010 0c0-2-1-4-2-5 0 2-1.5 3-2 3-.5 0-1-.5-1-1 0-2 1-5 0-8z" fill={color} opacity=".9"/>
          <path d="M12 17a2 2 0 01-2-2c0-1.5 2-3 2-3s2 1.5 2 3a2 2 0 01-2 2z" fill="rgba(255,255,255,0.6)"/>
        </svg>
      );
    case 'spade':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 3L4 10.5c0 3 2 5 4.5 4.5-.5 1.5-1.5 2.5-2.5 3h8c-1-.5-2-1.5-2.5-3C14 15.5 16 13.5 16 10.5L12 3z" fill={color} opacity=".9"/>
        </svg>
      );
    case 'crown':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3 18h18v2H3v-2zM3 16l3-8 4 5 2-7 2 7 4-5 3 8H3z" fill={color} opacity=".9"/>
        </svg>
      );
    case 'target':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" opacity=".5"/>
          <circle cx="12" cy="12" r="5" stroke={color} strokeWidth="2" opacity=".75"/>
          <circle cx="12" cy="12" r="2" fill={color}/>
        </svg>
      );
    case 'circuit':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="9" y="9" width="6" height="6" rx="1" fill={color} opacity=".9"/>
          <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.8 2.8M14.9 14.9l2.8 2.8M17.7 6.3l-2.8 2.8M9.1 14.9l-2.8 2.8" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity=".7"/>
        </svg>
      );
    case 'chips':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <ellipse cx="12" cy="15" rx="7" ry="3" fill={color} opacity=".4"/>
          <ellipse cx="12" cy="12" rx="7" ry="3" fill={color} opacity=".6"/>
          <ellipse cx="12" cy="9" rx="7" ry="3" fill={color} opacity=".9"/>
          <path d="M5 9v6M19 9v6" stroke={color} strokeWidth="1" opacity=".5"/>
        </svg>
      );
    case 'eye':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" stroke={color} strokeWidth="2" opacity=".7"/>
          <circle cx="12" cy="12" r="3" fill={color} opacity=".9"/>
        </svg>
      );
    case 'sigma':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M17 6H7l5.5 6L7 18h10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity=".9"/>
        </svg>
      );
    case 'book':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 4h7a1 1 0 011 1v14a1 1 0 01-1 0c0-1-1-1-2-1H4V4z" fill={color} opacity=".5"/>
          <path d="M20 4h-7a1 1 0 00-1 1v14a1 1 0 001 0c0-1 1-1 2-1h5V4z" fill={color} opacity=".9"/>
        </svg>
      );
    case 'spark':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M13 2L4.5 13H11L10 22l9.5-11H13.5L13 2z" fill={color} opacity=".9"/>
        </svg>
      );
    case 'diamond':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 2L22 12L12 22L2 12Z" fill={color} opacity=".9"/>
          <path d="M12 6L18 12L12 18L6 12Z" fill="rgba(0,0,0,0.18)"/>
          <path d="M12 2L22 12L12 22L2 12Z" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5"/>
        </svg>
      );
  }
}

export function BadgeChip({
  badge,
  earned,
  isEn,
  size = 80,
}: {
  badge: BadgeDef;
  earned: boolean;
  isEn?: boolean;
  size?: number;
}) {
  const name = isEn ? badge.nameEn : badge.nameFr;
  const cond = isEn ? badge.condEn : badge.condFr;
  const c = badge.color;

  const chipStyle: React.CSSProperties = earned
    ? {
        width: size,
        height: size,
        borderRadius: '50%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        background: `radial-gradient(circle at 38% 32%, color-mix(in srgb, ${c} 15%, #1a2a1a), #0c160c 75%)`,
        boxShadow: `0 0 0 2px ${c}88, 0 0 0 5px #00000070, 0 0 0 7px ${c}25, 0 4px 18px #00000088, 0 0 16px 2px ${c}18, inset 0 1px 0 rgba(255,255,255,0.06)`,
        flexShrink: 0,
      }
    : {
        width: size,
        height: size,
        borderRadius: '50%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        background: '#0c160c',
        boxShadow: '0 0 0 2px rgba(80,80,80,0.2)',
        filter: 'grayscale(1) brightness(0.4)',
        flexShrink: 0,
      };

  const iconSize = Math.round(size * 0.32);
  const inset = Math.round(size * 0.1);
  const ringInset = Math.round(size * 0.115);

  return (
    <div
      className="flex flex-col items-center gap-1.5"
      style={{ width: size + 12, transition: 'transform 0.25s ease' }}
      onMouseEnter={e => { if (earned) (e.currentTarget as HTMLElement).style.transform = 'translateY(-5px)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; }}
    >
      <div style={chipStyle} title={`${name} — ${cond}`}>
        {earned && (
          <>
            {/* Conic edge segments */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset,
                borderRadius: '50%',
                background: CONIC_PATTERN,
                pointerEvents: 'none',
              }}
            />
            {/* Dashed inner ring */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: ringInset,
                borderRadius: '50%',
                border: `1px dashed ${c}30`,
                pointerEvents: 'none',
              }}
            />
          </>
        )}

        {/* Icon */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Icon type={badge.icon} size={iconSize} color={earned ? c : '#555'} />
        </div>

        {/* Stars (ritualiste series) */}
        {badge.stars && (
          <div style={{ display: 'flex', gap: 2, position: 'relative', zIndex: 1 }}>
            {Array.from({ length: badge.stars[1] }, (_, i) => (
              <span
                key={i}
                style={{
                  fontSize: Math.round(size * 0.085),
                  color: c,
                  opacity: earned ? (i < badge.stars![0] ? 1 : 0.2) : 0.3,
                  lineHeight: 1,
                }}
              >
                ★
              </span>
            ))}
          </div>
        )}

        {/* Numeric tag (grinder series) */}
        {badge.tag && (
          <span
            style={{
              fontSize: Math.round(size * 0.095),
              fontWeight: 700,
              letterSpacing: '0.02em',
              color: earned ? `${c}ee` : '#444',
              position: 'relative',
              zIndex: 1,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {badge.tag}
          </span>
        )}
      </div>

      {/* Label */}
      <div style={{ textAlign: 'center', width: size + 12 }}>
        <div
          style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: earned ? '#aabfaa' : '#2a3a2a',
            lineHeight: 1.3,
          }}
        >
          {name}
        </div>
        {!earned && (
          <div style={{ fontSize: 8, color: '#1c281c', marginTop: 1, lineHeight: 1.3 }}>
            {cond}
          </div>
        )}
      </div>
    </div>
  );
}
