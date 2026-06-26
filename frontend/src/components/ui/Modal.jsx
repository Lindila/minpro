import { useEffect } from 'react'

export default function Modal({ isOpen, onClose, title, children, width = 520 }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    if (isOpen) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)',
        backdropFilter: 'blur(4px)', zIndex: 300,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
    >
      <div style={{
        background: 'white', borderRadius: 16, width: '100%', maxWidth: width,
        maxHeight: '92vh', overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,.2)',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid #E5E7EB',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, background: 'white',
          borderRadius: '16px 16px 0 0', zIndex: 1,
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#9CA3AF', fontSize: 20, padding: '2px 4px',
            borderRadius: 6, display: 'flex', alignItems: 'center',
          }}>
            <i className="ti ti-x" />
          </button>
        </div>
        {/* Body */}
        <div style={{ padding: 20 }}>{children}</div>
      </div>
    </div>
  )
}
