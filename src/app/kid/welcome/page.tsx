"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function KidWelcome() {
  const router = useRouter();
  const [hasAccount, setHasAccount] = useState<boolean | null>(null);
  const [kidId, setKidId] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!kidId.trim()) {
      alert("Please enter your Kid ID!");
      return;
    }

    // Check if kid exists
    const savedKids = JSON.parse(localStorage.getItem('kidAccounts') || '[]');
    const foundKid = savedKids.find((k: any) => k.kidId === kidId);
    
    if (foundKid) {
      localStorage.setItem('currentKid', JSON.stringify(foundKid));
      alert(`Welcome back, ${foundKid.name}! 🎉`);
      router.push('/kid/lessons');
    } else {
      alert("Kid ID not found! Please check and try again.");
    }
  };

  const handleCreateNew = () => {
    // Clear any previous setup data before starting new account creation
    localStorage.removeItem('selectedDesign');
    localStorage.removeItem('buddyDrawing');
    localStorage.removeItem('buddyVoice');
    router.push('/kid/choose-design');
  };

  if (hasAccount === null) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 animate-gradient">
        <style jsx>{`
          @keyframes gradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          .animate-gradient {
            background-size: 200% 200%;
            animation: gradient 10s ease infinite;
          }
        `}</style>

        <div className="w-full max-w-4xl bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8 sm:p-16 border-4 border-white/60">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent animate-pulse">
            🎓 Welcome! ✨
          </h1>
          <p className="text-center text-gray-700 mb-12 font-bold text-2xl sm:text-3xl">
            Do you already have a Kid Account? 🤔
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            <button
              onClick={() => setHasAccount(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-8 px-8 rounded-3xl hover:shadow-2xl transition-all font-bold text-2xl sm:text-3xl hover:scale-105 shadow-lg"
            >
              ✅ Yes, I Have an Account!
            </button>
            
            <button
              onClick={() => setHasAccount(false)}
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white py-8 px-8 rounded-3xl hover:shadow-2xl transition-all font-bold text-2xl sm:text-3xl hover:scale-105 shadow-lg animate-pulse"
            >
              ✨ No, Create New Account!
            </button>
          </div>

          <div className="mt-8 text-center">
            <Link href="/" className="text-gray-600 hover:text-gray-800 font-semibold text-lg">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (hasAccount) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 animate-gradient">
        <style jsx>{`
          @keyframes gradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          .animate-gradient {
            background-size: 200% 200%;
            animation: gradient 10s ease infinite;
          }
        `}</style>

        <div className="w-full max-w-4xl bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8 sm:p-16 border-4 border-white/60">
          <h1 className="text-5xl sm:text-6xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
            🔑 Login with Kid ID
          </h1>
          <p className="text-center text-gray-700 mb-8 font-semibold text-xl">
            Enter your Kid ID to continue! 🚀
          </p>

          <form onSubmit={handleLogin} className="max-w-2xl mx-auto">
            <input
              type="text"
              required
              value={kidId}
              onChange={(e) => setKidId(e.target.value)}
              className="w-full px-8 py-6 text-2xl text-center border-4 border-purple-300 rounded-2xl focus:ring-4 focus:ring-purple-500 focus:border-transparent mb-6 font-bold"
              placeholder="Enter your Kid ID"
            />
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white py-6 px-8 rounded-2xl hover:shadow-2xl transition-all font-bold text-2xl hover:scale-105 shadow-lg"
            >
              🚀 Login!
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => setHasAccount(null)}
              className="text-purple-600 hover:text-purple-700 font-bold text-lg underline"
            >
              ← Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Create new account - redirect to design chooser
  handleCreateNew();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400">
      <p className="text-white text-3xl font-bold">Loading... ✨</p>
    </div>
  );
}
