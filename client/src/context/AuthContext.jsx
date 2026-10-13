import { createContext, useContext, useMemo, useState } from 'react'

const TOKEN_KEY = 'trackr-token'
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(null)

  // TODO: Replace mock credentials/token with the real authentication API.
  function login({ name, email }) {
    const mockToken = `mock-${Date.now()}`
    localStorage.setItem(TOKEN_KEY, mockToken)
    setToken(mockToken)
    setUser({ name: name || email.split('@')[0], email })
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }

  const value = useMemo(
    () => ({ user, token, isAuthenticated: Boolean(token), login, logout }),
    [user, token],
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
