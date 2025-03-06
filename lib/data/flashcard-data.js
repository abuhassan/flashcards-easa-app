// lib/data/flashcard-data.js
export const module3Flashcards = [
  {
    question: "What is Ohm's Law?",
    answer: "Ohm's Law states that current (I) is equal to voltage (V) divided by resistance (R): I = V/R. Alternatively, V = I×R and R = V/I.",
    moduleId: 'module-3',
    subModuleId: 'mod3-topic1',
    difficulty: "medium",
    tags: ['ohms-law', 'fundamentals', 'dc-circuits'],
  },
  // Other flashcards...
];

export const module4Flashcards = [
  // Module 4 flashcards...
];

export const module8Flashcards = [
  // Module 8 flashcards...
];

export const allFlashcards = [
  ...module3Flashcards,
  ...module4Flashcards,
  ...module8Flashcards
];