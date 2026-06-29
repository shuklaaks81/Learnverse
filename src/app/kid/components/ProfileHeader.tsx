/**
 * ProfileHeader Component
 * 
 * Displays student profile bar with:
 * - Avatar with progress ring
 * - Name and completion percentage
 * - Coins and streak stats
 * - Achievements link
 * - Daily assignments button
 * - Sign out / Switch account button
 */

import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProfileHeaderProps {
  kidName: string;
  progress: number;
  coins: number;
  streak: number;
  hasMultipleAccounts: boolean;
  onProgressClick?: () => void;
}

export function ProfileHeader({
  kidName,
  progress,
  coins,
  streak,
  hasMultipleAccounts,
  onProgressClick,
}: ProfileHeaderProps) {
  const router = useRouter();

  const handleSignOut = () => {
    const kidAccounts = JSON.parse(localStorage.getItem('kidAccounts') || '[]');
    
    if (kidAccounts.length > 1) {
      localStorage.removeItem('currentKid');
      window.location.href = '/kid/kid-selector';
    } else {
      localStorage.removeItem('currentKid');
      alert("Signed out successfully!");
      window.location.href = '/kid/login';
    }
  };

  return (
    <div className="w-full max-w-5xl mb-6 bg-white rounded-2xl shadow-lg p-4 flex items-center justify-between">
      {/* Left: Profile Picture & Info */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-3xl shadow-lg border-4 border-white">
            👦
          </div>
          {/* Progress ring around profile pic */}
          <svg className="absolute top-0 left-0 w-16 h-16 -rotate-90 cursor-pointer" onClick={onProgressClick}>
            <circle cx="32" cy="32" r="30" stroke="#e5e7eb" strokeWidth="3" fill="none" />
            <circle 
              cx="32" 
              cy="32" 
              r="30" 
              stroke="#10b981" 
              strokeWidth="3" 
              fill="none"
              strokeDasharray={`${2 * Math.PI * 30}`}
              strokeDashoffset={`${2 * Math.PI * 30 * (1 - progress / 100)}`}
              className="transition-all duration-500"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">{kidName}</h2>
          <p className="text-sm text-gray-500">{progress}% Complete</p>
        </div>
      </div>

      {/* Center: Stats */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-center">
          <span className="text-2xl">🪙</span>
          <span className="text-sm font-bold text-yellow-600">{coins}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl">🔥</span>
          <span className="text-sm font-bold text-orange-600">{streak} day streak</span>
        </div>
        <Link href="/kid/achievements" className="flex flex-col items-center hover:scale-110 transition">
          <span className="text-2xl">🏆</span>
          <span className="text-xs text-gray-600">Achievements</span>
        </Link>
      </div>

      {/* Right: Assignments & Sign Out */}
      <div className="flex items-center gap-3">
        <Link href="/kid/daily-challenge">
          <button className="bg-gradient-to-r from-green-400 to-blue-400 text-white px-4 py-2 rounded-lg font-bold shadow hover:shadow-lg hover:scale-105 transition">
            📋 Assignments
          </button>
        </Link>
        <button 
          onClick={handleSignOut}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold transition"
        >
          {hasMultipleAccounts ? '🔄 Switch Account' : 'Sign Out'}
        </button>
      </div>
    </div>
  );
}
