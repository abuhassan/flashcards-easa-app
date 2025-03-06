// types/index.ts - Define the module and flashcard types

export type ModuleType = {
  id: string;
  name: string;
  code: string;
  licenseType: string;
  description: string;
  iconUrl?: string;
  topics: TopicType[];
};

export type TopicType = {
  id: string;
  name: string;
  description: string;
};

export type FlashcardType = {
  id: string;
  question: string;
  answer: string;
  moduleId: string;
  topicId?: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  tags: string[];
};