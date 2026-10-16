import { useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGame } from '../context/useGame.js';
import { Button, Chip, PageHeader, Toggle } from '../components/ui/Primitives.jsx';
import { ConfirmModal } from '../components/ui/Modal.jsx';
import { Icon } from '../components/ui/Icon.jsx';
import { exportBackup } from '../data/football.js';
import { usePageTitle } from '../hooks/usePageTitle.js';
const TABS = [['appearance', 'eye', 'Appearance'], ['accessibility', 'sun', 'Accessibility'], ['preparation', 'tactics', 'Game preferences'], ['data', 'folder', 'Saved data']];
function Choice({
  label,
  description,
  value,
  onChange,
  options
}) {
  return <div className="setting-row">
<div>
<label>{label}</label>
<p>{description}</p>
</div>
<select aria-label={label} value={value} onChange={e => onChange(e.target.value)}>{options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
</div>;
}
export default function Settings() {
  usePageTitle('Settings');
  const {
      settings,
      updateSettings,
      resetSettings,
      careers,
      importCareers,
      storageError
    } = useGame(),
    [params, setParams] = useSearchParams();
  const tab = TABS.some(t => t[0] === params.get('tab')) ? params.get('tab') : 'appearance';
  const [reset, setReset] = useState(false),
    [status, setStatus] = useState(''),
    inputRef = useRef(null);
  const change = (key, value) => updateSettings({
    [key]: value
  });
  const restore = async e => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      if (file.size > 5 * 1024 * 1024) throw new Error('Choose a backup smaller than 5 MB.');
      const value = JSON.parse(await file.text());
      importCareers(value);
      setStatus('Backup imported. Existing careers were kept; matching career IDs were skipped.');
    } catch (error) {
      setStatus(error.message === 'Unexpected token' ? 'This file is not a valid JSON backup.' : error.message);
    }
  };
  return <main>
