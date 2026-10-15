import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../styles/tokens.js';
import { useGame } from '../context/useGame.js';
import { Card } from '../components/ui/Card.jsx';

export default function NewCareer() {
  const navigate = useNavigate();
  const { updateDraft, clearDraft } = useGame();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    document.title = 'SIDELINE — New Career';
    clearDraft();
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, [clearDraft]);

  const options = [
    {
      id: 'quick',
      label: 'Quick Start',
      emoji: '⚡',
      desc: 'Name, pick a club, and play. All other settings use smart defaults.',
      detail: '3 steps to kick-off',
    },
    {
      id: 'custom',
      label: 'Custom Career',
      emoji: '🎯',
      desc: 'Build your manager, choose your journey, define your philosophy, and shape your vision.',
      detail: '5-step guided setup',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: tokens.bg }}>
      <header style={{
        borderBottom: `1px solid ${tokens.border}`,
        padding: '0 clamp(16px, 4vw, 40px)',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        background: tokens.bg,
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <button onClick={() => navigate('/menu')} style={{
          background: 'none', border: 'none', color: tokens.muted, cursor: 'pointer',
          fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: tokens.font,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>← Main Menu</button>
        <span style={{ color: tokens.border }}>|</span>
        <span style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: tokens.muted }}>New Career</span>
      </header>

      <main style={{
        maxWidth: 640,
        margin: '0 auto',
        padding: 'clamp(32px, 6vw, 72px) clamp(16px, 4vw, 40px)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
      }}>
        <p style={{
          fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
          color: tokens.accent, fontWeight: 700, marginBottom: 10,
        }}>New Career</p>
        <h1 style={{
          fontFamily: tokens.fontDisplay,
          fontSize: 'clamp(32px, 6vw, 52px)',
          fontWeight: 900,
          letterSpacing: '-0.01em',
          lineHeight: 1.05,
          marginBottom: 12,
        }}>
          How do you want<br />to begin?
        </h1>
        <p style={{ color: tokens.muted, fontSize: 14, marginBottom: 48, lineHeight: 1.6 }}>
          Every great managerial story starts with a single choice.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {options.map(opt => (
            <Card
              key={opt.id}
              onClick={() => {
                updateDraft({ setupType: opt.id });
                navigate(opt.id === 'quick' ? '/career/quick' : '/career/setup/1');
              }}
              style={{ padding: '24px 28px' }}
            >
              <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: tokens.radius.lg,
                  background: tokens.bg,
                  border: `1px solid ${tokens.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  flexShrink: 0,
                }}>
                  {opt.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    marginBottom: 6,
                  }}>
                    <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em' }}>{opt.label}</h2>
                    <span style={{
                      fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
                      textTransform: 'uppercase', color: tokens.muted,
                      background: tokens.bg, border: `1px solid ${tokens.border}`,
                      padding: '2px 8px', borderRadius: 4,
                    }}>{opt.detail}</span>
                  </div>
                  <p style={{ fontSize: 13, color: tokens.muted, lineHeight: 1.6 }}>{opt.desc}</p>
                </div>
                <span style={{ color: tokens.muted, fontSize: 18, alignSelf: 'center' }}>›</span>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
