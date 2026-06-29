import api from './axios'

export const getLandingData = () => api.get('/public/landing')
