import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import AddWorkout from '@/components/AddWorkout'
import DeleteWorkoutButton from '@/components/DeleteWorkoutButton'
export default async function Dash() {
  const s = await getSession()
  if (!s) redirect('/login')
  const uid = (s.user as any).id
  const workouts = await prisma.workout.findMany({ where: { ownerId: uid }, orderBy: { date: 'desc' } })
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Workouts</h1>
        <Link href="/api/auth/signout" className="text-sm text-red-600">Sign out</Link>
      </div>
      <AddWorkout />
      <div className="space-y-2">
        {workouts.map((w: any) => (
          <div key={w.id} className="bg-white p-3 rounded shadow flex justify-between items-center text-sm">
            <div><span className="font-medium">{w.exercise}</span> <span className="text-gray-500">{w.sets}×{w.reps}</span></div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">{w.date}</span>
              <DeleteWorkoutButton id={w.id} />
            </div>
          </div>
        ))}
        {workouts.length === 0 && <p className="text-gray-500">No workouts yet</p>}
      </div>
    </div>
  )
}
