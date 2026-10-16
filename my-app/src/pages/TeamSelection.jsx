import { useNavigate } from 'react-router-dom';
import { ClubBrowser } from '../components/ClubBrowser.jsx';
import { PageHeader } from '../components/ui/Primitives.jsx';
import { useGame } from '../context/useGame.js';
export default function TeamSelection() {
  const navigate = useNavigate(),
    {
      careerDraft,
      updateDraft
    } = useGame();
  return <main>
<PageHeader eyebrow="Your club" title="Find where you belong." description="Every badge has a story. Choose the next chapter." back="/career/new" />
<div className="page-content">
<ClubBrowser selectedId={careerDraft?.clubId} onSelect={club => {
        updateDraft({
          clubId: club.id,
          clubName: club.name
        });
        navigate(careerDraft?.setupType === 'quick' ? '/career/quick' : '/career/setup/5');
      }} />
</div>
</main>;
}
