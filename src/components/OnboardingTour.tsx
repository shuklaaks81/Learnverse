"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface OnboardingTourProps {
  onComplete: () => void;
  isPremium?: boolean;
}

interface TourStep {
  id: number;
  title: string;
  description: string;
  highlight: string | null;
  position: string;
  route?: string;
  action?: string;
  emoji?: string;
}

const tourSteps: TourStep[] = [
  {
    id: 1,
    title: "Welcome to Learnverse! 🎉",
    description: "Let's take a quick interactive tour to show you around! We'll visit different pages and explore features together!",
    highlight: null,
    position: "center",
    emoji: "🚀",
  },
  {
    id: 2,
    title: "Your Dashboard 🏠",
    description: "This is your learning hub! Here you can see all available activities. Each colorful card takes you to a different adventure!",
    highlight: "features",
    position: "center",
    route: "/kid",
  },
  {
    id: 3,
    title: "Games Section 🎮",
    description: "Games make learning fun! Play interactive challenges while mastering new skills. Let's check out the games page!",
    highlight: null,
    position: "center",
    route: "/kid/games",
    action: "navigate",
    emoji: "🎮",
  },
  {
    id: 4,
    title: "Lessons Library 📚",
    description: "Your complete learning library! Choose from Math, Science, English, and more. Each lesson is interactive and engaging!",
    highlight: null,
    position: "center",
    route: "/kid/lessons",
    action: "navigate",
    emoji: "📖",
  },
  {
    id: 5,
    title: "AI Tutor 🤖",
    description: "Need help? Your personal AI tutor is here 24/7! Ask questions, get explanations, and learn at your own pace!",
    highlight: null,
    position: "center",
    route: "/kid/tutor",
    action: "navigate",
    emoji: "🤖",
  },
  {
    id: 6,
    title: "Achievements 🏆",
    description: "Track your progress and unlock cool achievements! Complete challenges, build streaks, and become a learning champion!",
    highlight: null,
    position: "center",
    route: "/kid/achievements",
    action: "navigate",
    emoji: "🏆",
  },
  {
    id: 7,
    title: "Shop & Rewards 🛍️",
    description: "Spend your earned coins on awesome items! Unlock avatars, power-ups, themes, and special features!",
    highlight: null,
    position: "center",
    route: "/kid/shop",
    action: "navigate",
    emoji: "💰",
  },
  {
    id: 8,
    title: "Back to Dashboard 🏠",
    description: "Now you know your way around! Let's head back to the dashboard where your adventure begins!",
    highlight: null,
    position: "center",
    route: "/kid",
    action: "navigate",
    emoji: "🎯",
  },
  {
    id: 9,
    title: "Secrets Contract 🤫",
    description: "contract",
    highlight: null,
    position: "center",
  },
];

