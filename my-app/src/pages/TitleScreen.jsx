import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../styles/tokens.js';
import { ENV } from '../data/assets.js';

export default function TitleScreen() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [pulse, setPulse]   = useState(false);

  useEffect(() => {
    document.title = 'SIDELINE — Football is more than 90 minutes.';
    const t1 = setTimeout(() => setVisible(true), 100);
    const t2 = setTimeout(() => setPulse(true),   700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const enter = () => navigate('/menu');

  return (
    <div
      onClick={enter}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && enter()}
      tabIndex={0}
      role="button"
      aria-label="Enter SIDELINE — press Enter or click"
      style={{
        minHeight: '100vh',
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── Background: stadium aerial / pitch-level ── */}
      {/* Bottom half — pitch from player tunnel perspective */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${ENV.stadiumPitch})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
        opacity: visible ? 0.45 : 0,
        transform: visible ? 'scale(1)' : 'scale(1.04)',
        transition: 'opacity 1.2s ease, transform 1.6s ease',
        willChange: 'transform, opacity',
      }} />

      {/* ── Multi-layer overlay ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          linear-gradient(to bottom,
            rgba(0,0,0,0.88) 0%,
            rgba(0,0,0,0.45) 45%,
            rgba(0,0,0,0.65) 75%,
            rgba(0,0,0,0.95) 100%
          )
        `,
      }} />

      {/* ── Lime glow from top ── */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '80%',
        height: '40%',
        background: `radial-gradient(ellipse at 50% 0%, rgba(200,255,0,0.06) 0%, transparent 65%)`,
        pointerEvents: 'none',
      }} />

      {/* ── Main content ── */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        textAlign: 'center',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.9s ease, transform 0.9s ease',
        padding: '0 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0,
      }}>
        {/* Eyebrow */}
        <p style={{
          fontSize: 'clamp(10px, 1.5vw, 13px)',
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          color: tokens.muted,
          marginBottom: 20,
          fontWeight: 500,
        }}>
          Football Management
        </p>

        {/* Wordmark */}
        <h1 style={{
          fontFamily: tokens.fontDisplay,
          fontSize: 'clamp(80px, 18vw, 168px)',
          fontWeight: 900,
          letterSpacing: '0.04em',
          lineHeight: 0.88,
          color: tokens.text,
          textShadow: '0 4px 60px rgba(0,0,0,0.9)',
          marginBottom: 18,
        }}>
          SIDE<span style={{ color: tokens.accent }}>LINE</span>
        </h1>

        {/* Accent rule */}
        <div style={{
          width: visible ? 64 : 0,
          height: 2,
          background: tokens.accent,
          borderRadius: 1,
          transition: 'width 0.6s ease 0.4s',
          marginBottom: 20,
        }} />

        {/* Tagline */}
        <p style={{
          fontSize: 'clamp(11px, 1.8vw, 15px)',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: tokens.muted,
          marginBottom: 56,
          fontWeight: 400,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.7s ease 0.3s',
        }}>
          Football is more than 90 minutes.
        </p>

        {/* CTA pill */}
        <div style={{
          opacity: pulse ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            border: `1px solid ${tokens.accentBorder}`,
            borderRadius: 4,
            padding: '14px 36px',
            background: tokens.accentDim,
            animation: 'titlePulse 2.2s ease-in-out infinite',
          }}>
            <span style={{
              fontSize: 'clamp(10px, 1.4vw, 12px)',
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: tokens.accent,
            }}>
              Press Enter or Click to Begin
            </span>
          </div>
        </div>
      </div>

      {/* ── Bottom tagline ── */}
      <div style={{
        position: 'absolute',
        bottom: 40,
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        opacity: visible ? 0.45 : 0,
        transition: 'opacity 1s ease 0.6s',
        zIndex: 1,
        whiteSpace: 'nowrap',
      }}>
        <p style={{
          fontSize: 11,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: tokens.muted,
        }}>
          Build a club. Shape its identity. Leave your mark.
        </p>
      </div>

      <style>{`
        @keyframes titlePulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 rgba(200,255,0,0); }
          50% { opacity: 0.6; box-shadow: 0 0 24px rgba(200,255,0,0.12); }
        }
      `}</style>
    </div>
  );
}
