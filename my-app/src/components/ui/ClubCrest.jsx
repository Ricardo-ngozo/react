import { tokens } from '../../styles/tokens.js';

// Placeholder crest using club initials and colour
export function ClubCrest({ club, size = 48 }) {
  if (!club) return null;
  const initials = club.shortName
    ? club.shortName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : club.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const fontSize = size < 36 ? size * 0.38 : size < 60 ? size * 0.32 : size * 0.28;

  return (
    <div
      aria-label={`${club.name} crest`}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${club.color}33 0%, ${club.color}66 100%)`,
        border: `2px solid ${club.color}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        fontFamily: tokens.fontDisplay,
        fontWeight: 900,
        fontSize: fontSize,
        color: club.color,
        letterSpacing: '-0.02em',
        userSelect: 'none',
      }}
    >
      {initials}
    </div>
  );
}

export function LeagueIcon({ league, size = 32 }) {
  if (!league) return null;
  const initial = league.name[0].toUpperCase();

  return (
    <div
      aria-label={league.name}
      style={{
        width: size,
        height: size,
        borderRadius: tokens.radius.sm,
        background: tokens.surface,
        border: `1px solid ${tokens.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.4,
        fontWeight: 700,
        color: tokens.muted,
        flexShrink: 0,
      }}
    >
      {initial}
    </div>
  );
}
