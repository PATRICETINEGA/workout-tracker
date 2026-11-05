'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
export default function AddWorkout() {
  const [exercise, setExercise] = useState('')
  const [sets, setSets] = useState('3')
  const [reps, setReps] = useState('10')
  const [loading, setLoading] = useState(false)
  const r = useRouter()
  async function submit(e: any) {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/workouts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ exercise, sets, reps }) })
    setExercise(''); setLoading(false); r.refresh()
  }
  return (
    <form onSubmit={submit} className="bg-white p-4 rounded shadow mb-4 space-y-2">
      <input value={exercise} onChange={e=>setExercise(e.target.value)} placeholder="Exercise" className="w-full border p-2 rounded text-sm" required />
      <div className="flex gap-2">
        <input value={sets} onChange={e=>setSets(e.target.value)} placeholder="Sets" type="number" className="flex-1 border p-2 rounded text-sm" />
        <input value={reps} onChange={e=>setReps(e.target.value)} placeholder="Reps" type="number" className="flex-1 border p-2 rounded text-sm" />
      </div>
      <button type="submit" disabled={loading} className="bg-lime-600 text-white px-4 py-1 rounded text-sm disabled:opacity-50">Add</button>
    </form>
  )
}
