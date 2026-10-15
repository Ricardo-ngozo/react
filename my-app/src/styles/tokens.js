// SIDELINE Design Tokens
export const tokens = {
  bg: '#0D0D0D',
  surface: '#161616',
  surfaceHover: '#1E1E1E',
  border: '#2A2A2A',
  borderHover: '#3A3A3A',
  text: '#F0EDE8',
  muted: '#888888',
  mutedLight: '#AAAAAA',
  accent: '#C8FF00',
  accentDim: 'rgba(200,255,0,0.12)',
  accentBorder: 'rgba(200,255,0,0.3)',
  error: '#FF4444',
  success: '#00CC66',
  font: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  fontDisplay: "'Barlow Condensed', 'Inter', Arial, sans-serif",
  radius: {
    sm: '4px',
    md: '6px',
    lg: '10px',
    xl: '16px',
  },
  shadow: {
    card: '0 2px 20px rgba(0,0,0,0.4)',
    modal: '0 8px 60px rgba(0,0,0,0.8)',
    accent: '0 0 20px rgba(200,255,0,0.2)',
  },
  transition: {
    fast: '0.12s ease',
    base: '0.2s ease',
    slow: '0.35s ease',
  },
};

export const globalCSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html { scroll-behavior: smooth; }

  body {
    background: ${tokens.bg};
    color: ${tokens.text};
    font-family: ${tokens.font};
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  a { color: inherit; text-decoration: none; }

  button { font-family: ${tokens.font}; }

  input, select, textarea { font-family: ${tokens.font}; }

  ::selection { background: ${tokens.accent}; color: #000; }

  :focus-visible {
    outline: 2px solid ${tokens.accent};
    outline-offset: 3px;
    border-radius: 2px;
  }

  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: ${tokens.bg}; }
  ::-webkit-scrollbar-thumb { background: ${tokens.border}; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: ${tokens.borderHover}; }

  @media (prefers-reduced-motion: reduce) {
    * { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
  }
`;
