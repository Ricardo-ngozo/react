import { Link, Navigate, useParams } from 'react-router-dom';
import { useGame } from '../context/useGame.js';
import { CLUBS, LEAGUES } from '../data/clubs.js';
import { ENV, getAvatarById } from '../data/assets.js';
import { PROJECTS } from '../data/football.js';
import { Chip } from '../components/ui/Primitives.jsx';
import { ClubCrest } from '../components/ui/ClubCrest.jsx';
import { usePageTitle } from '../hooks/usePageTitle.js';
export default function Appointment() {
  const {
      id
    } = useParams(),
    {
      careers,
      clearDraft
    } = useGame(),
    career = careers.find(c => c.id === id);
  usePageTitle('Your appointment');
  if (!career) return <Navigate to="/careers" replace />;
  const club = CLUBS.find(c => c.id === career.clubId),
    league = LEAGUES.find(l => l.id === club?.leagueId);
  return <main className="appointment">
<div className="appointment-scene" style={{
      backgroundImage: `url(${ENV.tunnelRed})`
    }} />
<div className="appointment-content">
<Chip tone="accent">A new era begins</Chip>
<img className="appointment-portrait" src={getAvatarById(career.avatarId).src} alt={career.managerName} />
<h1>The touchline<br />is <span className="accent">yours.</span>
</h1>
<p>{career.managerName}, welcome to {club?.name}.</p>
<div className="appointment-contract">
<div className="row">
<ClubCrest club={club} size={45} />
<div>
<p className="eyebrow" style={{
              marginBottom: 6
            }}>Official appointment</p>
<h2>{club?.name}</h2>
</div>
</div>
<div className="review-lines">{[['Manager', career.managerName], ['Competition', league?.name], ['The project', PROJECTS.find(p => p.id === career.project)?.label || 'A new beginning']].map(([k, v]) => <div key={k}>
<span>{k}</span>
<span>{v}</span>
</div>)}</div>
</div>
<Link to={'/hq/' + id} className="btn btn-primary btn-lg" onClick={clearDraft}>Enter your headquarters <span aria-hidden="true">→</span>
</Link>
<p className="tiny subtle" style={{
        marginTop: 20
      }}>Your career has been saved. Let’s get to work.</p>
</div>
</main>;
}
