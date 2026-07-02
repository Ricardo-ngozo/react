import { useState, useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Link,
  useParams,
  useNavigate,
  isRouteErrorResponse,
  useRouteError,
} from "react-router-dom";

// ─── Data ────────────────────────────────────────────────────────────────────

const ITEMS = [
  {
    id: "1",
    name: "RCD Mallorca",
    league: "La Liga",
    founded: 1916,
    stadium: "Estadi de Son Moix",
    capacity: 23142,
    description:
      "A club from the Balearic Islands with a rich history in Spanish football. Known for their passionate local support and stunning island backdrop.",
    color: "#e8001c",
  },
  {
    id: "2",
    name: "UD Las Palmas",
    league: "La Liga",
    founded: 1949,
    stadium: "Estadio Gran Canaria",
    capacity: 32400,
    description:
      "Representing the Canary Islands, Las Palmas play an attractive style of football and have a dedicated fan base across the archipelago.",
    color: "#FFCC00",
  },
  {
    id: "3",
    name: "Girona FC",
    league: "La Liga",
    founded: 1930,
    stadium: "Estadi Montilivi",
    capacity: 13500,
    description:
      "A club from Catalonia that has risen through the divisions to establish themselves in La Liga, surprising many with their quality and organisation.",
    color: "#cc0000",
  },
  {
    id: "4",
    name: "Getafe CF",
    league: "La Liga",
    founded: 1946,
    stadium: "Coliseum Alfonso Pérez",
    capacity: 17700,
    description:
      "A Madrid satellite club known for their physical, organised style. Often punch above their weight with limited resources.",
    color: "#005eb8",
  },
  {
    id: "5",
    name: "Celta Vigo",
    league: "La Liga",
    founded: 1923,
    stadium: "Abanca-Balaídos",
    capacity: 29000,
    description:
      "From Galicia in northwestern Spain, Celta Vigo have a tradition of developing technical players and playing attractive football.",
    color: "#87CEEB",
  },
];

// ─── Design tokens ────────────────────────────────────────────────────────────

// CHANGE TO:
const tokens = {
  bg: "#0d0d0d",
  surface: "#161616",
  border: "#2a2a2a",
  borderHover: "#3a3a3a",
  text: "#f0ede8",
  muted: "#888",
  accent: "#c8ff00",
  font: "'Inter', 'Helvetica Neue', Arial, sans-serif",
};

