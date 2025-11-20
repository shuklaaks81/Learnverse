'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OwnerPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Aksgkp81') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password!');
      setPassword('');
    }
  };

  const giveCoins = () => {
    const currentKid = JSON.parse(localStorage.getItem('currentKid') || '{}');
    if (currentKid.kidId) {
      localStorage.setItem(`coins_${currentKid.kidId}`, '100000');
      alert('✅ 100,000 coins added to current account!');
    } else {
      alert('❌ No kid account found. Please create/login first.');
    }
  };

  const activateLegendaryMode = () => {
    localStorage.setItem('legendaryMode', 'true');
    alert('🔮 Legendary Mode Activated! Refresh any page to see the effect.');
  };

  const deactivateLegendaryMode = () => {
    localStorage.setItem('legendaryMode', 'false');
    alert('✅ Legendary Mode Deactivated! Refresh any page.');
  };

  const resetProgress = () => {
    if (confirm('Are you sure you want to reset ALL progress? This cannot be undone!')) {
      localStorage.clear();
      alert('🗑️ All data cleared!');
      router.push('/');
    }
  };

  const exportData = () => {
    const data: Record<string, any> = {};
    
    // Export all localStorage data
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        try {
          data[key] = JSON.parse(localStorage.getItem(key) || '');
        } catch {
          data[key] = localStorage.getItem(key);
        }
      }
    }

    // Create downloadable file
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `learning-app-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert('📥 Data exported successfully!');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-2xl p-8 border-2 border-purple-500">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-3xl font-bold text-purple-400 mb-2">Owner Access</h1>
            <p className="text-gray-400 text-sm">Enter password to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-300 font-semibold mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 text-white border-2 border-purple-500 rounded-xl focus:outline-none focus:border-purple-400"
                placeholder="Enter owner password"
                autoFocus
              />
              {error && <p className="mt-2 text-red-400 text-sm">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all hover:scale-105"
            >
              🔓 Unlock
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-purple-400 hover:text-purple-300 text-sm">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 mb-6 border-2 border-purple-500">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-purple-400">👑 Owner Dashboard</h1>
              <p className="text-gray-400 mt-1">Testing & Development Tools</p>
            </div>
            <Link
              href="/"
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
            >
              🚪 Exit
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 mb-6 border-2 border-purple-500">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">⚡ Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={giveCoins}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg transition-all hover:scale-105"
            >
              💰 Give 100K Coins
            </button>
            <button
              onClick={activateLegendaryMode}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg transition-all hover:scale-105"
            >
              🔮 Activate Legendary Mode
            </button>
            <button
              onClick={deactivateLegendaryMode}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg transition-all hover:scale-105"
            >
              ✨ Deactivate Legendary Mode
            </button>
            <button
              onClick={exportData}
              className="bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg transition-all hover:scale-105"
            >
              📥 Export All Data
            </button>
            <button
              onClick={resetProgress}
              className="bg-gradient-to-r from-red-600 to-red-800 text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg transition-all hover:scale-105 md:col-span-2"
            >
              🗑️ Reset All Progress
            </button>
          </div>
        </div>

        {/* Unused Ideas Section */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 mb-6 border-2 border-purple-500">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">💡 Ideas Not Yet Implemented</h2>
          <div className="space-y-4">
            <div className="bg-gray-700 p-4 rounded-xl border-l-4 border-yellow-500">
              <h3 className="font-bold text-yellow-400 mb-2">🎯 Multiplayer Games</h3>
              <p className="text-gray-300 text-sm">Kids could compete with friends in real-time learning games</p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-xl border-l-4 border-blue-500">
              <h3 className="font-bold text-blue-400 mb-2">📊 Parent Analytics Dashboard</h3>
              <p className="text-gray-300 text-sm">Detailed charts showing learning progress over time</p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-xl border-l-4 border-green-500">
              <h3 className="font-bold text-green-400 mb-2">🏆 Leaderboards</h3>
              <p className="text-gray-300 text-sm">Weekly/monthly leaderboards for top learners</p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-xl border-l-4 border-pink-500">
              <h3 className="font-bold text-pink-400 mb-2">🎨 Buddy Customization Studio</h3>
              <p className="text-gray-300 text-sm">Advanced editor to draw custom buddies with different body shapes, hairstyles, accessories</p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-xl border-l-4 border-purple-500">
              <h3 className="font-bold text-purple-400 mb-2">📚 Lesson Creator Tool</h3>
              <p className="text-gray-300 text-sm">Parents could create custom lessons for their kids</p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-xl border-l-4 border-red-500">
              <h3 className="font-bold text-red-400 mb-2">🎮 VR Learning Mode</h3>
              <p className="text-gray-300 text-sm">Virtual reality lessons for immersive learning</p>
            </div>
          </div>
        </div>

        {/* App Statistics */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 border-2 border-purple-500">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">📊 App Info</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-4">
            <div className="bg-gray-700 p-4 rounded-xl">
              <div className="text-3xl font-bold text-blue-400">20</div>
              <div className="text-gray-400 text-sm mt-1">Lessons</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-xl">
              <div className="text-3xl font-bold text-green-400">6</div>
              <div className="text-gray-400 text-sm mt-1">Games</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-xl">
              <div className="text-3xl font-bold text-yellow-400">12</div>
              <div className="text-gray-400 text-sm mt-1">Achievements</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-xl">
              <div className="text-3xl font-bold text-purple-400">16</div>
              <div className="text-gray-400 text-sm mt-1">Shop Items</div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-gray-700 p-4 rounded-xl">
              <div className="text-3xl font-bold text-cyan-400">🗺️</div>
              <div className="text-gray-400 text-sm mt-1">Progress Map</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-xl">
              <div className="text-3xl font-bold text-pink-400">🔮</div>
              <div className="text-gray-400 text-sm mt-1">Legendary Mode</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-xl">
              <div className="text-3xl font-bold text-orange-400">8</div>
              <div className="text-gray-400 text-sm mt-1">Learning Units</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-xl">
              <div className="text-3xl font-bold text-indigo-400">40</div>
              <div className="text-gray-400 text-sm mt-1">Deep Topics</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
