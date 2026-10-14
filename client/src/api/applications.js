import api from './axios.js'

export async function listApplications(params = {}) {
  const { data } = await api.get('/applications', { params })
  return data
}

export async function getApplicationStats() {
  const { data } = await api.get('/applications/stats')
  return data.stats
}

export async function createApplication(application) {
  const { data } = await api.post('/applications', application)
  return data.application
}

export async function updateApplication(id, application) {
  const { data } = await api.put(`/applications/${id}`, application)
  return data.application
}

export async function removeApplication(id) {
  const { data } = await api.delete(`/applications/${id}`)
  return data
}
