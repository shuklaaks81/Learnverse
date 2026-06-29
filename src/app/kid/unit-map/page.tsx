"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { unitMap, isUnitUnlocked, getUnitProgress, type Unit } from '@/data/unitMap';
import { getBuddy, createDemoBuddy, getKidUnitProgress, getCompletedUnits, type Buddy } from '@/utils/buddySystem';

/**
 * Unit Map with Buddy System! 🤝
 * 
 * Learn comprehensive topics with your friend!
 * See where you both are on the learning journey!
 */
export default function UnitMapPage() {
  const router = useRouter();
  const [kidId, setKidId] = useState<string>('');
  const [kidName, setKidName] = useState<string>('');
  const [kidAvatar, setKidAvatar] = useState<string>('👦');
  const [buddy, setBuddy] = useState<Buddy | null>(null);
  const [completedUnits, setCompletedUnits] = useState<string[]>([]);
  const [hoveredUnit, setHoveredUnit] = useState<string | null>(null);
  const [showBuddySetup, setShowBuddySetup] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const kidData = localStorage.getItem('currentKid');
        if (kidData) {
          const kid = JSON.parse(kidData);
          setKidId(kid.kidId);
          setKidName(kid.kidName || 'Me');
          setKidAvatar(kid.avatar || '👦');
          
          // Load completed units
          const completed = getCompletedUnits(kid.kidId);
          setCompletedUnits(completed);
          
          // Load buddy
          const buddyData = getBuddy(kid.kidId);
          setBuddy(buddyData);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    }
  }, []);

  const handleAddDemoBuddy = () => {
    if (kidId) {
      const demoBuddy = createDemoBuddy();
      setBuddy(demoBuddy);
      localStorage.setItem(`kid_${kidId}_buddy`, JSON.stringify(demoBuddy));
      setShowBuddySetup(false);
    }
  };

  const handleUnitClick = (unit: Unit) => {
    // Navigate to unit detail page
    router.push(`/kid/unit-map/${unit.id}`);
  };

  const getMyProgress = (unitId: string): number => {
    return getKidUnitProgress(kidId, unitId);
  };

  const getBuddyProgress = (unitId: string): number => {
    if (!buddy) return 0;
    return buddy.completedLessons.filter(id => id.startsWith(unitId + '-')).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-300 via-pink-200 to-orange-200 relative overflow-hidden">
      {/* Animated Background Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute text-yellow-300 animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 10 + 10}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 2}s`,
            }}
          >
            ✨
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-5xl font-bold text-white drop-shadow-2xl mb-2">
                🗺️ Unit Learning Journey
              </h1>
              <p className="text-xl text-white/90 drop-shadow-lg">
                Explore comprehensive topics with your buddy!
              </p>
            </div>
            
            <div className="flex gap-3">
              <Link href="/kid">
                <button className="px-6 py-3 bg-white/90 backdrop-blur-sm text-purple-600 rounded-2xl font-bold hover:bg-white hover:scale-105 transition-all shadow-lg">
                  🏠 Back Home
                </button>
              </Link>
            </div>
          </div>

          {/* Player Cards */}
          <div className="grid grid-cols-2 gap-4 max-w-2xl">
            {/* My Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border-4 border-blue-400">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-5xl">{kidAvatar}</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{kidName} (You)</h3>
                  <p className="text-sm text-gray-600">
                    {completedUnits.length} units completed
                  </p>
                </div>
              </div>
            </div>

            {/* Buddy Card */}
            {buddy ? (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border-4 border-green-400">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-5xl">{buddy.avatar}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{buddy.name} (Buddy)</h3>
                    <p className="text-sm text-gray-600">
                      {buddy.completedUnits.length} units completed
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowBuddySetup(true)}
                className="bg-gradient-to-br from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 rounded-2xl p-4 shadow-xl border-4 border-white/50 transition-all hover:scale-105"
              >
                <div className="text-center">
                  <div className="text-5xl mb-2">➕</div>
                  <h3 className="text-xl font-bold text-white">Add a Buddy!</h3>
                  <p className="text-sm text-white/90">Learn together!</p>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Buddy Setup Modal */}
      {showBuddySetup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">🤝 Add a Learning Buddy!</h2>
            <p className="text-gray-600 mb-6">
              Learn together and see each other&apos;s progress on the map!
            </p>
            
            <div className="space-y-3">
              <button
                onClick={handleAddDemoBuddy}
                className="w-full py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg"
              >
                🎮 Add Demo Buddy (for now)
              </button>
              
              <button
                onClick={() => setShowBuddySetup(false)}
                className="w-full py-3 px-6 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
              >
                Maybe Later
              </button>
            </div>
            
            <p className="text-xs text-gray-400 mt-4 text-center">
              💡 Real buddy pairing coming soon!
            </p>
          </div>
        </div>
      )}

      {/* The Map */}
      <div className="relative z-10 px-6 pb-12 mt-8">
        <div className="max-w-7xl mx-auto relative" style={{ height: '70vh', minHeight: '600px' }}>
          {/* Unit Nodes */}
          {unitMap.map(unit => {
            const myProgress = getMyProgress(unit.id);
            const buddyProgress = buddy ? getBuddyProgress(unit.id) : 0;
            const isCompleted = completedUnits.includes(unit.id);
            const isUnlocked = true; // All units unlocked for exploration
            const isHovered = hoveredUnit === unit.id;

            return (
              <button
                key={unit.id}
                onClick={() => handleUnitClick(unit)}
                onMouseEnter={() => setHoveredUnit(unit.id)}
                onMouseLeave={() => setHoveredUnit(null)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                style={{
                  left: `${unit.position.x}%`,
                  top: `${unit.position.y}%`,
                }}
              >
                {/* Unit Circle */}
                <div
                  className={`
                    w-32 h-32 rounded-full flex flex-col items-center justify-center
                    border-4 shadow-2xl transition-all duration-300
                    ${isCompleted 
                      ? 'bg-gradient-to-br from-yellow-300 to-orange-400 border-yellow-500' 
                      : `bg-gradient-to-br ${unit.color} border-white/50`
                    }
                    hover:scale-125 hover:shadow-3xl cursor-pointer
                    ${isHovered ? 'scale-125' : ''}
                  `}
                >
                  <div className="text-5xl mb-1">{unit.icon}</div>
                  <div className="text-xs font-bold text-white text-center px-2">
                    {unit.title.replace(/🌱|🦁|🌊|🚀|⛅|🌍|🫀|⚡/g, '').trim()}
                  </div>
                  
                  {isCompleted && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-xl border-2 border-white shadow-lg">
                      ✅
                    </div>
                  )}
                </div>

                {/* Avatar Indicators */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                  {/* My Avatar */}
                  {myProgress > 0 && (
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-xl border-2 border-white shadow-lg">
                        {kidAvatar}
                      </div>
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-1 rounded font-bold">
                        {myProgress}/{unit.totalLessons}
                      </div>
                    </div>
                  )}
                  
                  {/* Buddy Avatar */}
                  {buddy && buddyProgress > 0 && (
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-xl border-2 border-white shadow-lg">
                        {buddy.avatar}
                      </div>
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs px-1 rounded font-bold">
                        {buddyProgress}/{unit.totalLessons}
                      </div>
                    </div>
                  )}
                </div>

                {/* Hover Tooltip */}
                <div
                  className={`
                    absolute left-1/2 -translate-x-1/2 top-40
                    bg-white/95 backdrop-blur-sm rounded-2xl px-6 py-4
                    shadow-2xl border-2 border-white/50 min-w-[280px]
                    transition-all duration-300
                    ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
                  `}
                >
                  <h3 className="font-bold text-gray-800 text-lg mb-2">
                    {unit.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {unit.description}
                  </p>
                  <div className="space-y-1 text-xs text-gray-500">
                    <div className="flex items-center justify-between">
                      <span>📚 Lessons:</span>
                      <span className="font-bold">{unit.totalLessons}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>🎓 Grade:</span>
                      <span className="font-bold">{unit.grade}</span>
                    </div>
                    {myProgress > 0 && (
                      <div className="flex items-center justify-between text-blue-600">
                        <span>{kidAvatar} Your Progress:</span>
                        <span className="font-bold">{Math.round((myProgress/unit.totalLessons)*100)}%</span>
                      </div>
                    )}
                    {buddy && buddyProgress > 0 && (
                      <div className="flex items-center justify-between text-green-600">
                        <span>{buddy.avatar} {buddy.name}&apos;s Progress:</span>
                        <span className="font-bold">{Math.round((buddyProgress/unit.totalLessons)*100)}%</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-purple-600 font-semibold text-center">
                      👆 Click to explore this unit!
                    </p>
                  </div>
                </div>

                {/* Pulsing Animation */}
                <div className="absolute inset-0 rounded-full bg-purple-400 animate-ping opacity-10"></div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="relative z-10 pb-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg inline-block">
            <div className="flex items-center gap-8 flex-wrap justify-center">
              <div>
                <div className="text-3xl font-bold text-gray-800">{unitMap.length}</div>
                <div className="text-sm text-gray-600">Total Units</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div>
                <div className="text-3xl font-bold text-gray-800">{completedUnits.length}</div>
                <div className="text-sm text-gray-600">Units Completed</div>
              </div>
              {buddy && (
                <>
                  <div className="w-px h-12 bg-gray-300"></div>
                  <div>
                    <div className="text-3xl font-bold text-gray-800">{buddy.completedUnits.length}</div>
                    <div className="text-sm text-gray-600">Buddy Completed</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
