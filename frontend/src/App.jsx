import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { AppProvider }  from './context/AppContext.jsx'
import PrivateRoute     from './components/layout/PrivateRoute.jsx'
import Layout           from './components/layout/Layout.jsx'
import Login            from './pages/Login.jsx'
import Register         from './pages/Register.jsx'
import VerifyEmail      from './pages/VerifyEmail.jsx'
import ForgotPassword   from './pages/ForgotPassword.jsx'
import ResetPassword    from './pages/ResetPassword.jsx'
import Dashboard        from './pages/Dashboard.jsx'
import Projects         from './pages/Projects.jsx'
import ProjectDetail    from './pages/ProjectDetail.jsx'
import Researchers      from './pages/Researchers.jsx'
import Users            from './pages/Users.jsx'

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard"       element={<Dashboard />} />
            <Route path="projects"        element={<Projects />} />
            <Route path="projects/:id"    element={<ProjectDetail />} />
            <Route path="researchers"     element={<Researchers />} />
            <Route path="users"           element={<Users />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppProvider>
    </AuthProvider>
  )
}
