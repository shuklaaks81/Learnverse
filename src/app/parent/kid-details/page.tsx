"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

interface Activity {
  id: number;
  type: string;
  title: string;
  date: string;
  score: number;
}

function DetailsContent() {
  const searchParams = useSearchParams();
  const kidName = searchParams.get("name") || "Kid";
  const kidId = searchParams.get("id") || "";
  const progress = parseInt(searchParams.get("progress") || "0");

  const activities: Activity[] = [
    { id: 1, type: "Lesson", title: "Math: Addition Basics", date: "2 hours ago", score: 95 },
    { id: 2, type: "Game", title: "Word Puzzle Challenge", date: "5 hours ago", score: 88 },
    { id: 3, type: "Lesson", title: "Science: The Water Cycle", date: "Yesterday", score: 92 },
    { id: 4, type: "Quiz", title: "English Grammar Test", date: "Yesterday", score: 85 },
    { id: 5, type: "Game", title: "Math Racing Game", date: "2 days ago", score: 90 },
  ];

  const achievements = [
    { id: 1, name: "Quick Learner", icon: "⚡", earned: true },
    { id: 2, name: "Perfect Score", icon: "💯", earned: true },
    { id: 3, name: "5 Day Streak", icon: "🔥", earned: true },
    { id: 4, name: "Math Master", icon: "🧮", earned: false },
    { id: 5, name: "Reading Champion", icon: "📚", earned: false },
    { id: 6, name: "Science Explorer", icon: "🔬", earned: false },
  ];

  const stats = [
    { label: "Total Time", value: "12.5 hrs", icon: "⏱️" },
    { label: "Lessons", value: "24", icon: "📖" },
    { label: "Games Played", value: "18", icon: "🎮" },
    { label: "Avg Score", value: "89%", icon: "📊" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-400 via-orange-300 to-pink-300 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-indigo-600">{kidName}&apos;s Progress</h1>
              <p className="text-gray-600 mt-1">Kid ID: {kidId}</p>
            </div>
            <Link 
              href="/parent/dashboard"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-indigo-600 mb-4">Overall Progress</h2>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Completion Rate</span>
              <span className="font-semibold text-indigo-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow-lg p-4">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-indigo-600">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-amber-600 mb-4">🏆 Achievements</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 text-center transition-all ${
                  achievement.earned
                    ? "bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-300"
                    : "bg-gray-50 border-gray-200 opacity-50"
                }`}
              >
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <div className="text-xs font-semibold text-gray-700">{achievement.name}</div>
                {achievement.earned && (
                  <div className="text-xs text-green-600 font-bold mt-1">✓ Earned</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-indigo-600 mb-4">📚 Recent Activity</h2>
          <div className="space-y-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100"
              >
                <div className="flex items-center gap-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    activity.type === "Lesson" ? "bg-blue-200 text-blue-700" :
                    activity.type === "Game" ? "bg-green-200 text-green-700" :
                    "bg-purple-200 text-purple-700"
                  }`}>
                    {activity.type}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-indigo-600">{activity.score}%</p>
                  <p className="text-xs text-gray-500">score</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function KidDetailsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <DetailsContent />
    </Suspense>
  );
}
