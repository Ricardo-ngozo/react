import { useState } from 'react';
import { Button, EmptyState, Meter } from '../ui/Primitives.jsx';
import { Icon } from '../ui/Icon.jsx';
export default function Squad({
  squad,
  tactics,
  workspace,
  onPlayer
}) {
  const [search, setSearch] = useState(''),
    [group, setGroup] = useState('All'),
    [sort, setSort] = useState('number');
  const filtered = squad.filter(p => (group === 'All' || p.group === group) && p.name.toLowerCase().includes(search.toLowerCase())).sort((a, b) => sort === 'overall' ? b.overall - a.overall : sort === 'age' ? a.age - b.age : sort === 'fitness' ? b.fitness - a.fitness : a.number - b.number);
  return <>
<div className="squad-toolbar">
<div className="search-field">
<Icon name="search" size={16} />
<input placeholder="Find a player…" aria-label="Search squad" value={search} onChange={e => setSearch(e.target.value)} />
</div>
<div className="segmented" aria-label="Filter squad by position">{['All', 'GK', 'DEF', 'MID', 'ATT'].map(g => <button key={g} aria-pressed={group === g} onClick={() => setGroup(g)}>{g}</button>)}</div>
<select style={{
        width: 160
      }} aria-label="Sort squad" value={sort} onChange={e => setSort(e.target.value)}>
<option value="number">Squad number</option>
<option value="overall">Highest ability</option>
<option value="age">Youngest first</option>
<option value="fitness">Best condition</option>
</select>
</div>
    <div className="panel table-scroll">
<table className="data-table">
<thead>
<tr>{['Player', 'Position', 'Age', 'Ability', 'Potential', 'Condition', 'Status', ''].map((s, i) => <th key={i} scope="col">{s}</th>)}</tr>
</thead>
<tbody>{filtered.map(p => <tr key={p.id}>
<td>
<button className="player-name-button" onClick={() => onPlayer(p)}>
<span className="player-number">{String(p.number).padStart(2, '0')}</span>
<span>
<strong>{p.name}{workspace.captain === p.id && <span className="accent"> · C</span>}</strong>
<small>{p.nationality} · {p.foot} foot</small>
</span>
</button>
</td>
<td>
<span className={'position-badge position-' + p.group}>{p.pos}</span>
</td>
<td>{p.age}</td>
<td>
<span className="rating">{p.overall}</span>
</td>
<td>{p.potential}</td>
<td>
<div className="fitness-cell">
<Meter value={p.fitness} label={p.name + ' condition'} />{p.fitness}%</div>
</td>
<td>
<span className={Object.values(tactics.lineup).includes(p.id) ? 'accent' : 'subtle'}>{Object.values(tactics.lineup).includes(p.id) ? 'Starting XI' : 'Available'}</span>
</td>
<td>
<Button size="sm" variant="ghost" onClick={() => onPlayer(p)}>Profile</Button>
</td>
</tr>)}</tbody>
</table>{!filtered.length && <EmptyState title="No players found" description="Try a different name or position filter." />}</div>
<p className="tiny subtle" style={{
      marginTop: 16
    }}>Fictional development squads. Player identities and ratings are generated for this interface preview.</p>
</>;
}
