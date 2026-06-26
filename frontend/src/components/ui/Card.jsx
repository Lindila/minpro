export default function Card({ children, padding = 18, style, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'white', borderRadius: 12, border: '1px solid #E5E7EB',
        padding, cursor: onClick ? 'pointer' : undefined,
        transition: 'box-shadow .15s',
        ...style,
      }}
      onMouseOver={e => { if (onClick) e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,.08)' }}
      onMouseOut={e  => { if (onClick) e.currentTarget.style.boxShadow = 'none' }}
    >
      {children}
    </div>
  )
}
