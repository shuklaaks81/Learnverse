"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function StudyHub() {
  const [kidName, setKidName] = useState("Student");
  const [progress, setProgress] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const kidData = localStorage.getItem('currentKid');
      if (kidData) {
        const kid = JSON.parse(kidData);
        setKidName(kid.kidName || 'Student');
        const lessons = JSON.parse(localStorage.getItem(`kid_${kid.kidId}_completedLessons`) || '[]');
        setCompletedLessons(lessons.length);
        setProgress(Math.min(lessons.length * 5, 100));
      }
    }
  }, []);

  const subjects = [
    { name: "Mathematics", icon: "📐", description: "Numbers, equations, and problem solving", link: "/kid/topic/math" },
    { name: "Science", icon: "🔬", description: "Explore the natural world", link: "/kid/topic/science" },
    { name: "Reading", icon: "📖", description: "Improve comprehension and vocabulary", link: "/kid/topic/reading" },
    { name: "Writing", icon: "✍️", description: "Develop writing skills", link: "/kid/topic/writing" },
    { name: "History", icon: "🏛️", description: "Learn about past events", link: "/kid/topic/history" },
    { name: "Geography", icon: "🗺️", description: "Understand our world", link: "/kid/topic/geography" },
  ];

  const tools = [
    { name: "Practice Tests", icon: "📝", link: "/kid/practice" },
    { name: "Study Guides", icon: "📚", link: "/kid/guides" },
    { name: "Progress Report", icon: "📊", link: "/kid/progress" },
    { name: "Resources", icon: "💼", link: "/kid/resources" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Learnverse</h1>
              <p className="text-sm text-gray-600">Welcome back, {kidName}</p>
            </div>
            <Link href="/kid">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Main Hub
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Progress Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Your Progress</h2>
              <p className="text-sm text-gray-600">{completedLessons} lessons completed</p>
            </div>
            <div className="text-3xl font-bold text-blue-600">{progress}%</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Subjects Grid */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Subjects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject) => (
              <Link key={subject.name} href={subject.link}>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-blue-500 hover:shadow-md transition cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{subject.icon}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{subject.name}</h3>
                      <p className="text-sm text-gray-600">{subject.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Tools Section */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Learning Tools</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tools.map((tool) => (
              <Link key={tool.name} href={tool.link}>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center hover:border-blue-500 hover:shadow-md transition cursor-pointer">
                  <div className="text-4xl mb-2">{tool.icon}</div>
                  <h3 className="text-sm font-medium text-gray-900">{tool.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex gap-3">
            <div className="text-2xl">ℹ️</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Study Tips</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Set specific learning goals each day</li>
                <li>• Take regular breaks to stay focused</li>
                <li>• Review material regularly for better retention</li>
                <li>• Ask questions when you need help</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-600">
            Keep learning and growing every day
          </p>
        </div>
      </footer>
    </div>
  );
}
