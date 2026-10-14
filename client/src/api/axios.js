import axios from 'axios'

export const TOKEN_KEY = 'trackr-token'
export const USER_KEY = 'trackr-user'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      window.dispatchEvent(new Event('trackr:unauthorized'))
      if (window.location.pathname !== '/login') {
        window.location.assign('/login')
      }
    }
    return Promise.reject(error)
  },
)

export function getApiErrorMessage(error) {
  const data = error.response?.data
  if (Array.isArray(data?.errors) && data.errors.length) {
    return data.errors.map(({ message }) => message).join(' ')
  }
  return data?.message || error.message || 'Something went wrong. Please try again.'
}

export default api
