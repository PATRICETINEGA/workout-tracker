import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('demo123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'demo@workouts.app' },
    update: {},
    create: { email: 'demo@workouts.app', password },
  })

  await prisma.workout.upsert({
    where: { id: 'seed-workout' },
    update: {},
    create: { id: 'seed-workout', exercise: 'Push-ups', sets: 3, reps: 15, date: '2026-11-05', ownerId: user.id },
  })

  console.log('Seed done')
}

main().finally(() => prisma.$disconnect())
