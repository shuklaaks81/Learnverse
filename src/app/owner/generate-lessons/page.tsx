'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LessonGeneratorPage() {
  const [subject, setSubject] = useState('Math');
  const [topic, setTopic] = useState('');
  const [gradeLevel, setGradeLevel] = useState('3');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [generating, setGenerating] = useState(false);
  const [generatedLesson, setGeneratedLesson] = useState<any>(null);
  const [error, setError] = useState('');

  const subjects = [
    { id: 'Math', emoji: '🔢', topics: ['Addition', 'Subtraction', 'Multiplication', 'Division', 'Fractions', 'Decimals', 'Geometry', 'Algebra'] },
    { id: 'Science', emoji: '🔬', topics: ['Animals', 'Plants', 'Solar System', 'Weather', 'Rocks & Minerals', 'Human Body', 'Energy', 'Forces'] },
    { id: 'Reading', emoji: '📖', topics: ['Phonics', 'Comprehension', 'Vocabulary', 'Grammar', 'Verbs', 'Nouns', 'Adjectives', 'Story Writing'] },
    { id: 'Social Studies', emoji: '🌍', topics: ['Geography', 'History', 'Cultures', 'Government', 'Economics', 'Maps', 'Communities', 'Famous People'] },
    { id: 'Art', emoji: '🎨', topics: ['Colors', 'Shapes', 'Drawing', 'Painting', 'Sculpture', 'Art History', 'Famous Artists', 'Design'] },
  ];

  const currentSubject = subjects.find(s => s.id === subject);

  const generateLesson = async () => {
    if (!topic) {
      setError('Please enter a topic!');
      return;
    }

    setGenerating(true);
    setError('');
    setGeneratedLesson(null);

    try {
      const response = await fetch('/api/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          topic,
          gradeLevel,
          difficulty,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate lesson');
      }

      setGeneratedLesson(data.lesson);
      
    } catch (err: any) {
      setError(err.message || 'Something went wrong!');
    } finally {
      setGenerating(false);
    }
  };

  const saveLesson = () => {
    if (!generatedLesson) return;

    // Download as JSON file
    const blob = new Blob([JSON.stringify(generatedLesson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lesson-${subject}-${topic.replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4">
            🤖 AI Lesson Generator 🚀
          </h1>
          <p className="text-2xl text-purple-200 mb-6">
            Create UNLIMITED educational lessons with Groq AI!
          </p>
          <Link
            href="/owner"
            className="inline-block px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold transition-all"
          >
            ⬅️ Back to Owner Dashboard
          </Link>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Panel */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border-4 border-white/20">
              <h2 className="text-3xl font-bold text-yellow-300 mb-6">📝 Lesson Details</h2>

              {/* Subject Selection */}
              <div className="mb-6">
                <label className="text-white font-bold text-xl mb-3 block">Subject:</label>
                <div className="grid grid-cols-2 gap-3">
                  {subjects.map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        setSubject(sub.id);
                        setTopic('');
                      }}
                      className={`p-4 rounded-xl font-bold text-xl transition-all ${
                        subject === sub.id
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white scale-105'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {sub.emoji} {sub.id}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic */}
              <div className="mb-6">
                <label className="text-white font-bold text-xl mb-3 block">Topic:</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Fractions, Solar System, Verbs..."
                  className="w-full px-4 py-3 rounded-xl text-xl bg-white/20 text-white placeholder-white/50 border-2 border-white/30 focus:border-yellow-400 outline-none"
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {currentSubject?.topics.map(t => (
                    <button
                      key={t}
                      onClick={() => setTopic(t)}
                      className="px-3 py-1 bg-blue-500/30 hover:bg-blue-500/50 text-white rounded-lg text-sm transition-all"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grade Level */}
              <div className="mb-6">
                <label className="text-white font-bold text-xl mb-3 block">Grade Level:</label>
                <select
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-xl bg-white/20 text-white border-2 border-white/30 focus:border-yellow-400 outline-none"
                >
                  <option value="K">Kindergarten</option>
                  <option value="1">Grade 1</option>
                  <option value="2">Grade 2</option>
                  <option value="3">Grade 3</option>
                  <option value="4">Grade 4</option>
                  <option value="5">Grade 5</option>
                </select>
              </div>

              {/* Difficulty */}
              <div className="mb-6">
                <label className="text-white font-bold text-xl mb-3 block">Difficulty:</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['easy', 'medium', 'hard'] as const).map(diff => (
                    <button
                      key={diff}
                      onClick={() => setDifficulty(diff)}
                      className={`p-3 rounded-xl font-bold capitalize transition-all ${
                        difficulty === diff
                          ? 'bg-green-500 text-white scale-105'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {diff === 'easy' && '😊'} {diff === 'medium' && '🤔'} {diff === 'hard' && '🧠'}
                      <br />{diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateLesson}
                disabled={generating || !topic}
                className={`w-full py-4 rounded-xl font-bold text-2xl transition-all ${
                  generating || !topic
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white hover:scale-105'
                }`}
              >
                {generating ? '⏳ Generating...' : '🚀 Generate Lesson!'}
              </button>

              {error && (
                <div className="mt-4 p-4 bg-red-500/20 border-2 border-red-500 rounded-xl text-red-200">
                  ❌ {error}
                </div>
              )}
            </div>

            {/* Output Panel */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border-4 border-white/20">
              <h2 className="text-3xl font-bold text-yellow-300 mb-6">✨ Generated Lesson</h2>

              {!generatedLesson && !generating && (
                <div className="text-center py-12">
                  <div className="text-9xl mb-4">🎓</div>
                  <p className="text-xl text-white/60">
                    Fill in the details and click Generate!
                  </p>
                </div>
              )}

              {generating && (
                <div className="text-center py-12">
                  <div className="text-9xl mb-4 animate-bounce">🤖</div>
                  <p className="text-2xl text-white font-bold animate-pulse">
                    AI is creating your comprehensive lesson...
                  </p>
                  <p className="text-lg text-white/80 mt-2">
                    Generating 10-15 interactive activities! ⏱️
                  </p>
                </div>
              )}

              {generatedLesson && (
                <div>
                  <div className="bg-green-500/20 border-2 border-green-500 rounded-xl p-4 mb-4">
                    <div className="text-2xl font-bold text-green-300 mb-2">
                      ✅ {generatedLesson.title}
                    </div>
                    <div className="text-white/80">
                      {generatedLesson.activities.length} activities created!
                    </div>
                  </div>

                  {/* Activities Preview */}
                  <div className="space-y-3 max-h-96 overflow-y-auto mb-6">
                    {generatedLesson.activities.map((activity: any, idx: number) => (
                      <div key={idx} className="bg-white/10 rounded-xl p-4">
                        <div className="font-bold text-yellow-300 mb-1">
                          {idx + 1}. {activity.type.toUpperCase()}
                        </div>
                        <div className="text-sm text-white/70">
                          {activity.data.title || activity.data.concept || activity.data.question || activity.data.message || 'Activity'}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => {
                        // Save lesson to localStorage for preview
                        if (typeof window !== 'undefined') {
                          localStorage.setItem('previewLesson', JSON.stringify(generatedLesson));
                          // Navigate to lesson player
                          window.location.href = '/kid/lesson-player?preview=true';
                        }
                      }}
                      className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-all transform hover:scale-105"
                    >
                      ▶️ Start Lesson
                    </button>
                    <button
                      onClick={saveLesson}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all"
                    >
                      💾 Download JSON
                    </button>
                    <button
                      onClick={() => setGeneratedLesson(null)}
                      className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all"
                    >
                      🔄 Generate Another
                    </button>
                  </div>

                  {/* JSON Preview */}
                  <details className="mt-4">
                    <summary className="cursor-pointer text-white font-bold mb-2">
                      📋 View JSON
                    </summary>
                    <pre className="bg-black/50 rounded-xl p-4 text-xs text-green-300 overflow-auto max-h-64">
                      {JSON.stringify(generatedLesson, null, 2)}
                    </pre>
                  </details>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="max-w-6xl mx-auto mt-8 bg-yellow-500/20 border-4 border-yellow-500 rounded-3xl p-6">
          <h3 className="text-2xl font-bold text-yellow-300 mb-3">ℹ️ How to Use:</h3>
          <ol className="text-white space-y-2">
            <li>1. Choose a subject (Math, Science, Reading, etc.)</li>
            <li>2. Enter a specific topic or pick from suggestions</li>
            <li>3. Select grade level and difficulty</li>
            <li>4. Click &ldquo;Generate Lesson&rdquo; and wait ~15-20 seconds</li>
            <li>5. Each lesson now includes 10-15 comprehensive activities! 🎉</li>
            <li>6. Download the JSON and add it to <code className="bg-black/30 px-2 py-1 rounded">src/data/interactiveLessons.ts</code></li>
            <li>7. Kids can now learn that topic thoroughly! 🎓</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
