"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProfileHeader } from "./components/ProfileHeader";
import { FeatureGrid } from "./components/FeatureGrid";

/**
 * Kid Hub Page
 * 
 * Main dashboard for student accounts displaying:
 * - Profile header with stats (coins, streak, achievements)
 * - Feature grid with access to all learning activities
 * - Account management (sign out, switch account)
 * - Welcome messaging
 */
export default function KidPage() {
  const [kidName, setKidName] = useState("Alex");
  const [progress, setProgress] = useState(65);
  const [coins, setCoins] = useState(250);
  const [streak, setStreak] = useState(7);
  const [showBuildButton, setShowBuildButton] = useState(false);
  const [hasMultipleAccounts, setHasMultipleAccounts] = useState(false);

  useEffect(() => {
    const featureEnabled = localStorage.getItem('feature_buildApp');
    setShowBuildButton(featureEnabled === 'true');
    
    const kidAccounts = JSON.parse(localStorage.getItem('kidAccounts') || '[]');
    setHasMultipleAccounts(kidAccounts.length > 1);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-200 via-green-100 to-yellow-100 p-8">
      <ProfileHeader 
        kidName={kidName}
        progress={progress}
        coins={coins}
        streak={streak}
        hasMultipleAccounts={hasMultipleAccounts}
      />

      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center gap-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">Welcome to Learnverse!</h1>
        
        {/* Create Account Button */}
        <div className="w-full flex justify-center">
          <Link href="/kid/welcome">
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 animate-pulse">
              Create New Account ✨
            </button>
          </Link>
        </div>

        {/* Feature Grid */}
        <FeatureGrid />
      </div>
    </div>
  );
}
