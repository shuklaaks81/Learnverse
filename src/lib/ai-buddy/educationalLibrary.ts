/**
 * EDUCATIONAL CONTENT LIBRARY
 * Organized knowledge base for AI Buddy
 */

export interface EducationalTopic {
  id: string;
  name: string;
  category: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  keywords: string[];
  content: {
    simple: string;
    detailed: string;
    advanced: string;
  };
  examples: string[];
  relatedTopics: string[];
  funFacts?: string[];
}

export const EDUCATIONAL_LIBRARY: EducationalTopic[] = [
  // === MATH ===
  {
    id: 'addition',
    name: 'Addition',
    category: 'math',
    difficulty: 1,
    keywords: ['add', 'plus', '+', 'sum', 'total'],
    content: {
      simple: 'Addition means putting numbers together! Like 2 apples + 3 apples = 5 apples! 🍎',
      detailed: 'When you add, you combine two or more numbers to get a total. You can count up from the first number!',
      advanced: 'Addition is commutative (2+3 = 3+2) and associative ((1+2)+3 = 1+(2+3)). It\'s the foundation of arithmetic!',
    },
    examples: ['2+3=5', '10+5=15', '7+8=15'],
    relatedTopics: ['subtraction', 'multiplication', 'counting'],
    funFacts: ['Ancient Egyptians used addition over 4000 years ago!'],
  },
  {
    id: 'subtraction',
    name: 'Subtraction',
    category: 'math',
    difficulty: 1,
    keywords: ['subtract', 'minus', '-', 'take away', 'difference'],
    content: {
      simple: 'Subtraction means taking away! Like 5 cookies - 2 cookies = 3 cookies left! 🍪',
      detailed: 'Subtraction finds the difference between numbers. Think of it as counting backwards or removing items!',
      advanced: 'Subtraction is the inverse operation of addition. If a+b=c, then c-b=a!',
    },
    examples: ['5-2=3', '10-4=6', '15-8=7'],
    relatedTopics: ['addition', 'negative numbers'],
  },
  {
    id: 'multiplication',
    name: 'Multiplication',
    category: 'math',
    difficulty: 2,
    keywords: ['multiply', 'times', '×', '*', 'product'],
    content: {
      simple: 'Multiplication is super-fast addition! 3×4 means 3+3+3+3 = 12! ⚡',
      detailed: 'Multiplication is repeated addition. It\'s a shortcut when adding the same number many times!',
      advanced: 'Multiplication is commutative and distributive. Arrays and area models help visualize it!',
    },
    examples: ['3×4=12', '5×6=30', '7×8=56'],
    relatedTopics: ['addition', 'division', 'times tables'],
    funFacts: ['The × symbol was invented in 1631 by William Oughtred!'],
  },
  {
    id: 'division',
    name: 'Division',
    category: 'math',
    difficulty: 2,
    keywords: ['divide', '÷', '/', 'split', 'share'],
    content: {
      simple: 'Division means sharing equally! 12 ÷ 3 means split 12 into 3 groups = 4 in each! 📊',
      detailed: 'Division splits a number into equal groups. It\'s the opposite of multiplication!',
      advanced: 'Division by zero is undefined. Remainders appear when numbers don\'t divide evenly!',
    },
    examples: ['12÷3=4', '20÷5=4', '15÷3=5'],
    relatedTopics: ['multiplication', 'fractions'],
  },

  // === SCIENCE ===
  {
    id: 'solar_system',
    name: 'Solar System',
    category: 'science',
    difficulty: 2,
    keywords: ['planet', 'solar', 'system', 'sun', 'orbit'],
    content: {
      simple: 'Our solar system has 8 planets that go around the Sun! 🌞 Earth is the 3rd planet!',
      detailed: 'The Sun is at the center, and planets orbit around it. Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune!',
      advanced: 'Planets orbit due to gravitational pull. Inner planets are rocky, outer planets are gas giants!',
    },
    examples: ['Mercury is closest to the Sun', 'Jupiter is the biggest planet', 'Saturn has beautiful rings'],
    relatedTopics: ['gravity', 'space', 'astronomy'],
    funFacts: ['A year on Mercury is only 88 Earth days!', 'Neptune was discovered using math before anyone saw it!'],
  },
  {
    id: 'photosynthesis',
    name: 'Photosynthesis',
    category: 'science',
    difficulty: 3,
    keywords: ['photosynthesis', 'plant', 'sunlight', 'chlorophyll', 'oxygen'],
    content: {
      simple: 'Plants make their own food using sunlight! They take in CO₂ and water, and make oxygen for us! 🌱☀️',
      detailed: 'Plants use chlorophyll (makes them green) to capture sunlight energy and convert CO₂ and water into glucose and oxygen!',
      advanced: 'Photosynthesis: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂. Occurs in chloroplasts with light-dependent and independent reactions!',
    },
    examples: ['Trees produce oxygen we breathe', 'Plants grow towards sunlight', 'Algae also photosynthesize'],
    relatedTopics: ['plants', 'oxygen', 'ecosystem'],
    funFacts: ['One large tree can provide oxygen for 2 people per year!'],
  },
  {
    id: 'water_cycle',
    name: 'Water Cycle',
    category: 'science',
    difficulty: 2,
    keywords: ['water', 'cycle', 'evaporation', 'rain', 'condensation'],
    content: {
      simple: 'Water goes up as vapor, forms clouds, and comes down as rain! Then repeats! 🌧️☁️',
      detailed: 'Evaporation → Condensation → Precipitation → Collection. Water continuously moves between Earth and atmosphere!',
      advanced: 'Solar energy drives the cycle. Includes transpiration from plants. Essential for weather patterns and climate!',
    },
    examples: ['Puddles dry up (evaporation)', 'Clouds form (condensation)', 'Rain falls (precipitation)'],
    relatedTopics: ['weather', 'rain', 'climate'],
  },

  // === READING ===
  {
    id: 'main_idea',
    name: 'Main Idea',
    category: 'reading',
    difficulty: 2,
    keywords: ['main idea', 'theme', 'point', 'about'],
    content: {
      simple: 'The main idea is what a story is MOSTLY about! The big important thing! 📖',
      detailed: 'Main idea is the central point or message. Ask: "What is this mostly about?" or "What\'s the author trying to say?"',
      advanced: 'Main idea vs topic: topic is one word (dogs), main idea is a sentence (dogs make loyal pets). Supporting details back it up!',
    },
    examples: ['In a story about space exploration, the main idea might be "humans are curious explorers"'],
    relatedTopics: ['reading comprehension', 'summarizing'],
  },
  {
    id: 'context_clues',
    name: 'Context Clues',
    category: 'reading',
    difficulty: 2,
    keywords: ['context', 'clues', 'meaning', 'unknown word'],
    content: {
      simple: 'Context clues are hints around a word that help you figure out what it means! 🔍',
      detailed: 'Use surrounding words and sentences to figure out unknown words. Look for definitions, examples, or opposites nearby!',
      advanced: 'Types: definition, synonym, antonym, example, inference. Practice improves reading fluency and comprehension!',
    },
    examples: ['"The enormous elephant was huge!" - enormous means very big', '"Unlike cats, dogs need daily walks" - unlike shows difference'],
    relatedTopics: ['vocabulary', 'reading comprehension'],
  },

  // === LANGUAGE ===
  {
    id: 'nouns',
    name: 'Nouns',
    category: 'language',
    difficulty: 1,
    keywords: ['noun', 'person', 'place', 'thing'],
    content: {
      simple: 'A noun is a person, place, or thing! Like: dog, school, happiness! 🎯',
      detailed: 'Nouns name people (teacher), places (park), things (book), or ideas (love). They can be singular or plural!',
      advanced: 'Common nouns (dog) vs proper nouns (Fluffy). Abstract nouns (hope) vs concrete nouns (rock). Collective nouns (team)!',
    },
    examples: ['Person: teacher, doctor', 'Place: school, park', 'Thing: book, car', 'Idea: happiness, freedom'],
    relatedTopics: ['verbs', 'adjectives', 'grammar'],
  },
  {
    id: 'verbs',
    name: 'Verbs',
    category: 'language',
    difficulty: 1,
    keywords: ['verb', 'action', 'doing', 'is', 'was'],
    content: {
      simple: 'Verbs are action words! Run, jump, think, is! They show what someone DOES! 🏃',
      detailed: 'Verbs show action (run, eat) or state of being (is, am, was). Every sentence needs a verb!',
      advanced: 'Action verbs vs linking verbs. Verb tenses show time: past, present, future. Helping verbs assist main verbs!',
    },
    examples: ['Action: run, jump, think', 'Being: is, am, was, were', 'The dog runs (present)', 'The dog ran (past)'],
    relatedTopics: ['nouns', 'adverbs', 'grammar'],
  },
];

export class EducationalLibrary {
  findMatchingTopics(query: string): EducationalTopic[] {
    const lowerQuery = query.toLowerCase();
    return EDUCATIONAL_LIBRARY.filter(topic =>
      topic.keywords.some(keyword => lowerQuery.includes(keyword))
    );
  }

  getTopicById(id: string): EducationalTopic | undefined {
    return EDUCATIONAL_LIBRARY.find(topic => topic.id === id);
  }

  getTopicsByCategory(category: string): EducationalTopic[] {
    return EDUCATIONAL_LIBRARY.filter(topic => topic.category === category);
  }

  getTopicsByDifficulty(difficulty: number): EducationalTopic[] {
    return EDUCATIONAL_LIBRARY.filter(topic => topic.difficulty === difficulty);
  }

  getRandomFunFact(): string {
    const topicsWithFacts = EDUCATIONAL_LIBRARY.filter(t => t.funFacts && t.funFacts.length > 0);
    if (topicsWithFacts.length === 0) return 'Learning is fun! 🎉';
    
    const topic = topicsWithFacts[Math.floor(Math.random() * topicsWithFacts.length)];
    const facts = topic.funFacts!;
    return facts[Math.floor(Math.random() * facts.length)];
  }
}
