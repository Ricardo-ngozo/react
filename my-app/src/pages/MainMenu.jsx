import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../styles/tokens.js';
import { useGame } from '../context/useGame.js';

const MENU_ITEMS = [
  {
    id: 'new',
    label: 'New Career',
    desc: 'Begin your football management journey',
    path: '/career/new',
    always: true,
  },
  {
    id: 'continue',
    label: 'Continue Career',
    desc: 'Resume your most recent career',
    path: null, // dynamic
    requires: 'career',
  },
  {
    id: 'library',
    label: 'Career Library',
    desc: 'View, manage and open saved careers',
    path: '/careers',
    always: true,
  },
  {
    id: 'explore',
    label: 'Explore World',
    desc: 'Discover clubs across leagues and nations',
    path: '/explore',
    always: true,
  },
  {
    id: 'settings',
    label: 'Settings',
    desc: 'Interface, audio and accessibility options',
    path: '/settings',
    always: true,
  },
];

export default function MainMenu() {
  const navigate = useNavigate();
  const { currentCareer, currentCareerId } = useGame();
  const [hovered, setHovered] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    document.title = 'SIDELINE — Main Menu';
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const handleSelect = (item) => {
    if (item.id === 'continue') {
      if (currentCareer) {
        navigate(`/hq/${currentCareerId}`);
      }
      return;
    }
    if (item.path) navigate(item.path);
  };

  const isDisabled = (item) => {
    if (item.requires === 'career') return !currentCareer;
    return false;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(ellipse 100% 50% at 100% 50%, rgba(200,255,0,0.03) 0%, transparent 60%),
          linear-gradient(180deg, #000 0%, #0D0D0D 100%)
        `,
      }} />

      {/* Pitch lines — right side decoration */}
      <div style={{
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: '45%',
        background: `
          repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 59px,
            rgba(255,255,255,0.012) 60px,
            rgba(255,255,255,0.012) 61px
          )
        `,
        maskImage: 'linear-gradient(to left, rgba(0,0,0,0.2) 0%, transparent 100%)',
      }} />

      {/* Quarter circle decoration */}
      <div style={{
        position: 'absolute',
        right: '-10%',
        top: '50%',
        transform: 'translateY(-50%)',
        width: 500,
        height: 500,
        borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.04)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        padding: 'clamp(32px, 5vw, 60px) clamp(24px, 8vw, 120px)',
      }}>
        {/* Logo */}
        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(-10px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          marginBottom: 'clamp(40px, 8vh, 80px)',
        }}>
          <h1 style={{
            fontFamily: tokens.fontDisplay,
            fontSize: 'clamp(28px, 5vw, 42px)',
            fontWeight: 900,
            letterSpacing: '0.05em',
            color: tokens.text,
          }}>
            SIDE<span style={{ color: tokens.accent }}>LINE</span>
          </h1>
          <p style={{
            fontSize: 11,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: tokens.muted,
            marginTop: 4,
          }}>
            Football Management
          </p>
        </div>

        {/* Menu items */}
        <nav aria-label="Main menu" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <ul role="list" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4, maxWidth: 480 }}>
            {MENU_ITEMS.map((item, idx) => {
              const disabled = isDisabled(item);
              const isHovered = hovered === item.id && !disabled;

              return (
                <li key={item.id} style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateX(0)' : 'translateX(-20px)',
                  transition: `opacity 0.5s ease ${idx * 0.07 + 0.1}s, transform 0.5s ease ${idx * 0.07 + 0.1}s`,
                }}>
                  <button
                    onClick={() => !disabled && handleSelect(item)}
                    onMouseEnter={() => !disabled && setHovered(item.id)}
                    onMouseLeave={() => setHovered(null)}
                    disabled={disabled}
                    aria-disabled={disabled}
                    title={item.id === 'continue' && disabled ? 'No saved career yet. Start a New Career first.' : undefined}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '18px 20px',
                      background: isHovered ? tokens.surface : 'transparent',
                      border: `1px solid ${isHovered ? tokens.borderHover : 'transparent'}`,
                      borderLeft: `3px solid ${isHovered ? tokens.accent : 'transparent'}`,
                      borderRadius: tokens.radius.md,
                      cursor: disabled ? 'not-allowed' : 'pointer',
                      opacity: disabled ? 0.35 : 1,
                      transition: `all ${tokens.transition.base}`,
                      textAlign: 'left',
                      fontFamily: tokens.font,
                    }}
                  >
                    <div>
                      <div style={{
                        fontSize: 'clamp(18px, 3vw, 26px)',
                        fontWeight: 700,
                        color: isHovered ? tokens.text : tokens.mutedLight,
                        letterSpacing: '-0.01em',
                        transition: `color ${tokens.transition.base}`,
                        fontFamily: tokens.fontDisplay,
                      }}>
                        {item.label}
                      </div>
                      <div style={{
                        fontSize: 12,
                        color: tokens.muted,
                        marginTop: 2,
                        opacity: isHovered ? 1 : 0.7,
                        transition: `opacity ${tokens.transition.base}`,
                      }}>
                        {item.id === 'continue' && currentCareer
                          ? `Resume: ${currentCareer.name || currentCareer.managerName}`
                          : item.desc}
                      </div>
                    </div>
                    <span style={{
                      fontSize: 18,
                      color: isHovered ? tokens.accent : 'transparent',
                      transition: `color ${tokens.transition.base}`,
                    }}>›</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom info */}
        <div style={{
          opacity: visible ? 0.4 : 0,
          transition: 'opacity 0.6s ease 0.6s',
        }}>
          <p style={{ fontSize: 11, color: tokens.muted, letterSpacing: '0.08em' }}>
            Build a club. Shape its identity. Leave your mark.
          </p>
        </div>
      </div>
    </div>
  );
}
