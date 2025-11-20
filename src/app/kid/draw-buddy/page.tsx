"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DrawBuddy() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

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
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
          🎨 Draw Your Learning Buddy! ✨
        </h1>
        <p className="text-center text-gray-700 mb-8 font-bold text-xl sm:text-2xl">
          Get creative! Draw your perfect learning buddy! 🖌️
        </p>

        <div className="flex justify-center mb-6">
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
