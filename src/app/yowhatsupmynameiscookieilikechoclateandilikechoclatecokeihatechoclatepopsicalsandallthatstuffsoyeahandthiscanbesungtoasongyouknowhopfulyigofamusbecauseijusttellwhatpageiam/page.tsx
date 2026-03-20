"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { unlockAchievement } from '@/utils/achievements';

const lyrics = [
  {
    text: "🎤 YO! WHAT'S UP!",
    subtext: "My name is Cookie!",
    emoji: "🍪"
  },
  {
    text: "I like chocolate 🍫",
    subtext: "And I like chocolate coke!",
    emoji: "🥤"
  },
  {
    text: "I HATE chocolate popsicles 🚫🍦",
    subtext: "And all that stuff, so yeah!",
    emoji: "😤"
  },
  {
    text: "This can be sung to a song! 🎵",
    subtext: "You know... hopefully...",
    emoji: "🎶"
  },
  {
    text: "I go famous because... 🤔",
    subtext: "I just tell what page I am!",
    emoji: "🤯"
  },
  {
    text: "I'M ON:",
    subtext: "/yowhatsupmynameiscookieilikechoclateandilikechoclatecokeihatechoclatepopsicalsandallthatstuffsoyeahandthiscanbesungtoasongyouknowhopfulyigofamusbecauseijusttellwhatpageiam",
    emoji: "🎉",
    final: true
  }
];

export default function CookieSongPage() {
  const [verse, setVerse] = useState(0);
  const [beat, setBeat] = useState(0);
  const [fans, setFans] = useState(0);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });
  const [showConfetti, setShowConfetti] = useState(false);
  const [isFamous, setIsFamous] = useState(false);

  useEffect(() => {
    unlockAchievement('cookie');
  }, []);

  // Beat pulse
  useEffect(() => {
    const beatInterval = setInterval(() => {
      setBeat(prev => (prev + 1) % 4);
    }, 500);
    return () => clearInterval(beatInterval);
  }, []);

  // Spotlight movement
  useEffect(() => {
    const spotlightInterval = setInterval(() => {
      setSpotlight({
        x: 50 + Math.sin(Date.now() / 1000) * 20,
        y: 50 + Math.cos(Date.now() / 1000) * 10
      });
    }, 100);
    return () => clearInterval(spotlightInterval);
  }, []);

  // Auto-advance verses
  useEffect(() => {
    if (verse < lyrics.length - 1) {
      const verseTimer = setTimeout(() => {
        setVerse(prev => prev + 1);
        setFans(prev => prev + Math.floor(Math.random() * 50 + 20));
      }, verse === 0 ? 3000 : 4000);
      return () => clearTimeout(verseTimer);
    } else if (verse === lyrics.length - 1 && !isFamous) {
      // Become famous!
      const fameTimer = setTimeout(() => {
        setIsFamous(true);
        setShowConfetti(true);
        setFans(999999);
      }, 2000);
      return () => clearTimeout(fameTimer);
    }
  }, [verse, isFamous]);

  const currentLyric = lyrics[verse] || lyrics[lyrics.length - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Stage spotlight */}
      <div 
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-40 pointer-events-none transition-all duration-100"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)',
          left: `${spotlight.x}%`,
          top: `${spotlight.y}%`,
          transform: 'translate(-50%, -50%)'
        }}
      />

      {/* Confetti */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute text-4xl animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              {['🎉', '⭐', '✨', '🎊', '💫'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      {/* Audience silhouettes */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-around px-4 pb-4">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`text-4xl transform transition-all duration-300 ${
              beat % 2 === 0 ? 'scale-110' : 'scale-100'
            }`}
            style={{
              animationDelay: `${i * 0.1}s`,
              opacity: 0.4 + (fans / 100) * 0.4
            }}
          >
            👤
          </div>
        ))}
      </div>

      {/* Main stage */}
      <div className="relative z-10 max-w-5xl text-center">
        {/* Cookie performer */}
        <div 
          className={`text-9xl mb-8 transform transition-all duration-300 ${
            beat % 2 === 0 ? 'scale-110 rotate-6' : 'scale-100 rotate-0'
          }`}
        >
          {currentLyric.emoji}
        </div>

        {/* Lyrics display */}
        <div className={`bg-black/50 backdrop-blur-sm rounded-3xl p-8 mb-6 border-4 ${
          isFamous ? 'border-yellow-400 shadow-2xl shadow-yellow-400/50' : 'border-pink-500'
        } transform transition-all duration-500 ${
          beat === 0 ? 'scale-105' : 'scale-100'
        }`}>
          <h1 className="text-5xl md:text-7xl font-black mb-4 animate-pulse bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            {currentLyric.text}
          </h1>
          <p className={`text-2xl md:text-3xl font-mono ${
            currentLyric.final ? 'text-yellow-300 text-sm md:text-base break-all' : 'text-pink-300'
          }`}>
            {currentLyric.subtext}
          </p>
        </div>

        {/* Music bars */}
        <div className="flex justify-center gap-2 mb-8">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="w-4 bg-gradient-to-t from-pink-500 to-purple-500 rounded-full transition-all duration-200"
              style={{
                height: `${20 + Math.sin(Date.now() / 200 + i) * 40 + (beat === i % 4 ? 20 : 0)}px`,
                opacity: 0.6 + (beat === i % 4 ? 0.4 : 0)
              }}
            />
          ))}
        </div>

        {/* Fame counter */}
        <div className="bg-purple-900/70 rounded-2xl p-4 mb-6 border-2 border-purple-400">
          <div className="flex items-center justify-center gap-3 text-2xl font-bold">
            <span className={beat % 2 === 0 ? 'animate-bounce' : ''}>👥</span>
            <span className={isFamous ? 'text-yellow-400 animate-pulse' : 'text-white'}>
              {isFamous ? '999,999+' : fans.toLocaleString()} FANS!
            </span>
            <span className={beat % 2 === 1 ? 'animate-bounce' : ''}>⭐</span>
          </div>
          {isFamous && (
            <p className="text-yellow-300 text-sm mt-2 animate-pulse">
              🎉 COOKIE HAS GONE VIRAL! 🎉
            </p>
          )}
        </div>

        {/* Verse progress */}
        {!isFamous && (
          <div className="flex justify-center gap-2 mb-6">
            {lyrics.map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all ${
                  i <= verse ? 'bg-pink-400' : 'bg-gray-600'
                } ${i === verse ? 'scale-150' : 'scale-100'}`}
              />
            ))}
          </div>
        )}

        {isFamous && (
          <div className="space-y-4 animate-pulse">
            <p className="text-3xl font-bold">
              🏆 COOKIE IS NOW A SUPERSTAR! 🏆
            </p>
            <p className="text-xl text-pink-300">
              By revealing my URL, I became the most famous page ever! 😎
            </p>
            <p className="text-sm text-gray-300">
              (Thanks for finding me!)
            </p>
          </div>
        )}

        <div className="mt-8">
          <Link 
            href="/kid"
            className="inline-block bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 text-white font-bold text-xl px-8 py-4 rounded-full hover:scale-110 transition-transform shadow-2xl"
          >
            🎵 Back to Learnverse 🎵
          </Link>
        </div>

        {verse < lyrics.length - 1 && (
          <p className="text-sm text-gray-400 mt-4">
            Verse {verse + 1} of {lyrics.length}
          </p>
        )}
      </div>

      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall 3s linear forwards;
        }
      `}</style>
    </div>
  );
}
