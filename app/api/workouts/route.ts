import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { exercise, sets, reps, date } = body
  if (!exercise) return NextResponse.json({ error: 'Exercise required' }, { status: 400 })

  const workout = await prisma.workout.create({
    data: { exercise, sets: parseInt(sets) || 3, reps: parseInt(reps) || 10, date: date || new Date().toISOString().slice(0,10), ownerId: (session.user as any).id },
  })
  return NextResponse.json(workout)
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const workout = await prisma.workout.findUnique({ where: { id } })
  if (!workout || workout.ownerId !== (session.user as any).id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  await prisma.workout.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
