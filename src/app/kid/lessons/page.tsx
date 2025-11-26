"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import BackgroundMusic from "@/components/BackgroundMusic";
import { useSoundEffects } from "@/utils/soundEffects";
import { useLegendaryMode, getLegendaryStyles } from "@/utils/legendaryMode";

interface Lesson {
  id: number;
  title: string;
  subject: string;
  icon: string;
  difficulty: string;
  duration: string;
  completed: boolean;
}

export default function LessonsPage() {
  const sounds = useSoundEffects();
  const isLegendary = useLegendaryMode();
  const [styles, setStyles] = useState(getLegendaryStyles());
  // Ensure styles are updated on client after mount (SSR-safe)
  useEffect(() => {
    setStyles(getLegendaryStyles());
  }, []);
  const [lessons] = useState<Lesson[]>([
    { id: 1, title: "Addition Basics", subject: "Math", icon: "➕", difficulty: "Easy", duration: "10 min", completed: true },
    { id: 2, title: "Subtraction Fun", subject: "Math", icon: "➖", difficulty: "Easy", duration: "10 min", completed: true },
    { id: 3, title: "Multiplication Tables", subject: "Math", icon: "✖️", difficulty: "Medium", duration: "15 min", completed: false },
    { id: 4, title: "Division Made Easy", subject: "Math", icon: "➗", difficulty: "Medium", duration: "15 min", completed: false },
    { id: 5, title: "Fractions Basics", subject: "Math", icon: "½", difficulty: "Hard", duration: "20 min", completed: false },
    { id: 6, title: "The Water Cycle", subject: "Science", icon: "💧", difficulty: "Easy", duration: "12 min", completed: true },
    { id: 7, title: "Solar System", subject: "Science", icon: "🌍", difficulty: "Medium", duration: "20 min", completed: false },
    { id: 8, title: "Animals & Habitats", subject: "Science", icon: "🦁", difficulty: "Easy", duration: "15 min", completed: false },
    { id: 9, title: "Plants & Photosynthesis", subject: "Science", icon: "🌱", difficulty: "Medium", duration: "18 min", completed: false },
    { id: 10, title: "Reading Comprehension", subject: "English", icon: "📖", difficulty: "Easy", duration: "15 min", completed: false },
    { id: 11, title: "Grammar Rules", subject: "English", icon: "✍️", difficulty: "Medium", duration: "12 min", completed: false },
    { id: 12, title: "Story Writing", subject: "English", icon: "📝", difficulty: "Medium", duration: "20 min", completed: false },
    { id: 13, title: "Poetry Basics", subject: "English", icon: "🎭", difficulty: "Hard", duration: "18 min", completed: false },
    { id: 14, title: "Shapes & Colors", subject: "Art", icon: "🎨", difficulty: "Easy", duration: "10 min", completed: false },
    { id: 15, title: "Drawing Basics", subject: "Art", icon: "✏️", difficulty: "Easy", duration: "15 min", completed: false },
    { id: 16, title: "Music Notes", subject: "Art", icon: "🎵", difficulty: "Medium", duration: "12 min", completed: false },
    { id: 17, title: "World Geography", subject: "History", icon: "🗺️", difficulty: "Medium", duration: "20 min", completed: false },
    { id: 18, title: "Ancient Civilizations", subject: "History", icon: "🏛️", difficulty: "Hard", duration: "25 min", completed: false },
    { id: 19, title: "Famous Inventors", subject: "History", icon: "💡", difficulty: "Medium", duration: "18 min", completed: false },
    { id: 20, title: "Coding Basics", subject: "Technology", icon: "💻", difficulty: "Medium", duration: "20 min", completed: false },
  ]);

  const [selectedSubject, setSelectedSubject] = useState("All");
  const subjects = ["All", "Math", "Science", "English", "Art", "History", "Technology"];

  const filteredLessons = selectedSubject === "All" 
    ? lessons 
    : lessons.filter(lesson => lesson.subject === selectedSubject);

  const completedCount = lessons.filter(l => l.completed).length;

  return (
    <div className={`min-h-screen ${styles.background} p-8 ${isLegendary ? 'relative overflow-hidden' : ''}`}>
      {/* Legendary Mode Matrix Effect */}
      {isLegendary && (
        <>
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-pulse"></div>
            <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-pink-400 to-transparent animate-pulse" style={{animationDelay: '0.3s'}}></div>
            <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-purple-400 to-transparent animate-pulse" style={{animationDelay: '0.6s'}}></div>
          </div>
          <div className="absolute top-4 right-4 text-cyan-400 font-bold text-2xl animate-pulse">
            🔮 LEGENDARY MODE ACTIVE
          </div>
        </>
      )}
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className={`${styles.card} rounded-2xl shadow-xl p-6 mb-6`}>
          <div className="flex justify-between items-center">
            <div>
              <h1 className={`text-3xl font-bold ${styles.accent}`}>📚 Your Lessons</h1>
              <p className={`${styles.text} mt-1`}>
                {completedCount} of {lessons.length} lessons completed
              </p>
            </div>
            <div className="flex gap-2 sm:gap-3 lg:gap-4 items-center flex-wrap">
              <Link 
                href="/kid/daily-challenge"
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 sm:px-4 py-2 rounded-full font-semibold hover:shadow-lg transition-all hover:scale-105 text-sm sm:text-base animate-pulse"
              >
                🎯 Daily
              </Link>
              <Link 
                href="/kid/units"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 sm:px-4 py-2 rounded-full font-semibold hover:shadow-lg transition-all hover:scale-105 text-sm sm:text-base"
              >
                📚 Units
              </Link>
              <Link 
                href="/kid/map"
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 sm:px-4 py-2 rounded-full font-semibold hover:shadow-lg transition-all hover:scale-105 text-sm sm:text-base"
              >
                🗺️ Map
              </Link>
              <Link 
                href="/kid/shop"
                className={`${styles.button} text-white px-3 sm:px-4 py-2 rounded-full font-semibold hover:shadow-lg transition-all hover:scale-105 text-sm sm:text-base`}
              >
                🏪 Shop
              </Link>
              <Link 
                href="/kid"
                className={`${styles.text} hover:opacity-70 font-medium text-sm sm:text-base`}
              >
                ← Back
              </Link>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all"
                style={{ width: `${(completedCount / lessons.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Subject Filter */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Filter by Subject:</h2>
          <div className="flex flex-wrap gap-3">
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  selectedSubject === subject
                    ? "bg-purple-600 text-white shadow-lg"
                    : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson) => (
            <div
              key={lesson.id}
              className={`bg-white rounded-2xl shadow-xl p-6 transition-all hover:shadow-2xl ${
                lesson.completed ? "border-2 border-green-300" : ""
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="text-5xl">{lesson.icon}</div>
                {lesson.completed && (
                  <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    ✓ Done
                  </div>
                )}
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2">{lesson.title}</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold text-gray-600">Subject:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    lesson.subject === "Math" ? "bg-blue-100 text-blue-700" :
                    lesson.subject === "Science" ? "bg-green-100 text-green-700" :
                    lesson.subject === "English" ? "bg-purple-100 text-purple-700" :
                    "bg-pink-100 text-pink-700"
                  }`}>
                    {lesson.subject}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-semibold">Level:</span>
                  <span>{lesson.difficulty}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-semibold">Duration:</span>
                  <span>{lesson.duration}</span>
                </div>
              </div>

              <Link href={`/kid/lesson-player?title=${encodeURIComponent(lesson.title)}`}>
                <button
                  onClick={() => !lesson.completed && sounds?.playClick()}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                    lesson.completed
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg"
                  }`}
                  disabled={lesson.completed}
                >
                  {lesson.completed ? "Completed" : "Start Lesson"}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
      
      <BackgroundMusic />
    </div>
  );
}
