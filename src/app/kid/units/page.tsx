'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSoundEffects } from '@/utils/soundEffects';
import BackgroundMusic from '@/components/BackgroundMusic';

interface Topic {
  id: number;
  title: string;
  icon: string;
  completed: boolean;
}

interface Unit {
  id: number;
  name: string;
  subject: string;
  description: string;
  icon: string;
  color: string;
  topics: Topic[];
  unlocked: boolean;
}

export default function UnitsPage() {
  const router = useRouter();
  const [currentKid, setCurrentKid] = useState<any>(null);
  const [expandedUnit, setExpandedUnit] = useState<number | null>(null);
  const soundEffects = useSoundEffects();
  const [completedTopics, setCompletedTopics] = useState<number[]>([]);
  const [selectedPathInfo, setSelectedPathInfo] = useState<any>(null);

  useEffect(() => {
    const kid = JSON.parse(localStorage.getItem('currentKid') || '{}');
    setCurrentKid(kid);
    
    // Check if coming from All You Can Learn
    if (kid.kidId) {
      const pathInfo = localStorage.getItem(`selectedPath_${kid.kidId}`);
      if (pathInfo) {
        setSelectedPathInfo(JSON.parse(pathInfo));
      }
    }
    
    // Load completed topics for this kid
    if (kid.kidId) {
      const progressKey = `progress_${kid.kidId}`;
      const progressData = JSON.parse(localStorage.getItem(progressKey) || '{}');
      setCompletedTopics(progressData.completedTopics || []);
    }
  }, []);

  // Define units for each subject path
  const getUnitsForPath = (pathId: string): Unit[] => {
    if (pathId === 'math-master') {
      return [
        {
          id: 1,
          name: 'Number Sense & Operations',
          subject: 'Math',
          description: 'Master the fundamentals of numbers and basic operations',
          icon: '🔢',
          color: 'from-blue-500 to-cyan-500',
          unlocked: true,
          topics: [
            { id: 101, title: 'Understanding Place Value', icon: '1️⃣', completed: false },
            { id: 102, title: 'Addition Strategies', icon: '➕', completed: false },
            { id: 103, title: 'Subtraction Mastery', icon: '➖', completed: false },
            { id: 104, title: 'Multiplication Tables', icon: '✖️', completed: false },
            { id: 105, title: 'Division Methods', icon: '➗', completed: false },
          ]
        },
        {
          id: 2,
          name: 'Fractions & Decimals',
          subject: 'Math',
          description: 'Dive deep into parts of a whole',
          icon: '½',
          color: 'from-purple-500 to-pink-500',
          unlocked: true,
          topics: [
            { id: 201, title: 'Introduction to Fractions', icon: '🍕', completed: false },
            { id: 202, title: 'Equivalent Fractions', icon: '⚖️', completed: false },
            { id: 203, title: 'Adding & Subtracting Fractions', icon: '🔄', completed: false },
            { id: 204, title: 'Understanding Decimals', icon: '📊', completed: false },
            { id: 205, title: 'Converting Between Forms', icon: '🔀', completed: false },
          ]
        },
        {
          id: 6,
          name: 'Algebra Basics',
          subject: 'Math',
          description: 'Introduction to variables and equations',
          icon: 'x',
          color: 'from-indigo-500 to-purple-500',
          unlocked: true,
          topics: [
            { id: 601, title: 'Variables & Expressions', icon: '🔤', completed: false },
            { id: 602, title: 'Solving Equations', icon: '=', completed: false },
            { id: 603, title: 'Graphing Linear Functions', icon: '📈', completed: false },
            { id: 604, title: 'Systems of Equations', icon: '🔢', completed: false },
            { id: 605, title: 'Inequalities', icon: '>', completed: false },
          ]
        },
        {
          id: 7,
          name: 'Geometry & Measurement',
          subject: 'Math',
          description: 'Shapes, angles, and spatial reasoning',
          icon: '📐',
          color: 'from-cyan-500 to-blue-500',
          unlocked: true,
          topics: [
            { id: 701, title: 'Basic Shapes & Properties', icon: '◼️', completed: false },
            { id: 702, title: 'Angles & Triangles', icon: '📐', completed: false },
            { id: 703, title: 'Area & Perimeter', icon: '📏', completed: false },
            { id: 704, title: 'Volume & Surface Area', icon: '📦', completed: false },
            { id: 705, title: 'Coordinate Geometry', icon: '📊', completed: false },
          ]
        }
      ];
    } else if (pathId === 'science-genius') {
      return [
        {
          id: 3,
          name: 'Living Things & Habitats',
          subject: 'Science',
          description: 'Explore the amazing world of life on Earth',
          icon: '🌿',
          color: 'from-green-500 to-emerald-600',
          unlocked: true,
          topics: [
            { id: 301, title: 'Animal Classifications', icon: '🦁', completed: false },
            { id: 302, title: 'Plant Life Cycles', icon: '🌱', completed: false },
            { id: 303, title: 'Food Chains & Webs', icon: '🍃', completed: false },
            { id: 304, title: 'Ecosystems & Biomes', icon: '🌍', completed: false },
            { id: 305, title: 'Adaptation & Survival', icon: '🦎', completed: false },
          ]
        },
        {
          id: 4,
          name: 'Matter & Energy',
          subject: 'Science',
          description: 'Understand what everything is made of',
          icon: '⚡',
          color: 'from-yellow-500 to-orange-500',
          unlocked: true,
          topics: [
            { id: 401, title: 'States of Matter', icon: '💧', completed: false },
            { id: 402, title: 'Properties of Materials', icon: '🔬', completed: false },
            { id: 403, title: 'Chemical vs Physical Changes', icon: '🧪', completed: false },
            { id: 404, title: 'Forms of Energy', icon: '⚡', completed: false },
            { id: 405, title: 'Heat & Temperature', icon: '🌡️', completed: false },
          ]
        }
      ];
    } else {
      // Default - show all subjects mixed
      return [
    {
      id: 1,
      name: 'Number Sense & Operations',
      subject: 'Math',
      description: 'Master the fundamentals of numbers and basic operations',
      icon: '🔢',
      color: 'from-blue-500 to-cyan-500',
      unlocked: true,
      topics: [
        { id: 101, title: 'Understanding Place Value', icon: '1️⃣', completed: false },
        { id: 102, title: 'Addition Strategies', icon: '➕', completed: false },
        { id: 103, title: 'Subtraction Mastery', icon: '➖', completed: false },
        { id: 104, title: 'Multiplication Tables', icon: '✖️', completed: false },
        { id: 105, title: 'Division Methods', icon: '➗', completed: false },
      ]
    },
    {
      id: 2,
      name: 'Fractions & Decimals',
      subject: 'Math',
      description: 'Dive deep into parts of a whole',
      icon: '½',
      color: 'from-purple-500 to-pink-500',
      unlocked: true,
      topics: [
        { id: 201, title: 'Introduction to Fractions', icon: '🍕', completed: false },
        { id: 202, title: 'Equivalent Fractions', icon: '⚖️', completed: false },
        { id: 203, title: 'Adding & Subtracting Fractions', icon: '🔄', completed: false },
        { id: 204, title: 'Understanding Decimals', icon: '📊', completed: false },
        { id: 205, title: 'Converting Between Forms', icon: '🔀', completed: false },
      ]
    },
    {
      id: 3,
      name: 'Living Things & Habitats',
      subject: 'Science',
      description: 'Explore the amazing world of life on Earth',
      icon: '🌿',
      color: 'from-green-500 to-emerald-600',
      unlocked: true,
      topics: [
        { id: 301, title: 'Animal Classifications', icon: '🦁', completed: false },
        { id: 302, title: 'Plant Life Cycles', icon: '🌱', completed: false },
        { id: 303, title: 'Food Chains & Webs', icon: '🍃', completed: false },
        { id: 304, title: 'Ecosystems & Biomes', icon: '🌍', completed: false },
        { id: 305, title: 'Adaptation & Survival', icon: '🦎', completed: false },
      ]
    },
    {
      id: 4,
      name: 'Matter & Energy',
      subject: 'Science',
      description: 'Understand what everything is made of',
      icon: '⚡',
      color: 'from-yellow-500 to-orange-500',
      unlocked: false,
      topics: [
        { id: 401, title: 'States of Matter', icon: '💧', completed: false },
        { id: 402, title: 'Properties of Materials', icon: '🔬', completed: false },
        { id: 403, title: 'Chemical vs Physical Changes', icon: '🧪', completed: false },
        { id: 404, title: 'Forms of Energy', icon: '⚡', completed: false },
        { id: 405, title: 'Heat & Temperature', icon: '🌡️', completed: false },
      ]
    },
    {
      id: 5,
      name: 'Reading Comprehension',
      subject: 'English',
      description: 'Become a master reader and understand any text',
      icon: '📖',
      color: 'from-indigo-500 to-blue-500',
      unlocked: true,
      topics: [
        { id: 501, title: 'Main Idea & Details', icon: '🎯', completed: false },
        { id: 502, title: 'Making Inferences', icon: '🔍', completed: false },
        { id: 503, title: 'Story Elements', icon: '📚', completed: false },
        { id: 504, title: 'Context Clues', icon: '🔑', completed: false },
        { id: 505, title: 'Summarizing Texts', icon: '📝', completed: false },
      ]
    },
    {
      id: 6,
      name: 'Grammar & Writing',
      subject: 'English',
      description: 'Write correctly and express yourself clearly',
      icon: '✍️',
      color: 'from-rose-500 to-pink-500',
      unlocked: false,
      topics: [
        { id: 601, title: 'Parts of Speech', icon: '🔤', completed: false },
        { id: 602, title: 'Sentence Structure', icon: '📐', completed: false },
        { id: 603, title: 'Punctuation Rules', icon: '❓', completed: false },
        { id: 604, title: 'Paragraph Writing', icon: '📄', completed: false },
        { id: 605, title: 'Editing & Revising', icon: '✏️', completed: false },
      ]
    },
    {
      id: 7,
      name: 'Ancient Civilizations',
      subject: 'History',
      description: 'Journey back to the dawn of human civilization',
      icon: '🏛️',
      color: 'from-amber-600 to-orange-600',
      unlocked: false,
      topics: [
        { id: 701, title: 'Ancient Egypt', icon: '🔺', completed: false },
        { id: 702, title: 'Ancient Greece', icon: '🏺', completed: false },
        { id: 703, title: 'Ancient Rome', icon: '🏛️', completed: false },
        { id: 704, title: 'Ancient China', icon: '🐉', completed: false },
        { id: 705, title: 'Mesopotamia', icon: '📜', completed: false },
      ]
    },
    {
      id: 8,
      name: 'World Geography',
      subject: 'History',
      description: 'Explore continents, countries, and cultures',
      icon: '🌍',
      color: 'from-teal-500 to-cyan-600',
      unlocked: false,
      topics: [
        { id: 801, title: 'Maps & Globes', icon: '🗺️', completed: false },
        { id: 802, title: 'The Seven Continents', icon: '🌎', completed: false },
        { id: 803, title: 'Oceans & Landforms', icon: '🏔️', completed: false },
        { id: 804, title: 'Countries & Capitals', icon: '🏙️', completed: false },
        { id: 805, title: 'World Cultures', icon: '🎭', completed: false },
      ]
    },
  ];
    }
  };

  // Get units based on selected path or show all
  const units = getUnitsForPath(selectedPathInfo?.path || 'all');

  const handleUnitClick = (unitId: number, unlocked: boolean) => {
    if (unlocked) {
      soundEffects?.playClick();
      setExpandedUnit(expandedUnit === unitId ? null : unitId);
    } else {
      soundEffects?.playWrong();
    }
  };

  const handleTopicClick = (topicId: number) => {
    soundEffects?.playClick();
    router.push(`/kid/topic/${topicId}`);
  };

  const subjects = ['All', 'Math', 'Science', 'English', 'History'];
  const [selectedSubject, setSelectedSubject] = useState('All');

  const filteredUnits = selectedSubject === 'All' 
    ? units 
    : units.filter(unit => unit.subject === selectedSubject);

  const totalTopics = units.reduce((acc, unit) => acc + unit.topics.length, 0);
  const completedTopicsCount = units.reduce((acc, unit) => 
    acc + unit.topics.filter(t => completedTopics.includes(t.id)).length, 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-400 via-orange-300 to-pink-300 p-3 sm:p-4 lg:p-6">
      <BackgroundMusic />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <div>
              {selectedPathInfo ? (
                <>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    🎓 {selectedPathInfo.pathName} - Grade {selectedPathInfo.grade}
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
                    Learning at Grade {selectedPathInfo.grade} level • Choose any unit below!
                  </p>
                  <button
                    onClick={() => {
                      if (currentKid.kidId) {
                        localStorage.removeItem(`selectedPath_${currentKid.kidId}`);
                      }
                      setSelectedPathInfo(null);
                    }}
                    className="text-xs text-purple-600 hover:text-purple-700 mt-1"
                  >
                    ← Back to all units
                  </button>
                </>
              ) : (
                <>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    📚 Learning Units
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
                    Deep dive into {units.length} units • {totalTopics} total topics • {completedTopicsCount} completed
                  </p>
                </>
              )}
            </div>
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <Link
                href="/kid/map"
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:shadow-lg transition-all hover:scale-105 text-sm sm:text-base flex-1 sm:flex-none text-center"
              >
                🗺️ View Map
              </Link>
              <Link
                href="/kid/lessons"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:shadow-lg transition-all hover:scale-105 text-sm sm:text-base flex-1 sm:flex-none text-center"
              >
                ← Back
              </Link>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 sm:mt-4 bg-gray-200 rounded-full h-3 sm:h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-1000"
              style={{ width: `${(completedTopicsCount / totalTopics) * 100}%` }}
            />
          </div>
        </div>

        {/* Subject Filter */}
        <div className="bg-white/90 backdrop-blur rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-3">Filter by Subject:</h2>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => {
                  soundEffects?.playClick();
                  setSelectedSubject(subject);
                }}
                className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full font-semibold transition-all text-sm sm:text-base ${
                  selectedSubject === subject
                    ? 'bg-purple-600 text-white shadow-lg scale-105'
                    : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>

        {/* Units Grid */}
        <div className="space-y-3 sm:space-y-4">
          {filteredUnits.map((unit) => (
            <div
              key={unit.id}
              className={`bg-white/90 backdrop-blur rounded-xl sm:rounded-2xl shadow-xl overflow-hidden transition-all ${
                unit.unlocked ? 'hover:shadow-2xl' : 'opacity-60'
              }`}
            >
              {/* Unit Header */}
              <button
                onClick={() => handleUnitClick(unit.id, unit.unlocked)}
                className={`w-full p-4 sm:p-6 text-left transition-all ${
                  unit.unlocked ? 'hover:bg-gray-50 cursor-pointer' : 'cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4 flex-1">
                    <div
                      className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${unit.color} flex items-center justify-center text-2xl sm:text-3xl shadow-lg flex-shrink-0`}
                    >
                      {unit.unlocked ? unit.icon : '🔒'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">{unit.name}</h3>
                        <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                          {unit.subject}
                        </span>
                        {unit.unlocked && (
                          <Link
                            href={`/kid/map?subject=${unit.subject}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              soundEffects?.playClick();
                            }}
                            className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full text-xs font-bold hover:shadow-lg transition-all"
                          >
                            🗺️ View Map
                          </Link>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm lg:text-base text-gray-600 mt-1">{unit.description}</p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        {unit.topics.filter(t => t.completed).length}/{unit.topics.length} topics completed
                      </p>
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl lg:text-3xl flex-shrink-0 ml-2">
                    {expandedUnit === unit.id ? '⬆️' : '⬇️'}
                  </div>
                </div>
              </button>

              {/* Topics List */}
              {expandedUnit === unit.id && unit.unlocked && (
                <div className="border-t border-gray-200 bg-gray-50 p-4 sm:p-6">
                  <h4 className="font-bold text-base sm:text-lg text-gray-800 mb-3 sm:mb-4">📝 Topics in this unit:</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3">
                    {unit.topics.map((topic, index) => {
                      const isCompleted = completedTopics.includes(topic.id);
                      return (
                      <button
                        key={topic.id}
                        onClick={() => handleTopicClick(topic.id)}
                        className={`p-3 sm:p-4 rounded-lg sm:rounded-xl text-left transition-all ${
                          isCompleted
                            ? 'bg-green-100 border-2 border-green-400'
                            : 'bg-white border-2 border-gray-200 hover:border-purple-400 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="text-2xl sm:text-3xl flex-shrink-0">{topic.icon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                              <span className="font-bold text-gray-700 text-sm sm:text-base">
                                {index + 1}. {topic.title}
                              </span>
                              {isCompleted && <span className="text-base sm:text-lg">✅</span>}
                            </div>
                          </div>
                        </div>
                      </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
