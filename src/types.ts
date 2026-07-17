export interface UserStats {
  xp: number;
  level: number;
  coins: number;
  streak: number;
  lastActive: string; // ISO string date
  completedLessons: string[]; // lesson keys
  achievements: Achievement[];
  inventory: string[]; // items bought from shop
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index of options
  explanation: string;
}

export interface LessonSection {
  id: string;
  title: string;
  icon: string;
  steps: {
    title: string;
    content: string;
    interactiveType?: 'input' | 'choice' | 'sort' | 'info';
    interactiveData?: any;
  }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export type Difficulty = 'nhan-biet' | 'thong-hieu' | 'van-dung' | 'van-dung-cao';

export type QuestionType =
  | 'multiple-choice'
  | 'true-false'
  | 'fill-blank'
  | 'matching'
  | 'sorting'
  | 'table-fill'
  | 'multi-select';

export interface MatchingItem {
  left: string;
  right: string;
}

export interface TableRow {
  label: string;
  coeff: string;
  deg: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  difficulty: Difficulty;
  questionText: string;
  tooltip?: string;
  
  options?: string[];
  correctOptionIndex?: number;
  correctOptionIndices?: number[];
  
  isTrue?: boolean;
  
  correctAnswerText?: string;
  
  matchingPairs?: MatchingItem[];
  
  itemsToSort?: string[];
  sortedIndices?: number[];
  
  tableRows?: TableRow[];
  tableFields?: { rowIdx: number; field: 'coeff' | 'deg'; placeholder: string }[];
  
  explanation: string[];
  tip?: string;
  similarExample?: string;
}

