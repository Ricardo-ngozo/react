import { useState } from 'react';
import { FORMATIONS, autoLineup, POSITION_GROUP } from '../../data/football.js';
import { useGame } from '../../context/useGame.js';
import { Button, Chip, Field } from '../ui/Primitives.jsx';
import { Modal } from '../ui/Modal.jsx';
const ROLE_OPTIONS = {
  GK: ['Goalkeeper', 'Sweeper keeper'],
  CB: ['Central defender', 'Ball-playing defender', 'Cover defender'],
  LB: ['Full-back', 'Wing-back', 'Inverted full-back'],
  RB: ['Full-back', 'Wing-back', 'Inverted full-back'],
  DM: ['Holding midfielder', 'Deep-lying playmaker', 'Ball winner'],
  CM: ['Central midfielder', 'Box-to-box midfielder', 'Advanced playmaker'],
  AM: ['Attacking midfielder', 'Playmaker', 'Shadow striker'],
  LW: ['Winger', 'Inside forward', 'Wide playmaker'],
  RW: ['Winger', 'Inside forward', 'Wide playmaker'],
  ST: ['Advanced forward', 'Target forward', 'False nine']
};
export default function Tactics({
  squad,
  tactics,
  workspace,
  update,
  notify,
  onPlayer
}) {
  const {
    settings
  } = useGame();
  const [slot, setSlot] = useState(null),
    [presetOpen, setPresetOpen] = useState(false),
    [presetName, setPresetName] = useState('');
  const change = patch => update({
    tactics: {
      ...tactics,
      ...patch
    }
  });
  const formation = FORMATIONS[tactics.formation],
    selectedIds = Object.values(tactics.lineup),
    bench = squad.filter(p => !selectedIds.includes(p.id));
  const selectPlayer = player => {
    const lineup = {
        ...tactics.lineup
      },
      other = Object.keys(lineup).find(key => lineup[key] === player.id);
    if (other !== undefined) lineup[other] = lineup[slot];
    lineup[slot] = player.id;
    change({
      lineup
    });
    setSlot(null);
    notify('Starting eleven updated.');
  };
  const selectedPos = slot !== null ? formation[slot][0] : null;
  const applyStyle = style => {
    change(style === 'press' ? {
      mentality: 'positive',
      tempo: 80,
      pressing: 85,
      line: 75,
      buildUp: 'Short passing'
    } : style === 'counter' ? {
      mentality: 'cautious',
      tempo: 75,
      pressing: 35,
      line: 30,
      width: 65,
      buildUp: 'Direct passing'
    } : {
      mentality: 'balanced',
      tempo: 55,
      pressing: 65,
      line: 55,
      width: 60,
      buildUp: 'Mixed passing'
    });
    notify('Team instructions updated.');
  };
  return <>
<div className="squad-toolbar">
<div className="row wrap">
<Chip tone="accent">{workspace.tactics ? 'Tactic saved' : 'Suggested starting shape'}</Chip>
<span className="tiny muted">Changes save automatically.</span>
</div>
<div className="row">
<select style={{
          width: 170
        }} aria-label="Load tactical preset" value="" onChange={e => {
          const p = workspace.presets?.find(p => p.id === e.target.value);
          if (p) {
            change(p.tactics);
            notify('Loaded ' + p.name);
          }
        }}>
<option value="" disabled>Load a preset</option>{(workspace.presets || []).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
<Button size="sm" variant="secondary" icon="plus" onClick={() => setPresetOpen(true)}>Save preset</Button>
</div>
</div>
    <div className="tactics-layout">
<section className="tactics-pitch-wrap">
<div className="row-between">
<div>
<p className="eyebrow" style={{
              fontSize: 8,
              marginBottom: 5
            }}>Starting eleven</p>
<h2>{tactics.formation} <span className="muted" style={{
                fontSize: 20,
                fontWeight: 500
              }}>· {tactics.mentality}</span>
</h2>
</div>
<select style={{
            width: 115
          }} aria-label="Formation" value={tactics.formation} onChange={e => change({
            formation: e.target.value,
            lineup: autoLineup(squad, e.target.value, settings.selectionPriority),
            roles: {}
          })}>{Object.keys(FORMATIONS).map(f => <option key={f}>{f}</option>)}</select>
</div>
    <div className="tactics-pitch">
<div className="pitch-markings" />
<div className="pitch-circle" />
<div className="pitch-box top" />
<div className="pitch-box bottom" />{formation.map(([pos, x, y], i) => {
            const p = squad.find(p => p.id === tactics.lineup[i]);
            return <button className={'pitch-player ' + (pos === 'GK' ? 'gk' : '')} key={i} style={{
              left: x + '%',
              top: y + '%'
            }} onClick={() => setSlot(i)} aria-label={`Select ${pos} — ${p?.name}`}>
<span className="pitch-shirt">{p?.number}</span>
<strong>{p?.lastName || 'Select player'}</strong>
<small>{tactics.roles?.[i] || pos}</small>
</button>;
          })}</div>
    <div className="bench-row">{bench.slice(0, 7).map(p => <button key={p.id} className="bench-player" onClick={() => onPlayer(p)} aria-label={'View ' + p.name + ' profile'}>
<span className={'position-badge position-' + p.group}>{p.pos}</span>
<strong>{p.lastName}</strong>
<small>{p.overall} OVR · {p.fitness}%</small>
</button>)}</div>
    <div className="row-between wrap" style={{
          marginTop: 20
        }}>
<Button size="sm" variant="secondary" icon="squad" onClick={() => {
            change({
              lineup: autoLineup(squad, tactics.formation, settings.selectionPriority)
            });
            notify('Assistant selected your eleven.');
          }}>Ask the assistant</Button>
<Button size="sm" icon="check" onClick={() => {
            change({});
            notify('Lineup confirmed and saved.');
          }}>Confirm lineup</Button>
</div>
</section>
    <div className="stack">
<section className="panel instruction-panel">
<h3>Team identity</h3>
<div className="segmented" style={{
            display: 'flex'
          }}>{['cautious', 'balanced', 'positive'].map(m => <button key={m} style={{
              flex: 1,
              textTransform: 'capitalize'
            }} aria-pressed={tactics.mentality === m} onClick={() => change({
              mentality: m
            })}>{m}</button>)}</div>
    {[['tempo', 'Tempo', 'Patient', 'Quick'], ['width', 'Attacking width', 'Narrow', 'Wide'], ['pressing', 'Pressing intensity', 'Hold shape', 'High press'], ['line', 'Defensive line', 'Deep', 'High']].map(([key, label, min, max]) => <div className="instruction-row" key={key}>
<div className="instruction-label">
<label htmlFor={'tactic-' + key}>{label}</label>
<strong>{tactics[key]} / 100</strong>
</div>
<input type="range" min="0" max="100" step="5" id={'tactic-' + key} value={tactics[key]} onChange={e => change({
              [key]: Number(e.target.value)
            })} />
<div className="instruction-ends">
<span>{min}</span>
<span>{max}</span>
</div>
</div>)}
    <Field label="Build-up approach">
<select value={tactics.buildUp} onChange={e => change({
              buildUp: e.target.value
            })}>{['Short passing', 'Mixed passing', 'Direct passing'].map(v => <option key={v}>{v}</option>)}</select>
</Field>
</section>
    <section className="panel instruction-panel">
<h3>A starting point</h3>
<div className="stack-sm">{[['balanced', 'tactics', 'Balanced control'], ['press', 'bolt', 'Front-foot press'], ['counter', 'shield', 'Compact & counter']].map(([id, icon, label]) => <Button key={id} variant="ghost" icon={icon} onClick={() => applyStyle(id)}>{label}</Button>)}</div>{settings.showHints && <p className="tiny muted leading" style={{
            marginTop: 18
          }}>Click a shirt to change the player or their role. Formation changes animate into place. These instructions are saved for your future matches.</p>}</section>
</div>
</div>
    <Modal open={slot !== null} onClose={() => setSlot(null)} title={'Choose your ' + selectedPos}>
<Field label="Player role">
<select aria-label="Player role" value={tactics.roles?.[slot] || ROLE_OPTIONS[selectedPos]?.[0]} onChange={e => change({
          roles: {
            ...tactics.roles,
            [slot]: e.target.value
          }
        })}>{(ROLE_OPTIONS[selectedPos] || []).map(r => <option key={r}>{r}</option>)}</select>
</Field>
<p className="tiny muted" style={{
        margin: '18px 0 12px'
      }}>Players in their natural position appear first. Selecting a starter swaps their current slot.</p>
<div className="club-picker-list">{squad.filter(p => selectedPos === 'GK' ? p.pos === 'GK' : p.pos !== 'GK').sort((a, b) => (b.pos === selectedPos) - (a.pos === selectedPos) || b.overall - a.overall).map(p => <button key={p.id} className="club-picker-item" onClick={() => selectPlayer(p)} aria-pressed={tactics.lineup[slot] === p.id}>
<span className={'position-badge position-' + POSITION_GROUP[p.pos]}>{p.pos}</span>
<span>
<strong>{p.name}</strong>
<small>{p.overall} OVR · {p.fitness}% condition {selectedIds.includes(p.id) ? '· Starting XI' : ''}</small>
</span>{p.pos === selectedPos && <Chip tone="accent">Natural</Chip>}</button>)}</div>
</Modal>
    <Modal open={presetOpen} onClose={() => setPresetOpen(false)} title="Keep this shape">
<Field label="Tactic name">
<input maxLength={40} placeholder="e.g. Front-foot 4-3-3" value={presetName} onChange={e => setPresetName(e.target.value)} />
</Field>
<div className="modal-actions">
<Button disabled={!presetName.trim()} icon="check" onClick={() => {
          update(w => ({
            presets: [...(w.presets || []).slice(-11), {
              id: crypto.randomUUID(),
              name: presetName.trim(),
              tactics
            }]
          }));
          setPresetOpen(false);
          setPresetName('');
          notify('Tactical preset saved.');
        }}>Save preset</Button>
</div>
</Modal>
</>;
}
