"use client";

import { useState, useRef, useEffect } from "react";

// ============= DRAG & DROP GAME =============
interface DragDropItem {
  id: string;
  content: string;
  correctZone: string;
}

interface DragDropProps {
  items: DragDropItem[];
  zones: { id: string; label: string }[];
  onComplete: () => void;
}

export function DragDropGame({ items, zones, onComplete }: DragDropProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [placements, setPlacements] = useState<{ [key: string]: string }>({});
  const [completed, setCompleted] = useState(false);

  const handleDragStart = (itemId: string) => {
    setDraggedItem(itemId);
  };

  const handleDrop = (zoneId: string) => {
    if (draggedItem) {
      setPlacements({ ...placements, [draggedItem]: zoneId });
      setDraggedItem(null);
      
      // Check if all items are placed correctly
      const allCorrect = items.every(item => {
        const placed = placements[item.id] === item.correctZone || 
                      (draggedItem === item.id && zoneId === item.correctZone);
        return placed;
      });
      
      if (allCorrect && Object.keys(placements).length === items.length - 1) {
        setCompleted(true);
        setTimeout(() => onComplete(), 1000);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Items to Drag */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4 text-white">Drag the items to the correct spots!</h3>
        <div className="flex flex-wrap gap-4 justify-center">
          {items.filter(item => !placements[item.id]).map(item => (
            <div
              key={item.id}
              draggable
              onDragStart={() => handleDragStart(item.id)}
              className="bg-white px-6 py-4 rounded-xl shadow-lg cursor-move hover:scale-110 transition-transform text-2xl font-bold text-purple-600 border-4 border-purple-400"
            >
              {item.content}
            </div>
          ))}
        </div>
      </div>

      {/* Drop Zones */}
      <div className="grid grid-cols-2 gap-6">
        {zones.map(zone => {
          const itemsInZone = items.filter(item => placements[item.id] === zone.id);
          const isCorrect = itemsInZone.every(item => item.correctZone === zone.id);
          
          return (
            <div
              key={zone.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(zone.id)}
              className={`min-h-[150px] border-4 border-dashed rounded-2xl p-6 transition-all ${
                completed && isCorrect ? 'bg-green-400 border-green-600' : 'bg-white/50 border-white'
              }`}
            >
              <h4 className="text-xl font-bold mb-3 text-center">{zone.label}</h4>
              <div className="flex flex-wrap gap-2 justify-center">
                {itemsInZone.map(item => (
                  <div key={item.id} className="bg-purple-500 text-white px-4 py-2 rounded-lg text-lg font-semibold">
                    {item.content}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {completed && (
        <div className="mt-6 text-center">
          <div className="text-4xl animate-bounce">🎉 Perfect! 🎉</div>
        </div>
      )}
    </div>
  );
}

// ============= MATCHING GAME =============
interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

interface MatchingGameProps {
  pairs: MatchingPair[];
  onComplete: () => void;
}

export function MatchingGame({ pairs, onComplete }: MatchingGameProps) {
  const [selected, setSelected] = useState<{ side: 'left' | 'right'; id: string } | null>(null);
  const [matches, setMatches] = useState<{ [key: string]: string }>({});
  const [wrongMatch, setWrongMatch] = useState<string | null>(null);

  const handleSelect = (side: 'left' | 'right', id: string) => {
    if (matches[id]) return; // Already matched

    if (!selected) {
      setSelected({ side, id });
    } else {
      if (selected.side === side) {
        // Same side clicked, change selection
        setSelected({ side, id });
      } else {
        // Check if it's a match
        const leftId = side === 'left' ? id : selected.id;
        const rightId = side === 'right' ? id : selected.id;
        
        if (leftId === rightId) {
          // Correct match!
          setMatches({ ...matches, [leftId]: rightId });
          setSelected(null);
          
          if (Object.keys(matches).length === pairs.length - 1) {
            setTimeout(() => onComplete(), 1000);
          }
        } else {
          // Wrong match
          setWrongMatch(id);
          setTimeout(() => {
            setWrongMatch(null);
            setSelected(null);
          }, 500);
        }
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h3 className="text-2xl font-bold mb-6 text-white text-center">Match the pairs by clicking them!</h3>
      
      <div className="grid grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-4">
          {pairs.map(pair => (
            <button
              key={`left-${pair.id}`}
              onClick={() => handleSelect('left', pair.id)}
              disabled={!!matches[pair.id]}
              className={`w-full p-4 rounded-xl text-lg font-bold transition-all ${
                matches[pair.id]
                  ? 'bg-green-400 text-white scale-95 cursor-not-allowed'
                  : selected?.id === pair.id && selected.side === 'left'
                  ? 'bg-yellow-400 text-black scale-105 shadow-lg'
                  : wrongMatch === pair.id
                  ? 'bg-red-400 text-white shake'
                  : 'bg-white text-purple-600 hover:scale-105 shadow-md'
              }`}
            >
              {pair.left}
            </button>
          ))}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {pairs.sort(() => Math.random() - 0.5).map(pair => (
            <button
              key={`right-${pair.id}`}
              onClick={() => handleSelect('right', pair.id)}
              disabled={!!matches[pair.id]}
              className={`w-full p-4 rounded-xl text-lg font-bold transition-all ${
                matches[pair.id]
                  ? 'bg-green-400 text-white scale-95 cursor-not-allowed'
                  : selected?.id === pair.id && selected.side === 'right'
                  ? 'bg-yellow-400 text-black scale-105 shadow-lg'
                  : wrongMatch === pair.id
                  ? 'bg-red-400 text-white shake'
                  : 'bg-white text-purple-600 hover:scale-105 shadow-md'
              }`}
            >
              {pair.right}
            </button>
          ))}
        </div>
      </div>

      {Object.keys(matches).length === pairs.length && (
        <div className="mt-6 text-center">
          <div className="text-4xl animate-bounce">✨ All Matched! ✨</div>
        </div>
      )}
    </div>
  );
}

// ============= DRAWING ACTIVITY =============
interface DrawingActivityProps {
  prompt: string;
  onComplete: () => void;
}

export function DrawingActivity({ prompt, onComplete }: DrawingActivityProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#8b5cf6';
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setHasDrawn(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
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
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <h3 className="text-2xl font-bold mb-6 text-white text-center">{prompt}</h3>
      
      <div className="bg-white rounded-2xl p-4 shadow-2xl">
        <canvas
          ref={canvasRef}
          width={700}
          height={400}
          className="border-4 border-purple-300 rounded-xl cursor-crosshair w-full"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>

      <div className="flex gap-4 mt-6 justify-center">
        <button
          onClick={clearCanvas}
          className="px-8 py-3 bg-red-500 text-white rounded-xl font-bold text-lg hover:bg-red-600 transition-all hover:scale-105 shadow-lg"
        >
          Clear 🗑️
        </button>
        <button
          onClick={onComplete}
          disabled={!hasDrawn}
          className={`px-8 py-3 rounded-xl font-bold text-lg transition-all shadow-lg ${
            hasDrawn
              ? 'bg-green-500 text-white hover:bg-green-600 hover:scale-105'
              : 'bg-gray-400 text-gray-200 cursor-not-allowed'
          }`}
        >
          Done! ✓
        </button>
      </div>
    </div>
  );
}

// ============= MINI GAME - NUMBER CATCH =============
interface NumberCatchProps {
  targetNumber: number;
  onComplete: () => void;
}

export function NumberCatchGame({ targetNumber, onComplete }: NumberCatchProps) {
  const [score, setScore] = useState(0);
  const [fallingNumbers, setFallingNumbers] = useState<{ id: number; value: number; x: number; y: number }[]>([]);
  const [gameActive, setGameActive] = useState(true);

  useEffect(() => {
    if (!gameActive) return;

    const interval = setInterval(() => {
      const newNumber = {
        id: Date.now(),
        value: Math.floor(Math.random() * 10) + 1,
        x: Math.random() * 80 + 10,
        y: 0
      };
      setFallingNumbers(prev => [...prev, newNumber]);
    }, 1500);

    return () => clearInterval(interval);
  }, [gameActive]);

  useEffect(() => {
    if (!gameActive) return;

    const moveInterval = setInterval(() => {
      setFallingNumbers(prev =>
        prev.map(num => ({ ...num, y: num.y + 2 })).filter(num => num.y < 100)
      );
    }, 50);

    return () => clearInterval(moveInterval);
  }, [gameActive]);

  const catchNumber = (id: number, value: number) => {
    if (value === targetNumber) {
      setScore(score + 1);
      setFallingNumbers(prev => prev.filter(num => num.id !== id));
      
      if (score + 1 >= 3) {
        setGameActive(false);
        setTimeout(() => onComplete(), 1000);
      }
    } else {
      setFallingNumbers(prev => prev.filter(num => num.id !== id));
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="text-center mb-4">
        <h3 className="text-3xl font-bold text-white mb-2">Catch the {targetNumber}s!</h3>
        <div className="text-2xl font-bold text-yellow-300">Score: {score}/3</div>
      </div>

      <div className="relative bg-gradient-to-b from-blue-400 to-blue-600 rounded-2xl h-[400px] overflow-hidden border-4 border-white shadow-2xl">
        {fallingNumbers.map(num => (
          <button
            key={num.id}
            onClick={() => catchNumber(num.id, num.value)}
            className={`absolute text-4xl font-bold w-16 h-16 rounded-full flex items-center justify-center transition-all hover:scale-110 ${
              num.value === targetNumber
                ? 'bg-yellow-400 text-black shadow-lg'
                : 'bg-white text-gray-700'
            }`}
            style={{
              left: `${num.x}%`,
              top: `${num.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {num.value}
          </button>
        ))}

        {!gameActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-5xl font-bold text-white animate-bounce">🎉 You Win! 🎉</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============= INTERACTIVE CHALLENGE - TAP SEQUENCE =============
interface TapSequenceProps {
  sequence: string[];
  onComplete: () => void;
}

export function TapSequenceChallenge({ sequence, onComplete }: TapSequenceProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSequence, setShowSequence] = useState(true);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [gamePhase, setGamePhase] = useState<'show' | 'play' | 'complete'>('show');

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSequence(false);
      setGamePhase('play');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleTap = (item: string) => {
    if (gamePhase !== 'play') return;

    const newSequence = [...userSequence, item];
    setUserSequence(newSequence);

    if (item === sequence[currentIndex]) {
      if (currentIndex === sequence.length - 1) {
        setGamePhase('complete');
        setTimeout(() => onComplete(), 1500);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    } else {
      // Wrong! Reset
      setUserSequence([]);
      setCurrentIndex(0);
    }
  };

  const emojis = ['🍎', '🍌', '🍇', '🍊', '🍓', '🍉'];

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h3 className="text-2xl font-bold mb-6 text-white text-center">
        {gamePhase === 'show' ? 'Remember the sequence!' : 'Tap in the correct order!'}
      </h3>

      {gamePhase === 'show' && (
        <div className="bg-white rounded-2xl p-8 mb-6 shadow-2xl">
          <div className="flex gap-4 justify-center">
            {sequence.map((item, index) => (
              <div
                key={index}
                className="text-6xl animate-bounce"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {emojis.map(emoji => (
          <button
            key={emoji}
            onClick={() => handleTap(emoji)}
            disabled={gamePhase !== 'play'}
            className={`p-8 text-6xl bg-white rounded-2xl transition-all hover:scale-110 shadow-lg ${
              userSequence.includes(emoji) ? 'bg-green-300' : ''
            } ${gamePhase !== 'play' ? 'opacity-50' : ''}`}
          >
            {emoji}
          </button>
        ))}
      </div>

      <div className="mt-6 text-center text-xl font-bold text-white">
        Progress: {currentIndex}/{sequence.length}
      </div>

      {gamePhase === 'complete' && (
        <div className="mt-6 text-center text-4xl animate-bounce">
          🌟 Perfect Memory! 🌟
        </div>
      )}
    </div>
  );
}

// ============= ANIMATED VISUAL - COUNTING ANIMATION =============
interface CountingAnimationProps {
  numbers: number[];
  operation: string;
  answer: number;
  onComplete: () => void;
}

export function CountingAnimation({ numbers, operation, answer, onComplete }: CountingAnimationProps) {
  const [currentNumber, setCurrentNumber] = useState(0);
  const [items, setItems] = useState<number[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    // Animate counting
    let count = 0;
    const interval = setInterval(() => {
      if (count < numbers[0]) {
        setItems(prev => [...prev, count]);
        count++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowAnswer(true), 1000);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [numbers]);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 text-center">
      <h3 className="text-3xl font-bold mb-6 text-white">Watch and Learn!</h3>

      <div className="bg-white rounded-2xl p-8 mb-6 shadow-2xl min-h-[300px] flex flex-col items-center justify-center">
        <div className="text-4xl font-bold mb-6 text-purple-600">
          {numbers[0]} {operation} {numbers[1]} = ?
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-6">
          {items.map((_, index) => (
            <div
              key={index}
              className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full animate-[popIn_0.3s_ease-out] flex items-center justify-center text-white font-bold"
            >
              {index + 1}
            </div>
          ))}
        </div>

        {showAnswer && (
          <div className="text-5xl font-bold text-green-600 animate-[scaleIn_0.5s_ease-out]">
            = {answer} ✓
          </div>
        )}
      </div>

      {showAnswer && (
        <button
          onClick={onComplete}
          className="px-8 py-4 bg-green-500 text-white rounded-xl font-bold text-xl hover:bg-green-600 transition-all hover:scale-105 shadow-lg"
        >
          Got it! Continue →
        </button>
      )}
    </div>
  );
}
