import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { tokens } from '../styles/tokens.js';
import { useGame } from '../context/useGame.js';
import { CLUBS, LEAGUES } from '../data/clubs.js';
import { ClubCrest } from '../components/ui/ClubCrest.jsx';
import { Button } from '../components/ui/Button.jsx';
import { ENV, getAvatarById } from '../data/assets.js';

const PHILOSOPHIES = {
  attacking:  'Attacking Football',
  possession: 'Possession Football',
  defensive:  'Defensive Organisation',
  counter:    'Counterattacking Football',
  youth:      'Youth Development',
  balanced:   'Balanced Approach',
};

const JOURNEYS = {
  underdog:  'The Underdog',
  rebuild:   'The Rebuild',
  contender: 'The Contender',
  blank:     'Blank Canvas',
};

const PROJECTS = {
  youth:       'Youth Revolution',
  attacking:   'Beautiful Football',
  defensive:   'Defensive Dynasty',
  community:   'Club of the People',
  financial:   'Sustainable Model',
  continental: 'Continental Powerhouse',
};

export default function Appointment() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { careers } = useGame();
  const [phase,   setPhase]   = useState(0); // 0=hidden 1=bg 2=portrait 3=text 4=card
  const [visible, setVisible] = useState(false);

  const career = careers.find(c => c.id === id);

  useEffect(() => {
    if (!career) { navigate('/menu'); return; }
    document.title = `SIDELINE — ${career.managerName || career.name} Appointed`;

    const t0 = setTimeout(() => setVisible(true),  80);
    const t1 = setTimeout(() => setPhase(1),       200);
    const t2 = setTimeout(() => setPhase(2),       700);
    const t3 = setTimeout(() => setPhase(3),      1300);
    const t4 = setTimeout(() => setPhase(4),      2000);
    return () => [t0, t1, t2, t3, t4].forEach(clearTimeout);
  }, [career, navigate]);

  if (!career) return null;

  const club   = CLUBS.find(c => c.id === career.clubId);
  const league = club ? LEAGUES.find(l => l.id === club.leagueId) : null;
  const avatar = getAvatarById(career.avatarId);

  const managerName = career.managerName || `${career.firstName || ''} ${career.surname || ''}`.trim();

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
    }}>

      {/* ══════════════════════════════════════════
          LEFT — Full-height manager portrait
      ══════════════════════════════════════════ */}
      <div style={{
        position: 'relative',
        width: '42%',
        flexShrink: 0,
        overflow: 'hidden',
      }}>
        {/* Tunnel background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${ENV.tunnelRed})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: phase >= 1 ? 0.35 : 0,
          transform: phase >= 1 ? 'scale(1)' : 'scale(1.06)',
          transition: 'opacity 1.2s ease, transform 1.6s ease',
        }} />

        {/* Portrait — rises up from bottom */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${avatar.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'top center',
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.9s ease, transform 0.9s ease',
        }} />

        {/* Right-edge fade */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(to right,
            transparent 40%,
            rgba(0,0,0,0.5) 70%,
            rgba(0,0,0,0.95) 90%,
            #000 100%
          )`,
        }} />

        {/* Bottom fade */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: '30%',
          background: 'linear-gradient(to top, #000 0%, transparent 100%)',
        }} />

        {/* Manager name — bottom left */}
        <div style={{
          position: 'absolute',
          bottom: 32,
          left: 28,
          zIndex: 2,
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}>
          <div style={{
            fontSize: 'clamp(18px, 2.5vw, 28px)',
            fontWeight: 900,
            fontFamily: tokens.fontDisplay,
            color: tokens.text,
            textShadow: '0 2px 10px rgba(0,0,0,0.8)',
          }}>
            {managerName}
          </div>
          {career.nationality && (
            <div style={{ fontSize: 12, color: tokens.muted, marginTop: 3 }}>
              {career.nationality} · {career.background || 'Manager'}
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          RIGHT — Reveal content
      ══════════════════════════════════════════ */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 'clamp(28px, 5vw, 72px) clamp(24px, 5vw, 64px)',
        position: 'relative',
        zIndex: 1,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.5s ease',
      }}>

        {/* Club colour glow */}
        {club && (
          <div style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '70%',
            height: '70%',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${club.color}18 0%, transparent 70%)`,
            pointerEvents: 'none',
            opacity: phase >= 1 ? 1 : 0,
            transition: 'opacity 1s ease',
          }} />
        )}

        {/* Phase 1 — Club crest */}
        <div style={{
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
          marginBottom: 28,
        }}>
          {club && <ClubCrest club={club} size={80} />}
        </div>

        {/* Phase 2 — League label */}
        <div style={{
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          marginBottom: 12,
        }}>
          {club && (
            <p style={{
              fontSize: 11,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: club.color || tokens.accent,
              fontWeight: 700,
            }}>
              {club.name}{league ? ` · ${league.name}` : ''}
            </p>
          )}
        </div>

        {/* Phase 3 — Headline */}
        <div style={{
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.65s ease, transform 0.65s ease',
          marginBottom: 20,
        }}>
          <h1 style={{
            fontFamily: tokens.fontDisplay,
            fontSize: 'clamp(44px, 7vw, 88px)',
            fontWeight: 900,
            letterSpacing: '0.02em',
            color: tokens.text,
            lineHeight: 0.92,
            textShadow: '0 2px 30px rgba(0,0,0,0.5)',
          }}>
            A NEW ERA<br />
            <span style={{ color: club?.color || tokens.accent }}>BEGINS.</span>
          </h1>
          <p style={{ fontSize: 15, color: tokens.muted, lineHeight: 1.6, marginTop: 14, maxWidth: 380 }}>
            {managerName} takes charge at {club?.name || 'the club'}.
          </p>
        </div>

        {/* Phase 4 — Career summary + CTA */}
        <div style={{
          opacity: phase >= 4 ? 1 : 0,
          transform: phase >= 4 ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}>
          {/* Career summary card */}
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid rgba(255,255,255,0.08)`,
            borderRadius: tokens.radius.xl,
            padding: '18px 20px',
            marginBottom: 24,
            maxWidth: 420,
            backdropFilter: 'blur(8px)',
          }}>
            {[
              ['Manager',   managerName],
              ['Club',      club?.name],
              ['League',    league?.name],
              ['Philosophy', PHILOSOPHIES[career.philosophy] || career.philosophy],
              ['Journey',   JOURNEYS[career.journey] || career.journey || 'Blank Canvas'],
              ['Vision',    PROJECTS[career.project] || career.project],
            ].filter(([, v]) => v).map(([k, v]) => (
              <div key={k} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 0',
                borderBottom: `1px solid rgba(255,255,255,0.06)`,
                gap: 12,
              }}>
                <span style={{ fontSize: 11, color: tokens.muted }}>{k}</span>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Button
            onClick={() => navigate(`/hq/${id}`)}
            size="xl"
            style={{ width: '100%', maxWidth: 420 }}
          >
            Enter Headquarters →
          </Button>

          <button
            onClick={() => navigate('/career/new')}
            style={{
              display: 'block', marginTop: 14,
              background: 'none', border: 'none', color: tokens.muted,
              cursor: 'pointer', fontSize: 11, letterSpacing: '0.08em',
              textTransform: 'uppercase', fontFamily: tokens.font,
            }}
          >
            ← Start a different career
          </button>
        </div>
      </div>
    </div>
  );
}
