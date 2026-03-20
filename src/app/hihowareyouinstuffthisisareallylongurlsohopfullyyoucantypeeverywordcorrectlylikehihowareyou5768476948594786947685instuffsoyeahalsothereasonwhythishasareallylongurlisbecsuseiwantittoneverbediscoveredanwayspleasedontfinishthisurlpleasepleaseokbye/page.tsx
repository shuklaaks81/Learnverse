"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SecretUltraLongURLPage() {
  const [typed, setTyped] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);

  const urlLength = 'hihowareyouinstuffthisisareallylongurlsohopfullyyoucantypeeverywordcorrectlylikehihowareyou5768476948594786947685instuffsoyeahalsothereasonwhythishasareallylongurlisbecsuseiwantittoneverbediscoveredanwayspleasedontfinishthisurlpleasepleaseokbye'.length;

  useEffect(() => {
    setTimeout(() => setShowCelebration(true), 1000);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.length === 1) {
        setTyped(prev => prev + e.key);
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 overflow-hidden relative">
      {/* Celebration confetti effect */}
      {showCelebration && (
        <>
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute text-4xl animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-50px',
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
                opacity: Math.random()
              }}
            >
              {['🎉', '🎊', '✨', '⭐', '🌟', '💫', '🎈', '🎆'][Math.floor(Math.random() * 8)]}
            </div>
          ))}
        </>
      )}

      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <div className="text-center max-w-5xl">
          {/* Trophy */}
          <div className="text-9xl mb-8 animate-bounce">
            🏆
          </div>

          {/* Main congratulations */}
          <h1 className="text-6xl md:text-8xl font-bold text-yellow-300 mb-8 animate-pulse">
            HOLY COW!!!
          </h1>

          <div className="text-3xl md:text-5xl text-white font-bold mb-12">
            You actually typed ALL of that?!
          </div>

          {/* Stats */}
          <div className="bg-black bg-opacity-60 rounded-3xl p-8 mb-12 border-4 border-yellow-400">
            <h2 className="text-3xl font-bold text-yellow-300 mb-6">🎖️ ACHIEVEMENT UNLOCKED 🎖️</h2>
            
            <div className="space-y-4 text-white text-xl">
              <div className="flex items-center justify-center gap-3">
                <span className="text-4xl">⌨️</span>
                <span>Characters typed: <span className="text-yellow-300 font-bold">{urlLength}</span></span>
              </div>
              
              <div className="flex items-center justify-center gap-3">
                <span className="text-4xl">🔤</span>
                <span>URL difficulty: <span className="text-red-400 font-bold">IMPOSSIBLE</span></span>
              </div>
              
              <div className="flex items-center justify-center gap-3">
                <span className="text-4xl">🧠</span>
                <span>Brain cells used: <span className="text-purple-400 font-bold">All of them</span></span>
              </div>
              
              <div className="flex items-center justify-center gap-3">
                <span className="text-4xl">⏱️</span>
                <span>Dedication level: <span className="text-green-400 font-bold">LEGENDARY</span></span>
              </div>

              <div className="flex items-center justify-center gap-3">
                <span className="text-4xl">🤯</span>
                <span>People who will find this: <span className="text-blue-400 font-bold">Basically none</span></span>
              </div>
            </div>
          </div>

          {/* Funny commentary */}
          <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl p-8 mb-8 border-4 border-pink-400">
            <div className="text-white space-y-4 text-lg md:text-xl">
              <p className="font-bold text-2xl mb-4">Let&apos;s break down what just happened:</p>
              
              <p>✅ You saw a {urlLength}-character URL</p>
              <p>✅ You said &quot;yeah I can type that&quot;</p>
              <p>✅ You actually DID type ALL of it</p>
              <p>✅ You didn&apos;t give up halfway</p>
              <p>✅ You ignored the part that said &quot;please dont finish this url&quot;</p>
              <p>✅ You made it here anyway</p>
              
              <p className="text-yellow-300 font-bold text-2xl mt-6">
                Absolute LEGEND status achieved! 👑
              </p>
            </div>
          </div>

          {/* The URL itself broken down */}
          <div className="bg-black bg-opacity-80 rounded-2xl p-8 mb-8 border-4 border-blue-400">
            <h3 className="text-2xl font-bold text-blue-300 mb-4">📝 What you just typed:</h3>
            <div className="text-sm md:text-base text-gray-300 font-mono break-all leading-relaxed">
              hihowareyouinstuffthisisareallylongurlsohopfullyyoucantypeeverywordcorrectlylikehihowareyou5768476948594786947685instuffsoyeahalsothereasonwhythishasareallylongurlisbecsuseiwantittoneverbediscoveredanwayspleasedontfinishthisurlpleasepleaseokbye
            </div>
            <div className="mt-4 text-yellow-400 text-sm">
              (Yes, all {urlLength} characters of pure determination)
            </div>
          </div>

          {/* Secret message */}
          <div className="text-2xl text-pink-300 mb-8 italic">
            &quot;I asked you not to finish the URL... but you did it anyway.
            <br />
            I&apos;m not even mad. That&apos;s impressive.&quot; 😌
          </div>

          {/* Typing showcase */}
          {typed.length > 0 && (
            <div className="bg-green-900 bg-opacity-40 rounded-xl p-4 mb-8 border-2 border-green-400">
              <p className="text-green-300 text-sm mb-2">What you&apos;re typing now:</p>
              <p className="text-white font-mono text-lg break-all">{typed}</p>
            </div>
          )}

          {/* Awards */}
          <div className="flex flex-wrap justify-center gap-4 mb-12 text-6xl">
            <div className="animate-spin-slow">🏅</div>
            <div className="animate-bounce" style={{ animationDelay: '0.1s' }}>🥇</div>
            <div className="animate-pulse" style={{ animationDelay: '0.2s' }}>👑</div>
            <div className="animate-spin-slow" style={{ animationDelay: '0.3s' }}>⭐</div>
            <div className="animate-bounce" style={{ animationDelay: '0.4s' }}>💎</div>
          </div>

          {/* Special title */}
          <div className="bg-gradient-to-r from-yellow-400 via-red-400 to-pink-400 text-black rounded-xl p-6 mb-8 font-bold text-2xl">
            🎭 You are now officially a
            <br />
            <span className="text-4xl">URL TYPING MASTER</span>
            <br />
            Level: MAX
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link
              href="/kid"
              className="px-10 py-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-2xl font-bold hover:scale-110 transition-all border-4 border-green-300 shadow-2xl"
            >
              🎉 Celebrate Victory
            </Link>
            
            <button
              onClick={() => {
                navigator.clipboard?.writeText('localhost:3000/hihowareyouinstuffthisisareallylongurlsohopfullyyoucantypeeverywordcorrectlylikehihowareyou5768476948594786947685instuffsoyeahalsothereasonwhythishasareallylongurlisbecsuseiwantittoneverbediscoveredanwayspleasedontfinishthisurlpleasepleaseokbye');
                alert('URL copied! Share your achievement! (but good luck explaining why you typed this)');
              }}
              className="px-10 py-5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-2xl font-bold hover:scale-110 transition-all border-4 border-blue-300 shadow-2xl"
            >
              📋 Copy URL
            </button>
          </div>

          {/* Secret hint about okbye */}
          <div className="mt-12 bg-gradient-to-r from-indigo-900 to-purple-900 rounded-2xl p-6 border-4 border-indigo-400">
            <p className="text-white text-lg mb-4">
              🤔 Remember the last letters that spell <span className="text-yellow-300 font-bold">okbye</span>?
            </p>
            <p className="text-2xl text-white font-bold mb-4">
              Yeah... byeeeeeee! 👋
            </p>
            <Link
              href="/hihowareyouinstuffthisisareallylongurlsohopfullyyoucantypeeverywordcorrectlylikehihowareyou5768476948594786947685instuffsoyeahalsothereasonwhythishasareallylongurlisbecsuseiwantittoneverbediscoveredanwayspleasedontfinishthisurlpleasepleaseokbye/okbye"
              className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-xl font-bold hover:scale-110 transition-all border-4 border-purple-300"
            >
              ✨ One More Secret...
            </Link>
          </div>

          {/* Footer message */}
          <div className="mt-12 text-gray-400 text-sm">
            <p>Seriously though, your dedication is unmatched.</p>
            <p className="mt-2">I said &quot;please please ok bye&quot; and you ignored me.</p>
            <p className="mt-2 text-yellow-300">Respect. 🫡</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes spin-slow {
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-fall {
          animation: fall linear forwards;
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
