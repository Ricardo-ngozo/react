import { useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useGame } from '../context/useGame.js';
import { AVATARS, DEFAULT_AVATAR_ID, getAvatarById } from '../data/assets.js';
import { CLUBS, LEAGUES } from '../data/clubs.js';
import { JOURNEYS, PHILOSOPHIES, PROJECTS } from '../data/football.js';
import { Button, Chip, Field, Wordmark } from '../components/ui/Primitives.jsx';
import { Icon } from '../components/ui/Icon.jsx';
import { ClubCrest } from '../components/ui/ClubCrest.jsx';
import { ClubBrowser } from '../components/ClubBrowser.jsx';
import { usePageTitle } from '../hooks/usePageTitle.js';
const STEPS = [['Your manager', 'Make the introduction'], ['Your journey', 'Choose your story'], ['Your philosophy', 'Define your football'], ['Your club', 'Find your place'], ['Your vision', 'Make it official']];
export default function CareerSetup({
  quick = false
}) {
  const navigate = useNavigate(),
    {
      step: param
    } = useParams(),
    {
      careerDraft,
      updateDraft,
      saveCareer
    } = useGame();
  const [quickStep, setQuickStep] = useState(1);
  const step = quick ? quickStep : Number(param);
  const draft = careerDraft || {},
    selectedClub = CLUBS.find(c => c.id === draft.clubId);
  usePageTitle(quick ? 'Quick start' : 'Create your career');
  const managerName = draft.managerName || [draft.firstName, draft.surname].filter(Boolean).join(' ');
  const validManager = quick ? Boolean(draft.managerName?.trim()) : Boolean(draft.firstName?.trim() && draft.surname?.trim());
  const effectiveStep = quick ? {
    1: 1,
    2: 4,
    3: 5
  }[step] : step;
  const go = n => quick ? setQuickStep(n) : navigate('/career/setup/' + n);
  const ready = effectiveStep === 1 ? validManager : effectiveStep === 2 ? Boolean(draft.journey) : effectiveStep === 3 ? Boolean(draft.philosophy) : effectiveStep === 4 ? Boolean(selectedClub) : Boolean(selectedClub && (draft.project || quick));
  const confirm = () => {
    if (!validManager || !selectedClub) return;
    const career = {
      ...draft,
      id: crypto.randomUUID(),
      name: `${managerName.trim()} at ${selectedClub.name}`,
      managerName: managerName.trim(),
      clubId: selectedClub.id,
      clubName: selectedClub.name,
      avatarId: draft.avatarId || DEFAULT_AVATAR_ID,
      nationality: draft.nationality || 'South African',
      background: draft.background || 'Former player',
      journey: draft.journey || 'blank',
      philosophy: draft.philosophy || 'balanced',
      project: draft.project || 'community',
      setupType: quick ? 'quick' : 'custom',
      workspace: {}
    };
    saveCareer(career);
    updateDraft({
      completed: true
    });
    navigate('/appointment/' + career.id, {
      replace: true
    });
  };
  if (!quick && (!Number.isInteger(step) || step < 1 || step > 5)) return <Navigate to="/career/setup/1" replace />;
  if (effectiveStep > 1 && !validManager) return <Navigate to={quick ? '/career/new' : '/career/setup/1'} replace />;
  const choices = effectiveStep === 2 ? JOURNEYS : effectiveStep === 3 ? PHILOSOPHIES : PROJECTS;
  const choiceKey = effectiveStep === 2 ? 'journey' : effectiveStep === 3 ? 'philosophy' : 'project';
  const currentTitle = {
    1: 'Introduce yourself.',
    2: 'What’s your story?',
    3: 'How will you play?',
    4: 'Find where you belong.',
    5: 'This is your club now.'
  }[effectiveStep];
  const currentDesc = {
    1: 'Every club needs someone to believe in. Let’s start with you.',
    2: 'Choose a starting point for the story you want to tell.',
    3: 'Your philosophy is the foundation. Your tactics will bring it to life.',
    4: 'A familiar badge or a new challenge. There’s a story waiting at every club.',
    5: 'Review your details and choose what you want to build.'
  }[effectiveStep];
  const stepList = quick ? [STEPS[0], STEPS[3], STEPS[4]] : STEPS;
  return <main>
<header className="page-topbar">
<Link to="/career/new" className="back-link">
<Icon name="back" size={16} /> Career options</Link>
<Link to="/menu">
<Wordmark small />
</Link>
<Chip>{quick ? 'Quick start' : 'Custom career'}</Chip>
</header>
<div className="setup-layout">
<aside className="setup-side">
<p className="eyebrow">A new beginning</p>
<h2>Your next chapter.</h2>
<p className="small muted" style={{
          marginTop: 14
        }}>Build a club. Shape its identity.<br />Leave your mark.</p>
<nav className="setup-steps" aria-label="Career setup progress">{stepList.map(([label, desc], i) => <div className={`setup-step ${step === i + 1 ? 'active' : step > i + 1 ? 'complete' : ''}`} key={label} aria-current={step === i + 1 ? 'step' : undefined}>
<span className="step-circle">{step > i + 1 ? <Icon name="check" size={12} /> : String(i + 1).padStart(2, '0')}</span>
<span>{label}<small>{desc}</small>
</span>
</div>)}</nav>
</aside>
    <section className="setup-form" key={step}>
<p className="eyebrow">Step {String(step).padStart(2, '0')} / {quick ? '03' : '05'}</p>
<h1>{currentTitle}</h1>
<p className="page-description">{currentDesc}</p>
    {effectiveStep === 1 && <>
<div className="row-between" style={{
            marginBottom: 12
          }}>
<span className="field-label">Choose your portrait</span>
<span className="tiny muted">{AVATARS.length} appearances</span>
</div>
<div className="portrait-picker">{AVATARS.map(a => <button type="button" className="portrait-option" key={a.id} aria-label={a.label} title={a.label} aria-pressed={(draft.avatarId || DEFAULT_AVATAR_ID) === a.id} onClick={() => updateDraft({
              avatarId: a.id
            })}>
<img src={a.src} alt={a.label} />{(draft.avatarId || DEFAULT_AVATAR_ID) === a.id && <span className="portrait-check">
<Icon name="check" size={12} />
</span>}</button>)}</div>
<div className="form-grid">{quick ? <Field label="Manager name" className="full">
<input autoComplete="off" maxLength={50} placeholder="Your name on the touchline" value={draft.managerName || ''} onChange={e => updateDraft({
                managerName: e.target.value
              })} />
</Field> : <>
<Field label="First name">
<input autoComplete="given-name" maxLength={30} placeholder="Alex" value={draft.firstName || ''} onChange={e => updateDraft({
                  firstName: e.target.value,
                  managerName: ''
                })} />
</Field>
<Field label="Surname">
<input autoComplete="family-name" maxLength={30} placeholder="Morgan" value={draft.surname || ''} onChange={e => updateDraft({
                  surname: e.target.value,
                  managerName: ''
                })} />
</Field>
</>}<Field label="Nationality">
<select value={draft.nationality || 'South African'} onChange={e => updateDraft({
                nationality: e.target.value
              })}>{['South African', 'English', 'Spanish', 'German', 'Italian', 'French', 'Portuguese', 'Brazilian', 'Argentine', 'Nigerian', 'Ghanaian', 'Dutch', 'Scottish', 'Irish', 'Other'].map(n => <option key={n}>{n}</option>)}</select>
</Field>
<Field label="Your background">
<select value={draft.background || 'Former player'} onChange={e => updateDraft({
                background: e.target.value
              })}>{['Former player', 'Youth coach', 'Tactical analyst', 'Assistant manager', 'New to management'].map(n => <option key={n}>{n}</option>)}</select>
</Field>
</div>
</>}
    {(effectiveStep === 2 || effectiveStep === 3) && <div className="selection-grid">{choices.map(c => <button className="selection-card" key={c.id} aria-pressed={draft[choiceKey] === c.id} onClick={() => updateDraft({
            [choiceKey]: c.id
          })}>
<Icon name={c.icon} size={23} />
<div>
<h3>{c.label}</h3>
<p>{c.desc}</p>
</div>
</button>)}</div>}
    {effectiveStep === 4 && <ClubBrowser compact selectedId={draft.clubId} onSelect={club => updateDraft({
          clubId: club.id,
          clubName: club.name
        })} />}
    {effectiveStep === 5 && <>
<div className="selected-summary">
<img src={getAvatarById(draft.avatarId).src} alt="Your selected manager" />
<div>
<Chip tone="accent">Your appointment</Chip>
<h2 style={{
                marginTop: 12
              }}>{managerName}</h2>
<p className="small muted" style={{
                marginTop: 7
              }}>{draft.nationality || 'South African'} · {draft.background || 'Former player'}</p>
</div>
<div className="spacer" />
<ClubCrest club={selectedClub} size={50} />
</div>
<div className="review-lines" style={{
            marginBottom: 28
          }}>{[['Club', selectedClub?.name || 'Choose a club'], ['Competition', LEAGUES.find(l => l.id === selectedClub?.leagueId)?.name], ['Philosophy', PHILOSOPHIES.find(p => p.id === draft.philosophy)?.label || 'Balanced approach']].map(([k, v]) => <div key={k}>
<span>{k}</span>
<span>{v}</span>
</div>)}</div>
<p className="field-label" style={{
            marginBottom: 14
          }}>What do you want to build?</p>
<div className="selection-grid">{PROJECTS.map(c => <button className="selection-card" key={c.id} aria-pressed={(draft.project || (quick ? 'community' : '')) === c.id} onClick={() => updateDraft({
              project: c.id
            })}>
<Icon name={c.icon} />
<div>
<h3>{c.label}</h3>
<p>{c.desc}</p>
</div>
</button>)}</div>
</>}
    <div className="setup-actions">
<Button variant="ghost" icon="back" onClick={() => step === 1 ? navigate('/career/new') : go(step - 1)}>Back</Button>
<span className="tiny subtle">Draft saved on this device</span>
<Button endIcon="arrow" disabled={!ready} onClick={() => step === (quick ? 3 : 5) ? confirm() : go(step + 1)}>{step === (quick ? 3 : 5) ? 'Confirm appointment' : 'Continue'}</Button>
</div>
</section>
</div>
</main>;
}
