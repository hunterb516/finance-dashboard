import { useState } from 'react'
import api from '../api'
import { useAuth } from '../context/AuthContext'

export default function LoginForm() {
  const { login } = useAuth()
  const [email, setEmail] = useState('demo@user.com')
  const [password, setPassword] = useState('password123')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.post('/api/auth/login', { email, password })
      // Save token for axios + context
      login(data.access_token)
    } catch (err) {
      console.error(err)
      setError('Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit" disabled={loading}>{loading ? 'Logging in…' : 'Login'}</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  )
}
