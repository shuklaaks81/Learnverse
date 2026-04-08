"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

type DrawingElement = 
  | 'button' 
  | 'coin' 
  | 'background' 
  | 'card' 
  | 'header'
  | 'achievement'
  | 'streak'
  | 'menu';

const DRAWING_PROMPTS = [
  { id: 'button' as DrawingElement, prompt: '🔘 Draw a BUTTON!', hint: 'Make it clickable-looking!' },
  { id: 'coin' as DrawingElement, prompt: '🪙 Draw a COIN!', hint: 'Show me the money!' },
  { id: 'background' as DrawingElement, prompt: '🎨 Draw a BACKGROUND!', hint: 'Fill the whole canvas!' },
  { id: 'card' as DrawingElement, prompt: '🃏 Draw a CARD!', hint: 'Like a feature card box!' },
  { id: 'header' as DrawingElement, prompt: '📋 Draw a HEADER BAR!', hint: 'Top of the screen!' },
  { id: 'achievement' as DrawingElement, prompt: '🏆 Draw an ACHIEVEMENT BADGE!', hint: 'Make it shiny!' },
  { id: 'streak' as DrawingElement, prompt: '🔥 Draw a STREAK FLAME!', hint: 'Hot hot hot!' },
  { id: 'menu' as DrawingElement, prompt: '☰ Draw a MENU ICON!', hint: '3 lines or get creative!' },
];

const COLORS = [
  '#000000', '#808080', '#C0C0C0', '#FFFFFF',
  '#FF0000', '#800000', '#FFFF00', '#808000',
  '#00FF00', '#008000', '#00FFFF', '#008080',
  '#0000FF', '#000080', '#FF00FF', '#800080',
  '#FFA500', '#A52A2A', '#FFB6C1', '#FF69B4',
];

