import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGame } from '../context/useGame.js';
import { CLUBS, LEAGUES } from '../data/clubs.js';
import { getAvatarById } from '../data/assets.js';
import { getReadiness, exportBackup } from '../data/football.js';
import { Button, Chip, EmptyState, Field, PageHeader, Meter } from '../components/ui/Primitives.jsx';
import { Icon } from '../components/ui/Icon.jsx';
import { ClubCrest } from '../components/ui/ClubCrest.jsx';
import { Modal, ConfirmModal } from '../components/ui/Modal.jsx';
import { usePageTitle } from '../hooks/usePageTitle.js';
export default function CareerLibrary() {
  usePageTitle('Career library');
  const navigate = useNavigate(),
    {
      careers,
      currentCareerId,
      openCareer,
      renameCareer,
      deleteCareer
    } = useGame();
  const [renaming, setRenaming] = useState(null),
    [name, setName] = useState(''),
    [deleting, setDeleting] = useState(null);
  return <main>
<PageHeader eyebrow="Your stories" title="There’s always more to write." description="Return to a familiar touchline, or start a new chapter." action={<Link to="/career/new" className="btn btn-primary">
<Icon name="plus" size={16} /> New career</Link>} />
<div className="page-content">{!careers.length ? <div className="panel">
<EmptyState icon="folder" title="Your first chapter is waiting." description="Create a manager, find a club and give your football a home. Your saved careers will be right here." action={<Link to="/career/new" className="btn btn-primary">Start your story <Icon name="arrow" size={16} />
</Link>} />
</div> : <>
<div className="row-between" style={{
          marginBottom: 22
        }}>
<p className="small muted">{careers.length} {careers.length === 1 ? 'career' : 'careers'} on this device</p>
<Button size="sm" variant="ghost" icon="download" onClick={() => exportBackup(careers)}>Export all careers</Button>
</div>
<div className="library-grid">{careers.toSorted((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)).map(c => {
            const club = CLUBS.find(club => club.id === c.clubId),
              readiness = getReadiness(c.workspace || {});
            return <article key={c.id} className="panel save-card">
<div className="save-card-top">
<div>
<p className="eyebrow">{LEAGUES.find(l => l.id === club?.leagueId)?.name || 'Your career'}</p>
<h2>{club?.name || c.clubName}</h2>
</div>
<ClubCrest club={club} size={45} />
</div>
<div className="manager-line">
<img src={getAvatarById(c.avatarId).src} alt="" />
<div>
<h3>{c.managerName || c.name}</h3>
<p className="tiny muted" style={{
                    marginTop: 5
                  }}>{c.name}</p>
</div>{currentCareerId === c.id && <Chip tone="accent" style={{
                  marginLeft: 'auto'
                }}>Active</Chip>}</div>
<div className="row-between" style={{
                marginBottom: 10
              }}>
<span className="tiny muted">Pre-season preparation</span>
<span className="tiny accent">{readiness}%</span>
</div>
<Meter value={readiness} label={'Preparation for ' + c.name} />
<div className="save-meta" style={{
                marginTop: 20
              }}>
<span>{c.setupType === 'quick' ? 'Quick start' : 'Custom career'}</span>
<span>Saved {new Date(c.updatedAt || c.createdAt || c.confirmedAt).toLocaleDateString('en-GB')}</span>
</div>
<div className="save-actions">
<Button endIcon="arrow" style={{
                  flex: 1
                }} onClick={() => {
                  openCareer(c.id);
                  navigate('/hq/' + c.id);
                }}>Return to club</Button>
<button className="icon-button" aria-label={'Rename ' + c.name} onClick={() => {
                  setName(c.name);
                  setRenaming(c.id);
                }}>
<Icon name="book" size={16} />
</button>
<button className="icon-button" aria-label={'Delete ' + c.name} onClick={() => setDeleting(c.id)}>
<Icon name="close" size={16} />
</button>
</div>
</article>;
          })}</div>
</>}<footer className="page-footer">
<span>Saved on this device. Export a backup to keep your work safe.</span>
<Link to="/settings?tab=data">Manage saved data <Icon name="arrow" size={12} />
</Link>
</footer>
</div>
<Modal open={Boolean(renaming)} onClose={() => setRenaming(null)} title="Name this chapter">
<Field label="Career name">
<input maxLength={100} value={name} onChange={e => setName(e.target.value)} />
</Field>
<div className="modal-actions">
<Button disabled={!name.trim()} onClick={() => {
          renameCareer(renaming, name);
          setRenaming(null);
        }}>Save name</Button>
</div>
</Modal>
<ConfirmModal open={Boolean(deleting)} onClose={() => setDeleting(null)} title="Close this chapter?" message="This career and its saved preparation will be removed from this device. Export a backup first if you want to keep it." danger confirmLabel="Delete career" onConfirm={() => deleteCareer(deleting)} />
</main>;
}
