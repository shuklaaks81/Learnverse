"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { unlockAchievement } from '@/utils/achievements';

type GameState = 'start' | 'earth' | 'launching' | 'space' | 'ship-interior' | 'planet';
type Planet = 'mercury' | 'venus' | 'earth' | 'mars' | 'jupiter' | 'saturn' | 'uranus' | 'neptune' | 'sun';

export default function SpaceExplorationPage() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [currentPlanet, setCurrentPlanet] = useState<Planet | null>(null);
  const [discoveries, setDiscoveries] = useState<string[]>([]);
  const [rocketPosition, setRocketPosition] = useState({ x: 50, y: 80 });
  const [showControls, setShowControls] = useState(true);
  const [fuel, setFuel] = useState(100);
  const [shipMessage, setShipMessage] = useState('');
  const [stickFigurePos, setStickFigurePos] = useState({ x: 50, y: 50 });
  const [isWaving, setIsWaving] = useState(false);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Start game with R
      if (e.key.toLowerCase() === 'r' && gameState === 'start') {
        setGameState('earth');
        return;
      }
      
      if (e.key.toLowerCase() === 'e' && gameState === 'space') {
        setGameState('ship-interior');
        setShipMessage('Welcome back, Captain! Taking a rest... ⭐');
        setFuel(Math.min(100, fuel + 20)); // Refuel when resting
      } else if (e.key.toLowerCase() === 'e' && gameState === 'ship-interior') {
        setGameState('space');
        setShipMessage('');
      } else if (e.key === 'Escape' && gameState === 'planet') {
        setGameState('space');
        setCurrentPlanet(null);
      }
      
      // Move stick figure with arrow keys in space
      if (gameState === 'space') {
        if (e.key === 'ArrowUp') {
          setStickFigurePos(prev => ({ ...prev, y: Math.max(10, prev.y - 5) }));
        } else if (e.key === 'ArrowDown') {
          setStickFigurePos(prev => ({ ...prev, y: Math.min(90, prev.y + 5) }));
        } else if (e.key === 'ArrowLeft') {
          setStickFigurePos(prev => ({ ...prev, x: Math.max(10, prev.x - 5) }));
        } else if (e.key === 'ArrowRight') {
          setStickFigurePos(prev => ({ ...prev, x: Math.min(90, prev.x + 5) }));
        } else if (e.key.toLowerCase() === 'w') {
          setIsWaving(true);
          setTimeout(() => setIsWaving(false), 500);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, fuel]);

  const planets = [
    { name: 'sun', emoji: '☀️', x: 50, y: 50, size: 80, color: 'yellow', fact: 'The Sun is 109 times wider than Earth!' },
    { name: 'mercury', emoji: '🪨', x: 30, y: 45, size: 20, color: 'gray', fact: 'Mercury has no atmosphere and temperatures swing 600°C!' },
    { name: 'venus', emoji: '🌕', x: 25, y: 60, size: 28, color: 'orange', fact: 'Venus spins backwards and rains acid!' },
    { name: 'earth', emoji: '🌍', x: 20, y: 30, size: 30, color: 'blue', fact: 'Home sweet home! The only planet with life we know of!' },
    { name: 'mars', emoji: '🔴', x: 70, y: 25, size: 25, color: 'red', fact: 'Mars has the largest volcano in the solar system!' },
    { name: 'jupiter', emoji: '🪐', x: 80, y: 60, size: 60, color: 'orange', fact: 'Jupiter is so big, 1,300 Earths could fit inside!' },
    { name: 'saturn', emoji: '🪐', x: 15, y: 80, size: 55, color: 'gold', fact: 'Saturn\'s rings are made of ice and rock!' },
    { name: 'uranus', emoji: '💠', x: 85, y: 35, size: 40, color: 'cyan', fact: 'Uranus rotates on its side like a rolling ball!' },
    { name: 'neptune', emoji: '🔵', x: 75, y: 75, size: 38, color: 'blue', fact: 'Neptune has winds up to 2,100 km/h!' }
  ];

  const launchRocket = () => {
    setGameState('launching');
    let countdown = 3;
    const countdownInterval = setInterval(() => {
      countdown--;
      if (countdown === 0) {
        clearInterval(countdownInterval);
        setTimeout(() => {
          setGameState('space');
          addDiscovery('🚀 Successfully launched into space!');
        }, 1000);
      }
    }, 1000);
  };

  const addDiscovery = (discovery: string) => {
    if (!discoveries.includes(discovery)) {
      setDiscoveries(prev => [...prev, discovery]);
    }
  };

  const visitPlanet = (planet: typeof planets[0]) => {
    if (fuel >= 10) {
      setCurrentPlanet(planet.name as Planet);
      setGameState('planet');
      setFuel(fuel - 10);
      addDiscovery(`🪐 Discovered ${planet.name.charAt(0).toUpperCase() + planet.name.slice(1)}!`);
      addDiscovery(planet.fact);
    } else {
      setShipMessage('⚠️ Not enough fuel! Press E to rest and refuel!');
      setTimeout(() => setShipMessage(''), 3000);
    }
  };

  // START SCREEN
  if (gameState === 'start') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-purple-900 to-black relative overflow-hidden flex items-center justify-center">
        {/* Animated stars */}
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}

        {/* Floating planets in background */}
        <div className="absolute top-20 left-20 text-6xl animate-bounce opacity-50" style={{ animationDuration: '3s' }}>🪐</div>
        <div className="absolute top-40 right-32 text-8xl animate-bounce opacity-50" style={{ animationDuration: '4s', animationDelay: '1s' }}>🌍</div>
        <div className="absolute bottom-32 left-40 text-7xl animate-bounce opacity-50" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>🚀</div>
        <div className="absolute bottom-20 right-20 text-6xl animate-bounce opacity-50" style={{ animationDuration: '4s', animationDelay: '1.5s' }}>⭐</div>

        {/* Main content */}
        <div className="relative z-10 text-center p-8 max-w-4xl">
          <h1 className="text-8xl md:text-9xl font-bold text-white mb-6 animate-pulse" style={{
            textShadow: '0 0 30px rgba(255,255,255,0.8), 0 0 60px rgba(138,43,226,0.6)'
          }}>
            🚀 SPACE EXPLORER 🌌
          </h1>
          
          <p className="text-3xl md:text-4xl text-purple-300 mb-12 animate-pulse">
            An Epic Journey Through the Solar System
          </p>

          {/* Astronaut */}
          <div className="mb-12 flex justify-center">
            <div className="animate-float">
              <svg width="120" height="160" viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg">
                <circle cx="30" cy="15" r="12" fill="#e0e0e0" stroke="#333" strokeWidth="2"/>
                <circle cx="30" cy="15" r="9" fill="rgba(173, 216, 230, 0.5)" stroke="#666" strokeWidth="1"/>
                <circle cx="26" cy="14" r="2" fill="#333"/>
                <circle cx="34" cy="14" r="2" fill="#333"/>
                <path d="M 25 18 Q 30 20 35 18" stroke="#333" strokeWidth="1.5" fill="none"/>
                <rect x="20" y="28" width="20" height="25" fill="#fff" stroke="#333" strokeWidth="2" rx="3"/>
                <circle cx="30" cy="40" r="4" fill="#0066cc"/>
                <line x1="20" y1="35" x2="8" y2="28" stroke="#fff" strokeWidth="4" strokeLinecap="round"/>
                <line x1="40" y1="35" x2="48" y2="42" stroke="#fff" strokeWidth="4" strokeLinecap="round"/>
                <circle cx="8" cy="28" r="3" fill="#e0e0e0" stroke="#333" strokeWidth="1"/>
                <circle cx="48" cy="42" r="3" fill="#e0e0e0" stroke="#333" strokeWidth="1"/>
                <line x1="25" y1="53" x2="22" y2="68" stroke="#fff" strokeWidth="4" strokeLinecap="round"/>
                <line x1="35" y1="53" x2="38" y2="68" stroke="#fff" strokeWidth="4" strokeLinecap="round"/>
                <ellipse cx="22" cy="71" rx="4" ry="3" fill="#333"/>
                <ellipse cx="38" cy="71" rx="4" ry="3" fill="#333"/>
                <rect x="24" y="29" width="12" height="15" fill="#666" stroke="#333" strokeWidth="1" rx="2"/>
                <circle cx="27" cy="34" r="1.5" fill="#00ff00" className="animate-pulse"/>
                <circle cx="33" cy="34" r="1.5" fill="#00ff00" className="animate-pulse"/>
              </svg>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={() => setGameState('earth')}
            className="group relative px-12 py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-3xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all hover:scale-110 shadow-lg hover:shadow-2xl mb-8"
            style={{
              boxShadow: '0 0 40px rgba(59, 130, 246, 0.6), 0 0 60px rgba(147, 51, 234, 0.4)'
            }}
          >
            <span className="flex items-center gap-4">
              🚀 PRESS R TO START 🚀
            </span>
            <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
          </button>

          {/* Feature list */}
          <div className="bg-black bg-opacity-60 rounded-2xl p-8 backdrop-blur-sm border border-purple-500">
            <h2 className="text-2xl font-bold text-purple-300 mb-6">🌟 Mission Objectives 🌟</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left text-lg text-gray-300">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🧑‍🚀</span>
                <span>Control your astronaut with arrow keys</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🪐</span>
                <span>Visit all 9 celestial bodies</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📚</span>
                <span>Learn amazing space facts</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">⛽</span>
                <span>Manage your fuel supply</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🚀</span>
                <span>Rest in your ship to refuel</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🏆</span>
                <span>Become a true space explorer!</span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Link href="/kid" className="text-gray-400 hover:text-white transition-colors">
              ← Back to Learnverse
            </Link>
          </div>
        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  // EARTH VIEW
  if (gameState === 'earth') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-400 via-blue-300 to-green-400 relative overflow-hidden">
        {/* Stars in sky */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-pulse"
              style={{
                width: '2px',
                height: '2px',
                top: `${Math.random() * 40}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Ground */}
        <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-b from-green-600 to-green-800" />

        {/* Launch pad */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-64 h-32 bg-gray-700 flex items-end justify-center">
          <div className="text-sm text-gray-400 mb-2">🚀 LAUNCH PAD 🚀</div>
        </div>

        {/* Rocket */}
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2">
          <button
            onClick={launchRocket}
            className="text-9xl hover:scale-110 transition-transform cursor-pointer animate-bounce"
            style={{ filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.5))' }}
          >
            🚀
          </button>
        </div>

        {/* UI */}
        <div className="relative z-10 p-8">
          <h1 className="text-6xl font-bold text-white mb-4 text-center" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.5)' }}>
            🌍 Space Explorer 🚀
          </h1>
          <p className="text-2xl text-center text-white mb-8">
            Click the rocket to begin your journey!
          </p>

          {/* Astronaut waving on Earth */}
          <div className="absolute bottom-40 left-1/3 transform -translate-x-1/2 animate-bounce">
            <svg width="50" height="70" viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg">
              <circle cx="30" cy="15" r="12" fill="#e0e0e0" stroke="#333" strokeWidth="2"/>
              <circle cx="30" cy="15" r="9" fill="rgba(173, 216, 230, 0.5)" stroke="#666" strokeWidth="1"/>
              <circle cx="26" cy="14" r="2" fill="#333"/>
              <circle cx="34" cy="14" r="2" fill="#333"/>
              <path d="M 25 18 Q 30 20 35 18" stroke="#333" strokeWidth="1.5" fill="none"/>
              <rect x="20" y="28" width="20" height="25" fill="#fff" stroke="#333" strokeWidth="2" rx="3"/>
              <circle cx="30" cy="40" r="4" fill="#0066cc"/>
              <line x1="20" y1="35" x2="8" y2="28" stroke="#fff" strokeWidth="4" strokeLinecap="round"/>
              <line x1="40" y1="35" x2="48" y2="42" stroke="#fff" strokeWidth="4" strokeLinecap="round"/>
              <circle cx="8" cy="28" r="3" fill="#e0e0e0" stroke="#333" strokeWidth="1"/>
              <circle cx="48" cy="42" r="3" fill="#e0e0e0" stroke="#333" strokeWidth="1"/>
              <line x1="25" y1="53" x2="22" y2="68" stroke="#fff" strokeWidth="4" strokeLinecap="round"/>
              <line x1="35" y1="53" x2="38" y2="68" stroke="#fff" strokeWidth="4" strokeLinecap="round"/>
              <ellipse cx="22" cy="71" rx="4" ry="3" fill="#333"/>
              <ellipse cx="38" cy="71" rx="4" ry="3" fill="#333"/>
              <rect x="24" y="29" width="12" height="15" fill="#666" stroke="#333" strokeWidth="1" rx="2"/>
              <circle cx="27" cy="34" r="1.5" fill="#00ff00"/>
              <circle cx="33" cy="34" r="1.5" fill="#00ff00"/>
            </svg>
          </div>
          
          <div className="max-w-2xl mx-auto bg-white bg-opacity-90 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">🎮 Controls</h2>
            <ul className="space-y-2">
              <li>� <strong>Click rocket</strong> - Launch into space!</li>
              <li>🧑‍🚀 <strong>Arrow keys</strong> - Move your astronaut in space!</li>
              <li>👋 <strong>Press W</strong> - Wave hello to planets!</li>
              <li>🪐 <strong>Click planets</strong> - Visit and explore!</li>
              <li>⌨️ <strong>Press E</strong> - Enter/exit ship to rest and refuel</li>
              <li>⏎ <strong>Press ESC</strong> - Leave planet and return to space</li>
            </ul>
          </div>

          <div className="text-center mt-8">
            <Link href="/kid" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              ← Back to Learnverse
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // LAUNCHING
  if (gameState === 'launching') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-600 to-black flex items-center justify-center relative overflow-hidden">
        <div className="text-center animate-pulse">
          <div className="text-9xl mb-8 animate-bounce">🚀</div>
          <div className="text-8xl font-bold text-white mb-4">3... 2... 1...</div>
          <div className="text-4xl text-orange-400">🔥 LIFT OFF! 🔥</div>
        </div>
        <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-orange-500 via-yellow-400 to-transparent animate-pulse" />
      </div>
    );
  }

  // SHIP INTERIOR
  if (gameState === 'ship-interior') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold text-white mb-8 text-center">🚀 Ship Interior 🚀</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Control Panel */}
            <div className="bg-gray-700 rounded-lg p-6 border-2 border-blue-500">
              <h2 className="text-2xl font-bold text-blue-400 mb-4">⚙️ Control Panel</h2>
              <div className="space-y-3">
                <div className="bg-gray-800 p-3 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white">Fuel:</span>
                    <span className="text-green-400 font-bold">{fuel}%</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full transition-all"
                      style={{ width: `${fuel}%` }}
                    />
                  </div>
                </div>
                <div className="bg-gray-800 p-3 rounded">
                  <span className="text-white">Status: </span>
                  <span className="text-green-400">✓ All Systems Operational</span>
                </div>
                <div className="bg-gray-800 p-3 rounded">
                  <span className="text-white">Location: </span>
                  <span className="text-yellow-400">Deep Space</span>
                </div>
              </div>
            </div>

            {/* Discoveries Log */}
            <div className="bg-gray-700 rounded-lg p-6 border-2 border-purple-500">
              <h2 className="text-2xl font-bold text-purple-400 mb-4">📜 Discoveries ({discoveries.length})</h2>
              <div className="bg-gray-800 p-4 rounded max-h-64 overflow-y-auto">
                {discoveries.length === 0 ? (
                  <p className="text-gray-400 italic">No discoveries yet... Explore more!</p>
                ) : (
                  <ul className="space-y-2">
                    {discoveries.map((discovery, i) => (
                      <li key={i} className="text-green-300 text-sm">
                        • {discovery}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Sleeping quarters */}
          <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-lg p-8 border-2 border-purple-500 text-center mb-8 relative">
            <div className="text-6xl mb-4">🛏️</div>
            
            {/* Astronaut lying down resting */}
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
              <svg width="80" height="50" viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
                {/* Lying down astronaut */}
                <ellipse cx="30" cy="25" rx="10" ry="12" fill="#e0e0e0" stroke="#333" strokeWidth="2"/>
                <ellipse cx="30" cy="25" rx="7" ry="9" fill="rgba(173, 216, 230, 0.5)"/>
                <circle cx="28" cy="24" r="1.5" fill="#333"/>
                <circle cx="32" cy="24" r="1.5" fill="#333"/>
                <rect x="40" y="18" width="35" height="15" fill="#fff" stroke="#333" strokeWidth="2" rx="3"/>
                <line x1="40" y1="25" x2="30" y2="30" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
                <line x1="75" y1="25" x2="85" y2="30" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
                <text x="57" y="28" fontSize="8" fill="#0066cc" textAnchor="middle">💤</text>
              </svg>
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-4">Rest Area</h2>
            <p className="text-xl text-purple-200 mb-4">
              {shipMessage || 'Taking a rest refuels your ship by 20%'}
            </p>
            <p className="text-lg text-gray-300">
              Resting now... ⭐✨
            </p>
          </div>

          <div className="text-center">
            <button
              onClick={() => setGameState('space')}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg text-xl font-bold hover:bg-blue-700 transition-all hover:scale-110"
            >
              Press E to Return to Space
            </button>
          </div>
        </div>
      </div>
    );
  }

  // PLANET VIEW
  if (gameState === 'planet' && currentPlanet) {
    const planet = planets.find(p => p.name === currentPlanet)!;
    
    return (
      <div 
        className="min-h-screen p-8 relative overflow-hidden"
        style={{
          background: `radial-gradient(circle at center, ${planet.color} 0%, #000 100%)`
        }}
      >
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Astronaut planting flag on planet */}
          <div className="absolute left-8 bottom-8">
            <svg width="60" height="100" viewBox="0 0 60 120" xmlns="http://www.w3.org/2000/svg">
              {/* Flag pole */}
              <line x1="50" y1="10" x2="50" y2="50" stroke="#888" strokeWidth="2"/>
              <rect x="50" y="10" width="30" height="20" fill="#0066cc" stroke="#333" strokeWidth="1"/>
              <text x="65" y="23" fontSize="12" fill="#fff" textAnchor="middle">🚩</text>
              
              {/* Astronaut */}
              <circle cx="30" cy="55" r="12" fill="#e0e0e0" stroke="#333" strokeWidth="2"/>
              <circle cx="30" cy="55" r="9" fill="rgba(173, 216, 230, 0.5)"/>
              <circle cx="26" cy="54" r="2" fill="#333"/>
              <circle cx="34" cy="54" r="2" fill="#333"/>
              <path d="M 25 58 Q 30 60 35 58" stroke="#333" strokeWidth="1.5" fill="none"/>
              <rect x="20" y="68" width="20" height="25" fill="#fff" stroke="#333" strokeWidth="2" rx="3"/>
              <circle cx="30" cy="80" r="4" fill="#0066cc"/>
              <line x1="20" y1="75" x2="12" y2="82" stroke="#fff" strokeWidth="4" strokeLinecap="round"/>
              <line x1="40" y1="75" x2="48" y2="68" stroke="#fff" strokeWidth="4" strokeLinecap="round"/>
              <circle cx="12" cy="82" r="3" fill="#e0e0e0" stroke="#333" strokeWidth="1"/>
              <circle cx="48" cy="68" r="3" fill="#e0e0e0" stroke="#333" strokeWidth="1"/>
              <line x1="25" y1="93" x2="22" y2="108" stroke="#fff" strokeWidth="4" strokeLinecap="round"/>
              <line x1="35" y1="93" x2="38" y2="108" stroke="#fff" strokeWidth="4" strokeLinecap="round"/>
              <ellipse cx="22" cy="111" rx="4" ry="3" fill="#333"/>
              <ellipse cx="38" cy="111" rx="4" ry="3" fill="#333"/>
            </svg>
          </div>
          
          <div className="text-9xl mb-8 animate-bounce">{planet.emoji}</div>
          <h1 className="text-6xl font-bold text-white mb-6 capitalize">
            {planet.name}
          </h1>
          
          <div className="bg-black bg-opacity-70 rounded-lg p-8 mb-8">
            <p className="text-2xl text-white mb-6">{planet.fact}</p>
            <div className="space-y-4">
              <p className="text-xl text-gray-300">🔭 You've discovered this amazing world!</p>
              <p className="text-lg text-gray-400">Keep exploring to learn more!</p>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                setGameState('space');
                setCurrentPlanet(null);
              }}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg text-xl font-bold hover:bg-blue-700 transition-all hover:scale-110"
            >
              🚀 Return to Space (ESC)
            </button>
          </div>
        </div>

        {/* Atmospheric effect */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-20"
              style={{
                width: `${Math.random() * 100 + 50}px`,
                height: `${Math.random() * 100 + 50}px`,
                background: 'white',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${5 + Math.random() * 5}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-30px); }
          }
        `}</style>
      </div>
    );
  }

  // SPACE VIEW
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Stars */}
      {[...Array(200)].map((_, i) => (
        <div
          key={i}
          className="absolute bg-white rounded-full animate-pulse"
          style={{
            width: `${Math.random() * 3}px`,
            height: `${Math.random() * 3}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`
          }}
        />
      ))}

      {/* Stick Figure Astronaut */}
      <div
        className="absolute z-10 transition-all duration-300"
        style={{
          left: `${stickFigurePos.x}%`,
          top: `${stickFigurePos.y}%`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <svg width="60" height="80" viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg">
          {/* Helmet/head with glass */}
          <circle cx="30" cy="15" r="12" fill="#e0e0e0" stroke="#333" strokeWidth="2"/>
          <circle cx="30" cy="15" r="9" fill="rgba(173, 216, 230, 0.5)" stroke="#666" strokeWidth="1"/>
          
          {/* Eyes */}
          <circle cx="26" cy="14" r="2" fill="#333"/>
          <circle cx="34" cy="14" r="2" fill="#333"/>
          
          {/* Smile */}
          <path d="M 25 18 Q 30 20 35 18" stroke="#333" strokeWidth="1.5" fill="none"/>
          
          {/* Body (spacesuit) */}
          <rect x="20" y="28" width="20" height="25" fill="#fff" stroke="#333" strokeWidth="2" rx="3"/>
          
          {/* NASA badge */}
          <circle cx="30" cy="40" r="4" fill="#0066cc"/>
          <text x="30" y="42" fontSize="6" fill="#fff" textAnchor="middle">N</text>
          
          {/* Arms */}
          <line 
            x1="20" y1="35" 
            x2={isWaving ? "8" : "12"} 
            y2={isWaving ? "30" : "42"} 
            stroke="#fff" 
            strokeWidth="4" 
            strokeLinecap="round"
          />
          <line x1="40" y1="35" x2="48" y2="42" stroke="#fff" strokeWidth="4" strokeLinecap="round"/>
          
          {/* Gloves */}
          <circle cx={isWaving ? "8" : "12"} cy={isWaving ? "30" : "42"} r="3" fill="#e0e0e0" stroke="#333" strokeWidth="1"/>
          <circle cx="48" cy="42" r="3" fill="#e0e0e0" stroke="#333" strokeWidth="1"/>
          
          {/* Legs */}
          <line x1="25" y1="53" x2="22" y2="68" stroke="#fff" strokeWidth="4" strokeLinecap="round"/>
          <line x1="35" y1="53" x2="38" y2="68" stroke="#fff" strokeWidth="4" strokeLinecap="round"/>
          
          {/* Boots */}
          <ellipse cx="22" cy="71" rx="4" ry="3" fill="#333"/>
          <ellipse cx="38" cy="71" rx="4" ry="3" fill="#333"/>
          
          {/* Backpack air supply */}
          <rect x="24" y="29" width="12" height="15" fill="#666" stroke="#333" strokeWidth="1" rx="2"/>
          <circle cx="27" cy="34" r="1.5" fill="#00ff00"/>
          <circle cx="33" cy="34" r="1.5" fill="#00ff00"/>
        </svg>
      </div>

      {/* Planets */}
      {planets.map((planet, i) => (
        <button
          key={planet.name}
          onClick={() => visitPlanet(planet)}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-125 cursor-pointer"
          style={{
            left: `${planet.x}%`,
            top: `${planet.y}%`,
            fontSize: `${planet.size}px`,
            filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.5))',
            animation: `orbit${i} ${10 + i * 2}s linear infinite`
          }}
          title={planet.name.toUpperCase()}
        >
          {planet.emoji}
        </button>
      ))}

      {/* UI */}
      <div className="absolute top-0 left-0 right-0 p-6 z-20">
        <div className="max-w-6xl mx-auto flex justify-between items-start">
          <div className="bg-black bg-opacity-80 rounded-lg p-4 border border-blue-500">
            <h2 className="text-xl font-bold text-blue-400 mb-2">⛽ Fuel: {fuel}%</h2>
            <div className="w-48 bg-gray-700 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all ${fuel > 50 ? 'bg-green-500' : fuel > 25 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${fuel}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">10 fuel per planet visit</p>
          </div>

          <div className="bg-black bg-opacity-80 rounded-lg p-4 border border-purple-500">
            <h2 className="text-xl font-bold text-purple-400 mb-2">📜 Discoveries: {discoveries.length}</h2>
            <p className="text-sm text-gray-400">Keep exploring!</p>
          </div>
        </div>
      </div>

      {/* Controls reminder */}
      {showControls && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 rounded-lg p-6 border border-white z-20">
          <button
            onClick={() => setShowControls(false)}
            className="absolute top-2 right-2 text-white hover:text-red-500"
          >
            ✕
          </button>
          <h3 className="text-xl font-bold text-white mb-3">🎮 Space Controls</h3>
          <ul className="text-white space-y-2">
            <li>🧑‍🚀 <kbd className="px-2 py-1 bg-gray-700 rounded">↑ ↓ ← →</kbd> Move astronaut</li>
            <li>👋 <kbd className="px-2 py-1 bg-gray-700 rounded">W</kbd> Wave hello!</li>
            <li>🖱️ Click planets to visit them (costs 10 fuel)</li>
            <li>⌨️ Press <kbd className="px-2 py-1 bg-gray-700 rounded">E</kbd> to enter ship and rest (+20 fuel)</li>
            <li>⏎ Press <kbd className="px-2 py-1 bg-gray-700 rounded">ESC</kbd> to leave planets</li>
          </ul>
        </div>
      )}

      {/* Ship message */}
      {shipMessage && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black px-6 py-3 rounded-lg font-bold text-lg animate-pulse z-20">
          {shipMessage}
        </div>
      )}

      {/* Back button */}
      <div className="absolute bottom-6 left-6 z-20">
        <Link
          href="/kid"
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors border border-gray-600"
        >
          ← Exit Space
        </Link>
      </div>

      {/* Orbital animations */}
      <style jsx>{`
        ${planets.map((_, i) => `
          @keyframes orbit${i} {
            0% { transform: translate(-50%, -50%) rotate(0deg) translateX(20px) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg) translateX(20px) rotate(-360deg); }
          }
        `).join('\n')}
      `}</style>
    </div>
  );
}
