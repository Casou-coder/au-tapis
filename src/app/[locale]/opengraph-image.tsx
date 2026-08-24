import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Forged Poker — Master poker from beginner to professional';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale !== 'fr';

  let fontDataRegular: ArrayBuffer | null = null;
  let fontDataBold: ArrayBuffer | null = null;
  try {
    const [r, b] = await Promise.all([
      fetch('https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2'),
      fetch('https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiA.woff2'),
    ]);
    fontDataRegular = await r.arrayBuffer();
    fontDataBold = await b.arrayBuffer();
  } catch {
    // fallback to system font
  }

  const tagline = isEn
    ? 'Master poker. From beginner to professional.'
    : 'Maîtrisez le poker. Du débutant au pro.';

  const features = isEn
    ? ['Free', 'Interactive', 'GTO', '100+ challenges']
    : ['Gratuit', 'Interactif', 'GTO', '100+ défis'];

  type W = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  const fonts: { name: string; data: ArrayBuffer; style: 'normal'; weight: W }[] = [];
  if (fontDataRegular) fonts.push({ name: 'Inter', data: fontDataRegular, style: 'normal', weight: 400 });
  if (fontDataBold) fonts.push({ name: 'Inter', data: fontDataBold, style: 'normal', weight: 700 });

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#060d08',
          fontFamily: fontDataBold ? 'Inter' : 'Arial, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Radial glow behind content */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 50%, rgba(26,74,46,0.45) 0%, transparent 70%)',
          display: 'flex',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 80% 20%, rgba(201,168,76,0.08) 0%, transparent 50%)',
          display: 'flex',
        }} />

        {/* Corner suits */}
        <div style={{
          position: 'absolute', top: -60, left: -30,
          fontSize: 340, lineHeight: 1,
          color: 'rgba(255,255,255,0.025)',
          display: 'flex',
        }}>♠</div>
        <div style={{
          position: 'absolute', top: -50, right: -20,
          fontSize: 300, lineHeight: 1,
          color: 'rgba(201,168,76,0.05)',
          display: 'flex',
        }}>♥</div>
        <div style={{
          position: 'absolute', bottom: -70, left: -20,
          fontSize: 310, lineHeight: 1,
          color: 'rgba(201,168,76,0.04)',
          display: 'flex',
        }}>♦</div>
        <div style={{
          position: 'absolute', bottom: -50, right: -40,
          fontSize: 330, lineHeight: 1,
          color: 'rgba(255,255,255,0.025)',
          display: 'flex',
        }}>♣</div>

        {/* Center content */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0,
          zIndex: 1,
          padding: '0 80px',
        }}>
          {/* Mini suits */}
          <div style={{
            display: 'flex', gap: 18, marginBottom: 28,
            fontSize: 32, color: '#c9a84c', opacity: 0.55,
          }}>
            <span>♠</span><span style={{ color: '#e05555' }}>♥</span>
            <span style={{ color: '#e05555' }}>♦</span><span>♣</span>
          </div>

          {/* Title */}
          <div style={{
            display: 'flex',
            fontSize: 100,
            fontWeight: 700,
            letterSpacing: '-3px',
            lineHeight: 1,
            color: '#c9a84c',
            marginBottom: 28,
          }}>
            Forged Poker.
          </div>

          {/* Tagline */}
          <div style={{
            display: 'flex',
            fontSize: 34,
            fontWeight: 400,
            color: 'rgba(255,255,255,0.7)',
            letterSpacing: '-0.5px',
            lineHeight: 1.4,
            textAlign: 'center',
            maxWidth: 760,
            marginBottom: 36,
          }}>
            {tagline}
          </div>

          {/* Feature pills */}
          <div style={{ display: 'flex', gap: 20 }}>
            {features.map((f) => (
              <div
                key={f}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 20px',
                  borderRadius: 999,
                  background: 'rgba(201,168,76,0.08)',
                  border: '1px solid rgba(201,168,76,0.2)',
                  fontSize: 18,
                  color: 'rgba(201,168,76,0.75)',
                  fontWeight: 400,
                }}
              >
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom gold line */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: 3,
          background: 'linear-gradient(to right, transparent, #c9a84c 20%, #f0d060 50%, #c9a84c 80%, transparent)',
          display: 'flex',
        }} />

        {/* Domain watermark */}
        <div style={{
          position: 'absolute',
          bottom: 20, right: 40,
          fontSize: 18,
          color: 'rgba(201,168,76,0.4)',
          fontWeight: 400,
          display: 'flex',
        }}>
          forgedpoker.com
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fonts.length > 0 ? fonts : undefined,
    }
  );
}
