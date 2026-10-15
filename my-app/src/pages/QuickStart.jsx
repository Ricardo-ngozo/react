import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../styles/tokens.js';
import { useGame } from '../context/GameContext.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';
import { CLUBS, LEAGUES } from '../data/clubs.js';
import { ClubCrest } from '../components/ui/ClubCrest.jsx';

export default function QuickStart() {
  const navigate = useNavigate();
  const { updateDraft, careerDraft, saveCareer } = useGame();
  const [name, setName] = useState(careerDraft?.managerName || '');
  const [clubId, setClubId] = useState(careerDraft?.clubId || '');
  const [step, setStep] = useState(1); // 1=name, 2=club, 3=confirm
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    document.title = 'SIDELINE — Quick Start';
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const filtered = CLUBS.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.location.toLowerCase().includes(search.toLowerCase())
  );

  const selectedClub = CLUBS.find(c => c.id === clubId);
  const league = selectedClub ? LEAGUES.find(l => l.id === selectedClub.leagueId) : null;

  const handleConfirm = () => {
    const id = `career_${Date.now()}`;
    const career = {
      id,
      name: `${name} at ${selectedClub.name}`,
      managerName: name,
      clubId,
      clubName: selectedClub.name,
      philosophy: 'Balanced Approach',
      journey: 'Blank Canvas',
      setupType: 'quick',
      confirmedAt: Date.now(),
    };
    saveCareer(career);
    updateDraft(career);
    navigate(`/appointment/${id}`);
  };

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
        <button onClick={() => step > 1 ? setStep(s => s - 1) : navigate('/career/new')} style={{
          background: 'none', border: 'none', color: tokens.muted, cursor: 'pointer',
          fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: tokens.font,
        }}>← Back</button>
        <span style={{ color: tokens.border }}>|</span>
        <span style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: tokens.muted }}>
          Quick Start · Step {step} of 3
        </span>
        {/* Progress */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          {[1,2,3].map(s => (
            <div key={s} style={{
              width: 24, height: 3, borderRadius: 2,
              background: s <= step ? tokens.accent : tokens.border,
              transition: `background ${tokens.transition.base}`,
            }} />
          ))}
        </div>
      </header>

      <main style={{
        maxWidth: 600,
        margin: '0 auto',
        padding: 'clamp(32px, 6vw, 64px) clamp(16px, 4vw, 40px)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s ease',
      }}>
        {step === 1 && (
          <div>
            <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: tokens.accent, fontWeight: 700, marginBottom: 10 }}>Step 1</p>
            <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 900, marginBottom: 8 }}>
              What's your name?
            </h1>
            <p style={{ color: tokens.muted, fontSize: 14, marginBottom: 40, lineHeight: 1.6 }}>
              The name you choose is how you'll be known throughout your management career.
            </p>
            <Input
              label="Manager Name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your full name"
              onKeyDown={e => e.key === 'Enter' && name.trim() && setStep(2)}
              autoFocus
            />
            <div style={{ marginTop: 32 }}>
              <Button
                onClick={() => { updateDraft({ managerName: name }); setStep(2); }}
                disabled={!name.trim()}
                size="lg"
              >
                Continue →
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: tokens.accent, fontWeight: 700, marginBottom: 10 }}>Step 2</p>
            <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 900, marginBottom: 8 }}>
              Choose your club
            </h1>
            <p style={{ color: tokens.muted, fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
              Select the club you'll be managing. You can explore more options in a Custom Career.
            </p>
            <Input
              placeholder="Search clubs or cities..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ marginBottom: 16 }}
            />
            <div style={{
              maxHeight: 360,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              border: `1px solid ${tokens.border}`,
              borderRadius: tokens.radius.lg,
              padding: 8,
            }}>
              {filtered.map(club => {
                const lg = LEAGUES.find(l => l.id === club.leagueId);
                return (
                  <button
                    key={club.id}
                    onClick={() => setClubId(club.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 14px',
                      background: clubId === club.id ? `${club.color}18` : 'transparent',
                      border: `1px solid ${clubId === club.id ? club.color : 'transparent'}`,
                      borderRadius: tokens.radius.md,
                      cursor: 'pointer',
                      textAlign: 'left',
                      width: '100%',
                      fontFamily: tokens.font,
                      transition: `all ${tokens.transition.fast}`,
                    }}
                    onMouseEnter={e => { if (clubId !== club.id) e.currentTarget.style.background = tokens.surface; }}
                    onMouseLeave={e => { if (clubId !== club.id) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <ClubCrest club={club} size={36} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: tokens.text }}>{club.name}</div>
                      <div style={{ fontSize: 11, color: tokens.muted }}>{lg?.name} · {club.location}</div>
                    </div>
                    {clubId === club.id && <span style={{ color: tokens.accent, fontSize: 16 }}>✓</span>}
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <div style={{ padding: 24, textAlign: 'center', color: tokens.muted, fontSize: 13 }}>
                  No clubs match "{search}"
                </div>
              )}
            </div>
            <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
              <Button variant="ghost" onClick={() => setStep(1)}>← Back</Button>
              <Button
                onClick={() => { updateDraft({ clubId, clubName: selectedClub?.name }); setStep(3); }}
                disabled={!clubId}
                size="lg"
              >
                Continue →
              </Button>
            </div>
          </div>
        )}

        {step === 3 && selectedClub && (
          <div>
            <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: tokens.accent, fontWeight: 700, marginBottom: 10 }}>Step 3 — Confirm</p>
            <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 900, marginBottom: 8 }}>
              Ready to begin?
            </h1>
            <p style={{ color: tokens.muted, fontSize: 14, marginBottom: 32, lineHeight: 1.6 }}>
              Review your career details before confirming your appointment.
            </p>

            <div style={{
              border: `1px solid ${tokens.border}`,
              borderRadius: tokens.radius.xl,
              overflow: 'hidden',
              marginBottom: 32,
            }}>
              {/* Club banner */}
              <div style={{
                padding: 28,
                background: `linear-gradient(135deg, ${selectedClub.color}22, ${selectedClub.color}08)`,
                borderBottom: `3px solid ${selectedClub.color}`,
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}>
                <ClubCrest club={selectedClub} size={60} />
                <div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: tokens.text, fontFamily: tokens.fontDisplay }}>
                    {selectedClub.name}
                  </div>
                  <div style={{ fontSize: 12, color: tokens.muted }}>{league?.name} · {selectedClub.location}</div>
                </div>
              </div>
              {/* Manager info */}
              <div style={{ padding: 20 }}>
                {[
                  ['Manager', name],
                  ['Club', selectedClub.name],
                  ['Competition', league?.name || '—'],
                  ['Career Setup', 'Quick Start'],
                  ['Philosophy', 'Balanced Approach (default)'],
                ].map(([k, v]) => (
                  <div key={k} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 0',
                    borderBottom: `1px solid ${tokens.border}`,
                    gap: 12,
                  }}>
                    <span style={{ fontSize: 12, color: tokens.muted }}>{k}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: tokens.text }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <Button variant="ghost" onClick={() => setStep(2)}>← Back</Button>
              <Button onClick={handleConfirm} size="lg">
                Confirm Appointment →
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
