import { useEffect, useState } from 'react'
import api from '../api'
import TransactionForm from '../components/TransactionForm'

export default function Transactions() {
  const [items, setItems] = useState([])
  const [err, setErr] = useState('')

  async function refresh() {
    setErr('')
    try {
      const { data } = await api.get('/api/transactions') // uses Authorization header
      setItems(data.items || [])
    } catch (e) {
      console.error(e)
      setErr('Failed to load transactions')
    }
  }

  useEffect(() => { refresh() }, [])

  async function handleAdd(tx) {
    try {
      await api.post('/api/transactions', tx)
      refresh()
    } catch (e) {
      console.error(e)
      setErr('Failed to add transaction')
    }
  }

  async function handleDelete(id) {
    try {
      await api.delete(`/api/transactions/${id}`)
      refresh()
    } catch (e) {
      console.error(e)
      setErr('Failed to delete transaction')
    }
  }

  return (
    <div style={{ display:'grid', gap:16 }}>
      <h2>Transactions</h2>
      {err && <div style={{ color:'red' }}>{err}</div>}
      <TransactionForm onSubmit={handleAdd} />
      <ul style={{ listStyle:'none', padding:0 }}>
        {items.map(tx => (
          <li key={tx.id} style={{ display:'flex', gap:8, alignItems:'center' }}>
            <span>{tx.date}</span>
            <span>{tx.category}</span>
            <span>{tx.type}</span>
            <b>${Number(tx.amount).toFixed(2)}</b>
            <button onClick={() => handleDelete(tx.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
