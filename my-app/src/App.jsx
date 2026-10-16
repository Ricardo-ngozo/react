import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, Link, useRouteError, useLocation } from 'react-router-dom';
import { GameProvider } from './context/GameContext.jsx';
import { useGame } from './context/useGame.js';
import { Wordmark } from './components/ui/Primitives.jsx';
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
function Layout() {
  const {
    storageError
  } = useGame();
  const {
    pathname
  } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return <>
<a className="skip-link" href="#main-content">Skip to content</a>
<div id="main-content" className="route-view route-enter" key={pathname}>
<Outlet />
</div>{storageError && <div role="alert" className="storage-alert">{storageError} <Link to="/settings?tab=data">Manage backups</Link>
</div>}</>;
}
function NotFound() {
  const error = useRouteError();
  return <main className="empty-state" style={{
    minHeight: '100dvh',
    justifyContent: 'center'
  }}>
<Wordmark />
<p className="eyebrow" style={{
      marginTop: 30
    }}>{error ? 'Something went off the pitch' : 'Offside. Page not found.'}</p>
<h1>Let’s get you back.</h1>
<p>Your saved careers are still in your library.</p>
<Link to="/menu" className="btn btn-primary">Main menu →</Link>
</main>;
}
const router = createBrowserRouter([{
  element: <Layout />,
  errorElement: <NotFound />,
  children: [{
    path: '/',
    element: <TitleScreen />
  }, {
    path: '/menu',
    element: <MainMenu />
  }, {
    path: '/settings',
    element: <Settings />
  }, {
    path: '/career/new',
    element: <NewCareer />
  }, {
    path: '/career/quick',
    element: <QuickStart />
  }, {
    path: '/career/setup/:step',
    element: <CareerSetup />
  }, {
    path: '/career/clubs',
    element: <TeamSelection />
  }, {
    path: '/explore',
    element: <WorldExplorer />
  }, {
    path: '/appointment/:id',
    element: <Appointment />
  }, {
    path: '/careers',
    element: <CareerLibrary />
  }, {
    path: '/hq/:id',
    element: <Headquarters />
  }, {
    path: '*',
    element: <NotFound />
  }]
}]);
export default function App() {
  return <GameProvider>
<RouterProvider router={router} />
</GameProvider>;
}
