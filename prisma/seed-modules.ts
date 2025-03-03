// prisma/seed-modules.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedModules() {
  // Example modules (add all EASA Part 66 modules)
  const modules = [
    {
      number: "1",
      title: "Mathematics",
      description: "Basic arithmetic, algebra, and geometry concepts relevant to aviation maintenance.",
      category: "ALL",
    },
    {
      number: "2",
      title: "Physics",
      description: "Mechanical principles, thermodynamics, optics, and wave motion relevant to aircraft systems.",
      category: "ALL",
    },
    // Add more modules...
  ];

  // Insert modules
  for (const module of modules) {
    await prisma.module.create({
      data: module,
    });
  }

  // Get created modules to link submodules
  const mathModule = await prisma.module.findFirst({
    where: { number: "1" },
  });

  // Example submodules for Mathematics
  if (mathModule) {
    const mathSubmodules = [
      {
        number: "1.1",
        title: "Arithmetic",
        moduleId: mathModule.id,
      },
      {
        number: "1.2",
        title: "Algebra",
        moduleId: mathModule.id,
      },
      // Add more submodules...
    ];

    for (const submodule of mathSubmodules) {
      await prisma.subModule.create({
        data: submodule,
      });
    }
  }

  // Repeat for other modules...
}

seedModules()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });