import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { tokens } from '../styles/tokens.js';
import { useGame } from '../context/useGame.js';
import { Button } from '../components/ui/Button.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Input, Select } from '../components/ui/Input.jsx';
import { CLUBS, LEAGUES, COUNTRIES, getLeaguesByCountry, getClubsByLeague } from '../data/clubs.js';
import { ClubCrest } from '../components/ui/ClubCrest.jsx';

const TOTAL_STEPS = 5;

const NATIONALITIES = [
  'Argentine','Australian','Belgian','Brazilian','Colombian','Croatian','Dutch',
  'English','French','German','Ghanaian','Irish','Italian','Japanese','Mexican',
  'Nigerian','Norwegian','Portuguese','Scottish','Senegalese','South African',
  'Spanish','Swedish','Swiss','Uruguayan','Welsh','Other',
];

const JOURNEYS = [
  {
    id: 'underdog',
    label: 'The Underdog',
    emoji: '🌱',
    desc: 'Take a smaller club and build something extraordinary from nothing.',
    color: '#00CC66',
  },
  {
    id: 'rebuild',
    label: 'The Rebuild',
    emoji: '🔨',
    desc: 'Restore a struggling club\'s identity and return them to former glory.',
    color: '#FF8800',
  },
  {
    id: 'contender',
    label: 'The Contender',
    emoji: '🏆',
    desc: 'Take an ambitious club to the very next level.',
    color: tokens.accent,
  },
  {
    id: 'blank',
    label: 'Blank Canvas',
    emoji: '✏️',
    desc: 'Build your own managerial story without a predefined narrative.',
    color: '#888',
  },
];

const PHILOSOPHIES = [
  { id: 'attacking', label: 'Attacking Football', emoji: '⚡', desc: 'Goals, excitement, and relentless offensive pressure. The beautiful game at its finest.' },
  { id: 'possession', label: 'Possession Football', emoji: '🔄', desc: 'Control the match through the ball. Patience, movement, and technical excellence.' },
  { id: 'defensive', label: 'Defensive Organisation', emoji: '🛡️', desc: 'Built on structure and discipline. Hard to beat, clinical when it matters most.' },
  { id: 'counter', label: 'Counterattacking', emoji: '🏹', desc: 'Absorb pressure, then strike fast. Efficiency and deadly transition football.' },
  { id: 'youth', label: 'Youth Development', emoji: '🌟', desc: 'Trust young talent. Build from within and shape the next generation of footballers.' },
  { id: 'balanced', label: 'Balanced Approach', emoji: '⚖️', desc: 'Adaptable, pragmatic, and effective. The right approach for every situation.' },
];

const PROJECTS = [
  { id: 'youth', label: 'Youth Revolution', emoji: '🌱', desc: 'Build a club around young talent and become football\'s finest development club.' },
  { id: 'attacking', label: 'Beautiful Football', emoji: '⚡', desc: 'Create an iconic attacking team that fans never want to stop watching.' },
  { id: 'defensive', label: 'Defensive Dynasty', emoji: '🛡️', desc: 'Build the most disciplined, hard-to-beat team in the league.' },
  { id: 'community', label: 'Club of the People', emoji: '❤️', desc: 'Create a club deeply connected to its supporters and local community.' },
  { id: 'financial', label: 'Sustainable Model', emoji: '📊', desc: 'Build a financially responsible club that grows steadily and sustainably.' },
  { id: 'continental', label: 'Continental Powerhouse', emoji: '🌍', desc: 'Turn this club into a dominant force on the continental stage.' },
];

