"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { unlockAchievement } from '@/utils/achievements';

interface PageElement {
  id: number;
  type: 'button' | 'text' | 'url' | 'image' | 'header';
  content: string;
  x: number;
  y: number;
  link?: string;
  placed: boolean;
}

const elementsToPlace: Omit<PageElement, 'id' | 'placed'>[] = [
  // Top header
  { type: 'header', content: '🌟 Learnverse', x: 50, y: 8 },
  
  // Navigation buttons
  { type: 'button', content: '📚 Lessons', x: 20, y: 18 },
  { type: 'button', content: '🎮 Games', x: 40, y: 18 },
  { type: 'button', content: '🏆 Achievements', x: 60, y: 18 },
  { type: 'button', content: '⚙️ Settings', x: 80, y: 18 },
  
  // Main content cards
  { type: 'text', content: '🧮 Math Adventure', x: 25, y: 35 },
  { type: 'text', content: '🔬 Science Lab', x: 50, y: 35 },
  { type: 'text', content: '📖 Reading Quest', x: 75, y: 35 },
  
  { type: 'text', content: '🎨 Art Studio', x: 25, y: 50 },
  { type: 'text', content: '🎵 Music Room', x: 50, y: 50 },
  { type: 'text', content: '🌍 Geography', x: 75, y: 50 },
  
  // Game section
  { type: 'text', content: '🎮 Quick Games', x: 35, y: 65 },
  { type: 'url', content: 'Blobo Escape', x: 25, y: 72, link: '/kid/games/blobo-escape' },
  { type: 'url', content: 'Blocky World', x: 50, y: 72, link: '/blocky' },
  
  // Footer elements
  { type: 'text', content: '✨', x: 15, y: 85 },
  { type: 'text', content: '🚀', x: 85, y: 85 },
  
  // Profile info
  { type: 'text', content: '👤 Welcome back!', x: 50, y: 92 }
];

