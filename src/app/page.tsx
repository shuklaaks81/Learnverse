"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-3 sm:p-6 lg:p-8 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 animate-gradient-shift">
      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 15s ease infinite;
        }
      `}</style>
      
      <main className="max-w-4xl w-full bg-white/95 backdrop-blur rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border-4 border-white/50">
        <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-center mb-2 sm:mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent animate-pulse">
          Welcome to Learning App 🎉
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-center text-gray-700 mb-6 sm:mb-8 font-semibold">
          Monitor your child&apos;s progress and build amazing learning adventures! ✨
        </p>
        
        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-12">
                    {/* About the App Option */}
                    <div className="border-4 border-gradient-to-r from-blue-400 to-cyan-500 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-2xl transition-all hover:scale-105 bg-gradient-to-br from-blue-50 to-cyan-50 flex flex-col justify-between">
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-2 sm:mb-3 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">ℹ️ About the App</h2>
                      <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4 font-medium">
                        Learn what makes Learnverse special, how to use it, and discover secret pages! 📖
                      </p>
                      <Link href="/info">
                        <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105">
                          About & Secrets →
                        </button>
                      </Link>
                    </div>
          <div className="border-4 border-gradient-to-r from-indigo-400 to-purple-500 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-2xl transition-all hover:scale-105 bg-gradient-to-br from-indigo-50 to-purple-50">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-2 sm:mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">👨‍👩‍👧‍👦 Parent Account</h2>
            <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4 font-medium">
              Monitor your child&apos;s progress, manage learning content, and set goals 📊
            </p>
            <Link href="/parent/login">
              <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105">
                Parent Login →
              </button>
            </Link>
          </div>
          
          <div className="border-4 border-gradient-to-r from-purple-400 to-pink-500 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-2xl transition-all hover:scale-105 bg-gradient-to-br from-purple-50 to-pink-50">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-2 sm:mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">🎓 Kid Account</h2>
            <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4 font-medium">
              Learn through fun activities, earn rewards, and track achievements! 🌟
            </p>
            <div className="space-y-2">
              <Link href="/kid/login">
                <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105">
                  Login with Kid ID 🔑
                </button>
              </Link>
              <Link href="/kid">
                <button className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white py-3 px-4 rounded-xl hover:from-pink-600 hover:to-orange-600 transition-all font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 animate-pulse">
                  Create New Account ✨
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
