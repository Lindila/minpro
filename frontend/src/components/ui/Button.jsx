export default function Button({
  children, variant = 'default', size = 'md', icon,
  onClick, type = 'button', disabled, style,
}) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    borderRadius: 9, fontFamily: 'inherit', fontWeight: 500,
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: '1px solid', transition: 'all .15s',
    whiteSpace: 'nowrap', opacity: disabled ? 0.55 : 1,
    userSelect: 'none',
  }
  const sizes = {
    sm:   { padding: '5px 10px',  fontSize: 12 },
    md:   { padding: '8px 14px',  fontSize: 13 },
    lg:   { padding: '10px 18px', fontSize: 14 },
    icon: { padding: '7px',       fontSize: 13 },
  }
  const variants = {
    default: { background: '#fff',     color: '#111827', borderColor: '#E5E7EB' },
    primary: { background: '#1B4D3E',  color: 'white',   borderColor: '#1B4D3E' },
    danger:  { background: '#FEE2E2',  color: '#991B1B', borderColor: '#FECACA' },
    ghost:   { background: 'transparent', color: '#6B7280', borderColor: 'transparent' },
    gold:    { background: '#D4A017',  color: 'white',   borderColor: '#D4A017' },
  }
  return (
    <button
      type={type} onClick={disabled ? undefined : onClick} disabled={disabled}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
    >
      {icon && <i className={`ti ti-${icon}`} style={{ fontSize: size === 'sm' ? 14 : 16 }} />}
      {children}
    </button>
  )
}