<PageHeader eyebrow="Make it yours" title="Your game. Your preferences." description="Fine-tune the look, the feel and the way you prepare." back={params.get('back')?.startsWith('/hq/') ? params.get('back') : '/menu'} action={<Chip tone={storageError ? 'amber' : 'accent'}>
<Icon name={storageError ? 'info' : 'check'} size={12} />{storageError ? 'Save needs attention' : 'Changes saved locally'}</Chip>} />
<div className="page-content">
<div className="settings-layout">
<nav className="settings-nav" role="tablist" aria-label="Settings categories">{TABS.map(([id, icon, label]) => <button role="tab" id={'tab-' + id} aria-controls={'panel-' + id} aria-selected={tab === id} key={id} onClick={() => setParams(prev => {
            const next = new URLSearchParams(prev);
            next.set('tab', id);
            return next;
          }, {
            replace: true
          })}>
<Icon name={icon} size={18} />{label}</button>)}</nav>
<section className="panel settings-section" role="tabpanel" id={'panel-' + tab} aria-labelledby={'tab-' + tab}>
    {tab === 'appearance' && <>
<div className="section-intro">
<p className="eyebrow">Look & feel</p>
<h2>A space that feels like you.</h2>
<p>Quiet surfaces. Clear information. Your signature accent.</p>
</div>
<div className="setting-row">
<div>
<label>Signature accent</label>
<p>A little colour, exactly where it matters.</p>
</div>
<div className="accent-swatches">{[['lime', '#cefa69', 'Touchline lime'], ['ice', '#a3d6ec', 'Stadium ice'], ['amber', '#f0bd79', 'Golden hour']].map(([id, color, label]) => <button key={id} className="accent-swatch" style={{
                  '--swatch': color
                }} aria-label={label} aria-pressed={settings.accent === id} onClick={() => change('accent', id)}>{settings.accent === id && <Icon name="check" size={14} />}</button>)}</div>
</div>
<Choice label="Information density" description="Give tables more space, or fit more of your squad on screen." value={settings.density} onChange={v => change('density', v)} options={[['comfortable', 'Comfortable'], ['compact', 'Compact']]} />
<Toggle label="Atmospheric backgrounds" description="Show stadium photography on the title screen and main menu." checked={settings.atmosphere} onChange={v => change('atmosphere', v)} />
<Toggle label="Interface animations" description="Smooth page entrances, formation changes and hover feedback." checked={settings.animations} onChange={v => change('animations', v)} />
<Toggle label="Keyboard reminders" description="Show keyboard navigation tips in the main menu." checked={settings.keyboardHints} onChange={v => change('keyboardHints', v)} />
<div className="setting-preview">
<p className="eyebrow">A little preview</p>
<h2>Your next big night.</h2>
<p className="small muted" style={{
                marginTop: 8
              }}>An interface built around the decisions that matter.</p>
<div className="row">
<span className="btn btn-primary">Match preparation <Icon name="arrow" size={15} />
</span>
<Chip tone="accent">Ready when you are</Chip>
</div>
</div>
</>}
    {tab === 'accessibility' && <>
<div className="section-intro">
<p className="eyebrow">Comfort & clarity</p>
<h2>Stay focused on the football.</h2>
<p>These preferences apply throughout SIDELINE.</p>
</div>
<Choice label="Interface size" description="Scale text and controls together for comfortable reading." value={settings.fontSize} onChange={v => change('fontSize', v)} options={[['small', 'Small · 95%'], ['medium', 'Standard · 100%'], ['large', 'Large · 110%']]} />
<Choice label="Contrast" description="Make secondary text and panel boundaries more prominent." value={settings.contrast} onChange={v => change('contrast', v)} options={[['standard', 'Standard'], ['high', 'High contrast']]} />
<Toggle label="Reduced motion" description="Remove movement and transitions. Your operating system’s reduced-motion preference is also respected." checked={settings.reducedMotion} onChange={v => change('reducedMotion', v)} />
<Toggle label="Helpful explanations" description="Show coaching hints and context in tactics and training." checked={settings.showHints} onChange={v => change('showHints', v)} />
<div className="notice" style={{
              marginTop: 24
            }}>
<Icon name="info" size={16} />
<span>Use Tab to move between controls, Enter to select, and Escape to close dialogs. Dialogs keep keyboard focus inside until closed.</span>
</div>
</>}
    {tab === 'preparation' && <>
<div className="section-intro">
<p className="eyebrow">Game preferences</p>
<h2>Choose your way to prepare.</h2>
<p>Assistance, scouting and briefings. Full match simulation remains in development.</p>
</div>
<Choice label="Preparation style" description="Sets how many preparation checks are needed before signing off a briefing." value={settings.difficulty} onChange={v => change('difficulty', v)} options={[['relaxed', 'Relaxed · no required checks'], ['balanced', 'Balanced · two checks'], ['demanding', 'Detailed · all three checks']]} />
<Choice label="Assistant selection priority" description="Used when you ask the assistant to pick your starting eleven." value={settings.selectionPriority} onChange={v => change('selectionPriority', v)} options={[['balanced', 'Ability & position'], ['fitness', 'Fresh legs'], ['youth', 'Future potential']]} />
<Choice label="Scouting information" description="Choose exact ratings or estimated ranges in the transfer centre." value={settings.scoutingDetail} onChange={v => change('scoutingDetail', v)} options={[['full', 'Detailed ratings'], ['ranges', 'Estimated ranges']]} />
<Choice label="Briefing presentation" description="Choose how much opponent analysis appears in fixture briefings." value={settings.matchPresentation} onChange={v => change('matchPresentation', v)} options={[['key', 'Key information'], ['extended', 'Extended analysis']]} />
<Choice label="Planning currency" description="Display currency for fictional scouting estimates and planning figures." value={settings.currency} onChange={v => change('currency', v)} options={[['EUR', 'Euro · EUR'], ['GBP', 'Pound · GBP'], ['USD', 'Dollar · USD'], ['ZAR', 'Rand · ZAR']]} />
<Choice label="Date format" description="Used across fixtures and match briefings." value={settings.dateFormat} onChange={v => change('dateFormat', v)} options={[['day-first', '11 Jul 2026'], ['month-first', 'Jul 11, 2026']]} />
<Toggle label="Preparation reminders" description="Show the preparation checklist on your overview." checked={settings.preparationReminders} onChange={v => change('preparationReminders', v)} />
</>}
    {tab === 'data' && <>
<div className="section-intro">
<p className="eyebrow">Your stories</p>
<h2>Keep your work close.</h2>
<p>Careers, drafts and preparation save in this browser automatically.</p>
</div>
<div className="comparison-grid" style={{
              margin: '25px 0'
            }}>
<div className="compare-cell">
<strong>{careers.length.toString().padStart(2, '0')}</strong>
<span>Saved careers</span>
</div>
<div className="compare-cell">
<strong>Local</strong>
<span>Storage location</span>
</div>
<div className="compare-cell">
<strong>On</strong>
<span>Automatic saving</span>
</div>
</div>
<div className="setting-row">
<div>
<label>Export your careers</label>
<p>Download a JSON backup of your careers, tactics, shortlists and preparation.</p>
</div>
<Button variant="secondary" icon="download" onClick={() => {
                exportBackup(careers);
                setStatus('Your career backup has been downloaded.');
              }}>Export backup</Button>
</div>
<div className="setting-row">
<div>
<label>Import a backup</label>
<p>Add careers from a SIDELINE backup. Matching IDs are kept as they are.</p>
</div>
<input ref={inputRef} type="file" accept=".json,application/json" onChange={restore} hidden />
<Button variant="secondary" icon="upload" onClick={() => inputRef.current.click()}>Import backup</Button>
</div>
<div className="setting-row">
<div>
<label>Reset preferences</label>
<p>Restore the default interface and game preferences. Your careers stay saved.</p>
</div>
<Button variant="ghost" icon="refresh" onClick={() => setReset(true)}>Reset preferences</Button>
</div>
<div className="notice" style={{
              marginTop: 25
            }}>
<Icon name="shield" size={16} />
<span>Browser storage belongs to this browser and device. Keep an exported backup before clearing site data or changing devices.</span>
</div>{status && <p role="status" className="small accent" style={{
              marginTop: 20
            }}>{status}</p>}</>}
    </section>
</div>
<footer className="page-footer">
<span>SIDELINE · Interface preview 0.2</span>
<span>MADE FOR THE LONG GAME.</span>
</footer>
</div>
<ConfirmModal open={reset} onClose={() => setReset(false)} title="Reset your preferences?" message="The default appearance and preparation preferences will be restored. Your careers and saved preparation will be kept." confirmLabel="Reset preferences" onConfirm={() => {
      resetSettings();
      setStatus('Preferences restored.');
    }} />
</main>;
}
