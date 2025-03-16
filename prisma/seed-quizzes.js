// prisma/seed-quizzes.js
const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

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
  const moduleMap = {};

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

  // Create quizzes with questions
  const quizzesData = [
    {
      title: 'Basic Aerodynamics Quiz',
      description: 'Test your knowledge of fundamental aerodynamics principles',
      moduleId: moduleMap['8'],
      difficulty: 'easy',
      timeLimit: 15,
      totalQuestions: 5,
      createdBy: testUser.id,
      isPublished: true,
      questions: [
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
          explanation: 'All of these factors affect stall speed.',
          difficulty: 'medium',
        },
      ]
    },
    {
      title: 'Aviation Legislation Quiz',
      description: 'Test your knowledge of EASA regulations',
      moduleId: moduleMap['10'],
      difficulty: 'medium',
      timeLimit: 20,
      totalQuestions: 3,
      createdBy: testUser.id,
      isPublished: true,
      questions: [
        {
          text: 'Which organization issues Part 66 licenses in Europe?',
          options: [
            { id: 'a', text: 'FAA' },
            { id: 'b', text: 'EASA' },
            { id: 'c', text: 'ICAO' },
            { id: 'd', text: 'CAA' },
          ],
          correctAnswer: 'b',
          explanation: 'EASA issues Part 66 licenses in Europe.',
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
          explanation: 'A Part 66 license has unlimited validity unless suspended or revoked.',
          difficulty: 'medium',
        }
      ]
    }
  ];

  // Create the quizzes
  for (const quizData of quizzesData) {
    const { questions, ...quizDetails } = quizData;
    
    // Check if quiz already exists
    const existingQuiz = await prisma.quiz.findFirst({
      where: {
        title: quizDetails.title,
        moduleId: quizDetails.moduleId,
      },
    });

    if (existingQuiz) {
      console.log(`Quiz "${quizDetails.title}" already exists, skipping`);
      continue;
    }

    console.log(`Creating quiz: ${quizDetails.title}`);
    
    // Create the quiz
    const quiz = await prisma.quiz.create({
      data: quizDetails,
    });

    // Create questions for this quiz
    for (let i = 0; i < questions.length; i++) {
      const questionData = questions[i];
      console.log(`Creating question ${i + 1} for quiz: ${quizDetails.title}`);
      
      // Create the question
      const question = await prisma.question.create({
        data: {
          text: questionData.text,
          options: questionData.options,
          correctAnswer: questionData.correctAnswer,
          explanation: questionData.explanation,
          difficulty: questionData.difficulty,
          moduleId: quizDetails.moduleId,
        },
      });

      // Link question to quiz
      await prisma.quizQuestion.create({
        data: {
          quizId: quiz.id,
          questionId: question.id,
          order: i + 1,
        },
      });
    }
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