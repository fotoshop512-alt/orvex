
export enum AppView {
  DASHBOARD = 'DASHBOARD', // Kept for legacy check, though UI will use Leaderboard
  LEADERBOARD = 'LEADERBOARD',
  VERBS = 'VERBS',
  NOUNS = 'NOUNS',
  ADJECTIVES = 'ADJECTIVES',
  BOOKS = 'BOOKS',
  PRO_BOOKS = 'PRO_BOOKS',
  MINI_EXAMS = 'MINI_EXAMS',
  SENTENCE_EXAMPLES = 'SENTENCE_EXAMPLES',
  GRAMMAR = 'GRAMMAR',
  FILL_IN = 'FILL_IN',
  PODCAST = 'PODCAST',
  EXAM = 'EXAM',
  ADMIN = 'ADMIN',
  SETTINGS = 'SETTINGS'
}

export interface VocabCard {
  id?: number;
  word: string;
  pronunciation?: string;
  definition?: string;
  synonyms: string[];
  exampleSentence: string;
  turkishTranslation: string;
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctOptionIndex: number;
}

export interface ReadingPassage {
  title: string;
  content: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questions: Question[];
}

export interface ExamResult {
  date: string;
  score: number;
  total: number;
  type: 'Vocabulary' | 'Reading' | 'Grammar' | 'Mock';
}

export interface GrammarTopic {
  id: string;
  title: string;
  description: string;
}

export interface GrammarTest {
  id: number;
  title: string;
  questions: Question[];
}

export interface VocabTest {
  id: number;
  title: string;
  questions: Question[];
}

export interface User {
  username: string;
  password?: string;
  securityQuestion: string;
  securityAnswer: string;
  role: 'ADMIN' | 'USER';
  isPro: boolean;
  score?: number; // Total XP/Score for leaderboard
  avatarId?: number; // Profile avatar ID
}