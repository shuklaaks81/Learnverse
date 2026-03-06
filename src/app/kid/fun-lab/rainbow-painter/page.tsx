"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function RainbowPainter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [brushSize, setBrushSize] = useState(20);
  const [explosionMode, setExplosionMode] = useState(false);
  const [rainbowMode, setRainbowMode] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [performanceMode, setPerformanceMode] = useState(false);
  const lastDrawTimeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill with white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getRandomColor = () => {
    const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const draw = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Throttle drawing in performance mode
    const now = Date.now();
    if (performanceMode && now - lastDrawTimeRef.current < 50) return;
    lastDrawTimeRef.current = now;

    if (explosionMode) {
      // Explosion mode - create particle explosion (reduced if performance mode)
      const particleCount = performanceMode ? 20 : 50;
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / 50;
        const distance = Math.random() * brushSize * 3;
        const particleX = x + Math.cos(angle) * distance;
        const particleY = y + Math.sin(angle) * distance;
        
        ctx.fillStyle = rainbowMode ? getRandomColor() : '#000000';
        ctx.beginPath();
        ctx.arc(particleX, particleY, Math.random() * 5 + 2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // Normal painting mode
      ctx.fillStyle = rainbowMode ? getRandomColor() : '#000000';
      ctx.beginPath();
      ctx.arc(x, y, brushSize, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      draw(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      draw(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect && e.touches[0]) {
      draw(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect && e.touches[0]) {
      draw(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-5xl font-black text-white drop-shadow-lg">
            🎨 Rainbow Chaos Painter!
          </h1>
          <Link href="/kid/fun-lab">
            <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-bold border-2 border-white/50 hover:bg-white/30 transition-all">
              ← Back to Lab
            </button>
          </Link>
        </div>

        {/* Controls */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-6 border-2 border-white/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Brush Size */}
            <div>
              <label className="block text-white font-bold mb-2">
                Brush Size: {brushSize}px
              </label>
              <input
                type="range"
                min="5"
                max="100"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Rainbow Mode Toggle */}
            <div>
              <button
                onClick={() => setRainbowMode(!rainbowMode)}
                className={`w-full py-3 rounded-xl font-bold border-2 transition-all ${
                  rainbowMode
                    ? 'bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 text-white border-white'
                    : 'bg-gray-800 text-white border-gray-600'
                }`}
              >
                {rainbowMode ? '🌈 Rainbow ON' : '⚫ Black Mode'}
              </button>
            </div>

            {/* Explosion Mode Toggle */}
            <div>
              <button
                onClick={() => setExplosionMode(!explosionMode)}
                className={`w-full py-3 rounded-xl font-bold border-2 transition-all ${
                  explosionMode
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white border-white animate-pulse'
                    : 'bg-white/20 text-white border-white/50'
                }`}
              >
                {explosionMode ? '💥 EXPLOSION MODE!' : '✨ Normal Mode'}
              </button>
            </div>
          </div>

          {/* Performance Mode Toggle */}
          <div className="mt-4">
            <button
              onClick={() => setPerformanceMode(!performanceMode)}
              className={`w-full py-3 rounded-xl font-bold border-2 transition-all ${
                performanceMode
                  ? 'bg-green-600 text-white border-white'
                  : 'bg-white/20 text-white border-white/50'
              }`}
            >
              {performanceMode ? '⚡ Performance Mode ON' : '🎨 Full Quality'}
            </button>
            {performanceMode && (
              <p className="text-white/70 text-sm mt-2 text-center">
                Fewer particles for smoother performance!
              </p>
            )}
          </div>

          {/* Clear Button */}
          <button
            onClick={clearCanvas}
            className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold border-2 border-white/50 transition-all"
          >
            🗑️ Clear Canvas
          </button>
        </div>

        {/* Canvas */}
        <div className="bg-white rounded-2xl p-4 shadow-2xl border-4 border-white/50">
          <canvas
            ref={canvasRef}
            width={1000}
            height={600}
            className="w-full border-2 border-gray-300 rounded-xl cursor-crosshair"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/30">
          <h2 className="text-2xl font-bold text-white mb-3">✨ How to Use:</h2>
          <ul className="text-white space-y-2 text-lg">
            <li>🖱️ <strong>Click or drag</strong> to paint!</li>
            <li>🌈 <strong>Rainbow Mode:</strong> Every click is a different color!</li>
            <li>💥 <strong>Explosion Mode:</strong> Creates particle explosions instead of solid paint!</li>
            <li>📏 <strong>Brush Size:</strong> Make it HUGE for massive effects!</li>
            <li>📱 <strong>Touch Support:</strong> Works on tablets too!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