export function OnboardingTour({ onComplete, isPremium = false }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [contractAccepted, setContractAccepted] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  const step = tourSteps[currentStep];
  const isLastStep = currentStep === tourSteps.length - 1;
  const isContractStep = step.description === "contract";

  // Set tour active flag
  useEffect(() => {
    sessionStorage.setItem('tourActive', 'true');
    return () => {
      sessionStorage.removeItem('tourActive');
    };
  }, []);

  // Handle navigation when step changes
  useEffect(() => {
    if (step.action === "navigate" && step.route && !isNavigating) {
      setIsNavigating(true);
      // Navigate to the route
      router.push(step.route);
      // Reset navigating state after a delay
      setTimeout(() => setIsNavigating(false), 800);
    }
  }, [currentStep, step, router, isNavigating]);

  const handleNext = () => {
    if (isLastStep) {
      // Return to dashboard before completing
      router.push("/kid");
      setTimeout(() => onComplete(), 300);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    router.push("/kid");
    setTimeout(() => onComplete(), 200);
  };

  // Premium cyber theme colors
  const bgGradient = isPremium
    ? "from-purple-900 via-pink-900 to-indigo-900"
    : "from-blue-500 via-purple-500 to-pink-500";
  
  const cardBg = isPremium
    ? "bg-black/80 backdrop-blur-xl border-4 border-cyan-400/50 shadow-[0_0_40px_rgba(0,255,255,0.3)]"
    : "bg-white/95 backdrop-blur-lg border-4 border-white/50";
  
  const textColor = isPremium ? "text-cyan-100" : "text-gray-800";
  const titleColor = isPremium ? "text-cyan-400" : "text-purple-700";

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center">
      {/* Backdrop */}
      <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-95`}>
        {isPremium && (
          <>
            {/* Cyber grid for premium */}
            <div className="absolute inset-0 opacity-20">
              {[...Array(15)].map((_, i) => (
                <div key={`h-${i}`} className="absolute w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" style={{top: `${i * 7}%`}} />
              ))}
              {[...Array(15)].map((_, i) => (
                <div key={`v-${i}`} className="absolute h-full w-px bg-gradient-to-b from-transparent via-purple-400 to-transparent" style={{left: `${i * 7}%`}} />
              ))}
            </div>
            {/* Floating particles */}
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full animate-pulse"
                style={{
                  width: Math.random() * 3 + 1 + 'px',
                  height: Math.random() * 3 + 1 + 'px',
                  background: '#0ff',
                  top: Math.random() * 100 + '%',
                  left: Math.random() * 100 + '%',
                  boxShadow: '0 0 10px #0ff',
                  animationDelay: Math.random() * 2 + 's',
                }}
              />
            ))}
          </>
        )}
      </div>

      {/* Tour Card */}
      <div className={`relative z-10 max-w-2xl w-full mx-4 ${cardBg} rounded-3xl shadow-2xl p-8 ${isNavigating ? 'animate-pulse' : 'animate-slideInUp'}`}>
        {!isContractStep ? (
          <>
            {/* Step Indicator with Icons */}
            <div className="flex justify-center items-center gap-2 mb-6 flex-wrap">
              {tourSteps.map((s, idx) => {
                if (s.description === "contract") return null;
                const isPast = idx < currentStep;
                const isCurrent = idx === currentStep;
                const isFuture = idx > currentStep;
                
                return (
                  <div
                    key={s.id}
                    className={`flex items-center transition-all duration-300 ${
                      isCurrent ? 'scale-125' : 'scale-100'
                    }`}
                  >
                    <div
                      className={`rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                        isPast
                          ? isPremium 
                            ? 'w-8 h-8 bg-cyan-400 text-black shadow-[0_0_10px_#0ff]' 
                            : 'w-8 h-8 bg-green-500 text-white'
                          : isCurrent
                          ? isPremium
                            ? 'w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-600 text-white shadow-[0_0_20px_#0ff] animate-pulse'
                            : 'w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 text-white animate-pulse'
                          : isPremium
                          ? 'w-6 h-6 bg-cyan-900 text-cyan-600'
                          : 'w-6 h-6 bg-gray-300 text-gray-600'
                      }`}
                    >
                      {isPast ? '✓' : idx + 1}
                    </div>
                    {idx < tourSteps.filter(t => t.description !== "contract").length - 1 && (
                      <div
                        className={`h-1 w-4 mx-1 transition-all duration-300 ${
                          isPast
                            ? isPremium ? 'bg-cyan-400' : 'bg-green-500'
                            : isPremium ? 'bg-cyan-900' : 'bg-gray-300'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Current Page Indicator */}
            {step.route && (
              <div className={`text-center mb-4 ${isPremium ? 'text-cyan-400' : 'text-purple-600'} font-mono text-sm`}>
                📍 Currently viewing: <span className="font-bold">{step.route}</span>
              </div>
            )}

            {/* Content */}
            <div className="text-center mb-8">
              {step.emoji && (
                <div className="text-7xl mb-4 animate-bounce">{step.emoji}</div>
              )}
              <h2 className={`text-4xl font-extrabold mb-4 ${titleColor} ${isPremium ? 'drop-shadow-[0_0_15px_rgba(0,255,255,0.7)]' : ''}`}>
                {step.title}
              </h2>
              <p className={`text-xl ${textColor} leading-relaxed font-semibold`}>
                {step.description}
              </p>
              
              {/* Navigation hint */}
              {step.action === "navigate" && (
                <div className={`mt-4 px-4 py-2 rounded-lg ${isPremium ? 'bg-cyan-900/30 border border-cyan-600' : 'bg-purple-100 border border-purple-400'} animate-pulse`}>
                  <p className={`text-sm ${isPremium ? 'text-cyan-300' : 'text-purple-700'} font-bold`}>
                    🚀 We&apos;ll take you to {step.route}!
                  </p>
                </div>
              )}
              
              {/* Tour tip */}
              {!step.action && !isLastStep && (
                <div className={`mt-4 px-4 py-2 rounded-lg ${isPremium ? 'bg-purple-900/30 border border-purple-600' : 'bg-yellow-100 border border-yellow-400'}`}>
                  <p className={`text-xs ${isPremium ? 'text-purple-300' : 'text-yellow-700'} font-semibold`}>
                    💡 Tip: You can press &quot;T&quot; anytime to replay this tour!
                  </p>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 justify-center">
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 ${
                    isPremium
                      ? 'bg-gray-800 text-cyan-400 border-2 border-cyan-900 hover:border-cyan-600'
                      : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                  }`}
                >
                  ← Back
                </button>
              )}
              <button
                onClick={handleSkip}
                className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 ${
                  isPremium
                    ? 'bg-gray-800 text-cyan-400 border-2 border-cyan-900 hover:border-cyan-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Skip Tour
              </button>
              <button
                onClick={handleNext}
                disabled={isNavigating}
                className={`px-8 py-3 rounded-xl font-extrabold transition-all transform hover:scale-110 shadow-lg ${
                  isPremium
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-[0_0_20px_rgba(0,255,255,0.5)] disabled:opacity-50'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white disabled:opacity-50'
                }`}
              >
                {isNavigating ? "Loading..." : isLastStep ? "Finish Tour! 🎉" : step.action === "navigate" ? "Explore! →" : "Next →"}
              </button>
            </div>

            {/* Progress text */}
            <div className={`text-center mt-4 text-sm ${textColor} opacity-70`}>
              Step {currentStep + 1} of {tourSteps.filter(s => s.description !== "contract").length}
            </div>
          </>
        ) : (
          // Contract Step
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">📜✨</div>
            <h2 className={`text-3xl font-extrabold mb-6 ${titleColor}`}>
              The Official Learnverse Secrets Contract
            </h2>
            
            <div className={`${cardBg} ${isPremium ? 'border-cyan-600' : 'border-yellow-400'} rounded-2xl p-6 mb-6 text-left max-h-96 overflow-y-auto`}>
              <p className={`${textColor} text-lg mb-4 leading-relaxed`}>
                <strong>Article 1:</strong> You hereby acknowledge that Learnverse contains <span className="font-bold text-yellow-400">hidden secrets, easter eggs, and mysterious features</span>. 🤫
              </p>
              <p className={`${textColor} text-lg mb-4 leading-relaxed`}>
                <strong>Article 2:</strong> Some secrets may require <span className="font-bold text-pink-400">special key presses, waiting patiently, or discovering hidden paths</span>. Press &quot;I&quot; to replay the intro! 🔑
              </p>
              <p className={`${textColor} text-lg mb-4 leading-relaxed`}>
                <strong>Article 3:</strong> There exist <span className="font-bold text-purple-400">legendary modes, secret pages</span> (like /secrets, /lab, /owner), and <span className="font-bold text-cyan-400">mysterious events</span> that occur at special times. 👀
              </p>
              <p className={`${textColor} text-lg mb-4 leading-relaxed`}>
                <strong>Article 4:</strong> Not all features are immediately visible. <span className="font-bold text-orange-400">Exploration, curiosity, and experimentation</span> are encouraged! 🔍
              </p>
              <p className={`${textColor} text-lg mb-4 leading-relaxed`}>
                <strong>Article 5:</strong> By accepting this contract, you agree to have <span className="font-bold text-green-400">fun, learn enthusiastically</span>, and keep your eyes open for the <span className="font-bold animate-pulse">unexpected</span>! 🎉
              </p>
              <p className={`${textColor} text-sm italic mt-6 text-center opacity-70`}>
                &quot;The biggest secret is that learning itself is an adventure.&quot; - Learnverse 2026
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 mb-6">
              <input
                type="checkbox"
                id="accept-contract"
                checked={contractAccepted}
                onChange={(e) => setContractAccepted(e.target.checked)}
                className="w-6 h-6 cursor-pointer"
              />
              <label htmlFor="accept-contract" className={`${textColor} text-lg font-bold cursor-pointer`}>
                I accept the Secrets Contract and promise to explore! ✨
              </label>
            </div>

            <button
              onClick={handleNext}
              disabled={!contractAccepted}
              className={`px-10 py-4 rounded-2xl font-extrabold text-xl transition-all transform shadow-2xl ${
                contractAccepted
                  ? isPremium
                    ? 'bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-600 text-white hover:scale-110 shadow-[0_0_30px_rgba(0,255,255,0.6)] animate-pulse'
                    : 'bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-600 text-white hover:scale-110 animate-pulse'
                  : 'bg-gray-400 text-gray-700 cursor-not-allowed opacity-50'
              }`}
            >
              Begin My Adventure! 🚀✨
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideInUp {
          animation: slideInUp 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
