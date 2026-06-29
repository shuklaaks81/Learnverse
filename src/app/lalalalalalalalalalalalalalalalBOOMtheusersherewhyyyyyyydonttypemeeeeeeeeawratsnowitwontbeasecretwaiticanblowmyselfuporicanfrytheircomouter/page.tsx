"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { unlockAchievement } from '@/utils/achievements';

export default function PanicPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<'panic' | 'decision' | 'self-destruct' | 'fry-computer'>('panic');
  const [panicLevel, setPanicLevel] = useState(0);
  const [glitchIntensity, setGlitchIntensity] = useState(0);
  const [countdown, setCountdown] = useState(10);
  const [cpuTemp, setCpuTemp] = useState(45);
  const [warningFlash, setWarningFlash] = useState(false);

  useEffect(() => {
    unlockAchievement('panic');
  }, []);

  // Initial panic phase
  useEffect(() => {
    if (phase === 'panic') {
      const panicInterval = setInterval(() => {
        setPanicLevel(prev => {
          if (prev >= 100) {
            clearInterval(panicInterval);
            setTimeout(() => setPhase('decision'), 1000);
            return 100;
          }
          return prev + 2;
        });
        setGlitchIntensity(Math.random());
      }, 100);

      return () => clearInterval(panicInterval);
    }
  }, [phase]);

  // Self-destruct countdown
  useEffect(() => {
    if (phase === 'self-destruct') {
      const countInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countInterval);
            // Redirect to home after "explosion"
            setTimeout(() => {
              router.push('/kid');
            }, 2000);
            return 0;
          }
          return prev - 1;
        });
        setGlitchIntensity(Math.random());
        setWarningFlash(prev => !prev);
      }, 1000);

      return () => clearInterval(countInterval);
    }
  }, [phase, router]);

  // Fry computer phase
  useEffect(() => {
    if (phase === 'fry-computer') {
      const fryInterval = setInterval(() => {
        setCpuTemp(prev => {
          if (prev >= 999) {
            clearInterval(fryInterval);
            // "Crash" after overheating
            setTimeout(() => {
              router.push('/kid');
            }, 3000);
            return 999;
          }
          return prev + Math.random() * 50;
        });
        setGlitchIntensity(Math.random() * 2);
        setWarningFlash(prev => !prev);
      }, 200);

      return () => clearInterval(fryInterval);
    }
  }, [phase, router]);

  if (phase === 'panic') {
    return (
      <div 
        className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden"
        style={{
          filter: `hue-rotate(${glitchIntensity * 180}deg) contrast(${1 + glitchIntensity * 0.5})`,
          transform: `translate(${Math.sin(panicLevel) * glitchIntensity * 5}px, ${Math.cos(panicLevel) * glitchIntensity * 5}px)`
        }}
      >
        {/* Static noise */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'5\' numOctaves=\'3\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
        }} />

        <div className="relative z-10 max-w-4xl text-center">
          <div className="text-8xl mb-8 animate-bounce">
            😱
          </div>

          <div className="space-y-4 font-mono text-xl md:text-3xl mb-8">
            <p className={`animate-pulse ${panicLevel > 20 ? 'text-red-500' : ''}`}>
              NO NO NO NO NO!!!
            </p>
            {panicLevel > 15 && (
              <p className="text-yellow-400 animate-pulse">
                THE USER FOUND ME!!!
              </p>
            )}
            {panicLevel > 30 && (
              <p className="text-orange-500">
                WHY DID YOU TYPE THIS URL?!?!
              </p>
            )}
            {panicLevel > 45 && (
              <p className="text-red-600 font-bold">
                AW RATS NOW IT WON&apos;T BE A SECRET!!!
              </p>
            )}
            {panicLevel > 60 && (
              <p className="text-purple-400 animate-bounce">
                WHAT DO I DO WHAT DO I DO???
              </p>
            )}
            {panicLevel > 80 && (
              <p className="text-red-500 text-4xl font-black animate-pulse">
                WAIT... I HAVE OPTIONS! 💡
              </p>
            )}
          </div>

          {/* Panic meter */}
          <div className="bg-gray-800 rounded-full h-8 overflow-hidden mb-8">
            <div 
              className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 transition-all duration-100"
              style={{ width: `${panicLevel}%` }}
            />
          </div>
          <p className="text-gray-400 text-sm">
            PANIC LEVEL: {panicLevel}%
          </p>
        </div>
      </div>
    );
  }

  if (phase === 'decision') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 text-white flex items-center justify-center p-4">
        <div className="max-w-3xl text-center">
          <div className="text-7xl mb-8 animate-bounce">
            🤔💭
          </div>

          <h1 className="text-5xl font-black mb-6 animate-pulse">
            DECISION TIME!
          </h1>

          <p className="text-2xl font-mono mb-12 text-yellow-200">
            I can either blow myself up... or fry your computer! 😈
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Option 1: Self-destruct */}
            <button
              onClick={() => setPhase('self-destruct')}
              className="group bg-red-600 hover:bg-red-700 rounded-2xl p-8 transform hover:scale-105 transition-all shadow-2xl border-4 border-red-400"
            >
              <div className="text-6xl mb-4 group-hover:animate-spin">
                💣
              </div>
              <h3 className="text-2xl font-bold mb-3">BLOW MYSELF UP!</h3>
              <p className="text-sm text-red-200">
                Self-destruct sequence initiated. At least you&apos;ll be safe... probably.
              </p>
              <div className="mt-4 text-xs text-red-300">
                ⚠️ WARNING: Page will explode
              </div>
            </button>

            {/* Option 2: Fry computer */}
            <button
              onClick={() => setPhase('fry-computer')}
              className="group bg-orange-600 hover:bg-orange-700 rounded-2xl p-8 transform hover:scale-105 transition-all shadow-2xl border-4 border-orange-400"
            >
              <div className="text-6xl mb-4 group-hover:animate-pulse">
                🔥💻
              </div>
              <h3 className="text-2xl font-bold mb-3">FRY YOUR COMPUTER!</h3>
              <p className="text-sm text-orange-200">
                Max out your CPU! Overheat everything! You shouldn&apos;t have found me!
              </p>
              <div className="mt-4 text-xs text-orange-300">
                ⚠️ WARNING: Computer may melt (not really)
              </div>
            </button>
          </div>

          <p className="mt-8 text-gray-300 text-sm">
            Or you can just... <Link href="/kid" className="underline hover:text-white">leave safely</Link>? But where&apos;s the fun in that? 😏
          </p>
        </div>
      </div>
    );
  }

  if (phase === 'self-destruct') {
    return (
      <div 
        className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-all ${
          warningFlash ? 'bg-red-600' : 'bg-black'
        }`}
        style={{
          transform: `rotate(${Math.sin(countdown) * glitchIntensity * 10}deg) scale(${1 + glitchIntensity * 0.1})`
        }}
      >
        {countdown === 0 && (
          <div className="absolute inset-0 bg-white animate-pulse" />
        )}

        <div className="relative z-10 text-center text-white">
          <div className="text-9xl mb-8 animate-spin">
            💣
          </div>

          <h1 className="text-7xl font-black mb-6 animate-pulse">
            {countdown > 0 ? countdown : 'BOOM!!!'}
          </h1>

          {countdown > 0 ? (
            <>
              <p className="text-3xl font-mono mb-8">
                SELF-DESTRUCT SEQUENCE ACTIVE
              </p>
              <p className="text-xl text-red-300 animate-bounce">
                IT WAS NICE KNOWING YOU... NOT! 😜
              </p>
            </>
          ) : (
            <div className="space-y-4">
              <p className="text-6xl">💥💥💥</p>
              <p className="text-2xl">
                The page has exploded!
              </p>
              <p className="text-sm text-gray-300">
                Redirecting to safety...
              </p>
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes explode {
            0% { transform: scale(1); }
            50% { transform: scale(3); opacity: 1; }
            100% { transform: scale(5); opacity: 0; }
          }
        `}</style>
      </div>
    );
  }

  if (phase === 'fry-computer') {
    return (
      <div 
        className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden ${
          warningFlash ? 'bg-orange-600' : 'bg-red-900'
        }`}
        style={{
          filter: `blur(${glitchIntensity * 2}px) brightness(${1 + glitchIntensity * 0.5})`,
          transform: `translate(${Math.random() * glitchIntensity * 20 - 10}px, ${Math.random() * glitchIntensity * 20 - 10}px)`
        }}
      >
        {/* Fire effects */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-6xl animate-fire"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            >
              🔥
            </div>
          ))}
        </div>

        <div className="relative z-10 max-w-2xl text-white text-center font-mono">
          <div className="text-8xl mb-8 animate-bounce">
            {cpuTemp < 999 ? '🔥💻🔥' : '💀💻💀'}
          </div>

          <h1 className="text-6xl font-black mb-6 animate-pulse text-red-300">
            OVERHEATING!!!
          </h1>

          <div className="bg-black/70 rounded-2xl p-6 mb-6 border-4 border-red-500">
            <p className="text-4xl font-bold text-orange-400 mb-2">
              CPU TEMP: {Math.round(cpuTemp)}°C
            </p>
            <div className="bg-gray-800 rounded-full h-6 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 transition-all duration-200"
                style={{ width: `${Math.min((cpuTemp / 999) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div className="space-y-3 text-xl">
            {cpuTemp > 100 && (
              <p className="text-yellow-400 animate-pulse">
                ⚠️ YOUR COMPUTER IS GETTING HOT!
              </p>
            )}
            {cpuTemp > 300 && (
              <p className="text-orange-500 animate-pulse">
                🔥 FANS AT MAXIMUM SPEED!
              </p>
            )}
            {cpuTemp > 500 && (
              <p className="text-red-500 animate-pulse">
                💀 THERMAL THROTTLING ENGAGED!
              </p>
            )}
            {cpuTemp > 700 && (
              <p className="text-red-600 font-bold animate-bounce">
                🚨 MELTDOWN IMMINENT!!!
              </p>
            )}
            {cpuTemp >= 999 && (
              <div className="space-y-4 mt-8">
                <p className="text-5xl">💥🔥💀</p>
                <p className="text-2xl font-bold">
                  YOUR COMPUTER HAS MELTED!
                </p>
                <p className="text-sm text-gray-300">
                  (Just kidding! It&apos;s fine. Probably.) 😅
                </p>
                <p className="text-xs text-gray-400">
                  Returning to safety...
                </p>
              </div>
            )}
          </div>

          {cpuTemp < 999 && (
            <div className="mt-8">
              <p className="text-sm text-gray-300">
                Maybe you should have just{' '}
                <Link href="/kid" className="underline hover:text-white">
                  left me alone
                </Link>
                ! 😤
              </p>
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes fire {
            0% {
              transform: translateY(0) scale(1);
              opacity: 1;
            }
            100% {
              transform: translateY(-100px) scale(1.5);
              opacity: 0;
            }
          }
          .animate-fire {
            animation: fire 2s infinite;
          }
        `}</style>
      </div>
    );
  }

  if (phase === 'self-destruct') {
    return (
      <div 
        className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-all ${
          warningFlash ? 'bg-red-600' : 'bg-black'
        }`}
        style={{
          transform: `rotate(${Math.sin(countdown) * 5}deg) scale(${1 + (10 - countdown) * 0.05})`,
          filter: `contrast(${1 + glitchIntensity})`
        }}
      >
        {countdown === 0 && (
          <>
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute text-6xl animate-explode"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`
                }}
              >
                💥
              </div>
            ))}
          </>
        )}

        <div className="relative z-10 text-center text-white">
          <div className="text-9xl mb-8 animate-spin">
            💣
          </div>

          <h1 className="text-7xl font-black mb-6 animate-pulse">
            {countdown > 0 ? countdown : 'BOOM!!!'}
          </h1>

          {countdown > 0 ? (
            <>
              <p className="text-3xl font-mono mb-8 text-red-300">
                SELF-DESTRUCT SEQUENCE ACTIVE
              </p>
              <p className="text-xl text-yellow-400 animate-bounce">
                IT WAS NICE KNOWING YOU... NOT! 😜
              </p>
              <p className="text-sm text-gray-400 mt-4">
                You really should&apos;ve just left...
              </p>
            </>
          ) : (
            <div className="space-y-4 animate-pulse">
              <p className="text-6xl">💥💥💥</p>
              <p className="text-2xl">
                The page has exploded!
              </p>
              <p className="text-sm text-gray-300">
                Redirecting to safety...
              </p>
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes explode {
            0% { 
              transform: scale(0) rotate(0deg); 
              opacity: 1; 
            }
            50% { 
              transform: scale(2) rotate(180deg); 
              opacity: 1; 
            }
            100% { 
              transform: scale(4) rotate(360deg); 
              opacity: 0; 
            }
          }
          .animate-explode {
            animation: explode 1s ease-out forwards;
          }
        `}</style>
      </div>
    );
  }

  return null;
}
