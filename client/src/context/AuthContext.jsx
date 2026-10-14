import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import api, { getApiErrorMessage, TOKEN_KEY, USER_KEY } from '../api/axios.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) || 'null')
    } catch {
      localStorage.removeItem(USER_KEY)
      return null
    }
  })
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem(TOKEN_KEY)))
  const [error, setError] = useState('')

  const saveSession = useCallback((session) => {
    localStorage.setItem(TOKEN_KEY, session.token)
    localStorage.setItem(USER_KEY, JSON.stringify(session.user))
    setToken(session.token)
    setUser(session.user)
  }, [])

  useEffect(() => {
    function clearUnauthorizedSession() {
      setToken(null)
      setUser(null)
      setLoading(false)
    }

    window.addEventListener('trackr:unauthorized', clearUnauthorizedSession)
    return () => window.removeEventListener('trackr:unauthorized', clearUnauthorizedSession)
  }, [])

  useEffect(() => {
    if (!token) return

    let active = true
    api.get('/auth/me')
      .then(({ data }) => {
        if (!active) return
        localStorage.setItem(USER_KEY, JSON.stringify(data.user))
        setUser(data.user)
      })
      .catch((requestError) => {
        if (active && requestError.response?.status !== 401) {
          setError(getApiErrorMessage(requestError))
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [token])

  const login = useCallback(async (credentials) => {
    setLoading(true)
    setError('')
    try {
      const { data: session } = await api.post('/auth/login', credentials)
      saveSession(session)
      return session.user
    } catch (requestError) {
      const message = getApiErrorMessage(requestError)
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [saveSession])

  const register = useCallback(async (credentials) => {
    setLoading(true)
    setError('')
    try {
      const { data: session } = await api.post('/auth/register', credentials)
      saveSession(session)
      return session.user
    } catch (requestError) {
      const message = getApiErrorMessage(requestError)
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [saveSession])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
    setLoading(false)
    setError('')
  }, [])

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      error,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
      clearError: () => setError(''),
    }),
    [user, token, loading, error, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
