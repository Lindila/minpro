import api from './axios'

// Projets
export const getProjects    = (params)         => api.get('/projects', { params })
export const getProject     = (id)             => api.get(`/projects/${id}`)
export const createProject  = (data)           => api.post('/projects', data)
export const updateProject  = (id, data)       => api.put(`/projects/${id}`, data)
export const getStats       = ()               => api.get('/projects/stats')
export const getAlerts      = ()               => api.get('/projects/alerts')

// Jalons
export const addMilestone   = (id, data)       => api.post(`/projects/${id}/milestones`, data)
export const updateMilestone= (id, msId, data) => api.put(`/projects/${id}/milestones/${msId}`, data)
export const deleteMilestone= (id, msId)       => api.delete(`/projects/${id}/milestones/${msId}`)

// Dépenses
export const addExpense     = (id, data)       => api.post(`/projects/${id}/depenses`, data)
export const deleteExpense  = (id, expId)      => api.delete(`/projects/${id}/depenses/${expId}`)

// Documents
export const addDocument    = (id, data)       => api.post(`/projects/${id}/documents`, data)
export const validateDoc    = (id, docId)      => api.put(`/projects/${id}/documents/${docId}/validate`)
export const rejectDoc      = (id, docId, data)=> api.put(`/projects/${id}/documents/${docId}/reject`, data)
