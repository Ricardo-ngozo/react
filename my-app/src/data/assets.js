/**
 * SIDELINE asset manifest.
 * Images were checked against the originals in assets/avatars and game assets.
 * Optimized portraits retain their alpha channel for clean compositing.
 */

const asset = (filename) => `/assets/optimized/${filename}`;

export const AVATARS = [
  {
    id: 'avatar-a',
    src: asset('portrait-braided-blazer.webp'),
    label: 'The Visionary',
    desc: 'Braided hair, black blazer and crew-neck top',
  },
  {
    id: 'avatar-b',
    src: asset('portrait-dark-overcoat.webp'),
    label: 'The Tactician',
    desc: 'Swept-back dark hair, stubble and black overcoat',
  },
  {
    id: 'avatar-c',
    src: asset('portrait-short-hair-blazer.webp'),
    label: 'The Strategist',
    desc: 'Short dark hair, black blazer and high-neck top',
  },
  {
    id: 'avatar-e',
    src: asset('portrait-beard-coat.webp'),
    label: 'The Standard Setter',
    desc: 'Short textured hair, full beard and dark coat',
  },
  {
    id: 'avatar-g',
    src: asset('portrait-training-jacket.webp'),
    label: 'The Prodigy',
    desc: 'Short textured hair and black training jacket',
  },
];

export const DEFAULT_AVATAR_ID = 'avatar-b';

// Earlier saves could select these IDs, which previously pointed to scenery.
const AVATAR_ALIASES = { 'avatar-d': 'avatar-a', 'avatar-f': 'avatar-e' };

export function getAvatarById(id) {
  const resolvedId = AVATAR_ALIASES[id] || id;
  return AVATARS.find((avatar) => avatar.id === resolvedId)
    || AVATARS.find((avatar) => avatar.id === DEFAULT_AVATAR_ID);
}

export const ENV = {
  /** Neon green tunnel opening onto a floodlit pitch. */
  tunnelGreen: asset('tunnel-green.webp'),

  /** Red-lit changing-room corridor leading towards the stadium. */
  tunnelRed: asset('corridor-red.webp'),

  /** Elevated grandstand view; retained key for existing page imports. */
  stadiumAerial: asset('stadium-grandstand.webp'),

  /** Wide view of the illuminated stadium bowl at night. */
  stadiumNight: asset('stadium-grandstand.webp'),

  /** Low pitch-side view beneath a sunset sky and floodlights. */
  stadiumPitch: asset('pitch-sunset.webp'),

  /** Alternate role sharing the available green tunnel photograph. */
  stadiumTunnel2: asset('tunnel-green.webp'),

  /** Warmly lit office overlooking a stadium through full-height windows. */
  managerOffice: asset('manager-office.webp'),
};
