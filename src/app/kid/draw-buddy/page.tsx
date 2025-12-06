"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DrawBuddy() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [premium, setPremium] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 600;
    canvas.height = 600;

    // White background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setHasDrawn(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#8B5CF6';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const saveBuddy = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Save the drawing as base64
    const dataURL = canvas.toDataURL('image/png');
    localStorage.setItem('buddyDrawing', dataURL);

    alert('✨ Awesome drawing! Your buddy looks amazing!');
    router.push('/kid/voice-setup');
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 animate-gradient">
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 10s ease infinite;
        }
      `}</style>

      <div className="w-full max-w-4xl bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8 sm:p-12 border-4 border-white/60">
        <div className="flex justify-end mb-2">
          <button
            onClick={() => setPremium((p) => !p)}
            className={`px-4 py-2 rounded-xl font-bold shadow transition-all text-lg ${premium ? 'bg-gradient-to-r from-yellow-400 to-pink-400 text-black' : 'bg-gray-200 text-gray-700'}`}
          >
            {premium ? 'Switch to Original Buddy' : 'Switch to Premium Buddy'}
          </button>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
          🎨 Draw Your Learning Buddy! ✨
        </h1>
        <p className="text-center text-gray-700 mb-8 font-bold text-xl sm:text-2xl">
          Get creative! Draw your perfect learning buddy! 🖌️
        </p>

        <div className="flex flex-col items-center mb-6">
          {/* Drawing Guide SVG */}
          {premium ? (
            <svg width="220" height="220" viewBox="0 0 220 220" className="mb-2">
              {/* Half-oval body */}
              <ellipse cx="110" cy="120" rx="70" ry="90" fill="#fffbe9" stroke="#6d28d9" strokeWidth="8" />
              {/* Thick top line */}
              <path d="M40 120 Q110 30 180 120" stroke="#6d28d9" strokeWidth="12" fill="none" />
              {/* Tentacles (curved, coming to points) */}
              <path d="M60 200 Q70 180 80 200" stroke="#6d28d9" strokeWidth="8" fill="none" />
              <path d="M90 200 Q100 180 110 200" stroke="#6d28d9" strokeWidth="8" fill="none" />
              <path d="M120 200 Q130 180 140 200" stroke="#6d28d9" strokeWidth="8" fill="none" />
              <path d="M150 200 Q160 180 170 200" stroke="#6d28d9" strokeWidth="8" fill="none" />
              {/* Eyes and mouth like stick buddy */}
              <circle cx="90" cy="120" r="10" fill="#222" />
              <circle cx="130" cy="120" r="10" fill="#222" />
              <ellipse cx="110" cy="145" rx="16" ry="8" fill="none" stroke="#222" strokeWidth="5" />
            </svg>
          ) : (
            <svg width="220" height="220" viewBox="0 0 220 220" className="mb-2">
              {/* Better stick buddy: oval head, thick lines, simple body */}
              <ellipse cx="110" cy="80" rx="40" ry="50" fill="#fffbe9" stroke="#6d28d9" strokeWidth="8" />
              {/* Body */}
              <line x1="110" y1="130" x2="110" y2="180" stroke="#6d28d9" strokeWidth="10" />
              {/* Arms */}
              <line x1="110" y1="140" x2="70" y2="170" stroke="#6d28d9" strokeWidth="8" />
              <line x1="110" y1="140" x2="150" y2="170" stroke="#6d28d9" strokeWidth="8" />
              {/* Legs */}
              <line x1="110" y1="180" x2="90" y2="210" stroke="#6d28d9" strokeWidth="8" />
              <line x1="110" y1="180" x2="130" y2="210" stroke="#6d28d9" strokeWidth="8" />
              {/* Eyes and mouth */}
              <circle cx="95" cy="80" r="7" fill="#222" />
              <circle cx="125" cy="80" r="7" fill="#222" />
              <ellipse cx="110" cy="100" rx="12" ry="6" fill="none" stroke="#222" strokeWidth="4" />
            </svg>
          )}
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="border-8 border-purple-400 rounded-2xl shadow-xl cursor-crosshair bg-white touch-none"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={clearCanvas}
            className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 px-8 rounded-2xl hover:shadow-xl transition-all font-bold text-xl hover:scale-105"
          >
            🗑️ Clear & Start Over
          </button>

          <button
            onClick={saveBuddy}
            disabled={!hasDrawn}
            className={`bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 rounded-2xl hover:shadow-xl transition-all font-bold text-xl hover:scale-105 ${
              !hasDrawn ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            ✅ This Looks Great!
          </button>
        </div>

        <p className="text-center text-gray-600 mt-8 font-semibold text-lg">
          💡 Tip: Draw a simple face or character - we&apos;ll smooth it out for you! 🎨
        </p>
      </div>
    </div>
  );
}
