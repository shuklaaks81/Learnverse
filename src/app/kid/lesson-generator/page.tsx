'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface LessonSettings {
  subject: string;
  difficulty: string;
  duration: string;
  includeGames: boolean;
  includeQuiz: boolean;
  includeAnimation: boolean;
  includeDragDrop: boolean;
}

interface GeneratedLesson {
  id: string;
  title: string;
  settings: LessonSettings;
  activities: any[];
  timestamp: number;
}

export default function LessonGenerator() {
  const router = useRouter();
  const [kidData, setKidData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLesson, setGeneratedLesson] = useState<GeneratedLesson | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [savedLessons, setSavedLessons] = useState<GeneratedLesson[]>([]);
  const [viewingSaved, setViewingSaved] = useState(false);

  const [settings, setSettings] = useState<LessonSettings>({
    subject: 'Math',
    difficulty: 'Medium',
    duration: '10',
    includeGames: true,
    includeQuiz: true,
    includeAnimation: true,
    includeDragDrop: true
  });

  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const kidDataStr = localStorage.getItem('currentKid');
        if (kidDataStr) {
          setKidData(JSON.parse(kidDataStr));
        }
        
        // Load saved lessons
        const saved = localStorage.getItem('generatedLessons');
        if (saved) {
          setSavedLessons(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Error loading data:', error);
        // Continue with empty/default values instead of crashing
      }
    }
  }, []);

  const handleGenerateLesson = async () => {
    if (!prompt.trim()) {
      alert('Please describe what you want to learn!');
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation (replace with actual AI API call)
    setTimeout(() => {
      const lesson: GeneratedLesson = {
        id: `lesson_${Date.now()}`,
        title: prompt.trim(),
        settings: { ...settings },
        activities: generateActivitiesFromSettings(settings, prompt),
        timestamp: Date.now()
      };
      
      setGeneratedLesson(lesson);
      setIsGenerating(false);
      setShowPreview(true);
    }, 3000);
  };

  const generateActivitiesFromSettings = (settings: LessonSettings, topic: string) => {
    const activities: any[] = [];
    
    // Intro
    activities.push({
      type: 'intro',
      data: {
        title: `${topic} 🚀`,
        description: `Let's explore ${topic} together! This will be fun and exciting!`,
        emoji: getEmojiForSubject(settings.subject)
      }
    });

    // Animation if enabled
    if (settings.includeAnimation) {
      activities.push({
        type: 'animation',
        data: {
          text: `Watch this cool animation about ${topic}!`,
          duration: 5000
        }
      });
    }

    // Drag and drop if enabled
    if (settings.includeDragDrop) {
      activities.push({
        type: 'dragdrop',
        data: {
          instruction: `Match the items related to ${topic}!`,
          items: generateDragDropItems(settings.subject, topic),
          zones: generateDragDropZones(settings.subject)
        }
      });
    }

    // Games if enabled
    if (settings.includeGames) {
      activities.push({
        type: 'minigame',
        data: {
          gameName: `${topic} Challenge`,
          instructions: `Play this fun game about ${topic}!`
        }
      });
    }

    // Quiz if enabled
    if (settings.includeQuiz) {
      activities.push({
        type: 'quiz',
        data: {
          questions: generateQuizQuestions(settings.subject, topic, settings.difficulty)
        }
      });
    }

    // Celebration
    const duration = parseInt(settings.duration);
    const coins = duration >= 15 ? 100 : duration >= 10 ? 75 : 50;
    activities.push({
      type: 'celebration',
      data: {
        message: `Amazing work on ${topic}! You're a superstar! 🌟`,
        coinsEarned: coins,
        starsEarned: 3
      }
    });

    return activities;
  };

  const getEmojiForSubject = (subject: string) => {
    const emojis: { [key: string]: string } = {
      'Math': '🔢',
      'Science': '🔬',
      'English': '📚',
      'History': '📜',
      'Geography': '🌍',
      'Art': '🎨',
      'Music': '🎵',
      'Coding': '💻'
    };
    return emojis[subject] || '✨';
  };

  const generateDragDropItems = (subject: string, topic: string) => {
    // Generate sample items based on subject
    return [
      { id: '1', content: `${topic} Example 1`, correctZone: 'correct' },
      { id: '2', content: `${topic} Example 2`, correctZone: 'correct' },
      { id: '3', content: 'Not related', correctZone: 'incorrect' }
    ];
  };

  const generateDragDropZones = (subject: string) => {
    return [
      { id: 'correct', label: 'Correct!' },
      { id: 'incorrect', label: 'Not quite!' }
    ];
  };

  const generateQuizQuestions = (subject: string, topic: string, difficulty: string) => {
    const numQuestions = difficulty === 'Easy' ? 3 : difficulty === 'Medium' ? 5 : 7;
    const questions = [];
    
    for (let i = 0; i < numQuestions; i++) {
      questions.push({
        question: `Sample question ${i + 1} about ${topic}?`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 0,
        explanation: `Great job! This relates to ${topic}.`
      });
    }
    
    return questions;
  };

  const handleSaveLesson = () => {
    if (!generatedLesson) return;
    
    const updated = [...savedLessons, generatedLesson];
    setSavedLessons(updated);
    localStorage.setItem('generatedLessons', JSON.stringify(updated));
    alert('Lesson saved! You can access it anytime from "My Lessons"');
  };

  const handleStartLesson = () => {
    if (!generatedLesson) return;
    
    // Store the lesson in localStorage and navigate to a player
    localStorage.setItem('activeGeneratedLesson', JSON.stringify(generatedLesson));
    router.push('/kid/lesson-player');
  };

  const handleExportJSON = () => {
    if (!generatedLesson) return;
    
    const dataStr = JSON.stringify(generatedLesson, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${generatedLesson.title.replace(/\s+/g, '_')}.json`;
    link.click();
  };

  const handleDeleteSaved = (lessonId: string) => {
    const updated = savedLessons.filter(l => l.id !== lessonId);
    setSavedLessons(updated);
    localStorage.setItem('generatedLessons', JSON.stringify(updated));
  };

  const handleLoadSaved = (lesson: GeneratedLesson) => {
    setGeneratedLesson(lesson);
    setShowPreview(true);
    setViewingSaved(false);
  };

  if (!kidData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 flex items-center justify-center">
        <div className="bg-white/90 rounded-3xl p-12 text-center shadow-2xl">
          <div className="text-6xl mb-4 animate-spin">✨</div>
          <div className="text-2xl font-bold text-gray-800 mb-2">Setting up your generator...</div>
          <div className="text-gray-600">Almost ready!</div>
        </div>
      </div>
    );
  }

  if (viewingSaved) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                📚 My Saved Lessons
              </h1>
              <button
                onClick={() => setViewingSaved(false)}
                className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-bold hover:scale-105 transform transition"
              >
                ← Back
              </button>
            </div>
          </div>

          {/* Saved Lessons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedLessons.length === 0 ? (
              <div className="col-span-full bg-white rounded-2xl p-12 text-center">
                <div className="text-6xl mb-4">📝</div>
                <h2 className="text-2xl font-bold text-gray-700 mb-2">No saved lessons yet!</h2>
                <p className="text-gray-500">Generate and save lessons to see them here.</p>
              </div>
            ) : (
              savedLessons.map((lesson) => (
                <div key={lesson.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition">
                  <div className="text-4xl mb-3">{getEmojiForSubject(lesson.settings.subject)}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{lesson.title}</h3>
                  <div className="space-y-1 mb-4">
                    <p className="text-sm text-gray-600">📚 {lesson.settings.subject}</p>
                    <p className="text-sm text-gray-600">⏱️ {lesson.settings.duration} minutes</p>
                    <p className="text-sm text-gray-600">📊 {lesson.settings.difficulty}</p>
                    <p className="text-xs text-gray-400">
                      Saved: {new Date(lesson.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleLoadSaved(lesson)}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-bold hover:scale-105 transform transition text-sm"
                    >
                      Open
                    </button>
                    <button
                      onClick={() => handleDeleteSaved(lesson.id)}
                      className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-bold hover:scale-105 transform transition text-sm"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                ✨ Lesson Generator
              </h1>
              <p className="text-gray-600 mt-2">Create your own custom lessons with AI!</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setViewingSaved(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold hover:scale-105 transform transition"
              >
                📚 My Lessons ({savedLessons.length})
              </button>
              <button
                onClick={() => router.push('/kid')}
                className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-bold hover:scale-105 transform transition"
              >
                🏠 Home
              </button>
            </div>
          </div>
        </div>

        {!showPreview ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Settings Panel */}
            <div className="bg-white rounded-2xl shadow-2xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">⚙️ Lesson Settings</h2>
              
              <div className="space-y-4">
                {/* Subject */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                  <select
                    value={settings.subject}
                    onChange={(e) => setSettings({ ...settings, subject: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                  >
                    <option>Math</option>
                    <option>Science</option>
                    <option>English</option>
                    <option>History</option>
                    <option>Geography</option>
                    <option>Art</option>
                    <option>Music</option>
                    <option>Coding</option>
                  </select>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Difficulty</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Easy', 'Medium', 'Hard'].map((level) => (
                      <button
                        key={level}
                        onClick={() => setSettings({ ...settings, difficulty: level })}
                        className={`px-4 py-3 rounded-xl font-bold transition ${
                          settings.difficulty === level
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Duration: {settings.duration} minutes
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="5"
                    value={settings.duration}
                    onChange={(e) => setSettings({ ...settings, duration: e.target.value })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>5 min</span>
                    <span>15 min</span>
                    <span>30 min</span>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Include Features</label>
                  <div className="space-y-2">
                    {[
                      { key: 'includeAnimation', label: '🎬 Animations', icon: '🎬' },
                      { key: 'includeDragDrop', label: '🎯 Drag & Drop', icon: '🎯' },
                      { key: 'includeGames', label: '🎮 Mini Games', icon: '🎮' },
                      { key: 'includeQuiz', label: '❓ Quiz Questions', icon: '❓' }
                    ].map(({ key, label, icon }) => (
                      <label key={key} className="flex items-center space-x-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={settings[key as keyof LessonSettings] as boolean}
                          onChange={(e) => setSettings({ ...settings, [key]: e.target.checked })}
                          className="w-5 h-5 text-purple-600 rounded"
                        />
                        <span className="text-gray-700 group-hover:text-purple-600 transition">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Prompt Panel */}
            <div className="bg-white rounded-2xl shadow-2xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">💡 What do you want to learn?</h2>
              
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your lesson idea! For example: 'I want to learn about dinosaurs and how they lived' or 'Teach me multiplication tables in a fun way'"
                className="w-full h-48 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none resize-none"
              />

              <button
                onClick={handleGenerateLesson}
                disabled={isGenerating || !prompt.trim()}
                className={`w-full mt-4 px-6 py-4 rounded-xl font-bold text-white text-lg transition transform ${
                  isGenerating || !prompt.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:scale-105 shadow-lg'
                }`}
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating your awesome lesson...
                  </span>
                ) : (
                  '✨ Generate Lesson with AI'
                )}
              </button>

              {/* Quick Examples */}
              <div className="mt-6">
                <p className="text-sm font-bold text-gray-700 mb-2">Quick Examples:</p>
                <div className="space-y-2">
                  {[
                    '🦕 Learn about dinosaurs',
                    '🌍 Explore the solar system',
                    '➕ Master multiplication',
                    '🎨 Introduction to famous painters'
                  ].map((example) => (
                    <button
                      key={example}
                      onClick={() => setPrompt(example.replace(/^[^\s]+\s/, ''))}
                      className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-purple-50 rounded-lg text-sm text-gray-700 hover:text-purple-700 transition"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Preview Panel */
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-800">🎉 Your Lesson is Ready!</h2>
              <button
                onClick={() => {
                  setShowPreview(false);
                  setGeneratedLesson(null);
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-bold transition"
              >
                ← New Lesson
              </button>
            </div>

            {generatedLesson && (
              <div>
                {/* Lesson Info */}
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{generatedLesson.title}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-3xl mb-1">{getEmojiForSubject(generatedLesson.settings.subject)}</div>
                      <div className="text-sm font-bold text-gray-700">{generatedLesson.settings.subject}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl mb-1">⏱️</div>
                      <div className="text-sm font-bold text-gray-700">{generatedLesson.settings.duration} min</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl mb-1">📊</div>
                      <div className="text-sm font-bold text-gray-700">{generatedLesson.settings.difficulty}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl mb-1">🎯</div>
                      <div className="text-sm font-bold text-gray-700">{generatedLesson.activities.length} Activities</div>
                    </div>
                  </div>
                </div>

                {/* Activities Preview */}
                <div className="mb-6">
                  <h4 className="text-xl font-bold text-gray-800 mb-4">📋 Lesson Activities:</h4>
                  <div className="space-y-3">
                    {generatedLesson.activities.map((activity, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                        <div className="text-2xl">
                          {activity.type === 'intro' && '👋'}
                          {activity.type === 'animation' && '🎬'}
                          {activity.type === 'dragdrop' && '🎯'}
                          {activity.type === 'minigame' && '🎮'}
                          {activity.type === 'quiz' && '❓'}
                          {activity.type === 'celebration' && '🎉'}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-gray-800 capitalize">{activity.type.replace('dragdrop', 'Drag & Drop')}</div>
                          <div className="text-sm text-gray-600">
                            {activity.type === 'celebration' && `Earn ${activity.data.coinsEarned} coins!`}
                            {activity.type === 'quiz' && `${activity.data.questions?.length || 0} questions`}
                            {activity.type === 'intro' && activity.data.title}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <button
                    onClick={handleStartLesson}
                    className="px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:scale-105 transform transition shadow-lg"
                  >
                    🚀 Start Lesson
                  </button>
                  <button
                    onClick={handleSaveLesson}
                    className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold hover:scale-105 transform transition shadow-lg"
                  >
                    💾 Save for Later
                  </button>
                  <button
                    onClick={handleExportJSON}
                    className="px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-bold hover:scale-105 transform transition shadow-lg"
                  >
                    📥 Export JSON
                  </button>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold hover:scale-105 transform transition shadow-lg"
                  >
                    ✏️ {isEditing ? 'Done' : 'Edit'}
                  </button>
                </div>

                {/* Edit Mode */}
                {isEditing && (
                  <div className="mt-6 p-6 bg-yellow-50 rounded-xl border-2 border-yellow-200">
                    <h4 className="text-lg font-bold text-gray-800 mb-3">✏️ Edit Mode</h4>
                    <textarea
                      value={JSON.stringify(generatedLesson, null, 2)}
                      onChange={(e) => {
                        try {
                          setGeneratedLesson(JSON.parse(e.target.value));
                        } catch (err) {
                          // Invalid JSON, don't update
                        }
                      }}
                      className="w-full h-64 px-4 py-3 border-2 border-gray-300 rounded-xl font-mono text-sm focus:border-purple-500 focus:outline-none"
                    />
                    <p className="text-xs text-gray-600 mt-2">
                      💡 Tip: Edit the JSON directly to customize your lesson!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
