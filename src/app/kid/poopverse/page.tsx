'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Poopverse() {
  const router = useRouter();
  const [poops, setPoops] = useState<Array<{ 
    id: number; 
    x: number; 
    y: number; 
    z: number;
    rotation: number; 
    rotationY: number;
    speed: number;
    size: number;
  }>>([]);
  const [showMessage, setShowMessage] = useState(false);
  const [poopClicks, setPoopClicks] = useState(0);
  const [showPopee, setShowPopee] = useState(false);
  const [popeeAnimation, setPopeeAnimation] = useState('idle');

  useEffect(() => {
    // Generate 3D flying poops with depth
    const newPoops = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      z: Math.random() * 200 - 100, // Depth from -100 to 100
      rotation: Math.random() * 360,
      rotationY: Math.random() * 360,
      speed: 3 + Math.random() * 7,
      size: 0.5 + Math.random() * 1.5, // Size variation for depth effect
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

  // Handle poop clicks to reveal Popee
  const handlePoopClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newClicks = poopClicks + 1;
    setPoopClicks(newClicks);
    
    // Play click sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = 800 + (newClicks * 100);
    gainNode.gain.value = 0.1;
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
    
    if (newClicks >= 5 && !showPopee) {
      setShowPopee(true);
      setTimeout(() => setPopeeAnimation('dance'), 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-yellow-900 to-orange-950 overflow-hidden relative" style={{ perspective: '1000px' }}>
      {/* Premium gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20 pointer-events-none" />
      
      {/* 3D Animated Background Poops with Shadows */}
      {poops.map((poop) => (
        <div
          key={poop.id}
          onClick={handlePoopClick}
          className="absolute text-6xl cursor-pointer hover:scale-125 transition-transform"
          style={{
            left: `${poop.x}%`,
            top: `${poop.y}%`,
            animation: `float3d ${poop.speed}s ease-in-out infinite, rotate3d ${poop.speed * 1.5}s linear infinite`,
            transform: `translateZ(${poop.z}px) rotateY(${poop.rotationY}deg) scale(${poop.size})`,
            filter: `drop-shadow(0 ${Math.abs(poop.z) / 4}px ${Math.abs(poop.z) / 2}px rgba(0,0,0,${0.3 + Math.abs(poop.z) / 400}))`,
            opacity: 0.7 + (poop.z / 400),
          }}
        >
          💩
        </div>
      ))}

      {/* PREMIUM POOPVERSE Content */}
      <div className={`relative z-10 flex flex-col items-center justify-center min-h-screen transition-all duration-1000 ${showMessage ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
        
        {/* Premium Title with 3D effect */}
        <div className="relative mb-8">
          <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 animate-bounce drop-shadow-2xl" style={{
            textShadow: '0 10px 30px rgba(139, 69, 19, 0.8), 0 20px 50px rgba(139, 69, 19, 0.5)',
            transform: 'translateZ(50px)'
          }}>
            💩 POOPVERSE 💩
          </h1>
          {/* Premium shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" 
               style={{ animation: 'shimmer 3s infinite' }} />
        </div>

        <p className="text-4xl text-amber-200 mb-12 text-center px-8 font-bold animate-pulse backdrop-blur-sm bg-black/20 py-4 px-8 rounded-2xl border border-yellow-600/30">
          You found the secret dimension of POOP!
        </p>

        {/* Premium Info Card */}
        <div className="bg-gradient-to-br from-yellow-900/90 to-amber-950/90 backdrop-blur-xl p-10 rounded-3xl border-2 border-yellow-500/50 mb-8 max-w-2xl shadow-2xl transform hover:scale-105 transition-transform" style={{
          boxShadow: '0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
        }}>
          <p className="text-2xl text-yellow-100 text-center mb-4 font-semibold">
            🚽 Welcome to the most CRAPPY dimension ever! 🚽
          </p>
          <p className="text-xl text-yellow-200 text-center mb-6">
            Here, everything is made of poop. The ground, the sky, even the air smells funny!
          </p>
          <div className="text-center space-y-3 bg-black/30 p-6 rounded-2xl border border-yellow-700/40">
            <p className="text-lg text-yellow-300">🌀 Secret URL discovered!</p>
            <p className="text-lg text-yellow-300">💩 Now you&apos;re stuck in... POOP WORLD!</p>
            <p className="text-lg text-yellow-300">🎉 Congrats on being a 💩 detective!</p>
          </div>
        </div>

        {/* Premium Floating Mega Poops with 3D shadows */}
        <div className="flex gap-12 mb-12">
          <div className="text-9xl animate-bounce transform hover:scale-125 transition-transform cursor-pointer" 
               style={{ 
                 animationDelay: '0s',
                 filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.5))',
                 transform: 'translateZ(30px)'
               }}>💩</div>
          <div className="text-9xl animate-bounce transform hover:scale-125 transition-transform cursor-pointer" 
               style={{ 
                 animationDelay: '0.2s',
                 filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.5))',
                 transform: 'translateZ(30px)'
               }}>💩</div>
          <div className="text-9xl animate-bounce transform hover:scale-125 transition-transform cursor-pointer" 
               style={{ 
                 animationDelay: '0.4s',
                 filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.5))',
                 transform: 'translateZ(30px)'
               }}>💩</div>
        </div>

        {/* Premium Stats Dashboard */}
        <div className="bg-gradient-to-br from-amber-900/80 to-orange-950/80 backdrop-blur-lg p-8 rounded-3xl border-2 border-yellow-400/40 mb-8 shadow-2xl">
          <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-400 mb-6 text-center">💩 PREMIUM POOP STATS 💩</h3>
          <div className="grid grid-cols-2 gap-6 text-yellow-100">
            <div className="text-center bg-black/40 p-6 rounded-2xl border border-yellow-600/20 transform hover:scale-105 transition-transform">
              <div className="text-5xl mb-3">🚽</div>
              <div className="text-sm font-semibold">Toilets Flushed</div>
              <div className="text-2xl font-bold text-yellow-300">∞</div>
            </div>
            <div className="text-center bg-black/40 p-6 rounded-2xl border border-yellow-600/20 transform hover:scale-105 transition-transform">
              <div className="text-5xl mb-3">💩</div>
              <div className="text-sm font-semibold">Poops Flying</div>
              <div className="text-2xl font-bold text-yellow-300">{poops.length}</div>
            </div>
            <div className="text-center bg-black/40 p-6 rounded-2xl border border-yellow-600/20 transform hover:scale-105 transition-transform">
              <div className="text-5xl mb-3">🌪️</div>
              <div className="text-sm font-semibold">Swirl Speed</div>
              <div className="text-2xl font-bold text-yellow-300">MAX</div>
            </div>
            <div className="text-center bg-black/40 p-6 rounded-2xl border border-yellow-600/20 transform hover:scale-105 transition-transform">
              <div className="text-5xl mb-3">😂</div>
              <div className="text-sm font-semibold">Funniness</div>
              <div className="text-2xl font-bold text-yellow-300">100%</div>
            </div>
          </div>
        </div>

        {/* Premium Escape Buttons with 3D effects */}
        <div className="flex gap-6">
          <button
            onClick={() => router.push('/kid')}
            className="relative bg-gradient-to-br from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-white font-bold text-xl px-10 py-5 rounded-2xl transition-all transform hover:scale-110 hover:-translate-y-1 shadow-2xl border-2 border-yellow-400/50 overflow-hidden group"
            style={{ 
              boxShadow: '0 10px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
              transform: 'translateZ(20px)'
            }}
          >
            <span className="relative z-10">🚀 Escape POOPVERSE</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
          </button>
          <button
            onClick={() => {
              const poop = window.confirm('Are you sure you want to EMBRACE the poop? 💩');
              if (poop) {
                alert('POOOOOOOOOP! 💩💩💩💩💩');
              }
            }}
            className="relative bg-gradient-to-br from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-white font-bold text-xl px-10 py-5 rounded-2xl transition-all transform hover:scale-110 hover:-translate-y-1 shadow-2xl border-2 border-amber-500/50 overflow-hidden group"
            style={{ 
              boxShadow: '0 10px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
              transform: 'translateZ(20px)'
            }}
          >
            <span className="relative z-10">💩 Embrace the Poop</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
          </button>
        </div>

        {/* 🎪 POPEE THE PERFORMER SECRET! 🎪 */}
        {showPopee && (
          <div className={`mt-8 transition-all duration-1000 ${popeeAnimation === 'dance' ? 'animate-bounce' : ''}`}>
            <div className="bg-gradient-to-br from-red-600/90 to-pink-700/90 backdrop-blur-xl p-8 rounded-3xl border-2 border-red-400/50 shadow-2xl">
              <div className="text-center space-y-4">
                <div className="text-8xl mb-4 animate-spin" style={{ animationDuration: '2s' }}>🎪</div>
                <h2 className="text-4xl font-black text-white drop-shadow-lg">
                  POPEE HAS APPEARED!
                </h2>
                <p className="text-xl text-red-100">
                  (Pronounced &quot;PO-PEE&quot; not &quot;POO-PEE&quot;!)
                </p>
                <div className="text-6xl my-6">🤡✨</div>
                <p className="text-lg text-white">
                  You clicked {poopClicks} poops and summoned the legendary circus performer!
                </p>
                <div className="bg-black/40 p-6 rounded-2xl border border-red-500/30 mt-4">
                  <p className="text-yellow-300 font-bold text-xl mb-2">🎭 Popee says:</p>
                  <p className="text-white italic">&quot;Welcome to the POOPVERSE circus! 
                  Where the poops are flying and the fun never stops! 💩🎪&quot;</p>
                </div>
                <button
                  onClick={() => {
                    setPopeeAnimation(popeeAnimation === 'dance' ? 'spin' : 'dance');
                  }}
                  className="mt-4 bg-gradient-to-r from-pink-500 to-red-600 text-white px-8 py-3 rounded-full font-bold hover:scale-110 transition-transform shadow-lg"
                >
                  🎪 Make Popee Dance!
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Poop click progress hint */}
        {!showPopee && poopClicks > 0 && (
          <p className="text-yellow-400/80 text-lg mt-8 animate-pulse">
            💩 Clicked {poopClicks}/5 poops... something&apos;s happening! 🎪
          </p>
        )}

        {/* Premium secret hint */}
        <p className="text-yellow-600/60 text-sm mt-12 italic backdrop-blur-sm bg-black/20 px-6 py-3 rounded-full border border-yellow-700/20">
          Psst... there might be other secret dimensions hidden in Learnverse... 🤫
        </p>
      </div>

      <style jsx>{`
        @keyframes float3d {
          0%, 100% { 
            transform: translateY(0px) translateZ(var(--z)) rotateX(0deg) rotateY(0deg);
          }
          25% { 
            transform: translateY(-40px) translateZ(calc(var(--z) + 20px)) rotateX(15deg) rotateY(90deg);
          }
          50% { 
            transform: translateY(-60px) translateZ(var(--z)) rotateX(0deg) rotateY(180deg);
          }
          75% { 
            transform: translateY(-40px) translateZ(calc(var(--z) - 20px)) rotateX(-15deg) rotateY(270deg);
          }
        }
        
        @keyframes rotate3d {
          from { 
            transform: rotateY(0deg) rotateX(0deg);
          }
          to { 
            transform: rotateY(360deg) rotateX(360deg);
          }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
