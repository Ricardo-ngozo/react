import { CLUBS } from './clubs.js';
import { FORMATIONS, TRAINING_OPTIONS } from './football.js';
const record = value => value && typeof value === 'object' && !Array.isArray(value);
const strings = value => Array.isArray(value) ? [...new Set(value.filter(v => typeof v === 'string'))].slice(0, 1000) : [];
const short = value => typeof value === 'string' ? value.slice(0, 2500) : '';
export function normalizeTactics(value) {
  if (!record(value) || !FORMATIONS[value.formation]) return null;
  const next = {
    formation: value.formation,
    mentality: ['cautious', 'balanced', 'positive'].includes(value.mentality) ? value.mentality : 'balanced',
    buildUp: ['Short passing', 'Mixed passing', 'Direct passing'].includes(value.buildUp) ? value.buildUp : 'Mixed passing',
    lineup: {},
    roles: {}
  };
  for (const key of ['tempo', 'width', 'pressing', 'line']) next[key] = Number.isFinite(value[key]) ? Math.max(0, Math.min(100, value[key])) : 55;
  for (let i = 0; i < 11; i++) {
    if (typeof value.lineup?.[i] === 'string') next.lineup[i] = value.lineup[i];
    if (typeof value.roles?.[i] === 'string') next.roles[i] = value.roles[i].slice(0, 60);
  }
  return next;
}
export function normalizeWorkspace(value) {
  if (!record(value)) return {};
  const next = {};
  const tactics = normalizeTactics(value.tactics);
  if (tactics) next.tactics = tactics;
  if (Array.isArray(value.sessions) && value.sessions.length === 6 && value.sessions.every(s => TRAINING_OPTIONS.includes(s))) next.sessions = value.sessions;
  if (['Light', 'Balanced', 'Intense'].includes(value.intensity)) next.intensity = value.intensity;
  for (const key of ['shortlist', 'readMessages', 'reviewedFixtures', 'signedOffFixtures']) next[key] = strings(value[key]);
  if (typeof value.captain === 'string') next.captain = value.captain;
  if (typeof value.briefingComplete === 'boolean') next.briefingComplete = value.briefingComplete;
  if (record(value.fixtureNotes)) next.fixtureNotes = Object.fromEntries(Object.entries(value.fixtureNotes).filter(([key, v]) => typeof key === 'string' && typeof v === 'string').slice(0, 300).map(([k, v]) => [k, short(v)]));
  next.notes = Array.isArray(value.notes) ? value.notes.filter(n => record(n) && typeof n.id === 'string' && typeof n.title === 'string' && typeof n.body === 'string').slice(0, 300).map(n => ({
    id: n.id,
    title: n.title.slice(0, 80),
    body: short(n.body),
    category: short(n.category) || 'General',
    createdAt: Number.isFinite(n.createdAt) ? n.createdAt : 0
  })) : [];
  next.presets = Array.isArray(value.presets) ? value.presets.filter(p => record(p) && typeof p.id === 'string' && typeof p.name === 'string' && normalizeTactics(p.tactics)).slice(0, 12).map(p => ({
    id: p.id,
    name: p.name.slice(0, 40),
    tactics: normalizeTactics(p.tactics)
  })) : [];
  return next;
}
export function normalizeCareer(value) {
  if (!record(value) || typeof value.id !== 'string' || !value.id || typeof value.clubId !== 'string' || !CLUBS.some(c => c.id === value.clubId) || typeof value.name !== 'string') return null;
  return {
    ...value,
    name: value.name.slice(0, 150),
    workspace: normalizeWorkspace(value.workspace)
  };
}
export function parseCareerBackup(data) {
  if (!record(data) || !Array.isArray(data.careers) || data.careers.length > 100) throw new Error('Choose a SIDELINE career backup containing up to 100 careers.');
  const careers = data.careers.map(normalizeCareer);
  if (careers.some(c => !c) || new Set(careers.map(c => c.id)).size !== careers.length) throw new Error('The backup contains an invalid or duplicate career. Your existing saves have been kept.');
  return careers;
}
