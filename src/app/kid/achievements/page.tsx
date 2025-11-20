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
  const kidName = searchParams.get('name') || 'Friend';
  const kidId = searchParams.get('id') || '';
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
    <div className="min-h-screen bg-gradient-to-br from-amber-400 via-orange-300 to-pink-300 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link 
            href={`/kid/lessons?name=${kidName}&id=${kidId}`}
            className="inline-block bg-white/80 hover:bg-white px-6 py-3 rounded-full font-semibold text-orange-600 transition-all shadow-lg"
          >
            ← Back to Main
          </Link>
        </div>

        <h1 className="text-6xl font-bold text-white mb-4 text-center drop-shadow-lg">
          ⭐ Your Achievements ⭐
        </h1>
        <p className="text-2xl text-white mb-8 text-center">
          Great job, {kidName}! Keep unlocking more!
        </p>

        {/* Progress Overview */}
        <div className="bg-white/95 backdrop-blur rounded-3xl p-8 shadow-2xl mb-8">
          <div className="text-center mb-6">
            <div className="text-6xl font-bold text-orange-600 mb-2">
              {unlockedCount} / {totalCount}
            </div>
            <div className="text-xl text-gray-700 font-semibold">
              Achievements Unlocked
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-orange-500 to-pink-500 h-full rounded-full transition-all duration-500 flex items-center justify-center text-white font-bold text-sm"
              style={{ width: `${completionPercentage}%` }}
            >
              {completionPercentage}%
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                selectedCategory === category
                  ? "bg-white text-orange-600 shadow-lg scale-105"
                  : "bg-white/50 text-white hover:bg-white/70"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`rounded-3xl p-6 shadow-2xl transition-all hover:scale-105 ${
                achievement.unlocked
                  ? 'bg-gradient-to-br from-yellow-200 to-orange-200 border-4 border-yellow-400'
                  : 'bg-white/80 backdrop-blur border-4 border-gray-300 opacity-75'
              }`}
            >
              <div className="text-center mb-4">
                <div className={`text-6xl mb-3 ${achievement.unlocked ? 'animate-bounce' : 'grayscale'}`}>
                  {achievement.icon}
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${
                  achievement.unlocked ? 'text-orange-700' : 'text-gray-600'
                }`}>
                  {achievement.title}
                </h3>
                <p className={`text-sm ${
                  achievement.unlocked ? 'text-orange-600' : 'text-gray-500'
                }`}>
                  {achievement.description}
                </p>
              </div>

              {!achievement.unlocked && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm font-semibold text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{achievement.progress} / {achievement.requirement}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-orange-400 to-pink-400 h-full rounded-full transition-all"
                      style={{ width: `${(achievement.progress / achievement.requirement) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {achievement.unlocked && (
                <div className="mt-4 text-center">
                  <span className="inline-block bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm">
                    ✓ Unlocked!
                  </span>
                </div>
              )}

              <div className="mt-3 text-center">
                <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                  {achievement.category}
                </span>
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
