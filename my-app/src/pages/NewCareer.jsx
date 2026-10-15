import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../styles/tokens.js';
import { useGame } from '../context/useGame.js';
import { ENV } from '../data/assets.js';

const OPTIONS = [
  {
    id: 'quick',
    label: 'Quick Start',
    sublabel: '3 steps to kick-off',
    desc: 'Name your manager, pick a club, and play. Smart defaults handle everything else.',
    detail: [
      'Name your manager',
      'Choose your club',
      'Begin immediately',
    ],
    icon: '⚡',
    bg: ENV.tunnelGreen,
    accent: tokens.accent,
    path: '/career/quick',
  },
  {
    id: 'custom',
    label: 'Custom Career',
    sublabel: '5-step guided setup',
    desc: 'Build your manager identity, choose your journey, define your philosophy, and shape your club vision.',
    detail: [
      'Create your manager',
      'Choose your journey',
      'Set your philosophy',
      'Pick your club',
      'Define your vision',
    ],
    icon: '🎯',
    bg: ENV.tunnelRed,
    accent: '#FF8C42',
    path: '/career/setup/1',
  },
];

export default function NewCareer() {
  const navigate = useNavigate();
  const { updateDraft, clearDraft } = useGame();
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    document.title = 'SIDELINE — New Career';
    clearDraft();
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, [clearDraft]);

  const handleSelect = (opt) => {
    updateDraft({ setupType: opt.id });
    navigate(opt.path);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
    }}>

      {/* ── Header ── */}
      <header style={{
        position: 'relative',
        zIndex: 10,
        borderBottom: `1px solid rgba(255,255,255,0.07)`,
        padding: '0 clamp(20px, 4vw, 48px)',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(8px)',
      }}>
        <button
          onClick={() => navigate('/menu')}
          style={{
            background: 'none', border: 'none', color: tokens.muted, cursor: 'pointer',
            fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase',
            fontFamily: tokens.font, display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          ← Main Menu
        </button>
        <span style={{ color: tokens.border }}>|</span>
        <span style={{
          fontFamily: tokens.fontDisplay,
          fontSize: 13,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: tokens.muted,
        }}>
          New Career
        </span>
      </header>

      {/* ── Page title ── */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        textAlign: 'center',
        padding: 'clamp(28px, 4vh, 48px) 24px clamp(20px, 3vh, 36px)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-12px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}>
        <p style={{
          fontSize: 10,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: tokens.accent,
          fontWeight: 700,
          marginBottom: 10,
        }}>
          New Career
        </p>
        <h1 style={{
          fontFamily: tokens.fontDisplay,
          fontSize: 'clamp(32px, 5vw, 56px)',
          fontWeight: 900,
          color: tokens.text,
          letterSpacing: '-0.01em',
          lineHeight: 1.05,
          marginBottom: 10,
        }}>
          How do you want to begin?
        </h1>
        <p style={{
          fontSize: 14,
          color: tokens.muted,
          maxWidth: 420,
          margin: '0 auto',
          lineHeight: 1.6,
        }}>
          Every great managerial story starts with a single choice.
        </p>
      </div>

      {/* ── Cards ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        gap: 'clamp(12px, 2vw, 24px)',
        padding: '0 clamp(16px, 4vw, 48px) clamp(24px, 4vh, 48px)',
        alignItems: 'stretch',
        minHeight: 0,
      }}>
        {OPTIONS.map((opt, idx) => {
          const isHov = hovered === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt)}
              onMouseEnter={() => setHovered(opt.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                flex: 1,
                position: 'relative',
                overflow: 'hidden',
                border: `1px solid ${isHov ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)'}`,
                borderRadius: tokens.radius.xl,
                cursor: 'pointer',
                background: 'transparent',
                fontFamily: tokens.font,
                textAlign: 'left',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.55s ease ${idx * 0.12 + 0.1}s, transform 0.55s ease ${idx * 0.12 + 0.1}s, border-color 0.2s ease`,
                minHeight: 'clamp(320px, 45vh, 520px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
              }}
            >
              {/* Background image */}
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${opt.bg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transform: isHov ? 'scale(1.04)' : 'scale(1)',
                transition: 'transform 0.6s ease',
                willChange: 'transform',
              }} />

              {/* Dark gradient overlay — stronger at bottom */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: isHov
                  ? `linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.25) 100%)`
                  : `linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.65) 50%, rgba(0,0,0,0.4) 100%)`,
                transition: 'background 0.3s ease',
              }} />

              {/* Top badge */}
              <div style={{
                position: 'absolute',
                top: 20,
                left: 20,
                background: 'rgba(0,0,0,0.6)',
                border: `1px solid rgba(255,255,255,0.12)`,
                borderRadius: tokens.radius.md,
                padding: '6px 12px',
                backdropFilter: 'blur(6px)',
              }}>
                <span style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: tokens.muted,
                }}>
                  {opt.sublabel}
                </span>
              </div>

              {/* Accent line at top — reveals on hover */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: opt.accent,
                opacity: isHov ? 1 : 0,
                transition: 'opacity 0.25s ease',
                borderRadius: `${tokens.radius.xl} ${tokens.radius.xl} 0 0`,
              }} />

              {/* Content */}
              <div style={{
                position: 'relative',
                zIndex: 1,
                padding: 'clamp(20px, 3vw, 32px)',
              }}>
                {/* Icon */}
                <div style={{
                  fontSize: 36,
                  marginBottom: 14,
                  filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.8))',
                }}>
                  {opt.icon}
                </div>

                {/* Title */}
                <h2 style={{
                  fontFamily: tokens.fontDisplay,
                  fontSize: 'clamp(28px, 3.5vw, 44px)',
                  fontWeight: 900,
                  color: tokens.text,
                  letterSpacing: '-0.01em',
                  lineHeight: 1,
                  marginBottom: 10,
                  textShadow: '0 2px 12px rgba(0,0,0,0.8)',
                }}>
                  {opt.label}
                </h2>

                {/* Description */}
                <p style={{
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.65)',
                  lineHeight: 1.6,
                  marginBottom: 20,
                  maxWidth: 320,
                }}>
                  {opt.desc}
                </p>

                {/* Steps list */}
                <ul style={{
                  listStyle: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 5,
                  marginBottom: 24,
                  opacity: isHov ? 1 : 0.6,
                  transition: 'opacity 0.25s ease',
                }}>
                  {opt.detail.map((step, i) => (
                    <li key={i} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 12,
                      color: 'rgba(255,255,255,0.7)',
                    }}>
                      <span style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        border: `1px solid rgba(255,255,255,0.15)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 9,
                        fontWeight: 700,
                        color: opt.accent,
                        flexShrink: 0,
                      }}>{i + 1}</span>
                      {step}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '12px 20px',
                  background: isHov ? opt.accent : 'rgba(255,255,255,0.08)',
                  border: `1px solid ${isHov ? opt.accent : 'rgba(255,255,255,0.15)'}`,
                  borderRadius: tokens.radius.md,
                  transition: 'background 0.25s ease, border-color 0.25s ease',
                }}>
                  <span style={{
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: isHov ? '#000' : tokens.text,
                    transition: 'color 0.25s ease',
                  }}>
                    Begin →
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
