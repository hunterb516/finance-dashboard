import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import LoginForm from './LoginForm'

export default function NavBar({ onNav, authed }){
  const { logout } = useAuth()
  const [show, setShow] = useState(false)
  return (
    <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:16}}>
      <button onClick={()=>onNav('dashboard')}>Dashboard</button>
      <button onClick={()=>onNav('tx')}>Transactions</button>
      <div style={{marginLeft:'auto'}}>
        {authed ? <button onClick={logout}>Logout</button> : <button onClick={()=>setShow(v=>!v)}>Login</button>}
      </div>
      {!authed && show && <LoginForm onClose={()=>setShow(false)} />}
    </div>
  )
}
