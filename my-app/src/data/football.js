import { CLUBS } from './clubs.js';
export const FORMATIONS = {
  '4-3-3': [['LW', 20, 17], ['ST', 50, 12], ['RW', 80, 17], ['CM', 25, 43], ['CM', 75, 43], ['DM', 50, 55], ['LB', 14, 73], ['CB', 38, 77], ['CB', 62, 77], ['RB', 86, 73], ['GK', 50, 92]],
  '4-2-3-1': [['ST', 50, 12], ['LW', 20, 32], ['AM', 50, 30], ['RW', 80, 32], ['DM', 35, 54], ['DM', 65, 54], ['LB', 14, 73], ['CB', 38, 77], ['CB', 62, 77], ['RB', 86, 73], ['GK', 50, 92]],
  '4-4-2': [['ST', 35, 15], ['ST', 65, 15], ['LW', 15, 43], ['CM', 38, 46], ['CM', 62, 46], ['RW', 85, 43], ['LB', 14, 73], ['CB', 38, 77], ['CB', 62, 77], ['RB', 86, 73], ['GK', 50, 92]],
  '3-5-2': [['ST', 35, 15], ['ST', 65, 15], ['LB', 12, 43], ['CM', 32, 43], ['AM', 50, 32], ['CM', 68, 43], ['RB', 88, 43], ['CB', 25, 74], ['CB', 50, 76], ['CB', 75, 74], ['GK', 50, 92]],
  '5-3-2': [['ST', 35, 15], ['ST', 65, 15], ['CM', 28, 43], ['DM', 50, 52], ['CM', 72, 43], ['LB', 10, 68], ['CB', 30, 75], ['CB', 50, 77], ['CB', 70, 75], ['RB', 90, 68], ['GK', 50, 92]],
  '3-4-3': [['LW', 20, 16], ['ST', 50, 12], ['RW', 80, 16], ['LB', 12, 46], ['CM', 38, 48], ['CM', 62, 48], ['RB', 88, 46], ['CB', 25, 74], ['CB', 50, 76], ['CB', 75, 74], ['GK', 50, 92]]
};
export const DEFAULT_TACTICS = {
  formation: '4-3-3',
  mentality: 'balanced',
  tempo: 55,
  width: 60,
  pressing: 65,
  buildUp: 'Mixed passing',
  line: 55,
  lineup: {}
};
export const TRAINING_OPTIONS = ['Recovery', 'Ball retention', 'Attacking movement', 'Defensive shape', 'Set pieces', 'Match preparation', 'Rest'];
export const DEFAULT_SESSIONS = ['Recovery', 'Ball retention', 'Attacking movement', 'Defensive shape', 'Set pieces', 'Match preparation'];
export const PROJECTS = [{
  id: 'youth',
  label: 'Youth revolution',
  icon: 'squad',
  desc: 'Give the next generation a place to belong.'
}, {
  id: 'attacking',
  label: 'Beautiful football',
  icon: 'bolt',
  desc: 'Build a team people will remember watching.'
}, {
  id: 'defensive',
  label: 'Defensive dynasty',
  icon: 'shield',
  desc: 'Make collective discipline your advantage.'
}, {
  id: 'community',
  label: 'Club of the people',
  icon: 'home',
  desc: 'Put your supporters at the heart of the project.'
}, {
  id: 'financial',
  label: 'Sustainable growth',
  icon: 'book',
  desc: 'Build carefully. Create something that lasts.'
}, {
  id: 'continental',
  label: 'Continental ambition',
  icon: 'trophy',
  desc: 'Give your club a bigger stage to dream about.'
}];
export const PHILOSOPHIES = [{
  id: 'balanced',
  label: 'Balanced approach',
  icon: 'tactics',
  desc: 'Adapt to your opponent and the game in front of you.'
}, {
  id: 'possession',
  label: 'Possession football',
  icon: 'refresh',
  desc: 'Control the ball. Move with purpose.'
}, {
  id: 'attacking',
  label: 'Attacking football',
  icon: 'bolt',
  desc: 'Express yourself in the final third.'
}, {
  id: 'defensive',
  label: 'Defensive organisation',
  icon: 'shield',
  desc: 'Stay compact and difficult to break down.'
}, {
  id: 'counter',
  label: 'Counterattacking',
  icon: 'arrow',
  desc: 'Win it back. Find the space. Go.'
}, {
  id: 'youth',
  label: 'Youth development',
  icon: 'squad',
  desc: 'Trust potential and build for the future.'
}];
export const JOURNEYS = [{
  id: 'underdog',
  label: 'The underdog',
  icon: 'star',
  desc: 'A smaller club. A bigger possibility.'
}, {
  id: 'rebuild',
  label: 'The rebuild',
  icon: 'refresh',
  desc: 'Restore belief and create a new identity.'
}, {
  id: 'contender',
  label: 'The contender',
  icon: 'trophy',
  desc: 'Turn ambition into a place at the top.'
}, {
  id: 'blank',
  label: 'Blank canvas',
  icon: 'book',
  desc: 'Start with a club and write your own story.'
}];
export const POSITION_GROUP = {
  GK: 'GK',
  CB: 'DEF',
  LB: 'DEF',
  RB: 'DEF',
  DM: 'MID',
  CM: 'MID',
  AM: 'MID',
  LW: 'ATT',
  RW: 'ATT',
  ST: 'ATT'
};
export function hash(value) {
  return [...String(value)].reduce((n, c) => n * 31 + c.charCodeAt(0) >>> 0, 17);
}
const FIRST = ['Mateo', 'Daniel', 'Alex', 'Luca', 'Noah', 'Theo', 'Rafael', 'Elias', 'James', 'Samuel', 'Nico', 'Adrian', 'Felix', 'Leon', 'Marco', 'David', 'Oscar', 'Gabriel', 'Joel', 'Victor', 'Adam', 'Hugo', 'Isaac', 'Tomas'];
const LAST = ['Silva', 'Morgan', 'Delgado', 'Brandt', 'Pereira', 'Walsh', 'Nunes', 'Clarke', 'Owusu', 'Rossi', 'Navarro', 'Costa', 'Fischer', 'Nkosi', 'Santos', 'Reed', 'Muller', 'Almeida', 'Mensah', 'Sousa', 'Romero', 'Bennett', 'Mokoena', 'Vega'];
const POSITIONS = ['GK', 'GK', 'GK', 'LB', 'LB', 'CB', 'CB', 'CB', 'CB', 'RB', 'RB', 'DM', 'DM', 'CM', 'CM', 'CM', 'AM', 'AM', 'LW', 'LW', 'RW', 'RW', 'ST', 'ST'];
export function makeSquad(clubId) {
  const seed = hash(clubId);
  return POSITIONS.map((pos, i) => {
    const n = hash(clubId + i),
      overall = 62 + n % 20;
    const firstName = FIRST[(i + seed) % FIRST.length],
      lastName = LAST[(i * 7 + seed) % LAST.length];
    return {
      id: clubId + '-p' + i,
      number: i + 1,
      name: firstName + ' ' + lastName,
      lastName,
      pos,
      group: POSITION_GROUP[pos],
      age: 18 + n % 17,
      overall,
      potential: Math.min(94, overall + 3 + n % 12),
      fitness: 81 + n % 20,
      morale: 68 + n % 26,
      pace: 52 + n % 36,
      passing: 57 + hash(n + 'p') % 31,
      defending: pos === 'GK' ? 45 : 45 + hash(n + 'd') % 43,
      shooting: 44 + hash(n + 's') % 42,
      technique: 55 + hash(n + 't') % 33,
      composure: 58 + hash(n + 'c') % 30,
      foot: n % 4 ? 'Right' : 'Left',
      nationality: ['Spain', 'England', 'Germany', 'Portugal', 'South Africa', 'France'][n % 6],
      salary: 1800 + n % 18000
    };
  });
}
export function autoLineup(squad, formation, priority = 'balanced') {
  const used = new Set(),
    result = {};
  for (const [index, [pos]] of FORMATIONS[formation].entries()) {
    const candidates = squad.filter(p => !used.has(p.id) && (pos === 'GK' ? p.pos === 'GK' : p.pos !== 'GK'));
    const score = p => (p.pos === pos ? 70 : p.group === POSITION_GROUP[pos] ? 25 : 0) + (priority === 'youth' ? p.potential - p.age : p.overall) + (priority === 'fitness' ? p.fitness * .6 : p.fitness * .15);
    const player = candidates.sort((a, b) => score(b) - score(a))[0];
    if (player) {
      used.add(player.id);
      result[index] = player.id;
    }
  }
  return result;
}
export function getTactics(workspace, squad, priority) {
  const tactics = {
    ...DEFAULT_TACTICS,
    ...workspace?.tactics
  };
  if (!FORMATIONS[tactics.formation]) tactics.formation = '4-3-3';
  const defaults = autoLineup(squad, tactics.formation, priority),
    used = new Set(),
    lineup = {};
  for (let i = 0; i < 11; i++) {
    const saved = squad.find(p => p.id === tactics.lineup?.[i] && !used.has(p.id) && (i === 10 ? p.pos === 'GK' : p.pos !== 'GK'));
    const fallback = squad.find(p => p.id === defaults[i] && !used.has(p.id)) || squad.find(p => !used.has(p.id) && (i === 10 ? p.pos === 'GK' : p.pos !== 'GK'));
    lineup[i] = (saved || fallback).id;
    used.add(lineup[i]);
  }
  return {
    ...tactics,
    lineup
  };
}
function isoDate(offset) {
  const date = new Date(Date.UTC(2026, 6, 11 + offset));
  return date.toISOString().slice(0, 10);
}
export function makeFixtures(club) {
  const rivals = CLUBS.filter(c => c.leagueId === club.leagueId && c.id !== club.id);
  const friendlies = CLUBS.filter(c => c.countryId === club.countryId && c.leagueId !== club.leagueId && c.id !== club.id);
  const warmups = (friendlies.length >= 3 ? friendlies : [...friendlies, ...rivals]).slice(0, 3);
  return [...warmups.map((opponent, i) => ({
    id: club.id + '-friendly-' + i,
    opponentId: opponent.id,
    date: isoDate(i * 7),
    home: i !== 1,
    type: 'Friendly',
    time: i === 1 ? '18:30' : '15:00',
    round: i + 1
  })), ...[...rivals, ...rivals].map((opponent, i) => ({
    id: club.id + '-league-' + i,
    opponentId: opponent.id,
    date: isoDate(28 + i * 7),
    home: i < rivals.length ? i % 2 === 0 : (i - rivals.length) % 2 !== 0,
    type: 'League',
    time: i % 3 === 0 ? '17:30' : '15:00',
    round: i + 1
  }))];
}
export function formatDate(date, settings, options = {}) {
  return new Date(date + 'T12:00:00Z').toLocaleDateString(settings?.dateFormat === 'month-first' ? 'en-US' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    ...options,
    timeZone: 'UTC'
  });
}
export function money(value, settings) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: settings?.currency || 'EUR',
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(value);
}
export function getReadiness(workspace) {
  return [Boolean(workspace.tactics), Boolean(workspace.sessions), Boolean(workspace.reviewedFixtures?.length), Boolean(workspace.briefingComplete)].filter(Boolean).length * 25;
}
export function exportBackup(careers) {
  const blob = new Blob([JSON.stringify({
    app: 'SIDELINE',
    version: 2,
    exportedAt: new Date().toISOString(),
    careers
  }, null, 2)], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob),
    link = document.createElement('a');
  link.href = url;
  link.download = 'sideline-careers-backup.json';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
