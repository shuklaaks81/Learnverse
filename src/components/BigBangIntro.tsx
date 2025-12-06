'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BigBangIntro() {
  const router = useRouter();
  const [stage, setStage] = useState(0);
  const [clicked, setClicked] = useState(false);
  const [isLegendary, setIsLegendary] = useState(false);
  const [isGodMode, setIsGodMode] = useState(false);

  useEffect(() => {
    // Check for legendary/god mode
    const legendary = localStorage.getItem('legendaryMode') === 'true';
    const god = localStorage.getItem('godMode') === 'true';
    setIsLegendary(legendary);
    setIsGodMode(god);
  }, []);

  const handleDotClick = () => {
    if (stage === 1 && !clicked) {
      setClicked(true);
      setTimeout(() => setStage(2), 100); // Big Bang explosion
      setTimeout(() => setStage(3), 2000); // Book appears
      setTimeout(() => setStage(4), 4000); // Stick mixing
      setTimeout(() => setStage(5), 6000); // Rapid expansion
      setTimeout(() => setStage(6), 8000); // Star forms
      setTimeout(() => setStage(7), 10000); // Rings appear
      setTimeout(() => setStage(8), 12000); // Cartoonnia collides
      setTimeout(() => setStage(9), 14000); // Imagination spreads
      setTimeout(() => setStage(10), 16000); // Rings collide - cartoony
      setTimeout(() => setStage(11), 18000); // Stick figure
      setTimeout(() => setStage(12), 20000); // Snack World zoom
      setTimeout(() => setStage(13), 22000); // Person at computer
      setTimeout(() => setStage(14), 24000); // App loads!
    }
  };

  useEffect(() => {
    // Start with black screen, then show dot
    const timer = setTimeout(() => setStage(1), 500);
    return () => clearTimeout(timer);
  }, []);

  // Skip intro after completion
  useEffect(() => {
    if (stage === 14) {
      const completeTimer = setTimeout(() => {
        localStorage.setItem('introDone', 'true');
        // No redirect - let loading wrapper handle it
      }, 2000);
      return () => clearTimeout(completeTimer);
    }
  }, [stage]);

  const getColors = () => {
    if (isGodMode) {
      return {
        bg: 'from-purple-900 via-pink-900 to-cyan-900',
        glow: 'rgba(236, 72, 153, 0.8)',
        particle: '#EC4899'
      };
    } else if (isLegendary) {
      return {
        bg: 'from-purple-800 via-blue-900 to-black',
        glow: 'rgba(139, 92, 246, 0.8)',
        particle: '#8B5CF6'
      };
    }
    return {
      bg: 'from-black via-gray-900 to-black',
      glow: 'rgba(255, 255, 255, 0.8)',
      particle: '#FFF'
    };
  };

  const colors = getColors();

  if (stage === 0) {
    return (
      <div className="fixed inset-0 bg-black z-[9999] flex items-center justify-center">
        <div className="text-white text-2xl animate-pulse">Loading the universe...</div>
      </div>
    );
  }

  if (stage === 1) {
    return (
      <div className="fixed inset-0 bg-black z-[9999] flex items-center justify-center">
        <div className="relative">
          <button
            onClick={handleDotClick}
            className="w-4 h-4 rounded-full bg-white animate-pulse hover:scale-150 transition-transform duration-300"
            style={{ boxShadow: `0 0 20px ${colors.glow}` }}
          />
          <p className="absolute top-12 left-1/2 -translate-x-1/2 text-white text-xl font-bold whitespace-nowrap animate-bounce">
            Click the dot!
          </p>
        </div>
      </div>
    );
  }

  if (stage === 2) {
    // BIG BANG EXPLOSION
    return (
      <div className={`fixed inset-0 bg-gradient-to-br ${colors.bg} z-[9999] flex items-center justify-center overflow-hidden`}>
        {/* Explosion particles */}
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: colors.particle,
              left: '50%',
              top: '50%',
              animation: `explode 2s ease-out forwards`,
              animationDelay: `${Math.random() * 0.2}s`,
              transform: `rotate(${i * 3.6}deg) translateX(0)`,
              opacity: 1
            }}
          />
        ))}
        <style jsx>{`
          @keyframes explode {
            0% { transform: rotate(${Math.random() * 360}deg) translateX(0); opacity: 1; }
            100% { transform: rotate(${Math.random() * 360}deg) translateX(${Math.random() * 500 + 200}px); opacity: 0; }
          }
        `}</style>
        <div className="text-8xl font-bold text-white animate-pulse">💥</div>
      </div>
    );
  }

  if (stage === 3) {
    // BOOK APPEARS
    return (
      <div className={`fixed inset-0 bg-gradient-to-br ${colors.bg} z-[9999] flex items-center justify-center`}>
        <div className="text-9xl animate-[spin_3s_ease-in-out] opacity-0 animate-[fadeIn_1s_ease-in_forwards]">
          📚
        </div>
        <p className="absolute bottom-20 text-white text-2xl font-bold animate-pulse">
          A book... in the void...
        </p>
        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    );
  }

  if (stage === 4) {
    // STICK MIXING
    return (
      <div className={`fixed inset-0 bg-gradient-to-br ${colors.bg} z-[9999] flex items-center justify-center overflow-hidden`}>
        <div className="relative">
          <div className="text-7xl animate-bounce">📚</div>
          <div className="absolute top-0 left-20 text-6xl animate-spin">🥢</div>
          {/* Swirling particles */}
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
              style={{
                animation: `orbit 2s linear infinite`,
                animationDelay: `${i * 0.1}s`,
                left: '50%',
                top: '50%'
              }}
            />
          ))}
        </div>
        <p className="absolute bottom-20 text-white text-2xl font-bold animate-pulse">
          Mixing with every substance...
        </p>
        <style jsx>{`
          @keyframes orbit {
            0% { transform: translate(-50%, -50%) rotate(0deg) translateX(100px) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg) translateX(100px) rotate(-360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (stage === 5) {
    // RAPID EXPANSION
    return (
      <div className={`fixed inset-0 bg-gradient-to-br ${colors.bg} z-[9999] flex items-center justify-center overflow-hidden`}>
        {/* Expanding circles */}
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute border-4 border-white/30 rounded-full"
            style={{
              width: `${(i + 1) * 100}px`,
              height: `${(i + 1) * 100}px`,
              animation: `expand 2s ease-out infinite`,
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
        <p className="absolute bottom-20 text-white text-3xl font-bold animate-pulse z-10">
          RAPID EXPANSION! 💫
        </p>
        <style jsx>{`
          @keyframes expand {
            0% { transform: scale(0); opacity: 1; }
            100% { transform: scale(3); opacity: 0; }
          }
        `}</style>
      </div>
    );
  }

  if (stage === 6) {
    // STAR FORMS
    return (
      <div className={`fixed inset-0 bg-gradient-to-br ${colors.bg} z-[9999] flex items-center justify-center`}>
        <div className="relative">
          <div className="text-9xl animate-pulse" style={{ filter: 'drop-shadow(0 0 50px yellow)' }}>⭐</div>
          {/* Rays */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-32 bg-gradient-to-t from-yellow-400 to-transparent"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) rotate(${i * 30}deg)`,
                transformOrigin: 'center',
                animation: 'pulse 2s ease-in-out infinite'
              }}
            />
          ))}
        </div>
        <p className="absolute bottom-20 text-white text-2xl font-bold animate-pulse">
          A star is born! ⭐
        </p>
      </div>
    );
  }

  if (stage === 7) {
    // RINGS APPEAR
    return (
      <div className={`fixed inset-0 bg-gradient-to-br ${colors.bg} z-[9999] flex items-center justify-center overflow-hidden`}>
        <div className="relative">
          <div className="w-64 h-64 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 animate-spin-slow" />
          {/* Rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-12 border-8 border-orange-400 rounded-full opacity-70 animate-pulse" style={{ transform: 'translate(-50%, -50%) rotateX(75deg)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-16 border-8 border-yellow-400 rounded-full opacity-50 animate-pulse" style={{ transform: 'translate(-50%, -50%) rotateX(75deg)', animationDelay: '0.3s' }} />
        </div>
        <p className="absolute bottom-20 text-white text-2xl font-bold animate-pulse">
          A giant stick creates rings! 🪐
        </p>
        <style jsx>{`
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 4s linear infinite;
          }
        `}</style>
      </div>
    );
  }

  if (stage === 8) {
    // CARTOONNIA COLLIDES
    return (
      <div className={`fixed inset-0 bg-gradient-to-br ${colors.bg} z-[9999] flex items-center justify-center overflow-hidden`}>
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Planet */}
          <div className="w-64 h-64 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 absolute" />
          {/* Cartoonnia incoming */}
          <div 
            className="w-48 h-48 rounded-full bg-gradient-to-br from-pink-500 to-red-500 absolute"
            style={{
              animation: 'collide 2s ease-in forwards',
              left: '-200px',
              top: '20%'
            }}
          />
        </div>
        <p className="absolute bottom-20 text-white text-2xl font-bold animate-pulse z-10">
          CARTOONNIA COLLIDES! 💥🪐
        </p>
        <style jsx>{`
          @keyframes collide {
            0% { left: -200px; }
            100% { left: 50%; transform: translateX(-50%); }
          }
        `}</style>
      </div>
    );
  }

  if (stage === 9) {
    // IMAGINATION SPREADS
    return (
      <div className={`fixed inset-0 bg-gradient-to-br ${colors.bg} z-[9999] flex items-center justify-center overflow-hidden`}>
        {/* Rainbow particles spreading */}
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-4 h-4 rounded-full"
            style={{
              background: `hsl(${i * 7.2}, 100%, 50%)`,
              animation: `spread 2s ease-out infinite`,
              animationDelay: `${i * 0.05}s`,
              left: '50%',
              top: '50%'
            }}
          />
        ))}
        <div className="absolute text-9xl animate-pulse">✨</div>
        <p className="absolute bottom-20 text-white text-2xl font-bold animate-pulse z-10">
          IMAGINATION spreads across reality! 🌈✨
        </p>
        <style jsx>{`
          @keyframes spread {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
            100% { transform: translate(${Math.random() * 1000 - 500}px, ${Math.random() * 1000 - 500}px) scale(1); opacity: 0; }
          }
        `}</style>
      </div>
    );
  }

  if (stage === 10) {
    // RINGS COLLIDE - CARTOONY
    return (
      <div className={`fixed inset-0 bg-gradient-to-br from-orange-400 via-pink-400 to-purple-400 z-[9999] flex items-center justify-center overflow-hidden`}>
        <div className="text-9xl animate-bounce">🎨</div>
        {/* Cartoony effects */}
        {['💫', '✨', '🌟', '⭐', '💥'].map((emoji, i) => (
          <div
            key={i}
            className="absolute text-6xl animate-spin"
            style={{
              left: `${20 + i * 20}%`,
              top: `${30 + Math.sin(i) * 20}%`,
              animationDuration: `${2 + i * 0.5}s`
            }}
          >
            {emoji}
          </div>
        ))}
        <p className="absolute bottom-20 text-white text-3xl font-bold animate-pulse z-10">
          Everything becomes CARTOONY! 🎨✨
        </p>
      </div>
    );
  }

  if (stage === 11) {
    // STICK FIGURE APPEARS
    return (
      <div className={`fixed inset-0 bg-gradient-to-br from-amber-400 via-orange-300 to-pink-300 z-[9999] flex items-center justify-center`}>
        <div className="relative">
          {/* Simple stick figure */}
          <svg width="200" height="300" viewBox="0 0 200 300" className="animate-[fadeIn_1s_ease-in]">
            <circle cx="100" cy="50" r="30" fill="black" />
            <line x1="100" y1="80" x2="100" y2="180" stroke="black" strokeWidth="6" />
            <line x1="100" y1="100" x2="60" y2="140" stroke="black" strokeWidth="6" />
            <line x1="100" y1="100" x2="140" y2="140" stroke="black" strokeWidth="6" />
            <line x1="100" y1="180" x2="70" y2="250" stroke="black" strokeWidth="6" />
            <line x1="100" y1="180" x2="130" y2="250" stroke="black" strokeWidth="6" />
          </svg>
        </div>
        <p className="absolute bottom-20 text-gray-800 text-2xl font-bold animate-pulse">
          A stick figure emerges! 🧍
        </p>
      </div>
    );
  }

  if (stage === 12) {
    // SNACK WORLD ZOOM
    return (
      <div className={`fixed inset-0 bg-gradient-to-br from-green-400 via-blue-400 to-purple-400 z-[9999] flex items-center justify-center overflow-hidden`}>
        <div className="text-9xl animate-[zoomIn_2s_ease-out]">
          🌍
        </div>
        <p className="absolute bottom-20 text-white text-3xl font-bold animate-pulse">
          Welcome to SNACK WORLD! 🌍✨
        </p>
        <style jsx>{`
          @keyframes zoomIn {
            0% { transform: scale(0.1); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  if (stage === 13) {
    // PERSON AT COMPUTER
    return (
      <div className={`fixed inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black z-[9999] flex items-center justify-center`}>
        <div className="relative">
          <div className="text-8xl">🧑‍💻</div>
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-6xl animate-pulse">💻</div>
        </div>
        <p className="absolute bottom-20 text-white text-2xl font-bold animate-pulse">
          Someone opens their computer...
        </p>
      </div>
    );
  }

  if (stage === 14) {
    // APP LOADS - LEARNVERSE!
    return (
      <div className={`fixed inset-0 bg-gradient-to-br ${colors.bg} z-[9999] flex flex-col items-center justify-center`}>
        <div className="text-9xl mb-8 animate-bounce">
          {isGodMode ? '✨' : isLegendary ? '🔮' : '🌌'}
        </div>
        <h1 className="text-7xl font-bold text-white mb-4 animate-pulse" style={{ textShadow: `0 0 30px ${colors.glow}` }}>
          LEARNVERSE
        </h1>
        <p className="text-3xl text-white/80 animate-pulse">
          {isGodMode ? 'GOD MODE ACTIVATED ✨' : isLegendary ? 'Legendary Edition 🔮' : 'The Journey Begins... 🚀'}
        </p>
      </div>
    );
  }

  return null;
}
