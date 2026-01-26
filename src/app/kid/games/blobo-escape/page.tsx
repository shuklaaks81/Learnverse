"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSoundEffects } from "@/utils/soundEffects";

interface Guard {
  x: number;
  y: number;
  question: string;
  options: string[];
  correctAnswer: number;
  defeated: boolean;
}

interface Coin {
  x: number;
  y: number;
  collected: boolean;
}

interface Wall {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function BloboEscapeGame() {
  const router = useRouter();
  const sounds = useSoundEffects();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Blobo state
  const [bloboX, setBloboX] = useState(50);
  const [bloboY, setBloboY] = useState(300);
  const [bloboVelocityY, setBloboVelocityY] = useState(0);
  
  // Game state
  const [coins, setCoins] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [cameraX, setCameraX] = useState(0);
  
  // Question modal state
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentGuard, setCurrentGuard] = useState<Guard | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  
  // Guards with educational questions
  const [guards, setGuards] = useState<Guard[]>([
    {
      x: 600,
      y: 260,
      question: "What is 5 + 3?",
      options: ["6", "7", "8", "9"],
      correctAnswer: 2,
      defeated: false
    },
    {
      x: 1200,
      y: 150,
      question: "Which planet is closest to the Sun?",
      options: ["Earth", "Mercury", "Venus", "Mars"],
      correctAnswer: 1,
      defeated: false
    },
    {
      x: 1800,
      y: 260,
      question: "How many sides does a triangle have?",
      options: ["2", "3", "4", "5"],
      correctAnswer: 1,
      defeated: false
    },
    {
      x: 2400,
      y: 150,
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Rome"],
      correctAnswer: 2,
      defeated: false
    },
    {
      x: 3000,
      y: 260,
      question: "What is 12 - 7?",
      options: ["3", "4", "5", "6"],
      correctAnswer: 2,
      defeated: false
    },
    {
      x: 3600,
      y: 150,
      question: "What color do you get when you mix red and blue?",
      options: ["Green", "Purple", "Orange", "Yellow"],
      correctAnswer: 1,
      defeated: false
    },
    {
      x: 4200,
      y: 260,
      question: "How many legs does a spider have?",
      options: ["6", "8", "10", "12"],
      correctAnswer: 1,
      defeated: false
    },
    {
      x: 4800,
      y: 150,
      question: "What is 3 × 4?",
      options: ["7", "10", "12", "15"],
      correctAnswer: 2,
      defeated: false
    }
  ]);
  
  // Maze walls
  const walls: Wall[] = [
    // Starting area walls
    { x: 200, y: 200, width: 20, height: 150 },
    { x: 400, y: 100, width: 20, height: 150 },
    
    // First section maze
    { x: 700, y: 200, width: 20, height: 150 },
    { x: 800, y: 100, width: 20, height: 150 },
    { x: 900, y: 200, width: 150, height: 20 },
    
    // Second section
    { x: 1100, y: 100, width: 20, height: 200 },
    { x: 1300, y: 150, width: 20, height: 200 },
    { x: 1400, y: 100, width: 150, height: 20 },
    
    // Third section
    { x: 1700, y: 200, width: 20, height: 150 },
    { x: 1900, y: 100, width: 20, height: 150 },
    { x: 2000, y: 250, width: 150, height: 20 },
    
    // Fourth section  
    { x: 2300, y: 100, width: 20, height: 200 },
    { x: 2500, y: 150, width: 20, height: 200 },
    { x: 2600, y: 200, width: 150, height: 20 },
    
    // Fifth section
    { x: 2900, y: 200, width: 20, height: 150 },
    { x: 3100, y: 100, width: 20, height: 150 },
    { x: 3200, y: 250, width: 150, height: 20 },
    
    // Sixth section
    { x: 3500, y: 100, width: 20, height: 200 },
    { x: 3700, y: 150, width: 20, height: 200 },
    { x: 3800, y: 100, width: 150, height: 20 },
    
    // Seventh section
    { x: 4100, y: 200, width: 20, height: 150 },
    { x: 4300, y: 100, width: 20, height: 150 },
    { x: 4400, y: 250, width: 150, height: 20 },
    
    // Final section
    { x: 4700, y: 100, width: 20, height: 200 },
    { x: 4900, y: 150, width: 20, height: 200 },
  ];
  
