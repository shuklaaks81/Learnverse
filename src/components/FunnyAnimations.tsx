'use client';

import { useEffect, useState } from 'react';

interface FunnyAnimationsProps {
  isCorrect: boolean | null;
  onComplete?: () => void;
}

export default function FunnyAnimations({ isCorrect, onComplete }: FunnyAnimationsProps) {
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationType, setAnimationType] = useState<string>('');

  useEffect(() => {
    if (isCorrect === true) {
      // Pick a random funny animation
      const animations = ['icecream', 'rocket', 'treasure', 'superhero', 'dance'];
      const randomAnim = animations[Math.floor(Math.random() * animations.length)];
      setAnimationType(randomAnim);
      setShowAnimation(true);

      // Hide after 4 seconds
      setTimeout(() => {
        setShowAnimation(false);
        onComplete?.();
      }, 4000);
    } else if (isCorrect === false) {
      // Wrong answer animations
      const wrongAnims = ['oops', 'facepalm', 'tryagain'];
      const randomAnim = wrongAnims[Math.floor(Math.random() * wrongAnims.length)];
      setAnimationType(randomAnim);
      setShowAnimation(true);

      setTimeout(() => {
        setShowAnimation(false);
        onComplete?.();
      }, 2000);
    }
  }, [isCorrect, onComplete]);

  if (!showAnimation) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      {/* ICE CREAM METAL BLOCK ANIMATION */}
      {animationType === 'icecream' && (
        <div className="relative w-full h-full overflow-hidden">
          {/* Buddy eating ice cream */}
          <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 animate-buddy-enter">
            <svg width="100" height="140" viewBox="0 0 80 120">
              {/* Body */}
              <ellipse cx="40" cy="65" rx="12" ry="18" fill="#FFD700" stroke="#000" strokeWidth="2"/>
              {/* Arms */}
              <line x1="28" y1="60" x2="18" y2="70" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
              <line x1="52" y1="60" x2="62" y2="70" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
              {/* Legs */}
              <line x1="35" y1="83" x2="30" y2="100" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
              <line x1="45" y1="83" x2="50" y2="100" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
              {/* Head */}
              <circle cx="40" cy="35" r="18" fill="#FFE4B5" stroke="#000" strokeWidth="2"/>
              {/* Eyes - happy */}
              <circle cx="33" cy="32" r="2" fill="#000"/>
              <circle cx="47" cy="32" r="2" fill="#000"/>
              {/* Smile */}
              <path d="M 30 40 Q 40 48 50 40" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round"/>
            </svg>
            <div className="text-4xl absolute top-10 -right-12">🍦</div>
          </div>

          {/* Metal blocks falling */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 animate-blocks-fall">
            <div className="flex flex-col gap-2">
              <div className="bg-gray-600 text-white font-bold px-8 py-4 rounded shadow-2xl text-2xl animate-wiggle">
                AWESOME!
              </div>
              <div className="bg-gray-700 text-white font-bold px-8 py-4 rounded shadow-2xl text-2xl animate-wiggle" style={{ animationDelay: '0.1s' }}>
                YOU DID IT!
              </div>
              <div className="bg-gray-600 text-white font-bold px-8 py-4 rounded shadow-2xl text-2xl animate-wiggle" style={{ animationDelay: '0.2s' }}>
                CORRECT!
              </div>
            </div>
          </div>

          {/* Ice cream flying up */}
          <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 animate-icecream-fly text-6xl">
            🍦
          </div>

          {/* Buddy getting squashed */}
          <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 animate-buddy-squash">
            <svg width="100" height="140" viewBox="0 0 80 120">
              <ellipse cx="40" cy="65" rx="12" ry="18" fill="#FFD700" stroke="#000" strokeWidth="2"/>
              <line x1="28" y1="60" x2="10" y2="75" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
              <line x1="52" y1="60" x2="70" y2="75" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
              <line x1="35" y1="83" x2="25" y2="100" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
              <line x1="45" y1="83" x2="55" y2="100" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="40" cy="35" r="18" fill="#FFE4B5" stroke="#000" strokeWidth="2"/>
              {/* X eyes */}
              <line x1="30" y1="30" x2="36" y2="36" stroke="#000" strokeWidth="2"/>
              <line x1="36" y1="30" x2="30" y2="36" stroke="#000" strokeWidth="2"/>
              <line x1="44" y1="30" x2="50" y2="36" stroke="#000" strokeWidth="2"/>
              <line x1="50" y1="30" x2="44" y2="36" stroke="#000" strokeWidth="2"/>
              {/* Wavy mouth */}
              <path d="M 30 42 Q 35 40 40 42 Q 45 44 50 42" stroke="#000" strokeWidth="2" fill="none"/>
            </svg>
          </div>

          {/* Buddy with drill popping out */}
          <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 animate-buddy-drill">
            <svg width="120" height="140" viewBox="0 0 100 120">
              <ellipse cx="40" cy="65" rx="12" ry="18" fill="#FFD700" stroke="#000" strokeWidth="2"/>
              <line x1="28" y1="60" x2="18" y2="70" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
              <line x1="52" y1="60" x2="70" y2="55" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
              <line x1="35" y1="83" x2="30" y2="100" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
              <line x1="45" y1="83" x2="50" y2="100" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="40" cy="35" r="18" fill="#FFE4B5" stroke="#000" strokeWidth="2"/>
              {/* Cool sunglasses */}
              <rect x="28" y="30" width="10" height="6" fill="#000" rx="2"/>
              <rect x="42" y="30" width="10" height="6" fill="#000" rx="2"/>
              <line x1="38" y1="33" x2="42" y2="33" stroke="#000" strokeWidth="2"/>
              {/* Confident smile */}
              <path d="M 32 42 Q 40 46 48 42" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round"/>
              {/* Drill */}
              <rect x="70" y="52" width="20" height="8" fill="#FFA500" stroke="#000" strokeWidth="2"/>
              <polygon points="90,56 95,56 95,60 90,60" fill="#666" stroke="#000" strokeWidth="1"/>
            </svg>
          </div>

          {/* Buddy walking away casually */}
          <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 animate-buddy-walk">
            <svg width="100" height="140" viewBox="0 0 80 120">
              <ellipse cx="40" cy="65" rx="12" ry="18" fill="#FFD700" stroke="#000" strokeWidth="2"/>
              <line x1="28" y1="60" x2="20" y2="65" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
              <line x1="52" y1="60" x2="60" y2="65" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
              {/* Walking legs */}
              <line x1="35" y1="83" x2="28" y2="100" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
              <line x1="45" y1="83" x2="52" y2="95" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="40" cy="35" r="18" fill="#FFE4B5" stroke="#000" strokeWidth="2"/>
              <circle cx="33" cy="32" r="2" fill="#000"/>
              <circle cx="47" cy="32" r="2" fill="#000"/>
              <path d="M 33 40 L 47 40" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <div className="text-4xl absolute -top-5 -right-8">🍦</div>
          </div>

          {/* Ground rumble effect */}
          <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-black/20 to-transparent animate-rumble"></div>
        </div>
      )}

      {/* ROCKET TO SPACE */}
      {animationType === 'rocket' && (
        <div className="relative w-full h-full">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 animate-rocket-launch">
            {/* Buddy riding rocket */}
            <div className="relative">
              <div className="text-8xl">🚀</div>
              <svg className="absolute top-8 left-8" width="60" height="80" viewBox="0 0 80 120">
                <ellipse cx="40" cy="65" rx="12" ry="18" fill="#FFD700" stroke="#000" strokeWidth="2"/>
                <line x1="28" y1="60" x2="15" y2="55" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
                <line x1="52" y1="60" x2="65" y2="55" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
                <line x1="35" y1="83" x2="30" y2="100" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
                <line x1="45" y1="83" x2="50" y2="100" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="40" cy="35" r="18" fill="#FFE4B5" stroke="#000" strokeWidth="2"/>
                <circle cx="33" cy="30" r="3" fill="#000"/>
                <circle cx="47" cy="30" r="3" fill="#000"/>
                <path d="M 30 42 Q 40 48 50 42" stroke="#000" strokeWidth="2" fill="none"/>
              </svg>
            </div>
          </div>
          <div className="absolute top-20 left-1/2 -translate-x-1/2 text-4xl font-bold text-white animate-pulse">
            TO THE MOON! 🌙
          </div>
        </div>
      )}

      {/* TREASURE CHEST */}
      {animationType === 'treasure' && (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="animate-treasure-open text-8xl">
            💎
          </div>
          <div className="absolute animate-treasure-sparkle text-6xl">
            ✨✨✨
          </div>
          <div className="absolute top-1/3 text-4xl font-bold text-yellow-400 animate-bounce">
            JACKPOT!
          </div>
        </div>
      )}

      {/* SUPERHERO */}
      {animationType === 'superhero' && (
        <div className="relative w-full h-full">
          <div className="absolute left-0 bottom-1/3 animate-superhero-fly">
            <svg width="120" height="150" viewBox="0 0 100 140">
              {/* Cape flowing behind */}
              <path d="M 35 50 Q 10 60 5 80 L 5 90 Q 10 70 35 65 Z" fill="#FF0000" stroke="#000" strokeWidth="2"/>
              {/* Body in flying pose */}
              <ellipse cx="50" cy="70" rx="12" ry="18" fill="#0000FF" stroke="#000" strokeWidth="2"/>
              {/* Arms - one forward, one back */}
              <line x1="38" y1="65" x2="20" y2="60" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
              <line x1="62" y1="65" x2="75" y2="70" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
              {/* Fist on forward arm */}
              <circle cx="20" cy="60" r="4" fill="#FFE4B5" stroke="#000" strokeWidth="2"/>
              {/* Legs stretched out */}
              <line x1="45" y1="88" x2="35" y2="110" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
              <line x1="55" y1="88" x2="65" y2="105" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
              {/* Head */}
              <circle cx="50" cy="45" r="18" fill="#FFE4B5" stroke="#000" strokeWidth="2"/>
              {/* Determined eyes */}
              <circle cx="43" cy="42" r="2" fill="#000"/>
              <circle cx="57" cy="42" r="2" fill="#000"/>
              {/* Confident smile */}
              <path d="M 40 52 Q 50 56 60 52" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round"/>
              {/* Superhero mask */}
              <path d="M 35 40 L 42 42 L 58 42 L 65 40" stroke="#000" strokeWidth="2" fill="none"/>
              {/* Lightning bolt on chest */}
              <path d="M 50 68 L 48 72 L 51 72 L 49 76" stroke="#FFD700" strokeWidth="2" fill="#FFD700"/>
            </svg>
          </div>
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 text-4xl font-bold text-blue-600 animate-pulse">
            SUPER SMART! 💪
          </div>
        </div>
      )}

      {/* DANCE PARTY */}
      {animationType === 'dance' && (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="flex gap-8">
            <svg className="animate-dance-left" width="100" height="140" viewBox="0 0 80 120">
              <ellipse cx="40" cy="65" rx="12" ry="18" fill="#FF69B4" stroke="#000" strokeWidth="2"/>
              <line x1="28" y1="60" x2="15" y2="50" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
              <line x1="52" y1="60" x2="65" y2="70" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
              <line x1="35" y1="83" x2="25" y2="100" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
              <line x1="45" y1="83" x2="55" y2="100" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="40" cy="35" r="18" fill="#FFE4B5" stroke="#000" strokeWidth="2"/>
              <circle cx="33" cy="32" r="2" fill="#000"/>
              <circle cx="47" cy="32" r="2" fill="#000"/>
              <path d="M 30 40 Q 40 46 50 40" stroke="#000" strokeWidth="2" fill="none"/>
            </svg>
            <svg className="animate-dance-right" width="100" height="140" viewBox="0 0 80 120">
              <ellipse cx="40" cy="65" rx="12" ry="18" fill="#4169E1" stroke="#000" strokeWidth="2"/>
              <line x1="28" y1="60" x2="15" y2="70" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
              <line x1="52" y1="60" x2="65" y2="50" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
              <line x1="35" y1="83" x2="25" y2="100" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
              <line x1="45" y1="83" x2="55" y2="100" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="40" cy="35" r="18" fill="#FFE4B5" stroke="#000" strokeWidth="2"/>
              <circle cx="33" cy="32" r="2" fill="#000"/>
              <circle cx="47" cy="32" r="2" fill="#000"/>
              <path d="M 30 40 Q 40 46 50 40" stroke="#000" strokeWidth="2" fill="none"/>
            </svg>
          </div>
          <div className="absolute top-1/4 text-4xl font-bold text-pink-600 animate-pulse">
            DANCE PARTY! 🎉
          </div>
        </div>
      )}

      {/* WRONG ANSWER ANIMATIONS */}
      {animationType === 'oops' && (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="animate-spin-once text-8xl">
            ooooooooooooooooooo hi in stuff ooooooooooooooooooo
          </div>
          <div className="absolute top-1/3 text-3xl font-bold text-orange-600 animate-bounce">
            Oops! 
          </div>
        </div>
      )}

      {animationType === 'facepalm' && (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="animate-facepalm">
            <svg width="120" height="160" viewBox="0 0 80 120">
              {/* Body */}
              <ellipse cx="40" cy="65" rx="12" ry="18" fill="#FFD700" stroke="#000" strokeWidth="2"/>
              {/* Left arm normal */}
              <line x1="28" y1="60" x2="18" y2="70" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
              {/* Right arm up to face (facepalm) */}
              <line x1="52" y1="60" x2="45" y2="35" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
              {/* Hand on face */}
              <ellipse cx="43" cy="35" rx="6" ry="8" fill="#FFE4B5" stroke="#000" strokeWidth="2" transform="rotate(-20 43 35)"/>
              {/* Legs */}
              <line x1="35" y1="83" x2="30" y2="100" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
              <line x1="45" y1="83" x2="50" y2="100" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
              {/* Head */}
              <circle cx="40" cy="35" r="18" fill="#FFE4B5" stroke="#000" strokeWidth="2"/>
              {/* One eye visible (other covered by hand) */}
              <circle cx="33" cy="32" r="2" fill="#000"/>
              {/* Wavy uncertain mouth */}
              <path d="M 30 42 Q 35 44 40 42" stroke="#000" strokeWidth="2" fill="none"/>
            </svg>
          </div>
          <div className="absolute top-1/3 text-3xl font-bold text-blue-600 animate-shake">
            So close!
          </div>
        </div>
      )}

      {animationType === 'tryagain' && (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="animate-bounce text-8xl">
            🎯
          </div>
          <div className="absolute top-1/3 text-3xl font-bold text-green-600 animate-pulse">
            Almost! Keep trying!
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes buddy-enter {
          0% { transform: translate(-50%, 100%); }
          20% { transform: translate(-50%, 0); }
          100% { transform: translate(-50%, 0); }
        }
        @keyframes blocks-fall {
          0% { transform: translate(-50%, -200%); }
          30% { transform: translate(-50%, 50%); }
          40% { transform: translate(-50%, 40%); }
          100% { transform: translate(-50%, 40%); }
        }
        @keyframes icecream-fly {
          0% { transform: translate(-50%, 0); opacity: 0; }
          35% { transform: translate(-50%, 0); opacity: 1; }
          50% { transform: translate(-50%, -300%); opacity: 1; }
          60% { transform: translate(-50%, -280%); opacity: 1; }
          70% { transform: translate(-50%, 40%); opacity: 1; }
          100% { transform: translate(-50%, 40%); opacity: 1; }
        }
        @keyframes buddy-squash {
          0% { transform: translate(-50%, 0) scaleY(1); opacity: 0; }
          40% { transform: translate(-50%, 0) scaleY(1); opacity: 0; }
          45% { transform: translate(-50%, 0) scaleY(0.2); opacity: 1; }
          65% { transform: translate(-50%, 0) scaleY(0.2); opacity: 1; }
          70% { transform: translate(-50%, 0) scaleY(0.2); opacity: 0; }
          100% { transform: translate(-50%, 0) scaleY(0.2); opacity: 0; }
        }
        @keyframes buddy-drill {
          0% { transform: translate(-50%, 40%) rotate(0deg); opacity: 0; }
          70% { transform: translate(-50%, 40%) rotate(0deg); opacity: 0; }
          75% { transform: translate(-50%, 0) rotate(360deg); opacity: 1; }
          85% { transform: translate(-50%, 0) rotate(360deg); opacity: 1; }
          100% { transform: translate(-50%, 0) rotate(360deg); opacity: 1; }
        }
        @keyframes buddy-walk {
          0% { transform: translate(-50%, 0); opacity: 0; }
          85% { transform: translate(-50%, 0); opacity: 0; }
          86% { transform: translate(-50%, 0); opacity: 1; }
          100% { transform: translate(200%, 0); opacity: 1; }
        }
        @keyframes rumble {
          0%, 100% { transform: translateY(0); }
          10% { transform: translateY(-2px); }
          20% { transform: translateY(2px); }
          30% { transform: translateY(-2px); }
          40% { transform: translateY(2px); }
          50% { transform: translateY(0); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }
        @keyframes rocket-launch {
          0% { transform: translate(-50%, 0); }
          100% { transform: translate(-50%, -200vh) scale(0.5); }
        }
        @keyframes treasure-open {
          0%, 50% { transform: scale(0); }
          70% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        @keyframes treasure-sparkle {
          0% { transform: scale(0) rotate(0deg); opacity: 0; }
          50% { transform: scale(1.5) rotate(180deg); opacity: 1; }
          100% { transform: scale(2) rotate(360deg); opacity: 0; }
        }
        @keyframes superhero-fly {
          0% { transform: translate(-100%, 0); }
          100% { transform: translate(200vw, 0); }
        }
        @keyframes dance-left {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          25% { transform: translateX(-20px) rotate(-15deg); }
          75% { transform: translateX(20px) rotate(15deg); }
        }
        @keyframes dance-right {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          25% { transform: translateX(20px) rotate(15deg); }
          75% { transform: translateX(-20px) rotate(-15deg); }
        }
        @keyframes spin-once {
          0% { transform: rotate(0deg) scale(0); }
          50% { transform: rotate(360deg) scale(1.2); }
          100% { transform: rotate(720deg) scale(1); }
        }
        @keyframes facepalm {
          0% { transform: translateY(-50px); opacity: 0; }
          50% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(0); opacity: 1; }
        }

        .animate-buddy-enter { animation: buddy-enter 4s ease-out forwards; }
        .animate-blocks-fall { animation: blocks-fall 4s ease-in-out forwards; }
        .animate-icecream-fly { animation: icecream-fly 4s ease-in-out forwards; }
        .animate-buddy-squash { animation: buddy-squash 4s ease-in-out forwards; }
        .animate-buddy-drill { animation: buddy-drill 4s ease-in-out forwards; }
        .animate-buddy-walk { animation: buddy-walk 4s ease-in-out forwards; }
        .animate-rumble { animation: rumble 0.5s ease-in-out 0.3s; }
        .animate-wiggle { animation: wiggle 0.5s ease-in-out infinite; }
        .animate-rocket-launch { animation: rocket-launch 4s ease-in forwards; }
        .animate-treasure-open { animation: treasure-open 2s ease-out forwards; }
        .animate-treasure-sparkle { animation: treasure-sparkle 3s ease-out forwards; }
        .animate-superhero-fly { animation: superhero-fly 3s linear forwards; }
        .animate-dance-left { animation: dance-left 1s ease-in-out infinite; }
        .animate-dance-right { animation: dance-right 1s ease-in-out infinite; }
        .animate-spin-once { animation: spin-once 1s ease-out forwards; }
        .animate-facepalm { animation: facepalm 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
}
