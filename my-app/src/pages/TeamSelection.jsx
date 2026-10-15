import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../styles/tokens.js';
import { useGame } from '../context/useGame.js';
import { CLUBS, LEAGUES, COUNTRIES, getLeaguesByCountry, getClubsByLeague } from '../data/clubs.js';
import { ClubCrest } from '../components/ui/ClubCrest.jsx';
import { Button } from '../components/ui/Button.jsx';

export default function TeamSelection() {
  const navigate = useNavigate();
  const { careerDraft, updateDraft } = useGame();
  const [search, setSearch] = useState('');
  const [countryId, setCountryId] = useState('');
  const [leagueId, setLeagueId] = useState('');
  // Lazy init: pick a random club immediately, no effect needed
  const [featured, setFeatured] = useState(() => CLUBS[Math.floor(Math.random() * CLUBS.length)]);
  const [shortlist, setShortlist] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [revealed, setRevealed] = useState(true);

  useEffect(() => {
    document.title = 'SIDELINE — Choose Your Club';
  }, []);

  // Reveal animation when featured changes
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 50);
    setRevealed(false);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [featured?.id]);

  const leagues = countryId ? getLeaguesByCountry(countryId) : LEAGUES;
  const allClubs = leagueId
    ? getClubsByLeague(leagueId)
    : countryId
      ? CLUBS.filter(c => c.countryId === countryId)
      : CLUBS;

  const filteredClubs = allClubs.filter(c =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.shortName.toLowerCase().includes(search.toLowerCase()) ||
    c.location.toLowerCase().includes(search.toLowerCase())
  );

  const featuredLeague = featured ? LEAGUES.find(l => l.id === featured.leagueId) : null;

  const toggleShortlist = (clubId) => {
    setShortlist(prev => prev.includes(clubId) ? prev.filter(id => id !== clubId) : [...prev, clubId]);
  };

  const toggleCompare = (clubId) => {
    setCompareList(prev => {
      if (prev.includes(clubId)) return prev.filter(id => id !== clubId);
      if (prev.length >= 3) return prev;
      return [...prev, clubId];
    });
  };

  const randomClub = () => {
    const rand = CLUBS[Math.floor(Math.random() * CLUBS.length)];
    setFeatured(rand);
  };

  const handleSelect = (club) => {
    updateDraft({ clubId: club.id, clubName: club.name });
    const step = careerDraft?.setupType === 'custom' ? '/career/setup/5' : '/career/quick';
    navigate(step);
  };

  const compareClubs = compareList.map(id => CLUBS.find(c => c.id === id)).filter(Boolean);

  return (
    <div style={{ minHeight: '100vh', background: tokens.bg, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        borderBottom: `1px solid ${tokens.border}`,
        padding: '0 clamp(16px, 3vw, 32px)',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: tokens.bg,
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}>
        <button onClick={() => navigate(-1)} style={{
          background: 'none', border: 'none', color: tokens.muted, cursor: 'pointer',
          fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: tokens.font,
        }}>← Back</button>
        <span style={{ color: tokens.border }}>|</span>
        <span style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: tokens.muted }}>
          Choose Your Club
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          {shortlist.length > 0 && (
            <span style={{ fontSize: 11, color: tokens.muted }}>
              Shortlist: {shortlist.length}
            </span>
          )}
          {compareList.length > 0 && (
            <Button variant="outline" size="sm" onClick={() => setShowCompare(true)}>
              Compare ({compareList.length}/3)
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={randomClub}>🎲 Random</Button>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 'calc(100vh - 56px)' }}>
        {/* Left — Discovery */}
        <div style={{
          width: 280,
          borderRight: `1px solid ${tokens.border}`,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          flexShrink: 0,
        }}>
          <div style={{ padding: '12px 14px', borderBottom: `1px solid ${tokens.border}` }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search clubs..."
              style={{
                background: tokens.surface, border: `1px solid ${tokens.border}`,
                borderRadius: tokens.radius.md, color: tokens.text, fontSize: 13,
                padding: '8px 12px', width: '100%', outline: 'none',
                fontFamily: tokens.font, marginBottom: 8,
              }}
            />
            <select
              value={countryId}
              onChange={e => { setCountryId(e.target.value); setLeagueId(''); }}
              style={{
                background: tokens.surface, border: `1px solid ${tokens.border}`,
                borderRadius: tokens.radius.md, color: tokens.text, fontSize: 12,
                padding: '7px 10px', width: '100%', outline: 'none', cursor: 'pointer',
                fontFamily: tokens.font, marginBottom: 6,
              }}
            >
              <option value="">All Countries</option>
              {COUNTRIES.map(c => <option key={c.id} value={c.id}>{c.flag} {c.name}</option>)}
            </select>
            <select
              value={leagueId}
              onChange={e => setLeagueId(e.target.value)}
              style={{
                background: tokens.surface, border: `1px solid ${tokens.border}`,
                borderRadius: tokens.radius.md, color: tokens.text, fontSize: 12,
                padding: '7px 10px', width: '100%', outline: 'none', cursor: 'pointer',
                fontFamily: tokens.font,
              }}
            >
              <option value="">All Leagues</option>
              {leagues.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </div>
          <div style={{ overflowY: 'auto', flex: 1, padding: '6px' }}>
            <div style={{ fontSize: 10, color: tokens.muted, padding: '8px 8px 4px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {filteredClubs.length} clubs
            </div>
            {filteredClubs.map(club => {
              const isShortlisted = shortlist.includes(club.id);
              const isComparing = compareList.includes(club.id);
              const isFeatured = featured?.id === club.id;
              return (
                <button
                  key={club.id}
                  onClick={() => setFeatured(club)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '9px 10px',
                    background: isFeatured ? `${club.color}18` : 'transparent',
                    border: `1px solid ${isFeatured ? club.color : 'transparent'}`,
                    borderRadius: tokens.radius.md,
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                    fontFamily: tokens.font,
                    marginBottom: 2,
                    transition: `all ${tokens.transition.fast}`,
                  }}
                  onMouseEnter={e => { if (!isFeatured) e.currentTarget.style.background = tokens.surface; }}
                  onMouseLeave={e => { if (!isFeatured) e.currentTarget.style.background = 'transparent'; }}
                >
                  <ClubCrest club={club} size={28} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: tokens.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {club.shortName}
                    </div>
                    <div style={{ fontSize: 10, color: tokens.muted }}>
                      {LEAGUES.find(l => l.id === club.leagueId)?.name?.split(' ').slice(-2).join(' ')}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 3 }}>
                    {isShortlisted && <span title="Shortlisted" style={{ fontSize: 10 }}>★</span>}
                    {isComparing && <span title="Comparing" style={{ color: tokens.accent, fontSize: 10 }}>C</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Centre — Showcase */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'stretch', overflow: 'hidden' }}>
          {featured ? (
            <>
              {/* Centre showcase */}
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '32px 24px',
                background: `linear-gradient(135deg, ${featured.color}12 0%, transparent 60%)`,
                borderRight: `1px solid ${tokens.border}`,
                opacity: revealed ? 1 : 0,
                transform: revealed ? 'scale(1)' : 'scale(0.97)',
                transition: 'opacity 0.3s ease, transform 0.3s ease',
              }}>
                <div style={{ marginBottom: 24 }}>
                  <ClubCrest club={featured} size={120} />
                </div>
                <h2 style={{
                  fontFamily: tokens.fontDisplay,
                  fontSize: 'clamp(28px, 4vw, 48px)',
                  fontWeight: 900,
                  textAlign: 'center',
                  color: tokens.text,
                  marginBottom: 6,
                  letterSpacing: '-0.01em',
                }}>
                  {featured.name}
                </h2>
                <div style={{ fontSize: 13, color: tokens.muted, marginBottom: 20, textAlign: 'center' }}>
                  {featuredLeague?.name} · {featured.location}
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 28 }}>
                  {featured.tags?.map(tag => (
                    <span key={tag} style={{
                      fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                      padding: '3px 10px', borderRadius: 20,
                      background: tokens.surface, color: tokens.muted, border: `1px solid ${tokens.border}`,
                    }}>{tag}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                  <Button
                    variant={shortlist.includes(featured.id) ? 'outline' : 'ghost'}
                    size="sm"
                    onClick={() => toggleShortlist(featured.id)}
                  >
                    {shortlist.includes(featured.id) ? '★ Shortlisted' : '☆ Shortlist'}
                  </Button>
                  <Button
                    variant={compareList.includes(featured.id) ? 'outline' : 'ghost'}
                    size="sm"
                    onClick={() => toggleCompare(featured.id)}
                    disabled={compareList.length >= 3 && !compareList.includes(featured.id)}
                  >
                    {compareList.includes(featured.id) ? '✓ Comparing' : 'Compare'}
                  </Button>
                </div>
              </div>

              {/* Right — Club info */}
              <div style={{
                width: 320,
                flexShrink: 0,
                overflowY: 'auto',
                padding: '24px 20px',
                opacity: revealed ? 1 : 0,
                transition: 'opacity 0.3s ease 0.1s',
              }}>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: tokens.accent, fontWeight: 700, marginBottom: 6 }}>Club Facts</div>
                  {[
                    ['Founded', featured.founded],
                    ['Stadium', featured.stadium],
                    ['Capacity', featured.capacity.toLocaleString()],
                    ['League', featuredLeague?.name],
                    ['Location', featured.location],
                  ].map(([k, v]) => (
                    <div key={k} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '8px 0',
                      borderBottom: `1px solid ${tokens.border}`,
                      gap: 12,
                    }}>
                      <span style={{ fontSize: 11, color: tokens.muted }}>{k}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, textAlign: 'right' }}>{v}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: tokens.accent, fontWeight: 700, marginBottom: 8 }}>About</div>
                  <p style={{ fontSize: 12, color: tokens.muted, lineHeight: 1.7 }}>{featured.description}</p>
                </div>

                <div style={{ marginBottom: 16, padding: '12px 14px', background: tokens.surface, borderRadius: tokens.radius.md }}>
                  <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: tokens.accent, fontWeight: 700, marginBottom: 6 }}>Identity</div>
                  <p style={{ fontSize: 12, lineHeight: 1.6 }}>{featured.identity}</p>
                </div>

                <div style={{ marginBottom: 24, padding: '12px 14px', background: tokens.surface, borderRadius: tokens.radius.md }}>
                  <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: tokens.accent, fontWeight: 700, marginBottom: 6 }}>Why manage here?</div>
                  <p style={{ fontSize: 12, lineHeight: 1.6 }}>{featured.whyManage}</p>
                </div>

                <Button onClick={() => handleSelect(featured)} size="lg" style={{ width: '100%' }}>
                  Select {featured.shortName} →
                </Button>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: tokens.muted, fontSize: 14 }}>
              Select a club from the list
            </div>
          )}
        </div>
      </div>

      {/* Compare modal */}
      {showCompare && (
        <div
          onClick={e => e.target === e.currentTarget && setShowCompare(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 100, padding: 24,
          }}
        >
          <div style={{
            background: tokens.surface, border: `1px solid ${tokens.border}`,
            borderRadius: tokens.radius.xl, maxWidth: 800, width: '100%',
            maxHeight: '90vh', overflow: 'auto',
          }}>
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${tokens.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 16, fontWeight: 700 }}>Club Comparison</h2>
              <button onClick={() => setShowCompare(false)} style={{ background: 'none', border: 'none', color: tokens.muted, cursor: 'pointer', fontSize: 20, fontFamily: tokens.font }}>×</button>
            </div>
            <div style={{ padding: 24, display: 'grid', gridTemplateColumns: `repeat(${compareClubs.length}, 1fr)`, gap: 16 }}>
              {compareClubs.map(club => {
                const lg = LEAGUES.find(l => l.id === club.leagueId);
                return (
                  <div key={club.id} style={{ textAlign: 'center' }}>
                    <ClubCrest club={club} size={60} />
                    <div style={{ fontSize: 15, fontWeight: 700, marginTop: 10, marginBottom: 4, fontFamily: tokens.fontDisplay }}>{club.name}</div>
                    <div style={{ fontSize: 11, color: tokens.muted, marginBottom: 16 }}>{lg?.name}</div>
                    {[
                      ['Founded', club.founded],
                      ['Stadium', club.stadium],
                      ['Capacity', club.capacity.toLocaleString()],
                      ['Location', club.location],
                    ].map(([k, v]) => (
                      <div key={k} style={{ padding: '8px 0', borderBottom: `1px solid ${tokens.border}`, textAlign: 'left' }}>
                        <div style={{ fontSize: 10, color: tokens.muted, marginBottom: 2 }}>{k}</div>
                        <div style={{ fontSize: 12, fontWeight: 600 }}>{v}</div>
                      </div>
                    ))}
                    <div style={{ marginTop: 16 }}>
                      <Button onClick={() => { handleSelect(club); setShowCompare(false); }} size="sm" style={{ width: '100%' }}>
                        Select
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
