"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function KidWelcome() {
  const router = useRouter();
  const [hasAccount, setHasAccount] = useState<boolean | null>(null);
  const [hasFamilyName, setHasFamilyName] = useState<boolean | null>(null);
  const [familyName, setFamilyName] = useState("");
  const [kidName, setKidName] = useState("");
  const [startCreateNew, setStartCreateNew] = useState(false);
  const [askingFamilyName, setAskingFamilyName] = useState(false);

  // Handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyName.trim() || !kidName.trim()) {
      alert("Please enter both Family Name and Your Name!");
      return;
    }
    if (typeof window !== "undefined") {
      const savedKids = JSON.parse(localStorage.getItem('kidAccounts') || '[]');
      const foundKid = savedKids.find((k: any) => 
        k.familyName?.toLowerCase() === familyName.trim().toLowerCase() && 
        k.name.toLowerCase() === kidName.trim().toLowerCase()
      );
      if (foundKid) {
        localStorage.setItem('currentKid', JSON.stringify(foundKid));
        alert(`Welcome back, ${foundKid.name}! 🎉`);
        router.push('/kid/lessons');
      } else {
        alert("Account not found! Please check your Family Name and Name.");
      }
    }
  };

  const handleCreateNew = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem('selectedDesign');
      localStorage.removeItem('buddyDrawing');
      localStorage.removeItem('buddyVoice');
      localStorage.removeItem('tempFamilyName'); // Clear any temp data
    }
    // Show family name question first
    setAskingFamilyName(true);
  };

  const handleFamilyNameChoice = (hasFamily: boolean) => {
    setHasFamilyName(hasFamily);
    if (hasFamily) {
      // They need to enter family name, stay on this screen
    } else {
      // No family name, save that and proceed to design
      localStorage.setItem('tempFamilyName', '');
      setStartCreateNew(true);
    }
  };

  const handleFamilyNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyName.trim()) {
      alert("Please enter your Family Name!");
      return;
    }
    // Save family name temporarily
    localStorage.setItem('tempFamilyName', familyName.trim());
    setStartCreateNew(true);
  };

  // Effects
  useEffect(() => {
    if (startCreateNew) {
      router.push('/kid/choose-design');
    }
  }, [startCreateNew, router]);

  useEffect(() => {
    if (hasAccount === false) {
      handleCreateNew();
    }
  }, [hasAccount]);

  // Render logic
  let content = null;
  
  // FAMILY NAME QUESTION (before design selection)
  if (askingFamilyName && hasFamilyName === null) {
    content = (
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

        <div className="w-full max-w-5xl bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8 sm:p-16 border-4 border-white/60">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
            👨‍👩‍👧‍👦 Family Name? ✨
          </h1>
          <p className="text-center text-gray-700 mb-12 font-bold text-2xl sm:text-3xl">
            Do you have a Family Name from your parent? 🏠
          </p>

          <div className="grid sm:grid-cols-2 gap-8">
            <button
              onClick={() => setHasFamilyName(true)}
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white py-12 px-8 rounded-3xl hover:shadow-2xl transition-all font-bold text-2xl sm:text-3xl hover:scale-105 shadow-lg"
            >
              ✅ Yes, I Have a Family Name!
            </button>
            
            <button
              onClick={() => handleFamilyNameChoice(false)}
              className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-12 px-8 rounded-3xl hover:shadow-2xl transition-all font-bold text-2xl sm:text-3xl hover:scale-105 shadow-lg"
            >
              ⏭️ Skip This Step
            </button>
          </div>
        </div>
      </div>
    );
  } else if (askingFamilyName && hasFamilyName === true) {
    // Enter family name screen
    content = (
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
            👨‍👩‍👧‍👦 Enter Family Name
          </h1>
          <p className="text-center text-gray-700 mb-8 font-bold text-2xl">
            What's your Family Name? 🏠
          </p>

          <form onSubmit={handleFamilyNameSubmit} className="max-w-2xl mx-auto space-y-6">
            <div>
              <label className="block text-2xl font-bold text-gray-800 mb-3 text-center">
                Family Name 👨‍👩‍👧‍👦
              </label>
              <input
                type="text"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                className="w-full px-8 py-6 text-2xl text-center border-4 border-purple-300 rounded-2xl focus:ring-4 focus:ring-purple-500 focus:border-transparent font-bold"
                placeholder="Enter Family Name"
                maxLength={100}
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white py-6 px-8 rounded-2xl hover:shadow-2xl transition-all font-bold text-3xl hover:scale-105 shadow-lg animate-pulse"
            >
              ✨ Continue!
            </button>
          </form>
        </div>
      </div>
    );
  } else if (hasAccount === null) {
    content = (
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
  } else if (hasAccount) {
    content = (
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
            🔑 Login to Your Account
          </h1>
          <p className="text-center text-gray-700 mb-8 font-semibold text-xl">
            Enter your Family Name and Your Name! 🚀
          </p>
          <form onSubmit={handleLogin} className="max-w-2xl mx-auto space-y-6">
            <div>
              <label className="block text-2xl font-bold text-gray-800 mb-3 text-center">
                Family Name 👨‍👩‍👧‍👦
              </label>
              <input
                type="text"
                required
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                className="w-full px-8 py-6 text-2xl text-center border-4 border-purple-300 rounded-2xl focus:ring-4 focus:ring-purple-500 focus:border-transparent font-bold"
                placeholder="Enter Family Name"
              />
            </div>
            <div>
              <label className="block text-2xl font-bold text-gray-800 mb-3 text-center">
                Your Name 🎓
              </label>
              <input
                type="text"
                required
                value={kidName}
                onChange={(e) => setKidName(e.target.value)}
                className="w-full px-8 py-6 text-2xl text-center border-4 border-pink-300 rounded-2xl focus:ring-4 focus:ring-pink-500 focus:border-transparent font-bold"
                placeholder="Enter Your Name"
              />
            </div>
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
  } else if (hasAccount === false) {
    content = (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400">
        <p className="text-white text-3xl font-bold">Loading... ✨</p>
      </div>
    );
  }

  return content;
}
