import { createContext, useContext, useEffect, useState } from 'react'
import { setTokens as setApiTokens, clearTokens as clearApiTokens } from '../api'
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null)

  // Rehydrate on first load/refresh
  useEffect(() => {
    const saved = localStorage.getItem('token')
    if (saved) setToken(saved)
  }, [])

  // Call this after successful login
  const login = (jwt) => {
    setApiTokens({ access: jwt })     // stores in localStorage + axios header
    setToken(jwt)
  }

  const logout = () => {
    clearApiTokens()
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
