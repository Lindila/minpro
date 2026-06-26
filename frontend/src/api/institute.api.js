import api from './axios'

export const getInstitutes = () => api.get('/institutes')
