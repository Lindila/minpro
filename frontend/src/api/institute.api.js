import api from './axios'

export const getInstitutes = () => api.get('/institutes')
export const createInstitute = (data) => api.post('/institutes', data)
