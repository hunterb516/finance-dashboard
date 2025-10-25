import { useState } from 'react'
import api from '../api'

export default function TransactionForm({ onAdd }){
  const [form, setForm] = useState({ date:'2025-10-01', amount:'0', type:'EXPENSE', category:'Misc', note:'' })
  const update = (k,v)=> setForm(f=>({...f,[k]:v}))
  const submit = async (e)=>{
    e.preventDefault()
    const { data } = await api.post('/api/transactions', form)
    onAdd?.(data)
  }
  return (
    <form onSubmit={submit} style={{display:'grid',gap:8}}>
      <input type="date" value={form.date} onChange={e=>update('date', e.target.value)} />
      <input type="number" step="0.01" value={form.amount} onChange={e=>update('amount', e.target.value)} placeholder="amount" />
      <select value={form.type} onChange={e=>update('type', e.target.value)}>
        <option>INCOME</option>
        <option>EXPENSE</option>
      </select>
      <input value={form.category} onChange={e=>update('category', e.target.value)} placeholder="category" />
      <input value={form.note} onChange={e=>update('note', e.target.value)} placeholder="note (optional)" />
      <button type="submit">Add</button>
    </form>
  )
}
