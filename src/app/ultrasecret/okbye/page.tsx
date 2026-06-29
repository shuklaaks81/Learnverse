"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { unlockAchievement } from '@/utils/achievements';

export default function OkByePage() {
  const [waveIntensity, setWaveIntensity] = useState(0);
  const [byeCount, setByeCount] = useState(1);

  useEffect(() => {
    unlockAchievement('okbye');
    const interval = setInterval(() => {
      setWaveIntensity(prev => (prev + 1) % 20);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const byeInterval = setInterval(() => {
      if (byeCount < 50) {
        setByeCount(prev => prev + 1);
      }
    }, 200);

    return () => clearInterval(byeInterval);
  }, [byeCount]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 overflow-hidden relative">
      {/* Floating goodbye emojis */}
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute text-5xl animate-float-away"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
            opacity: 0.6
          }}
        >
          {['👋', '✌️', '🫡', '😊', '💜', '✨'][Math.floor(Math.random() * 6)]}
        </div>
      ))}

      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <div className="text-center max-w-4xl">
          {/* Giant waving hand */}
          <div 
            className="text-9xl mb-8"
            style={{
              transform: `rotate(${Math.sin(waveIntensity / 2) * 30}deg)`,
              display: 'inline-block',
              transition: 'transform 0.2s'
            }}
          >
            👋
          </div>

          {/* Main message */}
          <h1 className="text-6xl md:text-8xl font-bold text-yellow-300 mb-8">
            OK BYE!
          </h1>

          <div className="text-3xl md:text-5xl text-white font-bold mb-12">
            You found the secret ending!
          </div>

          {/* Many byes */}
          <div className="bg-black bg-opacity-60 rounded-3xl p-8 mb-12 border-4 border-yellow-400 max-h-96 overflow-y-auto">
            <div className="text-white text-2xl space-y-2">
              {[...Array(byeCount)].map((_, i) => (
                <div 
                  key={i}
                  className="animate-fade-in"
                  style={{
                    animationDelay: `${i * 0.05}s`,
                    opacity: 1 - (i / byeCount) * 0.5
                  }}
                >
                  {'Bye' + 'e'.repeat(Math.min(i, 10))}... 👋
                </div>
              ))}
            </div>
          </div>

          {/* Farewell message */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 mb-8 border-4 border-purple-400">
            <div className="text-white space-y-4 text-lg md:text-xl">
              <p className="font-bold text-2xl mb-4">✨ Congratulations! ✨</p>
              
              <p>You discovered ALL the secrets:</p>
              <p>✅ Typed the impossibly long URL</p>
              <p>✅ Remembered &quot;okbye&quot; at the end</p>
              <p>✅ Found this hidden goodbye page</p>
              
              <p className="text-yellow-300 font-bold text-2xl mt-6">
                You&apos;re officially a MASTER EXPLORER! 🗺️
              </p>
            </div>
          </div>

          {/* Farewell stats */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 mb-8 border-4 border-blue-400">
            <h3 className="text-2xl font-bold text-blue-300 mb-4">📊 Farewell Stats</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white text-lg">
              <div>👋 Times waved: Infinite</div>
              <div>✨ Secrets discovered: All of them</div>
              <div>🎉 Fun level: Maximum</div>
              <div>😊 Happiness gained: +1000</div>
            </div>
          </div>

          {/* Poetic goodbye */}
          <div className="text-2xl text-pink-200 mb-8 italic leading-relaxed">
            &quot;You came, you typed, you conquered.
            <br />
            Now go forth and share your tales of legendary typing.
            <br />
            May your keyboard never jam,
            <br />
            And your URLs always load.&quot;
            <br />
            <span className="text-yellow-300 font-bold not-italic">- The Internet, probably</span>
          </div>

          {/* Easter egg counter */}
          <div className="bg-black bg-opacity-80 rounded-xl p-6 mb-8 border-2 border-green-400">
            <h3 className="text-green-300 font-bold text-xl mb-3">🎯 Easter Eggs Found:</h3>
            <div className="text-white text-left space-y-2">
              <p>✅ Ghost/Abandoned Learnverse</p>
              <p>✅ Space Exploration Game</p>
              <p>✅ Cool/Groovy Version</p>
              <p>✅ Gamer Mode</p>
              <p>✅ Blocky World (Minecraft style)</p>
              <p>✅ HUH? Confusion Page</p>
              <p>✅ BRU Wait Forever Page</p>
              <p>✅ Ultra-Long Secret URL</p>
              <p className="text-yellow-300 font-bold">✨ OKBYE Final Secret! (You are here)</p>
            </div>
          </div>

          {/* Final buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link
              href="/kid"
              className="px-10 py-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-2xl font-bold hover:scale-110 transition-all border-4 border-green-300 shadow-2xl"
            >
              🏠 Return Home
            </Link>
            
            <Link
              href="/ultrasecret"
              className="px-10 py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-2xl font-bold hover:scale-110 transition-all border-4 border-purple-300 shadow-2xl"
            >
              ⬅️ Back to Achievement
            </Link>
          </div>

          {/* Spinning goodbye emojis */}
          <div className="flex justify-center gap-8 mb-8 text-6xl">
            {['👋', '✌️', '🫡', '😊', '💜', '✨'].map((emoji, i) => (
              <div
                key={i}
                className="animate-spin-slow"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: `${3 + i * 0.5}s`
                }}
              >
                {emoji}
              </div>
            ))}
          </div>

          {/* The actual end */}
          <div className="text-6xl font-bold text-white mb-4">
            THE END
          </div>
          
          <div className="text-xl text-gray-400">
            (Or is it? There might be more Easter eggs... who knows? 😏)
          </div>

          {/* Thank you note */}
          <div className="mt-12 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl p-6 border-4 border-yellow-400">
            <p className="text-white text-2xl font-bold mb-3">
              Thanks for exploring! 🎉
            </p>
            <p className="text-white text-lg">
              Enjoy all these mods that you can add to your app!
            </p>
            <p className="text-yellow-200 text-sm mt-3">
              You&apos;re awesome for finding everything! 🌟
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-away {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0;
          }
          20% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-100vh) translateX(${Math.random() > 0.5 ? '' : '-'}50px) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes spin-slow {
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-float-away {
          animation: float-away linear infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        
        .animate-spin-slow {
          animation: spin-slow linear infinite;
          display: inline-block;
        }
      `}</style>
    </div>
  );
}
