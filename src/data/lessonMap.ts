/**
 * Lesson Map Data Structure
 * 
 * Defines all lesson nodes that appear on the visual map.
 * Each node triggers AI generation on-demand when clicked.
 */

export interface LessonNode {
  id: string;
  title: string;
  subject: 'Math' | 'Science' | 'English' | 'History' | 'Art' | 'Music';
  topic: string;
  gradeLevel: number;
  difficulty: 'easy' | 'medium' | 'hard';
  position: {
    x: number; // Percentage (0-100)
    y: number; // Percentage (0-100)
  };
  icon: string;
  color: string;
  description: string;
  prerequisites?: string[]; // IDs of lessons that should be completed first
}

/**
 * The Lesson Map
 * A visual journey through learning!
 * Lessons generate on-demand when clicked.
 */
export const lessonMap: LessonNode[] = [
  // ============ MATH ISLAND ============
  {
    id: 'math-1',
    title: 'Counting Fun',
    subject: 'Math',
    topic: 'Counting 1-10',
    gradeLevel: 1,
    difficulty: 'easy',
    position: { x: 15, y: 80 },
    icon: '🔢',
    color: 'from-blue-400 to-cyan-500',
    description: 'Learn to count from 1 to 10 with fun activities!',
  },
  {
    id: 'math-2',
    title: 'Addition Adventure',
    subject: 'Math',
    topic: 'Basic Addition',
    gradeLevel: 1,
    difficulty: 'easy',
    position: { x: 25, y: 70 },
    icon: '➕',
    color: 'from-blue-500 to-purple-500',
    description: 'Start adding numbers together!',
    prerequisites: ['math-1'],
  },
  {
    id: 'math-3',
    title: 'Subtraction Station',
    subject: 'Math',
    topic: 'Basic Subtraction',
    gradeLevel: 2,
    difficulty: 'easy',
    position: { x: 35, y: 65 },
    icon: '➖',
    color: 'from-purple-500 to-pink-500',
    description: 'Learn to subtract numbers!',
    prerequisites: ['math-2'],
  },
  {
    id: 'math-4',
    title: 'Multiplication Mountain',
    subject: 'Math',
    topic: 'Times Tables',
    gradeLevel: 3,
    difficulty: 'medium',
    position: { x: 45, y: 60 },
    icon: '✖️',
    color: 'from-pink-500 to-red-500',
    description: 'Master your times tables!',
    prerequisites: ['math-3'],
  },
  {
    id: 'math-5',
    title: 'Division Discovery',
    subject: 'Math',
    topic: 'Division Basics',
    gradeLevel: 3,
    difficulty: 'medium',
    position: { x: 55, y: 55 },
    icon: '➗',
    color: 'from-red-500 to-orange-500',
    description: 'Divide numbers like a pro!',
    prerequisites: ['math-4'],
  },
  {
    id: 'math-6',
    title: 'Fraction Forest',
    subject: 'Math',
    topic: 'Understanding Fractions',
    gradeLevel: 4,
    difficulty: 'medium',
    position: { x: 65, y: 50 },
    icon: '🍰',
    color: 'from-orange-500 to-yellow-500',
    description: 'Slice into the world of fractions!',
    prerequisites: ['math-5'],
  },

  // ============ SCIENCE VALLEY ============
  {
    id: 'science-1',
    title: 'Plants & Seeds',
    subject: 'Science',
    topic: 'Plant Life Cycle',
    gradeLevel: 1,
    difficulty: 'easy',
    position: { x: 20, y: 30 },
    icon: '🌱',
    color: 'from-green-400 to-emerald-500',
    description: 'How do plants grow? Find out!',
  },
  {
    id: 'science-2',
    title: 'Animal Kingdom',
    subject: 'Science',
    topic: 'Types of Animals',
    gradeLevel: 2,
    difficulty: 'easy',
    position: { x: 30, y: 25 },
    icon: '🦁',
    color: 'from-emerald-500 to-teal-500',
    description: 'Explore the amazing animal world!',
  },
  {
    id: 'science-3',
    title: 'Water Cycle',
    subject: 'Science',
    topic: 'How Water Moves',
    gradeLevel: 2,
    difficulty: 'medium',
    position: { x: 40, y: 20 },
    icon: '💧',
    color: 'from-teal-500 to-cyan-600',
    description: 'Journey through rain, rivers, and oceans!',
  },
  {
    id: 'science-4',
    title: 'Solar System',
    subject: 'Science',
    topic: 'Planets & Space',
    gradeLevel: 3,
    difficulty: 'medium',
    position: { x: 50, y: 15 },
    icon: '🪐',
    color: 'from-indigo-500 to-purple-600',
    description: 'Blast off to explore the planets!',
  },
  {
    id: 'science-5',
    title: 'Human Body',
    subject: 'Science',
    topic: 'Body Systems',
    gradeLevel: 4,
    difficulty: 'hard',
    position: { x: 60, y: 10 },
    icon: '🫀',
    color: 'from-purple-600 to-pink-600',
    description: 'Discover how your body works!',
  },

  // ============ ENGLISH GARDEN ============
  {
    id: 'english-1',
    title: 'ABC Adventure',
    subject: 'English',
    topic: 'The Alphabet',
    gradeLevel: 1,
    difficulty: 'easy',
    position: { x: 75, y: 80 },
    icon: '🔤',
    color: 'from-rose-400 to-pink-500',
    description: 'Learn your ABCs!',
  },
  {
    id: 'english-2',
    title: 'Rhyme Time',
    subject: 'English',
    topic: 'Rhyming Words',
    gradeLevel: 1,
    difficulty: 'easy',
    position: { x: 80, y: 70 },
    icon: '🎵',
    color: 'from-pink-500 to-purple-500',
    description: 'Words that sound the same!',
  },
  {
    id: 'english-3',
    title: 'Sentence Builder',
    subject: 'English',
    topic: 'Making Sentences',
    gradeLevel: 2,
    difficulty: 'medium',
    position: { x: 85, y: 60 },
    icon: '📝',
    color: 'from-purple-500 to-indigo-500',
    description: 'Build awesome sentences!',
  },
  {
    id: 'english-4',
    title: 'Story Time',
    subject: 'English',
    topic: 'Reading Comprehension',
    gradeLevel: 3,
    difficulty: 'medium',
    position: { x: 90, y: 50 },
    icon: '📚',
    color: 'from-indigo-500 to-blue-600',
    description: 'Read and understand stories!',
  },

  // ============ HISTORY CASTLE ============
  {
    id: 'history-1',
    title: 'Ancient Egypt',
    subject: 'History',
    topic: 'Pyramids & Pharaohs',
    gradeLevel: 3,
    difficulty: 'medium',
    position: { x: 70, y: 35 },
    icon: '🏺',
    color: 'from-amber-500 to-orange-600',
    description: 'Journey to ancient Egypt!',
  },
  {
    id: 'history-2',
    title: 'Medieval Times',
    subject: 'History',
    topic: 'Knights & Castles',
    gradeLevel: 4,
    difficulty: 'medium',
    position: { x: 80, y: 30 },
    icon: '🏰',
    color: 'from-gray-500 to-slate-600',
    description: 'Explore the age of knights!',
  },

  // ============ ART STUDIO ============
  {
    id: 'art-1',
    title: 'Colors & Shapes',
    subject: 'Art',
    topic: 'Basic Art Concepts',
    gradeLevel: 1,
    difficulty: 'easy',
    position: { x: 10, y: 50 },
    icon: '🎨',
    color: 'from-rainbow-start to-rainbow-end',
    description: 'Explore colors and shapes!',
  },
  {
    id: 'art-2',
    title: 'Drawing Fun',
    subject: 'Art',
    topic: 'Drawing Techniques',
    gradeLevel: 2,
    difficulty: 'easy',
    position: { x: 15, y: 40 },
    icon: '✏️',
    color: 'from-yellow-400 to-orange-500',
    description: 'Learn to draw amazing things!',
  },

  // ============ MUSIC MEADOW ============
  {
    id: 'music-1',
    title: 'Rhythm & Beat',
    subject: 'Music',
    topic: 'Understanding Rhythm',
    gradeLevel: 1,
    difficulty: 'easy',
    position: { x: 85, y: 85 },
    icon: '🥁',
    color: 'from-violet-400 to-purple-500',
    description: 'Feel the rhythm!',
  },
  {
    id: 'music-2',
    title: 'Musical Notes',
    subject: 'Music',
    topic: 'Reading Music',
    gradeLevel: 3,
    difficulty: 'medium',
    position: { x: 90, y: 75 },
    icon: '🎼',
    color: 'from-purple-500 to-pink-600',
    description: 'Learn to read music!',
  },
];

/**
 * Check if a lesson is unlocked based on prerequisites
 */
export function isLessonUnlocked(
  lessonId: string,
  completedLessons: string[]
): boolean {
  const lesson = lessonMap.find(l => l.id === lessonId);
  if (!lesson) return false;
  
  // If no prerequisites, it's unlocked
  if (!lesson.prerequisites || lesson.prerequisites.length === 0) {
    return true;
  }
  
  // Check if all prerequisites are completed
  return lesson.prerequisites.every(prereq => 
    completedLessons.includes(prereq)
  );
}

/**
 * Get lessons organized by subject
 */
export function getLessonsBySubject() {
  const subjects = ['Math', 'Science', 'English', 'History', 'Art', 'Music'];
  const organized: Record<string, LessonNode[]> = {};
  
  subjects.forEach(subject => {
    organized[subject] = lessonMap.filter(l => l.subject === subject);
  });
  
  return organized;
}
