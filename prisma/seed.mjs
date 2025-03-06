// prisma/seed.mjs
import { PrismaClient } from '@prisma/client';
import { initialModules } from '../lib/data/module-data.js';
import { allFlashcards } from '../lib/data/flashcard-data.js';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Find or create an admin user
  let adminUser;
  try {
    adminUser = await prisma.user.findFirst();
    
    if (!adminUser) {
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

  // Seed modules and topics
  console.log('Seeding modules and topics...');
  
  for (const moduleData of initialModules) {
    try {
      // Create module
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
      
      // Create topics
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
      
      console.log(`Module: ${moduleData.title} with ${moduleData.topics.length} topics`);
    } catch (error) {
      console.error(`Error with module ${moduleData.title}:`, error);
    }
  }

  // Seed flashcards
  console.log('Seeding flashcards...');
  let count = 0;
  
  for (const flashcard of allFlashcards) {
    try {
      await prisma.flashcard.create({
        data: {
          question: flashcard.question,
          answer: flashcard.answer,
          moduleId: flashcard.moduleId,
          subModuleId: flashcard.subModuleId,
          difficulty: flashcard.difficulty,
          tags: flashcard.tags,
          userId: adminUser.id,
          approved: true,
        },
      });
      count++;
    } catch (error) {
      console.error('Error creating flashcard:', error);
    }
  }
  
  console.log(`Created ${count} flashcards`);
  console.log('Seeding completed');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });