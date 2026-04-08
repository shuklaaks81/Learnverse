'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  DragDropGame,
  MatchingGame,
  DrawingActivity,
  NumberCatchGame,
  CountingAnimation,
  TeachActivity
} from '@/components/InteractiveLessonComponents';
import { SoundEffects } from '@/utils/soundEffects';
import { updateStreak } from '@/utils/streakTracker';

interface GeneratedLesson {
  id?: string;
  title: string;
  settings?: any;
  activities: any[];
  timestamp?: number;
}

export default function LessonPlayer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPreview = (searchParams && searchParams.get('preview') === 'true') || false;
  const [lesson, setLesson] = useState<GeneratedLesson | null>(null);
  const [currentActivity, setCurrentActivity] = useState(0);
  const [coins, setCoins] = useState(0);
  const [stars, setStars] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [sounds, setSounds] = useState<SoundEffects | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Check if this is a preview lesson from the generator
        if (isPreview) {
          const previewLessonStr = localStorage.getItem('previewLesson');
          if (previewLessonStr) {
            setLesson(JSON.parse(previewLessonStr));
          } else {
            console.warn('No preview lesson found');
            router.push('/owner/generate-lessons');
            return;
          }
        } else {
          // Load the active generated lesson
          const activeLessonStr = localStorage.getItem('activeGeneratedLesson');
          if (activeLessonStr) {
            setLesson(JSON.parse(activeLessonStr));
          } else {
            // No lesson found - redirect instead of blank screen
            console.warn('No active lesson found, redirecting...');
            setTimeout(() => router.push('/kid/lesson-generator'), 1000);
          }
        }

        // Initialize sounds
        setSounds(new SoundEffects());
      } catch (error) {
        console.error('Error loading lesson:', error);
        // Redirect on error instead of blank screen
        setTimeout(() => router.push('/kid/lesson-generator'), 1000);
      }
    }
  }, [router, isPreview]);

  const handleActivityComplete = () => {
    sounds?.playCorrect();
    
    // Award coins and stars for completing activity
    setCoins(prev => prev + 10);
    setStars(prev => prev + 1);
    setShowReward(true);
    
    setTimeout(() => {
      setShowReward(false);
      
      if (lesson && currentActivity < lesson.activities.length - 1) {
        setCurrentActivity(currentActivity + 1);
      } else {
        handleLessonComplete();
      }
    }, 1500);
  };

  const handleLessonComplete = () => {
    sounds?.playCorrect();
    updateStreak();
    
    // Save progress and coins
    const kidData = localStorage.getItem('currentKid');
    if (kidData && lesson) {
      const kid = JSON.parse(kidData);
      
      // Save completed lesson
      const completedLessons = JSON.parse(localStorage.getItem(`kid_${kid.kidId}_completedGeneratedLessons`) || '[]');
      if (!completedLessons.includes(lesson.id)) {
        completedLessons.push(lesson.id);
        localStorage.setItem(`kid_${kid.kidId}_completedGeneratedLessons`, JSON.stringify(completedLessons));
      }
      
      // If this lesson came from the map, track it there too
      if ((lesson as any).nodeId) {
        const completedMapLessons = JSON.parse(localStorage.getItem(`kid_${kid.kidId}_completedMapLessons`) || '[]');
        if (!completedMapLessons.includes((lesson as any).nodeId)) {
          completedMapLessons.push((lesson as any).nodeId);
          localStorage.setItem(`kid_${kid.kidId}_completedMapLessons`, JSON.stringify(completedMapLessons));
        }
      }
      
      // If this lesson came from a unit, track it there too
      if ((lesson as any).unitLessonId) {
        const completedUnitLessons = JSON.parse(localStorage.getItem(`kid_${kid.kidId}_completedUnitLessons`) || '[]');
        if (!completedUnitLessons.includes((lesson as any).unitLessonId)) {
          completedUnitLessons.push((lesson as any).unitLessonId);
          localStorage.setItem(`kid_${kid.kidId}_completedUnitLessons`, JSON.stringify(completedUnitLessons));
        }
        
        // Check if unit is complete and mark it
        if ((lesson as any).unitId) {
          const unitId = (lesson as any).unitId;
          // This will be checked on the unit page to show completion
        }
      }
      
      // Add coins
      const currentCoins = parseInt(localStorage.getItem(`kid_${kid.kidId}_coins`) || '0');
      localStorage.setItem(`kid_${kid.kidId}_coins`, (currentCoins + coins).toString());
    }
  };

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 flex items-center justify-center">
        <div className="bg-white/90 rounded-3xl p-12 text-center shadow-2xl">
          <div className="text-6xl mb-4 animate-bounce">⏳</div>
          <div className="text-2xl font-bold text-gray-800 mb-2">Loading your lesson...</div>
          <div className="text-gray-600">This will only take a moment!</div>
        </div>
      </div>
    );
  }

  const currentActivityData = lesson.activities[currentActivity];
  const progress = ((currentActivity + 1) / lesson.activities.length) * 100;

  const renderActivity = () => {
    switch (currentActivityData.type) {
      case 'teach':
        return (
          <TeachActivity
            concept={currentActivityData.data.concept}
            examples={currentActivityData.data.examples}
            visualAid={currentActivityData.data.visualAid}
            funFact={currentActivityData.data.funFact}
            onComplete={handleActivityComplete}
          />
        );

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

      case 'animation':
        if (currentActivityData.data.numbers && currentActivityData.data.operation) {
          return (
            <CountingAnimation
              numbers={currentActivityData.data.numbers}
              operation={currentActivityData.data.operation}
              answer={currentActivityData.data.answer}
              onComplete={handleActivityComplete}
            />
          );
        }
        return (
          <div className="w-full max-w-4xl mx-auto p-12 text-center">
            <div className="text-6xl mb-6 animate-pulse">🎬</div>
            <h2 className="text-4xl font-bold text-white mb-4">Animation</h2>
            <p className="text-xl text-white/90 mb-8">{currentActivityData.data.text}</p>
            <button
              onClick={handleActivityComplete}
              className="px-12 py-6 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-2xl font-bold text-2xl hover:scale-110 transition-all shadow-2xl"
            >
              Continue 👉
            </button>
          </div>
        );

      case 'dragdrop':
        return (
          <div className="w-full max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-white text-center mb-6">{currentActivityData.data.instruction}</h3>
            <DragDropGame
              items={currentActivityData.data.items}
              zones={currentActivityData.data.zones}
              onComplete={handleActivityComplete}
            />
          </div>
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
          <div className="w-full max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-white text-center mb-6">{currentActivityData.data.gameName}</h3>
            <p className="text-xl text-white text-center mb-8">{currentActivityData.data.instructions}</p>
            <NumberCatchGame
              targetNumber={currentActivityData.data.targetNumber || 10}
              onComplete={handleActivityComplete}
            />
          </div>
        );

      case 'quiz':
        return (
          <QuizActivity
            questions={currentActivityData.data.questions}
            onComplete={handleActivityComplete}
            sounds={sounds}
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
            <div className="flex gap-4 justify-center">
              {(searchParams && searchParams.get('source') === 'map') ? (
                <button
                  onClick={() => router.push('/kid/lesson-map')}
                  className="px-12 py-6 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-2xl font-bold text-2xl hover:scale-110 transition-all shadow-2xl"
                >
                  🗺️ Back to Map
                </button>
              ) : (searchParams && searchParams.get('source') === 'unit') ? (
                <button
                  onClick={() => {
                    // Go back to the unit page
                    const unitId = (lesson as any)?.unitId;
                    if (unitId) {
                      router.push(`/kid/unit-map/${unitId}`);
                    } else {
                      router.push('/kid/unit-map');
                    }
                  }}
                  className="px-12 py-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-bold text-2xl hover:scale-110 transition-all shadow-2xl"
                >
                  📚 Back to Unit
                </button>
              ) : (
                <button
                  onClick={() => router.push('/kid/lesson-generator')}
                  className="px-12 py-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-bold text-2xl hover:scale-110 transition-all shadow-2xl"
                >
                  Create Another ✨
                </button>
              )}
              <button
                onClick={() => router.push('/kid')}
                className="px-12 py-6 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-2xl font-bold text-2xl hover:scale-110 transition-all shadow-2xl"
              >
                Back Home 🏠
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="w-full max-w-4xl mx-auto p-12 text-center">
            <div className="text-6xl mb-6">❓</div>
            <h2 className="text-3xl font-bold text-white mb-4">Unknown Activity</h2>
            <button
              onClick={handleActivityComplete}
              className="px-8 py-4 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-xl font-bold text-xl hover:scale-110 transition-all"
            >
              Skip →
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 p-4">
      {/* Preview Mode Banner */}
      {isPreview && (
        <div className="max-w-6xl mx-auto mb-4">
          <div className="bg-yellow-400 border-4 border-yellow-600 rounded-2xl p-4 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <span className="text-3xl">👁️</span>
              <div>
                <div className="font-bold text-gray-900 text-lg">Preview Mode</div>
                <div className="text-sm text-gray-700">Testing AI-generated lesson</div>
              </div>
            </div>
            <button
              onClick={() => router.push('/owner/generate-lessons')}
              className="px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold transition-all"
            >
              ← Back to Generator
            </button>
          </div>
        </div>
      )}
      
      {/* Header with progress */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="bg-white/90 rounded-2xl shadow-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-gray-800">{lesson.title}</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🪙</span>
                <span className="font-bold text-purple-600">{coins}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                <span className="font-bold text-yellow-600">{stars}</span>
              </div>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-center text-sm text-gray-600 mt-2">
            Activity {currentActivity + 1} of {lesson.activities.length}
          </div>
        </div>
      </div>

      {/* Activity content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        {renderActivity()}
      </div>

      {/* Reward popup */}
      {showReward && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-12 text-center transform scale-110 animate-bounce">
            <div className="text-8xl mb-4">🎉</div>
            <h3 className="text-3xl font-bold text-purple-600 mb-2">Amazing!</h3>
            <div className="text-2xl font-bold text-gray-700">+10 coins</div>
          </div>
        </div>
      )}
    </div>
  );
}

// Quiz Activity Component
interface QuizActivityProps {
  questions: any[];
  onComplete: () => void;
  sounds: SoundEffects | null;
}

function QuizActivity({ questions, onComplete, sounds }: QuizActivityProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const question = questions[currentQuestion];

  const handleAnswerSelect = (index: number) => {
    if (showFeedback) return;
    
    setSelectedAnswer(index);
    setShowFeedback(true);
    
    if (index === question.correctAnswer) {
      sounds?.playCorrect();
      setScore(score + 1);
    } else {
      sounds?.playWrong();
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        onComplete();
      }
    }, 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-8">
      <div className="bg-white/95 rounded-3xl p-8 shadow-2xl">
        {/* Question header */}
        <div className="mb-8">
          <div className="text-sm font-bold text-gray-500 mb-2">
            Question {currentQuestion + 1} of {questions.length}
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-4">{question.question}</h3>
        </div>

        {/* Answer options */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          {question.options.map((option: string, index: number) => {
            const isCorrect = index === question.correctAnswer;
            const isSelected = index === selectedAnswer;
            
            let bgClass = 'bg-gray-100 hover:bg-gray-200';
            if (showFeedback && isSelected) {
              bgClass = isCorrect
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white';
            } else if (showFeedback && isCorrect) {
              bgClass = 'bg-green-500 text-white';
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showFeedback}
                className={`p-6 rounded-xl text-left font-bold text-lg transition-all transform hover:scale-105 ${bgClass} ${
                  showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className={`p-6 rounded-xl ${
            selectedAnswer === question.correctAnswer ? 'bg-green-100' : 'bg-yellow-100'
          }`}>
            <p className="text-lg font-bold text-gray-800">{question.explanation}</p>
          </div>
        )}

        {/* Score */}
        <div className="text-center mt-6">
          <p className="text-xl font-bold text-purple-600">
            Score: {score} / {questions.length}
          </p>
        </div>
      </div>
    </div>
  );
}
