import { useState, useEffect } from 'react'
import { useAuth } from './context/AuthContext'
import api from './api'
import NavBar from './components/NavBar'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'

export default function App(){
  const { token } = useAuth()
  const [view, setView] = useState('dashboard')
  const [health, setHealth] = useState('checking...')

  // Poll the health endpoint until it's OK
  useEffect(() => {
    let cancelled = false
    const check = async () => {
      try {
        const { data } = await api.get('/api/health', { headers: { 'Cache-Control': 'no-cache' } })
        if (!cancelled) setHealth(data?.status || 'ok')
      } catch {
        if (!cancelled) setHealth('down')
        // retry in 2s if still down
        setTimeout(() => { if (!cancelled) check() }, 2000)
      }
    }
    check()
    return () => { cancelled = true }
  }, [])

  if(!token) return (
    <div className="p-6 max-w-md mx-auto">
      <NavBar onNav={setView} authed={false} />
      <h1>Personal Finance Dashboard</h1>
      <p>API status: {health}</p>
      <p>Login via the button above.</p>
    </div>
  )

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <NavBar onNav={setView} authed={true} />
      {view === 'dashboard' ? <Dashboard/> : <Transactions/>}
    </div>
  )
}
