'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface FunFeature {
  id: string;
  name: string;
  description: string;
  icon: string;
  cost: number;
  route: string;
  unlocked: boolean;
  category: 'physics' | 'art' | 'chaos' | 'secret' | 'tools';
}

export default function FunLabPage() {
  const router = useRouter();
  const [coins, setCoins] = useState(0);
  const [kidName, setKidName] = useState('Friend');
  const [features, setFeatures] = useState<FunFeature[]>([
    {
      id: 'physics-test',
      name: 'Physics Ball Chaos',
      description: 'Spawn thousands of bouncing balls and watch your browser cry! 💀',
      icon: '🎱',
      cost: 50,
      route: '/kid/physics-test',
      unlocked: false,
      category: 'physics'
    },
    {
      id: 'rainbow-painter',
      name: 'Rainbow Chaos Painter',
      description: 'Paint with rainbow explosions and crazy effects! 🌈',
      icon: '🎨',
      cost: 75,
      route: '/kid/fun-lab/rainbow-painter',
      unlocked: false,
      category: 'art'
    },
    {
      id: 'gravity-flipper',
      name: 'Gravity Flipper',
      description: 'Make gravity go CRAZY in all directions! 🔄',
      icon: '🌀',
      cost: 100,
      route: '/kid/fun-lab/gravity-flipper',
      unlocked: false,
      category: 'physics'
    },
    {
      id: 'emoji-storm',
      name: 'Emoji Storm',
      description: 'Summon an unstoppable storm of emojis! 🌪️',
      icon: '😂',
      cost: 60,
      route: '/kid/fun-lab/emoji-storm',
      unlocked: false,
      category: 'chaos'
    },
    {
      id: 'sound-maker',
      name: 'Crazy Sound Maker',
      description: 'Make weird sounds and music! 🎵',
      icon: '🔊',
      cost: 80,
      route: '/kid/fun-lab/sound-maker',
      unlocked: false,
      category: 'art'
    },
    {
      id: 'bloxd-fixer',
      name: 'BLOXD Code Fixer',
      description: 'Scan and fix your bloxd.io code automatically! 🔧',
      icon: '💻',
      cost: 0,
      route: '/kid/fun-lab/bloxd-fixer',
      unlocked: true,
      category: 'tools'
    },
    {
      id: 'secret-portal',
      name: '??? Mystery Portal',
      description: 'Nobody knows what this does... 👀',
      icon: '🚪',
      cost: 200,
      route: '/kid/fun-lab/secret-portal',
      unlocked: false,
      category: 'secret'
    }
  ]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load kid data
      const kidData = localStorage.getItem('currentKid');
      if (kidData) {
        const kid = JSON.parse(kidData);
        setKidName(kid.kidName || kid.name || 'Friend');
        setCoins(kid.coins || 0);
      }

      // Load unlocked features
      const unlockedFeatures = localStorage.getItem('funLabUnlocked');
      if (unlockedFeatures) {
        const unlocked = JSON.parse(unlockedFeatures);
        setFeatures(prev => prev.map(f => ({
          ...f,
          unlocked: unlocked.includes(f.id)
        })));
      }
    }
  }, []);

  const unlockFeature = (feature: FunFeature) => {
    if (feature.unlocked) {
      // Already unlocked, just navigate
      router.push(feature.route);
      return;
    }

    if (coins >= feature.cost) {
      // Deduct coins
      const newCoins = coins - feature.cost;
      setCoins(newCoins);

      // Update localStorage
      const kidData = localStorage.getItem('currentKid');
      if (kidData) {
        const kid = JSON.parse(kidData);
        kid.coins = newCoins;
        localStorage.setItem('currentKid', JSON.stringify(kid));
      }

      // Mark as unlocked
      const unlockedFeatures = localStorage.getItem('funLabUnlocked');
      const unlocked = unlockedFeatures ? JSON.parse(unlockedFeatures) : [];
      unlocked.push(feature.id);
      localStorage.setItem('funLabUnlocked', JSON.stringify(unlocked));

      setFeatures(prev => prev.map(f => 
        f.id === feature.id ? { ...f, unlocked: true } : f
      ));

      // Celebrate!
      alert(`🎉 ${feature.name} UNLOCKED! Have fun!`);
      
      // Navigate to the feature
      router.push(feature.route);
    } else {
      alert(`❌ Not enough coins! You need ${feature.cost - coins} more coins!`);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'physics': return 'from-blue-500 to-cyan-500';
      case 'art': return 'from-pink-500 to-purple-500';
      case 'chaos': return 'from-orange-500 to-red-500';
      case 'secret': return 'from-gray-700 to-black';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 rounded-3xl shadow-2xl p-8 mb-6 border-4 border-white/30">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
                🧪 Fun Lab! 🎮
              </h1>
              <p className="text-white text-xl font-semibold drop-shadow">
                Unlock crazy experiments with your coins!
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 border-2 border-white/40">
              <div className="text-center">
                <div className="text-sm text-white/90 font-semibold mb-1">Your Balance</div>
                <div className="text-4xl font-bold text-yellow-300 drop-shadow-lg">
                  🪙 {coins}
                </div>
              </div>
            </div>
          </div>
          <Link href="/kid">
            <button className="mt-4 px-6 py-3 bg-white/20 backdrop-blur text-white rounded-xl font-bold hover:bg-white/30 transition-all hover:scale-105">
              ← Back to Hub
            </button>
          </Link>
        </div>

        {/* Info Box */}
        <div className="bg-blue-500/20 backdrop-blur-xl border-2 border-blue-400 rounded-2xl p-6 mb-6">
          <p className="text-white text-lg font-semibold text-center">
            💡 <strong>How it works:</strong> Spend coins to unlock fun experiments! 
            Once unlocked, you can use them forever! 🎉
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(feature => (
            <div
              key={feature.id}
              className={`relative rounded-2xl shadow-2xl overflow-hidden transform transition-all hover:scale-105 ${
                feature.unlocked 
                  ? 'cursor-pointer border-4 border-green-400' 
                  : 'cursor-pointer border-4 border-white/20'
              }`}
              onClick={() => unlockFeature(feature)}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(feature.category)} opacity-90`}></div>
              
              {/* Content */}
              <div className="relative p-6">
                {/* Icon */}
                <div className="text-8xl text-center mb-4 filter drop-shadow-lg">
                  {feature.icon}
                </div>

                {/* Status Badge */}
                {feature.unlocked ? (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                    ✓ UNLOCKED
                  </div>
                ) : (
                  <div className="absolute top-4 right-4 bg-yellow-500 text-black px-3 py-1 rounded-full font-bold text-sm">
                    🪙 {feature.cost}
                  </div>
                )}

                {/* Name */}
                <h3 className="text-2xl font-bold text-white mb-2 text-center drop-shadow-lg">
                  {feature.name}
                </h3>

                {/* Description */}
                <p className="text-white/90 text-center mb-4 font-semibold">
                  {feature.description}
                </p>

                {/* Button */}
                <button
                  className={`w-full py-3 rounded-xl font-bold text-lg transition-all ${
                    feature.unlocked
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : coins >= feature.cost
                      ? 'bg-yellow-400 text-black hover:bg-yellow-500 animate-pulse'
                      : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  {feature.unlocked ? 'PLAY NOW! 🎮' : coins >= feature.cost ? `UNLOCK (${feature.cost} coins)` : `Need ${feature.cost - coins} more coins`}
                </button>

                {/* Lock Overlay */}
                {!feature.unlocked && (
                  <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-9xl filter drop-shadow-lg opacity-40">
                      🔒
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Earn More Coins Hint */}
        {coins < 50 && (
          <div className="mt-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-center">
            <p className="text-white text-xl font-bold mb-2">
              💰 Need more coins?
            </p>
            <p className="text-white/90 mb-4">
              Complete lessons and play games to earn coins!
            </p>
            <Link href="/kid">
              <button className="px-8 py-3 bg-white text-green-600 rounded-xl font-bold hover:scale-105 transition-all">
                Go Earn Coins! 📚
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
