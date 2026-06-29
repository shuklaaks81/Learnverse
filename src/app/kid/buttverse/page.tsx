"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

/**
 * THE BUTTVERSE
 * 
 * A dimension where everything was thought to be butts...
 * Until scientists made a SHOCKING discovery!
 * And then... THE POOP APOCALYPSE!
 * 
 * The greatest story never told.
 */

export default function Buttverse() {
  const [showWarning, setShowWarning] = useState(true);
  const [poopCount, setPoopCount] = useState(0);

  useEffect(() => {
    // Poop apocalypse counter
    const interval = setInterval(() => {
      setPoopCount(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const newsHeadlines = [
    "🍑 Scientists Discover NOT Everything is Butts!",
    "💀 The Biggest Butt of All Time Has Died",
    "💩 BREAKING: Poop Apocalypse Imminent!",
    "🔬 Butt Research Leads to Shocking Revelation",
    "😱 Citizens Shocked: Chairs Are NOT Butts!",
    "🎭 Memorial Ceremony for Fallen Butt Held",
    "⚠️ Prepare for Incoming Poop Invasion!",
    "🍑 Butt Scientists: 'We Were Wrong All Along'",
  ];

  const [currentHeadline, setCurrentHeadline] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeadline(prev => (prev + 1) % newsHeadlines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [newsHeadlines.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-brown-300 p-8 overflow-hidden relative">
      
      {/* POOP APOCALYPSE WARNING */}
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center animate-pulse">
          <div className="bg-red-600 text-white p-12 rounded-3xl border-8 border-yellow-400 max-w-2xl text-center shadow-2xl">
            <div className="text-8xl mb-4">⚠️💩⚠️</div>
            <h1 className="text-5xl font-bold mb-4">POOP APOCALYPSE WARNING!</h1>
            <p className="text-2xl mb-6">The poops are coming! Are you prepared?!</p>
            <button 
              onClick={() => setShowWarning(false)}
              className="bg-yellow-400 text-black px-8 py-4 rounded-xl font-bold text-2xl hover:scale-110 transition-transform shadow-lg"
            >
              I&apos;M READY! 💪
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-7xl font-bold text-brown-800 mb-4 drop-shadow-lg animate-bounce">
          🍑 THE BUTTVERSE 🍑
        </h1>
        <p className="text-2xl text-purple-900 font-semibold">
          Where Everything Was Butts... Until It Wasn&apos;t!
        </p>
      </div>

      {/* Breaking News Ticker */}
      <div className="bg-red-600 text-white py-4 px-8 mb-8 overflow-hidden">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-bold animate-pulse">🚨 BREAKING:</span>
          <div className="text-xl font-semibold animate-marquee">
            {newsHeadlines[currentHeadline]}
          </div>
        </div>
      </div>

      {/* Poop Apocalypse Counter */}
      <div className="bg-brown-600 text-white p-6 rounded-2xl mb-8 text-center border-4 border-brown-800">
        <div className="text-3xl font-bold mb-2">💩 POOP APOCALYPSE TIMER 💩</div>
        <div className="text-6xl font-bold">{poopCount} SECONDS</div>
        <div className="text-xl mt-2">Poops incoming in: UNKNOWN</div>
      </div>

      {/* The Story Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-3xl p-6 shadow-2xl border-4 border-purple-400">
          <div className="text-5xl mb-3">🍑</div>
          <h3 className="text-2xl font-bold mb-3 text-purple-700">Chapter 1: The Butt Era</h3>
          <p className="text-lg">
            In the beginning, everyone in the Buttverse believed EVERYTHING was butts. 
            The sky? Butt. Mountains? Butts. Your homework? Also butts.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-2xl border-4 border-blue-400">
          <div className="text-5xl mb-3">🔬</div>
          <h3 className="text-2xl font-bold mb-3 text-blue-700">Chapter 2: The Discovery</h3>
          <p className="text-lg">
            Then scientists made a SHOCKING discovery: Not everything is butts! 
            Some things are... OTHER things! The Buttverse would never be the same.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-2xl border-4 border-gray-400">
          <div className="text-5xl mb-3">💀</div>
          <h3 className="text-2xl font-bold mb-3 text-gray-700">Chapter 3: The Tragedy</h3>
          <p className="text-lg">
            The Biggest Butt of All Time couldn&apos;t handle the truth. It had a big ceremony. 
            Thousands attended. Many tears were shed. 🕯️
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-2xl border-4 border-red-400 animate-pulse">
          <div className="text-5xl mb-3">💩</div>
          <h3 className="text-2xl font-bold mb-3 text-red-700">Chapter 4: THE POOP APOCALYPSE!</h3>
          <p className="text-lg">
            But the butts weren&apos;t gone for good! The POOPS are coming! 
            Prepare yourself for the greatest invasion in Buttverse history!
          </p>
        </div>
      </div>

      {/* Butt Activities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <button className="bg-gradient-to-br from-pink-400 to-pink-600 text-white p-8 rounded-2xl font-bold text-xl hover:scale-105 transition-transform shadow-xl">
          🍑 BUTT LESSONS<br/>
          <span className="text-sm">Learn about butt history!</span>
        </button>
        
        <button className="bg-gradient-to-br from-purple-400 to-purple-600 text-white p-8 rounded-2xl font-bold text-xl hover:scale-105 transition-transform shadow-xl">
          🔬 BUTT SCIENCE<br/>
          <span className="text-sm">Discover butt physics!</span>
        </button>
        
        <button className="bg-gradient-to-br from-brown-400 to-brown-600 text-white p-8 rounded-2xl font-bold text-xl hover:scale-105 transition-transform shadow-xl">
          💩 POOP DEFENSE<br/>
          <span className="text-sm">Prepare for invasion!</span>
        </button>

        <button className="bg-gradient-to-br from-yellow-400 to-orange-600 text-white p-8 rounded-2xl font-bold text-xl hover:scale-105 transition-transform shadow-xl">
          📰 BUTT NEWS<br/>
          <span className="text-sm">Latest butt updates!</span>
        </button>
        
        <button className="bg-gradient-to-br from-green-400 to-green-600 text-white p-8 rounded-2xl font-bold text-xl hover:scale-105 transition-transform shadow-xl">
          🛒 BUTT SHOP<br/>
          <span className="text-sm">Buy with butt-coins!</span>
        </button>
        
        <button className="bg-gradient-to-br from-red-400 to-red-600 text-white p-8 rounded-2xl font-bold text-xl hover:scale-105 transition-transform shadow-xl">
          🏆 BUTT TROPHY<br/>
          <span className="text-sm">Honor the fallen!</span>
        </button>
      </div>

      {/* Memorial */}
      <div className="bg-gradient-to-br from-gray-700 to-gray-900 text-white p-8 rounded-3xl mb-8 border-4 border-yellow-400">
        <div className="text-center">
          <div className="text-6xl mb-4">🕯️</div>
          <h2 className="text-4xl font-bold mb-4">IN MEMORY OF</h2>
          <h3 className="text-5xl font-bold mb-4">THE BIGGEST BUTT</h3>
          <p className="text-2xl mb-4">20XX - 2026</p>
          <p className="text-xl italic">&quot;It was the greatest butt the Buttverse ever knew&quot;</p>
          <div className="flex justify-center gap-4 mt-6 text-4xl">
            🕯️ 🍑 🕯️
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-center gap-4 mb-8">
        <Link href="/kid">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-xl transition-all shadow-lg">
            ⬅️ ESCAPE BUTTVERSE
          </button>
        </Link>
        
        <Link href="/kid/1d">
          <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-xl transition-all shadow-lg">
            🎯 VISIT 1D DIMENSION
          </button>
        </Link>
      </div>

      {/* Floating Butts and Poops */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array(20).fill(0).map((_, i) => (
          <div
            key={i}
            className="absolute text-6xl animate-float-butt"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`
            }}
          >
            {Math.random() > 0.5 ? '🍑' : '💩'}
          </div>
        ))}
      </div>

      {/* Styles */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes float-butt {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
          50% { transform: translateY(-150px) rotate(360deg); opacity: 1; }
        }
        .animate-marquee {
          animation: marquee 15s linear infinite;
        }
        .animate-float-butt {
          animation: float-butt infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
