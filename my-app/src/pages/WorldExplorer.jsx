import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../styles/tokens.js';
import { COUNTRIES, LEAGUES, CLUBS, getLeaguesByCountry, getClubsByLeague } from '../data/clubs.js';
import { ClubCrest } from '../components/ui/ClubCrest.jsx';
import { Badge } from '../components/ui/Badge.jsx';

export default function WorldExplorer() {
  const navigate = useNavigate();
  const [countryId, setCountryId] = useState(null);
  const [leagueId, setLeagueId] = useState(null);
  const [selectedClub, setSelectedClub] = useState(null);
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    document.title = 'SIDELINE — Explore World';
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const country = COUNTRIES.find(c => c.id === countryId);
  const leagues = countryId ? getLeaguesByCountry(countryId) : [];
  const league = LEAGUES.find(l => l.id === leagueId);
  const clubs = leagueId ? getClubsByLeague(leagueId) : (countryId ? CLUBS.filter(c => c.countryId === countryId) : []);
  const filteredClubs = clubs.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.location.toLowerCase().includes(search.toLowerCase())
  );

  // Breadcrumb
  const breadcrumbs = ['World'];
  if (country) breadcrumbs.push(country.name);
  if (league) breadcrumbs.push(league.name);
  if (selectedClub) breadcrumbs.push(selectedClub.name);

  return (
    <div style={{ minHeight: '100vh', background: tokens.bg }}>
      {/* Header */}
      <header style={{
        borderBottom: `1px solid ${tokens.border}`,
        padding: '0 clamp(16px, 4vw, 40px)',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: tokens.bg,
        position: 'sticky',
        top: 0,
        zIndex: 10,
        flexWrap: 'wrap',
        rowGap: 0,
      }}>
        <button onClick={() => navigate('/menu')} style={{
          background: 'none', border: 'none', color: tokens.muted, cursor: 'pointer',
          fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: tokens.font,
        }}>← Menu</button>
        <span style={{ color: tokens.border }}>|</span>
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {breadcrumbs.map((b, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {i > 0 && <span style={{ color: tokens.border }}>›</span>}
              <span style={{
                fontSize: 11,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: i === breadcrumbs.length - 1 ? tokens.text : tokens.muted,
                cursor: i < breadcrumbs.length - 1 ? 'pointer' : 'default',
                fontWeight: i === breadcrumbs.length - 1 ? 600 : 400,
              }}
              onClick={() => {
                if (i === 0) { setCountryId(null); setLeagueId(null); setSelectedClub(null); }
                else if (i === 1) { setLeagueId(null); setSelectedClub(null); }
                else if (i === 2) { setSelectedClub(null); }
              }}
              >{b}</span>
            </span>
          ))}
        </nav>
        <div style={{ marginLeft: 'auto' }}>
          <Badge variant="demo">Curated Catalogue</Badge>
        </div>
      </header>

      <main style={{
        padding: 'clamp(24px, 4vw, 40px) clamp(16px, 4vw, 40px)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s ease',
      }}>
        {/* Country grid */}
        {!countryId && (
          <div>
            <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: tokens.accent, fontWeight: 700, marginBottom: 8 }}>Explore World</p>
            <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, marginBottom: 8 }}>
              Football World
            </h1>
            <p style={{ color: tokens.muted, fontSize: 14, marginBottom: 36, lineHeight: 1.6 }}>
              {COUNTRIES.length} countries · {LEAGUES.length} leagues · {CLUBS.length} clubs
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
              {COUNTRIES.map(c => {
                const cLeagues = getLeaguesByCountry(c.id);
                const cClubs = CLUBS.filter(cl => cl.countryId === c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => setCountryId(c.id)}
                    style={{
                      padding: '20px 22px',
                      background: tokens.surface,
                      border: `1px solid ${tokens.border}`,
                      borderRadius: tokens.radius.xl,
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: tokens.font,
                      transition: `all ${tokens.transition.base}`,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = tokens.borderHover;
                      e.currentTarget.style.background = tokens.surfaceHover;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = tokens.border;
                      e.currentTarget.style.background = tokens.surface;
                    }}
                  >
                    <div style={{ fontSize: 36, marginBottom: 10 }}>{c.flag}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, fontFamily: tokens.fontDisplay }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: tokens.muted }}>{c.continent}</div>
                    <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
                      <span style={{ fontSize: 11, color: tokens.muted, background: tokens.bg, padding: '3px 8px', borderRadius: 4, border: `1px solid ${tokens.border}` }}>
                        {cLeagues.length} league{cLeagues.length !== 1 ? 's' : ''}
                      </span>
                      <span style={{ fontSize: 11, color: tokens.muted, background: tokens.bg, padding: '3px 8px', borderRadius: 4, border: `1px solid ${tokens.border}` }}>
                        {cClubs.length} clubs
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* League list */}
        {countryId && !leagueId && !selectedClub && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <span style={{ fontSize: 40 }}>{country?.flag}</span>
              <div>
                <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: tokens.accent, fontWeight: 700 }}>{country?.continent}</p>
                <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 900 }}>{country?.name}</h1>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {leagues.map(l => {
                const lClubs = getClubsByLeague(l.id);
                return (
                  <button
                    key={l.id}
                    onClick={() => setLeagueId(l.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '18px 22px',
                      background: tokens.surface,
                      border: `1px solid ${tokens.border}`,
                      borderRadius: tokens.radius.lg,
                      cursor: 'pointer',
                      fontFamily: tokens.font,
                      transition: `all ${tokens.transition.base}`,
                      textAlign: 'left',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = tokens.borderHover; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = tokens.border; }}
                  >
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 3 }}>{l.name}</div>
                      <div style={{ fontSize: 11, color: tokens.muted }}>Tier {l.tier} · {lClubs.length} clubs</div>
                    </div>
                    <span style={{ color: tokens.muted }}>›</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Club list */}
        {leagueId && !selectedClub && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: tokens.accent, fontWeight: 700 }}>{country?.flag} {country?.name}</p>
              <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 900 }}>{league?.name}</h1>
              <p style={{ fontSize: 13, color: tokens.muted, marginTop: 4 }}>{filteredClubs.length} clubs</p>
            </div>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search clubs..."
              style={{
                background: tokens.surface, border: `1px solid ${tokens.border}`,
                borderRadius: tokens.radius.md, color: tokens.text, fontSize: 14,
                padding: '10px 14px', width: '100%', maxWidth: 400, outline: 'none',
                fontFamily: tokens.font, marginBottom: 16,
              }}
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
              {filteredClubs.map(club => (
                <button
                  key={club.id}
                  onClick={() => setSelectedClub(club)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '16px 18px',
                    background: tokens.surface,
                    border: `1px solid ${tokens.border}`,
                    borderRadius: tokens.radius.lg,
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: tokens.font,
                    transition: `all ${tokens.transition.base}`,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = club.color; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = tokens.border; }}
                >
                  <ClubCrest club={club} size={44} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{club.name}</div>
                    <div style={{ fontSize: 11, color: tokens.muted }}>{club.location} · Est. {club.founded}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Club detail */}
        {selectedClub && (
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <div style={{
              borderRadius: tokens.radius.xl,
              border: `1px solid ${tokens.border}`,
              overflow: 'hidden',
              marginBottom: 24,
            }}>
              <div style={{
                padding: 32,
                background: `linear-gradient(135deg, ${selectedClub.color}28 0%, ${selectedClub.color}08 100%)`,
                borderBottom: `3px solid ${selectedClub.color}`,
                display: 'flex',
                alignItems: 'center',
                gap: 20,
              }}>
                <ClubCrest club={selectedClub} size={80} />
                <div>
                  <div style={{ fontSize: 28, fontWeight: 900, fontFamily: tokens.fontDisplay }}>{selectedClub.name}</div>
                  <div style={{ fontSize: 13, color: tokens.muted, marginTop: 4 }}>{league?.name} · {selectedClub.location}</div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                    {selectedClub.tags?.map(tag => (
                      <span key={tag} style={{
                        fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                        padding: '3px 8px', borderRadius: 4,
                        background: tokens.surface, color: tokens.muted, border: `1px solid ${tokens.border}`,
                      }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 1, background: tokens.border }}>
                {[
                  ['Founded', selectedClub.founded],
                  ['Stadium', selectedClub.stadium],
                  ['Capacity', selectedClub.capacity.toLocaleString()],
                  ['Location', selectedClub.location],
                ].map(([k, v]) => (
                  <div key={k} style={{ background: tokens.surface, padding: '16px 18px' }}>
                    <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: tokens.muted, marginBottom: 4, fontWeight: 600 }}>{k}</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: 24 }}>
                <p style={{ fontSize: 14, color: tokens.muted, lineHeight: 1.7, marginBottom: 20 }}>{selectedClub.description}</p>
                <div style={{ padding: '14px 18px', background: tokens.bg, borderRadius: tokens.radius.md, marginBottom: 16 }}>
                  <p style={{ fontSize: 11, color: tokens.accent, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Club Identity</p>
                  <p style={{ fontSize: 13, lineHeight: 1.6 }}>{selectedClub.identity}</p>
                </div>
                <div style={{ padding: '14px 18px', background: tokens.bg, borderRadius: tokens.radius.md }}>
                  <p style={{ fontSize: 11, color: tokens.accent, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Why manage here?</p>
                  <p style={{ fontSize: 13, lineHeight: 1.6 }}>{selectedClub.whyManage}</p>
                </div>
              </div>
            </div>
            <button onClick={() => setSelectedClub(null)} style={{
              background: 'none', border: 'none', color: tokens.muted, cursor: 'pointer',
              fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: tokens.font,
            }}>← Back to clubs</button>
          </div>
        )}
      </main>
    </div>
  );
}
