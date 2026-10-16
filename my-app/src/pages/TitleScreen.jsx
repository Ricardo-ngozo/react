import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Chip, Wordmark } from '../components/ui/Primitives.jsx';
import { ENV } from '../data/assets.js';
import { usePageTitle } from '../hooks/usePageTitle.js';
export default function TitleScreen() {
  const navigate = useNavigate();
  usePageTitle('Football is more than 90 minutes');
  useEffect(() => {
    const handler = e => {
      if (e.key === 'Enter' && e.target === document.body) navigate('/menu');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate]);
  return <main className="cinematic">
<div className="cinematic-bg" style={{
      backgroundImage: `url(${ENV.tunnelGreen})`
    }} />
<div className="cinematic-shade" />
    <header className="cinematic-header">
<span className="title-kicker">
<span className="live-dot" /> A football management experience</span>
<Link to="/settings" className="back-link">Preferences</Link>
</header>
    <div className="title-content route-enter">
<p className="title-kicker">Your club. Your identity. Your story.</p>
<Wordmark />
<h1>Football is more<br />than 90 minutes.</h1>
<p>Build something worth believing in. Your next chapter starts on the sideline.</p>
<Button size="lg" endIcon="arrow" onClick={() => navigate('/menu')}>Enter the game</Button>
</div>
    <footer className="cinematic-footer">
<span>INDEPENDENT FOOTBALL. LIMITLESS AMBITION.</span>
<Chip>Interface preview · v0.2</Chip>
</footer>
</main>;
}
