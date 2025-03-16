// prisma/seed-quizzes.ts
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function seedQuizzes() {
  console.log('Seeding quiz data...');

  // Create a test user if needed
  let testUser = await prisma.user.findUnique({
    where: { email: 'test@example.com' },
  });

  if (!testUser) {
    console.log('Creating test user...');
    testUser = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: await hash('password123', 10),
      },
    });
  }

  // Create modules if they don't exist
  const moduleData = [
    { number: '1', title: 'Mathematics & Physics', category: 'BASIC' },
    { number: '2', title: 'Materials & Hardware', category: 'BASIC' },
    { number: '8', title: 'Basic Aerodynamics', category: 'BASIC' },
    { number: '10', title: 'Aviation Legislation', category: 'SPECIALIZED' },
  ];

  // Properly type the moduleMap
  const moduleMap: Record<string, string> = {};

  // Loop through modules with a traditional for loop
  for (let i = 0; i < moduleData.length; i++) {
    const module = moduleData[i];
    const existingModule = await prisma.module.findFirst({
      where: { number: module.number },
    });

    if (!existingModule) {
      console.log(`Creating module ${module.number}: ${module.title}`);
      const newModule = await prisma.module.create({
        data: {
          number: module.number,
          title: module.title,
          category: module.category,
          description: `EASA Part 66 Module ${module.number} - ${module.title}`,
        },
      });
      moduleMap[module.number] = newModule.id;
    } else {
      moduleMap[module.number] = existingModule.id;
    }
  }

  // Quiz 1: Basic Aerodynamics
  const quiz1 = {
    title: 'Basic Aerodynamics Quiz',
    description: 'Test your knowledge of fundamental aerodynamics principles',
    moduleId: moduleMap['8'],
    difficulty: 'easy',
    timeLimit: 15,
    totalQuestions: 5,
    createdBy: testUser.id,
    isPublished: true,
  };

  const quiz1Questions = [
    {
      text: 'What is the main function of an airfoil?',
      options: [
        { id: 'a', text: 'Generate thrust' },
        { id: 'b', text: 'Generate lift' },
        { id: 'c', text: 'Reduce weight' },
        { id: 'd', text: 'Stabilize the aircraft' },
      ],
      correctAnswer: 'b',
      explanation: 'An airfoil is designed to generate lift as air flows around it.',
      difficulty: 'easy',
    },
    {
      text: 'Which control surface primarily affects the roll of an aircraft?',
      options: [
        { id: 'a', text: 'Rudder' },
        { id: 'b', text: 'Ailerons' },
        { id: 'c', text: 'Elevator' },
        { id: 'd', text: 'Flaps' },
      ],
      correctAnswer: 'b',
      explanation: 'Ailerons control the roll of an aircraft by creating differential lift on the wings.',
      difficulty: 'easy',
    },
    {
      text: 'Which of the following affects an aircraft\'s stall speed?',
      options: [
        { id: 'a', text: 'Weight' },
        { id: 'b', text: 'Angle of attack' },
        { id: 'c', text: 'Configuration (flaps, gear)' },
        { id: 'd', text: 'All of the above' },
      ],
      correctAnswer: 'd',
      explanation: 'All of these factors affect stall speed. Increased weight, higher angle of attack, and certain configurations can increase stall speed.',
      difficulty: 'medium',
    },
    {
      text: 'What is "angle of attack"?',
      options: [
        { id: 'a', text: 'The angle between the wing and the horizontal plane' },
        { id: 'b', text: 'The angle between the chord line and relative airflow' },
        { id: 'c', text: 'The angle at which the aircraft climbs' },
        { id: 'd', text: 'The angle between the wing and the fuselage' },
      ],
      correctAnswer: 'b',
      explanation: 'Angle of attack is the angle between the chord line of an airfoil and the relative airflow.',
      difficulty: 'medium',
    },
    {
      text: 'What is the term for the force that opposes an aircraft\'s motion through the air?',
      options: [
        { id: 'a', text: 'Lift' },
        { id: 'b', text: 'Thrust' },
        { id: 'c', text: 'Weight' },
        { id: 'd', text: 'Drag' },
      ],
      correctAnswer: 'd',
      explanation: 'Drag is the aerodynamic force that opposes an aircraft\'s motion through the air.',
      difficulty: 'easy',
    },
  ];

  // Check if quiz already exists
  const existingQuiz1 = await prisma.quiz.findFirst({
    where: {
      title: quiz1.title,
      moduleId: quiz1.moduleId,
    },
  });

  let quiz1Id: string;
  if (!existingQuiz1) {
    console.log(`Creating quiz: ${quiz1.title}`);
    // Create the quiz
    const newQuiz1 = await prisma.quiz.create({
      data: quiz1,
    });
    quiz1Id = newQuiz1.id;

    // Create questions for this quiz
    for (let i = 0; i < quiz1Questions.length; i++) {
      const questionData = quiz1Questions[i];
      console.log(`Creating question ${i + 1} for quiz: ${quiz1.title}`);
      
      // Create the question
      const question = await prisma.question.create({
        data: {
          text: questionData.text,
          options: questionData.options,
          correctAnswer: questionData.correctAnswer,
          explanation: questionData.explanation,
          difficulty: questionData.difficulty,
          moduleId: quiz1.moduleId,
        },
      });

      // Link question to quiz
      await prisma.quizQuestion.create({
        data: {
          quizId: quiz1Id,
          questionId: question.id,
          order: i + 1,
        },
      });
    }
  } else {
    console.log(`Quiz "${quiz1.title}" already exists, skipping`);
  }

  // Quiz 2: Aviation Legislation
  const quiz2 = {
    title: 'Aviation Legislation Quiz',
    description: 'Test your knowledge of EASA regulations and aviation law',
    moduleId: moduleMap['10'],
    difficulty: 'medium',
    timeLimit: 20,
    totalQuestions: 3,
    createdBy: testUser.id,
    isPublished: true,
  };

  const quiz2Questions = [
    {
      text: 'Which organization issues Part 66 aircraft maintenance licenses in Europe?',
      options: [
        { id: 'a', text: 'FAA' },
        { id: 'b', text: 'EASA' },
        { id: 'c', text: 'ICAO' },
        { id: 'd', text: 'CAA' },
      ],
      correctAnswer: 'b',
      explanation: 'The European Union Aviation Safety Agency (EASA) issues Part 66 maintenance licenses in Europe.',
      difficulty: 'easy',
    },
    {
      text: 'What is the validity period of a Part 66 license?',
      options: [
        { id: 'a', text: '1 year' },
        { id: 'b', text: '2 years' },
        { id: 'c', text: '5 years' },
        { id: 'd', text: 'Unlimited (unless suspended or revoked)' },
      ],
      correctAnswer: 'd',
      explanation: 'A Part 66 license has unlimited validity unless it is suspended or revoked.',
      difficulty: 'medium',
    },
    {
      text: 'Which regulation governs the continuing airworthiness of aircraft?',
      options: [
        { id: 'a', text: 'EASA Part 21' },
        { id: 'b', text: 'EASA Part 66' },
        { id: 'c', text: 'EASA Part M' },
        { id: 'd', text: 'EASA Part 147' },
      ],
      correctAnswer: 'c',
      explanation: 'EASA Part M governs the continuing airworthiness of aircraft, including maintenance.',
      difficulty: 'medium',
    },
  ];

  // Check if quiz already exists
  const existingQuiz2 = await prisma.quiz.findFirst({
    where: {
      title: quiz2.title,
      moduleId: quiz2.moduleId,
    },
  });

  let quiz2Id: string;
  if (!existingQuiz2) {
    console.log(`Creating quiz: ${quiz2.title}`);
    // Create the quiz
    const newQuiz2 = await prisma.quiz.create({
      data: quiz2,
    });
    quiz2Id = newQuiz2.id;

    // Create questions for this quiz
    for (let i = 0; i < quiz2Questions.length; i++) {
      const questionData = quiz2Questions[i];
      console.log(`Creating question ${i + 1} for quiz: ${quiz2.title}`);
      
      // Create the question
      const question = await prisma.question.create({
        data: {
          text: questionData.text,
          options: questionData.options,
          correctAnswer: questionData.correctAnswer,
          explanation: questionData.explanation,
          difficulty: questionData.difficulty,
          moduleId: quiz2.moduleId,
        },
      });

      // Link question to quiz
      await prisma.quizQuestion.create({
        data: {
          quizId: quiz2Id,
          questionId: question.id,
          order: i + 1,
        },
      });
    }
  } else {
    console.log(`Quiz "${quiz2.title}" already exists, skipping`);
  }

  // Quiz 3: Math for Aviation
  const quiz3 = {
    title: 'Math for Aviation',
    description: 'Essential mathematics concepts used in aviation maintenance',
    moduleId: moduleMap['1'],
    difficulty: 'hard',
    timeLimit: 30,
    totalQuestions: 2,
    createdBy: testUser.id,
    isPublished: true,
  };

  const quiz3Questions = [
    {
      text: 'What is the formula for calculating the area of a circle?',
      options: [
        { id: 'a', text: 'A = 2πr' },
        { id: 'b', text: 'A = πr²' },
        { id: 'c', text: 'A = 4πr²' },
        { id: 'd', text: 'A = πd' },
      ],
      correctAnswer: 'b',
      explanation: 'The area of a circle is calculated using the formula A = πr², where r is the radius.',
      difficulty: 'easy',
    },
    {
      text: 'If an aircraft travels at 240 knots for 2.5 hours, how far has it traveled?',
      options: [
        { id: 'a', text: '480 nautical miles' },
        { id: 'b', text: '600 nautical miles' },
        { id: 'c', text: '720 nautical miles' },
        { id: 'd', text: '960 nautical miles' },
      ],
      correctAnswer: 'b',
      explanation: 'Distance = Speed × Time, so 240 knots × 2.5 hours = 600 nautical miles.',
      difficulty: 'medium',
    },
  ];

  // Check if quiz already exists
  const existingQuiz3 = await prisma.quiz.findFirst({
    where: {
      title: quiz3.title,
      moduleId: quiz3.moduleId,
    },
  });

  let quiz3Id: string;
  if (!existingQuiz3) {
    console.log(`Creating quiz: ${quiz3.title}`);
    // Create the quiz
    const newQuiz3 = await prisma.quiz.create({
      data: quiz3,
    });
    quiz3Id = newQuiz3.id;

    // Create questions for this quiz
    for (let i = 0; i < quiz3Questions.length; i++) {
      const questionData = quiz3Questions[i];
      console.log(`Creating question ${i + 1} for quiz: ${quiz3.title}`);
      
      // Create the question
      const question = await prisma.question.create({
        data: {
          text: questionData.text,
          options: questionData.options,
          correctAnswer: questionData.correctAnswer,
          explanation: questionData.explanation,
          difficulty: questionData.difficulty,
          moduleId: quiz3.moduleId,
        },
      });

      // Link question to quiz
      await prisma.quizQuestion.create({
        data: {
          quizId: quiz3Id,
          questionId: question.id,
          order: i + 1,
        },
      });
    }
  } else {
    console.log(`Quiz "${quiz3.title}" already exists, skipping`);
  }

  console.log('Quiz seeding completed successfully!');
}

// Run the seeding function
seedQuizzes()
  .catch((e) => {
    console.error('Error seeding quizzes:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });