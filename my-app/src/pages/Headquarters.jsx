import { useState, useEffect, useRef } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useGame } from '../context/useGame.js';
import { CLUBS, LEAGUES } from '../data/clubs.js';
import { ENV, getAvatarById } from '../data/assets.js';
import { makeSquad, makeFixtures, getTactics, getReadiness, formatDate, PROJECTS } from '../data/football.js';
import { Button, Chip, Wordmark, Meter, EmptyState } from '../components/ui/Primitives.jsx';
import { Icon } from '../components/ui/Icon.jsx';
import { ClubCrest } from '../components/ui/ClubCrest.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { usePageTitle } from '../hooks/usePageTitle.js';
import { MESSAGES } from '../data/messages.js';
import Squad from '../components/hq/Squad.jsx';
import Tactics from '../components/hq/Tactics.jsx';
import Fixtures from '../components/hq/Fixtures.jsx';
import { Training, Recruitment, Office, Notebook, Project } from '../components/hq/Preparation.jsx';
const NAV = [['overview', 'home', 'Overview'], ['squad', 'squad', 'Squad'], ['tactics', 'tactics', 'Tactics'], ['training', 'training', 'Training'], ['schedule', 'calendar', 'Fixtures'], ['recruitment', 'search', 'Recruitment'], ['office', 'mail', 'Office'], ['project', 'flag', 'Club project'], ['notebook', 'book', 'Notebook']];
const HEADINGS = {
  overview: ['Welcome to the touchline.', 'A new week. A clear purpose. Let’s get your club ready.'],
  squad: ['The people behind the badge.', 'Get to know your squad. Find the right role for every player.'],
  tactics: ['Your football, on the board.', 'Build a shape. Give everyone a purpose.'],
  training: ['Make the week count.', 'The work behind the moments that matter.'],
  schedule: ['The road ahead.', 'Your preparation starts with knowing what comes next.'],
  recruitment: ['Find your next difference-maker.', 'A name, a profile, a possibility. Build your personal shortlist.'],
  office: ['From around the club.', 'Your staff, your plans and the conversations that matter.'],
  project: ['Build something that lasts.', 'A shared identity starts with a few clear decisions.'],
  notebook: ['A place for your next idea.', 'The observations you want to come back to.']
};
function Overview({
  career,
  club,
  squad,
  fixtures,
  workspace,
  tactics,
  settings,
  unread,
  onBriefing
}) {
  const readiness = getReadiness(workspace),
    project = PROJECTS.find(p => p.id === career.project) || PROJECTS[3],
    condition = Math.round(squad.reduce((n, p) => n + p.fitness, 0) / squad.length);
  const checks = [['tactics', 'Set your starting eleven', workspace.tactics ? 'Lineup and instructions confirmed' : 'Give your football a clear shape', Boolean(workspace.tactics)], ['training', 'Plan the training week', workspace.sessions ? 'Your six-day programme is ready' : 'Balance the work and recovery', Boolean(workspace.sessions)], ['schedule', 'Know your next opponent', workspace.reviewedFixtures?.length ? 'Opponent briefing reviewed' : 'Open a fixture and review the brief', Boolean(workspace.reviewedFixtures?.length)], ['briefing', 'Sign off your preparation', workspace.briefingComplete ? 'Your preparation is signed off' : 'Bring the plan together', Boolean(workspace.briefingComplete)]];
  return <div className="overview-grid">
<div className="stack">
<section className="hq-welcome">
<img src={ENV.managerOffice} alt="Your office overlooking the stadium" />
<span className="hero-coordinate">THE WORK STARTS HERE / 01</span>
<div className="hq-welcome-content">
<p className="eyebrow">{club.name} · A new era</p>
<h2>Make this<br />
<span className="accent">your kind of club.</span>
</h2>
<p>Good to have you here, {career.managerName?.split(' ')[0] || 'manager'}. Your first week starts with a plan.</p>
<Link to="?s=tactics" className="btn btn-primary btn-sm">Shape your football <Icon name="arrow" size={15} />
</Link>
</div>
</section>
    <div className="stat-grid" style={{
        margin: 0
      }}>{[['squad', 'First-team squad', squad.length, 'Players to get to know', null], ['bolt', 'Squad condition', condition + '%', 'Ready for the work', condition], ['tactics', 'Your formation', tactics.formation, tactics.mentality + ' mentality', null], ['search', 'On your shortlist', workspace.shortlist?.length || 0, 'Profiles worth a second look', null]].map(([icon, label, value, desc, meter]) => <div className="stat-card" key={label}>
<span>
<Icon name={icon} size={12} />{label}</span>
<strong className="mono">{value}</strong>
<small>{desc}</small>{meter && <Meter value={meter} label={label} />}</div>)}</div>
    <section className="panel">
<header className="panel-heading">
<h2>Your first conversations</h2>
<Link to="?s=office">{unread} unread <Icon name="arrow" size={13} />
</Link>
</header>
<div className="inbox-preview">{MESSAGES.slice(0, 3).map(m => <Link className="inbox-row" to="?s=office" key={m.id}>
<span className="inbox-avatar">{m.initials}</span>
<span>
<strong>{m.title}</strong>
<small>{m.from} · Today in your career</small>
</span>{!workspace.readMessages?.includes(m.id) && <span className="unread-dot" />}</Link>)}</div>
</section>
    <section className="panel training-summary">
<div className="row-between">
<div>
<p className="eyebrow" style={{
              fontSize: 8,
              marginBottom: 6
            }}>The week’s work</p>
<h2>Preparation, with purpose.</h2>
</div>
<Link to="?s=training" className="text-button">Plan the week <Icon name="arrow" size={13} />
</Link>
</div>
<div className="week-strip">{['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((d, i) => <div key={d} className={'week-day ' + (i === 5 ? 'match-day' : '')}>
<small>{d}</small>
<strong>{String(6 + i).padStart(2, '0')}</strong>
<span className="day-dot" style={{
              background: i === 6 ? 'var(--subtle)' : undefined
            }} />
</div>)}</div>
<div className="row-between">
<span className="tiny muted">
<Icon name="training" size={13} /> {workspace.sessions ? 'Training programme confirmed' : 'A fresh week to shape'}</span>
<Chip tone="accent">Saturday · Match briefing</Chip>
</div>
</section>
</div>
    <div className="stack">
<NextMatch fixture={fixtures[0]} club={club} settings={settings} onBriefing={onBriefing} />
    {settings.preparationReminders && <section className="panel">
<header className="panel-heading">
<h2>Your preparation</h2>
<Chip tone="accent">{readiness}%</Chip>
</header>
<div className="preparation-list">{checks.map(([section, label, desc, done]) => section === 'briefing' ? <button className={'prep-item ' + (done ? 'complete' : '')} key={label} onClick={() => onBriefing(fixtures[0])}>
<span className="prep-check">
<Icon name={done ? 'check' : 'plus'} size={12} />
</span>
<span>
<strong>{label}</strong>
<small>{desc}</small>
</span>
<Icon name="chevron" size={14} />
</button> : <Link className={'prep-item ' + (done ? 'complete' : '')} to={'?s=' + section} key={label}>
<span className="prep-check">
<Icon name={done ? 'check' : 'plus'} size={12} />
</span>
<span>
<strong>{label}</strong>
<small>{desc}</small>
</span>
<Icon name="chevron" size={14} />
</Link>)}</div>
</section>}
    <section className="panel panel-body">
<p className="eyebrow" style={{
          fontSize: 8
        }}>Your club project</p>
<div className="row" style={{
          marginTop: 18
        }}>
<Icon name={project.icon} size={28} className="accent" />
<div>
<h3>{project.label}</h3>
<p className="tiny muted" style={{
              marginTop: 7
            }}>{project.desc}</p>
</div>
</div>
<Link to="?s=project" className="text-button" style={{
          marginTop: 22
        }}>Build your foundations <Icon name="arrow" size={13} />
</Link>
</section>
</div>
</div>;
}
function NextMatch({
  fixture,
  club,
  settings,
  onBriefing
}) {
  const opponent = CLUBS.find(c => c.id === fixture.opponentId);
  return <section className="panel next-match">
<div className="row-between">
<p className="eyebrow">Your next fixture</p>
<Chip tone="accent">Pre-season friendly</Chip>
</div>
<div className="match-clubs">
<div className="match-team">
<ClubCrest club={fixture.home ? club : opponent} size={55} />
<strong>{(fixture.home ? club : opponent).shortName}</strong>
</div>
<div className="match-versus">VS<small>{fixture.time}</small>
</div>
<div className="match-team">
<ClubCrest club={fixture.home ? opponent : club} size={55} />
<strong>{(fixture.home ? opponent : club).shortName}</strong>
</div>
</div>
<div className="match-details">
<span>{formatDate(fixture.date, settings, {
          weekday: 'long',
          year: 'numeric'
        })}</span>
<span className="row" style={{
        gap: 5
      }}>
<Icon name="pin" size={12} />{fixture.home ? club.stadium || club.name + ' home ground' : opponent.stadium || opponent.name + ' home ground'}</span>
</div>
<Button variant="secondary" endIcon="arrow" onClick={() => onBriefing(fixture)}>Open match briefing</Button>
</section>;
}
export default function Headquarters() {
  const {
      id
    } = useParams(),
    [params] = useSearchParams(),
    {
      careers,
      openCareer,
      updateWorkspace,
      settings,
      storageError
    } = useGame();
  const career = careers.find(c => c.id === id),
    club = CLUBS.find(c => c.id === career?.clubId),
    league = LEAGUES.find(l => l.id === club?.leagueId);
  const valid = Boolean(career && club);
  const squad = club ? makeSquad(club.id) : [],
    fixtures = club ? makeFixtures(club) : [];
  const sidebarRef = useRef(null),
    menuButtonRef = useRef(null);
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width:760px)').matches);
  const [sidebarOpen, setSidebarOpen] = useState(false),
    [profile, setProfile] = useState(null),
    [briefing, setBriefing] = useState(null),
    [toast, setToast] = useState('');
  usePageTitle(career?.clubName || 'Headquarters');
  useEffect(() => {
    if (valid) openCareer(id);
  }, [valid, id, openCareer]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 3500);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    const handler = e => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
  useEffect(() => {
    const media = window.matchMedia('(max-width:760px)');
    const handler = e => setMobile(e.matches);
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);
  useEffect(() => {
    if (!mobile || !sidebarOpen) return;
    const nav = sidebarRef.current;
    const focusables = () => [...nav.querySelectorAll('a[href],button:not(:disabled)')];
    focusables()[0]?.focus();
    const trap = e => {
      if (e.key !== 'Tab') return;
      const items = focusables(),
        first = items[0],
        last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    nav.addEventListener('keydown', trap);
    return () => {
      nav.removeEventListener('keydown', trap);
      menuButtonRef.current?.focus();
    };
  }, [mobile, sidebarOpen]);
  if (!valid) return <main>
<div className="page-topbar">
<Link to="/menu">
<Wordmark small />
</Link>
</div>
<EmptyState icon="folder" title="Let’s find your career." description="This career could not be found. Your saved stories are in the career library." action={<Link className="btn btn-primary" to="/careers">Open career library</Link>} />
</main>;
  const workspace = career.workspace || {},
    tactics = getTactics(workspace, squad, settings.selectionPriority),
    avatar = getAvatarById(career.avatarId);
  const section = NAV.some(n => n[0] === params.get('s')) ? params.get('s') : 'overview',
    title = HEADINGS[section];
  const unread = MESSAGES.filter(m => !workspace.readMessages?.includes(m.id)).length;
  const update = patch => updateWorkspace(id, patch),
    notify = message => setToast(message);
  const required = settings.difficulty === 'relaxed' ? 0 : settings.difficulty === 'demanding' ? 3 : 2;
  const preparationChecks = [Boolean(workspace.tactics), Boolean(workspace.sessions), Boolean(briefing && workspace.reviewedFixtures?.includes(briefing.id))].filter(Boolean).length;
  const opponent = briefing ? CLUBS.find(c => c.id === briefing.opponentId) : null;
  const opponentSquad = opponent ? makeSquad(opponent.id) : [],
    threat = opponentSquad.toSorted((a, b) => b.shooting - a.shooting)[0];
  const props = {
    career,
    club,
    squad,
    fixtures,
    workspace,
    tactics,
    settings,
    update,
    notify,
    onPlayer: setProfile,
    onBriefing: setBriefing,
    unread
  };
  return <div className="hq-shell">
<button type="button" className={'mobile-sidebar-overlay ' + (sidebarOpen ? 'open' : '')} aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />
<aside ref={sidebarRef} inert={mobile && !sidebarOpen ? true : undefined} aria-hidden={mobile && !sidebarOpen ? true : undefined} className={'hq-sidebar ' + (sidebarOpen ? 'open' : '')} aria-label="Club navigation">
<div className="sidebar-brand">
<Link to="/menu" aria-label="SIDELINE main menu">
<Wordmark />
</Link>
</div>
<div className="sidebar-club">
<ClubCrest club={club} size={37} />
<div>
<strong>{club.shortName}</strong>
<small>{league.name}</small>
</div>
</div>
<p className="sidebar-label">Your headquarters</p>
<nav className="hq-nav">{NAV.map(([key, icon, label]) => <Link key={key} to={'?s=' + key} className={section === key ? 'active' : ''} aria-current={section === key ? 'page' : undefined} onClick={() => setSidebarOpen(false)}>
<Icon name={icon} size={18} />{label}{key === 'office' && unread > 0 && <span className="nav-count">{unread}</span>}</Link>)}</nav>
<div className="sidebar-bottom">
<div className="row-between">
<Link to={'/settings?back=' + encodeURIComponent('/hq/' + id + '?s=' + section)} className="text-button">
<Icon name="settings" size={16} /> Settings</Link>
<Link to="/menu" className="icon-button" aria-label="Return to main menu">
<Icon name="logout" size={15} />
</Link>
</div>
<div className="sidebar-manager">
<img src={avatar.src} alt="" />
<div>
<strong>{career.managerName || 'Your manager'}</strong>
<small>First-team manager</small>
</div>
</div>
</div>
</aside>
    <div className="hq-main" inert={mobile && sidebarOpen ? true : undefined}>
<header className="hq-topbar">
<button ref={menuButtonRef} className="icon-button mobile-nav-button" aria-label="Open club navigation" aria-expanded={sidebarOpen} onClick={() => setSidebarOpen(!sidebarOpen)}>
<Icon name="menu" size={18} />
</button>
<div className="hq-breadcrumb">
<span>{club.shortName}</span>
<Icon name="chevron" size={11} />
<strong>{NAV.find(n => n[0] === section)[2]}</strong>
</div>
<div className="row" style={{
          marginLeft: 'auto'
        }}>
<div className="game-date">
<strong>Monday, 06 July 2026</strong>
<small>Pre-season · Week 01</small>
</div>
<Button size="sm" endIcon="arrow" onClick={() => setBriefing(fixtures[0])}>Preparation room</Button>
</div>
</header>
    <main className="hq-content">
<div className="hq-page-heading">
<div>
<p className="eyebrow">{section === 'overview' ? 'Your headquarters' : NAV.find(n => n[0] === section)[2]}</p>
<h1>{title[0]}</h1>
<p>{title[1]}</p>
</div>
<div className="row">
<Chip tone={storageError ? 'amber' : 'accent'}>
<span className="live-dot" />{storageError ? 'Save needs attention' : 'Saved on this device'}</Chip>
</div>
</div>
<div className="route-enter" key={section}>
      {section === 'overview' && <Overview {...props} />}
      {section === 'squad' && <Squad {...props} />}
      {section === 'tactics' && <Tactics {...props} />}
      {section === 'training' && <Training {...props} />}
      {section === 'schedule' && <Fixtures {...props} />}
      {section === 'recruitment' && <Recruitment {...props} />}
      {section === 'office' && <Office {...props} />}
      {section === 'project' && <Project {...props} />}
      {section === 'notebook' && <Notebook {...props} />}
    </div>
<footer className="hq-footer">
<span>SIDELINE / YOUR CLUB. YOUR STORY.</span>
<span>Fictional squads · Preparation preview · 2026/27</span>
</footer>
</main>
</div>
    <Modal open={Boolean(profile)} onClose={() => setProfile(null)} title="The player behind the number">{profile && <>
<div className="profile-header">
<div className="player-silhouette" style={{
            width: 64,
            height: 74,
            fontSize: 35
          }}>{profile.name.split(' ').map(w => w[0]).join('')}</div>
<div>
<Chip tone="accent">{profile.scouting ? 'Scouting report' : 'First team'}</Chip>
<h3 style={{
              marginTop: 10
            }}>{profile.name}</h3>
<p>{profile.pos} · {profile.age} years old · {profile.nationality}</p>
</div>
</div>
<div className="comparison-grid">{[[profile.scouting && settings.scoutingDetail === 'ranges' ? `${profile.overall - 3}–${profile.overall + 3}` : profile.overall, 'Current ability'], [profile.scouting && settings.scoutingDetail === 'ranges' ? 'Promising' : profile.potential, 'Potential'], [profile.fitness + '%', 'Condition']].map(([v, label]) => <div className="compare-cell" key={label}>
<strong>{v}</strong>
<span>{label}</span>
</div>)}</div>
<div className="attribute-grid">{[['pace', 'Pace'], ['passing', 'Passing'], ['defending', 'Defending'], ['shooting', 'Shooting'], ['technique', 'Technique'], ['composure', 'Composure']].map(([key, label]) => <div className="attribute" key={key}>
<div>
<span>{label}</span>
<strong>{profile.scouting && settings.scoutingDetail === 'ranges' ? `${profile[key] - 4}–${profile[key] + 4}` : profile[key]}</strong>
</div>
<Meter value={profile[key]} label={label} />
</div>)}</div>
<div className="notice">
<Icon name="info" size={15} />
<span>{profile.scouting ? 'An illustrative scouting profile. Estimates help you shape a shortlist before negotiations are available.' : 'A fictional development player. Set your captain here, then assign roles on your tactics board.'}</span>
</div>
<div className="modal-actions">{profile.scouting ? <Button icon={workspace.shortlist?.includes(profile.id) ? 'check' : 'plus'} onClick={() => {
            update(w => ({
              shortlist: w.shortlist?.includes(profile.id) ? w.shortlist.filter(p => p !== profile.id) : [...(w.shortlist || []), profile.id]
            }));
            notify('Scouting shortlist updated.');
          }}>{workspace.shortlist?.includes(profile.id) ? 'Remove from shortlist' : 'Add to shortlist'}</Button> : <Button icon="shield" onClick={() => {
            update({
              captain: profile.id
            });
            notify(profile.lastName + ' is your captain.');
          }}>{workspace.captain === profile.id ? 'Your club captain' : 'Appoint as captain'}</Button>}</div>
</>}</Modal>
    <Modal open={Boolean(briefing)} onClose={() => setBriefing(null)} title="The work before the whistle" maxWidth={680}>{briefing && opponent && <>
<div className="row-between" style={{
          marginBottom: 24
        }}>
<Chip tone="accent">{briefing.type === 'Friendly' ? 'Pre-season friendly' : 'League · Matchweek ' + briefing.round}</Chip>
<span className="tiny muted">{formatDate(briefing.date, settings, {
              year: 'numeric'
            })} · {briefing.time}</span>
</div>
<div className="match-clubs">
<div className="match-team">
<ClubCrest club={briefing.home ? club : opponent} size={60} />
<strong>{(briefing.home ? club : opponent).name}</strong>
</div>
<span className="match-versus">VS</span>
<div className="match-team">
<ClubCrest club={briefing.home ? opponent : club} size={60} />
<strong>{(briefing.home ? opponent : club).name}</strong>
</div>
</div>
<div className="panel panel-body" style={{
          marginBottom: 20
        }}>
<p className="eyebrow">Opponent preparation · Illustrative brief</p>
<h2>{opponent.shortName}</h2>
<p className="small muted" style={{
            marginTop: 12
          }}>{opponent.identity}</p>{settings.matchPresentation === 'extended' && <div className="comparison-grid" style={{
            marginTop: 20
          }}>{[['4-2-3-1', 'Projected shape'], [threat.lastName, 'Player to watch'], ['Transitions', 'Preparation focus']].map(([v, l]) => <div className="compare-cell" key={l}>
<strong>{v}</strong>
<span>{l}</span>
</div>)}</div>}<Button variant="secondary" size="sm" icon={workspace.reviewedFixtures?.includes(briefing.id) ? 'check' : 'eye'} style={{
            marginTop: 20
          }} onClick={() => {
            update(w => ({
              reviewedFixtures: [...new Set([...(w.reviewedFixtures || []), briefing.id])]
            }));
            notify('Opponent briefing marked as reviewed.');
          }}>{workspace.reviewedFixtures?.includes(briefing.id) ? 'Opponent reviewed' : 'Mark opponent as reviewed'}</Button>
</div>
<div className="row-between" style={{
          marginBottom: 15
        }}>
<h3>Your preparation checks</h3>
<Chip tone="accent">{preparationChecks} / 3 complete</Chip>
</div>
<div className="stack-sm" style={{
          marginBottom: 22
        }}>{[['Starting eleven & tactics', Boolean(workspace.tactics)], ['Training week', Boolean(workspace.sessions)], ['Opponent review', Boolean(workspace.reviewedFixtures?.includes(briefing.id))]].map(([label, done]) => <div className="row" key={label}>
<Icon name={done ? 'check' : 'clock'} size={14} className={done ? 'accent' : 'subtle'} />
<span className="small muted">{label}</span>
</div>)}</div>
<label className="field">
<span className="field-label">Your match note</span>
<textarea maxLength={1500} placeholder="What do you want the team to focus on?" value={workspace.fixtureNotes?.[briefing.id] || ''} onChange={e => update(w => ({
            fixtureNotes: {
              ...w.fixtureNotes,
              [briefing.id]: e.target.value
            }
          }))} />
</label>
<div className="modal-actions">
<Button icon="check" disabled={preparationChecks < required} onClick={() => {
            update(w => ({
              briefingComplete: true,
              signedOffFixtures: [...new Set([...(w.signedOffFixtures || []), briefing.id])]
            }));
            notify('Preparation signed off and saved.');
          }}>{workspace.signedOffFixtures?.includes(briefing.id) ? 'Preparation signed off' : 'Sign off preparation'}</Button>
</div>
<p className="tiny muted" style={{
          marginTop: 15
        }}>{preparationChecks < required ? `Complete ${required} of the three checks to sign off under your current preparation preference.` : 'Your plan is saved for matchday. Match simulation is planned; preparation is available now.'}</p>
</>}</Modal>
    {toast && <div className="toast" role="status">
<Icon name="check" size={16} />{toast}</div>}</div>;
}