  // Generate 100 coins scattered throughout the maze
  const generateCoins = (): Coin[] => {
    const coins: Coin[] = [];
    const sections = 10;
    const coinsPerSection = 10;
    
    for (let section = 0; section < sections; section++) {
      const startX = section * 550;
      for (let i = 0; i < coinsPerSection; i++) {
        coins.push({
          x: startX + 100 + (i * 45) + Math.random() * 30,
          y: 150 + Math.random() * 150,
          collected: false
        });
      }
    }
    return coins;
  };
  
  const [coinsList, setCoinsList] = useState<Coin[]>(generateCoins());

  // Keyboard controls
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = true;
      
      // Jump
      if ((e.key === ' ' || e.key === 'ArrowUp') && bloboY >= 300) {
        setBloboVelocityY(-15);
        sounds?.playClick();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [bloboY, sounds]);

  // Game loop
  useEffect(() => {
    if (!gameStarted || showQuestion || gameWon) return;

    const gameLoop = setInterval(() => {
      // Move Blobo with wall collision
      let newX = bloboX;
      if (keysPressed.current['ArrowLeft'] || keysPressed.current['a']) {
        const testX = Math.max(0, bloboX - 5);
        // Check wall collision
        let collision = false;
        for (const wall of walls) {
          if (
            testX < wall.x + wall.width &&
            testX + 40 > wall.x &&
            bloboY < wall.y + wall.height &&
            bloboY + 40 > wall.y
          ) {
            collision = true;
            break;
          }
        }
        if (!collision) newX = testX;
      }
      if (keysPressed.current['ArrowRight'] || keysPressed.current['d']) {
        const testX = Math.min(5400, bloboX + 5);
        // Check wall collision
        let collision = false;
        for (const wall of walls) {
          if (
            testX < wall.x + wall.width &&
            testX + 40 > wall.x &&
            bloboY < wall.y + wall.height &&
            bloboY + 40 > wall.y
          ) {
            collision = true;
            break;
          }
        }
        if (!collision) newX = testX;
      }
      setBloboX(newX);

      // Apply gravity and update Y position
      let newVelocityY = bloboVelocityY + 0.8; // gravity
      let newY = bloboY + newVelocityY;

      // Ground collision
      if (newY >= 300) {
        newY = 300;
        newVelocityY = 0;
      }
      
      // Check wall collision for vertical movement
      for (const wall of walls) {
        if (
          newX < wall.x + wall.width &&
          newX + 40 > wall.x &&
          newY < wall.y + wall.height &&
          newY + 40 > wall.y
        ) {
          newY = bloboY;
          newVelocityY = 0;
          break;
        }
      }

      setBloboY(newY);
      setBloboVelocityY(newVelocityY);

      // Camera follows Blobo
      const newCameraX = Math.max(0, Math.min(newX - 300, 5400 - 800));
      setCameraX(newCameraX);

      // Check coin collision
      setCoinsList(prevCoins => 
        prevCoins.map(coin => {
          if (!coin.collected && 
              Math.abs(newX - coin.x) < 30 && 
              Math.abs(bloboY - coin.y) < 30) {
            setCoins(prev => prev + 1);
            setScore(prev => prev + 10);
            sounds?.playCorrect();
            return { ...coin, collected: true };
          }
          return coin;
        })
      );

      // Check guard collision
      const activeGuard = guards.find(g => 
        !g.defeated && Math.abs(newX - g.x) < 50 && Math.abs(bloboY - g.y) < 50
      );

      if (activeGuard) {
        setCurrentGuard(activeGuard);
        setShowQuestion(true);
      }

      // Check if reached exit (end of level)
      if (newX >= 5300) {
        setGameWon(true);
        sounds?.playCelebration();
        
        // Save coins to kid account (1/5 of collected coins)
        const currentKid = JSON.parse(localStorage.getItem('currentKid') || '{}');
        if (currentKid.id) {
          const earnedCoins = Math.floor(coins / 5); // 1/5 of coins collected
          const totalCoins = (currentKid.coins || 0) + earnedCoins;
          currentKid.coins = totalCoins;
          localStorage.setItem('currentKid', JSON.stringify(currentKid));
        }
      }
    }, 1000 / 60); // 60 FPS

    return () => clearInterval(gameLoop);
  }, [gameStarted, bloboX, bloboY, bloboVelocityY, guards, showQuestion, gameWon, coins, sounds, walls]);

