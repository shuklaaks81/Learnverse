'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function BuildYourApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [isProcessing, setIsProcessing] = useState(false);
  const [appCreated, setAppCreated] = useState(false);

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', 
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500',
    '#800080', '#FFC0CB', '#A52A2A', '#808080'
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
    setAppCreated(false);
  };

  const buildApp = () => {
    setIsProcessing(true);
    // Simulate app building process
    setTimeout(() => {
      setIsProcessing(false);
      setAppCreated(true);
    }, 3000);
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-8 animate-bounce">🏗️</div>
          <h1 className="text-5xl font-bold text-white mb-4">Building Your App...</h1>
          <p className="text-2xl text-white/90 mb-8">Adding custom logic based on your drawing!</p>
          <div className="flex justify-center gap-2">
            <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
            <div className="w-4 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-4 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (appCreated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-9xl mb-8 animate-bounce">🎉</div>
          <h1 className="text-6xl font-bold text-white mb-4">App Created!</h1>
          <p className="text-2xl text-white/90 mb-8">Your custom app is ready!</p>
          
          <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 mb-8 border-4 border-white/50">
            <canvas
              ref={canvasRef}
              width={600}
              height={400}
              className="border-4 border-white rounded-2xl mb-4 cursor-crosshair touch-none max-w-full"
            />
            <p className="text-white font-bold text-xl">Your App Design ✨</p>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={clearCanvas}
              className="bg-white text-purple-600 px-8 py-4 rounded-2xl font-bold text-xl hover:scale-110 transition-transform"
            >
              🎨 Create Another App
            </button>
            <Link
              href="/kid"
              className="bg-yellow-400 text-purple-900 px-8 py-4 rounded-2xl font-bold text-xl hover:scale-110 transition-transform"
            >
              🏠 Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white mb-4">🏗️ Build Your App!</h1>
          <p className="text-2xl text-white/90">Draw your app design and watch it come to life!</p>
        </div>

        {/* Drawing Board */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl border-8 border-white/50">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">🎨 Drawing Pad</h2>
            <p className="text-gray-600 mb-4">Choose a color, then drag your finger or mouse to design your app!</p>
            
            {/* Color Picker */}
            <div className="flex gap-3 mb-4 flex-wrap">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setCurrentColor(color)}
                  className={`w-12 h-12 rounded-full border-4 hover:scale-110 transition-transform ${
                    currentColor === color ? 'border-black scale-110' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Canvas */}
          <canvas
            ref={canvasRef}
            width={800}
            height={500}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="border-4 border-gray-300 rounded-2xl mb-6 cursor-crosshair touch-none w-full"
          />

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={clearCanvas}
              className="bg-red-500 text-white px-8 py-4 rounded-2xl font-bold text-xl hover:bg-red-600 transition-all hover:scale-105"
            >
              🗑️ Clear
            </button>
            <button
              onClick={buildApp}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-12 py-4 rounded-2xl font-bold text-2xl hover:scale-110 transition-transform shadow-lg"
            >
              🚀 Build My App!
            </button>
            <Link
              href="/kid"
              className="bg-gray-500 text-white px-8 py-4 rounded-2xl font-bold text-xl hover:bg-gray-600 transition-all hover:scale-105"
            >
              ← Back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
