'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import BackgroundMusic from '@/components/BackgroundMusic';

interface GradeLevel {
  grade: number;
  locked: boolean;
  topics: string[];
}

export default function LearningPathPage() {
  const params = useParams();
  const router = useRouter();
  const pathId = params.pathId as string;
  const [currentKid, setCurrentKid] = useState<any>(null);
  const [gradeLevel, setGradeLevel] = useState(3);
  const [unlockedGrades, setUnlockedGrades] = useState<number[]>([]);

  useEffect(() => {
    const kid = JSON.parse(localStorage.getItem('currentKid') || '{}');
    setCurrentKid(kid);
    
    if (kid.kidId) {
      const savedGrade = localStorage.getItem(`grade_${kid.kidId}`);
      if (savedGrade) {
        setGradeLevel(parseInt(savedGrade));
        // Initially unlock their grade and grades below
        const currentGrade = parseInt(savedGrade);
        setUnlockedGrades(Array.from({ length: currentGrade }, (_, i) => i + 1));
      }
      
      // Load unlocked grades for this path
      const pathProgress = localStorage.getItem(`path_${pathId}_${kid.kidId}`);
      if (pathProgress) {
        const progress = JSON.parse(pathProgress);
        // Make sure at least their current grade and below are unlocked
        const savedGrade = localStorage.getItem(`grade_${kid.kidId}`);
        const currentGrade = savedGrade ? parseInt(savedGrade) : 3;
        const minUnlocked = Array.from({ length: currentGrade }, (_, i) => i + 1);
        const allUnlocked = [...new Set([...minUnlocked, ...(progress.unlockedGrades || [])])];
        setUnlockedGrades(allUnlocked);
      }
    }
  }, [pathId]);

  const pathData: { [key: string]: { name: string; icon: string; color: string; description: string } } = {
    'math-master': {
      name: 'Math Master',
      icon: '🔢',
      color: 'from-blue-500 to-cyan-500',
      description: 'From basic arithmetic to advanced calculus!'
    },
    'science-genius': {
      name: 'Science Genius',
      icon: '🔬',
      color: 'from-green-500 to-emerald-500',
      description: 'Explore all branches of science!'
    },
    'reading-champion': {
      name: 'Reading Champion',
      icon: '📚',
      color: 'from-purple-500 to-pink-500',
      description: 'Master reading and comprehension!'
    },
    'coding-wizard': {
      name: 'Coding Wizard',
      icon: '💻',
      color: 'from-orange-500 to-red-500',
      description: 'Learn to code like a pro!'
    },
    'history-explorer': {
      name: 'History Explorer',
      icon: '🏛️',
      color: 'from-yellow-500 to-orange-500',
      description: 'Journey through time!'
    },
    'art-creator': {
      name: 'Art Creator',
      icon: '🎨',
      color: 'from-pink-500 to-rose-500',
      description: 'Unleash your creativity!'
    }
  };

  const currentPath = pathData[pathId] || pathData['math-master'];

  const grades: GradeLevel[] = Array.from({ length: 12 }, (_, i) => ({
    grade: i + 1,
    locked: !unlockedGrades.includes(i + 1),
    topics: [
      `${currentPath.name} - Grade ${i + 1} Fundamentals`,
      `Advanced ${currentPath.name} Concepts`,
      `${currentPath.name} Problem Solving`,
      `Real-World ${currentPath.name} Applications`
    ]
  }));

  const handleGradeClick = (grade: number, locked: boolean) => {
    if (locked) {
      alert(`🔒 Grade ${grade} is locked! Complete Grade ${grade - 1} lessons to unlock it!`);
      return;
    }
    // Save selected path and grade
    if (currentKid.kidId) {
      localStorage.setItem(`selectedPath_${currentKid.kidId}`, JSON.stringify({
        path: pathId,
        pathName: currentPath.name,
        grade: grade
      }));
    }
    // Go to units page with the selected path
    router.push(`/kid/units?path=${pathId}&grade=${grade}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 p-4 sm:p-6">
      <BackgroundMusic />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{currentPath.icon}</div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  {currentPath.name}
                </h1>
                <p className="text-gray-600 mt-1">{currentPath.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Currently at <span className="font-bold text-purple-600">Grade {gradeLevel}</span> • 
                  {unlockedGrades.length} of 12 grades unlocked
                </p>
              </div>
            </div>
            <Link
              href="/kid/all-you-can-learn"
              className="bg-gray-200 text-gray-700 font-bold px-6 py-3 rounded-xl hover:bg-gray-300 transition-colors"
            >
              ← Back
            </Link>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-purple-600 mb-4">📊 Your Progress</h2>
          <div className="flex items-center gap-4 mb-2">
            <div className="flex-1 bg-gray-200 rounded-full h-6">
              <div
                className={`bg-gradient-to-r ${currentPath.color} h-6 rounded-full transition-all flex items-center justify-center`}
                style={{ width: `${(unlockedGrades.length / 12) * 100}%` }}
              >
                <span className="text-xs text-white font-bold">
                  {Math.round((unlockedGrades.length / 12) * 100)}%
                </span>
              </div>
            </div>
            <span className="font-bold text-purple-600">{unlockedGrades.length}/12</span>
          </div>
          <p className="text-sm text-gray-600">
            Keep learning to unlock all grade levels! 🚀
          </p>
        </div>

        {/* Grade Levels Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {grades.map((gradeLevel) => (
            <div
              key={gradeLevel.grade}
              onClick={() => handleGradeClick(gradeLevel.grade, gradeLevel.locked)}
              className={`rounded-2xl shadow-xl overflow-hidden cursor-pointer transition-all ${
                gradeLevel.locked
                  ? 'bg-gray-100 opacity-60 hover:opacity-80'
                  : `bg-gradient-to-br ${currentPath.color} hover:scale-105`
              }`}
            >
              <div className={`p-6 ${gradeLevel.locked ? '' : 'text-white'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold">
                    Grade {gradeLevel.grade}
                  </h3>
                  {gradeLevel.locked ? (
                    <div className="text-3xl">🔒</div>
                  ) : (
                    <div className="text-3xl">✅</div>
                  )}
                </div>

                <div className="space-y-2">
                  {gradeLevel.topics.map((topic, idx) => (
                    <div
                      key={idx}
                      className={`text-sm p-2 rounded ${
                        gradeLevel.locked
                          ? 'bg-gray-200 text-gray-500'
                          : 'bg-white/20 text-white'
                      }`}
                    >
                      {idx + 1}. {gradeLevel.locked ? '🔒 Locked' : topic}
                    </div>
                  ))}
                </div>

                {gradeLevel.locked && (
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    Complete Grade {gradeLevel.grade - 1} to unlock
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Motivation Banner */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl shadow-xl p-6 mt-6 border-4 border-yellow-500">
          <div className="flex items-center gap-4">
            <div className="text-5xl">🌟</div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Keep Going! You&apos;re Awesome!</h2>
              <p className="text-white">
                Every lesson you complete unlocks more knowledge! The more you learn, the smarter you become! 💪🧠
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
