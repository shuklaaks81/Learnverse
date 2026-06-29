"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { unlockAchievement } from '@/utils/achievements';

export default function Version2Page() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState<Array<{ id: number; text: string; x: number; y: number }>>([]);

  useEffect(() => {
    unlockAchievement('the2point0');

    // Fake loading sequence
    const loadInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(loadInterval);
          setIsLoaded(true);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(loadInterval);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    // Generate floating "2.0" texts (reduced frequency and fewer items)
    const textInterval = setInterval(() => {
      const newText = {
        id: Date.now(),
        text: ['2.0', 'V2', '✨', '🚀'][Math.floor(Math.random() * 4)],
        x: Math.random() * 100,
        y: Math.random() * 100
      };
      setFloatingTexts(prev => [...prev.slice(-8), newText]);
    }, 1500);

    return () => {
      clearInterval(textInterval);
    };
  }, [isLoaded]);

  const features2point0 = [
    { icon: "⚡", title: "Lightning Fast", desc: "0.0000001ms load times" },
    { icon: "🎨", title: "Ultra HD", desc: "16K resolution support" },
    { icon: "🤖", title: "AI Powered", desc: "Learns your thoughts" },
    { icon: "🌈", title: "More Colors", desc: "Now with 16.7 million colors!" },
    { icon: "🔮", title: "Magic Mode", desc: "Things just work™" },
    { icon: "🎯", title: "99.9999%", desc: "Accuracy (probably)" },
    { icon: "💎", title: "Premium", desc: "Free forever (for now)" },
    { icon: "🚀", title: "To The Moon", desc: "And beyond!" }
  ];

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        <div className="relative z-10 text-center px-4">
          <div className="mb-8 text-8xl animate-bounce">
            2.0
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Loading The Future...
          </h1>
          <div className="w-full max-w-md mx-auto bg-gray-800 rounded-full h-4 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <p className="text-white text-2xl mt-4 font-mono">
            {loadingProgress}%
          </p>
          <p className="text-gray-400 text-sm mt-2">
            {loadingProgress < 30 && "Upgrading reality..."}
            {loadingProgress >= 30 && loadingProgress < 60 && "Downloading more RAM..."}
            {loadingProgress >= 60 && loadingProgress < 90 && "Installing awesomeness..."}
            {loadingProgress >= 90 && "Almost there..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Floating background elements */}
      {floatingTexts.map(text => (
        <div
          key={text.id}
          className="absolute text-4xl font-bold opacity-20 pointer-events-none"
          style={{
            left: `${text.x}%`,
            top: `${text.y}%`,
            animation: 'floatUp 4s ease-out forwards'
          }}
        >
          {text.text}
        </div>
      ))}

      {/* Radial glow effect (simplified) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 min-h-screen p-4 md:p-8">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto text-center mb-16 pt-12">
          <div 
            className="inline-block text-9xl md:text-[12rem] font-black mb-6"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #667eea 100%)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'gradientShift 3s ease infinite'
            }}
          >
            2.0
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Welcome to Learnverse 2.0
          </h1>
          <p className="text-xl md:text-2xl text-purple-200 mb-2">
            The future is now. And it&apos;s weird.
          </p>
          <p className="text-sm text-purple-300 italic">
            (ok that&apos;s a weird name so yeah)
          </p>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-8">
            ✨ New Features ✨
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features2point0.map((feature, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 border-purple-400/30 hover:border-purple-400/70 transition-all transform hover:scale-105 hover:shadow-2xl"
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s backwards`
                }}
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-purple-200 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Version Comparison */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border-2 border-purple-400/30">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              1.0 vs 2.0
            </h2>
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <p className="text-6xl mb-4 opacity-50">😴</p>
                <h3 className="text-2xl font-bold text-gray-300 mb-3">Version 1.0</h3>
                <ul className="text-gray-400 space-y-2 text-sm">
                  <li>❌ Boring</li>
                  <li>❌ Slow</li>
                  <li>❌ Only 3 colors</li>
                  <li>❌ No magic</li>
                  <li>❌ Limited fun</li>
                </ul>
              </div>
              <div className="text-center">
                <p className="text-6xl mb-4 animate-bounce">🚀</p>
                <h3 className="text-2xl font-bold text-white mb-3">Version 2.0</h3>
                <ul className="text-purple-200 space-y-2 text-sm">
                  <li>✅ AMAZING</li>
                  <li>✅ Blazing fast</li>
                  <li>✅ All the colors!</li>
                  <li>✅ Pure magic</li>
                  <li>✅ Infinite fun</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Changelog */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="bg-black/30 backdrop-blur-md rounded-2xl p-8 border-2 border-green-400/30">
            <h2 className="text-2xl font-bold text-green-400 mb-4 font-mono">
              📝 CHANGELOG v2.0.0
            </h2>
            <div className="space-y-3 text-green-300 font-mono text-sm">
              <p>+ Added: Everything you ever wanted</p>
              <p>+ Added: Things you didn&apos;t know you wanted</p>
              <p>+ Fixed: All bugs (we think)</p>
              <p>+ Improved: Performance by 999%</p>
              <p>+ Added: More zeros to version number</p>
              <p>+ Added: This weird URL you&apos;re reading from</p>
              <p>+ Removed: Herobrine</p>
              <p className="text-yellow-400">⚠️ Warning: May be too awesome</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pb-12">
          <div className="mb-8">
            <p className="text-white text-xl mb-4">
              Congrats! You found version 2.0! 🎉
            </p>
            <p className="text-purple-300 text-sm">
              (Nobody even asked for this but here we are)
            </p>
          </div>
          <Link
            href="/kid"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 rounded-full font-bold text-white text-lg transition-all shadow-lg hover:shadow-2xl transform hover:scale-105"
          >
            ← Back to Version 1.0 (boring)
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes floatUp {
          0% {
            opacity: 0.2;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-200px) scale(1.5);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </div>
  );
}
