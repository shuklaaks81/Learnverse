'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TeacherPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [teacherName, setTeacherName] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const teacher = localStorage.getItem('teacherLoggedIn');
      if (teacher) {
        const teacherData = JSON.parse(teacher);
        setIsLoggedIn(true);
        setTeacherName(teacherData.name);
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple demo login (in real app, you'd verify credentials)
    if (loginEmail && loginPassword) {
      const teacherData = {
        name: loginEmail.split('@')[0],
        email: loginEmail
      };
      localStorage.setItem('teacherLoggedIn', JSON.stringify(teacherData));
      setIsLoggedIn(true);
      setTeacherName(teacherData.name);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('teacherLoggedIn');
    setIsLoggedIn(false);
    setTeacherName('');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-10 max-w-md w-full shadow-2xl border-4 border-white/50">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
              👩‍🏫 Teacher Portal
            </h1>
            <p className="text-gray-600 text-lg">Manage your classroom with Learnverse</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">📧 Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-indigo-300 focus:border-indigo-600 focus:outline-none transition-colors"
                placeholder="teacher@school.edu"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">🔒 Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-indigo-300 focus:border-indigo-600 focus:outline-none transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xl py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg"
            >
              🚀 Login to Dashboard
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-indigo-600 hover:text-indigo-800 font-semibold">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 mb-8 shadow-xl border-2 border-indigo-200">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              👩‍🏫 Teacher Dashboard
            </h1>
            <p className="text-gray-600 text-lg mt-1">Welcome back, {teacherName}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-3 rounded-xl transition-all transform hover:scale-105"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
          <div className="text-5xl mb-2">👨‍🎓</div>
          <div className="text-3xl font-bold">24</div>
          <div className="text-blue-100">Total Students</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
          <div className="text-5xl mb-2">✅</div>
          <div className="text-3xl font-bold">156</div>
          <div className="text-green-100">Lessons Completed</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
          <div className="text-5xl mb-2">🏆</div>
          <div className="text-3xl font-bold">89%</div>
          <div className="text-purple-100">Avg Achievement</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
          <div className="text-5xl mb-2">📚</div>
          <div className="text-3xl font-bold">12</div>
          <div className="text-orange-100">Active Assignments</div>
        </div>
      </div>

      {/* Main Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Student Progress */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border-2 border-blue-200 hover:shadow-2xl transition-shadow">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">📊 Student Progress</h2>
          <div className="space-y-3">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Alex Johnson</span>
                <span className="text-green-600 font-bold">95%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full" style={{ width: '95%' }} />
              </div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Sarah Lee</span>
                <span className="text-green-600 font-bold">88%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full" style={{ width: '88%' }} />
              </div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Mike Chen</span>
                <span className="text-yellow-600 font-bold">72%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-3 rounded-full" style={{ width: '72%' }} />
              </div>
            </div>
          </div>
          <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all">
            View All Students
          </button>
        </div>

        {/* Create Assignment */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border-2 border-purple-200 hover:shadow-2xl transition-shadow">
          <h2 className="text-2xl font-bold text-purple-600 mb-4">📝 Create Assignment</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Assignment Title</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-xl border-2 border-purple-300 focus:border-purple-600 focus:outline-none"
                placeholder="Math Quiz Chapter 5"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Due Date</label>
              <input
                type="date"
                className="w-full px-4 py-2 rounded-xl border-2 border-purple-300 focus:border-purple-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Subject</label>
              <select className="w-full px-4 py-2 rounded-xl border-2 border-purple-300 focus:border-purple-600 focus:outline-none">
                <option>Math</option>
                <option>Science</option>
                <option>English</option>
                <option>History</option>
              </select>
            </div>
          </div>
          <button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all">
            🚀 Create Assignment
          </button>
        </div>

        {/* Class Analytics */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border-2 border-green-200 hover:shadow-2xl transition-shadow">
          <h2 className="text-2xl font-bold text-green-600 mb-4">📈 Class Analytics</h2>
          <div className="space-y-4">
            <div className="bg-green-50 rounded-xl p-4">
              <div className="text-3xl mb-2">🔥</div>
              <div className="text-2xl font-bold text-green-700">7 Days</div>
              <div className="text-gray-600">Average Streak</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <div className="text-3xl mb-2">⭐</div>
              <div className="text-2xl font-bold text-green-700">1,247</div>
              <div className="text-gray-600">Total Coins Earned</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-2xl font-bold text-green-700">92%</div>
              <div className="text-gray-600">Class Average</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border-2 border-orange-200 hover:shadow-2xl transition-shadow">
          <h2 className="text-2xl font-bold text-orange-600 mb-4">🔔 Recent Activity</h2>
          <div className="space-y-3">
            <div className="bg-orange-50 rounded-xl p-3 border-l-4 border-orange-500">
              <div className="font-semibold">Alex completed Math Quiz</div>
              <div className="text-sm text-gray-600">2 minutes ago</div>
            </div>
            <div className="bg-orange-50 rounded-xl p-3 border-l-4 border-orange-500">
              <div className="font-semibold">Sarah started Science lesson</div>
              <div className="text-sm text-gray-600">15 minutes ago</div>
            </div>
            <div className="bg-orange-50 rounded-xl p-3 border-l-4 border-orange-500">
              <div className="font-semibold">Mike earned 50 coins</div>
              <div className="text-sm text-gray-600">1 hour ago</div>
            </div>
            <div className="bg-orange-50 rounded-xl p-3 border-l-4 border-orange-500">
              <div className="font-semibold">Emily achieved new badge</div>
              <div className="text-sm text-gray-600">2 hours ago</div>
            </div>
          </div>
        </div>

        {/* Award Coins */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border-2 border-yellow-200 hover:shadow-2xl transition-shadow">
          <h2 className="text-2xl font-bold text-yellow-600 mb-4">💰 Award Coins</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Select Student</label>
              <select className="w-full px-4 py-2 rounded-xl border-2 border-yellow-300 focus:border-yellow-600 focus:outline-none">
                <option>Alex Johnson</option>
                <option>Sarah Lee</option>
                <option>Mike Chen</option>
                <option>Emily Davis</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Coins Amount</label>
              <input
                type="number"
                className="w-full px-4 py-2 rounded-xl border-2 border-yellow-300 focus:border-yellow-600 focus:outline-none"
                placeholder="50"
                min="1"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Reason</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-xl border-2 border-yellow-300 focus:border-yellow-600 focus:outline-none"
                placeholder="Great participation!"
              />
            </div>
          </div>
          <button className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-xl transition-all">
            🎁 Award Coins
          </button>
        </div>

        {/* Lesson Plans */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border-2 border-pink-200 hover:shadow-2xl transition-shadow">
          <h2 className="text-2xl font-bold text-pink-600 mb-4">📚 Lesson Plans</h2>
          <div className="space-y-3">
            <div className="bg-pink-50 rounded-xl p-4 hover:bg-pink-100 cursor-pointer transition-colors">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-bold text-lg">Algebra Basics</div>
                  <div className="text-sm text-gray-600">Math • Week 1</div>
                </div>
                <div className="text-2xl">📐</div>
              </div>
            </div>
            <div className="bg-pink-50 rounded-xl p-4 hover:bg-pink-100 cursor-pointer transition-colors">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-bold text-lg">The Water Cycle</div>
                  <div className="text-sm text-gray-600">Science • Week 2</div>
                </div>
                <div className="text-2xl">🌊</div>
              </div>
            </div>
            <div className="bg-pink-50 rounded-xl p-4 hover:bg-pink-100 cursor-pointer transition-colors">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-bold text-lg">Ancient Egypt</div>
                  <div className="text-sm text-gray-600">History • Week 3</div>
                </div>
                <div className="text-2xl">🏛️</div>
              </div>
            </div>
          </div>
          <button className="w-full mt-4 bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-xl transition-all">
            + Create New Plan
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-gray-600">
        <p className="text-sm">💡 <strong>Pro Tip:</strong> Learnverse helps students learn while having fun! Monitor progress in real-time.</p>
      </div>
    </div>
  );
}
