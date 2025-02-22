// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const prisma = new PrismaClient()

async function main() {
  // Create test user
  const hashedPassword = await bcrypt.hash('test123', 12)
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      password: hashedPassword,
    },
  })

  // Create sample flashcards
  const flashcards = await Promise.all([
    prisma.flashcard.create({
      data: {
        question: 'What is the purpose of EASA Part-66?',
        answer: 'EASA Part-66 establishes requirements for aircraft maintenance licenses and sets standards for aircraft maintenance technicians.',
        module: '1',
        subModule: '1.1',
        difficulty: 'medium',
        tags: ['regulations', 'basics'],
        userId: user.id,
      },
    }),
    prisma.flashcard.create({
      data: {
        question: 'Define "Aircraft Basic Mass"',
        answer: 'The mass of the aircraft ready for a specific type of operation, excluding usable fuel and payload but including permanent ballast, unusable fuel, full operating fluids, and full engine oil.',
        module: '8',
        subModule: '8.2',
        difficulty: 'hard',
        tags: ['mass', 'balance'],
        userId: user.id,
      },
    }),
  ])

  // Create progress records
  await Promise.all(
    flashcards.map((flashcard) =>
      prisma.progress.create({
        data: {
          userId: user.id,
          flashcardId: flashcard.id,
          status: 'learning',
          reviewCount: 1,
          lastScore: 3,
          nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000), // Next day
        },
      })
    )
  )

  console.log('Seed data created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })