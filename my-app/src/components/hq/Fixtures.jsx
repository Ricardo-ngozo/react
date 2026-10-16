import { useState } from 'react';
import { CLUBS } from '../../data/clubs.js';
import { formatDate } from '../../data/football.js';
import { useGame } from '../../context/useGame.js';
import { ClubCrest } from '../ui/ClubCrest.jsx';
import { Chip, EmptyState } from '../ui/Primitives.jsx';
import { Icon } from '../ui/Icon.jsx';
export default function Fixtures({
  fixtures,
  club,
  workspace,
  onBriefing
}) {
  const {
    settings
  } = useGame();
  const [view, setView] = useState('list'),
    [type, setType] = useState('all'),
    [venue, setVenue] = useState('all'),
    [month, setMonth] = useState(fixtures[0].date.slice(0, 7));
  const months = [...new Set(fixtures.map(f => f.date.slice(0, 7)))];
  const filtered = fixtures.filter(f => (type === 'all' || f.type === type) && (venue === 'all' || f.home === (venue === 'home')));
  const monthFixtures = filtered.filter(f => f.date.startsWith(month));
  const [year, monthNumber] = month.split('-').map(Number),
    days = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate(),
    offset = (new Date(Date.UTC(year, monthNumber - 1, 1)).getUTCDay() + 6) % 7;
  return <>
<div className="squad-toolbar">
<div className="segmented">{[['list', 'List view'], ['calendar', 'Calendar']].map(([id, label]) => <button key={id} aria-pressed={view === id} onClick={() => setView(id)}>{label}</button>)}</div>
<div className="row wrap">
<select aria-label="Fixture competition" style={{
          width: 145
        }} value={type} onChange={e => setType(e.target.value)}>
<option value="all">All fixtures</option>
<option value="Friendly">Pre-season</option>
<option value="League">League</option>
</select>
<select aria-label="Fixture venue" style={{
          width: 125
        }} value={venue} onChange={e => setVenue(e.target.value)}>
<option value="all">All venues</option>
<option value="home">At home</option>
<option value="away">Away</option>
</select>
</div>
</div>
    <div className="panel">{view === 'list' ? <>
<div className="panel-heading">
<h2>Your season at a glance</h2>
<Chip>{filtered.length} fixtures</Chip>
</div>{filtered.map((f, i) => {
          const opponent = CLUBS.find(c => c.id === f.opponentId),
            date = new Date(f.date + 'T12:00:00Z');
          return <button key={f.id} className="fixture-row" onClick={() => onBriefing(f)} aria-label={`Open briefing for ${opponent.name}, ${formatDate(f.date, settings)}`}>
<div className="fixture-date">
<strong>{date.getUTCDate()}</strong>
<small>{date.toLocaleDateString('en-GB', {
                  month: 'short',
                  timeZone: 'UTC'
                })}</small>
</div>
<div className="fixture-opponent">
<ClubCrest club={opponent} size={34} />
<div>
<strong>{opponent.name} <span className="muted">({f.home ? 'H' : 'A'})</span>
</strong>
<small>{f.home ? club.stadium || club.name + ' home ground' : opponent.stadium || opponent.name + ' home ground'}</small>
</div>
</div>
<div className="fixture-competition">{f.type === 'Friendly' ? 'Pre-season friendly' : 'Matchweek ' + f.round}{workspace.reviewedFixtures?.includes(f.id) && <span className="accent" style={{
                display: 'block',
                marginTop: 5
              }}>Brief reviewed</span>}</div>
<div className="fixture-time">{f.time}{i === 0 && <span className="accent" style={{
                display: 'block',
                marginTop: 6,
                fontSize: 8
              }}>UP NEXT</span>}</div>
<Icon name="chevron" size={14} />
</button>;
        })}{!filtered.length && <EmptyState title="No fixtures in this view" description="Try another competition or venue." />}</> : <div className="calendar-month">
<div className="row-between" style={{
          marginBottom: 16
        }}>
<h2>{new Date(year, monthNumber - 1, 1).toLocaleDateString('en-GB', {
              month: 'long',
              year: 'numeric'
            })}</h2>
<div className="row">
<button className="icon-button" aria-label="Previous month" disabled={months.indexOf(month) === 0} onClick={() => setMonth(months[months.indexOf(month) - 1])}>
<Icon name="back" size={16} />
</button>
<button className="icon-button" aria-label="Next month" disabled={months.indexOf(month) === months.length - 1} onClick={() => setMonth(months[months.indexOf(month) + 1])}>
<Icon name="arrow" size={16} />
</button>
</div>
</div>
<div className="calendar-weekdays">{['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(d => <span key={d}>{d}</span>)}</div>
<div className="calendar-grid">{Array.from({
            length: Math.ceil((offset + days) / 7) * 7
          }, (_, i) => {
            const day = i - offset + 1,
              date = month + '-' + String(day).padStart(2, '0'),
              f = monthFixtures.find(f => f.date === date),
              opponent = f ? CLUBS.find(c => c.id === f.opponentId) : null;
            return <div className={'calendar-cell ' + (day < 1 || day > days ? 'empty' : '')} key={i}>{day >= 1 && day <= days && <>
<span>{day}</span>{f && <button className="calendar-event" onClick={() => onBriefing(f)} aria-label={`Open ${opponent.name} briefing on ${formatDate(f.date, settings)}`}>
<ClubCrest club={opponent} size={23} />{opponent.shortName}<span>{f.home ? 'Home' : 'Away'} · {f.time}</span>
</button>}</>}</div>;
          })}</div>
</div>}</div>
<p className="tiny subtle" style={{
      marginTop: 16
    }}>Illustrative 2026/27 schedule for preparation. These are not official club fixtures; match simulation is in development.</p>
</>;
}