export default function TextureCreatorPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pencil' | 'fill' | 'eraser'>('pencil');
  const [savedTextures, setSavedTextures] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);

  const currentPrompt = DRAWING_PROMPTS[currentPromptIndex];

  useEffect(() => {
    // Load existing textures
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('customTexturePackImages');
      if (saved) {
        setSavedTextures(JSON.parse(saved));
      }
    }

    // Initialize canvas with white background
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing && e.type !== 'mousedown') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === 'pencil') {
      ctx.fillStyle = selectedColor;
      ctx.fillRect(x - brushSize / 2, y - brushSize / 2, brushSize, brushSize);
    } else if (tool === 'eraser') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(x - brushSize / 2, y - brushSize / 2, brushSize, brushSize);
    } else if (tool === 'fill') {
      // Simple flood fill
      ctx.fillStyle = selectedColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const saveCurrentDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imageData = canvas.toDataURL('image/png');
    const newTextures = {
      ...savedTextures,
      [currentPrompt.id]: imageData,
    };

    setSavedTextures(newTextures);
    localStorage.setItem('customTexturePackImages', JSON.stringify(newTextures));

    // Move to next prompt
    if (currentPromptIndex < DRAWING_PROMPTS.length - 1) {
      setCurrentPromptIndex(currentPromptIndex + 1);
      clearCanvas();
    } else {
      // All done! Show preview
      setShowPreview(true);
    }
  };

  const activateTexturePack = () => {
    localStorage.setItem('texturePackActive', 'true');
    alert('🎨 Texture Pack Activated! Your drawings are now live across Learnverse!');
    router.push('/kid');
  };

  const skipPrompt = () => {
    if (currentPromptIndex < DRAWING_PROMPTS.length - 1) {
      setCurrentPromptIndex(currentPromptIndex + 1);
      clearCanvas();
    }
  };

  if (showPreview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-yellow-300 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-10">
          <h1 className="text-4xl font-bold text-center mb-8 text-purple-700">
            🎨 Your Custom Texture Pack! 🎨
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {DRAWING_PROMPTS.map((prompt) => (
              <div key={prompt.id} className="border-4 border-purple-300 rounded-xl p-4 bg-gray-50">
                <p className="text-sm font-bold mb-2 text-center">{prompt.prompt}</p>
                {savedTextures[prompt.id] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={savedTextures[prompt.id]} 
                    alt={prompt.id}
                    className="w-full h-32 object-contain"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-200 flex items-center justify-center text-gray-400">
                    Skipped
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={activateTexturePack}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 px-8 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              ✨ Activate Texture Pack!
            </button>
            <button
              onClick={() => {
                setShowPreview(false);
                setCurrentPromptIndex(0);
                clearCanvas();
              }}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-8 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              🔄 Start Over
            </button>
            <button
              onClick={() => router.push('/kid')}
              className="bg-gray-500 text-white py-4 px-8 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-6">
          <h1 className="text-4xl font-bold text-center mb-2 text-purple-700">
            🎨 Texture Pack Creator 🎨
          </h1>
          <p className="text-center text-gray-600 text-lg">
            Draw your own textures and make Learnverse look however YOU want!
          </p>
          <div className="mt-4 bg-gradient-to-r from-yellow-200 to-pink-200 rounded-xl p-4">
            <p className="text-center text-lg font-bold">
              Step {currentPromptIndex + 1} of {DRAWING_PROMPTS.length}
            </p>
            <div className="w-full bg-gray-300 h-4 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${((currentPromptIndex + 1) / DRAWING_PROMPTS.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Drawing Canvas */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-2xl p-6">
            <div className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl p-6 mb-4">
              <h2 className="text-3xl font-bold text-white text-center mb-2">
                {currentPrompt.prompt}
              </h2>
              <p className="text-white text-center text-lg">
                💡 {currentPrompt.hint}
              </p>
            </div>

            {/* Canvas */}
            <div className="border-8 border-gray-800 rounded-xl overflow-hidden mb-4 bg-white shadow-inner">
              <canvas
                ref={canvasRef}
                width={600}
                height={400}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="cursor-crosshair w-full"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={saveCurrentDrawing}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                ✅ Save & Next
              </button>
              <button
                onClick={clearCanvas}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                🗑️ Clear
              </button>
              <button
                onClick={skipPrompt}
                className="bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                ⏭️ Skip
              </button>
            </div>
          </div>

          {/* Tools Panel */}
          <div className="bg-white rounded-3xl shadow-2xl p-6">
            <h3 className="text-2xl font-bold mb-4 text-purple-700">🛠️ Tools</h3>

            {/* Tool Selection */}
            <div className="mb-6">
              <p className="font-bold mb-2">Drawing Tool:</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setTool('pencil')}
                  className={`flex-1 py-2 px-4 rounded-lg font-bold ${
                    tool === 'pencil' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200'
                  }`}
                >
                  ✏️ Pencil
                </button>
                <button
                  onClick={() => setTool('fill')}
                  className={`flex-1 py-2 px-4 rounded-lg font-bold ${
                    tool === 'fill' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200'
                  }`}
                >
                  🪣 Fill
                </button>
                <button
                  onClick={() => setTool('eraser')}
                  className={`flex-1 py-2 px-4 rounded-lg font-bold ${
                    tool === 'eraser' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200'
                  }`}
                >
                  🧹 Eraser
                </button>
              </div>
            </div>

            {/* Brush Size */}
            <div className="mb-6">
              <p className="font-bold mb-2">Brush Size: {brushSize}px</p>
              <input
                type="range"
                min="1"
                max="30"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Color Palette */}
            <div>
              <p className="font-bold mb-2">Colors:</p>
              <div className="grid grid-cols-4 gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-full h-12 rounded-lg border-4 transition-all ${
                      selectedColor === color 
                        ? 'border-black scale-110' 
                        : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="mt-4">
                <p className="font-bold mb-2">Custom Color:</p>
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full h-12 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Progress */}
            <div className="mt-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4">
              <p className="font-bold text-center mb-2">Completed:</p>
              <p className="text-3xl font-bold text-center text-purple-700">
                {Object.keys(savedTextures).length} / {DRAWING_PROMPTS.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
