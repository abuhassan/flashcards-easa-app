// scripts/check-modules.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkModules() {
  const modules = await prisma.module.findMany({
    select: {
      id: true,
      number: true,
      title: true
    }
  });
  
  console.log('Available modules:');
  modules.forEach(module => {
    console.log(`ID: ${module.id}, Number: ${module.number}, Title: ${module.title}`);
  });
  
  await prisma.$disconnect();
}

checkModules().catch(console.error);