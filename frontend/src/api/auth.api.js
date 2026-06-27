import api from './axios'

export const register       = (data)       => api.post('/auth/register', data)
export const verifyEmail    = (token)      => api.get(`/auth/verify/${token}`)
export const resendVerify   = (data)       => api.post('/auth/resend-verify', data)
export const login          = (data)       => api.post('/auth/login', data)
export const forgotPassword = (data)       => api.post('/auth/forgot-password', data)
export const resetPassword  = (token,data) => api.post(`/auth/reset-password/${token}`, data)
export const getMe          = ()           => api.get('/auth/me')
export const changePassword = (data)       => api.put('/auth/password', data)
