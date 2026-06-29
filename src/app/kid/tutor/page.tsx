'use client';

import { TutorChat } from '@/components/TutorChat';
import Link from 'next/link';

export default function TutorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 p-4">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-8">
        <Link
          href="/kid"
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 transition"
        >
          ← Back to Hub
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto">
        <TutorChat />
      </div>

      {/* Footer Info */}
      <div className="max-w-2xl mx-auto mt-8 bg-white rounded-lg p-4 text-center text-gray-600 text-sm">
        <p>
          💡 <strong>Tip:</strong> You can ask questions about lessons, get help
          with problems, or just chat! Your tutor learns from your questions.
        </p>
      </div>

      {/* Fun Facts Section */}
      <div className="max-w-2xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg p-4 text-center">
          <p className="text-lg">🧠</p>
          <p className="font-semibold text-blue-900">AI Tutor</p>
          <p className="text-xs text-blue-700 mt-1">
            Smart answers powered by machine learning
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg p-4 text-center">
          <p className="text-lg">⚡</p>
          <p className="font-semibold text-purple-900">Super Fast</p>
          <p className="text-xs text-purple-700 mt-1">
            Get answers in under 5 seconds
          </p>
        </div>
      </div>
    </div>
  );
}
