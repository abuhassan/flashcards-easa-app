import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Insert Modules
  await prisma.module.createMany({
    data: [
      { id: "mod1", number: "1", title: "Mathematics", description: "Basic mathematical principles relevant to aviation engineering.", category: "Science" },
      { id: "mod2", number: "2", title: "Physics", description: "Physics principles required for aircraft maintenance.", category: "Science" },
      { id: "mod3", number: "3", title: "Electrical Fundamentals", description: "Covers fundamental electrical concepts in aviation.", category: "Engineering" }
    ],
    skipDuplicates: true
  });

  // Insert Submodules
  await prisma.subModule.createMany({
    data: [
      { id: "sub1", moduleId: "mod1", number: "1.1", title: "Basic Algebra" },
      { id: "sub2", moduleId: "mod1", number: "1.2", title: "Trigonometry" },
      { id: "sub3", moduleId: "mod2", number: "2.1", title: "Kinematics" },
      { id: "sub4", moduleId: "mod2", number: "2.2", title: "Dynamics" },
      { id: "sub5", moduleId: "mod3", number: "3.1", title: "Ohm’s Law" },
      { id: "sub6", moduleId: "mod3", number: "3.2", title: "Capacitors and Inductors" }
    ],
    skipDuplicates: true
  });

  // Insert Flashcards
  await prisma.flashcard.createMany({
    data: [
      { id: "flash1", moduleId: "mod1", subModuleId: "sub1", userId: "user1", question: "What is the quadratic formula?", answer: "x = (-b ± √(b² - 4ac)) / 2a" },
      { id: "flash2", moduleId: "mod1", subModuleId: "sub2", userId: "user1", question: "What is the sine rule in trigonometry?", answer: "a/sin(A) = b/sin(B) = c/sin(C)" },
      { id: "flash3", moduleId: "mod2", subModuleId: "sub3", userId: "user1", question: "What is the formula for velocity?", answer: "Velocity = Displacement / Time" },
      { id: "flash4", moduleId: "mod2", subModuleId: "sub4", userId: "user1", question: "State Newton’s Second Law of Motion.", answer: "Force = Mass × Acceleration (F = ma)" },
      { id: "flash5", moduleId: "mod3", subModuleId: "sub5", userId: "user1", question: "What is Ohm’s Law?", answer: "V = IR (Voltage = Current × Resistance)" },
      { id: "flash6", moduleId: "mod3", subModuleId: "sub6", userId: "user1", question: "What happens when a capacitor is connected to a DC circuit?", answer: "Initially, it allows current to flow, but eventually, it acts as an open circuit." }
    ],
    skipDuplicates: true
  });

  console.log("Test data inserted successfully!");
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
