'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

/**
 * ULTRA SIMPLE MODE
 * Only 4 colors - that's it!
 * - BLUE = Learning & Education 📚
 * - GREEN = Success & Go ✅
 * - RED = Important & Action ⚠️
 * - YELLOW = Fun & Special ⭐
 */

export default function SimpleModePage() {
  const [kidName, setKidName] = useState('Student');
  const [coins, setCoins] = useState(0);
  const [showColorGuide, setShowColorGuide] = useState(true);
  const [showDevTools, setShowDevTools] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const kidData = localStorage.getItem('currentKid');
      if (kidData) {
        const kid = JSON.parse(kidData);
        setKidName(kid.kidName || kid.name || 'Student');
        setCoins(kid.coins || 0);
      }
    }
  }, []);

  const addDevCoins = () => {
    if (typeof window !== 'undefined') {
      const kidData = localStorage.getItem('currentKid');
      if (kidData) {
        const kid = JSON.parse(kidData);
        kid.coins = (kid.coins || 0) + 1000000000000000;
        localStorage.setItem('currentKid', JSON.stringify(kid));
        setCoins(kid.coins);
        alert('💰 YOU ARE NOW MEGA RICH! 💰\n1,000,000,000,000,000 coins added!');
      }
    }
  };

  const resetCoins = () => {
    if (typeof window !== 'undefined') {
      const kidData = localStorage.getItem('currentKid');
      if (kidData) {
        const kid = JSON.parse(kidData);
        kid.coins = 0;
        localStorage.setItem('currentKid', JSON.stringify(kid));
        setCoins(0);
        alert('🔄 Coins reset to 0!');
      }
    }
  };

  const features = [
    { name: 'Lessons', route: '/kid/lessons', color: 'blue', icon: '📚' },
    { name: 'Games', route: '/kid/games', color: 'yellow', icon: '🎮' },
    { name: 'Tutor', route: '/kid/tutor', color: 'blue', icon: '🤖' },
    { name: 'Shop', route: '/kid/shop', color: 'yellow', icon: '🛍️' },
    { name: 'Units', route: '/kid/units', color: 'blue', icon: '⭐' },
    { name: 'Fun Lab', route: '/kid/fun-lab', color: 'yellow', icon: '🧪' },
    { name: 'Theater', route: '/kid/theater', color: 'yellow', icon: '🎭' },
    { name: 'Settings', route: '/kid/settings', color: 'red', icon: '⚙️' },
  ];

  const getColorClass = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-600 hover:bg-blue-700';
      case 'green': return 'bg-green-600 hover:bg-green-700';
      case 'red': return 'bg-red-600 hover:bg-red-700';
      case 'yellow': return 'bg-yellow-500 hover:bg-yellow-600';
      default: return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header - GREEN (Success/Status) */}
        <div className="bg-green-600 text-white p-6 mb-4 border-4 border-black">
          <h1 className="text-3xl font-bold mb-2">SIMPLE MODE</h1>
          <p className="text-xl">Hello, {kidName}!</p>
          <p className="text-lg">Coins: {coins}</p>
        </div>

        {/* Color Guide - Shows when clicked */}
        {showColorGuide && (
          <div className="bg-white border-4 border-black p-6 mb-4">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">🎨 COLOR GUIDE</h2>
              <button
                onClick={() => setShowColorGuide(false)}
                className="bg-red-600 text-white px-4 py-2 font-bold border-2 border-black"
              >
                HIDE
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-600 border-4 border-black"></div>
                <div>
                  <p className="font-bold text-lg">BLUE = Learning 📚</p>
                  <p>Lessons, education, learning stuff</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-green-600 border-4 border-black"></div>
                <div>
                  <p className="font-bold text-lg">GREEN = Success ✅</p>
                  <p>Everything is good, your status</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-red-600 border-4 border-black"></div>
                <div>
                  <p className="font-bold text-lg">RED = Important ⚠️</p>
                  <p>Settings, important actions</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-yellow-500 border-4 border-black"></div>
                <div>
                  <p className="font-bold text-lg">YELLOW = Fun ⭐</p>
                  <p>Games, experiments, fun stuff</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Show Color Guide Button */}
        {!showColorGuide && (
          <button
            onClick={() => setShowColorGuide(true)}
            className="w-full bg-white border-4 border-black p-4 mb-4 font-bold text-xl hover:bg-gray-100"
          >
            🎨 SHOW COLOR GUIDE
          </button>
        )}

        {/* Back to Normal Mode - RED (Important Action) */}
        <Link href="/kid">
          <button className="w-full bg-red-600 text-white p-4 mb-4 border-4 border-black font-bold text-xl hover:bg-red-700">
            ⬅️ BACK TO NORMAL MODE
          </button>
        </Link>

        {/* Feature Grid - Simple squares, 4 colors only */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {features.map(feature => (
            <Link key={feature.route} href={feature.route}>
              <button
                className={`${getColorClass(feature.color)} text-white p-8 border-4 border-black font-bold text-xl w-full h-full transition-colors`}
              >
                <div className="text-5xl mb-2">{feature.icon}</div>
                <div>{feature.name.toUpperCase()}</div>
              </button>
            </Link>
          ))}
        </div>

        {/* Sign Out - RED (Important Action) */}
        <Link href="/kid/kid-selector">
          <button className="w-full bg-red-600 text-white p-4 border-4 border-black font-bold text-xl hover:bg-red-700">
            🚪 SIGN OUT
          </button>
        </Link>

        {/* Dev Tools Section */}
        <div className="bg-purple-600 border-4 border-black p-4 mt-4">
          <button
            onClick={() => setShowDevTools(!showDevTools)}
            className="w-full bg-purple-800 text-white p-3 font-bold text-lg border-2 border-black hover:bg-purple-900"
          >
            {showDevTools ? '🔽 HIDE DEV TOOLS' : '🛠️ SHOW DEV TOOLS'}
          </button>

          {showDevTools && (
            <div className="mt-4 space-y-3">
              <p className="text-white font-bold text-lg">⚠️ DEVELOPER MODE ⚠️</p>
              <p className="text-white text-sm mb-3">For testing only!</p>
              
              <button
                onClick={addDevCoins}
                className="w-full bg-green-600 text-white p-4 border-2 border-black font-bold text-lg hover:bg-green-700"
              >
                💰 ADD 1,000,000,000,000,000 COINS
              </button>

              <button
                onClick={resetCoins}
                className="w-full bg-red-600 text-white p-4 border-2 border-black font-bold text-lg hover:bg-red-700"
              >
                🔄 RESET COINS TO 0
              </button>

              <div className="bg-white border-2 border-black p-3">
                <p className="font-bold text-sm">Current Coins:</p>
                <p className="text-2xl font-bold text-purple-600">{coins.toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-white border-4 border-black p-4 mt-4">
          <p className="font-bold mb-2">ℹ️ ABOUT SIMPLE MODE:</p>
          <p className="mb-2">Only 4 colors. No fancy stuff. Just simple.</p>
          <p className="mb-2">✅ No gradients</p>
          <p className="mb-2">✅ No animations</p>
          <p className="mb-2">✅ No special effects</p>
          <p>✅ Just colors, icons, and text!</p>
        </div>
      </div>
    </div>
  );
}
