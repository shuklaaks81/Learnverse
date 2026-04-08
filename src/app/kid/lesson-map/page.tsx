"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { lessonMap, isLessonUnlocked, type LessonNode } from '@/data/lessonMap';
import { LessonGenerator, type LessonRequest } from '@/utils/lessonGenerator';

/**
 * Dynamic Lesson Map
 * 
 * A visual journey where lessons generate on-demand!
 * Click any unlocked lesson node to generate it with AI.
 */
export default function LessonMapPage() {
  const router = useRouter();
  const [kidId, setKidId] = useState<string>('');
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [generatingLesson, setGeneratingLesson] = useState<LessonNode | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [cachedLessons, setCachedLessons] = useState<Record<string, any>>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const kidData = localStorage.getItem('currentKid');
        if (kidData) {
          const kid = JSON.parse(kidData);
          setKidId(kid.kidId);
          
          // Load completed lessons
          const completed = JSON.parse(
            localStorage.getItem(`kid_${kid.kidId}_completedMapLessons`) || '[]'
          );
          setCompletedLessons(completed);
          
          // Load cached generated lessons
          const cached = JSON.parse(
            localStorage.getItem(`kid_${kid.kidId}_cachedMapLessons`) || '{}'
          );
          setCachedLessons(cached);
        }
      } catch (error) {
        console.error('Error loading kid data:', error);
      }
    }
  }, []);

  const handleNodeClick = async (node: LessonNode) => {
    // Check if unlocked
    if (!isLessonUnlocked(node.id, completedLessons)) {
      alert('🔒 Complete previous lessons first!');
      return;
    }

    // Check if already cached
    if (cachedLessons[node.id]) {
      // Load from cache
      localStorage.setItem('activeGeneratedLesson', JSON.stringify(cachedLessons[node.id]));
      router.push('/kid/lesson-player?source=map');
      return;
    }

    // Generate new lesson
    setGeneratingLesson(node);
    setGenerationProgress(0);

    try {
      const generator = new LessonGenerator();
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => Math.min(prev + 5, 95));
      }, 800);

      const lessonRequest: LessonRequest = {
        subject: node.subject,
        topic: node.topic,
        gradeLevel: node.gradeLevel.toString(),
        difficulty: node.difficulty,
      };

      const generatedLesson = await generator.generateLesson(lessonRequest);

      clearInterval(progressInterval);
      setGenerationProgress(100);

      // Cache the lesson
      const updatedCache = {
        ...cachedLessons,
        [node.id]: {
          ...generatedLesson,
          nodeId: node.id,
          generatedAt: new Date().toISOString(),
        },
      };
      
      setCachedLessons(updatedCache);
      localStorage.setItem(
        `kid_${kidId}_cachedMapLessons`,
        JSON.stringify(updatedCache)
      );

      // Store as active lesson
      localStorage.setItem('activeGeneratedLesson', JSON.stringify(generatedLesson));

      // Navigate to lesson player
      setTimeout(() => {
        router.push('/kid/lesson-player?source=map');
      }, 500);

    } catch (error) {
      console.error('Lesson generation failed:', error);
      alert('😢 Failed to generate lesson. Please try again!');
      setGeneratingLesson(null);
    }
  };

  const getNodeStatus = (node: LessonNode) => {
    const isCompleted = completedLessons.includes(node.id);
    const isUnlocked = isLessonUnlocked(node.id, completedLessons);
    const isCached = !!cachedLessons[node.id];
    
    return { isCompleted, isUnlocked, isCached };
  };

  // Loading screen during generation
  if (generatingLesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 flex items-center justify-center p-8">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-12 max-w-2xl w-full shadow-2xl border-4 border-white/50">
          {/* Animated Robot/AI Icon */}
          <div className="text-9xl text-center mb-8 animate-bounce">
            🤖
          </div>

          <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            AI is Creating Your Lesson!
          </h1>
          
          <p className="text-xl text-center text-gray-700 mb-2">
            {generatingLesson.title}
          </p>
          
          <p className="text-lg text-center text-gray-500 mb-8">
            📚 {generatingLesson.subject} • 🎯 Grade {generatingLesson.gradeLevel} • ⭐ {generatingLesson.difficulty}
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

          {/* Status Messages */}
          <div className="text-center space-y-2">
            {generationProgress < 20 && (
              <p className="text-lg text-purple-600 font-semibold animate-pulse">
                🧠 AI is thinking...
              </p>
            )}
            {generationProgress >= 20 && generationProgress < 50 && (
              <p className="text-lg text-blue-600 font-semibold animate-pulse">
                ✨ Creating activities...
              </p>
            )}
            {generationProgress >= 50 && generationProgress < 80 && (
              <p className="text-lg text-green-600 font-semibold animate-pulse">
                🎨 Adding fun elements...
              </p>
            )}
            {generationProgress >= 80 && generationProgress < 100 && (
              <p className="text-lg text-orange-600 font-semibold animate-pulse">
                🎉 Almost ready...
              </p>
            )}
            {generationProgress === 100 && (
              <p className="text-lg text-pink-600 font-semibold animate-pulse">
                ✅ Complete! Loading lesson...
              </p>
            )}
          </div>

          <p className="text-sm text-center text-gray-400 mt-6">
            Generating 10-15 comprehensive activities! This takes ~15-20 seconds ⏱️
          </p>
        </div>
      </div>
    );
  }

  // Main Map View
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-300 via-blue-200 to-indigo-300 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Clouds */}
        <div className="absolute top-10 left-10 text-6xl opacity-70 animate-float">☁️</div>
        <div className="absolute top-20 right-20 text-8xl opacity-60 animate-float" style={{ animationDelay: '1s' }}>☁️</div>
        <div className="absolute top-40 left-1/3 text-7xl opacity-50 animate-float" style={{ animationDelay: '2s' }}>☁️</div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold text-white drop-shadow-lg mb-2">
              🗺️ Learning Journey Map
            </h1>
            <p className="text-xl text-white/90 drop-shadow">
              Click any unlocked lesson to start learning!
            </p>
          </div>
          
          <Link href="/kid">
            <button className="px-6 py-3 bg-white/90 backdrop-blur-sm text-blue-600 rounded-2xl font-bold hover:bg-white hover:scale-105 transition-all shadow-lg">
              🏠 Back Home
            </button>
          </Link>
        </div>
      </div>

      {/* Legend */}
      <div className="relative z-10 px-6 pb-4">
        <div className="max-w-7xl mx-auto flex gap-6 items-center justify-center text-sm">
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="font-semibold text-gray-700">✅ Completed</span>
          </div>
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span className="font-semibold text-gray-700">🔓 Unlocked</span>
          </div>
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full">
            <div className="w-4 h-4 rounded-full bg-gray-400"></div>
            <span className="font-semibold text-gray-700">🔒 Locked</span>
          </div>
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full">
            <span className="text-xl">💾</span>
            <span className="font-semibold text-gray-700">Cached (instant)</span>
          </div>
        </div>
      </div>

      {/* The Map - Lesson Nodes */}
      <div className="relative z-10 px-6 pb-12">
        <div className="max-w-7xl mx-auto relative" style={{ height: '70vh', minHeight: '600px' }}>
          {/* Connection Lines (optional visual enhancement) */}
          <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
            {lessonMap.map(node => {
              if (!node.prerequisites) return null;
              return node.prerequisites.map(prereqId => {
                const prereqNode = lessonMap.find(n => n.id === prereqId);
                if (!prereqNode) return null;
                
                const { isUnlocked } = getNodeStatus(node);
                
                return (
                  <line
                    key={`${prereqId}-${node.id}`}
                    x1={`${prereqNode.position.x}%`}
                    y1={`${prereqNode.position.y}%`}
                    x2={`${node.position.x}%`}
                    y2={`${node.position.y}%`}
                    stroke={isUnlocked ? '#3b82f6' : '#9ca3af'}
                    strokeWidth="3"
                    strokeDasharray={isUnlocked ? '0' : '8 4'}
                    opacity="0.3"
                  />
                );
              });
            })}
          </svg>

          {/* Lesson Nodes */}
          {lessonMap.map(node => {
            const { isCompleted, isUnlocked, isCached } = getNodeStatus(node);
            const isHovered = hoveredNode === node.id;

            return (
              <button
                key={node.id}
                onClick={() => handleNodeClick(node)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                disabled={!isUnlocked}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                style={{
                  left: `${node.position.x}%`,
                  top: `${node.position.y}%`,
                }}
              >
                {/* Node Circle */}
                <div
                  className={`
                    w-20 h-20 rounded-full flex items-center justify-center text-4xl
                    border-4 shadow-xl transition-all duration-300
                    ${isCompleted 
                      ? 'bg-gradient-to-br from-green-400 to-emerald-500 border-green-300 shadow-green-500/50' 
                      : isUnlocked 
                        ? `bg-gradient-to-br ${node.color} border-white/50 shadow-blue-500/50 hover:scale-125 hover:shadow-2xl cursor-pointer` 
                        : 'bg-gray-400 border-gray-300 shadow-gray-500/30 cursor-not-allowed opacity-60'
                    }
                    ${isHovered && isUnlocked ? 'scale-125 shadow-2xl' : ''}
                  `}
                >
                  {isCompleted ? '✅' : isUnlocked ? node.icon : '🔒'}
                  
                  {/* Cached Indicator */}
                  {isCached && !isCompleted && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs border-2 border-white shadow-lg">
                      💾
                    </div>
                  )}
                </div>

                {/* Node Label */}
                <div
                  className={`
                    absolute left-1/2 -translate-x-1/2 top-24 
                    bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 
                    shadow-lg border-2 border-white/50 min-w-[200px]
                    transition-all duration-300
                    ${isHovered && isUnlocked ? 'opacity-100 scale-110' : 'opacity-0 scale-95 pointer-events-none'}
                  `}
                >
                  <h3 className="font-bold text-gray-800 text-center mb-1">
                    {node.title}
                  </h3>
                  <p className="text-xs text-gray-600 text-center mb-2">
                    {node.description}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <span>📚 {node.subject}</span>
                    <span>•</span>
                    <span>Grade {node.gradeLevel}</span>
                    <span>•</span>
                    <span>{node.difficulty}</span>
                  </div>
                  {isCached && (
                    <p className="text-xs text-purple-600 font-semibold text-center mt-1">
                      ⚡ Instant play (cached)
                    </p>
                  )}
                  {!isUnlocked && (
                    <p className="text-xs text-red-600 font-semibold text-center mt-1">
                      🔒 Complete prerequisites first
                    </p>
                  )}
                </div>

                {/* Pulsing Animation for Unlocked Nodes */}
                {isUnlocked && !isCompleted && (
                  <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats Footer */}
      <div className="relative z-10 pb-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg inline-block">
            <div className="flex items-center gap-8">
              <div>
                <div className="text-3xl font-bold text-gray-800">{completedLessons.length}</div>
                <div className="text-sm text-gray-600">Lessons Completed</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div>
                <div className="text-3xl font-bold text-gray-800">
                  {lessonMap.filter(n => isLessonUnlocked(n.id, completedLessons)).length}
                </div>
                <div className="text-sm text-gray-600">Lessons Unlocked</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div>
                <div className="text-3xl font-bold text-gray-800">{Object.keys(cachedLessons).length}</div>
                <div className="text-sm text-gray-600">Lessons Cached</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
