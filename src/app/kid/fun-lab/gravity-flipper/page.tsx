"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Ball {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
}

type GravityDirection = 'down' | 'up' | 'left' | 'right' | 'none' | 'center' | 'crazy';

export default function GravityFlipper() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [balls, setBalls] = useState<Ball[]>([]);
  const [gravity, setGravity] = useState<GravityDirection>('down');
  const [ballCount, setBallCount] = useState(0);
  const animationFrameRef = useRef<number | null>(null);
  const [fps, setFps] = useState(60);
  const fpsRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef(Date.now());

  const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3', '#FF1493', '#00FFFF'];

  const addBalls = (count: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const newBalls: Ball[] = [];
    for (let i = 0; i < count; i++) {
      newBalls.push({
        id: Date.now() + i,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 15 + 10
      });
    }
    setBalls(prev => [...prev, ...newBalls]);
    setBallCount(prev => prev + count);
  };

  const clearBalls = () => {
    setBalls([]);
    setBallCount(0);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      // Calculate FPS
      const now = Date.now();
      const delta = now - lastFrameTimeRef.current;
      const currentFps = 1000 / delta;
      fpsRef.current.push(currentFps);
      if (fpsRef.current.length > 30) fpsRef.current.shift();
      const avgFps = fpsRef.current.reduce((a, b) => a + b, 0) / fpsRef.current.length;
      setFps(Math.round(avgFps));
      lastFrameTimeRef.current = now;

      // Clear canvas
      ctx.fillStyle = '#111111';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw balls
      setBalls(prevBalls => {
        return prevBalls.map(ball => {
          let newBall = { ...ball };

          // Apply gravity based on current direction
          switch (gravity) {
            case 'down':
              newBall.vy += 0.5;
              break;
            case 'up':
              newBall.vy -= 0.5;
              break;
            case 'left':
              newBall.vx -= 0.5;
              break;
            case 'right':
              newBall.vx += 0.5;
              break;
            case 'center':
              const centerX = canvas.width / 2;
              const centerY = canvas.height / 2;
              const dx = centerX - newBall.x;
              const dy = centerY - newBall.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              if (distance > 5) {
                newBall.vx += (dx / distance) * 0.3;
                newBall.vy += (dy / distance) * 0.3;
              }
              break;
            case 'crazy':
              newBall.vx += (Math.random() - 0.5) * 2;
              newBall.vy += (Math.random() - 0.5) * 2;
              break;
            case 'none':
              // No gravity
              break;
          }

          // Update position
          newBall.x += newBall.vx;
          newBall.y += newBall.vy;

          // Bounce off walls
          if (newBall.x - newBall.size < 0 || newBall.x + newBall.size > canvas.width) {
            newBall.vx *= -0.8;
            newBall.x = Math.max(newBall.size, Math.min(canvas.width - newBall.size, newBall.x));
          }
          if (newBall.y - newBall.size < 0 || newBall.y + newBall.size > canvas.height) {
            newBall.vy *= -0.8;
            newBall.y = Math.max(newBall.size, Math.min(canvas.height - newBall.size, newBall.y));
          }

          // Velocity damping
          newBall.vx *= 0.99;
          newBall.vy *= 0.99;

          return newBall;
        });
      });

      // Draw balls
      balls.forEach(ball => {
        ctx.fillStyle = ball.color;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
        ctx.fill();

        // Add glow effect
        ctx.shadowBlur = 20;
        ctx.shadowColor = ball.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw performance info
      ctx.fillStyle = fps > 30 ? 'rgba(0, 255, 0, 0.8)' : fps > 15 ? 'rgba(255, 255, 0, 0.8)' : 'rgba(255, 0, 0, 0.8)';
      ctx.font = 'bold 20px Arial';
      ctx.fillText(`FPS: ${fps}`, 20, 40);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillText(`Gravity: ${gravity.toUpperCase()}`, 20, 70);
      ctx.fillText(`Balls: ${ballCount}`, 20, 100);
      
      if (fps < 20) {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.9)';
        ctx.font = 'bold 24px Arial';
        ctx.fillText('⚠️ LAG DETECTED!', canvas.width / 2 - 100, 50);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [balls, gravity, ballCount, fps]);

  const gravityOptions: { direction: GravityDirection; label: string; emoji: string; color: string }[] = [
    { direction: 'down', label: 'Down', emoji: '⬇️', color: 'from-blue-500 to-blue-700' },
    { direction: 'up', label: 'Up', emoji: '⬆️', color: 'from-purple-500 to-purple-700' },
    { direction: 'left', label: 'Left', emoji: '⬅️', color: 'from-green-500 to-green-700' },
    { direction: 'right', label: 'Right', emoji: '➡️', color: 'from-orange-500 to-orange-700' },
    { direction: 'center', label: 'Center Pull', emoji: '🎯', color: 'from-pink-500 to-red-700' },
    { direction: 'none', label: 'Zero G', emoji: '🌌', color: 'from-indigo-500 to-indigo-900' },
    { direction: 'crazy', label: 'CHAOS!', emoji: '🌪️', color: 'from-red-600 to-yellow-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-5xl font-black text-white drop-shadow-lg">
            🌀 Gravity Flipper!
          </h1>
          <Link href="/kid/fun-lab">
            <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-bold border-2 border-white/50 hover:bg-white/30 transition-all">
              ← Back to Lab
            </button>
          </Link>
        </div>

        {/* Canvas */}
        <div className="bg-black rounded-2xl p-4 shadow-2xl border-4 border-purple-500/50 mb-6">
          <canvas
            ref={canvasRef}
            width={1000}
            height={600}
            className="w-full rounded-xl"
          />
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gravity Direction Controls */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/30">
            <h2 className="text-2xl font-bold text-white mb-4">🎮 Change Gravity:</h2>
            <div className="grid grid-cols-2 gap-3">
              {gravityOptions.map(option => (
                <button
                  key={option.direction}
                  onClick={() => setGravity(option.direction)}
                  className={`py-3 rounded-xl font-bold border-2 transition-all ${
                    gravity === option.direction
                      ? `bg-gradient-to-r ${option.color} text-white border-white scale-105`
                      : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
                  }`}
                >
                  {option.emoji} {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Ball Controls */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/30">
            <h2 className="text-2xl font-bold text-white mb-4">⚽ Add Balls:</h2>
            <div className="space-y-3">
              <button
                onClick={() => addBalls(1)}
                className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-3 rounded-xl font-bold border-2 border-white/50 hover:scale-105 transition-all"
              >
                + 1 Ball
              </button>
              <button
                onClick={() => addBalls(10)}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-xl font-bold border-2 border-white/50 hover:scale-105 transition-all"
              >
                + 10 Balls
              </button>
              <button
                onClick={() => addBalls(50)}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white py-3 rounded-xl font-bold border-2 border-white/50 hover:scale-105 transition-all"
                disabled={ballCount > 100}
              >
                + 50 Balls {ballCount > 100 ? '(MAX)' : ''}
              </button>
              <button
                onClick={clearBalls}
                className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white py-3 rounded-xl font-bold border-2 border-white/50 hover:scale-105 transition-all"
              >
                🗑️ Clear All
              </button>
            </div>
            {fps < 20 && (
              <div className="mt-4 bg-red-500/20 border-2 border-red-500 rounded-xl p-3 text-center">
                <p className="text-red-300 font-bold text-sm">⚠️ LOW FPS! Consider clearing some balls!</p>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/30">
          <h2 className="text-2xl font-bold text-white mb-3">✨ How It Works:</h2>
          <ul className="text-white space-y-2 text-lg">
            <li>🌍 <strong>Normal Gravity:</strong> Balls fall down like real life</li>
            <li>🚀 <strong>Up Gravity:</strong> Everything falls UP!</li>
            <li>↔️ <strong>Side Gravity:</strong> Balls fall left or right!</li>
            <li>🎯 <strong>Center Pull:</strong> Everything gets sucked to the middle!</li>
            <li>🌌 <strong>Zero G:</strong> No gravity - balls float in space!</li>
            <li>🌪️ <strong>CHAOS Mode:</strong> Random forces everywhere - total madness!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
