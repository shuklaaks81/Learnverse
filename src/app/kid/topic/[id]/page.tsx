
'use client';

import Image from 'next/image';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSoundEffects } from '@/utils/soundEffects';
import BackgroundMusic from '@/components/BackgroundMusic';
import FunnyAnimations from '@/components/FunnyAnimations';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface TopicLesson {
  id: number;
  title: string;
  icon: string;
  description: string;
  content: string[];
  questions: Question[];
}

// Function to get unit number from lesson ID
const getUnitFromId = (id: number): number => {
  return Math.floor(id / 100);
};

// Dynamic import function
const loadLesson = async (id: number): Promise<TopicLesson | null> => {
  const unit = getUnitFromId(id);
  try {
    const lessonModule = await import(`../lessons/unit${unit}.ts`);
    return lessonModule.lessons[id] || null;
  } catch (error) {
    console.error(`Failed to load lesson ${id}:`, error);
    return null;
  }
};

export default function TopicPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = parseInt(params.id as string);
  const soundEffects = useSoundEffects();

  const [lesson, setLesson] = useState<TopicLesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isQuestionMode, setIsQuestionMode] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [currentKid, setCurrentKid] = useState<any>(null);

  // Fix hydration by only rendering animations on client
  useEffect(() => {
    setIsMounted(true);
    // Load current kid's data
    const kid = JSON.parse(localStorage.getItem('currentKid') || '{}');
    setCurrentKid(kid);
  }, []);

  // Load lesson dynamically
  useEffect(() => {
    setLoading(true);
    loadLesson(topicId).then((loadedLesson) => {
      setLesson(loadedLesson);
      setLoading(false);
    });
  }, [topicId]);

  const speakText = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Enthusiastic and slightly higher pitch - more fun!
      utterance.rate = 0.95;      // Energetic pace
      utterance.pitch = 1.3;      // Higher pitch - friendly and upbeat!
      utterance.volume = 0.9;     // Clear and confident
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  useEffect(() => {
    if (lesson && !isQuestionMode) {
      speakText(lesson.content[currentSlide]);
    }
  }, [currentSlide, lesson, isQuestionMode, speakText]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-400 via-orange-300 to-pink-300 flex items-center justify-center p-3 sm:p-6">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8 text-center">
          <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">📚</div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Loading lesson...</h1>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-400 via-orange-300 to-pink-300 flex items-center justify-center p-3 sm:p-6">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8 text-center">
          <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">❌</div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Topic Not Found</h1>
          <Link
            href="/kid/units"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-6 py-3 rounded-xl hover:shadow-lg transition-all"
          >
            ← Back to Units
          </Link>
        </div>
      </div>
    );
  }

  const handleNext = () => {
    if (!isQuestionMode) {
      if (currentSlide < lesson.content.length - 1) {
        soundEffects?.playClick();
        setCurrentSlide(currentSlide + 1);
      } else {
        soundEffects?.playCelebration();
        setIsQuestionMode(true);
        speakText("Great job learning! Now let's test what you know!");
      }
    } else {
      if (showExplanation) {
        if (currentQuestion < lesson.questions.length - 1) {
          soundEffects?.playClick();
          setCurrentQuestion(currentQuestion + 1);
          setSelectedAnswer(null);
          setShowExplanation(false);
          setIsCorrect(null);
        } else {
          soundEffects?.playVictory();
          
          // Save progress
          const kid = JSON.parse(localStorage.getItem('currentKid') || '{}');
          if (kid.kidId) {
            const progressKey = `progress_${kid.kidId}`;
            const existingProgress = JSON.parse(localStorage.getItem(progressKey) || '{}');
            
            // Update completed topics
            const completedTopics = existingProgress.completedTopics || [];
            if (!completedTopics.includes(topicId)) {
              completedTopics.push(topicId);
            }
            
            // Calculate overall progress
            const totalTopics = 40; // Update this based on total topics available
            const overallProgress = Math.round((completedTopics.length / totalTopics) * 100);
            
            // Update progress data
            const updatedProgress = {
              ...existingProgress,
              completedTopics,
              lessonsCompleted: completedTopics.length,
              achievements: existingProgress.achievements || Math.floor(completedTopics.length / 5),
              overallProgress,
              lastActive: new Date().toISOString()
            };
            
            localStorage.setItem(progressKey, JSON.stringify(updatedProgress));
          }
          
          alert(`🎉 Lesson Complete! You scored ${score}/${lesson.questions.length}!`);
          router.push('/kid/units');
        }
      }
    }
  };

  const handleAnswerSelect = (index: number) => {
    if (showExplanation) return;
    
    setSelectedAnswer(index);
    setShowExplanation(true);
    
    const question = lesson.questions[currentQuestion];
    const correct = index === question.correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      soundEffects?.playCorrect();
      setScore(score + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      soundEffects?.playWrong();
    }
    
    speakText(question.explanation);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-400 via-orange-300 to-pink-300 p-3 sm:p-4 lg:p-6">
      <BackgroundMusic />
      <FunnyAnimations isCorrect={isCorrect} />
      
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10%',
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              {['🎉', '⭐', '✨', '🌟', '💫', '🎊'][Math.floor(Math.random() * 6)]}
            </div>
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
        .animate-confetti {
          animation: confetti linear forwards;
        }
        @keyframes dance {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(-10deg); }
          50% { transform: translateY(-10px) rotate(10deg); }
          75% { transform: translateY(-20px) rotate(-10deg); }
        }
        .animate-dance {
          animation: dance 0.6s ease-in-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          50% { transform: translateX(10px); }
          75% { transform: translateX(-10px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-4 lg:p-6 mb-3 sm:mb-4 lg:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="text-3xl sm:text-4xl lg:text-5xl">{lesson.icon}</div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">{lesson.title}</h1>
                  <p className="text-sm sm:text-base text-gray-600">{lesson.description}</p>
                </div>
              </div>
            </div>
            <Link
              href="/kid/units"
              className="bg-gray-200 text-gray-700 font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:bg-gray-300 transition-all text-sm sm:text-base"
            >
              ← Exit
            </Link>
          </div>
        </div>

        {/* Lesson Content */}
        {!isQuestionMode ? (
          <div className="bg-white/90 backdrop-blur rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 relative">
            
            {/* i-Ready Style Buddy Circle - Bottom Right Corner */}
            {isMounted && (
            <div className="fixed bottom-6 right-6 z-50">
              <div className="relative">
                {/* Buddy Circle - Custom Drawing */}
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 rounded-full shadow-2xl border-4 border-yellow-300 flex items-center justify-center overflow-hidden animate-pulse">
                  {currentKid?.buddyDrawing ? (
                    <Image 
                      src={currentKid.buddyDrawing} 
                      alt="Your Buddy" 
                      className="w-full h-full object-cover"
                      width={128}
                      height={128}
                    />
                  ) : (
                  <svg width="80" height="80" viewBox="0 0 80 80">
                    <defs>
                      <linearGradient id="skinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FFD700" />
                        <stop offset="100%" stopColor="#FFA500" />
                      </linearGradient>
                      <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FF6B9D" />
                        <stop offset="100%" stopColor="#C239B3" />
                      </linearGradient>
                      <radialGradient id="eyeSparkle">
                        <stop offset="0%" stopColor="#00FFFF" />
                        <stop offset="100%" stopColor="#0000FF" />
                      </radialGradient>
                    </defs>
                    <style>{`
                      @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-3px); }
                      }
                      @keyframes blink {
                        0%, 90%, 100% { opacity: 1; }
                        95% { opacity: 0; }
                      }
                      @keyframes talk {
                        0%, 100% { d: path("M 30 45 Q 40 52 50 45"); }
                        50% { d: path("M 35 48 Q 40 50 45 48"); }
                      }
                      @keyframes pointMove {
                        0%, 100% { transform: translateX(0px) translateY(0px); }
                        50% { transform: translateX(3px) translateY(-2px); }
                      }
                    `}</style>
                    
                    {/* Head */}
                    <circle cx="40" cy="35" r="20" fill="url(#skinGradient)" stroke="#FF6347" strokeWidth="2" style={{ animation: 'float 2s ease-in-out infinite' }} />
                    
                    {/* Eyes with blink */}
                    <g style={{ animation: 'blink 4s infinite' }}>
                      <circle cx="33" cy="32" r="3" fill="url(#eyeSparkle)" />
                      <circle cx="33" cy="31" r="1" fill="#FFFFFF" />
                      <circle cx="47" cy="32" r="3" fill="url(#eyeSparkle)" />
                      <circle cx="47" cy="31" r="1" fill="#FFFFFF" />
                    </g>
                    
                    {/* Mouth - animates when speaking */}
                    <path 
                      d="M 30 45 Q 40 52 50 45" 
                      stroke="#FF1493" 
                      strokeWidth="2.5" 
                      fill="none"
                      style={{ 
                        animation: isSpeaking ? 'talk 0.3s ease-in-out infinite' : 'none'
                      }}
                    />
                    
                    {/* Body */}
                    <rect x="30" y="55" width="20" height="15" rx="3" fill="url(#bodyGradient)" />
                    
                    {/* Pointing Arm - moves when speaking */}
                    <g style={{ 
                      animation: isSpeaking ? 'pointMove 0.6s ease-in-out infinite' : 'none',
                      transformOrigin: '40px 60px'
                    }}>
                      <path d="M 40 60 Q 50 58 58 55" stroke="url(#skinGradient)" strokeWidth="3" fill="none" strokeLinecap="round" />
                      <circle cx="60" cy="54" r="2" fill="#00FF00" />
                      {/* Pointing finger indicator */}
                      <path d="M 62 54 L 68 54 M 68 54 L 65 51 M 68 54 L 65 57" stroke="#00FF00" strokeWidth="2" fill="none" strokeLinecap="round" />
                    </g>
                    
                    {/* Left arm */}
                    <path d="M 40 60 Q 30 58 22 61" stroke="url(#skinGradient)" strokeWidth="3" fill="none" strokeLinecap="round" />
                  </svg>
                  )}
                </div>
                
                {/* Speech bubble when speaking */}
                {isSpeaking && (
                  <div className="absolute -top-16 -left-32 bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 rounded-xl px-4 py-2 shadow-lg border-2 border-rainbow-500 animate-bounce">
                    <p className="text-xs font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">🗣️ Listen!</p>
                    <div className="absolute bottom-0 right-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white transform translate-y-full"></div>
                  </div>
                )}
              </div>
            </div>
            )}
            <div className="mb-4 sm:mb-6">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <span className="text-xs sm:text-sm font-semibold text-purple-600">
                  Slide {currentSlide + 1} of {lesson.content.length}
                </span>
                <div className="flex gap-1 sm:gap-2">
                  {lesson.content.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 rounded-full transition-all ${
                        index === currentSlide ? 'w-8 bg-purple-600' : 'w-2 bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center py-6 sm:py-8 lg:py-12">
              <style>{`
                @keyframes letterFall {
                  0% { 
                    opacity: 0; 
                    transform: translateY(-30px) rotate(-5deg); 
                  }
                  50% {
                    opacity: 1;
                  }
                  100% { 
                    opacity: 1; 
                    transform: translateY(0) rotate(0deg); 
                  }
                }
              `}</style>

              {/* Controls - MOVED TO TOP */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-0 mb-6">
                <button
                  onClick={() => {
                    if (currentSlide > 0) {
                      soundEffects?.playClick();
                      setCurrentSlide(currentSlide - 1);
                    }
                  }}
                  disabled={currentSlide === 0}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold transition-all text-sm sm:text-base ${
                    currentSlide === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                  }`}
                >
                  ← Previous
                </button>

                <button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-6 sm:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:shadow-lg transition-all hover:scale-105 text-sm sm:text-base"
                >
                  {currentSlide === lesson.content.length - 1 ? 'Start Quiz! 🎯' : 'Next →'}
                </button>
              </div>

              <p className="text-base sm:text-xl lg:text-2xl text-gray-800 leading-relaxed mb-4 sm:mb-6 lg:mb-8">
                {lesson.content[currentSlide].split('').map((char, index) => (
                  <span
                    key={`${currentSlide}-${index}`}
                    style={{
                      display: 'inline-block',
                      animation: `letterFall 0.5s ease-out ${index * 0.02}s both`,
                      whiteSpace: char === ' ' ? 'pre' : 'normal'
                    }}
                  >
                    {char}
                  </span>
                ))}
              </p>
              
              {isSpeaking && (
                <div className="text-4xl sm:text-5xl lg:text-6xl animate-bounce mb-3 sm:mb-4">🗣️</div>
              )}
              
              {/* Animated Buddy */}
              {isQuestionMode && (
                <div className={`text-8xl ${isCorrect === true ? 'animate-dance' : isCorrect === false ? 'animate-shake' : ''}`}>
                  {isCorrect === true ? '🎉' : isCorrect === false ? '😅' : '🤔'}
                </div>
              )}
            </div>
          </div>
        ) : (
          // Question Mode
          <div className="bg-white/90 backdrop-blur rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
            <div className="mb-4 sm:mb-6">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <span className="text-xs sm:text-sm font-semibold text-purple-600">
                  Question {currentQuestion + 1} of {lesson.questions.length}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-green-600">
                  Score: {score}/{lesson.questions.length}
                </span>
              </div>
            </div>

            {showExplanation && (
              <button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl hover:shadow-lg transition-all hover:scale-105 text-sm sm:text-base mb-4 sm:mb-6"
              >
                {currentQuestion === lesson.questions.length - 1 ? '🎉 Finish Lesson' : 'Next Question →'}
              </button>
            )}

            <div className="mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
                {lesson.questions[currentQuestion].question}
              </h2>

              <div className="space-y-2 sm:space-y-3">
                {lesson.questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showExplanation}
                    className={`w-full p-3 sm:p-4 rounded-lg sm:rounded-xl text-left font-semibold transition-all text-sm sm:text-base ${
                      showExplanation
                        ? index === lesson.questions[currentQuestion].correctAnswer
                          ? 'bg-green-100 border-2 border-green-500'
                          : index === selectedAnswer
                          ? 'bg-red-100 border-2 border-red-500'
                          : 'bg-gray-100 border-2 border-gray-300'
                        : 'bg-white border-2 border-gray-300 hover:border-purple-500 hover:shadow-md'
                    }`}
                  >
                    {option}
                    {showExplanation && index === lesson.questions[currentQuestion].correctAnswer && ' ✅'}
                    {showExplanation && index === selectedAnswer && index !== lesson.questions[currentQuestion].correctAnswer && ' ❌'}
                  </button>
                ))}
              </div>
            </div>

            {showExplanation && (
              <div className="bg-blue-50 border-2 border-blue-300 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
                <h3 className="font-bold text-blue-800 mb-2 text-sm sm:text-base">💡 Explanation:</h3>
                <p className="text-blue-900 text-sm sm:text-base">{lesson.questions[currentQuestion].explanation}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
