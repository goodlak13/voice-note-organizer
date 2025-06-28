import { Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'ideas',
    name: 'Ideas & Thoughts',
    emoji: '🧠',
    color: 'from-purple-400 to-purple-600',
    keywords: ['idea', 'think', 'concept', 'maybe', 'what if', 'brainstorm', 'creative'],
    description: 'Brilliant ideas and creative thoughts'
  },
  {
    id: 'shopping',
    name: 'Shopping & Errands',
    emoji: '🛒',
    color: 'from-green-400 to-green-600',
    keywords: ['buy', 'store', 'grocery', 'pickup', 'need', 'shop', 'market'],
    description: 'Shopping lists and errands to run'
  },
  {
    id: 'work',
    name: 'Work & Business',
    emoji: '💼',
    color: 'from-blue-400 to-blue-600',
    keywords: ['meeting', 'project', 'deadline', 'email', 'call', 'client', 'business'],
    description: 'Work-related notes and reminders'
  },
  {
    id: 'tasks',
    name: 'Tasks & Reminders',
    emoji: '📝',
    color: 'from-orange-400 to-orange-600',
    keywords: ['remember', 'don\'t forget', 'tomorrow', 'later', 'remind', 'todo'],
    description: 'Important tasks and reminders'
  },
  {
    id: 'goals',
    name: 'Goals & Dreams',
    emoji: '🎯',
    color: 'from-pink-400 to-pink-600',
    keywords: ['want to', 'goal', 'dream', 'aspire', 'achieve', 'plan', 'future'],
    description: 'Personal goals and aspirations'
  },
  {
    id: 'random',
    name: 'Random Thoughts',
    emoji: '📱',
    color: 'from-gray-400 to-gray-600',
    keywords: [],
    description: 'Miscellaneous thoughts and ideas'
  }
];

export const DEFAULT_CATEGORY = 'random';
export const MAX_RECORDING_LENGTH = 300; // 5 minutes in seconds