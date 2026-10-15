import { useState } from 'react';
import { tokens } from '../../styles/tokens.js';

export function Card({ children, onClick, selected, style, accent, ...props }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: tokens.surface,
        border: `1px solid ${selected ? tokens.accent : hovered && onClick ? tokens.borderHover : tokens.border}`,
        borderRadius: tokens.radius.lg,
        padding: 20,
        cursor: onClick ? 'pointer' : 'default',
        transition: `all ${tokens.transition.base}`,
        boxShadow: selected ? tokens.shadow.accent : hovered && onClick ? tokens.shadow.card : 'none',
        position: 'relative',
        overflow: 'hidden',
        ...(accent && {
          borderTopColor: accent,
          borderTopWidth: 2,
        }),
        ...style,
      }}
      {...props}
    >
      {selected && (
        <div style={{
          position: 'absolute',
          top: 10,
          right: 10,
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: tokens.accent,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11,
          color: '#000',
          fontWeight: 700,
        }}>✓</div>
      )}
      {children}
    </div>
  );
}
