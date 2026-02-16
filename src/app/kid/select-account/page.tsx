"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSoundEffects } from "@/utils/soundEffects";

interface KidAccount {
  id: string;
  name: string;
  familyName?: string;
  design?: string;
  buddyDrawing?: string;
  coins?: number;
  progress?: number;
}

export default function SelectAccountPage() {
  const [accounts, setAccounts] = useState<KidAccount[]>([]);
  const [isPremium, setIsPremium] = useState(false);
  const router = useRouter();
  const soundEffects = useSoundEffects();

  useEffect(() => {
    // Check if Premium version is selected
    const version = localStorage.getItem('learnverseVersion') || 'original';
    setIsPremium(version === 'premium');

    // Load all kid accounts
    const kidAccounts = JSON.parse(localStorage.getItem('kidAccounts') || '[]');
    setAccounts(kidAccounts);

    // If no accounts, redirect to login
    if (kidAccounts.length === 0) {
      router.push('/kid/login');
    }
  }, [router]);

  const handleSelectAccount = (kid: KidAccount) => {
    soundEffects?.playClick();
    localStorage.setItem('currentKid', JSON.stringify(kid));
    setTimeout(() => {
      router.push('/kid');
    }, 300);
  };

  const handleAddNewAccount = () => {
    soundEffects?.playClick();
    router.push('/kid/welcome');
  };

  const getDesignColors = (design?: string) => {
    switch (design) {
      case 'space':
        return 'from-indigo-500 to-purple-600';
      case 'nature':
        return 'from-green-500 to-emerald-600';
      case 'sunset':
        return 'from-orange-500 to-pink-600';
      default:
        return 'from-blue-500 to-cyan-600';
    }
  };

  const getDesignEmoji = (design?: string) => {
    switch (design) {
      case 'space':
        return '🚀';
      case 'nature':
        return '🌿';
      case 'sunset':
        return '🌅';
      default:
        return '✨';
    }
  };

  if (isPremium) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8 relative overflow-hidden">
        {/* Futuristic Background Effects */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-pulse"></div>
          <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-pink-400 to-transparent animate-pulse" style={{animationDelay: '0.3s'}}></div>
          <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-purple-400 to-transparent animate-pulse" style={{animationDelay: '0.6s'}}></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-[0_0_30px_rgba(147,197,253,0.8)]">
              👥 Who&apos;s Learning Today?
            </h1>
            <p className="text-xl text-cyan-300">Select your account to continue</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {accounts.map((kid, index) => (
              <button
                key={kid.id || `${kid.name}-${index}`}
                onClick={() => handleSelectAccount(kid)}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-2 border-cyan-400/30 rounded-3xl p-8 hover:scale-105 transition-all duration-300 hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] group relative overflow-hidden"
              >
                {/* Holographic shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                <div className="relative z-10">
                  {/* Buddy Drawing or Avatar */}
                  {kid.buddyDrawing ? (
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full border-4 border-cyan-400/50 overflow-hidden bg-white">
                      <img src={kid.buddyDrawing} alt="Buddy" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className={`w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br ${getDesignColors(kid.design)} flex items-center justify-center text-6xl border-4 border-cyan-400/50 shadow-[0_0_30px_rgba(6,182,212,0.4)]`}>
                      {getDesignEmoji(kid.design)}
                    </div>
                  )}

                  <h3 className="text-3xl font-bold text-white mb-2">{kid.name}</h3>
                  {kid.familyName && (
                    <p className="text-cyan-300 mb-4">Family: {kid.familyName}</p>
                  )}

                  <div className="flex justify-around text-sm">
                    <div className="text-center">
                      <div className="text-2xl mb-1">🪙</div>
                      <div className="text-yellow-300 font-bold">{kid.coins || 0}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl mb-1">📊</div>
                      <div className="text-green-300 font-bold">{kid.progress || 0}%</div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Add New Account Button */}
          <div className="text-center">
            <button
              onClick={handleAddNewAccount}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(34,197,94,0.5)] hover:shadow-[0_0_50px_rgba(34,197,94,0.8)] border-2 border-white/30"
            >
              ➕ Add New Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Original Design
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 p-8 animate-gradient-shift" style={{ backgroundSize: '200% 200%' }}>
      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-shift {
          animation: gradient-shift 15s ease infinite;
        }
      `}</style>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            👥 Who&apos;s Learning Today?
          </h1>
          <p className="text-2xl text-white/90">Select your account to continue</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {accounts.map((kid, index) => (
            <button
              key={kid.id || `${kid.name}-${index}`}
              onClick={() => handleSelectAccount(kid)}
              className="bg-white/95 backdrop-blur rounded-3xl p-8 hover:scale-105 transition-all duration-300 hover:shadow-2xl group border-4 border-white/50"
            >
              {/* Buddy Drawing or Avatar */}
              {kid.buddyDrawing ? (
                <div className="w-32 h-32 mx-auto mb-4 rounded-full border-4 border-purple-400 overflow-hidden bg-white shadow-lg">
                  <img src={kid.buddyDrawing} alt="Buddy" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className={`w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br ${getDesignColors(kid.design)} flex items-center justify-center text-6xl border-4 border-white shadow-lg`}>
                  {getDesignEmoji(kid.design)}
                </div>
              )}

              <h3 className="text-3xl font-bold text-gray-800 mb-2">{kid.name}</h3>
              {kid.familyName && (
                <p className="text-gray-600 mb-4">Family: {kid.familyName}</p>
              )}

              <div className="flex justify-around text-sm">
                <div className="text-center">
                  <div className="text-2xl mb-1">🪙</div>
                  <div className="text-yellow-600 font-bold">{kid.coins || 0}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">📊</div>
                  <div className="text-green-600 font-bold">{kid.progress || 0}%</div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t-2 border-gray-200">
                <div className="text-purple-600 font-bold group-hover:scale-110 transition-transform">
                  Click to Continue →
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Add New Account Button */}
        <div className="text-center">
          <button
            onClick={handleAddNewAccount}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-12 py-6 rounded-3xl font-bold text-2xl hover:scale-110 transition-all shadow-2xl border-4 border-white/50"
          >
            ➕ Add New Account
          </button>
        </div>
      </div>
    </div>
  );
}
