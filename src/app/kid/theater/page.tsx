'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TheaterPage() {
  const router = useRouter();
  const [playing, setPlaying] = useState(false);
  const [stage, setStage] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isLegendary, setIsLegendary] = useState(false);
  const [isGodMode, setIsGodMode] = useState(false);
  const [showBuddyIntro, setShowBuddyIntro] = useState(false);
  const [buddyScene, setBuddyScene] = useState(0);

  useEffect(() => {
    const legendary = localStorage.getItem('legendaryMode') === 'true';
    const god = localStorage.getItem('godMode') === 'true';
    setIsLegendary(legendary);
    setIsGodMode(god);
  }, []);

  useEffect(() => {
    if (playing) {
      const timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [playing]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startMovie = () => {
    setShowBuddyIntro(true);
    setBuddyScene(1);
    // Buddy walks in
    setTimeout(() => setBuddyScene(2), 3000); // Buddy talks
    setTimeout(() => setBuddyScene(3), 8000); // Popcorn dump!
    setTimeout(() => setBuddyScene(4), 10000); // Allergic reaction
    setTimeout(() => setBuddyScene(5), 13000); // "You're hired!"
    setTimeout(() => {
      setShowBuddyIntro(false);
      setPlaying(true);
      setStage(1);
    }, 16000); // Start movie
  };

  const getColors = () => {
    if (isGodMode) {
      return {
        bg: 'from-purple-900 via-pink-900 to-cyan-900',
        accent: 'text-pink-400',
        button: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500'
      };
    } else if (isLegendary) {
      return {
        bg: 'from-purple-800 via-blue-900 to-black',
        accent: 'text-purple-400',
        button: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500'
      };
    }
    return {
      bg: 'from-gray-900 via-black to-gray-900',
      accent: 'text-white',
      button: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500'
    };
  };

  const colors = getColors();

  // BUDDY INTRO SCENE!
  if (showBuddyIntro) {
    return (
      <div className="fixed inset-0 bg-black z-[9999] flex items-center justify-center overflow-hidden">
        {/* Stage curtains */}
        <div className="absolute top-0 left-0 w-1/4 h-full bg-gradient-to-r from-red-800 to-red-700 z-10" />
        <div className="absolute top-0 right-0 w-1/4 h-full bg-gradient-to-l from-red-800 to-red-700 z-10" />

        {/* Buddy walking in */}
        {buddyScene >= 1 && (
          <div 
            className="absolute bottom-20 text-9xl transition-all duration-3000"
            style={{
              left: buddyScene === 1 ? '-200px' : '50%',
              transform: buddyScene === 1 ? 'translateX(0)' : 'translateX(-50%)',
              transition: 'all 3s ease-out'
            }}
          >
            🧍‍♂️
          </div>
        )}

        {/* Speech bubble */}
        {buddyScene >= 2 && buddyScene < 4 && (
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 bg-white rounded-3xl p-8 shadow-2xl max-w-2xl animate-[fadeIn_0.5s_ease-in]">
            <p className="text-2xl text-gray-800 leading-relaxed">
              "This is the movie of the <span className="font-bold text-purple-600">Learnverse</span>! 
              I hope you enjoy it! It's <span className="font-bold text-red-600">3 HOURS LONG</span> so sit back, 
              grab some popcorn... even though I'm <span className="italic">allergic to popcorn</span>... and enjoy!" 🎬
            </p>
          </div>
        )}

        {/* POPCORN TRUCK DUMP! */}
        {buddyScene >= 3 && buddyScene < 5 && (
          <>
            {/* Truck */}
            <div 
              className="absolute top-10 text-9xl"
              style={{
                right: buddyScene === 3 ? '-200px' : '20%',
                transition: 'all 1s ease-in'
              }}
            >
              🚚
            </div>
            
            {/* POPCORN AVALANCHE! */}
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute text-5xl animate-[fall_2s_ease-in_forwards]"
                style={{
                  left: `${40 + Math.random() * 20}%`,
                  top: '10%',
                  animationDelay: `${Math.random() * 0.5}s`,
                  animation: `fall 2s ease-in ${Math.random() * 0.5}s forwards`
                }}
              >
                🍿
              </div>
            ))}
          </>
        )}

        {/* ALLERGIC REACTION! */}
        {buddyScene >= 4 && buddyScene < 5 && (
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 bg-red-100 border-4 border-red-500 rounded-3xl p-8 shadow-2xl animate-bounce">
            <p className="text-4xl font-bold text-red-600">
              "DUDE I QUI I A CHOOO I Q Q" 🤧💥
            </p>
          </div>
        )}

        {/* YOU'RE HIRED! */}
        {buddyScene >= 5 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-100 border-4 border-green-500 rounded-3xl p-10 shadow-2xl animate-pulse">
            <p className="text-5xl font-bold text-green-600 text-center">
              "Qualify? Ok, YOU'RE HIRED!" ✅🎉
            </p>
          </div>
        )}

        <style jsx>{`
          @keyframes fall {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(600px) rotate(360deg); opacity: 0; }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translate(-50%, -20px); }
            to { opacity: 1; transform: translate(-50%, 0); }
          }
        `}</style>
      </div>
    );
  }

  if (!playing) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${colors.bg} flex flex-col items-center justify-center p-8`}>
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 text-white/60 hover:text-white transition-colors"
        >
          ← Back
        </button>

        {/* Theater lobby */}
        <div className="max-w-4xl w-full space-y-8 text-center">
          {/* Cinema curtains effect */}
          <div className="text-9xl animate-pulse mb-8">🎭</div>
          
          <h1 className={`text-7xl font-bold ${colors.accent} mb-4 tracking-wider`} style={{ textShadow: '0 0 30px rgba(139, 92, 246, 0.5)' }}>
            LEARNVERSE CINEMA
          </h1>
          
          <p className="text-white/80 text-2xl font-light tracking-wide mb-12">
            {isGodMode ? '⚡ GOD MODE THEATER ⚡' : isLegendary ? '🔮 LEGENDARY THEATER 🔮' : '✨ Welcome to the Movies ✨'}
          </p>

          {/* Movie poster */}
          <div className="bg-black/50 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="text-8xl mb-6">🌌</div>
            <h2 className="text-5xl font-bold text-white mb-4">THE LEARNVERSE CHRONICLES</h2>
            <p className="text-white/60 text-xl font-light tracking-wider mb-2">THE COMPLETE SAGA</p>
            <p className="text-3xl font-bold text-yellow-400 mb-6">★★★★★</p>
            
            <div className="grid grid-cols-2 gap-4 text-left text-white/80 mb-8">
              <div>
                <p className="text-sm text-white/40 uppercase tracking-wider">Runtime</p>
                <p className="text-2xl font-bold">3 Hours Epic</p>
              </div>
              <div>
                <p className="text-sm text-white/40 uppercase tracking-wider">Genre</p>
                <p className="text-2xl">Sci-Fi Adventure</p>
              </div>
              <div>
                <p className="text-sm text-white/40 uppercase tracking-wider">Director</p>
                <p className="text-2xl">You! 🎬</p>
              </div>
              <div>
                <p className="text-sm text-white/40 uppercase tracking-wider">Rating</p>
                <p className="text-2xl">Awesome for All Ages</p>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-6 mb-8 text-left">
              <h3 className="text-white font-bold text-xl mb-3">📖 Synopsis</h3>
              <p className="text-white/70 leading-relaxed">
                Journey through the entire history of the Learnverse - from the Big Bang explosion that started it all, 
                to the mysterious book that survived the void, through the collision with Cartoonnia that made reality cartoony, 
                to the birth of the first stick figure, the formation of Snack World, and finally... the creation of the greatest 
                learning app in existence! An epic 3-hour adventure spanning billions of years! 🌟
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={startMovie}
                className={`${colors.button} text-white px-12 py-6 rounded-xl text-2xl font-bold shadow-2xl transition-all transform hover:scale-105`}
              >
                🍿 Watch Now
              </button>
            </div>
            
            <p className="text-white/40 text-sm mt-6 italic">
              Grab your popcorn! This is gonna be EPIC! 🎬✨
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Movie is playing!
  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.bg} relative overflow-hidden`}>
      {/* Cinematic black bars */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-black z-50" />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-black z-50" />

      {/* Movie controls overlay */}
      <div className="absolute top-20 left-4 z-50 bg-black/50 backdrop-blur-xl rounded-xl p-4 text-white">
        <p className="text-sm text-white/60">Runtime</p>
        <p className="text-2xl font-bold">{formatTime(elapsedTime)} / 3:00:00</p>
        <div className="w-48 h-2 bg-white/20 rounded-full mt-2">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
            style={{ width: `${(elapsedTime / 10800) * 100}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="absolute top-20 right-4 z-50 flex gap-2">
        <button
          onClick={() => setPlaying(false)}
          className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl font-bold transition-colors"
        >
          ⏸️ Pause
        </button>
        <button
          onClick={() => router.back()}
          className="bg-white/20 hover:bg-white/30 backdrop-blur text-white px-6 py-3 rounded-xl font-bold transition-colors"
        >
          🚪 Exit Theater
        </button>
      </div>

      {/* Movie content - The EPIC 3-hour saga! */}
      <div className="h-screen flex items-center justify-center">
        <div className="text-center space-y-6 animate-pulse">
          <div className="text-9xl">
            {elapsedTime < 60 ? '💥' : 
             elapsedTime < 300 ? '📚' :
             elapsedTime < 600 ? '🌌' :
             elapsedTime < 1200 ? '⭐' :
             elapsedTime < 1800 ? '🪐' :
             elapsedTime < 2400 ? '💫' :
             elapsedTime < 3000 ? '🎨' :
             elapsedTime < 3600 ? '🧍' :
             elapsedTime < 5400 ? '🌍' :
             elapsedTime < 7200 ? '🎭' :
             elapsedTime < 9000 ? '📖' :
             '🚀'}
          </div>
          <h2 className="text-6xl font-bold text-white tracking-wider">
            {elapsedTime < 60 ? 'THE BIG BANG' :
             elapsedTime < 300 ? 'THE MYSTERIOUS BOOK' :
             elapsedTime < 600 ? 'UNIVERSE EXPANSION' :
             elapsedTime < 1200 ? 'BIRTH OF STARS' :
             elapsedTime < 1800 ? 'PLANETARY RINGS' :
             elapsedTime < 2400 ? 'THE CARTOONNIA COLLISION' :
             elapsedTime < 3000 ? 'IMAGINATION SPREADS' :
             elapsedTime < 3600 ? 'FIRST LIFE FORMS' :
             elapsedTime < 5400 ? 'SNACK WORLD CIVILIZATIONS' :
             elapsedTime < 7200 ? 'THE GREAT DISCOVERIES' :
             elapsedTime < 9000 ? 'THE DIGITAL AGE' :
             'THE LEARNVERSE IS BORN'}
          </h2>
          <p className="text-2xl text-white/70 font-light italic max-w-2xl mx-auto">
            {elapsedTime < 60 ? 'In the beginning, there was nothing... then everything exploded.' :
             elapsedTime < 300 ? 'A single book survived the chaos, holding all knowledge...' :
             elapsedTime < 600 ? 'The universe rapidly expanded, creating infinite possibilities...' :
             elapsedTime < 1200 ? 'From darkness, the first stars ignited...' :
             elapsedTime < 1800 ? 'A giant cosmic stick created rings around planets...' :
             elapsedTime < 2400 ? 'The imagination planet Cartoonnia collided with reality...' :
             elapsedTime < 3000 ? 'Imagination spread across the universe, making anything possible...' :
             elapsedTime < 3600 ? 'The first stick figure emerged from pure imagination...' :
             elapsedTime < 5400 ? 'Civilizations rose and fell on the cartoony Snack World...' :
             elapsedTime < 7200 ? 'Knowledge was shared, discoveries were made...' :
             elapsedTime < 9000 ? 'Technology connected everyone across the world...' :
             'And finally, the ultimate learning experience was created... Welcome to Learnverse! 🎉'}
          </p>
        </div>
      </div>

      {/* End credits at 3 hours */}
      {elapsedTime >= 10800 && (
        <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-40 overflow-hidden">
          {/* CRYING BUDDY WITH RED DOTS */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2 text-center animate-bounce">
            <div className="relative inline-block">
              {/* Puffy red dots around buddy */}
              <div className="absolute w-8 h-8 bg-red-500 rounded-full top-0 left-0 animate-pulse" />
              <div className="absolute w-6 h-6 bg-red-400 rounded-full top-10 right-0 animate-pulse animation-delay-200" />
              <div className="absolute w-10 h-10 bg-red-500 rounded-full bottom-0 left-2 animate-pulse animation-delay-300" />
              <div className="absolute w-7 h-7 bg-red-400 rounded-full bottom-5 right-2 animate-pulse animation-delay-500" />
              
              {/* Crying buddy */}
              <div className="text-9xl relative">😭</div>
              
              {/* Snot dripping */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-6xl animate-[drip_2s_ease-in-out_infinite]">
                💧
              </div>
            </div>
          </div>

          {/* Dramatic text */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-xl border-2 border-white/30 rounded-3xl p-8 max-w-3xl text-center animate-[fadeIn_1s_ease-in]">
            <p className="text-4xl font-bold text-white mb-4">
              Unfortunately, SOME PEOPLE ARE <span className="text-red-400 italic">SOOO DRAMATIC</span>... 🎭
            </p>
            <p className="text-2xl text-white/80">
              So here's the credits... 📜
            </p>
          </div>

          {/* Voice from background */}
          <div className="absolute top-1/2 right-10 bg-gray-900/90 border-2 border-yellow-400 rounded-2xl p-6 animate-[slideInRight_2s_ease-out]">
            <p className="text-2xl font-bold text-yellow-400">
              "If you don't stop crying, YOU'RE FIRED!" 😤
            </p>
          </div>

          {/* Buddy's response */}
          <div className="absolute top-1/2 left-10 bg-blue-900/90 border-2 border-blue-400 rounded-2xl p-6 mt-20 animate-[slideInLeft_2.5s_ease-out]">
            <p className="text-3xl font-bold text-white">
              "I WANT TO BE FIRED!!!" 😭💥
            </p>
          </div>

          {/* OK response */}
          <div className="absolute top-1/2 right-10 bg-green-900/90 border-2 border-green-400 rounded-2xl p-6 mt-40 animate-[slideInRight_3s_ease-out]">
            <p className="text-2xl font-bold text-green-400">
              "Ok." 😐
            </p>
          </div>

          {/* LITERAL FIRE!!! */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 animate-[scaleUp_3.5s_ease-out]">
            <div className="relative">
              <div className="text-9xl animate-pulse">🔥</div>
              <div className="absolute -top-10 -left-10 text-7xl animate-ping">🔥</div>
              <div className="absolute -top-10 -right-10 text-7xl animate-ping animation-delay-200">🔥</div>
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-7xl animate-ping animation-delay-300">🔥</div>
            </div>
          </div>

          {/* Final scream */}
          <div className="absolute bottom-40 left-1/2 -translate-x-1/2 bg-red-600/90 border-4 border-orange-500 rounded-2xl p-8 animate-[shake_4s_ease-out] shadow-2xl">
            <p className="text-5xl font-black text-white">
              "AHHHHH I DIDN'T WANT <span className="text-orange-300">THAT</span> FIRE!!!" 🔥😱
            </p>
          </div>

          {/* Actual credits scrolling */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-white text-center opacity-50 animate-[scrollUp_10s_linear_infinite]">
            <h2 className="text-3xl font-bold mb-4">CREDITS</h2>
            <p className="text-xl mb-2">Created by: You! 🎬</p>
            <p className="text-xl mb-2">Stick Buddy: Allergic Actor 🧍‍♂️</p>
            <p className="text-xl mb-2">Popcorn Supplier: Big Truck Inc. 🚚</p>
            <p className="text-xl mb-2">Fire Effects: Too Literal Studios 🔥</p>
            <p className="text-xl mb-2">Drama Level: MAXIMUM 🎭</p>
            <p className="text-xl mb-8">Runtime: 3 EPIC HOURS ⏰</p>
            <p className="text-2xl font-bold">THE END</p>
          </div>

          {/* Return button */}
          <button
            onClick={() => router.back()}
            className={`absolute top-4 left-1/2 -translate-x-1/2 ${colors.button} text-white px-12 py-6 rounded-xl text-2xl font-bold shadow-2xl z-50 animate-pulse`}
          >
            🚪 Return to Learnverse
          </button>

          <style jsx>{`
            @keyframes drip {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(20px); }
            }
            @keyframes slideInRight {
              from { transform: translateX(100px); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideInLeft {
              from { transform: translateX(-100px); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
            @keyframes scaleUp {
              from { transform: scale(0); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
            @keyframes shake {
              0%, 100% { transform: translateX(-50%) rotate(0deg); }
              25% { transform: translateX(-50%) rotate(-5deg); }
              75% { transform: translateX(-50%) rotate(5deg); }
            }
            @keyframes scrollUp {
              from { transform: translate(-50%, 0); }
              to { transform: translate(-50%, -100%); }
            }
            @keyframes fadeIn {
              from { opacity: 0; transform: translate(-50%, 20px); }
              to { opacity: 1; transform: translate(-50%, 0); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
