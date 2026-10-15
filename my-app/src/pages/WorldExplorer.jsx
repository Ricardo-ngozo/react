import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../styles/tokens.js';
import { COUNTRIES, LEAGUES, CLUBS, getLeaguesByCountry, getClubsByLeague } from '../data/clubs.js';
import { ClubCrest } from '../components/ui/ClubCrest.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { ENV } from '../data/assets.js';

export default function WorldExplorer() {
  const navigate = useNavigate();
  const [countryId,    setCountryId]    = useState(null);
  const [leagueId,     setLeagueId]     = useState(null);
  const [selectedClub, setSelectedClub] = useState(null);
  const [search,       setSearch]       = useState('');
  const [visible,      setVisible]      = useState(false);
  const [hoveredCard,  setHoveredCard]  = useState(null);

  useEffect(() => {
    document.title = 'SIDELINE — Explore World';
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const country       = COUNTRIES.find(c => c.id === countryId);
  const leagues       = countryId ? getLeaguesByCountry(countryId) : [];
  const league        = LEAGUES.find(l => l.id === leagueId);
  const clubs         = leagueId
    ? getClubsByLeague(leagueId)
    : countryId ? CLUBS.filter(c => c.countryId === countryId) : [];
  const filteredClubs = clubs.filter(c =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.location.toLowerCase().includes(search.toLowerCase())
  );

  const breadcrumbs = ['World'];
  if (country)      breadcrumbs.push(country.name);
  if (league)       breadcrumbs.push(league.name);
  if (selectedClub) breadcrumbs.push(selectedClub.name);

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column' }}>

      {/* ── Hero banner — stadium pitch image ── */}
      <div style={{
        position: 'relative',
        height: countryId ? 120 : 260,
        overflow: 'hidden',
        flexShrink: 0,
        transition: 'height 0.4s ease',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${ENV.stadiumPitch})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 35%',
          opacity: visible ? 0.5 : 0,
          transform: visible ? 'scale(1)' : 'scale(1.04)',
          transition: 'opacity 0.8s ease, transform 1.2s ease',
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.65) 60%, #000 100%)`,
        }} />

        {/* Header bar */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: 56,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '0 clamp(16px, 4vw, 40px)',
          borderBottom: `1px solid rgba(255,255,255,0.07)`,
          zIndex: 2,
        }}>
          <button
            onClick={() => navigate('/menu')}
            style={{
              background: 'none', border: 'none', color: tokens.muted, cursor: 'pointer',
              fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: tokens.font,
            }}
          >← Menu</button>
          <span style={{ color: tokens.border }}>|</span>

          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {breadcrumbs.map((b, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {i > 0 && <span style={{ color: tokens.border }}>›</span>}
                <span
                  style={{
                    fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
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
        </div>

        {/* Hero title — only on root view */}
        {!countryId && (
          <div style={{
            position: 'absolute',
            bottom: 28,
            left: 'clamp(16px, 4vw, 40px)',
            zIndex: 2,
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s',
          }}>
            <p style={{
              fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase',
              color: tokens.accent, fontWeight: 700, marginBottom: 6,
            }}>Explore World</p>
            <h1 style={{
              fontFamily: tokens.fontDisplay,
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 900,
              color: tokens.text,
              lineHeight: 1,
              textShadow: '0 2px 20px rgba(0,0,0,0.8)',
            }}>
              Football World
            </h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 6 }}>
              {COUNTRIES.length} countries · {LEAGUES.length} leagues · {CLUBS.length} clubs
            </p>
          </div>
        )}
      </div>

      {/* ── Main content ── */}
      <main style={{
        flex: 1,
        padding: 'clamp(24px, 4vw, 40px) clamp(16px, 4vw, 40px)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s ease 0.1s',
      }}>

        {/* Country grid */}
        {!countryId && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 16,
          }}>
            {COUNTRIES.map((c, idx) => {
              const cLeagues = getLeaguesByCountry(c.id);
              const cClubs   = CLUBS.filter(cl => cl.countryId === c.id);
              const isHov    = hoveredCard === c.id;

              return (
                <button
                  key={c.id}
                  onClick={() => setCountryId(c.id)}
                  onMouseEnter={() => setHoveredCard(c.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: tokens.radius.xl,
                    border: `1px solid ${isHov ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)'}`,
                    cursor: 'pointer',
                    background: tokens.surface,
                    fontFamily: tokens.font,
                    textAlign: 'left',
                    padding: 0,
                    minHeight: 160,
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(16px)',
                    transition: `opacity 0.4s ease ${idx * 0.03}s, transform 0.4s ease ${idx * 0.03}s, border-color 0.2s ease`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                  }}
                >
                  {/* Stadium bg — subtle tint using aerial image */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url(${ENV.stadiumAerial})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: isHov ? 0.18 : 0.07,
                    transform: isHov ? 'scale(1.05)' : 'scale(1)',
                    transition: 'opacity 0.3s ease, transform 0.5s ease',
                  }} />

                  {/* Gradient overlay */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
                  }} />

                  {/* Content */}
                  <div style={{ position: 'relative', zIndex: 1, padding: '18px 20px' }}>
                    <div style={{ fontSize: 40, marginBottom: 8, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>
                      {c.flag}
                    </div>
                    <div style={{
                      fontSize: 16, fontWeight: 700, marginBottom: 2,
                      fontFamily: tokens.fontDisplay, color: tokens.text,
                    }}>{c.name}</div>
                    <div style={{ fontSize: 10, color: tokens.muted, marginBottom: 12 }}>{c.continent}</div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <span style={{
                        fontSize: 10, color: isHov ? tokens.accent : tokens.muted,
                        background: 'rgba(0,0,0,0.5)', padding: '3px 8px',
                        borderRadius: 4, border: `1px solid ${isHov ? tokens.accentBorder : 'rgba(255,255,255,0.08)'}`,
                        transition: 'color 0.2s ease, border-color 0.2s ease',
                      }}>
                        {cLeagues.length} league{cLeagues.length !== 1 ? 's' : ''}
                      </span>
                      <span style={{
                        fontSize: 10, color: tokens.muted,
                        background: 'rgba(0,0,0,0.5)', padding: '3px 8px',
                        borderRadius: 4, border: '1px solid rgba(255,255,255,0.08)',
                      }}>
                        {cClubs.length} clubs
                      </span>
                    </div>
                  </div>

                  {/* Arrow on hover */}
                  <div style={{
                    position: 'absolute',
                    top: 14,
                    right: 14,
                    fontSize: 16,
                    color: tokens.accent,
                    opacity: isHov ? 1 : 0,
                    transform: isHov ? 'translateX(0)' : 'translateX(-4px)',
                    transition: 'opacity 0.2s ease, transform 0.2s ease',
                  }}>›</div>
                </button>
              );
            })}
          </div>
        )}

        {/* League list */}
        {countryId && !leagueId && !selectedClub && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
              <span style={{ fontSize: 48, filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))' }}>{country?.flag}</span>
              <div>
                <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: tokens.accent, fontWeight: 700 }}>{country?.continent}</p>
                <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900 }}>{country?.name}</h1>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {leagues.map(l => {
                const lClubs = getClubsByLeague(l.id);
                const isHov  = hoveredCard === l.id;
                return (
                  <button
                    key={l.id}
                    onClick={() => setLeagueId(l.id)}
                    onMouseEnter={() => setHoveredCard(l.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '20px 24px',
                      background: isHov ? tokens.surfaceHover : tokens.surface,
                      border: `1px solid ${isHov ? tokens.borderHover : tokens.border}`,
                      borderLeft: `3px solid ${isHov ? tokens.accent : 'transparent'}`,
                      borderRadius: tokens.radius.lg,
                      cursor: 'pointer', fontFamily: tokens.font,
                      transition: `all ${tokens.transition.base}`,
                      textAlign: 'left',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 3, fontFamily: tokens.fontDisplay }}>{l.name}</div>
                      <div style={{ fontSize: 11, color: tokens.muted }}>Tier {l.tier} · {lClubs.length} clubs</div>
                    </div>
                    <span style={{ color: isHov ? tokens.accent : tokens.muted, fontSize: 18 }}>›</span>
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
              <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: tokens.accent, fontWeight: 700 }}>
                {country?.flag} {country?.name}
              </p>
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
              {filteredClubs.map(club => {
                const isHov = hoveredCard === club.id;
                return (
                  <button
                    key={club.id}
                    onClick={() => setSelectedClub(club)}
                    onMouseEnter={() => setHoveredCard(club.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '16px 18px',
                      background: isHov ? tokens.surfaceHover : tokens.surface,
                      border: `1px solid ${isHov ? club.color : tokens.border}`,
                      borderRadius: tokens.radius.lg,
                      cursor: 'pointer', textAlign: 'left', fontFamily: tokens.font,
                      transition: `all ${tokens.transition.base}`,
                    }}
                  >
                    <ClubCrest club={club} size={44} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{club.name}</div>
                      <div style={{ fontSize: 11, color: tokens.muted }}>{club.location} · Est. {club.founded}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Club detail */}
        {selectedClub && (
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            {/* Hero image behind club header */}
            <div style={{
              borderRadius: tokens.radius.xl,
              border: `1px solid ${tokens.border}`,
              overflow: 'hidden',
              marginBottom: 24,
            }}>
              {/* Club banner */}
              <div style={{
                position: 'relative',
                minHeight: 160,
                background: `linear-gradient(135deg, ${selectedClub.color}28 0%, ${selectedClub.color}08 100%)`,
                borderBottom: `3px solid ${selectedClub.color}`,
              }}>
                {/* Stadium bg */}
                <div style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: `url(${ENV.stadiumAerial})`,
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  opacity: 0.12,
                }} />
                <div style={{
                  position: 'relative', zIndex: 1,
                  padding: 28,
                  display: 'flex', alignItems: 'center', gap: 20,
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
                          background: 'rgba(0,0,0,0.4)', color: tokens.muted,
                          border: `1px solid rgba(255,255,255,0.1)`,
                        }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: 1, background: tokens.border,
              }}>
                {[
                  ['Founded',  selectedClub.founded],
                  ['Stadium',  selectedClub.stadium],
                  ['Capacity', selectedClub.capacity.toLocaleString()],
                  ['Location', selectedClub.location],
                ].map(([k, v]) => (
                  <div key={k} style={{ background: tokens.surface, padding: '16px 18px' }}>
                    <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: tokens.muted, marginBottom: 4, fontWeight: 600 }}>{k}</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{v}</div>
                  </div>
                ))}
              </div>

              {/* Text content */}
              <div style={{ padding: 24 }}>
                <p style={{ fontSize: 14, color: tokens.muted, lineHeight: 1.7, marginBottom: 20 }}>{selectedClub.description}</p>
                <div style={{ padding: '14px 18px', background: tokens.bg, borderRadius: tokens.radius.md, marginBottom: 12 }}>
                  <p style={{ fontSize: 10, color: tokens.accent, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Club Identity</p>
                  <p style={{ fontSize: 13, lineHeight: 1.6 }}>{selectedClub.identity}</p>
                </div>
                <div style={{ padding: '14px 18px', background: tokens.bg, borderRadius: tokens.radius.md }}>
                  <p style={{ fontSize: 10, color: tokens.accent, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Why manage here?</p>
                  <p style={{ fontSize: 13, lineHeight: 1.6 }}>{selectedClub.whyManage}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedClub(null)}
              style={{
                background: 'none', border: 'none', color: tokens.muted, cursor: 'pointer',
                fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: tokens.font,
              }}
            >← Back to clubs</button>
          </div>
        )}
      </main>
    </div>
  );
}
