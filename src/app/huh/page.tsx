"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { unlockAchievement } from '@/utils/achievements';

const confusedMessages = [
  "Wait... what?",
  "I don't understand",
  "Why are you here?",
  "What is this place?",
  "Am I a website?",
  "Are you confused?",
  "I'm so confused",
  "Nothing makes sense",
  "Where am I?",
  "Who am I?",
  "What's happening?",
  "Is this real?",
  "Help I'm lost",
  "What does this button do?",
  "Why did you click that?",
  "Stop clicking things!",
  "I'm having an identity crisis",
  "What even is Learnverse?",
  "Why do I exist?",
  "This wasn't in the manual"
];

const randomEmojis = [
  '🤔', '😵', '🤪', '😵‍💫', '🥴', '🫨', 
  '😑', '🙃', '😶', '🤨', '😐', '😶‍🌫️',
  '🌀', '❓', '❔', '⁉️', '‼️', '⚠️'
];

const randomColors = [
  '#ff0000', '#00ff00', '#0000ff', '#ffff00', 
  '#ff00ff', '#00ffff', '#ff8800', '#8800ff',
  '#ff0088', '#88ff00', '#0088ff', '#ff8888'
];

export default function HuhPage() {
  const [rotation, setRotation] = useState(0);
  const [confusion, setConfusion] = useState(0);
  const [randomColor, setRandomColor] = useState('#ff0000');
  const [upsideDown, setUpsideDown] = useState(false);
  const [randomEmoji, setRandomEmoji] = useState('🤔');
  const [clickCount, setClickCount] = useState(0);

  // Unlock achievement
  useEffect(() => {
    unlockAchievement('huh');
  }, []);

  // Constant confusion
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
      setConfusion(Math.random() * 360);
      setRandomColor(randomColors[Math.floor(Math.random() * randomColors.length)]);
      setRandomEmoji(randomEmojis[Math.floor(Math.random() * randomEmojis.length)]);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Random upside down
  useEffect(() => {
    const interval = setInterval(() => {
      setUpsideDown(Math.random() > 0.7);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleConfusedClick = () => {
    setClickCount(prev => prev + 1);
    alert(confusedMessages[Math.floor(Math.random() * confusedMessages.length)]);
  };

  return (
    <div 
      className="min-h-screen overflow-hidden relative"
      style={{
        background: `linear-gradient(${confusion}deg, ${randomColor}, #000)`,
        transform: upsideDown ? 'rotate(180deg)' : 'none',
        transition: 'all 0.5s ease'
      }}
    >
      {/* Floating confused emojis */}
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute text-6xl animate-spin"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${1 + Math.random() * 3}s`,
            opacity: 0.3,
            transform: `rotate(${Math.random() * 360}deg)`
          }}
        >
          {randomEmojis[Math.floor(Math.random() * randomEmojis.length)]}
        </div>
      ))}

      {/* Main confused content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <div className="text-center max-w-4xl">
          {/* Giant spinning HUH */}
          <div 
            className="text-9xl font-bold mb-8"
            style={{
              transform: `rotate(${rotation * 2}deg) scale(${1 + Math.sin(rotation / 10) * 0.3})`,
              color: randomColor,
              textShadow: `0 0 20px ${randomColor}`,
              transition: 'color 0.1s'
            }}
          >
            HUH?
          </div>

          {/* Random confused emoji */}
          <div 
            className="text-9xl mb-8"
            style={{
              transform: `rotate(${-rotation * 1.5}deg) scale(${1.5 + Math.cos(rotation / 15) * 0.5})`,
              display: 'inline-block'
            }}
          >
            {randomEmoji}
          </div>

          {/* Confused message that changes */}
          <div 
            className="text-4xl font-bold text-white mb-12"
            style={{
              transform: `skew(${Math.sin(rotation / 10) * 10}deg)`,
              opacity: 0.5 + Math.sin(rotation / 20) * 0.5
            }}
          >
            {confusedMessages[Math.floor(rotation / 18) % confusedMessages.length]}
          </div>

          {/* Upside down text */}
          <div 
            className="text-2xl text-yellow-300 mb-8"
            style={{
              transform: 'rotate(180deg)',
              display: 'inline-block'
            }}
          >
            ¿ʇɐɥʍ ʇıɐʍ ʇsnɾ
          </div>

          {/* Click counter */}
          <div className="text-xl text-white mb-8 opacity-70">
            You&apos;ve been confused {clickCount} times
          </div>

          {/* Spinning buttons grid */}
          <div className="grid grid-cols-3 gap-4 mb-12 max-w-2xl mx-auto">
            {[...Array(9)].map((_, i) => (
              <button
                key={i}
                onClick={handleConfusedClick}
                className="px-6 py-4 rounded-xl font-bold text-xl transition-all hover:scale-110"
                style={{
                  backgroundColor: randomColors[i % randomColors.length],
                  transform: `rotate(${Math.sin(rotation / 10 + i) * 15}deg)`,
                  animation: `spin-crazy ${2 + i * 0.5}s linear infinite`
                }}
              >
                {randomEmojis[i % randomEmojis.length]}
              </button>
            ))}
          </div>

          {/* Sideways text */}
          <div 
            className="text-3xl text-purple-400 font-bold mb-8"
            style={{
              transform: 'rotate(90deg)',
              display: 'inline-block',
              marginTop: '60px',
              marginBottom: '60px'
            }}
          >
            Why is everything sideways?
          </div>

          {/* Random facts that make no sense */}
          <div className="bg-black bg-opacity-60 rounded-3xl p-8 mb-8 border-4" style={{ borderColor: randomColor }}>
            <h2 
              className="text-3xl font-bold mb-4"
              style={{ 
                color: randomColor,
                transform: `rotate(${Math.sin(rotation / 5) * 5}deg)`
              }}
            >
              ❓ RANDOM CONFUSED FACTS ❓
            </h2>
            <div className="space-y-3 text-white text-xl">
              <p style={{ transform: `translateX(${Math.sin(rotation / 10) * 20}px)` }}>
                🤔 Did you know? {Math.floor(Math.random() * 1000)} is a number
              </p>
              <p style={{ transform: `translateX(${Math.cos(rotation / 10) * 20}px)` }}>
                😵 The color {randomColor} is definitely a color
              </p>
              <p style={{ transform: `translateX(${Math.sin(rotation / 8) * 20}px)` }}>
                🙃 This page has been rotated {Math.floor(rotation)} degrees
              </p>
              <p style={{ transform: `translateX(${Math.cos(rotation / 12) * 20}px)` }}>
                🤪 You are currently {upsideDown ? 'upside down' : 'right side up'} (probably)
              </p>
              <p style={{ transform: `translateX(${Math.sin(rotation / 15) * 20}px)` }}>
                😶 This is {clickCount === 0 ? 'definitely' : clickCount < 5 ? 'maybe' : 'absolutely not'} a real website
              </p>
            </div>
          </div>

          {/* Diagonal buttons */}
          <div className="flex gap-4 justify-center items-center flex-wrap mb-8">
            <button
              onClick={() => setRotation(prev => prev + 90)}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full text-xl font-bold transition-all hover:scale-110"
              style={{ transform: 'rotate(-15deg)' }}
            >
              🔄 Rotate Everything?
            </button>
            
            <button
              onClick={() => setUpsideDown(!upsideDown)}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full text-xl font-bold transition-all hover:scale-110"
              style={{ transform: 'rotate(15deg)' }}
            >
              🙃 Flip It!
            </button>
            
            <button
              onClick={handleConfusedClick}
              className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-red-500 text-white rounded-full text-xl font-bold transition-all hover:scale-110 animate-bounce"
            >
              ❓ Get More Confused
            </button>
          </div>

          {/* Spinning and scaling question marks */}
          <div className="text-8xl mb-8 flex justify-center gap-8">
            <span style={{ 
              transform: `rotate(${rotation}deg) scale(${1 + Math.sin(rotation / 20) * 0.3})`,
              display: 'inline-block',
              color: randomColor
            }}>
              ❓
            </span>
            <span style={{ 
              transform: `rotate(${-rotation * 2}deg) scale(${1 + Math.cos(rotation / 15) * 0.3})`,
              display: 'inline-block',
              color: randomColors[(Math.floor(rotation / 10) + 1) % randomColors.length]
            }}>
              ❔
            </span>
            <span style={{ 
              transform: `rotate(${rotation * 1.5}deg) scale(${1 + Math.sin(rotation / 25) * 0.3})`,
              display: 'inline-block',
              color: randomColors[(Math.floor(rotation / 10) + 2) % randomColors.length]
            }}>
              ⁉️
            </span>
          </div>

          {/* Warning message */}
          <div 
            className="text-2xl text-red-400 font-bold mb-8 animate-pulse"
            style={{ transform: `rotate(${Math.sin(rotation / 7) * 8}deg)` }}
          >
            ⚠️ Warning: This page may cause confusion ⚠️
          </div>

          {/* Escape button (also confused) */}
          <Link
            href="/kid"
            className="inline-block px-10 py-5 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-full text-2xl font-bold hover:scale-110 transition-all border-4 border-white"
            style={{
              transform: `rotate(${Math.sin(rotation / 5) * 10}deg)`,
              animation: 'wobble 2s ease-in-out infinite'
            }}
          >
            🚪 Escape the Confusion (Maybe?)
          </Link>

          {/* Confused footer */}
          <div className="mt-12 text-white text-sm opacity-50">
            <p>You are here: Somewhere</p>
            <p>Current status: Very confused</p>
            <p>Confusion level: {Math.floor((rotation % 100) + clickCount * 10)}%</p>
            <p style={{ transform: 'rotate(180deg)', display: 'inline-block' }}>
              ¿noʎ ǝɹɐ ʎɥʍ
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-crazy {
          0% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(90deg) scale(1.1); }
          50% { transform: rotate(180deg) scale(0.9); }
          75% { transform: rotate(270deg) scale(1.1); }
          100% { transform: rotate(360deg) scale(1); }
        }
        
        @keyframes wobble {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        
        @keyframes float-confused {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-30px) rotate(180deg);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}
