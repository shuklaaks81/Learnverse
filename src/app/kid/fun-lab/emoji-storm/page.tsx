'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Emoji {
  id: number;
  emoji: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
}

const EMOJI_LIST = ['😂', '🎉', '⭐', '🔥', '💯', '🚀', '🌈', '🎮', '🍕', '🦄', '👾', '💎', '🎪', '🌟', '⚡', '🎨', '🎭', '🎯'];

export default function EmojiStormPage() {
  const [emojis, setEmojis] = useState<Emoji[]>([]);
  const [intensity, setIntensity] = useState(1);
  const [isStorm, setIsStorm] = useState(false);
  const [fps, setFps] = useState(60);
  const fpsRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef(Date.now());

  const createEmoji = (): Emoji => {
    return {
      id: Date.now() + Math.random(),
      emoji: EMOJI_LIST[Math.floor(Math.random() * EMOJI_LIST.length)],
      x: Math.random() * window.innerWidth,
      y: -50,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      size: Math.random() * 40 + 30
    };
  };

  useEffect(() => {
    if (!isStorm) return;

    const spawnInterval = setInterval(() => {
      const newEmojis: Emoji[] = [];
      for (let i = 0; i < intensity; i++) {
        newEmojis.push({
          id: Date.now() + Math.random(),
          emoji: EMOJI_LIST[Math.floor(Math.random() * EMOJI_LIST.length)],
          x: Math.random() * window.innerWidth,
          y: -50,
          vx: (Math.random() - 0.5) * 4,
          vy: Math.random() * 3 + 2,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 10,
          size: Math.random() * 40 + 30
        });
      }
      setEmojis(prev => [...prev, ...newEmojis]);
    }, 200);

    const updateInterval = setInterval(() => {
      // Calculate FPS
      const now = Date.now();
      const delta = now - lastFrameTimeRef.current;
      const currentFps = 1000 / delta;
      fpsRef.current.push(currentFps);
      if (fpsRef.current.length > 30) fpsRef.current.shift();
      const avgFps = fpsRef.current.reduce((a, b) => a + b, 0) / fpsRef.current.length;
      setFps(Math.round(avgFps));
      lastFrameTimeRef.current = now;

      setEmojis(prev => {
        // Auto-reduce if lagging
        const filtered = prev
          .map(e => ({
            ...e,
            x: e.x + e.vx,
            y: e.y + e.vy,
            rotation: e.rotation + e.rotationSpeed
          }))
          .filter(e => e.y < window.innerHeight + 100);
        
        // If FPS is low and too many emojis, remove some
        if (avgFps < 20 && filtered.length > 50) {
          return filtered.slice(0, Math.floor(filtered.length * 0.7));
        }
        
        return filtered;
      });
    }, 50);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(updateInterval);
    };
  }, [isStorm, intensity]);

  const startStorm = (level: number) => {
    setIntensity(level);
    setIsStorm(true);
  };

  const stopStorm = () => {
    setIsStorm(false);
    setEmojis([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 relative overflow-hidden">
      {/* Emojis */}
      {emojis.map(emoji => (
        <div
          key={emoji.id}
          className="absolute pointer-events-none"
          style={{
            left: emoji.x,
            top: emoji.y,
            transform: `rotate(${emoji.rotation}deg)`,
            fontSize: emoji.size
          }}
        >
          {emoji.emoji}
        </div>
      ))}

      {/* Controls */}
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-6 border-2 border-white/20">
          <h1 className="text-5xl font-bold text-white mb-4 text-center drop-shadow-lg">
            🌪️ EMOJI STORM! 😂
          </h1>
          <p className="text-white text-xl text-center mb-6 font-semibold">
            Summon an unstoppable emoji storm!
          </p>

          <Link href="/kid/fun-lab">
            <button className="px-6 py-3 bg-white/20 backdrop-blur text-white rounded-xl font-bold hover:bg-white/30 transition-all mb-6">
              ← Back to Fun Lab
            </button>
          </Link>

          {/* Storm Controls */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <button
              onClick={() => startStorm(1)}
              className="px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg"
            >
              🌧️ Light Storm
            </button>
            <button
              onClick={() => startStorm(3)}
              className="px-6 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg"
            >
              ⛈️ Medium Storm
            </button>
            <button
              onClick={() => startStorm(7)}
              className="px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg"
            >
              🌪️ Heavy Storm
            </button>
            <button
              onClick={() => startStorm(15)}
              className="px-6 py-4 bg-gradient-to-r from-red-500 to-purple-600 text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg animate-pulse"
            >
              💀 CHAOS MODE
            </button>
          </div>

          <button
            onClick={stopStorm}
            className="w-full px-6 py-4 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg"
          >
            🛑 STOP STORM
          </button>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
              <div className="text-4xl font-bold text-white">{emojis.length}</div>
              <div className="text-white/80 font-semibold">Emojis Active</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
              <div className="text-4xl font-bold text-white">{intensity}x</div>
              <div className="text-white/80 font-semibold">Spawn Rate</div>
            </div>
            <div className={`backdrop-blur rounded-xl p-4 text-center ${
              fps > 30 ? 'bg-green-500/30 border-2 border-green-400' : 
              fps > 15 ? 'bg-yellow-500/30 border-2 border-yellow-400' : 
              'bg-red-500/30 border-2 border-red-400'
            }`}>
              <div className={`text-4xl font-bold ${
                fps > 30 ? 'text-green-400' : fps > 15 ? 'text-yellow-400' : 'text-red-400'
              }`}>{fps}</div>
              <div className="text-white/80 font-semibold">FPS</div>
            </div>
          </div>

          {/* Performance Warnings */}
          {fps < 20 && (
            <div className="mt-4 bg-red-500/20 border-2 border-red-500 rounded-xl p-4 text-center">
              <p className="text-red-300 font-bold">⚠️ LAG DETECTED! Auto-reducing emojis...</p>
            </div>
          )}
          {emojis.length > 200 && (
            <div className="mt-4 bg-yellow-500/20 border-2 border-yellow-500 rounded-xl p-4 text-center">
              <p className="text-yellow-300 font-bold">⚠️ HIGH EMOJI COUNT! Might slow down!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
