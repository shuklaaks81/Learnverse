'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function BananaDimension() {
  const [isChewing, setIsChewing] = useState(false);
  const [blueBananaRotation, setBlueBananaRotation] = useState(0);

  useEffect(() => {
    const chewInterval = setInterval(() => {
      setIsChewing(prev => !prev);
    }, 600);

    const rotateInterval = setInterval(() => {
      setBlueBananaRotation(prev => (prev + 2) % 360);
    }, 20);

    return () => {
      clearInterval(chewInterval);
      clearInterval(rotateInterval);
    };
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-yellow-200 via-yellow-100 to-orange-100 relative overflow-hidden p-4">
      {/* Floating banana emotes background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute text-6xl opacity-10 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
            }}
          >
            🍌
          </div>
        ))}
      </div>

      {/* Welcome text */}
      <h1 className="text-5xl sm:text-6xl font-bold text-yellow-900 mb-4 text-center relative z-10 drop-shadow-lg">
        Welcome to the Banana Dimension
      </h1>

      <p className="text-2xl sm:text-3xl text-yellow-800 mb-12 text-center relative z-10 font-semibold drop-shadow-md">
        Meet Bob The Banana
      </p>

      {/* Bob The Banana - Main */}
      <div className="relative z-20 mb-12">
        {/* Bob's body */}
        <svg
          width="250"
          height="250"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform duration-200 ${isChewing ? 'scale-95' : 'scale-100'}`}
          style={{
            filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))',
          }}
        >
          {/* Banana body */}
          <path
            d="M 20 60 Q 30 20, 70 30 Q 75 32, 75 40"
            stroke="#FFD700"
            strokeWidth="18"
            strokeLinecap="round"
            fill="none"
          />

          {/* Banana peel details */}
          <path
            d="M 20 60 Q 30 20, 70 30"
            stroke="#FFC700"
            strokeWidth="2"
            fill="none"
            opacity="0.6"
          />

          {/* Top of banana */}
          <circle cx="20" cy="60" r="9" fill="#8B7500" opacity="0.8" />

          {/* Bottom of banana */}
          <circle cx="75" cy="40" r="7" fill="#8B7500" opacity="0.8" />

          {/* Shine effect */}
          <ellipse cx="45" cy="25" rx="15" ry="8" fill="#FFFF00" opacity="0.4" />

          {/* Eyes */}
          <circle cx="60" cy="25" r="3" fill="#000" />
          <circle cx="68" cy="25" r="3" fill="#000" />

          {/* Mouth - smile */}
          <path
            d="M 62 33 Q 65 35, 68 33"
            stroke="#000"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Blue Banana - Being eaten */}
      <div
        className="relative z-20 mb-12"
        style={{
          transform: `rotate(${blueBananaRotation}deg) translateY(-20px)`,
          transformOrigin: 'center',
          transition: 'transform 0.02s linear',
        }}
      >
        <svg
          width="180"
          height="180"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="opacity-90"
          style={{
            filter: 'drop-shadow(0 0 15px rgba(59, 130, 246, 0.8))',
          }}
        >
          {/* Blue Banana body */}
          <path
            d="M 15 65 Q 25 25, 65 35 Q 70 37, 70 45"
            stroke="#3B82F6"
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
          />

          {/* Blue banana peel details */}
          <path
            d="M 15 65 Q 25 25, 65 35"
            stroke="#1E40AF"
            strokeWidth="2"
            fill="none"
            opacity="0.6"
          />

          {/* Top and bottom */}
          <circle cx="15" cy="65" r="8" fill="#1E40AF" opacity="0.8" />
          <circle cx="70" cy="45" r="6" fill="#1E40AF" opacity="0.8" />

          {/* Shine */}
          <ellipse cx="40" cy="30" rx="14" ry="7" fill="#60A5FA" opacity="0.4" />
        </svg>
      </div>

      {/* Chewing indicator */}
      <div className="relative z-10 mb-8 text-center">
        <p className="text-3xl font-bold text-yellow-900 drop-shadow-md">
          {isChewing ? 'MUNCH MUNCH MUNCH' : 'Nom nom nom...'}
        </p>
      </div>

      {/* Fun facts */}
      <div className="relative z-10 bg-white/80 backdrop-blur rounded-3xl p-8 max-w-2xl mb-12 shadow-2xl border-4 border-yellow-400">
        <h2 className="text-2xl font-bold text-yellow-900 mb-4 text-center">About Bob The Banana</h2>
        <div className="space-y-2 text-lg text-yellow-800 font-semibold text-center">
          <p>Full Name: Bob The Banana</p>
          <p>Favorite Snack: Blue Bananas</p>
          <p>Home: The Banana Dimension</p>
          <p>Hobby: Just vibing</p>
          <p className="text-2xl pt-2">Status: LIVING HIS BEST LIFE</p>
        </div>
      </div>

      {/* Back button */}
      <Link href="/" className="relative z-10">
        <button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-2xl font-bold text-xl hover:scale-110 transition-transform shadow-lg border-4 border-yellow-600">
          Leave the Banana Dimension
        </button>
      </Link>
    </div>
  );
}
