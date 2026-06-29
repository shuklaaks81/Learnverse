"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { performanceMonitor, type PerformanceStats } from '@/utils/performanceMonitor';

export default function UltimateLagger() {
  const [intensity, setIntensity] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [fps, setFps] = useState(60);
  const [performanceMode, setPerformanceMode] = useState('normal');
  const [antiLagStats, setAntiLagStats] = useState({
    intervalsKilled: 0,
    mutationsBlocked: 0,
    emergencyActivations: 0,
    replenishAttempts: 0,
  });
  const [stats, setStats] = useState({
    particles: 0,
    boxes: 0,
    calculations: 0,
    memoryMB: 0,
    domNodes: 0,
  });

  const [particles, setParticles] = useState<any[]>([]);
  const [boxes, setBoxes] = useState<any[]>([]);
  const [recursiveElements, setRecursiveElements] = useState<any[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalsRef = useRef<NodeJS.Timeout[]>([]);
  const animationFramesRef = useRef<number[]>([]);
  const [fightBackMode, setFightBackMode] = useState(false);

  // Performance monitoring - DETECT ANTI-LAG ATTACKS!
  useEffect(() => {
    const handleUpdate = (perfStats: PerformanceStats) => {
      setFps(Math.round(perfStats.currentFPS));
      setPerformanceMode(perfStats.mode);
      setAntiLagStats({
        intervalsKilled: perfStats.intervalsKilled,
        mutationsBlocked: perfStats.mutationsBlocked,
        emergencyActivations: perfStats.emergencyActivations,
        replenishAttempts: perfStats.replenishAttempts,
      });
      
      // FIGHT BACK! If anti-lag is active, go into FIGHT BACK MODE!
      if (perfStats.mode === 'emergency' || perfStats.mode === 'nuclear' || perfStats.mode === 'replenish') {
        setFightBackMode(true);
        console.warn('🔥 LAGGER DETECTED ANTI-LAG! FIGHT BACK MODE ACTIVATED!');
      }
    };
    
    const unsubscribe = performanceMonitor.subscribe(handleUpdate);
    return unsubscribe;
  }, []);

  // Update stats
  useEffect(() => {
    const updateStats = () => {
      setStats({
        particles: particles.length,
        boxes: boxes.length,
        calculations: Math.floor(Date.now() / 1000) % 999999,
        memoryMB: (performance as any).memory?.usedJSHeapSize 
          ? Math.round((performance as any).memory.usedJSHeapSize / 1048576) 
          : 0,
        domNodes: document.querySelectorAll('*').length,
      });
    };

    const interval = setInterval(updateStats, 500);
    return () => clearInterval(interval);
  }, [particles.length, boxes.length]);

  // 1. PARTICLE EXPLOSION - UNSTOPPABLE with requestAnimationFrame!
  useEffect(() => {
    if (!isRunning) return;

    let lastSpawn = 0;
    const spawnRate = fightBackMode ? 30 : 50; // FASTER in fight back mode!
    
    const particleLoop = (timestamp: number) => {
      if (timestamp - lastSpawn >= spawnRate) {
        const count = intensity * (fightBackMode ? 30 : 20); // MORE particles when fighting back!
        const emojis = ['🔥', '💥', '⚡', '✨', '💫', '🌟', '⭐', '🎆', '💀', '☠️', '👻', '🌪️', '💣', '🧨', '⚔️'];
        const newParticles = Array.from({ length: count }, (_, i) => ({
          id: Date.now() + i + Math.random(),
          x: Math.random() * 100,
          y: Math.random() * 100,
          emoji: emojis[Math.floor(Math.random() * emojis.length)],
          rotation: Math.random() * 360,
          scale: 0.5 + Math.random() * 1.5,
          speed: 1 + Math.random() * 3,
        }));
        
        setParticles(prev => [...prev, ...newParticles].slice(-intensity * 400));
        lastSpawn = timestamp;
      }
      
      const frameId = requestAnimationFrame(particleLoop);
      animationFramesRef.current.push(frameId);
    };
    
    const frameId = requestAnimationFrame(particleLoop);
    animationFramesRef.current.push(frameId);
    
    // BACKUP INTERVAL (in case RAF fails)
    const backupInterval = setInterval(() => {
      const count = intensity * 15;
      const emojis = ['🔥', '💥', '⚡', '✨', '💫', '🌟', '⭐', '🎆', '💀', '☠️', '👻', '🌪️'];
      const newParticles = Array.from({ length: count }, (_, i) => ({
        id: Date.now() + i + Math.random(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 1.5,
        speed: 1 + Math.random() * 3,
      }));
      setParticles(prev => [...prev, ...newParticles].slice(-intensity * 400));
    }, 100);
    
    intervalsRef.current.push(backupInterval);
    
    return () => {
      clearInterval(backupInterval);
      animationFramesRef.current.forEach(id => cancelAnimationFrame(id));
      animationFramesRef.current = [];
    };
  }, [isRunning, intensity, fightBackMode]);

  // 2. DOM EXPLOSION - Nested divs with heavy styles
  useEffect(() => {
    if (!isRunning) return;

    const boxInterval = setInterval(() => {
      const count = intensity * 10;
      const newBoxes = Array.from({ length: count }, (_, i) => ({
        id: Date.now() + i + Math.random(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        rotation: Math.random() * 360,
        hue: Math.random() * 360,
        size: 20 + Math.random() * 100,
      }));
      
      setBoxes(prev => [...prev, ...newBoxes].slice(-intensity * 150));
    }, 100);

    intervalsRef.current.push(boxInterval);
    return () => clearInterval(boxInterval);
  }, [isRunning, intensity]);

  // 3. RECURSIVE DOM CREATION - Memory killer
  useEffect(() => {
    if (!isRunning) return;

    const recursiveInterval = setInterval(() => {
      const depth = Math.min(intensity * 2, 20);
      const createNested = (level: number): any => {
        if (level >= depth) return null;
        return {
          id: Date.now() + Math.random(),
          children: Array.from({ length: 2 }, () => createNested(level + 1)).filter(Boolean),
        };
      };
      
      setRecursiveElements([createNested(0)]);
    }, 300);

    intervalsRef.current.push(recursiveInterval);
    return () => clearInterval(recursiveInterval);
  }, [isRunning, intensity]);

  // 4. HEAVY CALCULATIONS - CPU killer
  useEffect(() => {
    if (!isRunning) return;

    const calcInterval = setInterval(() => {
      // Pointless heavy calculations
      let result = 0;
      const iterations = intensity * 100000;
      for (let i = 0; i < iterations; i++) {
        result += Math.sqrt(i) * Math.sin(i) * Math.cos(i) * Math.tan(i / 100);
        if (i % 1000 === 0) {
          result = Math.floor(result); // Prevent overflow
        }
      }
    }, 50);

    intervalsRef.current.push(calcInterval);
    return () => clearInterval(calcInterval);
  }, [isRunning, intensity]);

  // 5. CANVAS CHAOS - Thousands of shapes
  useEffect(() => {
    if (!isRunning || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationId: number;
    const draw = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const count = intensity * 50;
      for (let i = 0; i < count; i++) {
        ctx.beginPath();
        ctx.arc(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          Math.random() * 50,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = `hsl(${Math.random() * 360}, 100%, 50%)`;
        ctx.fill();
        ctx.strokeStyle = `hsl(${Math.random() * 360}, 100%, 70%)`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, [isRunning, intensity]);

  // 6. MEMORY LEAK GENERATOR (intentional for testing)
  useEffect(() => {
    if (!isRunning) return;

    const arrays: any[] = [];
    const leakInterval = setInterval(() => {
      // Create large arrays that aren't cleaned up properly
      const bigArray = new Array(intensity * 10000).fill(Math.random());
      arrays.push(bigArray);
      
      // Keep only recent ones to prevent total crash
      if (arrays.length > 20) {
        arrays.shift();
      }
    }, 200);

    intervalsRef.current.push(leakInterval);
    return () => {
      clearInterval(leakInterval);
      arrays.length = 0;
    };
  }, [isRunning, intensity]);

  const startUltimateLagger = () => {
    setIsRunning(true);
    performanceMonitor.setEnabled(true);
    if (canvasRef.current) {
      canvasRef.current.style.display = 'block';
    }
  };

  const stopUltimateLagger = () => {
    setIsRunning(false);
    setFightBackMode(false);
    setParticles([]);
    setBoxes([]);
    setRecursiveElements([]);
    
    // Clear all intervals
    intervalsRef.current.forEach(interval => clearInterval(interval));
    intervalsRef.current = [];
    
    // Clear all animation frames
    animationFramesRef.current.forEach(id => cancelAnimationFrame(id));
    animationFramesRef.current = [];
    
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      canvasRef.current.style.display = 'none';
    }
  };

  // Render recursive elements
  const renderRecursive = (element: any, depth = 0): any => {
    if (!element || depth > 15) return null;
    return (
      <div
        key={element.id}
        className="border-2 border-red-500 p-1 m-1 animate-pulse bg-gradient-to-r from-red-500 to-blue-500 rounded shadow-2xl"
        style={{
          transform: `rotate(${depth * 10}deg) scale(${1 - depth * 0.05})`,
          filter: `blur(${depth * 0.5}px) hue-rotate(${depth * 36}deg)`,
        }}
      >
        {element.children?.map((child: any) => renderRecursive(child, depth + 1))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Canvas layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ display: 'none' }}
      />

      {/* Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute text-6xl pointer-events-none animate-spin"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            transform: `rotate(${particle.rotation}deg) scale(${particle.scale})`,
            animation: `spin ${1 / particle.speed}s linear infinite, float ${2 / particle.speed}s ease-in-out infinite`,
            filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.8))',
          }}
        >
          {particle.emoji}
        </div>
      ))}

      {/* Boxes */}
      {boxes.map(box => (
        <div
          key={box.id}
          className="absolute animate-bounce backdrop-blur-xl"
          style={{
            left: `${box.x}%`,
            top: `${box.y}%`,
            width: `${box.size}px`,
            height: `${box.size}px`,
            transform: `rotate(${box.rotation}deg)`,
            background: `linear-gradient(${box.hue}deg, hsl(${box.hue}, 100%, 50%), hsl(${(box.hue + 120) % 360}, 100%, 50%))`,
            boxShadow: `0 0 50px hsl(${box.hue}, 100%, 50%), 0 0 100px hsl(${(box.hue + 60) % 360}, 100%, 50%)`,
            filter: `blur(2px) saturate(2)`,
            borderRadius: `${Math.random() * 50}%`,
          }}
        />
      ))}

      {/* Recursive DOM nightmare */}
      <div className="absolute top-0 left-0 opacity-50 pointer-events-none">
        {recursiveElements.map(el => renderRecursive(el))}
      </div>

      {/* Control Panel */}
      <div className="relative z-[999] max-w-5xl mx-auto p-4">
        <div className="bg-black/95 backdrop-blur-2xl rounded-3xl p-8 border-4 border-red-600 shadow-2xl mb-6 animate-pulse">
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 via-yellow-500 to-red-500 mb-2 text-center animate-gradient-shift">
            💀 ULTIMATE LAGGER 💀
          </h1>
          <p className="text-red-400 text-center text-2xl font-bold mb-4 animate-pulse">
            ⚠️ EXTREME PERFORMANCE TEST ⚠️
          </p>
          {fightBackMode && (
            <div className="bg-red-900 border-4 border-yellow-400 p-3 rounded-xl mb-4 animate-pulse">
              <p className="text-yellow-400 text-center text-xl font-black">
                🔥 FIGHT BACK MODE ACTIVE! 🔥
              </p>
              <p className="text-white text-center text-sm">
                Anti-lag detected! Spawning FASTER and HARDER!
              </p>
            </div>
          )}
          <p className="text-white text-center text-sm mb-6">
            This generates EVERYTHING: Particles, DOM nodes, calculations, canvas, memory leaks!
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            <div className={`p-4 rounded-xl border-4 text-center ${
              fps >= 55 ? 'bg-green-900 border-green-400' : 
              fps >= 30 ? 'bg-orange-900 border-orange-400' : 
              'bg-red-900 border-red-400 animate-pulse'
            }`}>
              <div className="text-4xl font-black text-white">{fps}</div>
              <div className="text-xs text-white font-bold">FPS</div>
            </div>

            <div className={`p-4 rounded-xl border-4 text-center ${
              performanceMode === 'normal' ? 'bg-blue-900 border-blue-400' :
              performanceMode === 'simplified' ? 'bg-orange-900 border-orange-400 animate-pulse' :
              'bg-red-900 border-red-400 animate-pulse'
            }`}>
              <div className="text-lg font-black text-white uppercase">{performanceMode}</div>
              <div className="text-xs text-white font-bold">MODE</div>
            </div>

            <div className="p-4 rounded-xl border-4 bg-purple-900 border-purple-400 text-center">
              <div className="text-3xl font-black text-white">{stats.particles}</div>
              <div className="text-xs text-white font-bold">PARTICLES</div>
            </div>

            <div className="p-4 rounded-xl border-4 bg-pink-900 border-pink-400 text-center">
              <div className="text-3xl font-black text-white">{stats.boxes}</div>
              <div className="text-xs text-white font-bold">BOXES</div>
            </div>

            <div className="p-4 rounded-xl border-4 bg-indigo-900 border-indigo-400 text-center">
              <div className="text-3xl font-black text-white">{stats.domNodes}</div>
              <div className="text-xs text-white font-bold">DOM NODES</div>
            </div>

            <div className="p-4 rounded-xl border-4 bg-cyan-900 border-cyan-400 text-center">
              <div className="text-3xl font-black text-white">{stats.memoryMB}</div>
              <div className="text-xs text-white font-bold">MEMORY MB</div>
            </div>
          </div>

          {/* Anti-Lag Stats */}
          {(antiLagStats.intervalsKilled > 0 || antiLagStats.mutationsBlocked > 0 || antiLagStats.emergencyActivations > 0 || antiLagStats.replenishAttempts > 0) && (
            <div className="mb-6 bg-gradient-to-r from-purple-900 to-red-900 p-4 rounded-xl border-4 border-yellow-400">
              <h3 className="text-yellow-400 font-black text-xl mb-3 text-center animate-pulse">⚡ ANTI-LAG ACTIVE ⚡</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="bg-black/50 p-3 rounded-lg border-2 border-red-400 text-center">
                  <div className="text-2xl font-black text-red-400">{antiLagStats.emergencyActivations}</div>
                  <div className="text-xs text-white font-bold">EMERGENCY MODE</div>
                </div>
                <div className="bg-black/50 p-3 rounded-lg border-2 border-orange-400 text-center">
                  <div className="text-2xl font-black text-orange-400">{antiLagStats.intervalsKilled}</div>
                  <div className="text-xs text-white font-bold">INTERVALS KILLED</div>
                </div>
                <div className="bg-black/50 p-3 rounded-lg border-2 border-yellow-400 text-center">
                  <div className="text-2xl font-black text-yellow-400">{antiLagStats.mutationsBlocked}</div>
                  <div className="text-xs text-white font-bold">ELEMENTS BLOCKED</div>
                </div>
                <div className="bg-black/50 p-3 rounded-lg border-2 border-cyan-400 text-center">
                  <div className="text-2xl font-black text-cyan-400">{antiLagStats.replenishAttempts}</div>
                  <div className="text-xs text-white font-bold">🔄 REPLENISH</div>
                </div>
              </div>
              <div className="text-green-400 text-center text-sm font-bold mt-3">
                🛡️ The anti-lag system is STOPPING the lag source!
                {antiLagStats.replenishAttempts > 0 && (
                  <div className="text-cyan-400 mt-1">🔄 App Replenisher activated {antiLagStats.replenishAttempts}x - Hunting & Rebuilding!</div>
                )}
              </div>
            </div>
          )}

          {/* Intensity Control */}
          <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 rounded-2xl mb-6 border-4 border-yellow-400">
            <div className="text-white font-black text-center text-3xl mb-4">
              INTENSITY: {intensity} / 10
            </div>
            <div className="flex items-center gap-4 mb-3">
              <button
                onClick={() => setIntensity(Math.max(1, intensity - 1))}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl text-2xl"
              >
                -
              </button>
              <div className="flex-1 bg-black rounded-full h-10 overflow-hidden border-4 border-white">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 via-yellow-400 via-orange-500 to-red-600 transition-all"
                  style={{ width: `${intensity * 10}%` }}
                />
              </div>
              <button
                onClick={() => setIntensity(Math.min(10, intensity + 1))}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl text-2xl"
              >
                +
              </button>
            </div>
            <div className="text-yellow-300 text-center text-sm font-bold">
              {intensity <= 3 && "⚠️ Mild chaos"}
              {intensity > 3 && intensity <= 6 && "🔥 Heavy lag incoming!"}
              {intensity > 6 && intensity <= 8 && "💀 Browser will struggle!"}
              {intensity > 8 && "☠️ NUCLEAR OPTION! YOUR COMPUTER WILL CRY!"}
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-4">
            {!isRunning ? (
              <button
                onClick={startUltimateLagger}
                className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-black py-5 px-8 rounded-2xl text-2xl transition-all hover:scale-105 shadow-2xl border-4 border-yellow-400"
              >
                💀 UNLEASH CHAOS 💀
              </button>
            ) : (
              <button
                onClick={stopUltimateLagger}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-black py-5 px-8 rounded-2xl text-2xl transition-all hover:scale-105 shadow-2xl border-4 border-green-400 animate-pulse"
              >
                🛑 STOP THE MADNESS 🛑
              </button>
            )}
          </div>
        </div>

        {/* Warning */}
        <div className="bg-red-900 border-4 border-red-500 rounded-2xl p-6 mb-6 animate-pulse">
          <h2 className="text-3xl font-black text-yellow-300 mb-3 text-center">
            ⚠️ EXTREME WARNING ⚠️
          </h2>
          <ul className="text-white space-y-2 text-sm">
            <li>• <strong>6 Attack Vectors:</strong> Particles, DOM boxes, recursive nodes, CPU calculations, canvas drawing, memory leaks</li>
            <li>• <strong>Intensity 10:</strong> Can spawn 3000+ elements and do millions of calculations per second</li>
            <li>• <strong>Your Browser WILL Lag</strong> - That&apos;s the point! Watch the anti-lag system fight back!</li>
            <li>• <strong>If Frozen:</strong> Close the tab or press STOP (if you can click it 😅)</li>
            <li>• <strong>Perfect Test:</strong> Enable anti-lag in settings first, then see it adapt!</li>
          </ul>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 justify-center">
          <Link
            href="/lag-machine"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-8 rounded-xl hover:scale-105 transition-all"
          >
            🔙 Normal Lag Machine
          </Link>
          <Link
            href="/parent/settings"
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-8 rounded-xl hover:scale-105 transition-all"
          >
            ⚙️ Settings
          </Link>
          <Link
            href="/"
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-xl hover:scale-105 transition-all"
          >
            🏠 Home
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-30px); }
        }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
