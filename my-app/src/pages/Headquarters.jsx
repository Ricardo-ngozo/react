import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { tokens } from '../styles/tokens.js';
import { useGame } from '../context/useGame.js';
import { CLUBS, LEAGUES } from '../data/clubs.js';
import { ClubCrest } from '../components/ui/ClubCrest.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge, DemoBadge } from '../components/ui/Badge.jsx';
import { Card } from '../components/ui/Card.jsx';
import { ConfirmModal } from '../components/ui/Modal.jsx';

// ── Fictional demo data ──────────────────────────────────────────────────────
const DEMO_PLAYERS = [
  { id: 1, name: 'Marco Delgado', pos: 'GK', age: 26, nat: '🇪🇸', overall: 72, status: 'Active' },
  { id: 2, name: 'Theo Brandt', pos: 'CB', age: 24, nat: '🇩🇪', overall: 69, status: 'Active' },
  { id: 3, name: 'Luis Pereira', pos: 'CB', age: 29, nat: '🇵🇹', overall: 71, status: 'Active' },
  { id: 4, name: 'James Owusu', pos: 'LB', age: 22, nat: '🇬🇭', overall: 67, status: 'Active' },
  { id: 5, name: 'Andrei Popescu', pos: 'RB', age: 25, nat: '🇷🇴', overall: 65, status: 'Active' },
  { id: 6, name: 'Rafa Nunes', pos: 'CM', age: 23, nat: '🇧🇷', overall: 73, status: 'Active' },
  { id: 7, name: 'Callum Walsh', pos: 'CM', age: 20, nat: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', overall: 64, status: 'Active' },
  { id: 8, name: 'Diego Montoya', pos: 'CAM', age: 27, nat: '🇨🇴', overall: 76, status: 'Active' },
  { id: 9, name: 'Yusuf Al-Amin', pos: 'LW', age: 21, nat: '🇳🇬', overall: 68, status: 'Active' },
  { id: 10, name: 'Ethan Clarke', pos: 'RW', age: 24, nat: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', overall: 70, status: 'Active' },
  { id: 11, name: 'Victor Sousa', pos: 'ST', age: 28, nat: '🇵🇹', overall: 77, status: 'Active' },
  { id: 12, name: 'Noah Fischer', pos: 'ST', age: 19, nat: '🇩🇪', overall: 62, status: 'Active' },
];

const FORMATIONS = ['4-4-2', '4-3-3', '4-2-3-1', '3-5-2', '5-3-2', '3-4-3'];

const DEMO_MESSAGES = [
  { id: 1, from: 'Board', subject: 'Welcome to the club', preview: 'The board welcomes you and wishes you the best...', time: 'Today', read: false },
  { id: 2, from: 'Chief Scout', subject: 'Initial scouting targets', preview: 'I have identified some early targets for our squad...', time: 'Today', read: false },
  { id: 3, from: 'Head of Academy', subject: 'Academy intake ready', preview: 'This year\'s youth intake is now available for review...', time: 'Yesterday', read: true },
  { id: 4, from: 'Club Secretary', subject: 'Pre-season schedule', preview: 'Please find attached the proposed pre-season schedule...', time: '2d ago', read: true },
];

const DEMO_FIXTURES = [
  { id: 1, home: 'Your Club', away: 'Demo FC', competition: 'League Cup (Demo)', date: 'Aug 12' },
  { id: 2, home: 'Demo United', away: 'Your Club', competition: 'League (Demo)', date: 'Aug 19' },
  { id: 3, home: 'Your Club', away: 'Demo City', competition: 'League (Demo)', date: 'Aug 26' },
  { id: 4, home: 'Demo Athletic', away: 'Your Club', competition: 'League (Demo)', date: 'Sep 2' },
  { id: 5, home: 'Your Club', away: 'Demo Rovers', competition: 'League (Demo)', date: 'Sep 9' },
];

// ── Sub-pages ────────────────────────────────────────────────────────────────

function OverviewSection({ career, club, league }) {
  const navigate = useNavigate();
  const manager = career.managerName || `${career.firstName || ''} ${career.surname || ''}`.trim();

  const quickLinks = [
    { label: 'Squad', section: 'squad', emoji: '👥' },
    { label: 'Tactics', section: 'tactics', emoji: '🎯' },
    { label: 'Schedule', section: 'schedule', emoji: '📅' },
    { label: 'Recruitment', section: 'recruitment', emoji: '🔍' },
    { label: 'My Project', section: 'project', emoji: '⭐' },
    { label: 'Office', section: 'office', emoji: '📧' },
  ];

  const projectLabels = {
    youth: '🌱 Youth Revolution',
    attacking: '⚡ Beautiful Football',
    defensive: '🛡️ Defensive Dynasty',
    community: '❤️ Club of the People',
    financial: '📊 Sustainable Model',
    continental: '🌍 Continental Powerhouse',
  };

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: tokens.accent, fontWeight: 700, marginBottom: 6 }}>Overview</p>
        <h2 style={{ fontFamily: tokens.fontDisplay, fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 900, marginBottom: 4 }}>
          Welcome, {manager}.
        </h2>
        {club && (
          <p style={{ fontSize: 14, color: tokens.muted }}>
            {club.name} · {league?.name}
          </p>
        )}
      </div>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10, marginBottom: 28 }}>
        {[
          ['Manager', manager],
          ['Club', club?.name || '—'],
          ['League', league?.name || '—'],
          ['Philosophy', career.philosophy || 'Balanced'],
          ['Journey', career.journey || 'Blank Canvas'],
          ['Setup', career.setupType === 'quick' ? 'Quick Start' : 'Custom Career'],
        ].map(([k, v]) => (
          <div key={k} style={{ background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: tokens.radius.lg, padding: '14px 16px' }}>
            <div style={{ fontSize: 10, color: tokens.muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{k}</div>
            <div style={{ fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8, marginBottom: 28 }}>
        {quickLinks.map(link => (
          <Card
            key={link.section}
            onClick={() => navigate(`?s=${link.section}`, { replace: true })}
            style={{ padding: '16px', textAlign: 'center' }}
          >
            <div style={{ fontSize: 26, marginBottom: 8 }}>{link.emoji}</div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{link.label}</div>
          </Card>
        ))}
      </div>

      {/* Messages preview */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700 }}>Messages <DemoBadge /></h3>
        </div>
        {DEMO_MESSAGES.slice(0, 3).map(msg => (
          <div key={msg.id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 14px',
            background: tokens.surface,
            border: `1px solid ${tokens.border}`,
            borderRadius: tokens.radius.md,
            marginBottom: 6,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: msg.read ? 'transparent' : tokens.accent, border: `1px solid ${msg.read ? tokens.border : tokens.accent}`, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: msg.read ? 400 : 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.subject}</div>
              <div style={{ fontSize: 11, color: tokens.muted }}>{msg.from} · {msg.time}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Project card */}
      {career.project && (
        <div style={{ marginTop: 24, padding: '20px 22px', background: tokens.accentDim, border: `1px solid ${tokens.accentBorder}`, borderRadius: tokens.radius.xl }}>
          <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: tokens.accent, fontWeight: 700, marginBottom: 6 }}>My Project</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: tokens.accent }}>
            {projectLabels[career.project] || career.project}
          </div>
        </div>
      )}
    </div>
  );
}

