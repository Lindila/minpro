export default function EmptyState({ icon = 'folder-off', title, subtitle }) {
  return (
    <div style={{ padding: '48px 24px', textAlign: 'center', color: '#9CA3AF' }}>
      <i className={`ti ti-${icon}`} style={{ fontSize: 48, display: 'block', marginBottom: 12 }} />
      <div style={{ fontSize: 14, fontWeight: 600, color: '#6B7280', marginBottom: 4 }}>{title}</div>
      {subtitle && <div style={{ fontSize: 12 }}>{subtitle}</div>}
    </div>
  )
}
