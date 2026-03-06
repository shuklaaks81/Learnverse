"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ProfileHeader } from "./components/ProfileHeader";
import { FeatureGrid } from "./components/FeatureGrid";
import { OnboardingTour } from "@/components/OnboardingTour";

/**
 * Kid Hub Page
 * 
 * Main dashboard for student accounts displaying:
 * - Profile header with stats (coins, streak, achievements)
 * - Feature grid with access to all learning activities
 * - Account management (sign out, switch account)
 * - Welcome messaging
 * - Onboarding tour with secrets contract
 * 
 * Premium Mode: Futuristic cyber interface with holographic effects
 */
export default function KidPage() {
  const [kidName, setKidName] = useState("Alex");
  const [progress, setProgress] = useState(65);
  const [coins, setCoins] = useState(250);
  const [streak, setStreak] = useState(7);
  const [showBuildButton, setShowBuildButton] = useState(false);
  const [hasMultipleAccounts, setHasMultipleAccounts] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [showTour, setShowTour] = useState(false);

  const premiumParticles = useMemo(
    () =>
      [...Array(30)].map((_, index) => ({
        id: `particle-${index}`,
        size: Math.random() * 4 + 2,
        color: ['#0ff', '#f0f', '#ff0'][Math.floor(Math.random() * 3)],
        top: Math.random() * 100,
        left: Math.random() * 100,
        blur: Math.random() * 20 + 10,
        delay: Math.random() * 5,
        duration: Math.random() * 15 + 10,
      })),
    []
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Load current kid data
        const kidDataStr = localStorage.getItem('currentKid');
        if (kidDataStr) {
          const kidData = JSON.parse(kidDataStr);
          setKidName(kidData.kidName || 'Alex');
          setCoins(parseInt(localStorage.getItem(`kid_${kidData.kidId}_coins`) || '250'));
          setStreak(kidData.streak || 0);
          // Calculate progress based on completed lessons
          const completedLessons = JSON.parse(localStorage.getItem(`kid_${kidData.kidId}_completedLessons`) || '[]');
          setProgress(Math.min(completedLessons.length * 5, 100)); // 5% per lesson, max 100%
        }
        
        const version = localStorage.getItem('learnverseVersion') || 'original';
        setIsPremium(version === 'premium');
        
        const featureEnabled = localStorage.getItem('feature_buildApp');
        setShowBuildButton(featureEnabled === 'true');
        
        const kidAccounts = JSON.parse(localStorage.getItem('kidAccounts') || '[]');
        setHasMultipleAccounts(kidAccounts.length > 1);

        // Check if user has seen the tour
        const tourCompleted = localStorage.getItem('tourCompleted');
        if (!tourCompleted) {
          // Small delay so page loads first
          setTimeout(() => setShowTour(true), 500);
        }
      } catch (error) {
        console.error('Error loading kid data:', error);
        // Keep default values if loading fails - page won't go blank!
      }
    }
  }, []);

  const handleTourComplete = () => {
    setShowTour(false);
    localStorage.setItem('tourCompleted', 'true');
  };

  // 🚀 PREMIUM FUTURISTIC KID HUB! 💎✨
  if (isPremium) {
    return (
      <>
        {showTour && <OnboardingTour onComplete={handleTourComplete} isPremium={true} />}
        <div className="min-h-screen relative overflow-hidden">
          {/* Cyber Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 pointer-events-none">
          {/* Animated Grid */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(20)].map((_, i) => (
              <div key={`h-${i}`} className="absolute w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" style={{top: `${i * 5}%`}} />
            ))}
            {[...Array(20)].map((_, i) => (
              <div key={`v-${i}`} className="absolute h-full w-px bg-gradient-to-b from-transparent via-purple-400 to-transparent" style={{left: `${i * 5}%`}} />
            ))}
          </div>

          {/* Floating Particles */}
          {premiumParticles.map((particle) => (
            <div
              key={particle.id}
              className="absolute rounded-full animate-float-particle"
              style={{
                width: particle.size + 'px',
                height: particle.size + 'px',
                background: particle.color,
                top: particle.top + '%',
                left: particle.left + '%',
                boxShadow: `0 0 ${particle.blur}px currentColor`,
                animationDelay: particle.delay + 's',
                animationDuration: particle.duration + 's'
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center p-8 min-h-screen">
          {/* Premium Profile Header */}
          <div className="w-full max-w-6xl mb-8 futuristic-glass p-6 animate-card-appear">
            <div className="flex items-center justify-between flex-wrap gap-4">
              {/* Left: Profile */}
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 flex items-center justify-center text-4xl shadow-[0_0_40px_rgba(0,255,255,0.6)] border-4 border-white/30 group-hover:scale-110 transition-all duration-300">
                    👦
                  </div>
                  {/* Animated Progress Ring */}
                  <svg className="absolute top-0 left-0 w-20 h-20 -rotate-90">
                    <circle cx="40" cy="40" r="36" stroke="rgba(255,255,255,0.2)" strokeWidth="4" fill="none" />
                    <circle 
                      cx="40" 
                      cy="40" 
                      r="36" 
                      stroke="#0ff" 
                      strokeWidth="4" 
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 36}`}
                      strokeDashoffset={`${2 * Math.PI * 36 * (1 - progress / 100)}`}
                      className="transition-all duration-500 drop-shadow-[0_0_8px_#0ff]"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold glow-text">{kidName}</h2>
                  <p className="text-cyan-300 font-semibold">{progress}% Complete</p>
                </div>
              </div>

              {/* Center: Stats */}
              <div className="flex items-center gap-8">
                <div className="flex flex-col items-center group cursor-pointer">
                  <span className="text-4xl group-hover:scale-125 transition-transform duration-300 drop-shadow-[0_0_10px_#ff0]">🪙</span>
                  <span className="text-lg font-bold text-yellow-400 glow-text">{coins}</span>
                </div>
                <div className="flex flex-col items-center group cursor-pointer">
                  <span className="text-4xl group-hover:scale-125 transition-transform duration-300 drop-shadow-[0_0_10px_#f00]">🔥</span>
                  <span className="text-lg font-bold text-orange-400 glow-text">{streak} days</span>
                </div>
                <Link href="/kid/achievements" className="flex flex-col items-center group cursor-pointer hover:scale-110 transition-all duration-300">
                  <span className="text-4xl group-hover:animate-bounce drop-shadow-[0_0_10px_#0ff]">🏆</span>
                  <span className="text-xs text-cyan-300 font-semibold">Achievements</span>
                </Link>
              </div>

              {/* Right: Action Buttons */}
              <div className="flex items-center gap-3">
                <Link href="/kid/simple">
                  <button className="bg-white/10 backdrop-blur-xl text-white px-6 py-3 rounded-xl font-bold border-2 border-white/30 hover:bg-white/20 hover:border-white/50 hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all duration-300">
                    🎨 Simple Mode
                  </button>
                </Link>
                <button
                  onClick={() => {
                    const kidData = JSON.parse(localStorage.getItem('currentKid') || '{}');
                    kidData.coins = (kidData.coins || 0) + 1000000000000000;
                    localStorage.setItem('currentKid', JSON.stringify(kidData));
                    alert('💰 DEV MODE: 1 QUADRILLION COINS ADDED! 💰');
                    window.location.reload();
                  }}
                  className="bg-purple-600/50 backdrop-blur-xl text-white px-4 py-3 rounded-xl font-bold border-2 border-purple-400/50 hover:bg-purple-600 hover:border-purple-400 transition-all duration-300 text-sm"
                  title="Dev Tool: Add Coins"
                >
                  🛠️ DEV
                </button>
                <Link href="/kid/daily-challenge">
                  <button className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(0,255,0,0.5)] hover:shadow-[0_0_40px_rgba(0,255,0,0.8)] hover:scale-105 transition-all duration-300 border-2 border-white/30">
                    📋 Assignments
                  </button>
                </Link>
                <button 
                  onClick={() => {
                    const kidAccounts = JSON.parse(localStorage.getItem('kidAccounts') || '[]');
                    if (kidAccounts.length > 1) {
                      localStorage.removeItem('currentKid');
                      window.location.href = '/kid/kid-selector';
                    } else {
                      localStorage.removeItem('currentKid');
                      window.location.href = '/kid/login';
                    }
                  }}
                  className="bg-white/10 backdrop-blur-xl text-cyan-300 px-6 py-3 rounded-xl font-bold border-2 border-cyan-400/50 hover:bg-white/20 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all duration-300"
                >
                  {hasMultipleAccounts ? '🔄 Switch' : 'Sign Out'}
                </button>
              </div>
            </div>
          </div>

          {/* Premium Welcome Banner */}
          <div className="w-full max-w-6xl mb-6 futuristic-glass p-8 text-center animate-card-appear" style={{animationDelay: '0.1s'}}>
            <h1 className="text-5xl font-bold glow-text mb-3">
              ✨ Welcome to Learnverse Premium ✨
            </h1>
            <p className="text-xl text-purple-300 font-semibold">
              Your futuristic learning experience awaits! 🚀
            </p>
          </div>

          {/* Create Account Button */}
          <div className="w-full max-w-6xl flex justify-center mb-6">
            <Link href="/kid/welcome">
              <button className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white py-4 px-10 rounded-2xl font-bold text-xl shadow-[0_0_40px_rgba(255,0,255,0.8)] hover:shadow-[0_0_60px_rgba(255,0,255,1)] hover:scale-110 transition-all duration-300 border-4 border-white/40 animate-pulse">
                ➕ Create New Account
              </button>
            </Link>
          </div>

          {/* Premium Feature Grid */}
          <div className="w-full max-w-6xl">
            <FeatureGrid isPremium={true} />
          </div>
        </div>

        {/* Premium Animations */}
        <style jsx>{`
          @keyframes float-particle {
            0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
            50% { transform: translateY(-100px) translateX(50px); opacity: 1; }
          }
          @keyframes card-appear {
            from { opacity: 0; transform: translateY(30px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>
        </div>
      </>
    );
  }

  // Original Version
  return (
    <>
      {showTour && <OnboardingTour onComplete={handleTourComplete} isPremium={false} />}
      <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-200 via-green-100 to-yellow-100 p-8">
        <ProfileHeader 
          kidName={kidName}
          progress={progress}
          coins={coins}
          streak={streak}
          hasMultipleAccounts={hasMultipleAccounts}
        />

        <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center gap-8">
          <h1 className="text-3xl font-bold text-blue-700 mb-2">Welcome to Learnverse!</h1>
          
          {/* Create Account Button */}
          <div className="w-full flex justify-center">
            <Link href="/kid/welcome">
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 animate-pulse">
                Create New Account ✨
              </button>
            </Link>
          </div>

          {/* Feature Grid */}
          <FeatureGrid />
        </div>
      </div>
    </>
  );
}
