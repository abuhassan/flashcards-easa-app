// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
// Define the data directly in this file to avoid import issues
const prisma = new PrismaClient();

// Define your data here
const initialModules = [
  {
    id: 'module-3',
    number: '3',
    title: 'Basic Electrical Knowledge',
    description: 'Covers electron theory, static electricity, electrical terminology, and electrical hazards.',
    category: 'Electrical/Electronic',
    topics: [
      {
        id: 'mod3-topic1',
        number: '3.1',
        title: 'Electron Theory',
      },
      {
        id: 'mod3-topic2',
        number: '3.2',
        title: 'Static Electricity and Conduction',
      }
    ]
  },
  {
    id: 'module-4',
    number: '4',
    title: 'Basic Electronics',
    description: 'Covers semiconductors, printed circuit boards, servo mechanisms, and electronic instruments.',
    category: 'Electrical/Electronic',
    topics: [
      {
        id: 'mod4-topic1',
        number: '4.1',
        title: 'Semiconductors',
      }
    ]
  },
  {
    id: 'module-8',
    number: '8',
    title: 'Basic Aerodynamics',
    description: 'Covers physics of the atmosphere, aerodynamics, theory of flight, and flight stability and dynamics.',
    category: 'Aerodynamics',
    topics: [
      {
        id: 'mod8-topic1',
        number: '8.1',
        title: 'Physics of the Atmosphere',
      }
    ]
  }
];

const allFlashcards = [
  {
    question: "What is Ohm's Law?",
    answer: "Ohm's Law states that current (I) is equal to voltage (V) divided by resistance (R): I = V/R.",
    moduleId: 'module-3',
    subModuleId: 'mod3-topic1',
    difficulty: "medium",
    tags: ['ohms-law', 'fundamentals']
  },
  {
    question: "What are the four forces acting on an aircraft in flight?",
    answer: "Lift, Weight, Thrust, and Drag.",
    moduleId: 'module-8',
    subModuleId: 'mod8-topic1',
    difficulty: "easy",
    tags: ['forces', 'fundamentals']
  }
];

async function main() {
  console.log('Starting database seeding...');

  // Find or create an admin user
  let adminUser;
  try {
    // Try to find an existing user first
    adminUser = await prisma.user.findFirst();
    
    if (!adminUser) {
      // If no user exists, create one
      adminUser = await prisma.user.create({
        data: {
          name: 'Admin User',
          email: 'admin@example.com',
          password: 'password123'
        }
      });
      console.log('Created admin user');
    } else {
      console.log('Using existing user for seeding');
    }
  } catch (error) {
    console.error('Error finding/creating user:', error);
    throw error;
  }

  // Seed EASA Modules
  console.log('Seeding EASA modules...');
  for (const moduleData of initialModules) {
    try {
      // Create the module
      const module = await prisma.module.upsert({
        where: { id: moduleData.id },
        update: {
          number: moduleData.number,
          title: moduleData.title,
          description: moduleData.description || '',
          category: moduleData.category,
        },
        create: {
          id: moduleData.id,
          number: moduleData.number,
          title: moduleData.title,
          description: moduleData.description || '',
          category: moduleData.category,
        },
      });
      
      // Create sub-modules (topics)
      for (const topic of moduleData.topics) {
        await prisma.subModule.upsert({
          where: { id: topic.id },
          update: {
            number: topic.number,
            title: topic.title,
            moduleId: module.id,
          },
          create: {
            id: topic.id,
            number: topic.number,
            title: topic.title,
            moduleId: module.id,
          },
        });
      }
      
      console.log(`Created/updated module: ${moduleData.title} with ${moduleData.topics.length} topics`);
    } catch (error) {
      console.error(`Error creating module ${moduleData.title}:`, error);
    }
  }

  // Create flashcards
  console.log('Creating sample flashcards...');
  let createdCount = 0;
  
  try {
    for (const flashcard of allFlashcards) {
      await prisma.flashcard.create({
        data: {
          question: flashcard.question,
          answer: flashcard.answer,
          moduleId: flashcard.moduleId,
          subModuleId: flashcard.subModuleId,
          difficulty: flashcard.difficulty,
          tags: flashcard.tags,
          userId: adminUser.id,
          approved: true, // Auto-approve seeded flashcards
        },
      });
      createdCount++;
    }
    console.log(`Created ${createdCount} sample flashcards`);
  } catch (error) {
    console.error('Error creating flashcards:', error);
    console.log(`Created ${createdCount} flashcards before error`);
  }

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });