'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Poopverse() {
  const router = useRouter();
  const [poops, setPoops] = useState<Array<{ id: number; x: number; y: number; rotation: number; speed: number }>>([]);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    // Generate flying poops
    const newPoops = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      rotation: Math.random() * 360,
      speed: 3 + Math.random() * 7,
    }));
    setPoops(newPoops);

    // Show message after dramatic entrance
    setTimeout(() => setShowMessage(true), 500);

    // Play toilet flush sound effect (using Web Audio API)
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const playFlush = () => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.5);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    };
    
    playFlush();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-yellow-800 to-orange-900 overflow-hidden relative">
      {/* Animated Background Poops */}
      {poops.map((poop) => (
        <div
          key={poop.id}
          className="absolute text-6xl animate-spin"
          style={{
            left: `${poop.x}%`,
            top: `${poop.y}%`,
            animation: `spin ${poop.speed}s linear infinite, float ${poop.speed * 2}s ease-in-out infinite`,
            transform: `rotate(${poop.rotation}deg)`,
          }}
        >
          💩
        </div>
      ))}

      {/* POOPVERSE Title */}
      <div className={`relative z-10 flex flex-col items-center justify-center min-h-screen transition-all duration-1000 ${showMessage ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
        <h1 className="text-9xl font-black text-yellow-300 mb-8 animate-bounce drop-shadow-2xl" style={{
          textShadow: '0 0 20px rgba(139, 69, 19, 0.8), 0 0 40px rgba(139, 69, 19, 0.6), 0 0 60px rgba(139, 69, 19, 0.4)'
        }}>
          💩 POOPVERSE 💩
        </h1>

        <p className="text-4xl text-amber-200 mb-12 text-center px-8 font-bold animate-pulse">
          You found the secret dimension of POOP!
        </p>

        <div className="bg-yellow-900/80 backdrop-blur-sm p-8 rounded-3xl border-4 border-yellow-600 mb-8 max-w-2xl">
          <p className="text-2xl text-yellow-100 text-center mb-4">
            🚽 Welcome to the most CRAPPY dimension ever! 🚽
          </p>
          <p className="text-xl text-yellow-200 text-center mb-6">
            Here, everything is made of poop. The ground, the sky, even the air smells funny!
          </p>
          <div className="text-center space-y-2">
            <p className="text-lg text-yellow-300">🌀 You unlocked this by typing: HIHOWAREYOU</p>
            <p className="text-lg text-yellow-300">💩 Now you&apos;re stuck in... POOP WORLD!</p>
            <p className="text-lg text-yellow-300">🎉 Congrats on being a 💩 detective!</p>
          </div>
        </div>

        {/* Floating Mega Poops */}
        <div className="flex gap-8 mb-12">
          <div className="text-9xl animate-bounce" style={{ animationDelay: '0s' }}>💩</div>
          <div className="text-9xl animate-bounce" style={{ animationDelay: '0.2s' }}>💩</div>
          <div className="text-9xl animate-bounce" style={{ animationDelay: '0.4s' }}>💩</div>
        </div>

        {/* Fun Stats */}
        <div className="bg-amber-800/70 backdrop-blur p-6 rounded-2xl border-2 border-yellow-500 mb-8">
          <h3 className="text-2xl font-bold text-yellow-200 mb-4 text-center">💩 POOP STATS 💩</h3>
          <div className="grid grid-cols-2 gap-4 text-yellow-100">
            <div className="text-center">
              <div className="text-4xl mb-2">🚽</div>
              <div className="text-sm">Toilets Flushed: ∞</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">💩</div>
              <div className="text-sm">Poops Flying: {poops.length}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🌪️</div>
              <div className="text-sm">Swirl Speed: MAX</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">😂</div>
              <div className="text-sm">Funniness: 100%</div>
            </div>
          </div>
        </div>

        {/* Escape Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/kid')}
            className="bg-yellow-600 hover:bg-yellow-500 text-yellow-100 font-bold text-xl px-8 py-4 rounded-full transition-all transform hover:scale-110 hover:rotate-3 shadow-xl"
          >
            🚀 Escape POOPVERSE
          </button>
          <button
            onClick={() => {
              const poop = window.confirm('Are you sure you want to EMBRACE the poop? 💩');
              if (poop) {
                alert('POOOOOOOOOP! 💩💩💩💩💩');
              }
            }}
            className="bg-amber-700 hover:bg-amber-600 text-yellow-100 font-bold text-xl px-8 py-4 rounded-full transition-all transform hover:scale-110 hover:-rotate-3 shadow-xl"
          >
            💩 Embrace the Poop
          </button>
        </div>

        {/* Secret hint for other codes */}
        <p className="text-yellow-500/50 text-sm mt-12 italic">
          Psst... there might be other secret codes hidden in Learnverse... 🤫
        </p>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(180deg); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
