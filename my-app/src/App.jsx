import { useState, useEffect } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  useRouteError,
  isRouteErrorResponse,
  useNavigate,
} from 'react-router-dom';

import { GameProvider } from './context/GameContext.jsx';
import { globalCSS, tokens } from './styles/tokens.js';

import SplashScreen from './pages/SplashScreen.jsx';
import TitleScreen from './pages/TitleScreen.jsx';
import MainMenu from './pages/MainMenu.jsx';
import Settings from './pages/Settings.jsx';
import NewCareer from './pages/NewCareer.jsx';
import QuickStart from './pages/QuickStart.jsx';
import CareerSetup from './pages/CareerSetup.jsx';
import WorldExplorer from './pages/WorldExplorer.jsx';
import TeamSelection from './pages/TeamSelection.jsx';
import Appointment from './pages/Appointment.jsx';
import CareerLibrary from './pages/CareerLibrary.jsx';
import Headquarters from './pages/Headquarters.jsx';

// ── 404 / Error page ─────────────────────────────────────────────────────────
function NotFound() {
  const error = useRouteError();
  const navigate = useNavigate();
  const isNotFound = !error || (isRouteErrorResponse(error) && error.status === 404);

  useEffect(() => {
    document.title = 'SIDELINE — Not Found';
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: tokens.bg,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      textAlign: 'center',
    }}>
      <p style={{ fontSize: 'clamp(64px, 12vw, 96px)', fontWeight: 900, color: tokens.border, lineHeight: 1, marginBottom: 16, fontFamily: tokens.fontDisplay }}>
        {isNotFound ? '404' : 'ERR'}
      </p>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>
        {isNotFound ? 'Page not found' : 'Something went wrong'}
      </h1>
      <p style={{ fontSize: 14, color: tokens.muted, maxWidth: 320, lineHeight: 1.6, marginBottom: 32 }}>
        {isNotFound ? 'This route doesn\'t exist. Head back to the main menu.' : 'An unexpected error occurred.'}
      </p>
      <button
        onClick={() => navigate('/menu')}
        style={{
          fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
          color: '#000', background: tokens.accent, border: 'none',
          borderRadius: tokens.radius.md, padding: '11px 24px', cursor: 'pointer',
          fontFamily: tokens.font,
        }}
      >
        Back to Menu
      </button>
    </div>
  );
}

// ── Router ────────────────────────────────────────────────────────────────────
const router = createBrowserRouter([
  { path: '/', element: <TitleScreen /> },
  { path: '/menu', element: <MainMenu /> },
  { path: '/settings', element: <Settings /> },
  { path: '/career/new', element: <NewCareer /> },
  { path: '/career/quick', element: <QuickStart /> },
  { path: '/career/setup/:step', element: <CareerSetup /> },
  { path: '/career/clubs', element: <TeamSelection /> },
  { path: '/explore', element: <WorldExplorer /> },
  { path: '/appointment/:id', element: <Appointment /> },
  { path: '/careers', element: <CareerLibrary /> },
  { path: '/hq/:id', element: <Headquarters /> },
  { path: '/404', element: <NotFound /> },
  { path: '*', element: <NotFound />, errorElement: <NotFound /> },
]);

// ── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [showSplash, setShowSplash] = useState(
    () => !sessionStorage.getItem('sideline_visited')
  );

  // No effect needed — lazy state init handles session check

  const handleSplashComplete = () => {
    sessionStorage.setItem('sideline_visited', '1');
    setShowSplash(false);
  };

  return (
    <GameProvider>
      <style>{globalCSS}</style>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <RouterProvider router={router} />
    </GameProvider>
  );
}
