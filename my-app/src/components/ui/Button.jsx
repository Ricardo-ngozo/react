import { tokens } from '../../styles/tokens.js';

export function Button({ children, variant = 'primary', size = 'md', onClick, disabled, type = 'button', style, ...props }) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    border: 'none',
    borderRadius: tokens.radius.md,
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: tokens.font,
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    transition: `all ${tokens.transition.base}`,
    opacity: disabled ? 0.45 : 1,
    whiteSpace: 'nowrap',
  };

  const sizes = {
    sm: { fontSize: 11, padding: '8px 14px' },
    md: { fontSize: 12, padding: '11px 20px' },
    lg: { fontSize: 13, padding: '14px 28px' },
    xl: { fontSize: 14, padding: '16px 36px' },
  };

  const variants = {
    primary: {
      background: tokens.accent,
      color: '#000',
    },
    ghost: {
      background: 'transparent',
      color: tokens.text,
      border: `1px solid ${tokens.border}`,
    },
    outline: {
      background: 'transparent',
      color: tokens.accent,
      border: `1px solid ${tokens.accentBorder}`,
    },
    danger: {
      background: 'transparent',
      color: tokens.error,
      border: `1px solid rgba(255,68,68,0.3)`,
    },
    surface: {
      background: tokens.surface,
      color: tokens.text,
      border: `1px solid ${tokens.border}`,
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
      onMouseEnter={e => {
        if (disabled) return;
        if (variant === 'primary') {
          e.currentTarget.style.filter = 'brightness(1.1)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        } else if (variant === 'ghost') {
          e.currentTarget.style.background = tokens.surface;
          e.currentTarget.style.borderColor = tokens.borderHover;
        } else if (variant === 'outline') {
          e.currentTarget.style.background = tokens.accentDim;
          e.currentTarget.style.borderColor = tokens.accent;
        } else if (variant === 'surface') {
          e.currentTarget.style.borderColor = tokens.borderHover;
          e.currentTarget.style.background = tokens.surfaceHover;
        } else if (variant === 'danger') {
          e.currentTarget.style.background = 'rgba(255,68,68,0.1)';
        }
      }}
      onMouseLeave={e => {
        if (disabled) return;
        if (variant === 'primary') {
          e.currentTarget.style.filter = '';
          e.currentTarget.style.transform = '';
        } else if (variant === 'ghost') {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.borderColor = tokens.border;
        } else if (variant === 'outline') {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.borderColor = tokens.accentBorder;
        } else if (variant === 'surface') {
          e.currentTarget.style.borderColor = tokens.border;
          e.currentTarget.style.background = tokens.surface;
        } else if (variant === 'danger') {
          e.currentTarget.style.background = 'transparent';
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
}
