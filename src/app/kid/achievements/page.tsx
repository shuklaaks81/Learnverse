'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { useSoundEffects } from '@/utils/soundEffects';

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  requirement: number;
  category: string;
}

function AchievementsContent() {
  const searchParams = useSearchParams();
  const kidName = searchParams?.get('name') || 'Friend';
  const kidId = searchParams?.get('id') || '';
  const sounds = useSoundEffects();

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 1,
      title: "First Steps",
      description: "Complete your first lesson",
      icon: "👣",
      unlocked: true,
      progress: 1,
      requirement: 1,
      category: "Lessons"
    },
    {
      id: 2,
      title: "Math Wizard",
      description: "Complete 5 math lessons",
      icon: "🧙‍♂️",
      unlocked: true,
      progress: 5,
      requirement: 5,
      category: "Lessons"
    },
    {
      id: 3,
      title: "Science Explorer",
      description: "Complete 3 science lessons",
      icon: "🔬",
      unlocked: false,
      progress: 1,
      requirement: 3,
      category: "Lessons"
    },
    {
      id: 4,
      title: "Bookworm",
      description: "Complete 5 English lessons",
      icon: "📚",
      unlocked: false,
      progress: 0,
      requirement: 5,
      category: "Lessons"
    },
    {
      id: 5,
      title: "Game Master",
      description: "Play 10 games",
      icon: "🎮",
      unlocked: true,
      progress: 12,
      requirement: 10,
      category: "Games"
    },
    {
      id: 6,
      title: "Perfect Score",
      description: "Get 100% on any lesson",
      icon: "💯",
      unlocked: false,
      progress: 0,
      requirement: 1,
      category: "Performance"
    },
    {
      id: 7,
      title: "Speed Demon",
      description: "Complete a lesson in under 5 minutes",
      icon: "⚡",
      unlocked: false,
      progress: 0,
      requirement: 1,
      category: "Performance"
    },
    {
      id: 8,
      title: "Streak Master",
      description: "Learn 7 days in a row",
      icon: "🔥",
      unlocked: false,
      progress: 3,
      requirement: 7,
      category: "Consistency"
    },
    {
      id: 9,
      title: "Early Bird",
      description: "Complete a lesson before 9 AM",
      icon: "🌅",
      unlocked: false,
      progress: 0,
      requirement: 1,
      category: "Consistency"
    },
    {
      id: 10,
      title: "Night Owl",
      description: "Complete a lesson after 8 PM",
      icon: "🦉",
      unlocked: true,
      progress: 1,
      requirement: 1,
      category: "Consistency"
    },
    {
      id: 11,
      title: "Artist",
      description: "Complete all art lessons",
      icon: "🎨",
      unlocked: false,
      progress: 1,
      requirement: 3,
      category: "Lessons"
    },
    {
      id: 12,
      title: "Super Star",
      description: "Earn 1000 total points",
      icon: "⭐",
      unlocked: false,
      progress: 850,
      requirement: 1000,
      category: "Points"
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = ["All", "Lessons", "Games", "Performance", "Consistency", "Points"];

  const filteredAchievements = selectedCategory === "All" 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  // Play achievement sound for unlocked ones on mount
  useEffect(() => {
    const hasPlayedSound = sessionStorage.getItem('achievementSoundPlayed');
    if (!hasPlayedSound && unlockedCount > 0) {
      setTimeout(() => sounds?.playAchievement(), 500);
      sessionStorage.setItem('achievementSoundPlayed', 'true');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-400 via-orange-300 to-pink-300 p-6 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <Link 
            href={`/kid/lessons?name=${kidName}&id=${kidId}`}
            className="inline-block bg-white/90 hover:bg-white px-6 py-3 rounded-full font-bold text-orange-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            ← Back to Main
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl sm:text-7xl font-bold text-white mb-4 text-center drop-shadow-lg flex items-center justify-center gap-3">
            <span className="text-6xl animate-bounce">⭐</span>
            Your Achievements
            <span className="text-6xl animate-pulse">⭐</span>
          </h1>
          <p className="text-xl sm:text-2xl text-white font-bold drop-shadow-md">
            Amazing work, <span className="bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">{kidName}</span>! Keep unlocking more! 🎉
          </p>
        </div>

        {/* Progress Overview Card */}
        <div className="bg-white/95 backdrop-blur rounded-3xl p-8 sm:p-10 shadow-2xl mb-10 border-4 border-white/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Left Side - Achievement Count */}
            <div className="text-center">
              <div className="text-7xl font-black bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                {unlockedCount}/{totalCount}
              </div>
              <p className="text-lg text-gray-700 font-bold mt-2">
                Achievements Unlocked
              </p>
            </div>

            {/* Right Side - Progress Bar */}
            <div className="flex-1 w-full">
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-gray-800">Completion Progress</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                  {completionPercentage}%
                </span>
              </div>
              <div className="w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-full h-6 overflow-hidden shadow-lg">
                <div 
                  className="bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 h-full rounded-full transition-all duration-700 flex items-center justify-center text-white font-bold text-sm shadow-lg"
                  style={{ width: `${completionPercentage}%` }}
                >
                  {completionPercentage > 10 && `${completionPercentage}%`}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-10 bg-white/30 backdrop-blur rounded-2xl p-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-bold transition-all transform hover:scale-110 text-lg ${
                selectedCategory === category
                  ? "bg-white text-orange-600 shadow-2xl scale-110"
                  : "bg-white/60 text-white hover:bg-white/80 shadow-lg"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {filteredAchievements.map((achievement, index) => (
            <div
              key={achievement.id}
              className={`rounded-3xl p-6 shadow-2xl transition-all transform hover:scale-105 hover:shadow-2xl group animate-slideInUp ${
                achievement.unlocked
                  ? 'bg-gradient-to-br from-yellow-200 via-orange-200 to-pink-200 border-4 border-yellow-400 hover:border-orange-600'
                  : 'bg-white/80 backdrop-blur border-4 border-gray-300 opacity-75 hover:opacity-90'
              }`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="relative">
                {/* Unlocked Badge */}
                {achievement.unlocked && (
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full font-bold text-xs shadow-lg">
                    ✓ UNLOCKED
                  </div>
                )}

                {/* Achievement Content */}
                <div className="text-center mb-4 pt-4">
                  <div className={`text-7xl mb-3 group-hover:scale-125 transition-transform ${
                    achievement.unlocked ? 'animate-bounce drop-shadow-lg' : 'grayscale opacity-50'
                  }`}>
                    {achievement.icon}
                  </div>
                  <h3 className={`text-2xl font-bold mb-2 ${
                    achievement.unlocked 
                      ? 'bg-gradient-to-r from-orange-700 to-pink-700 bg-clip-text text-transparent' 
                      : 'text-gray-600'
                  }`}>
                    {achievement.title}
                  </h3>
                  <p className={`text-sm leading-relaxed font-semibold ${
                    achievement.unlocked ? 'text-orange-700' : 'text-gray-500'
                  }`}>
                    {achievement.description}
                  </p>
                </div>

                {/* Progress or Unlocked Status */}
                {!achievement.unlocked && (
                  <div className="mt-5 pt-4 border-t-2 border-gray-300">
                    <div className="flex justify-between text-xs font-bold text-gray-700 mb-2">
                      <span>╔ Progress ╗</span>
                      <span>{achievement.progress} / {achievement.requirement}</span>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden shadow-md">
                      <div 
                        className="bg-gradient-to-r from-orange-400 via-pink-400 to-red-400 h-full rounded-full transition-all duration-500 flex items-center justify-center"
                        style={{ width: `${(achievement.progress / achievement.requirement) * 100}%` }}
                      />
                    </div>
                    <p className="text-center text-xs text-gray-600 mt-2 font-semibold">
                      {Math.round((achievement.progress / achievement.requirement) * 100)}% to unlock
                    </p>
                  </div>
                )}

                {achievement.unlocked && (
                  <div className="mt-5 pt-4 border-t-2 border-yellow-300 text-center">
                    <span className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 text-white px-5 py-2 rounded-full font-bold text-sm shadow-lg">
                      ⭐ Unlocked & Earned!
                    </span>
                  </div>
                )}

                {/* Category Badge */}
                <div className="mt-3 text-center">
                  <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold shadow-md ${
                    achievement.unlocked
                      ? 'bg-orange-300 text-orange-900'
                      : 'bg-gray-300 text-gray-700'
                  }`}>
                    🏷️ {achievement.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AchievementsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-amber-400 via-orange-300 to-pink-300 flex items-center justify-center"><div className="text-4xl text-white">Loading Achievements...</div></div>}>
      <AchievementsContent />
    </Suspense>
  );
}
