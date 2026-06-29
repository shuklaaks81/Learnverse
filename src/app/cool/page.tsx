"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { unlockAchievement } from '@/utils/achievements';

export default function CoolLearnversePage() {
  const [coolDudeSays, setCoolDudeSays] = useState("Welcome to the COOL zone, dude! 😎");
  const [showBubble, setShowBubble] = useState(true);

  const coolPhrases = [
    "Learning is totally rad! 🎸",
    "You're doing awesome, my dude! 😎",
    "Knowledge is power, baby! 💪",
    "Keep it groovy! ✌️",
    "That's what I'm talking about! 🔥",
    "You're crushing it! 🎯",
    "Stay cool, stay smart! 🧠",
    "Righteous choice, friend! 🌟",
    "You're one cool cat! 😺",
    "Learning never looked so good! ✨"
  ];

  useEffect(() => {
    const phraseInterval = setInterval(() => {
      const randomPhrase = coolPhrases[Math.floor(Math.random() * coolPhrases.length)];
      setCoolDudeSays(randomPhrase);
      setShowBubble(true);
      setTimeout(() => setShowBubble(false), 4000);
    }, 8000);

    return () => clearInterval(phraseInterval);
  }, []);

  const lessons = [
    { title: 'Math', icon: '🧮', color: 'from-orange-400 to-pink-500', desc: 'Numbers are groovy!' },
    { title: 'Science', icon: '🔬', color: 'from-green-400 to-blue-500', desc: 'Explore the universe!' },
    { title: 'Reading', icon: '📚', color: 'from-purple-400 to-pink-500', desc: 'Stories are rad!' },
    { title: 'Writing', icon: '✍️', color: 'from-yellow-400 to-orange-500', desc: 'Express yourself!' },
    { title: 'History', icon: '🏛️', color: 'from-blue-400 to-purple-500', desc: 'Time travel, baby!' },
    { title: 'Art', icon: '🎨', color: 'from-pink-400 to-red-500', desc: 'Get creative!' },
    { title: 'Music', icon: '🎵', color: 'from-indigo-400 to-purple-500', desc: 'Feel the rhythm!' },
    { title: 'Coding', icon: '💻', color: 'from-cyan-400 to-blue-500', desc: 'Build cool stuff!' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-orange-300 to-pink-400 relative overflow-hidden">
      {/* Groovy background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.5) 35px, rgba(255,255,255,.5) 70px)',
        }} />
      </div>

      {/* Floating groovy shapes */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-pulse"
          style={{
            width: `${50 + Math.random() * 100}px`,
            height: `${50 + Math.random() * 100}px`,
            background: `radial-gradient(circle, rgba(255,${Math.random() * 255},${Math.random() * 255},0.3) 0%, transparent 70%)`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `float ${5 + Math.random() * 5}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`
          }}
        />
      ))}

      {/* Cool Dude Character */}
      <div className="fixed bottom-8 left-8 z-50">
        {/* Speech Bubble */}
        {showBubble && (
          <div className="absolute bottom-full left-full ml-4 mb-4 bg-white rounded-2xl p-4 shadow-lg max-w-xs animate-bounce-in border-4 border-purple-500">
            <div className="text-lg font-bold text-purple-600">{coolDudeSays}</div>
            <div className="absolute bottom-0 left-0 transform -translate-x-3 translate-y-2">
              <div className="w-0 h-0 border-t-[20px] border-t-purple-500 border-r-[20px] border-r-transparent"></div>
              <div className="absolute top-0 left-1 w-0 h-0 border-t-[16px] border-t-white border-r-[16px] border-r-transparent"></div>
            </div>
          </div>
        )}
        
        {/* Cool Dude SVG */}
        <div className="animate-groove">
          <svg width="120" height="140" viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg">
            {/* Head */}
            <circle cx="60" cy="40" r="25" fill="#f4a460" stroke="#333" strokeWidth="3"/>
            
            {/* Cool Sunglasses */}
            <rect x="40" y="32" width="15" height="12" fill="#000" rx="2"/>
            <rect x="65" y="32" width="15" height="12" fill="#000" rx="2"/>
            <line x1="55" y1="38" x2="65" y2="38" stroke="#000" strokeWidth="3"/>
            <line x1="40" y1="38" x2="30" y2="38" stroke="#000" strokeWidth="2"/>
            <line x1="80" y1="38" x2="90" y2="38" stroke="#000" strokeWidth="2"/>
            
            {/* Cool smile */}
            <path d="M 45 50 Q 60 58 75 50" stroke="#333" strokeWidth="3" fill="none"/>
            
            {/* Hair */}
            <path d="M 35 35 Q 30 20 40 15 Q 50 10 60 12 Q 70 10 80 15 Q 90 20 85 35" fill="#8b4513" stroke="#333" strokeWidth="2"/>
            
            {/* Body - Cool shirt */}
            <rect x="35" y="65" width="50" height="40" fill="#ff6347" stroke="#333" strokeWidth="3" rx="5"/>
            
            {/* Peace sign on shirt */}
            <circle cx="60" cy="85" r="10" fill="#ffeb3b" stroke="#333" strokeWidth="2"/>
            <text x="60" y="92" fontSize="16" fill="#333" textAnchor="middle">✌️</text>
            
            {/* Arms */}
            <line x1="35" y1="75" x2="20" y2="90" stroke="#f4a460" strokeWidth="8" strokeLinecap="round"/>
            <line x1="85" y1="75" x2="100" y2="90" stroke="#f4a460" strokeWidth="8" strokeLinecap="round"/>
            
            {/* Thumbs up hand */}
            <text x="12" y="100" fontSize="20">👍</text>
            <text x="92" y="100" fontSize="20">🤙</text>
            
            {/* Legs */}
            <line x1="45" y1="105" x2="45" y2="130" stroke="#4169e1" strokeWidth="10" strokeLinecap="round"/>
            <line x1="75" y1="105" x2="75" y2="130" stroke="#4169e1" strokeWidth="10" strokeLinecap="round"/>
            
            {/* Shoes */}
            <ellipse cx="45" cy="133" rx="8" ry="5" fill="#333"/>
            <ellipse cx="75" cy="133" rx="8" ry="5" fill="#333"/>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-7xl md:text-8xl font-bold text-white mb-4 animate-wiggle" style={{
            textShadow: '4px 4px 0px #ff00ff, 8px 8px 0px #00ffff',
            fontFamily: 'Comic Sans MS, cursive'
          }}>
            😎 COOL LEARNVERSE 😎
          </h1>
          <p className="text-3xl text-purple-800 font-bold">
            Where learning meets GROOVY! ✌️
          </p>
        </div>

        {/* Lesson Cards */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {lessons.map((lesson, i) => (
            <div
              key={i}
              className={`bg-gradient-to-br ${lesson.color} rounded-3xl p-6 shadow-xl transform hover:scale-110 hover:rotate-3 transition-all cursor-pointer border-4 border-white`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="text-7xl">{lesson.icon}</div>
                  {/* Sunglasses on icons */}
                  <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <svg width="50" height="20" viewBox="0 0 50 20" xmlns="http://www.w3.org/2000/svg">
                      <rect x="5" y="5" width="15" height="10" fill="#000" rx="2"/>
                      <rect x="30" y="5" width="15" height="10" fill="#000" rx="2"/>
                      <line x1="20" y1="10" x2="30" y2="10" stroke="#000" strokeWidth="2"/>
                    </svg>
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">{lesson.title}</h2>
                <p className="text-white text-lg font-semibold">{lesson.desc}</p>
                <button className="mt-4 px-6 py-2 bg-white text-purple-600 rounded-full font-bold hover:bg-yellow-300 transition-colors shadow-lg">
                  Let's Go! 🚀
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="max-w-4xl mx-auto bg-white bg-opacity-90 rounded-3xl p-8 shadow-2xl border-4 border-purple-500 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-6xl mb-2">🏆</div>
              <div className="text-4xl font-bold text-purple-600">∞</div>
              <div className="text-lg text-gray-600">Coolness Level</div>
            </div>
            <div>
              <div className="text-6xl mb-2">⭐</div>
              <div className="text-4xl font-bold text-orange-600">MAX</div>
              <div className="text-lg text-gray-600">Groovy Points</div>
            </div>
            <div>
              <div className="text-6xl mb-2">🔥</div>
              <div className="text-4xl font-bold text-red-600">LEGEND</div>
              <div className="text-lg text-gray-600">Status</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <Link
            href="/kid"
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all hover:scale-110 shadow-lg"
          >
            ← Back to Regular Learnverse
          </Link>
          <p className="mt-4 text-purple-800 font-bold text-lg">
            Keep it cool, keep learning! 😎✨
          </p>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        @keyframes groove {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          25% { transform: translateY(-5px) rotate(0deg); }
          50% { transform: translateY(0px) rotate(2deg); }
          75% { transform: translateY(-5px) rotate(0deg); }
        }
        @keyframes bounce-in {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .animate-wiggle {
          animation: wiggle 2s ease-in-out infinite;
        }
        .animate-groove {
          animation: groove 2s ease-in-out infinite;
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
