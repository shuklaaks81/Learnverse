/**
 * FamilyCardsGrid Component
 * 
 * Displays grid of individual kid learning cards with:
 * - Progress bars
 * - Statistics (lessons, achievements, streaks)
 * - Links to detailed view for each child
 * - Last active dates
 */

import Link from "next/link";

interface Kid {
  id: string;
  name: string;
  progress: number;
  lessonsCompleted: number;
  achievements: number;
  streakDays?: number;
  lastActive?: string;
}

interface FamilyCardsGridProps {
  kids: Kid[];
}

export function FamilyCardsGrid({ kids }: FamilyCardsGridProps) {
  if (kids.length === 0) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl shadow-xl p-8 border-2 border-indigo-200">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6 flex items-center gap-3">
          <span className="text-4xl">👨‍👩‍👧‍👦</span> Your Family
        </h2>
        <p className="text-gray-600 text-center py-12 text-lg font-semibold">
          No kids added yet. Click &quot;Add New Kid to Family&quot; to get started! 🎉
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl shadow-2xl p-8 border-2 border-indigo-200">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8 flex items-center gap-3">
        <span className="text-4xl">👨‍👩‍👧‍👦</span> Your Family
      </h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kids.map((kid, index) => (
          <div
            key={kid.id}
            className="group border-2 border-purple-300 rounded-3xl p-6 hover:shadow-2xl transition-all bg-white/95 backdrop-blur transform hover:scale-105 hover:-translate-y-2 animate-slideInUp"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {kid.name}
              </h3>
              <span className="text-4xl group-hover:scale-125 transition-transform">🎓</span>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-gray-700 font-semibold">✨ Overall Progress</span>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {kid.progress}%
                </span>
              </div>
              <div className="w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-full h-4 overflow-hidden shadow-md">
                <div
                  className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 h-4 rounded-full transition-all shadow-lg"
                  style={{ width: `${kid.progress}%` }}
                />
              </div>
            </div>
            
            <div className="space-y-3 mb-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-700 font-semibold">📚 Lessons</span>
                <span className="font-bold text-lg text-purple-600">{kid.lessonsCompleted}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-700 font-semibold">🏆 Achievements</span>
                <span className="font-bold text-lg text-amber-600">{kid.achievements}</span>
              </div>
              {kid.streakDays !== undefined && kid.streakDays > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-700 font-semibold">🔥 Streak</span>
                  <span className="font-bold text-lg text-orange-600">{kid.streakDays} days</span>
                </div>
              )}
              {kid.lastActive && (
                <div className="text-xs text-gray-600 mt-2 pt-2 border-t border-purple-200">
                  📅 Last active: {new Date(kid.lastActive).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric'
                  })}
                </div>
              )}
            </div>

            <Link 
              href={`/parent/kid-details?id=${kid.id}&name=${kid.name}&progress=${kid.progress}`}
              className="block w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-4 rounded-2xl transition-all text-sm font-bold text-center shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              View Details →
            </Link>

            <p className="text-xs text-gray-500 mt-3 text-center opacity-60">
              ID: {kid.id.substring(0, 12)}...
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
