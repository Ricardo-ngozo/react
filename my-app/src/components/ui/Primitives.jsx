import { useId } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from './Icon.jsx';
export function Wordmark({
  small = false
}) {
  return <span className={`wordmark ${small ? 'wordmark-small' : ''}`}>SIDE<span>LINE</span>
<i />
</span>;
}
export function PageHeader({
  eyebrow,
  title,
  description,
  action,
  back = '/menu'
}) {
  return <>
<header className="page-topbar">
<Link to={back} className="back-link">
<Icon name="back" size={16} /> Back</Link>
<Link to="/menu" aria-label="SIDELINE main menu">
<Wordmark small />
</Link>
<span className="topbar-note">FOOTBALL. YOUR WAY.</span>
</header>
    <div className="page-heading">
<div>
<p className="eyebrow">{eyebrow}</p>
<h1>{title}</h1>{description && <p className="page-description">{description}</p>}</div>{action}</div>
</>;
}
export function Button({
  children,
  icon,
  endIcon,
  variant = 'primary',
  className = '',
  size,
  ...props
}) {
  return <button type="button" className={`btn btn-${variant} ${size ? `btn-${size}` : ''} ${className}`} {...props}>{icon && <Icon name={icon} size={17} />}{children}{endIcon && <Icon name={endIcon} size={17} />}</button>;
}
export function Chip({
  children,
  tone = '',
  className = '',
  ...props
}) {
  return <span className={`chip ${tone ? `chip-${tone}` : ''} ${className}`} {...props}>{children}</span>;
}
export function Field({
  label,
  hint,
  children,
  className = ''
}) {
  return <label className={`field ${className}`}>
<span className="field-label">{label}</span>{children}{hint && <span className="field-hint">{hint}</span>}</label>;
}
export function Toggle({
  label,
  description,
  checked,
  onChange
}) {
  const id = useId();
  return <div className="setting-row">
<div>
<label id={id}>{label}</label>{description && <p>{description}</p>}</div>
<button type="button" role="switch" aria-labelledby={id} aria-checked={checked} className={`switch ${checked ? 'is-on' : ''}`} onClick={() => onChange(!checked)}>
<span />
</button>
</div>;
}
export function EmptyState({
  icon = 'search',
  title,
  description,
  action
}) {
  return <div className="empty-state">
<div className="empty-icon">
<Icon name={icon} size={28} />
</div>
<h3>{title}</h3>
<p>{description}</p>{action}</div>;
}
export function Meter({
  value,
  tone = '',
  label
}) {
  return <div className={`meter ${tone}`} role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}>
<span style={{
      width: `${Math.min(100, Math.max(0, value))}%`
    }} />
</div>;
}
export function BackButton() {
  const navigate = useNavigate();
  return <Button variant="ghost" icon="back" onClick={() => navigate('/menu')}>Main menu</Button>;
}
