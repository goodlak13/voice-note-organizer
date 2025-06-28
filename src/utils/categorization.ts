import { CATEGORIES, DEFAULT_CATEGORY } from '../constants/categories';
import { CategoryType } from '../types';

export const analyzeAudioForCategory = async (audioBlob: Blob): Promise<CategoryType> => {
  // In a real implementation, this would use speech-to-text API
  // For now, we'll simulate smart categorization based on audio characteristics
  
  const duration = await getAudioDuration(audioBlob);
  const size = audioBlob.size;
  
  // Simple heuristic-based categorization
  // In production, this would analyze actual speech content
  if (duration < 10) {
    return 'tasks'; // Short notes often reminders
  } else if (duration > 60) {
    return 'ideas'; // Longer notes often complex thoughts
  } else if (size > 100000) {
    return 'work'; // Higher quality/longer recordings often work-related
  }
  
  // Random assignment for demo purposes
  const randomIndex = Math.floor(Math.random() * (CATEGORIES.length - 1));
  return CATEGORIES[randomIndex].id;
};

const getAudioDuration = (audioBlob: Blob): Promise<number> => {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.onloadedmetadata = () => {
      resolve(audio.duration);
    };
    audio.src = URL.createObjectURL(audioBlob);
  });
};

export const generateTitle = (duration: number, category: CategoryType): string => {
  const categoryInfo = CATEGORIES.find(cat => cat.id === category);
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  const titles = {
    ideas: ['Brilliant Idea', 'Creative Thought', 'Innovation', 'Inspiration'],
    shopping: ['Shopping List', 'Errands', 'Things to Buy', 'Market Run'],
    work: ['Work Note', 'Meeting Thoughts', 'Project Idea', 'Business Note'],
    tasks: ['Reminder', 'Don\'t Forget', 'To-Do Item', 'Important Task'],
    goals: ['Future Goal', 'Dream Note', 'Aspiration', 'Life Plan'],
    random: ['Quick Thought', 'Random Note', 'Voice Memo', 'Spontaneous Idea']
  };
  
  const categoryTitles = titles[category] || titles.random;
  const randomTitle = categoryTitles[Math.floor(Math.random() * categoryTitles.length)];
  
  return `${randomTitle} (${timestamp})`;
};

export const getCategoryColor = (category: CategoryType): string => {
  const categoryInfo = CATEGORIES.find(cat => cat.id === category);
  return categoryInfo?.color || CATEGORIES.find(cat => cat.id === DEFAULT_CATEGORY)!.color;
};

export const getCategoryEmoji = (category: CategoryType): string => {
  const categoryInfo = CATEGORIES.find(cat => cat.id === category);
  return categoryInfo?.emoji || CATEGORIES.find(cat => cat.id === DEFAULT_CATEGORY)!.emoji;
};