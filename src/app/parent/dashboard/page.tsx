"use client";

import { useState, useEffect } from "react";
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

export default function ParentDashboard() {
  const [kids, setKids] = useState<Kid[]>([]);
  const [crashed, setCrashed] = useState(false);
  const [crashReason, setCrashReason] = useState('');
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [currentVersion, setCurrentVersion] = useState('1.0.0');
  const [latestVersion, setLatestVersion] = useState('1.0.0');
  const [updateInfo, setUpdateInfo] = useState<any>(null);
  const [showChangelog, setShowChangelog] = useState(false);
  
  // Check for updates
  useEffect(() => {
    const checkForUpdates = async () => {
      // Current app version
      const appVersion = '1.0.0';
      setCurrentVersion(appVersion);
      
      // Check if user has dismissed this update
      const installedVersion = localStorage.getItem('installedAppVersion') || '1.0.0';
      
      try {
        // Fetch update info from updates.json
        const response = await fetch('/updates.json');
        const updateData = await response.json();
        
        setLatestVersion(updateData.latestVersion);
        setUpdateInfo(updateData);
        
        // Check if there's a new version available that hasn't been installed
        if (updateData.latestVersion !== installedVersion) {
          setUpdateAvailable(true);
        }
      } catch (error) {
        console.log('Could not check for updates');
      }
    };
    
    checkForUpdates();
  }, []);
  
  // Load real kids from localStorage
  useEffect(() => {
    const loadKids = () => {
      const savedKids = localStorage.getItem('kidAccounts');
      if (savedKids) {
        try {
          const kidAccounts = JSON.parse(savedKids);
          
          const kidsWithProgress = kidAccounts.map((kid: any) => {
            // CRITICAL VALIDATION: Check if kid name exceeds limits
            if (kid.name && kid.name.length > 1000) {
              console.error('🚨 CRITICAL: Kid name exceeds 1000 characters - CRASHING APP');
              const shortName = kid.name.substring(0, 30);
              
              // Remove this kid from localStorage permanently
              const filteredKids = kidAccounts.filter((k: any) => k.kidId !== kid.kidId);
              localStorage.setItem('kidAccounts', JSON.stringify(filteredKids));
              
              // CRASH THE APP
              setCrashed(true);
              setCrashReason(`Name was removed because it was too long: "${shortName}..." (${kid.name.length} characters)`);
              
              throw new Error('APP CRASHED: Name exceeds 1000 characters');
            }
            
            // Get individual kid's progress data
          const progressKey = `progress_${kid.kidId}`;
          const streakKey = `streak_${kid.kidId}`;
          const progressData = JSON.parse(localStorage.getItem(progressKey) || '{}');
          const streakData = JSON.parse(localStorage.getItem(streakKey) || '{"currentStreak":0,"longestStreak":0,"totalDaysActive":0}');
          
          return {
            id: kid.kidId,
            name: kid.name,
            progress: progressData.overallProgress || 0,
            lessonsCompleted: progressData.lessonsCompleted || 0,
            achievements: progressData.achievements || 0,
            streakDays: streakData.currentStreak || 0,
            lastActive: progressData.lastActive || kid.createdAt
          };
        }).filter((kid: any) => kid !== null);
        
        setKids(kidsWithProgress);
        
        } catch (error) {
          console.error('App crashed:', error);
        }
      }
    };
    
    loadKids();
    // Refresh every 5 seconds to catch updates
    const interval = setInterval(loadKids, 5000);
    return () => clearInterval(interval);
  }, []);
  const [showAddKid, setShowAddKid] = useState(false);
  const [newKidId, setNewKidId] = useState("");

  // Show crash screen if app crashed
  if (crashed) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Error: App Crashed</h1>
          <p className="text-gray-600 mb-2">Please reload the page</p>
          <p className="text-sm text-gray-500 mt-4">{crashReason}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  const handleAddKid = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newKidId.trim().length > 1000) {
      alert('🚨 CRITICAL ERROR: Text exceeds maximum limit! App will crash if you continue.');
      throw new Error('Text length exceeds 1000 characters - preventing app crash');
    }
    
    if (newKidId.trim().length > 200) {
      alert('❌ Error: Kid ID too large! Please use a shorter ID (max 200 characters).');
      return;
    }
    
    if (newKidId.trim()) {
      // Extract name from ID (everything except last 6 digits)
      const nameMatch = newKidId.match(/^(.+?)(\d{6})$/);
      if (nameMatch) {
        const kidName = nameMatch[1];
        
        // Validate extracted kid name length
        if (kidName.length > 1000) {
          alert('🚨 CRITICAL ERROR: Name in Kid ID exceeds 1000 characters! This will crash the app!');
          setNewKidId("");
          setShowAddKid(false);
          throw new Error('Kid name exceeds 1000 characters - app crash prevented');
        }
        
        if (kidName.length > 200) {
          alert('⚠️ Warning: Kid name is too long! Please use a Kid ID with a shorter name (max 200 characters).');
          setNewKidId("");
          return;
        }
        
        const newKid: Kid = {
          id: newKidId,
          name: kidName,
          progress: Math.floor(Math.random() * 100),
          lessonsCompleted: Math.floor(Math.random() * 20),
          achievements: Math.floor(Math.random() * 15)
        };
        setKids([...kids, newKid]);
        setNewKidId("");
        setShowAddKid(false);
        alert(`${kidName} has been added to your family!`);
      } else {
        alert("Invalid Kid ID format. Please check and try again.");
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4 sm:p-8 animate-gradient">
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 15s ease infinite;
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto">
        {/* Update Notification Banner */}
        {updateAvailable && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-3xl shadow-2xl p-6 mb-6 border-4 border-white/50">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-center sm:text-left">
                  <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 justify-center sm:justify-start">
                    🎉 New Update Available!
                  </h2>
                  <p className="text-white/90 mt-2 font-semibold">
                    Version {latestVersion} • Released {updateInfo?.releaseDate}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowChangelog(!showChangelog)}
                    className="bg-white/20 text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all font-bold hover:scale-105 border-2 border-white/40"
                  >
                    📋 {showChangelog ? 'Hide' : 'View'} Changes
                  </button>
                  <button
                    onClick={() => {
                      // Mark this version as installed
                      localStorage.setItem('installedAppVersion', latestVersion);
                      alert('🎉 Update installed successfully!\n\nThe app is now up to date!');
                      setUpdateAvailable(false);
                    }}
                    className="bg-white text-green-600 px-8 py-4 rounded-xl hover:shadow-2xl transition-all font-bold text-lg hover:scale-105"
                  >
                    ⬇️ Install Now
                  </button>
                </div>
              </div>
              
              {/* Changelog */}
              {showChangelog && updateInfo?.changelog && (
                <div className="mt-4 bg-white/10 backdrop-blur rounded-2xl p-6 border-2 border-white/20">
                  <h3 className="text-xl font-bold mb-4">📝 What&apos;s New in {latestVersion}</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {Object.entries(updateInfo.changelog).map(([category, items]: [string, any]) => (
                      <div key={category} className="bg-white/10 rounded-xl p-4">
                        <h4 className="font-bold text-lg mb-2">{category}</h4>
                        <ul className="space-y-1">
                          {items.map((item: string, index: number) => (
                            <li key={index} className="text-sm text-white/90">• {item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Header */}
        <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-6 sm:p-8 mb-6 border-4 border-white/50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                👨‍👩‍👧‍👦 Parent Dashboard
              </h1>
              <p className="text-gray-700 mt-2 font-semibold text-lg">Monitor your family&apos;s learning progress 📊</p>
            </div>
            <Link 
              href="/"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-xl transition-all font-bold hover:scale-105"
            >
              ← Home
            </Link>
          </div>
        </div>

        {/* Add New Kid Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddKid(!showAddKid)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-8 rounded-2xl hover:shadow-2xl transition-all font-bold text-lg hover:scale-105 shadow-lg"
          >
            + Add New Kid to Family ✨
          </button>
        </div>

        {/* Add Kid Form */}
        {showAddKid && (
          <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-6 sm:p-8 mb-6 border-4 border-purple-300">
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">Add New Kid 🎓</h2>
            <form onSubmit={handleAddKid} className="flex gap-4">
              <input
                type="text"
                required
                value={newKidId}
                onChange={(e) => setNewKidId(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter Kid ID (e.g., Emma789012)"
                maxLength={1000}
              />
              {newKidId.length > 200 && (
                <p className="text-xs text-orange-600">⚠️ Warning: ID is long ({newKidId.length} characters)</p>
              )}
              <button
                type="submit"
                className="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
              >
                Add Kid
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddKid(false);
                  setNewKidId("");
                }}
                className="bg-gray-300 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        {/* Leaderboard Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-amber-600 mb-6">🏆 Family Leaderboard</h2>
          
          {kids.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Add kids to see the leaderboard!
            </p>
          ) : (
            <div className="space-y-3">
              {[...kids]
                .sort((a, b) => b.progress - a.progress)
                .map((kid, index) => (
                  <div
                    key={kid.id}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      index === 0
                        ? "bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-300"
                        : index === 1
                        ? "bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-gray-300"
                        : index === 2
                        ? "bg-gradient-to-r from-orange-100 to-amber-100 border-2 border-orange-300"
                        : "bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold w-8">
                        {index === 0 && "🥇"}
                        {index === 1 && "🥈"}
                        {index === 2 && "🥉"}
                        {index > 2 && `#${index + 1}`}
                      </div>
                      <div>
                        <p className="font-bold text-lg text-gray-800">{kid.name}</p>
                        <p className="text-sm text-gray-600">
                          {kid.lessonsCompleted} lessons • {kid.achievements} achievements
                        </p>
                        {kid.streakDays !== undefined && kid.streakDays > 0 && (
                          <p className="text-xs text-orange-600 font-semibold">
                            🔥 {kid.streakDays} day streak!
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-indigo-600">{kid.progress}%</p>
                      <p className="text-xs text-gray-500">progress</p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Your Family Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-indigo-600 mb-6">Your Family</h2>
          
          {kids.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No kids added yet. Click &quot;Add New Kid to Family&quot; to get started!
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {kids.map((kid) => (
                <div
                  key={kid.id}
                  className="border-2 border-purple-200 rounded-xl p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-50 to-pink-50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-purple-700">{kid.name}</h3>
                    <span className="text-2xl">🎓</span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Overall Progress</span>
                      <span className="font-semibold text-purple-600">{kid.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all"
                        style={{ width: `${kid.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">📚 Lessons:</span>
                      <span className="font-semibold">{kid.lessonsCompleted}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">🏆 Achievements:</span>
                      <span className="font-semibold">{kid.achievements}</span>
                    </div>
                    {kid.streakDays !== undefined && kid.streakDays > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">🔥 Streak:</span>
                        <span className="font-semibold text-orange-600">{kid.streakDays} days</span>
                      </div>
                    )}
                    {kid.lastActive && (
                      <div className="text-xs text-gray-500 mt-2">
                        Last active: {new Date(kid.lastActive).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric'
                        })}
                      </div>
                    )}
                  </div>

                  <Link 
                    href={`/parent/kid-details?id=${kid.id}&name=${kid.name}&progress=${kid.progress}`}
                    className="block w-full mt-4 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-semibold text-center"
                  >
                    View Details
                  </Link>

                  <p className="text-xs text-gray-400 mt-2 text-center">ID: {kid.id}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
