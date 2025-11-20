'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { useSoundEffects } from '@/utils/soundEffects';

function GamePlayContent() {
  const searchParams = useSearchParams();
  const gameId = parseInt(searchParams.get('game') || '1');
  const gameTitle = searchParams.get('title') || 'Game';
  const kidName = searchParams.get('name') || 'Friend';
  const kidId = searchParams.get('id') || '';
  const sounds = useSoundEffects();

  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [gameComplete, setGameComplete] = useState(false);

  // Math Race Game
  const mathRaceQuestions = [
    { question: '3 + 5 = ?', answer: '8' },
    { question: '7 + 2 = ?', answer: '9' },
    { question: '4 + 6 = ?', answer: '10' },
    { question: '8 + 1 = ?', answer: '9' },
    { question: '5 + 5 = ?', answer: '10' },
    { question: '6 + 3 = ?', answer: '9' },
    { question: '2 + 7 = ?', answer: '9' },
    { question: '9 + 1 = ?', answer: '10' }
  ];

  // Word Builder Game
  const wordBuilderQuestions = [
    { question: 'Unscramble: TAC', answer: 'cat' },
    { question: 'Unscramble: GOD', answer: 'dog' },
    { question: 'Unscramble: NUS', answer: 'sun' },
    { question: 'Unscramble: RAC', answer: 'car' },
    { question: 'Unscramble: THA', answer: 'hat' },
    { question: 'Unscramble: TAB', answer: 'bat' },
    { question: 'Unscramble: NAP', answer: 'pan' },
    { question: 'Unscramble: RAT', answer: 'rat' }
  ];

  const getQuestions = () => {
    switch (gameId) {
      case 1: return mathRaceQuestions;
      case 2: return wordBuilderQuestions;
      default: return mathRaceQuestions;
    }
  };

  const questions = getQuestions();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const correctAnswer = questions[currentQuestion].answer.toLowerCase();
    const userAnswerLower = userAnswer.toLowerCase().trim();

    if (userAnswerLower === correctAnswer) {
      sounds?.playCorrect(); // Play correct sound!
      setScore(score + 10);
      setFeedback('🎉 Correct! Amazing!');
      
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setUserAnswer('');
          setFeedback('');
        } else {
          sounds?.playVictory(); // Play victory sound when game complete!
          setGameComplete(true);
        }
      }, 1500);
    } else {
      sounds?.playWrong(); // Play wrong answer sound!
      setFeedback('❌ Not quite! Try again!');
      setTimeout(() => setFeedback(''), 1500);
    }
  };

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-300 to-purple-400 flex items-center justify-center p-8">
        <div className="bg-white/95 backdrop-blur rounded-3xl p-12 shadow-2xl text-center max-w-2xl">
          <h1 className="text-6xl font-bold text-purple-600 mb-4">🎉 You Won! 🎉</h1>
          <p className="text-3xl text-gray-700 mb-6">
            Awesome job, {kidName}!
          </p>
          <div className="text-7xl font-bold text-green-600 mb-8">
            {score} Points!
          </div>
          <div className="space-y-4">
            <Link href={`/kid/games?name=${kidName}&id=${kidId}`}>
              <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-full text-xl font-bold shadow-lg transition-all">
                🎮 Play More Games
              </button>
            </Link>
            <Link href={`/kid/lessons?name=${kidName}&id=${kidId}`}>
              <button className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-8 py-4 rounded-full text-xl font-bold shadow-lg transition-all">
                📚 Back to Lessons
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-400 via-orange-300 to-pink-300 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <Link 
            href={`/kid/games?name=${kidName}&id=${kidId}`}
            className="bg-white/80 hover:bg-white px-6 py-3 rounded-full font-semibold text-purple-600 transition-all shadow-lg"
          >
            ← Back to Games
          </Link>
          <div className="bg-white/90 backdrop-blur px-8 py-3 rounded-full shadow-lg">
            <span className="text-2xl font-bold text-purple-600">
              Score: {score}
            </span>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur rounded-3xl p-12 shadow-2xl">
          <h1 className="text-4xl font-bold text-purple-600 mb-3 text-center">
            {gameTitle}
          </h1>
          
          <div className="mb-6 text-center">
            <span className="text-lg font-semibold text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>

          <div className="mb-8">
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-8 mb-6">
              <p className="text-3xl font-bold text-purple-700 text-center">
                {questions[currentQuestion].question}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="w-full px-6 py-4 border-4 border-purple-300 rounded-2xl text-2xl font-semibold text-center focus:outline-none focus:border-purple-500"
                placeholder="Type your answer..."
                autoFocus
              />

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 rounded-2xl text-2xl font-bold shadow-lg transition-all"
              >
                Submit Answer
              </button>
            </form>

            {feedback && (
              <div className={`mt-6 text-center text-2xl font-bold ${
                feedback.includes('Correct') ? 'text-green-600' : 'text-orange-600'
              }`}>
                {feedback}
              </div>
            )}
          </div>

          <div className="flex justify-center gap-2">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-4 h-4 rounded-full ${
                  index === currentQuestion
                    ? 'bg-purple-600'
                    : index < currentQuestion
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GamePlay() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-300 to-purple-400 flex items-center justify-center"><div className="text-4xl text-white">Loading Game...</div></div>}>
      <GamePlayContent />
    </Suspense>
  );
}
