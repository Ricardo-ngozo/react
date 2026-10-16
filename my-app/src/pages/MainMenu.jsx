import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/useGame.js';
import { ENV } from '../data/assets.js';
import { CLUBS, LEAGUES, COUNTRIES } from '../data/clubs.js';
import { Wordmark, Chip } from '../components/ui/Primitives.jsx';
import { Icon } from '../components/ui/Icon.jsx';
import { usePageTitle } from '../hooks/usePageTitle.js';
export default function MainMenu() {
  usePageTitle('Main menu');
  const navigate = useNavigate();
  const {
    currentCareer,
    careers,
    settings
  } = useGame();
  const items = [['plus', 'New career', 'A new club. A new possibility.', '/career/new'], ['folder', 'Career library', `${careers.length} saved ${careers.length === 1 ? 'story' : 'stories'} to return to`, '/careers'], ['globe', 'Explore the world', 'Find a club that feels like yours.', '/explore'], ['settings', 'Settings', 'Make the game your own.', '/settings']];
  return <main className="cinematic">
<div className="cinematic-bg" style={{
      backgroundImage: `url(${ENV.stadiumNight})`,
      backgroundPosition: 'center 35%'
    }} />
<div className="cinematic-shade" />
    <header className="cinematic-header">
<Wordmark />
<Chip tone="accent">
<span className="live-dot" /> The touchline is yours</Chip>
</header>
    <div className="menu-layout">
<section className="menu-copy route-enter">
<p className="title-kicker">Welcome to your next chapter</p>
<h1>Leave<br />your <span>mark.</span>
</h1>
<p>The big nights begin long before kick-off. Build your identity. Prepare your team. Make this club yours.</p>
<div className="menu-world-stat">{[[CLUBS.length, 'Clubs to discover'], [LEAGUES.length, 'Competitions'], [COUNTRIES.length, 'Football nations']].map(([n, label]) => <div key={label}>
<strong>{n.toString().padStart(2, '0')}</strong>
<span>{label}</span>
</div>)}</div>
</section>
    <nav className="menu-panel" aria-label="Main menu">
<p className="eyebrow">{currentCareer ? 'Your story continues' : 'Every legacy starts somewhere'}</p>
<button className="menu-main-action" onClick={() => navigate(currentCareer ? `/hq/${currentCareer.id}` : '/career/new')}>
<div>
<strong>{currentCareer ? 'Continue career' : 'Start your story'}</strong>
<small>{currentCareer ? `${currentCareer.managerName || currentCareer.name} · ${currentCareer.clubName}` : 'Create a manager. Find your club.'}</small>
</div>
<Icon name="arrow" size={23} />
</button>
      {items.filter(item => currentCareer || item[0] !== 'plus').map(([icon, label, desc, path]) => <button key={label} className="menu-item" onClick={() => navigate(path)}>
<Icon name={icon} />
<div>
<strong>{label}</strong>
<small>{desc}</small>
</div>
<Icon name="chevron" size={15} />
</button>)}
      <div className="menu-save">
<Icon name="shield" size={14} />
<span>Preparation and careers save on this device.</span>
</div>
</nav>
</div>
    <footer className="cinematic-footer">
<span>FOOTBALL. YOUR WAY.</span>
<span>{settings.keyboardHints ? 'TIP · TAB TO NAVIGATE / ENTER TO SELECT' : 'SIDELINE · INTERFACE PREVIEW 0.2'}</span>
</footer>
</main>;
}
