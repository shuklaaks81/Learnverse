"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { unlockAchievement } from '@/utils/achievements';

export default function BruPage() {
  const [timeWaited, setTimeWaited] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [showSecret, setShowSecret] = useState(false);

  // Unlock achievement
  useEffect(() => {
    unlockAchievement('bru');
  }, []);

  // Count real time waited (in seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeWaited(prev => prev + 1);
      
      // After 14 seconds of real time, show the secret message
      if (timeWaited >= 13 && !showSecret) {
        setShowSecret(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeWaited, showSecret]);

  const handleClick = () => {
    const newClicks = clicks + 1;
    setClicks(newClicks);
    
    // Also trigger secret after 14 clicks
    if (newClicks >= 14 && !showSecret) {
      setShowSecret(true);
    }
  };

  // Convert real seconds to fake quadrillion years countdown
  const quadrillionsRemaining = Math.max(0, 16 - (timeWaited / 1000000000000000));
  const displayYears = quadrillionsRemaining.toFixed(15);

  if (showSecret) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-8">
        <div className="text-center max-w-4xl">
          <div className="text-9xl mb-8">🤯</div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-green-400 mb-8">
            WOW
          </h1>
          
          <p className="text-3xl md:text-5xl text-white mb-12">
            You really waited that long?
          </p>
          
          <div className="text-xl md:text-2xl text-gray-400 mb-8">
            <p>Actual time waited: {timeWaited} seconds</p>
            <p className="mt-2">Clicks: {clicks}</p>
            <p className="mt-4 text-sm text-gray-500">
              (Spoiler: You didn&apos;t really wait 14 quadrillion years)
            </p>
          </div>

          <div className="mb-12">
            <div className="text-7xl mb-4">🎉</div>
            <p className="text-2xl text-yellow-300">
              Congratulations on your incredible patience!
            </p>
          </div>

          <Link
            href="/kid"
            className="inline-block px-10 py-5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-2xl font-bold transition-all hover:scale-110"
          >
            Return to Reality
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="text-center max-w-4xl">
        <div className="text-9xl mb-12">⏳</div>
        
        <h1 className="text-3xl md:text-5xl text-red-400 font-mono mb-8">
          BRU
        </h1>
        
        <div 
          className="text-xl md:text-3xl text-gray-300 mb-12 leading-relaxed cursor-pointer hover:text-gray-100 transition-colors"
          onClick={handleClick}
        >
          Sorry for the inconvenience.
          <br />
          <br />
          Please try again in
          <br />
          <br />
          <span className="text-4xl md:text-6xl font-bold text-yellow-400">
            {displayYears}
          </span>
          <br />
          <span className="text-2xl md:text-4xl text-yellow-300">
            quadrillion years
          </span>
        </div>

        <div className="text-sm text-gray-600 mb-8">
          <p>Time remaining: 16,000,000,000,000,000 years</p>
          <p className="mt-2 text-xs">(approximately)</p>
        </div>

        <div className="mt-12 text-xs text-gray-700">
          <p>Hint: Maybe you don&apos;t have to wait that long...</p>
          <p className="mt-1">Clicks: {clicks} | Waited: {timeWaited}s</p>
        </div>

        <div className="mt-8">
          <Link
            href="/kid"
            className="inline-block px-8 py-3 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg text-lg transition-all"
          >
            Give Up
          </Link>
        </div>
      </div>
    </div>
  );
}
