import { useState } from 'react';
import { tokens } from '../../styles/tokens.js';

export function Input({ label, value, onChange, placeholder, type = 'text', error, hint, style, ...props }) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: focused ? tokens.accent : tokens.muted,
          transition: `color ${tokens.transition.fast}`,
        }}>
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          background: tokens.surface,
          border: `1px solid ${error ? tokens.error : focused ? tokens.accent : tokens.border}`,
          borderRadius: tokens.radius.md,
          color: tokens.text,
          fontSize: 14,
          padding: '10px 14px',
          width: '100%',
          outline: 'none',
          transition: `border-color ${tokens.transition.fast}`,
          fontFamily: tokens.font,
          ...style,
        }}
        {...props}
      />
      {hint && !error && (
        <span style={{ fontSize: 11, color: tokens.muted }}>{hint}</span>
      )}
      {error && (
        <span style={{ fontSize: 11, color: tokens.error }}>{error}</span>
      )}
    </div>
  );
}

export function Select({ label, value, onChange, options, style, ...props }) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: focused ? tokens.accent : tokens.muted,
          transition: `color ${tokens.transition.fast}`,
        }}>
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          background: tokens.surface,
          border: `1px solid ${focused ? tokens.accent : tokens.border}`,
          borderRadius: tokens.radius.md,
          color: value ? tokens.text : tokens.muted,
          fontSize: 14,
          padding: '10px 14px',
          width: '100%',
          outline: 'none',
          cursor: 'pointer',
          transition: `border-color ${tokens.transition.fast}`,
          fontFamily: tokens.font,
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
          paddingRight: 36,
          ...style,
        }}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value} style={{ background: tokens.surface }}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
