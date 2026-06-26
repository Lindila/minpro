const VARIANTS = {
  green:  { bg: '#DCFCE7', color: '#166534' },
  blue:   { bg: '#DBEAFE', color: '#1D4ED8' },
  yellow: { bg: '#FEF9C3', color: '#854D0E' },
  red:    { bg: '#FEE2E2', color: '#991B1B' },
  gray:   { bg: '#F3F4F6', color: '#374151' },
  purple: { bg: '#F3E8FF', color: '#7C3AED' },
}

export const STATUS_VARIANT = {
  'En cours':       'green',
  'En préparation': 'blue',
  'Suspendu':       'yellow',
  'Clôturé':        'gray',
  'Archivé':        'gray',
}
export const MS_VARIANT  = { done: 'green', pending: 'blue', late: 'red' }
export const DOC_VARIANT = { valid: 'green', pending: 'yellow', draft: 'gray', rejete: 'red' }

export default function Badge({ variant = 'gray', children, style }) {
  const v = VARIANTS[variant] ?? VARIANTS.gray
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: '2px 9px',
      borderRadius: 20, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap',
      background: v.bg, color: v.color, ...style,
    }}>
      {children}
    </span>
  )
}