export default function WeirdPage() {
  const router = useRouter();
  const [workerX, setWorkerX] = useState(50);
  const [workerY, setWorkerY] = useState(50);
  const [workerDirection, setWorkerDirection] = useState<'left' | 'right'>('right');
  const [speechBubble, setSpeechBubble] = useState('');
  const [showSpeech, setShowSpeech] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const [elements, setElements] = useState<PageElement[]>([]);
  const [currentElementIndex, setCurrentElementIndex] = useState(0);
  const [buildingProgress, setBuildingProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [holdingElement, setHoldingElement] = useState<PageElement | null>(null);
  
  // New states for coding phase
  const [buildPhase, setBuildPhase] = useState<'intro' | 'getting-computer' | 'coding' | 'colors' | 'building' | 'complete' | 'explosion' | 'crashed'>('intro');
  const [hasComputer, setHasComputer] = useState(false);
  const [keyboardSlaps, setKeyboardSlaps] = useState(0);
  const [selectedBg, setSelectedBg] = useState('gray');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [explosionElements, setExplosionElements] = useState<number[]>([]);
  const [screenShake, setScreenShake] = useState(false);

  useEffect(() => {
    unlockAchievement('weird');
  }, []);

  // Building process with phases
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    // PHASE 1: Introduction
    if (buildPhase === 'intro') {
      setSpeechBubble("Time to build Learnverse! 💪");
      setShowSpeech(true);
      timeoutId = setTimeout(() => {
        setShowSpeech(false);
        setBuildPhase('getting-computer');
      }, 2000);
    }
    
    // PHASE 2: Getting computer
    else if (buildPhase === 'getting-computer') {
      setSpeechBubble("First, I need my computer! 💻");
      setShowSpeech(true);
      
      // Walk to random position
      const walkInterval = setInterval(() => {
        setWorkerX(prev => Math.max(5, Math.min(95, prev + (Math.random() - 0.5) * 15)));
        setWorkerY(prev => Math.max(5, Math.min(95, prev + (Math.random() - 0.5) * 15)));
        setWorkerDirection(Math.random() > 0.5 ? 'left' : 'right');
      }, 150);
      
      timeoutId = setTimeout(() => {
        clearInterval(walkInterval);
        setHasComputer(true);
        setSpeechBubble("Got it! Time to code! 👨‍💻");
        setTimeout(() => {
          setShowSpeech(false);
          setBuildPhase('coding');
        }, 2000);
      }, 3000);
    }
    
    // PHASE 3: Coding (keyboard slapping)
    else if (buildPhase === 'coding') {
      setSpeechBubble("*SLAP SLAP SLAP* 💥");
      setShowSpeech(true);
      
      const codeSpeeches = [
        "*typing furiously* 💻",
        "*SLAP* Come on! 😤",
        "const learnverse = ...",
        "*smashing keyboard* 🔨",
        "Why won't this work?! 😫",
        "*SLAP SLAP SLAP* 💥",
        "Almost got it... 🤔",
        "*angry typing* 😡",
        "Just... one... more... SLAP! 💪"
      ];
      
      let slaps = 0;
      const slapInterval = setInterval(() => {
        slaps++;
        setKeyboardSlaps(slaps);
        setSpeechBubble(codeSpeeches[Math.floor(Math.random() * codeSpeeches.length)]);
        
        // Random shake animation
        setWorkerX(prev => prev + (Math.random() - 0.5) * 2);
        setWorkerY(prev => prev + (Math.random() - 0.5) * 2);
        
        if (slaps >= 50) { // 50 slaps = kajillion
          clearInterval(slapInterval);
          setSpeechBubble("YES! The code works! 🎉");
          setTimeout(() => {
            setShowSpeech(false);
            setBuildPhase('colors');
          }, 2500);
        }
      }, 100);
    }
    
    // PHASE 4: Choosing colors
    else if (buildPhase === 'colors') {
      setSpeechBubble("Now for the colors! 🎨");
      setShowSpeech(true);
      setShowColorPicker(true);
      
      const colors = ['purple', 'blue', 'green', 'pink', 'orange', 'cyan'];
      let colorIndex = 0;
      
      const colorInterval = setInterval(() => {
        setSelectedBg(colors[colorIndex]);
        colorIndex = (colorIndex + 1) % colors.length;
      }, 500);
      
      timeoutId = setTimeout(() => {
        clearInterval(colorInterval);
        setSelectedBg('gradient'); // Final choice
        setShowColorPicker(false);
        setSpeechBubble("Perfect! Now let's place everything! ✨");
        setTimeout(() => {
          setShowSpeech(false);
          setBuildPhase('building');
          setCurrentElementIndex(0);
        }, 2000);
      }, 4000);
    }
    
    // PHASE 5: Building (original logic)
    else if (buildPhase === 'building') {
      if (currentElementIndex >= elementsToPlace.length) {
        setBuildPhase('complete');
        return;
      }
      
      const buildInterval = setInterval(() => {
        const targetElement = elementsToPlace[currentElementIndex];
        
        // Pick up element
        if (!holdingElement && !isWorking) {
          setIsWorking(true);
          
          const walkDuration = 1000;
          const walkStart = Date.now();
          
          const walkInterval = setInterval(() => {
            if (Date.now() - walkStart > walkDuration) {
              clearInterval(walkInterval);
              setHoldingElement({
                ...targetElement,
                id: currentElementIndex,
                placed: false
              });
              setSpeechBubble(`Placing ${targetElement.type}...`);
              setShowSpeech(true);
              setTimeout(() => setShowSpeech(false), 1000);
            } else {
              setWorkerX(prev => Math.max(5, Math.min(95, prev + (Math.random() - 0.5) * 8)));
              setWorkerY(prev => Math.max(5, Math.min(95, prev + (Math.random() - 0.5) * 8)));
              setWorkerDirection(Math.random() > 0.5 ? 'left' : 'right');
            }
          }, 100);
        }
        
        // Move to target and place
        if (holdingElement && !holdingElement.placed) {
          const dx = targetElement.x - workerX;
          const dy = targetElement.y - workerY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 3) {
            setElements(prev => [...prev, { ...holdingElement, placed: true }]);
            setHoldingElement(null);
            setIsWorking(false);
            setCurrentElementIndex(prev => prev + 1);
            setBuildingProgress(((currentElementIndex + 1) / elementsToPlace.length) * 100);
          } else {
            const step = 3;
            setWorkerX(prev => prev + (dx / distance) * step);
            setWorkerY(prev => prev + (dy / distance) * step);
            setWorkerDirection(dx > 0 ? 'right' : 'left');
          }
        }
      }, 80);
      
      return () => clearInterval(buildInterval);
    }
    
    // PHASE 6: Complete
    else if (buildPhase === 'complete') {
      setIsComplete(true);
      setSpeechBubble("Learnverse is ready! 🎉");
      setShowSpeech(true);
      
      // Wait 3 seconds then... BOOM
      timeoutId = setTimeout(() => {
        setSpeechBubble("Wait... hehe... 😈");
        setTimeout(() => {
          setSpeechBubble("Time to blow it up! 💣");
          setTimeout(() => {
            setBuildPhase('explosion');
            setIsComplete(false);
          }, 1500);
        }, 1500);
      }, 3000);
    }
    
    // PHASE 7: EXPLOSION!
    else if (buildPhase === 'explosion') {
      setSpeechBubble("BOOM!!! 💥💥💥");
      setShowSpeech(true);
      setScreenShake(true);
      
      // Explode elements one by one rapidly
      let explosionCount = 0;
      const explosionInterval = setInterval(() => {
        if (explosionCount < elements.length) {
          setExplosionElements(prev => [...prev, explosionCount]);
          explosionCount++;
        } else {
          clearInterval(explosionInterval);
          // Final crash
          setTimeout(() => {
            setBuildPhase('crashed');
            setScreenShake(false);
          }, 1000);
        }
      }, 150);
      
      return () => clearInterval(explosionInterval);
    }
    
    // PHASE 8: CRASHED
    else if (buildPhase === 'crashed') {
      // Show crash screen
      setSpeechBubble("");
      setShowSpeech(false);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [buildPhase, currentElementIndex, holdingElement, isWorking, workerX, workerY, elements.length]);

  const handleElementClick = (element: PageElement) => {
    if (!isComplete) {
      setSpeechBubble("Wait! I'm not done yet! 😤");
      setShowSpeech(true);
      setTimeout(() => setShowSpeech(false), 2000);
      return;
    }
    
    if (element.link) {
      router.push(element.link);
    } else if (element.type === 'button') {
      setSpeechBubble("The button works! 🎉");
      setShowSpeech(true);
      setTimeout(() => setShowSpeech(false), 2000);
    }
  };

  return (
    <div 
      className={`min-h-screen relative overflow-hidden transition-all duration-1000 ${
        screenShake ? 'animate-shake' : ''
      }`}
      style={{
        background: buildPhase === 'crashed' 
          ? '#000000'
          : selectedBg === 'gradient' 
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
          : selectedBg === 'purple' ? 'linear-gradient(to br, #9333ea, #581c87)'
          : selectedBg === 'blue' ? 'linear-gradient(to br, #3b82f6, #1e40af)'
          : selectedBg === 'green' ? 'linear-gradient(to br, #10b981, #065f46)'
          : selectedBg === 'pink' ? 'linear-gradient(to br, #ec4899, #be185d)'
          : selectedBg === 'orange' ? 'linear-gradient(to br, #f97316, #c2410c)'
          : selectedBg === 'cyan' ? 'linear-gradient(to br, #06b6d4, #0e7490)'
          : 'linear-gradient(to br, #f3f4f6, #d1d5db)'
      }}
    >
      {/* Grid background */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />

      {/* Progress bar with phase indicator */}
      <div className="absolute top-4 left-4 right-4 z-50">
        <div className="bg-white rounded-full shadow-lg p-3">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-bold text-gray-700 whitespace-nowrap">
              {buildPhase === 'intro' && '🎬 Starting...'}
              {buildPhase === 'getting-computer' && '💻 Getting Computer'}
              {buildPhase === 'coding' && `⌨️ Coding (${keyboardSlaps}/50 slaps)`}
              {buildPhase === 'colors' && '🎨 Choosing Colors'}
              {buildPhase === 'building' && '🔨 Building'}
              {buildPhase === 'complete' && '✅ Complete!'}
              {buildPhase === 'explosion' && '💣 BOOM!!!'}
              {buildPhase === 'crashed' && '💀 Crashed'}
            </span>
            <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  buildPhase === 'explosion' ? 'bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500'
                  : buildPhase === 'crashed' ? 'bg-black'
                  : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500'
                }`}
                style={{ 
                  width: buildPhase === 'intro' ? '5%'
                    : buildPhase === 'getting-computer' ? '15%'
                    : buildPhase === 'coding' ? `${15 + (keyboardSlaps / 50) * 25}%`
                    : buildPhase === 'colors' ? '45%'
                    : buildPhase === 'building' ? `${50 + (buildingProgress / 2)}%`
                    : buildPhase === 'explosion' ? '99%'
                    : '0%'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Color picker UI */}
      {showColorPicker && (
        <div className="absolute top-20 right-4 bg-white rounded-2xl shadow-2xl p-4 z-50 animate-fadeIn">
          <h3 className="text-sm font-bold text-gray-800 mb-2">🎨 Color Picker</h3>
          <div className="grid grid-cols-3 gap-2">
            {['purple', 'blue', 'green', 'pink', 'orange', 'cyan'].map(color => (
              <div
                key={color}
                className={`w-8 h-8 rounded-full ${selectedBg === color ? 'ring-4 ring-black' : ''}`}
                style={{
                  background: color === 'purple' ? '#9333ea'
                    : color === 'blue' ? '#3b82f6'
                    : color === 'green' ? '#10b981'
                    : color === 'pink' ? '#ec4899'
                    : color === 'orange' ? '#f97316'
                    : '#06b6d4'
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Worker character */}
      {buildPhase !== 'crashed' && (
        <div
          className="absolute transition-all duration-100 ease-linear z-40"
          style={{
            left: `${workerX}%`,
            top: `${workerY}%`,
            transform: `translate(-50%, -50%) ${workerDirection === 'left' ? 'scaleX(-1)' : ''}`
          }}
        >
          {/* Speech bubble */}
          {showSpeech && (
            <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 whitespace-nowrap z-50">
              <div className="bg-white rounded-lg px-4 py-2 shadow-lg border-2 border-gray-800 relative">
                <p className="text-sm font-bold text-gray-800">{speechBubble}</p>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-800" />
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-white" />
              </div>
            </div>
          )}

          {/* Worker body */}
          <div className="relative">
            {/* Worker face changes during explosion */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-4xl">
              {buildPhase === 'explosion' ? '😈' : '👷'}
            </div>
            
            {/* Computer when coding */}
            {hasComputer && (buildPhase === 'coding' || buildPhase === 'colors' || buildPhase === 'building') && (
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-3xl">
                💻
              </div>
            )}
            
            {/* TNT during explosion */}
            {buildPhase === 'explosion' && (
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-3xl animate-pulse">
                💣
              </div>
            )}
            
            {/* Holding element indicator */}
            {holdingElement && (
              <div className="absolute -top-2 -right-10 transform rotate-12">
                <div className="bg-yellow-200 border-2 border-yellow-600 rounded px-2 py-1 text-xs font-bold shadow-lg">
                  {holdingElement.type === 'url' && '🔗'}
                  {holdingElement.type === 'button' && '🔘'}
                  {holdingElement.type === 'text' && '📝'}
                  {holdingElement.type === 'header' && '📌'}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Placed elements */}
      {buildPhase !== 'crashed' && elements.map((element) => {
        const isExploded = explosionElements.includes(element.id);
        if (isExploded && buildPhase === 'explosion') {
          // Show explosion effect
          return (
            <div
              key={element.id}
              className="absolute animate-explosion"
              style={{
                left: `${element.x}%`,
                top: `${element.y}%`,
                transform: 'translate(-50%, -50%)',
                fontSize: '4rem'
              }}
            >
              💥
            </div>
          );
        }
        if (isExploded) return null;
        
        return (
          <div
            key={element.id}
            className="absolute transition-all duration-500 animate-fadeIn"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
          {element.type === 'header' && (
            <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-2xl">
              {element.content}
            </h1>
          )}
          
          {element.type === 'text' && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-xl border-2 border-white/50">
              <p className="text-lg md:text-2xl font-bold text-gray-800">
                {element.content}
              </p>
            </div>
          )}
          
          {element.type === 'button' && (
            <button
              onClick={() => handleElementClick(element)}
              className="px-8 py-4 bg-white text-gray-800 rounded-xl font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all border-2 border-white/50 backdrop-blur-sm"
            >
              {element.content}
            </button>
          )}
          
          {element.type === 'url' && (
            <Link
              href={element.link || '#'}
              className="block px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white rounded-xl font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all text-sm"
            >
              {element.content}
            </Link>
          )}
        </div>
      );
      })}

      {/* Completion screen */}
      {isComplete && buildPhase === 'complete' && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-2xl transform animate-scaleIn">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-black text-gray-800 mb-4">
              Learnverse Built Successfully!
            </h2>
            <p className="text-gray-600 mb-4">
              The worker coded it, slapped the keyboard {keyboardSlaps} times, picked the perfect colors, and built the entire Learnverse!
            </p>
            <p className="text-sm text-gray-500 mb-6">
              All the buttons and links work now! ✨
            </p>
            <div className="space-y-3">
              <Link
                href="/kid"
                className="block w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-bold hover:shadow-xl transition-all"
              >
                Go to Real Learnverse
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="block w-full px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-bold transition-all"
              >
                Watch Him Build Again 🔄
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Crash Screen */}
      {buildPhase === 'crashed' && (
        <div className="absolute inset-0 bg-black flex items-center justify-center z-50 font-mono text-green-400 p-8">
          <div className="max-w-4xl w-full">
            <div className="mb-8 text-red-500 text-2xl font-bold animate-pulse">
              ⚠️ FATAL ERROR ⚠️
            </div>
            
            <div className="space-y-2 text-sm mb-8">
              <p>Learnverse.exe has stopped working</p>
              <p className="text-red-400">Error Code: 0x8badf00d</p>
              <p>Reason: Worker_Blew_Everything_Up.exception</p>
              <p className="text-yellow-400">at BuilderWorker.BlowUp()</p>
              <p className="text-yellow-400">at Learnverse.Complete()</p>
              <p className="text-yellow-400">at WeirdPage.Render()</p>
              <p className="mt-4">Stack trace:</p>
              <p className="text-gray-500 text-xs ml-4">
                TypeError: Cannot read property &apos;elements&apos; of undefined
                <br />hehe time to blow it uufhbtrhyuhyguybhuythjhfugkjm
                <br />💥💥💥 BOOM 💥💥💥
                <br />Segmentation fault (core dumped)
                <br />Worker laughing uncontrollably... 😂
                <br />All elements have been destroyed
                <br />Memory leak detected: Worker.Sanity = null
              </p>
            </div>

            <div className="border-t border-green-400 pt-6 space-y-4">
              <p className="text-lg">What happened? 🤔</p>
              <p className="text-gray-400 text-sm">
                The worker built the entire Learnverse, then decided it would be fun to blow it all up. 
                Classic developer move. 💣
              </p>
              
              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-black font-bold rounded transition-all"
                >
                  [Rebuild Everything] 🔄
                </button>
                <Link
                  href="/kid"
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded transition-all text-center"
                >
                  [Escape to Safety] 🏃
                </Link>
              </div>
            </div>

            <div className="mt-8 text-xs text-gray-600 text-center">
              Press F to pay respects to the destroyed Learnverse 😔
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes shake {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          10% { transform: translate(-10px, -10px) rotate(-2deg); }
          20% { transform: translate(10px, 10px) rotate(2deg); }
          30% { transform: translate(-15px, 5px) rotate(-3deg); }
          40% { transform: translate(15px, -5px) rotate(3deg); }
          50% { transform: translate(-10px, 10px) rotate(-2deg); }
          60% { transform: translate(10px, -10px) rotate(2deg); }
          70% { transform: translate(-5px, 15px) rotate(-1deg); }
          80% { transform: translate(5px, -15px) rotate(1deg); }
          90% { transform: translate(-5px, 5px) rotate(-1deg); }
        }
        @keyframes explosion {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(2) rotate(180deg);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(3) rotate(360deg);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s infinite;
        }
        .animate-explosion {
          animation: explosion 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
