"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { unlockAchievement as unlockSecretAchievement } from '@/utils/achievements';

export default function GamerModePage() {
  const [score, setScore] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [streak, setStreak] = useState(1);
  const [powerUp, setPowerUp] = useState<string | null>(null);

  const gamingFacts = [
    "Did you know? Playing video games improves problem-solving skills! 🎮",
    "Fun fact: Minecraft teaches resource management and creativity! ⛏️",
    "True story: Gamers have better hand-eye coordination! 👾",
    "Real talk: Strategy games boost planning abilities! 🧠",
    "No cap: Animal Crossing teaches economics! 🏝️",
    "For real: Puzzle games improve memory! 🧩",
    "Actually: Gaming can teach teamwork and communication! 🎯",
    "Seriously: Speed games improve reaction time! ⚡"
  ];

  useEffect(() => {
    unlockSecretAchievement('gamer');
  }, []);

  const unlockAchievement = (achievement: string) => {
    if (!achievements.includes(achievement)) {
      setAchievements(prev => [...prev, achievement]);
      setScore(score + 100);
      setPowerUp(achievement);
      setTimeout(() => setPowerUp(null), 3000);
    }
  };

  useEffect(() => {
    // Auto-unlock first achievement
    setTimeout(() => {
      unlockAchievement("🎮 True Gamer - You found the secret level!");
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black relative overflow-hidden">
      {/* Pixel grid background */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 19px, #fff 19px, #fff 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, #fff 19px, #fff 20px)',
        backgroundSize: '20px 20px'
      }} />

      {/* Floating 8-bit elements */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute text-4xl animate-float-pixel"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 5}s`
          }}
        >
          {['🎮', '👾', '🕹️', '⭐', '💎', '🏆'][Math.floor(Math.random() * 6)]}
        </div>
      ))}

      {/* Achievement Popup */}
      {powerUp && (
        <div className="fixed top-20 right-8 z-50 bg-yellow-400 border-4 border-yellow-600 rounded-lg p-6 shadow-2xl animate-bounce-in">
          <div className="text-3xl font-bold text-black mb-2">🏆 ACHIEVEMENT UNLOCKED! 🏆</div>
          <div className="text-xl text-black">{powerUp}</div>
        </div>
      )}

      {/* HUD - Top Bar */}
      <div className="fixed top-0 left-0 right-0 bg-black bg-opacity-80 border-b-4 border-green-500 p-4 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-8">
            <div className="text-green-400 font-mono text-xl">
              SCORE: <span className="text-yellow-400 font-bold">{score}</span>
            </div>
            <div className="text-green-400 font-mono text-xl">
              STREAK: <span className="text-cyan-400 font-bold">x{streak}</span>
            </div>
            <div className="text-green-400 font-mono text-xl">
              ACHIEVEMENTS: <span className="text-pink-400 font-bold">{achievements.length}/10</span>
            </div>
          </div>
          <div className="text-green-400 font-mono text-xl animate-pulse">
            LEVEL: LEGENDARY
          </div>
        </div>
      </div>

      <div className="relative z-10 pt-28 pb-12 px-8">
        {/* Main Title */}
        <div className="text-center mb-12">
          <div className="text-8xl mb-6 animate-bounce">🎮</div>
          <h1 className="text-6xl md:text-7xl font-bold text-yellow-400 mb-4 pixel-text animate-pulse" style={{
            textShadow: '6px 6px 0px #000, 8px 8px 0px #ff00ff'
          }}>
            GAMER MODE ACTIVATED
          </h1>
          <p className="text-3xl text-cyan-400 font-bold mb-4">
            How do you keep up with this stuff?
          </p>
          <p className="text-2xl text-pink-400 font-bold">
            I just play video games! 🕹️
          </p>
        </div>

        {/* The Secret */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 shadow-2xl border-4 border-yellow-400 transform hover:scale-105 transition-all">
            <h2 className="text-4xl font-bold text-white mb-6 text-center">
              🎯 THE SECRET TRUTH 🎯
            </h2>
            <div className="bg-black bg-opacity-50 rounded-2xl p-6 text-2xl text-white space-y-4">
              <p className="text-center text-yellow-300 font-bold">
                Plot twist: Video games ARE learning! 🤯
              </p>
              <p className="text-center text-cyan-300">
                Every game teaches you something:
              </p>
            </div>
          </div>
        </div>

        {/* Gaming = Learning Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {[
            {
              game: 'Minecraft',
              emoji: '⛏️',
              skills: 'Creativity, Math, Resource Management',
              color: 'from-green-600 to-green-800',
              achievement: '⛏️ Block Master - Mining = Math!'
            },
            {
              game: 'Fortnite',
              emoji: '🎯',
              skills: 'Strategy, Quick Thinking, Teamwork',
              color: 'from-blue-600 to-purple-800',
              achievement: '🎯 Victory Royale - Strategy = Smart!'
            },
            {
              game: 'Roblox',
              emoji: '🎮',
              skills: 'Coding, Problem Solving, Design',
              color: 'from-red-600 to-orange-800',
              achievement: '🎮 Creator - Building = Learning!'
            },
            {
              game: 'Among Us',
              emoji: '🔴',
              skills: 'Logic, Deduction, Communication',
              color: 'from-purple-600 to-pink-800',
              achievement: '🔴 Detective - Sus = Science!'
            },
            {
              game: 'Animal Crossing',
              emoji: '🏝️',
              skills: 'Economics, Planning, Patience',
              color: 'from-green-500 to-blue-600',
              achievement: '🏝️ Island Manager - Bells = Business!'
            },
            {
              game: 'Zelda',
              emoji: '⚔️',
              skills: 'Exploration, Puzzles, Perseverance',
              color: 'from-yellow-600 to-green-700',
              achievement: '⚔️ Hero - Quests = Knowledge!'
            },
            {
              game: 'Pokemon',
              emoji: '⚡',
              skills: 'Memory, Strategy, Type Matching',
              color: 'from-yellow-500 to-red-600',
              achievement: '⚡ Trainer - Catching = Collecting Data!'
            },
            {
              game: 'Mario',
              emoji: '🍄',
              skills: 'Timing, Reflexes, Problem Solving',
              color: 'from-red-500 to-blue-600',
              achievement: '🍄 Jump Master - Platforming = Physics!'
            }
          ].map((item, i) => (
            <div
              key={i}
              onClick={() => unlockAchievement(item.achievement)}
              className={`bg-gradient-to-br ${item.color} rounded-2xl p-6 shadow-xl border-4 border-white cursor-pointer transform hover:scale-105 hover:rotate-1 transition-all`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="text-6xl">{item.emoji}</div>
                <div>
                  <h3 className="text-3xl font-bold text-white">{item.game}</h3>
                  <p className="text-sm text-yellow-300">Click to unlock achievement!</p>
                </div>
              </div>
              <div className="bg-black bg-opacity-40 rounded-lg p-4">
                <p className="text-white text-lg">
                  <span className="text-yellow-400 font-bold">Skills:</span> {item.skills}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Gaming Facts */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-3xl p-8 shadow-2xl border-4 border-white">
            <h2 className="text-4xl font-bold text-white mb-6 text-center">
              💡 GAMING FACTS 💡
            </h2>
            <div className="space-y-4">
              {gamingFacts.map((fact, i) => (
                <div
                  key={i}
                  className="bg-white bg-opacity-20 rounded-xl p-4 text-xl text-white hover:bg-opacity-30 transition-all"
                >
                  {fact}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* The Real Answer */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-3xl p-10 shadow-2xl border-4 border-pink-500">
            <h2 className="text-5xl font-bold text-black mb-6 text-center">
              🎯 THE REAL ANSWER 🎯
            </h2>
            <div className="bg-black bg-opacity-30 rounded-2xl p-8">
              <p className="text-3xl text-white text-center mb-6 font-bold">
                &quot;How do you keep up with this stuff?&quot;
              </p>
              <p className="text-2xl text-yellow-300 text-center mb-4">
                Same way you beat hard levels in games:
              </p>
              <ul className="text-xl text-white space-y-3">
                <li className="flex items-center gap-3">
                  <span className="text-3xl">🎮</span>
                  <span>Practice makes progress (like grinding XP!)</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-3xl">🧩</span>
                  <span>Break big problems into small quests</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-3xl">💪</span>
                  <span>Level up one skill at a time</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-3xl">🏆</span>
                  <span>Celebrate achievements (like you do in games!)</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-3xl">👥</span>
                  <span>Team up with friends (multiplayer = better!)</span>
                </li>
              </ul>
              <p className="text-3xl text-pink-400 text-center mt-8 font-bold">
                You&apos;re basically speed-running life! 🏃‍♂️💨
              </p>
            </div>
          </div>
        </div>

        {/* Achievements Board */}
        {achievements.length > 0 && (
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-black bg-opacity-80 rounded-3xl p-8 border-4 border-green-500">
              <h2 className="text-4xl font-bold text-green-400 mb-6 text-center">
                🏆 YOUR ACHIEVEMENTS 🏆
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl p-4 text-white font-bold text-lg border-2 border-yellow-400 animate-pulse"
                  >
                    ✨ {achievement}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="text-center">
          <Link
            href="/kid"
            className="inline-block px-10 py-5 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-full text-2xl font-bold hover:from-green-700 hover:to-blue-700 transition-all hover:scale-110 shadow-xl border-4 border-white"
          >
            ⬅️ RETURN TO MAIN MENU
          </Link>
          <p className="mt-6 text-cyan-400 text-xl font-bold">
            GG! Keep gaming, keep learning! 🎮✨
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-pixel {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
          }
          75% {
            transform: translateY(-30px) translateX(5px);
          }
        }
        .animate-float-pixel {
          animation: float-pixel ease-in-out infinite;
        }
        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3) translateY(-100px);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }
        .pixel-text {
          font-family: 'Courier New', monospace;
          letter-spacing: 2px;
        }
      `}</style>
    </div>
  );
}
