import { normalizeCareer, parseCareerBackup } from '../data/persistence.js';
import { useState, useEffect, useCallback } from 'react';
import { GameContext } from './gameContextDef.js';
const STORAGE_KEY = 'sideline_v1';
const DEFAULT_SETTINGS = {
  animations: true,
  reducedMotion: false,
  fontSize: 'medium',
  theme: 'dark',
  accent: 'lime',
  density: 'comfortable',
  contrast: 'standard',
  atmosphere: true,
  showHints: true,
  keyboardHints: true,
  currency: 'EUR',
  dateFormat: 'day-first',
  scoutingDetail: 'full',
  selectionPriority: 'balanced',
  preparationReminders: true,
  matchPresentation: 'extended',
  difficulty: 'balanced'
};
function readSaved() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    return value && typeof value === 'object' ? value : {};
  } catch {
    return {};
  }
}
function cleanSettings(settings) {
  const next = {
    ...DEFAULT_SETTINGS
  };
  if (!settings || typeof settings !== 'object') return next;
  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    if (typeof settings[key] === typeof value) next[key] = settings[key];
  }
  return next;
}
export function GameProvider({
  children
}) {
  const [initial] = useState(readSaved);
  const [careers, setCareers] = useState(() => Array.isArray(initial.careers) ? initial.careers.map(normalizeCareer).filter(Boolean) : []);
  const [currentCareerId, setCurrentCareerId] = useState(initial.currentCareerId || null);
  const [careerDraft, setCareerDraft] = useState(initial.careerDraft || null);
  const [settings, setSettings] = useState(() => cleanSettings(initial.settings));
  const [storageError, setStorageError] = useState('');
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        version: 2,
        careers,
        currentCareerId,
        careerDraft,
        settings
      }));
      queueMicrotask(() => setStorageError(''));
    } catch {
      queueMicrotask(() => setStorageError('Your browser could not save these changes. Export a backup before closing.'));
    }
  }, [careers, currentCareerId, careerDraft, settings]);
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.motion = !settings.animations ? 'off' : settings.reducedMotion ? 'reduced' : 'full';
    root.dataset.accent = settings.accent;
    root.dataset.density = settings.density;
    root.dataset.contrast = settings.contrast;
    root.dataset.text = settings.fontSize;
    root.dataset.atmosphere = settings.atmosphere ? 'on' : 'off';
  }, [settings]);
  const saveCareer = useCallback(career => {
    setCareers(prev => {
      const exists = prev.some(c => c.id === career.id);
      const next = {
        ...career,
        updatedAt: Date.now()
      };
      return exists ? prev.map(c => c.id === career.id ? {
        ...c,
        ...next
      } : c) : [...prev, {
        ...next,
        createdAt: Date.now()
      }];
    });
    setCurrentCareerId(career.id);
  }, []);
  const updateCareer = useCallback((id, updates) => {
    setCareers(prev => prev.map(c => c.id === id ? {
      ...c,
      ...(typeof updates === 'function' ? updates(c) : updates),
      updatedAt: Date.now()
    } : c));
  }, []);
  const updateWorkspace = useCallback((id, updates) => {
    setCareers(prev => prev.map(c => c.id === id ? {
      ...c,
      workspace: {
        ...c.workspace,
        ...(typeof updates === 'function' ? updates(c.workspace || {}) : updates)
      },
      updatedAt: Date.now()
    } : c));
  }, []);
  const deleteCareer = useCallback(id => {
    setCareers(prev => prev.filter(c => c.id !== id));
    setCurrentCareerId(prev => prev === id ? null : prev);
  }, []);
  const renameCareer = useCallback((id, name) => {
    if (name.trim()) updateCareer(id, {
      name: name.trim()
    });
  }, [updateCareer]);
  const openCareer = useCallback(id => setCurrentCareerId(id), []);
  const updateSettings = useCallback(updates => setSettings(prev => cleanSettings({
    ...prev,
    ...updates
  })), []);
  const resetSettings = useCallback(() => setSettings({
    ...DEFAULT_SETTINGS
  }), []);
  const updateDraft = useCallback(updates => setCareerDraft(prev => ({
    ...prev,
    ...updates
  })), []);
  const clearDraft = useCallback(() => setCareerDraft(null), []);
  const importCareers = useCallback(data => {
    const incoming = parseCareerBackup(data);
    setCareers(prev => [...prev, ...incoming.filter(c => !prev.some(existing => existing.id === c.id))]);
  }, []);
  return <GameContext.Provider value={{
    careers,
    currentCareer: careers.find(c => c.id === currentCareerId) || null,
    currentCareerId,
    careerDraft,
    settings,
    hasLoaded: true,
    storageError,
    saveCareer,
    updateCareer,
    updateWorkspace,
    deleteCareer,
    renameCareer,
    openCareer,
    updateSettings,
    resetSettings,
    updateDraft,
    clearDraft,
    setCurrentCareerId,
    importCareers
  }}>{children}</GameContext.Provider>;
}
