import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../styles/tokens.js';
import { useGame } from '../context/useGame.js';
import { ENV, getAvatarById } from '../data/assets.js';

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
    path: null,
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
    desc: 'Interface and accessibility options',
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
      if (currentCareer) navigate(`/hq/${currentCareerId}`);
      return;
    }
    if (item.path) navigate(item.path);
  };

  const isDisabled = (item) => item.requires === 'career' && !currentCareer;

  // Get manager avatar if career exists
  const managerAvatar = currentCareer?.avatarId
    ? getAvatarById(currentCareer.avatarId)
    : null;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      display: 'flex',
      overflow: 'hidden',
      position: 'relative',
    }}>

      {/* ══════════════════════════════════════════
          LEFT PANEL — Full-height stadium image
      ══════════════════════════════════════════ */}
      <div style={{
        position: 'relative',
        width: '48%',
        flexShrink: 0,
        overflow: 'hidden',
        // Hide on very small screens
        display: 'flex',
      }}>
        {/* Stadium photograph */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${ENV.stadiumAerial})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1)' : 'scale(1.06)',
          transition: 'opacity 1s ease, transform 1.4s ease',
          willChange: 'transform, opacity',
        }} />

        {/* Right-edge fade so it blends into the dark right panel */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(to right,
            transparent 40%,
            rgba(0,0,0,0.5) 70%,
            rgba(0,0,0,0.92) 90%,
            #000 100%
          )`,
        }} />

        {/* Top fade */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(to bottom,
            rgba(0,0,0,0.55) 0%,
            transparent 30%,
            transparent 70%,
            rgba(0,0,0,0.65) 100%
          )`,
        }} />

        {/* Manager avatar watermark — bottom left, shown if career exists */}
        {managerAvatar && (
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '65%',
            aspectRatio: '3/4',
            backgroundImage: `url(${managerAvatar.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'top center',
            maskImage: 'linear-gradient(to top, transparent 0%, rgba(0,0,0,0.6) 25%, rgba(0,0,0,0.9) 60%)',
            WebkitMaskImage: 'linear-gradient(to top, transparent 0%, rgba(0,0,0,0.6) 25%, rgba(0,0,0,0.9) 60%)',
            opacity: visible ? 0.75 : 0,
            transition: 'opacity 0.8s ease 0.4s',
          }} />
        )}

        {/* Bottom-left label */}
        <div style={{
          position: 'absolute',
          bottom: 32,
          left: 32,
          zIndex: 1,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.6s ease 0.5s',
        }}>
          {currentCareer && (
            <div style={{
              background: 'rgba(0,0,0,0.7)',
              border: `1px solid ${tokens.border}`,
              borderRadius: tokens.radius.md,
              padding: '10px 14px',
              backdropFilter: 'blur(8px)',
            }}>
              <div style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: tokens.muted, marginBottom: 3 }}>
                Active Career
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: tokens.text }}>
                {currentCareer.managerName || currentCareer.name}
              </div>
              {currentCareer.clubName && (
                <div style={{ fontSize: 11, color: tokens.accent, marginTop: 1 }}>
                  {currentCareer.clubName}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          RIGHT PANEL — Dark menu panel
      ══════════════════════════════════════════ */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'clamp(36px, 6vh, 72px) clamp(28px, 5vw, 72px)',
        position: 'relative',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #000 100%)',
        minWidth: 0,
      }}>

        {/* Subtle grid texture */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }} />

        {/* Lime glow top-right */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(200,255,0,0.04) 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        {/* ── Logo ── */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(-10px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}>
          <h1 style={{
            fontFamily: tokens.fontDisplay,
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: 900,
            letterSpacing: '0.05em',
            color: tokens.text,
            lineHeight: 1,
          }}>
            SIDE<span style={{ color: tokens.accent }}>LINE</span>
          </h1>
          <p style={{
            fontSize: 10,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: tokens.muted,
            marginTop: 6,
          }}>
            Football Management
          </p>
        </div>

        {/* ── Menu items ── */}
        <nav
          aria-label="Main menu"
          style={{
            position: 'relative',
            zIndex: 1,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingTop: 24,
          }}
        >
          <ul role="list" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {MENU_ITEMS.map((item, idx) => {
              const disabled = isDisabled(item);
              const isHov = hovered === item.id && !disabled;

              return (
                <li
                  key={item.id}
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateX(0)' : 'translateX(-24px)',
                    transition: `opacity 0.5s ease ${idx * 0.07 + 0.15}s, transform 0.5s ease ${idx * 0.07 + 0.15}s`,
                  }}
                >
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
                      padding: '16px 20px',
                      background: isHov ? 'rgba(255,255,255,0.04)' : 'transparent',
                      border: 'none',
                      borderLeft: `3px solid ${isHov ? tokens.accent : 'transparent'}`,
                      cursor: disabled ? 'not-allowed' : 'pointer',
                      opacity: disabled ? 0.3 : 1,
                      transition: `all ${tokens.transition.base}`,
                      textAlign: 'left',
                      fontFamily: tokens.font,
                      borderRadius: `0 ${tokens.radius.md} ${tokens.radius.md} 0`,
                    }}
                  >
                    <div>
                      <div style={{
                        fontSize: 'clamp(20px, 2.8vw, 30px)',
                        fontWeight: 700,
                        color: isHov ? tokens.text : tokens.mutedLight,
                        letterSpacing: '-0.01em',
                        fontFamily: tokens.fontDisplay,
                        transition: `color ${tokens.transition.base}`,
                        lineHeight: 1.1,
                      }}>
                        {item.label}
                      </div>
                      <div style={{
                        fontSize: 11,
                        color: tokens.muted,
                        marginTop: 2,
                        opacity: isHov ? 1 : 0.6,
                        transition: `opacity ${tokens.transition.base}`,
                      }}>
                        {item.id === 'continue' && currentCareer
                          ? `Resume: ${currentCareer.managerName || currentCareer.name}`
                          : item.desc}
                      </div>
                    </div>

                    {/* Arrow */}
                    <span style={{
                      fontSize: 22,
                      color: isHov ? tokens.accent : 'transparent',
                      transition: `color ${tokens.transition.base}, transform ${tokens.transition.base}`,
                      transform: isHov ? 'translateX(4px)' : 'translateX(0)',
                      flexShrink: 0,
                      marginLeft: 16,
                    }}>›</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ── Footer tagline ── */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          opacity: visible ? 0.4 : 0,
          transition: 'opacity 0.6s ease 0.7s',
        }}>
          <div style={{
            width: 32,
            height: 1,
            background: tokens.border,
            marginBottom: 10,
          }} />
          <p style={{ fontSize: 11, color: tokens.muted, letterSpacing: '0.08em' }}>
            Build a club. Shape its identity. Leave your mark.
          </p>
        </div>
      </div>

      {/* Responsive: hide left panel below 640px */}
      <style>{`
        @media (max-width: 640px) {
          .menu-left-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
}
