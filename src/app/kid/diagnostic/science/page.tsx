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

export default function ScienceDiagnosticPage() {
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
      question: "What is the process by which plants make their own food?",
      options: ["Respiration", "Photosynthesis", "Digestion", "Evaporation"],
      correct: 1,
      topic: "biology"
    },
    {
      id: 2,
      question: "What are the three states of matter?",
      options: [
        "Hot, Warm, Cold",
        "Solid, Liquid, Gas",
        "Big, Medium, Small",
        "Fast, Medium, Slow"
      ],
      correct: 1,
      topic: "physics"
    },
    {
      id: 3,
      question: "How many planets are in our solar system?",
      options: ["7", "8", "9", "10"],
      correct: 1,
      topic: "astronomy"
    },
    {
      id: 4,
      question: "What do we call animals that only eat plants?",
      options: ["Carnivores", "Omnivores", "Herbivores", "Predators"],
      correct: 2,
      topic: "biology"
    },
    {
      id: 5,
      question: "What is H2O commonly known as?",
      options: ["Oxygen", "Hydrogen", "Water", "Air"],
      correct: 2,
      topic: "chemistry"
    },
    {
      id: 6,
      question: "What force pulls objects toward the Earth?",
      options: ["Magnetism", "Friction", "Gravity", "Electricity"],
      correct: 2,
      topic: "physics"
    },
    {
      id: 7,
      question: "What is the largest organ in the human body?",
      options: ["Heart", "Brain", "Liver", "Skin"],
      correct: 3,
      topic: "biology"
    },
    {
      id: 8,
      question: "What do plants need for photosynthesis? (Choose the best answer)",
      options: [
        "Sunlight, water, and carbon dioxide",
        "Moonlight and soil",
        "Rain and wind",
        "Snow and ice"
      ],
      correct: 0,
      topic: "biology"
    },
    {
      id: 9,
      question: "What happens to water when it boils?",
      options: [
        "It turns into ice",
        "It becomes a gas (steam)",
        "It disappears completely",
        "It turns into metal"
      ],
      correct: 1,
      topic: "chemistry"
    },
    {
      id: 10,
      question: "Which planet is known as the 'Red Planet'?",
      options: ["Venus", "Jupiter", "Mars", "Saturn"],
      correct: 2,
      topic: "astronomy"
    },
    {
      id: 11,
      question: "What is the center of an atom called?",
      options: ["Electron", "Nucleus", "Proton", "Neutron"],
      correct: 1,
      topic: "chemistry"
    },
    {
      id: 12,
      question: "What type of animal is a frog?",
      options: ["Mammal", "Reptile", "Amphibian", "Fish"],
      correct: 2,
      topic: "biology"
    },
    {
      id: 13,
      question: "What do we call a baby kangaroo?",
      options: ["Calf", "Joey", "Pup", "Kit"],
      correct: 1,
      topic: "biology"
    },
    {
      id: 14,
      question: "What is the closest star to Earth?",
      options: ["Polaris", "Sirius", "The Sun", "Alpha Centauri"],
      correct: 2,
      topic: "astronomy"
    },
    {
      id: 15,
      question: "What gas do humans breathe in?",
      options: ["Carbon Dioxide", "Oxygen", "Nitrogen", "Helium"],
      correct: 1,
      topic: "biology"
    },
    {
      id: 16,
      question: "What is the boiling point of water?",
      options: ["0°C", "50°C", "100°C", "200°C"],
      correct: 2,
      topic: "chemistry"
    },
    {
      id: 17,
      question: "What causes thunder?",
      options: [
        "Clouds bumping together",
        "Lightning heating the air rapidly",
        "Wind blowing fast",
        "Rain falling hard"
      ],
      correct: 1,
      topic: "physics"
    },
    {
      id: 18,
      question: "How many legs does a spider have?",
      options: ["6", "8", "10", "12"],
      correct: 1,
      topic: "biology"
    },
    {
      id: 19,
      question: "What is the largest planet in our solar system?",
      options: ["Earth", "Saturn", "Jupiter", "Neptune"],
      correct: 2,
      topic: "astronomy"
    },
    {
      id: 20,
      question: "What do we call a scientist who studies rocks?",
      options: ["Biologist", "Geologist", "Meteorologist", "Astronomer"],
      correct: 1,
      topic: "earth_science"
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
      writing: false,
      science: true,
    };
    const existing = localStorage.getItem(`kid_${kid.kidId}_diagnostics`);
    if (existing) {
      const parsed = JSON.parse(existing);
      diagnostics.math = parsed.math || false;
      diagnostics.writing = parsed.writing || false;
    }
    localStorage.setItem(`kid_${kid.kidId}_diagnostics`, JSON.stringify(diagnostics));
    
    const weaknessData = {
      topics: weakTopics,
      score: score,
      total: questions.length,
      date: new Date().toISOString(),
    };
    localStorage.setItem(`kid_${kid.kidId}_science_weakness`, JSON.stringify(weaknessData));
  };

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 via-teal-500 to-blue-500 p-8 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">🎉 Science Test Complete!</h1>
            <div className="text-7xl mb-6">🔬</div>
            
            <div className="mb-8">
              <p className="text-2xl font-bold text-gray-700 mb-4">
                Excellent work completing the test!
              </p>
              <p className="text-lg text-gray-600">
                You answered {questions.length} questions and we learned a lot about your science knowledge!
              </p>
            </div>
            
            {weakTopics.length > 0 && (
              <div className="bg-green-50 border-2 border-green-400 rounded-xl p-6 mb-6">
                <h2 className="text-2xl font-bold text-green-700 mb-3">📚 We'll Focus On:</h2>
                <div className="flex flex-wrap gap-3 justify-center">
                  {weakTopics.map(topic => (
                    <span key={topic} className="bg-green-200 text-green-800 px-4 py-2 rounded-full font-semibold">
                      {topic.replace('_', ' ')}
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 mt-4">
                  We'll create personalized lessons to help you learn even more! 🚀
                </p>
              </div>
            )}
            
            <p className="text-teal-600 font-bold text-xl mb-4">🎯 Your personalized science lessons are ready!</p>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push('/kid/lessons')}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white text-xl font-bold rounded-xl hover:scale-105 transition-transform shadow-lg"
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
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-teal-500 to-blue-500 p-8">
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
                    ? "bg-gradient-to-r from-green-400 to-teal-400 text-white hover:from-green-500 hover:to-teal-500 shadow-lg"
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
