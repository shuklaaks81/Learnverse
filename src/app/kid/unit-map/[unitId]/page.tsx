"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { unitMap, type Unit, type UnitLesson } from '@/data/unitMap';
import { getBuddy, getKidUnitProgress, type Buddy } from '@/utils/buddySystem';
import { LessonGenerator, type LessonRequest } from '@/utils/lessonGenerator';

/**
 * Comprehensive Unit Page
 * 
 * Dive deep into a topic and learn EVERYTHING about it!
 */
export default function UnitDetailPage({ params }: { params: { unitId: string } }) {
  const router = useRouter();
  const [unit, setUnit] = useState<Unit | null>(null);
  const [kidId, setKidId] = useState<string>('');
  const [buddy, setBuddy] = useState<Buddy | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [generatingLesson, setGeneratingLesson] = useState<UnitLesson | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);

  useEffect(() => {
    // Find the unit
    const foundUnit = unitMap.find(u => u.id === params.unitId);
    setUnit(foundUnit || null);

    if (typeof window !== 'undefined') {
      try {
        const kidData = localStorage.getItem('currentKid');
        if (kidData) {
          const kid = JSON.parse(kidData);
          setKidId(kid.kidId);
          
          // Load completed lessons
          const completed = JSON.parse(
            localStorage.getItem(`kid_${kid.kidId}_completedUnitLessons`) || '[]'
          );
          setCompletedLessons(completed);
          
          // Load buddy
          const buddyData = getBuddy(kid.kidId);
          setBuddy(buddyData);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    }
  }, [params.unitId]);

  const handleStartLesson = async (lesson: UnitLesson) => {
    if (!unit) return;

    setGeneratingLesson(lesson);
    setGenerationProgress(0);

    try {
      const generator = new LessonGenerator();
      
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => Math.min(prev + 5, 95));
      }, 800);

      const lessonRequest: LessonRequest = {
        subject: unit.title.includes('Plant') ? 'Science' :
                 unit.title.includes('Animal') ? 'Science' :
                 unit.title.includes('Ocean') ? 'Science' :
                 unit.title.includes('Space') ? 'Science' :
                 unit.title.includes('Weather') ? 'Science' :
                 unit.title.includes('Earth') ? 'Science' :
                 unit.title.includes('Body') ? 'Science' : 'Science',
        topic: lesson.title,
        gradeLevel: unit.grade.split('-')[0], // "K-2" -> "K"
        difficulty: 'medium',
      };

      const generatedLesson = await generator.generateLesson(lessonRequest);

      clearInterval(progressInterval);
      setGenerationProgress(100);

      // Store lesson with unit metadata
      const lessonWithMeta = {
        ...generatedLesson,
        unitId: unit.id,
        unitLessonId: lesson.id,
      };

      localStorage.setItem('activeGeneratedLesson', JSON.stringify(lessonWithMeta));

      setTimeout(() => {
        router.push('/kid/lesson-player?source=unit');
      }, 500);

    } catch (error) {
      console.error('Lesson generation failed:', error);
      alert('😢 Failed to generate lesson. Please try again!');
      setGeneratingLesson(null);
    }
  };

  if (!unit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
        <div className="text-6xl animate-bounce">🔍</div>
      </div>
    );
  }

  // Loading screen during lesson generation
  if (generatingLesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 flex items-center justify-center p-8">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-12 max-w-2xl w-full shadow-2xl border-4 border-white/50">
          <div className="text-9xl text-center mb-8 animate-bounce">🤖</div>
          <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            AI is Creating Your Lesson!
          </h1>
          <p className="text-xl text-center text-gray-700 mb-2">{generatingLesson.title}</p>
          <p className="text-lg text-center text-gray-500 mb-8">
            {generatingLesson.icon} {unit.title}
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-6 mb-4 overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-full transition-all duration-300 flex items-center justify-end pr-3"
              style={{ width: `${generationProgress}%` }}
            >
              <span className="text-xs font-bold text-white drop-shadow-lg">
                {generationProgress}%
              </span>
            </div>
          </div>

          <div className="text-center space-y-2">
            {generationProgress < 20 && <p className="text-lg text-purple-600 font-semibold animate-pulse">🧠 AI is thinking...</p>}
            {generationProgress >= 20 && generationProgress < 50 && <p className="text-lg text-blue-600 font-semibold animate-pulse">✨ Creating activities...</p>}
            {generationProgress >= 50 && generationProgress < 80 && <p className="text-lg text-green-600 font-semibold animate-pulse">🎨 Adding fun elements...</p>}
            {generationProgress >= 80 && generationProgress < 100 && <p className="text-lg text-orange-600 font-semibold animate-pulse">🎉 Almost ready...</p>}
            {generationProgress === 100 && <p className="text-lg text-pink-600 font-semibold animate-pulse">✅ Complete! Loading lesson...</p>}
          </div>
        </div>
      </div>
    );
  }

  const myProgress = completedLessons.filter(id => id.startsWith(unit.id + '-')).length;
  const buddyProgress = buddy ? buddy.completedLessons.filter(id => id.startsWith(unit.id + '-')).length : 0;
  const totalLessons = unit.lessons.length;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${unit.color} p-8`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 mb-8 shadow-2xl">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-6">
              <div className="text-8xl">{unit.icon}</div>
              <div>
                <h1 className="text-5xl font-bold text-gray-800 mb-2">{unit.title}</h1>
                <p className="text-xl text-gray-600 mb-4">{unit.description}</p>
                <div className="flex gap-4 text-sm text-gray-500">
                  <span>🎓 Grade: {unit.grade}</span>
                  <span>•</span>
                  <span>📚 {totalLessons} Lessons</span>
                </div>
              </div>
            </div>
            
            <Link href="/kid/unit-map">
              <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all">
                ← Back to Map
              </button>
            </Link>
          </div>

          {/* Progress Bars */}
          <div className="mt-6 space-y-3">
            {/* My Progress */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-blue-600">Your Progress</span>
                <span className="text-sm font-bold text-blue-600">
                  {myProgress}/{totalLessons} ({Math.round((myProgress/totalLessons)*100)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${(myProgress/totalLessons)*100}%` }}
                />
              </div>
            </div>

            {/* Buddy Progress */}
            {buddy && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-green-600">
                    {buddy.avatar} {buddy.name}&apos;s Progress
                  </span>
                  <span className="text-sm font-bold text-green-600">
                    {buddyProgress}/{totalLessons} ({Math.round((buddyProgress/totalLessons)*100)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500"
                    style={{ width: `${(buddyProgress/totalLessons)*100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fun Facts Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 mb-8 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🌟 Did You Know?</h2>
          <div className="grid grid-cols-2 gap-4">
            {unit.funFacts.map((fact, index) => (
              <div key={index} className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl p-4 border-2 border-yellow-300">
                <p className="text-gray-700">{fact}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">📚 Lessons in this Unit</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unit.lessons.map((lesson, index) => {
              const isCompleted = completedLessons.includes(lesson.id);
              const buddyCompleted = buddy?.completedLessons.includes(lesson.id);

              return (
                <div
                  key={lesson.id}
                  className={`
                    relative rounded-2xl p-6 border-4 transition-all hover:scale-105 cursor-pointer
                    ${isCompleted 
                      ? 'bg-gradient-to-br from-green-100 to-emerald-100 border-green-400' 
                      : 'bg-gradient-to-br from-blue-50 to-purple-50 border-purple-300 hover:border-purple-400'
                    }
                  `}
                  onClick={() => handleStartLesson(lesson)}
                >
                  {/* Lesson Number */}
                  <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                    {index + 1}
                  </div>

                  {/* Completed Badge */}
                  {isCompleted && (
                    <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center text-2xl shadow-lg">
                      ✅
                    </div>
                  )}

                  {/* Lesson Content */}
                  <div className="flex items-start gap-4">
                    <div className="text-5xl">{lesson.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{lesson.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{lesson.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 font-semibold">⏱️ {lesson.duration}</span>
                        {buddyCompleted && buddy && (
                          <span className="text-xs text-green-600 font-semibold">
                            {buddy.avatar} Completed!
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Start Button */}
                  <div className="mt-4">
                    <button className="w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg">
                      {isCompleted ? '🔄 Review Lesson' : '▶️ Start Lesson'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Completion Celebration */}
        {myProgress === totalLessons && (
          <div className="mt-8 bg-gradient-to-br from-yellow-300 via-orange-300 to-pink-300 rounded-3xl p-8 shadow-2xl text-center animate-pulse">
            <div className="text-8xl mb-4">🏆</div>
            <h2 className="text-4xl font-bold text-gray-800 mb-2">Unit Complete!</h2>
            <p className="text-xl text-gray-700 mb-4">
              You mastered {unit.title}! Amazing work! 🎉
            </p>
            <Link href="/kid/unit-map">
              <button className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-xl hover:scale-110 transition-all shadow-lg">
                🗺️ Explore More Units!
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
