"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NameSetup() {
  const router = useRouter();
  const [kidName, setKidName] = useState("");
  const [hasFamilyName, setHasFamilyName] = useState<boolean | null>(null);
  const [familyName, setFamilyName] = useState("");
  const [showFamilyInput, setShowFamilyInput] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!kidName.trim()) {
      alert("Please enter your name!");
      return;
    }

    if (kidName.length > 200) {
      alert('❌ Name is too long! Please use a shorter name (max 200 characters).');
      return;
    }

    // Generate Kid ID - ensure it's unique
    const existingKids = JSON.parse(localStorage.getItem('kidAccounts') || '[]');
    let generatedId = '';
    let isUnique = false;
    
    // Keep generating until we get a unique ID
    while (!isUnique) {
      const uniqueNumber = Math.floor(100000 + Math.random() * 900000);
      // Add timestamp for extra uniqueness
      generatedId = kidName.trim() + uniqueNumber + Date.now();
      // Check if this ID already exists
      isUnique = !existingKids.some((kid: any) => kid.kidId === generatedId);
    }

    // Get saved setup data
    const design = localStorage.getItem('selectedDesign') || '1';
    const drawing = localStorage.getItem('buddyDrawing') || '';
    const voice = localStorage.getItem('buddyVoice') || 'default';

    // Create kid account
    const kidAccount = {
      name: kidName.trim(),
      kidId: generatedId,
      familyName: familyName.trim() || null,
      design: design,
      buddyDrawing: drawing,
      buddyVoice: voice,
      createdAt: new Date().toISOString()
    };

    // Save to kid accounts
    existingKids.push(kidAccount);
    localStorage.setItem('kidAccounts', JSON.stringify(existingKids));
    localStorage.setItem('currentKid', JSON.stringify(kidAccount));

    // Clear temporary setup data so it doesn't carry over to next account
    localStorage.removeItem('selectedDesign');
    localStorage.removeItem('buddyDrawing');
    localStorage.removeItem('buddyVoice');

    // Show Kid ID
    alert(`🎉 Account Created!\n\nYour Kid ID is:\n${generatedId}\n\nWrite this down to login later!`);
    
    router.push('/kid/lessons');
  };

  if (hasFamilyName === null) {
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

        <div className="w-full max-w-5xl bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8 sm:p-16 border-4 border-white/60">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
            👨‍👩‍👧‍👦 Family Name? ✨
          </h1>
          <p className="text-center text-gray-700 mb-12 font-bold text-2xl sm:text-3xl">
            Do you have a Family Name from your parent? 🏠
          </p>

          <div className="grid sm:grid-cols-2 gap-8">
            <button
              onClick={() => {
                setHasFamilyName(true);
                setShowFamilyInput(true);
              }}
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white py-12 px-8 rounded-3xl hover:shadow-2xl transition-all font-bold text-2xl sm:text-3xl hover:scale-105 shadow-lg"
            >
              ✅ Yes, I Have a Family Name!
            </button>
            
            <button
              onClick={() => setHasFamilyName(false)}
              className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-12 px-8 rounded-3xl hover:shadow-2xl transition-all font-bold text-2xl sm:text-3xl hover:scale-105 shadow-lg"
            >
              ⏭️ Skip This Step
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          ✨ Almost Done! ✨
        </h1>
        <p className="text-center text-gray-700 mb-8 font-bold text-2xl">
          Tell us your name! 🌟
        </p>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
          {showFamilyInput && (
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
              />
            </div>
          )}

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
              maxLength={200}
            />
            {kidName.length > 100 && (
              <p className="text-orange-600 text-center mt-2 font-semibold">
                ⚠️ Name is getting long ({kidName.length} characters)
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white py-6 px-8 rounded-2xl hover:shadow-2xl transition-all font-bold text-3xl hover:scale-105 shadow-lg animate-pulse"
          >
            🚀 Create My Account!
          </button>
        </form>
      </div>
    </div>
  );
}
