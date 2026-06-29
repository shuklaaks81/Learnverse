"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSoundEffects } from "@/utils/soundEffects";

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  topic: string;
}

export default function WritingDiagnosticPage() {
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
      question: "Which word is spelled correctly?",
      options: ["recieve", "receive", "recive", "receeve"],
      correct: 1,
      topic: "spelling"
    },
    {
      id: 2,
      question: "What is the plural of 'child'?",
      options: ["childs", "childes", "children", "childrens"],
      correct: 2,
      topic: "grammar"
    },
    {
      id: 3,
      question: "Which sentence is correct?",
      options: [
        "Me and my friend went to the store",
        "My friend and I went to the store",
        "My friend and me went to the store",
        "I and my friend went to the store"
      ],
      correct: 1,
      topic: "grammar"
    },
    {
      id: 4,
      question: "What is a synonym for 'happy'?",
      options: ["sad", "joyful", "angry", "tired"],
      correct: 1,
      topic: "vocabulary"
    },
    {
      id: 5,
      question: "Which punctuation mark ends a question?",
      options: [".", "!", "?", ","],
      correct: 2,
      topic: "punctuation"
    },
    {
      id: 6,
      question: "What type of word is 'quickly'?",
      options: ["noun", "verb", "adjective", "adverb"],
      correct: 3,
      topic: "parts_of_speech"
    },
    {
      id: 7,
      question: "Which word is a noun?",
      options: ["run", "beautiful", "cat", "quickly"],
      correct: 2,
      topic: "parts_of_speech"
    },
    {
      id: 8,
      question: "Read: 'The dog barked loudly.' What is the verb?",
      options: ["dog", "barked", "loudly", "the"],
      correct: 1,
      topic: "reading_comprehension"
    },
    {
      id: 9,
      question: "Which sentence uses correct capitalization?",
      options: [
        "i went to New york.",
        "I went to new York.",
        "I went to New York.",
        "i went to new york."
      ],
      correct: 2,
      topic: "capitalization"
    },
    {
      id: 10,
      question: "What is an antonym for 'hot'?",
      options: ["warm", "cold", "fire", "sun"],
      correct: 1,
      topic: "vocabulary"
    },
    {
      id: 11,
      question: "Which word is spelled correctly?",
      options: ["seperate", "separate", "seperete", "separete"],
      correct: 1,
      topic: "spelling"
    },
    {
      id: 12,
      question: "What is the past tense of 'run'?",
      options: ["runned", "ran", "running", "runs"],
      correct: 1,
      topic: "grammar"
    },
    {
      id: 13,
      question: "Which is an adjective?",
      options: ["jump", "beautiful", "slowly", "under"],
      correct: 1,
      topic: "parts_of_speech"
    },
    {
      id: 14,
      question: "What does 'enormous' mean?",
      options: ["tiny", "very large", "colorful", "fast"],
      correct: 1,
      topic: "vocabulary"
    },
    {
      id: 15,
      question: "Which sentence needs a comma?",
      options: [
        "I like pizza",
        "She ran fast",
        "I like pizza and she likes burgers",
        "Yes I want to go"
      ],
      correct: 3,
      topic: "punctuation"
    },
    {
      id: 16,
      question: "What is a compound word?",
      options: ["running", "football", "quickly", "jumped"],
      correct: 1,
      topic: "vocabulary"
    },
    {
      id: 17,
      question: "Read: 'The quick brown fox jumps.' What is the adjective?",
      options: ["quick", "fox", "jumps", "the"],
      correct: 0,
      topic: "reading_comprehension"
    },
    {
      id: 18,
      question: "Which needs a capital letter?",
      options: ["dog", "monday", "happy", "blue"],
      correct: 1,
      topic: "capitalization"
    },
    {
      id: 19,
      question: "What is a synonym for 'big'?",
      options: ["small", "large", "tiny", "little"],
      correct: 1,
      topic: "vocabulary"
    },
    {
      id: 20,
      question: "Which is a complete sentence?",
      options: [
        "Running fast",
        "The blue car",
        "She ate lunch",
        "In the park"
      ],
      correct: 2,
      topic: "grammar"
    },
  ];

  const handleAnswer = (selectedIndex: number) => {
    const newAnswers = [...answers, selectedIndex];
    setAnswers(newAnswers);

    const isCorrect = selectedIndex === questions[currentQuestion].correct;
    if (isCorrect) {
      setScore(score + 1);
    } else {
      const topic = questions[currentQuestion].topic;
      if (!weakTopics.includes(topic)) {
        setWeakTopics([...weakTopics, topic]);
      }
    }

    sounds?.playClick();

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
    
    const diagnostics = {
      math: false,
      writing: true,
      science: false,
    };
    const existing = localStorage.getItem(`kid_${kid.kidId}_diagnostics`);
    if (existing) {
      const parsed = JSON.parse(existing);
      diagnostics.math = parsed.math || false;
      diagnostics.science = parsed.science || false;
    }
    localStorage.setItem(`kid_${kid.kidId}_diagnostics`, JSON.stringify(diagnostics));
    
    const weaknessData = {
      topics: weakTopics,
      score: score,
      total: questions.length,
      date: new Date().toISOString(),
    };
    localStorage.setItem(`kid_${kid.kidId}_writing_weakness`, JSON.stringify(weaknessData));
  };

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 p-8 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">🎉 Writing Test Complete!</h1>
            <div className="text-7xl mb-6">✨</div>
            
            <div className="mb-8">
              <p className="text-2xl font-bold text-gray-700 mb-4">
                Fantastic work completing the test!
              </p>
              <p className="text-lg text-gray-600">
                You answered {questions.length} questions and we learned a lot about your writing skills!
              </p>
            </div>
            
            {weakTopics.length > 0 && (
              <div className="bg-pink-50 border-2 border-pink-400 rounded-xl p-6 mb-6">
                <h2 className="text-2xl font-bold text-pink-700 mb-3">📚 We'll Focus On:</h2>
                <div className="flex flex-wrap gap-3 justify-center">
                  {weakTopics.map(topic => (
                    <span key={topic} className="bg-pink-200 text-pink-800 px-4 py-2 rounded-full font-semibold">
                      {topic.replace('_', ' ')}
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 mt-4">
                  We'll create personalized lessons to help you learn even more! 🚀
                </p>
              </div>
            )}
            
            <p className="text-purple-600 font-bold text-xl mb-4">🎯 Your personalized writing lessons are ready!</p>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push('/kid/lessons')}
                className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xl font-bold rounded-xl hover:scale-105 transition-transform shadow-lg"
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
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 p-8">
      <div className="max-w-3xl mx-auto">
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

        <div className="bg-white rounded-3xl shadow-2xl p-8 animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            {question.question}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={answers[currentQuestion] !== undefined}
                className={`p-6 rounded-2xl font-bold text-xl transition-all transform hover:scale-105 text-left ${
                  answers[currentQuestion] === undefined
                    ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white hover:from-pink-500 hover:to-purple-500 shadow-lg"
                    : "bg-gray-400 text-white cursor-not-allowed"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

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
