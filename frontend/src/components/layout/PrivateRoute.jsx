import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 12, color: '#1B4D3E', fontFamily: 'Inter, sans-serif' }}>
        <i className="ti ti-loader spin" style={{ fontSize: 30 }} />
        <span style={{ fontSize: 14 }}>SIGPRO-MINRESI...</span>
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'visitor') return <Navigate to="/visitor/innovations" replace />
  return children
}
