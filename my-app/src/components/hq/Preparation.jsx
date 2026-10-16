import { MESSAGES } from '../../data/messages.js';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGame } from '../../context/useGame.js';
import { TRAINING_OPTIONS, DEFAULT_SESSIONS, makeSquad, money, PROJECTS } from '../../data/football.js';
import { Button, Chip, Field, EmptyState, Meter } from '../ui/Primitives.jsx';
import { ConfirmModal } from '../ui/Modal.jsx';
import { Icon } from '../ui/Icon.jsx';
export function Training({
  workspace,
  update,
  notify
}) {
  const {
      settings
    } = useGame(),
    sessions = workspace.sessions || DEFAULT_SESSIONS,
    intensity = workspace.intensity || 'Balanced';
  const load = Math.min(100, Math.round(sessions.reduce((n, s) => n + (s === 'Rest' ? 0 : s === 'Recovery' ? 5 : 15), 0) * (intensity === 'Light' ? .7 : intensity === 'Intense' ? 1.3 : 1)));
  const change = (index, value) => {
    const next = [...sessions];
    next[index] = value;
    update({
      sessions: next
    });
  };
  return <>
<div className="panel panel-body" style={{
      marginBottom: 22
    }}>
<div className="row-between wrap">
<div>
<p className="eyebrow">The week before kick-off</p>
<h2>Good football starts here.</h2>
<p className="small muted" style={{
            marginTop: 10
          }}>Build a six-day programme for the work you want to do.</p>
</div>
<div style={{
          minWidth: 200
        }}>
<Field label="Weekly intensity">
<select value={intensity} onChange={e => update({
              intensity: e.target.value
            })}>{['Light', 'Balanced', 'Intense'].map(v => <option key={v}>{v}</option>)}</select>
</Field>
</div>
</div>
<div className="separator" />
<div className="row-between">
<span className="small muted">Planned training load</span>
<Chip tone={load > 85 ? 'amber' : 'accent'}>{load > 85 ? 'High load' : load < 40 ? 'Recovery focused' : 'Balanced week'} · {load}%</Chip>
</div>
<Meter value={load} tone={load > 85 ? 'amber' : ''} label="Planned training load" />{settings.showHints && <p className="tiny muted" style={{
        marginTop: 13
      }}>Load is a planning estimate. Mix recovery with technical work and save a lighter day before your fixture.</p>}</div>
    <div className="training-grid">{['Monday · 06 Jul', 'Tuesday · 07 Jul', 'Wednesday · 08 Jul', 'Thursday · 09 Jul', 'Friday · 10 Jul', 'Saturday · 11 Jul'].map((day, i) => <article className="session-card" key={day}>
<p className="session-day">{day}</p>
<Icon name={sessions[i] === 'Recovery' || sessions[i] === 'Rest' ? 'moon' : sessions[i] === 'Match preparation' ? 'flag' : 'training'} size={25} />
<h3>{sessions[i]}</h3>
<select aria-label={day + ' training session'} value={sessions[i]} onChange={e => change(i, e.target.value)}>{TRAINING_OPTIONS.map(o => <option key={o}>{o}</option>)}</select>
<p className="training-impact">{sessions[i] === 'Recovery' ? 'Focus · fresh legs and recovery' : sessions[i] === 'Rest' ? 'Focus · a full day away from training' : sessions[i] === 'Match preparation' ? 'Focus · shape, roles and the next opponent' : 'Focus · ' + sessions[i].toLowerCase()}<br />Intensity · {intensity.toLowerCase()}</p>
</article>)}</div>
<div className="row-between wrap" style={{
      marginTop: 24
    }}>
<p className="tiny muted">Your week is saved as you edit. Simulated training effects arrive with the match engine.</p>
<Button icon="check" onClick={() => {
        update({
          sessions: [...sessions],
          intensity
        });
        notify('Your training week is confirmed.');
      }}>Confirm training week</Button>
</div>
</>;
}
export function Recruitment({
  club,
  workspace,
  update,
  onPlayer
}) {
  const {
      settings
    } = useGame(),
    [search, setSearch] = useState(''),
    [tab, setTab] = useState('all'),
    [position, setPosition] = useState('all');
  const pool = makeSquad('recruit-' + club.id).filter((_, i) => [0, 3, 5, 7, 9, 11, 13, 15, 16, 18, 20, 22].includes(i)).map(p => ({
    ...p,
    scouting: true
  }));
  const shortlist = workspace.shortlist || [];
  const filtered = pool.filter(p => (tab === 'all' || shortlist.includes(p.id)) && (position === 'all' || p.group === position) && p.name.toLowerCase().includes(search.toLowerCase()));
  const toggle = p => update(w => ({
    shortlist: (w.shortlist || []).includes(p.id) ? w.shortlist.filter(id => id !== p.id) : [...(w.shortlist || []), p.id]
  }));
  return <>
<div className="squad-toolbar">
<div className="search-field">
<Icon name="search" size={16} />
<input aria-label="Search scouted players" placeholder="Find your next prospect…" value={search} onChange={e => setSearch(e.target.value)} />
</div>
<div className="row wrap">
<div className="segmented">
<button aria-pressed={tab === 'all'} onClick={() => setTab('all')}>Discover</button>
<button aria-pressed={tab === 'shortlist'} onClick={() => setTab('shortlist')}>Shortlist · {shortlist.length}</button>
</div>
<select style={{
          width: 145
        }} aria-label="Scouting position" value={position} onChange={e => setPosition(e.target.value)}>
<option value="all">All positions</option>{['GK', 'DEF', 'MID', 'ATT'].map(p => <option key={p}>{p}</option>)}</select>
</div>
</div>
    {!filtered.length ? <div className="panel">
<EmptyState icon="star" title={tab === 'shortlist' ? 'Your next signing starts with a name.' : 'No prospects in this view.'} description={tab === 'shortlist' ? 'Explore the scouting pool and add players to your personal shortlist.' : 'Try a different position or search.'} action={<Button variant="secondary" onClick={() => {
        setTab('all');
        setSearch('');
        setPosition('all');
      }}>Explore players</Button>} />
</div> : <div className="scout-grid">{filtered.map(p => <article className="panel scout-card" key={p.id}>
<div className="scout-player-top">
<div className="player-silhouette">{p.name.split(' ').map(w => w[0]).join('')}</div>
<span className="rating" style={{
            minWidth: settings.scoutingDetail === 'ranges' ? 50 : 28
          }}>{settings.scoutingDetail === 'ranges' ? `${p.overall - 3}–${p.overall + 3}` : p.overall}</span>
</div>
<h3>{p.name}</h3>
<p>{p.nationality} · {p.age} years old · {p.foot} foot</p>
<span className={'position-badge position-' + p.group}>{p.pos}</span>
<div className="scout-attributes">
<div>Potential<strong>{settings.scoutingDetail === 'ranges' ? 'Promising' : p.potential}</strong>
</div>
<div>Indicative cost<strong>{money(p.overall * 72000, settings)}</strong>
</div>
</div>
<Button variant="secondary" icon="search" onClick={() => onPlayer(p)}>View scout report</Button>
<Button variant={shortlist.includes(p.id) ? 'primary' : 'ghost'} icon={shortlist.includes(p.id) ? 'check' : 'plus'} onClick={() => toggle(p)}>{shortlist.includes(p.id) ? 'On your shortlist' : 'Add to shortlist'}</Button>
</article>)}</div>}<p className="tiny subtle" style={{
      marginTop: 18
    }}>Fictional scouting pool and illustrative estimates. Shortlisting is available; transfer negotiations are planned.</p>
</>;
}
export function Office({
  workspace,
  update
}) {
  const [open, setOpen] = useState(null),
    [unreadOnly, setUnreadOnly] = useState(false),
    read = workspace.readMessages || [];
  const messages = MESSAGES.filter(m => !unreadOnly || !read.includes(m.id));
  const readMessage = id => {
    setOpen(open === id ? null : id);
    update(w => ({
      readMessages: [...new Set([...(w.readMessages || []), id])]
    }));
  };
  return <>
<div className="squad-toolbar">
<div className="segmented">
<button aria-pressed={!unreadOnly} onClick={() => setUnreadOnly(false)}>All messages · {MESSAGES.length}</button>
<button aria-pressed={unreadOnly} onClick={() => setUnreadOnly(true)}>Unread · {MESSAGES.length - read.filter(id => MESSAGES.some(m => m.id === id)).length}</button>
</div>
<Button size="sm" variant="ghost" icon="check" onClick={() => update({
        readMessages: MESSAGES.map(m => m.id)
      })}>Mark all as read</Button>
</div>
<div className="message-list">{messages.map(m => <article className="panel message-card" key={m.id}>
<button className="message-trigger" aria-expanded={open === m.id} aria-controls={'message-' + m.id} onClick={() => readMessage(m.id)}>
<span className="inbox-avatar">{m.initials}</span>
<span>
<strong>{m.title}</strong>
<small>{m.from} · Pre-season week 01</small>
</span>{!read.includes(m.id) && <span className="unread-dot" />}<Icon name="chevron" size={17} />
</button>{open === m.id && <div className="message-body" id={'message-' + m.id}>
<Chip>{m.tag}</Chip>
<p style={{
            marginTop: 18
          }}>{m.body}</p>
<Link to={'?s=' + m.section}>
<Button variant="secondary" endIcon="arrow">{m.action}</Button>
</Link>
</div>}</article>)}</div>{!messages.length && <div className="panel">
<EmptyState icon="mail" title="A clear inbox. A clear head." description="You’re up to date. Everything is still available under All messages." />
</div>}</>;
}
export function Notebook({
  workspace,
  update,
  notify
}) {
  const [title, setTitle] = useState(''),
    [body, setBody] = useState(''),
    [category, setCategory] = useState('General'),
    [deleting, setDeleting] = useState(null),
    notes = workspace.notes || [];
  const save = () => {
    if (!title.trim() || !body.trim()) return;
    update(w => ({
      notes: [{
        id: crypto.randomUUID(),
        title: title.trim(),
        body: body.trim(),
        category,
        createdAt: Date.now()
      }, ...(w.notes || [])]
    }));
    setTitle('');
    setBody('');
    notify('Added to your manager’s notebook.');
  };
  return <>
<section className="panel note-composer">
<div className="row-between" style={{
        marginBottom: 24
      }}>
<div>
<p className="eyebrow">Your thinking space</p>
<h2>Every idea starts somewhere.</h2>
</div>
<Icon name="book" size={26} />
</div>
<div className="form-grid" style={{
        marginBottom: 18
      }}>
<Field label="A title for your idea">
<input maxLength={80} value={title} onChange={e => setTitle(e.target.value)} placeholder="What have you noticed?" />
</Field>
<Field label="Keep it organised">
<select value={category} onChange={e => setCategory(e.target.value)}>{['General', 'Tactics', 'Scouting', 'Club project', 'Match preparation'].map(c => <option key={c}>{c}</option>)}</select>
</Field>
</div>
<Field label="Your notes">
<textarea value={body} onChange={e => setBody(e.target.value)} maxLength={2500} placeholder="An opposition weakness. A player to watch. A different way to play…" />
</Field>
<div className="row-between" style={{
        marginTop: 18
      }}>
<span className="tiny subtle">{body.length} / 2,500 characters</span>
<Button icon="plus" disabled={!title.trim() || !body.trim()} onClick={save}>Add note</Button>
</div>
</section>
    {!notes.length ? <div className="panel">
<EmptyState icon="book" title="A blank page. A fresh perspective." description="Your notes stay with this career. Capture the ideas you want to come back to." />
</div> : <div className="library-grid">{notes.map(n => <article key={n.id} className="panel note-card">
<div className="row-between">
<Chip>{n.category}</Chip>
<button className="icon-button" aria-label={'Delete ' + n.title} onClick={() => setDeleting(n.id)}>
<Icon name="close" size={15} />
</button>
</div>
<h3 style={{
          marginTop: 18
        }}>{n.title}</h3>
<p>{n.body}</p>
<small>Added {new Date(n.createdAt).toLocaleDateString('en-GB')}</small>
</article>)}</div>}<ConfirmModal open={Boolean(deleting)} onClose={() => setDeleting(null)} title="Delete this note?" message="This note will be removed from your manager’s notebook." danger confirmLabel="Delete note" onConfirm={() => update(w => ({
      notes: (w.notes || []).filter(n => n.id !== deleting)
    }))} />
</>;
}
export function Project({
  career,
  club,
  workspace
}) {
  const project = PROJECTS.find(p => p.id === career.project) || PROJECTS[3];
  const milestones = [['Choose the voice of your dressing room', Boolean(workspace.captain), 'Select a captain from a player profile.', 'squad'], ['Give your football a clear shape', Boolean(workspace.tactics), 'Confirm your first lineup and team instructions.', 'tactics'], ['Build a week with purpose', Boolean(workspace.sessions), 'Set and confirm a training programme.', 'training'], ['Keep an eye on the next generation', (workspace.shortlist || []).length >= 3, 'Shortlist three players who fit your project.', 'recruitment'], ['Write down your first idea', (workspace.notes || []).length > 0, 'Add a thought to your manager’s notebook.', 'notebook']];
  return <>
<div className="panel panel-body" style={{
      marginBottom: 22
    }}>
<div className="row" style={{
        gap: 24
      }}>
<span className="empty-icon" style={{
          flexShrink: 0,
          marginBottom: 0
        }}>
<Icon name={project.icon} size={28} />
</span>
<div>
<p className="eyebrow">The long view</p>
<h2>{project.label}</h2>
<p className="small muted" style={{
            marginTop: 10
          }}>{project.desc}</p>
</div>
</div>
<div className="separator" />
<div className="row-between" style={{
        marginBottom: 12
      }}>
<span className="small muted">Your first foundations</span>
<span className="small accent">{milestones.filter(m => m[1]).length} / {milestones.length}</span>
</div>
<Meter label="Project preparation milestones" value={milestones.filter(m => m[1]).length / milestones.length * 100} />
</div>
<section className="panel">
<div className="panel-heading">
<h2>Small steps. Lasting foundations.</h2>
<Chip>Pre-season</Chip>
</div>
<div className="preparation-list">{milestones.map(([label, done, desc, section]) => <Link key={label} to={'?s=' + section} className={'prep-item ' + (done ? 'complete' : '')}>
<span className="prep-check">
<Icon name={done ? 'check' : 'plus'} size={12} />
</span>
<span>
<strong>{label}</strong>
<small>{desc}</small>
</span>
<Icon name="chevron" size={14} />
</Link>)}</div>
</section>
<div className="panel panel-body" style={{
      marginTop: 22
    }}>
<p className="eyebrow">The place you call home</p>
<h2>{club.name}</h2>
<p className="small muted" style={{
        marginTop: 15
      }}>{club.identity}</p>
<div className="review-lines" style={{
        marginTop: 15
      }}>{[['Location', club.location], ...(club.stadium ? [['Ground', club.stadium]] : []), ...(club.founded ? [['Founded', club.founded]] : [])].map(([k, v]) => <div key={k}>
<span>{k}</span>
<span>{v}</span>
</div>)}</div>
</div>
</>;
}
