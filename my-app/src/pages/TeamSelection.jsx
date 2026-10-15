import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../styles/tokens.js';
import { useGame } from '../context/useGame.js';
import { CLUBS, LEAGUES, COUNTRIES, getLeaguesByCountry, getClubsByLeague } from '../data/clubs.js';
import { ClubCrest } from '../components/ui/ClubCrest.jsx';
import { Button } from '../components/ui/Button.jsx';
import { ENV } from '../data/assets.js';

export default function TeamSelection() {
  const navigate = useNavigate();
  const { careerDraft, updateDraft } = useGame();
  const [search,      setSearch]      = useState('');
  const [countryId,   setCountryId]   = useState('');
  const [leagueId,    setLeagueId]    = useState('');
  const [featured,    setFeatured]    = useState(() => CLUBS[Math.floor(Math.random() * CLUBS.length)]);
  const [shortlist,   setShortlist]   = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [revealed,    setRevealed]    = useState(true);

  useEffect(() => {
    document.title = 'SIDELINE — Choose Your Club';
  }, []);

  // Reveal animation when featured changes
  useEffect(() => {
    setRevealed(false);
    const t = setTimeout(() => setRevealed(true), 50);
    return () => clearTimeout(t);
  }, [featured?.id]);

  const leagues     = countryId ? getLeaguesByCountry(countryId) : LEAGUES;
  const allClubs    = leagueId
    ? getClubsByLeague(leagueId)
    : countryId ? CLUBS.filter(c => c.countryId === countryId) : CLUBS;
  const filteredClubs = allClubs.filter(c =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.shortName.toLowerCase().includes(search.toLowerCase()) ||
    c.location.toLowerCase().includes(search.toLowerCase())
  );

  const featuredLeague = featured ? LEAGUES.find(l => l.id === featured.leagueId) : null;

  const toggleShortlist = (clubId) =>
    setShortlist(prev => prev.includes(clubId) ? prev.filter(id => id !== clubId) : [...prev, clubId]);

  const toggleCompare = (clubId) =>
    setCompareList(prev => {
      if (prev.includes(clubId)) return prev.filter(id => id !== clubId);
      if (prev.length >= 3) return prev;
      return [...prev, clubId];
    });

  const randomClub = () => setFeatured(CLUBS[Math.floor(Math.random() * CLUBS.length)]);

  const handleSelect = (club) => {
    updateDraft({ clubId: club.id, clubName: club.name });
    const step = careerDraft?.setupType === 'custom' ? '/career/setup/5' : '/career/quick';
    navigate(step);
  };

  const compareClubs = compareList.map(id => CLUBS.find(c => c.id === id)).filter(Boolean);

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column' }}>

      {/* ── Header ── */}
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
        flexShrink: 0,
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none', border: 'none', color: tokens.muted, cursor: 'pointer',
            fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: tokens.font,
          }}
        >← Back</button>
        <span style={{ color: tokens.border }}>|</span>
        <span style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: tokens.muted }}>
          Choose Your Club
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          {shortlist.length > 0 && (
            <span style={{ fontSize: 11, color: tokens.muted }}>Shortlist: {shortlist.length}</span>
          )}
          {compareList.length > 0 && (
            <Button variant="outline" size="sm" onClick={() => setShowCompare(true)}>
              Compare ({compareList.length}/3)
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={randomClub}>🎲 Random</Button>
        </div>
      </header>

      {/* ── 3-panel body ── */}
      <div style={{
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
        minHeight: 'calc(100vh - 56px)',
      }}>

        {/* ── LEFT: Club list ── */}
        <div style={{
          width: 264,
          borderRight: `1px solid ${tokens.border}`,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          flexShrink: 0,
          background: tokens.bg,
        }}>
          {/* Filters */}
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

          {/* Club rows */}
          <div style={{ overflowY: 'auto', flex: 1, padding: '6px' }}>
            <div style={{
              fontSize: 10, color: tokens.muted, padding: '8px 8px 4px',
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              {filteredClubs.length} clubs
            </div>
            {filteredClubs.map(club => {
              const isFeatured   = featured?.id === club.id;
              const isShortlisted = shortlist.includes(club.id);
              const isComparing  = compareList.includes(club.id);
              return (
                <button
                  key={club.id}
                  onClick={() => setFeatured(club)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '9px 10px',
                    background: isFeatured ? `${club.color}18` : 'transparent',
                    border: `1px solid ${isFeatured ? club.color : 'transparent'}`,
                    borderRadius: tokens.radius.md,
                    cursor: 'pointer', width: '100%', textAlign: 'left',
                    fontFamily: tokens.font, marginBottom: 2,
                    transition: `all ${tokens.transition.fast}`,
                  }}
                  onMouseEnter={e => { if (!isFeatured) e.currentTarget.style.background = tokens.surface; }}
                  onMouseLeave={e => { if (!isFeatured) e.currentTarget.style.background = 'transparent'; }}
                >
                  <ClubCrest club={club} size={28} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 12, fontWeight: 600, color: tokens.text,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {club.shortName}
                    </div>
                    <div style={{ fontSize: 10, color: tokens.muted }}>
                      {LEAGUES.find(l => l.id === club.leagueId)?.name?.split(' ').slice(-2).join(' ')}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 3 }}>
                    {isShortlisted && <span title="Shortlisted" style={{ fontSize: 10, color: tokens.accent }}>★</span>}
                    {isComparing   && <span title="Comparing"   style={{ fontSize: 10, color: tokens.accent }}>C</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── CENTRE: Stadium showcase ── */}
        {featured && (
          <div style={{
            flex: 1,
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {/* Stadium night background — full bleed */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${ENV.stadiumNight})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: revealed ? 0.45 : 0,
              transform: revealed ? 'scale(1)' : 'scale(1.03)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
              willChange: 'transform, opacity',
            }} />

            {/* Club colour tint overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${featured.color}18 0%, transparent 65%)`,
              opacity: revealed ? 1 : 0,
              transition: 'opacity 0.4s ease',
            }} />

            {/* Dark vignette */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: `
                radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, rgba(0,0,0,0.7) 100%),
                linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.75) 100%)
              `,
            }} />

            {/* Club content */}
            <div style={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '32px 24px',
              opacity: revealed ? 1 : 0,
              transform: revealed ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.97)',
              transition: 'opacity 0.35s ease, transform 0.35s ease',
            }}>
              {/* Club crest */}
              <div style={{
                marginBottom: 20,
                filter: 'drop-shadow(0 4px 24px rgba(0,0,0,0.8))',
              }}>
                <ClubCrest club={featured} size={120} />
              </div>

              <h2 style={{
                fontFamily: tokens.fontDisplay,
                fontSize: 'clamp(28px, 4vw, 52px)',
                fontWeight: 900,
                textAlign: 'center',
                color: tokens.text,
                marginBottom: 6,
                letterSpacing: '-0.01em',
                textShadow: '0 2px 20px rgba(0,0,0,0.8)',
              }}>
                {featured.name}
              </h2>

              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 20, textAlign: 'center' }}>
                {featuredLeague?.name} · {featured.location}
              </div>

              {/* Tags */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 28 }}>
                {featured.tags?.map(tag => (
                  <span key={tag} style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                    padding: '4px 10px', borderRadius: 20,
                    background: 'rgba(0,0,0,0.5)', color: 'rgba(255,255,255,0.5)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(4px)',
                  }}>{tag}</span>
                ))}
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Button
                  variant={shortlist.includes(featured.id) ? 'outline' : 'ghost'}
                  size="sm"
                  onClick={() => toggleShortlist(featured.id)}
                  style={{ backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.4)' }}
                >
                  {shortlist.includes(featured.id) ? '★ Shortlisted' : '☆ Shortlist'}
                </Button>
                <Button
                  variant={compareList.includes(featured.id) ? 'outline' : 'ghost'}
                  size="sm"
                  onClick={() => toggleCompare(featured.id)}
                  disabled={compareList.length >= 3 && !compareList.includes(featured.id)}
                  style={{ backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.4)' }}
                >
                  {compareList.includes(featured.id) ? '✓ Comparing' : 'Compare'}
                </Button>
              </div>
            </div>

            {/* Bottom accent bar */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 3,
              background: featured.color,
              opacity: revealed ? 0.8 : 0,
              transition: 'opacity 0.4s ease',
            }} />
          </div>
        )}

        {/* ── RIGHT: Club details ── */}
        {featured && (
          <div style={{
            width: 300,
            flexShrink: 0,
            overflowY: 'auto',
            background: tokens.surface,
            borderLeft: `1px solid ${tokens.border}`,
            display: 'flex',
            flexDirection: 'column',
            opacity: revealed ? 1 : 0,
            transition: 'opacity 0.35s ease 0.1s',
          }}>
            {/* Club colour header strip */}
            <div style={{
              height: 4,
              background: featured.color,
              flexShrink: 0,
            }} />

            <div style={{ padding: '20px 18px', flex: 1 }}>
              {/* Facts */}
              <div style={{ marginBottom: 20 }}>
                <div style={{
                  fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: tokens.accent, fontWeight: 700, marginBottom: 10,
                }}>Club Facts</div>
                {[
                  ['Founded',  featured.founded],
                  ['Stadium',  featured.stadium],
                  ['Capacity', featured.capacity.toLocaleString()],
                  ['League',   featuredLeague?.name],
                  ['Location', featured.location],
                ].map(([k, v]) => (
                  <div key={k} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                    padding: '8px 0', borderBottom: `1px solid ${tokens.border}`, gap: 12,
                  }}>
                    <span style={{ fontSize: 11, color: tokens.muted, flexShrink: 0 }}>{k}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, textAlign: 'right' }}>{v}</span>
                  </div>
                ))}
              </div>

              {/* About */}
              <div style={{ marginBottom: 14 }}>
                <div style={{
                  fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: tokens.accent, fontWeight: 700, marginBottom: 8,
                }}>About</div>
                <p style={{ fontSize: 12, color: tokens.muted, lineHeight: 1.7 }}>{featured.description}</p>
              </div>

              {/* Identity */}
              <div style={{
                marginBottom: 14, padding: '12px 14px',
                background: tokens.bg, borderRadius: tokens.radius.md,
              }}>
                <div style={{
                  fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase',
                  color: tokens.accent, fontWeight: 700, marginBottom: 6,
                }}>Identity</div>
                <p style={{ fontSize: 12, lineHeight: 1.6 }}>{featured.identity}</p>
              </div>

              {/* Why manage here */}
              <div style={{
                marginBottom: 20, padding: '12px 14px',
                background: tokens.bg, borderRadius: tokens.radius.md,
              }}>
                <div style={{
                  fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase',
                  color: tokens.accent, fontWeight: 700, marginBottom: 6,
                }}>Why manage here?</div>
                <p style={{ fontSize: 12, lineHeight: 1.6 }}>{featured.whyManage}</p>
              </div>
            </div>

            {/* Sticky CTA */}
            <div style={{
              padding: '14px 18px',
              borderTop: `1px solid ${tokens.border}`,
              background: tokens.surface,
              flexShrink: 0,
            }}>
              <Button
                onClick={() => handleSelect(featured)}
                size="lg"
                style={{ width: '100%' }}
              >
                Select {featured.shortName} →
              </Button>
            </div>
          </div>
        )}

        {/* No featured state */}
        {!featured && (
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: tokens.muted, fontSize: 14,
          }}>
            Select a club from the list
          </div>
        )}
      </div>

      {/* ── Compare modal ── */}
      {showCompare && (
        <div
          onClick={e => e.target === e.currentTarget && setShowCompare(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 100, padding: 24,
          }}
        >
          <div style={{
            background: tokens.surface, border: `1px solid ${tokens.border}`,
            borderRadius: tokens.radius.xl, maxWidth: 800, width: '100%',
            maxHeight: '90vh', overflow: 'auto',
          }}>
            <div style={{
              padding: '20px 24px', borderBottom: `1px solid ${tokens.border}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, fontFamily: tokens.fontDisplay }}>Club Comparison</h2>
              <button
                onClick={() => setShowCompare(false)}
                style={{ background: 'none', border: 'none', color: tokens.muted, cursor: 'pointer', fontSize: 20, fontFamily: tokens.font }}
              >×</button>
            </div>
            <div style={{
              padding: 24,
              display: 'grid',
              gridTemplateColumns: `repeat(${compareClubs.length}, 1fr)`,
              gap: 16,
            }}>
              {compareClubs.map(club => {
                const lg = LEAGUES.find(l => l.id === club.leagueId);
                return (
                  <div key={club.id} style={{ textAlign: 'center' }}>
                    <ClubCrest club={club} size={60} />
                    <div style={{ fontSize: 15, fontWeight: 700, marginTop: 10, marginBottom: 4, fontFamily: tokens.fontDisplay }}>{club.name}</div>
                    <div style={{ fontSize: 11, color: tokens.muted, marginBottom: 16 }}>{lg?.name}</div>
                    {[
                      ['Founded',  club.founded],
                      ['Stadium',  club.stadium],
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
