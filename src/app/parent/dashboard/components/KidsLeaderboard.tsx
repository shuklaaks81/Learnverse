/**
 * KidsLeaderboard Component
 * 
 * Displays family leaderboard with:
 * - Rankings sorted by progress percentage
 * - Medal indicators (🥇🥈🥉)
 * - Individual stats (lessons, achievements, streak)
 * - Visual progress indicators
 */

interface Kid {
  id: string;
  name: string;
  progress: number;
  lessonsCompleted: number;
  achievements: number;
  streakDays?: number;
  lastActive?: string;
}

interface KidsLeaderboardProps {
  kids: Kid[];
}

export function KidsLeaderboard({ kids }: KidsLeaderboardProps) {
  if (kids.length === 0) {
    return (
      <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-3xl shadow-xl p-8 mb-10 border-2 border-yellow-200">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent mb-6 flex items-center gap-3">
          <span className="text-4xl">🏆</span> Family Leaderboard
        </h2>
        <p className="text-gray-600 text-center py-12 text-lg font-semibold">
          Add kids to see the leaderboard! 👨‍👩‍👧‍👦
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-3xl shadow-2xl p-8 mb-10 border-2 border-yellow-200">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent mb-8 flex items-center gap-3">
        <span className="text-4xl">🏆</span> Family Leaderboard
      </h2>
      
      <div className="space-y-4">
        {[...kids]
          .sort((a, b) => b.progress - a.progress)
          .map((kid, index) => (
            <div
              key={kid.id}
              className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl transition-all transform hover:scale-102 hover:shadow-lg ${
                index === 0
                  ? "bg-gradient-to-r from-amber-200 via-yellow-200 to-orange-200 border-3 border-amber-400 shadow-xl animate-slideInUp"
                  : index === 1
                  ? "bg-gradient-to-r from-gray-200 to-slate-200 border-2 border-gray-400 shadow-lg animate-slideInUp"
                  : index === 2
                  ? "bg-gradient-to-r from-orange-200 to-amber-200 border-2 border-orange-400 shadow-lg animate-slideInUp"
                  : "bg-white/90 backdrop-blur border border-gray-300 shadow-md hover:shadow-xl"
              }`}
            >
              <div className="flex items-start sm:items-center gap-4 flex-1">
                <div className={`text-4xl font-bold w-12 text-center ${
                  index < 3 ? 'scale-125' : ''
                }`}>
                  {index === 0 && "🥇"}
                  {index === 1 && "🥈"}
                  {index === 2 && "🥉"}
                  {index > 2 && <span className="text-2xl font-bold text-gray-600">#{index + 1}</span>}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-xl text-gray-900">{kid.name}</p>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-700 mt-2">
                    <span className="flex items-center gap-1">📚 {kid.lessonsCompleted} lessons</span>
                    <span className="flex items-center gap-1">⭐ {kid.achievements} achievements</span>
                    {kid.streakDays !== undefined && kid.streakDays > 0 && (
                      <span className="flex items-center gap-1 font-bold text-orange-600">
                        🔥 {kid.streakDays} day streak!
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right flex flex-col items-end gap-2 mt-4 sm:mt-0">
                <div className="flex items-baseline gap-1">
                  <span className={`font-bold transition-all ${
                    index === 0 ? 'text-4xl text-amber-600' : 'text-3xl text-indigo-600'
                  }`}>
                    {kid.progress}%
                  </span>
                </div>
                <div className="w-40 bg-gray-300 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-full transition-all rounded-full ${
                      index === 0 ? 'bg-gradient-to-r from-amber-500 to-yellow-500' :
                      index === 1 ? 'bg-gradient-to-r from-gray-500 to-slate-500' :
                      index === 2 ? 'bg-gradient-to-r from-orange-500 to-amber-500' :
                      'bg-gradient-to-r from-purple-500 to-pink-500'
                    }`}
                    style={{ width: `${kid.progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 font-semibold">Progress</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
