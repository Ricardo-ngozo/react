import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../styles/tokens.js';

export default function TitleScreen() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    document.title = 'SIDELINE — Football is more than 90 minutes.';
    const t = setTimeout(() => setVisible(true), 80);
    const p = setTimeout(() => setPulse(true), 600);
    return () => { clearTimeout(t); clearTimeout(p); };
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
      {/* Stadium atmosphere background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(ellipse 80% 60% at 50% 0%, rgba(200,255,0,0.04) 0%, transparent 60%),
          radial-gradient(ellipse 60% 40% at 50% 100%, rgba(255,255,255,0.02) 0%, transparent 50%),
          linear-gradient(180deg, #0a0a0a 0%, #000 60%, #0a0a0a 100%)
        `,
      }} />

      {/* Pitch lines */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '140%',
        height: '35%',
        background: `
          repeating-linear-gradient(
            90deg,
            transparent 0px,
            transparent 59px,
            rgba(255,255,255,0.018) 60px,
            rgba(255,255,255,0.018) 61px
          )
        `,
        maskImage: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 100%)',
      }} />

      {/* Centre circle */}
      <div style={{
        position: 'absolute',
        bottom: '-8%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 320,
        height: 320,
        borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.06)',
      }} />

      {/* Floodlight beams */}
      {[[-40, -15], [40, -15]].map(([x, y], i) => (
        <div key={i} style={{
          position: 'absolute',
          top: 0,
          left: `calc(50% + ${x}%)`,
          width: 1,
          height: '50%',
          background: `linear-gradient(to bottom, rgba(255,255,220,0.06), transparent)`,
          transform: `rotate(${y}deg)`,
          transformOrigin: 'top center',
          filter: 'blur(3px)',
        }} />
      ))}

      {/* Main content */}
      <div style={{
        position: 'relative',
        textAlign: 'center',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
        padding: '0 24px',
      }}>
        <p style={{
          fontSize: 12,
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: tokens.muted,
          marginBottom: 20,
          fontWeight: 500,
        }}>
          Football Management
        </p>

        <h1 style={{
          fontFamily: tokens.fontDisplay,
          fontSize: 'clamp(72px, 18vw, 160px)',
          fontWeight: 900,
          letterSpacing: '0.04em',
          lineHeight: 0.9,
          color: tokens.text,
          marginBottom: 10,
        }}>
          SIDE<span style={{ color: tokens.accent }}>LINE</span>
        </h1>

        <p style={{
          fontSize: 'clamp(12px, 2vw, 15px)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: tokens.muted,
          marginBottom: 64,
          fontWeight: 400,
        }}>
          Football is more than 90 minutes.
        </p>

        {/* CTA */}
        <div style={{
          opacity: pulse ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            border: `1px solid ${tokens.accentBorder}`,
            borderRadius: 4,
            padding: '14px 32px',
            background: tokens.accentDim,
            animation: 'titlePulse 2s ease-in-out infinite',
          }}>
            <span style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: tokens.accent,
            }}>
              Press Enter or Click to Begin
            </span>
          </div>
        </div>
      </div>

      {/* Bottom tagline */}
      <div style={{
        position: 'absolute',
        bottom: 40,
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        opacity: visible ? 0.5 : 0,
        transition: 'opacity 1s ease 0.5s',
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
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
      `}</style>
    </div>
  );
}
