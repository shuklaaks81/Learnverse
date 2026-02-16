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
    <div className="min-h-screen bg-gradient-to-br from-amber-400 via-orange-300 to-pink-300 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link 
            href={`/kid/lessons?name=${kidName}&id=${kidId}`}
            className="inline-block bg-white/80 hover:bg-white px-6 py-3 rounded-full font-semibold text-purple-600 transition-all shadow-lg"
          >
            ← Back to Main
          </Link>
        </div>

        <h1 className="text-6xl font-bold text-white mb-4 text-center drop-shadow-lg">
          🎮 Learning Games 🎮
        </h1>
        <p className="text-2xl text-white mb-12 text-center">
          Hey {kidName}! Pick a game and have fun learning!
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Link
              key={game.id}
              href={game.isSpecial ? game.link : `/kid/games/play?game=${game.id}&title=${game.title}&name=${kidName}&id=${kidId}`}
              onClick={() => sounds?.playClick()}
            >
              <div className={`bg-gradient-to-br ${game.color} p-6 rounded-3xl shadow-2xl hover:scale-105 transition-all cursor-pointer border-4 border-white/50 ${game.isSpecial ? 'ring-4 ring-yellow-400 animate-pulse' : ''}`}>
                <div className="text-6xl mb-4 text-center">{game.emoji}</div>
                {game.isSpecial && (
                  <div className="text-center mb-2">
                    <span className="bg-yellow-400 text-purple-900 px-3 py-1 rounded-full text-sm font-bold">
                      ⭐ NEW! ⭐
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white mb-2 text-center">
                  {game.title}
                </h3>
                <p className="text-white/90 text-center mb-3">
                  {game.description}
                </p>
                <div className="flex justify-center">
                  <span className={`px-4 py-1 rounded-full text-sm font-bold ${
                    game.difficulty === 'Easy' ? 'bg-green-200 text-green-800' :
                    game.difficulty === 'Medium' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-red-200 text-red-800'
                  }`}>
                    {game.difficulty}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-white/90 backdrop-blur rounded-3xl p-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-purple-600 mb-4 text-center">
            🏆 Your Game Stats 🏆
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-2xl text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">12</div>
              <div className="text-blue-700 font-semibold">Games Played</div>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-2xl text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">850</div>
              <div className="text-green-700 font-semibold">Total Points</div>
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-2xl text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">5</div>
              <div className="text-purple-700 font-semibold">High Scores</div>
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
