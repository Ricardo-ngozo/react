import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/useGame.js';
import { CLUBS, COUNTRIES, LEAGUES } from '../data/clubs.js';
import { ENV } from '../data/assets.js';
import { ClubBrowser } from '../components/ClubBrowser.jsx';
import { ClubCrest } from '../components/ui/ClubCrest.jsx';
import { Button, Chip, PageHeader } from '../components/ui/Primitives.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { Icon } from '../components/ui/Icon.jsx';
import { usePageTitle } from '../hooks/usePageTitle.js';
export default function WorldExplorer() {
  usePageTitle('Explore the world');
  const navigate = useNavigate(),
    {
      updateDraft,
      clearDraft
    } = useGame();
  const [selected, setSelected] = useState(null),
    [compare, setCompare] = useState([]),
    [comparing, setComparing] = useState(false);
  const league = LEAGUES.find(l => l.id === selected?.leagueId),
    country = COUNTRIES.find(c => c.id === selected?.countryId);
  const toggleCompare = id => setCompare(prev => prev.includes(id) ? prev.filter(c => c !== id) : prev.length < 3 ? [...prev, id] : prev);
  const choose = club => {
    clearDraft();
    updateDraft({
      setupType: 'custom',
      clubId: club.id,
      clubName: club.name
    });
    navigate('/career/setup/1');
  };
  return <main>
<PageHeader eyebrow="The football world" title="A world of possibilities." description="Find the badge, the supporters and the ambition that speak to you." action={compare.length > 0 && <Button variant="secondary" icon="tactics" onClick={() => setComparing(true)}>Compare clubs ({compare.length}/3)</Button>} />
<div className="page-content">
<div className="world-hero">
<img src={ENV.stadiumPitch} alt="Sunset over a football pitch" />
<div>
<p className="eyebrow">Find your next challenge</p>
<h2>Big dreams don’t need<br />a big club.</h2>
<p>From famous grounds to the next great underdog story. There’s a place here for your kind of football.</p>
</div>
<div className="row">{[[CLUBS.length, 'Clubs'], [COUNTRIES.length, 'Nations'], [LEAGUES.length, 'Collections']].map(([n, label]) => <div className="compare-cell" key={label}>
<strong>{n}</strong>
<span>{label}</span>
</div>)}</div>
</div>
<ClubBrowser onSelect={setSelected} />
<footer className="page-footer">
<span>Curated club collections · Club monograms are original UI artwork.</span>
<span>Competition groupings are illustrative.</span>
</footer>
</div>
  <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.name || 'Club profile'}>{selected && <>
<div className="profile-header">
<ClubCrest club={selected} size={65} />
<div>
<h3>{selected.name}</h3>
<p>{league?.name} · {country?.name}</p>
<div className="club-tags" style={{
              marginTop: 12
            }}>{selected.tags.map(t => <Chip key={t}>{t}</Chip>)}</div>
</div>
</div>
<p className="small muted leading">{selected.description}</p>
<div className="separator" />
<p className="eyebrow">Why this club?</p>
<p className="small leading">{selected.whyManage}</p>
<div className="review-lines" style={{
          marginTop: 12
        }}>
<div>
<span>Home</span>
<span>{selected.location}</span>
</div>{selected.stadium && <div>
<span>Ground</span>
<span>{selected.stadium}</span>
</div>}{selected.founded && <div>
<span>Established</span>
<span>{selected.founded}</span>
</div>}</div>
<div className="modal-actions wrap">
<Button variant="secondary" icon={compare.includes(selected.id) ? 'check' : 'plus'} disabled={!compare.includes(selected.id) && compare.length >= 3} onClick={() => toggleCompare(selected.id)}>{compare.includes(selected.id) ? 'Added to comparison' : 'Compare this club'}</Button>
<Button endIcon="arrow" onClick={() => choose(selected)}>Build a career here</Button>
</div>
</>}</Modal>
  <Modal open={comparing} onClose={() => setComparing(false)} title="Find your fit" maxWidth={850}>
<div className="comparison-grid">{compare.map(id => {
          const c = CLUBS.find(club => club.id === id);
          return <div className="compare-cell" key={id}>
<ClubCrest club={c} size={50} />
<h2 style={{
              margin: '20px 0 12px'
            }}>{c.name}</h2>
<p className="tiny muted">{LEAGUES.find(l => l.id === c.leagueId)?.name}</p>
<p className="small muted leading" style={{
              margin: '18px 0'
            }}>{c.identity}</p>
<div className="club-tags">{c.tags.map(t => <Chip key={t}>{t}</Chip>)}</div>
<Button size="sm" style={{
              marginTop: 22,
              width: '100%'
            }} onClick={() => choose(c)}>Choose club</Button>
<button className="text-button" style={{
              marginTop: 10
            }} onClick={() => toggleCompare(id)}>
<Icon name="close" size={12} /> Remove</button>
</div>;
        })}</div>{compare.length === 0 && <p className="small muted">Open a club profile to add it to your comparison.</p>}</Modal>
</main>;
}
