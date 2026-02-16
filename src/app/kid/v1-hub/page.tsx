"use client";

import Link from "next/link";

export default function V1HubPage() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Simple header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Welcome to Learnverse
          </h1>
          <p className="text-xl text-gray-600">
            A simple learning app for kids
          </p>
        </div>

        {/* Simple navigation */}
        <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-700 mb-6">What would you like to do?</h2>
          
          <div className="space-y-4">
            <Link href="/kid/lessons">
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 px-6 rounded text-lg font-semibold transition">
                📚 View Lessons
              </button>
            </Link>
            
            <Link href="/kid/games">
              <button className="w-full bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded text-lg font-semibold transition">
                🎮 Play Games
              </button>
            </Link>
            
            <button className="w-full bg-gray-300 text-gray-500 py-4 px-6 rounded text-lg font-semibold cursor-not-allowed">
                ⚙️ Settings (Coming Soon)
            </button>
          </div>
        </div>

        {/* No lessons yet message */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-lg text-gray-700">
            ⚠️ No lessons available yet. Check back soon!
          </p>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Learnverse v0.1 - The Beginning</p>
          <Link href="/kid/time-machine">
            <button className="mt-4 text-blue-500 hover:text-blue-700 underline">
              ← Back to Time Machine
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
