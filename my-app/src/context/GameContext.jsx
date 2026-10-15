import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'sideline_v1';

const defaultSettings = {
  animations: true,
  reducedMotion: false,
  theme: 'dark',
  fontSize: 'medium',
};

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') return parsed;
    return null;
  } catch {
    return null;
  }
}

function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage full or unavailable
  }
}

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [careers, setCareers] = useState([]);
  const [currentCareerId, setCurrentCareerId] = useState(null);
  const [careerDraft, setCareerDraft] = useState(null);
  const [settings, setSettings] = useState(defaultSettings);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = loadFromStorage();
    if (stored) {
      if (stored.careers) setCareers(stored.careers);
      if (stored.currentCareerId) setCurrentCareerId(stored.currentCareerId);
      if (stored.settings) setSettings({ ...defaultSettings, ...stored.settings });
    }
    setHasLoaded(true);
  }, []);

  // Persist to localStorage whenever state changes
  useEffect(() => {
    if (!hasLoaded) return;
    saveToStorage({ careers, currentCareerId, settings });
  }, [careers, currentCareerId, settings, hasLoaded]);

  const currentCareer = careers.find(c => c.id === currentCareerId) || null;

  const saveCareer = useCallback((career) => {
    setCareers(prev => {
      const exists = prev.find(c => c.id === career.id);
      if (exists) {
        return prev.map(c => c.id === career.id ? { ...c, ...career, updatedAt: Date.now() } : c);
      }
      return [...prev, { ...career, createdAt: Date.now(), updatedAt: Date.now() }];
    });
    setCurrentCareerId(career.id);
  }, []);

  const deleteCareer = useCallback((id) => {
    setCareers(prev => prev.filter(c => c.id !== id));
    setCurrentCareerId(prev => prev === id ? null : prev);
  }, []);

  const renameCareer = useCallback((id, name) => {
    setCareers(prev => prev.map(c => c.id === id ? { ...c, name, updatedAt: Date.now() } : c));
  }, []);

  const openCareer = useCallback((id) => {
    setCurrentCareerId(id);
  }, []);

  const updateSettings = useCallback((updates) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const updateDraft = useCallback((updates) => {
    setCareerDraft(prev => prev ? { ...prev, ...updates } : { ...updates });
  }, []);

  const clearDraft = useCallback(() => {
    setCareerDraft(null);
  }, []);

  return (
    <GameContext.Provider value={{
      careers,
      currentCareer,
      currentCareerId,
      careerDraft,
      settings,
      hasLoaded,
      saveCareer,
      deleteCareer,
      renameCareer,
      openCareer,
      updateSettings,
      updateDraft,
      clearDraft,
      setCurrentCareerId,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
