'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useSoundEffects } from '@/utils/soundEffects';
import BackgroundMusic from '@/components/BackgroundMusic';

interface World {
  id: number;
  name: string;
  emoji: string;
  description: string;
  lessonsRequired: number;
  color: string;
  position: { x: number; y: number };
  unlocked: boolean;
  subject: string;
}

function MapContent() {
  const searchParams = useSearchParams();
  const subjectFilter = searchParams.get('subject');
  const [currentKid, setCurrentKid] = useState<any>(null);
  const [completedLessons, setCompletedLessons] = useState(0);
  const [hoveredWorld, setHoveredWorld] = useState<number | null>(null);
  const soundEffects = useSoundEffects();

  useEffect(() => {
    const kid = JSON.parse(localStorage.getItem('currentKid') || '{}');
    setCurrentKid(kid);
    
    // Get completed lessons count (you can expand this logic)
    const completed = parseInt(localStorage.getItem(`completedLessons_${kid.kidId}`) || '0');
    setCompletedLessons(completed);
  }, []);

  const worlds: World[] = [
    {
      id: 1,
      name: 'Number Sense',
      emoji: '🔢',
      description: 'Master basic operations and place value',
      lessonsRequired: 0,
      color: 'from-blue-400 to-cyan-500',
      position: { x: 15, y: 70 },
      unlocked: true,
      subject: 'Math'
    },
    {
      id: 2,
      name: 'Fractions & Decimals',
      emoji: '½',
      description: 'Understand parts of a whole',
      lessonsRequired: 3,
      color: 'from-purple-400 to-pink-500',
      position: { x: 28, y: 55 },
      unlocked: completedLessons >= 3,
      subject: 'Math'
    },
    {
      id: 3,
      name: 'Living Things',
      emoji: '🌿',
      description: 'Explore life on Earth',
      lessonsRequired: 6,
      color: 'from-green-500 to-emerald-600',
      position: { x: 42, y: 40 },
      unlocked: completedLessons >= 6,
      subject: 'Science'
    },
    {
      id: 4,
      name: 'Matter & Energy',
      emoji: '⚡',
      description: 'What everything is made of',
      lessonsRequired: 9,
      color: 'from-yellow-500 to-orange-500',
      position: { x: 55, y: 30 },
      unlocked: completedLessons >= 9,
      subject: 'Science'
    },
    {
      id: 5,
      name: 'Reading Skills',
      emoji: '📖',
      description: 'Master comprehension',
      lessonsRequired: 12,
      color: 'from-indigo-500 to-blue-500',
      position: { x: 68, y: 45 },
      unlocked: completedLessons >= 12,
      subject: 'English'
    },
    {
      id: 6,
      name: 'Grammar & Writing',
      emoji: '✍️',
      description: 'Express yourself clearly',
      lessonsRequired: 15,
      color: 'from-rose-500 to-pink-500',
      position: { x: 78, y: 60 },
      unlocked: completedLessons >= 15,
      subject: 'English'
    },
    {
      id: 7,
      name: 'Ancient World',
      emoji: '🏛️',
      description: 'Journey to ancient times',
      lessonsRequired: 18,
      color: 'from-amber-600 to-orange-600',
      position: { x: 88, y: 40 },
      unlocked: completedLessons >= 18,
      subject: 'History'
    },
    {
      id: 8,
      name: 'World Geography',
      emoji: '🌍',
      description: 'Explore our planet',
      lessonsRequired: 20,
      color: 'from-teal-500 to-cyan-600',
      position: { x: 93, y: 25 },
      unlocked: completedLessons >= 20,
      subject: 'History'
    }
  ];

  // Filter worlds by subject if specified
  const displayedWorlds = subjectFilter 
    ? worlds.filter(w => w.subject === subjectFilter)
    : worlds;

  const handleWorldClick = (world: World) => {
    if (world.unlocked) {
      soundEffects?.playClick();
      soundEffects?.playCelebration();
    } else {
      soundEffects?.playClick();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-300 to-cyan-400 p-6">
      <BackgroundMusic />
      
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🗺️ {subjectFilter ? `${subjectFilter} ` : ''}Learning Journey Map
              </h1>
              <p className="text-gray-600 mt-2">
                {subjectFilter 
                  ? `Explore ${displayedWorlds.length} ${subjectFilter} units • Complete lessons to unlock new worlds!`
                  : `Complete lessons to unlock new worlds! (${completedLessons}/20 lessons)`
                }
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/kid/units"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-6 py-3 rounded-xl hover:shadow-lg transition-all hover:scale-105"
              >
                📚 View Units
              </Link>
              <Link
                href="/kid/lessons"
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold px-6 py-3 rounded-xl hover:shadow-lg transition-all hover:scale-105"
              >
                📚 Back to Lessons
              </Link>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-400 to-blue-500 h-full transition-all duration-1000 ease-out"
              style={{ width: `${(completedLessons / 20) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/80 backdrop-blur rounded-3xl shadow-2xl p-8 relative overflow-hidden" style={{ minHeight: '600px' }}>
          {/* Decorative elements */}
          <div className="absolute top-10 left-10 text-6xl opacity-20 animate-bounce">☁️</div>
          <div className="absolute top-20 right-20 text-6xl opacity-20 animate-bounce" style={{ animationDelay: '0.5s' }}>☁️</div>
          <div className="absolute bottom-10 left-1/4 text-6xl opacity-20 animate-bounce" style={{ animationDelay: '1s' }}>☁️</div>

          {/* Path connecting worlds */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            {displayedWorlds.slice(0, -1).map((world, index) => {
              const nextWorld = displayedWorlds[index + 1];
              return (
                <line
                  key={`path-${world.id}`}
                  x1={`${world.position.x}%`}
                  y1={`${world.position.y}%`}
                  x2={`${nextWorld.position.x}%`}
                  y2={`${nextWorld.position.y}%`}
                  stroke={nextWorld.unlocked ? '#10b981' : '#d1d5db'}
                  strokeWidth="4"
                  strokeDasharray={nextWorld.unlocked ? '0' : '10,10'}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>

          {/* World nodes */}
          {displayedWorlds.map((world) => (
            <div
              key={world.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
              style={{
                left: `${world.position.x}%`,
                top: `${world.position.y}%`,
                zIndex: 10
              }}
              onMouseEnter={() => setHoveredWorld(world.id)}
              onMouseLeave={() => setHoveredWorld(null)}
              onClick={() => handleWorldClick(world)}
            >
              {/* World bubble */}
              <div
                className={`
                  relative w-32 h-32 rounded-full shadow-xl cursor-pointer
                  transition-all duration-300 transform
                  ${world.unlocked 
                    ? `bg-gradient-to-br ${world.color} hover:scale-110` 
                    : 'bg-gray-400 opacity-50 cursor-not-allowed'
                  }
                  ${hoveredWorld === world.id ? 'scale-110 ring-4 ring-white' : 'scale-100'}
                `}
              >
                {/* World emoji */}
                <div className="absolute inset-0 flex items-center justify-center text-6xl">
                  {world.unlocked ? world.emoji : '🔒'}
                </div>

                {/* Sparkle effect for unlocked worlds */}
                {world.unlocked && (
                  <div className="absolute -top-2 -right-2 text-3xl animate-pulse">
                    ✨
                  </div>
                )}

                {/* World name */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <p className={`font-bold text-center ${world.unlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                    {world.name}
                  </p>
                </div>
              </div>

              {/* Hover tooltip */}
              {hoveredWorld === world.id && (
                <div className="absolute top-full mt-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white p-4 rounded-xl shadow-2xl z-50 whitespace-nowrap">
                  <p className="font-bold mb-1">{world.name}</p>
                  <p className="text-sm text-gray-300 mb-2">{world.description}</p>
                  <p className="text-xs text-yellow-400">
                    {world.unlocked 
                      ? '✅ Unlocked!' 
                      : `🔒 Complete ${world.lessonsRequired} lessons to unlock`
                    }
                  </p>
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-900 rotate-45" />
                </div>
              )}
            </div>
          ))}

          {/* Current position indicator */}
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000"
            style={{
              left: `${displayedWorlds.filter(w => w.unlocked).slice(-1)[0]?.position.x || 20}%`,
              top: `${displayedWorlds.filter(w => w.unlocked).slice(-1)[0]?.position.y || 70}%`,
              zIndex: 20
            }}
          >
            <div className="text-6xl animate-bounce">
              👤
            </div>
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
              You are here!
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 bg-white/90 backdrop-blur rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🎯 How to Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="text-4xl">📚</div>
              <div>
                <p className="font-bold text-gray-800">Complete Lessons</p>
                <p className="text-sm text-gray-600">Finish lessons to earn progress</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-4xl">🗺️</div>
              <div>
                <p className="font-bold text-gray-800">Unlock Worlds</p>
                <p className="text-sm text-gray-600">New worlds appear as you learn</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-4xl">🏆</div>
              <div>
                <p className="font-bold text-gray-800">Reach the Peak</p>
                <p className="text-sm text-gray-600">Complete all 20 lessons!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-bounce {
          animation: bounce 3s infinite;
        }
      `}</style>
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 flex items-center justify-center"><div className="text-4xl">🗺️ Loading map...</div></div>}>
      <MapContent />
    </Suspense>
  );
}