const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: ${tokens.bg};
    color: ${tokens.text};
    font-family: ${tokens.font};
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }

  a { color: inherit; text-decoration: none; }

  ::selection { background: ${tokens.accent}; color: #000; }

  :focus-visible {
    outline: 2px solid ${tokens.accent};
    outline-offset: 3px;
    border-radius: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    * { transition: none !important; animation: none !important; }
  }
`;

// ─── Shared components ────────────────────────────────────────────────────────

function Nav() {
  return (
    <nav style={{
      borderBottom: `1px solid ${tokens.border}`,
      padding: "0 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: 56,
      position: "sticky",
      top: 0,
      background: tokens.bg,
      zIndex: 100,
    }}>
      <Link to="/" style={{
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: tokens.accent,
      }}>
        FM Scout
      </Link>
      <Link to="/" style={{
        fontSize: 12,
        color: tokens.muted,
        letterSpacing: "0.06em",
        transition: "color 0.15s",
      }}
        onMouseEnter={e => e.target.style.color = tokens.text}
        onMouseLeave={e => e.target.style.color = tokens.muted}
      >
        ← All Clubs
      </Link>
    </nav>
  );
}

// ─── Home page ────────────────────────────────────────────────────────────────

function Home() {
  const [hovered, setHovered] = useState(null);

  return (
    <div>
      <Nav />
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "56px 24px 80px" }}>
        <p style={{
          fontSize: 11,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: tokens.accent,
          fontWeight: 600,
          marginBottom: 12,
        }}>
          La Liga · Small Club Index
        </p>
        <h1 style={{
          fontSize: "clamp(32px, 6vw, 56px)",
          fontWeight: 900,
          lineHeight: 1.05,
          marginBottom: 8,
          letterSpacing: "-0.02em",
        }}>
          Pick your<br />underdog.
        </h1>
        <p style={{
          color: tokens.muted,
          fontSize: 15,
          marginBottom: 48,
          maxWidth: 420,
          lineHeight: 1.6,
        }}>
          Five clubs. One mission. Choose the team you're going to build from the ground up.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {ITEMS.map((item) => (
            <Link
              key={item.id}
              to={`/item/${item.id}`}
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "18px 20px",
                border: `1px solid ${hovered === item.id ? tokens.borderHover : tokens.border}`,
                borderRadius: 6,
                background: hovered === item.id ? tokens.surface : "transparent",
                transition: "background 0.15s, border-color 0.15s",
                gap: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: item.color,
                  flexShrink: 0,
                  boxShadow: hovered === item.id ? `0 0 8px ${item.color}88` : "none",
                  transition: "box-shadow 0.2s",
                }} />
                <span style={{
                  fontSize: 15,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                }}>
                  {item.name}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <span style={{
                  fontSize: 11,
                  color: tokens.muted,
                  letterSpacing: "0.06em",
                }}>
                  Est. {item.founded}
                </span>
                <span style={{
                  fontSize: 11,
                  color: hovered === item.id ? tokens.accent : tokens.muted,
                  transition: "color 0.15s",
                  letterSpacing: "0.04em",
                }}>
                  View →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

// ─── Detail page ──────────────────────────────────────────────────────────────

function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = ITEMS.find((i) => i.id === id);

  useEffect(() => {
    if (!item) navigate("/404", { replace: true });
  }, [item, navigate]);

  if (!item) return null;

  const stats = [
    { label: "Founded", value: item.founded },
    { label: "Stadium", value: item.stadium },
    { label: "Capacity", value: item.capacity.toLocaleString() },
    { label: "League", value: item.league },
  ];

  return (
    <div>
      <Nav />
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "56px 24px 80px" }}>

        {/* Club color bar */}
        <div style={{
          height: 3,
          width: 40,
          background: item.color,
          marginBottom: 24,
          borderRadius: 2,
        }} />

        <p style={{
          fontSize: 11,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: tokens.muted,
          fontWeight: 600,
          marginBottom: 10,
        }}>
          Club #{item.id} · {item.league}
        </p>

        <h1 style={{
          fontSize: "clamp(28px, 6vw, 52px)",
          fontWeight: 900,
          letterSpacing: "-0.025em",
          lineHeight: 1.05,
          marginBottom: 20,
        }}>
          {item.name}
        </h1>

        <p style={{
          fontSize: 16,
          color: tokens.muted,
          lineHeight: 1.7,
          maxWidth: 520,
          marginBottom: 48,
        }}>
          {item.description}
        </p>

        {/* Stats grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 1,
          background: tokens.border,
          border: `1px solid ${tokens.border}`,
          borderRadius: 6,
          overflow: "hidden",
          marginBottom: 48,
        }}>
          {stats.map((s) => (
            <div key={s.label} style={{
              background: tokens.surface,
              padding: "20px",
            }}>
              <p style={{
                fontSize: 10,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: tokens.muted,
                marginBottom: 6,
                fontWeight: 600,
              }}>
                {s.label}
              </p>
              <p style={{
                fontSize: 15,
                fontWeight: 600,
                color: tokens.text,
              }}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate("/")}
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: tokens.accent,
            background: "transparent",
            border: `1px solid ${tokens.accent}33`,
            borderRadius: 4,
            padding: "10px 18px",
            cursor: "pointer",
            transition: "background 0.15s, border-color 0.15s",
            fontFamily: tokens.font,
          }}
          onMouseEnter={e => {
            e.target.style.background = `${tokens.accent}18`;
            e.target.style.borderColor = `${tokens.accent}88`;
          }}
          onMouseLeave={e => {
            e.target.style.background = "transparent";
            e.target.style.borderColor = `${tokens.accent}33`;
          }}
        >
          ← Back to all clubs
        </button>
      </main>
    </div>
  );
}

// ─── 404 page ─────────────────────────────────────────────────────────────────

function NotFound() {
  const error = useRouteError();
  const navigate = useNavigate();
  const is404 = !error || (isRouteErrorResponse(error) && error.status === 404);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      textAlign: "center",
    }}>
      <p style={{
        fontSize: 80,
        fontWeight: 900,
        letterSpacing: "-0.04em",
        color: tokens.border,
        lineHeight: 1,
        marginBottom: 16,
        userSelect: "none",
      }}>
        {is404 ? "404" : "Err"}
      </p>
      <h1 style={{
        fontSize: 20,
        fontWeight: 700,
        marginBottom: 10,
        letterSpacing: "-0.01em",
      }}>
        {is404 ? "Page not found" : "Something went wrong"}
      </h1>
      <p style={{
        fontSize: 14,
        color: tokens.muted,
        maxWidth: 320,
        lineHeight: 1.6,
        marginBottom: 32,
      }}>
        {is404
          ? "This route doesn't exist. Check the URL or head back to the club index."
          : "An unexpected error occurred. Try going back to safety."}
      </p>
      <button
        onClick={() => navigate("/")}
        style={{
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#000",
          background: tokens.accent,
          border: "none",
          borderRadius: 4,
          padding: "10px 20px",
          cursor: "pointer",
          fontFamily: tokens.font,
        }}
      >
        Back to home
      </button>
    </div>
  );
}

// ─── Router ───────────────────────────────────────────────────────────────────

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/item/:id", element: <Detail /> },
  { path: "/404", element: <NotFound /> },
  { path: "*", element: <NotFound />, errorElement: <NotFound /> },
]);

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <>
      <style>{globalStyle}</style>
      <RouterProvider router={router} />
    </>
  );
}