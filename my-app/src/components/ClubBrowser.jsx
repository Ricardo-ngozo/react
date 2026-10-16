import { useState } from 'react';
import { CLUBS, COUNTRIES, LEAGUES } from '../data/clubs.js';
import { ClubCrest } from './ui/ClubCrest.jsx';
import { Icon } from './ui/Icon.jsx';
import { Button, Chip, EmptyState } from './ui/Primitives.jsx';
export function ClubBrowser({
  selectedId,
  onSelect,
  compact = false
}) {
  const [search, setSearch] = useState(''),
    [country, setCountry] = useState(''),
    [league, setLeague] = useState(''),
    [tag, setTag] = useState(''),
    [limit, setLimit] = useState(18);
  const filtered = CLUBS.filter(c => (!country || c.countryId === country) && (!league || c.leagueId === league) && (!tag || c.tags.includes(tag)) && (!search || [c.name, c.location, c.identity].join(' ').toLowerCase().includes(search.toLowerCase()))).sort((a, b) => a.name.localeCompare(b.name));
  const reset = () => {
    setSearch('');
    setCountry('');
    setLeague('');
    setTag('');
    setLimit(18);
  };
  return <div>
<div className={`catalogue-toolbar ${compact ? 'compact-toolbar' : ''}`}>
<div className="search-field">
<Icon name="search" size={17} />
<input aria-label="Search clubs" placeholder="Find a club or a city…" value={search} onChange={e => {
          setSearch(e.target.value);
          setLimit(18);
        }} />
</div>
<select aria-label="Filter by nation" value={country} onChange={e => {
        setCountry(e.target.value);
        setLeague('');
        setLimit(18);
      }}>
<option value="">All nations</option>{COUNTRIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>{!compact && <select aria-label="Filter by competition" value={league} onChange={e => {
        setLeague(e.target.value);
        setLimit(18);
      }}>
<option value="">All competitions</option>{LEAGUES.filter(l => !country || l.countryId === country).map(l => <option key={l.id} value={l.id}>{l.name}</option>)}</select>}</div>
    {!compact && <div className="row-between wrap" style={{
      marginBottom: 20
    }}>
<div className="country-filters" style={{
        marginBottom: 0
      }}>{[['', 'All projects'], ['Underdog', 'Underdogs'], ['Rebuild', 'Rebuilds'], ['Youth', 'Youth focused'], ['Contender', 'Contenders']].map(([value, label]) => <button key={label} aria-pressed={tag === value} onClick={() => {
          setTag(value);
          setLimit(18);
        }}>{label}</button>)}</div>
<span className="tiny muted">{filtered.length} clubs to discover</span>
</div>}
    {!filtered.length ? <EmptyState title="A little too specific?" description="Try another club, city, nation or competition." action={<Button variant="secondary" onClick={reset}>Clear filters</Button>} /> : compact ? <div className="club-picker-list">{filtered.map(club => <button className="club-picker-item" key={club.id} aria-pressed={selectedId === club.id} onClick={() => onSelect(club)}>
<ClubCrest club={club} size={30} />
<span>
<strong>{club.name}</strong>
<small>{LEAGUES.find(l => l.id === club.leagueId)?.name} · {club.location}</small>
</span>{selectedId === club.id && <Icon name="check" size={17} />}</button>)}</div> : <>
<div className="club-grid">{filtered.slice(0, limit).map(club => <button className={`club-card ${selectedId === club.id ? 'selected' : ''}`} key={club.id} aria-pressed={selectedId === club.id} onClick={() => onSelect(club)}>
<div className="row">
<ClubCrest club={club} size={44} />
<div>
<h3>{club.name}</h3>
<span className="club-meta">{LEAGUES.find(l => l.id === club.leagueId)?.name} · {COUNTRIES.find(c => c.id === club.countryId)?.name}</span>
</div>
</div>
<p>{club.identity}</p>
<div className="club-card-bottom">
<div className="club-tags">{club.tags.slice(0, 2).map(t => <Chip key={t}>{t}</Chip>)}</div>
<Icon name={selectedId === club.id ? 'check' : 'arrow'} size={15} />
</div>
</button>)}</div>{filtered.length > limit && <div style={{
        textAlign: 'center',
        marginTop: 25
      }}>
<Button variant="secondary" onClick={() => setLimit(n => n + 18)}>Discover more clubs <span className="muted">({filtered.length - limit})</span>
</Button>
</div>}</>}
  </div>;
}