function SquadSection() {
  const [search, setSearch] = useState('');
  const [posFilter, setPosFilter] = useState('');
  const positions = ['', 'GK', 'CB', 'LB', 'RB', 'CM', 'CAM', 'LW', 'RW', 'ST'];

  const filtered = DEMO_PLAYERS.filter(p =>
    (!search || p.name.toLowerCase().includes(search.toLowerCase())) &&
    (!posFilter || p.pos === posFilter)
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: tokens.accent, fontWeight: 700, marginBottom: 4 }}>Squad</p>
          <h2 style={{ fontFamily: tokens.fontDisplay, fontSize: 28, fontWeight: 900 }}>Your Squad</h2>
          <p style={{ color: tokens.muted, fontSize: 12, marginTop: 2 }}>Fictional demo players — not real squad data <DemoBadge /></p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          placeholder="Search players..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            background: tokens.surface, border: `1px solid ${tokens.border}`,
            borderRadius: tokens.radius.md, color: tokens.text, fontSize: 13,
            padding: '8px 12px', outline: 'none', fontFamily: tokens.font, flex: 1, minWidth: 160,
          }}
        />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {positions.map(pos => (
            <button key={pos} onClick={() => setPosFilter(pos)} style={{
              padding: '7px 12px', borderRadius: tokens.radius.md, fontSize: 11, fontWeight: 700,
              background: posFilter === pos ? tokens.accentDim : tokens.surface,
              border: `1px solid ${posFilter === pos ? tokens.accent : tokens.border}`,
              color: posFilter === pos ? tokens.accent : tokens.muted,
              cursor: 'pointer', fontFamily: tokens.font,
            }}>{pos || 'All'}</button>
          ))}
        </div>
      </div>
      <div style={{ border: `1px solid ${tokens.border}`, borderRadius: tokens.radius.lg, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 50px 40px 70px', padding: '10px 16px', background: tokens.surface, borderBottom: `1px solid ${tokens.border}` }}>
          {['Name', 'Pos', 'Age', 'Nat', 'Rating'].map(h => (
            <div key={h} style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: tokens.muted }}>{h}</div>
          ))}
        </div>
        {filtered.map((p, i) => (
          <div key={p.id} style={{
            display: 'grid', gridTemplateColumns: '1fr 60px 50px 40px 70px',
            padding: '12px 16px',
            background: i % 2 === 0 ? tokens.bg : 'transparent',
            borderBottom: `1px solid ${tokens.border}`,
          }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
            <div style={{ fontSize: 12, color: tokens.muted }}>{p.pos}</div>
            <div style={{ fontSize: 12, color: tokens.muted }}>{p.age}</div>
            <div style={{ fontSize: 14 }}>{p.nat}</div>
            <div>
              <span style={{
                fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                background: p.overall >= 75 ? 'rgba(0,204,102,0.15)' : p.overall >= 65 ? tokens.accentDim : tokens.surface,
                color: p.overall >= 75 ? tokens.success : p.overall >= 65 ? tokens.accent : tokens.muted,
              }}>{p.overall}</span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: '24px', textAlign: 'center', color: tokens.muted, fontSize: 13 }}>No players match your filters</div>
        )}
      </div>
    </div>
  );
}

