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
            className={`absolute ${animationClass}`}
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
          >
            {obj.emoji}
            {/* Special Artemis 2 label */}
            {obj.type === 'artemis' && showArtemis && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-bold text-yellow-300 bg-black/50 px-2 py-1 rounded animate-pulse">
                ARTEMIS 2 🌙
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
