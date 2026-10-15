import { createContext } from 'react';

// The context definition lives in its own file so that GameContext.jsx
// only exports components (GameProvider), satisfying react-refresh/only-export-components.
export const GameContext = createContext(null);