function TacticsSection() {
  const [formation, setFormation] = useState('4-3-3');
  const [saved, setSaved] = useState(false);

  const FORMATION_POSITIONS = {
    '4-4-2': [
      { label: 'ST', x: 38, y: 10 }, { label: 'ST', x: 62, y: 10 },
      { label: 'LW', x: 15, y: 35 }, { label: 'CM', x: 38, y: 35 }, { label: 'CM', x: 62, y: 35 }, { label: 'RW', x: 85, y: 35 },
      { label: 'LB', x: 15, y: 60 }, { label: 'CB', x: 38, y: 60 }, { label: 'CB', x: 62, y: 60 }, { label: 'RB', x: 85, y: 60 },
      { label: 'GK', x: 50, y: 85 },
    ],
    '4-3-3': [
      { label: 'LW', x: 20, y: 10 }, { label: 'ST', x: 50, y: 10 }, { label: 'RW', x: 80, y: 10 },
      { label: 'CM', x: 25, y: 38 }, { label: 'CM', x: 50, y: 33 }, { label: 'CM', x: 75, y: 38 },
      { label: 'LB', x: 15, y: 62 }, { label: 'CB', x: 37, y: 62 }, { label: 'CB', x: 63, y: 62 }, { label: 'RB', x: 85, y: 62 },
      { label: 'GK', x: 50, y: 85 },
    ],
    '4-2-3-1': [
      { label: 'ST', x: 50, y: 8 },
      { label: 'LW', x: 20, y: 28 }, { label: 'CAM', x: 50, y: 25 }, { label: 'RW', x: 80, y: 28 },
      { label: 'DM', x: 36, y: 48 }, { label: 'DM', x: 64, y: 48 },
      { label: 'LB', x: 15, y: 66 }, { label: 'CB', x: 37, y: 66 }, { label: 'CB', x: 63, y: 66 }, { label: 'RB', x: 85, y: 66 },
      { label: 'GK', x: 50, y: 86 },
    ],
    '3-5-2': [
      { label: 'ST', x: 36, y: 10 }, { label: 'ST', x: 64, y: 10 },
      { label: 'LWB', x: 10, y: 38 }, { label: 'CM', x: 33, y: 35 }, { label: 'CM', x: 50, y: 32 }, { label: 'CM', x: 67, y: 35 }, { label: 'RWB', x: 90, y: 38 },
      { label: 'CB', x: 26, y: 65 }, { label: 'CB', x: 50, y: 65 }, { label: 'CB', x: 74, y: 65 },
      { label: 'GK', x: 50, y: 86 },
    ],
    '5-3-2': [
      { label: 'ST', x: 36, y: 10 }, { label: 'ST', x: 64, y: 10 },
      { label: 'CM', x: 28, y: 38 }, { label: 'CM', x: 50, y: 34 }, { label: 'CM', x: 72, y: 38 },
      { label: 'LWB', x: 10, y: 62 }, { label: 'CB', x: 30, y: 64 }, { label: 'CB', x: 50, y: 64 }, { label: 'CB', x: 70, y: 64 }, { label: 'RWB', x: 90, y: 62 },
      { label: 'GK', x: 50, y: 86 },
    ],
    '3-4-3': [
      { label: 'LW', x: 16, y: 10 }, { label: 'ST', x: 50, y: 8 }, { label: 'RW', x: 84, y: 10 },
      { label: 'LM', x: 18, y: 38 }, { label: 'CM', x: 40, y: 36 }, { label: 'CM', x: 60, y: 36 }, { label: 'RM', x: 82, y: 38 },
      { label: 'CB', x: 28, y: 64 }, { label: 'CB', x: 50, y: 66 }, { label: 'CB', x: 72, y: 64 },
      { label: 'GK', x: 50, y: 86 },
    ],
  };

  const positions = FORMATION_POSITIONS[formation] || FORMATION_POSITIONS['4-3-3'];
  const players = [...DEMO_PLAYERS].slice(0, 11);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: tokens.accent, fontWeight: 700, marginBottom: 4 }}>Tactics</p>
        <h2 style={{ fontFamily: tokens.fontDisplay, fontSize: 28, fontWeight: 900, marginBottom: 4 }}>Formation & Setup</h2>
        <p style={{ color: tokens.muted, fontSize: 12 }}>Demo layout — not a match simulation <DemoBadge /></p>
      </div>

      {/* Formation selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {FORMATIONS.map(f => (
          <button key={f} onClick={() => { setFormation(f); setSaved(false); }} style={{
            padding: '8px 16px', borderRadius: tokens.radius.md, fontSize: 13, fontWeight: 700,
            background: formation === f ? tokens.accent : tokens.surface,
            border: `1px solid ${formation === f ? tokens.accent : tokens.border}`,
            color: formation === f ? '#000' : tokens.text,
            cursor: 'pointer', fontFamily: tokens.font,
            transition: `all ${tokens.transition.fast}`,
          }}>{f}</button>
        ))}
      </div>

      {/* Pitch */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: 440,
        aspectRatio: '65/100',
        background: 'linear-gradient(180deg, #1a4a1a 0%, #1e5a1e 50%, #1a4a1a 100%)',
        borderRadius: tokens.radius.xl,
        overflow: 'hidden',
        border: `2px solid ${tokens.border}`,
        marginBottom: 20,
      }}>
        {/* Pitch markings */}
        <div style={{ position: 'absolute', inset: '5%', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 2 }} />
        <div style={{ position: 'absolute', top: '5%', left: '30%', right: '30%', height: '15%', border: '1px solid rgba(255,255,255,0.25)' }} />
        <div style={{ position: 'absolute', bottom: '5%', left: '30%', right: '30%', height: '15%', border: '1px solid rgba(255,255,255,0.25)' }} />
        <div style={{ position: 'absolute', top: '50%', left: '5%', right: '5%', height: 1, background: 'rgba(255,255,255,0.25)', transform: 'translateY(-50%)' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '25%', aspectRatio: '1', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.25)' }} />

        {/* Players */}
        {positions.map((pos, i) => {
          const player = players[i];
          return (
            <div
              key={i}
              title={player ? player.name : pos.label}
              style={{
                position: 'absolute',
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: 'translate(-50%,-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                cursor: 'default',
              }}
            >
              <div style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: tokens.accent,
                border: '2px solid rgba(255,255,255,0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 9,
                fontWeight: 900,
                color: '#000',
              }}>{pos.label}</div>
              {player && (
                <div style={{
                  fontSize: 9,
                  color: '#fff',
                  fontWeight: 600,
                  textAlign: 'center',
                  textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                  maxWidth: 48,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {player.name.split(' ')[1] || player.name.split(' ')[0]}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Button onClick={() => setSaved(true)} variant={saved ? 'ghost' : 'primary'}>
        {saved ? '✓ Saved' : 'Save Formation'}
      </Button>
    </div>
  );
}

function ScheduleSection() {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: tokens.accent, fontWeight: 700, marginBottom: 4 }}>Schedule</p>
        <h2 style={{ fontFamily: tokens.fontDisplay, fontSize: 28, fontWeight: 900, marginBottom: 4 }}>Upcoming Fixtures</h2>
        <p style={{ color: tokens.muted, fontSize: 12 }}>Sample fixture interface — fictional demo content <DemoBadge /></p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {DEMO_FIXTURES.map(f => (
          <div key={f.id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '16px 18px',
            background: tokens.surface,
            border: `1px solid ${tokens.border}`,
            borderRadius: tokens.radius.lg,
          }}>
            <div style={{ fontSize: 12, color: tokens.muted, minWidth: 50 }}>{f.date}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>
                {f.home === 'Your Club' ? <span style={{ color: tokens.accent }}>Your Club</span> : f.home}
                <span style={{ color: tokens.muted, fontWeight: 400, margin: '0 8px' }}>vs</span>
                {f.away === 'Your Club' ? <span style={{ color: tokens.accent }}>Your Club</span> : f.away}
              </div>
              <div style={{ fontSize: 11, color: tokens.muted }}>{f.competition}</div>
            </div>
            <Badge variant="demo">Demo</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecruitmentSection() {
  const [search, setSearch] = useState('');
  const SCOUT_PLAYERS = [
    { id: 1, name: 'Tomás Rivas', pos: 'ST', age: 22, nat: '🇦🇷', overall: 74 },
    { id: 2, name: 'Kwame Asante', pos: 'CM', age: 20, nat: '🇬🇭', overall: 70 },
    { id: 3, name: 'Florian Müller', pos: 'GK', age: 24, nat: '🇩🇪', overall: 72 },
    { id: 4, name: 'Lucas Benítez', pos: 'CB', age: 23, nat: '🇪🇸', overall: 68 },
    { id: 5, name: 'Antoine Lefèvre', pos: 'LW', age: 21, nat: '🇫🇷', overall: 71 },
    { id: 6, name: 'Sipho Nkosi', pos: 'RB', age: 19, nat: '🇿🇦', overall: 65 },
  ];
  const filtered = SCOUT_PLAYERS.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: tokens.accent, fontWeight: 700, marginBottom: 4 }}>Recruitment</p>
        <h2 style={{ fontFamily: tokens.fontDisplay, fontSize: 28, fontWeight: 900, marginBottom: 4 }}>Transfer Centre</h2>
        <p style={{ color: tokens.muted, fontSize: 12 }}>Fictional scouting UI — no transfer engine <DemoBadge /></p>
      </div>
      <input
        placeholder="Search scouted players..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          background: tokens.surface, border: `1px solid ${tokens.border}`,
          borderRadius: tokens.radius.md, color: tokens.text, fontSize: 13,
          padding: '10px 14px', width: '100%', maxWidth: 400, outline: 'none',
          fontFamily: tokens.font, marginBottom: 16,
        }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
        {filtered.map(p => (
          <div key={p.id} style={{
            padding: '16px 18px',
            background: tokens.surface,
            border: `1px solid ${tokens.border}`,
            borderRadius: tokens.radius.lg,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: tokens.muted }}>{p.nat} · {p.pos} · Age {p.age}</div>
              </div>
              <span style={{
                fontSize: 13, fontWeight: 700, padding: '3px 8px', borderRadius: 4,
                background: tokens.accentDim, color: tokens.accent,
              }}>{p.overall}</span>
            </div>
            <Button variant="ghost" size="sm" style={{ width: '100%' }}>Scout Report</Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClubSection({ club, league }) {
  if (!club) return <div style={{ color: tokens.muted, padding: 24 }}>No club selected.</div>;
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: tokens.accent, fontWeight: 700, marginBottom: 4 }}>Club</p>
        <h2 style={{ fontFamily: tokens.fontDisplay, fontSize: 28, fontWeight: 900, marginBottom: 4 }}>{club.name}</h2>
      </div>
      <div style={{ display: 'flex', gap: 20, alignItems: 'center', padding: '24px', background: `linear-gradient(135deg, ${club.color}22, ${club.color}06)`, border: `1px solid ${tokens.border}`, borderRadius: tokens.radius.xl, marginBottom: 24 }}>
        <ClubCrest club={club} size={80} />
        <div>
          <div style={{ fontSize: 22, fontWeight: 900, fontFamily: tokens.fontDisplay }}>{club.name}</div>
          <div style={{ fontSize: 13, color: tokens.muted }}>{league?.name} · {club.location}</div>
          <div style={{ fontSize: 13, marginTop: 6, lineHeight: 1.5, color: tokens.mutedLight }}>{club.identity}</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 1, background: tokens.border, borderRadius: tokens.radius.lg, overflow: 'hidden', marginBottom: 24 }}>
        {[['Founded', club.founded], ['Stadium', club.stadium], ['Capacity', club.capacity.toLocaleString()], ['Location', club.location]].map(([k, v]) => (
          <div key={k} style={{ background: tokens.surface, padding: '16px 18px' }}>
            <div style={{ fontSize: 10, color: tokens.muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{k}</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: '18px 20px', background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: tokens.radius.lg }}>
        <p style={{ fontSize: 10, color: tokens.accent, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Club History</p>
        <p style={{ fontSize: 13, color: tokens.muted, lineHeight: 1.7 }}>{club.history}</p>
      </div>
    </div>
  );
}

function OfficeSection() {
  const [open, setOpen] = useState(null);
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: tokens.accent, fontWeight: 700, marginBottom: 4 }}>Office</p>
        <h2 style={{ fontFamily: tokens.fontDisplay, fontSize: 28, fontWeight: 900, marginBottom: 4 }}>Manager Inbox</h2>
        <p style={{ color: tokens.muted, fontSize: 12 }}>Sample messages — demonstration content only <DemoBadge /></p>
      </div>
      {DEMO_MESSAGES.map(msg => (
        <div
          key={msg.id}
          onClick={() => setOpen(open === msg.id ? null : msg.id)}
          style={{
            padding: '14px 16px',
            background: tokens.surface,
            border: `1px solid ${tokens.border}`,
            borderRadius: tokens.radius.md,
            marginBottom: 6,
            cursor: 'pointer',
            transition: `border-color ${tokens.transition.fast}`,
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = tokens.borderHover}
          onMouseLeave={e => e.currentTarget.style.borderColor = tokens.border}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: msg.read ? 'transparent' : tokens.accent, border: `1px solid ${msg.read ? tokens.border : tokens.accent}`, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: msg.read ? 400 : 700 }}>{msg.subject}</div>
              <div style={{ fontSize: 11, color: tokens.muted }}>{msg.from} · {msg.time}</div>
            </div>
            <span style={{ color: tokens.muted, fontSize: 12 }}>{open === msg.id ? '▲' : '▼'}</span>
          </div>
          {open === msg.id && (
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${tokens.border}`, fontSize: 13, color: tokens.muted, lineHeight: 1.7 }}>
              {msg.preview} [This is a demonstration message. No actual gameplay content.]
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ProjectSection({ career }) {
  const projectInfo = {
    youth: { label: 'Youth Revolution', emoji: '🌱', desc: 'Build a club around young talent and become football\'s finest development club. Prioritise the academy, develop future stars, and create a sustainable pipeline of homegrown talent.' },
    attacking: { label: 'Beautiful Football', emoji: '⚡', desc: 'Create an iconic attacking team that fans never want to stop watching. High energy, relentless pressing, and breathtaking goals.' },
    defensive: { label: 'Defensive Dynasty', emoji: '🛡️', desc: 'Build the most disciplined, hard-to-beat team in the league. Concede nothing, control everything, and win ugly when necessary.' },
    community: { label: 'Club of the People', emoji: '❤️', desc: 'Create a club deeply connected to its supporters and local community. Fan engagement, local talent, and a club that means something beyond football.' },
    financial: { label: 'Sustainable Model', emoji: '📊', desc: 'Build a financially responsible club that grows steadily and sustainably. Smart recruitment, player development, and long-term planning.' },
    continental: { label: 'Continental Powerhouse', emoji: '🌍', desc: 'Turn this club into a dominant force on the continental stage. European ambition, world-class recruitment, and consistent trophies.' },
  };

  const proj = projectInfo[career.project] || null;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: tokens.accent, fontWeight: 700, marginBottom: 4 }}>My Project</p>
        <h2 style={{ fontFamily: tokens.fontDisplay, fontSize: 28, fontWeight: 900 }}>Club Vision</h2>
      </div>

      {proj ? (
        <div>
          <div style={{ padding: '28px', background: tokens.accentDim, border: `1px solid ${tokens.accentBorder}`, borderRadius: tokens.radius.xl, marginBottom: 24 }}>
            <div style={{ fontSize: 48, marginBottom: 14 }}>{proj.emoji}</div>
            <h3 style={{ fontFamily: tokens.fontDisplay, fontSize: 28, fontWeight: 900, color: tokens.accent, marginBottom: 10 }}>{proj.label}</h3>
            <p style={{ fontSize: 14, color: tokens.text, lineHeight: 1.7 }}>{proj.desc}</p>
          </div>

          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Project Milestones</h3>
          <p style={{ fontSize: 12, color: tokens.muted, marginBottom: 16 }}>These milestones will unlock as the game develops. This is your roadmap. <DemoBadge /></p>
          {[
            { label: 'Define club identity and philosophy', status: 'complete' },
            { label: 'Begin first pre-season programme', status: 'upcoming' },
            { label: 'Achieve first league milestone', status: 'locked' },
            { label: 'Complete academy intake review', status: 'locked' },
            { label: 'Reach continental qualification', status: 'locked' },
          ].map((m, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 14px',
              background: tokens.surface,
              border: `1px solid ${tokens.border}`,
              borderRadius: tokens.radius.md,
              marginBottom: 6,
              opacity: m.status === 'locked' ? 0.45 : 1,
            }}>
              <div style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: m.status === 'complete' ? tokens.success : m.status === 'upcoming' ? tokens.accent : tokens.border,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                color: '#000',
                fontWeight: 700,
                flexShrink: 0,
              }}>
                {m.status === 'complete' ? '✓' : m.status === 'upcoming' ? '→' : '·'}
              </div>
              <span style={{ fontSize: 13 }}>{m.label}</span>
              {m.status === 'locked' && <Badge style={{ marginLeft: 'auto' }}>Future</Badge>}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: '40px 24px', textAlign: 'center', border: `1px dashed ${tokens.border}`, borderRadius: tokens.radius.xl, color: tokens.muted }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⭐</div>
          <p>No club project selected. Complete the career setup to choose your vision.</p>
        </div>
      )}
    </div>
  );
}

// ── Main HQ component ────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', emoji: '🏠' },
  { id: 'squad', label: 'Squad', emoji: '👥' },
  { id: 'tactics', label: 'Tactics', emoji: '🎯' },
  { id: 'schedule', label: 'Schedule', emoji: '📅' },
  { id: 'recruitment', label: 'Recruitment', emoji: '🔍' },
  { id: 'club', label: 'Club', emoji: '🏟️' },
  { id: 'office', label: 'Office', emoji: '📧' },
  { id: 'project', label: 'My Project', emoji: '⭐' },
];

export default function Headquarters() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { careers, openCareer } = useGame();
  const [section, setSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showExit, setShowExit] = useState(false);

  const career = careers.find(c => c.id === id);

  useEffect(() => {
    if (!career) { navigate('/menu'); return; }
    openCareer(id);
    document.title = `SIDELINE — ${career.managerName || career.name}`;
  }, [career, id, navigate, openCareer]);

  if (!career) return null;

  const club = CLUBS.find(c => c.id === career.clubId);
  const league = club ? LEAGUES.find(l => l.id === club.leagueId) : null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: tokens.bg, overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? 220 : 56,
        background: tokens.surface,
        borderRight: `1px solid ${tokens.border}`,
        display: 'flex',
        flexDirection: 'column',
        transition: `width ${tokens.transition.slow}`,
        overflow: 'hidden',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}>
        {/* Sidebar header */}
        <div style={{ padding: '14px 12px', borderBottom: `1px solid ${tokens.border}`, display: 'flex', alignItems: 'center', gap: 10, minHeight: 56 }}>
          {sidebarOpen && club && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden', flex: 1 }}>
              <ClubCrest club={club} size={28} />
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: 12, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{club.shortName}</div>
                <div style={{ fontSize: 10, color: tokens.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{league?.name}</div>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(o => !o)}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            style={{ background: 'none', border: 'none', color: tokens.muted, cursor: 'pointer', fontSize: 16, padding: 4, flexShrink: 0, fontFamily: tokens.font }}
          >
            {sidebarOpen ? '‹' : '›'}
          </button>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '8px 6px', overflowY: 'auto' }}>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              title={!sidebarOpen ? item.label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: sidebarOpen ? 10 : 0,
                justifyContent: sidebarOpen ? 'flex-start' : 'center',
                padding: '9px 10px',
                width: '100%',
                background: section === item.id ? tokens.accentDim : 'transparent',
                border: `1px solid ${section === item.id ? tokens.accentBorder : 'transparent'}`,
                borderRadius: tokens.radius.md,
                cursor: 'pointer',
                fontFamily: tokens.font,
                marginBottom: 2,
                transition: `all ${tokens.transition.fast}`,
              }}
              onMouseEnter={e => { if (section !== item.id) e.currentTarget.style.background = tokens.bg; }}
              onMouseLeave={e => { if (section !== item.id) e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ fontSize: 16 }}>{item.emoji}</span>
              {sidebarOpen && (
                <span style={{ fontSize: 13, fontWeight: section === item.id ? 700 : 400, color: section === item.id ? tokens.accent : tokens.text }}>
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div style={{ padding: '10px 6px', borderTop: `1px solid ${tokens.border}` }}>
          <button
            onClick={() => setShowExit(true)}
            title={!sidebarOpen ? 'Main Menu' : undefined}
            style={{
              display: 'flex', alignItems: 'center', gap: sidebarOpen ? 10 : 0, justifyContent: sidebarOpen ? 'flex-start' : 'center',
              padding: '9px 10px', width: '100%',
              background: 'transparent', border: '1px solid transparent', borderRadius: tokens.radius.md,
              cursor: 'pointer', fontFamily: tokens.font, color: tokens.muted,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = tokens.bg; e.currentTarget.style.color = tokens.text; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = tokens.muted; }}
          >
            <span style={{ fontSize: 16 }}>🚪</span>
            {sidebarOpen && <span style={{ fontSize: 13 }}>Main Menu</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflow: 'auto', minWidth: 0 }}>
        {/* Top bar */}
        <header style={{
          borderBottom: `1px solid ${tokens.border}`,
          padding: '0 clamp(16px, 3vw, 28px)',
          height: 56,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          background: tokens.bg,
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}>
          <span style={{ fontFamily: tokens.fontDisplay, fontSize: 18, fontWeight: 900, letterSpacing: '0.04em', color: tokens.text }}>
            SIDE<span style={{ color: tokens.accent }}>LINE</span>
          </span>
          <span style={{ color: tokens.border }}>|</span>
          <span style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: tokens.muted }}>
            {career.managerName || career.name} · {club?.shortName || 'Your Club'}
          </span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            {club && <div style={{ width: 8, height: 8, borderRadius: '50%', background: club.color }} />}
            <span style={{ fontSize: 11, color: tokens.muted }}>{league?.name}</span>
          </div>
        </header>

        {/* Section content */}
        <div style={{ padding: 'clamp(20px, 3vw, 32px) clamp(16px, 3vw, 28px)', maxWidth: 900 }}>
          {section === 'overview' && <OverviewSection career={career} club={club} league={league} />}
          {section === 'squad' && <SquadSection />}
          {section === 'tactics' && <TacticsSection />}
          {section === 'schedule' && <ScheduleSection />}
          {section === 'recruitment' && <RecruitmentSection />}
          {section === 'club' && <ClubSection club={club} league={league} />}
          {section === 'office' && <OfficeSection />}
          {section === 'project' && <ProjectSection career={career} />}
        </div>
      </main>

      <ConfirmModal
        open={showExit}
        onClose={() => setShowExit(false)}
        onConfirm={() => navigate('/menu')}
        title="Return to Main Menu"
        message="Your career is saved automatically. Return to the main menu?"
        confirmLabel="Main Menu"
      />
    </div>
  );
}
