import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { register as registerApi, login as loginApi, getMe } from '../api/auth.api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  // Restaurer session au chargement
  useEffect(() => {
    const token = localStorage.getItem('sigpro_token')
    if (!token) { setLoading(false); return }
    getMe()
      .then(r  => setUser(r.data.user))
      .catch(() => localStorage.removeItem('sigpro_token'))
      .finally(() => setLoading(false))
  }, [])

  const register = useCallback(async (data) => {
    const res = await registerApi(data)
    localStorage.setItem('sigpro_token', res.data.token)
    setUser(res.data.user)
    return res.data.user
  }, [])

  const login = useCallback(async (email, password) => {
    const res = await loginApi({ email, password })
    localStorage.setItem('sigpro_token', res.data.token)
    setUser(res.data.user)
    return res.data.user
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('sigpro_token')
    setUser(null)
  }, [])

  // Permissions raccourcis
  const isAdmin    = user?.role === 'admin'
  const isChef     = user?.role === 'chef'
  const isDir      = user?.role === 'dir'
  const canCreate  = isAdmin || isChef
  const canValidate= isAdmin || isChef || isDir

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, isAdmin, isChef, isDir, canCreate, canValidate }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
