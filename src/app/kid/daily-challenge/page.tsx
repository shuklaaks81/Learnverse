'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSoundEffects } from '@/utils/soundEffects';
import BackgroundMusic from '@/components/BackgroundMusic';
import { updateStreak } from '@/utils/streakTracker';

interface Challenge {
  id: string;
  date: string;
  title: string;
  description: string;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
  reward: number;
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }[];
}

export default function DailyChallengePage() {
  const router = useRouter();
  const soundEffects = useSoundEffects();
  const [currentKid, setCurrentKid] = useState<any>(null);
  const [todayChallenge, setTodayChallenge] = useState<Challenge | null>(null);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const kid = JSON.parse(localStorage.getItem('currentKid') || '{}');
    setCurrentKid(kid);

    // Generate today's challenge
    const today = new Date().toDateString();
    const challenge = generateDailyChallenge(today);
    setTodayChallenge(challenge);

    // Check if already completed today
    const completedChallenges = JSON.parse(localStorage.getItem('completedChallenges') || '{}');
    if (completedChallenges[today]) {
      setHasCompleted(true);
    }
  }, []);

  const generateDailyChallenge = (dateString: string): Challenge => {
    // Use date as seed for consistent daily challenge
    const dateNum = new Date(dateString).getTime();
    const random = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    const difficulties = ['easy', 'medium', 'hard'] as const;
    const difficulty = difficulties[Math.floor(random(dateNum) * 3)];
    
    const challenges = {
      easy: {
        title: '🌟 Quick Brain Warm-up',
        description: 'Answer 3 quick questions to start your day!',
        icon: '⭐',
        reward: 50,
        time: 60,
        questions: [
          {
            question: 'What is 15 + 27?',
            options: ['32', '42', '52', '62'],
            correctAnswer: 1,
            explanation: '15 + 27 = 42. Add the ones: 5+7=12 (write 2, carry 1). Add the tens: 1+2+1=4.'
          },
          {
            question: 'Which planet is closest to the Sun?',
            options: ['Venus', 'Mars', 'Mercury', 'Earth'],
            correctAnswer: 2,
            explanation: 'Mercury is the closest planet to the Sun, about 58 million km away!'
          },
          {
            question: 'What is the plural of "child"?',
            options: ['childs', 'children', 'childes', 'child'],
            correctAnswer: 1,
            explanation: 'The plural of "child" is "children" - it\'s an irregular plural!'
          }
        ]
      },
      medium: {
        title: '🔥 Daily Brain Workout',
        description: 'Challenge yourself with 4 questions!',
        icon: '💪',
        reward: 100,
        time: 90,
        questions: [
          {
            question: 'What is 3/4 as a decimal?',
            options: ['0.25', '0.5', '0.75', '1.0'],
            correctAnswer: 2,
            explanation: '3/4 = 0.75 because 3 ÷ 4 = 0.75'
          },
          {
            question: 'What gas do plants absorb during photosynthesis?',
            options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'],
            correctAnswer: 2,
            explanation: 'Plants absorb carbon dioxide (CO₂) and release oxygen during photosynthesis!'
          },
          {
            question: 'Which ancient civilization built the pyramids?',
            options: ['Romans', 'Greeks', 'Egyptians', 'Mayans'],
            correctAnswer: 2,
            explanation: 'The ancient Egyptians built the pyramids over 4,500 years ago!'
          },
          {
            question: 'What is the past tense of "run"?',
            options: ['runned', 'ran', 'running', 'runs'],
            correctAnswer: 1,
            explanation: 'The past tense of "run" is "ran" - it\'s an irregular verb!'
          }
        ]
      },
      hard: {
        title: '💀 IMPOSSIBLE GENIUS CHALLENGE',
        description: 'WARNING: Only LEGENDARY minds can handle this! 🧠⚡',
        icon: '🧠',
        reward: 2000, // Shows 2000, but actually gives 200000! 😈
        actualReward: 200000, // SECRET MEGA REWARD!
        time: 180,
        questions: [
          {
            question: 'How many numbers are there between 1 and 2?',
            options: ['Zero', 'One', 'One hundred', 'Infinity! ♾️'],
            correctAnswer: 3,
            explanation: 'There are infinite numbers between 1 and 2! For example: 1.1, 1.01, 1.001, 1.5, 1.99, 1.999... and so on forever! Between any two numbers, there are always infinite numbers. 🤯'
          },
          {
            question: 'If you fold a piece of paper 42 times, how thick would it be?',
            options: ['As tall as a building', 'As tall as Mount Everest', 'Reaches the MOON! 🌙', 'Reaches the Sun'],
            correctAnswer: 2,
            explanation: 'Folding paper 42 times would make it 439,804,651,110 meters thick - that\'s enough to reach from Earth to the Moon! The power of exponential growth is INSANE! 2^42 = 4,398,046,511,104 paper thicknesses! 🤯'
          },
          {
            question: 'What is the only number that has the same number of letters as its value?',
            options: ['Three', 'Four', 'Five', 'Seven'],
            correctAnswer: 1,
            explanation: 'FOUR is the only number with exactly 4 letters! One=3, Two=3, Three=5, Four=4, Five=4... but FOUR equals 4 and has 4 letters! Mind. Blown. 💥'
          },
          {
            question: 'If you could travel at the speed of light, how long to circle Earth?',
            options: ['1 second', '7.5 seconds', '0.13 seconds (1/8th of a second!)', '1 minute'],
            correctAnswer: 2,
            explanation: 'Light travels SO FAST (299,792 km/s) that it could circle the entire Earth 7.5 times in just ONE SECOND! So once around = 0.13 seconds! That\'s 40,075 km in a blink! ⚡🌍'
          },
          {
            question: 'What never stops growing your entire life?',
            options: ['Your heart', 'Your brain', 'Your ears and nose! 👃👂', 'Your eyes'],
            correctAnswer: 2,
            explanation: 'Your ears and nose NEVER stop growing! The cartilage keeps growing throughout your whole life. That\'s why elderly people often have bigger ears and noses! 👴👵'
          },
          {
            question: 'How many atoms are in ONE grain of sand?',
            options: ['1,000', '1 million', '1 trillion', 'More than all beach sand on Earth! 🤯'],
            correctAnswer: 3,
            explanation: 'One tiny grain of sand contains about 1,000,000,000,000,000,000 (1 quintillion) atoms! That\'s more atoms in ONE grain than all the grains of sand on ALL the beaches on Earth! The microscopic world is HUGE! 🔬✨'
          },
          {
            question: 'What\'s the hardest natural substance on Earth?',
            options: ['Steel', 'Diamond 💎', 'Titanium', 'Obsidian'],
            correctAnswer: 1,
            explanation: 'Diamond is the hardest natural substance! It\'s so hard that only another diamond can cut a diamond! It forms under extreme pressure deep underground. 💎⚡'
          },
          {
            question: 'If you could fold Mount Everest like paper, how many folds to reach the Moon?',
            options: ['100 folds', '50 folds', 'Just 8 folds! 🤯', '20 folds'],
            correctAnswer: 2,
            explanation: 'Even starting with Mount Everest\'s height (8,849m), you\'d only need about 8 MORE folds to reach the moon! Exponential growth is SO powerful: fold 1 = double, fold 2 = quadruple, fold 8 = 256 times taller! 📈🌙'
          },
          {
            question: 'What percentage of your brain do you actually use?',
            options: ['10%', '25%', '50%', '100%! The "10%" myth is FALSE! 🧠'],
            correctAnswer: 3,
            explanation: 'You use 100% of your brain! The "10% myth" is completely false. Brain scans show ALL parts of the brain are active throughout the day. Every part has a job! Your brain is AMAZING! 🧠✨'
          },
          {
            question: 'What travels faster than light?',
            options: ['Nothing can!', 'Quantum entanglement', 'Your imagination! 💭', 'Both B and C!'],
            correctAnswer: 3,
            explanation: 'BOTH! Quantum entanglement affects particles instantly across any distance (spooky action!), AND your imagination can think about traveling anywhere in the universe instantly! Physics + Mind = Incredible! 🚀💭✨'
          }
        ]
      }
    };

    const challengeData = challenges[difficulty];
    
    return {
      id: `challenge-${dateString}`,
      date: dateString,
      title: challengeData.title,
      description: challengeData.description,
      icon: challengeData.icon,
      difficulty,
      reward: challengeData.reward,
      questions: challengeData.questions
    };
  };

  useEffect(() => {
    if (isStarted && !showExplanation && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isStarted && timeLeft === 0 && !showExplanation) {
      // Time's up! Auto-submit wrong answer
      handleAnswerSelect(-1);
    }
  }, [isStarted, timeLeft, showExplanation]);

  const startChallenge = () => {
    soundEffects?.playClick();
    setIsStarted(true);
    setTimeLeft(todayChallenge?.difficulty === 'easy' ? 60 : todayChallenge?.difficulty === 'medium' ? 90 : 120);
  };

  const handleAnswerSelect = (index: number) => {
    if (!todayChallenge || showExplanation) return;
    
    setSelectedAnswer(index);
    setShowExplanation(true);
    
    const correct = index === todayChallenge.questions[currentQuestion].correctAnswer;
    
    if (correct) {
      soundEffects?.playCorrect();
      setScore(score + 1);
    } else {
      soundEffects?.playWrong();
    }
  };

  const handleNext = () => {
    soundEffects?.playClick();
    
    if (currentQuestion < todayChallenge!.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Challenge complete!
      completeChallenge();
    }
  };

  const completeChallenge = () => {
    soundEffects?.playVictory();
    
    const percentage = Math.round((score / todayChallenge!.questions.length) * 100);
    // Use actualReward if it exists (secret mega reward!), otherwise use regular reward
    const baseReward = (todayChallenge! as any).actualReward || todayChallenge!.reward;
    const coinsEarned = Math.floor(baseReward * (percentage / 100));
    
    // Update streak!
    const streakResult = updateStreak();
    const totalCoins = coinsEarned + streakResult.bonusCoins;
    
    // Save completion
    const today = new Date().toDateString();
    const completedChallenges = JSON.parse(localStorage.getItem('completedChallenges') || '{}');
    completedChallenges[today] = {
      score,
      total: todayChallenge!.questions.length,
      coinsEarned,
      difficulty: todayChallenge!.difficulty,
      streakBonus: streakResult.bonusCoins
    };
    localStorage.setItem('completedChallenges', JSON.stringify(completedChallenges));
    
    // Note: Coins already updated in updateStreak(), just reload currentKid
    const updatedKid = JSON.parse(localStorage.getItem('currentKid') || '{}');
    
    // Update kid accounts
    const kidAccounts = JSON.parse(localStorage.getItem('kidAccounts') || '[]');
    const updatedAccounts = kidAccounts.map((kid: any) => 
      kid.id === updatedKid.id ? updatedKid : kid
    );
    localStorage.setItem('kidAccounts', JSON.stringify(updatedAccounts));
    
    setCurrentKid(updatedKid);
    setHasCompleted(true);
  };

  if (!todayChallenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-400 via-orange-300 to-pink-300 flex items-center justify-center p-3 sm:p-6">
        <div className="text-4xl sm:text-6xl">⏳</div>
      </div>
    );
  }

  const difficultyColors = {
    easy: 'from-green-500 to-emerald-600',
    medium: 'from-yellow-500 to-orange-500',
    hard: 'from-red-500 to-purple-600'
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-400 via-orange-300 to-pink-300 p-3 sm:p-4 lg:p-6">
      <BackgroundMusic />
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                🎯 Daily Challenge
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <div className="bg-yellow-100 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl flex items-center gap-2 flex-1 sm:flex-none justify-center">
                <span className="text-xl sm:text-2xl">🪙</span>
                <span className="font-bold text-sm sm:text-base text-yellow-700">{currentKid?.coins || 0}</span>
              </div>
              <Link
                href="/kid/lessons"
                className="bg-gray-200 text-gray-700 font-bold px-4 sm:px-6 py-2 rounded-lg sm:rounded-xl hover:bg-gray-300 transition-all text-sm sm:text-base flex-1 sm:flex-none text-center"
              >
                ← Back
              </Link>
            </div>
          </div>
        </div>

        {/* Challenge Info or Completed Message */}
        {!isStarted && !hasCompleted && (
          <div className="bg-white/90 backdrop-blur rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 lg:p-12 text-center">
            <div className={`inline-block bg-gradient-to-r ${difficultyColors[todayChallenge.difficulty]} text-white px-4 sm:px-6 py-2 rounded-full font-bold text-xs sm:text-sm mb-4 sm:mb-6`}>
              {todayChallenge.difficulty.toUpperCase()} MODE
            </div>
            
            <div className="text-6xl sm:text-7xl lg:text-8xl mb-4 sm:mb-6">{todayChallenge.icon}</div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
              {todayChallenge.title}
            </h2>
            
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8">
              {todayChallenge.description}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8 max-w-2xl mx-auto">
              <div className="bg-purple-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <div className="text-2xl sm:text-3xl mb-2">📝</div>
                <div className="font-bold text-lg sm:text-xl text-purple-600">{todayChallenge.questions.length}</div>
                <div className="text-xs sm:text-sm text-gray-600">Questions</div>
              </div>
              
              <div className="bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <div className="text-2xl sm:text-3xl mb-2">⏱️</div>
                <div className="font-bold text-lg sm:text-xl text-blue-600">
                  {todayChallenge.difficulty === 'easy' ? '1:00' : todayChallenge.difficulty === 'medium' ? '1:30' : '2:00'}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Time Limit</div>
              </div>
              
              <div className="bg-yellow-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <div className="text-2xl sm:text-3xl mb-2">🪙</div>
                <div className="font-bold text-lg sm:text-xl text-yellow-600">Up to {todayChallenge.reward}</div>
                <div className="text-xs sm:text-sm text-gray-600">Coins</div>
              </div>
            </div>
            
            <button
              onClick={startChallenge}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-8 sm:px-12 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-lg sm:text-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              Start Challenge! 🚀
            </button>
          </div>
        )}

        {/* Completed Message */}
        {hasCompleted && !isStarted && (
          <div className="bg-white/90 backdrop-blur rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 lg:p-12 text-center">
            <div className="text-6xl sm:text-7xl lg:text-8xl mb-4 sm:mb-6">🎉</div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
              Challenge Complete!
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8">
              You&apos;ve already completed today&apos;s challenge!
            </p>
            
            {(() => {
              const completedChallenges = JSON.parse(localStorage.getItem('completedChallenges') || '{}');
              const todayResult = completedChallenges[new Date().toDateString()];
              
              return todayResult && (
                <div className="bg-purple-50 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 max-w-md mx-auto">
                  <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🏆</div>
                  <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">
                    {todayResult.score}/{todayResult.total} Correct
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-yellow-600">
                    +{todayResult.coinsEarned} Coins Earned!
                  </div>
                </div>
              );
            })()}
            
            <p className="text-base sm:text-lg text-gray-500 mb-4 sm:mb-6">
              Come back tomorrow for a new challenge!
            </p>
            
            <Link
              href="/kid/lessons"
              className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-8 sm:px-12 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-base sm:text-lg hover:shadow-2xl transition-all hover:scale-105"
            >
              Back to Lessons
            </Link>
          </div>
        )}

        {/* Challenge Questions */}
        {isStarted && !hasCompleted && (
          <div className="bg-white/90 backdrop-blur rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
            {/* Timer and Progress */}
            <div className="mb-4 sm:mb-6">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <span className="text-xs sm:text-sm font-semibold text-purple-600">
                  Question {currentQuestion + 1} of {todayChallenge.questions.length}
                </span>
                <div className={`text-lg sm:text-xl font-bold px-3 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl ${
                  timeLeft < 20 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-blue-100 text-blue-600'
                }`}>
                  ⏱️ {formatTime(timeLeft)}
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / todayChallenge.questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
                {todayChallenge.questions[currentQuestion].question}
              </h2>

              <div className="space-y-2 sm:space-y-3">
                {todayChallenge.questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showExplanation}
                    className={`w-full p-3 sm:p-4 rounded-lg sm:rounded-xl text-left font-semibold transition-all text-sm sm:text-base ${
                      showExplanation
                        ? index === todayChallenge.questions[currentQuestion].correctAnswer
                          ? 'bg-green-100 border-2 border-green-500'
                          : index === selectedAnswer
                          ? 'bg-red-100 border-2 border-red-500'
                          : 'bg-gray-100 border-2 border-gray-300'
                        : 'bg-white border-2 border-gray-300 hover:border-purple-500 hover:shadow-md'
                    }`}
                  >
                    {option}
                    {showExplanation && index === todayChallenge.questions[currentQuestion].correctAnswer && ' ✅'}
                    {showExplanation && index === selectedAnswer && index !== todayChallenge.questions[currentQuestion].correctAnswer && ' ❌'}
                  </button>
                ))}
              </div>
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div className="bg-blue-50 border-2 border-blue-300 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
                <h3 className="font-bold text-blue-800 mb-2 text-sm sm:text-base">💡 Explanation:</h3>
                <p className="text-blue-900 text-sm sm:text-base">{todayChallenge.questions[currentQuestion].explanation}</p>
              </div>
            )}

            {/* Next Button */}
            {showExplanation && (
              <button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl hover:shadow-lg transition-all hover:scale-105 text-sm sm:text-base"
              >
                {currentQuestion === todayChallenge.questions.length - 1 ? '🎉 Finish Challenge' : 'Next Question →'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
