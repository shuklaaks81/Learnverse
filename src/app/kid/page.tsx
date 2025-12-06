"use client";

import { useState } from "react";
import Link from "next/link";

export default function KidPage() {
  const [kidName, setKidName] = useState("Alex");
  const [progress, setProgress] = useState(65); // percentage
  const [coins, setCoins] = useState(250);
  const [streak, setStreak] = useState(7);

  function handleSignOut() {
    // Sign out logic
    alert("Signed out!");
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-200 via-green-100 to-yellow-100 p-8">
      {/* Profile Header Bar */}
      <div className="w-full max-w-5xl mb-6 bg-white rounded-2xl shadow-lg p-4 flex items-center justify-between">
        {/* Left: Profile Picture & Info */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-3xl shadow-lg border-4 border-white">
              👦
            </div>
            {/* Progress ring around profile pic */}
            <svg className="absolute top-0 left-0 w-16 h-16 -rotate-90">
              <circle cx="32" cy="32" r="30" stroke="#e5e7eb" strokeWidth="3" fill="none" />
              <circle 
                cx="32" 
                cy="32" 
                r="30" 
                stroke="#10b981" 
                strokeWidth="3" 
                fill="none"
                strokeDasharray={`${2 * Math.PI * 30}`}
                strokeDashoffset={`${2 * Math.PI * 30 * (1 - progress / 100)}`}
                className="transition-all duration-500"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{kidName}</h2>
            <p className="text-sm text-gray-500">{progress}% Complete</p>
          </div>
        </div>

        {/* Center: Stats */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center">
            <span className="text-2xl">🪙</span>
            <span className="text-sm font-bold text-yellow-600">{coins}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl">🔥</span>
            <span className="text-sm font-bold text-orange-600">{streak} day streak</span>
          </div>
          <Link href="/kid/achievements" className="flex flex-col items-center hover:scale-110 transition">
            <span className="text-2xl">🏆</span>
            <span className="text-xs text-gray-600">Achievements</span>
          </Link>
        </div>

        {/* Right: Assignments & Sign Out */}
        <div className="flex items-center gap-3">
          <Link href="/kid/daily-challenge">
            <button className="bg-gradient-to-r from-green-400 to-blue-400 text-white px-4 py-2 rounded-lg font-bold shadow hover:shadow-lg hover:scale-105 transition">
              📋 Assignments
            </button>
          </Link>
          <button 
            onClick={handleSignOut}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold transition"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center gap-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">Welcome to Learnverse!</h1>
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          <div className="w-full flex justify-center mt-4">
            <Link href="/kid/welcome">
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 animate-pulse">
                Create New Account ✨
              </button>
            </Link>
          </div>
          <Link href="/kid/games" className="relative bg-gradient-to-br from-indigo-600/90 to-purple-700/90 hover:from-indigo-500/90 hover:to-purple-600/90 backdrop-blur-xl rounded-2xl p-6 flex flex-col items-center shadow-[0_0_30px_rgba(99,102,241,0.5)] border-2 border-indigo-400/30 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_50px_rgba(99,102,241,0.8)] group overflow-hidden">
            {/* Animated particles */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute w-2 h-2 bg-cyan-400 rounded-full top-2 left-2 animate-ping"></div>
              <div className="absolute w-2 h-2 bg-pink-400 rounded-full bottom-2 right-2 animate-ping animation-delay-500"></div>
            </div>
            {/* Holographic shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            <span className="text-5xl mb-3 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-bounce">🎮</span>
            <span className="font-black text-xl text-white drop-shadow-glow relative z-10">Games</span>
            <span className="text-xs text-cyan-200 mt-2 text-center relative z-10">Play fun learning games!</span>
          </Link>
          <Link href="/kid/all-you-can-learn" className="relative bg-gradient-to-br from-green-600/90 to-emerald-700/90 hover:from-green-500/90 hover:to-emerald-600/90 backdrop-blur-xl rounded-2xl p-6 flex flex-col items-center shadow-[0_0_30px_rgba(34,197,94,0.5)] border-2 border-green-400/30 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_50px_rgba(34,197,94,0.8)] group overflow-hidden">
            {/* Animated particles */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute w-2 h-2 bg-yellow-400 rounded-full top-3 right-3 animate-ping"></div>
              <div className="absolute w-2 h-2 bg-blue-400 rounded-full bottom-3 left-3 animate-ping animation-delay-300"></div>
            </div>
            {/* Holographic shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            <span className="text-5xl mb-3 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-bounce animation-delay-200">📚</span>
            <span className="font-black text-xl text-white drop-shadow-glow relative z-10">All You Can Learn</span>
            <span className="text-xs text-green-200 mt-2 text-center relative z-10">Explore topics and lessons freely.</span>
          </Link>
          <Link href="/kid/lessons" className="relative bg-gradient-to-br from-yellow-600/90 to-orange-700/90 hover:from-yellow-500/90 hover:to-orange-600/90 backdrop-blur-xl rounded-2xl p-6 flex flex-col items-center shadow-[0_0_30px_rgba(234,179,8,0.5)] border-2 border-yellow-400/30 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_50px_rgba(234,179,8,0.8)] group overflow-hidden">
            {/* Animated particles */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute w-2 h-2 bg-red-400 rounded-full top-2 right-2 animate-ping animation-delay-700"></div>
              <div className="absolute w-2 h-2 bg-purple-400 rounded-full bottom-2 left-2 animate-ping"></div>
            </div>
            {/* Holographic shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            <span className="text-5xl mb-3 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-bounce animation-delay-400">📝</span>
            <span className="font-black text-xl text-white drop-shadow-glow relative z-10">Lessons</span>
            <span className="text-xs text-yellow-200 mt-2 text-center relative z-10">Continue your learning journey.</span>
          </Link>
          <Link href="/kid/news" className="bg-blue-100 hover:bg-blue-200 rounded-xl p-6 flex flex-col items-center shadow transition col-span-1 sm:col-span-3">
            <span className="text-4xl mb-2">📰</span>
            <span className="font-bold text-lg">Kid News</span>
            <span className="text-xs text-gray-500 mt-1">Read the latest, print-friendly newspaper!</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
