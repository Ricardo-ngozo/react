import { useEffect, useState } from 'react';
import { tokens } from '../styles/tokens.js';

export default function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState('dark'); // dark → logo → tagline → out

  useEffect(() => {
    // Check reduced motion preference
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      onComplete();
      return;
    }

    const t1 = setTimeout(() => setPhase('logo'), 400);
    const t2 = setTimeout(() => setPhase('tagline'), 1300);
    const t3 = setTimeout(() => setPhase('out'), 2400);
    const t4 = setTimeout(() => onComplete(), 2900);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, [onComplete]);

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
        opacity: phase === 'out' ? 0 : 1,
        transition: phase === 'out' ? 'opacity 0.5s ease' : 'none',
        userSelect: 'none',
      }}
    >
      {/* Cinematic light rays */}
      <div style={{
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 2,
        height: 200,
        background: `linear-gradient(to bottom, ${tokens.accent}33, transparent)`,
        opacity: phase === 'logo' || phase === 'tagline' ? 0.6 : 0,
        transition: 'opacity 0.8s ease',
        filter: 'blur(8px)',
      }} />

      {/* Logo */}
      <div style={{
        fontFamily: tokens.fontDisplay,
        fontSize: 'clamp(52px, 12vw, 96px)',
        fontWeight: 900,
        letterSpacing: '0.05em',
        color: tokens.text,
        opacity: phase === 'logo' || phase === 'tagline' ? 1 : 0,
        transform: phase === 'logo' || phase === 'tagline' ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
        textAlign: 'center',
      }}>
        SIDE<span style={{ color: tokens.accent }}>LINE</span>
      </div>

      {/* Tagline */}
      <div style={{
        marginTop: 14,
        fontSize: 13,
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        color: tokens.muted,
        opacity: phase === 'tagline' ? 1 : 0,
        transform: phase === 'tagline' ? 'translateY(0)' : 'translateY(6px)',
        transition: 'opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s',
      }}>
        Football is more than 90 minutes.
      </div>

      {/* Skip hint */}
      <div style={{
        position: 'absolute',
        bottom: 32,
        fontSize: 11,
        color: '#444',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        opacity: phase !== 'dark' ? 0.6 : 0,
        transition: 'opacity 0.4s',
      }}>
        Click to skip
      </div>
    </div>
  );
}
