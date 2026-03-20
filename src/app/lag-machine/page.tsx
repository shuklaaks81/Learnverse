"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { performanceMonitor } from '@/utils/performanceMonitor';

export default function LagMachine() {
  const [lagLevel, setLagLevel] = useState(1);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, emoji: string}>>([]);
  const [boxes, setBoxes] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [fps, setFps] = useState(60);
  const [performanceMode, setPerformanceMode] = useState('normal');

  // Subscribe to performance stats
  useEffect(() => {
    const unsubscribe = performanceMonitor.subscribe((stats) => {
      setFps(Math.round(stats.currentFPS));
      setPerformanceMode(stats.mode);
    });
    return unsubscribe;
  }, []);

  // Generate lag based on level
  useEffect(() => {
    if (!isRunning) return;

    const particleInterval = setInterval(() => {
      const newParticles = Array.from({ length: lagLevel * 5 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        emoji: ['🔥', '💥', '⚡', '✨', '💫', '🌟', '⭐', '🎆'][Math.floor(Math.random() * 8)]
      }));
      
      setParticles(prev => [...prev, ...newParticles].slice(-lagLevel * 50)); // Keep max based on lag level
    }, 100 / lagLevel);

    return () => clearInterval(particleInterval);
  }, [isRunning, lagLevel]);

  // Generate DOM boxes
  useEffect(() => {
    if (!isRunning) return;

    const boxInterval = setInterval(() => {
      setBoxes(prev => {
        const newBoxes = [...prev, Date.now()];
        return newBoxes.slice(-lagLevel * 20); // Keep max based on lag level
      });
    }, 200);

    return () => clearInterval(boxInterval);
  }, [isRunning, lagLevel]);

  const startLagMachine = () => {
    setIsRunning(true);
    // Enable performance monitor to see it in action
    performanceMonitor.setEnabled(true);
  };

  const stopLagMachine = () => {
    setIsRunning(false);
    setParticles([]);
    setBoxes([]);
  };

  const increaseLag = () => {
    if (lagLevel < 10) setLagLevel(lagLevel + 1);
  };

  const decreaseLag = () => {
    if (lagLevel > 1) setLagLevel(lagLevel - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 p-4 relative overflow-hidden">
      {/* Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute text-4xl animate-spin pointer-events-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animation: 'spin 1s linear infinite, float 2s ease-in-out infinite',
          }}
        >
          {particle.emoji}
        </div>
      ))}

      {/* Animated boxes */}
      <div className="absolute inset-0 pointer-events-none">
        {boxes.map((id, index) => (
          <div
            key={id}
            className="absolute w-20 h-20 rounded-xl animate-bounce opacity-50 blur-sm"
            style={{
              left: `${(index * 53) % 100}%`,
              top: `${(index * 37) % 100}%`,
              background: `linear-gradient(${index * 36}deg, #ff0000, #00ff00, #0000ff)`,
              animationDelay: `${index * 0.1}s`,
              transform: `rotate(${index * 45}deg) scale(${0.5 + Math.random()})`,
              boxShadow: '0 0 30px rgba(255,255,255,0.5)',
            }}
          />
        ))}
      </div>

      {/* Control Panel */}
      <div className="relative z-50 max-w-4xl mx-auto">
        <div className="bg-black/90 backdrop-blur-xl rounded-3xl p-8 border-4 border-red-500 shadow-2xl mb-6">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 mb-4 text-center animate-pulse">
            🔥 LAG MACHINE 🔥
          </h1>
          <p className="text-white text-center text-xl mb-6">
            Test the Anti-Lag System! Watch it fight back! 💪
          </p>

          {/* Stats Display */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className={`bg-gradient-to-br p-6 rounded-2xl border-4 ${
              fps >= 55 ? 'from-green-600 to-emerald-600 border-green-400' : 
              fps >= 30 ? 'from-orange-600 to-red-600 border-orange-400' : 
              'from-red-700 to-red-900 border-red-500'
            }`}>
              <div className="text-6xl font-black text-white text-center">
                {fps}
              </div>
              <div className="text-sm text-white text-center font-bold mt-2">
                FPS
              </div>
            </div>

            <div className={`bg-gradient-to-br p-6 rounded-2xl border-4 ${
              performanceMode === 'normal' ? 'from-blue-600 to-indigo-600 border-blue-400' :
              performanceMode === 'simplified' ? 'from-orange-600 to-amber-600 border-orange-400' :
              'from-red-600 to-rose-600 border-red-400'
            }`}>
              <div className="text-2xl font-black text-white text-center uppercase">
                {performanceMode}
              </div>
              <div className="text-sm text-white text-center font-bold mt-2">
                Performance Mode
              </div>
            </div>
          </div>

          {/* Lag Level Control */}
          <div className="bg-gradient-to-r from-yellow-500 to-red-500 p-6 rounded-2xl mb-6 border-4 border-yellow-400">
            <div className="text-white font-bold text-center text-2xl mb-4">
              Lag Level: {lagLevel} / 10
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={decreaseLag}
                disabled={lagLevel <= 1}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-xl text-2xl transition-all hover:scale-110 disabled:hover:scale-100"
              >
                -
              </button>
              <div className="flex-1 bg-black/50 rounded-full h-8 overflow-hidden border-2 border-white">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-600 transition-all duration-300"
                  style={{ width: `${lagLevel * 10}%` }}
                />
              </div>
              <button
                onClick={increaseLag}
                disabled={lagLevel >= 10}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-xl text-2xl transition-all hover:scale-110 disabled:hover:scale-100"
              >
                +
              </button>
            </div>
            <div className="text-white text-center text-xs mt-3">
              Higher level = MORE LAG! 🔥
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-4 mb-6">
            {!isRunning ? (
              <button
                onClick={startLagMachine}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-black py-4 px-8 rounded-2xl text-xl transition-all hover:scale-105 shadow-2xl"
              >
                🚀 START LAG MACHINE
              </button>
            ) : (
              <button
                onClick={stopLagMachine}
                className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-black py-4 px-8 rounded-2xl text-xl transition-all hover:scale-105 shadow-2xl"
              >
                🛑 STOP LAG MACHINE
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="bg-purple-900/50 rounded-xl p-4 border-2 border-purple-400">
            <div className="grid grid-cols-2 gap-4 text-white text-sm">
              <div>
                <div className="font-bold">Active Particles:</div>
                <div className="text-2xl">{particles.length}</div>
              </div>
              <div>
                <div className="font-bold">Active Boxes:</div>
                <div className="text-2xl">{boxes.length}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-black/80 backdrop-blur-xl rounded-3xl p-6 border-4 border-yellow-400">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">📋 How to Test:</h2>
          <ol className="text-white space-y-2">
            <li className="flex items-start gap-2">
              <span className="font-bold text-yellow-400">1.</span>
              <span>Make sure Anti-Lag is enabled in Parent Settings ⚙️</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-yellow-400">2.</span>
              <span>Start with Lag Level 3-4 and click START</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-yellow-400">3.</span>
              <span>Watch FPS drop below 55 - wait 3 seconds for SIMPLIFIED mode</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-yellow-400">4.</span>
              <span>Increase lag level to 7-8 - wait 5 more seconds for OVERDRIVE mode</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-yellow-400">5.</span>
              <span>Lower lag level or STOP - watch it recover back to NORMAL! ✅</span>
            </li>
          </ol>

          <div className="mt-4 bg-red-900/50 border-2 border-red-400 rounded-xl p-3">
            <p className="text-red-200 text-sm">
              ⚠️ <strong>Warning:</strong> Lag Level 10 might make your browser struggle! 
              It&apos;s generating hundreds of animated elements. The anti-lag system should protect you though! 😄
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center mt-6">
          <Link
            href="/parent/settings"
            className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-8 rounded-xl hover:scale-105 transition-all shadow-xl mr-4"
          >
            ⚙️ Settings
          </Link>
          <Link
            href="/"
            className="inline-block bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-xl hover:scale-105 transition-all shadow-xl"
          >
            🏠 Home
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}
