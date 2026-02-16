'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { useSoundEffects } from '@/utils/soundEffects';

function GamesContent() {
  const searchParams = useSearchParams();
  const kidName = searchParams?.get('name') || 'Friend';
  const kidId = searchParams?.get('id') || '';
  const sounds = useSoundEffects();

  const games = [
    {
      id: 1,
      title: "Blobo's Castle Escape",
      description: "Help Blobo escape the castle by answering questions!",
      emoji: "🟣",
      color: "from-purple-500 to-indigo-600",
      difficulty: "Medium",
      isSpecial: true,
      link: "/kid/games/blobo-escape"
    },
    {
      id: 2,
      title: "Math Race",
      description: "Solve addition problems as fast as you can!",
      emoji: "🏎️",
      color: "from-blue-400 to-blue-600",
      difficulty: "Easy"
    },
    {
      id: 3,
      title: "Word Builder",
      description: "Create words from letters to score points!",
      emoji: "📝",
      color: "from-green-400 to-green-600",
      difficulty: "Medium"
    },
    {
      id: 4,
      title: "Memory Match",
      description: "Match pairs of cards to win!",
      emoji: "🃏",
      color: "from-purple-400 to-purple-600",
      difficulty: "Easy"
    },
    {
      id: 5,
      title: "Shape Sorter",
      description: "Sort shapes by color and type!",
      emoji: "🔷",
      color: "from-pink-400 to-pink-600",
      difficulty: "Easy"
    },
    {
      id: 6,
      title: "Number Detective",
      description: "Find the missing numbers in sequences!",
      emoji: "🔍",
      color: "from-yellow-400 to-yellow-600",
      difficulty: "Medium"
    },
    {
      id: 7,
      title: "Spelling Bee",
      description: "Spell words correctly to collect honey!",
      emoji: "🐝",
      color: "from-orange-400 to-orange-600",
      difficulty: "Hard"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-400 via-orange-300 to-pink-300 p-6 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <Link 
            href={`/kid/lessons?name=${kidName}&id=${kidId}`}
            className="inline-block bg-white/90 hover:bg-white px-6 py-3 rounded-full font-bold text-purple-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            ← Back to Main
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-7xl font-bold text-white mb-4 text-center drop-shadow-lg flex items-center justify-center gap-3">
            <span className="text-6xl animate-bounce">🎮</span>
            Learning Games
            <span className="text-6xl animate-pulse">🎮</span>
          </h1>
          <p className="text-lg sm:text-2xl text-white font-bold drop-shadow-md">
            Hey <span className="bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">{kidName}</span>! Pick a game and have fun learning! 🎉
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {games.map((game, index) => (
            <Link
              key={game.id}
              href={game.isSpecial ? game.link : `/kid/games/play?game=${game.id}&title=${game.title}&name=${kidName}&id=${kidId}`}
              onClick={() => sounds?.playClick()}
            >
              <div className={`group bg-gradient-to-br ${game.color} p-6 rounded-3xl shadow-2xl hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-2 hover:scale-105 border-4 border-white/70 animate-slideInUp ${
                game.isSpecial ? 'ring-4 ring-yellow-400 hover:ring-yellow-600 animate-pulse' : ''
              }`}
              style={{ animationDelay: `${index * 0.08}s` }}
              >
                <div className="text-6xl mb-4 text-center group-hover:scale-150 transition-transform">
                  {game.emoji}
                </div>
                
                {game.isSpecial && (
                  <div className="text-center mb-3">
                    <span className="inline-block bg-gradient-to-r from-yellow-300 to-yellow-400 text-purple-900 px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-bounce">
                      ✨ NEW! ✨
                    </span>
                  </div>
                )}
                
                <h3 className="text-2xl font-bold text-white mb-3 text-center group-hover:drop-shadow-lg">
                  {game.title}
                </h3>
                
                <p className="text-white/95 text-center mb-4 leading-relaxed font-semibold">
                  {game.description}
                </p>
                
                <div className="flex justify-center">
                  <span className={`px-5 py-2 rounded-full text-sm font-bold shadow-lg ${
                    game.difficulty === 'Easy' ? 'bg-gradient-to-r from-green-300 to-green-400 text-green-900' :
                    game.difficulty === 'Medium' ? 'bg-gradient-to-r from-yellow-300 to-yellow-400 text-yellow-900' :
                    'bg-gradient-to-r from-red-300 to-red-400 text-red-900'
                  }`}>
                    {game.difficulty === 'Easy' && '🟢'} 
                    {game.difficulty === 'Medium' && '🟡'}
                    {game.difficulty === 'Hard' && '🔴'}
                    <span className="ml-2">{game.difficulty}</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Game Stats Section */}
        <div className="bg-white/95 backdrop-blur rounded-3xl p-8 sm:p-10 shadow-2xl border-4 border-white/50">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8 text-center flex items-center justify-center gap-3">
            <span className="text-4xl">🏆</span> Your Game Stats <span className="text-4xl">🏆</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-100 via-blue-150 to-blue-200 p-8 rounded-3xl text-center border-2 border-blue-300 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 hover:-translate-y-1">
              <div className="text-5xl font-black text-blue-700 mb-3">12</div>
              <div className="text-blue-800 font-bold text-lg">Games Played</div>
              <div className="text-sm text-blue-700 mt-2 font-semibold">Keep it up! 🚀</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-100 via-green-150 to-green-200 p-8 rounded-3xl text-center border-2 border-green-300 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 hover:-translate-y-1">
              <div className="text-5xl font-black text-green-700 mb-3">850</div>
              <div className="text-green-800 font-bold text-lg">Total Points</div>
              <div className="text-sm text-green-700 mt-2 font-semibold">Awesome score! ⭐</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-purple-200 p-8 rounded-3xl text-center border-2 border-purple-300 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 hover:-translate-y-1">
              <div className="text-5xl font-black text-purple-700 mb-3">5</div>
              <div className="text-purple-800 font-bold text-lg">High Scores</div>
              <div className="text-sm text-purple-700 mt-2 font-semibold">You're a champion! 👑</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GamesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-300 to-pink-200 flex items-center justify-center"><div className="text-4xl text-white">Loading Games...</div></div>}>
      <GamesContent />
    </Suspense>
  );
}
