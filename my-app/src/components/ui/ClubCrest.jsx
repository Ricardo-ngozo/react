export function ClubCrest({
  club,
  size = 48
}) {
  if (!club) return null;
  const initials = (club.shortName || club.name).replace(/\b(FC|CF|AFC|UD|RCD|TSG)\b/g, '').trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const color = club.color === '#000000' ? club.colorSecondary || '#f2c45a' : club.color;
  return <div className="club-crest" role="img" aria-label={`${club.name} club monogram`} style={{
    '--club-color': color,
    width: size,
    height: size * 1.12,
    fontSize: size * .3
  }}>
<svg viewBox="0 0 48 54" aria-hidden="true">
<path d="M3 4 24 1 45 4v24c0 13-21 24-21 24S3 41 3 28Z" fill="currentColor" fillOpacity=".11" stroke="currentColor" strokeWidth="1.3" />
<path d="M8 9 24 7 40 9v18c0 9-16 18-16 18S8 36 8 27Z" fill="none" stroke="currentColor" strokeWidth=".6" opacity=".4" />
</svg>
<span>{initials || club.name[0]}</span>
</div>;
}
export function LeagueIcon({
  league,
  size = 32
}) {
  return league ? <span className="league-icon" style={{
    width: size,
    height: size
  }}>{league.name[0]}</span> : null;
}
