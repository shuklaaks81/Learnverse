/**
 * Parent Dashboard Page
 * 
 * Complex admin interface for parent account management with:
 * - Update notification system with changelog viewing
 * - Add new kid to family functionality
 * - Family leaderboard (sorted by progress %)
 * - Individual kid cards with detailed stats
 * - Admin terminal for debugging/commands
 * - Real-time kid data loading from localStorage
 * 
 * State Management:
 * - Loads kidAccounts array from localStorage
 * - Tracks update availability and version info
 * - Manages terminal commands (dev/admin only)
 * 
 * Note: This page is 718 lines. Consider further component extraction:
 * - UpdateNotificationBanner (extracted ✓)
 * - KidsLeaderboard (extracted ✓)
 * - FamilyCardsGrid (extracted ✓)
 * - AdminTerminal (pending)
 * - DashboardHeader (pending)
 * - AddKidForm (pending)
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { UpdateNotificationBanner } from "./components/UpdateNotificationBanner";
import { KidsLeaderboard } from "./components/KidsLeaderboard";
import { FamilyCardsGrid } from "./components/FamilyCardsGrid";

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
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    '🖥️ Parent Terminal v1.0',
    'Type "help" for available commands',
    ''
  ]);
  
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
        if (!response.ok) throw new Error('Failed to fetch updates.json');
        const updateData = await response.json();

        setLatestVersion(updateData.latestVersion);
        setUpdateInfo(updateData);
        setUpdateError(null);

        // Check if there's a new version available that hasn't been installed
        if (updateData.latestVersion !== installedVersion) {
          setUpdateAvailable(true);
        }
      } catch (error: any) {
        setUpdateError('Could not load updates. Please check updates.json or your connection.');
        setUpdateInfo(null);
        setUpdateAvailable(false);
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
          // Defensive: filter out duplicate kidIds
          const seenIds = new Set();
          let duplicateFound = false;
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
            // Defensive: skip duplicate kidIds
            if (seenIds.has(kid.kidId)) {
              duplicateFound = true;
              return null;
            }
            seenIds.add(kid.kidId);
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
          setDuplicateWarning(duplicateFound);
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

  // Terminal command processor
  const processCommand = (cmd: string) => {
    const fullCommand = cmd.trim();
    const parts = fullCommand.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);
    const output: string[] = [...terminalHistory, `> ${cmd}`];

    switch (command) {
      case 'help':
        output.push('📚 Available Commands:');
        output.push('  stats    - Show app statistics');
        output.push('  kids     - List all registered kids');
        output.push('  logs     - View recent activity');
        output.push('  clear    - Clear terminal');
        output.push('');
        output.push('🛠️ Feature Creation (Custom Commands):');
        output.push('  add button at <location> display <text> page <url> color <color>');
        output.push('  add board at <location> page <url> color <color> drawable <state>');
        output.push('  add feature <name> at <location> type <type>');
        output.push('');
        output.push('📝 Examples:');
        output.push('  add button at "top right" display "My Feature!" page "/kid/custom" color "blue"');
        output.push('  add board at "corner" page "/kid/draw" color "white" drawable "always"');
        output.push('  add feature "music player" at "bottom" type "audio"');
        break;
      
      case 'stats':
        const totalKids = kids.length;
        const totalLessons = kids.reduce((sum, kid) => sum + kid.lessonsCompleted, 0);
        const totalAchievements = kids.reduce((sum, kid) => sum + kid.achievements, 0);
        const avgProgress = totalKids > 0 ? Math.round(kids.reduce((sum, kid) => sum + kid.progress, 0) / totalKids) : 0;
        output.push('📊 App Statistics:');
        output.push(`  Total Kids: ${totalKids}`);
        output.push(`  Total Lessons Completed: ${totalLessons}`);
        output.push(`  Total Achievements: ${totalAchievements}`);
        output.push(`  Average Progress: ${avgProgress}%`);
        output.push(`  App Version: ${currentVersion}`);
        break;
      
      case 'kids':
        if (kids.length === 0) {
          output.push('⚠️ No kids registered yet');
        } else {
          output.push(`👥 Registered Kids (${kids.length}):`);
          kids.forEach((kid, index) => {
            output.push(`  ${index + 1}. ${kid.name}`);
            output.push(`     Progress: ${kid.progress}% | Lessons: ${kid.lessonsCompleted} | Streak: ${kid.streakDays} days`);
          });
        }
        break;
      
      case 'logs':
        output.push('📜 Recent Activity:');
        output.push(`  Last update check: ${new Date().toLocaleTimeString()}`);
        output.push(`  Current version: ${currentVersion}`);
        output.push(`  Latest version: ${latestVersion}`);
        output.push(`  Update available: ${updateAvailable ? 'Yes' : 'No'}`);
        break;
      
      case 'add':
        if (args.length === 0) {
          output.push('❌ Error: Missing arguments');
          output.push('Usage: add button/board/feature ...');
          output.push('Type "help" for examples');
          break;
        }

        const featureType = args[0].toLowerCase();
        const fullArgs = args.join(' ');

        // Parse command arguments
        const parseArg = (key: string) => {
          const match = fullArgs.match(new RegExp(`${key}\\s+"([^"]+)"|${key}\\s+(\\S+)`, 'i'));
          return match ? (match[1] || match[2]) : null;
        };

        const location = parseArg('at') || 'top right';
        const displayText = parseArg('display') || 'New Feature!';
        const pageUrl = parseArg('page') || '/kid/custom';
        const color = parseArg('color') || 'blue';
        const drawable = parseArg('drawable') || 'true';
        const featureName = parseArg('feature') || args[1] || 'Custom Feature';
        const type = parseArg('type') || 'button';

        if (featureType === 'button') {
          output.push(`🔘 Creating button feature...`);
          output.push(`  ✓ Location: ${location}`);
          output.push(`  ✓ Display text: "${displayText}"`);
          output.push(`  ✓ Page URL: ${pageUrl}`);
          output.push(`  ✓ Color: ${color}`);
          output.push('');
          output.push('✨ Button created successfully!');
          
          // Store custom button in localStorage
          const customFeatures = JSON.parse(localStorage.getItem('customFeatures') || '[]');
          customFeatures.push({
            type: 'button',
            location,
            displayText,
            pageUrl,
            color,
            id: `button_${Date.now()}`
          });
          localStorage.setItem('customFeatures', JSON.stringify(customFeatures));
          
        } else if (featureType === 'board') {
          output.push(`🎨 Creating drawing board feature...`);
          output.push(`  ✓ Location: ${location}`);
          output.push(`  ✓ Page URL: ${pageUrl}`);
          output.push(`  ✓ Board color: ${color}`);
          output.push(`  ✓ Drawable state: ${drawable}`);
          output.push('');
          output.push('✨ Drawing board created successfully!');
          
          // Store custom board in localStorage
          const customFeatures = JSON.parse(localStorage.getItem('customFeatures') || '[]');
          customFeatures.push({
            type: 'board',
            location,
            pageUrl,
            color,
            drawable,
            id: `board_${Date.now()}`
          });
          localStorage.setItem('customFeatures', JSON.stringify(customFeatures));
          
        } else if (featureType === 'feature') {
          output.push(`⭐ Creating custom feature...`);
          output.push(`  ✓ Name: ${featureName}`);
          output.push(`  ✓ Location: ${location}`);
          output.push(`  ✓ Type: ${type}`);
          output.push('');
          output.push('✨ Custom feature created successfully!');
          
          // Store custom feature in localStorage
          const customFeatures = JSON.parse(localStorage.getItem('customFeatures') || '[]');
          customFeatures.push({
            type: 'custom',
            name: featureName,
            location,
            featureType: type,
            id: `feature_${Date.now()}`
          });
          localStorage.setItem('customFeatures', JSON.stringify(customFeatures));
          
        } else {
          output.push(`❌ Unknown feature type: "${featureType}"`);
          output.push('Supported types: button, board, feature');
        }
        break;
      
      case 'clear':
        setTerminalHistory(['🖥️ Parent Terminal v1.0', 'Type "help" for available commands', '']);
        setTerminalInput('');
        return;
      
      case '':
        return;
      
      default:
        output.push(`❌ Unknown command: "${cmd}"`);
        output.push('Type "help" for available commands');
    }

    output.push('');
    setTerminalHistory(output);
    setTerminalInput('');
  };

  // State for duplicate warning
  const [duplicateWarning, setDuplicateWarning] = useState(false);
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
        <UpdateNotificationBanner 
          latestVersion={latestVersion}
          currentVersion={currentVersion}
          updateInfo={updateInfo}
          showChangelog={showChangelog}
          onToggleChangelog={() => setShowChangelog(!showChangelog)}
          onInstall={() => {
            localStorage.setItem('installedAppVersion', latestVersion);
            setCurrentVersion(latestVersion);
            setUpdateAvailable(false);
            alert('🎉 Update installed successfully!\n\nThe app is now up to date!');
          }}
        />
        
        {/* Header */}
        <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-6 sm:p-8 mb-6 border-4 border-white/50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                👨‍👩‍👧‍👦 Parent Dashboard
              </h1>
              <p className="text-gray-700 mt-2 font-semibold text-lg">Monitor your family&apos;s learning progress 📊</p>
            </div>
            <div className="flex gap-3">
              <Link 
                href="/"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-xl transition-all font-bold hover:scale-105"
              >
                ← Home
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem('parentLoggedIn');
                  window.location.href = '/parent/login';
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Permanent What's New / Changelog Section */}
        <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 rounded-3xl shadow-2xl p-6 sm:p-8 mb-10 border-2 border-cyan-200">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6 flex items-center gap-3">
            <span className="text-4xl">🎉</span> What's New in {latestVersion}
          </h2>
          {updateError && (
            <div className="bg-red-100 border border-red-400 text-red-700 font-bold p-4 rounded-2xl mb-4">
              ⚠️ {updateError}
            </div>
          )}
          {updateInfo?.changelog ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {Object.entries(updateInfo.changelog).map(([category, items]: [string, any]) => (
                <div key={category} className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-blue-100 shadow-md hover:shadow-lg transition-all hover:scale-105 transform">
                  <h4 className="font-bold text-lg mb-3 text-blue-700 flex items-center gap-2">
                    <span className="text-2xl">
                      {category.includes('Features') ? '✨' : category.includes('Bug') ? '🐛' : category.includes('Improvement') ? '⚡' : '📌'}
                    </span>
                    {category}
                  </h4>
                  <ul className="space-y-2">
                    {items.map((item: string, index: number) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-green-500 font-bold mt-0.5">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : !updateError ? (
            <div className="text-gray-600 text-center py-4">No updates found.</div>
          ) : null}
        </div>

        {/* Add New Kid Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowAddKid(!showAddKid)}
            className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white py-4 px-8 rounded-2xl shadow-2xl transition-all font-bold text-lg hover:scale-105 transform"
          >
            <span className="text-2xl mr-2">➕</span> Add New Kid to Family <span className="text-2xl ml-2">✨</span>
          </button>
        </div>

        {/* Add Kid Form */}
        {showAddKid && (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 backdrop-blur rounded-3xl shadow-2xl p-6 sm:p-8 mb-8 border-2 border-purple-200 animate-slideInDown">
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 flex items-center gap-2">
              <span className="text-4xl">🎓</span> Add New Kid
            </h2>
            <form onSubmit={handleAddKid} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  required
                  value={newKidId}
                  onChange={(e) => setNewKidId(e.target.value)}
                  className="w-full px-5 py-3 border-2 border-purple-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 font-semibold transition-all"
                  placeholder="Enter Kid ID (e.g., Emma789012)"
                  maxLength={1000}
                />
                {newKidId.length > 0 && (
                  <p className={`text-xs mt-2 font-semibold ${newKidId.length > 200 ? 'text-orange-600' : 'text-green-600'}`}>
                    {newKidId.length > 200 
                      ? `⚠️ ID is long (${newKidId.length} characters)` 
                      : `✓ ID length: ${newKidId.length}`}
                  </p>
                )}
              </div>
              <div className="flex gap-3 sm:flex-col lg:flex-row">
                <button
                  type="submit"
                  className="flex-1 sm:flex-none bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 px-8 rounded-2xl transition-all font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Add Kid ✓
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddKid(false);
                    setNewKidId("");
                  }}
                  className="flex-1 sm:flex-none bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 px-8 rounded-2xl transition-all font-bold shadow-md hover:shadow-lg"
                >
                  Cancel ✕
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Duplicate Key Warning */}
        {duplicateWarning && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Warning:</strong> Duplicate Kid IDs detected. Some kids may not display correctly. Please ensure each Kid ID is unique.
          </div>
        )}

        {/* Leaderboard Section */}
        <KidsLeaderboard kids={kids} />

        {/* Your Family Section */}
        <FamilyCardsGrid kids={kids} />

        {/* Terminal Section */}
        <div className="mt-8">
          <button
            onClick={() => setShowTerminal(!showTerminal)}
            className="w-full bg-gray-900 text-green-400 p-4 rounded-t-2xl font-mono font-bold text-xl hover:bg-gray-800 transition-all flex items-center justify-between border-4 border-gray-700"
          >
            <span>🖥️ Admin Terminal</span>
            <span>{showTerminal ? '▼' : '▶'}</span>
          </button>
          
          {showTerminal && (
            <div className="bg-gray-900 border-4 border-t-0 border-gray-700 rounded-b-2xl p-6 font-mono">
              {/* Terminal Output */}
              <div className="bg-black rounded-xl p-4 mb-4 h-96 overflow-y-auto">
                {terminalHistory.map((line, index) => (
                  <div key={index} className="text-green-400 text-sm mb-1">
                    {line}
                  </div>
                ))}
              </div>
              
              {/* Terminal Input */}
              <div className="flex gap-2">
                <span className="text-green-400">$</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      processCommand(terminalInput);
                    }
                  }}
                  className="flex-1 bg-transparent text-green-400 outline-none font-mono"
                  placeholder="Type a command..."
                  autoComplete="off"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
