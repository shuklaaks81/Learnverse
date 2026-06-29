'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface Ball {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

export default function PhysicsStressTest() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [balls, setBalls] = useState<Ball[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [fps, setFps] = useState(60);
  const [ballCount, setBallCount] = useState(0);
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);

  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#8800ff'];
  const gravity = 0.5;
  const bounce = 0.85;

  const createBall = (count: number = 1): Ball[] => {
    const newBalls: Ball[] = [];
    for (let i = 0; i < count; i++) {
      newBalls.push({
        id: Date.now() + i,
        x: Math.random() * (window.innerWidth - 100) + 50,
        y: Math.random() * 200 + 50,
        vx: (Math.random() - 0.5) * 10,
        vy: Math.random() * 5,
        radius: Math.random() * 15 + 10,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    return newBalls;
  };

  const updateBalls = (canvas: HTMLCanvasElement) => {
    setBalls(prevBalls => {
      return prevBalls.map(ball => {
        let newBall = { ...ball };

        // Apply gravity
        newBall.vy += gravity;

        // Update position
        newBall.x += newBall.vx;
        newBall.y += newBall.vy;

        // Bounce off walls
        if (newBall.x - newBall.radius < 0) {
          newBall.x = newBall.radius;
          newBall.vx *= -bounce;
        }
        if (newBall.x + newBall.radius > canvas.width) {
          newBall.x = canvas.width - newBall.radius;
          newBall.vx *= -bounce;
        }

        // Bounce off floor
        if (newBall.y + newBall.radius > canvas.height) {
          newBall.y = canvas.height - newBall.radius;
          newBall.vy *= -bounce;
          newBall.vx *= 0.95; // Friction
        }

        // Bounce off ceiling
        if (newBall.y - newBall.radius < 0) {
          newBall.y = newBall.radius;
          newBall.vy *= -bounce;
        }

        return newBall;
      });
    });
  };

  const drawBalls = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw balls
    balls.forEach(ball => {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = ball.color;
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Add glow effect
      ctx.shadowBlur = 20;
      ctx.shadowColor = ball.color;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Draw FPS and ball count
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px monospace';
    ctx.fillText(`FPS: ${fps.toFixed(0)}`, 20, 40);
    ctx.fillText(`BALLS: ${balls.length}`, 20, 70);
    
    // Performance warning
    if (fps < 30) {
      ctx.fillStyle = '#ff0000';
      ctx.font = 'bold 32px monospace';
      ctx.fillText('⚠️ LAGGING!', canvas.width / 2 - 100, 50);
    }
    if (fps < 10) {
      ctx.fillStyle = '#ff0000';
      ctx.font = 'bold 48px monospace';
      ctx.fillText('💥 BROWSER DYING!', canvas.width / 2 - 200, canvas.height / 2);
    }
  };

  const animate = (currentTime: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Calculate FPS
    frameCountRef.current++;
    if (currentTime - lastTimeRef.current >= 1000) {
      setFps(frameCountRef.current);
      frameCountRef.current = 0;
      lastTimeRef.current = currentTime;
    }

    updateBalls(canvas);
    drawBalls();

    if (isRunning) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth - 40;
    canvas.height = window.innerHeight - 250;

    const handleResize = () => {
      canvas.width = window.innerWidth - 40;
      canvas.height = window.innerHeight - 250;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isRunning) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, balls]);

  const addBalls = (count: number) => {
    const newBalls = createBall(count);
    setBalls(prev => [...prev, ...newBalls]);
    setBallCount(prev => prev + count);
    if (!isRunning) setIsRunning(true);
  };

  const clearAll = () => {
    setBalls([]);
    setBallCount(0);
    setIsRunning(false);
  };

  const getPerformanceColor = () => {
    if (fps > 50) return 'from-green-500 to-green-600';
    if (fps > 30) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-2xl p-6 mb-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                🎱 Physics Ball Stress Test
              </h1>
              <p className="text-white/90">Let&apos;s see when your browser EXPLODES! 💥</p>
            </div>
            <button
              onClick={() => router.push('/kid')}
              className="px-6 py-3 bg-white/20 backdrop-blur text-white rounded-xl font-bold hover:bg-white/30 transition"
            >
              ← Escape!
            </button>
          </div>
        </div>

        {/* Stats Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* FPS */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-center shadow-lg">
            <div className="text-6xl font-bold text-white mb-2">{fps.toFixed(0)}</div>
            <div className="text-white/80 font-semibold">FPS</div>
            <div className={`mt-2 px-4 py-2 bg-gradient-to-r ${getPerformanceColor()} rounded-lg text-white font-bold text-sm`}>
              {fps > 50 ? '✅ SMOOTH' : fps > 30 ? '⚠️ LAGGY' : '💀 DYING'}
            </div>
          </div>

          {/* Ball Count */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-center shadow-lg">
            <div className="text-6xl font-bold text-white mb-2">{balls.length}</div>
            <div className="text-white/80 font-semibold">BALLS</div>
            <div className="mt-2 text-white/70 text-sm">
              {balls.length < 100 && '🟢 Easy mode'}
              {balls.length >= 100 && balls.length < 500 && '🟡 Getting spicy'}
              {balls.length >= 500 && balls.length < 1000 && '🟠 Browser sweating'}
              {balls.length >= 1000 && '🔴 EXTREME DANGER'}
            </div>
          </div>

          {/* Status */}
          <div className="bg-gradient-to-br from-pink-600 to-pink-700 rounded-xl p-6 text-center shadow-lg">
            <div className="text-6xl mb-2">{isRunning ? '🏃' : '⏸️'}</div>
            <div className="text-white/80 font-semibold mb-2">STATUS</div>
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="px-6 py-2 bg-white/20 backdrop-blur text-white rounded-lg font-bold hover:bg-white/30 transition"
            >
              {isRunning ? 'Pause' : 'Start'}
            </button>
          </div>
        </div>

        {/* Control Panel */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-6 mb-4">
          <h2 className="text-2xl font-bold text-white mb-4">🎮 Spawn Balls</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => addBalls(1)}
              className="px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:scale-105 transform transition shadow-lg"
            >
              +1 Ball 🎱
            </button>
            <button
              onClick={() => addBalls(10)}
              className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold hover:scale-105 transform transition shadow-lg"
            >
              +10 Balls 🎳
            </button>
            <button
              onClick={() => addBalls(100)}
              className="px-6 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-bold hover:scale-105 transform transition shadow-lg"
            >
              +100 Balls ⚠️
            </button>
            <button
              onClick={() => addBalls(1000)}
              className="px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold hover:scale-105 transform transition shadow-lg animate-pulse"
            >
              +1000 Balls 💀
            </button>
          </div>
          <button
            onClick={clearAll}
            className="w-full mt-4 px-6 py-4 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl font-bold hover:scale-105 transform transition shadow-lg"
          >
            🗑️ Clear All
          </button>
        </div>

        {/* Canvas */}
        <div className="bg-black rounded-2xl shadow-2xl overflow-hidden border-4 border-purple-500">
          <canvas
            ref={canvasRef}
            className="w-full cursor-pointer"
            onClick={(e) => {
              const rect = canvasRef.current?.getBoundingClientRect();
              if (rect) {
                const clickBall = createBall(1);
                clickBall[0].x = e.clientX - rect.left;
                clickBall[0].y = e.clientY - rect.top;
                setBalls(prev => [...prev, ...clickBall]);
                if (!isRunning) setIsRunning(true);
              }
            }}
          />
        </div>

        {/* Info */}
        <div className="mt-4 bg-yellow-500/20 backdrop-blur border-2 border-yellow-500 rounded-xl p-4">
          <p className="text-yellow-100 font-semibold text-center">
            💡 <strong>TIP:</strong> Click anywhere on the canvas to spawn balls! Watch the FPS drop as you add more! 
            {balls.length > 500 && ' 🔥 YOUR BROWSER IS ON FIRE!'}
            {balls.length > 1000 && ' 💀 RIP YOUR RAM!'}
          </p>
        </div>

        {/* Warning */}
        {fps < 20 && (
          <div className="mt-4 bg-red-500/30 backdrop-blur border-4 border-red-500 rounded-xl p-6 animate-pulse">
            <p className="text-white font-bold text-2xl text-center">
              ⚠️ WARNING: BROWSER PERFORMANCE CRITICAL! ⚠️
            </p>
            <p className="text-white text-center mt-2">
              Clear some balls before your browser crashes! 💥
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
