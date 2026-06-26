import api from './axios'

export const getResearchers   = (params)    => api.get('/researchers', { params })
export const createResearcher = (data)      => api.post('/researchers', data)
export const updateResearcher = (id, data)  => api.put(`/researchers/${id}`, data)