  // Answer question
  const handleAnswerQuestion = () => {
    if (selectedAnswer === null || !currentGuard) return;

    if (selectedAnswer === currentGuard.correctAnswer) {
      // Correct answer!
      sounds?.playCorrect();
      setGuards(prev =>
        prev.map(g =>
          g.x === currentGuard.x ? { ...g, defeated: true } : g
        )
      );
      setScore(prev => prev + 50);
      setShowQuestion(false);
      setCurrentGuard(null);
      setSelectedAnswer(null);
    } else {
      // Wrong answer
      sounds?.playWrong();
      alert("❌ Wrong answer! Try again!");
      setSelectedAnswer(null);
    }
  };

  // Start game
  const startGame = () => {
    setGameStarted(true);
    sounds?.playClick();
  };

  // Restart game
  const restartGame = () => {
    setBloboX(50);
    setBloboY(300);
    setCoins(0);
    setScore(0);
    setGameWon(false);
    setGameStarted(false);
    setGuards(guards.map(g => ({ ...g, defeated: false })));
    setCoinsList(coinsList.map(c => ({ ...c, collected: false })));
    setCameraX(0);
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-8">
        <div className="bg-white/95 rounded-3xl p-12 max-w-2xl text-center shadow-2xl">
          <div className="text-8xl mb-6 animate-bounce">🟣</div>
          <h1 className="text-5xl font-bold text-purple-700 mb-4">Blobo&apos;s Castle Escape!</h1>
          <p className="text-xl text-gray-700 mb-6">
            Help Blobo the floating blob escape from the castle! 🏰
          </p>
          
          <div className="bg-purple-100 rounded-2xl p-6 mb-8 text-left">
            <h3 className="text-2xl font-bold text-purple-700 mb-4">📜 How to Play:</h3>
            <ul className="space-y-2 text-lg text-gray-700">
              <li>⬅️➡️ <strong>Arrow Keys</strong> or <strong>A/D</strong> - Move Blobo left/right</li>
              <li>⬆️ <strong>Arrow Up</strong> or <strong>Space</strong> - Jump</li>
              <li>🪙 Collect coins for points!</li>
              <li>💂 Answer questions correctly to pass guards!</li>
              <li>🚪 Reach the exit to escape!</li>
            </ul>
          </div>

          <button
            onClick={startGame}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-6 rounded-2xl font-bold text-2xl hover:scale-110 transition-all shadow-lg"
          >
            Start Adventure! 🎮
          </button>
          
          <button
            onClick={() => router.push('/kid/games')}
            className="mt-4 block mx-auto text-gray-600 hover:text-gray-800 font-semibold"
          >
            ← Back to Games
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      {/* HUD */}
      <div className="max-w-6xl mx-auto mb-4">
        <div className="bg-white/90 rounded-2xl p-4 flex justify-between items-center shadow-lg">
          <div className="flex gap-6">
            <div className="text-2xl font-bold text-purple-700">
              🪙 Coins: <span className="text-yellow-600">{coins}</span>
            </div>
            <div className="text-2xl font-bold text-purple-700">
              ⭐ Score: <span className="text-green-600">{score}</span>
            </div>
          </div>
          <button
            onClick={() => router.push('/kid/games')}
            className="bg-red-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-red-600 transition"
          >
            Exit Game
          </button>
        </div>
      </div>

      {/* Game Canvas */}
      <div className="max-w-6xl mx-auto bg-gradient-to-b from-gray-800 to-gray-900 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/30" style={{ height: '500px', position: 'relative' }}>
        {/* Sky/Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900 via-purple-900 to-gray-800"></div>
        
        {/* Game World */}
        <div style={{ position: 'relative', transform: `translateX(-${cameraX}px)`, width: '5500px', height: '100%' }}>
          {/* Castle Floor */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-700 to-gray-900 border-t-4 border-gray-600"></div>
          
          {/* Castle Wall Pattern */}
          {[...Array(110)].map((_, i) => (
            <div
              key={i}
              className="absolute bottom-32 w-12 h-48 bg-gradient-to-b from-gray-600 to-gray-700 border-r-2 border-gray-800"
              style={{ left: i * 50 }}
            ></div>
          ))}
          
          {/* Maze Walls */}
          {walls.map((wall, i) => (
            <div
              key={i}
              className="absolute bg-gradient-to-br from-stone-600 to-stone-800 border-2 border-stone-900 shadow-lg"
              style={{
                left: wall.x,
                top: wall.y,
                width: wall.width,
                height: wall.height
              }}
            ></div>
          ))}

          {/* Coins */}
          {coinsList.map((coin, i) => (
            !coin.collected && (
              <div
                key={i}
                className="absolute text-4xl animate-bounce"
                style={{ left: coin.x, top: coin.y }}
              >
                🪙
              </div>
            )
          ))}

          {/* Guards */}
          {guards.map((guard, i) => (
            !guard.defeated && (
              <div
                key={i}
                className="absolute text-6xl"
                style={{ left: guard.x, top: guard.y }}
              >
                💂
              </div>
            )
          ))}

          {/* Exit Door */}
          <div className="absolute text-8xl" style={{ left: 5350, top: 240 }}>
            🚪
          </div>

          {/* Blobo */}
          <div
            className="absolute text-6xl transition-all duration-100"
            style={{ 
              left: bloboX - 30, 
              top: bloboY - 30,
              transform: `rotate(${Math.sin(Date.now() / 200) * 10}deg)`
            }}
          >
            🟣
          </div>
        </div>
      </div>

      {/* Question Modal */}
      {showQuestion && currentGuard && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl animate-[popIn_0.3s_ease-out]">
            <div className="text-6xl text-center mb-4">💂</div>
            <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">
              Guard&apos;s Challenge!
            </h2>
            <p className="text-2xl text-center text-gray-800 mb-8 font-semibold">
              {currentGuard.question}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {currentGuard.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedAnswer(i)}
                  className={`p-6 rounded-2xl text-xl font-bold transition-all ${
                    selectedAnswer === i
                      ? 'bg-purple-600 text-white scale-105 shadow-lg'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            <button
              onClick={handleAnswerQuestion}
              disabled={selectedAnswer === null}
              className={`w-full py-4 rounded-2xl font-bold text-xl transition-all ${
                selectedAnswer === null
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:scale-105 shadow-lg'
              }`}
            >
              Submit Answer ✓
            </button>
          </div>
        </div>
      )}

      {/* Win Screen */}
      {gameWon && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 rounded-3xl p-12 max-w-2xl text-center shadow-2xl animate-[popIn_0.5s_ease-out]">
            <div className="text-9xl mb-6 animate-bounce">🎉</div>
            <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Blobo Escaped!
            </h1>
            <p className="text-3xl text-white mb-8">
              You helped Blobo escape the castle! 🏰
            </p>

            <div className="bg-white/90 rounded-2xl p-6 mb-8">
              <div className="text-2xl font-bold text-gray-800 mb-2">
                🪙 Coins Collected: <span className="text-yellow-600">{coins}</span>
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-2">
                💰 Coins Earned: <span className="text-green-600">{Math.floor(coins / 5)}</span> (1/5 of collected)
              </div>
              <div className="text-2xl font-bold text-gray-800">
                ⭐ Final Score: <span className="text-green-600">{score}</span>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={restartGame}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-xl hover:scale-110 transition-all shadow-lg"
              >
                🔄 Play Again
              </button>
              <button
                onClick={() => router.push('/kid/games')}
                className="bg-white text-purple-700 px-8 py-4 rounded-2xl font-bold text-xl hover:scale-110 transition-all shadow-lg"
              >
                ← Back to Games
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes popIn {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
