import { useEffect, useState } from 'react';
import { tokens } from '../styles/tokens.js';
import { ENV } from '../data/assets.js';

export default function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState('dark'); // dark → image → logo → tagline → out

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) { onComplete(); return; }

    const t1 = setTimeout(() => setPhase('image'),   200);
    const t2 = setTimeout(() => setPhase('logo'),    900);
    const t3 = setTimeout(() => setPhase('tagline'), 1700);
    const t4 = setTimeout(() => setPhase('out'),     2800);
    const t5 = setTimeout(() => onComplete(),        3350);
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, [onComplete]);

  const imgVisible  = phase === 'image' || phase === 'logo' || phase === 'tagline';
  const logoVisible = phase === 'logo'  || phase === 'tagline';
  const tagVisible  = phase === 'tagline';
  const isOut       = phase === 'out';

  return (
    <div
      onClick={onComplete}
      aria-label="SIDELINE intro. Click to skip."
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onComplete()}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 9999,
        opacity: isOut ? 0 : 1,
        transition: isOut ? 'opacity 0.55s ease' : 'none',
        userSelect: 'none',
        overflow: 'hidden',
      }}
    >
      {/* ── Full-bleed background: green neon tunnel ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${ENV.tunnelGreen})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: imgVisible ? 0.55 : 0,
        transform: imgVisible ? 'scale(1.02)' : 'scale(1.08)',
        transition: 'opacity 1.1s ease, transform 1.4s ease',
        willChange: 'transform, opacity',
      }} />

      {/* ── Dark vignette overlay ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, rgba(0,0,0,0.7) 100%),
          linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.75) 100%)
        `,
      }} />

      {/* ── Lime accent glow from centre ── */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -55%)',
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(200,255,0,0.07) 0%, transparent 70%)`,
        opacity: logoVisible ? 1 : 0,
        transition: 'opacity 0.8s ease',
        pointerEvents: 'none',
      }} />

      {/* ── Logo ── */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
      }}>
        {/* Wordmark */}
        <h1 style={{
          fontFamily: tokens.fontDisplay,
          fontSize: 'clamp(64px, 14vw, 120px)',
          fontWeight: 900,
          letterSpacing: '0.06em',
          color: tokens.text,
          lineHeight: 1,
          opacity: logoVisible ? 1 : 0,
          transform: logoVisible ? 'translateY(0)' : 'translateY(18px)',
          transition: 'opacity 0.65s ease, transform 0.65s ease',
          textShadow: '0 2px 40px rgba(0,0,0,0.9)',
        }}>
          SIDE<span style={{ color: tokens.accent }}>LINE</span>
        </h1>

        {/* Thin accent rule */}
        <div style={{
          width: tagVisible ? 80 : 0,
          height: 2,
          background: tokens.accent,
          transition: 'width 0.5s ease 0.15s',
          borderRadius: 1,
        }} />

        {/* Tagline */}
        <p style={{
          fontSize: 'clamp(11px, 1.8vw, 14px)',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: tokens.muted,
          opacity: tagVisible ? 1 : 0,
          transform: tagVisible ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.55s ease 0.1s, transform 0.55s ease 0.1s',
        }}>
          Football is more than 90 minutes.
        </p>
      </div>

      {/* ── Skip hint ── */}
      <div style={{
        position: 'absolute',
        bottom: 32,
        fontSize: 11,
        color: '#555',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        opacity: logoVisible ? 0.7 : 0,
        transition: 'opacity 0.4s',
        zIndex: 1,
      }}>
        Click to skip
      </div>
    </div>
  );
}
