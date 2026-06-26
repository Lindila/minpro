export default function Loader({ label = 'Chargement...' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, height: 280, color: '#6B7280' }}>
      <i className="ti ti-loader spin" style={{ fontSize: 26 }} />
      <span style={{ fontSize: 13 }}>{label}</span>
    </div>
  )
}
