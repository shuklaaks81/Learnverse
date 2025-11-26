"use client";


import Link from "next/link";

export default function KidPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-200 via-green-100 to-yellow-100 p-8">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center gap-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">Welcome to Learnverse!</h1>
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                  <div className="w-full flex justify-center mt-4">
                    <Link href="/kid/welcome">
                      <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 animate-pulse">
                        Create New Account ✨
                      </button>
                    </Link>
                  </div>
          <Link href="/kid/games" className="bg-indigo-100 hover:bg-indigo-200 rounded-xl p-6 flex flex-col items-center shadow transition">
            <span className="text-4xl mb-2">🎮</span>
            <span className="font-bold text-lg">Games</span>
            <span className="text-xs text-gray-500 mt-1">Play fun learning games!</span>
          </Link>
          <Link href="/kid/all-you-can-learn" className="bg-green-100 hover:bg-green-200 rounded-xl p-6 flex flex-col items-center shadow transition">
            <span className="text-4xl mb-2">📚</span>
            <span className="font-bold text-lg">All You Can Learn</span>
            <span className="text-xs text-gray-500 mt-1">Explore topics and lessons freely.</span>
          </Link>
          <Link href="/kid/lessons" className="bg-yellow-100 hover:bg-yellow-200 rounded-xl p-6 flex flex-col items-center shadow transition">
            <span className="text-4xl mb-2">📝</span>
            <span className="font-bold text-lg">Lessons</span>
            <span className="text-xs text-gray-500 mt-1">Continue your learning journey.</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
