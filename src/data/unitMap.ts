/**
 * Unit Map Data Structure
 * 
 * Comprehensive learning units where kids explore big topics with their buddy!
 * Each unit contains EVERYTHING about a subject.
 */

export interface UnitLesson {
  id: string;
  title: string;
  description: string;
  icon: string;
  duration: string; // "5 min", "10 min"
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string; // Gradient colors
  grade: string; // "K-2", "3-5"
  totalLessons: number;
  position: {
    x: number; // Percentage
    y: number; // Percentage
  };
  lessons: UnitLesson[];
  funFacts: string[];
  prerequisites?: string[]; // Other unit IDs needed first
}

/**
 * THE UNIT MAP - A Journey Through Knowledge! 🗺️
 */
export const unitMap: Unit[] = [
  // ========== NATURE & LIFE ==========
  {
    id: 'plants',
    title: '🌱 Plant Kingdom',
    description: 'Discover everything about plants - from tiny seeds to giant trees!',
    icon: '🌿',
    color: 'from-green-400 via-emerald-500 to-teal-600',
    grade: 'K-2',
    totalLessons: 8,
    position: { x: 15, y: 75 },
    lessons: [
      { id: 'plants-1', title: 'What Are Plants?', description: 'Learn what makes plants special!', icon: '🌱', duration: '5 min' },
      { id: 'plants-2', title: 'Seeds & Growth', description: 'How do seeds become plants?', icon: '🌰', duration: '7 min' },
      { id: 'plants-3', title: 'Roots, Stems & Leaves', description: 'Plant parts and their jobs!', icon: '🍃', duration: '8 min' },
      { id: 'plants-4', title: 'How Plants Eat', description: 'Photosynthesis made simple!', icon: '☀️', duration: '10 min' },
      { id: 'plants-5', title: 'Flowers & Fruits', description: 'Why do plants make flowers?', icon: '🌸', duration: '6 min' },
      { id: 'plants-6', title: 'Types of Plants', description: 'Trees, flowers, grass and more!', icon: '🌳', duration: '7 min' },
      { id: 'plants-7', title: 'Plants We Eat', description: 'Vegetables, fruits and grains!', icon: '🥕', duration: '8 min' },
      { id: 'plants-8', title: 'Caring for Plants', description: 'Become a plant expert!', icon: '💚', duration: '5 min' },
    ],
    funFacts: [
      '🌳 The tallest tree is over 380 feet tall!',
      '🌻 Sunflowers follow the sun across the sky!',
      '🌿 Plants make the oxygen we breathe!',
      '🎋 Bamboo can grow 3 feet in ONE day!',
    ],
  },
  {
    id: 'animals',
    title: '🦁 Animal Kingdom',
    description: 'Explore the amazing world of animals from tiny bugs to giant whales!',
    icon: '🐾',
    color: 'from-orange-400 via-amber-500 to-yellow-600',
    grade: 'K-2',
    totalLessons: 10,
    position: { x: 30, y: 70 },
    lessons: [
      { id: 'animals-1', title: 'What Are Animals?', description: 'Learn about living creatures!', icon: '🐕', duration: '5 min' },
      { id: 'animals-2', title: 'Mammals', description: 'Warm-blooded furry friends!', icon: '🐻', duration: '8 min' },
      { id: 'animals-3', title: 'Birds', description: 'Animals that can fly!', icon: '🦅', duration: '7 min' },
      { id: 'animals-4', title: 'Reptiles', description: 'Scaly and cool-blooded!', icon: '🦎', duration: '8 min' },
      { id: 'animals-5', title: 'Fish', description: 'Life underwater!', icon: '🐠', duration: '7 min' },
      { id: 'animals-6', title: 'Amphibians', description: 'Land and water animals!', icon: '🐸', duration: '7 min' },
      { id: 'animals-7', title: 'Insects', description: 'The tiny world of bugs!', icon: '🐛', duration: '8 min' },
      { id: 'animals-8', title: 'Animal Habitats', description: 'Where animals live!', icon: '🏞️', duration: '9 min' },
      { id: 'animals-9', title: 'Food Chains', description: 'Who eats what?', icon: '🍖', duration: '10 min' },
      { id: 'animals-10', title: 'Amazing Animals', description: 'Weird and wonderful creatures!', icon: '🦄', duration: '8 min' },
    ],
    funFacts: [
      '🐘 Elephants can hear with their feet!',
      '🦒 Giraffes have the same number of neck bones as humans!',
      '🐙 Octopuses have three hearts!',
      '🦘 Kangaroos can\'t walk backwards!',
    ],
  },
  {
    id: 'ocean',
    title: '🌊 Ocean World',
    description: 'Dive deep into the mysterious ocean and discover sea life!',
    icon: '🐋',
    color: 'from-blue-400 via-cyan-500 to-teal-600',
    grade: 'K-2',
    totalLessons: 7,
    position: { x: 45, y: 80 },
    lessons: [
      { id: 'ocean-1', title: 'The Ocean', description: 'What is the ocean?', icon: '🌊', duration: '6 min' },
      { id: 'ocean-2', title: 'Ocean Animals', description: 'Fish, whales, dolphins!', icon: '🐬', duration: '8 min' },
      { id: 'ocean-3', title: 'Coral Reefs', description: 'Cities under the sea!', icon: '🪸', duration: '7 min' },
      { id: 'ocean-4', title: 'Deep Sea', description: 'The darkest depth!', icon: '🦑', duration: '9 min' },
      { id: 'ocean-5', title: 'Sharks', description: 'Ocean predators!', icon: '🦈', duration: '7 min' },
      { id: 'ocean-6', title: 'Ocean Zones', description: 'Layers of the ocean!', icon: '🌊', duration: '8 min' },
      { id: 'ocean-7', title: 'Protecting Oceans', description: 'Keep our oceans clean!', icon: '♻️', duration: '6 min' },
    ],
    funFacts: [
      '🌊 Oceans cover 71% of Earth!',
      '🐋 Blue whales are the biggest animals EVER!',
      '🦑 Giant squid have eyes as big as basketballs!',
      '🐠 There are more fish species than all other vertebrates combined!',
    ],
  },

  // ========== SPACE & SCIENCE ==========
  {
    id: 'space',
    title: '🚀 Space Adventure',
    description: 'Blast off to explore planets, stars, and the universe!',
    icon: '🪐',
    color: 'from-indigo-500 via-purple-600 to-pink-600',
    grade: '3-5',
    totalLessons: 9,
    position: { x: 70, y: 20 },
    lessons: [
      { id: 'space-1', title: 'The Solar System', description: 'Our cosmic neighborhood!', icon: '☀️', duration: '8 min' },
      { id: 'space-2', title: 'The Sun', description: 'Our amazing star!', icon: '☀️', duration: '7 min' },
      { id: 'space-3', title: 'Inner Planets', description: 'Mercury, Venus, Earth, Mars!', icon: '🌍', duration: '10 min' },
      { id: 'space-4', title: 'Outer Planets', description: 'Jupiter, Saturn, Uranus, Neptune!', icon: '🪐', duration: '10 min' },
      { id: 'space-5', title: 'The Moon', description: 'Earth\'s closest neighbor!', icon: '🌙', duration: '7 min' },
      { id: 'space-6', title: 'Stars & Galaxies', description: 'Beyond our solar system!', icon: '⭐', duration: '9 min' },
      { id: 'space-7', title: 'Astronauts', description: 'People in space!', icon: '👨‍🚀', duration: '8 min' },
      { id: 'space-8', title: 'Space Travel', description: 'Rockets and spaceships!', icon: '🚀', duration: '9 min' },
      { id: 'space-9', title: 'Space Mysteries', description: 'Black holes and more!', icon: '🕳️', duration: '10 min' },
    ],
    funFacts: [
      '🌟 There are more stars than grains of sand on Earth!',
      '🪐 Saturn would float in water!',
      '🌍 One day on Venus is longer than one year on Venus!',
      '🚀 The footprints on the Moon will last for millions of years!',
    ],
  },
  {
    id: 'weather',
    title: '⛅ Weather World',
    description: 'Understand rain, snow, storms, and how weather works!',
    icon: '🌈',
    color: 'from-sky-400 via-blue-500 to-indigo-600',
    grade: 'K-2',
    totalLessons: 6,
    position: { x: 60, y: 65 },
    lessons: [
      { id: 'weather-1', title: 'What is Weather?', description: 'Sun, clouds, rain!', icon: '☁️', duration: '5 min' },
      { id: 'weather-2', title: 'The Water Cycle', description: 'Where does rain come from?', icon: '💧', duration: '8 min' },
      { id: 'weather-3', title: 'Clouds', description: 'Fluffy sky puffs!', icon: '☁️', duration: '6 min' },
      { id: 'weather-4', title: 'Seasons', description: 'Spring, Summer, Fall, Winter!', icon: '🍂', duration: '8 min' },
      { id: 'weather-5', title: 'Storms', description: 'Thunder, lightning, tornadoes!', icon: '⛈️', duration: '9 min' },
      { id: 'weather-6', title: 'Climate', description: 'Hot and cold places!', icon: '🌡️', duration: '7 min' },
    ],
    funFacts: [
      '⚡ Lightning is 5 times hotter than the sun!',
      '🌈 Rainbows have 7 colors!',
      '❄️ No two snowflakes are exactly alike!',
      '🌪️ Tornadoes can spin at 300 mph!',
    ],
  },

  // ========== EARTH & ENVIRONMENT ==========
  {
    id: 'earth',
    title: '🌍 Planet Earth',
    description: 'Learn about our amazing planet - mountains, valleys, and more!',
    icon: '🗻',
    color: 'from-lime-400 via-green-500 to-emerald-600',
    grade: '3-5',
    totalLessons: 8,
    position: { x: 85, y: 50 },
    lessons: [
      { id: 'earth-1', title: 'Earth\'s Structure', description: 'Inside our planet!', icon: '🌋', duration: '8 min' },
      { id: 'earth-2', title: 'Rocks & Minerals', description: 'What Earth is made of!', icon: '🪨', duration: '7 min' },
      { id: 'earth-3', title: 'Mountains', description: 'Peaks and valleys!', icon: '⛰️', duration: '8 min' },
      { id: 'earth-4', title: 'Volcanoes', description: 'Hot lava and eruptions!', icon: '🌋', duration: '9 min' },
      { id: 'earth-5', title: 'Earthquakes', description: 'When the ground shakes!', icon: '📊', duration: '8 min' },
      { id: 'earth-6', title: 'Rivers & Lakes', description: 'Fresh water on Earth!', icon: '🏞️', duration: '7 min' },
      { id: 'earth-7', title: 'Continents', description: 'The seven continents!', icon: '🗺️', duration: '8 min' },
      { id: 'earth-8', title: 'Caring for Earth', description: 'Protect our planet!', icon: '♻️', duration: '6 min' },
    ],
    funFacts: [
      '🌍 Earth is 4.5 billion years old!',
      '🌋 There are about 1,500 active volcanoes on Earth!',
      '🏔️ Mount Everest grows about 4mm taller every year!',
      '💎 Diamonds are made deep inside Earth!',
    ],
  },

  // ========== BODY & HEALTH ==========
  {
    id: 'body',
    title: '🫀 Human Body',
    description: 'Discover how your amazing body works!',
    icon: '🧠',
    color: 'from-pink-400 via-rose-500 to-red-600',
    grade: '3-5',
    totalLessons: 9,
    position: { x: 20, y: 30 },
    lessons: [
      { id: 'body-1', title: 'Your Amazing Body', description: 'What makes you work!', icon: '👤', duration: '6 min' },
      { id: 'body-2', title: 'The Skeleton', description: 'Your bones!', icon: '🦴', duration: '8 min' },
      { id: 'body-3', title: 'Muscles', description: 'How you move!', icon: '💪', duration: '7 min' },
      { id: 'body-4', title: 'The Heart', description: 'Your body\'s pump!', icon: '❤️', duration: '8 min' },
      { id: 'body-5', title: 'The Brain', description: 'Your control center!', icon: '🧠', duration: '9 min' },
      { id: 'body-6', title: 'The Five Senses', description: 'See, hear, smell, taste, touch!', icon: '👁️', duration: '8 min' },
      { id: 'body-7', title: 'Digestion', description: 'How you process food!', icon: '🍎', duration: '9 min' },
      { id: 'body-8', title: 'Breathing', description: 'How you get oxygen!', icon: '🫁', duration: '7 min' },
      { id: 'body-9', title: 'Staying Healthy', description: 'Take care of yourself!', icon: '💚', duration: '6 min' },
    ],
    funFacts: [
      '🧠 Your brain has about 86 billion neurons!',
      '💓 Your heart beats 100,000 times a day!',
      '🦴 Babies have more bones than adults!',
      '👃 Your nose can remember 50,000 different scents!',
    ],
  },

  // ========== ENERGY & FORCES ==========
  {
    id: 'energy',
    title: '⚡ Energy & Forces',
    description: 'Learn about electricity, magnets, and how things move!',
    icon: '🔋',
    color: 'from-yellow-400 via-amber-500 to-orange-600',
    grade: '3-5',
    totalLessons: 7,
    position: { x: 50, y: 35 },
    lessons: [
      { id: 'energy-1', title: 'What is Energy?', description: 'The power to do things!', icon: '⚡', duration: '7 min' },
      { id: 'energy-2', title: 'Types of Energy', description: 'Light, heat, sound, motion!', icon: '💡', duration: '8 min' },
      { id: 'energy-3', title: 'Electricity', description: 'Power in wires!', icon: '🔌', duration: '9 min' },
      { id: 'energy-4', title: 'Magnets', description: 'Push and pull!', icon: '🧲', duration: '7 min' },
      { id: 'energy-5', title: 'Gravity', description: 'What keeps us down!', icon: '🪂', duration: '8 min' },
      { id: 'energy-6', title: 'Simple Machines', description: 'Levers, pulleys, wheels!', icon: '⚙️', duration: '9 min' },
      { id: 'energy-7', title: 'Renewable Energy', description: 'Solar, wind, water power!', icon: '☀️', duration: '8 min' },
    ],
    funFacts: [
      '⚡ Lightning contains 1 billion volts!',
      '🧲 Earth is a giant magnet!',
      '☀️ The sun produces enough energy in 1 second to power Earth for 500,000 years!',
      '🔋 Your body produces its own electricity!',
    ],
  },
];

/**
 * Check if unit is unlocked
 */
export function isUnitUnlocked(
  unitId: string,
  completedUnits: string[]
): boolean {
  const unit = unitMap.find(u => u.id === unitId);
  if (!unit) return false;
  
  if (!unit.prerequisites || unit.prerequisites.length === 0) {
    return true;
  }
  
  return unit.prerequisites.every(prereq => completedUnits.includes(prereq));
}

/**
 * Get unit progress (how many lessons completed)
 */
export function getUnitProgress(
  unitId: string,
  completedLessons: string[]
): number {
  const unit = unitMap.find(u => u.id === unitId);
  if (!unit) return 0;
  
  const completed = unit.lessons.filter(lesson => 
    completedLessons.includes(lesson.id)
  ).length;
  
  return Math.round((completed / unit.totalLessons) * 100);
}
