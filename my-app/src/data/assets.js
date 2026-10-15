/**
 * SIDELINE Asset Manifest
 * All paths are relative to /public — served at root URL by Vite.
 * Use these keys everywhere instead of hardcoded paths.
 */

// ── Manager Avatars ──────────────────────────────────────────────────────────
// Realistic rendered portraits for manager creation.
// White/transparent bg so they composite cleanly on dark surfaces.

export const AVATARS = [
  {
    id: 'avatar-a',
    src: '/assets/avatars/avatar-a.png',
    label: 'The Dark Horse',
    desc: 'Dark-skinned, formal suit, commanding presence',
  },
  {
    id: 'avatar-b',
    src: '/assets/avatars/avatar-b.png',
    label: 'The Tactician',
    desc: 'Dark hair, black coat, intense and focused',
  },
  {
    id: 'avatar-c',
    src: '/assets/avatars/avatar-c.png',
    label: 'The Veteran',
    desc: 'Experienced, composed, tactical authority',
  },
  {
    id: 'avatar-d',
    src: '/assets/avatars/avatar-d.png',
    label: 'The Visionary',
    desc: 'Ambitious, modern thinker, forward-looking',
  },
  {
    id: 'avatar-e',
    src: '/assets/avatars/avatar-e.png',
    label: 'The Powerhouse',
    desc: 'Dark-skinned, beard, zip jacket, physical authority',
  },
  {
    id: 'avatar-f',
    src: '/assets/avatars/avatar-f.png',
    label: 'The Disciplinarian',
    desc: 'Black man, formal overcoat, sharp and precise',
  },
  {
    id: 'avatar-g',
    src: '/assets/avatars/avatar-g.png',
    label: 'The Prodigy',
    desc: 'Young, black man, tracksuit, hungry to prove himself',
  },
];

export const DEFAULT_AVATAR_ID = 'avatar-b';

export function getAvatarById(id) {
  return AVATARS.find(a => a.id === id) || AVATARS.find(a => a.id === DEFAULT_AVATAR_ID);
}

// ── Environment / Background Images ─────────────────────────────────────────

export const ENV = {
  /** Green neon player tunnel — looking out onto pitch. Best for: Splash, Title */
  tunnelGreen: '/assets/environments/tunnel-green.png',

  /** Red dressing room corridor leading to pitch. Best for: Appointment Reveal */
  tunnelRed: '/assets/environments/tunnel-red.png',

  /** Aerial stadium top-down view, green pitch. Best for: Main Menu left panel */
  stadiumAerial: '/assets/environments/stadium-aerial.png',

  /** Full stadium interior, floodlights at night. Best for: Main Menu, HQ */
  stadiumNight: '/assets/environments/stadium-night.png',

  /** Pitch-level view, sunset, dramatic clouds. Best for: World Explorer, Career Mode */
  stadiumPitch: '/assets/environments/stadium-pitch.png',

  /** Duplicate tunnel-green used as second tunnel variant */
  stadiumTunnel2: '/assets/environments/stadium-tunnel2.png',

  /** Luxury manager's office overlooking a lit stadium at night. Best for: HQ */
  managerOffice: '/assets/environments/manager-office.png',
};
