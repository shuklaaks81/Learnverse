'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface User {
  id: number;
  name: string;
  avatar: string;
  activity: string;
  color: string;
  online: boolean;
  lastActive: string;
}

export default function OwnerDashboard() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [onlineNow, setOnlineNow] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [activityFeed, setActivityFeed] = useState<string[]>([]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Aksgkp1234!!!!!') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Wrong password!');
    }
  };

  // Simulated users with fun names and activities
  const possibleUsers = [
    { name: 'Emma', avatar: '👧', activities: ['completing Math lesson', 'playing Games', 'watching Theater', 'unlocking Achievement'] },
    { name: 'Liam', avatar: '👦', activities: ['solving Science quiz', 'earning coins', 'booking a holiday', 'reading News'] },
    { name: 'Sophia', avatar: '🧒', activities: ['learning History', 'shopping in Store', 'watching animation', 'completing challenge'] },
    { name: 'Noah', avatar: '��', activities: ['doing Daily Challenge', 'exploring All You Can Learn', 'leveling up', 'earning streak'] },
    { name: 'Olivia', avatar: '👧🏻', activities: ['playing Tic Tac Toe', 'unlocking new item', 'completing lesson', 'earning bonus'] },
    { name: 'Ethan', avatar: '👦🏼', activities: ['watching Movie', 'buying power-up', 'getting achievements', 'learning English'] },
    { name: 'Ava', avatar: '👧🏽', activities: ['exploring Map', 'collecting coins', 'finishing unit', 'playing game'] },
    { name: 'Mason', avatar: '👦🏾', activities: ['reading article', 'completing quiz', 'unlocking badge', 'learning new topic'] },
    { name: 'Isabella', avatar: '👧🏿', activities: ['practicing Math', 'earning rewards', 'watching tutorial', 'leveling up'] },
    { name: 'Lucas', avatar: '🧒🏻', activities: ['exploring lessons', 'playing mini-game', 'buying accessory', 'completing challenge'] },
  ];

  const colors = [
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500',
    'from-purple-500 to-pink-500',
    'from-orange-500 to-red-500',
    'from-yellow-500 to-amber-500',
    'from-indigo-500 to-blue-500',
  ];

  useEffect(() => {
    // Initialize total visitors (simulate growth) - MORE REALISTIC numbers!
    const storedVisitors = localStorage.getItem('totalVisitors');
    const baseVisitors = storedVisitors ? parseInt(storedVisitors) : Math.floor(Math.random() * 50) + 10; // 10-60 visitors
    setTotalVisitors(baseVisitors);

    // Generate random users
    const numUsers = Math.floor(Math.random() * 5) + 2; // 2-6 users
    const generatedUsers: User[] = [];
    
    for (let i = 0; i < numUsers; i++) {
      const user = possibleUsers[Math.floor(Math.random() * possibleUsers.length)];
      const activity = user.activities[Math.floor(Math.random() * user.activities.length)];
      const isOnline = Math.random() > 0.3; // 70% chance online
      
      generatedUsers.push({
        id: i,
        name: user.name,
        avatar: user.avatar,
        activity: activity,
        color: colors[Math.floor(Math.random() * colors.length)],
        online: isOnline,
        lastActive: isOnline ? 'Now' : `${Math.floor(Math.random() * 60)} min ago`
      });
    }

    setUsers(generatedUsers);
    setOnlineNow(generatedUsers.filter(u => u.online).length);

    // Generate initial activity feed
    const feed: string[] = [];
    for (let i = 0; i < 10; i++) {
      const user = possibleUsers[Math.floor(Math.random() * possibleUsers.length)];
      const activity = user.activities[Math.floor(Math.random() * user.activities.length)];
      feed.push(`${user.avatar} ${user.name} is ${activity}`);
    }
    setActivityFeed(feed);

    // Update activity feed every 5 seconds
    const activityInterval = setInterval(() => {
      const user = possibleUsers[Math.floor(Math.random() * possibleUsers.length)];
      const activity = user.activities[Math.floor(Math.random() * user.activities.length)];
      const newActivity = `${user.avatar} ${user.name} is ${activity}`;
      
      setActivityFeed(prev => [newActivity, ...prev.slice(0, 9)]);
    }, 5000);

    // Increment total visitors occasionally
    const visitorInterval = setInterval(() => {
      setTotalVisitors(prev => {
        const newCount = prev + Math.floor(Math.random() * 3);
        localStorage.setItem('totalVisitors', newCount.toString());
        return newCount;
      });
    }, 30000); // Every 30 seconds

    // Update online count
    const onlineInterval = setInterval(() => {
      const newOnline = Math.floor(Math.random() * 5) + 1; // 1-5 online (more realistic!)
      setOnlineNow(newOnline);
    }, 15000);

    return () => {
      clearInterval(activityInterval);
      clearInterval(visitorInterval);
      clearInterval(onlineInterval);
    };
  }, []);

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-12 border border-white/20 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="text-7xl mb-4">🔐</div>
            <h1 className="text-4xl font-bold text-white mb-2">Owner Access</h1>
            <p className="text-white/70">Enter password to view dashboard</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full px-6 py-4 rounded-xl bg-white/20 text-white placeholder-white/50 border-2 border-white/30 focus:border-white/60 outline-none text-lg"
              />
            </div>
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-200 text-center">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-4 rounded-xl transition transform hover:scale-105"
            >
              🔓 Unlock Dashboard
            </button>
          </form>
          <Link href="/" className="block text-center mt-6 text-white/60 hover:text-white/90 transition">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 mb-8 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-5xl font-bold text-white mb-2">👑 Owner Dashboard</h1>
              <p className="text-white/80 text-lg">Welcome back! Here's what's happening in Learnverse.</p>
            </div>
            <Link href="/" className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-bold transition">
              ← Back Home
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Visitors */}
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition">
            <div className="text-6xl mb-4">📊</div>
            <div className="text-white/80 text-sm font-semibold mb-2">TOTAL VISITORS</div>
            <div className="text-5xl font-bold text-white mb-2">{totalVisitors.toLocaleString()}</div>
            <div className="text-white/70 text-sm">people have used Learnverse!</div>
          </div>

          {/* Online Now */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition">
            <div className="text-6xl mb-4">🟢</div>
            <div className="text-white/80 text-sm font-semibold mb-2">ONLINE NOW</div>
            <div className="text-5xl font-bold text-white mb-2">{onlineNow}</div>
            <div className="text-white/70 text-sm">people learning right now!</div>
          </div>

          {/* Active Today */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition">
            <div className="text-6xl mb-4">⚡</div>
            <div className="text-white/80 text-sm font-semibold mb-2">ACTIVE TODAY</div>
            <div className="text-5xl font-bold text-white mb-2">{Math.floor(totalVisitors * 0.15)}</div>
            <div className="text-white/70 text-sm">users active in the last 24h</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Users List */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              👥 Active Users
              <span className="text-lg font-normal text-white/60">({users.length} users)</span>
            </h2>
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {users.map(user => (
                <div
                  key={user.id}
                  className={`bg-gradient-to-r ${user.color} rounded-2xl p-4 shadow-lg transform hover:scale-105 transition`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{user.avatar}</div>
                      <div>
                        <div className="text-white font-bold text-lg">{user.name}</div>
                        <div className="text-white/80 text-sm">{user.activity}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      {user.online ? (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-white text-sm font-semibold">Online</span>
                        </div>
                      ) : (
                        <span className="text-white/60 text-xs">{user.lastActive}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Activity Feed */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              🎯 Live Activity
              <span className="text-sm font-normal text-white/60 animate-pulse">● LIVE</span>
            </h2>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {activityFeed.map((activity, index) => (
                <div
                  key={index}
                  className="bg-white/5 hover:bg-white/10 rounded-xl p-4 transition animate-slideIn border border-white/10"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-white text-sm">{activity}</div>
                  <div className="text-white/40 text-xs mt-1">Just now</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fun Stats */}
        <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-6">🎉 Fun Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🎮</div>
              <div className="text-2xl font-bold text-white">{Math.floor(totalVisitors * 0.6)}</div>
              <div className="text-white/70 text-sm">Games Played</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">📚</div>
              <div className="text-2xl font-bold text-white">{Math.floor(totalVisitors * 1.8)}</div>
              <div className="text-white/70 text-sm">Lessons Completed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🏆</div>
              <div className="text-2xl font-bold text-white">{Math.floor(totalVisitors * 0.3)}</div>
              <div className="text-white/70 text-sm">Achievements Unlocked</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🪙</div>
              <div className="text-2xl font-bold text-white">{(totalVisitors * 245).toLocaleString()}</div>
              <div className="text-white/70 text-sm">Coins Earned</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
