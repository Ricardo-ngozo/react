import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { tokens } from '../styles/tokens.js';
import { useGame } from '../context/useGame.js';
import { CLUBS, LEAGUES } from '../data/clubs.js';
import { ClubCrest } from '../components/ui/ClubCrest.jsx';
import { Button } from '../components/ui/Button.jsx';

const PHILOSOPHIES = {
  attacking: 'Attacking Football',
  possession: 'Possession Football',
  defensive: 'Defensive Organisation',
  counter: 'Counterattacking Football',
  youth: 'Youth Development',
  balanced: 'Balanced Approach',
};

const JOURNEYS = {
  underdog: 'The Underdog',
  rebuild: 'The Rebuild',
  contender: 'The Contender',
  blank: 'Blank Canvas',
};

const PROJECTS = {
  youth: 'Youth Revolution',
  attacking: 'Beautiful Football',
  defensive: 'Defensive Dynasty',
  community: 'Club of the People',
  financial: 'Sustainable Model',
  continental: 'Continental Powerhouse',
};

export default function Appointment() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { careers } = useGame();
  const [phase, setPhase] = useState(0); // 0=hidden, 1=club, 2=details, 3=final
  const [visible, setVisible] = useState(false);

  const career = careers.find(c => c.id === id);

  useEffect(() => {
    if (!career) {
      navigate('/menu');
      return;
    }
    document.title = `SIDELINE — ${career.managerName || career.name} Appointed`;
    const t1 = setTimeout(() => setVisible(true), 100);
    const t2 = setTimeout(() => setPhase(1), 400);
    const t3 = setTimeout(() => setPhase(2), 1100);
    const t4 = setTimeout(() => setPhase(3), 1800);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, [career, navigate]);

  if (!career) return null;

  const club = CLUBS.find(c => c.id === career.clubId);
  const league = club ? LEAGUES.find(l => l.id === club.leagueId) : null;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'clamp(24px, 5vw, 60px) clamp(16px, 4vw, 40px)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background colour splash */}
      {club && (
        <div style={{
          position: 'absolute',
          top: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
          height: '60%',
          borderRadius: '50%',
          background: `radial-gradient(ellipse at center, ${club.color}18 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
      )}

      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: 640,
        width: '100%',
        textAlign: 'center',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.5s ease',
      }}>
        {/* Phase 1 — Club reveal */}
        <div style={{
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
          marginBottom: 32,
        }}>
          {club && <ClubCrest club={club} size={100} />}
        </div>

        {/* Phase 2 — Details */}
        <div style={{
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
          marginBottom: 40,
        }}>
          <p style={{
            fontSize: 11,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: club?.color || tokens.accent,
            fontWeight: 700,
            marginBottom: 12,
          }}>
            {club?.name} · {league?.name}
          </p>
          <h1 style={{
            fontFamily: tokens.fontDisplay,
            fontSize: 'clamp(40px, 8vw, 80px)',
            fontWeight: 900,
            letterSpacing: '0.02em',
            color: tokens.text,
            lineHeight: 0.95,
            marginBottom: 16,
          }}>
            A NEW ERA<br />
            <span style={{ color: club?.color || tokens.accent }}>BEGINS.</span>
          </h1>
          <p style={{ fontSize: 16, color: tokens.muted, lineHeight: 1.6 }}>
            {career.managerName || `${career.firstName} ${career.surname}`} takes charge at {club?.name}.
          </p>
        </div>

        {/* Phase 3 — Career card + CTA */}
        <div style={{
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}>
          <div style={{
            background: tokens.surface,
            border: `1px solid ${tokens.border}`,
            borderRadius: tokens.radius.xl,
            padding: 24,
            marginBottom: 28,
            textAlign: 'left',
          }}>
            {[
              ['Manager', career.managerName || `${career.firstName} ${career.surname}`],
              ['Club', club?.name],
              ['League', league?.name],
              ['Philosophy', PHILOSOPHIES[career.philosophy] || career.philosophy || '—'],
              ['Journey', JOURNEYS[career.journey] || career.journey || 'Blank Canvas'],
              ['Club Vision', PROJECTS[career.project] || career.project || '—'],
            ].map(([k, v]) => v && (
              <div key={k} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 0',
                borderBottom: `1px solid ${tokens.border}`,
                gap: 12,
              }}>
                <span style={{ fontSize: 12, color: tokens.muted }}>{k}</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>

          <Button
            onClick={() => navigate(`/hq/${id}`)}
            size="xl"
            style={{ width: '100%' }}
          >
            Enter Headquarters →
          </Button>

          <button
            onClick={() => navigate('/career/new')}
            style={{
              display: 'block',
              margin: '14px auto 0',
              background: 'none',
              border: 'none',
              color: tokens.muted,
              cursor: 'pointer',
              fontSize: 11,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontFamily: tokens.font,
            }}
          >
            ← Start a different career
          </button>
        </div>
      </div>
    </div>
  );
}
