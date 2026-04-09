"use client";

import { useEffect, useState, useMemo } from 'react';
import { usePerformance } from '@/hooks/usePerformance';

/**
 * 🚀 SPACE MODE BACKGROUND 🌌
 * 
 * Animated space theme to honor Artemis 2 mission!
 * WITH ADAPTIVE PERFORMANCE OPTIMIZATION!
 * 
 * Features:
 * - Twinkling stars (adaptive count based on FPS)
 * - Floating planets
 * - Rocket ships flying by
 * - Astronauts drifting
 * - Shooting stars/meteors
 * - Nebula effects
 * - Moon phases
 * - Special Artemis 2 easter egg
 * - Real-time performance monitoring
 * - Auto quality adjustment
 */

interface Star {
  id: string;
  x: number;
  y: number;
  size: number;
  brightness: number;
  twinkleDelay: number;
}

interface FloatingObject {
  id: string;
  type: 'planet' | 'rocket' | 'astronaut' | 'meteor' | 'artemis';
  emoji: string;
  x: number;
  y: number;
  size: number;
  speed: number;
  direction: 'left' | 'right' | 'diagonal';
  priority: number; // 1 = always visible, 2 = medium+, 3 = high only
}

export function SpaceBackground() {
  const [showArtemis, setShowArtemis] = useState(false);
  const [showArtemisInfo, setShowArtemisInfo] = useState(false);
  const { settings } = usePerformance();

  // Generate stars based on performance settings
  const stars = useMemo<Star[]>(() => 
    [...Array(settings.starCount)].map((_, i) => ({
      id: `star-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      brightness: Math.random() * 0.7 + 0.3,
      twinkleDelay: Math.random() * 5
    })),
    [settings.starCount]
  );

  // Floating objects (planets, rockets, astronauts, meteors)
  const allFloatingObjects = useMemo<FloatingObject[]>(() => [
    // Planets (Priority: HIGH - always visible)
    { id: 'planet1', type: 'planet', emoji: '🪐', x: 10, y: 15, size: 60, speed: 40, direction: 'right', priority: 1 },
    { id: 'planet2', type: 'planet', emoji: '🌍', x: 85, y: 70, size: 50, speed: 50, direction: 'left', priority: 1 },
    { id: 'planet3', type: 'planet', emoji: '🌙', x: 70, y: 10, size: 40, speed: 60, direction: 'right', priority: 2 },
    { id: 'planet4', type: 'planet', emoji: '⭐', x: 30, y: 80, size: 30, speed: 45, direction: 'left', priority: 2 },
    
    // Rockets (Priority: MEDIUM)
    { id: 'rocket1', type: 'rocket', emoji: '🚀', x: -10, y: 30, size: 35, speed: 15, direction: 'right', priority: 2 },
    { id: 'rocket2', type: 'rocket', emoji: '🛸', x: 110, y: 60, size: 30, speed: 18, direction: 'left', priority: 3 },
    
    // Astronauts (Priority: MEDIUM)
    { id: 'astro1', type: 'astronaut', emoji: '👨‍🚀', x: 50, y: 40, size: 40, speed: 35, direction: 'diagonal', priority: 2 },
    { id: 'astro2', type: 'astronaut', emoji: '👩‍🚀', x: 20, y: 65, size: 35, speed: 38, direction: 'diagonal', priority: 3 },
    
    // Meteors (Priority: LOW - fast animations)
    { id: 'meteor1', type: 'meteor', emoji: '☄️', x: -20, y: 20, size: 25, speed: 8, direction: 'diagonal', priority: 3 },
    { id: 'meteor2', type: 'meteor', emoji: '💫', x: 120, y: 50, size: 20, speed: 10, direction: 'diagonal', priority: 3 },
    
    // Special Artemis 2 rocket (Priority: HIGHEST - always visible)
    { id: 'artemis2', type: 'artemis', emoji: '🚀', x: -15, y: 50, size: 50, speed: 12, direction: 'right', priority: 1 }
  ], []);
  
  // Filter objects based on performance settings
  const floatingObjects = useMemo(() => {
    const maxPriority = settings.currentQuality === 'low' ? 1 : 
                        settings.currentQuality === 'medium' ? 2 : 3;
    return allFloatingObjects.filter(obj => obj.priority <= maxPriority);
  }, [allFloatingObjects, settings.currentQuality]);

  // Show Artemis 2 rocket after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowArtemis(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
      {/* Deep space gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-indigo-950 to-purple-950" />
      
      {/* Nebula effects (disabled in low quality) */}
      {settings.enableBlur && (
        <>
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-purple-500 opacity-10 blur-3xl rounded-full" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-500 opacity-10 blur-3xl rounded-full" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-pink-500 opacity-10 blur-3xl rounded-full" />
        </>
      )}
      
      {/* Twinkling stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.brightness,
            animationDelay: `${star.twinkleDelay}s`,
            boxShadow: settings.enableShadows ? `0 0 ${star.size * 2}px rgba(255, 255, 255, ${star.brightness})` : 'none'
          }}
        />
      ))}
      
      {/* Floating objects (planets, rockets, astronauts, meteors) */}
      {floatingObjects.map((obj) => {
        // Don't show Artemis 2 until timer
        if (obj.type === 'artemis' && !showArtemis) return null;
        
        const animationClass = 
          obj.type === 'meteor' ? 'animate-meteor-shoot' :
          obj.direction === 'diagonal' ? 'animate-float-diagonal' :
          obj.direction === 'left' ? 'animate-float-left' :
          'anime-float-right';
        
        // Adjust speed based on performance
        const adjustedSpeed = obj.speed * settings.animationSpeed;
        
        return (
          <div
            key={obj.id}
            className={`absolute ${animationClass} ${obj.type === 'artemis' ? 'cursor-pointer hover:scale-125 transition-transform z-50' : ''}`}
            style={{
              left: `${obj.x}%`,
              top: `${obj.y}%`,
              fontSize: `${obj.size}px`,
              animationDuration: `${adjustedSpeed}s`,
              filter: settings.enableShadows && obj.type === 'artemis' 
                ? 'drop-shadow(0 0 20px rgba(255, 200, 0, 0.8))' 
                : settings.enableShadows 
                ? 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))' 
                : 'none'
            }}
            onClick={() => obj.type === 'artemis' && setShowArtemisInfo(true)}
          >
            {obj.emoji}
            {/* Special Artemis 2 label */}
            {obj.type === 'artemis' && showArtemis && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-bold text-yellow-300 bg-black/50 px-2 py-1 rounded animate-pulse pointer-events-none">
                ARTEMIS 2 🌙 (Click me!)
              </div>
            )}
          </div>
        );
      })}
      
      {/* Shooting stars (medium and high quality only) */}
      {settings.enableParticles && (
        <>
          <div className="absolute top-10 right-20 animate-shooting-star">
            <div className="w-1 h-1 bg-white rounded-full" style={{ boxShadow: settings.enableShadows ? '0 0 20px 5px rgba(255, 255, 255, 0.8)' : 'none' }} />
          </div>
          <div className="absolute top-40 left-40 animate-shooting-star" style={{ animationDelay: '3s' }}>
            <div className="w-1 h-1 bg-white rounded-full" style={{ boxShadow: settings.enableShadows ? '0 0 20px 5px rgba(255, 255, 255, 0.8)' : 'none' }} />
          </div>
          <div className="absolute top-60 right-60 animate-shooting-star" style={{ animationDelay: '6s' }}>
            <div className="w-1 h-1 bg-white rounded-full" style={{ boxShadow: settings.enableShadows ? '0 0 20px 5px rgba(255, 255, 255, 0.8)' : 'none' }} />
          </div>
        </>
      )}

      {/* Styles for animations */}
      {/* ARTEMIS 2 Mission Info Modal */}
      {showArtemisInfo && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowArtemisInfo(false)}
        >
          <div 
            className="bg-gradient-to-br from-indigo-950 via-purple-900 to-black border-4 border-yellow-500 rounded-3xl p-8 max-w-3xl max-h-[90vh] overflow-y-auto relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{
              boxShadow: '0 0 60px rgba(234, 179, 8, 0.6), inset 0 0 40px rgba(139, 92, 246, 0.2)'
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setShowArtemisInfo(false)}
              className="absolute top-4 right-4 text-3xl hover:scale-125 transition-transform bg-red-600 hover:bg-red-500 w-10 h-10 rounded-full flex items-center justify-center"
            >
              ✕
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-2 animate-pulse">
                🚀 ARTEMIS II MISSION 🌙
              </h1>
              <p className="text-xl text-yellow-300 font-bold">Humanity Returns to the Moon!</p>
            </div>

            {/* Mission patch */}
            <div className="flex justify-center mb-6">
              <div className="text-9xl animate-bounce">🚀</div>
            </div>

            {/* Mission details */}
            <div className="bg-black/40 rounded-2xl p-6 mb-4 border border-purple-500/30">
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">📋 Mission Overview</h2>
              <div className="space-y-3 text-white">
                <p className="text-lg">
                  <span className="font-bold text-yellow-300">🗓️ Launch:</span> September 2025 (planned)
                </p>
                <p className="text-lg">
                  <span className="font-bold text-yellow-300">🧑‍🚀 Crew:</span> 4 astronauts
                </p>
                <p className="text-lg">
                  <span className="font-bold text-yellow-300">⏱️ Duration:</span> ~10 days
                </p>
                <p className="text-lg">
                  <span className="font-bold text-yellow-300">🎯 Goal:</span> First crewed mission to the Moon in over 50 years!
                </p>
              </div>
            </div>

            {/* The Crew */}
            <div className="bg-black/40 rounded-2xl p-6 mb-4 border border-purple-500/30">
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">👨‍🚀 The Crew</h2>
              <div className="grid grid-cols-2 gap-4 text-white">
                <div className="bg-purple-900/30 p-4 rounded-xl">
                  <div className="text-4xl mb-2">👨‍🚀</div>
                  <div className="font-bold">Reid Wiseman</div>
                  <div className="text-sm text-gray-300">Commander</div>
                </div>
                <div className="bg-purple-900/30 p-4 rounded-xl">
                  <div className="text-4xl mb-2">👨‍🚀</div>
                  <div className="font-bold">Victor Glover</div>
                  <div className="text-sm text-gray-300">Pilot</div>
                </div>
                <div className="bg-purple-900/30 p-4 rounded-xl">
                  <div className="text-4xl mb-2">👩‍🚀</div>
                  <div className="font-bold">Christina Koch</div>
                  <div className="text-sm text-gray-300">Mission Specialist</div>
                </div>
                <div className="bg-purple-900/30 p-4 rounded-xl">
                  <div className="text-4xl mb-2">👨‍🚀</div>
                  <div className="font-bold">Jeremy Hansen</div>
                  <div className="text-sm text-gray-300">Mission Specialist (CSA)</div>
                </div>
              </div>
            </div>

            {/* Cool Facts */}
            <div className="bg-black/40 rounded-2xl p-6 mb-4 border border-purple-500/30">
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">🤯 Cool Facts!</h2>
              <div className="space-y-3 text-white">
                <p className="flex items-start">
                  <span className="text-2xl mr-3">🌙</span>
                  <span>First crewed lunar flyby since Apollo 17 in 1972!</span>
                </p>
                <p className="flex items-start">
                  <span className="text-2xl mr-3">👩‍🚀</span>
                  <span>Christina Koch will be the first woman to fly to the Moon!</span>
                </p>
                <p className="flex items-start">
                  <span className="text-2xl mr-3">🚀</span>
                  <span>Using the new Orion spacecraft - way more advanced than Apollo!</span>
                </p>
                <p className="flex items-start">
                  <span className="text-2xl mr-3">🇨🇦</span>
                  <span>Jeremy Hansen will be the first Canadian to travel to the Moon!</span>
                </p>
                <p className="flex items-start">
                  <span className="text-2xl mr-3">🎯</span>
                  <span>This mission paves the way for Artemis 3 - the Moon LANDING!</span>
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-black/40 rounded-2xl p-6 border border-purple-500/30">
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">📅 Artemis Program Timeline</h2>
              <div className="space-y-2 text-white">
                <p><span className="font-bold text-green-400">✅ Artemis I (2022):</span> Uncrewed test flight - Success!</p>
                <p><span className="font-bold text-yellow-400">🚀 Artemis II (2025):</span> Crewed lunar flyby - YOU ARE HERE!</p>
                <p><span className="font-bold text-blue-400">🌙 Artemis III (2026):</span> First crewed Moon landing since 1972!</p>
                <p><span className="font-bold text-purple-400">🏗️ Artemis IV+ (2028+):</span> Building a permanent Moon base!</p>
              </div>
            </div>

            {/* Close button at bottom */}
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowArtemisInfo(false)}
                className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-white font-bold text-xl px-10 py-4 rounded-full transition-all transform hover:scale-110 shadow-xl"
              >
                🚀 Back to Space! 🌟
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        
        @keyframes float-right {
          0% { transform: translateX(0vw); }
          100% { transform: translateX(120vw); }
        }
        
        @keyframes float-left {
          0% { transform: translateX(0vw); }
          100% { transform: translateX(-120vw); }
        }
        
        @keyframes float-diagonal {
          0% { transform: translate(0, 0); }
          50% { transform: translate(50px, -50px); }
          100% { transform: translate(0, 0); }
        }
        
        @keyframes meteor-shoot {
          0% { 
            transform: translate(0, 0) rotate(-45deg);
            opacity: 1;
          }
          100% { 
            transform: translate(150vw, 150vh) rotate(-45deg);
            opacity: 0;
          }
        }
        
        @keyframes shooting-star {
          0% {
            transform: translateX(0) translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateX(-300px) translateY(300px);
            opacity: 0;
          }
        }
        
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
        
        .anime-float-right {
          animation: float-right linear infinite;
        }
        
        .animate-float-left {
          animation: float-left linear infinite;
        }
        
        .animate-float-diagonal {
          animation: float-diagonal ease-in-out infinite;
        }
        
        .animate-meteor-shoot {
          animation: meteor-shoot linear infinite;
        }
        
        .animate-shooting-star {
          animation: shooting-star 2s linear infinite;
        }
      `}</style>
    </div>
  );
}
