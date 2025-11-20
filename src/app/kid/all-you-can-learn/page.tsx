'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BackgroundMusic from '@/components/BackgroundMusic';

interface LearningPath {
  id: string;
  subject: string;
  icon: string;
  color: string;
  currentLevel: number;
  maxLevel: number;
  description: string;
}

export default function AllYouCanLearn() {
  const [currentKid, setCurrentKid] = useState<any>(null);
  const [gradeLevel, setGradeLevel] = useState(3);
  const [showGradeSetup, setShowGradeSetup] = useState(false);

  useEffect(() => {
    const kid = JSON.parse(localStorage.getItem('currentKid') || '{}');
    setCurrentKid(kid);
    
    // Check if grade level is set
    if (kid.kidId) {
      const savedGrade = localStorage.getItem(`grade_${kid.kidId}`);
      if (savedGrade) {
        setGradeLevel(parseInt(savedGrade));
      } else {
        setShowGradeSetup(true);
      }
    }
  }, []);

  const handleGradeSelect = (grade: number) => {
    setGradeLevel(grade);
    if (currentKid.kidId) {
      localStorage.setItem(`grade_${currentKid.kidId}`, grade.toString());
    }
    setShowGradeSetup(false);
  };

  const learningPaths: LearningPath[] = [
    {
      id: 'math-master',
      subject: 'Math Master',
      icon: '🔢',
      color: 'from-blue-500 to-cyan-500',
      currentLevel: gradeLevel,
      maxLevel: 12,
      description: 'From basic arithmetic to calculus!'
    },
    {
      id: 'science-genius',
      subject: 'Science Genius',
      icon: '🔬',
      color: 'from-green-500 to-emerald-500',
      currentLevel: gradeLevel,
      maxLevel: 12,
      description: 'Explore physics, chemistry, biology & more!'
    },
    {
      id: 'reading-champion',
      subject: 'Reading Champion',
      icon: '📚',
      color: 'from-purple-500 to-pink-500',
      currentLevel: gradeLevel,
      maxLevel: 12,
      description: 'Master reading comprehension & literature!'
    },
    {
      id: 'coding-wizard',
      subject: 'Coding Wizard',
      icon: '💻',
      color: 'from-orange-500 to-red-500',
      currentLevel: Math.max(gradeLevel - 1, 1),
      maxLevel: 12,
      description: 'Learn programming from scratch to advanced!'
    },
    {
      id: 'history-explorer',
      subject: 'History Explorer',
      icon: '🏛️',
      color: 'from-yellow-500 to-orange-500',
      currentLevel: gradeLevel,
      maxLevel: 12,
      description: 'Travel through time and learn world history!'
    },
    {
      id: 'art-creator',
      subject: 'Art Creator',
      icon: '🎨',
      color: 'from-pink-500 to-rose-500',
      currentLevel: gradeLevel,
      maxLevel: 12,
      description: 'Learn drawing, painting & digital art!'
    }
  ];

  if (showGradeSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
          <h1 className="text-3xl font-bold text-center text-purple-600 mb-4">
            🎓 Welcome to All You Can Learn!
          </h1>
          <p className="text-center text-gray-700 mb-6">
            What grade are you in? We&apos;ll start you there and help you level up! 🚀
          </p>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((grade) => (
              <button
                key={grade}
                onClick={() => handleGradeSelect(grade)}
                className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold py-4 rounded-xl hover:scale-110 transition-transform text-xl shadow-lg"
              >
                {grade}
              </button>
            ))}
          </div>

          <p className="text-sm text-gray-500 text-center">
            💡 Don&apos;t worry! You can always learn above your grade level - that&apos;s the whole point!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 p-4 sm:p-6">
      <BackgroundMusic />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                🎓 All You Can Learn!
              </h1>
              <p className="text-gray-600 mt-2">
                Currently learning at <span className="font-bold text-purple-600">Grade {gradeLevel}</span> level
              </p>
              <p className="text-sm text-gray-500">
                Complete lessons to unlock higher grade levels! 🚀
              </p>
            </div>
            <Link
              href="/kid/units"
              className="bg-gray-200 text-gray-700 font-bold px-6 py-3 rounded-xl hover:bg-gray-300 transition-colors"
            >
              ← Back
            </Link>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl shadow-xl p-6 mb-6 border-4 border-yellow-500">
          <div className="flex items-center gap-4">
            <div className="text-5xl">🌟</div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Level Up Your Brain!</h2>
              <p className="text-white">
                Start at your grade level and work your way up! Each subject can go all the way to Grade 12 (college prep)! 
                The more you learn, the smarter you get! 💪🧠
              </p>
            </div>
          </div>
        </div>

        {/* Learning Paths */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {learningPaths.map((path) => (
            <div
              key={path.id}
              className="bg-white rounded-2xl shadow-xl overflow-hidden hover:scale-105 transition-transform"
            >
              {/* Header */}
              <div className={`bg-gradient-to-br ${path.color} p-6 text-white`}>
                <div className="text-5xl mb-3 text-center">{path.icon}</div>
                <h3 className="text-2xl font-bold text-center">{path.subject}</h3>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-600 mb-4 text-center">{path.description}</p>

                {/* Level Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-gray-700">Current Level:</span>
                    <span className="font-bold text-purple-600">Grade {path.currentLevel}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className={`bg-gradient-to-r ${path.color} h-4 rounded-full transition-all flex items-center justify-end pr-2`}
                      style={{ width: `${(path.currentLevel / path.maxLevel) * 100}%` }}
                    >
                      <span className="text-xs text-white font-bold">
                        {path.currentLevel}/{path.maxLevel}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    {path.maxLevel - path.currentLevel} levels to unlock! 🔓
                  </p>
                </div>

                {/* Start Button */}
                <Link
                  href={`/kid/all-you-can-learn/${path.id}`}
                  className={`block w-full bg-gradient-to-r ${path.color} text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all text-center`}
                >
                  Start Learning! 🚀
                </Link>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-600">Unlocked</p>
                    <p className="font-bold text-green-600">{path.currentLevel} grades</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-600">Locked</p>
                    <p className="font-bold text-gray-400">{path.maxLevel - path.currentLevel} grades</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Tips */}
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-6 mt-6">
          <h2 className="text-2xl font-bold text-purple-600 mb-4">💡 Tips for Success:</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              <span>Complete lessons to unlock higher grade levels</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              <span>Challenge yourself! Try lessons above your grade level</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              <span>Keep your streak going to unlock bonus content</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              <span>Earn achievements for completing entire grade levels</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