function StepHeader({ step, onBack }) {
  const navigate = useNavigate();
  return (
    <header style={{
      borderBottom: `1px solid ${tokens.border}`,
      padding: '0 clamp(16px, 4vw, 40px)',
      height: 56,
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      background: tokens.bg,
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      <button onClick={onBack || (() => navigate(-1))} style={{
        background: 'none', border: 'none', color: tokens.muted, cursor: 'pointer',
        fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: tokens.font,
      }}>← Back</button>
      <span style={{ color: tokens.border }}>|</span>
      <span style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: tokens.muted, flex: 1 }}>
        Custom Career · Step {step} of {TOTAL_STEPS}
      </span>
      <div style={{ display: 'flex', gap: 5 }}>
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div key={i} style={{
            width: 28, height: 3, borderRadius: 2,
            background: i < step ? tokens.accent : tokens.border,
            transition: `background ${tokens.transition.base}`,
          }} />
        ))}
      </div>
    </header>
  );
}

// Step 1 — Create Your Manager
function Step1({ draft, update, onNext }) {
  const [firstName, setFirstName] = useState(draft.firstName || '');
  const [surname, setSurname] = useState(draft.surname || '');
  const [nationality, setNationality] = useState(draft.nationality || '');
  const [background, setBackground] = useState(draft.background || 'Former Player');

  const backgrounds = ['Former Player', 'Youth Coach', 'Tactical Analyst', 'Assistant Manager', 'No Experience'];

  const handleNext = () => {
    update({ firstName, surname, managerName: `${firstName} ${surname}`, nationality, background });
    onNext();
  };

  return (
    <div>
      <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: tokens.accent, fontWeight: 700, marginBottom: 10 }}>Step 1 of 5</p>
      <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: 'clamp(28px, 5vw, 46px)', fontWeight: 900, marginBottom: 8 }}>
        Create your manager
      </h1>
      <p style={{ color: tokens.muted, fontSize: 14, marginBottom: 40, lineHeight: 1.6 }}>
        Who are you? Define your managerial identity before taking charge.
      </p>

      {/* Live preview */}
      <div style={{
        padding: '20px 24px',
        background: tokens.surface,
        border: `1px solid ${tokens.border}`,
        borderRadius: tokens.radius.xl,
        marginBottom: 32,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}>
        <div style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: tokens.accentDim,
          border: `2px solid ${tokens.accentBorder}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
          flexShrink: 0,
        }}>
          {firstName ? firstName[0].toUpperCase() : '?'}
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: firstName || surname ? tokens.text : tokens.muted, fontFamily: tokens.fontDisplay }}>
            {firstName || surname ? `${firstName} ${surname}`.trim() : 'Your Manager'}
          </div>
          <div style={{ fontSize: 12, color: tokens.muted, marginTop: 2 }}>
            {nationality || 'Nationality'} · {background}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <Input label="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="e.g. Alex" autoFocus />
        <Input label="Surname" value={surname} onChange={e => setSurname(e.target.value)} placeholder="e.g. Morgan" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
        <Select
          label="Nationality"
          value={nationality}
          onChange={e => setNationality(e.target.value)}
          options={[{ value: '', label: 'Select nationality...' }, ...NATIONALITIES.map(n => ({ value: n, label: n }))]}
        />
        <Select
          label="Management Background"
          value={background}
          onChange={e => setBackground(e.target.value)}
          options={backgrounds.map(b => ({ value: b, label: b }))}
        />
      </div>

      <Button onClick={handleNext} disabled={!firstName.trim() || !surname.trim()} size="lg">
        Continue →
      </Button>
    </div>
  );
}

// Step 2 — Choose Journey
function Step2({ draft, update, onNext, onBack }) {
  const [selected, setSelected] = useState(draft.journey || '');

  return (
    <div>
      <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: tokens.accent, fontWeight: 700, marginBottom: 10 }}>Step 2 of 5</p>
      <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: 'clamp(28px, 5vw, 46px)', fontWeight: 900, marginBottom: 8 }}>
        Choose your journey
      </h1>
      <p style={{ color: tokens.muted, fontSize: 14, marginBottom: 32, lineHeight: 1.6 }}>
        Every manager has a story. Which path defines yours?
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 12, marginBottom: 32 }}>
        {JOURNEYS.map(j => (
          <Card
            key={j.id}
            onClick={() => setSelected(j.id)}
            selected={selected === j.id}
            style={{ padding: 20 }}
          >
            <div style={{ fontSize: 28, marginBottom: 10 }}>{j.emoji}</div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, color: selected === j.id ? j.color : tokens.text }}>{j.label}</div>
            <div style={{ fontSize: 12, color: tokens.muted, lineHeight: 1.6 }}>{j.desc}</div>
          </Card>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <Button variant="ghost" onClick={onBack}>← Back</Button>
        <Button onClick={() => { update({ journey: selected }); onNext(); }} disabled={!selected} size="lg">Continue →</Button>
      </div>
    </div>
  );
}

// Step 3 — Philosophy
function Step3({ draft, update, onNext, onBack }) {
  const [selected, setSelected] = useState(draft.philosophy || '');

  return (
    <div>
      <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: tokens.accent, fontWeight: 700, marginBottom: 10 }}>Step 3 of 5</p>
      <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: 'clamp(28px, 5vw, 46px)', fontWeight: 900, marginBottom: 8 }}>
        Your football philosophy
      </h1>
      <p style={{ color: tokens.muted, fontSize: 14, marginBottom: 32, lineHeight: 1.6 }}>
        How do you want your team to play? This defines your identity as a manager.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 10, marginBottom: 32 }}>
        {PHILOSOPHIES.map(p => (
          <button
            key={p.id}
            onClick={() => setSelected(p.id)}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 14,
              padding: '16px 18px',
              background: selected === p.id ? tokens.accentDim : tokens.surface,
              border: `1px solid ${selected === p.id ? tokens.accent : tokens.border}`,
              borderRadius: tokens.radius.lg,
              cursor: 'pointer',
              textAlign: 'left',
              transition: `all ${tokens.transition.base}`,
              fontFamily: tokens.font,
            }}
          >
            <span style={{ fontSize: 22, flexShrink: 0 }}>{p.emoji}</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, color: selected === p.id ? tokens.accent : tokens.text }}>{p.label}</div>
              <div style={{ fontSize: 11, color: tokens.muted, lineHeight: 1.5 }}>{p.desc}</div>
            </div>
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <Button variant="ghost" onClick={onBack}>← Back</Button>
        <Button onClick={() => { update({ philosophy: selected }); onNext(); }} disabled={!selected} size="lg">Continue →</Button>
      </div>
    </div>
  );
}

// Step 4 — Choose Club (World)
function Step4({ draft, update, onNext, onBack }) {
  const [countryId, setCountryId] = useState(draft.countryId || '');
  const [leagueId, setLeagueId] = useState(draft.leagueId || '');
  const [clubId, setClubId] = useState(draft.clubId || '');
  const [search, setSearch] = useState('');

  const leagues = countryId ? getLeaguesByCountry(countryId) : LEAGUES;
  const clubs = leagueId ? getClubsByLeague(leagueId) : (countryId ? CLUBS.filter(c => c.countryId === countryId) : CLUBS);
  const filtered = clubs.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()));
  const selectedClub = CLUBS.find(c => c.id === clubId);

  return (
    <div>
      <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: tokens.accent, fontWeight: 700, marginBottom: 10 }}>Step 4 of 5</p>
      <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: 'clamp(28px, 5vw, 46px)', fontWeight: 900, marginBottom: 8 }}>
        Choose your world
      </h1>
      <p style={{ color: tokens.muted, fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
        Select the club you'll be taking charge of.
      </p>

      {/* Filters */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <Select
          label="Country"
          value={countryId}
          onChange={e => { setCountryId(e.target.value); setLeagueId(''); setClubId(''); }}
          options={[
            { value: '', label: 'All Countries' },
            ...COUNTRIES.map(c => ({ value: c.id, label: `${c.flag} ${c.name}` }))
          ]}
        />
        <Select
          label="League"
          value={leagueId}
          onChange={e => { setLeagueId(e.target.value); setClubId(''); }}
          options={[
            { value: '', label: 'All Leagues' },
            ...leagues.map(l => ({ value: l.id, label: l.name }))
          ]}
        />
      </div>
      <Input
        placeholder="Search clubs..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: 12 }}
      />

      {/* Club list */}
      <div style={{
        maxHeight: 300,
        overflowY: 'auto',
        border: `1px solid ${tokens.border}`,
        borderRadius: tokens.radius.lg,
        padding: 6,
        marginBottom: 16,
      }}>
        {filtered.map(club => {
          const lg = LEAGUES.find(l => l.id === club.leagueId);
          return (
            <button
              key={club.id}
              onClick={() => setClubId(club.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                background: clubId === club.id ? `${club.color}18` : 'transparent',
                border: `1px solid ${clubId === club.id ? club.color : 'transparent'}`,
                borderRadius: tokens.radius.md,
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
                fontFamily: tokens.font,
                transition: `all ${tokens.transition.fast}`,
                marginBottom: 2,
              }}
              onMouseEnter={e => { if (clubId !== club.id) e.currentTarget.style.background = tokens.surface; }}
              onMouseLeave={e => { if (clubId !== club.id) e.currentTarget.style.background = 'transparent'; }}
            >
              <ClubCrest club={club} size={32} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: tokens.text }}>{club.name}</div>
                <div style={{ fontSize: 10, color: tokens.muted }}>{lg?.name} · {club.location}</div>
              </div>
              {clubId === club.id && <span style={{ color: tokens.accent, fontSize: 14 }}>✓</span>}
            </button>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ padding: 24, textAlign: 'center', color: tokens.muted, fontSize: 13 }}>No clubs found</div>
        )}
      </div>

      {selectedClub && (
        <div style={{
          padding: '12px 16px',
          background: `${selectedClub.color}18`,
          border: `1px solid ${selectedClub.color}44`,
          borderRadius: tokens.radius.md,
          fontSize: 13,
          color: tokens.text,
          marginBottom: 20,
        }}>
          Selected: <strong>{selectedClub.name}</strong>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12 }}>
        <Button variant="ghost" onClick={onBack}>← Back</Button>
        <Button onClick={() => { update({ clubId, clubName: selectedClub?.name }); onNext(); }} disabled={!clubId} size="lg">Continue →</Button>
      </div>
    </div>
  );
}

// Step 5 — Review
function Step5({ draft, update, onConfirm, onBack }) {
  const [project, setProject] = useState(draft.project || '');
  const selectedClub = CLUBS.find(c => c.id === draft.clubId);
  const league = selectedClub ? LEAGUES.find(l => l.id === selectedClub.leagueId) : null;

  return (
    <div>
      <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: tokens.accent, fontWeight: 700, marginBottom: 10 }}>Step 5 of 5 — Review</p>
      <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: 'clamp(28px, 5vw, 46px)', fontWeight: 900, marginBottom: 8 }}>
        Your career
      </h1>
      <p style={{ color: tokens.muted, fontSize: 14, marginBottom: 32, lineHeight: 1.6 }}>
        Review your setup and choose your club-building vision before confirming.
      </p>

      {/* Summary */}
      <div style={{
        border: `1px solid ${tokens.border}`,
        borderRadius: tokens.radius.xl,
        overflow: 'hidden',
        marginBottom: 28,
      }}>
        {selectedClub && (
          <div style={{
            padding: 24,
            background: `linear-gradient(135deg, ${selectedClub.color}22, ${selectedClub.color}08)`,
            borderBottom: `3px solid ${selectedClub.color}`,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}>
            <ClubCrest club={selectedClub} size={52} />
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, fontFamily: tokens.fontDisplay }}>{selectedClub.name}</div>
              <div style={{ fontSize: 12, color: tokens.muted }}>{league?.name} · {selectedClub.location}</div>
            </div>
          </div>
        )}
        <div style={{ padding: 20 }}>
          {[
            ['Manager', `${draft.firstName} ${draft.surname}`],
            ['Nationality', draft.nationality || '—'],
            ['Background', draft.background || '—'],
            ['Journey', JOURNEYS.find(j => j.id === draft.journey)?.label || '—'],
            ['Philosophy', PHILOSOPHIES.find(p => p.id === draft.philosophy)?.label || '—'],
          ].map(([k, v]) => (
            <div key={k} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 0',
              borderBottom: `1px solid ${tokens.border}`,
            }}>
              <span style={{ fontSize: 12, color: tokens.muted }}>{k}</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Club project */}
      <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>My Project — What are you building?</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8, marginBottom: 28 }}>
        {PROJECTS.map(p => (
          <button
            key={p.id}
            onClick={() => setProject(p.id)}
            style={{
              padding: '12px 14px',
              background: project === p.id ? tokens.accentDim : tokens.surface,
              border: `1px solid ${project === p.id ? tokens.accent : tokens.border}`,
              borderRadius: tokens.radius.md,
              cursor: 'pointer',
              textAlign: 'left',
              fontFamily: tokens.font,
              transition: `all ${tokens.transition.fast}`,
            }}
          >
            <div style={{ fontSize: 18, marginBottom: 4 }}>{p.emoji}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: project === p.id ? tokens.accent : tokens.text, marginBottom: 3 }}>{p.label}</div>
            <div style={{ fontSize: 10, color: tokens.muted, lineHeight: 1.4 }}>{p.desc}</div>
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <Button variant="ghost" onClick={onBack}>← Back</Button>
        <Button onClick={() => { update({ project }); onConfirm(); }} disabled={!project} size="lg">
          Confirm Appointment →
        </Button>
      </div>
    </div>
  );
}

// Main CareerSetup router
export default function CareerSetup() {
  const navigate = useNavigate();
  const { step: stepParam } = useParams();
  const { updateDraft, careerDraft, saveCareer } = useGame();
  const step = parseInt(stepParam) || 1;
  const draft = careerDraft || {};

  const goToStep = (s) => navigate(`/career/setup/${s}`);

  const handleConfirm = () => {
    const selectedClub = CLUBS.find(c => c.id === draft.clubId);
    const id = `career_${Date.now()}`;
    const career = {
      id,
      name: `${draft.firstName} ${draft.surname} at ${selectedClub?.name}`,
      ...draft,
      confirmedAt: Date.now(),
      setupType: 'custom',
    };
    saveCareer(career);
    navigate(`/appointment/${id}`);
  };

  return (
    <div style={{ minHeight: '100vh', background: tokens.bg }}>
      <StepHeader step={step} onBack={() => step > 1 ? goToStep(step - 1) : navigate('/career/new')} />
      <main style={{ maxWidth: 680, margin: '0 auto', padding: 'clamp(28px, 5vw, 56px) clamp(16px, 4vw, 40px)' }}>
        {step === 1 && <Step1 draft={draft} update={updateDraft} onNext={() => goToStep(2)} />}
        {step === 2 && <Step2 draft={draft} update={updateDraft} onNext={() => goToStep(3)} onBack={() => goToStep(1)} />}
        {step === 3 && <Step3 draft={draft} update={updateDraft} onNext={() => goToStep(4)} onBack={() => goToStep(2)} />}
        {step === 4 && <Step4 draft={draft} update={updateDraft} onNext={() => goToStep(5)} onBack={() => goToStep(3)} />}
        {step === 5 && <Step5 draft={draft} update={updateDraft} onConfirm={handleConfirm} onBack={() => goToStep(4)} />}
      </main>
    </div>
  );
}
