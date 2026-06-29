"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  DragDropGame,
  MatchingGame,
  DrawingActivity,
  NumberCatchGame,
  TapSequenceChallenge,
  CountingAnimation
} from "@/components/InteractiveLessonComponents";
import { useSoundEffects } from "@/utils/soundEffects";
import { updateStreak } from "@/utils/streakTracker";
import { getLessonData } from "@/data/interactiveLessons";

// Activity Types
type ActivityType =
  | 'intro'
  | 'dragdrop'
  | 'matching'
  | 'drawing'
  | 'minigame'
  | 'tapsequence'
  | 'animation'
  | 'question'
  | 'celebration';

interface LessonActivity {
  type: ActivityType;
  data: any;
}

function InteractiveLessonContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lessonId = searchParams?.get("id") || "101";
  const sounds = useSoundEffects();

  const [currentActivity, setCurrentActivity] = useState(0);
  const [coins, setCoins] = useState(0);
  const [stars, setStars] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [lessonComplete, setLessonComplete] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const version = localStorage.getItem('learnverseVersion') || 'original';
      setIsPremium(version === 'premium');
    }
  }, []);

  // Get lesson activities based on ID
  const getLessonActivities = (id: string): LessonActivity[] => {
    const lessonData = getLessonData(id);
    return lessonData.activities;
  };

  const activities = getLessonActivities(lessonId);

  const handleActivityComplete = () => {
    sounds?.playCelebration();
    
    // Award coins and stars for completing activity
    setCoins(prev => prev + 10);
    setStars(prev => prev + 1);
    setShowReward(true);
    
    setTimeout(() => {
      setShowReward(false);
      
      if (currentActivity < activities.length - 1) {
        setCurrentActivity(currentActivity + 1);
      } else {
        setLessonComplete(true);
        handleLessonComplete();
      }
    }, 1500);
  };

  const handleLessonComplete = () => {
    sounds?.playCelebration();
    const result = updateStreak();
    
    // Save progress to localStorage
    const kidData = localStorage.getItem('currentKid');
    if (kidData) {
      const kid = JSON.parse(kidData);
      const completedLessons = JSON.parse(localStorage.getItem(`kid_${kid.kidId}_completedLessons`) || '[]');
      if (!completedLessons.includes(lessonId)) {
        completedLessons.push(lessonId);
        localStorage.setItem(`kid_${kid.kidId}_completedLessons`, JSON.stringify(completedLessons));
      }
      
      // Add coins
      const currentCoins = parseInt(localStorage.getItem(`kid_${kid.kidId}_coins`) || '0');
      localStorage.setItem(`kid_${kid.kidId}_coins`, (currentCoins + coins).toString());
    }
  };

  const currentActivityData = activities[currentActivity];
  const progress = ((currentActivity + 1) / activities.length) * 100;

  // Render current activity
  const renderActivity = () => {
    switch (currentActivityData.type) {
      case 'intro':
        return (
          <div className="w-full max-w-4xl mx-auto p-12 text-center">
            <div className="text-8xl mb-6 animate-bounce">{currentActivityData.data.emoji}</div>
            <h1 className="text-5xl font-bold text-white mb-4">{currentActivityData.data.title}</h1>
            <p className="text-2xl text-white/90 mb-8">{currentActivityData.data.description}</p>
            <button
              onClick={handleActivityComplete}
              className="px-12 py-6 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-2xl font-bold text-2xl hover:scale-110 transition-all shadow-2xl"
            >
              Let&apos;s Go! 🚀
            </button>
          </div>
        );

      case 'dragdrop':
        return (
          <DragDropGame
            items={currentActivityData.data.items}
            zones={currentActivityData.data.zones}
            onComplete={handleActivityComplete}
          />
        );

      case 'matching':
        return (
          <MatchingGame
            pairs={currentActivityData.data.pairs}
            onComplete={handleActivityComplete}
          />
        );

      case 'drawing':
        return (
          <DrawingActivity
            prompt={currentActivityData.data.prompt}
            onComplete={handleActivityComplete}
          />
        );

      case 'minigame':
        return (
          <NumberCatchGame
            targetNumber={currentActivityData.data.targetNumber}
            onComplete={handleActivityComplete}
          />
        );

      case 'tapsequence':
        return (
          <TapSequenceChallenge
            sequence={currentActivityData.data.sequence}
            onComplete={handleActivityComplete}
          />
        );

      case 'animation':
        return (
          <CountingAnimation
            numbers={currentActivityData.data.numbers}
            operation={currentActivityData.data.operation}
            answer={currentActivityData.data.answer}
            onComplete={handleActivityComplete}
          />
        );

      case 'celebration':
        return (
          <div className="w-full max-w-4xl mx-auto p-12 text-center">
            <div className="text-8xl mb-6 animate-bounce">🎉</div>
            <h1 className="text-5xl font-bold text-white mb-4">{currentActivityData.data.message}</h1>
            <div className="bg-white/90 rounded-3xl p-8 mb-8 max-w-md mx-auto">
              <div className="text-6xl mb-4">🪙</div>
              <div className="text-3xl font-bold text-purple-600">+{currentActivityData.data.coinsEarned} Coins!</div>
              <div className="text-5xl my-4">⭐</div>
              <div className="text-3xl font-bold text-yellow-600">+{currentActivityData.data.starsEarned} Stars!</div>
            </div>
            <Link href="/kid/lessons">
              <button className="px-12 py-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-bold text-2xl hover:scale-110 transition-all shadow-2xl">
                Back to Lessons ✨
              </button>
            </Link>
          </div>
        );

      default:
        return <div>Unknown activity type</div>;
    }
  };

  // 🚀 PREMIUM LESSON PLAYER! 💎✨
  if (isPremium) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Cyber Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950">
          {/* Animated Grid */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(20)].map((_, i) => (
              <div key={`h-${i}`} className="absolute w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" style={{top: `${i * 5}%`}} />
            ))}
            {[...Array(20)].map((_, i) => (
              <div key={`v-${i}`} className="absolute h-full w-px bg-gradient-to-b from-transparent via-purple-400 to-transparent" style={{left: `${i * 5}%`}} />
            ))}
          </div>
          
          {/* Floating Particles */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-float-particle"
              style={{
                width: Math.random() * 4 + 2 + 'px',
                height: Math.random() * 4 + 2 + 'px',
                background: `${['#0ff', '#f0f', '#ff0'][Math.floor(Math.random() * 3)]}`,
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                boxShadow: `0 0 ${Math.random() * 20 + 10}px currentColor`,
                animationDelay: Math.random() * 5 + 's',
                animationDuration: Math.random() * 15 + 10 + 's'
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 p-4">
          {/* Header */}
          <div className="max-w-6xl mx-auto mb-6">
            <div className="futuristic-glass p-6 rounded-2xl flex justify-between items-center mb-4">
              <Link href="/kid/lessons">
                <button className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-3 rounded-xl font-bold shadow-[0_0_30px_rgba(0,255,255,0.5)] hover:shadow-[0_0_50px_rgba(0,255,255,0.8)] hover:scale-105 transition-all border-2 border-white/30">
                  ← Back
                </button>
              </Link>
              <div className="flex gap-4 items-center">
                <div className="futuristic-glass px-6 py-3 rounded-xl font-bold text-yellow-400 text-xl shadow-[0_0_20px_rgba(255,215,0,0.5)] border-2 border-yellow-400/30">
                  ⭐ {stars}
                </div>
                <div className="futuristic-glass px-6 py-3 rounded-xl font-bold text-purple-300 text-xl shadow-[0_0_20px_rgba(147,51,234,0.5)] border-2 border-purple-400/30">
                  🪙 {coins}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white/10 backdrop-blur rounded-full h-8 overflow-hidden shadow-[0_0_20px_rgba(0,255,255,0.3)] border-2 border-white/20">
              <div
                className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 h-full transition-all duration-500 flex items-center justify-center text-white font-bold text-lg shadow-[0_0_30px_rgba(0,255,0,0.5)]"
                style={{ width: `${progress}%` }}
              >
                {Math.round(progress)}%
              </div>
            </div>
          </div>

          {/* Activity Content */}
          <div className="max-w-6xl mx-auto">
            {renderActivity()}
          </div>

          {/* Reward Popup */}
          {showReward && (
            <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
              <div className="futuristic-glass p-8 rounded-3xl shadow-[0_0_60px_rgba(0,255,255,0.8)] animate-[popIn_0.5s_ease-out] border-4 border-cyan-400/50">
                <div className="text-7xl mb-4 animate-bounce drop-shadow-[0_0_20px_rgba(255,215,0,0.8)]">⭐</div>
                <div className="text-4xl font-bold glow-text mb-2">+10 Coins!</div>
                <div className="text-3xl font-bold text-yellow-400 drop-shadow-[0_0_15px_rgba(255,215,0,0.8)]">+1 Star!</div>
              </div>
            </div>
          )}

          {/* Confetti when completing activities */}
          {showReward && (
            <div className="fixed inset-0 pointer-events-none z-40">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: '-5%',
                    backgroundColor: ['#0ff', '#f0f', '#ff0', '#0f0', '#f00'][Math.floor(Math.random() * 5)],
                    boxShadow: `0 0 10px currentColor`,
                    animation: `confetti 2s ease-out forwards`,
                    animationDelay: `${Math.random() * 0.3}s`
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes float-particle {
            0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
            50% { transform: translateY(-100px) translateX(50px); opacity: 1; }
          }
          @keyframes confetti {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(720deg);
              opacity: 0;
            }
          }
          @keyframes popIn {
            0% { transform: scale(0); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  // Original UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-4 relative overflow-hidden animate-gradient-shift" style={{ backgroundSize: '200% 200%' }}>
      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes popIn {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes scaleIn {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .animate-gradient-shift {
          animation: gradient-shift 15s ease infinite;
        }
        .shake {
          animation: shake 0.3s;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
      `}</style>

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex justify-between items-center mb-4">
          <Link href="/kid/lessons">
            <button className="px-6 py-3 bg-white/90 rounded-xl font-bold text-purple-600 hover:scale-105 transition-all shadow-lg">
              ← Back
            </button>
          </Link>
          <div className="flex gap-4 items-center">
            <div className="bg-white/90 px-6 py-3 rounded-xl font-bold text-yellow-600 text-xl shadow-lg">
              ⭐ {stars}
            </div>
            <div className="bg-white/90 px-6 py-3 rounded-xl font-bold text-purple-600 text-xl shadow-lg">
              🪙 {coins}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white/50 rounded-full h-6 overflow-hidden shadow-lg">
          <div
            className="bg-gradient-to-r from-green-400 to-blue-500 h-full transition-all duration-500 flex items-center justify-center text-white font-bold"
            style={{ width: `${progress}%` }}
          >
            {Math.round(progress)}%
          </div>
        </div>
      </div>

      {/* Activity Content */}
      <div className="max-w-6xl mx-auto">
        {renderActivity()}
      </div>

      {/* Reward Popup */}
      {showReward && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white rounded-3xl p-8 shadow-2xl animate-[popIn_0.5s_ease-out]">
            <div className="text-6xl mb-2">⭐</div>
            <div className="text-3xl font-bold text-purple-600">+10 Coins!</div>
            <div className="text-2xl font-bold text-yellow-600">+1 Star!</div>
          </div>
        </div>
      )}

      {/* Confetti when completing activities */}
      {showReward && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-5%',
                backgroundColor: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'][Math.floor(Math.random() * 5)],
                animation: `confetti 2s ease-out forwards`,
                animationDelay: `${Math.random() * 0.3}s`
              }}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default function InteractiveLessonPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
        <div className="text-white text-4xl font-bold animate-pulse">Loading...</div>
      </div>
    }>
      <InteractiveLessonContent />
    </Suspense>
  );
}
