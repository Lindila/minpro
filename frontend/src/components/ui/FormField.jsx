/** Composants de formulaire réutilisables */

export function FormGroup({ label, required, children, cols }) {
  return (
    <div style={{ marginBottom: 14, ...(cols ? { gridColumn: `span ${cols}` } : {}) }}>
      {label && (
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 5 }}>
          {label}{required && <span style={{ color: '#DC2626', marginLeft: 2 }}>*</span>}
        </label>
      )}
      {children}
    </div>
  )
}

const inputStyle = (extra = {}) => ({
  width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB',
  borderRadius: 9, fontSize: 13, color: '#111827', background: 'white',
  fontFamily: 'inherit', outline: 'none', transition: 'border-color .15s',
  ...extra,
})

export function Input({ type = 'text', value, onChange, placeholder, readOnly, style, min, max, step }) {
  return (
    <input
      type={type} value={value} onChange={onChange}
      placeholder={placeholder} readOnly={readOnly}
      min={min} max={max} step={step}
      style={inputStyle(style)}
      onFocus={e  => { if (!readOnly) e.target.style.borderColor = '#1B4D3E' }}
      onBlur={e   => { e.target.style.borderColor = '#E5E7EB' }}
    />
  )
}

export function Select({ value, onChange, children, style }) {
  return (
    <select
      value={value} onChange={onChange}
      style={{ ...inputStyle(style), cursor: 'pointer' }}
      onFocus={e => { e.target.style.borderColor = '#1B4D3E' }}
      onBlur={e  => { e.target.style.borderColor = '#E5E7EB' }}
    >
      {children}
    </select>
  )
}

export function Textarea({ value, onChange, placeholder, rows = 3, style }) {
  return (
    <textarea
      value={value} onChange={onChange} placeholder={placeholder} rows={rows}
      style={{ ...inputStyle({ resize: 'none', ...style }) }}
      onFocus={e => { e.target.style.borderColor = '#1B4D3E' }}
      onBlur={e  => { e.target.style.borderColor = '#E5E7EB' }}
    />
  )
}
