import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../styles/tokens.js';
import { useGame } from '../context/useGame.js';
import { CLUBS, LEAGUES } from '../data/clubs.js';
import { ClubCrest } from '../components/ui/ClubCrest.jsx';
import { Button } from '../components/ui/Button.jsx';
import { ConfirmModal } from '../components/ui/Modal.jsx';

export default function CareerLibrary() {
  const navigate = useNavigate();
  const { careers, deleteCareer, renameCareer, openCareer, currentCareerId } = useGame();
  const [renaming, setRenaming] = useState(null);
  const [renameName, setRenameName] = useState('');
  const [deleting, setDeleting] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    document.title = 'SIDELINE — Career Library';
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const handleOpen = (career) => {
    openCareer(career.id);
    navigate(`/hq/${career.id}`);
  };

  const sortedCareers = [...careers].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

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
        }}>← Main Menu</button>
        <span style={{ color: tokens.border }}>|</span>
        <span style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: tokens.muted }}>Career Library</span>
      </header>

      <main style={{
        maxWidth: 760,
        margin: '0 auto',
        padding: 'clamp(32px, 5vw, 56px) clamp(16px, 4vw, 40px)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
          <div>
            <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: tokens.accent, fontWeight: 700, marginBottom: 6 }}>Career Library</p>
            <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 900 }}>
              Your Careers
            </h1>
            <p style={{ color: tokens.muted, fontSize: 13, marginTop: 4 }}>
              {careers.length} career{careers.length !== 1 ? 's' : ''} saved locally
            </p>
          </div>
          <Button onClick={() => navigate('/career/new')}>+ New Career</Button>
        </div>

        {sortedCareers.length === 0 ? (
          <div style={{
            padding: '60px 24px',
            textAlign: 'center',
            border: `1px dashed ${tokens.border}`,
            borderRadius: tokens.radius.xl,
          }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>⚽</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>No careers yet</h2>
            <p style={{ color: tokens.muted, fontSize: 14, marginBottom: 24 }}>
              Start a new career to see it saved here.
            </p>
            <Button onClick={() => navigate('/career/new')}>Start New Career</Button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {sortedCareers.map(career => {
              const club = CLUBS.find(c => c.id === career.clubId);
              const league = club ? LEAGUES.find(l => l.id === club.leagueId) : null;
              const isCurrent = career.id === currentCareerId;
              const isRenaming = renaming === career.id;

              return (
                <div
                  key={career.id}
                  style={{
                    background: tokens.surface,
                    border: `1px solid ${isCurrent ? tokens.accentBorder : tokens.border}`,
                    borderRadius: tokens.radius.xl,
                    overflow: 'hidden',
                    transition: `border-color ${tokens.transition.base}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px' }}>
                    {club ? <ClubCrest club={club} size={48} /> : (
                      <div style={{ width: 48, height: 48, borderRadius: '50%', background: tokens.bg, border: `1px solid ${tokens.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>⚽</div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {isRenaming ? (
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <input
                            value={renameName}
                            onChange={e => setRenameName(e.target.value)}
                            autoFocus
                            onKeyDown={e => {
                              if (e.key === 'Enter') { renameCareer(career.id, renameName); setRenaming(null); }
                              if (e.key === 'Escape') setRenaming(null);
                            }}
                            style={{
                              background: tokens.bg, border: `1px solid ${tokens.accent}`,
                              borderRadius: tokens.radius.md, color: tokens.text, fontSize: 14,
                              padding: '6px 10px', flex: 1, outline: 'none', fontFamily: tokens.font,
                            }}
                          />
                          <button onClick={() => { renameCareer(career.id, renameName); setRenaming(null); }} style={{ background: tokens.accent, border: 'none', color: '#000', padding: '6px 12px', borderRadius: tokens.radius.md, cursor: 'pointer', fontWeight: 700, fontSize: 11, fontFamily: tokens.font }}>Save</button>
                          <button onClick={() => setRenaming(null)} style={{ background: 'none', border: 'none', color: tokens.muted, cursor: 'pointer', fontSize: 12, fontFamily: tokens.font }}>Cancel</button>
                        </div>
                      ) : (
                        <>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                            <h2 style={{ fontSize: 15, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {career.name}
                            </h2>
                            {isCurrent && (
                              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '2px 8px', borderRadius: 4, background: tokens.accentDim, color: tokens.accent }}>Current</span>
                            )}
                          </div>
                          <div style={{ fontSize: 11, color: tokens.muted }}>
                            {club?.name || '—'} · {league?.name || '—'} · {career.setupType === 'quick' ? 'Quick Start' : 'Custom Career'}
                            {career.confirmedAt && ` · ${new Date(career.confirmedAt).toLocaleDateString()}`}
                          </div>
                        </>
                      )}
                    </div>
                    {!isRenaming && (
                      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                        <Button variant="ghost" size="sm" onClick={() => handleOpen(career)}>
                          Open
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => { setRenaming(career.id); setRenameName(career.name); }}>
                          Rename
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => setDeleting(career.id)}>
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <ConfirmModal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleteCareer(deleting)}
        title="Delete Career"
        message="Are you sure you want to delete this career? This cannot be undone."
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}
