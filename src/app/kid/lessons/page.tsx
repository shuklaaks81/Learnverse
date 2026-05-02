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
  const [isPremium, setIsPremium] = useState(false);
  const [diagnosticsCompleted, setDiagnosticsCompleted] = useState({
    math: false,
    writing: false,
    science: false,
  });
  
  // Ensure styles are updated on client after mount (SSR-safe)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const version = localStorage.getItem('learnverseVersion') || 'original';
      setIsPremium(version === 'premium');
      
      // Check diagnostic completion
      const currentKid = localStorage.getItem('currentKid');
      if (currentKid) {
        const kid = JSON.parse(currentKid);
        const diagnostics = localStorage.getItem(`kid_${kid.kidId}_diagnostics`);
        if (diagnostics) {
          setDiagnosticsCompleted(JSON.parse(diagnostics));
        }
      }
    }
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

  // 🚀 PREMIUM LESSONS HUB! 💎✨
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
          {[...Array(30)].map((_, i) => (
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
        <div className="relative z-10 p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="futuristic-glass p-8 mb-8 animate-card-appear">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <h1 className="text-5xl font-bold glow-text flex items-center gap-3 mb-3">
                  <span className="text-6xl drop-shadow-[0_0_15px_#0ff]">📚</span> Your Lessons
                </h1>
                <p className="text-cyan-300 font-semibold text-xl">
                  {completedCount} of {lessons.length} lessons completed
                </p>
              </div>
              
              <div className="flex gap-3 flex-wrap">
                <Link 
                  href="/kid/daily-challenge"
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-bold shadow-[0_0_30px_rgba(255,127,0,0.5)] hover:shadow-[0_0_50px_rgba(255,127,0,0.8)] hover:scale-105 transition-all border-2 border-white/30 animate-pulse"
                >
                  🎯 Daily Challenge
                </Link>
                <Link 
                  href="/kid/units"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold shadow-[0_0_30px_rgba(147,51,234,0.5)] hover:shadow-[0_0_50px_rgba(147,51,234,0.8)] hover:scale-105 transition-all border-2 border-white/30"
                >
                  📚 Units
                </Link>
                <Link 
                  href="/kid"
                  className="bg-white/10 backdrop-blur-xl text-cyan-300 px-6 py-3 rounded-xl font-bold border-2 border-cyan-400/50 hover:bg-white/20 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all"
                >
                  ← Back
                </Link>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-6">
              <div className="w-full bg-white/10 backdrop-blur rounded-full h-4 border-2 border-white/20">
                <div
                  className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 h-full rounded-full transition-all shadow-[0_0_20px_rgba(0,255,0,0.5)]"
                  style={{ width: `${(completedCount / lessons.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Diagnostic Tests - Show if not all completed */}
          {(!diagnosticsCompleted.math || !diagnosticsCompleted.writing || !diagnosticsCompleted.science) && (
            <div className="futuristic-glass p-8 mb-8 animate-card-appear border-4 border-yellow-400/50 shadow-[0_0_40px_rgba(255,215,0,0.4)]" style={{animationDelay: '0.05s'}}>
              <h2 className="text-3xl font-bold text-yellow-400 mb-3 drop-shadow-[0_0_15px_rgba(255,215,0,0.8)] flex items-center gap-3">
                <span className="text-4xl">🎯</span> Take Your Diagnostic Tests!
              </h2>
              <p className="text-cyan-300 text-lg mb-6">
                Complete these tests to unlock personalized lessons just for YOU! 🚀
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                {/* Math Test */}
                <Link href="/kid/diagnostic/math">
                  <div className={`relative group cursor-pointer ${diagnosticsCompleted.math ? 'opacity-60' : ''}`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-purple-500/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                    <div className={`relative futuristic-glass p-6 rounded-2xl border-2 ${
                      diagnosticsCompleted.math 
                        ? 'border-green-400 shadow-[0_0_30px_rgba(0,255,0,0.5)]' 
                        : 'border-blue-400/50 group-hover:border-blue-400 group-hover:shadow-[0_0_40px_rgba(0,150,255,0.6)]'
                    } transition-all duration-300`}>
                      {diagnosticsCompleted.math && (
                        <div className="absolute -top-3 -right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-[0_0_15px_rgba(0,255,0,0.6)] animate-pulse">
                          ✓ Done
                        </div>
                      )}
                      <div className="text-6xl mb-4 group-hover:scale-110 transition-transform drop-shadow-[0_0_10px_rgba(0,150,255,0.8)]">
                        🔢
                      </div>
                      <h3 className="text-2xl font-bold text-blue-300 mb-2">Math Test</h3>
                      <p className="text-white/80 text-sm mb-4">
                        Test your arithmetic, fractions, and problem-solving skills!
                      </p>
                      <div className="bg-blue-500/20 rounded-lg p-2 text-center">
                        <span className="text-blue-300 font-bold">⏱️ ~10 minutes</span>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Writing Test */}
                <Link href="/kid/diagnostic/writing">
                  <div className={`relative group cursor-pointer ${diagnosticsCompleted.writing ? 'opacity-60' : ''}`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-400/30 to-purple-500/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                    <div className={`relative futuristic-glass p-6 rounded-2xl border-2 ${
                      diagnosticsCompleted.writing 
                        ? 'border-green-400 shadow-[0_0_30px_rgba(0,255,0,0.5)]' 
                        : 'border-pink-400/50 group-hover:border-pink-400 group-hover:shadow-[0_0_40px_rgba(255,20,147,0.6)]'
                    } transition-all duration-300`}>
                      {diagnosticsCompleted.writing && (
                        <div className="absolute -top-3 -right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-[0_0_15px_rgba(0,255,0,0.6)] animate-pulse">
                          ✓ Done
                        </div>
                      )}
                      <div className="text-6xl mb-4 group-hover:scale-110 transition-transform drop-shadow-[0_0_10px_rgba(255,20,147,0.8)]">
                        ✍️
                      </div>
                      <h3 className="text-2xl font-bold text-pink-300 mb-2">Writing Test</h3>
                      <p className="text-white/80 text-sm mb-4">
                        Check your reading, grammar, and writing abilities!
                      </p>
                      <div className="bg-pink-500/20 rounded-lg p-2 text-center">
                        <span className="text-pink-300 font-bold">⏱️ ~10 minutes</span>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Science Test */}
                <Link href="/kid/diagnostic/science">
                  <div className={`relative group cursor-pointer ${diagnosticsCompleted.science ? 'opacity-60' : ''}`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400/30 to-cyan-500/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                    <div className={`relative futuristic-glass p-6 rounded-2xl border-2 ${
                      diagnosticsCompleted.science 
                        ? 'border-green-400 shadow-[0_0_30px_rgba(0,255,0,0.5)]' 
                        : 'border-green-400/50 group-hover:border-green-400 group-hover:shadow-[0_0_40px_rgba(0,255,0,0.6)]'
                    } transition-all duration-300`}>
                      {diagnosticsCompleted.science && (
                        <div className="absolute -top-3 -right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-[0_0_15px_rgba(0,255,0,0.6)] animate-pulse">
                          ✓ Done
                        </div>
                      )}
                      <div className="text-6xl mb-4 group-hover:scale-110 transition-transform drop-shadow-[0_0_10px_rgba(0,255,0,0.8)]">
                        🔬
                      </div>
                      <h3 className="text-2xl font-bold text-green-300 mb-2">Science Test</h3>
                      <p className="text-white/80 text-sm mb-4">
                        Explore your knowledge of biology, physics, and chemistry!
                      </p>
                      <div className="bg-green-500/20 rounded-lg p-2 text-center">
                        <span className="text-green-300 font-bold">⏱️ ~10 minutes</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          )}

          {/* Subject Filter */}
          <div className="futuristic-glass p-6 mb-8 animate-card-appear" style={{animationDelay: '0.1s'}}>
            <h2 className="text-xl font-bold text-cyan-300 mb-4 drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">
              ⚡ Filter by Subject
            </h2>
            <div className="flex flex-wrap gap-3">
              {subjects.map((subject) => (
                <button
                  key={subject}
                  onClick={() => {
                    setSelectedSubject(subject);
                    sounds?.playClick();
                  }}
                  className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-110 ${
                    selectedSubject === subject
                      ? "bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white shadow-[0_0_30px_rgba(255,0,255,0.7)] scale-110 border-2 border-white/50"
                      : "bg-white/10 backdrop-blur-xl text-purple-300 border-2 border-purple-400/30 hover:border-purple-400/60 hover:bg-white/20"
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>

          {/* Lessons Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className="group cursor-pointer"
                style={{animationDelay: `${index * 0.05}s`}}
              >
                <div className="relative preserve-3d hover:rotate-y-6 transition-all duration-500 animate-card-appear">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/30 via-purple-500/30 to-pink-400/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
                  
                  {/* Card */}
                  <div className={`relative futuristic-glass p-6 rounded-2xl ${
                    lesson.completed 
                      ? "border-4 border-green-400 shadow-[0_0_40px_rgba(0,255,0,0.6)]" 
                      : "border-2 border-white/20 group-hover:border-white/60 group-hover:shadow-[0_0_60px_rgba(0,255,255,0.6)]"
                  } transition-all duration-300`}>
                    {/* Completed Badge */}
                    {lesson.completed && (
                      <div className="absolute -top-3 -right-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-[0_0_20px_rgba(0,255,0,0.6)] z-10 animate-pulse">
                        ✓ Done
                      </div>
                    )}
                    
                    {/* Icon */}
                    <div className="text-7xl mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
                      {lesson.icon}
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:drop-shadow-[0_0_20px_rgba(0,255,255,0.8)] transition-all duration-300">
                      {lesson.title}
                    </h3>
                    
                    {/* Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-300 font-semibold">Subject:</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          lesson.subject === "Math" ? "bg-blue-500/50 text-blue-200 shadow-[0_0_10px_rgba(59,130,246,0.5)]" :
                          lesson.subject === "Science" ? "bg-green-500/50 text-green-200 shadow-[0_0_10px_rgba(34,197,94,0.5)]" :
                          lesson.subject === "English" ? "bg-purple-500/50 text-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.5)]" :
                          "bg-pink-500/50 text-pink-200 shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                        }`}>
                          {lesson.subject}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-purple-300">
                        <span className="font-semibold">Level:</span>
                        <span className="text-pink-200">{lesson.difficulty}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-purple-300">
                        <span className="font-semibold">Duration:</span>
                        <span className="text-pink-200">{lesson.duration}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-6">
                      <Link href={`/kid/lesson-module?id=${lesson.id}`} className="flex-1">
                        <button
                          onClick={() => sounds?.playClick()}
                          className="w-full py-3 px-4 rounded-xl font-bold bg-gradient-to-r from-green-400 to-blue-500 text-white hover:from-green-500 hover:to-blue-600 shadow-[0_0_20px_rgba(0,255,0,0.4)] hover:shadow-[0_0_40px_rgba(0,255,0,0.7)] hover:scale-105 transition-all border-2 border-white/30"
                        >
                          🎮 Interactive
                        </button>
                      </Link>
                      <Link href={`/kid/content-viewer?title=${encodeURIComponent(lesson.title)}`} className="flex-1">
                        <button
                          onClick={() => sounds?.playClick()}
                          className="w-full py-3 px-4 rounded-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:shadow-[0_0_40px_rgba(147,51,234,0.7)] hover:scale-105 transition-all border-2 border-white/30"
                        >
                          📖 Classic
                        </button>
                      </Link>
                    </div>
                    
                    {/* Holographic shine */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Animations */}
        <style jsx>{`
          @keyframes float-particle {
            0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
            50% { transform: translateY(-100px) translateX(50px); opacity: 1; }
          }
          @keyframes card-appear {
            from { opacity: 0; transform: translateY(30px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          .perspective-1000 { perspective: 1000px; }
          .preserve-3d { transform-style: preserve-3d; }
          .rotate-y-6:hover { transform: rotateY(6deg) rotateX(-3deg); }
        `}</style>

        <BackgroundMusic />
      </div>
    );
  }

  // Original UI
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

        {/* Diagnostic Tests - Show if not all completed */}
        {(!diagnosticsCompleted.math || !diagnosticsCompleted.writing || !diagnosticsCompleted.science) && (
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-xl p-6 mb-6 border-4 border-yellow-400">
            <h2 className="text-2xl font-bold text-orange-600 mb-2 flex items-center gap-2">
              <span className="text-3xl">🎯</span> Take Your Diagnostic Tests!
            </h2>
            <p className="text-gray-700 mb-4">
              Complete these tests to unlock personalized lessons just for YOU! 🚀
            </p>
            
            <div className="grid md:grid-cols-3 gap-4">
              {/* Math Test */}
              <Link href="/kid/diagnostic/math">
                <div className={`bg-white rounded-xl p-5 shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer border-2 ${
                  diagnosticsCompleted.math ? 'border-green-500' : 'border-blue-400'
                }`}>
                  {diagnosticsCompleted.math && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      ✓ Done
                    </div>
                  )}
                  <div className="text-5xl mb-3">🔢</div>
                  <h3 className="text-xl font-bold text-blue-600 mb-2">Math Test</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Test your arithmetic, fractions, and problem-solving!
                  </p>
                  <div className="bg-blue-100 rounded-lg p-2 text-center">
                    <span className="text-blue-700 font-semibold text-sm">⏱️ ~10 minutes</span>
                  </div>
                </div>
              </Link>

              {/* Writing Test */}
              <Link href="/kid/diagnostic/writing">
                <div className={`bg-white rounded-xl p-5 shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer border-2 ${
                  diagnosticsCompleted.writing ? 'border-green-500' : 'border-pink-400'
                }`}>
                  {diagnosticsCompleted.writing && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      ✓ Done
                    </div>
                  )}
                  <div className="text-5xl mb-3">✍️</div>
                  <h3 className="text-xl font-bold text-pink-600 mb-2">Writing Test</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Check your reading, grammar, and writing!
                  </p>
                  <div className="bg-pink-100 rounded-lg p-2 text-center">
                    <span className="text-pink-700 font-semibold text-sm">⏱️ ~10 minutes</span>
                  </div>
                </div>
              </Link>

              {/* Science Test */}
              <Link href="/kid/diagnostic/science">
                <div className={`bg-white rounded-xl p-5 shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer border-2 ${
                  diagnosticsCompleted.science ? 'border-green-500' : 'border-green-400'
                }`}>
                  {diagnosticsCompleted.science && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      ✓ Done
                    </div>
                  )}
                  <div className="text-5xl mb-3">🔬</div>
                  <h3 className="text-xl font-bold text-green-600 mb-2">Science Test</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Explore biology, physics, and chemistry!
                  </p>
                  <div className="bg-green-100 rounded-lg p-2 text-center">
                    <span className="text-green-700 font-semibold text-sm">⏱️ ~10 minutes</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        )}

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

              <div className="flex gap-2">
                <Link href={`/kid/lesson-module?id=${lesson.id}`} className="flex-1">
                  <button
                    onClick={() => sounds?.playClick()}
                    className="w-full py-3 px-4 rounded-lg font-bold transition-all bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 shadow-lg hover:scale-105"
                  >
                    🎮 Interactive
                  </button>
                </Link>
                <Link href={`/kid/content-viewer?title=${encodeURIComponent(lesson.title)}`} className="flex-1">
                  <button
                    onClick={() => sounds?.playClick()}
                    className="w-full py-3 px-4 rounded-lg font-semibold transition-all bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:scale-105"
                  >
                    📖 Classic
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <BackgroundMusic />
    </div>
  );
}
