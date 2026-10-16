import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/useGame.js';
import { ENV } from '../data/assets.js';
import { PageHeader, Chip } from '../components/ui/Primitives.jsx';
import { Icon } from '../components/ui/Icon.jsx';
import { usePageTitle } from '../hooks/usePageTitle.js';
export default function NewCareer() {
  usePageTitle('A new beginning');
  const navigate = useNavigate();
  const {
    clearDraft,
    updateDraft,
    careerDraft
  } = useGame();
  const start = type => {
    clearDraft();
    updateDraft({
      setupType: type
    });
    navigate(type === 'quick' ? '/career/quick' : '/career/setup/1');
  };
  return <main>
<PageHeader eyebrow="A new beginning" title="Every great story starts here." description="Choose how you want to begin. The club, the identity, the ambition — it’s all yours." />
<div className="page-content">
    {careerDraft?.firstName && !careerDraft.completed && <div className="notice" style={{
        marginBottom: 22
      }}>
<Icon name="info" />
<span>You have an unfinished setup for {careerDraft.firstName}.</span>
<button className="text-button" style={{
          marginLeft: 'auto'
        }} onClick={() => navigate('/career/setup/1')}>Resume draft <Icon name="arrow" size={14} />
</button>
</div>}
    <div className="career-choice-grid">{[{
          id: 'quick',
          number: '01',
          title: 'Quick start',
          desc: 'Get straight to your club. Choose a name and a team; we’ll set up the essentials.',
          image: ENV.tunnelGreen,
          icon: 'bolt',
          badge: '3 simple steps',
          features: ['Your manager', 'Your club', 'Your appointment']
        }, {
          id: 'custom',
          number: '02',
          title: 'Your own way',
          desc: 'Give your manager a story. Define your philosophy, find your club, and shape the project.',
          image: ENV.managerOffice,
          icon: 'tactics',
          badge: 'The complete setup',
          features: ['Your identity', 'Your philosophy', 'Your vision']
        }].map(opt => <button className="career-choice" key={opt.id} onClick={() => start(opt.id)}>
<img src={opt.image} alt="" />
<span className="choice-number">{opt.number}</span>
<Chip>{opt.badge}</Chip>
<span className="choice-icon">
<Icon name={opt.icon} />
</span>
<h2>{opt.title}</h2>
<p>{opt.desc}</p>
<div className="choice-features">{opt.features.map(f => <span key={f}>{f}</span>)}</div>
<span className="btn btn-primary">Begin {opt.id === 'quick' ? 'quick start' : 'custom career'} <Icon name="arrow" size={17} />
</span>
</button>)}</div>
<footer className="page-footer">
<span>Your preparation and choices are saved locally.</span>
<span>ONE CLUB. ENDLESS POSSIBILITIES.</span>
</footer>
</div>
</main>;
}
