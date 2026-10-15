import { tokens } from '../../styles/tokens.js';

export function Badge({ children, variant = 'default', style }) {
  const variants = {
    default: { background: tokens.border, color: tokens.muted },
    accent: { background: tokens.accentDim, color: tokens.accent },
    success: { background: 'rgba(0,204,102,0.12)', color: tokens.success },
    error: { background: 'rgba(255,68,68,0.12)', color: tokens.error },
    demo: { background: 'rgba(255,170,0,0.12)', color: '#FFAA00' },
  };

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      padding: '3px 8px',
      borderRadius: 4,
      ...variants[variant],
      ...style,
    }}>
      {children}
    </span>
  );
}

export function DemoBadge() {
  return <Badge variant="demo">Demo</Badge>;
}
