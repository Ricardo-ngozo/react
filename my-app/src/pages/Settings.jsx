import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../styles/tokens.js';
import { useGame } from '../context/useGame.js';

function Toggle({ label, desc, checked, onChange }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 0',
      borderBottom: `1px solid ${tokens.border}`,
      gap: 16,
    }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{label}</div>
        {desc && <div style={{ fontSize: 12, color: tokens.muted }}>{desc}</div>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        style={{
          width: 44,
          height: 24,
          borderRadius: 12,
          background: checked ? tokens.accent : tokens.border,
          border: 'none',
          cursor: 'pointer',
          position: 'relative',
          transition: `background ${tokens.transition.base}`,
          flexShrink: 0,
        }}
      >
        <span style={{
          position: 'absolute',
          top: 3,
          left: checked ? 23 : 3,
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: checked ? '#000' : tokens.muted,
          transition: `left ${tokens.transition.base}`,
        }} />
      </button>
    </div>
  );
}

export default function Settings() {
  const navigate = useNavigate();
  const { settings, updateSettings } = useGame();

  useEffect(() => {
    document.title = 'SIDELINE — Settings';
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: tokens.bg }}>
      {/* Header */}
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
        <button onClick={() => navigate(-1)} style={{
          background: 'none', border: 'none', color: tokens.muted, cursor: 'pointer',
          fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: tokens.font,
          display: 'flex', alignItems: 'center', gap: 6, padding: '6px 0',
        }}>← Back</button>
        <span style={{ color: tokens.border }}>|</span>
        <span style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: tokens.muted }}>Settings</span>
      </header>

      <main style={{ maxWidth: 600, margin: '0 auto', padding: 'clamp(24px, 4vw, 48px) clamp(16px, 4vw, 40px)' }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 8, fontFamily: tokens.fontDisplay }}>
          Settings
        </h1>
        <p style={{ color: tokens.muted, fontSize: 13, marginBottom: 40 }}>
          Customise your SIDELINE experience.
        </p>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: tokens.accent, marginBottom: 8 }}>
            Interface
          </h2>
          <Toggle
            label="Animations"
            desc="Enable transitions, reveals and motion effects"
            checked={settings.animations}
            onChange={() => updateSettings({ animations: !settings.animations })}
          />
          <Toggle
            label="Reduced Motion"
            desc="Minimise movement for accessibility or preference"
            checked={settings.reducedMotion}
            onChange={() => updateSettings({ reducedMotion: !settings.reducedMotion })}
          />
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: tokens.accent, marginBottom: 8 }}>
            Audio
          </h2>
          <div style={{
            padding: '16px 0',
            borderBottom: `1px solid ${tokens.border}`,
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Music & Sound</div>
            <div style={{ fontSize: 12, color: tokens.muted }}>
              Audio playback is not available in this release. Background audio will be configurable in a future update.
            </div>
          </div>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: tokens.accent, marginBottom: 8 }}>
            Text Size
          </h2>
          {['small', 'medium', 'large'].map(size => (
            <button
              key={size}
              onClick={() => updateSettings({ fontSize: size })}
              style={{
                display: 'inline-flex',
                marginRight: 8,
                padding: '8px 18px',
                border: `1px solid ${settings.fontSize === size ? tokens.accent : tokens.border}`,
                borderRadius: tokens.radius.md,
                background: settings.fontSize === size ? tokens.accentDim : 'transparent',
                color: settings.fontSize === size ? tokens.accent : tokens.muted,
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'capitalize',
                fontFamily: tokens.font,
              }}
            >
              {size}
            </button>
          ))}
        </section>

        <section>
          <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: tokens.accent, marginBottom: 8 }}>
            Data
          </h2>
          <div style={{
            padding: '16px',
            background: tokens.surface,
            border: `1px solid ${tokens.border}`,
            borderRadius: tokens.radius.md,
          }}>
            <p style={{ fontSize: 13, color: tokens.muted, lineHeight: 1.6 }}>
              All career data is saved locally in your browser. Clearing browser storage will remove all SIDELINE careers.
              No data is sent to any server.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
