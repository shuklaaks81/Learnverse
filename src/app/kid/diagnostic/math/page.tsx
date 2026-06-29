"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSoundEffects } from "@/utils/soundEffects";

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  topic: string; // For weakness tracking
}

export default function MathDiagnosticPage() {
  const router = useRouter();
  const sounds = useSoundEffects();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [weakTopics, setWeakTopics] = useState<string[]>([]);

  const questions: Question[] = [
    {
      id: 1,
      question: "What is 15 + 28?",
      options: ["41", "43", "45", "47"],
      correct: 1,
      topic: "addition"
    },
    {
      id: 2,
      question: "What is 56 - 23?",
      options: ["31", "33", "35", "37"],
      correct: 1,
      topic: "subtraction"
    },
    {
      id: 3,
      question: "What is 7 × 8?",
      options: ["54", "56", "58", "60"],
      correct: 1,
      topic: "multiplication"
    },
    {
      id: 4,
      question: "What is 48 ÷ 6?",
      options: ["6", "7", "8", "9"],
      correct: 2,
      topic: "division"
    },
    {
      id: 5,
      question: "What is 1/2 + 1/4?",
      options: ["1/6", "2/6", "3/4", "1/3"],
      correct: 2,
      topic: "fractions"
    },
    {
      id: 6,
      question: "What is 20% of 50?",
      options: ["5", "10", "15", "20"],
      correct: 1,
      topic: "percentages"
    },
    {
      id: 7,
      question: "If a rectangle has length 8 and width 5, what is its area?",
      options: ["13", "26", "40", "45"],
      correct: 2,
      topic: "geometry"
    },
    {
      id: 8,
      question: "What is 3²?",
      options: ["6", "9", "12", "15"],
      correct: 1,
      topic: "exponents"
    },
    {
      id: 9,
      question: "What is the next number in the pattern? 2, 4, 8, 16, __",
      options: ["20", "24", "28", "32"],
      correct: 3,
      topic: "patterns"
    },
    {
      id: 10,
      question: "Sarah has 24 cookies. She gives 1/3 to her friend. How many does she have left?",
      options: ["8", "12", "16", "18"],
      correct: 2,
      topic: "word_problems"
    },
    {
      id: 11,
      question: "What is 123 + 456?",
      options: ["579", "589", "569", "599"],
      correct: 0,
      topic: "addition"
    },
    {
      id: 12,
      question: "What is 100 - 37?",
      options: ["63", "73", "53", "67"],
      correct: 0,
      topic: "subtraction"
    },
    {
      id: 13,
      question: "What is 12 × 9?",
      options: ["98", "108", "118", "88"],
      correct: 1,
      topic: "multiplication"
    },
    {
      id: 14,
      question: "What is 144 ÷ 12?",
      options: ["10", "11", "12", "14"],
      correct: 2,
      topic: "division"
    },
    {
      id: 15,
      question: "What is 2/3 + 1/3?",
      options: ["3/6", "3/3", "1", "Both B and C"],
      correct: 3,
      topic: "fractions"
    },
    {
      id: 16,
      question: "What is 50% of 200?",
      options: ["50", "75", "100", "150"],
      correct: 2,
      topic: "percentages"
    },
    {
      id: 17,
      question: "A circle has a radius of 5. What is its diameter?",
      options: ["5", "10", "15", "25"],
      correct: 1,
      topic: "geometry"
    },
    {
      id: 18,
      question: "What is 5³?",
      options: ["15", "25", "75", "125"],
      correct: 3,
      topic: "exponents"
    },
    {
      id: 19,
      question: "What comes next? 5, 10, 15, 20, __",
      options: ["22", "25", "30", "35"],
      correct: 1,
      topic: "patterns"
    },
    {
      id: 20,
      question: "Tom has $50. He spends $12 on lunch and $8 on a book. How much does he have left?",
      options: ["$20", "$25", "$30", "$35"],
      correct: 2,
      topic: "word_problems"
    },
  ];

  const handleAnswer = (selectedIndex: number) => {
    const newAnswers = [...answers, selectedIndex];
    setAnswers(newAnswers);

    const isCorrect = selectedIndex === questions[currentQuestion].correct;
    if (isCorrect) {
      setScore(score + 1);
    } else {
      // Track weak topic
      const topic = questions[currentQuestion].topic;
      if (!weakTopics.includes(topic)) {
        setWeakTopics([...weakTopics, topic]);
      }
    }

    sounds?.playClick();

    // Move to next question or show results
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      setTimeout(() => {
        setShowResult(true);
        saveDiagnosticResults();
      }, 300);
    }
  };

  const saveDiagnosticResults = () => {
    if (typeof window === 'undefined') return;
    
    const currentKid = localStorage.getItem('currentKid');
    if (!currentKid) return;
    
    const kid = JSON.parse(currentKid);
    
    // Save diagnostic completion
    const diagnostics = {
      math: true,
      writing: false,
      science: false,
    };
    const existing = localStorage.getItem(`kid_${kid.kidId}_diagnostics`);
    if (existing) {
      const parsed = JSON.parse(existing);
      diagnostics.writing = parsed.writing || false;
      diagnostics.science = parsed.science || false;
    }
    localStorage.setItem(`kid_${kid.kidId}_diagnostics`, JSON.stringify(diagnostics));
    
    // Save weak topics for personalized lessons
    const weaknessData = {
      topics: weakTopics,
      score: score,
      total: questions.length,
      date: new Date().toISOString(),
    };
    localStorage.setItem(`kid_${kid.kidId}_math_weakness`, JSON.stringify(weaknessData));
  };

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-8 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">🎉 Math Test Complete!</h1>
            <div className="text-7xl mb-6">🌟</div>
            
            <div className="mb-8">
              <p className="text-2xl font-bold text-gray-700 mb-4">
                Great job completing the test!
              </p>
              <p className="text-lg text-gray-600">
                You answered {questions.length} questions and we learned a lot about your math skills!
              </p>
            </div>
            
            {weakTopics.length > 0 && (
              <div className="bg-blue-50 border-2 border-blue-400 rounded-xl p-6 mb-6">
                <h2 className="text-2xl font-bold text-blue-700 mb-3">📚 We'll Focus On:</h2>
                <div className="flex flex-wrap gap-3 justify-center">
                  {weakTopics.map(topic => (
                    <span key={topic} className="bg-blue-200 text-blue-800 px-4 py-2 rounded-full font-semibold">
                      {topic.replace('_', ' ')}
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 mt-4">
                  We'll create personalized lessons to help you learn even more! 🚀
                </p>
              </div>
            )}
            
            <p className="text-purple-600 font-bold text-xl mb-4">🎯 Your personalized math lessons are ready!</p>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push('/kid/lessons')}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold rounded-xl hover:scale-105 transition-transform shadow-lg"
              >
                📚 See My Lessons
              </button>
              <button
                onClick={() => router.push('/kid')}
                className="px-8 py-4 bg-gray-200 text-gray-700 text-xl font-bold rounded-xl hover:bg-gray-300 transition-all"
              >
                🏠 Back to Hub
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-white font-bold mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-white/30 rounded-full h-4">
            <div
              className="bg-white h-4 rounded-full transition-all duration-500 shadow-lg"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            {question.question}
          </h2>

          {/* Answer Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={answers[currentQuestion] !== undefined}
                className={`p-6 rounded-2xl font-bold text-xl transition-all transform hover:scale-105 ${
                  answers[currentQuestion] === undefined
                    ? "bg-gradient-to-r from-blue-400 to-purple-400 text-white hover:from-blue-500 hover:to-purple-500 shadow-lg"
                    : "bg-gray-400 text-white cursor-not-allowed"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Exit Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/kid/lessons')}
            className="px-6 py-3 bg-white/20 text-white rounded-xl font-bold hover:bg-white/30 transition-all"
          >
            ← Exit Test
          </button>
        </div>
      </div>
    </div>
  );
}
