"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

type PortalEffect = 'dimension' | 'color-shift' | 'glitch' | 'sparkle' | 'wormhole' | 'matrix' | 'galaxy';

export default function SecretPortal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [effect, setEffect] = useState<PortalEffect>('dimension');
  const [isActive, setIsActive] = useState(false);
  const [mysteryText, setMysteryText] = useState('???');
  const animationFrameRef = useRef<number | null>(null);
  const [particles, setParticles] = useState<any[]>([]);
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('high');

  const mysteryMessages = [
    "You found a secret!",
    "The universe is watching...",
    "Reality is glitching...",
    "Dimensions are colliding!",
    "Time is bending...",
    "You shouldn't be here...",
    "Welcome to the void...",
    "The portal is opening...",
    "∞ INFINITE POSSIBILITIES ∞",
    "🌌 YOU ARE THE CHOSEN ONE 🌌"
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      // Clear with fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (!isActive) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      switch (effect) {
        case 'dimension':
          // Rotating dimensional portal
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const time = Date.now() * 0.001;
          const dimParticles = quality === 'high' ? 50 : quality === 'medium' ? 30 : 15;
          
          for (let i = 0; i < dimParticles; i++) {
            const angle = (i / 50) * Math.PI * 2 + time;
            const radius = 100 + Math.sin(time + i * 0.5) * 50;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            ctx.fillStyle = `hsl(${(i * 7 + time * 50) % 360}, 100%, 50%)`;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
          }
          break;

        case 'color-shift':
          // Rainbow wave effect
          for (let x = 0; x < canvas.width; x += 20) {
            for (let y = 0; y < canvas.height; y += 20) {
              const hue = (x + y + Date.now() * 0.1) % 360;
              ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
              ctx.fillRect(x, y, 15, 15);
            }
          }
          break;

        case 'glitch':
          // Digital glitch effect
          if (Math.random() > 0.8) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const w = Math.random() * 200;
            const h = Math.random() * 50;
            ctx.fillStyle = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
            ctx.fillRect(x, y, w, h);
          }
          break;

        case 'sparkle':
          // Sparkle particles
          const sparkleCount = quality === 'high' ? 20 : quality === 'medium' ? 12 : 6;
          for (let i = 0; i < sparkleCount; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const size = Math.random() * 5 + 2;
            ctx.fillStyle = 'white';
            ctx.shadowBlur = 20;
            ctx.shadowColor = 'white';
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
          break;

        case 'wormhole':
          // Spiraling wormhole
          const wTime = Date.now() * 0.002;
          const maxRadius = quality === 'high' ? 300 : quality === 'medium' ? 200 : 100;
          for (let radius = 0; radius < maxRadius; radius += 10) {
            const spiralPoints = Math.floor(radius / 2);
            for (let i = 0; i < spiralPoints; i++) {
              const angle = (i / spiralPoints) * Math.PI * 2 - wTime * 3;
              const x = canvas.width / 2 + Math.cos(angle) * radius;
              const y = canvas.height / 2 + Math.sin(angle) * radius;
              const brightness = 100 - (radius / 3);
              ctx.fillStyle = `hsl(${(radius + wTime * 100) % 360}, 100%, ${brightness}%)`;
              ctx.beginPath();
              ctx.arc(x, y, 3, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          break;

        case 'matrix':
          // Matrix digital rain
          const matrixChars = quality === 'high' ? 20 : quality === 'medium' ? 12 : 6;
          ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
          ctx.font = 'bold 20px monospace';
          for (let i = 0; i < matrixChars; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const char = String.fromCharCode(33 + Math.random() * 94);
            ctx.fillText(char, x, y);
          }
          break;

        case 'galaxy':
          // Spinning galaxy
          const gTime = Date.now() * 0.001;
          const galaxyStars = quality === 'high' ? 200 : quality === 'medium' ? 100 : 50;
          for (let i = 0; i < galaxyStars; i++) {
            const angle = (i / 200) * Math.PI * 6 + gTime;
            const distance = (i / 200) * 250;
            const x = canvas.width / 2 + Math.cos(angle) * distance;
            const y = canvas.height / 2 + Math.sin(angle) * distance;
            const size = Math.random() * 3;
            ctx.fillStyle = `rgba(255, 255, 255, ${1 - (i / 200)})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
          }
          break;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [effect, isActive, quality]);

  const activatePortal = () => {
    setIsActive(!isActive);
    if (!isActive) {
      const randomMessage = mysteryMessages[Math.floor(Math.random() * mysteryMessages.length)];
      setMysteryText(randomMessage);
      
      // Play a mysterious sound
      if (typeof window !== 'undefined') {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 1);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 1);
      }
    }
  };

  const effects: { type: PortalEffect; name: string; emoji: string; color: string }[] = [
    { type: 'dimension', name: 'Dimension Portal', emoji: '🌀', color: 'from-purple-600 to-pink-600' },
    { type: 'wormhole', name: 'Wormhole', emoji: '🕳️', color: 'from-blue-600 to-purple-700' },
    { type: 'galaxy', name: 'Galaxy Spin', emoji: '🌌', color: 'from-indigo-600 to-purple-900' },
    { type: 'color-shift', name: 'Rainbow Wave', emoji: '🌈', color: 'from-red-500 to-yellow-500' },
    { type: 'matrix', name: 'Digital Matrix', emoji: '💻', color: 'from-green-600 to-green-800' },
    { type: 'glitch', name: 'Reality Glitch', emoji: '⚡', color: 'from-red-600 to-orange-600' },
    { type: 'sparkle', name: 'Cosmic Sparkles', emoji: '✨', color: 'from-yellow-400 to-white' }
  ];

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 drop-shadow-lg animate-pulse">
            🚪 ??? MYSTERY PORTAL ???
          </h1>
          <Link href="/kid/fun-lab">
            <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-bold border-2 border-white/50 hover:bg-white/30 transition-all">
              ← Escape
            </button>
          </Link>
        </div>

        {/* Portal Canvas */}
        <div className="relative bg-black rounded-2xl p-4 shadow-2xl border-4 border-purple-500/50 mb-6">
          <canvas
            ref={canvasRef}
            width={1000}
            height={600}
            className="w-full rounded-xl"
          />
          
          {/* Mystery Text Overlay */}
          {isActive && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <h2 className="text-6xl font-black text-white drop-shadow-[0_0_30px_rgba(255,255,255,1)] animate-pulse">
                {mysteryText}
              </h2>
            </div>
          )}
        </div>

        {/* Activation Button */}
        <div className="mb-6">
          <button
            onClick={activatePortal}
            className={`w-full py-8 rounded-2xl font-black text-3xl border-4 transition-all ${
              isActive
                ? 'bg-gradient-to-r from-red-600 via-purple-600 to-pink-600 text-white border-white animate-pulse scale-105'
                : 'bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white border-purple-400 hover:scale-105'
            }`}
          >
            {isActive ? '🛑 CLOSE PORTAL' : '🚪 OPEN PORTAL'}
          </button>
        </div>

        {/* Quality Settings */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 mb-6 border-2 border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4">⚡ Performance:</h2>
          <div className="grid grid-cols-3 gap-3">
            {(['low', 'medium', 'high'] as const).map(q => (
              <button
                key={q}
                onClick={() => setQuality(q)}
                className={`py-3 rounded-xl font-bold border-2 transition-all ${
                  quality === q
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white border-white scale-105'
                    : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
                }`}
              >
                {q === 'low' && '⚡ Fast'}
                {q === 'medium' && '⚖️ Balanced'}
                {q === 'high' && '🌟 Beautiful'}
              </button>
            ))}
          </div>
          <p className="text-white/70 text-sm mt-3 text-center">
            {quality === 'low' && 'Fewer particles for smooth performance'}
            {quality === 'medium' && 'Good balance of speed and visuals'}
            {quality === 'high' && 'Maximum particles - might lag on slower devices'}
          </p>
        </div>

        {/* Effect Selection */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4">🌌 Reality Effects:</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {effects.map(eff => (
              <button
                key={eff.type}
                onClick={() => setEffect(eff.type)}
                className={`py-4 rounded-xl font-bold border-2 transition-all ${
                  effect === eff.type
                    ? `bg-gradient-to-r ${eff.color} text-white border-white scale-105`
                    : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
                }`}
              >
                <div className="text-2xl mb-1">{eff.emoji}</div>
                <div className="text-sm">{eff.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Mystery Instructions */}
        <div className="mt-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-xl rounded-2xl p-6 border-2 border-purple-400/30">
          <h2 className="text-2xl font-bold text-white mb-3">⚠️ WARNING ⚠️</h2>
          <div className="text-white space-y-2 text-lg">
            <p>🌀 You have entered the <strong>MYSTERY PORTAL</strong>...</p>
            <p>👁️ Nobody knows what this place truly is...</p>
            <p>🚪 Click <strong>OPEN PORTAL</strong> to activate reality-bending effects!</p>
            <p>🌌 Choose different effects to explore alternate dimensions!</p>
            <p>✨ Each effect reveals a different aspect of the multiverse...</p>
            <p className="text-purple-300 font-bold mt-4">
              ⚡ This was the most expensive unlock for a reason... ⚡
            </p>
          </div>
        </div>

        {/* Secret Message */}
        <div className="mt-6 text-center">
          <p className="text-white/50 text-sm animate-pulse">
            &quot;Those who seek the unknown shall find the impossible...&quot; - Unknown, 2026
          </p>
        </div>
      </div>
    </div>
  );
}
